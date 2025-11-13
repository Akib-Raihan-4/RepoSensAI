// src/server/pullCommits.ts
import { db } from "@/server/db";
import { Octokit } from "octokit";
import axios from "axios";
import { aiSummarizeCommit } from "./gemini";
import type { Prisma } from "@prisma/client";
import type { CommitResponse, GitHubCommit } from "@/types/github.types";

export const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

/* -------------------------------------------------------------------------- */
/* 1. Get the *exact* 10 newest commits from GitHub (sorted newest → oldest)  */
/* -------------------------------------------------------------------------- */
export const getCommitHashes = async (
  githubUrl: string,
): Promise<CommitResponse[]> => {
  const [, , , owner, repo] = githubUrl.split("/");
  if (!owner || !repo) throw new Error("Invalid GitHub URL format");

  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
    per_page: 10,
  });

  return (data as GitHubCommit[])
    .sort(
      (a, b) =>
        new Date(b.commit.author?.date ?? 0).getTime() -
        new Date(a.commit.author?.date ?? 0).getTime(),
    )
    .map((c) => ({
      commitHash: c.sha,
      commitMessage: c.commit.message,
      commitAuthorName: c.commit.author?.name ?? "Unknown",
      commitAuthorAvatar: c.author?.avatar_url ?? "",
      commitDate: c.commit.author?.date ?? "",
    }));
};

/* -------------------------------------------------------------------------- */
/* 2. Pull only *new* commits – never insert duplicates                     */
/* -------------------------------------------------------------------------- */
export const pullCommits = async (
  projectId: string,
): Promise<{ count: number; skipped: boolean }> => {
  const { githubUrl } = await fetchProjectGithubUrl(projectId);

  /* ---- 2.1 Latest commit already in DB? → exit fast ------------------- */
  const latestDb = await db.commit.findFirst({
    where: { projectId },
    orderBy: { commitDate: "desc" },
    select: { commitHash: true, commitDate: true },
  });

  const githubCommits = await getCommitHashes(githubUrl);

  // No new commits?
  if (
    latestDb &&
    githubCommits[0] &&
    githubCommits[0].commitHash === latestDb.commitHash
  ) {
    return { count: 0, skipped: true };
  }

  /* ---- 2.2 Filter out already-processed hashes ----------------------- */
  const unprocessed = await filterUnprocessedCommits(projectId, githubCommits);
  if (unprocessed.length === 0) return { count: 0, skipped: true };

  /* ---- 2.3 Summarize in parallel (with fallback) ---------------------- */
  const summaryResults = await Promise.allSettled(
    unprocessed.map((c) => summarizeCommitPatch(githubUrl, c.commitHash)),
  );

  const summaries = summaryResults.map((r) =>
    r.status === "fulfilled" ? r.value : "Summary failed – see logs.",
  );

  /* ---- 2.4 Build payload (sorted by commitDate) ----------------------- */
  const payload: Prisma.CommitCreateManyInput[] = unprocessed
    .sort(
      (a, b) =>
        new Date(b.commitDate).getTime() - new Date(a.commitDate).getTime(),
    )
    .map((c, i) => ({
      projectId,
      commitHash: c.commitHash,
      commitMessage: c.commitMessage,
      commitAuthorName: c.commitAuthorName,
      commitAuthorAvatar: c.commitAuthorAvatar,
      commitDate: new Date(c.commitDate), // Prisma expects Date
      summary: summaries[i],
    }));

  /* ---- 2.5 Insert – skip any rows that violate the unique index ------- */
  const result = await db.commit.createMany({
    data: payload,
    skipDuplicates: true, // crucial!
  });

  return { count: result.count, skipped: false };
};

/* -------------------------------------------------------------------------- */
/* 3. Helper: fetch the project’s GitHub URL                                 */
/* -------------------------------------------------------------------------- */
async function fetchProjectGithubUrl(projectId: string) {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { githubUrl: true },
  });
  if (!project?.githubUrl) throw new Error("Project has no GitHub URL");
  return { githubUrl: project.githubUrl };
}

/* -------------------------------------------------------------------------- */
/* 4. Helper: filter out already-stored commit hashes                       */
/* -------------------------------------------------------------------------- */
async function filterUnprocessedCommits(
  projectId: string,
  commits: CommitResponse[],
): Promise<CommitResponse[]> {
  const stored = await db.commit.findMany({
    where: { projectId },
    select: { commitHash: true },
  });
  const storedSet = new Set(stored.map((s) => s.commitHash));
  return commits.filter((c) => !storedSet.has(c.commitHash));
}

/* -------------------------------------------------------------------------- */
/* 5. Helper: fetch **patch** (unified diff) – much cleaner for Gemini       */
/* -------------------------------------------------------------------------- */
const MAX_DIFF_CHARS = 20_000; // safe for gemini-1.5-flash
async function summarizeCommitPatch(
  githubUrl: string,
  commitHash: string,
): Promise<string> {
  try {
    const { data } = await axios.get<string>(
      `${githubUrl}/commit/${commitHash}.patch`,
      {
        headers: { Accept: "application/vnd.github.v3.patch" },
        timeout: 12_000,
      },
    );

    const diff =
      data.length > MAX_DIFF_CHARS
        ? data.slice(0, MAX_DIFF_CHARS) + "\n\n... [truncated]"
        : data;

    return await aiSummarizeCommit(diff);
  } catch (err) {
    console.error(`Patch fetch failed for ${commitHash}:`, err);
    return "Summary unavailable – diff could not be retrieved.";
  }
}

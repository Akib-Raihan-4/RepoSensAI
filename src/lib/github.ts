import { db } from "@/server/db";
import { Octokit } from "octokit";
import axios from "axios";
import { aiSummarizeCommit } from "./gemini";
import type { Prisma } from "@prisma/client";
import type { CommitResponse, GitHubCommit } from "@/types/github.types";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export const getCommitHashes = async (
  githubUrl: string,
): Promise<CommitResponse[]> => {
  const urlParts = githubUrl.split("/");
  const owner = urlParts[3];
  const repo = urlParts[4];

  if (!owner || !repo) {
    throw new Error("Invalid GitHub URL format");
  }

  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
    per_page: 10,
  });

  const commits = data as GitHubCommit[];

  return commits
    .sort(
      (a, b) =>
        new Date(b.commit.author?.date ?? 0).getTime() -
        new Date(a.commit.author?.date ?? 0).getTime(),
    )
    .map((commit) => ({
      commitHash: commit.sha,
      commitMessage: commit.commit.message,
      commitAuthorName: commit.commit.author?.name ?? "Unknown",
      commitAuthorAvatar: commit.author?.avatar_url ?? "",
      commitDate: commit.commit.author?.date ?? "",
    }));
};

export const pullCommits = async (
  projectId: string,
): Promise<Prisma.BatchPayload> => {
  const { githubUrl } = await fetchProjectGithubUrl(projectId);
  const commitHashes = await getCommitHashes(githubUrl);
  const unprocessedCommits = await filterUnprocessedCommits(
    projectId,
    commitHashes,
  );

  const summaryResults = await Promise.allSettled(
    unprocessedCommits.map((commit) =>
      summarizeCommit(githubUrl, commit.commitHash),
    ),
  );

  const summaries = summaryResults.map((result) =>
    result.status === "fulfilled" ? result.value : "",
  );

  const commitData: Prisma.CommitCreateManyInput[] = unprocessedCommits.map(
    (commit, index) => ({
      projectId,
      commitHash: commit.commitHash,
      commitMessage: commit.commitMessage,
      commitAuthorName: commit.commitAuthorName,
      commitAuthorAvatar: commit.commitAuthorAvatar,
      commitDate: commit.commitDate,
      summary: summaries[index],
    }),
  );

  return await db.commit.createMany({
    data: commitData,
  });
};

async function summarizeCommit(
  githubUrl: string,
  commitHash: string,
): Promise<string> {
  const { data } = await axios.get<string>(
    `${githubUrl}/commit/${commitHash}.diff`,
    {
      headers: {
        Accept: "application/vnd.github.v3.diff",
      },
    },
  );

  return (await aiSummarizeCommit(data)) ?? "";
}

async function fetchProjectGithubUrl(projectId: string) {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { githubUrl: true },
  });

  if (!project?.githubUrl) {
    throw new Error("Project has no GitHub URL");
  }

  return { project, githubUrl: project.githubUrl };
}

async function filterUnprocessedCommits(
  projectId: string,
  commits: CommitResponse[],
): Promise<CommitResponse[]> {
  const processed = await db.commit.findMany({
    where: { projectId },
    select: { commitHash: true },
  });

  const processedHashes = new Set(processed.map((c) => c.commitHash));

  return commits.filter((commit) => !processedHashes.has(commit.commitHash));
}

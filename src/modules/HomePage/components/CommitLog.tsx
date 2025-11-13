"use client";

import useProjects from "@/hooks/use-project";
import { api } from "@/trpc/react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default function CommitLog() {
  const { projectId, project } = useProjects();
  const { data: commits } = api.project.getCommits.useQuery({ projectId });

  return (
    <div className="relative">
      <div className="absolute top-0 bottom-0 left-4 w-px bg-gradient-to-b to-transparent" />

      <ul className="space-y-6">
        {commits?.map((commit, commitIdx) => {
          const isLast = commitIdx === commits.length - 1;

          return (
            <li key={commit.id} className="group relative">
              <div className="group">
                <div className="mb-3 flex gap-3">
                  <img
                    src={commit.commitAuthorAvatar || "/placeholder.svg"}
                    alt={commit.commitAuthorName}
                    className="ring-border group-hover:ring-primary/50 h-8 w-8 flex-none rounded-full ring-2 transition-all duration-300"
                  />
                  <div className="flex-1">
                    <Link
                      href={`${project?.githubUrl}/commits/${commit.commitHash}`}
                      target="_blank"
                      className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors duration-200"
                    >
                      <span className="font-medium">
                        {commit.commitAuthorName}
                      </span>
                      <span className="text-xs">committed</span>
                      <ExternalLink className="h-3.5 w-3.5 opacity-60 transition-opacity hover:opacity-100" />
                    </Link>
                  </div>
                </div>

                <div className="bg-card border-border group-hover:border-primary/30 rounded-lg border p-4 transition-all duration-300 group-hover:shadow-sm">
                  <h3 className="text-card-foreground mb-2 text-sm leading-relaxed font-semibold">
                    {commit.commitMessage}
                  </h3>
                  {commit.summary && (
                    <pre className="text-muted-foreground font-mono text-xs leading-relaxed break-words whitespace-pre-wrap opacity-75 transition-opacity duration-300 group-hover:opacity-100">
                      {commit.summary}
                    </pre>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

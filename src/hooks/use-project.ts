import { api } from "@/trpc/react";
import { useLocalStorage } from "usehooks-ts";

export default function useProjects() {
  const { data: projects } = api.project.getAll.useQuery();
  const [projectId, setProjectId] = useLocalStorage("repoSenAi-projectId", " ");
  const project = projects?.find((project) => project.id === projectId);

  return { projects, project, setProjectId, projectId };
}

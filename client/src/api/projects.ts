import { Project, ProjectSchema, ProjectsSchema } from "@schema/project.schema";
import { fetchApi } from "./api";

export type GetFilters = {
  limits: number;
  page?: number;
};

export const getProjects = async () => {
  try {
    const r = await fetchApi<Project[]>("/project");
    const validatedData = ProjectsSchema.parse(r);
    return validatedData;
  } catch (error) {
    console.error(error);
  }
};

export async function getProjectById(projectId: string) {
  try {
    const r = await fetchApi<Project>(`/project/${projectId}`);
    const validatedData = ProjectSchema.parse(r);
    return validatedData;
  } catch (error) {
    console.error(error);
  }
}

export async function editProject(
  projectId: string,
  title: string,
  description: string,
  production_url: string,
  github_url: string,
  image_url: string,
  video_url: string
) {
  try {
    const r = await fetchApi<Project>(`/project/${projectId}`, {
      payload: {
        title,
        description,
        production_url,
        github_url,
        image_url,
        video_url,
      },
      method: "PATCH",
    });
    const validatedData = ProjectSchema.parse(r);
    return validatedData;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteProject(projectId: string) {
  try {
    await fetchApi(`/project/${projectId}`, { method: "DELETE" });
  } catch (error) {
    console.error(error);
  }
}

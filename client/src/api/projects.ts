import { fetchApi } from "./api";

export async function getProjects(){
  try{
    await fetchApi<ProjectsResponse>("/project")
      .then(ProjectsResponseSchema.parse);
  } catch(error) {
    console.error(error);
  }
}

export async function getProjectById(projectId: string){
  try{
    await fetchApi<Project>(`/project/${projectId}`)
      .then(ProjectSchema.parse);
  } catch(error) {
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
  try{
    await fetchApi<Project>(`/project/${projectId}`, {
      payload: {
        title, 
        description, 
        production_url, 
        github_url, 
        image_url, 
        video_url 
      },
      method: "PATCH"
    }
  ).then(ProjectSchema.parse);
  } catch(error) {
    console.error(error);
  }
}

export async function deleteProject(projectId: string) {
  try{
    await fetchApi(`/project/${projectId}`);
  } catch(error){
    console.error(error);
  }
}

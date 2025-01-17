import { getProjects } from "@/api/projects";
import { Loading } from "@/components/Loading";
import { NavBar } from "@/components/NavBar";

import { useQuery } from "react-query";

export default function Project() {
  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <div>Failed to load projects</div>;
  }

  return (
    <div className="relative">
      <NavBar />
      <div className="container mx-auto flex min-h-screen flex-col p-4 pt-6 md:p-6 lg:p-12">
        <h1>Project</h1>
        <ul className="mx-auto flex w-1/2 flex-col">
          {projects
            ? projects.map((project) => (
                <div className="font-mono">
                  <li key={project.id}>{project.title}</li>
                  <li key={project.id}>{project.github_url}</li>
                  <li key={project.id}>{project.project_status_id}</li>
                  <li key={project.id}>{project.createdAt}</li>
                </div>
              ))
            : "No projects found"}
        </ul>
      </div>
    </div>
  );
}

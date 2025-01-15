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
    <div>
      <NavBar />
      <h1>Project</h1>
      <ul className="mx-auto flex w-1/2 flex-col">
        {projects
          ? projects.map((project) => (
              <li key={project.id}>{project.title}</li>
            ))
          : "No projects found"}
      </ul> 
    </div>
  );
}

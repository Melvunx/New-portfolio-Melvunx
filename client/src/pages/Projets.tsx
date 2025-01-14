export default function Project(){

  
  
  return(
    <div>
      <h1>All Projects</h1>
        {
          projects.map((project) => (
            <Project key={project.id} project={project}>
          ));
        }
    <div/>
    )
}

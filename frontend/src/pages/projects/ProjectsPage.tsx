import { ProjectList, ProjectsSideBar } from "../../components/projects";

const ProjectsPage = () => (
  <main className="flex items-center min-w-[76rem] h-[100vh]">
    <ProjectsSideBar />
    <ProjectList />
  </main>
);

export default ProjectsPage;

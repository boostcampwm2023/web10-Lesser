import { Link } from "react-router-dom";
import { ROUTER_URL } from "../../constants/path";

const ProjectsPage = () => {
  return (
    <div>
      this is ProjectsPage
      <Link to={ROUTER_URL.TEMP} />
    </div>
  );
};

export default ProjectsPage;

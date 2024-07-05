import { Link } from "react-router-dom";

interface TabButtonProps {
  title: string;
  active: boolean;
  link: string;
}

const TabButton = ({ title, active, link }: TabButtonProps) => (
  <Link to={link}>
    <span className={`${active ? "text-middle-green" : "text-text-gray"}`}>
      {title}
    </span>
  </Link>
);

export default TabButton;

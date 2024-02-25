import { useEffect } from "react";
import { Link } from "react-router-dom";

const TempHomepage = () => {
  useEffect(() => {
    fetch("/test").then(async (response) => {
      console.log(await response.json());
    });
  });
  return (
    <div>
      <h1 className="text-xl">임시 페이지</h1>
      <ul>
        <li>
          <Link to={"/login"} className="hover:underline">
            Log in
          </Link>
        </li>
        <li>
          <Link to={"/signup"} className="hover:underline">
            Sign up
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default TempHomepage;

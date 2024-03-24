import { useEffect } from "react";
import { Link } from "react-router-dom";
import React from "react";
import { ROUTER_URL } from "../constants/path";

const TempHomepage = () => {
  console.log("실행중");
  useEffect(() => {
    fetch("/test").then(async (response) => {
      console.log(await response.json());
    });
  });
  return (
    <div>
      <div className="shadow-box bg-white mb-[40px]">
        <h1 className="text-xl">임시 페이지</h1>
      </div>
      <ul>
        <li>
          <Link to={ROUTER_URL.LOGIN} className="hover:underline">
            Log in
          </Link>
        </li>
        <li>
          <Link to={ROUTER_URL.SIGNUP} className="hover:underline">
            Sign up
          </Link>
        </li>
        <li>
          <Link to={"/throw-error"} className="hover:underline">
            에러를 던져봅시다!
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default React.memo(TempHomepage);

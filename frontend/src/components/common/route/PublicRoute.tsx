import { useEffect, useState } from "react";
import checkAuthentication from "../../../utils/route/checkAuthentication";
import RouteLoading from "./RouteLoading";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTER_URL } from "../../../constants/path";

const PublicRoute = () => {
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [authenticated, setAuthenticated] = useState<Boolean>(false);

  useEffect(() => {
    checkAuthentication().then((result) => {
      if (result === true) {
        setIsLoading(true);
        setAuthenticated(true);
      } else {
        setIsLoading(true);
        setAuthenticated(false);
      }
    });
  }, [checkAuthentication]);

  return !isLoading ? (
    <RouteLoading />
  ) : !authenticated ? (
    <Outlet />
  ) : (
    <Navigate to={ROUTER_URL.PROJECTS} />
  );
};

export default PublicRoute;

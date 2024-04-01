import { useEffect, useState } from "react";
import checkAuthentication from "../../../utils/route/checkAuthentication";
import RouteLoading from "./RouteLoading";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTER_URL } from "../../../constants/path";

const PublicRoute = () => {
  const [loadingState, setLoadingState] = useState<Boolean>(true);
  const [authenticated, setAuthenticated] = useState<Boolean>(false);

  useEffect(() => {
    checkAuthentication().then((result) => {
      if (result === true) {
        setLoadingState(false);
        setAuthenticated(true);
      } else {
        setLoadingState(false);
        setAuthenticated(false);
      }
    });
  }, [checkAuthentication]);

  return loadingState ? (
    <RouteLoading />
  ) : !authenticated ? (
    <Outlet />
  ) : (
    <Navigate to={ROUTER_URL.PROJECTS} />
  );
};

export default PublicRoute;

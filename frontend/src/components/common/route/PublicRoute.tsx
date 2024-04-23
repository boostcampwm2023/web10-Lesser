import { useEffect, useState } from "react";
import checkAuthentication from "../../../utils/route/checkAuthentication";
import RouteLoading from "./RouteLoading";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTER_URL } from "../../../constants/path";
import { SESSION_STORAGE_KEY } from "../../../constants/storageKey";

const PublicRoute = () => {
  const [loadingState, setLoadingState] = useState<boolean>(true);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const redirectURL = sessionStorage.getItem(SESSION_STORAGE_KEY.REDIRECT);

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
  });

  return loadingState ? (
    <RouteLoading />
  ) : !authenticated ? (
    <Outlet />
  ) : (
    <Navigate to={redirectURL ? redirectURL : ROUTER_URL.PROJECTS} />
  );
};

export default PublicRoute;

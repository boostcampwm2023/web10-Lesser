import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import checkAuthentication from "../../../utils/route/checkAuthentication";
import { useErrorBoundary } from "react-error-boundary";
import RouteLoading from "./RouteLoading";

const PrivateRoute = (): React.ReactElement => {
  const [loadingState, setLoadingState] = useState<Boolean>(true);
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    checkAuthentication().then((result: Boolean | unknown) => {
      if (result === true) {
        setLoadingState(false);
      } else {
        showBoundary(result);
      }
    });
  });

  return loadingState ? <RouteLoading /> : <Outlet />;
};

export default PrivateRoute;

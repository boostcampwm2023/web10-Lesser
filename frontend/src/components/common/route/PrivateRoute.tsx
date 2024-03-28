import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import checkAuthentication from "../../../utils/route/checkAuthentication";
import { useErrorBoundary } from "react-error-boundary";
import RouteLoading from "./RouteLoading";

const PrivateRoute = (): React.ReactElement => {
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    checkAuthentication().then((result: Boolean | unknown) => {
      if (result === true) {
        setIsLoading(false);
      } else {
        showBoundary(result);
      }
    });
  }, [checkAuthentication]);

  return isLoading ? <RouteLoading /> : <Outlet />;
};

export default PrivateRoute;

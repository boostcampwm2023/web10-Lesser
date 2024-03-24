import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import checkAuthentication from "../../../utils/checkAuthentication";
import { useErrorBoundary } from "react-error-boundary";
import RouteLoading from "./RouteLoading";

const PrivateRoute = (): React.ReactElement => {
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const { showBoundary } = useErrorBoundary();

  useEffect(() => {
    checkAuthentication().then((result: Boolean | unknown) => {
      if (result === true) {
        setIsLoading(true);
      } else {
        showBoundary(result);
      }
    });
  }, [checkAuthentication]);

  return isLoading ? <Outlet /> : <RouteLoading />;
};

export default PrivateRoute;

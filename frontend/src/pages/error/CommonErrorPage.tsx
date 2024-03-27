import { FallbackProps } from "react-error-boundary";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "../../constants/path";

const ErrorPage = ({ error, resetErrorBoundary }: FallbackProps) => {
  const navigate = useNavigate();
  const redirectTempPage = () => {
    resetErrorBoundary();
    navigate(ROUTER_URL.TEMP);
  };
  return (
    <div>
      <p>Error 발생</p>
      <p>error : {error.message}</p>
      <p onClick={redirectTempPage}>Temp Page로 이동</p>
    </div>
  );
};

export default ErrorPage;

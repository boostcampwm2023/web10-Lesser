import { FallbackProps } from "react-error-boundary";
import { useNavigate } from "react-router-dom";
import { ROUTER_URL } from "../../constants/path";

const NotPermittedPage = ({ error, resetErrorBoundary }: FallbackProps) => {
  const navigate = useNavigate();
  const redirectTempPage = () => {
    resetErrorBoundary();
    navigate(ROUTER_URL.TEMP);
  };
  return (
    <div>
      <p>Error 발생</p>
      <p>error : {error.message}</p>
      <button onClick={redirectTempPage} className="hover:underline">
        Temp Page로 이동
      </button>
    </div>
  );
};

export default NotPermittedPage;

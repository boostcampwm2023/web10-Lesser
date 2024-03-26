import { FallbackProps } from "react-error-boundary";
import { ROUTER_URL } from "../../constants/path";
import { useNavigate } from "react-router-dom";

const AuthErrorPage = ({ resetErrorBoundary }: FallbackProps) => {
  const navigate = useNavigate();
  const redirectLoginPage = () => {
    resetErrorBoundary();
    navigate(ROUTER_URL.LOGIN);
  };
  return (
    <div className="w-[100vw] h-[100vh] flex flex-col justify-center items-center">
      <p>재로그인이 필요합니다.</p>
      <button className="bg-text-gray text-dark-gray w-fit h-fit" onClick={redirectLoginPage}>
        다시 로그인하러 가기
      </button>
    </div>
  );
};

export default AuthErrorPage;

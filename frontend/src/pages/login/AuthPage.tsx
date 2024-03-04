import { useSearchParams } from "react-router-dom";
import { postAuthCode } from "../../apis/api/loginAPI";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  if (!code) {
    return <div>Login 에러</div>;
  }
  postAuthCode(code);
  return <div>Login 중</div>;
};

export default AuthPage;

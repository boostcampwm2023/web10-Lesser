import { useSearchParams } from "react-router-dom";
import { postAuthCode } from "../../apis/api/loginAPI";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");

  const isLocal = window.location.pathname.split("/").pop() == "local";
  if (isLocal) {
    window.location.href = `http://localhost:5173/auth/github/callback?code=${code}`;
    return;
  }

  if (!code) {
    return <div>Login 에러</div>;
  }
  postAuthCode(code);
  return <div>Login 중</div>;
};

export default AuthPage;

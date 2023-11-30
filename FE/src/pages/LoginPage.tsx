import GithubLogin from '../assets/icons/GithubLogin';
import LesserTextLogo from '../assets/icons/LesserTextLogo';
import loginImage from '../assets/images/login-image.png';
import useLogin from '../hooks/useLogin';

const LoginPage = () => {
  const { code, handleLoginButtonClick } = useLogin();

  return (
    <div className="flex h-screen min-w-[95rem]">
      <div className="flex items-center justify-center w-1/2 bg-true-white">
        <img className="w-[38rem] h-[38rem]" src={loginImage} alt="로그인하는 레서" />
      </div>
      <div className="flex flex-col items-center justify-center w-1/2 bg-cool-neutral">
        <LesserTextLogo width={272} height={72} color="#006241" />
        <p className="mt-5 mb-16 text-2xl font-medium">적고 쉽고 애자일하게 일하자</p>
        <p className="mt-2 mb-3 text-base font-bold">GitHub 로그인</p>
        <button onClick={handleLoginButtonClick}>
          <GithubLogin />
        </button>
      </div>
      {code && <div className="absolute w-full h-full bg-white/[0.4] "></div>}
    </div>
  );
};

export default LoginPage;

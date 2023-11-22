import { useNavigate } from 'react-router-dom';
import GithubLogin from '../assets/icons/GithubLogin';
import LesserTextLogo from '../assets/icons/LesserTextLogo';
import loginImage from '../assets/images/login-image.png';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-full">
      <div className="flex items-center justify-center w-1/2">
        <img className="w-10/12 h-10/12" src={loginImage} alt="로그인하는 레서" />
      </div>
      <div className="flex flex-col items-center justify-center w-1/2 bg-cool-neutral">
        <LesserTextLogo width={256} height={56} color="#006241" />
        <p className="mt-5 mb-16 text-2xl font-medium">적고 쉽고 애자일하게 일하자</p>
        <p className="mt-2 mb-3 text-base font-bold">GitHub 로그인</p>
        <button onClick={() => navigate('/backlog')}>
          <GithubLogin />
        </button>
      </div>
    </div>
  );
};

export default LoginPage;

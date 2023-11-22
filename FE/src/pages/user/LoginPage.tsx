import GithubLogin from '../../assets/icons/GithubLogin';
import LesserTextLogo from '../../assets/icons/LesserTextLogo';
import loginImage from '../../assets/images/login-image.png';

const LoginPage = () => (
  <div>
    <img src={loginImage} alt="로그인하는 레서" />
    <div>
      <LesserTextLogo width={256} height={56} color="#006241" />
      <p>적고 쉽고 애자일하게 일하자</p>
      <p>GitHub 로그인</p>
      <button>
        <GithubLogin />
      </button>
    </div>
  </div>
);

export default LoginPage;

import GITHUB_LOGO from "../assets/github-mark-white.svg";

const GithubLoginButton = () => {
  return (
    <div className="flex justify-evenly items-center w-[350px] h-[80px] bg-text-black rounded-xl hover:cursor-pointer">
      <img src={GITHUB_LOGO} alt="GITHUB_LOGO" width="36px" height="auto" />
      <div className="h-9 w-[0.5px] bg-white"></div>
      <p className="font-semibold text-white text-s">Github아이디로 로그인</p>
    </div>
  );
};

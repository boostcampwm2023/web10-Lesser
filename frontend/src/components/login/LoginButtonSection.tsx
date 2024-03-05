import { GithubLoginButton } from ".";

const LoginButtonSection = () => {
  return (
    <section className="flex-col ps-[60px] w-[486px] space-y-11">
      <div className="text-black text-xxl font-bold">
        <p>로그인 후</p>
        <p>프로젝트 관리</p>
        <p>시작하기</p>
      </div>
      <div className="flex space-x-[25px] items-center">
        <div className="h-[2px] w-[100px] bg-text-gray rounded"></div>
        <p className="text-xs text-dark-gray font-bold">SNS 로그인</p>
        <div className="h-[2px] w-[100px] bg-text-gray rounded"></div>
      </div>
      <GithubLoginButton />
    </section>
  );
};

export default LoginButtonSection;

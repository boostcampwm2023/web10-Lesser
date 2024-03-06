import LoginCardSection from "../../components/login/LoginCardSection";
import LoginButtonSection from "../../components/login/LoginButtonSection";

const LoginPage = () => {
  return (
    <main className="flex justify-center items-center h-[100vh]">
      <LoginCardSection />
      <LoginButtonSection />
    </main>
  );
};

export default LoginPage;

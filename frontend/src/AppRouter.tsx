import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { LoginPage, SignupPage, AuthPage, TempHomepage } from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <TempHomepage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/auth/github/callback",
    element: <AuthPage />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;

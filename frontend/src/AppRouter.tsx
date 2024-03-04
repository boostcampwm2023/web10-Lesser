import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { LoginPage, SignupPage, AuthPage, TempHomepage } from "./pages";
import { ROUTER_URL } from "./constants/path";

const router = createBrowserRouter([
  {
    path: ROUTER_URL.TEMP,
    element: <TempHomepage />,
  },
  {
    path: ROUTER_URL.LOGIN,
    element: <LoginPage />,
  },
  {
    path: ROUTER_URL.SIGNUP,
    element: <SignupPage />,
  },
  {
    path: ROUTER_URL.AUTH,
    element: <AuthPage />,
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
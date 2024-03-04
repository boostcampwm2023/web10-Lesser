import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { LoginPage, SignupPage, TempHomepage } from "./pages";

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
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;

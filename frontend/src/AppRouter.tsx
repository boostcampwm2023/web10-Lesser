import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { LoginPage, SignupPage, AuthPage, TempHomepage } from "./pages";
import { ROUTER_URL } from "./constants/path";
import ProjectsPage from "./pages/projects/ProjectsPage";
import ErrorThrowPage from "./pages/ErrorThrowPage";
import GlobalErrorBoundary from "./GlobalErrorBoundary";

const router = createBrowserRouter([
  {
    path: ROUTER_URL.ROOT,
    element: (
      <GlobalErrorBoundary>
        <Outlet />
      </GlobalErrorBoundary>
    ),
    children: [
      {
        index: true,
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
      {
        path: ROUTER_URL.PROJECTS,
        element: <ProjectsPage />,
      },
      {
        path: "/throw-error",
        element: <ErrorThrowPage />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;

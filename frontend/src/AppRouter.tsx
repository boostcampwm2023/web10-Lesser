import { Outlet, RouteObject, RouterProvider, createBrowserRouter } from "react-router-dom";
import { LoginPage, SignupPage, AuthPage, TempHomepage } from "./pages";
import { ROUTER_URL } from "./constants/path";
import ProjectsPage from "./pages/projects/ProjectsPage";
import ErrorThrowPage from "./pages/ErrorThrowPage";
import GlobalErrorBoundary from "./GlobalErrorBoundary";
import PrivateRoute from "./components/common/route/PrivateRoute";
import PublicRoute from "./components/common/route/PublicRoute";

const createPrivateRouter = (children: RouteObject[]) => {
  const privateRoute = {
    element: <PrivateRoute />,
    children,
  };
  return privateRoute;
};

const createPublicRouter = (children: RouteObject[]) => {
  const publicRoute = {
    element: <PublicRoute />,
    children,
  };
  return publicRoute;
};

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
      createPublicRouter([
        {
          path: ROUTER_URL.LOGIN,
          element: <LoginPage />,
        },
      ]),
      createPublicRouter([
        {
          path: ROUTER_URL.SIGNUP,
          element: <SignupPage />,
        },
      ]),
      createPublicRouter([
        {
          path: ROUTER_URL.AUTH,
          element: <AuthPage />,
        },
      ]),
      createPrivateRouter([
        {
          path: ROUTER_URL.PROJECTS,
          element: <ProjectsPage />,
        },
      ]),
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

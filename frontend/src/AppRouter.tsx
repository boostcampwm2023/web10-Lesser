import {
  Outlet,
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import {
  LoginPage,
  SignupPage,
  AuthPage,
  TempHomepage,
  ProjectsPage,
  ProjectCreatePage,
} from "./pages";
import { ROUTER_URL } from "./constants/path";
import GlobalErrorBoundary from "./GlobalErrorBoundary";
import PrivateRoute from "./components/common/route/PrivateRoute";
import PublicRoute from "./components/common/route/PublicRoute";
import MainPage from "./pages/main/MainPage";
import LandingPage from "./pages/landing/LandingPage";

type RouteType = "PRIVATE" | "PUBLIC";

const createAuthCheckRouter = (
  routeType: RouteType,
  children: RouteObject[]
) => {
  const authCheckRouter = children.map((child: RouteObject) => ({
    element: routeType === "PRIVATE" ? <PrivateRoute /> : <PublicRoute />,
    children: [child],
  }));
  return authCheckRouter;
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
      ...createAuthCheckRouter("PUBLIC", [
        {
          path: ROUTER_URL.LOGIN,
          element: <LoginPage />,
        },
        {
          path: ROUTER_URL.SIGNUP,
          element: <SignupPage />,
        },
        {
          path: `${ROUTER_URL.AUTH}/*`,
          element: <AuthPage />,
        },
      ]),
      ...createAuthCheckRouter("PRIVATE", [
        {
          path: ROUTER_URL.PROJECTS,
          element: <ProjectsPage />,
        },
        {
          path: ROUTER_URL.PROJECTS_CREATE,
          element: <ProjectCreatePage />,
        },
      ]),
      {
        path: ROUTER_URL.MAIN,
        element: <MainPage />,
        children: [
          { index: true, element: <LandingPage /> },
          { path: ROUTER_URL.BACKLOG, element: <div>backlog Page</div> },
          { path: ROUTER_URL.SPRINT, element: <div>sprint Page</div> },
          { path: ROUTER_URL.SETTINGS, element: <div>setting Page</div> },
        ],
      },
    ],
  },
]);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;

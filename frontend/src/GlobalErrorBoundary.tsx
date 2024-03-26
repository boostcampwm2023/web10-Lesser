import { PropsWithChildren } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import ErrorPage from "./pages/error/CommonErrorPage";
import AuthErrorPage from "./pages/error/AuthErrorPage";

const GlobalErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  if (error.response.status === 401) return <AuthErrorPage {...{ error, resetErrorBoundary }} />;
  return <ErrorPage {...{ error, resetErrorBoundary }} />;
};

const GlobalErrorBoundary: React.FC<PropsWithChildren> = ({ children }) => {
  return <ErrorBoundary FallbackComponent={GlobalErrorFallback}>{children}</ErrorBoundary>;
};

export default GlobalErrorBoundary;

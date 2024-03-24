import { PropsWithChildren } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import ErrorPage from "./pages/error/ErrorPage";

const GlobalErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <div>
      <ErrorPage {...{ error, resetErrorBoundary }} />
    </div>
  );
};

const GlobalErrorBoundary: React.FC<PropsWithChildren> = ({ children }) => {
  return <ErrorBoundary FallbackComponent={GlobalErrorFallback}>{children}</ErrorBoundary>;
};

export default GlobalErrorBoundary;

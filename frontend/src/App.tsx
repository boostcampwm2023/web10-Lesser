import { ModalProvider } from "./hooks/common/modal/ModalProvider";
import AppRouter from "./AppRouter";
import GlobalErrorBoundary from "./GlobalErrorBoundary";

const App = () => {
  return (
    <GlobalErrorBoundary>
      <ModalProvider>
        <AppRouter />
      </ModalProvider>
    </GlobalErrorBoundary>
  );
};

export default App;

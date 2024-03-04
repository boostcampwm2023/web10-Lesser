import { ModalProvider } from "./hooks/common/modal/ModalProvider";
import AppRouter from "./AppRouter";

const App = () => {
  return (
    <ModalProvider>
      <AppRouter />
    </ModalProvider>
  );
};

export default App;

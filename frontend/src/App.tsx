import { ModalProvider } from "./hooks/common/modal/ModalProvider";
import AppRouter from "./AppRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ModalProvider>
      <AppRouter />
    </ModalProvider>
  </QueryClientProvider>
);

export default App;

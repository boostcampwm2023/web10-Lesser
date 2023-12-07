import { Routes, Route } from 'react-router-dom';
import ProjectPage from './pages/project/ProjectPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import BacklogPage from './pages/backlog/BacklogPage';
import SprintPage from './pages/SprintPage';
import ReviewPage from './pages/ReviewPage';
import ProjectCreatePage from './pages/project/ProjectCreatePage';
import { ModalProvider } from './modal/ModalProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SprintCreatePage from './pages/sprint/SprintCreatePage';
import PrivateRoute from './components/common/PrivateRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" />
            <Route path="/projects" element={<ProjectPage />} />
            <Route path="/projects/create" element={<ProjectCreatePage />} />
            <Route path="/projects/:id/sprint/create" element={<SprintCreatePage />} />
            <Route element={<MainPage />}>
              <Route path="/projects/:id/backlog" element={<BacklogPage />} />
              <Route path="/projects/:id/sprint" element={<SprintPage />} />
              <Route path="/projects/:id/review/*" element={<ReviewPage />} />
            </Route>
          </Route>
        </Routes>
      </ModalProvider>
    </QueryClientProvider>
  );
}

export default App;

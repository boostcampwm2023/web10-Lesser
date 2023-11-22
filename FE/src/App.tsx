import { Routes, Route } from 'react-router-dom';
import ProjectPage from './pages/ProjectPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import BacklogPage from './pages/BacklogPage';
import SprintPage from './pages/SprintPage';
import ReviewPage from './pages/ReviewPage';
import ProjectCreatePage from './pages/ProjectCreatePage';

function App() {
  return (
    <Routes>
      <Route path="/project" element={<ProjectPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/project/create" element={<ProjectCreatePage />} />
      <Route element={<MainPage />}>
        <Route path="/backlog" element={<BacklogPage />} />
        <Route path="/sprint" element={<SprintPage />} />
        <Route path="/review" element={<ReviewPage />} />
      </Route>
    </Routes>
  );
}

export default App;

import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import ForYouPage from './pages/ForYouPage';
import DiscoverPage from './pages/DiscoverPage';
import ArticlePage from './pages/ArticlePage';
import { Route, Routes } from 'react-router-dom';

import { AuthProvider } from './firebase/auth';
import PrivateRoute from './PrivateRoute';
import PublicOnlyRoute from './PublicOnlyRoute';
import Logout from './pages/Logout';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<ForYouPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/article/:articleId" element={<ArticlePage />} />
          <Route path="/logout" element={<Logout />} />
        </Route>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;

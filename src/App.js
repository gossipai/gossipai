import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import ForYouPage from './pages/ForYouPage';
import ArticlePage from './pages/ArticlePage';
import { Route, Routes } from 'react-router-dom';


function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ForYouPage />} />
      <Route path="/article/:articleId" element={<ArticlePage />} />
    </Routes>
  );
}

export default App;

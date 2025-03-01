import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage'
import HomePage from './pages/HomePage';
import ArtHomePage from './pages/Art-Homepage';
import Admin from './pages/Admin';
import RegisterPage from './pages/RegisterPage';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/artisan/:artisanId" element={<ArtHomePage />} />
      </Routes>
    </Router>
  );
}

export default App

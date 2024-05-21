import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentLoginPage from './pages/StudentLoginPage';
import LoginPage from './pages/LoginPage';
import Header from './pages/Header';
import CompanyRegister from './pages/CompanyRegister';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/main" element={< Header />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/student-login" element={<StudentLoginPage />} />
        <Route path="/company-register" element={< CompanyRegister />} />
      </Routes>
    </Router>
  );
}

export default App;

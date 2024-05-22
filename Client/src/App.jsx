import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './UserContext';
import StudentLoginPage from './pages/StudentLoginPage';
import LoginPage from './pages/LoginPage';
import MainPage from "./pages/MainPage";
import CompanyRegister from './pages/CompanyRegister';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/main" element={< MainPage />} /> 
          <Route path="/" element={<LoginPage />} />
          <Route path="/student-login" element={<StudentLoginPage role="student" />} />
          <Route path="/coordinator-login" element={<StudentLoginPage role="coordinator" />} />
          <Route path="/company-login" element={<StudentLoginPage role="company" />} />
          <Route path="/secretariat-login" element={<StudentLoginPage role="secretariat" />} />
          <Route path="/company-register" element={<CompanyRegister />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;

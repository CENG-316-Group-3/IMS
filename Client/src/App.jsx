import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StudentLoginPage from './pages/StudentLoginPage';
import LoginPage from './pages/LoginPage';
import Header from './pages/Header';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={< Header/>} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/student-login" element={<StudentLoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;

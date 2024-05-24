import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SigninPage from './pages/SigninPage';
import LoginPage from './pages/LoginPage';
import MainPage from "./pages/MainPage";
import CompanyRegister from './pages/CompanyRegister';
import Popup from "./components/Popup";

function App() {
   
  return (
    <Router>
      <Popup />
      <Routes>
          <Route path="/main" element={< MainPage />} /> 
          <Route path="/" element={<LoginPage />} />
          <Route path="/student-login" element={<SigninPage role="student" />} />
          <Route path="/coordinator-login" element={<SigninPage role="coordinator" />} />
          <Route path="/company-login" element={<SigninPage role="company" />} />
          <Route path="/secretariat-login" element={<SigninPage role="secretariat" />} />
          <Route path="/company-register" element={<CompanyRegister />} />
      </Routes>
    </Router>
  );
}

export default App;

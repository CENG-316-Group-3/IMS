import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SigninPage from './pages/SigninPage';
import LoginPage from './pages/LoginPage';
import MainPage from "./pages/MainPage";
import CompanyRegister from './pages/CompanyRegister';
import Popup from "./components/Popup";
import { useUser } from "./contexts/UserContext";
import { usePopup } from './contexts/PopUpContext';
import ProtectedRoute from "./modules/ProtectedRoute";

function App() {
  const { user } = useUser();
  const { showPopup } = usePopup();
   
  return (
    <Router>
      <Popup />
      <Routes>
          <Route path="/main" element={<ProtectedRoute protected_route={"/"} condition_handler={() => (!user)} optional_conditional_handler_operation={() => {showPopup("alert", "You need to sign in first !")}}>< MainPage /></ProtectedRoute>} /> 
          <Route path="/" element={<ProtectedRoute protected_route={"/main"} condition_handler={() => (user)} optional_conditional_handler_operation={() => {showPopup("info", "You have already signed in")}}><LoginPage /></ProtectedRoute>} />
          <Route path="/student-login" element={<ProtectedRoute protected_route={"/main"} condition_handler={() => (user)} optional_conditional_handler_operation={() => {showPopup("info", "You have already signed in")}}><SigninPage role="student" /></ProtectedRoute>} />
          <Route path="/coordinator-login" element={<ProtectedRoute protected_route={"/main"} condition_handler={() => (user)} optional_conditional_handler_operation={() => {showPopup("info", "You have already signed in")}}><SigninPage role="coordinator" /></ProtectedRoute>} />
          <Route path="/company-login" element={<ProtectedRoute protected_route={"/main"} condition_handler={() => (user)} optional_conditional_handler_operation={() => {showPopup("info", "You have already signed in")}}><SigninPage role="company" /></ProtectedRoute>} />
          <Route path="/secretariat-login" element={<ProtectedRoute protected_route={"/main"} condition_handler={() => (user)} optional_conditional_handler_operation={() => {showPopup("info", "You have already signed in")}}><SigninPage role="secretariat" /></ProtectedRoute>} />
          <Route path="/company-register" element={<ProtectedRoute protected_route={"/main"} condition_handler={() => (user)} optional_conditional_handler_operation={() => {showPopup("info", "You have already signed in")}}><CompanyRegister /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;

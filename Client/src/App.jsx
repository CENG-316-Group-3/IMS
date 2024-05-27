import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SigninPage from './pages/SigninPage';
import LoginPage from './pages/LoginPage';
import MainPage from "./pages/MainPage";
import CompanyRegister from './pages/CompanyRegister';
import NotFoundPage from "./pages/NotFoundPage";
import Popup from "./components/Popup";
import EmptyContent from "./components/EmptyContent";
import { useUser } from "./contexts/UserContext";
import { usePopup } from './contexts/PopUpContext';
import ProtectedRoute from "./modules/ProtectedRoute";
import { main_config, site_map } from "./config";

function App() {
  const { user } = useUser();
  const { showPopup } = usePopup();
  
  const default_login_register_protection_case = {protected_route:"/main", condition_handler: () => {return user}, optional_conditional_handler_operation: () => {showPopup("info", "You have already signed in")}};
  const default_already_signed_in_case = {protected_route:"/", condition_handler: () => {return !user}, optional_conditional_handler_operation: () => {showPopup("alert", "You need to sign in first !")}}; 

  return (
    <Router>
      <Popup />
      <Routes>
          {/* Sign in, Register routes*/}
          <Route path="/" element={<ProtectedRoute cases={[default_login_register_protection_case]}><LoginPage /></ProtectedRoute>} />
          <Route path="/student-login" element={<ProtectedRoute cases={[default_login_register_protection_case]}><SigninPage role="student" /></ProtectedRoute>} />
          <Route path="/coordinator-login" element={<ProtectedRoute cases={[default_login_register_protection_case]}><SigninPage role="coordinator" /></ProtectedRoute>} />
          <Route path="/company-login" element={<ProtectedRoute cases={[default_login_register_protection_case]}><SigninPage role="company" /></ProtectedRoute>} />
          <Route path="/secretariat-login" element={<ProtectedRoute cases={[default_login_register_protection_case]}><SigninPage role="secretariat" /></ProtectedRoute>} />
          <Route path="/company-register" element={<ProtectedRoute cases={[default_login_register_protection_case]}><CompanyRegister /></ProtectedRoute>} />

          {/* Main routes here (differs with role)*/}
          <Route path={"/main"} element={<ProtectedRoute cases={[default_already_signed_in_case]}>< MainPage></MainPage></ProtectedRoute>} /> 

          {site_map.map((route, key) => {
            const DynamicComponent = (route.page_content) ? route.page_content : EmptyContent;
            return <Route key={key} path={route.link} element={<ProtectedRoute cases={[default_already_signed_in_case,
              (user != null) ? {protected_route:"/main", condition_handler: () => !main_config[user.role].allowed_routes.includes(route.link), optional_conditional_handler_operation: () => {showPopup("alert", "User does not belongs to specified page !")}} : null,
            ]}>< MainPage>{<DynamicComponent />}</MainPage></ProtectedRoute>} /> 
          })}

          {/* 404 Not Found Route */}
          <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;

import "../styles/LoginPage.css";
import { Link } from 'react-router-dom';
import { React, useEffect } from 'react';

function LoginPage() {
    return (
        <div className="page_div">
            <div className="page_content">
                <div className="logo background_contain"></div>
                <h2>IZTECH Internship Management System</h2>
                <div className="login_page_button_cover"><Link to="/student-login"><div className="login_page_button">Student Login</div></Link></div>
                <div className="login_page_button_cover"><Link to="/coordinator-login"><div className="login_page_button">Coordinator Login</div></Link></div>
                <div className="login_page_button_cover"><Link to="/company-login"><div className="login_page_button">Company Login</div></Link></div>
                <div className="login_page_button_cover"><Link to="/secretariat-login"><div className="login_page_button">Secretariat Login</div></Link></div>
                <div className="login_page_button_cover"><hr /></div>
                <div className="login_page_button_cover"><Link to="/company-register"><div className="login_page_button">Company Register</div></Link></div>
            </div>
        </div>
    );
}

export default LoginPage;
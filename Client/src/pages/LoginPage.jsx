import "../styles/LoginPage.css";
import { Link } from 'react-router-dom';
import { React, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from "react-router-dom";
import { usePopup } from '../contexts/PopUpContext';

function LoginPage() {
    const {user} = useUser();
    const { showPopup } = usePopup();
    const navigate = useNavigate();

    useEffect(() => {
        if(user){
            showPopup("info", "You have already signed in");
            navigate("/main");
        }
    }, [user]);

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
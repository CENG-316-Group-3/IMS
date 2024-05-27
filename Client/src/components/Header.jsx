import React from 'react';
import { Link } from "react-router-dom";
import "../styles/Header.css";
import empty_inbox from "../assets/empty_inbox.png";
import { useNavigate } from 'react-router-dom';
import inbox from "../assets/inbox.png";

function Header({ username, profile_icon, profile_link }) {
    const navigate = useNavigate();

    return (
        <div className="header">
            <div className="header_left_part">
                <Link to={"/main"}><div className="header_logo background_contain"></div></Link>
                <h1>IMS</h1>
            </div>
            <div className="header_right_part">
                <div className="header_account_box">
                    <h2>{username.toUpperCase()}</h2>
                    <Link to={profile_link}><div className="header_user_icon background_contain" style={{ backgroundImage: `url(${profile_icon})` }}></div></Link>
                    <div className='inbox_part'>
                        <div className='background_contain inbox_button' style={{backgroundImage: `url(${inbox})`}} onClick={() => {navigate("/notifications")}}></div>
                        <div className='inbox_count_part'>1</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
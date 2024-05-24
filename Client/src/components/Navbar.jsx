import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import "../styles/Navbar.css";
import { usePopup } from '../contexts/PopUpContext';

function Navbar({ navbar_items }) {
    const { logout } = useUser();
    const navigate = useNavigate();
    const [hoverIndex, setHoverIndex] = useState(-1);
    const { showPopup } = usePopup();

    return (
        <div className="navbar">
            <nav>
                {navbar_items.map((item, index) => (
                    <div
                        className="navbar_element"
                        key={index}
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(-1)}
                    >
                        <HoverIcon
                            icon={hoverIndex === index ? item.hover_icon : item.icon}
                        />
                        <div className="navbar_element_text">{item.text}</div>
                    </div>
                ))}
            </nav>
            <div className="navbar_logout_button">
                <div className="navbar_logout_button_icon background_contain"></div>
                <div className="navbar_logout_button_text" onClick={() => {
                    logout();
                    showPopup("success", "Log out successfully");
                    navigate("/");
                }}>Logout</div>
            </div>
        </div>
    );
}

function HoverIcon({ icon }) {
    return (
        <img
            className="navbar_element_icon background_contain"
            src={icon}
            alt="Dynamic Icon"
        />
    );
}

/* Navbar navbar_items is a prop that must be an array of {icon, hover_icon, text} which are the each row of navbar */

export default Navbar;




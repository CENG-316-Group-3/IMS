import React, { useState } from 'react';
import "../styles/Navbar.css";

function Navbar({ navbar_items }) {
    const [hoverIndex, setHoverIndex] = useState(-1);

    return (
        <div className="main_page_section">
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
                    <div className="navbar_logout_button_text">Logout</div>
                </div>
            </div>
            <div className="main_page_content"></div>
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

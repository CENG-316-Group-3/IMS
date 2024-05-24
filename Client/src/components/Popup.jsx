import React from 'react';
import "../styles/Popup.css";
import { usePopup } from '../contexts/PopUpContext';

// Icons //
import success from "../assets/success.png";
import alert from "../assets/alert.png";
import info from "../assets/info.png";
import error from "../assets/error.png";

function Popup() {
    const { popup } = usePopup();
    if (!popup.show) return null;
    
    const config = {
        success: {header: "Success", icon: success, background_color: "var(--success_green)"},
        alert: {header: "Alert", icon: alert, background_color: "var(--alert_yellow)"},
        info: {header: "Info", icon: info, background_color: "var(--info_blue)"},
        error: {header: "Error", icon: error, background_color: "var(--error_red)"},
    };

    return(
        <div className="popup_div" style={{backgroundColor:config[popup.type].background_color}}>
            <div className="popup_div_icon background_contain" style={{backgroundImage:`url(${config[popup.type].icon})`}}></div>
            <div className="popup_div_content">
                <h3>{config[popup.type].header}</h3>
                <p>{popup.message}</p>
            </div>
        </div>
    );
}

export default Popup;

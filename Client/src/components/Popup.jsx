import "../styles/Popup.css";

// Icons //
import success from "../assets/success.png";
import alert from "../assets/alert.png";
import info from "../assets/info.png";
import error from "../assets/error.png";

function Popup( {type, message} ) {
    const config = {
        success: {header: "Success", icon: success, background_color: "var(--success_green)"},
        alert: {header: "Alert", icon: alert, background_color: "var(--alert_yellow)"},
        info: {header: "Info", icon: info, background_color: "var(--info_blue)"},
        error: {header: "Error", icon: error, background_color: "var(--error_red)"},
    };

    return(
        <div className="popup_div" style={{backgroundColor:config[type].background_color}}>
            <div className="popup_div_icon background_contain" style={{backgroundImage:`url(${config[type].icon})`}}></div>
            <div className="popup_div_content">
                <h3>{config[type].header}</h3>
                <p>{message}</p>
            </div>
        </div>
    );
}

export default Popup;
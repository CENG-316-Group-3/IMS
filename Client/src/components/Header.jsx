import { Link } from "react-router-dom";
import "../styles/Header.css";

function Header({ username, profile_icon, profile_link }) {

    return (
        <div className="header">
            <div className="header_left_part">
                <div className="header_logo background_contain"></div>
                <h1>IMS</h1>
            </div>
            <div className="header_right_part">
                <div className="header_account_box">
                    <h2>{username.toUpperCase()}</h2>
                    <Link to={profile_link}><div className="header_user_icon background_contain" style={{ backgroundImage: `url(${profile_icon})` }}></div></Link>
                </div>
            </div>
        </div>
    );
}

export default Header;
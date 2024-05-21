import "../styles/Header.css";

function Header() {
    return (
        <div className="header">
            <div className="header_left_part">
                <div className="header_logo background_contain"></div>
                <h1>IMS</h1>
            </div>
            <div className="header_right_part">
                <div className="header_account_box">
                    <h2>ÜNAL DALKILIÇ</h2>
                    <div className="header_user_icon background_contain"></div>
                </div>
            </div>
        </div>
    );
}

export default Header;
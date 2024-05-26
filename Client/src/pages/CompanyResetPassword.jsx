import { React, useState } from 'react'
import "../styles/LoginPage.css";
import "../styles/CompanyResetPassword.css";
import InputContainer from "../components/InputContainer";
import padlock_icon from "../assets/padlock.png";
import password_hide from "../assets/hide.png";
import password_show from "../assets/show.png";

function CompanyResetPassword() {

    const [password, setPassword] = useState("");
    const [password_hidden, setPasswordHidden] = useState(true);
    const [confirm_password, setConfirmPassword] = useState("");
    const [password_type, setPasswordType] = useState("password");

    const toggle_password_hide_state = () => {
        setPasswordHidden(!password_hidden);
        setPasswordType(password_hidden ? "text" : "password");
    };

    return (
        <div className="page_div">
            <div className="page_content">
                <div className="logo background_contain"></div>
                <h2>COMPANY RESET PASSWORD</h2>
                <div className='reset-pass'>
                    <InputContainer id="company_reset_password" label="New Password" type={password_type} placeholder="Enter your new password" icon={padlock_icon} state={password} setState={setPassword} optional_icon={(password_hidden) ? password_hide : password_show} optional_text={(password_hidden) ? "Show" : "Hide"} optional_onClick={toggle_password_hide_state} />

                    <InputContainer id="company_reset_password" label="Confirm New Password" type={password_type} placeholder="Confirm your new password" icon={padlock_icon} state={confirm_password} setState={setConfirmPassword} />

                </div>
                <button type='submit' className='send-link-btn'>Reset Password</button>
            </div>
        </div>
    )
}

export default CompanyResetPassword

import { useState } from 'react';
import InputContainer from "../components/InputContainer";
import "../styles/StudentLoginPage.css";
import profile_icon from "../assets/user.png";
import padlock_icon from "../assets/padlock.png";
import password_hide from "../assets/hide.png";
import password_show from "../assets/show.png";
import SignInRegisterPanel from '../components/SignInRegisterPanel';

function StudentLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password_hidden, setPasswordHidden] = useState(true);
    const [password_type, setPasswordType] = useState("password");

    const toggle_password_hide_state = () => {
        setPasswordHidden(!password_hidden);
        setPasswordType(password_hidden ? "text" : "password");
    };

    return (
        <div className="page_div">
            <div className="left_section">
                <div className="left_section_content">
                    <h2>Sign in</h2>
                    <SignInRegisterPanel button_text="Sign in" onClick={() => {/* TODO */ }}>
                        <InputContainer id="student_email" label="Student e-mail" type="email" placeholder="Enter your email" icon={profile_icon} state={email} setState={setEmail} />
                        <InputContainer id="student_password" label="Password" type={password_type} placeholder="Enter your password" icon={padlock_icon} state={password} setState={setPassword} optional_icon={(password_hidden) ? password_show : password_hide} optional_text={(password_hidden) ? "Show" : "Hide"} optional_onClick={toggle_password_hide_state} />
                    </SignInRegisterPanel>
                    <h3><a href="https://ceng.iyte.edu.tr/tr/courses/ceng-400/" target='_blank'><span>How can I login ?</span></a></h3>
                </div>
            </div>
            <div className="right_section">
                <div className="right_section_panel">
                    <div className="right_section_panel_inner">
                        <h1>IMS</h1>
                        <h2>Welcome !</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentLoginPage;
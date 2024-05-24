import { React, useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { usePopup } from '../contexts/PopUpContext';
import { useNavigate } from "react-router-dom";
import InputContainer from "../components/InputContainer";
import "../styles/SigninPage.css";
import profile_icon from "../assets/user.png";
import padlock_icon from "../assets/padlock.png";
import password_hide from "../assets/hide.png";
import password_show from "../assets/show.png";
import SignInRegisterPanel from '../components/SignInRegisterPanel';

function SigninPage({ role }) {
    const { user, login } = useUser();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password_hidden, setPasswordHidden] = useState(true);
    const [password_type, setPasswordType] = useState("password");
    const navigate = useNavigate();
    const { showPopup } = usePopup();

    useEffect(()=> {
        if(user)
            navigate("/main");
    }, [user]);

    const handleSignIn = async () => {
        if (email === "") {
            showPopup("error", "You need to enter your email!");
            return;
        }
        if (password === "") {
            showPopup("error", "You need to enter your password!");
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:3000/ims/login/${role}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [`${role}Mail`]: email, password })
            });
    
            if (response.status === 200) {
                const userData = await response.json();
                await login(userData);
                showPopup("success", `Signed in successfully, welcome ${userData.user[userData.role + "Name"]}`);
                navigate("/main");
            } else {
                setEmail("");
                setPassword("");
                showPopup("error", "Email or password is wrong! Try again");
            }
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
            showPopup("error", "There is a problem in connection");
        }
    };
    

    const toggle_password_hide_state = () => {
        setPasswordHidden(!password_hidden);
        setPasswordType(password_hidden ? "text" : "password");
    };

    const role_text = () => { role.toLowerCase(); let dummy = role; dummy = dummy.charAt(0).toUpperCase() + dummy.slice(1); return dummy; };

    return (
        <div className="page_div">
            <div className="left_section">
                <div className="left_section_content">
                    <h2>Sign in</h2>
                    <SignInRegisterPanel button_text="Sign in" onClick={handleSignIn}>
                        <InputContainer id="student_email" label={`${role_text()} e-mail`} type="email" placeholder="Enter your email" icon={profile_icon} state={email} setState={setEmail} />
                        <InputContainer id="student_password" label="Password" type={password_type} placeholder="Enter your password" icon={padlock_icon} state={password} setState={setPassword} optional_icon={(password_hidden) ? password_hide : password_show} optional_text={(password_hidden) ? "Show" : "Hide"} optional_onClick={toggle_password_hide_state} />
                        <p className='forgot_password_text' style={{ display: (role == "company" ? "block" : "none") }}><span>Forgot password ?</span></p>
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

export default SigninPage;
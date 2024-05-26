import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/CompanyRegister.css";
import { usePopup } from '../contexts/PopUpContext';

function CompanyRegister() {
    const { showPopup } = usePopup();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [address, setAddress] = useState("");

    const handle_register = async (event) => {
        event.preventDefault()
        if (email == "")
            showPopup("error", "Please enter an email !");
        else if (name == "")
            showPopup("error", "Please enter a name !");
        else if (password == "")
            showPopup("error", "Please enter a password !");
        else if (password.length < 8)
            showPopup("error", "Password needs to be at least 8 characters !");
        else if (confirm_password == "")
            showPopup("error", "Please confirm password !");
        else if (password !== confirm_password)
            showPopup("error", "Passwords did not match !");
        else{
            try {
                const response = await fetch(`http://localhost:3000/ims/register/company`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ companyMail: email, password, companyName: name, address })
                });
        
                if (response.status === 200) {
                    showPopup("info", "Registered request sent");
                    navigate("/company-login");
                } else {
                    setEmail("");
                    setPassword("");
                    setName("");
                    setConfirmPassword("");
                    setAddress("");
                    
                    if (response.status === 401)
                        showPopup("error", "Some register informations are wrong ! Try again");
                    if (response.status === 500)
                        showPopup("error", "Internal server error occured !");
                }
            } catch (error) {
                showPopup("error", "There is a problem in connection");
            }
        }
    };

    return (
        <div className='register_div'>
            <div className='register_page_content'>
                <h1>Create an account</h1>
                <div className='register-container-blur'>
                    <div className='inside_form'>
                        <form onSubmit={handle_register}>
                            <label id='form-content'>Company E-mail*:</label><br />
                            <input type="email" className='company-register-inf' name='email' onChange={(event) => {setEmail(event.target.value)}} /><br />

                            <label id='form-content'>Company Name*:</label><br />
                            <input type="text" className='company-register-inf' name='company-name' onChange={(event) => {setName(event.target.value)}} /><br />

                            <label id='form-content'>Password*:</label><br />
                            <input type="password" className='company-register-inf' name='password' onChange={(event) => {setPassword(event.target.value)}} /><br />

                            <label id='form-content'>Confirm Password*:</label><br />
                            <input type="password" className='company-register-inf' name='confirm-password' onChange={(event) => {setConfirmPassword(event.target.value)}} /><br />

                            <label id='form-content'>Company Address:</label><br />
                            <input type="text" className='company-register-inf' name='address'maxLength={100} onChange={(event) => {setAddress(event.target.value)}}/><br />

                            <button id='register_button' type="submit">Sign Up</button>
                            <div className='already_login'>
                                <p> Already have an account? <a href="./company-login">Login</a></p>
                            </div>

                        </form>
                    </div>

                </div>
            </div>



        </div >
    )
}

export default CompanyRegister

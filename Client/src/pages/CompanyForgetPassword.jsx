import React from 'react'
import "../styles/LoginPage.css";
import "../styles/CompanyForgotPassword.css";


function CompanyForgetPassword() {
    return (
        <div className="page_div">
            <div className="page_content">
                <div className="logo background_contain"></div>
                <h2>COMPANY FORGET PASSWORD</h2>
                <div className='forgot-pass-email'>
                    <label >Please Enter Your E-mail:</label>
                    <input className="forgot-pass-input" type="email" placeholder="Company E-mail" />
                </div>
                <button type='submit' className='send-link-btn'>Send Link to E-mail</button>
            </div>
        </div>
    )
}

export default CompanyForgetPassword

import React from 'react'
import "../styles/CompanyRegister.css";

function CompanyRegister() {

    return (
        <div className='register_div'>
            <div className='register_page_content'>
                <h1>Create an account</h1>
                <div className='register-container-blur'>
                    <div className='inside_form'>
                        <form>
                            <label id='form-content'>Company E-mail*:</label><br />
                            <input type="email" id='email' name='email' /><br />

                            <label id='form-content'>Company Name*:</label><br />
                            <input type="text" id='company-name' name='company-name' /><br />

                            <label id='form-content'>Password*:</label><br />
                            <input type="password" id='password' name='password' /><br />

                            <label id='form-content'>Confirm Password*:</label><br />
                            <input type="password" id='confirm-password' name='confirm-password' /><br />

                            <label id='form-content'>Company Address*:</label><br />
                            <input type="text" id='address' name='address' /><br />

                            <button id='register_button' type="submit">Sign Up</button>
                            <div className='already_login'>
                                <p> Already have an account?</p> <a href="./company-login">Login</a>
                            </div>

                        </form>
                    </div>

                </div>
            </div>



        </div >
    )
}

export default CompanyRegister

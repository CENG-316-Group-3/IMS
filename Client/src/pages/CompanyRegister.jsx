import React from 'react'
import "../styles/CompanyRegister.css";

function CompanyRegister() {

    return (
        <div className='register_div'>
            <div className='page_content'>
                <h1>Create an account</h1>
                <div id='register-container-blur'>
                    <form>
                        <label id=''>Company E-mail*:</label><br />
                        <input type="email" id='email' name='email' /><br />

                        <label>Company Name*:</label><br />
                        <input type="text" id='company-name' name='company-name' /><br />

                        <label>Password*:</label><br />
                        <input type="password" id='password' name='password' /><br />

                        <label>Confirm Password*:</label><br />
                        <input type="password" id='confirm-password' name='confirm-password' /><br />

                        <label>Company Address*:</label><br />
                        <input type="text" id='address' name='address' /><br />

                        <button type="submit">Sign Up</button>
                        <p> Already have an account?</p><a href="./student-login">Login</a>
                    </form>
                </div>
            </div>



        </div >
    )
}

export default CompanyRegister

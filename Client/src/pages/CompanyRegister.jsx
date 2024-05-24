import React from 'react'
import "../styles/CompanyRegister.css";

function CompanyRegister() {
    const {user} = useUser();
    const { showPopup } = usePopup();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [address, setAddress] = useState("");

    const handle_register = async (event) => {
        event.preventDefault()
        if (email == ""){
            showPopup("error", "Please enter an email !");
            return -1;
        }
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
        // TODO gateway
    };
    return (
        <div className='register_div'>
            <div className='register_page_content'>
                <h1>Create an account</h1>
                <div className='register-container-blur'>
                    <div className='inside_form'>
                        <form>
                            <label id='form-content'>Company E-mail*:</label><br />
                            <input type="email" className='company-register-inf' name='email' required /><br />

                            <label id='form-content'>Company Name*:</label><br />
                            <input type="text" className='company-register-inf' name='company-name' required /><br />

                            <label id='form-content'>Password*:</label><br />
                            <input type="password" className='company-register-inf' name='password' required /><br />

                            <label id='form-content'>Confirm Password*:</label><br />
                            <input type="password" className='company-register-inf' name='confirm-password' required /><br />

                            <label id='form-content'>Company Address:</label><br />
                            <input type="text" className='company-register-inf' name='address' /><br />

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

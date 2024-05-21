import "../styles/SignInRegisterPanel.css";

function SignInRegisterPanel({ children, onClick, button_text}) {
    return (
        <div className="signin_register_panel">
            {children}
            <div className="signin_register_button" onClick={onClick}>{button_text}</div>
        </div>
    );
}

export default SignInRegisterPanel;
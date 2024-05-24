import React from 'react';
import "../styles/InputContainer.css";

function InputContainer({ id, label, type, placeholder, icon, optional_icon, optional_text, state, setState, optional_onClick }){
    return (
        <div className="input_container">
            <div className="input_container_upper_part">
                <label htmlFor={id}>{label}</label>
                <div className="input_container_upper_part_optional" onClick={optional_onClick} style={{cursor:(optional_onClick) ? "pointer": "auto"}}>
                    <div className="background_contain" style={{backgroundImage:(optional_icon) ? (`url(${optional_icon}`) : "none"}}></div>
                    <p>{(optional_text) ? optional_text : ""}</p>
                </div>
            </div>
            <div className="input_container_lower_part">
                <div className="background_contain" style={{backgroundImage:`url(${icon}`}}></div>
                <input type={type} id={id} placeholder={placeholder} value={state} onChange={(e) => setState(e.target.value)}/>
            </div>
        </div>
    );
}

export default InputContainer;
import React, { useState, useEffect } from 'react'
import '../../styles/StudentProfile.css'
import { useUser } from "../../contexts/UserContext";


function CompanyProfile() {
    const { user } = useUser();
    const [company_name, setCompanyName] = useState("");
    const [address, setAdress] = useState("");
    const [email, setEmail] = useState(""); /* optional*/


    useEffect(() => {
        //fetch_data();
    }, []);

    const fetch_data = async () => {
        try {
            const response = await fetch(`//TODO//`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ /* TODO */ })
            });

            if (response.status === 200) {
                /* TODO with response data setStates */
            } else {
                if (response.status === 400)
                    showPopup("error", "Student does not exist !");
                else if (response.status === 500)
                    showPopup("error", "Internal server error occured !");
                navigate("/main");
            }
        } catch (error) {
            showPopup("error", "There is a problem in connection");
            navigate("/main");
        }
    };
    return (
        <div className='student-profile-container'>
            <h2>Profile</h2>
            <div className='student-profile-content'>
                <div className='student-profile-left'>

                    <label htmlFor="">Company Name:</label><br />
                    <input id='std-profile-input' type="text" placeholder={company_name} readOnly /><br />

                    <label htmlFor="">E-mail:</label><br />
                    <input id='std-profile-input' type="email" placeholder={email} readOnly /><br />

                    <label htmlFor="">Adress:</label><br />
                    <input id='std-profile-input' type="text" placeholder={address} readOnly /><br />

                </div>
            </div>

        </div>
    )
}

export default CompanyProfile

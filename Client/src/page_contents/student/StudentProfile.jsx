import React, { useState, useEffect } from 'react'
import '../../styles/StudentProfile.css'
import { useUser } from "../../contexts/UserContext";

function StudentProfile() {
    const { user } = useUser();
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [number, setNumber] = useState("");
    const [faculty, setFaculty] = useState("");
    const [department, setDepartment] = useState("");
    const [grade, setGrade] = useState("");

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

                    <label htmlFor="">First Name:</label><br />
                    <input id='std-profile-input' type="text" placeholder={first_name} readOnly/><br />

                    <label htmlFor="">Last Name:</label><br />
                    <input id='std-profile-input' type="text" placeholder={last_name} readOnly/><br />

                    <label htmlFor="">E-mail:</label><br />
                    <input id='std-profile-input' type="email" placeholder={user.user.studentMail} readOnly/><br />

                    <label htmlFor="">Phone:</label><br />
                    <input id='std-profile-input' type="text" placeholder={phone} readOnly/><br />

                </div>
                <div className='student-profile-right'>

                    <label htmlFor="">Student ID:</label><br />
                    <input id='std-profile-input' type="text" placeholder={number} readOnly/><br />

                    <label htmlFor="">Faculty:</label><br />
                    <input id='std-profile-input' type="text" placeholder={faculty} readOnly/><br />

                    <label htmlFor="">Department:</label><br />
                    <input id='std-profile-input' type="text" placeholder={department} readOnly/><br />

                    <label htmlFor="">Class:</label><br />
                    <input id='std-profile-input' type="text" placeholder={grade} readOnly/><br />

                </div>
            </div>

        </div>
    )
}

export default StudentProfile

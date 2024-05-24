import React from 'react'
import '../../styles/StudentProfile.css'

function StudentProfile() {
    return (
        <div className='student-profile-container'>
            <h2>Profile</h2>
            <div className='student-profile-content'>
                <div className='student-profile-left'>

                    <label htmlFor="">First Name:</label><br />
                    <input id='std-profile-input' type="text" placeholder='Sıddık Can' /><br />

                    <label htmlFor="">Last Name:</label><br />
                    <input id='std-profile-input' type="text" placeholder='Boru' /><br />

                    <label htmlFor="">E-mail:</label><br />
                    <input id='std-profile-input' type="email" placeholder='std_email@std.iyte.edu.tr' /><br />

                    <label htmlFor="">Phone:</label><br />
                    <input id='std-profile-input' type="text" placeholder='05XX XXX XX XX' /><br />

                </div>
                <div className='student-profile-right'>

                    <label htmlFor="">Student ID:</label><br />
                    <input id='std-profile-input' type="text" placeholder='280201XXX' /><br />

                    <label htmlFor="">Faculty:</label><br />
                    <input id='std-profile-input' type="text" placeholder='Engineering' /><br />

                    <label htmlFor="">Department:</label><br />
                    <input id='std-profile-input' type="email" placeholder='Computer Engineering' /><br />

                    <label htmlFor="">Class:</label><br />
                    <input id='std-profile-input' type="text" placeholder='3th Grade' /><br />

                </div>
            </div>

            <button id='std-profile-save-btn'>SAVE</button>

        </div>
    )
}

export default StudentProfile

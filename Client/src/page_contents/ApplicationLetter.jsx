import React from 'react'
import "../styles/ApplicationLetter.css";

function ApplicationLetter() {
    return (
        <div className='application-letter-container'>
            <h2>Application Letter</h2>
            <div className='letter-content'>
                <p>Name - Surname: </p>
                <p>Faculty: </p>
                <p>Department: </p>
                <p>Class: </p>
                <p>Student ID: </p>

                <p>     In order to graduate, the student whose information is given above must perform his/her compulsory summer practice included in the undergraduate curriculum of the Computer Engineering Department of İzmir Institute of Technology.
                    I would like to thank you in advance for your interest in allowing the student to perform summer practice at your institution/company, for <strong>at least 20 workdays</strong> between the dates you think suitable. This summer practice is intended to improve his/her practical knowledge and skills, in addition to the theoretical knowledge that the student has gained during the courses.
                </p>

                <h5>Department Summer Practice Coordinator</h5>
                <h6>Dr. Buket Erşahin</h6>
                <h6>coordinator@mail.com</h6>
            </div>
        </div>
    )
}

export default ApplicationLetter

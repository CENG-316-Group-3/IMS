import "../styles/ApplicationLetter.css";
import React, { useState, useEffect } from 'react'
import { useUser } from "../contexts/UserContext";
import { usePopup } from '../contexts/PopUpContext';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function ApplicationLetter() {
    let { id, studentMail, companyMail } = useParams();
    const { user } = useUser();
    const { showPopup } = usePopup();
    const navigate = useNavigate();
    const [student_name, SetStudentName] = useState("");
    const [faculty, setFaculty] = useState("");
    const [department, setDepartment] = useState("");
    const [student_class, setStudentClass] = useState("");
    const [student_id, setStudentId] = useState("");

    useEffect(() => {
        fetch_data();
    }, []);

    const fetch_data = async () => {
        try {
            const response = await fetch(`http://localhost:3000/applicationLetter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ announcementId: id, companyMail, studentMail })
            });
    
            if (response.status === 200) {
                const json_data = await response.json();
                SetStudentName(`${json_data.Student.firstName} ${json_data.Student.lastName}`);
                setFaculty(json_data.Student.faculty);
                setDepartment(json_data.Student.department);
                setStudentClass(json_data.Student.gradeNumber);
                setStudentId(json_data.Student.studentNumber);
            } else {
                if (response.status === 400)
                    showPopup("error", "Given application does not exist !");
                else if (response.status === 500)
                    showPopup("error", "Internal server error occured !");
                navigate("/company_applications");
            }
        } catch (error) {
            showPopup("error", "There is a problem in connection");
            navigate("/company_applications");
        }
    };

    return (
        <div className='application-letter-container'>
            <h2>Application Letter</h2>
            <div className='letter-content'>
                <p>Name - Surname: {student_name}</p>
                <p>Faculty: {faculty}</p>
                <p>Department: {department}</p>
                <p>Class: {student_class}</p>
                <p>Student ID: {student_id}</p>

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

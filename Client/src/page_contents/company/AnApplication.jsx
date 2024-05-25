import React, { useState, useEffect } from 'react'
import '../../styles/AnApplication.css';
import { usePopup } from '../../contexts/PopUpContext';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function AnApplication() {
    let { id } = useParams();
    const { showPopup } = usePopup();
    const navigate = useNavigate();
    const [student_name, setStudentName] = useState("");
    const [student_class, setStudentClass] = useState(null);
    const [student_department, setStudentDepartment] = useState("");
    const [student_faculty, setStudentFaculty] = useState("");
    const [status, setStatus] = useState("");
    const [date, setDate] = useState("");

    useEffect(() => {
        //fetch_data();
    }, []);

    const fetch_data = async () => {
        try {
            const response = await fetch(`//TODO//`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
    
            if (response.status === 200) {
                /* TODO with response data setStates */
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

    const open_letter_handler = () => {
        // TODO //
    };

    const open_form_handler = () => {
        // TODO //
    };

    const approve_letter_handler = () => {
        // TODO //
    };

    const disapprove_letter_handler = () => {
        // TODO //
    };

    const approve_form_handler = () => {
        // TODO //
    };

    const disapprove_form_handler = () => {
        // TODO //
    };

    return (
        <div className='anApplication-container' style={{display:(id) ? "block" : "none"}}>
            <h2> Application of <i id='std-anapp-name'>{student_name}</i></h2>
            <div>
                <div id='info-openForm-content'>
                    <div id='std-info-content'>
                        <p>Application status: <i className='std-info-status'>{status}</i></p>
                        <p>Application date: <i className='std-info'>{date}</i></p>
                        <p>Student Faculty: <i className='std-info'>{student_faculty}</i></p>
                        <p>Student Department: <i className='std-info'>{student_department}</i></p>
                        <p>Student Class: <i className='std-info'>{student_class}</i></p>
                    </div>
                    <div id='open-forms-container'>
                        <button id='btn-open-letter' onClick={open_letter_handler}>Open the Application Letter</button>
                        <button id='btn-open-form' onClick={open_form_handler}>Open the Application Form</button>
                    </div>
                </div>
                <div id='approve-disapprove-container'>
                    <button id='btn-approve-letter' onClick={approve_letter_handler}>Approve Application Letter</button>
                    <button id='btn-disapprove-letter' onClick={disapprove_letter_handler}>Disapprove Application Letter</button>
                    <button id='btn-approve-form' onClick={approve_form_handler}>Approve Application Form</button>
                    <button id='btn-disapprove-form' onClick={disapprove_form_handler}>Disapprove Application Form</button>
                </div>
            </div>


        </div >
    )
}

export default AnApplication

import React, { useState, useEffect } from 'react'
import '../../styles/AnApplication.css';
import { useUser } from "../../contexts/UserContext";
import { usePopup } from '../../contexts/PopUpContext';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import FeedbackPage from '../FeedbackPage';

function AnApplication() {
    let { id } = useParams();
    const { user } = useUser();
    const { showPopup } = usePopup();
    const navigate = useNavigate();
    const [student_mail, setStudentMail] = useState("");
    const [student_class, setStudentClass] = useState(null);
    const [student_department, setStudentDepartment] = useState("");
    const [student_faculty, setStudentFaculty] = useState("");
    const [status, setStatus] = useState("");
    const [date, setDate] = useState("");
    const [updated_date, setUpdatedDate] = useState("");
    const [refresh, setRefresh] = useState(false);
    const [feedback_page_status, setFeedbackPageStatus] = useState(false);

    useEffect(() => {
        fetch_data();
    }, [refresh]);

    const fetch_data = async () => {
        try {
            const response = await fetch(`http://localhost:3000/company/getApplicationsById`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ announcementId: id, companyMail: user.user.companyMail })
            });
    
            if (response.status === 200) {
                const json_data = await response.json();
                setStudentMail(json_data.applications[0].studentMail);
                fetch_data_2(json_data.applications[0].studentMail);
                setStatus(json_data.applications[0].status);
                setDate(json_data.applications[0].createdAt);
                setUpdatedDate(json_data.applications[0].updatedAt);
            } else {
                if (response.status === 400)
                    showPopup("error", "Given application does not exist !");
                else if (response.status === 500)
                    showPopup("error", "Internal server error occured !");
                navigate(`/company_an_application/${id}`);
            }
        } catch (error) {
            showPopup("error", "There is a problem in connection");
            navigate(`/company_an_application/${id}`);
        }
    };

    const fetch_data_2 = async (studentMail) => {
        console.log("eğer bunu gördüysen sı.tın");
        try {
            const response = await fetch(`http://localhost:3000/getApplication`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ announcementId: id, companyMail: user.user.companyMail, studentMail })
            });
    
            if (response.status === 200) {
                const json_data = await response.json();
                console.log(json_data);
                setStudentClass(json_data.value.gradeNumber);
                setStudentDepartment(json_data.value.department);
                setStudentFaculty(json_data.value.faculty);
            } else {
                if (response.status === 400)
                    showPopup("error", "Given application does not exist !");
                else if (response.status === 500)
                    showPopup("error", "Internal server error occured !");
                navigate(`/company_an_application/${id}`);
            }
        } catch (error) {
            showPopup("error", "There is a problem in connection");
            navigate(`/company_an_application/${id}`);
        }
    };

    const open_letter_handler = (id, studentMail) => {
        const companyMail = user.user.companyMail;
        navigate(`/application_letter/${id}/${studentMail}/${companyMail}`);
    };

    const open_form_handler = () => {
        // TODO //
    };

    const approve_letter_handler = async () => {
        try {
            const response = await fetch(`http://localhost:3000/company/acceptApplicationLetter`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ announcementId: id, companyMail: user.user.companyMail, studentMail: student_mail })
            });
    
            if (response.status === 200) {
                showPopup("success", "Application letter approved");
                setRefresh(!refresh);
            } else {
                if (response.status === 400)
                    showPopup("error", "Given application does not exist !");
                else if (response.status === 500)
                    showPopup("error", "Internal server error occured !");
                navigate(`/company_an_application/${id}`);
            }
        } catch (error) {
            showPopup("error", "There is a problem in connection");
            navigate(`/company_an_application/${id}`);
        }
    }

    const disapprove_letter_handler = async () => {
        setFeedbackPageStatus(true);
    };

    const approve_form_handler = () => {
        // TODO //
    };

    const disapprove_form_handler = () => {
        // TODO //
    };

    const feedback_send_handler = async (feedback) => {
        try {
            const response = await fetch(`http://localhost:3000/sendFeedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ announcementId: id, companyMail: user.user.companyMail, studentMail: student_mail, content: feedback })
            });
    
            if (response.status === 200) {
                showPopup("info", "Application letter rejected");
                setRefresh(!refresh);
            } else {
                if (response.status === 400)
                    showPopup("error", "Given application does not exist !");
                else if (response.status === 500)
                    showPopup("error", "Internal server error occured !");
                navigate(`/company_an_application/${id}`);
            }
        } catch (error) {
            showPopup("error", "There is a problem in connection");
            navigate(`/company_an_application/${id}`);
        }
    }

    const feedback_reject_handler = () => {
        setFeedbackPageStatus(false);
    };

    return (
        <>
            <div className='anApplication-container' style={{display: (feedback_page_status) ? "none" : "block"}}>
                <h2> Application of <i id='std-anapp-name'>{student_mail}</i></h2>
                <div>
                    <div id='info-openForm-content'>
                        <div id='std-info-content'>
                            <p>Application status: <i className='std-info-status'>{status}</i></p>
                            <p>Application date: <i className='std-info'>{new Date(date).toLocaleString()}</i></p>
                            <p>Last Updated: <i className='std-info'>{new Date(updated_date).toLocaleString()}</i></p>
                            <p>Student Faculty: <i className='std-info'>{student_faculty}</i></p>
                            <p>Student Department: <i className='std-info'>{student_department}</i></p>
                            <p>Student Class: <i className='std-info'>{student_class}</i></p>
                        </div>
                        <div id='open-forms-container'>
                            <button id='btn-open-letter' onClick={() => {open_letter_handler(id, student_mail)}}>Open the Application Letter</button>
                            <button id='btn-open-form' onClick={open_form_handler}>Open the Application Form</button>
                        </div>
                    </div>
                    <div id='approve-disapprove-container'>
                        <button id='btn-approve-letter' style={{display: (status === "application letter created" ? "block" : "none")}} onClick={approve_letter_handler}>{(status !== "application letter is accepted") ? "Approve Application Letter" : "Application Letter Approved"}</button>
                        <button id='btn-disapprove-letter' style={{display: (status === "application letter created" ? "block" : "none")}} onClick={disapprove_letter_handler}>Disapprove Application Letter</button>
                        <button id='btn-approve-form' onClick={approve_form_handler}>Approve Application Form</button>
                        <button id='btn-disapprove-form' onClick={disapprove_form_handler}>Disapprove Application Form</button>
                    </div>
                </div>
            </div >

            <div style={{display: (feedback_page_status) ? "block" : "none"}}><FeedbackPage publish_handler={feedback_send_handler} reject_handler={feedback_reject_handler}/></div>
        </>
    )
}

export default AnApplication

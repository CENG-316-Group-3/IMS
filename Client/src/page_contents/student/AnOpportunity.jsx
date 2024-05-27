import React, { useState, useEffect } from 'react'
import "../../styles/AnOpportunity.css";
import buildIcon from "../../assets/buildings.png"
import { usePopup } from '../../contexts/PopUpContext';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

function AnOpportunity() {
    let { id } = useParams();
    const { user } = useUser();
    const { showPopup } = usePopup();
    const navigate = useNavigate();
    const [company_name, setCompanyName] = useState("");
    const [company_email, setCompanyEmail] = useState("");
    const [position, setPosition] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [updated_date, setUpdatedDate] = useState("");
    const [application_status, setApplicationStatus] = useState(null);

    useEffect(() => {
        fetch_data_1();
    }, []);

    useEffect(() => {
        if (company_email)
            fetch_data_2();
    }, [company_email]);

    const fetch_data_1 = async () => {
        try {
            const response = await fetch(`http://localhost:3000/ims/student/get-announcement`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
    
            if (response.status === 200) {
                const json_data = await response.json();
                setCompanyName(""); // TODO
                setCompanyEmail(json_data[0].user_mail);
                setPosition(json_data[0].position);
                setDescription(json_data[0].content);
                setDate(json_data[0].createdAt);
                setUpdatedDate(json_data[0].updatedAt);
            } else {
                if (response.status === 400)
                    showPopup("error", "Given opportunity does not exist !");
                else if (response.status === 500)
                    showPopup("error", "Internal server error occured !");
                navigate("/student_opportunities");
            }
        } catch (error) {
            showPopup("error", "There is a problem in connection");
            navigate("/student_opportunities");
        }
    };

    const fetch_data_2 = async () => {
        try {
            const response = await fetch(`http://localhost:3000/student/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ announcementId: id, companyMail: company_email, studentMail: user.user[user.role+"Mail"] })
            });
            if (response.status === 200) {
                setApplicationStatus(true);
            } else {
                if (response.status === 400)
                    setApplicationStatus(false);
                else if (response.status === 500){
                    showPopup("error", "Internal server error occured !");
                    navigate("/student_opportunities");
                }
            }
        } catch (error) {
            showPopup("error", "There is a problem in connection");
            navigate("/student_opportunities");
        }
    };

    const download_handler = () => {

    };

    const apply_handler = async () => {
        try {
            const response = await fetch(`http://localhost:3000/student/applyToInternship`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ announcementId: id, companyMail: company_email, studentMail: user.user[user.role+"Mail"] })
            });
    
            if (response.status === 200) {
                showPopup("success", "You applied successfully");
                setApplicationStatus(true);
            } else {
                if (response.status === 400)
                    showPopup("error", "Given opportunity does not exist !");
                else if (response.status === 500)
                    showPopup("error", "Internal server error occured !");
                navigate("/student_opportunities");
            }
        } catch (error) {
            showPopup("error", "There is a problem in connection");
            navigate("/student_opportunities");
        }
    };

    const cancel_application_handler = async () => {
        try {
            const response = await fetch(`http://localhost:3000/student/cancelApplication`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ announcementId: id, companyMail: company_email, studentMail: user.user[user.role+"Mail"] })
            });
    
            if (response.status === 200) {
                showPopup("info", "Application letter canceled");
                setApplicationStatus(false);
            } else {
                if (response.status === 400)
                    showPopup("error", "Given opportunity does not exist !");
                else if (response.status === 500)
                    showPopup("error", "Internal server error occured !");
                navigate("/student_opportunities");
            }
        } catch (error) {
            showPopup("error", "There is a problem in connection");
            navigate("/student_opportunities");
        }
    };

    return (
        <div className='an_opportunity_container'>
            <h2>Internship Announcement</h2>
            <div className="an_opportunity_content_up">

                <div id="company_logo ">
                    <img src={buildIcon} alt="Company Logo" />
                </div>
                <div id='company_details'>
                    <div>Company Name: {company_name}</div>
                    <div>Company Email: {company_email}</div>
                    <div>Position: {position}</div>
                    <div>Created Date: {date}</div>
                    <div>Last Updated: {updated_date}</div>
                </div>
            </div>
            <div>
                <div style={{display: (description == "" ? "none": "block")}}>Description:
                    <div id='int-ann-desc-detail'>
                        {description}
                    </div>
                </div>
            </div>
            <div id='internship-apply-btn-div'>
                <button className='edit-btn' id='download-file-btn' onClick={download_handler}>Download File</button>
                <button className='publish-btn' style={{backgroundColor: (application_status) ? "red" : "green"}} onClick={(application_status) ? cancel_application_handler : apply_handler} >{(application_status) ? "CANCEL APPLICATION" : "APPLY"}</button>
            </div>
        </div>
    )
}

export default AnOpportunity
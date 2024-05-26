import React, { useState, useEffect } from 'react';
import "../../styles/AnOpportunity.css";
import buildIcon from "../../assets/buildings.png"
import { usePopup } from '../../contexts/PopUpContext';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import FeedbackPage from '../FeedbackPage';

function CompInternshipDetailPage() {
    let { id } = useParams();
    const { showPopup } = usePopup();
    const navigate = useNavigate();
    const [company_email, setCompanyEmail] = useState("");
    const [announcement_date, setAnnouncementDate] = useState("");
    const [position, setPosition] = useState("");
    const [description, setDescription] = useState("");
    const [feedback_page_status, setFeedbackPageStatus] = useState(false);

    useEffect(() => {
        fetch_data();
    }, []);

    const fetch_data = async () => {
        try {
            const response = await fetch(`http://localhost:3000/ims/admin/get-announcement`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
    
            if (response.status === 200) {
                const json_data = await response.json();
                setCompanyEmail(json_data[0].user_mail);
                setAnnouncementDate(json_data[0].createdAt);
                setPosition(json_data[0].position);
                setDescription(json_data[0].content);
            } else {
                if (response.status === 400)
                    showPopup("error", "Given announcement does not exist !");
                else if (response.status === 500)
                    showPopup("error", "Internal server error occured !");
                navigate("/main");
            }
        } catch (error) {
            showPopup("error", "There is a problem in connection");
            navigate("/main");
        }
    };

    const approve_handler = async () => {
        try {
            const response = await fetch(`http://localhost:3000/ims/admin/approve-announcement`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, user_mail: company_email })
            });
    
            if (response.status === 200) {
                showPopup("info", `${company_email}'s announcement approved`);
                navigate("/coordinator_internship_opportunity_requests");
            } else {
                if (response.status === 400)
                    showPopup("error", "Given announcement does not exist !");
                else if (response.status === 500)
                    showPopup("error", "Internal server error occured !");
                navigate("/coordinator_internship_opportunity_requests");
            }
        } catch (error) {
            showPopup("error", "There is a problem in connection");
            navigate("/coordinator_internship_opportunity_requests");
        }
    };

    const feedback_send_handler = async (feedback) => {
        try {
            const response = await fetch(`http://localhost:3000/ims/admin/reject-announcement`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_mail: company_email, id, content: feedback })
            });
    
            if (response.status === 200) {
                showPopup("info", "Announcement rejected");
            } else {
                if (response.status === 400)
                    showPopup("error", "Given announcement does not exist !");
                else if (response.status === 500)
                    showPopup("error", "Internal server error occured !");
                navigate("/main");
            }
        } catch (error) {
            showPopup("error", "There is a problem in connection");
            navigate("/main");
        }

        navigate("/coordinator_internship_opportunity_requests");
    }

    const feedback_reject_handler = () => {
        setFeedbackPageStatus(false);
    };

    return (
        <>
        <div className='an_opportunity_container' style={{display: (feedback_page_status) ? "none" : "block"}}>
            <h2>Internship Announcement</h2>
            <div className="an_opportunity_content_up">

                <div id="company_logo ">
                    <img src={buildIcon} alt="Company Logo" />
                </div>
                <div id='company_details'>
                    <div>Company Email: {company_email}</div>
                    <div>Announcement Date: {announcement_date}</div>
                    <div>Position: {position}</div>
                </div>
            </div>
            <div className="an_opportunity_content_down">
                <div>Description:
                    <div id='int-ann-desc-detail'>
                        {description}
                    </div>
                </div>
            </div>
            <div id='internship-apply-btn-div'>
                <button className='publish-btn' onClick={approve_handler}>APPROVE</button>
                <button className='cancel-btn' onClick={() => {setFeedbackPageStatus(true)}}>DISAPPROVE</button>
            </div>
        </div>
        <div style={{display: (feedback_page_status) ? "block" : "none"}}><FeedbackPage publish_handler={feedback_send_handler} reject_handler={feedback_reject_handler}/></div>
        </>
    )
}

export default CompInternshipDetailPage

import React, { useState, useEffect } from 'react'
import "../../styles/StdAnApplication.css";
import { usePopup } from '../../contexts/PopUpContext';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function StdAnApplication() {
    let { id } = useParams();
    const { showPopup } = usePopup();
    const navigate = useNavigate();
    const [company_name, setCompanyName] = useState("");
    const [position, setPosition] = useState("");
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
                navigate("/student_applications");
            }
        } catch (error) {
            showPopup("error", "There is a problem in connection");
            navigate("/student_applications");
        }
    };

    const open_letter_handler = () => {
        // TODO //
    };

    const open_form_handler = () => {
        // TODO //
    };

    const send_letter_handler = () => {
        // TODO //
    };

    const send_form_handler = () => {
        // TODO //
    };

    const download_ssi_handler = () => {
        // TODO //
    };

    const cancel_application_handler = () => {
        // TODO //
    };

    return (
        <div>
            <div className='anApplication-container'>
                <h2> Application of <i id='std-anapp-name'>{company_name}</i> Internship</h2>

                <div id='info-openForm-content'>
                    <div id='std-info-content'>
                        <p>Application status: <i className='std-info-status'>{status}</i></p>
                        <p>Application date: <i className='std-info'>{date}</i></p>
                        <p>Position: <i className='std-info'>{position}</i></p>

                    </div>
                    <div id='open-forms-container'>
                        <div id='open-forms-send-btns'>
                            <button id='btn-open-letter' onClick={send_letter_handler}>Send the Application Letter</button>
                            <button id='view-btn' onClick={open_letter_handler}>View</button>
                            <button id='btn-open-form' onClick={send_form_handler}>Send the Application Form</button>
                            <button id='view-btn' onClick={open_form_handler}>View</button>
                        </div>
                    </div>
                </div>
                <div id='other-btns'>
                    <button id='ssi-doc-download-btn' onClick={download_ssi_handler}>Download SSI Document</button>
                    <button className='std-cancel-btn' onClick={cancel_application_handler}>CANCEL THE APPLICATION </button>
                </div>

            </div >
        </div>
    )
}

export default StdAnApplication

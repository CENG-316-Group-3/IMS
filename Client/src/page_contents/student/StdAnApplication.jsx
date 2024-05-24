import React from 'react'
import "../../styles/StdAnApplication.css";

function StdAnApplication() {
    const applicaton = {
        id: 1,
        company_name: 'Company A',
        position: 'Front-End Internship',
        status: 'Application Letter Send',
        date: '2024-05-21',
    };
    return (
        <div>
            <div className='anApplication-container'>
                <h2> Application of <i id='std-anapp-name'>{applicaton.company_name}</i> Internship</h2>

                <div id='info-openForm-content'>
                    <div id='std-info-content'>
                        <p>Application status: <i className='std-info-status'>{applicaton.status}</i></p>
                        <p>Application date: <i className='std-info'>{applicaton.date}</i></p>
                        <p>Position: <i className='std-info'>{applicaton.position}</i></p>

                    </div>
                    <div id='open-forms-container'>
                        <div id='open-forms-send-btns'>
                            <button id='btn-open-letter'>Send the Application Letter</button>
                            <button id='view-btn'>View</button>
                            <button id='btn-open-form'>Send the Application Form</button>
                            <button id='view-btn'>View</button>
                        </div>
                    </div>
                </div>
                <div id='other-btns'>
                    <button id='ssi-doc-download-btn'>Download SSI Document</button>
                    <button className='std-cancel-btn'>CANCEL THE APPLICATION </button>
                </div>

            </div >
        </div>
    )
}

export default StdAnApplication

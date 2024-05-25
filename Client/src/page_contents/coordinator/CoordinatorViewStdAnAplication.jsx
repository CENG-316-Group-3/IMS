import React from 'react'
import "../../styles/CoordinatorViewStdAnAplication.css";
import buildIcon from "../../assets/buildings.png"

function CoordinatorViewStdAnAplication() {
    const comp_internship_announcement = { id: 1, company_name: "Company A", company_email: "company@mail.com", announcement_date: "20/05/2024", position: "Front-End Internship", description: "Lorem ipsum dolar sit amet,Lorem ipsum dolar sit amet,Lorem ipsum dolar sit amet,Lorem ipsum dolar sit amet," };

    const std_internship_application = { std_id: "280201XXX", std_name: "Student A", std_email: "student@mail.com", application_date: "24/05/2024", status: "Applicaiton Letter" };


    return (
        <div className='an_opportunity_container'>
            <h2>Internship Application</h2>
            <div className="an_opportunity_content_up">

                <div id="company_logo ">
                    <img src={buildIcon} alt="Company Logo" />
                </div>
                <div id='company_details'>

                    <div>Company Name: {comp_internship_announcement.company_name}</div>
                    <div>Company Email: {comp_internship_announcement.company_email}</div>
                    <div>Announcement Date: {comp_internship_announcement.announcement_date}</div>
                    <div>Position: {comp_internship_announcement.position}</div>
                </div>
            </div>
            <div className="an_opportunity_content_down">
                <div>Description:
                    <div id='int-ann-desc-detail'>
                        {comp_internship_announcement.description}
                    </div>
                </div>
            </div>
            {/* <div id='internship-apply-btn-div'>
                <button className='edit-btn' id='download-file-btn'>Download File</button>
                <button className='publish-btn'>APPLY</button>
            </div> */}
            <div className='std-infos-container'>
                <h3>Student Application</h3>
                <div className='std-infos'>
                    <div>Student ID: {std_internship_application.std_id}</div>
                    <div>Student Name: {std_internship_application.std_name}</div>
                    <div>Student Email: {std_internship_application.std_email}</div>
                    <div>Application Date: {std_internship_application.application_date}</div>
                    <div>Status: {std_internship_application.status}</div>
                </div>
            </div>
            <div className='review-buttons-container'>
                <button className='coord-open-btn'>Open the Application Letter</button>
                <button className='coord-open-btn'>Open the Application Form</button>
            </div>
            <div className='approve-rejecet-buttons-container'>
                <button className='coord-publish-btn'>APPROVE APPLICATION</button>
                <button className='coord-cancel-btn'>DISAPPROVE APPLICATION</button>
            </div>

        </div>
    )
}

export default CoordinatorViewStdAnAplication

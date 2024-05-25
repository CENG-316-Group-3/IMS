import React from 'react'
import "../../styles/AnOpportunity.css";
import buildIcon from "../../assets/buildings.png"

function CompInternshipDetailPage() {

    const internship_announcement_request = { id: 1, company_name: "Company A", company_email: "company@mail.com", announcement_date: "24/05/2024", position: "Front-End Internship", description: "Lorem ipsum dolar sit amet,Lorem ipsum dolar sit amet,Lorem ipsum dolar sit amet,Lorem ipsum dolar sit amet," };

    return (
        <div className='an_opportunity_container'>
            <h2>Internship Announcement</h2>
            <div className="an_opportunity_content_up">

                <div id="company_logo ">
                    <img src={buildIcon} alt="Company Logo" />
                </div>
                <div id='company_details'>

                    <div>Company Name: {internship_announcement_request.company_name}</div>
                    <div>Company Email: {internship_announcement_request.company_email}</div>
                    <div>Announcement Date: {internship_announcement_request.announcement_date}</div>
                    <div>Position: {internship_announcement_request.position}</div>
                </div>
            </div>
            <div className="an_opportunity_content_down">
                <div>Description:
                    <div id='int-ann-desc-detail'>
                        {internship_announcement_request.description}
                    </div>
                </div>
            </div>
            <div id='internship-apply-btn-div'>
                <button className='publish-btn'>APPROVE</button>
                <button className='cancel-btn'>DISAPPROVE</button>
            </div>
        </div>
    )
}

export default CompInternshipDetailPage

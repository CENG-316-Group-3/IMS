import React from 'react'
import "../../styles/StdCoordinatorAnnViewPage.css"

function StdCoordinatorAnnViewPage() {
    const announcement = { id: 1, title: 'Internship Guideline', date: '2024-05-21', description: 'This is the guideline for the internship. Please read it carefully. The internship program is designed to provide students with hands-on experience in their field of study. It is important to follow all guidelines to ensure a successful internship. Make sure to complete all required tasks and submit your reports on time. For any questions, contact your coordinator.', }
    return (
        <div className='std_an_announcement_view_container'>
            <h2>{announcement.title}</h2>
            <p>{announcement.date}</p>
            <div className='ann-description'>
                <h3>Description:</h3>
                <p >{announcement.description}</p>
            </div>

        </div>
    )
}

export default StdCoordinatorAnnViewPage




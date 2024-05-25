import React from 'react'
import '../../styles/AnApplication.css';

function AnApplication() {
    const applicaton = {
        id: 1,
        student_name: 'Sıddık Can Boru',
        std_class: '3th Grade',
        std_department: 'Computer Engineering',
        std_faculty: 'Engineering',

        status: 'Application Letter Send',
        date: '2024-05-21',
        text: 'This is the application text.',
    };
    return (
        <div className='anApplication-container'>
            <h2> Application of <i id='std-anapp-name'>{applicaton.student_name}</i></h2>
            <div>
                <div id='info-openForm-content'>
                    <div id='std-info-content'>
                        <p>Application status: <i className='std-info-status'>{applicaton.status}</i></p>
                        <p>Application date: <i className='std-info'>{applicaton.date}</i></p>
                        <p>Student Faculty: <i className='std-info'>{applicaton.std_faculty}</i></p>
                        <p>Student Department: <i className='std-info'>{applicaton.std_department}</i></p>
                        <p>Student Class: <i className='std-info'>{applicaton.std_class}</i></p>
                    </div>
                    <div id='open-forms-container'>
                        <button id='btn-open-letter'>Open the Application Letter</button>
                        <button id='btn-open-form'>Open the Application Form</button>
                    </div>
                </div>
                <div id='approve-disapprove-container'>
                    <button id='btn-approve-letter'>Approve Application Letter</button>
                    <button id='btn-disapprove-letter'>Disapprove Application Letter</button>
                    <button id='btn-approve-form'>Approve Application Form</button>
                    <button id='btn-disapprove-form'>Disapprove Application Form</button>
                </div>
            </div>


        </div >
    )
}

export default AnApplication

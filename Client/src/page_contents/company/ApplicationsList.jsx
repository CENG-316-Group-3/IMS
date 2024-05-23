import React from 'react'
import '../../styles/Applications.css';
import '../../styles/Buttons.css'

function Applications() {

    const applications = [
        { id: 1, title: 'Application 1', date: '2024-05-21', student_name: 'Student 1', application_status: 'Application Letter' },
        { id: 2, title: 'Application 2', date: '2024-05-20', student_name: 'Student 2', application_status: 'Application Form' },
        { id: 3, title: 'Application 3', date: '2024-05-19', student_name: 'Student 3 ', application_status: 'Application Letter' },
        { id: 4, title: 'Application 4', date: '2024-05-18', student_name: 'Student 4', application_status: 'Application Form' },
    ];

    const handleCheck = (id) => {
        // Check logic here
        console.log(`Check application with id: ${id}`);
    };

    return (
        <div className="applications-container">
            <h2>Applications</h2>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Student Name</th>
                        <th>Application Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((application) => (
                        <tr key={application.id}>
                            <td>{application.title}</td>
                            <td>{application.date}</td>
                            <td>{application.student_name}</td>
                            <td>{application.application_status}</td>
                            <td >
                                <button
                                    className="edit-btn"
                                    onClick={() => handleCheck(application.id)}
                                >
                                    CHECK
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Applications

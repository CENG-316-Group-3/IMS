import React from 'react';
import "../../styles/Applications.css";
const StudentApplicationList = () => {
    const applications = [
        { id: 1, title: 'Application 1', date: '2024-05-21', company_name: 'Company A', application_status: 'Application Letter' },
        { id: 2, title: 'Application 2', date: '2024-05-20', company_name: 'Company B', application_status: 'Application Form' },
        { id: 3, title: 'Application 3', date: '2024-05-19', company_name: 'Company C ', application_status: 'Application Letter' },
        { id: 4, title: 'Application 4', date: '2024-05-18', company_name: 'Company D', application_status: 'Application Form' },
    ];

    const handleCheck = (id) => {
        // Check logic here
        console.log(`Check application with id: ${id}`);
    };
    return (
        <div className="applications-container">
            <h2>My Applications</h2>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Company Name</th>
                        <th>Application Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((application) => (
                        <tr key={application.id}>
                            <td>{application.title}</td>
                            <td>{application.date}</td>
                            <td>{application.company_name}</td>
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
    );
};

export default StudentApplicationList;
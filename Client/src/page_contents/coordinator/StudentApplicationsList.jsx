import React, { useState } from 'react';
import "../../styles/StudentApplicationsList.css";


const ITEMS_PER_PAGE = 6;

function StudentApplicationsList() {
    const [file, setFile] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSave = (e) => {
        e.preventDefault();
        setFile(e.target.files[0]);
        // Form submission logic here
        console.log({ file });
    };

    const applications = [
        { id: 1, company_name: 'Company A', date: '2024-05-21', student_name: 'Student 1', application_status: 'Application Letter' },
        { id: 2, company_name: 'Company A', date: '2024-05-20', student_name: 'Student 2', application_status: 'Application Form' },
        { id: 3, company_name: 'Company A', date: '2024-05-19', student_name: 'Student 3 ', application_status: 'Application Form' },
        { id: 4, company_name: 'Company A', date: '2024-05-18', student_name: 'Student 4', application_status: 'Application Form' },
        { id: 5, company_name: 'Company A', date: '2024-05-17', student_name: 'Student 5', application_status: 'Application Letter' },
        { id: 6, company_name: 'Company A', date: '2024-05-16', student_name: 'Student 6', application_status: 'Application Letter' },
        { id: 7, company_name: 'Company A', date: '2024-05-15', student_name: 'Student 7', application_status: 'Application Letter' },
        { id: 8, company_name: 'Company A', date: '2024-05-14', student_name: 'Student 8', application_status: 'Application Form' },
        { id: 9, company_name: 'Company A', date: '2024-05-13', student_name: 'Student 9', application_status: 'Application Form' },
        { id: 10, company_name: 'Company A', date: '2024-05-12', student_name: 'Student 10', application_status: 'Application Letter' },
        { id: 11, company_name: 'Company A', date: '2024-05-11', student_name: 'Student 11', application_status: 'Application Form' },
        { id: 12, company_name: 'Company A', date: '2024-05-10', student_name: 'Student 12', application_status: 'Application Form' },
        // Daha fazla veri eklenebilir
    ];

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const paginatedData = applications.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalPages = Math.ceil(applications.length / ITEMS_PER_PAGE);

    return (
        <div className="applications-container">
            <h2>Student Applications List</h2>
            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Company Name</th>
                        <th>Date</th>
                        <th>Application Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((application) => (
                        <tr key={application.id}>
                            <td>{application.student_name}</td>
                            <td>{application.company_name}</td>
                            <td>{application.date}</td>
                            <td style={{ textShadow: "black 0px 0.8px 0.9px" }}>{application.application_status}</td>
                            <td>
                                <button className='edit-btn'>CHECK</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handleClick(index + 1)}
                        className={currentPage === index + 1 ? 'active' : ''}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default StudentApplicationsList

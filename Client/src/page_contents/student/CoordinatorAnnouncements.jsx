import React, { useState } from 'react';
import "../../styles/StdCoordinatorAnnouncements.css";

const ITEMS_PER_PAGE = 6;

function CoordinatorAnnouncements() {

    const [currentPage, setCurrentPage] = useState(1);

    const coor_announcements = [
        { id: 1, title: 'Internship Guideline', date: '2024-05-21' },
        // Daha fazla veri eklenebilir
    ];

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const paginatedData = coor_announcements.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalPages = Math.ceil(coor_announcements.length / ITEMS_PER_PAGE);
    return (
        <div className='std-coordinator-announcements-container'>
            <h2>Coordinator Announcements</h2>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((announcement) => (
                        <tr key={announcement.id}>
                            <td>{announcement.title}</td>
                            <td>{announcement.date}</td>
                            <td><button className='edit-btn'>CHECK</button></td>
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

export default CoordinatorAnnouncements

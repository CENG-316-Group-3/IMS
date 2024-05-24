import React, { useState } from 'react';
import '../../styles/Opportunities.css'
import garantiLogo from '../../assets/garanti_logo.png'
import aselsanLogo from '../../assets/aselsan_logo.png'

const opportunities = [
    // Örnek veriler
    { id: 1, logo: garantiLogo, title: 'Internship Announcement 1', announcement_date: '24/10/2024', position: 'Front-End Developer' },
    { id: 2, logo: garantiLogo, title: 'Internship Announcement 2', announcement_date: '24/10/2024', position: 'Front-End Developer' },
    { id: 3, logo: aselsanLogo, title: 'Internship Announcement 3', announcement_date: '24/10/2024', position: 'Front-End Developer' },
    { id: 4, logo: aselsanLogo, title: 'Internship Announcement 4', announcement_date: '24/10/2024', position: 'Front-End Developer' },
    { id: 5, logo: garantiLogo, title: 'Internship Announcement 5', announcement_date: '24/10/2024', position: 'Front-End Developer' },
    { id: 6, logo: garantiLogo, title: 'Internship Announcement 6', announcement_date: '24/10/2024', position: 'Front-End Developer' },
    { id: 7, logo: aselsanLogo, title: 'Internship Announcement 7', announcement_date: '24/10/2024', position: 'Front-End Developer' },
    { id: 8, logo: aselsanLogo, title: 'Internship Announcement 8', announcement_date: '24/10/2024', position: 'Front-End Developer' },
    { id: 9, logo: garantiLogo, title: 'Internship Announcement 9', announcement_date: '24/10/2024', position: 'Front-End Developer' },
    { id: 10, logo: garantiLogo, title: 'Internship Announcement 10', announcement_date: '24/10/2024', position: 'Front-End Developer' },
    { id: 11, logo: aselsanLogo, title: 'Internship Announcement 11', announcement_date: '24/10/2024', position: 'Front-End Developer' },
    { id: 12, logo: garantiLogo, title: 'Internship Announcement 12', announcement_date: '24/10/2024', position: 'Front-End Developer' },
    // Daha fazla veri eklenebilir
];

const ITEMS_PER_PAGE = 6;

function Opportunities() {
    const [currentPage, setCurrentPage] = useState(1);

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const paginatedData = opportunities.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalPages = Math.ceil(opportunities.length / ITEMS_PER_PAGE);

    return (
        <div className="opportunities-container">
            <h2>Opportunities</h2>
            <div className="opportunity-list">
                {paginatedData.map((opportunity) => (
                    <div key={opportunity.id} className="opportunity-card">
                        <div className="opp-logo background_contain" style={{ backgroundImage: `url(${opportunity.logo})` }}></div>
                        <div className="opp-details">
                            <h3>{opportunity.title}</h3>
                            <p>{opportunity.announcement_date}</p>
                            <p>{opportunity.position}</p>
                        </div>
                    </div>
                ))}
            </div>
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
    );
}

export default Opportunities;

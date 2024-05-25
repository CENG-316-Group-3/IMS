import React, { useState, useEffect } from 'react';
import { useUser } from "../../contexts/UserContext";
import { usePopup } from '../../contexts/PopUpContext';
import { useNavigate } from 'react-router-dom';
import EmptyContent from "../../components/EmptyContent";
import '../../styles/Opportunities.css'
// import garantiLogo from '../../assets/garanti_logo.png'
// import aselsanLogo from '../../assets/aselsan_logo.png'

// const o = [
//     { id: 1, logo: garantiLogo, title: 'Internship Announcement 1', announcement_date: '24/10/2024', position: 'Front-End Developer' },
//     { id: 2, logo: garantiLogo, title: 'Internship Announcement 2', announcement_date: '24/10/2024', position: 'Front-End Developer' },
//     { id: 3, logo: aselsanLogo, title: 'Internship Announcement 3', announcement_date: '24/10/2024', position: 'Front-End Developer' },
//     { id: 4, logo: aselsanLogo, title: 'Internship Announcement 4', announcement_date: '24/10/2024', position: 'Front-End Developer' },
// ];

const ITEMS_PER_PAGE = 6;

function Opportunities() {
    const { user } = useUser(); // TODO may delete //
    const { showPopup } = usePopup();
    const navigate = useNavigate();
    const [opportunities, setOpportunities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);


    useEffect(() => {
        //fetch_data();
    }, []);

    const fetch_data = async () => {
        try {
            const response = await fetch(`//TODO//`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ /* TODO */ })
            });
    
            if (response.status === 200) {
                /* TODO with response data setStates */
            } else {
                if (response.status === 400)
                    showPopup("error", "Bad request !");
                else if (response.status === 500)
                    showPopup("error", "Internal server error occured !");
                navigate("/main");
            }
        } catch (error) {
            showPopup("error", "There is a problem in connection");
            navigate("/main");
        }
    };

    const card_handle_click = (id) => {
        navigate(`/student_an_opportunity/:${id}`);
    };

    const pageHandleClick = (pageNumber) => {
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
            <div className="opportunity-list" style={{display: opportunities.length == 0 ? "none" : "block"}}>
                {paginatedData.map((opportunity) => (
                    <div key={opportunity.id} className="opportunity-card" onClick={() => card_handle_click(opportunity.id)}>
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
                        onClick={() => pageHandleClick(index + 1)}
                        className={currentPage === index + 1 ? 'active' : ''}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <div style={{display: opportunities.length == 0 ? "block" : "none"}}><EmptyContent /></div>
        </div>
    );
}

export default Opportunities;

import React, { useState, useEffect } from 'react';
import { usePopup } from '../../contexts/PopUpContext';
import { useNavigate } from 'react-router-dom';
import EmptyContent from "../../components/EmptyContent";
import '../../styles/Opportunities.css'
import company_logo from "../../assets/buildings.png";

const ITEMS_PER_PAGE = 6;

function Opportunities() {
    const { showPopup } = usePopup();
    const navigate = useNavigate();
    const [opportunities, setOpportunities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        fetch_data();
    }, [refresh]);

    const fetch_data = async () => {
        try {
            const response = await fetch(`http://localhost:3000/ims/student/announcement-list`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (response.status === 200) {
                const json_data = await response.json();
                setOpportunities(json_data);
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
        navigate(`/student_an_opportunity/${id}`);
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
            <div className="opportunity-list" style={{display: opportunities.length == 0 ? "none" : "flex"}}>
                {paginatedData.map((opportunity) => (
                    <div key={opportunity.id} className="opportunity-card" onClick={() => card_handle_click(opportunity.id)}>
                        <div className="opp-logo background_contain" style={{ backgroundImage: `url(${company_logo})` }}></div>
                        <div className="opp-details">
                            <h3>{opportunity.companyName} - {opportunity.title}</h3>
                            <p>Position: {opportunity.position}</p>
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

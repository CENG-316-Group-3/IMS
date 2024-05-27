import React, { useState, useEffect } from 'react';
import "../styles/Notifications.css";
import { useUser } from "../contexts/UserContext";
import { usePopup } from "../contexts/PopUpContext";
import { useNavigate } from 'react-router-dom';

function Notifications() {
    const [currentPage, setCurrentPage] = useState(1);
    const [messages, setMessages] = useState([]);
    const { user } = useUser();
    const { showPopup } = usePopup();
    const navigate = useNavigate();

    const ITEMS_PER_PAGE = 10;
    
    useEffect(() => {
        fetch_data();
    }, []);

    const fetch_data = async () => {
        try {
            const response = await fetch(`http://localhost:3000/ims/notifications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ receiver_mail: user.user[`${user.role}`+"Mail"] })
            });
    
            if (response.status === 200) {
                setMessages( await response.json()); // Şu json düzelt
            } else {
                if (response.status === 400)
                    showPopup("error", "Given coordinator does not exist !");
                else if (response.status === 500)
                    showPopup("error", "Internal server error occured !");
                navigate("/main");
            }
        } catch (error) {
            showPopup("error", "There is a problem in connection");
            navigate("/main");
        }
    };

    const handleClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const open_detail_handler = (id) => {
        navigate(`/notification/${id}`);
    }

    const paginatedData = messages.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalPages = Math.ceil(messages.length / ITEMS_PER_PAGE);
    return (
    <div className='notifications_container'>
        <div className="message-container">
            {paginatedData.map(message => (
                <div className="message-row" key={message.id} onClick={() => {open_detail_handler(message.id)}} style={{backgroundColor: (message.has_opened == 0) ? "#f4f4f4" : "#d6d6d6"}}>
                    <span className="message-text">{message.title}</span>
                    <div style={{display: (message.has_opened == 0) ? "block" : "none"}}></div>
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

export default Notifications;
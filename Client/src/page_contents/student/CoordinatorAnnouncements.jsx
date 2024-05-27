import React, { useState, useEffect } from 'react';
import "../../styles/StdCoordinatorAnnouncements.css";
import { usePopup } from '../../contexts/PopUpContext';
import { useNavigate } from 'react-router-dom';
import EmptyContent from "../../components/EmptyContent";

const ITEMS_PER_PAGE = 6;

function CoordinatorAnnouncements() {

    const [currentPage, setCurrentPage] = useState(1);
    const { showPopup } = usePopup();
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        fetch_data();
    }, []);

    const fetch_data = async () => {
        try {
            const response = await fetch(`http://localhost:3000/ims/student/coordinator-announcements`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (response.status === 200) {
                setAnnouncements( await response.json()); // Şu json düzelt
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

    const check_handle = (id) => {
        navigate(`/student_an_announcement/${id}`);
    }

    const paginatedData = announcements.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalPages = Math.ceil(announcements.length / ITEMS_PER_PAGE);
    return (
        <div className='std-coordinator-announcements-container'>
            <h2>Coordinator Announcements</h2>
            <table style={{display: (announcements.length == 0) ? "none" : "block"}}>
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
                            <td>{announcement.createdAt}</td>
                            <td><button className='edit-btn' onClick={() => {check_handle(announcement.id)}}>CHECK</button></td>
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
            <div style={{display: (announcements.length == 0) ? "block" : "none"}}><EmptyContent /></div>
        </div>
    )
}

export default CoordinatorAnnouncements

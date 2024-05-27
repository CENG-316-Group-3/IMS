import React, {useState, useEffect} from 'react';
import "../../styles/StudentApplicationsList.css";
import { usePopup } from '../../contexts/PopUpContext';
import { useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 6;

function CoordinatorViewStdApplicationsList() {
    const { showPopup } = usePopup();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetch_data();
    }, [applications]);

    const fetch_data = async () => {
        try {
            const response = await fetch(`http://localhost:3000/ims/admin/coordinator-announcements`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (response.status === 200) {
                setApplications( await response.json()); // Şu json düzelt
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

export default CoordinatorViewStdApplicationsList

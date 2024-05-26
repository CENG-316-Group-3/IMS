import React, {useState, useEffect} from 'react';
import "../../styles/CompanyRegisterRequestList.css";
import { usePopup } from '../../contexts/PopUpContext';
import { useNavigate } from 'react-router-dom';
import EmptyContent from "../../components/EmptyContent";

const ITEMS_PER_PAGE = 6;

function CompanyRegisterRequestList() {
    const { showPopup } = usePopup();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = React.useState(1);
    const [requests, setRequests] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        fetch_data();
    }, [refresh]);

    const fetch_data = async () => {
        try {
            const response = await fetch(`http://localhost:3000/ims/evaluvate-registration`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
    
            if (response.status === 200) {
                const json_data = await response.json();
                setRequests( json_data.response ); // Şu json düzelt
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

    const approve_handler = async (request) => {
        handler(request, "approve");
    };

    const reject_handler = async (request) => {
        handler(request, "reject");
    };

    const handler = async (request, decision) => {
        try {
            const response = await fetch(`http://localhost:3000/ims/evaluvate-registration`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companyMail: request.companyMail, decision })
            });
    
            if (response.status === 200) {
                showPopup("info", `${request.companyName} register ${decision}`);
                setRefresh(!refresh);
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
    }

    const paginatedData = requests.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);
    return (
        <div className="comp-requests-container">
            <h2>Company Register Requests</h2>
            <table style={{display: (requests.length == 0) ? "none" : "block"}}>
                <thead>
                    <tr>
                        <th>Company Name</th>
                        <th>Company Email</th>
                        <th>Created Date</th>
                        <th>Last Updated</th>
                        <th>Adress</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((request) => (
                        <tr key={request.companyMail}>
                            <td>{request.companyName}</td>
                            <td>{request.companyMail}</td>
                            <td>{request.createdAt}</td>
                            <td>{request.updatedAt}</td>
                            <td>{request.address}</td>
                            <td>
                                <div className='req-approve-reject-btns'>
                                    <button className="req-approve-btn" onClick={() => {approve_handler(request)}}>Approve</button>
                                    <button className="req-reject-btn" onClick={() => {reject_handler(request)}}>Reject</button>
                                </div>
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
            <div style={{display: (requests.length == 0) ? "block" : "none"}}><EmptyContent /></div>
        </div>
    )
}

export default CompanyRegisterRequestList

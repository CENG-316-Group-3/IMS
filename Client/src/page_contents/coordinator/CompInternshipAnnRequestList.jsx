import React, { useState, useEffect } from 'react';
import '../../styles/Applications.css';
import '../../styles/Buttons.css'
import { usePopup } from '../../contexts/PopUpContext';
import { useNavigate } from 'react-router-dom';
import EmptyContent from "../../components/EmptyContent";

function CompInternshipAnnRequestList() {
    const { showPopup } = usePopup();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [refresh, useRefresh] = useState(false);

    useEffect(() => {
        fetch_data();
    }, []);

    const fetch_data = async () => {
        try {
            const response = await fetch(`http://localhost:3000/ims/admin/waiting-announcement-list`, {
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

    const handleCheck = (id) => {
        navigate(`/coordinator_internship_detail_page/${id}`);
    };
    return (
        <div className="applications-container" >
            <h2>Company Internship Announcement Request List</h2>
            <table style={{ display: applications.length == 0 ? "none" : "block" }}>
                <thead>
                    <tr>
                        <th>Company Mail</th>
                        <th>Title</th>
                        <th>Created Date</th>
                        <th>Last Updated</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((application) => (
                        <tr key={application.id}>
                            <td>{application.user_mail}</td>
                            <td>{application.title}</td>
                            <td>{application.createdAt}</td>
                            <td>{application.updatedAt}</td>
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
            <div style={{ display: applications.length == 0 ? "block" : "none" }}><EmptyContent /></div>
        </div>
    )
}

export default CompInternshipAnnRequestList

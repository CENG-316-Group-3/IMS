import React, {useState, useEffect} from 'react';
import '../../styles/Applications.css';
import '../../styles/Buttons.css'
import { useUser } from "../../contexts/UserContext";
import { usePopup } from '../../contexts/PopUpContext';
import { useNavigate } from 'react-router-dom';
import EmptyContent from "../../components/EmptyContent";

function Applications() {
    const { user } = useUser();
    const { showPopup } = usePopup();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        fetch_data();
    }, []);

    const fetch_data = async () => {
        try {
            const response = await fetch(`http://localhost:3000/company/getApplications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companyMail: user.user.companyMail })
            });
            if (response.status === 200) {
                const json_data = await response.json();
                setApplications(json_data.applications);
            } else {
                if (response.status === 400)
                    showPopup("error", "Given company does not exist !");
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
        navigate(`/company_an_application/${id}`);
    };

    return (
        <div className="applications-container" >
            <h2>Applications</h2>
            <table style={{display: applications.length == 0 ? "none" : "block"}}>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Student Name</th>
                        <th>Application Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((application, key) => (
                        <tr key={key}>
                            <td>{application.title}</td>
                            <td>{new Date(application.createdAt).toLocaleString()}</td>
                            <td>{application.studentMail}</td>
                            <td>{application.status}</td>
                            <td >
                                <button
                                    className="edit-btn"
                                    onClick={() => handleCheck(application.announcementId)}
                                >
                                    CHECK
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{display: applications.length == 0 ? "block" : "none"}}><EmptyContent /></div>
        </div>
    )
}

export default Applications

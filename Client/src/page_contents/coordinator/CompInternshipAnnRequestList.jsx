import React, { useState, useEffect } from 'react';
import '../../styles/Applications.css';
import '../../styles/Buttons.css'
import { useUser } from "../../contexts/UserContext";
import { usePopup } from '../../contexts/PopUpContext';
import { useNavigate } from 'react-router-dom';
import EmptyContent from "../../components/EmptyContent";

function CompInternshipAnnRequestList() {
    const a = [
        { id: 1, title: 'Application 1', date: '2024-05-21', company_name: 'Student 1', application_status: 'Application Letter' },
        { id: 2, title: 'Application 2', date: '2024-05-20', company_name: 'Student 2', application_status: 'Application Form' },
        { id: 3, title: 'Application 3', date: '2024-05-19', company_name: 'Student 3 ', application_status: 'Application Letter' },
        { id: 4, title: 'Application 4', date: '2024-05-18', company_name: 'Student 4', application_status: 'Application Form' },
    ];

    const { user } = useUser();
    const { showPopup } = usePopup();
    const navigate = useNavigate();
    const [applications, setApplications] = useState(a);

    useEffect(() => {
        //fetch_data();
    }, []);

    const fetch_data = async () => {
        try {
            const response = await fetch(`//TODO//`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companyMail: user.user.companyMail })
            });

            if (response.status === 200) {
                /* TODO with response data setStates */
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
        navigate(`/company_an_application/:${id}`);
    };
    return (
        <div className="applications-container" >
            <h2>Company Internship Announcement Request List</h2>
            <table style={{ display: applications.length == 0 ? "none" : "block" }}>
                <thead>
                    <tr>
                        <th>Company Name</th>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((application) => (
                        <tr key={application.id}>
                            <td>{application.company_name}</td>
                            <td>{application.title}</td>
                            <td>{application.date}</td>
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

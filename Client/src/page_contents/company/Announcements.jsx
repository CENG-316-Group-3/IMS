import React, {useState, useEffect} from 'react';
import '../../styles/Announcements.css';
import { useUser } from "../../contexts/UserContext";
import { usePopup } from '../../contexts/PopUpContext';
import { useNavigate } from 'react-router-dom';
import EmptyContent from "../../components/EmptyContent";

const Announcements = () => {
    const { user } = useUser();
    const { showPopup } = usePopup();
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);

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

    const handleEdit = (id) => {
        // TODO //
    };

    const handleDelete = (id) => {
        // TODO //
    };

    return (
        <div className="announcements-container">
            <h2>Announcements</h2>
            <table style={{display: announcements.length == 0 ? "none" : "block"}}>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Position</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {announcements.map((announcement) => (
                        <tr key={announcement.id}>
                            <td>{announcement.title}</td>
                            <td>{announcement.position}</td>
                            <td>{announcement.date}</td>
                            <td className="actions">
                                <button
                                    className="edit-btn"
                                    onClick={() => handleEdit(announcement.id)}
                                >
                                    EDIT
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(announcement.id)}
                                >
                                    DELETE
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{display: announcements.length == 0 ? "block" : "none"}}><EmptyContent /></div>
        </div>
    );
};

export default Announcements;

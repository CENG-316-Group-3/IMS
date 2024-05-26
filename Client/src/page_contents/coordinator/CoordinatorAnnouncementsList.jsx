import React, {useState, useEffect} from 'react';
import "../../styles/Announcements.css"
import { useUser } from "../../contexts/UserContext";
import { usePopup } from '../../contexts/PopUpContext';
import { useNavigate } from 'react-router-dom';
import EmptyContent from "../../components/EmptyContent";

function CoordinatorAnnouncementsList() {
    const { user } = useUser();
    const { showPopup } = usePopup();
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        fetch_data();
    }, [refresh]);

    const fetch_data = async () => {
        try {
            const response = await fetch(`http://localhost:3000/ims/admin/coordinator-announcements`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_mail: user.user.coordinatorMail })
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

    const handleEdit = (id) => {
        navigate(`/coordinator_an_announcement/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/ims/admin/delete-announcement`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
    
            if (response.status === 200) {
                showPopup("info", "Announcement deleted");
                setRefresh(!refresh);
            } else {
                if (response.status === 400)
                    showPopup("error", "Given announcement does not exist !");
                else if (response.status === 500)
                    showPopup("error", "Internal server error occured !");
                navigate("/main");
            }
        } catch (error) {
            showPopup("error", "There is a problem in connection");
            navigate("/main");
        }
    };

    return (
        <div className="announcements-container">
            <h2>My Announcements</h2>
            <table style={{display: (announcements.length == 0) ? "none" : "block"}}>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Created Date</th>
                        <th>Last Updated Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {announcements.map((announcement) => (
                        <tr key={announcement.id}>
                            <td>{announcement.title}</td>
                            <td>{announcement.createdAt}</td>
                            <td>{announcement.updatedAt}</td>
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
            <div style={{display: (announcements.length == 0) ? "block" : "none"}}><EmptyContent /></div>
        </div>
    )
}

export default CoordinatorAnnouncementsList

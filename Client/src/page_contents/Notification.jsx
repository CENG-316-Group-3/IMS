import "../styles/Notification.css";
import React, { useState, useEffect } from 'react';
import { useUser } from "../contexts/UserContext";
import { usePopup } from "../contexts/PopUpContext";
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function Notification() {
    let { id } = useParams();
    const { user } = useUser();
    const { showPopup } = usePopup();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [date, setDate] = useState("");
    const [updated_date, setUpdatedDate] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        fetch_data();
    }, []);

    const fetch_data = async () => {
        try {
            const response = await fetch(`http://localhost:3000/ims/notification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
    
            if (response.status === 200) {
                const json_data = await response.json();

                // Protection
                if(json_data.receiver_mail != user.user[`${user.role}Mail`]){
                    showPopup("alert", "You have no permission to open this !");
                    navigate("/notifications");
                }

                setTitle(json_data.title);
                setType(json_data.notification_type);
                setDate(json_data.createdAt);
                setUpdatedDate(json_data.updatedAt);
                setContent(json_data.content)
            } else {
                if (response.status === 400)
                    showPopup("error", "Given application does not exist !");
                else if (response.status === 500)
                    showPopup("error", "Internal server error occured !");
                navigate("/notifications");
            }
        } catch (error) {
            showPopup("error", "There is a problem in connection");
            navigate("/notifications");
        }
    };

    return (
        <div className="message-detail-container">
            <h1>{title}</h1>
            <p><strong>Type:</strong> {type}</p>
            <p><strong>Created At:</strong> {new Date(date).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(updated_date).toLocaleString()}</p>
            <p><strong>Content:</strong></p>
            <p>{content}</p>
        </div>
    );
}

export default Notification;
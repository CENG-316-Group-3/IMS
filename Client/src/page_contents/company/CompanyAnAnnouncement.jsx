import React, { useState, useRef, useEffect } from 'react';
import '../../styles/CoordinatorNewAnnouncement.css';
import { useUser } from "../../contexts/UserContext";
import { usePopup } from '../../contexts/PopUpContext';
import { json, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function CompanyAnAnnouncement() {
    let { id } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const { showPopup } = usePopup();
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [position, setPosition] = useState("");
    const [description, setDescription] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetch_data();
    }, []);

    const fetch_data = async () => {
        try {
            const response = await fetch(`http://localhost:3000/ims/company/get-announcement`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
    
            if (response.status === 200) {
                const json_data = await response.json();
                setTitle(json_data.content[0].title);
                setPosition(json_data.content[0].position);
                setDescription(json_data.content[0].content);
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

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file)
            showPopup("error", "You need to select a file !");
        else if (title === "")
            showPopup("error", "Title cannot be empty !");
        else if (position === "")
            showPopup("error", "Position cannot be empty !");
        else;
            send_data();
    };

    const send_data = async () => {
        try {
            const response = await fetch(`http://localhost:3000/ims/company/update-announcement`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, user_mail: user.user.companyMail, title, content: description, position })
            });

            if (response.status === 200) {
                showPopup("success", "Announcement updated successfully");
                handleCancel();
            } else {
                if (response.status === 400)
                    showPopup("error", "Given company does not exist !");
                else if (response.status === 500)
                    showPopup("error", "Internal server error occured !");
                handleCancel();
            }
        } catch (error) {
            showPopup("error", "There is a problem in connection");
        }
    };

    const handleCancel = () => {
        setFile(null);
        setTitle('');
        setDescription('');
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        navigate("/company_internship_announcements");
    };
    return (
        <div className="announcement-form-container">
            <h2>Published Announcement</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>File:</label>
                    <input type="file" accept=".doc,.docx,application/pdf" onChange={handleFileChange} ref={fileInputRef} />
                </div>
                <div className="form-group">
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Position:</label>
                    <input
                        type="text"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                </div>
                <div className="button-group">
                    <button type="submit" className="publish-btn">EDIT</button>
                    <button type="button" className="cancel-btn" onClick={handleCancel}>CANCEL</button>
                </div>
            </form>
        </div>
    )
}

export default CompanyAnAnnouncement;

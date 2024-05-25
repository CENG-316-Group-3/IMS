import React, { useState, useRef } from 'react';
import '../../styles/NewAnnouncement.css';
import { useUser } from "../../contexts/UserContext";
import { usePopup } from '../../contexts/PopUpContext';

const NewAnnouncement = () => {
    const { user } = useUser();
    const { showPopup } = usePopup();
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [position, setPosition] = useState('');
    const [description, setDescription] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(title === "")
            showPopup("error", "Title cannot be empty !");
        else if(position === "")
            showPopup("error", "Position cannot be empty !");
        else;
            //send_data();
    };

    const send_data = async () => {
        try {
            const response = await fetch(`//TODO//`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companyMail: user.user.companyMail })
            });
    
            if (response.status === 200) {
                showPopup("success", "Announcement published successfully");
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
        setPosition('');
        setDescription('');
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="announcement-form-container">
            <h2>New Announcement</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>File:</label>
                    <input type="file" accept=".doc,.docx,application/pdf" onChange={handleFileChange} ref={fileInputRef}/>
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
                    <button type="submit" className="publish-btn">PUBLISH</button>
                    <button type="button" className="cancel-btn" onClick={handleCancel}>CANCEL</button>
                </div>
            </form>
        </div>
    );
};

export default NewAnnouncement;

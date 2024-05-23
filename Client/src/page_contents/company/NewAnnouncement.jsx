import React, { useState } from 'react';
import '../../styles/NewAnnouncement.css';

const NewAnnouncement = () => {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState('');
    const [position, setPosition] = useState('');
    const [description, setDescription] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Form submission logic here
        console.log({ file, title, position, description });
    };

    const handleCancel = () => {
        // Reset form fields
        setFile(null);
        setTitle('');
        setPosition('');
        setDescription('');
    };

    return (
        <div className="announcement-form-container">
            <h2>New Announcement</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>File:</label>
                    <input type="file" onChange={handleFileChange} />
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

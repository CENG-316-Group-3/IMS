import React from 'react';
import '../styles/Announcements.css';

const Announcements = () => {
    const announcements = [
        { id: 1, title: 'Announcement 1', position: 'Position 1', date: '2024-05-21' },
        { id: 2, title: 'Announcement 2', position: 'Position 2', date: '2024-05-20' },
        { id: 3, title: 'Announcement 3', position: 'Position 3', date: '2024-05-19' },
        { id: 4, title: 'Announcement 4', position: 'Position 4', date: '2024-05-18' },
    ];

    const handleEdit = (id) => {
        // Edit logic here
        console.log(`Edit announcement with id: ${id}`);
    };

    const handleDelete = (id) => {
        // Delete logic here
        console.log(`Delete announcement with id: ${id}`);
    };

    return (
        <div className="announcements-container">
            <h2>Announcements</h2>
            <table>
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
        </div>
    );
};

export default Announcements;

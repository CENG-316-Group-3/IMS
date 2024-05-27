import React, { useState, useRef, useEffect } from 'react';
import "../../styles/StdCoordinatorAnnViewPage.css"
import { json, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { usePopup } from '../../contexts/PopUpContext';

function StdCoordinatorAnnViewPage() {
    let { id } = useParams();
    const { showPopup } = usePopup();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [updated_date, setUpdatedDate] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        fetch_data();
    }, []);

    const fetch_data = async () => {
        try {
            const response = await fetch(`http://localhost:3000/ims/student/coordinator-announcement`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            
            if (response.status === 200) {
                const json_data = await response.json();
                setTitle(json_data[0].title);
                setDate(json_data[0].createdAt);
                setUpdatedDate(json_data[0].updatedAt);
                setDescription(json_data[0].content);
            } else {
                if (response.status === 400)
                    showPopup("error", "Given company does not exist !");
                else if (response.status === 500)
                    showPopup("error", "Internal server error occured !");
                navigate("/student_announcements");
            }
        } catch (error) {
            showPopup("error", "There is a problem in connection");
            navigate("/student_announcements");
        }
    };

    return (
        <div className='std_an_announcement_view_container'>
            <h2>{title}</h2>
            <p>Created Date: {date}</p>
            <p>Last Updated: {updated_date}</p>
            <div className='ann-description'>
                <h3>Description:</h3>
                <p >{description}</p>
            </div>

        </div>
    )
}

export default StdCoordinatorAnnViewPage




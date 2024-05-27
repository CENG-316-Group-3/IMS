import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../styles/FeedbackPage.css'
import '../styles/Buttons.css'

function FeedbackPage({ publish_handler, reject_handler }) {
    const [feedback, setFeedback] = useState("");
    const navigate = useNavigate();

    return (
        <div className='feedback-container'>
            <h2>Feedback</h2>
            <div className='feedback-content'>
                <div className='feedback-area'>
                    <label>Please give a feedback: </label><br />
                    <textarea id='feedback' name='feedback' rows='10' cols='50' placeholder='Write your feedback here...' maxLength={500} onChange={(event) => setFeedback(event.target.value)}></textarea >
                </div>
                <div className='feedback-buttons'>
                    <button className='publish-btn' type='submit' onClick={() => {publish_handler(feedback)}}>Send</button>
                    <button className='cancel-btn' type='cancel' onClick={() => {reject_handler()}} >Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default FeedbackPage

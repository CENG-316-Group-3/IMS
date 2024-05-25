import React from 'react'
import '../styles/FeedbackPage.css'
import '../styles/Buttons.css'

function FeedbackPage() {
    return (
        <div className='feedback-container'>
            <h2>Feedback</h2>
            <div className='feedback-content'>
                <div className='feedback-area'>
                    <label>Please give a feedback: </label><br />
                    <textarea id='feedback' name='feedback' rows='10' cols='50' placeholder='Write your feedback here...' maxLength={500} ></textarea >
                </div>
                <div className='feedback-buttons'>
                    <button className='publish-btn' type='submit'>Send</button>
                    <button className='cancel-btn' type='cancel'>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default FeedbackPage

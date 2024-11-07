import React, { useState, useRef } from 'react';
import API from '../api/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function TextModeration() {
    const [text, setText] = useState('');
    const [moderationId, setModerationId] = useState(null);
    const [categoryScores, setCategoryScores] = useState(null);
    const [annotations, setAnnotations] = useState(null);
    const [sharedRecords, setSharedRecords] = useState([]);
    const [sharedRecordDetails, setSharedRecordDetails] = useState(null);
    const [shareFriendEmail, setShareFriendEmail] = useState(''); // Email of friend to share with
    const [shareHistoryId, setShareHistoryId] = useState(''); // History ID to share
    const [message, setMessage] = useState(''); // For success/error messages
    const [history, setHistory] = useState([]); // Moderation history for the user
    const [sensitivityScore, setSensitivityScore] = useState(null);
    const [scoreFetchId, setScoreFetchId] = useState(''); // Separate state for scores
    const [annotationFetchId, setAnnotationFetchId] = useState(''); // Separate state for annotations
    const pdfExportRef = useRef(); // Reference for PDF export

    // Submit new text for moderation
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/text/', { email: localStorage.getItem('userEmail'), text });
            console.log('Submission response:', data);
            setModerationId(data.id);
            setMessage(data.message || "Text moderated and stored successfully.");
        } catch (error) {
            console.error('Error during submission:', error);
            setMessage("Failed to submit text for moderation.");
        }
    };

    // Fetch category scores and sensitivity score by moderation ID
    const handleFetchScoresById = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.get(`/text/score/${scoreFetchId}`);
            console.log('Score data:', data);
            setCategoryScores(data.category_scores);
            setSensitivityScore(data.sensitivity_score);
        } catch (error) {
            console.error('Error fetching score by ID:', error);
            setMessage("Failed to fetch scores by ID.");
        }
    };

    // Fetch annotations by moderation ID
    const handleFetchAnnotationsById = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.get(`/text/annotations/${annotationFetchId}`);
            console.log('Annotation data:', data);
            setAnnotations(data);
        } catch (error) {
            console.error('Error fetching annotations by ID:', error);
            setMessage("Failed to fetch annotations by ID.");
        }
    };

    // Fetch moderation history for the user
    const handleFetchHistory = async () => {
        try {
            const { data } = await API.get(`/text/histories?email=${localStorage.getItem('userEmail')}`);
            console.log('History data:', data);
            setHistory(data);
        } catch (error) {
            console.error('Error fetching history:', error);
            setMessage("Failed to fetch history.");
        }
    };

    // Share a record with a friend
    const handleShareRecord = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/text/share', {
                userEmail: localStorage.getItem('userEmail'),
                friendEmail: shareFriendEmail,
                historyId: shareHistoryId
            });
            console.log('Share response:', data);
            setMessage(data.message || "History shared successfully.");
        } catch (error) {
            console.error('Error sharing record:', error);
            setMessage("Failed to share the record.");
        }
    };

    // Fetch all shared records for the logged-in user
    const handleFetchSharedRecords = async () => {
        try {
            const { data } = await API.get(`/text/shared?email=${localStorage.getItem('userEmail')}`);
            console.log('Shared records data:', data);
            setSharedRecords(data);
        } catch (error) {
            console.error('Error fetching shared records:', error);
            setMessage("Failed to fetch shared records.");
        }
    };

    // Fetch details of a specific shared record by ID
    const handleFetchSharedRecordDetails = async (sharedRecordId) => {
        try {
            const { data } = await API.get(`/text/shared/${sharedRecordId}?email=${localStorage.getItem('userEmail')}`);
            console.log('Shared record details:', data);
            setSharedRecordDetails(data);
        } catch (error) {
            console.error('Error fetching shared record details:', error);
            setMessage("Failed to fetch shared record details.");
        }
    };

    // Export current scores and annotations to PDF
    const exportToPDF = async () => {
        const input = pdfExportRef.current;
        const canvas = await html2canvas(input);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();

        pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
        pdf.save('ModerationReport.pdf');
    };

    // Render category scores
    const renderCategoryScores = (scores) => (
        scores ? (
            <ul>
                {Object.keys(scores).map((category, index) => (
                    <li key={index}>
                        {category}: {scores[category].toFixed(6)}
                    </li>
                ))}
            </ul>
        ) : <p>No category scores available</p>
    );

    return (
        <div>
            <h1>Text Moderation</h1>
            {message && <p>{message}</p>}

            {/* Form to submit new text for moderation */}
            <form onSubmit={handleSubmit}>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text to moderate"
                    required
                />
                <button type="submit">Submit for Moderation</button>
            </form>

            {moderationId && (
                <p>Moderation ID: {moderationId} (Use this ID to fetch scores or annotations)</p>
            )}

            {/* Form to fetch category scores by moderation ID */}
            <form onSubmit={handleFetchScoresById}>
                <input
                    type="text"
                    value={scoreFetchId}
                    onChange={(e) => setScoreFetchId(e.target.value)}
                    placeholder="Enter moderation ID to fetch scores"
                    required
                />
                <button type="submit">Fetch Scores by ID</button>
            </form>


            {/* Form to fetch annotations by moderation ID */}
            <form onSubmit={handleFetchAnnotationsById}>
                <input
                    type="text"
                    value={annotationFetchId}
                    onChange={(e) => setAnnotationFetchId(e.target.value)}
                    placeholder="Enter moderation ID to fetch annotations"
                    required
                />
                <button type="submit">Fetch Annotations by ID</button>
            </form>


            {/* Section to display all moderation details and allow PDF export */}
            <div ref={pdfExportRef}>
                <h2>Moderation Details</h2>

                {categoryScores && (
                    <div>
                        <h3>Category Scores</h3>
                        {renderCategoryScores(categoryScores)}
                    </div>
                )}

                {sensitivityScore !== null && (
                    <div>
                        <h3>Sensitivity Score</h3>
                        <p>{sensitivityScore.toFixed(6)}</p>
                    </div>
                )}

                {annotations && (
                    <div>
                        <h3>Annotations</h3>
                        <ul>
                            {Object.keys(annotations).map((key) => (
                                <li key={key}>
                                    {key}: {annotations[key] ? 'True' : 'False'}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {history.length > 0 && (
                    <div>
                        <h3>Moderation History</h3>
                        <ul>
                            {history.map((entry) => (
                                <li key={entry.history_id}>
                                    {entry.text} (ID: {entry.history_id})
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            {/* Share a Record with a Friend */}
            <form onSubmit={handleShareRecord}>
                <h2>Share a Record</h2>
                <input
                    type="text"
                    value={shareFriendEmail}
                    onChange={(e) => setShareFriendEmail(e.target.value)}
                    placeholder="Friend's Email"
                    required
                />
                <input
                    type="text"
                    value={shareHistoryId}
                    onChange={(e) => setShareHistoryId(e.target.value)}
                    placeholder="History ID to Share"
                    required
                />
                <button type="submit">Share Record</button>
            </form>
            {/* Fetch and display moderation history */}
            <button onClick={handleFetchHistory}>Fetch Moderation History</button>
            {history.length > 0 && (
                <div>
                    <h3>Moderation History</h3>
                    <ul>
                        {history.map((entry) => (
                            <li key={entry.history_id}>
                                {entry.text} (ID: {entry.history_id})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {/* Fetch and display all shared records */}
            <button onClick={handleFetchSharedRecords}>Fetch Shared Records</button>
            {sharedRecords.length > 0 && (
                <div>
                    <h2>Shared Records</h2>
                    <ul>
                        {sharedRecords.map((record) => (
                            <li key={record.history_id}>
                                Shared from: {record.shared_from_email} | History ID: {record.history_id}
                                <button onClick={() => handleFetchSharedRecordDetails(record.history_id)}>
                                    View Details
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Display details of a specific shared record */}
            {sharedRecordDetails && (
                <div>
                    <h2>Shared Record Details</h2>
                    <h3>Category Scores:</h3>
                    {renderCategoryScores(sharedRecordDetails.category_scores)}

                    <h3>Categories:</h3>
                    <ul>
                        {Object.keys(sharedRecordDetails.categories).map((key) => (
                            <li key={key}>
                                {key}: {sharedRecordDetails.categories[key] ? 'True' : 'False'}
                            </li>
                        ))}
                    </ul>

                    <h3>Sensitivity Score:</h3>
                    <p>{sharedRecordDetails.sensitivity_score.toFixed(6)}</p>
                </div>
            )}
            {/* Button to export the moderation details as PDF */}
            <button onClick={exportToPDF}>Export as PDF</button>
        </div>
    );
}

export default TextModeration;

import React, { useState } from 'react';
import API from '../api/api';

function TextModeration() {
    const [text, setText] = useState('');
    const [moderationResult, setModerationResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/text/score', { text });
            setModerationResult(data); // `data` contains `id`, `category_scores`, and `sensitivity_score`
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Text Moderation</h1>
            <form onSubmit={handleSubmit}>
                <textarea value={text} onChange={(e) => setText(e.target.value)} />
                <button type="submit">Moderate</button>
            </form>

            {moderationResult && (
                <div>
                    <h2>Moderation Result</h2>
                    <p>ID: {moderationResult.id}</p>
                    <p>Category Scores: {JSON.stringify(moderationResult.category_scores, null, 2)}</p>
                    <p>Sensitivity Score: {moderationResult.sensitivity_score}</p>
                </div>
            )}
        </div>
    );
}

export default TextModeration;

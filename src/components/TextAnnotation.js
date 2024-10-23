import React, { useState } from 'react';
import API from '../api/api';

function TextAnnotation() {
    const [text, setText] = useState('');
    const [annotationResult, setAnnotationResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/text/annotate', { text });
            setAnnotationResult(data); // `data` contains `id`, `categories`, and `flagged`
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Text Annotation</h1>
            <form onSubmit={handleSubmit}>
                <textarea value={text} onChange={(e) => setText(e.target.value)} />
                <button type="submit">Annotate</button>
            </form>

            {annotationResult && (
                <div>
                    <h2>Annotation Result</h2>
                    <p>ID: {annotationResult.id}</p>
                    <p>Categories: {JSON.stringify(annotationResult.categories, null, 2)}</p>
                    <p>Flagged: {annotationResult.flagged ? 'Yes' : 'No'}</p>
                </div>
            )}
        </div>
    );
}

export default TextAnnotation;

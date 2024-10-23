import React, { useState } from 'react';
import API from '../api/api';
function UserHistory() {
    const [userId, setUserId] = useState('');
    const [history, setHistory] = useState([]);

    const handleSearch = async () => {
        try {
            const { data } = await API.get(`/users/${userId}/reviews`);
            setHistory(data.history);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>User Review History</h1>
            <input
                type="text"
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            <div>
                <h2>History</h2>
                <pre>{JSON.stringify(history, null, 2)}</pre>
            </div>
        </div>
    );
}

export default UserHistory;

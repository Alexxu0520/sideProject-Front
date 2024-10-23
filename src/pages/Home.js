import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <h1>Welcome to the Text Moderation App</h1>
            <nav>
                <ul>
                    <li><Link to="/text/annotation">Text Annotation</Link></li>
                    <li><Link to="/text/moderation">Text Moderation</Link></li>
                    <li><Link to="/users/history">User History</Link></li>
                    <li><Link to="/register">Register</Link></li>
                    <li><Link to="/password/change">Change Password</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default Home;

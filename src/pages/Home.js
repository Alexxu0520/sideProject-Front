import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundImage: 'url("https://i.imgur.com/fWUeLmg.png")', // Your background image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
    },
    heading: {
        color: '#00ff80', // Gold color for heading
    },
    paragraph: {
        color: '#000dff', // Gold color for the paragraph text
    },
    nav: {
        listStyleType: 'none',
        padding: 0,
    },
    navItem: {
        margin: '10px 0',
    },
    link: {
        color: '#ff00dd', // Set link color to gold
        textDecoration: 'none',
        fontSize: '18px',
    }
};

function Home() {
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        // Retrieve the logged-in user's email from localStorage
        const email = localStorage.getItem('userEmail');
        setUserEmail(email || 'Guest');
    }, []);

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Welcome to the Text Moderation App</h1>
            <p style={styles.paragraph}>Logged in as: {userEmail}</p>

            <nav>
                <ul style={styles.nav}>
                    <li style={styles.navItem}><Link to="/text/moderation" style={styles.link}>Text Moderation</Link></li>
                    <li style={styles.navItem}><Link to="/register" style={styles.link}>Register</Link></li>
                    <li style={styles.navItem}><Link to="/login" style={styles.link}>Login</Link></li>
                    <li style={styles.navItem}><Link to="/password/change" style={styles.link}>Change Password</Link></li>
                    <li style={styles.navItem}><Link to="/friends" style={styles.link}>Friend Management</Link></li>
                </ul>
            </nav>
        </div>
    );
}

export default Home;

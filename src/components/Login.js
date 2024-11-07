import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        const { email, password } = formData;
        if (!email || !password) {
            setMessage("Both fields are required.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setMessage('');

        try {
            const response = await API.post('/auth/login', formData);
            console.log('Login response:', response);

            // Handle each specific response message from the backend
            if (response.data === "Login successful!") {
                localStorage.setItem('userEmail', formData.email); // Store email if login is successful
                setMessage("Login successful!");
                setTimeout(() => navigate('/'), 2000); // Redirect to homepage
            } else if (response.data === "Error: Incorrect password.") {
                setMessage("Incorrect password. Please try again.");
            } else if (response.data === "Error: Email not found.") {
                setMessage("Email not found. Please check your email or register.");
            } else if (response.data === "Error: Unable to login.") {
                setMessage("An error occurred while trying to log in. Please try again later.");
            } else {
                setMessage("Login failed. Please check your credentials and try again.");
            }
        } catch (error) {
            console.error('Login error:', error);
            setMessage(error.response?.data?.message || "Login failed. Please check your credentials and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

export default Login;

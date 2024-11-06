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
            const { data } = await API.post('/auth/login', formData);
            setMessage("Login successful!");
            localStorage.setItem('userEmail', formData.email);
            // You can store a token here if returned by the server
            // localStorage.setItem(a'token', data.token); // example of storing a token
            setTimeout(() => navigate('/'), 2000); // Redirect to the homepage after 2 seconds
        } catch (error) {
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

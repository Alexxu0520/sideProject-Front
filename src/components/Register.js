import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

function Register() {
    const [formData, setFormData] = useState({ nickname: '', email: '', password: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        const { nickname, email, password } = formData;
        if (!nickname || !email || !password) {
            setMessage("All fields are required.");
            return false;
        }
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            setMessage("Please enter a valid email address.");
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
            const response = await API.post('/auth/register', formData);
            console.log('Register response:', response);

            // Handle each specific response message from the backend
            if (response.data === "User registered successfully!") {
                setMessage("User registered successfully!");
                setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
            } else if (response.data === "Error: Email or nickname already exists.") {
                setMessage("Email or nickname already exists. Please use a different one.");
            } else if (response.data === "Error: Unable to register user.") {
                setMessage("An error occurred while trying to register. Please try again later.");
            } else {
                setMessage("Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1>Register</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nickname"
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                />
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
                    {isSubmitting ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
}

export default Register;

import React, { useState } from 'react';
import API from '../api/api';

function PasswordChange() {
    const [formData, setFormData] = useState({ email: '', currentPassword: '', newPassword: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const validateForm = () => {
        const { email, currentPassword, newPassword } = formData;
        if (!email || !currentPassword || !newPassword) {
            setMessage("All fields are required.");
            return false;
        }
        if (newPassword.length < 8) {
            setMessage("New password must be at least 8 characters long.");
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
            const response = await API.post('/auth/password/change', formData);
            console.log('Password change response:', response);

            // Handle each specific response message from the backend
            if (response.data === "Password updated successfully!") {
                setMessage("Password updated successfully!");
            } else if (response.data === "Error: Current password is incorrect.") {
                setMessage("Current password is incorrect.");
            } else if (response.data === "Error: User not found.") {
                setMessage("User not found. Please check the email address.");
            } else if (response.data === "Error: Unable to change password.") {
                setMessage("An error occurred. Please try again later.");
            } else {
                setMessage("Unexpected response. Please try again.");
            }
        } catch (error) {
            console.error('Password change error:', error);
            setMessage(error.response?.data?.message || "Failed to update password. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1>Change Password</h1>
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
                    placeholder="Current Password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                />
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Changing Password...' : 'Change Password'}
                </button>
            </form>
        </div>
    );
}

export default PasswordChange;

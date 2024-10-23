import React, { useState } from 'react';
import API from '../api/api';

function PasswordChange() {
    const [passwords, setPasswords] = useState({ current_password: '', new_password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.put('/users/password', passwords);
            console.log(data.message);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Change Password</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Current Password"
                    value={passwords.current_password}
                    onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={passwords.new_password}
                    onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                />
                <button type="submit">Change Password</button>
            </form>
        </div>
    );
}

export default PasswordChange;

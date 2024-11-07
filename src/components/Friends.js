import React, { useState, useEffect, useCallback } from 'react';
import API from '../api/api';

function Friends() {
    const [friendEmail, setFriendEmail] = useState(''); // For adding friends
    const [requests, setRequests] = useState([]); // Friend requests received
    const [friends, setFriends] = useState([]); // List of friends
    const [message, setMessage] = useState(''); // Success or error messages
    const [loading, setLoading] = useState(false); // Loading state for actions
    const userEmail = localStorage.getItem('userEmail'); // Replace with logged-in user's email

    // Function to temporarily show a message
    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
    };

    // Send Friend Request
    const handleAddFriend = async () => {
        setLoading(true);
        try {
            const { data } = await API.post('/friends/add', { userEmail, friendEmail });
            showMessage(data || "Friend request sent successfully!"); // Use data from backend response
            setFriendEmail(''); // Clear the input field
        } catch (error) {
            showMessage(error.response?.data || "Failed to send friend request."); // Display backend error message
        } finally {
            setLoading(false);
        }
    };

    // View Friend Requests
    const handleViewRequests = async () => {
        setLoading(true);
        try {
            const { data } = await API.post('/friends/requests', { userEmail });
            setRequests(data);
            showMessage("Friend requests fetched successfully!");
        } catch (error) {
            showMessage(error.response?.data || "Failed to fetch friend requests."); // Display backend error message
        } finally {
            setLoading(false);
        }
    };

    // Accept Friend Request
    const handleAcceptRequest = async (friendEmail) => {
        setLoading(true);
        try {
            const { data } = await API.post('/friends/accept', { userEmail, friendEmail });
            showMessage(data || "Friend request accepted!"); // Use data from backend response
            handleViewFriends(); // Refresh the friend list
            handleViewRequests(); // Refresh the friend requests
        } catch (error) {
            showMessage(error.response?.data || "Failed to accept friend request."); // Display backend error message
        } finally {
            setLoading(false);
        }
    };

    // List Friends - Wrapped in useCallback to avoid unnecessary re-creation
    const handleViewFriends = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await API.post('/friends/list', { userEmail });
            setFriends(data);
            showMessage("Friends list fetched successfully!");
        } catch (error) {
            showMessage(error.response?.data || "Failed to fetch friends list."); // Display backend error message
        } finally {
            setLoading(false);
        }
    }, [userEmail]);

    // Remove Friend
    const handleRemoveFriend = async (friendEmail) => {
        setLoading(true);
        try {
            const { data } = await API.delete('/friends/remove', {
                data: { userEmail, friendEmail }
            });
            showMessage(data || "Friend removed successfully!"); // Use data from backend response
            handleViewFriends(); // Refresh the friend list
        } catch (error) {
            showMessage(error.response?.data || "Failed to remove friend."); // Display backend error message
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleViewFriends(); // Fetch friends list on component mount
    }, [handleViewFriends]); // Now handleViewFriends is a dependency

    return (
        <div>
            <h1>Friend Management</h1>
            {message && <p>{message}</p>}

            {/* Add Friend */}
            <div>
                <h2>Add Friend</h2>
                <input
                    type="email"
                    placeholder="Friend's Email"
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                />
                <button onClick={handleAddFriend} disabled={loading || !friendEmail}>
                    {loading ? 'Sending...' : 'Send Friend Request'}
                </button>
            </div>

            {/* View Friend Requests */}
            <div>
                <h2>Friend Requests</h2>
                <button onClick={handleViewRequests} disabled={loading}>
                    {loading ? 'Loading...' : 'View Friend Requests'}
                </button>
                <ul>
                    {requests.length > 0 ? (
                        requests.map((request) => (
                            <li key={request}>
                                {request}
                                <button onClick={() => handleAcceptRequest(request)} disabled={loading}>
                                    Accept
                                </button>
                            </li>
                        ))
                    ) : (
                        <li>No friend requests.</li>
                    )}
                </ul>
            </div>

            {/* List Friends */}
            <div>
                <h2>Your Friends</h2>
                <button onClick={handleViewFriends} disabled={loading}>
                    {loading ? 'Refreshing...' : 'Refresh Friends List'}
                </button>
                <ul>
                    {friends.length > 0 ? (
                        friends.map((friend) => (
                            <li key={friend}>
                                {friend}
                                <button onClick={() => handleRemoveFriend(friend)} disabled={loading}>
                                    Remove
                                </button>
                            </li>
                        ))
                    ) : (
                        <li>No friends added yet.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default Friends;

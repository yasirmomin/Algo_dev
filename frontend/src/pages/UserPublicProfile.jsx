
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

export default function UserPublicProfile() {
    const { userId } = useParams();
    const [profile, setProfile] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfile(res.data.user);
            } catch (err) {
                console.error("Error fetching profile:", err.response?.data || err.message);
            }
        };

        const fetchCurrentUser = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/user/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCurrentUser(res.data.user);
            } catch (err) {
                console.error("Error fetching current user:", err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
        fetchCurrentUser();
    }, [token, userId]);

    const handleAddFriend = async () => {
        try {
            const res = await axios.post(
                `http://localhost:3000/user/add-friend/${userId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(res.data.message || "Friend added successfully");

            // Re-fetch current user to update friends list
            const updated = await axios.get(`http://localhost:3000/user/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCurrentUser(updated.data.user);
        } catch (err) {
            console.error("Add friend error:", err.response?.data || err.message);
            setMessage(err.response?.data?.message || "Could not add friend.");
        }
    };

    const handleRemoveFriend = async () => {
        try {
            await axios.post(
                `http://localhost:3000/user/remove-friend/${userId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updated = await axios.get(`http://localhost:3000/user/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCurrentUser(updated.data.user);

            setMessage("Friend removed successfully!");
        } catch (err) {
            console.error("Remove friend error:", err.response?.data || err.message);
            setMessage(err.response?.data?.message || "Could not remove friend.");
        }
    };

    if (loading) return <p className="p-4">Loading...</p>;
    if (!profile) return <p className="p-4">User not found.</p>;
    if (!currentUser) return <p className="p-4">Unable to load your profile.</p>;
    const isAlreadyFriend = currentUser.friends?.includes(profile._id);
    return (
        <div className="max-w-xl mx-auto mt-8 bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">{profile.username}</h2>
            <img
                src={profile.profilePic || "/default-avatar.png"}
                alt="Profile"
                className="w-24 h-24 rounded-full mb-4"
            />
            <p><strong>Full Name:</strong> {profile.firstName} {profile.lastName}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Friends:</strong> {profile.friends.length || 0}</p>
            <p><strong>Rating:</strong> {profile.rating || "N/A"}</p>
            <p><strong>Problems Solved:</strong> {profile.problemsSolved.length || 0}</p>
            <p><strong>Contests Given:</strong> {profile.contestsGiven.length || 0}</p>

            {profile._id !== currentUser._id && (
                <>
                    {!isAlreadyFriend ? (
                        <button
                            onClick={handleAddFriend}
                            className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded"
                        >
                            ⭐ Add Friend
                        </button>
                    ) : (
                        <button
                            onClick={handleRemoveFriend}
                            className="mt-4 bg-gray-300 text-black px-4 py-2 rounded"
                        >
                            ☆ Remove Friend
                        </button>
                    )}
                </>
            )}

            {message && <p className="mt-4 text-red-600 font-semibold">{message}</p>}

            {profile._id !== currentUser._id && isAlreadyFriend && (
                <p className="mt-4 text-green-600 font-semibold">
                    ✅ Already your friend
                </p>
            )}
        </div>
    )
}
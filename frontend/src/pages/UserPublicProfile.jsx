
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
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfile(res.data.user);
            } catch (err) {
                console.error("Error fetching profile:", err.response?.data || err.message);
            }
        };

        const fetchCurrentUser = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/me`, {
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
                `${import.meta.env.VITE_BACKEND_URL}/user/add-friend/${userId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(res.data.message || "Friend added successfully");

            // Re-fetch current user to update friends list
            const updated = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/me`, {
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
                `${import.meta.env.VITE_BACKEND_URL}/user/remove-friend/${userId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updated = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/me`, {
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
        <div className="min-h-screen w-full bg-gradient-to-tr 
  from-[#5896ed] via-45% via-[#dcd5e2] to-[#ff7ea7]
  dark:from-[#0d006e] dark:via-25% dark:via-[#31258d] dark:to-[#531515]
  bg-fixed
  py-10">
        <div className="max-w-xl mx-auto mt-8 bg-white/90 border-2 border-gray-600 dark:bg-gray-900  rounded-xl shadow-md shadow-black dark:shadow-white p-6  space-y-4">
            <div className="flex flex-col items-center">
               {profile.profilePic ? (
            <img
              src={profile.profilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full border mb-3"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-3">
              <span className="text-gray-500 dark:text-gray-300">No Picture</span>
            </div>
          )}
                <h2 className="text-2xl font-bold dark:text-white">{profile.username}</h2>
            </div>

            <div className="grid grid-cols-2 gap-4 text-md dark:text-white">
                <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
                <p><strong>Rating:</strong> {profile.rating || "N/A"}</p>
                <p><strong>Friends:</strong> {profile.friends.length || 0}</p>
                <p><strong>Problems Solved:</strong> {profile.problemsSolved.length || 0}</p>
                <p><strong>Contests:</strong> {profile.contestsGiven.length || 0}</p>
            </div>

            {profile._id !== currentUser._id && (
                <div className="flex gap-2 justify-center">
                    {!isAlreadyFriend ? (
                        <button
                            onClick={handleAddFriend}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition"
                        >
                            ⭐ Add Friend
                        </button>
                    ) : (
                        <button
                            onClick={handleRemoveFriend}
                            className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-black dark:text-white px-4 py-2 rounded transition"
                        >
                            ☆ Remove Friend
                        </button>
                    )}
                </div>
            )}

            {message && <p className="mt-4 text-center text-red-600 font-medium">{message}</p>}

            {profile._id !== currentUser._id && isAlreadyFriend && (
                <p className="mt-2 text-center text-green-600 font-medium">
                    ✅ Already your friend
                </p>
            )}
        </div>
</div>
    );
}
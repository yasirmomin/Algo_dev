import axios from "axios";
import { useEffect, useState } from "react";
import UserSearch from "../components/UserSearch";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  
  const fetchUser = async () => {
    try {
      const res = await axios.get("http://localhost:3000/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);



  const handleAddFriend = async (friendId) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/user/add-friend/${friendId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchUser(); // Refresh local user
      alert(res.data.message || "Friend added successfully");
    } catch (error) {
      console.error("Error adding friend:", error.response?.data || error.message);
      alert("Error adding friend.");
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      const res = await axios.post(
        `http://localhost:3000/user/remove-friend/${friendId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchUser(); // Refresh local user
      alert(res.data.message || "Friend removed successfully");
    } catch (error) {
      console.error("Error removing friend:", error.response?.data || error.message);
      alert("Error removing friend.");
    }
  };

  if (!user) return <p className="p-4">Loading profile...</p>;

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <div className="bg-white p-6 rounded shadow">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Profile Picture:</strong>{" "}
          {user.profilePic ? (
            <img src={user.profilePic} alt="Profile" className="w-24 h-24 rounded-full mt-2" />
          ) : "No profile picture"}
        </p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Full Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Rating:</strong> {user.rating || "N/A"}</p>
        <p><strong>Friends:</strong> {user.friends.length || 0}</p>
        <p><strong>Contests Given:</strong> {user.contestsGiven.length || 0}</p>
        <p><strong>Problems Solved:</strong> {user.problemsSolved.length || 0}</p>

        <div className="relative mt-4 inline-block">
          <button
            onClick={() => navigate("/friends")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer"
          >
            View Friends
          </button>
        </div>

      </div>

      <UserSearch
        onAddFriend={handleAddFriend}
        onRemoveFriend={handleRemoveFriend}
        currentUser={user}
      />
    </div>
  );
}

export default Profile;
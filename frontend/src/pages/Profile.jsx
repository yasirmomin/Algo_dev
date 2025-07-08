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
    <div className="min-h-screen w-full bg-gradient-to-tr 
  from-[#5896ed] via-45% via-[#dcd5e2] to-[#ff7ea7]
  dark:from-[#0d006e] dark:via-25% dark:via-[#31258d] dark:to-[#531515]
  bg-fixed
  py-10">
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-3xl font-bold mb-6 text-center dark:text-white">My Profile</h2>
      <div className="bg-white/90 border-2 border-gray-600 dark:bg-gray-900  rounded-xl shadow-md shadow-black dark:shadow-white p-6  space-y-4">
        <div className="flex flex-col items-center">
          {user.profilePic ? (
            <img
              src={user.profilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full border mb-3"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-3">
              <span className="text-gray-500 dark:text-gray-300">No Picture</span>
            </div>
          )}
          <h3 className="text-xl dark:text-white font-semibold">{user.username}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-md dark:text-white">
          <p><strong>Full Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Rating:</strong> {user.rating || "N/A"}</p>
          <p><strong>Friends:</strong> {user.friends.length || 0}</p>
          <p><strong>Contests:</strong> {user.contestsGiven.length || 0}</p>
          <p><strong>Problems Solved:</strong> {user.problemsSolved.length || 0}</p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => navigate("/friends")}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition"
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
    </div>

  );
}

export default Profile;
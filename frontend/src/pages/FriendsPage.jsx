
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const FriendsPage = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const res = await axios.get("http://localhost:3000/user/friends",
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                setFriends(res.data.friends);
            }
            catch (error) {
                console.error("Error fetching friends:", error);
            }
            setLoading(false);
        };
        fetchFriends();
    }, [token]);

    return (
        <div className="max-w-3xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">👥 My Friends</h2>
      {loading ? (
        <p>Loading friends...</p>
      ) : friends.length === 0 ? (
        <p>You have no friends yet.</p>
      ) : (
        <table className="w-full border border-gray-300 shadow rounded">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Username</th>
              <th className="p-2">Rating</th>
            </tr>
          </thead>
          <tbody>
            {friends.map((friend) => (
              <tr key={friend._id} className="border-t hover:bg-gray-50">
                <td>
                <Link 
                to={`/profile/${friend._id}`}
                className="p-2 flex items-center gap-2 text-blue-600 hover:underline">
                  <img
                    src={friend.profilePic || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-6 h-6 rounded-full"
                  />
                  {friend.username}
                </Link>
                </td>
                <td className="p-2">{friend.rating || "Unrated"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
    )
}

export default FriendsPage
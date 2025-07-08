
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
    <div className="min-h-screen w-full bg-gradient-to-tr 
  from-[#5896ed] via-45% via-[#dcd5e2] to-[#ff7ea7]
  dark:from-[#0d006e] dark:via-25% dark:via-[#31258d] dark:to-[#531515]
  bg-fixed
  py-10">
    <div className="max-w-3xl mx-auto mt-10 bg-white/80 dark:bg-gray-900 border-3 shadow-2xs shadow-orange-700 rounded-2xl p-4">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">My Friends</h2>
      {loading ? (
        <p className="dark:text-white">Loading friends...</p>
      ) : friends.length === 0 ? (
        <p className="dark:text-gray-300">You have no friends yet.</p>
      ) : (
        <table className="w-full border border-gray-300 dark:border-gray-700 shadow rounded">
          <thead className="bg-gray-200 dark:bg-gray-800 text-left">
            <tr>
              <th className="p-2 dark:text-gray-200">Username</th>
              <th className="p-2 dark:text-gray-200">Rating</th>
            </tr>
          </thead>
          <tbody>
            {friends.map((friend) => (
              <tr key={friend._id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                <td>
                  <Link
                    to={`/profile/${friend._id}`}
                    className="p-2 flex items-center gap-2 text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {friend.username}
                  </Link>
                </td>
                <td className="p-2 dark:text-gray-200">{friend.rating || "Unrated"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
</div>
  );
}

export default FriendsPage
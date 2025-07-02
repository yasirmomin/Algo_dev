import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserSearch = ({ onAddFriend, onRemoveFriend, currentUser }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [debounceTimer, setDebounceTimer] = useState(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      setResults([]);
    }
  };

  const handleSearch = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/user/search?username=${encodeURIComponent(query)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResults(res.data.users);
    } catch (err) {
      console.error("Search error:", err.response?.data || err.message);
    }
    setLoading(false);
  }, [query]);
  useEffect(() => {

    if (query.trim() === "") return;

    setLoading(true);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      handleSearch();
    }, 300); 
    setDebounceTimer(timer);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="relative mt-6 max-w-md mx-auto">
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Search by username..."
          value={query}
          onChange={handleInputChange}
          className="border p-2 flex-grow rounded"
        />
      </div>

      {/* Search Results Dropdown */}
      {results.length > 0 && (
        <div className="absolute z-40 bg-white border border-gray-300 rounded shadow-md mt-1 w-full max-h-60 overflow-y-auto">
          <ul>
            {results.map((user) => (
              <li
                key={user._id}
                className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 border-b last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={user.profilePic || "/default-avatar.png"}
                    alt="Profile"
                    className="w-6 h-6 rounded-full"
                  />
                  <span
                    onClick={() => navigate(`/profile/${user._id}`)}
                    className="cursor-pointer text-blue-600 hover:underline"
                  >
                    {user.username}
                  </span>
                </div>

                {currentUser._id !== user._id && (
                  <button
                    onClick={() =>
                      currentUser.friends.includes(user._id)
                        ? onRemoveFriend(user._id)
                        : onAddFriend(user._id)
                    }
                    className={`text-xs px-3 py-1 rounded ${
                      currentUser.friends.includes(user._id)
                        ? "bg-white border text-red-600"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {currentUser.friends.includes(user._id)
                      ? "⭐ Remove"
                      : "⭐ Add"}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading && <p className="text-sm mt-1">Loading...</p>}
    </div>
  );
};

export default UserSearch;
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiPlus } from "react-icons/hi";

function Problems() {
  const [problems, setProblems] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const fetchProblems = async () => {

    try {
      const res = await axios.get("http://localhost:3000/problems");
      setProblems(res.data.problems);
    } catch (error) {
      console.error(
        "❌ Error fetching problems:",
        error.response?.data?.message || error.message
      );
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this problem?")) return;
    try {
      await axios.delete(`http://localhost:3000/problems/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProblems();
    } catch (err) {
      alert("❌ Error deleting problem");
      console.error(err);
    }
  };

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get("http://localhost:3000/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAdmin(res.data.user?.isAdmin || false);
      } catch (err) {
        console.error(
          "❌ Token verification failed:",
          err.response?.data?.message || err.message
        );
        setIsAdmin(false);
      }
    };

    verifyUser();
    fetchProblems();
  }, []);

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br 
  from-[#5896ed] via-45% via-[#dcd5e2] to-[#ff7ea7]
  dark:from-[rgba(187,5,111,0.88)] dark:via-45%  dark:via-[#111012]  dark:to-[#0231b1df]
  bg-fixed
  py-10">

      <div className="max-w-5xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-700 to-purple-700 dark:from-blue-300 dark:to-purple-300  bg-clip-text text-transparent">
            All Problems
          </h1>
          {isAdmin && (
            <button
              onClick={() => navigate("/create-problem")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg shadow hover:from-green-600 hover:to-emerald-600 transition"
            >
              <HiPlus className="text-xl" />
              Create Problem
            </button>
          )}
        </div>
        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading problems...</p>
        ) : 
        (problems.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No problems found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow border dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Difficulty
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                    Tags
                  </th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {problems.map((problem) => (
                  <tr
                    key={problem._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td
                      className="px-4 py-3 cursor-pointer text-blue-600 dark:text-blue-400 hover:underline"
                      onClick={() => navigate(`/problems/${problem._id}`)}
                    >
                      {problem.title}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyBadge(
                          problem.difficulty
                        )}`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                      {problem.tags.join(", ")}
                    </td>
                    <td className="px-4 py-3 flex justify-end gap-2 flex-wrap">
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-sm"
                        onClick={() => navigate(`/problems/${problem._id}`)}
                      >
                        View
                      </button>
                      {isAdmin && (
                        <>
                          <button
                            className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition text-sm"
                            onClick={() =>
                              navigate(`/edit-problem/${problem._id}`)
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
                            onClick={() => handleDelete(problem._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Problems;

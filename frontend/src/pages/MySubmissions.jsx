import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get("http://localhost:3000/my-submissions", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubmissions(res.data.submissions);
      } catch (error) {
        console.error("Failed to fetch submissions", error);
      }
    };

    fetchSubmissions();
  }, [token]);

  return (
    <div className="min-h-screen py-10 px-6 bg-gradient-to-tr 
      from-[#5896ed] via-[#dcd5e2] to-[#ff7ea7]
      dark:from-[#0d006e] dark:via-[#31258d] dark:to-[#531515]
      text-gray-800 dark:text-white">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">📜 My Submissions</h2>
        {submissions.length === 0 ? (
          <p className="text-center">No submissions yet.</p>
        ) : (
          <table className="w-full text-sm border dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md rounded">
            <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100">
              <tr>
                <th className="p-2">#</th>
                <th className="p-2 text-left">Problem</th>
                <th className="p-2">Language</th>
                <th className="p-2">Verdict</th>
                <th className="p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, idx) => (
                <tr
                  key={sub._id}
                  className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="p-2 text-center">{idx + 1}</td>
                  <td className="p-2 text-blue-600 hover:underline">
                    <Link to={`/problems/${sub.problem?._id || ""}`}>
                        {sub.problem?.title || "Unknown Problem"}
                    </Link>
                  </td>
                  <td className="p-2 text-center">{sub.language}</td>
                  <td
                    className={`p-2 text-center font-semibold ${
                      sub.verdict === "Accepted"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {sub.verdict}
                  </td>
                  <td className="p-2 text-center">
                    {new Date(sub.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

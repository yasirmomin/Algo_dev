import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function SubmissionList({refreshSignal}) {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user,setUser]=useState(null);
  const token = localStorage.getItem("token");
  useEffect(() => {
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user); // user is authenticated
    } catch (err) {
      console.log("Token invalid or expired",err);
      setUser(null);
      localStorage.removeItem("token");
    }
  };

  checkAuth();
}, []);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/problems/${id}/submissions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSubmissions(res.data.submissions);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      }
      setLoading(false);
    };
    fetchSubmissions();
  }, [id, token, refreshSignal]);

  if (loading) return <div className="p-4">Loading submissions...</div>;

  if (!user)
    return (
      <div className="p-4 text-center">
        <h2 className="text-xl dark:text-white">
          You must{" "}
          <Link
            to="/login"
            className="text-blue-700 hover:underline dark:text-blue-400"
          >
            login
          </Link>{" "}
          to view submissions.
        </h2>
      </div>
    );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">📝 My Submissions</h2>

      {submissions.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No submissions yet.</p>
      ) : (
        <ul className="grid gap-4">
          {submissions.map((s, idx) => (
            <li
              key={s._id}
              className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {/* Serial Number */}
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    #{submissions.length-idx}
                  </span>

                  {/* Verdict Badge */}
                  <span
                    className={`inline-block text-xs font-semibold px-2 py-1 rounded ${
                      s.verdict === "Accepted"
                        ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                        : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200"
                    }`}
                  >
                    {s.verdict}
                  </span>
                </div>
                {/* Language */}
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {s.language.toUpperCase()}
                </span>
              </div>

              {/* Submission Date */}
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {new Date(s.createdAt).toLocaleString()}
              </div>

              <Link
                to={`/problems/${id}/${s._id}`}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm"
              >
                🔍 View Submission Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SubmissionList;

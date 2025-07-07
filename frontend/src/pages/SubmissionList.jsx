import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function SubmissionList() {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const token =localStorage.getItem("token");


  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/problems/${id}/submissions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSubmissions(res.data.submissions);
      } catch (err) {
        console.error("Error fetching submissions:", err);
      }
      setLoading(false);
    }
    fetchSubmissions()
  }, [id]);

  if (loading) return <div className="p-4">Loading submissions...</div>;
  if(!token) return (
    <div>
      <h2 className="text-xl dark:text-white">You must <Link to={"/login"} className="text-blue-700 hover:underline dark:text-blue-500 hover:text-blue-800">login </Link>to view submissions</h2>
      
    </div>

  )
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Submissions</h2>
      
      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <ul className="space-y-2">
          {submissions.map((s) => (
            <li key={s._id} className="border p-2 rounded">
              <p><strong>Verdict:</strong> {s.verdict}</p>
              <p><strong>Language:</strong> {s.language}</p>
              <Link
                className="text-blue-600 underline"
                to={`/problems/${id}/${s._id}`}
              >
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SubmissionList;

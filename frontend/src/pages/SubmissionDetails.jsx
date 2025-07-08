import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function SubmissionDetails() {
  const { id, submissionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState(null);
  const [complexity, setComplexity] = useState("");
  const [loadingComplexity, setLoadingComplexity] = useState(false);

  useEffect(() => {
    const fetchSubmissionDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/problems/${id}/${submissionId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSubmission(res.data.submission);
      } catch (error) {
        console.error("Error fetching submission details:", error);
      }
      setLoading(false);
    };
    fetchSubmissionDetails();
  }, [id, submissionId]);

  const handleGetComplexity = async () => {
    setLoadingComplexity(true);
    setComplexity("Analyzing time complexity...");

    try {
      const res = await axios.post(
        "http://localhost:3000/ai/time-complexity",
        { code: submission.code },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setComplexity(res.data.complexity);
    } catch (error) {
      console.error("Error fetching time complexity:", error);
      setComplexity("Failed to analyze time complexity.");
    } finally {
      setLoadingComplexity(false);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (!submission) return <div className="p-4">Submission not found.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Submission Details</h2>
        <button
          onClick={handleGetComplexity}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded shadow transition"
        >
          ⏱️ Get Time Complexity
        </button>
      </div>

      <div className="space-y-3 text-gray-700 dark:text-gray-300">
        <p>
          <strong>Problem:</strong> {submission.problem?.title || submission.problem?.name}
        </p>
        <p>
          <strong>Verdict:</strong>{" "}
          <span
            className={`font-semibold ${
              submission.verdict === "Accepted" ? "text-green-600" : "text-red-500"
            }`}
          >
            {submission.verdict}
          </span>
        </p>
        <p>
          <strong>Language:</strong> {submission.language}
        </p>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200 ">Code:</h3>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded border border-gray-200 dark:text-gray-200 dark:border-gray-700 overflow-x-auto text-sm">
          {submission.code}
        </pre>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">Output:</h3>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded border border-gray-200 dark:text-gray-200 dark:border-gray-700 overflow-x-auto text-sm">
          {submission.output}
        </pre>
      </div>

      {loadingComplexity && (
        <p className="mt-4 text-sm text-gray-500">⏳ Analyzing...</p>
      )}
      {complexity && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm whitespace-pre-wrap">
          {complexity}
        </div>
      )}
    </div>
  );
}

export default SubmissionDetails;

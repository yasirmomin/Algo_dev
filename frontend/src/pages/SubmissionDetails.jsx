import { useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import axios from "axios";
function SubmissionDetails() {
    const { id ,submissionId} = useParams();
    const [loading,setLoading]=useState(true);
    const [submission,setSubmission] =useState(null);
    useEffect(()=>{
      const fetchSubmissionDetails = async ()=>{
        try {
          const res= await axios.get(`http://localhost:3000/problems/${id}/${submissionId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }} );
          setSubmission(res.data.submission);
        }
        catch (error) {
          console.error("Error fetching Details", error);
        }
        setLoading(false);
      }
      fetchSubmissionDetails();
    },[id,submissionId]);

    if(loading) return <div className="p-4">Loading...</div>

    if (!submission) return <div className="p-4">Submission not found.</div>;
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Submission Details</h2>
      <p><strong>Problem:</strong> {submission.problem?.title || submission.problem?.name}</p>
      <p><strong>Verdict:</strong> {submission.verdict}</p>
      <p><strong>Language:</strong> {submission.language}</p>
      <p className="mt-4"><strong>Code:</strong></p>
      <pre className="bg-gray-100 p-3 rounded border overflow-x-auto">
        {submission.code}
      </pre>
      <p className="mt-4"><strong>Output:</strong></p>
      <pre className="bg-gray-100 p-3 rounded border overflow-x-auto">
        {submission.output}
      </pre>
    </div>
  );
}

export default SubmissionDetails

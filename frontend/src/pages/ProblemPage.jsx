import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import SplitPane from "react-split";

import axios from "axios";

function ProblemPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");


  useEffect(() => {
    axios
      .get(`http://localhost:3000/problems/${id}`)
      .then((res) => setProblem(res.data.problem))
      .catch((err) => console.error(err));
  }, [id]);

  const handleRun = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to run code.");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:8000/run",
        {
          code,
          language,
          input,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }

      );
      setOutput(res.data.output);
    } catch (error) {
      if (error.response?.status === 403) {
        alert("You must be logged in to run code.");
        return;
      }
      setOutput(
        error.response?.data?.error ||
        "An error occurred while running the code."
      );

    }
  };
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to submit code.");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:3000/submit",
        {
          code,
          language,
          problemId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOutput(`Verdict: ${res.data.verdict}`);
    } catch (error) {
      console.error("Error submitting code:", error);
      if (error.response?.status === 403) {
        alert("You must be logged in to run code.");
        return;
      }
      setOutput(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "An error occurred while running the code."
      );
    }
  };


  if (!problem) return <div className="p-4">Loading...</div>;

  return (
  <div className=" p-2 bg-gradient-to-br from-white via-indigo-50 to-blue-50 dark:from-[#1e1b4b] dark:to-[#0f0c29]">
    <h1 className="text-3xl font-extrabold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
      {problem.name}
    </h1>
     
    <SplitPane
      split="vertical"
      defaultSize="50%"
      minSize={300}
      className="h-[90%] flex rounded-lg"
    >
      
      {/* Left Pane */}
      <div className="p-6 h-screen overflow-y-auto bg-white/90 dark:bg-white/5 border dark:border-gray-700 rounded-2xl shadow-inner">
      
        <h2 className="text-xl font-bold mb-3">Problem Description</h2>
        <div className="flex items-center gap-4 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
              problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
              'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {problem.difficulty}
            </span>
            {problem.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {problem.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        <p className="whitespace-pre-wrap mb-4 text-gray-800 dark:text-gray-200">{problem.statement}</p>

        {problem.testCases?.length > 0 && (
          <div>
            <h4 className="text-md font-semibold mb-2">Sample Test Cases</h4>
            {problem.testCases.map((tc, idx) => (
              <div
                key={idx}
                className="border border-gray-300 dark:border-gray-700 rounded mb-3 p-3 bg-gray-50 dark:bg-gray-800"
              >
                <p className="text-sm font-semibold">Input:</p>
                <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto">{tc.input}</pre>
                <p className="text-sm font-semibold mt-2">Expected Output:</p>
                <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto">{tc.output}</pre>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Pane */}
      <div className="flex flex-col gap-3 h-screen p-6 overflow-y-auto bg-white/90 dark:bg-white/5 border dark:border-gray-700 rounded-2xl shadow-inner">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border p-2 rounded w-1/3 text-sm dark:bg-gray-800 dark:text-white"
        >
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
        </select>

        <CodeEditor code={code} setCode={setCode} language={language} />

        <textarea
          placeholder="Custom Input..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 rounded text-sm dark:bg-gray-800 dark:text-white"
          rows="3"
        />

        <div className="flex gap-3">
          <button
            onClick={handleRun}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow transition"
          >
            ▶️ Run Code
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow transition"
          >
            ✅ Submit Code
          </button>
        </div>

        <textarea
          placeholder="Output..."
          readOnly
          value={output}
          className="bg-gray-100 dark:bg-gray-900 border p-2 rounded mt-2 text-sm"
          rows="8"
        />
      </div>
    </SplitPane>
  </div>
);

}

export default ProblemPage;

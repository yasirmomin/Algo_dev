import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import Split from "react-split";
import axios from "axios";
import HeaderNavigation from "../components/HeaderNavigation";
import Description from "../components/Description";
import Solutions from "./Solutions";
import Submissions from "./SubmissionList";
import { Navigate } from "react-router-dom";
import './split.css';
import SubmissionDetails from "./SubmissionDetails";
function ProblemPage() {
  const { id ,submissionId} = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [theme, setTheme] = useState("light");
  const navigate= useNavigate();

  const location = useLocation();
  const isSolutions = location.pathname.includes("solutions");
  const isSubmissions = location.pathname.includes("submissions");
  const isDetail=Boolean(submissionId);

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
      navigate(`/problems/${id}/submissions`);
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
  const handleThemeChange = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  if (!problem) return <div className="p-4">Loading...</div>;

  return (
    <div className=" p-2 bg-gradient-to-br bg-gray-300 dark:bg-black ">
      <h1 className="text-3xl font-extrabold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400">
        {problem.name}
      </h1>
      <HeaderNavigation problemId={problem._id} />
      <Split
        split="vertical"
        minSize={300}
        className="h-[90%] relative flex rounded-lg custom-split"
        gutterSize={7}
      >
        {/* Left Pane */}
        <div className="p-6 h-screen overflow-y-scroll bg-white dark:bg-white/25 border dark:border-gray-700 rounded-2xl shadow-inner">
          {isSolutions ? (
            <Solutions />
          ) : isSubmissions ? (
            <Submissions />
          ) : isDetail ?(
            <SubmissionDetails/>
          ):
          (
            <Description problem={problem} />
          )}
        </div>

        {/* Right Pane */}
        <div className="flex flex-col gap-3 h-screen p-6  bg-white dark:bg-white/25 border dark:border-gray-700 rounded-2xl shadow-inner">
          <div className="flex items-center justify-between mb-2">
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
            {(theme === "dark") ? (
              <button className=" border py-1 px-3 rounded-xl dark:text-gray-300 cursor-pointer font-semibold  hover:bg-gray-500 transition-colors delay-300 " onClick={handleThemeChange}>🌙 Dark</button>
            ) : (
              <button className=" border p-1 px-3 rounded-xl cursor-pointer dark:text-gray-300 font-semibold hover:bg-gray-500" onClick={handleThemeChange}>
                ☀️ Light
              </button>
            )}
          </div>

          <CodeEditor code={code} setCode={setCode} language={language} theme={theme} />

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
            className="bg-gray-100 dark:bg-gray-800 border p-2 rounded mt-2 text-sm dark:text-white"
            rows="8"
          />
        </div>
      </Split>
    </div>
  );

}

export default ProblemPage;

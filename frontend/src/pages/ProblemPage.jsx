import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "../components/CodeEditor";
import axios from "axios";

function ProblemPage() {
    const { id } = useParams();
    const [problem, setProblem] = useState(null);
    const [code, setCode] = useState("// Write your code here");
    const [language, setLanguage] = useState("cpp");
    const [output, setOutput] = useState("");
    const [input, setInput] = useState("");

    // Fetch problem details
    useEffect(() => {
        axios
            .get(`http://localhost:3000/problems/${id}`)
            .then((res) => setProblem(res.data.problem))
            .catch((err) => console.error(err));
    }, [id]);

    const handleRun = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("⚠️ You must be logged in to run code.");
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
            setOutput(error.response?.data?.error || "An error occurred while running the code.");
        }
    };

    //   const handleSubmit = async () => {
    //     try {
    //       const res = await axios.post(
    //         "http://localhost:8000/submit",
    //         {
    //           code,
    //           language,
    //           problemId: id,
    //         },
    //         {
    //           headers: {
    //             Authorization: `Bearer ${localStorage.getItem("token")}`,
    //           },
    //         }
    //       );
    //       setOutput(res.data.verdict);
    //     } catch (error) {
    //       setOutput(error.response?.data?.error || "An error occurred while submitting the code.");
    //     }
    //   };

    if (!problem) return <div className="p-4">Loading...</div>;

    return (
        <div className="p-4 flex flex-col gap-4">
            <h1 className="text-2xl font-bold">{problem.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Problem description */}
                <div className="border rounded p-4 bg-white max-h-[600px] overflow-y-auto">
                    <h2 className="text-lg font-semibold mb-2">Problem Description</h2>
                    <p className="whitespace-pre-wrap">{problem.statement}</p>
                </div>

                {/* Code editor and controls */}
                <div className="flex flex-col gap-2">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="java">Java</option>
                        <option value="cpp">C++</option>
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                    </select>

                    <CodeEditor code={code} setCode={setCode} language={language} />

                    <textarea
                        placeholder="Custom Input:"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="border p-2 rounded"
                        rows="3"
                    />

                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={handleRun}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Run Code
                        </button>
                        <button
                            //   onClick={handleSubmit}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                            Submit Code
                        </button>
                    </div>

                    <textarea
                        placeholder="Output:"
                        readOnly
                        value={output}
                        className="bg-gray-100 border p-2 rounded mt-2"
                        rows="8"
                    />
                </div>
            </div>
        </div>
    );
}

export default ProblemPage;

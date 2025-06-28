import { useState } from "react";
import CodeEditor from "../components/CodeEditor";
import axios from "axios";

function Submit() {
  const [code, setCode] = useState("// Write your code here");
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const handleRun = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/run",
        {
          code,
          language,
          input
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

  return (
    <div className="text-center mt-10 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Online Compiler</h1>

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="border px-2 py-1 mb-2"
      >
        <option value="java">Java</option>
        <option value="cpp">C++</option>
        <option value="python">Python</option>
        <option value="javascript">Javascript</option>
      </select>

      <CodeEditor code={code} setCode={setCode} language={language} />

      <textarea
        placeholder="Custom Input:"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border mt-4 p-2 w-3xl"
        rows="4"
      />

      <button
        onClick={handleRun}
        className="bg-blue-600 text-white px-4 py-2 mt-4 rounded hover:bg-blue-700"
      >
        Run Code
      </button>
      <textarea
        placeholder="Output:"
        readOnly
        className="bg-gray-100 border mt-4 mb-4 p-2 w-3xl"
        rows="8"
        value={output}
      />
    </div>
  );
}

export default Submit;

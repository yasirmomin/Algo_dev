import { HiClipboardCopy } from "react-icons/hi"
import { useState } from "react";
function Description({ problem }) {

  const [copied, setCopied] = useState({});

  const handleCopy = async (key, value) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopied((prev) => ({ ...prev, [key]: false }));
      }, 1000); // 1 second
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="
    h-full
    overflow-y-scroll
    p-4
    rounded-xl
    border
    border-gray-200
    bg-white
    dark:border-gray-900
    dark:bg-black/50
    backdrop-blur
  ">
      <h2 className="text-2xl dark:text-white font-bold mb-3">{problem.title}</h2>
      <div className="flex items-center gap-4 mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
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
      <p className="whitespace-pre-wrap text-xl mb-4 text-gray-800 dark:text-gray-400">{problem.statement}</p>

      {problem.testCases?.filter((tc) => !tc.hidden).length > 0 && (
        <div>
          <h4 className="text-lg dark:text-white font-semibold mb-2">
            Sample Test Cases:
          </h4>
          {problem.testCases
            .filter((tc) => !tc.hidden)
            .map((tc, idx) => (
              <div
                key={idx}
                className="border border-gray-300 dark:border-gray-700 rounded mb-3 p-3 bg-gray-100 dark:bg-gray-800"
              >
                {/* Input */}
                <div className="flex justify-between py-2">
                  <p className="text-md dark:text-white font-semibold">Input:</p>
                  <button
                    onClick={() => handleCopy(`input-${idx}`, tc.input)}
                    className="flex items-center gap-1 text-sm dark:text-gray-300 hover:underline"
                  >
                    <HiClipboardCopy />
                    {copied[`input-${idx}`] ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="bg-gray-300 dark:text-gray-400 dark:bg-[#27272f] p-2 rounded text-md overflow-x-auto">
                  {tc.input}
                </pre>

                {/* Output */}
                <div className="flex justify-between py-2">
                  <p className="text-md dark:text-white font-semibold">
                    Expected Output:
                  </p>
                  <button
                    onClick={() => handleCopy(`output-${idx}`, tc.output)}
                    className="flex items-center gap-1 text-sm dark:text-gray-300 hover:underline"
                  >
                    <HiClipboardCopy />
                    {copied[`output-${idx}`] ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="bg-gray-300 dark:text-gray-400 dark:bg-[#27272f] p-2 rounded text-md overflow-x-auto">
                  {tc.output}
                </pre>

                {/* Explanation */}
                {tc.explanation && (
                  <>
                    <p className="text-md dark:text-white py-2 font-semibold mt-2">
                      Explanation:
                    </p>
                    <pre className="bg-gray-300 dark:text-white dark:bg-[#323240] p-2 rounded text-md overflow-x-auto">
                      {tc.explanation}
                    </pre>
                  </>
                )}
              </div>
            ))}
        </div>
      )}


      {problem.constraints?.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg dark:text-white font-semibold mb-2">Constraints:</h4>
          <ul className="list-disc list-inside space-y-2">
            {problem.constraints.map((c, i) => (
              <li key={i} className="text-gray-800 dark:text-white whitespace-pre-wrap">{c}</li>
            ))}

          </ul>
        </div>
      )}

    </div>
  )
}

export default Description

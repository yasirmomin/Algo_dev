import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TAG_OPTIONS = [
  "Array",
  "Dynamic Programming",
  "Graph",
  "Greedy",
  "Sortings",
  "Math",
  "String",
  "Two Pointers",
  "Binary Search",
  "Tree",
  "Stack",
  "Queue",
  "Hashing"
];

function CreateProblem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    statement: '',
    difficulty: '',
    tags: [],
    testCases: [{ input: '', output: '', explanation: '', hidden: false }],
    constraints: [''],
    solutions: ''
  });
  const [message, setMessage] = useState('');
  const [tags, setTags] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...formData.testCases];
    updatedTestCases[index][field] = value;
    setFormData({ ...formData, testCases: updatedTestCases });
  };

  const addTestCase = () => {
    setFormData({
      ...formData,
      testCases: [...formData.testCases, { input: '', output: '', explanation: '', hidden: false }]
    });
  };

  const removeTestCase = (index) => {
    setFormData(prev => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index)
    }));
  };

  const handleConstraintChange = (index, value) => {
    const updatedConstraints = [...formData.constraints];
    updatedConstraints[index] = value;
    setFormData({ ...formData, constraints: updatedConstraints });
  };

  const addConstraint = () => {
    setFormData({
      ...formData,
      constraints: [...formData.constraints, '']
    });
  };

  const removeConstraint = (index) => {
    setFormData(prev => ({
      ...prev,
      constraints: prev.constraints.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const validTestCases = formData.testCases.filter(
      tc => tc.input.trim() !== '' || tc.output.trim() !== '' || tc.explanation.trim() !== ''
    );

    if (validTestCases.length === 0) {
      setMessage("Please add at least one test case.");
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        'http://localhost:3000/problems',
        {
          ...formData,
          title: formData.title.trim(),
          statement: formData.statement.trim(),
          tags,
          testCases: validTestCases,
          constraints: formData.constraints.filter(c => c.trim() !== ''),
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.status === 201) {
        setMessage("✅ Problem created successfully! Redirecting...");
        setFormData({
          title: '',
          statement: '',
          difficulty: '',
          tags: '',
          testCases: [{ input: '', output: '', explanation: '', hidden: false }],
          constraints: ['']
        });
        setTimeout(() => navigate('/problems'), 1500);
      }
    } catch (error) {
      console.error("❌ Error creating problem:", error);
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen grid">
      <div className="flex items-center justify-center bg-gradient-to-br 
  from-[#ff7ea7] via-45% via-[#dcd5e2] to-[#5896ed]
  dark:from-[rgba(187,5,111,0.88)] dark:via-45%  dark:via-[#111012]  dark:to-[#0231b1df] px-6 py-10">
        <div className="max-w-3xl w-full  bg-white/70 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-8 md:p-12 transition bg-fixed">
          <h2 className="text-center font-extrabold text-3xl md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-purple-500 dark:to-blue-500 drop-shadow-md mb-6">
            ✨ Create New Problem
          </h2>
          {message && (
            <p className="mb-4 text-center text-red-600 dark:text-red-400">
              {message}
            </p>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <input
              name="title"
              placeholder="Problem Title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />

            <textarea
              name="statement"
              placeholder="Problem Statement"
              value={formData.statement}
              onChange={handleChange}
              required
              rows="4"
              className="w-full border px-3 py-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />

            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">-- Select Difficulty --</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <div>
              <label className="block mb-2 font-semibold dark:text-gray-200">
                Test Cases:
              </label>
              {formData.testCases.map((testCase, index) => (
                <div
                  key={index}
                  className="mb-4 border p-3 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                >
                  <label className="block mb-1 text-sm font-medium dark:text-gray-300">
                    Input
                  </label>
                  <textarea
                    className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    value={testCase.input}
                    onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                    rows="2"
                  />
                  <label className="block mb-1 text-sm font-medium mt-2 dark:text-gray-300">
                    Expected Output
                  </label>
                  <textarea
                    className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    value={testCase.output}
                    onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                    rows="2"
                  />
                  <label className="block mb-1 text-sm font-medium mt-2 dark:text-gray-300">
                    Explanation (optional)
                  </label>
                  <textarea
                    className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    value={testCase.explanation}
                    onChange={(e) => handleTestCaseChange(index, 'explanation', e.target.value)}
                    rows="2"
                  />

                  <label className="inline-flex items-center mt-2">
                    <input
                      type="checkbox"
                      checked={testCase.hidden}
                      onChange={(e) => handleTestCaseChange(index, 'hidden', e.target.checked)}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm dark:text-gray-300">Hidden Test Case</span>
                  </label>

                  <div></div>

                  <button
                    type="button"
                    onClick={() => removeTestCase(index)}
                    disabled={formData.testCases.length === 1}
                    className={`mt-2 text-xs ${formData.testCases.length === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-red-600 dark:text-red-500 cursor-pointer hover:underline'
                      }`}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="text-sm text-blue-700 dark:text-blue-300 hover:underline cursor-pointer"
                onClick={addTestCase}
              >
                ➕ Add another test case
              </button>
            </div>

            <div>
              <label className="block mb-2 font-semibold dark:text-gray-200">
                Constraints:
              </label>
              {formData.constraints.map((constraint, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={constraint}
                    onChange={(e) => handleConstraintChange(idx, e.target.value)}
                    placeholder="Constraints"
                    className="w-full border px-3 py-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => removeConstraint(idx)}
                    disabled={formData.constraints.length === 1}
                    className={`text-xs ${formData.constraints.length === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-red-600 dark:text-red-500 hover:underline'
                      }`}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="text-sm text-blue-700 dark:text-blue-300 hover:underline cursor-pointer"
                onClick={addConstraint}
              >
                ➕ Add another constraint
              </button>
            </div>

            <label className="block mb-2 dark:text-gray-200 font-medium">Tags:</label>
            <div className="grid grid-cols-2 gap-2 border rounded p-2 dark:bg-gray-800 dark:text-white">
              {TAG_OPTIONS.map(tag => (
                <label key={tag} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={tag}
                    checked={tags.includes(tag)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTags(prev => [...prev, tag]);
                      } else {
                        setTags(prev => prev.filter(t => t !== tag));
                      }
                    }}
                    className="accent-indigo-600"
                  />
                  <span>{tag}</span>
                </label>
              ))}
            </div>

            <label className="block mb-2 dark:text-gray-200 font-medium">Solution (Markdown supported):</label>
            <textarea
              name="solutions"
              placeholder="Write detailed explanation and code solution using Markdown..."
              value={formData.solutions}
              onChange={handleChange}
              rows="6"
              className="w-full border px-3 py-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />


            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-lg shadow"
            >
              🚀 Submit Problem
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateProblem;

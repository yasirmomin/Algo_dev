import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateProblem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    statement: '',
    difficulty: '',
    tags: '',
    testCases: [{ input: '', output: '' }]
  });
  const [message, setMessage] = useState('');

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
      testCases: [...formData.testCases, { input: '', output: '' }]
    });
  };

  const removeTestCase = (index) => {
    setFormData(prev => ({
      ...prev,
      testCases: prev.testCases.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const validTestCases = formData.testCases.filter(
      tc => tc.input.trim() !== '' || tc.output.trim() !== ''
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
          tags: formData.tags.split(',').map(tag => tag.trim()),
          testCases: validTestCases
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.status === 201) {
        setMessage("Problem created successfully! Redirecting...");
        setFormData({
          title: '',
          statement: '',
          difficulty: '',
          tags: '',
          testCases: [{ input: '', output: '' }]
        });
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Something went wrong. Please try again.');
      }
    }
  };

  return (
  <div className="min-h-screen grid">
    <div className="flex items-center justify-center bg-gradient-to-br from-white via-indigo-50 to-blue-50 dark:from-[#1e1b4b] dark:to-[#0f0c29] px-6 py-10">
      <div className="max-w-3xl w-full bg-white/70 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-8 md:p-12 transition">
        <h2 className="text-center font-extrabold text-3xl md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-700 dark:to-purple-700 drop-shadow-md mb-6">
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

          <div>
            <label className="block mb-2 font-semibold dark:text-gray-200">
              Test Cases
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
                <button
                  type="button"
                  onClick={() => removeTestCase(index)}
                  disabled={formData.testCases.length === 1}
                  className={`mt-2 text-xs ${
                    formData.testCases.length === 1
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
              className="text-sm text-blue-700 dark:text-blue-700 hover:underline cursor-pointer"
              onClick={addTestCase}
            >
              ➕ Add another test case
            </button>
          </div>

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

          <input
            name="tags"
            placeholder="Tags (comma-separated)"
            value={formData.tags}
            onChange={handleChange}
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

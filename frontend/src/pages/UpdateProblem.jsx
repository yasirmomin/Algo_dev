import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function UpdateProblem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    statement: '',
    difficulty: '',
    tags: '',
    testCases: [{ input: '', output: '' }]
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProblem = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`http://localhost:3000/problems/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const { title, statement, difficulty, tags, testCases } = res.data.problem;
        setFormData({
          title,
          statement,
          difficulty,
          tags: tags.join(', '),
          testCases: testCases.map(tc => ({ input: tc.input, output: tc.output }))
        });
      } catch (err) {
        console.error("❌ Error fetching problem:", err);
        setMessage("Error loading problem details.");
      }
    };

    fetchProblem();
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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

    const validTestCases = formData.testCases.filter(
      tc => tc.input.trim() !== '' || tc.output.trim() !== ''
    );

    if (validTestCases.length === 0) {
      setMessage("Please add at least one test case.");
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:3000/problems/${id}`,
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

      setMessage("✅ Problem updated successfully!");
      setTimeout(() => navigate('/problems'), 1500);
    } catch (err) {
      console.error("❌ Error updating problem:", err);
      setMessage("Failed to update problem.");
    }
  };

  return (
  <div className="min-h-screen grid">
    <div className="flex items-center justify-center bg-gradient-to-br from-white via-indigo-200 to-blue-50 dark:from-[#2d277a] dark:to-[#231a75] px-6 py-10">
      <div className="max-w-3xl w-full bg-white/70 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-8 md:p-12 transition">
        <h1 className="text-center font-extrabold text-3xl md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-700 dark:to-purple-700 drop-shadow-md mb-6">
          ✏️ Edit Problem
        </h1>
        {message && (
          <p className="mb-4 text-center text-red-600 dark:text-red-400">
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
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
                  className={`mt-2 text-xs  ${
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
              className="text-sm text-blue-700 dark:text-blue-600 hover:underline cursor-pointer"
              onClick={addTestCase}
            >
              ➕ Add another test case
            </button>
          </div>

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
            💾 Update Problem
          </button>
        </form>
      </div>
    </div>
  </div>
);

}

export default UpdateProblem;

import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


function CreateProblem() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    statement: '',
    difficulty: '',
    tags: ''
  })
  const [message, setMessage] = useState('');
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const token = localStorage.getItem('token');
    try {
      const res= await axios.post(
      'http://localhost:3000/problems',
      {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim())
      }, 
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      if (res.status === 201) {
        setMessage("Problem created successfully! Redirecting...");
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
    <div className="max-w-xl mx-auto mt-10 bg-blue-400 p-6 rounded shadow">
      <h2 className="text-center font-bold text-2xl border-b p-4 rounded shadow-md bg-blue-200" >Add new problems</h2>
      {message && <p className="mb-4 text-center text-red-600">{message}</p>}
      <form className="space-y-4 mt-6" onSubmit={handleSubmit}>
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            name="title"
            className="w-full border px-3 py-2 rounded"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Statement</label>
          <textarea
            name="statement"
            className="w-full border px-3 py-2 rounded"
            value={formData.statement}
            onChange={handleChange}
            required
            rows="4"
          />
        </div>

        <div>
          <label className="block mb-1">Difficulty</label>
          <select
            name="difficulty"
            className="w-full border px-3 py-2 rounded"
            value={formData.difficulty}
            onChange={handleChange}
            required
          >
            <option value="">-- Select --</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            className="w-full border px-3 py-2 rounded"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g. arrays, dp, binary search"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-200 font-bold text-black py-2 rounded hover:bg-blue-700 hover:cursor-pointer"
        >
          Submit Problem
        </button>
      </form>
    </div>
  )
}

export default CreateProblem
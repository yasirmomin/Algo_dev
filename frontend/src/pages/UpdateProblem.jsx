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
    tags: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProblem = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`http://localhost:3000/problems/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const { title, statement, difficulty, tags } = res.data.problem;
        setFormData({
          title,
          statement,
          difficulty,
          tags: tags.join(', ') 
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:3000/problems/${id}`, {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim())
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage("✅ Problem updated successfully!");
      setTimeout(() => navigate('/problems'), 1500);
    } catch (err) {
      console.error("❌ Error updating problem:", err);
      setMessage("Failed to update problem.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h1 className="text-2xl font-bold mb-4 text-center">Edit Problem</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required className="w-full border p-2 rounded" />
        <textarea name="statement" placeholder="Statement" value={formData.statement} onChange={handleChange} rows="4" required className="w-full border p-2 rounded" />
        <select name="difficulty" value={formData.difficulty} onChange={handleChange} required className="w-full border p-2 rounded">
          <option value="">Select Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <input name="tags" placeholder="Tags (comma-separated)" value={formData.tags} onChange={handleChange} className="w-full border p-2 rounded" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Update</button>
      </form>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
}

export default UpdateProblem;

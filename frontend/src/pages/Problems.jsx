import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Problems() {
    const [problems, setProblems] = useState([]);
    const navigate = useNavigate();
    const fetchProblems = async () => {
        try {
            const res = await axios.get('http://localhost:3000/problems');
            setProblems(res.data.problems);
        } catch (error) {
            console.error("❌ Error fetching problems:", error.response?.data?.message || error.message);
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        if (!window.confirm("Are you sure you want to delete this problem?")) return;
        try {
            await axios.delete(`http://localhost:3000/problems/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProblems(); // Refresh the list
        } catch (err) {
            alert("❌ Error deleting problem");
            console.error(err);
        }
    };

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await axios.get('http://localhost:3000/verify', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsAdmin(res.data.user?.isAdmin || false);
            } catch (err) {
                console.error("❌ Token verification failed:", err.response?.data?.message || err.message);
                setIsAdmin(false);
            }
        };

        verifyUser();
        fetchProblems();
    }, []);


    return (
        <div className="text-center mt-10">
            <h1 className='font-bold text-3xl bg-blue-200 border p-4 rounded shadow'>ALL PROBLEMS</h1>
            {problems.length === 0 ? (
                <p>No problems found.</p>
            ) : (
                <ul className="space-y-4 mt-6">
                    {problems.map(problem => (
                        <li key={problem._id} className="border p-4 rounded shadow bg-white text-left">
                            <h3 className="text-xl font-semibold">{problem.title}</h3>
                            <p className="text-gray-700">{problem.statement}</p>
                            <p className="text-sm"><strong>Difficulty:</strong> {problem.difficulty}</p>
                            <p className="text-sm text-gray-500">Tags: {problem.tags.join(", ")}</p>

                            <div className="mt-3 flex flex-wrap gap-2">
                                <button
                                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                    onClick={() => navigate(`/problems/${problem._id}`)}
                                >
                                    View Problem
                                </button>

                                {isAdmin && (
                                    <>
                                        <button
                                            className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500"
                                            onClick={() => navigate(`/edit-problem/${problem._id}`)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            onClick={() => handleDelete(problem._id)}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>

                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Problems;

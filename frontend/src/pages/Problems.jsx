import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react'

function Problems() {
    const [problems, setProblems] = useState([]);
    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const res = await axios.get('http://localhost:3000/problems');
                console.log("✅ Problems fetched successfully:", res.data);
                setProblems(res.data.problems);
                
            } catch (error) {
                console.error("❌ Error fetching problems:", error.response?.data?.message || error.message);
            }
        }
        fetchProblems();
        }, []);
    return (
        <div className="text-center mt-10">
            <h1 className='font-bold text-3xl bg-blue-200 border p-4 rounded shadow   '>ALL PROBLEMS</h1>
            {problems.length === 0 ? (
                <p>No problems found.</p>
            ) : (
                <ul className="space-y-4">
                    {problems.map(problem => (
                        <li key={problem._id} className="border p-4 rounded shadow">
                            <h3 className="text-xl font-semibold">{problem.title}</h3>
                            <p className="text-gray-700">{problem.statement}</p>
                            <p className="text-sm mt-1"><strong>Difficulty:</strong> {problem.difficulty}</p>
                            <p className="text-sm text-gray-500">Tags: {problem.tags.join(", ")}</p>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    )
}

export default Problems
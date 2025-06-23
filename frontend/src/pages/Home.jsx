import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const isAuthenticated = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="py-8 text-center">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Welcome to the Online Judge</h1>
      {isAuthenticated && <h2 className="text-lg mb-6">Hello, {user?.firstName}!</h2>}

      <div className="space-x-4">
        <Link to="/problems" className="px-4 py-2 bg-green-500 text-white rounded">View Problems</Link>
      </div>
    </div>
  );
}

export default Home;

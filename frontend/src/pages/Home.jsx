import React from 'react';
import { Link } from 'react-router-dom';

function Home() {

  return (
    <div className="py-8 text-center">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">Welcome to the Online Judge</h1>

      <div className="space-x-4">
        <Link to="/problems" className="px-4 py-2 bg-green-500 text-white rounded">View Problems</Link>
        <Link to="/submit" className="px-4 py-2 bg-blue-500 text-white rounded">Submit Solution</Link>
      </div>

    </div>
  );
}

export default Home;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        return;
      }

      try {
        const res = await axios.get('http://localhost:3000/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsAuthenticated(true);
        setIsAdmin(res.data.user?.isAdmin || false);
      } catch (err) {
        console.error("❌ Token verification failed:", err.response?.data?.message || err.message);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };

    verifyToken();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setIsAdmin(false);
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">Online Judge</Link>
      <div className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>

        {!isAuthenticated && (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
          </>
        )}

        {isAuthenticated && (
          <>
            <Link to="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
            {isAdmin && (
              <Link to="/create-problem" className="text-gray-700 hover:text-blue-600">Create Problem</Link>
            )}
            <button onClick={handleLogout} className="text-gray-700 hover:text-blue-600">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

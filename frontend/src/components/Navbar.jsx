import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');
  console.log("isAuthenticated",isAuthenticated);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">Online Judge</Link>
      <div className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
        {
          isAuthenticated? (
            <button onClick={handleLogout} className="text-gray-700 hover:text-blue-600">Logout</button>
          ) : (
            <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
          )
        }
        <Link to="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
        {
          isAuthenticated && (
            <Link to="/profile" className="text-gray-700 hover:text-blue-600">Profile</Link>
          )
        }
      </div>
    </nav>
  )
}

export default Navbar
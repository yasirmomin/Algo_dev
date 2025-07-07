import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        await axios.get("http://localhost:3000/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAuthenticated(true);

      } catch (err) {
        setIsAuthenticated(false);

        console.error("Token verification failed:", err.response?.data?.message || err.message);
      }
    };
    verifyToken();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);

    window.location.href = "/login";
  };

  return (
    <div className="bg-white/60 dark:bg-[#1E1E1E]  border-b border-gray-200 dark:border-gray-800 shadow-sm ">
    <nav className=" py-4 px-6 flex items-center justify-between">
      <Link to="/" className="text-2xl font-extrabold tracking-tight text-indigo-600 dark:text-white">
        Online Judge
      </Link>

      <div className="flex items-center space-x-2 md:space-x-4 text-sm font-medium">
        <Link
          to="/"
          className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white transition"
        >
          Home
        </Link>

        {!isAuthenticated ? (
          <>
            <Link
              to="/login"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white transition"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/profile"
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white transition"
            >
              Profile
            </Link>
            
            <button
              onClick={handleLogout}
              className="text-gray-700 dark:text-gray-300 hover:text-red-500 transition"
            >
              Logout
            </button>
          </>
          
        )}

        <button
          onClick={() => {
            const html = document.documentElement;
            if (html.classList.contains("dark")) {
              html.classList.remove("dark");
              localStorage.theme = "light";
              setIsDark(false);
            } else {
              html.classList.add("dark");
              localStorage.theme = "dark";
              setIsDark(true);
            }
          }}
          className="border px-3 py-1 rounded-full dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          {isDark ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </nav>
    </div>
  );
}

export default Navbar;
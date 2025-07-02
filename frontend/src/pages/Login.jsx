import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("http://localhost:3000/login", formData);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      if (res.status === 200) {
        setMessage("✅ Login successful! Redirecting...");
        setTimeout(() => (window.location.href = "/"), 1500);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login Failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen grid ">
      
      <div className="flex items-center justify-center bg-gradient-to-br from-white via-indigo-50 to-blue-50 dark:from-[#1e1b4b] dark:to-[#0f0c29] px-6">
        <div className="w-full max-w-md space-y-6 bg-white/80 dark:bg-white/5 backdrop-blur-md p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
              <p
                className={`text-sm ${
                  message.startsWith("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your email"
                className="w-full px-4 py-3 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Your password"
                className="w-full px-4 py-3 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white pr-10"
              />
              <div
                className="absolute right-3 top-3 text-xl text-gray-500 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:from-indigo-600 hover:to-purple-600 transition shadow"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
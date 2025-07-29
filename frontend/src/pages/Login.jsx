import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("Token is valid:", response.data);
          navigate("/"); 
        })
        .catch((error) => {
          console.log("Token invalid or expired. Clearing storage.", error);
          localStorage.clear();
          window.location.href = "/login";
        });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, formData);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      if (res.status === 200) {
        setMessage("✅ Login successful! Redirecting...");
        setTimeout(() => (window.location.href = "/"), 1500);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen grid ">

      <div className="flex items-center justify-center bg-gradient-to-bl from-[rgb(254,167,226)]  via-[#ffb4b4] to-blue-300 dark:from-[#000000] dark:via-25% dark:via-[#302e3e] dark:to-[#000000] px-6">
        <div className="w-full max-w-md space-y-6 bg-white/80 dark:bg-gray-900 backdrop-blur-md p-8 rounded-xl border-4 shadow border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
              <p
                className={`text-sm ${message.startsWith("✅") ? "text-green-600" : "text-red-600"
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
              disabled={loading}
              className={`w-full py-3 rounded font-semibold shadow transition ${loading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white"
                }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
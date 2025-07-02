import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("http://localhost:3000/register", formData);
      if (res.status === 201) {
        setMessage("✅ Registered successfully! Redirecting...");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-white via-indigo-50 to-blue-50 dark:from-gray-900 dark:to-black">
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-600 dark:text-white">
          Create Account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {["firstName", "lastName", "email", "phone", "username"].map((field) => (
            <div key={field}>
              <label className="block text-gray-700 dark:text-white-500 mb-1 capitalize">{field}</label>
              <input
                type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field === "phone" ? "10-digit phone" : `Your ${field}`}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
          ))}

          <div className="relative">
            <label className="block text-gray-700 dark:text-white-500mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white pr-10"
            />
            <div
              className="absolute right-3 top-9 text-gray-600 dark:text-white-500 text-2xl cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:from-indigo-600 hover:to-purple-600 transition shadow"
          >
            Register
          </button>

          {message && (
            <p
              className={`mt-3 text-center text-sm ${
                message.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        <p className="mt-4 text-center text-gray-600 dark:text-white-500">
          Already registered?{" "}
          <Link to="/login" className="text-indigo-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
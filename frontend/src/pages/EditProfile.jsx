import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function EditProfile() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    profilePic: "",
  });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm({
          firstName: res.data.user.firstName || "",
          lastName: res.data.user.lastName || "",
          profilePic: res.data.user.profilePic || "",
        });
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       await axios.put(`${import.meta.env.VITE_BACKEND_URL}/user/me`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({
        title: "Profile Updated",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/profile");
      });
    } catch (err) {
      console.error("Error updating profile:", err.response?.data || err);
      Swal.fire({
        title: "Update Failed",
        text: err.response?.data?.message || "Could not update profile.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  if (loading) return <p className="p-4">Loading profile...</p>;

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-purple-300 via-rose-200 to-pink-300 dark:from-[#000000] dark:via-25% dark:via-[#302e3e] dark:to-[#000000]">
      <div className="max-w-lg mx-auto bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md border-3 dark:shadow-amber-50 shadow-pink-400">
        <h2 className="text-2xl font-bold mb-4 text-center dark:text-white">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 dark:text-white">First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-1 dark:text-white">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block mb-1 dark:text-white">Profile Picture URL</label>
            <input
              type="text"
              name="profilePic"
              value={form.profilePic}
              onChange={handleChange}
              className="w-full border p-2 rounded dark:bg-gray-800 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

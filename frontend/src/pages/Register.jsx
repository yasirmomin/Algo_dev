import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const res = await axios.post("http://localhost:3000/register", formData);
          
              if (res.status === 201) {
                setMessage("✅ Registered successfully! Redirecting...");
                setTimeout(() => navigate('/login'), 1500);
              }
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Someting went wrong');
            }
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center ">
            <div className="bg-white shadow-md rounded px-8 py-10 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Register</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-gray-700 mb-1">First Name</label>
                        <input type="text"
                            name='firstName'
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="First Name"
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Last Name</label>
                        <input type="text"
                            name='lastName'
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Last Name"
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Email</label>
                        <input type="email" 
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                        placeholder="Email"
                         className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Phone Number</label>
                        <input type="tel" 
                        name='phone'
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit phone" 
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>

                    <div className="relative">
                        <label className="block text-gray-700 mb-1"> Create Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                        />
                        <div
                            className="absolute right-3 top-9 text-gray-600 text-2xl cursor-pointer"
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 cursor-pointer rounded hover:bg-blue-700 transition duration-300"
                    >
                        Register
                    </button>
                </form>
                {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>  }
            </div>
        </div>
    );
}

export default Register;

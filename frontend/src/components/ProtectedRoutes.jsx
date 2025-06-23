import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

function ProtectedRoutes({ children }) {
  const [authorized, setAuthorized] = useState(null); 

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthorized(false);
        return;
      }

      try {
        const res = await axios.get('http://localhost:3000/verify', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("✅ Backend verified token:", res.data.message);
        setAuthorized(true);
      } catch (err) {
        console.error("❌ Token invalid or expired:", err.response?.data?.message || err.message);
        setAuthorized(false);
      }
    };

    checkToken();
  }, []);

  if (authorized === null) {
    return <p className="text-center mt-10">⏳ Verifying token...</p>;
  }

  if (!authorized) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoutes;

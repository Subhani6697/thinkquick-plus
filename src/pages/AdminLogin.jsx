import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await login(email, password);
      const user = result.user;

      // 🔥 Fetch admin flag from Firestore
      const snap = await getDoc(doc(db, "users", user.uid));

      if (!snap.exists() || snap.data().isAdmin !== true) {
        setError("Not authorized as admin");
        return;
      }

      // Redirect to admin dashboard
      navigate("/admin");
    } catch (err) {
      console.error(err);
      setError("Invalid admin credentials");
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full"
      >
        <h2 className="text-xl font-bold text-yellow-400 mb-4">Admin Login</h2>

        {error && <p className="text-red-400 mb-3">{error}</p>}

        <input
          type="email"
          placeholder="Admin Email"
          className="w-full mb-3 p-2 rounded bg-gray-700"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 rounded bg-gray-700"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-yellow-500 py-2 rounded font-bold">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;

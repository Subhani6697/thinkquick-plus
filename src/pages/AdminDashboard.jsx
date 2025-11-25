import React from "react";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="bg-gray-900 min-h-screen p-8 text-white">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">
        Admin Dashboard
      </h1>

      <p className="text-lg">Welcome, {user.displayName || user.email}</p>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">User Management</h2>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">Game Data</h2>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

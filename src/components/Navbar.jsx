import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-gray-900 text-white flex items-center justify-between px-8 py-4 shadow-md">
      
      {/* Logo */}
      <Link to="/">
        <h1 className="text-2xl font-bold text-yellow-400 tracking-wide cursor-pointer">
          ThinkQuick<span className="text-blue-400">+</span>
        </h1>
      </Link>

      {/* Navigation Links */}
      <div className="flex gap-6 text-lg items-center">

        <Link to="/" className="hover:text-yellow-300 transition">
          Home
        </Link>

        <Link to="/categories" className="hover:text-yellow-300 transition">
          Games
        </Link>

        <Link to="/leaderboard" className="hover:text-yellow-300 transition">
          Leaderboard
        </Link>

        <Link to="/about" className="hover:text-yellow-300 transition">
          About
        </Link>

        <Link to="/contact" className="hover:text-yellow-300 transition">
          Contact
        </Link>

        {/* ---------- AUTH SECTION ---------- */}
        {!isAuthenticated ? (
          <>
            {/* Login */}
            <Link
              to="/login"
              className="px-3 py-1 bg-blue-500 text-black rounded-lg text-sm font-semibold hover:bg-blue-400 transition"
            >
              Login
            </Link>

            {/* Sign Up */}
            <Link
              to="/signup"
              className="px-3 py-1 bg-green-500 text-black rounded-lg text-sm font-semibold hover:bg-green-400 transition"
            >
              Sign Up
            </Link>

            <Link
              to="/admin-login"
              className="px-3 py-1 bg-purple-500 text-black rounded-lg text-sm font-semibold hover:bg-purple-400 transition"
            >
              Admin
            </Link>

          </>
        ) : (
          <div className="flex items-center gap-3">

            {/* Show Username */}
            <span className="text-sm text-gray-300">
              Hi, <span className="text-yellow-300 font-semibold">
                {user?.displayName}
              </span>
            </span>

            {/* Logout */}
            <button
              onClick={logout}
              className="px-3 py-1 bg-red-500 text-black rounded-lg text-sm font-semibold hover:bg-red-400 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

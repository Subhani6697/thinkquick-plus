import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white flex items-center justify-between px-8 py-4 shadow-md">
      
      {/* Logo */}
      <h1 className="text-2xl font-bold text-yellow-400 tracking-wide">
        ThinkQuick<span className="text-blue-400">+</span>
      </h1>

      {/* Navigation Links */}
      <div className="flex gap-6 text-lg">
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
      </div>
    </nav>
  );
};

export default Navbar;

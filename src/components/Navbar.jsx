import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white flex items-center justify-between px-8 py-4 shadow-md">
      <h1 className="text-2xl font-bold text-yellow-400 tracking-wide">
        ThinkQuick<span className="text-blue-400">+</span>
      </h1>
      <div className="flex gap-6">
        <a href="/" className="hover:text-yellow-300 transition">Home</a>
        <a href="#games" className="hover:text-yellow-300 transition">Games</a>
        <a href="#about" className="hover:text-yellow-300 transition">About</a>
      </div>
    </nav>
  );
};

export default Navbar;

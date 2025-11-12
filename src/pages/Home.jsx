import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-gray-950 min-h-screen text-white flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-5xl font-extrabold text-yellow-400 mb-4">
        Welcome to ThinkQuick+
      </h1>
      <p className="text-lg text-gray-300 max-w-xl mb-8">
        Train your brain with fun, fast, and interactive mini games. Improve your
        focus, memory, and reflexes in minutes a day!!!
      </p>
      <Link
        to="/dashboard"
        className="bg-yellow-400 text-gray-900 font-semibold px-6 py-3 rounded-xl hover:bg-yellow-300 transition"
      >
        🎮 Enter Game Hub
      </Link>
    </div>
  );
};

export default Home;

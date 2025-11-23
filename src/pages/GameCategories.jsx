import React from "react";
import { useNavigate } from "react-router-dom";

const GameCategories = () => {
  const navigate = useNavigate();

  const categories = [
    {
      title: "🧠 Brain Games",
      desc: "Improve memory, focus, reaction time and mental agility.",
      route: "/dashboard",
      color: "from-blue-500 to-purple-600",
    },
    {
      title: "🎵 Audio Games (Coming Soon)",
      desc: "Sound-based challenges to test hearing and rhythm.",
      route: null,
      color: "from-green-500 to-teal-600",
    },
    {
      title: "👁 Visual Games (Coming Soon)",
      desc: "Optic-based challenges that boost perception.",
      route: null,
      color: "from-pink-500 to-red-600",
    },
    {
      title: "🕹 Reflex Games (Coming Soon)",
      desc: "Speed-based games to sharpen instant responses.",
      route: null,
      color: "from-yellow-500 to-orange-600",
    },
    {
      title: "🏋 Fitness Games (Coming Soon)",
      desc: "Physical challenges to boost strength and endurance.",
      route: null,
      color: "from-red-500 to-red-600",
    },
    {
      title: "🎵 Music Rhythm Games (Coming Soon)",
      desc: "Rhythm-based challenges to enhance timing and coordination.",
      route: null,
      color: "from-pink-500 to-pink-600",
    },
  ];

  return (
    <div className="bg-gray-950 min-h-screen text-white px-8 py-10">
      <h1 className="text-4xl font-bold text-center text-yellow-400 mb-10">
        🎮 Game Categories
      </h1>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {categories.map((cat, index) => (
          <div
            key={index}
            className={`p-6 rounded-2xl bg-gradient-to-br ${cat.color} shadow-lg hover:scale-105 transition cursor-pointer`}
            onClick={() =>
              cat.route
                ? navigate(cat.route)
                : alert("Coming soon 🚧")
            }
          >
            <h2 className="text-2xl font-bold mb-2">{cat.title}</h2>
            <p className="text-gray-100 text-sm">{cat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameCategories;

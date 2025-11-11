import React from "react";
import { useNavigate } from "react-router-dom";

const games = [
  {
    id: 1,
    title: "⚡ Reaction Test",
    desc: "Measure how fast you can react when the screen changes color.",
    color: "from-green-400 to-green-600",
    route: "/reaction",
  },
  {
    id: 2,
    title: "🧩 Memory Flip",
    desc: "Test your memory by matching cards — coming soon!",
    color: "from-blue-400 to-blue-600",
    route: "/memory",
  },
  {
    id: 3,
    title: "🎯 Focus Tracker",
    desc: "Stay sharp — find patterns under pressure! (upcoming)",
    color: "from-yellow-400 to-yellow-600",
    route: "/focus",
  },
];

const GameDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-950 min-h-screen text-white px-8 py-10 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-yellow-400 mb-8">
        🧠 ThinkQuick+ Game Hub
      </h1>
      <p className="text-gray-300 mb-10 text-center max-w-2xl">
        Challenge yourself with a collection of quick-thinking mini games designed
        to boost your brain performance, focus, and speed. More coming soon!
      </p>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 w-full max-w-6xl">
        {games.map((game) => (
          <div
            key={game.id}
            className={`rounded-2xl p-6 bg-gradient-to-br ${game.color} shadow-lg cursor-pointer transform hover:scale-105 transition`}
            onClick={() => {
              if (game.route === "/reaction") navigate(game.route);
              else alert("This game is coming soon 🚧");
            }}
          >
            <h2 className="text-2xl font-bold mb-3">{game.title}</h2>
            <p className="text-sm text-gray-100">{game.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameDashboard;

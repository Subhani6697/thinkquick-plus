import React, { useEffect, useState } from "react";

const gameKeys = [
  { key: "bestReaction", label: "⚡ Reaction Test" },
  { key: "bestMemory", label: "🧩 Memory Flip" },
  { key: "bestFocus", label: "🎯 Focus Tracker" },
  { key: "bestShadow", label: "🕶️ Shadow Match" },
  { key: "bestWaveSync", label: "🌊 Wave Sync" },
  { key: "bestTimeSlip", label: "⏳ TimeSlip" },
  { key: "bestEchoMemory", label: "🔊 Echo Memory" },
  { key: "bestQuantumShift", label: "⚛ Quantum Shift" },
  { key: "bestThoughtChain", label: "🧠 Thought Chain" }
];

const Leaderboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const data = gameKeys.map((g) => ({
      label: g.label,
      score: JSON.parse(localStorage.getItem(g.key)) || 0
    }));

    setScores(data.sort((a, b) => b.score - a.score));
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-white px-8 py-10">
      <h1 className="text-4xl font-bold text-yellow-400 text-center mb-8">
        🏆 Leaderboard
      </h1>

      <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl p-6 shadow-lg">
        {scores.map((item, i) => (
          <div
            key={i}
            className="flex justify-between text-lg py-3 border-b border-gray-700"
          >
            <span>{i + 1}. {item.label}</span>
            <span className="text-yellow-300 font-bold">{item.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;

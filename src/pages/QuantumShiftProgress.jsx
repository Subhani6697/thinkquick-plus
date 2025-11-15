import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const QuantumShiftProgress = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [best, setBest] = useState(null);

  useEffect(() => {
    const savedHistory =
      JSON.parse(localStorage.getItem("quantumShiftHistory")) || [];
    const savedBest = JSON.parse(localStorage.getItem("bestQuantumShift"));

    setHistory(savedHistory);
    setBest(savedBest);
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-white px-6 py-10">
      <h2 className="text-4xl font-bold text-purple-400 text-center mb-6">
        ⚛ Quantum Shift Progress
      </h2>

      {/* Best Score */}
      {best !== null && (
        <p className="text-center text-lg text-purple-300 mb-4">
          Best Score: <span className="font-bold">{best}</span>
        </p>
      )}

      {/* Graph */}
      {history.length > 0 ? (
        <div className="w-full h-72 mb-8">
          <ResponsiveContainer>
            <LineChart data={history}>
              <CartesianGrid stroke="#555" />
              <XAxis dataKey="round" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#222",
                  borderRadius: "8px",
                  border: "1px solid #555",
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#C084FC"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-center text-gray-400 mb-4">
          No progress recorded yet.
        </p>
      )}

      {/* History List */}
      <div className="max-w-xl mx-auto bg-gray-800 p-5 rounded-xl mb-6">
        <h3 className="text-xl font-bold text-purple-300 mb-3">
          📜 Game History
        </h3>

        {history.length === 0 ? (
          <p className="text-gray-400 text-sm">No history available.</p>
        ) : (
          <ul className="space-y-2">
            {history.map((entry, idx) => (
              <li
                key={idx}
                className="bg-gray-700 p-3 rounded-lg text-sm flex justify-between"
              >
                <span>Round {entry.round}</span>
                <span className="font-bold text-purple-300">
                  Score: {entry.score}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Back */}
      <div className="text-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 bg-purple-500 text-black font-semibold rounded-lg hover:bg-purple-400 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default QuantumShiftProgress;

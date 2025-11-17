import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const MirrorMindProgress = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [best, setBest] = useState(null);

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem("mirrorMindHistory")) || [];
    const b = JSON.parse(localStorage.getItem("bestMirrorMind")) || 0;

    setHistory(h);
    setBest(b);
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-white px-6 py-10">
      <h2 className="text-4xl font-bold text-pink-400 text-center mb-6">
        🪞 Mirror Mind Progress
      </h2>

      {/* Best Score */}
      {best !== null && (
        <p className="text-center text-lg text-pink-300 mb-4">
          Best Score: <span className="font-bold">{best}</span>
        </p>
      )}

      {/* Chart */}
      {history.length > 0 ? (
        <div className="w-full h-72">
          <ResponsiveContainer>
            <LineChart data={history}>
              <CartesianGrid stroke="#555" />
              <XAxis dataKey="round" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#222",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#FF77E9"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-center text-gray-400">No progress yet.</p>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="mt-8 max-w-xl mx-auto">
          <h3 className="text-xl font-semibold text-pink-300 mb-3">
            Recent Attempts
          </h3>
          <div className="space-y-3">
            {history.map((h, index) => (
              <div
                key={index}
                className="p-4 bg-gray-800 rounded-lg border border-gray-700"
              >
                <p>Round: {h.round}</p>
                <p>Score: {h.score}</p>
                <p className="text-sm text-gray-400">{h.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="text-center mt-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 bg-blue-500 text-black font-semibold rounded-lg hover:bg-blue-400"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default MirrorMindProgress;

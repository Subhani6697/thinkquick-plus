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

const ThoughtChainProgress = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [best, setBest] = useState(null);

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem("thoughtChainHistory")) || [];
    const b = JSON.parse(localStorage.getItem("bestThoughtChain")) || null;

    setHistory(h);
    setBest(b);
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-white px-6 py-10">
      <h2 className="text-4xl font-bold text-pink-400 text-center mb-6">
        🔗 Thought Chain Progress
      </h2>

      {/* Best Score */}
      {best !== null && (
        <p className="text-center text-lg text-pink-300 mb-4">
          ⭐ Best Chain Length: <span className="font-bold">{best}</span>
        </p>
      )}

      {/* Chart */}
      {history.length > 0 ? (
        <div className="w-full h-72 mb-10">
          <ResponsiveContainer>
            <LineChart data={history}>
              <CartesianGrid stroke="#444" />
              <XAxis dataKey="round" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e1e1e",
                  borderRadius: "8px",
                  border: "1px solid #555",
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#ff4fa3"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-center text-gray-400 mb-10">No progress yet.</p>
      )}

      {/* Back button */}
      <div className="text-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 bg-blue-500 text-black rounded-lg hover:bg-blue-400 transition font-semibold"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ThoughtChainProgress;

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

const WaveProgress = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [best, setBest] = useState(null);

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem("waveSyncHistory")) || [];
    data = data.sort((a, b) => a.attempt - b.attempt); // ensure order

    setHistory(data);
    setBest(JSON.parse(localStorage.getItem("bestWaveSync")));
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-white px-6 py-10">
      <h2 className="text-4xl font-bold text-yellow-400 text-center mb-6">
        🌊 Wave Sync Progress
      </h2>

      {best !== null && (
        <p className="text-center text-lg text-yellow-300 mb-4">
          Best Score: <span className="font-bold">{best}</span>
        </p>
      )}

      {history.length > 0 ? (
        <div className="w-full h-80">
          <ResponsiveContainer>
            <LineChart data={history}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis
                dataKey="attempt"
                stroke="#ccc"
                label={{ value: "Attempt", position: "insideBottom", dy: 10 }}
              />
              <YAxis
                stroke="#ccc"
                domain={[0, 100]}
                label={{ value: "Score", angle: -90, dx: -20 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111",
                  border: "1px solid #666",
                  borderRadius: "8px",
                }}
                formatter={(value, name) => {
                  if (name === "score") return [`${value}`, "Score"];
                  return value;
                }}
                labelFormatter={(label) => `Attempt: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#FFD700"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-center text-gray-400">No data yet.</p>
      )}

      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 bg-blue-500 text-black rounded-lg hover:bg-blue-400"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default WaveProgress;

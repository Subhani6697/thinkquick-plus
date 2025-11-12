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

const ProgressTracker = ({ type }) => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [best, setBest] = useState(null);

  useEffect(() => {
    if (type === "reaction") {
      setHistory(JSON.parse(localStorage.getItem("reactionHistory")) || []);
      setBest(JSON.parse(localStorage.getItem("bestTime")));
    } else if (type === "memory") {
      setHistory(JSON.parse(localStorage.getItem("memoryHistory")) || []);
      setBest(JSON.parse(localStorage.getItem("bestMoves")));
    }
      else if (type === "focus") {
      setHistory(JSON.parse(localStorage.getItem("focusHistory")) || []);
      setBest(JSON.parse(localStorage.getItem("focusBest")));
    }


  }, [type]);

  return (
    <div className="bg-gray-800 text-white rounded-2xl p-6 shadow-lg w-full max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">
    📈 {type === "reaction"
    ? "Reaction Time"
    : type === "memory"
    ? "Memory Game"
    : "Focus Game"} Progress

      </h2>

      {best ? (
        <>
          <p className="text-center text-gray-300 mb-2">
            <span className="font-semibold text-yellow-300">
            Best{" "}
            {type === "reaction"
            ? "Time"
            : type === "memory"
            ? "Moves"
            : "Score"}:

            </span>{" "}
            {best} {type === "reaction" ? "ms" : type === "memory" ? "moves" : "points"}
          </p>

          {history.length > 0 ? (
            <div className="w-full h-64">
              <ResponsiveContainer>
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="attempt" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#222",
                      borderRadius: "8px",
                      border: "1px solid #555",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={
                        type === "reaction"
                        ? "time"
                        : type === "memory"
                        ? "moves"
                        : "score"
                    }
                    stroke={type === "focus" ? "#4ade80" : "#facc15"}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    />

                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-400 text-center">
              Play a few games to see your progress here 📊
            </p>
          )}
        </>
      ) : (
        <p className="text-gray-400 text-center">
          No data yet. Play to start tracking!
        </p>
      )}

      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-400 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ProgressTracker;

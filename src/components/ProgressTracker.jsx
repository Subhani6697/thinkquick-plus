// src/components/ProgressTracker.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadProgress, resetProgress } from "../services/gameDataService";
import { useAuth } from "../context/AuthContext";

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
  const { user } = useAuth();

  const [history, setHistory] = useState([]);
  const [best, setBest] = useState(null);
  const [loading, setLoading] = useState(true);

  // Correct field names per game
  const field =
    type === "reaction"
      ? "time"
      : type === "memory"
      ? "moves"
      : "score";

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadProgress(user.uid, type);

      // FIX: Convert old entries with {value: xx} → proper field name
      const fixedHistory = (data.history || []).map((entry) => {
        if (entry[field] !== undefined) return entry;

        // Old data present → convert
        return {
          attempt: entry.attempt,
          [field]: entry.value, // convert old field
        };
      });

      // Also fix best entry
      const fixedBest = data.best
        ? data.best[field] !== undefined
          ? data.best
          : {
              attempt: data.best.attempt,
              [field]: data.best.value, // convert old field
            }
        : null;

      setHistory(fixedHistory);
      setBest(fixedBest);
      setLoading(false);
    };

    fetchData();
  }, [type, user, field]);

  const handleReset = async () => {
    await resetProgress(user.uid, type);
    setHistory([]);
    setBest(null);
  };

  if (loading)
    return <p className="text-center text-white mt-10">Loading...</p>;

  return (
    <div className="bg-gray-800 text-white rounded-2xl p-6 shadow-lg w-full max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">
        📈 {type.toUpperCase()} Progress
      </h2>

      {best ? (
        <>
          <p className="text-center text-gray-300 mb-2">
            <span className="font-semibold text-yellow-400">
              Best {field}:
            </span>{" "}
            {best[field]}
          </p>

          {history.length > 0 ? (
            <div className="w-full h-64">
              <ResponsiveContainer>
                <LineChart data={history}>
                  <CartesianGrid stroke="#555" />
                  <XAxis dataKey="attempt" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey={field}
                    stroke="#facc15"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-gray-400 text-center">
              No history yet. Play a game!
            </p>
          )}
        </>
      ) : (
        <p className="text-gray-400 text-center">No data yet. Play a game!</p>
      )}

      <div className="text-center mt-6 flex gap-4 justify-center">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 text-black rounded-lg hover:bg-red-400 transition"
        >
          Reset Progress
        </button>

        <button
          onClick={() => navigate(`/dashboard`)}
          className="px-4 py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-400 transition"
        >
          Dashboard
        </button>

        <button
          onClick={() =>
            navigate(
              type === "reaction"
                ? "/reaction"
                : type === "memory"
                ? "/memory"
                : "/focus"
            )
          }
          className="px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-400 transition"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default ProgressTracker;

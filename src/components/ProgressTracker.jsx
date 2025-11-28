// src/components/ProgressTracker.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loadProgress, resetProgress } from "../services/gameDataService";

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

  const field =
    type === "reaction" ? "time" : type === "memory" ? "moves" : "score";

  useEffect(() => {
    const fetch = async () => {
      const data = await loadProgress(user.uid, type);
      setHistory(data.history || []);
      setBest(data.best || null);
      setLoading(false);
    };
    fetch();
  }, [type]);

  const handleReset = async () => {
    await resetProgress(user.uid, type);
    setHistory([]);
    setBest(null);
  };

  if (loading)
    return <p className="text-white text-center mt-10">Loading...</p>;

  return (
    <div className="bg-gray-800 text-white rounded-2xl p-6 shadow-lg max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-yellow-400 text-center mb-4">
        📈 {type.toUpperCase()} Progress
      </h2>

      {best !== null ? (
        <>
          <p className="text-center text-gray-300 mb-3">
            <span className="text-yellow-400">Best {field}:</span> {best}
          </p>

          {history.length > 0 ? (
            <div className="w-full h-64">
              <ResponsiveContainer>
                <LineChart data={history}>
                  <CartesianGrid stroke="#444" />
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
              No history yet. Play the game!
            </p>
          )}
        </>
      ) : (
        <p className="text-gray-400 text-center">No data yet.</p>
      )}

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 text-black rounded-lg"
        >
          Reset
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-blue-500 text-black rounded-lg"
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
          className="px-4 py-2 bg-yellow-500 text-black rounded-lg"
        >
          Play
        </button>
      </div>
    </div>
  );
};

export default ProgressTracker;

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const ProgressTracker = () => {
  const [reactionHistory, setReactionHistory] = useState([]);
  const [bestTime, setBestTime] = useState(null);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("reactionHistory")) || [];
    const best = JSON.parse(localStorage.getItem("bestTime"));
    setReactionHistory(history);
    setBestTime(best);
  }, []);

  return (
    <div className="bg-gray-800 text-white rounded-2xl p-6 shadow-lg w-full max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4 text-center">
        📈 Your Brain Performance
      </h2>

      {bestTime ? (
        <>
          <p className="text-center text-gray-300 mb-2">
            <span className="font-semibold text-yellow-300">Best Reaction Time:</span> {bestTime} ms
          </p>

          {reactionHistory.length > 0 ? (
            <div className="w-full h-64">
              <ResponsiveContainer>
                <LineChart data={reactionHistory}>
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
                    dataKey="time"
                    stroke="#facc15"
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
          No data yet. Play the Reaction Game to start tracking!
        </p>
      )}
    </div>
  );
};

export default ProgressTracker;

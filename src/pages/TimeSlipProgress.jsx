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

const TimeSlipProgress = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [best, setBest] = useState(null);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("timeSlipHistory")) || [];
    const storedBest = JSON.parse(localStorage.getItem("bestTimeSlip"));

    setHistory(storedHistory);
    setBest(storedBest);
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen text-white px-6 py-10">
      <h2 className="text-4xl font-bold text-blue-400 text-center mb-6">
        ⏳ TimeSlip Progress
      </h2>

      {best !== null && (
        <p className="text-center text-lg text-blue-300 mb-4">
          Best Score: {best}
        </p>
      )}

      {history.length > 0 ? (
        <div className="w-full h-72">
          <ResponsiveContainer>
            <LineChart data={history}>
              <CartesianGrid stroke="#444" />
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
                stroke="#4FC3F7"
                strokeWidth={3}
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

export default TimeSlipProgress;

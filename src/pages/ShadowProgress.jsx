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

const ShadowProgress = () => {
  const [history, setHistory] = useState([]);
  const [best, setBest] = useState(null);
  const [fastest, setFastest] = useState(null);

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem("shadowHistory")) || [];
    setHistory(h);
    setBest(JSON.parse(localStorage.getItem("shadowBestAccuracy")) || null);
    setFastest(JSON.parse(localStorage.getItem("shadowFastestTime")) || null);
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-950 text-white flex flex-col items-center">
      <h1 className="text-3xl font-extrabold text-yellow-400 mb-4">🕶️ Shadow Match — Progress</h1>

      <div className="w-full max-w-4xl bg-gray-800 p-6 rounded-2xl shadow">
        <p className="text-gray-300 mb-3">Best Accuracy: <span className="text-yellow-300 font-semibold">{best ?? "—"}</span>%</p>
        <p className="text-gray-300 mb-6">Fastest Time: <span className="text-yellow-300 font-semibold">{fastest ?? "—"}</span>s</p>

        {history.length === 0 ? (
          <p className="text-gray-400">No shadow match data yet — play a round to record progress.</p>
        ) : (
          <>
            <div className="mb-8">
              <h3 className="text-white font-semibold mb-2">Accuracy over attempts</h3>
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer>
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="attempt" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip />
                    <Line type="monotone" dataKey="accuracy" stroke="#facc15" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Time taken (s)</h3>
              <div style={{ width: "100%", height: 220 }}>
                <ResponsiveContainer>
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="attempt" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip />
                    <Line type="monotone" dataKey="time" stroke="#60a5fa" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-6">
        <button onClick={() => (window.location.href = "/dashboard")} className="px-4 py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-400">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ShadowProgress;

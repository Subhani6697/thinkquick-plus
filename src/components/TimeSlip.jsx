import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const TimeSlip = () => {
  const navigate = useNavigate();

  const [targetTime] = useState(() => {
    const min = 2.0;
    const max = 6.0;
    return (Math.random() * (max - min) + min).toFixed(2);
  });

  const [status, setStatus] = useState("ready");
  const [startTime, setStartTime] = useState(null);
  const [result, setResult] = useState(null);

  const timerRef = useRef(null);

  const startGame = () => {
    setResult(null);
    setStatus("running");
    setStartTime(Date.now());
  };

  const stopGame = () => {
    if (status !== "running") return;

    setStatus("stopped");
    const actualTime = (Date.now() - startTime) / 1000;
    const diff = Math.abs(actualTime - parseFloat(targetTime)).toFixed(3);

    setResult({
      actualTime: actualTime.toFixed(3),
      diff,
    });

    saveProgress(parseFloat(diff));
  };

  const saveProgress = (score) => {
    const history =
      JSON.parse(localStorage.getItem("timeSlipHistory")) || [];

    const newEntry = {
      round: history.length + 1,
      score,
      date: new Date().toLocaleString(),
    };

    const updated = [...history, newEntry];
    localStorage.setItem("timeSlipHistory", JSON.stringify(updated));

    const best =
      JSON.parse(localStorage.getItem("bestTimeSlip")) || null;

    if (best === null || score < best) {
      localStorage.setItem("bestTimeSlip", JSON.stringify(score));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-6 py-10">
      <h1 className="text-4xl font-bold text-blue-400 mb-6">
        ⏳ Time Slip
      </h1>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full text-center">
        <p className="text-xl mb-3">
          Your target is:
          <span className="text-yellow-300 font-bold ml-2">
            {targetTime} sec
          </span>
        </p>

        <p className="text-gray-400 mb-6">
          Wait… then stop as close as possible!
        </p>

        {status === "ready" && (
          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-500 text-black font-bold rounded-lg hover:bg-blue-400 w-full"
          >
            Start
          </button>
        )}

        {status === "running" && (
          <button
            onClick={stopGame}
            className="px-6 py-3 bg-red-500 text-black font-bold rounded-lg hover:bg-red-400 w-full animate-pulse"
          >
            Stop!
          </button>
        )}

        {result && (
          <div className="mt-6 bg-gray-700 p-4 rounded-lg">
            <p className="mb-2">
              Actual Time:
              <span className="text-green-400 font-bold ml-2">
                {result.actualTime}s
              </span>
            </p>
            <p>
              Difference:
              <span className="text-yellow-400 font-bold ml-2">
                {result.diff}s
              </span>
            </p>
          </div>
        )}

        {result && (
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-purple-500 text-black rounded-lg hover:bg-purple-400 w-full"
          >
            Try Again
          </button>
        )}

        <button
          onClick={() => navigate("/progress-timeslip")}
          className="mt-3 px-6 py-2 bg-teal-500 text-black rounded-lg w-full hover:bg-teal-400"
        >
          View Progress
        </button>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-3 px-6 py-2 bg-teal-500 text-black rounded-lg w-full hover:bg-teal-400"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default TimeSlip;

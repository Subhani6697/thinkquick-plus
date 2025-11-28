import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { saveGameResult } from "../services/gameDataService";
import { useNavigate } from "react-router-dom";

const ReactionGame = () => {
  const [waiting, setWaiting] = useState(false);
  const [ready, setReady] = useState(false);
  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [message, setMessage] = useState("Click to Start");
  const [timeoutId, setTimeoutId] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const startGame = () => {
    setWaiting(true);
    setMessage("Wait for green...");

    const delay = Math.floor(Math.random() * 3000) + 2000; // 2–5 seconds

    const id = setTimeout(() => {
      setReady(true);
      setWaiting(false);
      setStartTime(Date.now());
      setMessage("Click NOW!");
    }, delay);

    setTimeoutId(id);
  };

  const handleClick = async () => {
    if (!waiting && !ready) {
      setReactionTime(null);
      startGame();
    } else if (waiting && !ready) {
      clearTimeout(timeoutId);
      setWaiting(false);
      setMessage("Too soon! Click to try again.");
    } else if (ready) {
      const time = Date.now() - startTime;
      setReactionTime(time);
      setReady(false);
      setMessage(`Your reaction: ${time} ms. Click to try again.`);

      // 🔥 Save to Firestore
      if (user) {
        await saveGameResult(user.uid, "reaction", time);
      }
    }
  };

  // Cleanup timer when component unmounts
  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, [timeoutId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white px-6">
      <div
        onClick={handleClick}
        className={`flex flex-col items-center justify-center h-[60vh] w-full max-w-3xl rounded-2xl transition-all duration-300 cursor-pointer ${
          waiting ? "bg-red-500" : ready ? "bg-green-500" : "bg-blue-600"
        }`}
      >
        <h1 className="text-4xl font-extrabold mb-6">⚡ Reaction Game</h1>
        <p className="text-2xl">{message}</p>

        {reactionTime && (
          <p className="mt-2 text-lg text-gray-200">
            Last Reaction: <span className="font-semibold">{reactionTime} ms</span>
          </p>
        )}
      </div>

      <div className="flex flex-col items-center mt-8 w-full gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 bg-blue-500 text-black rounded-lg font-semibold hover:bg-blue-400 transition"
        >
          Back to Dashboard
        </button>

        <button
          onClick={() => navigate("/progress-reaction")}
          className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition w-40"
        >
          View Progress
        </button>
      </div>
    </div>
  );
};

export default ReactionGame;

import React, { useState, useEffect } from "react";

const ReactionGame = () => {
  const [waiting, setWaiting] = useState(false);
  const [ready, setReady] = useState(false);
  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [message, setMessage] = useState("Click to Start");
  const [timeoutId, setTimeoutId] = useState(null);

  const startGame = () => {
    setWaiting(true);
    setMessage("Wait for green...");
    const delay = Math.floor(Math.random() * 3000) + 2000; // 2–5 seconds
    const id = setTimeout(() => {
      setReady(true);
      setWaiting(false);
      setStartTime(Date.now());
      setMessage("Click now!");
    }, delay);
    setTimeoutId(id);
  };

  const handleClick = () => {
    if (!waiting && !ready) {
      // Start game
      setReactionTime(null);
      startGame();
    } else if (waiting && !ready) {
      // Clicked too early
      clearTimeout(timeoutId);
      setWaiting(false);
      setMessage("Too soon! Click to try again.");
    } else if (ready) {
      // Correct click
      const time = Date.now() - startTime;
      setReactionTime(time);
      setReady(false);
      setMessage(`Your reaction: ${time} ms. Click to try again.`);
    }
  };

  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, [timeoutId]);

  return (
    <div
      onClick={handleClick}
      className={`flex flex-col items-center justify-center h-[80vh] w-full rounded-2xl transition-all duration-300 cursor-pointer ${
        waiting ? "bg-red-400" : ready ? "bg-green-400" : "bg-blue-400"
      }`}
    >
      <h1 className="text-3xl font-bold text-white mb-4">⚡ Reaction Game</h1>
      <p className="text-xl text-white">{message}</p>
      {reactionTime && (
        <p className="mt-2 text-lg text-white">
          Best Time: <span className="font-semibold">{reactionTime} ms</span>
        </p>
      )}
    </div>
  );
};

export default ReactionGame;

import React, { useState, useEffect } from "react";
import ProgressTracker from "./ProgressTracker";

const FocusTracker = () => {
  const [gridSize, setGridSize] = useState(3);
  const [pattern, setPattern] = useState([]);
  const [userSelection, setUserSelection] = useState([]);
  const [showPattern, setShowPattern] = useState(false);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Show pattern briefly
  useEffect(() => {
    if (pattern.length > 0 && showPattern) {
      const timer = setTimeout(() => setShowPattern(false), 1000 + gridSize * 200);
      return () => clearTimeout(timer);
    }
  }, [pattern, showPattern, gridSize]);

  // Start new round
  const startGame = () => {
    const newPattern = generatePattern(gridSize);
    setPattern(newPattern);
    setUserSelection([]);
    setShowPattern(true);
    setGameOver(false);
  };

  const generatePattern = (size) => {
    const count = Math.min(size, 5); // number of highlighted squares
    const total = size * size;
    const indices = new Set();
    while (indices.size < count) {
      indices.add(Math.floor(Math.random() * total));
    }
    return [...indices];
  };

  const handleTileClick = (index) => {
    if (showPattern || gameOver) return;

    setUserSelection((prev) => {
      const updated = prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index];
      return updated;
    });
  };

  const checkPattern = () => {
    const correct = pattern.every((i) => userSelection.includes(i));
    const missed = userSelection.filter((i) => !pattern.includes(i)).length;
    const accuracy = Math.max(0, ((pattern.length - missed) / pattern.length) * 100);

    if (accuracy === 100) {
      setScore((prev) => prev + 1);
      setLevel((prev) => prev + 1);
      setGridSize((prev) => (prev < 6 ? prev + 1 : prev));
      saveProgress(score + 1);
      startGame();
    } else {
      setGameOver(true);
      saveProgress(score);
    }
  };

  const saveProgress = (points) => {
    const history = JSON.parse(localStorage.getItem("focusHistory")) || [];
    const newAttempt = { attempt: history.length + 1, score: points };
    const updated = [...history, newAttempt];
    localStorage.setItem("focusHistory", JSON.stringify(updated));

    const best = JSON.parse(localStorage.getItem("focusBest"));
    if (!best || points > best) {
      localStorage.setItem("focusBest", JSON.stringify(points));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white px-6">
      <h1 className="text-4xl font-extrabold text-yellow-400 mb-4">
        🎯 Focus Tracker
      </h1>
      <p className="text-gray-300 mb-6 text-center max-w-lg">
        Watch carefully! Tiles will flash — then click them to repeat the pattern.
      </p>

      <div
        className={`grid gap-2 mb-6`}
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 60px)`,
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, index) => {
          const isShown = showPattern && pattern.includes(index);
          const isSelected = userSelection.includes(index);
          return (
            <div
              key={index}
              onClick={() => handleTileClick(index)}
              className={`w-[60px] h-[60px] rounded-lg cursor-pointer transition-all duration-200 ${
                isShown
                  ? "bg-yellow-400"
                  : isSelected
                  ? "bg-blue-500"
                  : "bg-gray-700"
              }`}
            ></div>
          );
        })}
      </div>

      {gameOver ? (
        <div className="text-center">
          <p className="text-red-400 font-semibold mb-3">
            ❌ Game Over! Final Score: {score}
          </p>
          <button
            onClick={() => {
              setGridSize(3);
              setLevel(1);
              setScore(0);
              startGame();
            }}
            className="px-5 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition"
          >
            Restart
          </button>
        </div>
      ) : (
        <button
          onClick={checkPattern}
          className="px-5 py-2 bg-green-500 text-black rounded-lg font-semibold hover:bg-green-400 transition"
        >
          Check Pattern
        </button>
      )}

      <p className="mt-4 text-gray-300">Level: {level} | Score: {score}</p>

      <div className="flex flex-col items-center mt-8 gap-4">
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="px-6 py-3 bg-blue-500 text-black rounded-lg font-semibold hover:bg-blue-400 transition w-40"
        >
          Back to Dashboard
        </button>
        <button
          onClick={() => (window.location.href = "/progress-focus")}
          className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition w-40"
        >
          View Progress
        </button>
      </div>
    </div>
  );
};

export default FocusTracker;

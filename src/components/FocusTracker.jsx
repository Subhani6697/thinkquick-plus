import React, { useState, useEffect } from "react";
import { saveGameResult } from "../services/gameDataService";
import { useAuth } from "../context/AuthContext";

const FocusGame = () => {
  const { user } = useAuth();

  const [gridSize, setGridSize] = useState(3);
  const [pattern, setPattern] = useState([]);
  const [userSelection, setUserSelection] = useState([]);
  const [showPattern, setShowPattern] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const generatePattern = (size) => {
    const count = Math.min(size, 5);
    const total = size * size;
    const set = new Set();

    while (set.size < count) set.add(Math.floor(Math.random() * total));

    return [...set];
  };

  const startRound = () => {
    const newPattern = generatePattern(gridSize);
    setPattern(newPattern);
    setUserSelection([]);
    setShowPattern(true);
    setGameOver(false);

    setTimeout(() => setShowPattern(false), 800 + gridSize * 200);
  };

  useEffect(() => {
    startRound();
  }, []);

  const handleSelect = (index) => {
    if (showPattern || gameOver) return;

    setUserSelection((prev) =>
      prev.includes(index)
        ? prev.filter((x) => x !== index)
        : [...prev, index]
    );
  };

  const checkPattern = () => {
    const correct = pattern.every((p) => userSelection.includes(p));
    const extraMistakes = userSelection.filter((x) => !pattern.includes(x)).length;

    if (correct && extraMistakes === 0) {
      // Level complete
      setScore(score + 1);
      setGridSize((g) => (g < 6 ? g + 1 : g));
      startRound();
    } else {
      // Game Over
      setGameOver(true);

      // 🔥 Save score to Firestore
      saveGameResult(user.uid, "focus", {
        score,
        attempt: Date.now(),
      });
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-950 text-white px-6">
      <h1 className="text-4xl font-bold text-yellow-400 mt-6">🎯 Focus Game</h1>
      <p className="text-gray-300 mb-4 mt-2">
        Memorize the pattern, then try to repeat it!
      </p>

      <div
        className="grid gap-2 mb-6"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 60px)`,
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, i) => {
          const isShown = showPattern && pattern.includes(i);
          const isSelected = userSelection.includes(i);

          return (
            <div
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-[60px] h-[60px] rounded-lg transition cursor-pointer ${
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
          <p className="text-red-400 mb-3 font-semibold">
            ❌ Game Over — Score: {score}
          </p>
          <button
            onClick={() => {
              setScore(0);
              setGridSize(3);
              startRound();
            }}
            className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400"
          >
            Restart
          </button>
        </div>
      ) : (
        <button
          onClick={checkPattern}
          className="px-5 py-2 bg-green-500 text-black rounded-lg hover:bg-green-400"
        >
          Check
        </button>
      )}

      <p className="mt-4 text-gray-300">
        Level: {gridSize - 2} | Score: {score}
      </p>

      <button
        onClick={() => (window.location.href = "/progress-focus")}
        className="mt-6 px-4 py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-400"
      >
        View Progress
      </button>
    </div>
  );
};

export default FocusGame;

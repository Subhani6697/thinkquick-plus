import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { saveMemoryResult } from "../services/gameDataService";

const symbols = ["🍎", "🍌", "🍇", "🍒", "🥝", "🍉", "🍍", "🍓"];

const MemoryGame = () => {
  const { user } = useAuth();

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);

  const initializeGame = () => {
    const shuffled = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({ id: index, symbol }));

    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleFlip = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index))
      return;

    setFlipped((prev) => [...prev, index]);
  };

  useEffect(() => {
    if (flipped.length === 2) {
      const [a, b] = flipped;
      setMoves((prev) => prev + 1);

      if (cards[a].symbol === cards[b].symbol) {
        setMatched((prev) => [...prev, a, b]);
      }

      setTimeout(() => setFlipped([]), 700);
    }
  }, [flipped]);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      // Update local storage
      const history = JSON.parse(localStorage.getItem("memoryHistory")) || [];
      const updated = [...history, { attempt: history.length + 1, moves }];
      localStorage.setItem("memoryHistory", JSON.stringify(updated));

      const best = JSON.parse(localStorage.getItem("bestMoves"));
      if (!best || moves < best) {
        localStorage.setItem("bestMoves", JSON.stringify(moves));
      }

      // Firestore save
      if (user?.uid) {
        saveMemoryResult(user.uid, moves).catch((err) =>
          console.error("Memory save error:", err)
        );
      }
    }
  }, [matched]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
      <h1 className="text-3xl font-bold mb-4">🧩 Memory Flip Game</h1>
      <p className="mb-4">Moves: {moves}</p>

      <div className="grid grid-cols-4 gap-3">
        {cards.map((card, index) => (
          <div
            key={card.id}
            onClick={() => handleFlip(index)}
            className={`w-16 h-16 flex items-center justify-center text-2xl rounded-lg cursor-pointer transition ${
              flipped.includes(index) || matched.includes(index)
                ? "bg-green-500"
                : "bg-gray-700"
            }`}
          >
            {(flipped.includes(index) || matched.includes(index)) && card.symbol}
          </div>
        ))}
      </div>

      <button
        onClick={initializeGame}
        className="mt-6 px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition"
      >
        Restart Game
      </button>

      <div className="flex flex-col items-center mt-8 gap-4">
        <button
          onClick={() => (window.location.href = "/dashboard")}
          className="px-6 py-3 bg-blue-500 text-black rounded-lg font-semibold hover:bg-blue-400 transition"
        >
          Back to Dashboard
        </button>

        <button
          onClick={() => (window.location.href = "/progress-memory")}
          className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition w-40"
        >
          View Progress
        </button>
      </div>
    </div>
  );
};

export default MemoryGame;

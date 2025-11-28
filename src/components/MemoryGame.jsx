import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { saveGameResult } from "../services/gameDataService";

const symbols = ["🍎", "🍌", "🍇", "🍒", "🥝", "🍉", "🍍", "🍓"];

const MemoryGame = () => {
  const { user } = useAuth();

  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const initializeGame = () => {
    const shuffled = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({ id: index, symbol }));

    setCards(shuffled);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameOver(false);
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

  // When game completes
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameOver(true);

      // 🔥 Save to Firestore
      saveGameResult(user.uid, "memory", {
        moves,
        attempt: Date.now(),
      });
    }
  }, [matched]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-950 text-white">
      <h1 className="text-3xl font-bold mt-6">🧩 Memory Flip Game</h1>

      <p className="mt-3 text-yellow-300 text-lg">Moves: {moves}</p>

      <div className="grid grid-cols-4 gap-3 mt-6">
        {cards.map((card, index) => {
          const show = flipped.includes(index) || matched.includes(index);
          return (
            <div
              key={card.id}
              onClick={() => handleFlip(index)}
              className={`w-16 h-16 flex items-center justify-center text-2xl rounded-lg cursor-pointer transition-all ${
                show ? "bg-green-500" : "bg-gray-700"
              }`}
            >
              {show ? card.symbol : ""}
            </div>
          );
        })}
      </div>

      {gameOver && (
        <p className="text-green-400 mt-4 font-semibold">
          🎉 Completed in {moves} moves!
        </p>
      )}

      <button
        onClick={initializeGame}
        className="mt-6 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400"
      >
        Restart Game
      </button>

      <button
        onClick={() => (window.location.href = "/progress-memory")}
        className="mt-4 px-4 py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-400"
      >
        View Progress
      </button>
    </div>
  );
};

export default MemoryGame;

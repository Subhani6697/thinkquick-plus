import React, { useState, useEffect } from "react";
import ProgressTracker from "./ProgressTracker";

const symbols = ["🍎", "🍌", "🍇", "🍒", "🥝", "🍉", "🍍", "🍓"];

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [bestMoves, setBestMoves] = useState(null);
  const [history, setHistory] = useState([]);

  // Shuffle cards
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

  // Load history and best moves from localStorage
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("memoryHistory")) || [];
    const savedBest = JSON.parse(localStorage.getItem("bestMoves"));
    setHistory(savedHistory);
    if (savedBest) setBestMoves(savedBest);
  }, []);

  // Handle card flip
  const handleFlip = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    setFlipped((prev) => [...prev, index]);
  };

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      setMoves((prev) => prev + 1);

      if (cards[first].symbol === cards[second].symbol) {
        setMatched((prev) => [...prev, first, second]);
      }

      setTimeout(() => setFlipped([]), 800);
    }
  }, [flipped]);

  // Game completion logic
  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      const newHistory = [...history, { attempt: history.length + 1, moves }];
      localStorage.setItem("memoryHistory", JSON.stringify(newHistory));
      setHistory(newHistory);

      if (!bestMoves || moves < bestMoves) {
        setBestMoves(moves);
        localStorage.setItem("bestMoves", JSON.stringify(moves));
      }
    }
  }, [matched]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 text-white">
      <h1 className="text-3xl font-bold mb-6">🧩 Memory Flip Game</h1>
      <p className="mb-4">Moves: {moves}</p>
      {bestMoves !== null && (
        <p className="mb-4 text-yellow-400">Best Moves: {bestMoves}</p>
      )}
      <div className="grid grid-cols-4 gap-3">
        {cards.map((card, index) => (
          <div
            key={card.id}
            onClick={() => handleFlip(index)}
            className={`w-16 h-16 flex items-center justify-center rounded-lg text-2xl cursor-pointer transition-all duration-300 ${
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
            <div className="flex flex-col items-center mt-8 w-full gap-4">
  <button
    onClick={() => window.location.href = "/dashboard"}
    className="px-6 py-3 bg-blue-500 text-black rounded-lg font-semibold hover:bg-blue-400 transition"
  >
    Back to Dashboard
  </button>

  <button
    onClick={() => window.location.href = "/progress-memory"}
    className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition w-40"
  >
    View Progress
  </button>
</div>


    </div>
    
  );
};

export default MemoryGame;

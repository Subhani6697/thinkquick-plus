import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Word pool with valid associations
const WORD_MAP = {
  Sun: ["Heat", "Light", "Energy"],
  Heat: ["Fire", "Warmth", "Desert"],
  Light: ["Lamp", "Glow", "Sun"],
  Energy: ["Battery", "Power", "Electric"],
  Fire: ["Burn", "Smoke", "Heat"],
  Lamp: ["Light", "Bulb", "Glow"],
  Battery: ["Charge", "Energy", "Power"],
  Glow: ["Light", "Neon", "Firefly"],
};

const getRandomWord = () => {
  const keys = Object.keys(WORD_MAP);
  return keys[Math.floor(Math.random() * keys.length)];
};

const ThoughtChain = () => {
  const navigate = useNavigate();

  const [currentWord, setCurrentWord] = useState("Sun");
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  const timerRef = useRef(null);

  useEffect(() => {
    generateOptions();
    startRoundTimer();
    return () => clearTimeout(timerRef.current);
  }, []);

  const startRoundTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      handleWrong(); // if no click in 3s, it's wrong
    }, 3000);
  };

  const generateOptions = () => {
    const correct = WORD_MAP[currentWord];

    if (!correct) return;

    let wrongChoices = [];
    let allWords = Object.keys(WORD_MAP);

    while (wrongChoices.length < 2) {
      const w = allWords[Math.floor(Math.random() * allWords.length)];
      if (!correct.includes(w) && w !== currentWord && !wrongChoices.includes(w)) {
        wrongChoices.push(w);
      }
    }

    const finalOptions = [...correct.slice(0, 1), ...wrongChoices];
    setOptions(finalOptions.sort(() => Math.random() - 0.5));
  };

  const handleClick = (choice) => {
    clearTimeout(timerRef.current);

    const isCorrect = WORD_MAP[currentWord].includes(choice);

    if (isCorrect) {
      setScore((s) => s + 10);
    } else {
      setScore((s) => Math.max(0, s - 5));
    }

    // Move to next word in chain
    setCurrentWord(choice);
    setRound((r) => r + 1);

    // Generate new round
    setTimeout(() => {
      generateOptions();
      startRoundTimer();
    }, 300);
  };

  const handleWrong = () => {
    // Timeout penalty
    setScore((s) => Math.max(0, s - 5));

    // Jump to a random new word (chain break)
    const newWord = getRandomWord();
    setCurrentWord(newWord);
    setRound((r) => r + 1);

    generateOptions();
    startRoundTimer();
  };

  const endGame = () => {
    // Save progress
    const history =
      JSON.parse(localStorage.getItem("thoughtChainHistory")) || [];

    history.push({
      score,
      rounds: round,
      date: new Date().toLocaleString(),
    });

    localStorage.setItem("thoughtChainHistory", JSON.stringify(history));

    const best =
      JSON.parse(localStorage.getItem("bestThoughtChain")) || 0;

    if (score > best)
      localStorage.setItem("bestThoughtChain", score);

    navigate("/dashboard");
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8 text-center">
      <h1 className="text-4xl font-bold text-blue-400 mb-4">
        🔗 Thought Chain
      </h1>

      <h2 className="text-2xl font-semibold text-yellow-300 mb-4">
        Current Word: {currentWord}
      </h2>

      <p className="text-gray-300 mb-6">
        Pick a related concept within <span className="text-red-400">3 seconds</span>.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-xl mx-auto mt-6">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleClick(opt)}
            className="p-4 bg-blue-600 rounded-xl hover:bg-blue-500 transition font-bold"
          >
            {opt}
          </button>
        ))}
      </div>

      <p className="text-green-400 mt-8 text-xl font-bold">Score: {score}</p>
      <p className="text-gray-300">Round: {round}</p>

      <button
        onClick={endGame}
        className="mt-8 px-6 py-3 bg-red-500 rounded-lg hover:bg-red-400"
      >
        End Game
      </button>
    </div>
  );
};

export default ThoughtChain;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const rules = [
  { id: "A", label: "Respond by SHAPE" },
  { id: "B", label: "Respond by COLOR" },
  { id: "C", label: "Respond by NUMBER" },
];

const colors = ["red", "blue", "yellow"];
const shapes = ["circle", "triangle", "square"];

const QuantumShift = () => {
  const navigate = useNavigate();
  
  const [ruleIndex, setRuleIndex] = useState(0);

  // FIX 1: Give initial valid tile
  const [tile, setTile] = useState({
    shape: "circle",
    color: "red",
    number: 1,
  });

  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);

  const intervalRef = useRef(null);

  useEffect(() => {
    generateTile();

    intervalRef.current = setInterval(() => {
      setRuleIndex((prev) => (prev + 1) % rules.length);
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const generateTile = () => {
    const t = {
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      number: Math.floor(Math.random() * 9) + 1,
    };
    setTile(t);
  };

  const checkAnswer = (btn) => {
    const rule = rules[ruleIndex].id;
    let correct;

    if (rule === "A") {
      correct =
        (tile.shape === "circle" && btn === "left") ||
        (tile.shape === "triangle" && btn === "middle") ||
        (tile.shape === "square" && btn === "right");
    }

    if (rule === "B") {
      correct =
        (tile.color === "red" && btn === "left") ||
        (tile.color === "blue" && btn === "middle") ||
        (tile.color === "yellow" && btn === "right");
    }

    if (rule === "C") {
      const prime = [2, 3, 5, 7].includes(tile.number);
      correct =
        (tile.number % 2 !== 0 && btn === "left") ||
        (tile.number % 2 === 0 && btn === "right") ||
        (prime && btn === "middle");
    }

    setScore((s) => (correct ? s + 10 : Math.max(0, s - 5)));
    setRound((r) => r + 1);
    generateTile();
  };

  const saveProgress = () => {
    const history = JSON.parse(localStorage.getItem("quantumShiftHistory")) || [];
    history.push({ round, score, date: new Date().toLocaleString() });
    localStorage.setItem("quantumShiftHistory", JSON.stringify(history));

    const best = JSON.parse(localStorage.getItem("bestQuantumShift")) || 0;
    if (score > best) localStorage.setItem("bestQuantumShift", score);
  };

  const endGame = () => {
    saveProgress();
    navigate("/dashboard");
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6 text-center">

      <h1 className="text-4xl font-bold text-indigo-400 mb-4">
        ⚛ Quantum Shift
      </h1>

{/* How to Play Box */}
<div className="bg-gray-800 p-4 rounded-lg max-w-xl mx-auto text-left mb-6 text-sm text-gray-300">
  <h3 className="text-yellow-300 font-bold mb-2">How to Play</h3>
  <p className="mb-2">
    The rule changes every <span className="text-yellow-400 font-bold">5 seconds</span>.
    Follow the rule shown below:
  </p>

  <ul className="list-disc pl-5 space-y-1">
    <li>
      <span className="text-indigo-300 font-bold">Shape Rule:</span>  
      Click <b>LEFT</b> for Circle, <b>MIDDLE</b> for Triangle, <b>RIGHT</b> for Square.
    </li>

    <li>
      <span className="text-indigo-300 font-bold">Color Rule:</span>  
      Click <b>LEFT</b> for Red, <b>MIDDLE</b> for Blue, <b>RIGHT</b> for Yellow.
    </li>

    <li>
      <span className="text-indigo-300 font-bold">Number Rule:</span>  
      • Click <b>LEFT</b> for Odd numbers (1,3,5,7,9)  
      • Click <b>RIGHT</b> for Even numbers (2,4,6,8)  
      • Click <b>MIDDLE</b> only if the number is <b>Prime</b> (2,3,5,7)
    </li>
  </ul>

  <p className="mt-3 text-green-300">
    ✔ Correct = +10 points &nbsp; | &nbsp; ✖ Wrong = –5 points
  </p>
</div>



      <h2 className="text-lg mb-2 text-yellow-300">
        Current Rule: <span className="font-bold">{rules[ruleIndex].label}</span>
      </h2>

      <div className="mt-8 flex justify-center">
        <div
          className="w-32 h-32 flex items-center justify-center border-4 border-white rounded-xl text-xl font-bold"
          
          // FIX 2: fallback color
          style={{ color: tile.color || "white" }}
        >
          <div>
            <p>{tile.shape.toUpperCase()}</p>
            <p>{tile.color.toUpperCase()}</p>
            <p>{tile.number}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-8">
        <button
          onClick={() => checkAnswer("left")}
          className="px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 font-semibold"
        >
          LEFT
        </button>
        <button
          onClick={() => checkAnswer("middle")}
          className="px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 font-semibold"
        >
          MIDDLE
        </button>
        <button
          onClick={() => checkAnswer("right")}
          className="px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 font-semibold"
        >
          RIGHT
        </button>
      </div>

      <p className="text-gray-300 mt-6 text-lg">Round: {round}</p>
      <p className="text-green-300 text-xl font-bold mt-2">Score: {score}</p>

      <button
        onClick={endGame}
        className="px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 font-semibold"
      >
        End Game & Save Progress
      </button>
    </div>
  );
};

export default QuantumShift;

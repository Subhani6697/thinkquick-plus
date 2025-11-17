import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MirrorMind = () => {
  const navigate = useNavigate();

  const playAreaRef = useRef(null);
  const ballRef = useRef(null);

  const [ballPos, setBallPos] = useState({ x: 30, y: 30 });
  const [goalPos] = useState({ x: 320, y: 320 });
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState("");
  const [score, setScore] = useState(0);

  // Random obstacles
  const obstacles = [
    { x: 120, y: 80, w: 120, h: 20 },
    { x: 40, y: 200, w: 180, h: 20 },
    { x: 240, y: 260, w: 20, h: 120 },
  ];

  const saveProgress = () => {
    const history =
      JSON.parse(localStorage.getItem("mirrorMindHistory")) || [];
    history.push({
      score,
      date: new Date().toLocaleString(),
    });
    localStorage.setItem("mirrorMindHistory", JSON.stringify(history));

    const best = JSON.parse(localStorage.getItem("bestMirrorMind")) || 0;
    if (score > best) {
      localStorage.setItem("bestMirrorMind", score);
    }
  };

  const checkCollision = (x, y) => {
    for (let obs of obstacles) {
      if (
        x < obs.x + obs.w &&
        x + 30 > obs.x &&
        y < obs.y + obs.h &&
        y + 30 > obs.y
      ) {
        return true;
      }
    }
    return false;
  };

  const onMouseMove = (e) => {
    if (!dragging) return;

    const area = playAreaRef.current.getBoundingClientRect();

    // Reverse controls (mirror movement)
    const mirroredX = area.width - (e.clientX - area.left) - 30;
    const mirroredY = area.height - (e.clientY - area.top) - 30;

    let newX = mirroredX;
    let newY = mirroredY;

    // Box boundaries
    newX = Math.max(0, Math.min(newX, area.width - 30));
    newY = Math.max(0, Math.min(newY, area.height - 30));

    // Obstacle collision
    if (checkCollision(newX, newY)) {
      setMessage("🚫 Hit an obstacle!");
      setScore((s) => Math.max(0, s - 5));
      return;
    }

    setBallPos({ x: newX, y: newY });

    // Check goal
    if (Math.abs(newX - goalPos.x) < 25 && Math.abs(newY - goalPos.y) < 25) {
      setMessage("🎉 Goal reached!");
      setScore((s) => s + 20);
      saveProgress();
    }
  };

  return (
    <div
      className="bg-gray-900 min-h-screen text-white flex flex-col items-center p-6"
      onMouseMove={onMouseMove}
      onMouseUp={() => setDragging(false)}
    >
      <h1 className="text-4xl font-bold text-pink-400 mb-4">🪞 Mirror Mind</h1>

      {/* HOW TO PLAY */}
      <div className="bg-gray-800 px-4 py-3 rounded-lg text-sm max-w-md mb-4 text-left">
        <p className="font-bold mb-1 text-pink-300">How to Play:</p>
        <ul className="list-disc ml-5 text-gray-300">
          <li>Your movement is reversed (mirror controls).</li>
          <li>Dragging UP moves the ball DOWN.</li>
          <li>Dragging LEFT moves it RIGHT.</li>
          <li>Avoid obstacles and reach the goal square.</li>
        </ul>
      </div>

      <p className="mt-2 text-lg text-yellow-300">Score: {score}</p>
      <p className="text-red-400 mt-1">{message}</p>

      {/* PLAY AREA */}
      <div
        ref={playAreaRef}
        className="relative bg-gray-800 mt-6"
        style={{ width: 380, height: 380, borderRadius: 12 }}
      >
        {/* Obstacles */}
        {obstacles.map((o, i) => (
          <div
            key={i}
            className="bg-red-600 absolute rounded"
            style={{
              left: o.x,
              top: o.y,
              width: o.w,
              height: o.h,
            }}
          ></div>
        ))}

        {/* Goal */}
        <div
          className="absolute bg-green-500 rounded-xl"
          style={{
            left: goalPos.x,
            top: goalPos.y,
            width: 40,
            height: 40,
          }}
        ></div>

        {/* Ball */}
        <div
          ref={ballRef}
          onMouseDown={() => setDragging(true)}
          className="absolute bg-blue-400 rounded-full cursor-pointer"
          style={{
            width: 30,
            height: 30,
            left: ballPos.x,
            top: ballPos.y,
          }}
        ></div>
      </div>

      <button
        onClick={() => {
          saveProgress();
          navigate("/dashboard");
        }}
        className="mt-6 px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-400 transition"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default MirrorMind;

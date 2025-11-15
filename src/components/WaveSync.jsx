// src/components/WaveSync.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const WaveSync = () => {
  const navigate = useNavigate();

  // difficulty presets expressed as percent-per-second for speed
  const DIFFICULTY_PRESETS = {
    easy: { speed: 40, zone: 35 },   // 40% of bar per second
    normal: { speed: 60, zone: 25 }, // 60% per second
    hard: { speed: 80, zone: 18 },   // 80% per second
  };

  const [difficulty, setDifficulty] = useState("normal");

  const [running, setRunning] = useState(false);
  const [round, setRound] = useState(1);

  // speed = percent/sec (e.g. 60 -> 60% of bar per second)
  const [speed, setSpeed] = useState(DIFFICULTY_PRESETS.normal.speed);
  const [zonePercent, setZonePercent] = useState(DIFFICULTY_PRESETS.normal.zone);

  // UI marker position (0..100). markerRef is authoritative real-time.
  const [markerX, setMarkerX] = useState(0);
  const markerRef = useRef(0);
  const directionRef = useRef(1); // 1 -> right, -1 -> left

  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);

  // handle difficulty change (only when not running)
  const handleDifficulty = (lvl) => {
    if (running) return;
    setDifficulty(lvl);
    setSpeed(DIFFICULTY_PRESETS[lvl].speed);
    setZonePercent(DIFFICULTY_PRESETS[lvl].zone);
    setRound(1);
    markerRef.current = 0;
    setMarkerX(0);
  };

  // animation using time delta (percent per second)
  useEffect(() => {
    if (!running) {
      lastTimeRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }

    const step = (t) => {
      if (!lastTimeRef.current) lastTimeRef.current = t;
      const dt = (t - lastTimeRef.current) / 1000; // seconds
      lastTimeRef.current = t;

      // compute next marker pos using speed (percent/sec)
      let next = markerRef.current + directionRef.current * speed * dt;

      if (next > 100) {
        next = 100 - (next - 100); // reflect
        directionRef.current = -1;
      } else if (next < 0) {
        next = -next; // reflect
        directionRef.current = 1;
      }

      markerRef.current = next;
      setMarkerX(Number(next.toFixed(3))); // update UI

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTimeRef.current = null;
    };
  }, [running, speed]);

  // scoring: center -> 100, zone edge -> 0
  const computeScore = (pos, zone) => {
    const center = 50;
    const halfZone = zone / 2;
    const zoneStart = center - halfZone;
    const zoneEnd = center + halfZone;

    if (pos < zoneStart || pos > zoneEnd) return 0;

    const centerDist = Math.abs(pos - center); // 0..halfZone
    const raw = 1 - centerDist / halfZone; // 1 -> center, 0 -> edge
    let score = Math.round(raw * 100);

    // optional difficulty bias
    if (difficulty === "hard") score = Math.min(100, Math.round(score + 10));
    if (difficulty === "easy") score = Math.max(0, Math.round(score - 10));

    return score;
  };

  // On click: compute score using real-time markerRef.current
  const handleClick = () => {
    if (!running) return;

    // compute and save BEFORE changing round/zone/speed
    const pos = Number(markerRef.current.toFixed(3));
    const score = computeScore(pos, zonePercent);

    // Save progress (use attempt index)
    const history = JSON.parse(localStorage.getItem("waveSyncHistory")) || [];
    const attempt = history.length + 1;
    const entry = {
      attempt,
      round,
      score,
      speed,
      zonePercent,
      difficulty,
      markerPos: pos,
      timestamp: Date.now(),
    };
    history.push(entry);
    localStorage.setItem("waveSyncHistory", JSON.stringify(history));

    const prevBest = JSON.parse(localStorage.getItem("bestWaveSync")) || 0;
    if (score > prevBest) localStorage.setItem("bestWaveSync", JSON.stringify(score));

    // Then advance round and difficulty progression
    setRound((r) => r + 1);
    setZonePercent((z) => Math.max(8, Number((z - 2).toFixed(2))));
    setSpeed((s) => Number((s + (difficulty === "hard" ? 8 : 4)).toFixed(2))); // add percent/sec
  };

  const resetProgress = () => {
    localStorage.removeItem("waveSyncHistory");
    localStorage.removeItem("bestWaveSync");
    alert("Wave progress cleared.");
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white flex flex-col items-center py-10 px-6">
      <h1 className="text-5xl font-extrabold text-yellow-400 mb-4">🌊 Wave Sync</h1>

      <p className="text-gray-300 mb-8 max-w-2xl text-center">
        Click when the moving marker passes through the yellow zone. Closer to the center = higher score.
      </p>

      {!running && (
        <div className="flex gap-3 mb-6">
          {["easy", "normal", "hard"].map((l) => (
            <button
              key={l}
              onClick={() => handleDifficulty(l)}
              className={`px-4 py-2 rounded-lg ${
                difficulty === l ? "bg-yellow-400 text-black" : "bg-gray-800 text-gray-300"
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* bar */}
      <div className="w-full max-w-3xl h-20 rounded-full bg-gray-800 relative overflow-hidden mb-6">
        <div
          className="absolute top-0 h-full bg-yellow-500 opacity-50 transition-all"
          style={{ width: `${zonePercent}%`, left: `${50 - zonePercent / 2}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-xl"
          style={{ left: `${markerX}%`, transform: "translate(-50%, -50%)" }}
        />
      </div>

      <div className="flex gap-6 text-lg mb-6">
        <div>Round: <span className="text-yellow-300 font-semibold">{round}</span></div>
        <div>Speed: <span className="text-yellow-300 font-semibold">{speed}</span></div>
        <div>Zone: <span className="text-yellow-300 font-semibold">{zonePercent}%</span></div>
      </div>

      <div className="flex gap-4 mb-8">
        {!running ? (
          <button
            onClick={() => {
              // reset marker & start
              markerRef.current = 0;
              setMarkerX(0);
              lastTimeRef.current = null;
              setRunning(true);
            }}
            className="px-6 py-3 bg-green-500 text-black rounded-xl font-bold hover:bg-green-400"
          >
            Start
          </button>
        ) : (
          <button
            onClick={handleClick}
            className="px-6 py-3 bg-yellow-400 text-black rounded-xl font-bold hover:bg-yellow-300"
          >
            Click!
          </button>
        )}

        <button
          onClick={resetProgress}
          className="px-6 py-3 bg-red-500 text-black rounded-xl font-bold hover:bg-red-400"
        >
          Reset Progress
        </button>

        <button
          onClick={() => navigate("/progress-wave")}
          className="px-6 py-3 bg-blue-500 text-black rounded-xl font-bold hover:bg-blue-400"
        >
          View Progress
        </button>
      </div>

      <button
        onClick={() => navigate("/dashboard")}
        className="px-6 py-3 bg-blue-500 text-black rounded-xl hover:bg-blue-400"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default WaveSync;

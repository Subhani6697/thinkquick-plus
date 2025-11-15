import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const frequencies = [330, 392, 440, 494]; // tones (E, G, A, B)

const playTone = (freq) => {
  const audio = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audio.createOscillator();
  const gainNode = audio.createGain();

  oscillator.frequency.value = freq;
  oscillator.type = "sine";

  oscillator.connect(gainNode);
  gainNode.connect(audio.destination);

  oscillator.start();
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.4);
  oscillator.stop(audio.currentTime + 0.4);
};

const getRandomTone = () => frequencies[Math.floor(Math.random() * frequencies.length)];

const EchoMemory = () => {
  const navigate = useNavigate();

  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("Click Start to begin!");

  const startGame = () => {
    setSequence([getRandomTone()]);
    setUserInput([]);
    setRound(1);
    setScore(0);
    setMessage("Listen carefully...");
    playSequence([getRandomTone()]);
  };

  const playSequence = async (seq) => {
    setPlaying(true);
    for (const tone of seq) {
      playTone(tone);
      await new Promise((res) => setTimeout(res, 700));
    }
    setPlaying(false);
    setMessage("Now repeat the sequence...");
  };

  const handleUserTone = (freq) => {
    if (playing) return;
    playTone(freq);

    const updated = [...userInput, freq];
    setUserInput(updated);

    if (updated[updated.length - 1] !== sequence[updated.length - 1]) {
      setMessage("❌ Wrong sequence!");
      saveProgress(score);
      return;
    }

    if (updated.length === sequence.length) {
      const newScore = score + 1;
      setScore(newScore);
      setRound(round + 1);

      const nextSeq = [...sequence, getRandomTone()];
      setSequence(nextSeq);
      setUserInput([]);

      saveProgress(newScore);
      setMessage("✔ Correct! Listen again...");
      setTimeout(() => playSequence(nextSeq), 900);
    }
  };

  const saveProgress = (finalScore) => {
    const history =
      JSON.parse(localStorage.getItem("echoMemoryHistory")) || [];

    const entry = { round: history.length + 1, score: finalScore };
    history.push(entry);

    localStorage.setItem("echoMemoryHistory", JSON.stringify(history));

    const best = JSON.parse(localStorage.getItem("bestEchoMemory")) || 0;
    if (finalScore > best) {
      localStorage.setItem("bestEchoMemory", JSON.stringify(finalScore));
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white px-6 py-10">
      <h2 className="text-4xl font-bold text-purple-400 text-center mb-6">
        🔊 Echo Memory
      </h2>

      <p className="text-center text-gray-300 mb-4">{message}</p>

      <p className="text-center text-lg text-purple-300 mb-6">
        Score: {score} | Round: {round}
      </p>

      <div className="flex justify-center gap-4 mb-8">
        {frequencies.map((freq, i) => (
          <button
            key={i}
            disabled={playing}
            className="w-20 h-20 rounded-full bg-purple-600 hover:bg-purple-500 transition"
            onClick={() => handleUserTone(freq)}
          >
            🎵
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={startGame}
          className="px-6 py-3 bg-green-500 text-black rounded-lg hover:bg-green-400 transition"
        >
          Start
        </button>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-400"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="text-center mt-3">
        <button
          onClick={() => navigate("/progress-echo")}
          className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400"
        >
          View Progress
        </button>
      </div>
    </div>
  );
};

export default EchoMemory;

import React, { useEffect, useState, useRef } from "react";
import {
  FaAppleAlt,
  FaStar,
  FaKey,
  FaFutbol,
  FaBell,
  FaGem,
  FaMusic,
  FaHeart,
  FaLeaf,
} from "react-icons/fa";
import ObjectIcon from "./shadow/ObjectIcon";
import ShadowTile from "./shadow/ShadowTile";

/**
 * Shadow Match main component
 *
 * Behavior:
 * - Picks N icons and randomly places them into grid positions
 * - Shows the real icons for `revealTime` (seconds), then hides to silhouettes
 * - Player must drag icons from the tray to the correct tile
 * - On match completion we compute accuracy/time and save to localStorage
 */
const ALL_ICONS = [
  { id: "apple", Icon: FaAppleAlt },
  { id: "star", Icon: FaStar },
  { id: "key", Icon: FaKey },
  { id: "ball", Icon: FaFutbol },
  { id: "bell", Icon: FaBell },
  { id: "gem", Icon: FaGem },
  { id: "music", Icon: FaMusic },
  { id: "heart", Icon: FaHeart },
  { id: "leaf", Icon: FaLeaf },
];

const ShadowMatch = ({ gridSide = 3, revealTime = 3000 }) => {
  const [grid, setGrid] = useState([]); // array of {slotId, itemId, Icon}
  const [tray, setTray] = useState([]); // array of {itemId, Icon} in random order
  const [isRevealed, setIsRevealed] = useState(true);
  const [matchedMap, setMatchedMap] = useState({}); // slotId -> dropped itemId (string)
  const [startTime, setStartTime] = useState(null);
  const [finished, setFinished] = useState(false);
  const [stats, setStats] = useState(null);
  const revealTimeoutRef = useRef(null);

  // Initialize the grid and tray
  const initRound = () => {
    const total = gridSide * gridSide;
    // choose first `total` icons (we have 9 in ALL_ICONS by default)
    const chosen = ALL_ICONS.slice(0, total);
    // shuffle chosen icons for grid placement
    const shuffledForGrid = shuffleArray(chosen).map((item, idx) => ({
      slotId: `slot-${idx}`,
      itemId: item.id,
      Icon: item.Icon,
    }));
    // tray is the same items but shuffled order
    const shuffledTray = shuffleArray(chosen).map((item) => ({
      itemId: item.id,
      Icon: item.Icon,
    }));

    setGrid(shuffledForGrid);
    setTray(shuffledTray);
    setMatchedMap({});
    setIsRevealed(true);
    setFinished(false);
    setStats(null);

    // after revealTime ms, hide and start timer
    if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
    revealTimeoutRef.current = setTimeout(() => {
      setIsRevealed(false);
      setStartTime(performance.now());
    }, revealTime);
  };

  useEffect(() => {
    initRound();
    return () => {
      if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // helper
  function shuffleArray(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  // handle drop on given slot
  const handleDropOnSlot = (slotId) => (droppedId) => {
    if (finished || isRevealed) return;
    // mark this slot matched with droppedId
    setMatchedMap((prev) => {
      // prevent re-dropping same droppedId on multiple slots:
      const alreadyAssigned = Object.values(prev).includes(droppedId);
      if (alreadyAssigned) return prev; // ignore
      const next = { ...prev, [slotId]: droppedId };
      // toggle finished check after state set using next
      const totalSlots = grid.length;
      const matchedCount = Object.keys(next).length;
      if (matchedCount === totalSlots) {
        // evaluate results
        setTimeout(() => evaluateResult(next), 150);
      }
      return next;
    });
  };

  const evaluateResult = (finalMap) => {
    const end = performance.now();
    const timeSeconds = ((end - (startTime || end)) / 1000).toFixed(2); // seconds
    const total = grid.length;
    let correct = 0;
    // grid contains ordered slot -> expected itemId
    grid.forEach((slot) => {
      const expected = slot.itemId;
      const assigned = finalMap[slot.slotId];
      if (assigned && assigned === expected) correct += 1;
    });
    const accuracy = Math.round((correct / total) * 100);
    setFinished(true);

    const newStats = {
      attempt: (JSON.parse(localStorage.getItem("shadowHistory")) || []).length + 1,
      accuracy,
      time: Number(timeSeconds),
      correct,
      total,
      date: new Date().toISOString(),
    };
    setStats(newStats);

    // save to localStorage
    const prev = JSON.parse(localStorage.getItem("shadowHistory")) || [];
    const updated = [...prev, { attempt: newStats.attempt, accuracy, time: Number(timeSeconds) }];
    localStorage.setItem("shadowHistory", JSON.stringify(updated));

    // best accuracy
    const prevBest = JSON.parse(localStorage.getItem("shadowBestAccuracy")) || 0;
    if (accuracy > prevBest) localStorage.setItem("shadowBestAccuracy", JSON.stringify(accuracy));

    // fastest time (lower is better)
    const prevFastest = JSON.parse(localStorage.getItem("shadowFastestTime"));
    if (!prevFastest || Number(timeSeconds) < Number(prevFastest)) {
      localStorage.setItem("shadowFastestTime", JSON.stringify(Number(timeSeconds)));
    }
  };

  const restart = () => {
    if (revealTimeoutRef.current) clearTimeout(revealTimeoutRef.current);
    initRound();
  };

  // Remove assigned item from tray view (tray items that are already placed)
  const trayFiltered = tray.filter((t) => !Object.values(matchedMap).includes(t.itemId));

  return (
    <div className="min-h-screen p-6 bg-gray-950 text-white flex flex-col items-center">
      <h1 className="text-3xl font-extrabold text-yellow-400 mb-4">🕶️ Shadow Match</h1>
      <p className="text-gray-300 mb-4 max-w-xl text-center">
        Memorize the arrangement, then drag each object onto its shadow. Try to match as many as possible — accuracy and speed are tracked.
      </p>

      <div className="mb-6">
        <div
          className="grid gap-3"
          style={{ gridTemplateColumns: `repeat(${gridSide}, 1fr)`, maxWidth: `${gridSide * 92}px` }}
        >
          {grid.map((slot) => (
            <ShadowTile
              key={slot.slotId}
              expectedId={slot.itemId}
              Icon={slot.Icon}
              isRevealed={isRevealed || finished}
              onDrop={(droppedId) => handleDropOnSlot(slot.slotId)(droppedId)}
              correct={finished && matchedMap[slot.slotId] === slot.itemId}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-3xl">
        <h3 className="text-sm text-gray-300 mb-2">Tray — drag icons into the shadows</h3>
        <div className="flex gap-3 flex-wrap bg-gray-900 p-3 rounded-lg">
          {trayFiltered.length === 0 && !isRevealed ? (
            <p className="text-gray-400">All items placed</p>
          ) : (
            trayFiltered.map((t) => <ObjectIcon key={t.itemId} id={t.itemId} Icon={t.Icon} />)
          )}

          {isRevealed && <p className="text-yellow-300 ml-4">Revealing... memorize the positions</p>}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button onClick={restart} className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-300">
          Restart
        </button>

        <button
          onClick={() => {
            // show progress page
            window.location.href = "/progress-shadow";
          }}
          className="px-4 py-2 bg-green-500 text-black rounded-lg font-semibold hover:bg-green-400"
        >
          View Progress
        </button>
      </div>

      {finished && stats && (
        <div className="mt-6 bg-gray-800 p-4 rounded-lg w-full max-w-md text-center">
          <p className="text-lg font-semibold text-white">Result</p>
          <p className="text-gray-300 mt-2">Correct: {stats.correct}/{stats.total}</p>
          <p className="text-gray-300">Accuracy: {stats.accuracy}%</p>
          <p className="text-gray-300">Time: {stats.time}s</p>
        </div>
      )}
    </div>
  );
};

export default ShadowMatch;

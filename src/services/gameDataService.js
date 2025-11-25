// src/services/gameDataService.js
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

/**
 * Helper to safely get nested stats for a user
 */
const getStatsSafe = (snap) => {
  if (!snap.exists()) return {};
  const data = snap.data();
  return data.stats || {};
};

/**
 * 🔹 Save Reaction result
 * - Stores a game attempt in `gameAttempts`
 * - Updates user stats in `users/{uid}.stats.reaction`
 */
export const saveReactionResult = async (uid, timeMs) => {
  if (!uid) return;

  // 1) Save attempt in global collection
  await addDoc(collection(db, "gameAttempts"), {
    uid,
    gameType: "reaction",
    timeMs,
    createdAt: serverTimestamp(),
  });

  // 2) Update user stats
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  const stats = getStatsSafe(snap);
  const current = stats.reaction || {};

  const newBest =
    typeof current.bestTime === "number"
      ? Math.min(current.bestTime, timeMs)
      : timeMs;

  const attempts = (current.attempts || 0) + 1;

  await setDoc(
    userRef,
    {
      stats: {
        ...stats,
        reaction: {
          bestTime: newBest,
          lastTime: timeMs,
          attempts,
        },
      },
    },
    { merge: true }
  );
};

/**
 * 🔹 Save Memory result
 * - `moves` (lower is better)
 */
export const saveMemoryResult = async (uid, moves) => {
  if (!uid) return;

  await addDoc(collection(db, "gameAttempts"), {
    uid,
    gameType: "memory",
    moves,
    createdAt: serverTimestamp(),
  });

  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  const stats = getStatsSafe(snap);
  const current = stats.memory || {};

  const newBest =
    typeof current.bestMoves === "number"
      ? Math.min(current.bestMoves, moves)
      : moves;

  const attempts = (current.attempts || 0) + 1;

  await setDoc(
    userRef,
    {
      stats: {
        ...stats,
        memory: {
          bestMoves: newBest,
          lastMoves: moves,
          attempts,
        },
      },
    },
    { merge: true }
  );
};

/**
 * 🔹 Save Focus result
 * - `score` (higher is better)
 */
export const saveFocusResult = async (uid, score) => {
  if (!uid) return;

  await addDoc(collection(db, "gameAttempts"), {
    uid,
    gameType: "focus",
    score,
    createdAt: serverTimestamp(),
  });

  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  const stats = getStatsSafe(snap);
  const current = stats.focus || {};

  const newBest =
    typeof current.bestScore === "number"
      ? Math.max(current.bestScore, score)
      : score;

  const attempts = (current.attempts || 0) + 1;

  await setDoc(
    userRef,
    {
      stats: {
        ...stats,
        focus: {
          bestScore: newBest,
          lastScore: score,
          attempts,
        },
      },
    },
    { merge: true }
  );
};

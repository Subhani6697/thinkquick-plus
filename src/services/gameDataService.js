import { db } from "../firebase/firebaseConfig";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

/*
  Structure saved in Firestore:
  {
    history: [
      { attempt: 1, value: 350 },
      { attempt: 2, value: 290 }
    ],
    best: { attempt: 2, value: 290 }
  }
*/

export const saveGameResult = async (uid, game, value) => {
  if (!uid || !game) return;

  const userRef = doc(db, "users", uid);

  // Ensure root user doc exists
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      email: "",
      name: "",
      isAdmin: false,
    });
  }

  const gameRef = doc(db, "users", uid, "progress", game);
  const gameSnap = await getDoc(gameRef);

  let history = [];
  let best = null;

  if (gameSnap.exists()) {
    history = gameSnap.data().history || [];
    best = gameSnap.data().best || null;
  }

  // Add new entry
  const newEntry = {
    attempt: history.length + 1,
    value: value, // numeric score/time
  };

  const updatedHistory = [...history, newEntry];

  // Determine "better" rules per game
  const isBetter =
    best === null
      ? true
      : game === "focus"
      ? value > best.value // higher is better
      : value < best.value; // reaction & memory: lower is better

  const updatedBest = isBetter ? newEntry : best;

  await setDoc(gameRef, {
    history: updatedHistory,
    best: updatedBest,
  });

  console.log(`💾 Saved result for ${game}:`, newEntry);
};

// --------------------------------------------------------
// Load Progress
// --------------------------------------------------------
export const loadProgress = async (uid, game) => {
  if (!uid) return { history: [], best: null };

  const ref = doc(db, "users", uid, "progress", game);
  const snap = await getDoc(ref);

  if (!snap.exists()) return { history: [], best: null };
  return snap.data();
};

// --------------------------------------------------------
// Reset Progress
// --------------------------------------------------------
export const resetProgress = async (uid, game) => {
  const ref = doc(db, "users", uid, "progress", game);
  await setDoc(ref, { history: [], best: null });
};

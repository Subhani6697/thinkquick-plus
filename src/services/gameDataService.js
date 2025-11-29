// src/services/gameDataService.js
import { db } from "../firebase/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

/*
   FIRESTORE STRUCTURE FOR EACH GAME:

   reaction:
   {
      history: [ { attempt:1, time:350 } ],
      best: { attempt:1, time:350 }
   }

   memory:
   {
      history: [ { attempt:1, moves:14 } ],
      best: { attempt:1, moves:14 }
   }

   focus:
   {
      history: [ { attempt:1, score:4 } ],
      best: { attempt:1, score:4 }
   }
*/


export const saveGameResult = async (uid, game, result) => {
  if (!uid || !game) return;

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  // Ensure user doc exists
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

  // Determine correct field name
  const entry =
    game === "reaction"
      ? { attempt: history.length + 1, time: result }
      : game === "memory"
      ? { attempt: history.length + 1, moves: result }
      : { attempt: history.length + 1, score: result };

  const updatedHistory = [...history, entry];

  // Determine if new attempt is the best
  let isBetter = false;

  if (!best) {
    isBetter = true;
  } else if (game === "reaction") {
    isBetter = entry.time < best.time;
  } else if (game === "memory") {
    isBetter = entry.moves < best.moves;
  } else if (game === "focus") {
    isBetter = entry.score > best.score;
  }

  const updatedBest = isBetter ? entry : best;

  await setDoc(gameRef, {
    history: updatedHistory,
    best: updatedBest,
  });

  console.log(`Saved result for ${game}`, entry);
};


// Load progress
export const loadProgress = async (uid, game) => {
  if (!uid) return { history: [], best: null };

  const ref = doc(db, "users", uid, "progress", game);
  const snap = await getDoc(ref);

  if (!snap.exists()) return { history: [], best: null };
  return snap.data();
};


// Reset progress
export const resetProgress = async (uid, game) => {
  const ref = doc(db, "users", uid, "progress", game);
  await setDoc(ref, { history: [], best: null });
};

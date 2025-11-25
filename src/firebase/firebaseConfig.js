// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { setPersistence, browserLocalPersistence } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAoLlWWikJTBGQQuzblhabInNv2Q1ylUHs",
  authDomain: "thinkquickplus.firebaseapp.com",
  projectId: "thinkquickplus",
  storageBucket: "thinkquickplus.firebasestorage.app",
  messagingSenderId: "451128126558",
  appId: "1:451128126558:web:3c89c9e38f5b2f5b9198cf",
  measurementId: "G-SVPJNMBCCM"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);      // ✅ REQUIRED EXPORT
// THEN set persistence
setPersistence(auth, browserLocalPersistence)
  .catch((err) => console.error("Persistence error:", err));
export const analytics = getAnalytics(app);
export const db = getFirestore(app);

export default app;

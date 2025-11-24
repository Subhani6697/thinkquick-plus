// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

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
export const analytics = getAnalytics(app);

export default app;

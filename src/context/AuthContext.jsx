// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // -----------------------------------------
  // Create Firestore user record if missing
  // -----------------------------------------
  const ensureUserDocument = async (firebaseUser) => {
    const ref = doc(db, "users", firebaseUser.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        name: firebaseUser.displayName || "",
        email: firebaseUser.email,
        isAdmin: false,
      });
    }
  };

  // -----------------------------------------
  // Firebase auth listener
  // -----------------------------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await ensureUserDocument(firebaseUser);

        const ref = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(ref);

        setUser({
          ...firebaseUser,
          isAdmin: snap.exists() ? snap.data().isAdmin : false,
        });
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  // -----------------------------------------
  // Create account
  // -----------------------------------------
  const signup = async (name, email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    await ensureUserDocument(result.user);
    return result;
  };

  // -----------------------------------------
  // Email login
  // -----------------------------------------
  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await ensureUserDocument(result.user);
    return result;
  };

  // -----------------------------------------
  // Google login
  // -----------------------------------------
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await ensureUserDocument(result.user);
    return result;
  };

  // -----------------------------------------
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        signup,
        login,
        loginWithGoogle,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

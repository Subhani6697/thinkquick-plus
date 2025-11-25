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

import { auth } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";


const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);    // Firebase user
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const ref = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(ref);
      
      setUser({
        ...firebaseUser,
        isAdmin: snap.exists() ? snap.data().isAdmin : false
      });
    } else {
      setUser(null);
    }

    setLoading(false);
    console.log("AUTH STATE:", firebaseUser);

  });

  return () => unsub();
}, []);


  const signup = async (name, email, password) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);

  // Set display name in Firebase
  await updateProfile(result.user, { displayName: name });

  // Refresh local user object
  await auth.currentUser.reload();
  setUser({ ...auth.currentUser });
};


  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
    
  };

  const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);

  const ref = doc(db, "users", result.user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      email: result.user.email,
      name: result.user.displayName,
      isAdmin: false
    });
  }
};


  const logout = () => signOut(auth);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// src/pages/UserProfile.jsx
import React, { useState, useEffect } from "react";
import {
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

import { auth } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { loadProgress, resetProgress } from "../services/gameDataService";

const UserProfile = () => {
  const { user } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [stats, setStats] = useState({
    reaction: null,
    memory: null,
    focus: null,
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Load game stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      const reaction = await loadProgress(user.uid, "reaction");
      const memory = await loadProgress(user.uid, "memory");
      const focus = await loadProgress(user.uid, "focus");

      setStats({ reaction, memory, focus });
    };

    fetchStats();
  }, [user]);

  // ------------------------
  // UPDATE DISPLAY NAME
  // ------------------------
  const handleNameUpdate = async () => {
    setError("");
    setSuccess("");

    try {
      await updateProfile(auth.currentUser, { displayName });
      setSuccess("Name updated successfully!");
    } catch (err) {
      setError("Error updating name: " + err.message);
    }
  };

  // ------------------------
  // UPDATE EMAIL
  // ------------------------
  const handleEmailUpdate = async () => {
    setError("");
    setSuccess("");

    try {
      await updateEmail(auth.currentUser, email);
      setSuccess("Email updated successfully!");
    } catch (err) {
      setError("Error updating email: " + err.message);
    }
  };

  // ------------------------
  // UPDATE PASSWORD
  // ------------------------
  const handlePasswordUpdate = async () => {
    setError("");
    setSuccess("");

    try {
      const currentUser = auth.currentUser;

      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );

      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);

      setSuccess("Password updated successfully!");

      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError("Error updating password: " + err.message);
    }
  };

  // ------------------------
  // RESET ONE GAME
  // ------------------------
  const handleReset = async (game) => {
    await resetProgress(user.uid, game);
    const updated = await loadProgress(user.uid, game);
    setStats((prev) => ({ ...prev, [game]: updated }));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-4xl font-bold text-yellow-400 text-center mt-6">
        👤 User Profile
      </h1>

      {error && <p className="text-red-400 text-center mt-2">{error}</p>}
      {success && <p className="text-green-400 text-center mt-2">{success}</p>}

      <div className="max-w-xl mx-auto bg-gray-900 p-6 rounded-2xl shadow-lg mt-8 space-y-6">

        {/* Display Name */}
        <div>
          <label className="text-sm">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-800 mt-1"
          />
          <button
            onClick={handleNameUpdate}
            className="w-40 mt-2 p-2 bg-black rounded-lg hover:bg-blue-400"
          >
            Update Name
          </button>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-800 mt-1"
          />
          <button
            onClick={handleEmailUpdate}
            className="w-40 mt-2 p-2 bg-yellow-500 rounded-lg hover:bg-yellow-400"
          >
            Update Email
          </button>
        </div>

        {/* Password */}
        <div>
          <label className="text-sm">Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-800 mt-1"
          />

          <label className="text-sm mt-2 block">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-800 mt-1"
          />

          <button
            onClick={handlePasswordUpdate}
            className="w-40 mt-2 p-2 bg-green-500 rounded-lg hover:bg-green-400"
          >
            Update Password
          </button>
        </div>
      </div>

      {/* ---------------- GAME STATS ---------------- */}
      <h2 className="text-3xl text-center text-yellow-300 mt-10">
        🎮 Your Game Stats
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-6">

        {/* REACTION */}
        <div className="bg-gray-900 p-5 rounded-xl">
          <h3 className="text-xl font-bold text-yellow-400">Reaction</h3>
          {stats.reaction?.best ? (
            <>
              <p className="mt-2">
                Best: <strong>{stats.reaction.best.time} ms</strong>
              </p>
              <p>Attempts: {stats.reaction.history.length}</p>
              <button
                onClick={() => handleReset("reaction")}
                className="mt-3 px-3 py-1 bg-red-500 rounded-lg"
              >
                Reset
              </button>
            </>
          ) : (
            <p className="text-gray-400 mt-2">No data yet</p>
          )}
        </div>

        {/* MEMORY */}
        <div className="bg-gray-900 p-5 rounded-xl">
          <h3 className="text-xl font-bold text-yellow-400">Memory</h3>
          {stats.memory?.best ? (
            <>
              <p className="mt-2">
                Best: <strong>{stats.memory.best.moves} moves</strong>
              </p>
              <p>Attempts: {stats.memory.history.length}</p>
              <button
                onClick={() => handleReset("memory")}
                className="mt-3 px-3 py-1 bg-red-500 rounded-lg"
              >
                Reset
              </button>
            </>
          ) : (
            <p className="text-gray-400 mt-2">No data yet</p>
          )}
        </div>

        {/* FOCUS */}
        <div className="bg-gray-900 p-5 rounded-xl">
          <h3 className="text-xl font-bold text-yellow-400">Focus</h3>
          {stats.focus?.best ? (
            <>
              <p className="mt-2">
                Best: <strong>{stats.focus.best.score} points</strong>
              </p>
              <p>Attempts: {stats.focus.history.length}</p>
              <button
                onClick={() => handleReset("focus")}
                className="mt-3 px-3 py-1 bg-red-500 rounded-lg"
              >
                Reset
              </button>
            </>
          ) : (
            <p className="text-gray-400 mt-2">No data yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

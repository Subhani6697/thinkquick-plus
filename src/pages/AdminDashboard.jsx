import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  deleteDoc,
} from "firebase/firestore";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState(null);

  // Fetch all users in Firestore
  const fetchUsers = async () => {
    setLoading(true);
    const snap = await getDocs(collection(db, "users"));

    const arr = snap.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    }));

    setUsers(arr);
    setLoading(false);
  };

  // Fetch progress for selected user
  const fetchUserProgress = async (uid) => {
    setSelectedUser(uid);
    setGameData(null);

    const progressRef = collection(db, "users", uid, "progress");
    const gamesSnap = await getDocs(progressRef);

    const data = {};
    for (const gameDoc of gamesSnap.docs) {
      data[gameDoc.id] = gameDoc.data();
    }

    setGameData(data);
  };

  // Reset user progress
  const resetUserProgress = async (uid) => {
    const progressRef = collection(db, "users", uid, "progress");
    const gamesSnap = await getDocs(progressRef);

    const deletions = gamesSnap.docs.map((g) =>
      deleteDoc(doc(db, "users", uid, "progress", g.id))
    );

    await Promise.all(deletions);

    alert("Progress reset successfully!");
    fetchUserProgress(uid);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (!user?.isAdmin) {
    return (
      <div className="text-center text-red-500 text-xl mt-10">
        ❌ Access Denied — Admins Only
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">
        🔐 Admin Dashboard
      </h1>

      {loading ? (
        <p className="text-gray-300">Loading users...</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {/* USER LIST */}
          <div className="col-span-1 bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">All Users</h2>
            <ul className="space-y-3">
              {users.map((u) => (
                <li
                  key={u.uid}
                  className={`p-3 rounded-lg cursor-pointer hover:bg-gray-700 ${
                    selectedUser === u.uid ? "bg-gray-700" : "bg-gray-800"
                  }`}
                  onClick={() => fetchUserProgress(u.uid)}
                >
                  <p className="font-semibold">{u.name || "Unknown User"}</p>
                  <p className="text-sm text-gray-400">{u.email}</p>
                  {u.isAdmin && (
                    <span className="text-xs text-yellow-300">Admin</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* GAME DATA */}
          <div className="col-span-2 bg-gray-800 p-6 rounded-xl shadow">
            {!selectedUser ? (
              <p className="text-gray-400">Select a user to view progress</p>
            ) : !gameData ? (
              <p className="text-gray-400">Loading progress...</p>
            ) : (
              <>
                <h2 className="text-2xl font-semibold mb-4">
                  📊 Game Progress for User
                </h2>

                {/* Reaction */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-yellow-300">
                    ⚡ Reaction Time
                  </h3>
                  {gameData.reaction ? (
                    <pre className="bg-gray-700 p-3 rounded-lg mt-2 text-sm">
                      {JSON.stringify(gameData.reaction, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-gray-400 mt-2">No data</p>
                  )}
                </div>

                {/* Memory */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-yellow-300">
                    🧠 Memory Game
                  </h3>
                  {gameData.memory ? (
                    <pre className="bg-gray-700 p-3 rounded-lg mt-2 text-sm">
                      {JSON.stringify(gameData.memory, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-gray-400 mt-2">No data</p>
                  )}
                </div>

                {/* Focus */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-yellow-300">
                    🎯 Focus Game
                  </h3>
                  {gameData.focus ? (
                    <pre className="bg-gray-700 p-3 rounded-lg mt-2 text-sm">
                      {JSON.stringify(gameData.focus, null, 2)}
                    </pre>
                  ) : (
                    <p className="text-gray-400 mt-2">No data</p>
                  )}
                </div>

                <button
                  className="px-4 py-2 bg-red-500 text-black rounded-lg hover:bg-red-400 mt-4"
                  onClick={() => resetUserProgress(selectedUser)}
                >
                  Reset All Progress
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc,
  where,
} from "firebase/firestore";

const AdminDashboard = () => {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [gameStats, setGameStats] = useState({});
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingGames, setLoadingGames] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview | users | games

  // 🔹 Load users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const qUsers = query(collection(db, "users"), orderBy("email", "asc"));
        const snap = await getDocs(qUsers);
        const arr = [];
        snap.forEach((d) => {
          arr.push({ id: d.id, ...d.data() });
        });
        setUsers(arr);
      } catch (err) {
        console.error("Error loading users:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // 🔹 Load game attempts and aggregate per gameType
  useEffect(() => {
    const fetchGameStats = async () => {
      try {
        const snap = await getDocs(collection(db, "gameAttempts"));
        const stats = {};

        snap.forEach((docSnap) => {
          const data = docSnap.data();
          const gameType = data.gameType;

          if (!gameType) return;

          if (!stats[gameType]) {
            stats[gameType] = {
              count: 0,
              best: null,
              avg: 0,
            };
          }

          stats[gameType].count += 1;

          // pick numeric value based on game type
          let value;
          if (gameType === "reaction") value = data.timeMs;
          else if (gameType === "memory") value = data.moves;
          else value = data.score;

          if (typeof value !== "number") return;

          // best: for reaction/memory = lower is better, for others = higher
          if (stats[gameType].best === null) {
            stats[gameType].best = value;
          } else {
            if (gameType === "reaction" || gameType === "memory") {
              stats[gameType].best = Math.min(stats[gameType].best, value);
            } else {
              stats[gameType].best = Math.max(stats[gameType].best, value);
            }
          }

          // Accumulate avg in a simple way
          stats[gameType].avg += value;
        });

        // finalize averages
        Object.keys(stats).forEach((key) => {
          const s = stats[key];
          if (s.count > 0) {
            s.avg = Number((s.avg / s.count).toFixed(2));
          }
        });

        setGameStats(stats);
      } catch (err) {
        console.error("Error loading game stats:", err);
      } finally {
        setLoadingGames(false);
      }
    };

    fetchGameStats();
  }, []);

  const promoteToAdmin = async (uid) => {
    try {
      await updateDoc(doc(db, "users", uid), { isAdmin: true });
      setUsers((prev) =>
        prev.map((u) => (u.id === uid ? { ...u, isAdmin: true } : u))
      );
      alert("User promoted to admin");
    } catch (err) {
      console.error(err);
      alert("Failed to promote user");
    }
  };

  const filterAttemptsByUser = async (uid) => {
    // Example: you might later show per-user attempts
    try {
      const q = query(
        collection(db, "gameAttempts"),
        where("uid", "==", uid)
      );
      const snap = await getDocs(q);
      console.log("Attempts for user", uid, snap.size);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-950 p-6 border-r border-gray-800">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6">
          Admin Panel
        </h1>

        <p className="text-sm text-gray-400 mb-4">
          Logged in as:{" "}
          <span className="text-blue-300">
            {user?.displayName || user?.email}
          </span>
        </p>

        <nav className="flex flex-col gap-2 mt-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`text-left px-3 py-2 rounded-lg text-sm ${
              activeTab === "overview"
                ? "bg-yellow-500 text-black"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={`text-left px-3 py-2 rounded-lg text-sm ${
              activeTab === "users"
                ? "bg-yellow-500 text-black"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            Users
          </button>

          <button
            onClick={() => setActiveTab("games")}
            className={`text-left px-3 py-2 rounded-lg text-sm ${
              activeTab === "games"
                ? "bg-yellow-500 text-black"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            Game Stats
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {activeTab === "overview" && (
          <>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              Overview
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-5 rounded-xl shadow">
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-3xl font-bold mt-2">
                  {loadingUsers ? "…" : users.length}
                </p>
              </div>

              <div className="bg-gray-800 p-5 rounded-xl shadow">
                <p className="text-sm text-gray-400">Tracked Games</p>
                <p className="text-3xl font-bold mt-2">
                  {loadingGames ? "…" : Object.keys(gameStats).length}
                </p>
              </div>

              <div className="bg-gray-800 p-5 rounded-xl shadow">
                <p className="text-sm text-gray-400">Admins</p>
                <p className="text-3xl font-bold mt-2">
                  {users.filter((u) => u.isAdmin).length}
                </p>
              </div>
            </div>
          </>
        )}

        {activeTab === "users" && (
          <>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              Users
            </h2>
            {loadingUsers ? (
              <p className="text-gray-400">Loading users…</p>
            ) : users.length === 0 ? (
              <p className="text-gray-400">No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-left">Admin</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-gray-800">
                        <td className="px-4 py-2">
                          {u.name || u.displayName || "—"}
                        </td>
                        <td className="px-4 py-2">{u.email}</td>
                        <td className="px-4 py-2">
                          {u.isAdmin ? (
                            <span className="text-green-400 font-semibold">
                              Yes
                            </span>
                          ) : (
                            "No"
                          )}
                        </td>
                        <td className="px-4 py-2 flex gap-2">
                          {!u.isAdmin && (
                            <button
                              onClick={() => promoteToAdmin(u.id)}
                              className="px-3 py-1 text-xs bg-purple-500 text-black rounded-lg hover:bg-purple-400"
                            >
                              Make Admin
                            </button>
                          )}
                          <button
                            onClick={() => filterAttemptsByUser(u.id)}
                            className="px-3 py-1 text-xs bg-gray-700 rounded-lg hover:bg-gray-600"
                          >
                            View Attempts (console)
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === "games" && (
          <>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">
              Game Stats
            </h2>
            {loadingGames ? (
              <p className="text-gray-400">Loading game stats…</p>
            ) : Object.keys(gameStats).length === 0 ? (
              <p className="text-gray-400">No game attempts found yet.</p>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {Object.entries(gameStats).map(([gameType, s]) => (
                  <div
                    key={gameType}
                    className="bg-gray-800 p-5 rounded-xl shadow"
                  >
                    <p className="text-lg font-semibold capitalize mb-2">
                      {gameType}
                    </p>
                    <p className="text-sm text-gray-400">
                      Attempts:{" "}
                      <span className="text-white font-bold">{s.count}</span>
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Best:{" "}
                      <span className="text-white font-bold">
                        {s.best !== null ? s.best : "—"}
                      </span>
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      Avg:{" "}
                      <span className="text-white font-bold">
                        {s.avg || "—"}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

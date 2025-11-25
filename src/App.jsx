import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import GameDashboard from "./pages/GameDashboard";
import GameCategories from "./pages/GameCategories";
import Leaderboard from "./pages/Leaderboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

// Auth Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Games + Progress
import ReactionGame from "./components/ReactionGame";
import MemoryGame from "./components/MemoryGame";
import ProgressTracker from "./components/ProgressTracker";

import FocusTracker from "./components/FocusTracker";
import ShadowMatch from "./components/ShadowMatch";
import ShadowProgress from "./pages/ShadowProgress";

import WaveSync from "./components/WaveSync";
import WaveProgress from "./pages/WaveProgress";

import TimeSlip from "./components/TimeSlip";
import TimeSlipProgress from "./pages/TimeSlipProgress";

import EchoMemory from "./components/EchoMemory";
import EchoMemoryProgress from "./pages/EchoMemoryProgress";

import QuantumShift from "./components/QuantumShift";
import QuantumShiftProgress from "./pages/QuantumShiftProgress";

import MirrorMind from "./components/MirrorMind";
import MirrorMindProgress from "./pages/MirrorMindProgress";

import ThoughtChain from "./components/ThoughtChain";
import ThoughtChainProgress from "./pages/ThoughtChainProgress";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";


function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        
        <Navbar />

        <main className="flex-grow">
          <Routes>

            {/* ---------- PUBLIC ROUTES ---------- */}
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<GameCategories />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* AUTH ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* ---------- PROTECTED ROUTES ---------- */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <GameDashboard />
                </ProtectedRoute>
              }
            />

            {/* Games */}
            <Route
              path="/reaction"
              element={
                <ProtectedRoute>
                  <ReactionGame />
                </ProtectedRoute>
              }
            />
            <Route
              path="/memory"
              element={
                <ProtectedRoute>
                  <MemoryGame />
                </ProtectedRoute>
              }
            />
            <Route
              path="/focus"
              element={
                <ProtectedRoute>
                  <FocusTracker />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shadow"
              element={
                <ProtectedRoute>
                  <ShadowMatch />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wave"
              element={
                <ProtectedRoute>
                  <WaveSync />
                </ProtectedRoute>
              }
            />
            <Route
              path="/timeslip"
              element={
                <ProtectedRoute>
                  <TimeSlip />
                </ProtectedRoute>
              }
            />
            <Route
              path="/echo"
              element={
                <ProtectedRoute>
                  <EchoMemory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/quantumshift"
              element={
                <ProtectedRoute>
                  <QuantumShift />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mirrormind"
              element={
                <ProtectedRoute>
                  <MirrorMind />
                </ProtectedRoute>
              }
            />
            <Route
              path="/thoughtchain"
              element={
                <ProtectedRoute>
                  <ThoughtChain />
                </ProtectedRoute>
              }
            />

            {/* Progress pages */}
            <Route
              path="/progress-reaction"
              element={
                <ProtectedRoute>
                  <ProgressTracker type="reaction" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress-memory"
              element={
                <ProtectedRoute>
                  <ProgressTracker type="memory" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress-focus"
              element={
                <ProtectedRoute>
                  <ProgressTracker type="focus" />
                </ProtectedRoute>
              }
            />

            <Route
              path="/progress-shadow"
              element={
                <ProtectedRoute>
                  <ShadowProgress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress-wave"
              element={
                <ProtectedRoute>
                  <WaveProgress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress-timeslip"
              element={
                <ProtectedRoute>
                  <TimeSlipProgress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress-echo"
              element={
                <ProtectedRoute>
                  <EchoMemoryProgress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress-quantum"
              element={
                <ProtectedRoute>
                  <QuantumShiftProgress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress-mirrormind"
              element={
                <ProtectedRoute>
                  <MirrorMindProgress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/progress-thoughtchain"
              element={
                <ProtectedRoute>
                  <ThoughtChainProgress />
                </ProtectedRoute>
              }
            />

            {/* ---------- ADMIN ROUTES ---------- */}
            <Route path="/admin-login" element={<AdminLogin />} />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />


          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;

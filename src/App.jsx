import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import GameDashboard from "./pages/GameDashboard";
import ReactionGame from "./components/ReactionGame";
import MemoryGame from "./components/MemoryGame";
import ProgressTracker from "./components/ProgressTracker";
import FocusTracker from "./components/FocusTracker";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<GameDashboard />} />
            <Route path="/reaction" element={<ReactionGame />} />
            <Route path="/memory" element={<MemoryGame />} />
            <Route path="/focus" element={<FocusTracker />} />
            <Route path="/progress-reaction" element={<ProgressTracker type="reaction" />} />
            <Route path="/progress-memory" element={<ProgressTracker type="memory" />} />
            <Route path="/progress-focus" element={<ProgressTracker type="focus" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

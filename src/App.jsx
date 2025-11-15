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
import ShadowMatch from "./components/ShadowMatch";
import ShadowProgress from "./pages/ShadowProgress";
import WaveSync from "./components/WaveSync";
import WaveProgress from "./pages/WaveProgress";
import TimeSlipProgress from "./pages/TimeSlipProgress";
import TimeSlip from "./components/TimeSlip";
import EchoMemory from "./components/EchoMemory";
import EchoMemoryProgress from "./pages/EchoMemoryProgress";
import QuantumShift from "./components/QuantumShift";
import QuantumShiftProgress from "./pages/QuantumShiftProgress";

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
            <Route path="/shadow" element={<ShadowMatch />} />
            <Route path="/progress-shadow" element={<ShadowProgress />} /> 
            <Route path="/wave" element={<WaveSync />} />
            <Route path="/progress-wave" element={<WaveProgress />} /> 
            <Route path="/progress-timeslip" element={<TimeSlipProgress />} />
            <Route path="/timeslip" element={<TimeSlip />} />
            <Route path="/echo" element={<EchoMemory />} />
            <Route path="/progress-echo" element={<EchoMemoryProgress />} />
            <Route path="/quantumshift" element={<QuantumShift />} />
            <Route path="/progress-quantum" element={<QuantumShiftProgress />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

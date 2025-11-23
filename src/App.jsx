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
import MirrorMind from "./components/MirrorMind";
import MirrorMindProgress from "./pages/MirrorMindProgress";
import ThoughtChain from "./components/ThoughtChain";
import ThoughtChainProgress from "./pages/ThoughtChainProgress";
import GameCategories from "./pages/GameCategories";
import Leaderboard from "./pages/Leaderboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";





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
            <Route path="/mirrormind" element={<MirrorMind />} />
            <Route path="/progress-mirrormind" element={<MirrorMindProgress />} />
            <Route path="/thoughtchain" element={<ThoughtChain />} />
            <Route path="/progress-thoughtchain" element={<ThoughtChainProgress />} />
            <Route path="/categories" element={<GameCategories />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />





          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

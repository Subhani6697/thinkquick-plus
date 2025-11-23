import React from "react";

const About = () => {
  return (
    <div className="bg-gray-900 min-h-screen text-white px-10 py-12">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6 text-center">
        🧠 About ThinkQuick+
      </h1>

      <p className="text-gray-300 max-w-3xl mx-auto text-lg leading-relaxed mb-6">
        ThinkQuick+ is a collection of neuroscience-inspired brain training
        mini-games designed to improve reaction time, cognitive flexibility,
        focus, memory, and sensory processing. Each game is built with
        science-backed mechanics while still being fun and engaging.
      </p>

      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl text-blue-300 font-semibold mb-4">🎯 Our Goals</h2>
        <ul className="list-disc pl-6 text-gray-300 space-y-2">
          <li>Improve fast-thinking and decision making</li>
          <li>Enhance visual and auditory memory</li>
          <li>Train reflexes and attention control</li>
          <li>Introduce unique cognitive games not found anywhere</li>
        </ul>
      </div>
    </div>
  );
};

export default About;

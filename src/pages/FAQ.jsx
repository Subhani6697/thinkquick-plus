import React from "react";

const FAQ = () => {
  return (
    <div className="bg-gray-950 min-h-screen text-white p-8">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">❓ Frequently Asked Questions</h1>

      <div className="space-y-6 max-w-3xl">
        <div>
          <h2 className="text-xl font-semibold text-blue-300">What is ThinkQuick+?</h2>
          <p className="text-gray-300">A collection of brain-training mini-games designed to boost focus, speed, memory, and decision-making skills.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-blue-300">Is it free?</h2>
          <p className="text-gray-300">Yes, all games are free to play. Premium features may come later.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-blue-300">How is progress saved?</h2>
          <p className="text-gray-300">Your device stores your game history locally using browser storage.</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-blue-300">Can I play on my phone?</h2>
          <p className="text-gray-300">Yes! ThinkQuick+ is fully mobile-responsive.</p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

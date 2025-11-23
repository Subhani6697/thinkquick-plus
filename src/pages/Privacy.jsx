import React from "react";

const Privacy = () => {
  return (
    <div className="bg-gray-950 min-h-screen text-white p-8">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">🔒 Privacy Policy</h1>

      <div className="space-y-6 max-w-3xl text-gray-300">
        <p>ThinkQuick+ respects your privacy. We do not collect personal data unless you voluntarily submit it.</p>

        <h2 className="text-xl text-blue-300 font-semibold">Data Storage</h2>
        <p>Game progress and scores are stored locally on your device using browser localStorage.</p>

        <h2 className="text-xl text-blue-300 font-semibold">No Third-Party Sharing</h2>
        <p>We never share, sell, or transfer data to third parties.</p>

        <h2 className="text-xl text-blue-300 font-semibold">Cookies</h2>
        <p>We do not use cookies for tracking or advertising.</p>

        <h2 className="text-xl text-blue-300 font-semibold">Contact</h2>
        <p>If you have privacy concerns, contact support at: thinkquickplus.help@gmail.com</p>
      </div>
    </div>
  );
};

export default Privacy;

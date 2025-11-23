import React from "react";

const Terms = () => {
  return (
    <div className="bg-gray-950 min-h-screen text-white p-8">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">📜 Terms & Conditions</h1>

      <div className="space-y-6 max-w-3xl text-gray-300">
        <p>By using ThinkQuick+, you agree to the following terms:</p>

        <h2 className="text-xl text-blue-300 font-semibold">1. Personal Use</h2>
        <p>You may play all games for personal, non-commercial use.</p>

        <h2 className="text-xl text-blue-300 font-semibold">2. No Liability</h2>
        <p>We are not responsible for any data loss or incorrect scores due to browser issues.</p>

        <h2 className="text-xl text-blue-300 font-semibold">3. Updates</h2>
        <p>We may update or modify games at any time without notice.</p>

        <h2 className="text-xl text-blue-300 font-semibold">4. Prohibited Use</h2>
        <p>You agree not to misuse the platform, exploit game logic.</p>
      </div>
    </div>
  );
};

export default Terms;

import React from "react";

/**
 * Drop target tile that shows the silhouette (black icon) when hidden.
 * Props:
 * - expectedId: id assigned to this tile (to check match)
 * - Icon: React component
 * - isRevealed: boolean whether the actual icon is visible (during reveal)
 * - onDrop: (droppedId) handler when drop happens
 * - correct: boolean (if matched correct)
 */
const ShadowTile = ({ expectedId, Icon, isRevealed, onDrop, correct }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedId = e.dataTransfer.getData("text/plain");
    onDrop && onDrop(droppedId);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`w-20 h-20 rounded-lg flex items-center justify-center border-2 ${
        correct ? "border-green-400 bg-green-200/30" : "border-gray-700 bg-gray-800"
      }`}
    >
      {isRevealed ? (
        // real colored icon during reveal
        <Icon size={28} className="text-yellow-400" />
      ) : (
        // silhouette / shadow
        <Icon size={28} className="text-black" style={{ filter: "brightness(0)" }} />
      )}
    </div>
  );
};

export default ShadowTile;

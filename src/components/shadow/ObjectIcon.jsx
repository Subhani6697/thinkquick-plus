import React from "react";

/**
 * Draggable icon shown in the tray.
 * Props:
 * - id: unique id (string/number)
 * - Icon: React component from react-icons
 */
const ObjectIcon = ({ id, Icon }) => {
  const onDragStart = (e) => {
    e.dataTransfer.setData("text/plain", String(id));
    // for firefox
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="w-14 h-14 flex items-center justify-center bg-white/90 rounded-lg shadow cursor-grab"
      title={`Item ${id}`}
    >
      <Icon size={22} className="text-indigo-700" />
    </div>
  );
};

export default ObjectIcon;

import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-4 mt-10 text-center text-sm">
      <p>
        © {new Date().getFullYear()} <span className="text-yellow-400 font-semibold">ThinkQuick+</span>. 
        All Rights Reserved.
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Built with ❤️ using React + TailwindCSS
      </p>
    </footer>
  );
};

export default Footer;

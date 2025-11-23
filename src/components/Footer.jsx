import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 mt-10 text-center text-sm">

      <p>
        © {new Date().getFullYear()}{" "}
        <span className="text-yellow-400 font-semibold">ThinkQuick+</span>.
        All Rights Reserved.
      </p>

      {/* Footer Navigation Links */}
      <div className="flex justify-center gap-6 mt-3 text-xs">
        <Link to="/faq" className="hover:text-yellow-300 transition">
          FAQ
        </Link>

        <Link to="/privacy" className="hover:text-yellow-300 transition">
          Privacy Policy
        </Link>

        <Link to="/terms" className="hover:text-yellow-300 transition">
          Terms & Conditions
        </Link>
      </div>

      <p className="text-xs text-gray-500 mt-2">❤️ Built with passion to train your mind.</p>
    </footer>
  );
};

export default Footer;

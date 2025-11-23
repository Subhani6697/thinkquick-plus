import React, { useState } from "react";

const Contact = () => {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white px-10 py-12">
      <h1 className="text-4xl font-bold text-yellow-400 text-center mb-8">
        📬 Contact Us
      </h1>

      <div className="max-w-xl mx-auto bg-gray-800 p-8 rounded-xl shadow-lg">
        {sent ? (
          <p className="text-green-400 text-center text-xl">
            ✔ Message sent! We'll get back to you soon.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Your Name"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white"
            />
            <input
              type="email"
              placeholder="Your Email"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white"
            />
            <textarea
              placeholder="Your Message"
              required
              className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white h-32"
            />

            <button className="w-full py-3 bg-blue-500 hover:bg-blue-400 rounded-lg text-black font-bold">
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;

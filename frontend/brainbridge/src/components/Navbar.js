import React from "react";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <nav>
      <div className="flex items-center gap-5 align-middle justify-center p-4 border-b-2 border-gray-200 font-sans">
        <div className="text-2xl font-bold">BrainBridge</div>
        <div className="flex space-x-4 mr-auto">
          <a href="/" className="text-gray-700 hover:text-blue-500">
            Features
          </a>
          <a href="/about" className="text-gray-700 hover:text-blue-500">
            How it works
          </a>
          <a href="/contact" className="text-gray-700 hover:text-blue-500">
            Testimonials
          </a>
        </div>
        <div className="ml-auto flex space-x-4">
          <button
            className="text-[#634AFF] bg-white rounded-[1.5rem] p-4 hover:scale-105 hover:bg-opacity-90 transition-all duration-300 ease-in-out"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="bg-[#634AFF] text-white rounded-[1.5rem] p-4 hover:scale-105 hover:bg-opacity-90 transition-all duration-300 ease-in-out"
            onClick={() => navigate("/signup")}
          >
            Signup
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

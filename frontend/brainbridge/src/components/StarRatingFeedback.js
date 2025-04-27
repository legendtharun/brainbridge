// src/components/StarRatingFeedback.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import serverConfig from "../server.config"; // Adjust the import path as necessary
const StarRatingFeedback = ({ onSubmitFeedback, mentorEmail }) => {
  console.log("Mentor Email:", mentorEmail); // Log mentorEmail to console
  const [rating, setRating] = useState(0); // 0 = no rating selected
  const [hover, setHover] = useState(0); // For hover effect
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Dynamic classes for stars based on hover and rating state
  const getStarClasses = (starIndex) => {
    const isFilled = starIndex <= (hover || rating);
    return `
      star
      bg-transparent border-0 p-0
      text-3xl // Slightly smaller stars, adjust if needed (e.g., text-2xl, text-4xl)
      cursor-pointer
      transition-all duration-200 ease-in-out
      transform
      ${isFilled ? "text-yellow-400" : "text-gray-300"}
      hover:scale-110
    `;
  };

  if (submitted) {
    return (
      // Removed max-w-md, mx-auto, my-5. Adjusted padding. Added h-full.
      <div className="font-sans bg-white p-4 rounded-lg shadow-lg text-center text-gray-800 transition-all duration-200 ease-in-out h-full flex flex-col justify-center">
        <h2 className="mb-4 font-semibold text-green-600 text-xl">
          {" "}
          {/* Adjusted size */}
          Thank You!
        </h2>
        <p className="text-base text-gray-800">
          {" "}
          {/* Adjusted size */}
          Your feedback has been received.
        </p>
      </div>
    );
  }
  const postFeedback = async (e) => {
    e.preventDefault();
    console.log("Submitting feedback:", mentorEmail, rating, message);
    axios
      .put(`${serverConfig.serverAddress}${serverConfig.Users}/feedback/`, {
        email: mentorEmail,
        feedback: {
          rating,
          message,
        },
      })
      .then((response) => {
        console.log("Feedback response:", response.data);
        if (response.status === 200) {
          alert("Feedback submitted successfully:", response.data.message);
        } else {
          alert("Error submitting feedback.");
        }
      })
      .catch((error) => {
        console.error("Error submitting feedback:", error);
        alert("Error submitting feedback.");
      });
  };
  return (
    // Removed max-w-md, mx-auto, my-5. Adjusted padding. Added h-full and flex structure.
    <div className="font-sans bg-white p-4 rounded-lg  text-center text-gray-800 transition-all duration-200 ease-in-out h-full flex flex-col">
      <h2 className="mb-4 font-semibold text-blue-600 text-xl">
        {" "}
        {/* Adjusted size */}
        Rate Your Mentor
      </h2>

      {/* Stars Container */}
      <div className="mb-3 flex justify-center gap-1">
        {" "}
        {/* Reduced gap */}
        {[1, 2, 3, 4, 5].map((starIndex) => (
          <button
            type="button"
            key={starIndex}
            className={getStarClasses(starIndex)} // Apply dynamic classes
            onClick={() => setRating(starIndex)}
            onMouseEnter={() => setHover(starIndex)}
            onMouseLeave={() => setHover(0)}
            aria-label={`Rate ${starIndex} out of 5 stars`}
          >
            ★
          </button>
        ))}
      </div>

      {/* Rating Text */}
      <p className="text-xs text-gray-600 mb-4 min-h-[1.1em]">
        {" "}
        {/* Adjusted size/margin */}
        {rating > 0 ? `You selected ${rating} out of 5 stars.` : ""}
        {/* Placeholder to prevent layout shift when no rating is selected */}
        {rating === 0 && <span className="invisible">Placeholder</span>}
      </p>

      {/* Message Textarea */}
      <textarea
        className="
          w-full box-border mt-1 mb-3 px-3 py-2 // Adjusted spacing/padding
          border border-gray-300 rounded-lg
          font-sans text-sm resize-y min-h-[60px] // Adjusted size/height
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-300
          flex-grow // Allow textarea to expand vertically if space allows
        "
        placeholder="Tell us more (optional)..." // Shorter placeholder
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows="3" // Adjusted default rows
      />

      {/* Submit Button */}
      <div className="flex justify-center items-end flex-grow">
        {" "}
        {/* Flex container to push button to the bottom */}{" "}
        {/* Pushes button to the bottom in the flex container */}
        <button
          className="
          w-auto box-border
          bg-blue-600 text-white
          border-0 px-4 py-2 rounded-lg // Adjusted padding
          text-sm font-medium // Adjusted size
          cursor-pointer
          transition-all duration-200 ease-in-out
          hover:bg-blue-700 hover:shadow-md
          disabled:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-70
          mt-auto // Pushes button to the bottom in the flex container
        "
          onClick={(event) => postFeedback(event)}
          disabled={rating === 0}
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default StarRatingFeedback;

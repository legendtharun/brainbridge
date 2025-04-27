import React from "react";
import DashNav from "../components/DashNav";

// Define the main App component for rendering
const ErrorPage = () => {
  return (
    <>
      <DashNav />

      <div className="flex flex-col h-screen bg-gray-100">
        {/* Main content area, takes remaining vertical space, centered horizontally and vertically */}
        <main className="flex-grow flex items-center justify-center p-4">
          {/* Container for the loading message and card */}
          <div className="flex flex-col items-center">
            {/* Loading card container */}
            <div className="bg-purple-100 p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
              {/* Spinner/Activity Indicator - using a simple div with animation */}
              {/* You might replace this with an actual hourglass icon or a more complex spinner animation */}
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent border-solid rounded-full animate-spin"></div>
              </div>

              {/* Main loading text */}
              <p className="text-gray-700 text-lg font-medium mb-2">
                We are still working on it. Please come back later.
              </p>

              {/* Smaller explanatory text */}
              <p className="text-gray-600 text-sm">
                We're preparing your experience. This will take long.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
export default ErrorPage;

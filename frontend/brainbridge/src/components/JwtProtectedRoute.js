import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isTokenValid } from "../utils/isJWTokenValid";
const JwtProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null); // Track token validity
  const token = localStorage.getItem("token"); // Get the token from localStorage

  useEffect(() => {
    // Check if the token is valid when the component mounts
    const chectToken = async () => {
      if (token) {
        const valid = await isTokenValid(token);
        setIsValid(valid); // Set the validity state
      } else {
        setIsValid(false); // No token found, invalid
      }
    };
    chectToken();
  }, [token]); // Re-run when token changes

  if (isValid === null) {
    // Still checking token validity
    return <div>Loading...</div>; // Optionally, show a loading state while checking
  }

  if (!isValid) {
    // If token is not valid, redirect to login page
    return <Navigate to="/login" />;
  }

  // If token is valid, render the protected content (children)
  return children;
};

export default JwtProtectedRoute;

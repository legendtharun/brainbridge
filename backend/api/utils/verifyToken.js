import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  // Get token from headers (typically sent in the 'Authorization' header)
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access token missing or malformed" });
  }

  const token = authHeader.split(" ")[1]; // Extract token part after 'Bearer '

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded payload to the request object (for use in next routes)
    req.user = decoded;

    // Move to the next middleware or route handler
    next();
  } catch (err) {
    console.error("JWT VERIFICATION FAILED:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
export default verifyToken;

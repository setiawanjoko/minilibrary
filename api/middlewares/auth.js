import jwt from "jsonwebtoken";

/**
 * Middleware to authenticate requests using an access token
 */
export const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the access token
    req.user = decoded; // Attach decoded token data to the request
    next();
  } catch (err) {
    console.error("Invalid access token:", err);
    return res.status(403).json({ error: "Invalid or expired access token" });
  }
};

import jwt from "jsonwebtoken";
import { errorResponse } from "../../utils/responseHandler.js";
import { logger } from "../../utils/helpers.js";

/**
 * Middleware to authenticate requests using an access token
 */
export const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    errorResponse(res, "Authorization header is missing or invalid", 401); // Handle missing or invalid authorization header
  }

  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the access token
    req.user = decoded; // Attach decoded token data to the request
    next();
  } catch (err) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true}); // Verify the refresh token
    res.req.user = decoded; // Attach decoded token data to the request

    logger({
      action: "Token verification failed",
      endpoint: req.originalUrl,
      method: req.method,
      record_id: null,
      user_id: res.req.user.id,
      human_readable_note: `Token verification failed for user ${res.req.user.name} in ${req.originalUrl} with ${req.method} method`,
      timestamp: new Date(),
    });

    errorResponse(res, err.message, 403); // Handle token verification errors
  }
};

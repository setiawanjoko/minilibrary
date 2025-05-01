import { errorResponse } from "./responseHandler.js";

/**
 * Handles database-related errors and sends appropriate error responses.
 * @param {Object} error - The error object from the database.
 * @param {Object} res - The response object.
 */
export const handleDatabaseError = (error, res) => {
  if (error.code === "23505") {
    return errorResponse(res, "Duplicate entry detected. Please use unique values.", 400);
  } else if (error.code === "23503") {
    return errorResponse(res, "Invalid foreign key reference. Ensure related data exists.", 400);
  } else if (error.message === "No fields provided for update") {
    return errorResponse(res, "No fields provided for update. Please include valid fields.", 400);
  }

  console.error(error); // Log the error for debugging
  return errorResponse(res, "An unexpected error occurred. Please try again later.", 500);
};

/**
 * Handles authentication and authorization errors.
 * @param {Object} res - The response object.
 * @param {string} message - A descriptive error message.
 * @param {number} statusCode - The HTTP status code (default: 401).
 */
export const handleAuthError = (res, message = "Unauthorized access", statusCode = 401) => {
  return errorResponse(res, message, statusCode);
};
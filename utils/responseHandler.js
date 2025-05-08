import pool from "../db.js";

/**
 * Sends a success response with a unified structure.
 * @param {Object} res - The response object.
 * @param {Object} data - The data to send in the response.
 * @param {string} message - A descriptive success message.
 * @param {number} statusCode - The HTTP status code (default: 200).
 */
export const successResponse = (res, data = null, message = "Success", statusCode = 200) => {
  const response = {
    status: "success",
    message
  };

  if (data !== null) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};

/**
 * Sends an error response with a unified structure.
 * @param {Object} res - The response object.
 * @param {Object} error - The error object or message.
 * @param {number} statusCode - The HTTP status code (default: 400).
 */
export const errorResponse = (res, error, statusCode = 400) => {
  const errorMessage = typeof error === "string" ? error : error.message || "An error occurred";
  statusCode = error.statusCode || statusCode; // Use error's status if available

  res.status(statusCode).json({
    status: error.action || "error",
    message: errorMessage
  });
};
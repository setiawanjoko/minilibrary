/**
 * Sends a success response with a unified structure.
 * @param {Object} res - The response object.
 * @param {Object} data - The data to send in the response.
 * @param {string} message - A descriptive success message.
 * @param {number} statusCode - The HTTP status code (default: 200).
 */
export const successResponse = (res, data, message = "Success", statusCode = 200) => {
  res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

/**
 * Sends an error response with a unified structure.
 * @param {Object} res - The response object.
 * @param {Object} error - The error object or message.
 * @param {number} statusCode - The HTTP status code (default: 400).
 */
export const errorResponse = (res, error, statusCode = 400) => {
  const errorMessage = typeof error === "string" ? error : error.message || "An error occurred";
  res.status(statusCode).json({
    status: "error",
    message: errorMessage,
    error: statusCode === 500 ? "Internal Server Error" : errorMessage, // Avoid exposing internal errors
  });
};
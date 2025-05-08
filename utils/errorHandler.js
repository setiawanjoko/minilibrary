import { errorResponse } from "./responseHandler.js";
import { logger } from "./helpers.js";

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

class CustomError extends Error {
  constructor(message, statusCode, req = null) {
    super(message);
    this.statusCode = statusCode;

    if (req) {
      this.endpoint = req.originalUrl || req.url;
      this.method = req.method;
      this.userId = req.user ? req.user.userId : null; // Assuming user ID is available in req.user
    }
  }
}

class ValidationError extends CustomError {
  constructor(message, req) {
    super(message, 400, req);

    const action = req.action || "Validation Error";

    logger({
      action: action,
      endpoint: this.endpoint,
      method: this.method,
      record_id: null,
      user_id: this.userId,
      human_readable_note: message,
      timestamp: new Date(),
    });
  }
}

class BadRequestError extends CustomError {
  constructor(message, req) {
    super(message, 400, req);

    const action = req.action || "Bad Request";

    logger({
      action: action,
      endpoint: this.endpoint,
      method: this.method,
      record_id: null,
      user_id: this.userId,
      human_readable_note: message,
      timestamp: new Date(),
    });
  }
}

class UnauthorizedError extends CustomError {
  constructor(message, req) {
    super(message, 401, req);

    const action = req.action || "Unauthorized Access";

    logger({
      action: action,
      endpoint: this.endpoint,
      method: this.method,
      record_id: null,
      user_id: this.userId,
      human_readable_note: message,
      timestamp: new Date(),
    });
  }
}

class ForbiddenError extends CustomError {
  constructor(message, req) {
    super(message, 403, req);

    const action = req.action || "Forbidden Access";

    logger({
      action: action,
      endpoint: this.endpoint,
      method: this.method,
      record_id: null,
      user_id: this.userId,
      human_readable_note: message,
      timestamp: new Date(),
    });
  }
}

class NotFoundError extends CustomError {
  constructor(message, req) {
    super(message, 404, req);

    const action = req.action || "Not Found";

    logger({
      action: action,
      endpoint: this.endpoint,
      method: this.method,
      record_id: null,
      user_id: this.userId,
      human_readable_note: message,
      timestamp: new Date(),
    });
  }
}

class ConflictError extends CustomError {
  constructor(message, req) {
    super(message, 409, req);

    const action = req.action || "Conflict Error";

    logger({
      action: action,
      endpoint: this.endpoint,
      method: this.method,
      record_id: null,
      user_id: this.userId,
      human_readable_note: message,
      timestamp: new Date(),
    });
  }
}


class InternalServerError extends CustomError {
  constructor(message, req) {
    super(message, 500), req;

    const action = req.action || "Internal Server Error";

    logger({
      action: action,
      endpoint: this.endpoint,
      method: this.method,
      record_id: null,
      user_id: this.userId,
      human_readable_note: message,
      timestamp: new Date(),
    });
  }
}
class ServiceUnavailableError extends CustomError {
  constructor(message, req) {
    super(message, 503, req);

    const action = req.action || "Service Unavailable";

    logger({
      action: action,
      endpoint: this.endpoint,
      method: this.method,
      record_id: null,
      user_id: this.userId,
      human_readable_note: message,
      timestamp: new Date(),
    });
  }
}

class GatewayTimeoutError extends CustomError {
  constructor(message, req) {
    super(message, 504, req);

    const action = req.action || "Gateway Timeout";

    logger({
      action: action,
      endpoint: this.endpoint,
      method: this.method,
      record_id: null,
      user_id: this.userId,
      human_readable_note: message,
      timestamp: new Date(),
    });
  }
}

export {
  CustomError,
  ValidationError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
  ServiceUnavailableError,
  GatewayTimeoutError
};
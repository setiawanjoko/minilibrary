import pool from "../../../db";
import {
  successResponse,
  errorResponse,
} from "../../../utils/responseHandler.js";

const STATUSES = {
  READING: "reading",
  COMPLETED: "completed",
  DROPPED: "dropped",
  READ_LATER: "read later",
};

const validateStatus = (status) => {
  const validStatuses = Object.keys(STATUSES).map((key) => key.toLowerCase());
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid status provided.");
  }
  return STATUSES[status.toUpperCase()];
};

const getUserId = (req) => {
  if (!req.user || !req.user.id) {
    throw new Error("User not authenticated.");
  }
  return req.user.id;
};

const getListsByUserId = async (userId, limit = 10, offset = 0) => {
  return pool.query(
    "SELECT * FROM lists LEFT JOIN books ON lists.books_id = books.id WHERE user_id = $1 LIMIT $2 OFFSET $3",
    [userId, limit, offset]
  );
};

const getListByIdAndUserId = async (id, userId) => {
  return pool.query("SELECT * FROM lists WHERE id = $1 AND user_id = $2", [
    id,
    userId,
  ]);
};

const getLists = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { limit = 10, offset = 0 } = req.query;

    const result = await getListsByUserId(userId, limit, offset);

    if (result.rowCount === 0) {
      return errorResponse(res, "No lists found for this user.", 404);
    }
    successResponse(res, result.rows, "Lists retrieved successfully");
  } catch (err) {
    errorResponse(res, err, 500);
  }
};

const getListByStatus = async (req, res) => {
  try {
    const userId = getUserId(req); // Assuming you have user authentication middleware that sets req.user
    let { status } = req.params; // Get the status from the request parameters

    status = validateStatus(status);

    const result = await pool.query(
      "SELECT * FROM lists LEFT JOIN books ON lists.books_id = books.id WHERE user_id = $1 AND status = $2",
      [userId, status]
    );
    if (result.rowCount === 0) {
      return errorResponse(res, "No lists found for this user.", 404);
    }
    successResponse(res, result.rows, "Lists retrieved successfully");
  } catch (err) {
    errorResponse(res, err, 500);
  }
};

const addList = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { book_id, status } = req.body;

    if (!book_id || !status) {
      return errorResponse(res, "Book ID and status are required.", 400);
    }

    const validStatus = validateStatus(status);

    const existingList = await pool.query(
      "SELECT * FROM lists WHERE books_id = $1 AND user_id = $2",
      [book_id, userId]
    );

    if (existingList.rowCount > 0) {
      const existingItem = existingList.rows[0];
      if (existingItem.deleted_at) {
        await pool.query("UPDATE lists SET deleted_at = NULL WHERE id = $1", [
          existingItem.id,
        ]);
        return successResponse(res, existingItem, "List restored successfully");
      }
      return errorResponse(res, "Book already exists in the list.", 400);
    }

    const result = await pool.query(
      "INSERT INTO lists (books_id, user_id, status) VALUES ($1, $2, $3) RETURNING *",
      [book_id, userId, validStatus]
    );
    successResponse(res, result.rows[0], "List added successfully");
  } catch (err) {
    errorResponse(res, err, 500);
  }
};

const updateList = async (req, res) => {
  try {
    const userId = getUserId(req); // Assuming you have user authentication middleware that sets req.user
    const { id } = req.params; // Get the list ID from the request parameters
    const { status } = req.body; // Get the status from the request body

    if (!status) {
      return errorResponse(res, "Status is required.", 400);
    }

    const validStatus = validateStatus(status);

    const result = await pool.query(
      "UPDATE lists SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [validStatus, id, userId]
    );
    if (result.rowCount === 0) {
      return errorResponse(
        res,
        "List not found or you do not have permission to update this list.",
        404
      );
    }
    successResponse(res, result.rows[0], "List updated successfully");
  } catch (err) {
    errorResponse(res, err, 500);
  }
};

const deleteList = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { id } = req.params;

    const existingList = await getListByIdAndUserId(id, userId);
    if (existingList.rowCount === 0) {
      return errorResponse(
        res,
        "List not found or you do not have permission to delete this list.",
        404
      );
    }

    const list = existingList.rows[0];
    if (list.deleted_at) {
      return errorResponse(res, "List is already deleted.", 400);
    }

    const result = await pool.query(
      "UPDATE lists SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );
    successResponse(res, result.rows[0], "List deleted successfully");
  } catch (err) {
    errorResponse(res, err, 500);
  }
};

export { getLists, getListByStatus, addList, updateList, deleteList };

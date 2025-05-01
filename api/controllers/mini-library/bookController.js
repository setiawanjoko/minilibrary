import pool from "../../../db.js";
import { successResponse, errorResponse } from "../../../utils/responseHandler.js";

// BOOKS

export const getBooks = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books");
    successResponse(res, result.rows, "Books retrieved successfully");
  } catch (err) {
    errorResponse(res, err, 500);
  }
};

export const getBooksById = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return errorResponse(res, { message: "Book not found" }, 404);
    }
    successResponse(res, result.rows[0], "Book retrieved successfully");
  } catch (err) {
    errorResponse(res, err, 500);
  }
};

export const addBook = async (req, res) => {
  try {
    const { title, author } = req.body;
    const result = await pool.query(
      "INSERT INTO books (title, author) VALUES ($1, $2) RETURNING *",
      [title, author]
    );
    successResponse(res, result.rows[0], "Book added successfully", 201);
  } catch (err) {
    errorResponse(res, err, 500);
  }
};

export const editBook = async (req, res) => {
  try {
    const { title, author, available } = req.body;
    const result = await pool.query(
      "UPDATE books SET title = $1, author = $2, available = $3 WHERE id = $4 RETURNING *",
      [title, author, available, req.params.id]
    );
    if (result.rows.length === 0) {
      return errorResponse(res, { message: "Book not found" }, 404);
    }
    successResponse(res, result.rows[0], "Book updated successfully");
  } catch (err) {
    errorResponse(res, err, 500);
  }
};

export const deleteBook = async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM books WHERE id = $1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) {
      return errorResponse(res, { message: "Book not found" }, 404);
    }
    successResponse(res, null, "Book deleted successfully");
  } catch (err) {
    errorResponse(res, err, 500);
  }
};

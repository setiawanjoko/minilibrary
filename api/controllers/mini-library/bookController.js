import pool from "../../../db.js";
import { successResponse, errorResponse } from "../../../utils/responseHandler.js";
import { logger } from "../../../utils/helpers.js";
import { BadRequestError, ConflictError, ForbiddenError, InternalServerError, NotFoundError } from "../../../utils/errorHandler.js";


// BOOKS
export const getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const query = "SELECT books.id, isbn, title, author, publisher, published_date, genre, language, description, cover_image, users.name as uploaded_by FROM books LEFT JOIN users ON uploaded_by = users.id LIMIT $1 OFFSET $2";
    const values = [limit, offset];

    const result = await pool.query(query, values);
    const totalBooks = await pool.query("SELECT COUNT(*) FROM books");

    successResponse(res, {
      books: result.rows,
      total: parseInt(totalBooks.rows[0].count, 10),
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    }, "Books retrieved successfully");
  } catch (err) {
    errorResponse(res, 
      new InternalServerError(`Error retrieving books: ${err.message}`, req));
  }
};

export const getBooksById = async (req, res) => {
  try {
    const query = "SELECT books.id, isbn, title, author, publisher, published_date, genre, language, description, cover_image, users.name as uploaded_by FROM books LEFT JOIN users ON uploaded_by = users.id WHERE books.id = $1";
    const values = [req.params.id];

    if (isNaN(req.params.id) || req.params.id <= 0) {
      throw new BadRequestError(`Invalid book with ID ${req.params.id}`, req);
    }

    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      throw new NotFoundError(`Book with ID ${req.params.id} not found`, req);
    }

    logger({
      action: "get",
      endpoint: "books",
      method: "GET",
      record_id: result.rows[0].id,
      user_id: req.user.userId,
      human_readable_note: `Book ${result.rows[0].title} retrieved by ${req.user.name}`,
      timestamp: new Date()
    });

    successResponse(res, result.rows[0], "Book retrieved successfully");
  } catch (err) {
    errorResponse(res, err, 500);
  }
};

export const addBook = async (req, res) => {
  try {
    const { isbn, title, author, publisher, published_date, genre, language, description } = req.body;
    const bookExists = await pool.query("SELECT * FROM books WHERE isbn = $1", [isbn]);
    if (bookExists.rows.length > 0) {
      throw new BadRequestError(`Book with this ISBN ${isbn} already exists`, req);
    }
    const cover_image = JSON.stringify({
      small: `https://covers.openlibrary.org/b/isbn/${isbn}-S.jpg`,
      medium: `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`,
      large: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
    });
    const userName = req.user.name || "Unknown User"; // Assuming req.user.name is available
    const userId = req.user.userId || null; // Assuming req.user.userId is available
    const query = "INSERT INTO books (isbn, title, author, publisher, published_date, genre, language, description, cover_image, uploaded_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, title, author";
    const values = [isbn, title, author, publisher, published_date, genre, language, description, cover_image, userId];
    const result = await pool.query(query, values);
    if (result.rows.length === 0) {
      throw new ConflictError(`Failed to add book ${title} with ISBN ${isbn}`, req);
    }
    // Log the addition of the book
    logger({
      action: "add",
      endpoint: "books",
      method: "POST",
      record_id: result.rows[0].id,
      user_id: userId,
      human_readable_note: `Book ${result.rows[0].title} added by ${userName}`,
      timestamp: new Date(),
    });
    // Send success response
    successResponse(res, result.rows[0], "Book added successfully", 201);
  } catch (err) {
    errorResponse(res, err, 500);
  }
};

export const editBook = async (req, res) => {
  try {
    const { isbn, title, author, publisher, published_date, genre, language, description } = req.body;
    const userId = req.user.userId || null; // Assuming req.user.userId is available
    const bookId = req.params.id;

    // Check if at least one field is provided
    if (!isbn && !title && !author && !publisher && !published_date && !genre && !language && !description) {
      throw new BadRequestError("At least one field must be provided to update the book", req);
    }

    // Check if the book exists
    const bookExists = await pool.query("SELECT * FROM books WHERE id = $1", [bookId]);
    if (bookExists.rows.length === 0) {
      throw new NotFoundError(`Book with ID ${bookId} not found`, req);
    }

    // Check if the user is allowed to update the book
    if (userId !== bookExists.rows[0].uploaded_by) {
      throw new ForbiddenError(`User ${req.user.name} is not the book uploader`, req);
    }

    // Check if the new ISBN already exists for another book
    if (isbn && isbn !== bookExists.rows[0].isbn) {
      const isbnExists = await pool.query("SELECT * FROM books WHERE isbn = $1", [isbn]);
      if (isbnExists.rows.length > 0) {
        throw new ConflictError(`Book with this ISBN ${isbn} already exists`, req);
      }
    }

    // Build dynamic query for optional fields
    const fields = [];
    const values = [];
    let index = 1;

    if (isbn) {
      fields.push(`isbn = $${index++}`);
      values.push(isbn);

      const cover_image = JSON.stringify({
        small: `https://covers.openlibrary.org/b/isbn/${isbn}-S.jpg`,
        medium: `https://covers.openlibrary.org/b/isbn/${isbn}-M.jpg`,
        large: `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`,
      });
      fields.push(`cover_image = $${index++}`);
      values.push(cover_image);
    }
    if (title) {
      fields.push(`title = $${index++}`);
      values.push(title);
    }
    if (author) {
      fields.push(`author = $${index++}`);
      values.push(author);
    }
    if (publisher) {
      fields.push(`publisher = $${index++}`);
      values.push(publisher);
    }
    if (published_date) {
      fields.push(`published_date = $${index++}`);
      values.push(published_date);
    }
    if (genre) {
      fields.push(`genre = $${index++}`);
      values.push(genre);
    }
    if (language) {
      fields.push(`language = $${index++}`);
      values.push(language);
    }
    if (description) {
      fields.push(`description = $${index++}`);
      values.push(description);
    }

    // Add the book ID to the query
    values.push(req.params.id);

    // Execute the query
    const query = `UPDATE books SET ${fields.join(", ")} WHERE id = $${index} RETURNING id, title, author`;
    const result = await pool.query(query, values);

    // Log the update action
    logger({
      action: "update",
      endpoint: "books",
      method: "PUT",
      record_id: result.rows[0].id,
      user_id: req.user.userId,
      human_readable_note: `Book ${result.rows[0].title} updated by ${req.user.name}`,
      timestamp: new Date(),
    });

    // Send success response
    successResponse(res, result.rows[0], "Book updated successfully");
  } catch (err) {
    errorResponse(res, err, 500);
  }
};

export const deleteBook = async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM books WHERE id = $1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) {
      throw new NotFoundError(`Book with ID ${req.params.id} not found`, req);
    }

    logger({
      action: "delete",
      endpoint: "books",
      method: "DELETE",
      record_id: result.rows[0].id,
      user_id: req.user.userId,
      human_readable_note: `Book ${result.rows[0].title} deleted by ${req.user.name}`,
      timestamp: new Date(),
    });

    successResponse(res, null, "Book deleted successfully");
  } catch (err) {
    errorResponse(res, err, 500);
  }
};

import pool from '../../../db.js';
import { successResponse, errorResponse } from '../../../utils/responseHandler.js';

// GET /borrowings
export const getBorrowings = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.id, u.name as user_name, bk.title as book_title, b.borrowed_at, b.returned_at
       FROM borrowings b
       JOIN users u ON b.user_id = u.id
       JOIN books bk ON b.book_id = bk.id
       ORDER BY b.borrowed_at DESC`
    );
    successResponse(res, result.rows, 'Borrowings retrieved successfully');
  } catch (err) {
    errorResponse(res, err, 500);
  }
};

// GET /borrowings/:id
export const getBorrowingById = async (req, res) => {
  const borrowing_id = req.params.id;

  try {
    const result = await pool.query(
      `SELECT b.id, u.name as user_name, bk.title as book_title, b.borrowed_at, b.returned_at
       FROM borrowings b
       JOIN users u ON b.user_id = u.id
       JOIN books bk ON b.book_id = bk.id
       WHERE b.id = $1`,
      [borrowing_id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: "Book borrowing information not found" });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve book borrowing' });
  }
};

// POST /borrowings
export const borrowBook = async (req, res) => {
  const { book_id } = req.body;
  const user_id = req.user.userId;

  try {
    // Validate: is the book available?
    const check = await pool.query('SELECT * FROM books WHERE id = $1', [book_id]);
    if (check.rows.length === 0) {
      return errorResponse(res, { message: 'Book not found' }, 404);
    }

    const book = check.rows[0];
    if (!book.available) {
      return errorResponse(res, { message: 'Book is currently borrowed' }, 400);
    }

    // Update book status
    await pool.query('UPDATE books SET available = false WHERE id = $1', [book_id]);

    // Add to borrowings table
    const result = await pool.query(
      'INSERT INTO borrowings (user_id, book_id, borrowed_at) VALUES ($1, $2, NOW()) RETURNING *',
      [user_id, book_id]
    );

    successResponse(res, result.rows[0], 'Book borrowed successfully', 201);
  } catch (err) {
    errorResponse(res, err, 500);
  }
};

// PUT /borrowings/:id/edit
export const editBookBorrowing = async (req, res) => {
  const borrowing_id = req.params.id;

  try {
    // Get borrowing data
    const result = await pool.query('SELECT * FROM borrowings WHERE id = $1', [borrowing_id]);
    if (result.rows.length === 0) {
      return errorResponse(res, { message: 'Borrowing record not found' }, 404);
    }

    const borrowing = result.rows[0];

    // Check if the book is already returned
    if (borrowing.returned_at) {
      return errorResponse(res, { message: 'Book has already been returned' }, 400);
    }

    // Update book availability
    await pool.query('UPDATE books SET available = true WHERE id = $1', [borrowing.book_id]);

    // Update borrowing record to set returned_at as now
    await pool.query('UPDATE borrowings SET returned_at = NOW() WHERE id = $1', [borrowing_id]);

    successResponse(res, null, 'Book borrowing updated successfully');
  } catch (err) {
    errorResponse(res, err, 500);
  }
};

// DELETE /borrowings/:id
export const deleteBorrowing = async (req, res) => {
  const borrowing_id = req.params.id;

  try {
    // Get borrowing data
    const result = await pool.query('SELECT * FROM borrowings WHERE id = $1', [borrowing_id]);
    if (result.rows.length === 0) {
      return errorResponse(res, { message: 'Borrowing record not found' }, 404);
    }

    const borrowing = result.rows[0];

    // Check if the book is already returned
    if (borrowing.returned_at) {
      return errorResponse(res, { message: 'Cannot delete a returned borrowing record' }, 400);
    }

    // Delete the borrowing record
    await pool.query('DELETE FROM borrowings WHERE id = $1', [borrowing_id]);

    successResponse(res, null, 'Borrowing record has been forcefully deleted');
  } catch (err) {
    errorResponse(res, err, 500);
  }
};
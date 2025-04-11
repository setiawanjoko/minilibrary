import pool from "../db.js";

// BOOKS

export const getBooks = async (req, res) => {
  const result = await pool.query("SELECT * FROM books");
  res.json(result.rows);
};

export const addBook = async (req, res) => {
  const error = validate(["title", "author"], req.body);
  if (error) return res.status(400).json({ error });

  const { title, author } = req.body;
  const result = await pool.query(
    "INSERT INTO books (title, author) VALUES ($1, $2) RETURNING *",
    [title, author]
  );
  res.status(201).json(result.rows[0]);
};

export const editBook = async (req, res) => {
  const { title, author, available } = req.body;
  const result = await pool.query(
    "UPDATE books SET title = $1, author = $2, available = $3 WHERE id = $4 RETURNING *",
    [title, author, available, req.params.id]
  );
  res.json(result.rows[0]);
};

export const deleteBook = async (req, res) => {
  await pool.query("DELETE FROM books WHERE id = $1", [req.params.id]);
  res.json({ message: "Book deleted" });
};

import pool from '../db.js';

// POST /borrowings
export const borrowBook = async (req, res) => {
  const { book_id } = req.body;
  const user_id = req.user.userId;

  try {
    // Validasi: apakah buku tersedia?
    const check = await pool.query('SELECT * FROM books WHERE id = $1', [book_id]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Buku tidak ditemukan' });

    const book = check.rows[0];
    if (!book.available) return res.status(400).json({ error: 'Buku sedang dipinjam' });

    // Update status buku
    await pool.query('UPDATE books SET available = false WHERE id = $1', [book_id]);

    // Tambahkan ke tabel borrowings
    const result = await pool.query(
      'INSERT INTO borrowings (user_id, book_id, borrowed_at) VALUES ($1, $2, NOW()) RETURNING *',
      [user_id, book_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Gagal meminjam buku' });
  }
};

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
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data peminjaman' });
  }
};

// PUT /borrowings/:id/return
export const returnBook = async (req, res) => {
  const borrowing_id = req.params.id;

  try {
    // Ambil data peminjaman
    const result = await pool.query('SELECT * FROM borrowings WHERE id = $1', [borrowing_id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Data peminjaman tidak ditemukan' });

    const borrowing = result.rows[0];

    if (borrowing.returned_at) return res.status(400).json({ error: 'Buku sudah dikembalikan' });

    // Update status buku
    await pool.query('UPDATE books SET available = true WHERE id = $1', [borrowing.book_id]);

    // Update data peminjaman
    await pool.query('UPDATE borrowings SET returned_at = NOW() WHERE id = $1', [borrowing_id]);

    res.json({ message: 'Buku berhasil dikembalikan' });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengembalikan buku' });
  }
};

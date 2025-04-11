import pool from "../db.js";

export const getUsers = async (req, res) => {
  const result = await pool.query("SELECT id, name, email FROM users");
  res.json(result.rows);
};

// USERS
export const getAllUsers = async (req, res) => {
  const result = await pool.query("SELECT id, name, email, permission FROM users");
  res.json(result.rows);
};

export const putUserById = async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
    [name, email, hash, req.params.id]
  );
  res.json(result.rows[0]);
};

export const deleteUserById = async (req, res) => {
  await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
  res.json({ message: "User deleted" });
};

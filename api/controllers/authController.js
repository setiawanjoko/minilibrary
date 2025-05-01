import pool from "../../db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/**
 * Helper function to generate an access token
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.permission },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" } // Short-lived access token
  );
};

/**
 * Helper function to generate a refresh token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" } // Long-lived refresh token
  );
};

/**
 * Register a new user
 */
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
// Hash the password
    const hash = await bcrypt.hash(password, 10);
    console.log("Hash:", hash);

// Insert the user into the database
    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id",
      [name, email, hash]
    );

    if(result.rowCount === 0) {
      return res.status(400).json({ error: "User registration failed" });
    }

    res.status(201).json({user_id: result.rows[0].id, message: "User registered" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "Registration failed due to server error" });
  }
};

/**
 * Login a user and generate access and refresh tokens
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await pool.query("UPDATE users SET refresh_token = $1, last_login_at = CURRENT_TIMESTAMP WHERE id = $2", [
      refreshToken,
      user.id,
    ]);

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Login failed due to server error" });
  }
};

/**
 * Logout a user by invalidating their JWT token
 */
export const logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ error: "Token is required for logout" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Invalidate the refresh token in the database
    await pool.query("UPDATE users SET refresh_token = NULL, last_logout_at = CURRENT_TIMESTAMP WHERE id = $1", [
      decoded.userId,
    ]);

    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Error during logout:", err);
    res.status(500).json({ error: "Logout failed due to server error" });
  }
};

/**
 * Refresh an access token using a valid refresh token
 */
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1 AND refresh_token = $2",
      [decoded.userId, refreshToken]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
    }

    const user = result.rows[0];

    // Generate a new access token
    const accessToken = generateAccessToken(user);

    res.status(200).json({
      message: "Access token refreshed",
      accessToken,
    });
  } catch (err) {
    console.error("Error during token refresh:", err);
    res.status(401).json({ error: "Invalid or expired refresh token" });
  }
};
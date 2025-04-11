import express from "express";
import pool from "./db.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
const swaggerDocument = YAML.load("./docs/openapi.yaml");
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userRoutes from './routes/users.js'
import bookRoutes from './routes/books.js'
import borrowingRoutes from './routes/borrowings.js'
import { registerValidator, loginValidator } from "./validators/userValidator.js";
import { apiOnly } from "./middleware/apiOnly.js";
import { validate } from "./middleware/validate.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use('/users', apiOnly, userRoutes)
app.use('/books', apiOnly, bookRoutes)
app.use('/borrowings', apiOnly, borrowingRoutes)

app.post("/register", apiOnly, registerValidator, validate, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
      [name, email, hash]
    );
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/login", apiOnly, loginValidator, validate, async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0)
      return res.status(401).json({ error: "Invalid email or password" });

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.permission },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Root
app.use("/",  swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `📚 Mini Library API running at http://localhost:${process.env.PORT}`
  );
});

import express from "express";
import usersRoutes from "./users.js";
import booksRoutes from "./books.js";
import borrowingRoutes from "./borrowings.js";

const router = express.Router();

router.use("/users", usersRoutes);
router.use("/books", booksRoutes);
router.use("/borrowings", borrowingRoutes);

export default router;
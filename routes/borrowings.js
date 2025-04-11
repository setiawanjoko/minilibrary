import express from "express";
import {
  borrowBook,
  returnBook,
  getBorrowings,
} from "../controllers/borrowingController.js";
import { authenticate } from "../middleware/auth.js";
import { borrowValidator } from "../validators/borrowingValidator.js";
import { validate } from "../middleware/validate.js"
import { isAdmin } from "../middleware/isAdmin.js"

const router = express.Router();
router.use(authenticate);
// BORROW
router.post("/", borrowValidator, validate, borrowBook);

// RETURN
router.post("/:id/return", isAdmin, returnBook);

// BORROWINGS
router.get("/", getBorrowings);

export default router;

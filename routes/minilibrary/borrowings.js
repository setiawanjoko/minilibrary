import express from "express";
import {
  borrowBook,
  getBorrowings,
  getBorrowingById,
  editBookBorrowing,
  deleteBorrowing
} from "../../api/controllers/mini-library/borrowingController.js";
import { authenticate } from "../../api/middlewares/auth.js";
import { borrowValidator } from "../../api/validations/mini-library/borrowingValidator.js";
import { isAdmin } from "../../api/middlewares/isAdmin.js"

const router = express.Router();
router.use(authenticate);

// RETRIEVE BORROWINGS
router.get("/", getBorrowings);
router.get("/:id", getBorrowingById);

// BORROW
router.post("/", borrowValidator, isAdmin, borrowBook);

// RETURN
router.put("/:id", isAdmin, editBookBorrowing);

// FORCE DELETE
router.delete("/:id", isAdmin, deleteBorrowing);

export default router;

import express from "express";
import { addBook, deleteBook, editBook, getBooks } from "../controllers/bookController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { bookValidator } from "../validators/bookValidator.js";
import { isAdmin } from "../middleware/isAdmin.js"

const router = express.Router();

router.get("/", getBooks);
  
router.post("/", authenticate, bookValidator, validate, isAdmin, addBook);
  
router.put("/:id", authenticate, bookValidator, validate, isAdmin, editBook);
  
router.delete("/:id", authenticate, isAdmin, deleteBook);

export default router
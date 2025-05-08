import express from "express";
import { addBook, deleteBook, editBook, getBooks, getBooksById } from "../../api/controllers/mini-library/bookController.js";
import { authenticate } from "../../api/middlewares/auth.js";
import { bookInputValidator, bookUpdateValidator } from "../../api/validations/mini-library/bookValidator.js";

const router = express.Router();

router.get("/", getBooks);
  
router.post("/", authenticate, bookInputValidator, addBook);

router.get("/:id", authenticate, getBooksById);
  
router.put("/:id", authenticate, bookUpdateValidator, editBook);
  
router.delete("/:id", authenticate, deleteBook);

export default router
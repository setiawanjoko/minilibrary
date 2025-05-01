import express from "express";
import { addBook, deleteBook, editBook, getBooks } from "../../api/controllers/mini-library/bookController.js";
import { authenticate } from "../../api/middlewares/auth.js";
import { validate } from "../../api/middlewares/validate.js";
import { bookValidator } from "../../api/validations/mini-library/bookValidator.js";
import { isAdmin } from "../../api/middlewares/isAdmin.js"

const router = express.Router();

router.get("/", getBooks);
  
router.post("/", authenticate, bookValidator, validate, isAdmin, addBook);
  
router.put("/:id", authenticate, bookValidator, validate, isAdmin, editBook);
  
router.delete("/:id", authenticate, isAdmin, deleteBook);

export default router
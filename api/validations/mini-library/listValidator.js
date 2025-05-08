import { body } from "express-validator";

export const listValidator = [
  body("book_id")
    .notEmpty()
    .withMessage("Book ID is required")
    .isInt({ gt: 0 })
    .withMessage("Book ID must be a positive integer"),
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["reading", "completed", "dropped", "read_later"])
    .withMessage("Status must be one of the following: reading, completed, dropped, read later"),
];
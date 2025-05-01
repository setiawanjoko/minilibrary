import { body } from "express-validator";

export const updateUserValidator = [
  body("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),
  body("email").optional().isEmail().withMessage("Email is not valid"),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

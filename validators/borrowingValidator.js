import { body } from 'express-validator';

export const borrowValidator = [
  body('book_id')
    .notEmpty().withMessage('Book ID is required')
    .isInt({ gt: 0 }).withMessage('Book ID must be a positive integer')
];

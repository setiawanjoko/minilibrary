import { body } from 'express-validator';

export const bookValidator = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 2 }).withMessage('Title must be at least 2 characters'),
  body('author')
    .notEmpty().withMessage('Author is required')
    .isLength({ min: 2 }).withMessage('Author must be at least 2 characters')
];

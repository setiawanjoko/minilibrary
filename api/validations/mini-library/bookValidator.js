import { body } from 'express-validator';

export const bookInputValidator = [
  body('isbn')
    .notEmpty().withMessage('ISBN is required')
    .isLength({ min: 10 }).withMessage('ISBN must be at least 10 characters')
    .isAlphanumeric().withMessage('ISBN must be alphanumeric'),
  body('title')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 2 }).withMessage('Title must be at least 2 characters'),
  body('author')
    .notEmpty().withMessage('Author is required')
    .isLength({ min: 2 }).withMessage('Author must be at least 2 characters'),
  body('publisher')
    .notEmpty().withMessage('Publisher is required')
    .isLength({ min: 2 }).withMessage('Publisher must be at least 2 characters'),
  body('published_date')
    .notEmpty().withMessage('Published date is required')
    .isDate().withMessage('Published date must be a valid date'),
  body('genre')
    .notEmpty().withMessage('Genre is required')
    .isLength({ min: 2 }).withMessage('Genre must be at least 2 characters'),
  body('language')
    .notEmpty().withMessage('Language is required')
    .isLength({ min: 2 }).withMessage('Language must be at least 2 characters'),
  body('description')
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters')
];

export const bookUpdateValidator = [
  body('isbn')
    .optional()
    .isLength({ min: 10 }).withMessage('ISBN must be at least 10 characters')
    .isAlphanumeric().withMessage('ISBN must be alphanumeric'),
  body('title')
    .optional()
    .isLength({ min: 2 }).withMessage('Title must be at least 2 characters'),
  body('author')
    .optional()
    .isLength({ min: 2 }).withMessage('Author must be at least 2 characters'),
  body('publisher')
    .optional()
    .isLength({ min: 2 }).withMessage('Publisher must be at least 2 characters'),
  body('published_date')
    .optional()
    .isDate().withMessage('Published date must be a valid date'),
  body('genre')
    .optional()
    .isLength({ min: 2 }).withMessage('Genre must be at least 2 characters'),
  body('language')
    .optional()
    .isLength({ min: 2 }).withMessage('Language must be at least 2 characters'),
  body('description')
    .optional()
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters')
];
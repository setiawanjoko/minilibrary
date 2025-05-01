import { body } from "express-validator";

// Validation for adding a location
export const validateLocationForAdd = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 100 })
    .withMessage("Name must not exceed 100 characters"),
  body("address")
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ max: 255 })
    .withMessage("Address must not exceed 255 characters"),
  body("city")
    .notEmpty()
    .withMessage("City is required")
    .isLength({ max: 100 })
    .withMessage("City must not exceed 100 characters"),
  body("state")
    .notEmpty()
    .withMessage("State is required")
    .isLength({ max: 100 })
    .withMessage("State must not exceed 100 characters"),
  body("zip_code")
    .notEmpty()
    .withMessage("Zip code is required")
    .isPostalCode("any")
    .withMessage("Zip code must be valid"),
  body("country")
    .notEmpty()
    .withMessage("Country is required")
    .isLength({ max: 100 })
    .withMessage("Country must not exceed 100 characters"),
  body("latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a valid coordinate between -90 and 90"),
  body("longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a valid coordinate between -180 and 180"),
];

// Validation for updating a location
export const validateLocationForUpdate = [
  body("name")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Name must not exceed 100 characters"),
  body("address")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Address must not exceed 255 characters"),
  body("city")
    .optional()
    .isLength({ max: 100 })
    .withMessage("City must not exceed 100 characters"),
  body("state")
    .optional()
    .isLength({ max: 100 })
    .withMessage("State must not exceed 100 characters"),
  body("zip_code")
    .optional()
    .isPostalCode("any")
    .withMessage("Zip code must be valid"),
  body("country")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Country must not exceed 100 characters"),
  body("latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude must be a valid coordinate between -90 and 90"),
  body("longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude must be a valid coordinate between -180 and 180"),
];
import { body } from "express-validator";

export const validatePromotor = [
  body("name").notEmpty().withMessage("Name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("contact_person").notEmpty().withMessage("Contact person is required"),
  body("contact_person_position")
    .notEmpty()
    .withMessage("Contact person position is required"),
  body("contact_person_phone")
    .isMobilePhone()
    .withMessage("Valid phone number is required"),
  body("contact_person_email")
    .isEmail()
    .withMessage("Valid email address is required"),
  body("location_id")
    .isInt({ min: 1 })
    .withMessage("Location ID must be a positive integer"),
  body("status")
    .isIn(["active", "inactive"])
    .withMessage("Status must be either 'active' or 'inactive'"),
  body("image_url")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL"),
  body("website_url")
    .optional()
    .isURL()
    .withMessage("Website URL must be a valid URL"),
];
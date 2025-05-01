import { body, param } from "express-validator";

// Common validation for permissions
const validPermissions = ["read", "write", "delete"];
const validatePermission = body("permission")
  .optional()
  .isArray()
  .withMessage("Permission must be an array")
  .custom((permissions) => {
    if (!permissions.includes("read")) {
      throw new Error("Permission must include 'read'");
    }
    if (!permissions.every((perm) => validPermissions.includes(perm))) {
      throw new Error(
        `Invalid permission value. Allowed values are some or all of ${JSON.stringify(validPermissions)}`
      );
    }
    return true;
  });

// Validation for adding a promotor manager
export const validatePromotorManagerForAdd = [
  param("identifier")
    .notEmpty()
    .withMessage("Promotor identifier is required")
    .isString()
    .withMessage("Promotor identifier must be a string"),
  body("manager_id")
    .notEmpty()
    .withMessage("Manager ID is required")
    .isInt()
    .withMessage("Manager ID must be an integer"),
  validatePermission,
];

// Validation for updating a promotor manager
export const validatePromotorManagerForUpdate = [
  param("identifier")
    .notEmpty()
    .withMessage("Promotor identifier is required")
    .isString()
    .withMessage("Promotor identifier must be a string"),
  param("manager_id")
    .notEmpty()
    .withMessage("Manager ID is required")
    .isInt()
    .withMessage("Manager ID must be an integer"),
  body("status")
    .optional()
    .isIn(["active", "inactive"])
    .withMessage("Status must be either 'active' or 'inactive'"),
  validatePermission,
];

// Validation for deleting a promotor manager (soft delete)
export const validatePromotorManagerForDelete = [
  param("identifier")
    .notEmpty()
    .withMessage("Promotor identifier is required")
    .isString()
    .withMessage("Promotor identifier must be a string"),
  param("manager_id")
    .notEmpty()
    .withMessage("Manager ID is required")
    .isInt()
    .withMessage("Manager ID must be an integer"),
];
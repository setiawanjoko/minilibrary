import express from "express";
import {
  getPromotorManagers,
  getPromotorManager,
  addPromotorManager,
  editPromotorManager,
  deletePromotorManager,
} from "../../api/controllers/event-organizers/promotorManagerController.js";
import {
  validatePromotorManagerForAdd,
  validatePromotorManagerForUpdate,
  validatePromotorManagerForDelete,
} from "../../api/validations/event-organizers/promotorManagerValidation.js";
import { validate } from "../../api/middlewares/validate.js";

const router = express.Router();

// Route to get all promotor managers of a promotor
// Optional query parameters: limit, offset, name
router.get("/", getPromotorManagers);

// Route to get a single promotor manager by promotor identifier and manager ID
router.get("/:manager_id", getPromotorManager);

// Route to add a new promotor manager
// Requires: identifier (in params), manager_id, and optional permission (in body)
router.post("/", validatePromotorManagerForAdd, validate, addPromotorManager);

// Route to update an existing promotor manager
// Requires: identifier (in params), manager_id (in params), and optional permission or status (in body)
router.put("/:manager_id", validatePromotorManagerForUpdate, validate, editPromotorManager);

// Route to set a promotor manager's status to 'inactive' instead of deleting
// Requires: identifier (in params) and manager_id (in params)
router.delete("/:manager_id", validatePromotorManagerForDelete, validate, deletePromotorManager);

export default router;
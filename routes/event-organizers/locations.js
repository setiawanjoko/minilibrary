import express from "express";
import {
  validateLocationForAdd,
  validateLocationForUpdate,
} from "../../api/validations/event-organizers/locationsValidation.js";
import {
  addLocation,
  editLocation,
  deleteLocation,
  getLocations,
  getLocation,
} from "../../api/controllers/event-organizers/locationController.js";

const router = express.Router();

router.get("/", getLocations);
router.get("/:id", getLocation);
router.post("/", validateLocationForAdd, addLocation);
router.put("/:id", validateLocationForUpdate, editLocation);
router.delete("/:id", deleteLocation);

export default router;
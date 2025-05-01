import express from "express";
import { validatePromotor } from "../../api/validations/event-organizers/promotorValidation.js";
import {
  addPromotor,
  editPromotor,
  deletePromotor,
  getPromotors,
  getPromotor,
} from "../../api/controllers/event-organizers/promotorController.js";
import promotorManagerRoutes from "./promotor_managers.js";

const router = express.Router();

router.get("/", getPromotors);
router.get("/:identifier", getPromotor);
router.post("/", validatePromotor, addPromotor);
router.put("/:identifier", validatePromotor, editPromotor);
router.delete("/:identifier", deletePromotor);

router.use("/:identifier/managers", promotorManagerRoutes);

export default router;
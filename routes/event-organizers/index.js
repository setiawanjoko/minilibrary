import express from "express";
import promotorRoutes from "./promotors.js";
import locationRoutes from "./locations.js";
import { authenticate } from "../../api/middlewares/auth.js";

const router = express.Router();

router.use("/promotors", authenticate, promotorRoutes);
router.use("/locations", authenticate, locationRoutes);

export default router;
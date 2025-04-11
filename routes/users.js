import express from "express";
import { getAllUsers, putUserById, deleteUserById } from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { updateUserValidator } from "../validators/userValidator.js";
import { isAdmin } from "../middleware/isAdmin.js"

const router = express.Router();

router.use(authenticate, isAdmin)

router.get("/", getAllUsers);

router.put("/:id", updateUserValidator, validate, putUserById);

router.delete("/:id", deleteUserById);

export default router;

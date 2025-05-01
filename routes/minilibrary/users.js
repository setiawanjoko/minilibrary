import express from "express";
import { getAllUsers, putUserById, deleteUserById } from "../../api/controllers/mini-library/userController.js";
import { authenticate } from "../../api/middlewares/auth.js";
import { validate } from "../../api/middlewares/validate.js";
import { updateUserValidator } from "../../api/validations/mini-library/userValidator.js";
import { isAdmin } from "../../api/middlewares/isAdmin.js"

const router = express.Router();

router.use(authenticate, isAdmin)

router.get("/", getAllUsers);

router.put("/:id", updateUserValidator, validate, putUserById);

router.delete("/:id", deleteUserById);

export default router;

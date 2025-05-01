import express from "express";
import { authenticate } from "../api/middlewares/auth.js";
import { validate } from "../api/middlewares/validate.js";
import {
  registerValidator,
  loginValidator,
} from "../api/validations/authValidator.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
} from "../api/controllers/authController.js";

const router = express.Router();

/**
 * Register a new user
 */
router.post("/register", registerValidator, validate, registerUser);

/**
 * Login a user and generate access and refresh tokens
 */
router.post("/login", loginValidator, validate, loginUser);

/**
 * Logout a user by invalidating their JWT token
 */
router.post("/logout", authenticate, logoutUser);

/**
 * Refresh an access token using a valid refresh token
 */
router.post("/refresh-token", validate, refreshToken);

export default router;

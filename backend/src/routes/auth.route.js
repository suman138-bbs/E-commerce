import { Router } from "express";
import {
  forgotPassword,
  getProfile,
  login,
  logout,
  resetPassword,
  signUp,
} from "../controllers/auth.controller.js";

import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = Router();

// Sign up
router.post("/signup", signUp);

// Login
router.post("/login", login);

// Logout
router.get("/logout", logout);

// Forgot password
router.post("/password/forgot", forgotPassword);

// Password reset
router.post("/password/reset/:token", resetPassword);

// Get Profile
router.get("/profile", isLoggedIn, getProfile);

export default router;

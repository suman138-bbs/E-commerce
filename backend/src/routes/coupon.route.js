import { Router } from "express";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  updateCoupon,
} from "../controllers/coupon.controller.js";
import { isLoggedIn, authorize } from "../middlewares/auth.middleware.js";
import AuthRoles from "../utils/authRoles.js";

const router = Router();

// Create coupon
router.post(
  "/",
  isLoggedIn,
  authorize(AuthRoles.MODERATOR, AuthRoles.ADMIN),
  createCoupon
);

// Delete coupon
router.delete(
  "/:id",
  isLoggedIn,
  authorize(AuthRoles.MODERATOR, AuthRoles.ADMIN),
  deleteCoupon
);

// Activate/Deactivate coupon
router.put(
  "/action/:id",
  isLoggedIn,
  authorize(AuthRoles.MODERATOR, AuthRoles.ADMIN),
  updateCoupon
);

// Get all coupons
router.get(
  "/",
  isLoggedIn,
  authorize(AuthRoles.MODERATOR, AuthRoles.ADMIN),
  getAllCoupons
);

export default router;

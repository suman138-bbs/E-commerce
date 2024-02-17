import { Router } from "express";
import {
  generateOrder,
  generateRazorpayOrderId,
  getAllOrders,
  getMyOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { authorize, isLoggedIn } from "../middlewares/auth.middleware.js";
import AuthRoles from "../utils/authRoles.js";

const router = Router();

// Generate order
router.post("", isLoggedIn, generateOrder);

// Get all orders
router.get(
  "",
  isLoggedIn,
  authorize(AuthRoles.MODERATOR, AuthRoles.ADMIN),
  getAllOrders
);

// Generate razorpay order id
router.post("/razorpay", isLoggedIn, generateRazorpayOrderId);

// Get my personal orders
router.get("/personal", isLoggedIn, getMyOrders);

// Update order status
router.put(
  "/:id",
  isLoggedIn,
  authorize(AuthRoles.MODERATOR, AuthRoles.ADMIN),
  updateOrderStatus
);

export default router;

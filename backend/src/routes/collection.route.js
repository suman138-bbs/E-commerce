import { Router } from "express";
import {
  createCollection,
  deleteCollection,
  getAllCollections,
  updateCollection,
} from "../controllers/collection.controller.js";
import { isLoggedIn, authorize } from "../middlewares/auth.middleware.js";
import AuthRoles from "../utils/authRoles.js";

const router = Router();

// Create collection
router.post("", isLoggedIn, authorize(AuthRoles.ADMIN), createCollection);

// Update collection
router.put("/:id", isLoggedIn, authorize(AuthRoles.ADMIN), updateCollection);

// Delete collection
router.delete("/:id", isLoggedIn, authorize(AuthRoles.ADMIN), deleteCollection);

// Get all collections
router.get("", getAllCollections);

export default router;

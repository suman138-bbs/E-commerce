import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsByCollectionId,
  groupProductsByCollection,
  updateProduct,
} from "../controllers/product.controller.js";
import { isLoggedIn, authorize } from "../middlewares/auth.middleware.js";
import AuthRoles from "../utils/authRoles.js";

const router = Router();

// Get all products
router.get("", getAllProducts);

// Get Grouped Products By Collection
router.get("/collection", groupProductsByCollection);

// Get Products By Collection Id
router.get("/collection/:id", getProductsByCollectionId);

// Get single product
router.get("/:id", getProductById);

// Add product
router.post("", isLoggedIn, authorize(AuthRoles.ADMIN), addProduct);

// Update product
router.put("/:id", isLoggedIn, authorize(AuthRoles.ADMIN), updateProduct);

router.delete("/:id", isLoggedIn, authorize(AuthRoles.ADMIN), deleteProduct);

export default router;

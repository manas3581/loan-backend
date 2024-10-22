import express from "express";
const router = express.Router();
import {
  registerController,
  loginController,
  logoutController,
  getMyProfileController,
} from "../controller/userController.js";
import { isAuthenticated } from "../middleware/auth.js";
router.post("/register", registerController);
router.post("/login", loginController);
router.get("/logout", logoutController);
router.get("/me", isAuthenticated, getMyProfileController);

export default router;

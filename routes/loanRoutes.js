import express from "express";
const router = express.Router();
import {
  loanController,
  loanApprovedController,
  repaymentController,
  loanStackController,
  loanGetController,
} from "../controller/loanController.js";
import { isAuthenticated, isAdmin } from "../middleware/auth.js";
router.get("/loaanstack", isAuthenticated, loanStackController);

router.post("/loanrequest", isAuthenticated, loanController);
router.patch(
  "/loanapproveddmin/:id",
  isAuthenticated,
  isAdmin,
  loanApprovedController
);
router.patch("/repaayment/:id", isAuthenticated, repaymentController);
router.get("/loanget", isAuthenticated, isAdmin, loanGetController);

export default router;

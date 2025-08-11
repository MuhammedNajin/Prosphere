import express from "express";
import { resolve } from "@di/index";
import AdminControllers from "@/presentation/controllers/adminController";
import { asyncHandler } from "@muhammednajinnprosphere/common";
import { Controllers } from "@/di/symbols";

const router = express.Router();

const adminController = resolve<AdminControllers>(
  Controllers.AdminControllers)

router.get("/users", asyncHandler(adminController.getAllUsers));
router.patch("/block/:id", asyncHandler(adminController.blockUser));
router.post("/logout", asyncHandler(adminController.logout));
router.post("/refresh-token", asyncHandler(adminController.refreshToken));

export default router;

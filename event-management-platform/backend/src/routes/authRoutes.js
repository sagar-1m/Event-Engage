import express from "express";
import {
  register,
  login,
  getProfile,
  guestLogin,
  checkGuestSession,
  logout,
  logoutGuest,
  logoutAllSessions,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/guest", guestLogin);

router.get("/profile", protect, getProfile);
router.get("/guest/check", protect, checkGuestSession);

router.post("/logout", protect, logout);
router.post("/logout/guest", protect, logoutGuest);
router.post("/logout/all", protect, logoutAllSessions);

export default router;

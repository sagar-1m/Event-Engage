import express from "express";
import {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  leaveEvent,
  getUserCreatedEvents,
  getUserJoinedEvents,
  uploadEventImage,
} from "../controllers/eventController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload, handleMulterError } from "../middleware/uploadMiddleware.js";
import { logCloudinaryOperations } from "../middleware/loggerMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getEvents);
router.get("/:id", getEvent);

// Protected routes
router.use(protect);

// Image upload route with enhanced error handling
router.post(
  "/upload",
  protect,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        return handleMulterError(err, req, res, next);
      }
      next();
    });
  },
  uploadEventImage
);

// Event CRUD routes
router.post("/", createEvent);
router.put("/:id", updateEvent);
router.delete("/:id", protect, logCloudinaryOperations, deleteEvent);

// User event management routes
router.get("/user/created", getUserCreatedEvents);
router.get("/user/joined", getUserJoinedEvents);
router.post("/:id/join", joinEvent);
router.post("/:id/leave", leaveEvent);

export default router;

import Event from "../models/Event.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";
import { Schema } from "mongoose";
import streamifier from "streamifier";
import { getCloudinaryPublicId } from "../utils/cloudinaryHelper.js";
import { uploadOptions } from "../config/cloudinary.js";

// Get all events (with filters)
export const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find().populate("organizer", "name email").lean();

  // Normalize image data
  const normalizedEvents = events.map((event) => ({
    ...event,
    image: event.image || null,
  }));

  res.json({
    success: true,
    data: normalizedEvents,
  });
});

// Get events created by user
export const getUserCreatedEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ organizer: req.user._id })
    .populate("organizer", "name email")
    .populate("attendees", "name email")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: events,
  });
});

// Get events joined by user
export const getUserJoinedEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ attendees: req.user._id })
    .populate("organizer", "name email")
    .populate("attendees", "name email")
    .sort({ date: 1 });

  res.json({
    success: true,
    data: events,
  });
});

// Get single event
export const getEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate("organizer", "name email")
    .populate("attendees", "name email");

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  res.json({
    success: true,
    data: event,
  });
});

// Helper function to upload to Cloudinary
const uploadToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "events",
        transformation: [
          { width: 1200, height: 675, crop: "fill" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

// Helper function to delete image from Cloudinary
const deleteFromCloudinary = async (imageUrl) => {
  try {
    const publicId = getCloudinaryPublicId(imageUrl);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
      console.log("Successfully deleted image:", publicId);
    }
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
  }
};

// Update updateEvent to handle image upload more efficiently
export const updateEvent = asyncHandler(async (req, res) => {
  let event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  if (event.organizer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to update this event");
  }

  let imageUrl = event.image;

  try {
    if (req.file) {
      // Delete old image if it exists
      await deleteFromCloudinary(event.image);

      // Upload new image
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { ...req.body, image: imageUrl },
      { new: true }
    )
      .populate("organizer", "name email")
      .populate("attendees", "name email");

    res.json({
      success: true,
      data: updatedEvent,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Error updating event: " + error.message);
  }
});

// Update separate image upload handler
export const uploadEventImage = asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("Please upload an image");
    }

    // Create thumbnails and optimized versions
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          ...uploadOptions,
          eager: [
            // Thumbnail for cards
            { width: 400, height: 300, crop: "fill", quality: "auto" },
            // Medium size for event details
            { width: 800, height: 450, crop: "fill", quality: "auto" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    });

    res.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      thumbnails: {
        small: uploadResult.eager[0].secure_url,
        medium: uploadResult.eager[1].secure_url,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500);
    throw new Error("Error uploading image: " + error.message);
  }
});

// Update createEvent to handle image upload
export const createEvent = asyncHandler(async (req, res) => {
  let imageData = null;

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer);
    imageData = {
      image: result.secure_url,
      thumbnail: result.eager[0].secure_url,
    };
  }

  const eventData = {
    ...req.body,
    organizer: req.user._id,
    ...imageData,
  };

  const event = await Event.create(eventData);

  const populatedEvent = await Event.findById(event._id)
    .populate("organizer", "name email")
    .populate("attendees", "name email");

  res.status(201).json({
    success: true,
    data: populatedEvent,
  });
});

// Update deleteEvent to also delete the image
export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  if (event.organizer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to delete this event");
  }

  try {
    // Delete image from Cloudinary if exists
    if (event.image) {
      console.log("Attempting to delete image:", {
        imageUrl: event.image,
        publicId: getCloudinaryPublicId(event.image),
      });

      const publicId = getCloudinaryPublicId(event.image);
      if (publicId) {
        const result = await cloudinary.uploader.destroy(publicId);
        console.log("Cloudinary deletion result:", result);
      }
    }

    await event.deleteOne();

    res.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteEvent:", error);
    res.status(500);
    throw new Error("Error deleting event: " + error.message);
  }
});

// Join event
export const joinEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  if (event.status !== "published") {
    res.status(400);
    throw new Error("Cannot join an unpublished event");
  }

  if (event.organizer.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("Cannot join your own event");
  }

  if (event.attendees.includes(req.user._id)) {
    res.status(400);
    throw new Error("Already joined this event");
  }

  if (event.attendees.length >= event.capacity) {
    res.status(400);
    throw new Error("Event is full");
  }

  event.attendees.push(req.user._id);
  await event.save();

  const populatedEvent = await Event.findById(event._id)
    .populate("organizer", "name email")
    .populate("attendees", "name email");

  res.json({
    success: true,
    message: "Successfully joined the event",
    data: populatedEvent,
  });
});

// Leave event
export const leaveEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  if (!event.attendees.includes(req.user._id)) {
    res.status(400);
    throw new Error("Not joined this event");
  }

  event.attendees = event.attendees.filter(
    (attendeeId) => attendeeId.toString() !== req.user._id.toString()
  );
  await event.save();

  const populatedEvent = await Event.findById(event._id)
    .populate("organizer", "name email")
    .populate("attendees", "name email");

  res.json({
    success: true,
    message: "Successfully left the event",
    data: populatedEvent,
  });
});

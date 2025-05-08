import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "../models/Event.js";

dotenv.config();

const migrateImageStructure = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const events = await Event.find({ image: { $type: "string" } });
    console.log(`Found ${events.length} events to migrate`);

    for (const event of events) {
      const originalImage = event.image;
      if (originalImage) {
        // Convert string image to new structure
        event.image = {
          original: originalImage,
          thumbnail: originalImage, // Initially set same URL for all sizes
          medium: originalImage,
        };
        await event.save();
        console.log(`Migrated event: ${event._id}`);
      }
    }

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

migrateImageStructure();

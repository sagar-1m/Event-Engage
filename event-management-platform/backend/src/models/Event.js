import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxLength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxLength: [1000, "Description cannot be more than 1000 characters"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Conference", "Seminar", "Workshop", "Social", "Other"],
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published", "cancelled"],
      default: "draft",
    },
    image: {
      type: mongoose.Schema.Types.Mixed, // Allow both string and object
      default: {
        original: "",
        thumbnail: "",
        medium: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Add index for better query performance
eventSchema.index({ title: "text", description: "text" });

// Add a pre-save middleware to handle both old and new image structures
eventSchema.pre("save", function (next) {
  if (typeof this.image === "string" && this.image) {
    const imageUrl = this.image;
    this.image = {
      original: imageUrl,
      thumbnail: imageUrl,
      medium: imageUrl,
    };
  }
  next();
});

export default mongoose.model("Event", eventSchema);

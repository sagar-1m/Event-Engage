import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  MenuItem,
  Stack,
  Alert,
} from "@mui/material";
import { eventApi } from "../../services/api.js";
import ImageUpload from "../common/ImageUpload/ImageUpload.js";

const EventForm = ({ event, mode = "create" }) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    date: event?.date ? new Date(event.date).toISOString().split("T")[0] : "",
    time: event?.time || "",
    location: event?.location || "",
    category: event?.category || "",
    capacity: event?.capacity || "",
    status: event?.status || "draft",
    image: event?.image || { original: "", thumbnail: "", medium: "" },
  });

  const categories = ["Conference", "Seminar", "Workshop", "Social", "Other"];
  const statuses = ["draft", "published", "cancelled"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (file) => {
    if (!file) {
      setFormData((prev) => ({
        ...prev,
        image: { original: "", thumbnail: "", medium: "" },
      }));
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const result = await eventApi.uploadImage(formData);
      setFormData((prev) => ({
        ...prev,
        image: {
          original: result.url,
          thumbnail: result.thumbnails.small,
          medium: result.thumbnails.medium,
        },
      }));
    } catch (error) {
      setError("Error uploading image: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      const submitData = {
        ...formData,
        capacity: Number(formData.capacity),
      };

      await (mode === "create"
        ? eventApi.createEvent(submitData)
        : eventApi.updateEvent(event._id, submitData));

      navigate("/events");
    } catch (err) {
      setError(err.response?.data?.message || "Error saving event");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {mode === "create" ? "Create New Event" : "Edit Event"}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <ImageUpload
              onUpload={handleImageUpload}
              previewUrl={formData.image.original}
              isUploading={isUploading}
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              required
            />

            <TextField
              fullWidth
              label="Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              label="Time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />

            <TextField
              select
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              type="number"
              label="Capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              required
              inputProps={{ min: 1 }}
            />

            <TextField
              select
              fullWidth
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </MenuItem>
              ))}
            </TextField>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button type="button" onClick={() => navigate("/events")}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isUploading}
              >
                {mode === "create" ? "Create Event" : "Update Event"}
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default EventForm;

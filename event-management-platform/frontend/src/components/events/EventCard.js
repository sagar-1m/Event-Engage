import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  IconButton,
  Tooltip,
  Skeleton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { eventApi } from "../../services/api";
import { DEFAULT_EVENT_IMAGE } from "../../constants/images";

const EventCard = ({
  event,
  onUpdate,
  priority = false,
  isAllEvents = false,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const imageRef = useRef(null);

  // Debug logging
  useEffect(() => {
    console.log("Event image data:", {
      id: event._id,
      imageStructure: event.image,
      isString: typeof event.image === "string",
      hasOriginal: event.image?.original,
    });
  }, [event]);

  // Reset loading state when event changes
  useEffect(() => {
    setIsLoading(true);
    setImageError(false);

    // Check if image is cached
    if (imageRef.current && imageRef.current.complete) {
      setIsLoading(false);
    }
  }, [event._id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const isEventCreator = user && event.organizer._id === user._id;
  const isJoined =
    user && event.attendees?.some((attendee) => attendee._id === user._id);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await eventApi.deleteEvent(event._id);
      onUpdate(); // Refresh the list
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setIsDeleting(false);
      setOpenDeleteDialog(false);
    }
  };

  const getImageUrl = () => {
    if (!event.image) return DEFAULT_EVENT_IMAGE;
    if (typeof event.image === "string") return event.image;
    return (
      event.image?.original || event.image?.thumbnail || DEFAULT_EVENT_IMAGE
    );
  };

  const handleImageLoad = () => {
    console.log("Image loaded:", {
      eventId: event._id,
      imageUrl: getImageUrl(),
    });
    setIsLoading(false);
  };

  const handleImageError = () => {
    console.error("Image load failed:", {
      eventId: event._id,
      imageUrl: getImageUrl(),
    });
    setImageError(true);
    setIsLoading(false);
  };

  return (
    <>
      <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            position: "relative",
            paddingTop: "56.25%" /* 16:9 aspect ratio */,
          }}
        >
          {isLoading && (
            <Skeleton
              variant="rectangular"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
              animation="wave"
            />
          )}
          <CardMedia
            ref={imageRef}
            component="img"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: isLoading ? "none" : "block",
            }}
            image={!imageError ? getImageUrl() : DEFAULT_EVENT_IMAGE}
            alt={event.title}
            loading={priority ? "eager" : "lazy"}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </Box>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Typography variant="h6" gutterBottom>
              {event.title}
            </Typography>
            {isEventCreator && (
              <Box>
                <Tooltip title="Edit">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/events/${event._id}/edit`);
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={handleDeleteClick}
                    disabled={isDeleting}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>

          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Chip label={event.category} size="small" color="primary" />
            <Chip
              label={event.status}
              size="small"
              color={getStatusColor(event.status)}
            />
            {isEventCreator && (
              <Chip label="Your Event" size="small" color="secondary" />
            )}
            {isJoined && !isEventCreator && (
              <Chip label="Joined" size="small" color="success" />
            )}
          </Stack>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            {new Date(event.date).toLocaleDateString()} at {event.time}
          </Typography>

          <Typography variant="body2" sx={{ mb: 2 }}>
            {event.description.substring(0, 100)}
            {event.description.length > 100 ? "..." : ""}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Location: {event.location}
          </Typography>

          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                size="small"
                variant="contained"
                onClick={() => navigate(`/events/${event._id}`)}
              >
                View Details
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {event.attendees?.length || 0}/{event.capacity} spots
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{event.title}"? This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            disabled={isDeleting}
            variant="contained"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventCard;

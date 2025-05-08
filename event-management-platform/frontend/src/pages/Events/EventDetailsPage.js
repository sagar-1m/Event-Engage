import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Skeleton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";
import { DEFAULT_EVENT_IMAGE } from "../../constants/images";

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const fetchEventDetails = useCallback(async () => {
    try {
      const response = await api.get(`/events/${id}`);
      setEvent(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching event details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEventDetails();
  }, [fetchEventDetails]);

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/events/${id}`);
      navigate("/dashboard", {
        state: { message: "Event successfully deleted" },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Error deleting event");
      setIsDeleting(false);
      setOpenDeleteDialog(false);
    }
  };

  const handleJoinEvent = async () => {
    try {
      await api.post(`/events/${id}/join`);
      fetchEventDetails();
    } catch (err) {
      setError(err.response?.data?.message || "Error joining event");
    }
  };

  const handleLeaveEvent = async () => {
    try {
      await api.post(`/events/${id}/leave`);
      fetchEventDetails();
    } catch (err) {
      setError(err.response?.data?.message || "Error leaving event");
    }
  };

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

  const getImageUrl = () => {
    if (!event) return DEFAULT_EVENT_IMAGE;
    if (typeof event.image === "string") return event.image;
    return event.image?.medium || event.image?.original || DEFAULT_EVENT_IMAGE;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="md">
        <Alert severity="info" sx={{ mt: 4 }}>
          Event not found
        </Alert>
      </Container>
    );
  }

  const isEventCreator = user && event.organizer._id === user._id;
  const isJoined =
    user && event.attendees?.some((attendee) => attendee._id === user._id);

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Box
          sx={{
            position: "relative",
            width: "100%",
            paddingTop: "56.25%", // 16:9 aspect ratio
            borderRadius: 1,
            overflow: "hidden",
            mb: 3,
          }}
        >
          {imageLoading && (
            <Skeleton
              variant="rectangular"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              animation="wave"
            />
          )}
          <img
            src={!imageError ? getImageUrl() : DEFAULT_EVENT_IMAGE}
            alt={event?.title || "Event"}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: imageLoading ? "none" : "block",
            }}
            onLoad={() => setImageLoading(false)}
            onError={(e) => {
              console.error("Image load error:", {
                eventId: event?._id,
                attemptedUrl: e.target.src,
              });
              setImageError(true);
              setImageLoading(false);
              e.target.src = DEFAULT_EVENT_IMAGE;
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            {event.title}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Chip label={event.category} color="primary" sx={{ mr: 1 }} />
            <Chip label={event.status} color={getStatusColor(event.status)} />
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography paragraph>{event.description}</Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ bgcolor: "background.default", p: 2, borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Event Details
              </Typography>

              <Typography variant="body2" paragraph>
                <strong>Date:</strong>{" "}
                {new Date(event.date).toLocaleDateString()}
              </Typography>

              <Typography variant="body2" paragraph>
                <strong>Time:</strong> {event.time}
              </Typography>

              <Typography variant="body2" paragraph>
                <strong>Location:</strong> {event.location}
              </Typography>

              <Typography variant="body2" paragraph>
                <strong>Capacity:</strong> {event.attendees?.length || 0}/
                {event.capacity} spots
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
          <Button onClick={() => navigate(-1)}>Back</Button>
          {isEventCreator && (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/events/${id}/edit`)}
              >
                Edit Event
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteClick}
              >
                Delete Event
              </Button>
            </>
          )}
          {!isEventCreator && !isJoined && user && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleJoinEvent}
              disabled={event.attendees?.length >= event.capacity}
            >
              Join Event
            </Button>
          )}
          {isJoined && !isEventCreator && (
            <Button
              variant="outlined"
              color="primary"
              onClick={handleLeaveEvent}
            >
              Leave Event
            </Button>
          )}
        </Box>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{event.title}"? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={
              isDeleting ? <CircularProgress size={20} /> : <DeleteIcon />
            }
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default EventDetailsPage;

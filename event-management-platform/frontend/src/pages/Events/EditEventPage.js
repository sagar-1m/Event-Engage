import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Box, CircularProgress, Alert } from "@mui/material";
import EventForm from "../../components/events/EventForm";
import api from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvent = useCallback(async () => {
    try {
      const response = await api.get(`/events/${id}`);
      const eventData = response.data.data;

      // Check if the logged-in user is the event organizer
      if (eventData.organizer._id !== user._id) {
        navigate("/dashboard");
        return;
      }

      setEvent(eventData);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching event");
    } finally {
      setLoading(false);
    }
  }, [id, user._id, navigate]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

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
        <Alert severity="warning" sx={{ mt: 4 }}>
          You are not authorized to edit this event.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <EventForm event={event} mode="edit" />
    </Container>
  );
};

export default EditEventPage;

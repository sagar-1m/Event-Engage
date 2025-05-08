import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Stack,
  Button,
  Typography,
  CircularProgress,
  Grid,
  Tabs,
  Tab,
  Alert,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { eventApi } from "../../services/api";
import EventCard from "./EventCard";
import { useAuth } from "../../hooks/useAuth";

const EventList = ({ userEvents = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState({
    category: "",
    search: "",
    status: "",
  });
  const [error, setError] = useState(null);

  const categories = ["Conference", "Seminar", "Workshop", "Social", "Other"];
  const statuses = ["draft", "published", "cancelled"];

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (userEvents) {
        response = await (activeTab === 0
          ? eventApi.getUserCreatedEvents()
          : eventApi.getUserJoinedEvents());
      } else {
        response = await eventApi.getEvents(filters);
      }

      // Validate event data
      const validatedEvents = response.data.map((event) => ({
        ...event,
        image: event.image || null, // Ensure image is null if not present
      }));

      // Pre-cache images
      validatedEvents.forEach((event) => {
        if (event.image) {
          const img = new Image();
          img.src =
            typeof event.image === "string"
              ? event.image
              : event.image.original;
        }
      });

      console.log("Fetched events:", validatedEvents);
      setEvents(validatedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [userEvents, activeTab, filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">
          {userEvents ? "My Events" : "All Events"}
        </Typography>
        {user && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/events/create")}
          >
            Create Event
          </Button>
        )}
      </Box>

      {userEvents && (
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Created Events" />
            <Tab label="Joined Events" />
          </Tabs>
        </Box>
      )}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="Search"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          size="small"
          sx={{ flexGrow: 1 }}
        />
        <TextField
          select
          label="Category"
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Status"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="">All Statuses</MenuItem>
          {statuses.map((status) => (
            <MenuItem key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Grid container spacing={3}>
        {events.length > 0 ? (
          events.map((event, index) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={event._id}
              data-testid={`event-card-${index}`}
            >
              <EventCard
                event={event}
                priority={index < 6} // Load first 6 events eagerly
                isAllEvents={!userEvents} // Add flag to identify All Events page
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" textAlign="center">
              {userEvents
                ? activeTab === 0
                  ? "You haven't created any events yet."
                  : "You haven't joined any events yet."
                : "No events found."}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default EventList;

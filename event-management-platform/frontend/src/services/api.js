import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't override Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with enhanced error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.message || error.message;
    console.error("API Error:", errorMessage);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      originalError: error,
    });
  }
);

export const eventApi = {
  uploadImage: async (formData) => {
    try {
      const response = await api.post("/events/upload", formData);
      if (response.data.success && response.data.url) {
        return response.data;
      }
      throw new Error("Invalid image upload response");
    } catch (error) {
      throw new Error(error.message || "Failed to upload image");
    }
  },

  createEvent: async (eventData) => {
    try {
      const response = await api.post("/events", eventData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to create event");
    }
  },

  updateEvent: async (id, eventData) => {
    try {
      const response = await api.put(`/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to update event");
    }
  },

  getEvents: async (filters = {}) => {
    try {
      const response = await api.get("/events", { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch events");
    }
  },

  getEvent: async (id) => {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch event");
    }
  },

  deleteEvent: async (id) => {
    try {
      const response = await api.delete(`/events/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete event");
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Error deleting event");
    }
  },

  getUserCreatedEvents: async () => {
    try {
      const response = await api.get("/events/user/created");
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch user created events");
    }
  },

  getUserJoinedEvents: async () => {
    try {
      const response = await api.get("/events/user/joined");
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to fetch user joined events");
    }
  },
};

export default api;

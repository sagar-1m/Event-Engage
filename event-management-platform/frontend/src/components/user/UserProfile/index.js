import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
} from "@mui/material";
import { useAuth } from "../../../hooks/useAuth.js";
import api from "../../../services/api.js";

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put("/users/profile", profileData);
      if (response.data.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile",
      });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const passwordData = {
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
    };

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    try {
      const response = await api.put("/users/password", passwordData);
      if (response.data.success) {
        setMessage({ type: "success", text: "Password updated successfully!" });
        e.target.reset();
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update password",
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await api.delete("/users/account");
        logout();
      } catch (error) {
        setMessage({
          type: "error",
          text: error.response?.data?.message || "Failed to delete account",
        });
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <Stack spacing={3} sx={{ "& > *": { mb: 3 } }}>
        {/* Profile Update Section */}
        <Stack item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>
            <Box component="form" onSubmit={handleProfileUpdate}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
                margin="normal"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Update Profile
              </Button>
            </Box>
          </Paper>
        </Stack>

        {/* Password Change Section */}
        <Stack item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <Box component="form" onSubmit={handlePasswordChange}>
              <TextField
                fullWidth
                type="password"
                label="Current Password"
                name="currentPassword"
                margin="normal"
                required
              />
              <TextField
                fullWidth
                type="password"
                label="New Password"
                name="newPassword"
                margin="normal"
                required
              />
              <TextField
                fullWidth
                type="password"
                label="Confirm New Password"
                name="confirmPassword"
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Change Password
              </Button>
            </Box>
          </Paper>
        </Stack>

        {/* Account Deletion Section */}
        <Stack item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Delete Account
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Warning: This action cannot be undone. All your data will be
              permanently deleted.
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </Paper>
        </Stack>
      </Stack>
    </Box>
  );
};

export default UserProfile;

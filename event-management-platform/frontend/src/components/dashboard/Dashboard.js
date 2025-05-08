import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Paper,
  Tab,
  Tabs,
} from "@mui/material";
import UserProfile from "../user/UserProfile";
import LogoutDialog from "../common/LogoutDialog";
import EventList from "../events/EventList";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Event Management Platform
          </Typography>
          <Button color="inherit" onClick={() => navigate("/events")}>
            All Events
          </Button>
          <Typography sx={{ mr: 2 }}>Welcome, {user?.name}</Typography>
          <Button color="inherit" onClick={() => setLogoutDialogOpen(true)}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper>
          <Tabs value={activeTab} onChange={handleTabChange} centered>
            <Tab label="My Events" />
            <Tab label="Profile" />
          </Tabs>
        </Paper>

        <Box sx={{ mt: 3 }}>
          {activeTab === 0 && <EventList userEvents={true} />}
          {activeTab === 1 && <UserProfile />}
        </Box>
      </Container>

      <LogoutDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      />
    </Box>
  );
};

export default Dashboard;

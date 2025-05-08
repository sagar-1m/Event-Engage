import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { useAuth } from "../../../hooks/useAuth";
import ThemeToggle from "../../common/Button/ThemeToggle.js";
import LogoutDialog from "../../common/LogoutDialog/index.js";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: "navbar.background",
          borderBottom: 1,
          borderColor: "navbar.border",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                cursor: "pointer",
                color: "navbar.text",
                fontWeight: 600,
              }}
              onClick={() => navigate("/")}
            >
              Event Management Platform
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Button
                color="inherit"
                onClick={() => navigate("/events")}
                sx={{ color: "navbar.text" }}
              >
                Events
              </Button>

              {user ? (
                <>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/dashboard")}
                  >
                    Dashboard
                  </Button>
                  <Button
                    color="inherit"
                    onClick={() => setLogoutDialogOpen(true)}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/login")}
                    sx={{ color: "navbar.text" }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/register")}
                  >
                    Sign Up
                  </Button>
                </>
              )}
              <ThemeToggle />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar /> {/* This empty Toolbar acts as a spacer */}
      <LogoutDialog
        open={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
      />
    </>
  );
};

export default Navbar;

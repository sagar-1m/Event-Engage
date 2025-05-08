import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import EventList from "../../components/events/EventList";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, guestLogin } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      await guestLogin();
      // No need to navigate here as it's handled in AuthContext
    } catch (error) {
      console.error("Guest login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(45deg, #2C3E50 30%, #3498DB 90%)"
              : "linear-gradient(45deg, #2193b0 30%, #6dd5ed 90%)",
          color: "white",
          pt: { xs: 10, md: 15 },
          pb: { xs: 8, md: 12 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            sx={{
              fontWeight: 700,
              mb: 3,
              fontSize: { xs: "2.5rem", md: "3.75rem" },
            }}
          >
            Create & Join Amazing Events
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.9,
              fontSize: { xs: "1.2rem", md: "1.5rem" },
            }}
          >
            Your one-stop platform for managing and discovering incredible
            events. Connect with people who share your interests.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate("/events")}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                "&:hover": { transform: "translateY(-2px)" },
                transition: "transform 0.2s",
              }}
            >
              Explore Events
            </Button>
            {!user && (
              <>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleGuestLogin}
                  disabled={loading}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    borderColor: "white",
                    color: "white",
                    "&:hover": {
                      borderColor: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      transform: "translateY(-2px)",
                    },
                    transition: "transform 0.2s",
                  }}
                >
                  {loading ? "Logging in..." : "Try as Guest"}
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate("/register")}
                  sx={{
                    px: 4,
                    py: 1.5,
                    fontSize: "1.1rem",
                    "&:hover": { transform: "translateY(-2px)" },
                    transition: "transform 0.2s",
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: { xs: 6, md: 10 } }} maxWidth="lg">
        <Typography
          component="h2"
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            mb: 6,
            fontWeight: 600,
            fontSize: { xs: "2rem", md: "2.5rem" },
          }}
        >
          Why Choose Us
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 4,
          }}
        >
          {features.map((feature) => (
            <Card
              key={feature.title}
              sx={{
                height: "100%",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-4px)" },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h3"
                  sx={{ fontWeight: 600, mb: 2 }}
                >
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Upcoming Events Section */}
      <Box
        sx={{
          bgcolor: "background.subtle",
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            component="h2"
            variant="h3"
            align="center"
            gutterBottom
            sx={{
              mb: 6,
              fontWeight: 600,
              fontSize: { xs: "2rem", md: "2.5rem" },
            }}
          >
            Upcoming Events
          </Typography>
          <EventList limit={3} />
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate("/events")}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                "&:hover": { transform: "translateY(-2px)" },
                transition: "transform 0.2s",
              }}
            >
              View All Events
            </Button>
          </Box>
        </Container>
      </Box>

      {/* About Section */}
      <Container sx={{ py: { xs: 6, md: 10 } }} maxWidth="md">
        <Typography
          component="h2"
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            mb: 4,
            fontWeight: 600,
            fontSize: { xs: "2rem", md: "2.5rem" },
          }}
        >
          About Us
        </Typography>
        <Typography
          variant="body1"
          paragraph
          align="center"
          sx={{
            fontSize: "1.1rem",
            lineHeight: 1.8,
            opacity: 0.9,
          }}
        >
          We are dedicated to bringing people together through meaningful
          events. Our platform makes it easy to create, discover, and join
          events that matter to you. Whether you're an organizer or participant,
          we provide the tools you need to make your event experience seamless
          and enjoyable.
        </Typography>
      </Container>
    </Box>
  );
};

const features = [
  {
    title: "Easy Event Creation",
    description:
      "Create and manage events with just a few clicks. Our intuitive interface makes event planning simple and efficient.",
  },
  {
    title: "Discover Events",
    description:
      "Find events that match your interests. Browse through various categories and join the ones you love.",
  },
  {
    title: "Connect & Network",
    description:
      "Meet like-minded people and build meaningful connections through events. Expand your professional and social network.",
  },
];

export default HomePage;

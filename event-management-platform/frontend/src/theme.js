import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? "#BB86FC" : "#1976d2",
        light: mode === "dark" ? "#CBB2FF" : "#42a5f5",
        dark: mode === "dark" ? "#8B5CF6" : "#1565c0",
      },
      secondary: {
        main: mode === "dark" ? "#03DAC6" : "#9c27b0",
        light: mode === "dark" ? "#66FFF8" : "#ba68c8",
        dark: mode === "dark" ? "#018786" : "#7b1fa2",
      },
      text: {
        primary: mode === "dark" ? "#FFFFFF" : "#2d3748",
        secondary: mode === "dark" ? "rgba(255, 255, 255, 0.7)" : "#4a5568",
      },
      background: {
        default: mode === "dark" ? "#121212" : "#f5f7fa",
        paper: mode === "dark" ? "#1E1E1E" : "#ffffff",
        subtle: mode === "dark" ? "#2D2D2D" : "#f0f2f5",
      },
      navbar: {
        background: mode === "dark" ? "#1E1E1E" : "#ffffff",
        text: mode === "dark" ? "#FFFFFF" : "#2d3748",
        border: mode === "dark" ? "#2D2D2D" : "#e2e8f0",
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: "8px 16px",
            textTransform: "none",
            fontWeight: 500,
          },
          contained: {
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow:
              mode === "dark"
                ? "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === "dark" ? "#1E1E1E" : "#ffffff",
            color: mode === "dark" ? "#FFFFFF" : "#2d3748",
            borderBottom: `1px solid ${
              mode === "dark" ? "#2D2D2D" : "#e2e8f0"
            }`,
            boxShadow:
              mode === "dark" ? "none" : "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          },
        },
      },
    },
  });

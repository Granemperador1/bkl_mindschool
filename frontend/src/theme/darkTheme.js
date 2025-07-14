import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2196f3", // Azul principal
      contrastText: "#fff",
    },
    secondary: {
      main: "#00bcd4", // Azul claro/acento
    },
    background: {
      default: "#181c24",
      paper: "#232837",
    },
    text: {
      primary: "#fff",
      secondary: "#b0b8c1",
    },
    info: {
      main: "#2979ff",
    },
    success: {
      main: "#00e676",
    },
    warning: {
      main: "#ffb300",
    },
    error: {
      main: "#f44336",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "linear-gradient(135deg, #232837 60%, #1a237e 100%)",
          color: "#fff",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(90deg, #1565c0 0%, #2196f3 100%)",
        },
      },
    },
  },
});

export default darkTheme;

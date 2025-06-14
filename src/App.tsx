import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UniversityDetailPage from "./pages/UniversityDetailPage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
  },
  typography: {
    fontFamily: [
      "Roboto",
      "Noto Sans JP",
      "sans-serif"
    ].join(",")
  }
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/university/:universityName" element={<UniversityDetailPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;

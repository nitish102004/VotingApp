import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, AdminRoute, VoterRoute } from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Leaderboard from './pages/Leaderboard';
import Vote from './pages/Vote';
import PositionManagement from './pages/admin/PositionManagement';
import CandidateManagement from './pages/admin/CandidateManagement';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Home />} />

            {/* Protected route accessible to all authenticated users */}
            <Route element={<ProtectedRoute />}>
              <Route path="/leaderboard" element={<Leaderboard />} />
            </Route>

            {/* Admin-only routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/positions" element={<PositionManagement />} />
              <Route path="/admin/candidates" element={<CandidateManagement />} />
            </Route>

            {/* Voter-only routes */}
            <Route element={<VoterRoute />}>
              <Route path="/vote" element={<Vote />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

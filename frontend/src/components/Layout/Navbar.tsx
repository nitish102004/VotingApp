import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, CircularProgress } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
    const { isAuthenticated, isLoading, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                    Voting Application
                </Typography>

                {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                ) : isAuthenticated ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body1" sx={{ mr: 2 }}>
                            Welcome, {user?.fullName} ({user?.role})
                        </Typography>

                        {user?.role === 'admin' && (
                            <>
                                <Button color="inherit" component={RouterLink} to="/admin/positions">
                                    Positions
                                </Button>
                                <Button color="inherit" component={RouterLink} to="/admin/candidates">
                                    Candidates
                                </Button>
                            </>
                        )}

                        <Button color="inherit" component={RouterLink} to="/leaderboard">
                            Leaderboard
                        </Button>

                        {user?.role === 'voter' && (
                            <Button color="inherit" component={RouterLink} to="/vote">
                                Vote
                            </Button>
                        )}

                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        <Button color="inherit" component={RouterLink} to="/login">
                            Login
                        </Button>
                        <Button color="inherit" component={RouterLink} to="/signup">
                            Signup
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar; 
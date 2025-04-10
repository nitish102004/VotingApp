import React from 'react';
import {
    Typography,
    Box,
    Paper,
    Button,
    Card,
    CardContent,
    CardActions
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout/Layout';
import { Grid } from '../components/MaterialWrappers';

const Home: React.FC = () => {
    const { isAuthenticated, user } = useAuth();

    const renderWelcomeContent = () => {
        if (!isAuthenticated) {
            return (
                <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Welcome to the Voting Application
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Please sign up or login to participate in the election.
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                        <Button
                            variant="contained"
                            component={RouterLink}
                            to="/signup"
                            sx={{ mr: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Button
                            variant="outlined"
                            component={RouterLink}
                            to="/login"
                        >
                            Login
                        </Button>
                    </Box>
                </Paper>
            );
        }

        // Admin content
        if (user?.role === 'admin') {
            return (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Admin Dashboard
                    </Typography>
                    <Typography variant="body1" paragraph>
                        As an administrator, you can manage positions and candidates.
                    </Typography>

                    <Grid container spacing={3} sx={{ mt: 2 }}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" component="div" gutterBottom>
                                        Manage Positions
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Create, update, or delete positions for the election.
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        component={RouterLink}
                                        to="/admin/positions"
                                        variant="contained"
                                    >
                                        Manage Positions
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" component="div" gutterBottom>
                                        Manage Candidates
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Create, update, or delete candidates for each position.
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        component={RouterLink}
                                        to="/admin/candidates"
                                        variant="contained"
                                    >
                                        Manage Candidates
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5" component="div" gutterBottom>
                                        View Leaderboard
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        See the real-time results of the election.
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        size="small"
                                        component={RouterLink}
                                        to="/leaderboard"
                                        variant="contained"
                                    >
                                        View Leaderboard
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            );
        }

        // Voter content
        return (
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Voter Dashboard
                </Typography>
                <Typography variant="body1" paragraph>
                    Cast your votes for the available positions.
                </Typography>

                <Grid container spacing={3} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div" gutterBottom>
                                    Cast Your Vote
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Vote for your preferred candidates in each position.
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    component={RouterLink}
                                    to="/vote"
                                    variant="contained"
                                >
                                    Vote Now
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div" gutterBottom>
                                    View Leaderboard
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    See the real-time results of the election.
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    size="small"
                                    component={RouterLink}
                                    to="/leaderboard"
                                    variant="contained"
                                >
                                    View Leaderboard
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        );
    };

    return (
        <Layout>
            {renderWelcomeContent()}
        </Layout>
    );
};

export default Home; 
import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Paper,
    Button,
    Card,
    CardContent,
    CardHeader,
    List,
    ListItem,
    ListItemText,
    Divider,
    LinearProgress,
    CircularProgress,
    Alert
} from '@mui/material';
import Layout from '../components/Layout/Layout';
import { leaderboardService } from '../services/api';
import socketService from '../services/socket';
import { LeaderboardPosition, LeaderboardCandidate, LeaderboardData } from '../types';
import axios from 'axios';
import { Grid } from '../components/MaterialWrappers';

const Leaderboard: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardPosition[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Transform the API data to our component's expected format
    const transformLeaderboardData = (data: any): LeaderboardPosition[] => {
        console.log("Data to transform:", data);

        // If data is already in the expected LeaderboardPosition[] format
        if (Array.isArray(data) && data.length > 0 && 'id' in data[0] && 'candidates' in data[0]) {
            console.log("Data is already in LeaderboardPosition[] format");
            return data as LeaderboardPosition[];
        }

        // If data is an array of position objects (from backend format)
        if (Array.isArray(data)) {
            console.log("Data is an array - transforming from backend format");
            return data.map(position => ({
                id: position.id || position._id,
                name: position.name,
                candidates: Array.isArray(position.candidates)
                    ? position.candidates.map(c => ({
                        id: c.id || c._id,
                        name: c.name,
                        votes: c.votes
                    }))
                    : []
            }));
        }

        // If data is in the LeaderboardData format (key-value object with arrays)
        console.log("Attempting to transform from LeaderboardData format");
        try {
            return Object.entries(data).map(([positionId, candidates]) => {
                if (!Array.isArray(candidates)) {
                    console.error("Expected array of candidates but got:", candidates);
                    return {
                        id: positionId,
                        name: 'Unknown Position',
                        candidates: []
                    };
                }

                // Get the position name from the first candidate (they all have the same position name)
                const positionName = candidates.length > 0 && candidates[0].positionName
                    ? candidates[0].positionName
                    : 'Unknown Position';

                // Transform candidates data
                const transformedCandidates: LeaderboardCandidate[] = candidates.map(c => ({
                    id: c.candidate || c.id || 'unknown-id',
                    name: c.candidate || c.name || 'Unknown Candidate',
                    votes: c.count || c.votes || 0
                }));

                return {
                    id: positionId,
                    name: positionName,
                    candidates: transformedCandidates
                };
            });
        } catch (error) {
            console.error("Error transforming data:", error);
            return [];
        }
    };

    useEffect(() => {
        // Connect to socket for real-time updates
        socketService.connect();

        // Get initial leaderboard data
        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                console.log("Fetching leaderboard data...");

                const response = await leaderboardService.getLeaderboard();
                console.log("Raw API response:", response);

                if (!response) {
                    setError('No response received from the server');
                    return;
                }

                if (response.success && response.data) {
                    console.log("Response data structure:", JSON.stringify(response.data, null, 2));
                    // Transform the data before setting state
                    try {
                        const transformedData = transformLeaderboardData(response.data);
                        console.log("transformedData", transformedData);
                        setLeaderboard(transformedData);
                    } catch (transformError) {
                        console.error("Error transforming data:", transformError);
                        setError(`Error transforming data: ${transformError.message}`);
                    }
                } else {
                    console.error("API response unsuccessful:", response);
                    setError('Failed to fetch leaderboard data');
                }
            } catch (error) {
                console.error("Leaderboard fetch error:", error);
                if (axios.isAxiosError(error) && error.response) {
                    setError(`Server error: ${error.response.data.message || error.message}`);
                } else {
                    setError(`An error occurred while fetching the leaderboard: ${error.message}`);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();

        // Subscribe to leaderboard updates
        const unsubscribe = socketService.onLeaderboardUpdate((data) => {
            // Update the leaderboard when new data is received
            // Transform the data before setting state
            const transformedData = transformLeaderboardData(data);
            setLeaderboard(transformedData);
        });

        // Clean up on unmount
        return () => {
            unsubscribe();
        };
    }, []);

    // Calculate the total votes for a position
    const getTotalVotes = (position: LeaderboardPosition): number => {
        return position.candidates.reduce((total, candidate) => total + candidate.votes, 0);
    };

    // Render the leaderboard content
    const renderLeaderboard = () => {
        if (loading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            );
        }

        if (error) {
            return (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            );
        }

        if (leaderboard.length === 0) {
            return (
                <Alert severity="info" sx={{ mt: 2 }}>
                    No votes have been cast yet.
                </Alert>
            );
        }

        return (
            <Grid container spacing={3} sx={{ mt: 2 }}>
                {leaderboard.map((position) => {
                    const totalVotes = getTotalVotes(position);

                    return (
                        <Grid item xs={12} md={6} key={position.id}>
                            <Card>
                                <CardHeader
                                    title={position.name}
                                    subheader={`Total Votes: ${totalVotes}`}
                                />
                                <CardContent>
                                    <List>
                                        {position.candidates
                                            .sort((a, b) => b.votes - a.votes)
                                            .map((candidate, index) => {
                                                const percentage = totalVotes > 0
                                                    ? Math.round((candidate.votes / totalVotes) * 100)
                                                    : 0;

                                                return (
                                                    <React.Fragment key={candidate.id}>
                                                        {index > 0 && <Divider />}
                                                        <ListItem>
                                                            <ListItemText
                                                                primary={candidate.name}
                                                                secondary={
                                                                    <Box sx={{ width: '100%', mt: 1 }}>
                                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                            <Typography variant="body2">{candidate.votes} votes</Typography>
                                                                            <Typography variant="body2">{percentage}%</Typography>
                                                                        </Box>
                                                                        <LinearProgress
                                                                            variant="determinate"
                                                                            value={percentage}
                                                                            sx={{ mt: 0.5, height: 8, borderRadius: 4 }}
                                                                        />
                                                                    </Box>
                                                                }
                                                            />
                                                        </ListItem>
                                                    </React.Fragment>
                                                );
                                            })}
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        );
    };

    return (
        <Layout>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Election Leaderboard
                </Typography>
                <Typography variant="body1" paragraph>
                    View real-time results of the ongoing election.
                </Typography>

                {renderLeaderboard()}
            </Box>
        </Layout>
    );
};

export default Leaderboard; 
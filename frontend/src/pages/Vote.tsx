import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Paper,
    Grid,
    Card,
    CardContent,
    CardHeader,
    List,
    ListItem,
    ListItemText,
    Radio,
    RadioGroup,
    FormControlLabel,
    Button,
    CircularProgress,
    Alert,
    Divider
} from '@mui/material';
import Layout from '../components/Layout/Layout';
import { positionService, candidateService, voteService } from '../services/api';
import { Position, Candidate } from '../types';

const Vote: React.FC = () => {
    const [positions, setPositions] = useState<Position[]>([]);
    const [candidatesByPosition, setCandidatesByPosition] = useState<{ [key: string]: Candidate[] }>({});
    const [selectedCandidates, setSelectedCandidates] = useState<{ [key: string]: string }>({});
    const [votedPositions, setVotedPositions] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch all positions
                const positionsResponse = await positionService.getAllPositions();
                if (!positionsResponse.success || !positionsResponse.data?.positions) {
                    throw new Error('Failed to fetch positions');
                }

                const fetchedPositions = positionsResponse.data.positions;
                setPositions(fetchedPositions);

                // Initialize candidates object and fetch vote status for each position
                const candidatesObj: { [key: string]: Candidate[] } = {};
                const votedPositionsArr: string[] = [];

                // Fetch candidates for each position and check if the user has already voted
                for (const position of fetchedPositions) {
                    // Check if the user has already voted for this position
                    try {
                        const voteStatusResponse = await voteService.checkVoteStatus(position._id);
                        if (voteStatusResponse.success && voteStatusResponse.data?.hasVoted) {
                            votedPositionsArr.push(position._id);
                        }
                    } catch (error) {
                        console.error(`Error checking vote status for position ${position._id}:`, error);
                    }

                    // Fetch candidates for this position
                    try {
                        const candidatesResponse = await candidateService.getAllCandidates(position._id);
                        if (candidatesResponse.success && candidatesResponse.data?.candidates) {
                            candidatesObj[position._id] = candidatesResponse.data.candidates;
                        }
                    } catch (error) {
                        console.error(`Error fetching candidates for position ${position._id}:`, error);
                    }
                }

                setCandidatesByPosition(candidatesObj);
                setVotedPositions(votedPositionsArr);

            } catch (error) {
                setError('An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCandidateSelect = (positionId: string, candidateId: string) => {
        setSelectedCandidates({
            ...selectedCandidates,
            [positionId]: candidateId
        });
    };

    const handleVoteSubmit = async (positionId: string) => {
        const candidateId = selectedCandidates[positionId];

        if (!candidateId) {
            setError('Please select a candidate before submitting your vote');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);
            setSuccess(null);

            const response = await voteService.castVote({
                candidateId,
                positionId
            });

            if (response.success) {
                setSuccess('Your vote has been cast successfully!');
                setVotedPositions([...votedPositions, positionId]);

                // Clear the selection for this position
                const updatedSelectedCandidates = { ...selectedCandidates };
                delete updatedSelectedCandidates[positionId];
                setSelectedCandidates(updatedSelectedCandidates);
            } else {
                setError(response.message || 'Failed to cast vote');
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'An error occurred while submitting your vote');
        } finally {
            setSubmitting(false);
        }
    };

    // Render the voting content
    const renderVotingContent = () => {
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

        if (positions.length === 0) {
            return (
                <Alert severity="info" sx={{ mt: 2 }}>
                    No positions are available for voting.
                </Alert>
            );
        }

        return (
            // @ts-ignore
            <Grid container spacing={3} sx={{ mt: 2 }}>
                {positions.map((position) => {
                    const candidates = candidatesByPosition[position._id] || [];
                    const hasVoted = votedPositions.includes(position._id);

                    return (
                        // @ts-ignore
                        <Grid item xs={12} key={position._id}>
                            <Card>
                                <CardHeader
                                    title={position.name}
                                    subheader={position.description}
                                />
                                <CardContent>
                                    {hasVoted ? (
                                        <Alert severity="success">
                                            You have already voted for this position.
                                        </Alert>
                                    ) : candidates.length === 0 ? (
                                        <Alert severity="info">
                                            No candidates are available for this position.
                                        </Alert>
                                    ) : (
                                        <>
                                            <RadioGroup
                                                value={selectedCandidates[position._id] || ''}
                                                onChange={(e) => handleCandidateSelect(position._id, e.target.value)}
                                            >
                                                <List>
                                                    {candidates.map((candidate, index) => (
                                                        <React.Fragment key={candidate._id}>
                                                            {index > 0 && <Divider />}
                                                            <ListItem>
                                                                <FormControlLabel
                                                                    value={candidate._id}
                                                                    control={<Radio />}
                                                                    label={
                                                                        <ListItemText
                                                                            primary={candidate.name}
                                                                            secondary={candidate.bio}
                                                                        />
                                                                    }
                                                                />
                                                            </ListItem>
                                                        </React.Fragment>
                                                    ))}
                                                </List>
                                            </RadioGroup>

                                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                                <Button
                                                    variant="contained"
                                                    onClick={() => handleVoteSubmit(position._id)}
                                                    disabled={!selectedCandidates[position._id] || submitting}
                                                >
                                                    {submitting ? <CircularProgress size={24} /> : 'Submit Vote'}
                                                </Button>
                                            </Box>
                                        </>
                                    )}
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
                    Cast Your Vote
                </Typography>
                <Typography variant="body1" paragraph>
                    Select candidates for each position and submit your vote.
                </Typography>

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                {renderVotingContent()}
            </Box>
        </Layout>
    );
};

export default Vote; 
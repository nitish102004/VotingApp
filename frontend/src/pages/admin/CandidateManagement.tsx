import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Paper,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    CircularProgress,
    Alert,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Divider,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import Layout from '../../components/Layout/Layout';
import { candidateService, positionService } from '../../services/api';
import { Candidate, CandidateFormData, Position } from '../../types';

const CandidateManagement: React.FC = () => {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [positions, setPositions] = useState<Position[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Filter state
    const [selectedPosition, setSelectedPosition] = useState<string>('');

    // Form state
    const [open, setOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<CandidateFormData>({
        name: '',
        position: '',
        bio: ''
    });
    const [formErrors, setFormErrors] = useState({
        name: '',
        position: ''
    });
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

    // Fetch all candidates and positions
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch positions first
            const positionsResponse = await positionService.getAllPositions();

            if (positionsResponse.success && positionsResponse.data?.positions) {
                setPositions(positionsResponse.data.positions);

                // Then fetch candidates
                const candidatesResponse = await candidateService.getAllCandidates(
                    selectedPosition ? selectedPosition : undefined
                );

                if (candidatesResponse.success && candidatesResponse.data?.candidates) {
                    setCandidates(candidatesResponse.data.candidates);
                } else {
                    setError('Failed to fetch candidates');
                }
            } else {
                setError('Failed to fetch positions');
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'An error occurred while fetching data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedPosition]);

    // Filter handlers
    const handlePositionFilterChange = (event: SelectChangeEvent) => {
        setSelectedPosition(event.target.value);
    };

    // Dialog handlers
    const openAddDialog = () => {
        setFormData({ name: '', position: '', bio: '' });
        setFormErrors({ name: '', position: '' });
        setIsEdit(false);
        setCurrentId(null);
        setOpen(true);
    };

    const openEditDialog = (candidate: Candidate) => {
        setFormData({
            name: candidate.name,
            position: typeof candidate.position === 'string'
                ? candidate.position
                : candidate.position._id,
            bio: candidate.bio || ''
        });
        setFormErrors({ name: '', position: '' });
        setIsEdit(true);
        setCurrentId(candidate._id);
        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);
    };

    // Form handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error for the field being edited
        if (name === 'name' && formErrors.name) {
            setFormErrors({ ...formErrors, name: '' });
        }
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        setFormData({ ...formData, position: e.target.value });

        // Clear error
        if (formErrors.position) {
            setFormErrors({ ...formErrors, position: '' });
        }
    };

    const validateForm = (): boolean => {
        const errors = { name: '', position: '' };
        let isValid = true;

        if (!formData.name.trim()) {
            errors.name = 'Candidate name is required';
            isValid = false;
        }

        if (!formData.position) {
            errors.position = 'Position is required';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setSubmitLoading(true);
            setError(null);
            setSuccess(null);

            if (isEdit && currentId) {
                // Update existing candidate
                const response = await candidateService.updateCandidate(currentId, formData);

                if (response.success) {
                    setSuccess('Candidate updated successfully');
                    fetchData();
                    closeDialog();
                } else {
                    setError(response.message || 'Failed to update candidate');
                }
            } else {
                // Create new candidate
                const response = await candidateService.createCandidate(formData);

                if (response.success) {
                    setSuccess('Candidate created successfully');
                    fetchData();
                    closeDialog();
                } else {
                    setError(response.message || 'Failed to create candidate');
                }
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'An error occurred');
        } finally {
            setSubmitLoading(false);
        }
    };

    // Delete handlers
    const openDeleteDialog = (candidate: Candidate) => {
        setCandidateToDelete(candidate);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setCandidateToDelete(null);
        setDeleteDialogOpen(false);
    };

    const handleDelete = async () => {
        if (!candidateToDelete) return;

        try {
            setDeleteLoading(true);
            setError(null);
            setSuccess(null);

            const response = await candidateService.deleteCandidate(candidateToDelete._id);

            if (response.success) {
                setSuccess('Candidate deleted successfully');
                fetchData();
                closeDeleteDialog();
            } else {
                setError(response.message || 'Failed to delete candidate');
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'An error occurred while deleting candidate');
        } finally {
            setDeleteLoading(false);
        }
    };

    // Helper function to get position name by ID
    const getPositionName = (positionId: string): string => {
        const position = positions.find(p => p._id === positionId);
        return position ? position.name : 'Unknown Position';
    };

    // Render candidates list
    const renderCandidates = () => {
        if (loading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            );
        }

        if (candidates.length === 0) {
            return (
                <Alert severity="info" sx={{ mt: 2 }}>
                    No candidates found. {selectedPosition ? 'Try selecting a different position or ' : ''}
                    Click the "Add Candidate" button to create one.
                </Alert>
            );
        }

        return (
            <List>
                {candidates.map((candidate, index) => {
                    const positionName = typeof candidate.position === 'string'
                        ? getPositionName(candidate.position)
                        : candidate.position.name;

                    return (
                        <React.Fragment key={candidate._id}>
                            {index > 0 && <Divider />}
                            <ListItem>
                                <ListItemText
                                    primary={candidate.name}
                                    secondary={
                                        <>
                                            <Typography component="span" variant="body2" color="text.primary">
                                                Position: {positionName}
                                            </Typography>
                                            {candidate.bio && (
                                                <>
                                                    <br />
                                                    {candidate.bio}
                                                </>
                                            )}
                                        </>
                                    }
                                />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        aria-label="edit"
                                        onClick={() => openEditDialog(candidate)}
                                        sx={{ mr: 1 }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => openDeleteDialog(candidate)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </React.Fragment>
                    );
                })}
            </List>
        );
    };

    return (
        <Layout>
            <Box sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Manage Candidates
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={openAddDialog}
                    >
                        Add Candidate
                    </Button>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <Box sx={{ mb: 3 }}>
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel id="position-filter-label">Filter by Position</InputLabel>
                        <Select
                            labelId="position-filter-label"
                            id="position-filter"
                            value={selectedPosition}
                            label="Filter by Position"
                            onChange={handlePositionFilterChange}
                        >
                            <MenuItem value="">
                                <em>All Positions</em>
                            </MenuItem>
                            {positions.map((position) => (
                                <MenuItem key={position._id} value={position._id}>
                                    {position.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Paper sx={{ p: 2 }}>
                    {renderCandidates()}
                </Paper>
            </Box>

            {/* Add/Edit Dialog */}
            <Dialog open={open} onClose={closeDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{isEdit ? 'Edit Candidate' : 'Add Candidate'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        name="name"
                        label="Candidate Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                        sx={{ mb: 2, mt: 1 }}
                    />

                    <FormControl fullWidth sx={{ mb: 2 }} error={!!formErrors.position}>
                        <InputLabel id="position-select-label">Position</InputLabel>
                        <Select
                            labelId="position-select-label"
                            id="position"
                            name="position"
                            value={formData.position}
                            label="Position"
                            onChange={handleSelectChange}
                        >
                            <MenuItem value="">
                                <em>Select a Position</em>
                            </MenuItem>
                            {positions.map((position) => (
                                <MenuItem key={position._id} value={position._id}>
                                    {position.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {formErrors.position && (
                            <Typography variant="caption" color="error">
                                {formErrors.position}
                            </Typography>
                        )}
                    </FormControl>

                    <TextField
                        margin="dense"
                        id="bio"
                        name="bio"
                        label="Bio (Optional)"
                        type="text"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={3}
                        value={formData.bio}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={submitLoading}
                    >
                        {submitLoading ? <CircularProgress size={24} /> : (isEdit ? 'Update' : 'Create')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the candidate "{candidateToDelete?.name}"?
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog}>Cancel</Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                        disabled={deleteLoading}
                    >
                        {deleteLoading ? <CircularProgress size={24} /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
};

export default CandidateManagement; 
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
    Divider
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import Layout from '../../components/Layout/Layout';
import { positionService } from '../../services/api';
import { Position, PositionFormData } from '../../types';

const PositionManagement: React.FC = () => {
    const [positions, setPositions] = useState<Position[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Form state
    const [open, setOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<PositionFormData>({ name: '', description: '' });
    const [formErrors, setFormErrors] = useState<{ name: string }>({ name: '' });
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [currentId, setCurrentId] = useState<string | null>(null);
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [positionToDelete, setPositionToDelete] = useState<Position | null>(null);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

    // Fetch all positions
    const fetchPositions = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await positionService.getAllPositions();

            if (response.success && response.data?.positions) {
                setPositions(response.data.positions);
            } else {
                setError('Failed to fetch positions');
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'An error occurred while fetching positions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPositions();
    }, []);

    // Dialog handlers
    const openAddDialog = () => {
        setFormData({ name: '', description: '' });
        setFormErrors({ name: '' });
        setIsEdit(false);
        setCurrentId(null);
        setOpen(true);
    };

    const openEditDialog = (position: Position) => {
        setFormData({
            name: position.name,
            description: position.description || ''
        });
        setFormErrors({ name: '' });
        setIsEdit(true);
        setCurrentId(position._id);
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

    const validateForm = (): boolean => {
        const errors = { name: '' };
        let isValid = true;

        if (!formData.name.trim()) {
            errors.name = 'Position name is required';
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
                // Update existing position
                const response = await positionService.updatePosition(currentId, formData);

                if (response.success) {
                    setSuccess('Position updated successfully');
                    fetchPositions();
                    closeDialog();
                } else {
                    setError(response.message || 'Failed to update position');
                }
            } else {
                // Create new position
                const response = await positionService.createPosition(formData);

                if (response.success) {
                    setSuccess('Position created successfully');
                    fetchPositions();
                    closeDialog();
                } else {
                    setError(response.message || 'Failed to create position');
                }
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'An error occurred');
        } finally {
            setSubmitLoading(false);
        }
    };

    // Delete handlers
    const openDeleteDialog = (position: Position) => {
        setPositionToDelete(position);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setPositionToDelete(null);
        setDeleteDialogOpen(false);
    };

    const handleDelete = async () => {
        if (!positionToDelete) return;

        try {
            setDeleteLoading(true);
            setError(null);
            setSuccess(null);

            const response = await positionService.deletePosition(positionToDelete._id);

            if (response.success) {
                setSuccess('Position deleted successfully');
                fetchPositions();
                closeDeleteDialog();
            } else {
                setError(response.message || 'Failed to delete position');
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'An error occurred while deleting position');
        } finally {
            setDeleteLoading(false);
        }
    };

    // Render positions list
    const renderPositions = () => {
        if (loading) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            );
        }

        if (positions.length === 0) {
            return (
                <Alert severity="info" sx={{ mt: 2 }}>
                    No positions have been created yet. Click the "Add Position" button to create one.
                </Alert>
            );
        }

        return (
            <List>
                {positions.map((position, index) => (
                    <React.Fragment key={position._id}>
                        {index > 0 && <Divider />}
                        <ListItem>
                            <ListItemText
                                primary={position.name}
                                secondary={position.description || 'No description'}
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                    edge="end"
                                    aria-label="edit"
                                    onClick={() => openEditDialog(position)}
                                    sx={{ mr: 1 }}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => openDeleteDialog(position)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </React.Fragment>
                ))}
            </List>
        );
    };

    return (
        <Layout>
            <Box sx={{ mt: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Manage Positions
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={openAddDialog}
                    >
                        Add Position
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

                <Paper sx={{ p: 2 }}>
                    {renderPositions()}
                </Paper>
            </Box>

            {/* Add/Edit Dialog */}
            <Dialog open={open} onClose={closeDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{isEdit ? 'Edit Position' : 'Add Position'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        name="name"
                        label="Position Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                        sx={{ mb: 2, mt: 1 }}
                    />
                    <TextField
                        margin="dense"
                        id="description"
                        name="description"
                        label="Description (Optional)"
                        type="text"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={3}
                        value={formData.description}
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
                        Are you sure you want to delete the position "{positionToDelete?.name}"?
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

export default PositionManagement; 
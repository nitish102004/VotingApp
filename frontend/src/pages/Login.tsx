import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    Alert,
    CircularProgress
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        aadhaarNumber: '',
        password: ''
    });
    const [formErrors, setFormErrors] = useState({
        aadhaarNumber: '',
        password: ''
    });

    const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect if already authenticated
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const validateForm = (): boolean => {
        const errors = {
            aadhaarNumber: '',
            password: ''
        };
        let isValid = true;

        // Validate Aadhaar number
        if (!formData.aadhaarNumber) {
            errors.aadhaarNumber = 'Aadhaar number is required';
            isValid = false;
        } else if (formData.aadhaarNumber.length !== 12 || !/^\d+$/.test(formData.aadhaarNumber)) {
            errors.aadhaarNumber = 'Aadhaar number must be 12 digits';
            isValid = false;
        }

        // Validate password
        if (!formData.password) {
            errors.password = 'Password is required';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        // Clear error when user types
        if (error) clearError();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            await login(formData.aadhaarNumber, formData.password);
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography component="h1" variant="h5" align="center" gutterBottom>
                    Login
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="aadhaarNumber"
                        label="Aadhaar Number"
                        name="aadhaarNumber"
                        autoComplete="aadhaar"
                        autoFocus
                        value={formData.aadhaarNumber}
                        onChange={handleChange}
                        error={!!formErrors.aadhaarNumber}
                        helperText={formErrors.aadhaarNumber}
                        inputProps={{ maxLength: 12 }}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!formErrors.password}
                        helperText={formErrors.password}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Login'}
                    </Button>

                    <Box textAlign="center">
                        <Typography variant="body2">
                            Don't have an account?{' '}
                            <RouterLink to="/signup">Sign Up</RouterLink>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login; 
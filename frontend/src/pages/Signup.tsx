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
import { SignupData } from '../types';

const Signup: React.FC = () => {
    const [formData, setFormData] = useState<SignupData>({
        aadhaarNumber: '',
        fullName: '',
        age: 0,
        password: ''
    });

    const [confirmPassword, setConfirmPassword] = useState('');

    const [formErrors, setFormErrors] = useState({
        aadhaarNumber: '',
        fullName: '',
        age: '',
        password: '',
        confirmPassword: ''
    });

    const { signup, isAuthenticated, isLoading, error, clearError } = useAuth();
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
            fullName: '',
            age: '',
            password: '',
            confirmPassword: ''
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

        // Validate full name
        if (!formData.fullName) {
            errors.fullName = 'Full name is required';
            isValid = false;
        }

        // Validate age
        if (!formData.age) {
            errors.age = 'Age is required';
            isValid = false;
        } else if (formData.age < 18) {
            errors.age = 'Must be at least 18 years old';
            isValid = false;
        }

        // Validate password
        if (!formData.password) {
            errors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        // Validate confirm password
        if (formData.password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'confirmPassword') {
            setConfirmPassword(value);
        } else if (name === 'age') {
            setFormData({
                ...formData,
                [name]: parseInt(value) || 0
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }

        // Clear error when user types
        if (error) clearError();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            await signup(formData);
        }
    };

    return (
        <Container maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8, mb: 4 }}>
                <Typography component="h1" variant="h5" align="center" gutterBottom>
                    Sign Up
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
                        id="fullName"
                        label="Full Name"
                        name="fullName"
                        autoComplete="name"
                        value={formData.fullName}
                        onChange={handleChange}
                        error={!!formErrors.fullName}
                        helperText={formErrors.fullName}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="age"
                        label="Age"
                        name="age"
                        type="number"
                        value={formData.age || ''}
                        onChange={handleChange}
                        error={!!formErrors.age}
                        helperText={formErrors.age}
                        inputProps={{ min: 18 }}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!formErrors.password}
                        helperText={formErrors.password}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={handleChange}
                        error={!!formErrors.confirmPassword}
                        helperText={formErrors.confirmPassword}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
                    </Button>

                    <Box textAlign="center">
                        <Typography variant="body2">
                            Already have an account?{' '}
                            <RouterLink to="/login">Login</RouterLink>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default Signup; 
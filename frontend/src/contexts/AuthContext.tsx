import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContextType, AuthState, SignupData, User } from '../types';
import { authService } from '../services/api';

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
    login: async () => { },
    signup: async () => { },
    logout: async () => { },
    clearError: () => { }
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        isAuthenticated: false,
        isLoading: true,
        user: null,
        error: null
    });

    useEffect(() => {
        // Check if user is already logged in (on app load)
        const loadUser = async () => {
            try {
                const response = await authService.getCurrentUser();

                if (response.success && response.data?.user) {
                    setState({
                        isAuthenticated: true,
                        isLoading: false,
                        user: response.data.user,
                        error: null
                    });
                } else {
                    setState({
                        isAuthenticated: false,
                        isLoading: false,
                        user: null,
                        error: null
                    });
                }
            } catch (error) {
                setState({
                    isAuthenticated: false,
                    isLoading: false,
                    user: null,
                    error: null
                });
            }
        };

        loadUser();
    }, []);

    // Login user
    const login = async (aadhaarNumber: string, password: string) => {
        try {
            setState({ ...state, isLoading: true, error: null });

            const response = await authService.login({ aadhaarNumber, password });

            if (response.success && response.data?.user) {
                setState({
                    isAuthenticated: true,
                    isLoading: false,
                    user: response.data.user,
                    error: null
                });
            } else {
                setState({
                    ...state,
                    isLoading: false,
                    error: response.message || 'Login failed'
                });
            }
        } catch (error: any) {
            setState({
                ...state,
                isLoading: false,
                error: error.response?.data?.message || 'Login failed'
            });
        }
    };

    // Register user
    const signup = async (userData: SignupData) => {
        try {
            setState({ ...state, isLoading: true, error: null });

            const response = await authService.signup(userData);

            if (response.success && response.data?.user) {
                setState({
                    isAuthenticated: true,
                    isLoading: false,
                    user: response.data.user,
                    error: null
                });
            } else {
                setState({
                    ...state,
                    isLoading: false,
                    error: response.message || 'Signup failed'
                });
            }
        } catch (error: any) {
            setState({
                ...state,
                isLoading: false,
                error: error.response?.data?.message || 'Signup failed'
            });
        }
    };

    // Logout user
    const logout = async () => {
        try {
            await authService.logout();

            setState({
                isAuthenticated: false,
                isLoading: false,
                user: null,
                error: null
            });
        } catch (error: any) {
            setState({
                ...state,
                error: error.response?.data?.message || 'Logout failed'
            });
        }
    };

    // Clear any errors
    const clearError = () => {
        setState({ ...state, error: null });
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                signup,
                logout,
                clearError
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}; 
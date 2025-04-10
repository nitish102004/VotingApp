// User Types
export interface User {
    _id: string;
    aadhaarNumber: string;
    fullName: string;
    age: number;
    role: 'admin' | 'voter';
    createdAt: string;
    updatedAt: string;
}

// Position Types
export interface Position {
    _id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

// Candidate Types
export interface Candidate {
    _id: string;
    name: string;
    position: string | Position;
    bio?: string;
    createdAt: string;
    updatedAt: string;
}

// Vote Types
export interface Vote {
    _id: string;
    user: string;
    candidate: string;
    position: string;
    createdAt: string;
}

// Leaderboard Types
export interface LeaderboardCandidate {
    id: string;
    name: string;
    votes: number;
}

export interface LeaderboardPosition {
    id: string;
    name: string;
    candidates: LeaderboardCandidate[];
}

// Special type for leaderboard data structure from API
export interface LeaderboardData {
    [positionId: string]: {
        candidate: string;
        count: number;
        positionName: string;
    }[];
}

// Auth Context Types
export interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: User | null;
    error: string | null;
}

export interface AuthContextType extends AuthState {
    login: (aadhaarNumber: string, password: string) => Promise<void>;
    signup: (userData: SignupData) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}

// Form Data Types
export interface SignupData {
    aadhaarNumber: string;
    fullName: string;
    age: number;
    password: string;
}

export interface LoginData {
    aadhaarNumber: string;
    password: string;
}

export interface PositionFormData {
    name: string;
    description?: string;
}

export interface CandidateFormData {
    name: string;
    position: string;
    bio?: string;
}

export interface VoteFormData {
    candidateId: string;
    positionId: string;
}

// API Response Types - Generic version that works with both object and array data
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    token?: string;
}

// Legacy API Response - Keep for backward compatibility
export interface LegacyApiResponse<T> {
    success: boolean;
    data?: {
        [key: string]: T;
    };
    message?: string;
    token?: string;
}

// Socket Events Types
export interface LeaderboardUpdateEvent {
    [positionId: string]: {
        candidate: string;
        count: number;
        positionName: string;
    }[];
} 
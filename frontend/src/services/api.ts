import axios from 'axios';
import {
    SignupData,
    LoginData,
    PositionFormData,
    CandidateFormData,
    VoteFormData,
    ApiResponse,
    User,
    Position,
    Candidate,
    Vote,
    LeaderboardPosition,
    LeaderboardData
} from '../types';

// Create axios instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Auth Services
export const authService = {
    signup: async (userData: SignupData): Promise<ApiResponse<{ user: User }>> => {
        const response = await api.post<ApiResponse<{ user: User }>>('/auth/signup', userData);
        return response.data;
    },

    login: async (loginData: LoginData): Promise<ApiResponse<{ user: User }>> => {
        const response = await api.post<ApiResponse<{ user: User }>>('/auth/login', loginData);
        return response.data;
    },

    logout: async (): Promise<ApiResponse<null>> => {
        const response = await api.post<ApiResponse<null>>('/auth/logout');
        return response.data;
    },

    getCurrentUser: async (): Promise<ApiResponse<{ user: User }>> => {
        const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
        return response.data;
    }
};

// Position Services
export const positionService = {
    getAllPositions: async (): Promise<ApiResponse<{ positions: Position[] }>> => {
        const response = await api.get<ApiResponse<{ positions: Position[] }>>('/positions');
        return response.data;
    },

    getPositionById: async (id: string): Promise<ApiResponse<Position>> => {
        const response = await api.get<ApiResponse<Position>>(`/positions/${id}`);
        return response.data;
    },

    createPosition: async (positionData: PositionFormData): Promise<ApiResponse<Position>> => {
        const response = await api.post<ApiResponse<Position>>('/positions', positionData);
        return response.data;
    },

    updatePosition: async (id: string, positionData: PositionFormData): Promise<ApiResponse<Position>> => {
        const response = await api.put<ApiResponse<Position>>(`/positions/${id}`, positionData);
        return response.data;
    },

    deletePosition: async (id: string): Promise<ApiResponse<null>> => {
        const response = await api.delete<ApiResponse<null>>(`/positions/${id}`);
        return response.data;
    }
};

// Candidate Services
export const candidateService = {
    getAllCandidates: async (positionId?: string): Promise<ApiResponse<{ candidates: Candidate[] }>> => {
        const url = positionId ? `/candidates?position=${positionId}` : '/candidates';
        const response = await api.get<ApiResponse<{ candidates: Candidate[] }>>(url);
        return response.data;
    },

    getCandidateById: async (id: string): Promise<ApiResponse<Candidate>> => {
        const response = await api.get<ApiResponse<Candidate>>(`/candidates/${id}`);
        return response.data;
    },

    createCandidate: async (candidateData: CandidateFormData): Promise<ApiResponse<Candidate>> => {
        const response = await api.post<ApiResponse<Candidate>>('/candidates', candidateData);
        return response.data;
    },

    updateCandidate: async (id: string, candidateData: CandidateFormData): Promise<ApiResponse<Candidate>> => {
        const response = await api.put<ApiResponse<Candidate>>(`/candidates/${id}`, candidateData);
        return response.data;
    },

    deleteCandidate: async (id: string): Promise<ApiResponse<null>> => {
        const response = await api.delete<ApiResponse<null>>(`/candidates/${id}`);
        return response.data;
    }
};

// Vote Services
export const voteService = {
    castVote: async (voteData: VoteFormData): Promise<ApiResponse<Vote>> => {
        const response = await api.post<ApiResponse<Vote>>('/votes', voteData);
        return response.data;
    },

    checkVoteStatus: async (positionId: string): Promise<ApiResponse<{ hasVoted: boolean, votedFor: string | null }>> => {
        const response = await api.get<ApiResponse<{ hasVoted: boolean, votedFor: string | null }>>(`/votes/status/${positionId}`);
        return response.data;
    }
};

// Leaderboard Services
export const leaderboardService = {
    getLeaderboard: async (): Promise<ApiResponse<any>> => {
        try {
            const response = await api.get<ApiResponse<any>>('/leaderboard');
            console.log("API service received leaderboard data:", response.data);
            return response.data;
        } catch (error) {
            console.error("Error in leaderboardService.getLeaderboard:", error);
            if (axios.isAxiosError(error) && error.response) {
                return {
                    success: false,
                    message: error.response.data.message || error.message
                };
            }
            return {
                success: false,
                message: error.message || 'Failed to fetch leaderboard data'
            };
        }
    }
};

export default api; 
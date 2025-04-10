import { io, Socket } from 'socket.io-client';
import { LeaderboardUpdateEvent } from '../types';

class SocketService {
    private socket: Socket | null = null;
    private listeners: { [event: string]: Function[] } = {};

    connect() {
        if (this.socket) return;

        const socketUrl = process.env.REACT_APP_API_URL
            ? process.env.REACT_APP_API_URL.replace('/api', '')
            : 'http://localhost:5000';

        this.socket = io(socketUrl, {
            withCredentials: true
        });

        this.socket.on('connect', () => {
            console.log('Socket connected');
        });

        this.socket.on('disconnect', () => {
            console.log('Socket disconnected');
        });

        // Setup leaderboard update listener
        this.socket.on('leaderboardUpdate', (data: LeaderboardUpdateEvent) => {
            if (this.listeners['leaderboardUpdate']) {
                this.listeners['leaderboardUpdate'].forEach(callback => callback(data));
            }
        });
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    // Register a callback for leaderboard updates
    onLeaderboardUpdate(callback: (data: LeaderboardUpdateEvent) => void) {
        if (!this.listeners['leaderboardUpdate']) {
            this.listeners['leaderboardUpdate'] = [];
        }
        this.listeners['leaderboardUpdate'].push(callback);

        // Return an unsubscribe function
        return () => {
            this.listeners['leaderboardUpdate'] = this.listeners['leaderboardUpdate'].filter(
                cb => cb !== callback
            );
        };
    }
}

// Export as a singleton
export default new SocketService(); 
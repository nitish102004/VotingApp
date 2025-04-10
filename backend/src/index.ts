import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import routes
import authRoutes from './routes/auth.routes';
import positionRoutes from './routes/position.routes';
import candidateRoutes from './routes/candidate.routes';
import voteRoutes from './routes/vote.routes';
import leaderboardRoutes from './routes/leaderboard.routes';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production'
            ? process.env.CLIENT_URL || 'https://your-production-domain.com'
            : process.env.CLIENT_URL || 'http://localhost:3000',
        credentials: true
    }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI as string)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    });

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.CLIENT_URL || 'https://your-production-domain.com'
        : process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

// Make io available in request
app.use((req: any, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Voting Application API');
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export { io }; 
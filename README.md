# Voting Web Application

A web application for elections where users register and are assigned roles. The first registered user becomes the sole admin who can set up positions and candidates, while all subsequent users (voters) can cast votes. A real-time leaderboard displays vote counts per position.

## Features

- **Authentication & Roles**:
  - Two roles: admin (first user only) and voter
  - Protected routes via JWT tokens stored in cookies

- **Data Models**:
  - User: Stores full name, age, Aadhaar number, password (hashed), role, timestamps
  - Position: Contains contest information
  - Candidate: Tied to a position
  - Vote: Tracks vote casting with user ID, candidate ID, position ID

- **Real-time Updates**:
  - Real-time leaderboard with Socket.io
  - Role-specific behavior (admin cannot vote, voters are limited to one vote per position)

## Technology Stack

- **Frontend**:
  - React with TypeScript
  - Material-UI for UI components
  - Context API for state management
  - React Router for routing

- **Backend**:
  - Node.js / Express
  - MongoDB with Mongoose
  - JWT for authentication
  - Socket.io for real-time updates

## Prerequisites

- Node.js (v14+)
- MongoDB Atlas account or local MongoDB instance

## Setup & Installation

### Backend Setup

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb+srv://<your-username>:<your-password>@cluster0.mongodb.net/votingapp
   JWT_SECRET=your_super_secret_key_change_this_in_production
   JWT_EXPIRES_IN=1d
   COOKIE_EXPIRES_IN=1
   ```
   Replace `<your-username>` and `<your-password>` with your MongoDB Atlas credentials.

5. Build the TypeScript code:
   ```
   npm run build
   ```

6. Run the backend server:
   ```
   npm start
   ```
   
   Or for development with hot-reloading:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the frontend directory (optional):
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Run the frontend development server:
   ```
   npm start
   ```

## Usage

1. Register as the first user to become an admin
2. As admin:
   - Create positions
   - Add candidates for each position
   - View real-time leaderboard
3. Register additional users (they will automatically be assigned the voter role)
4. As voter:
   - Cast votes for different positions
   - View real-time leaderboard

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/logout` - Logout a user
- `GET /api/auth/me` - Get current user details

### Positions

- `GET /api/positions` - Get all positions
- `GET /api/positions/:id` - Get a specific position
- `POST /api/positions` - Create a new position (admin only)
- `PUT /api/positions/:id` - Update a position (admin only)
- `DELETE /api/positions/:id` - Delete a position (admin only)

### Candidates

- `GET /api/candidates` - Get all candidates
- `GET /api/candidates?position=:positionId` - Get candidates for a position
- `GET /api/candidates/:id` - Get a specific candidate
- `POST /api/candidates` - Create a new candidate (admin only)
- `PUT /api/candidates/:id` - Update a candidate (admin only)
- `DELETE /api/candidates/:id` - Delete a candidate (admin only)

### Votes

- `POST /api/votes` - Cast a vote (voter only)
- `GET /api/votes/status/:positionId` - Check vote status for a position (voter only)

### Leaderboard

- `GET /api/leaderboard` - Get real-time vote counts 
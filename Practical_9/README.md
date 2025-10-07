# Practical 9 - Express.js Backend Server

## Overview
This is a basic Express.js server created as a proof of concept for a small product site backend. The server demonstrates clean, scalable architecture that can be extended for future features.

## Features
- ✅ Welcome message on home route (`/`)
- ✅ Health check endpoint (`/health`)
- ✅ Request logging middleware
- ✅ Error handling
- ✅ 404 route handling
- ✅ JSON parsing middleware (ready for API endpoints)

## Project Structure
```
practical_9/
├── server.js          # Main server file
├── package.json       # Project configuration
├── package-lock.json  # Dependency lock file
├── node_modules/      # Dependencies
└── README.md          # This file
```

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```
   or
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Home page: http://localhost:3000
   - Health check: http://localhost:3000/health

## API Endpoints

### GET /
- **Description:** Displays welcome message
- **Response:** `Welcome to our site`

### GET /health
- **Description:** Server health check
- **Response:** JSON object with server status, timestamp, and uptime

## Future Scalability
The server is structured to easily accommodate:
- Additional routes and controllers
- Database integration
- Authentication middleware
- API versioning
- Environment-specific configurations
- Testing framework integration

## Technologies Used
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Built-in middleware** for JSON parsing and logging

## Development Notes
- Server runs on port 3000 by default (configurable via PORT environment variable)
- Includes comprehensive error handling and logging
- Follows Express.js best practices for scalable applications
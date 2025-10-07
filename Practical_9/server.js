// Import required modules
const express = require('express');

// Create Express application instance
const app = express();

// Define port (use environment variable or default to 3000)
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON requests (for future scalability)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic logging middleware (for development)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
// Home route - displays welcome message
app.get('/', (req, res) => {
    res.send('Welcome to our site');
});

// Health check route (for future monitoring)
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        message: `The requested route ${req.originalUrl} does not exist`
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: 'Something went wrong on our end'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📝 Visit http://localhost:${PORT} to see the welcome message`);
    console.log(`🔍 Health check available at http://localhost:${PORT}/health`);
});

// Export app for testing purposes
module.exports = app;
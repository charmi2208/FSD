const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/home', (req, res) => {
    res.render('home', {
        title: 'Welcome to Our Team Dashboard',
        message: 'Hello and welcome to our team! This is your dashboard homepage.',
        teamName: 'Development Team',
        currentDate: new Date().toLocaleDateString(),
        features: [
            'Project Management',
            'Team Collaboration',
            'Performance Analytics',
            'Resource Planning'
        ]
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', {
        title: '404 - Page Not Found',
        error: {
            status: 404,
            message: 'The page you are looking for does not exist.',
            suggestion: 'Please check the URL or return to the home page.'
        }
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).render('error', {
        title: '500 - Server Error',
        error: {
            status: 500,
            message: 'Something went wrong on our end.',
            suggestion: 'Please try again later or contact support if the problem persists.'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📊 Dashboard available at http://localhost:${PORT}/home`);
    console.log(`💚 Health check at http://localhost:${PORT}/health`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
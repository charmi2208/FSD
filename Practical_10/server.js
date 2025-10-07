// Import required modules
const express = require('express');
const fs = require('fs').promises;
const path = require('path');

// Create Express application instance
const app = express();

// Define port (use environment variable or default to 3001)
const PORT = process.env.PORT || 3001;

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware for parsing requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Define logs directory path
const LOGS_DIR = path.join(__dirname, 'logs');
const logsDir = LOGS_DIR;

// Helper function to get available log files
async function getLogFiles() {
    try {
        const files = await fs.readdir(LOGS_DIR);
        return files.filter(file => file.endsWith('.log'));
    } catch (error) {
        console.error('Error reading logs directory:', error);
        return [];
    }
}

// Helper function to read log file content
async function readLogFile(filename) {
    try {
        const filePath = path.join(LOGS_DIR, filename);
        
        // Check if file exists and is accessible
        await fs.access(filePath, fs.constants.F_OK | fs.constants.R_OK);
        
        // Read file content
        const content = await fs.readFile(filePath, 'utf8');
        return { success: true, content, error: null };
    } catch (error) {
        let errorMessage = 'Unknown error occurred';
        
        if (error.code === 'ENOENT') {
            errorMessage = 'File not found';
        } else if (error.code === 'EACCES') {
            errorMessage = 'Permission denied - file is not accessible';
        } else if (error.code === 'EISDIR') {
            errorMessage = 'Path is a directory, not a file';
        } else {
            errorMessage = `File system error: ${error.message}`;
        }
        
        return { success: false, content: null, error: errorMessage };
    }
}

// Enhanced file reading with better error handling
async function readLogFileWithErrorHandling(filePath) {
    try {
        // Check if file exists and is accessible
        await fs.access(filePath, fs.constants.F_OK | fs.constants.R_OK);
        
        // Get file stats for size check
        const stats = await fs.stat(filePath);
        const maxFileSize = 50 * 1024 * 1024; // 50MB limit
        
        if (stats.size > maxFileSize) {
            const err = new Error(`File too large (${(stats.size / 1024 / 1024).toFixed(2)}MB). Maximum size is ${maxFileSize / 1024 / 1024}MB`);
            err.statusCode = 413;
            throw err;
        }
        
        // Read file content
        const content = await fs.readFile(filePath, 'utf8');
        
        return {
            content,
            stats: {
                size: stats.size,
                modified: stats.mtime,
                lines: content.split('\n').length
            }
        };
    } catch (error) {
        // Handle specific file system errors
        if (error.code === 'ENOENT') {
            const err = new Error('Log file not found');
            err.statusCode = 404;
            throw err;
        } else if (error.code === 'EACCES') {
            const err = new Error('Permission denied - cannot read log file');
            err.statusCode = 403;
            throw err;
        } else if (error.code === 'EISDIR') {
            const err = new Error('Path is a directory, not a file');
            err.statusCode = 400;
            throw err;
        } else if (error.statusCode) {
            // Re-throw errors with status codes (like file too large)
            throw error;
        } else {
            // Generic file system error
            const err = new Error(`Failed to read log file: ${error.message}`);
            err.statusCode = 500;
            throw err;
        }
    }
}

// Enhanced directory reading with error handling
async function getLogFilesWithErrorHandling(logsDir) {
    try {
        await fs.access(logsDir, fs.constants.F_OK | fs.constants.R_OK);
        const files = await fs.readdir(logsDir);
        
        const logFiles = [];
        
        for (const file of files) {
            try {
                const filePath = path.join(logsDir, file);
                const stats = await fs.stat(filePath);
                
                // Only include .txt and .log files
                if (stats.isFile() && (file.endsWith('.txt') || file.endsWith('.log'))) {
                    logFiles.push({
                        name: file,
                        path: filePath,
                        size: stats.size,
                        modified: stats.mtime,
                        type: path.extname(file).substring(1) || 'txt'
                    });
                }
            } catch (fileError) {
                console.warn(`Warning: Could not read file stats for ${file}:`, fileError.message);
                // Continue processing other files
            }
        }
        
        // Sort by modification time (newest first)
        logFiles.sort((a, b) => b.modified - a.modified);
        
        return logFiles;
    } catch (error) {
        if (error.code === 'ENOENT') {
            const err = new Error('Logs directory not found');
            err.statusCode = 404;
            throw err;
        } else if (error.code === 'EACCES') {
            const err = new Error('Permission denied - cannot access logs directory');
            err.statusCode = 403;
            throw err;
        } else {
            const err = new Error(`Failed to read logs directory: ${error.message}`);
            err.statusCode = 500;
            throw err;
        }
    }
}

// Routes

// Home route - displays available log files
app.get('/', async (req, res, next) => {
    try {
        const logFiles = await getLogFilesWithErrorHandling(logsDir);
        
        res.render('index', {
            title: 'Log Viewer - Available Files',
            files: logFiles,
            totalFiles: logFiles.length,
            totalSize: logFiles.reduce((sum, file) => sum + file.size, 0)
        });
    } catch (error) {
        next(error);
    }
});

// View specific log file
app.get('/logs/:filename', async (req, res, next) => {
    try {
        const filename = req.params.filename;
        
        // Security: Prevent directory traversal
        if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
            const err = new Error('Invalid filename - directory traversal not allowed');
            err.statusCode = 400;
            throw err;
        }
        
        // Security: Only allow .txt and .log files
        if (!filename.endsWith('.txt') && !filename.endsWith('.log')) {
            const err = new Error('Invalid file type - only .txt and .log files are allowed');
            err.statusCode = 400;
            throw err;
        }
        
        const filePath = path.join(logsDir, filename);
        const fileData = await readLogFileWithErrorHandling(filePath);
        
        // Get list of all log files for navigation
        const allFiles = await getLogFilesWithErrorHandling(logsDir);
        
        res.render('log-viewer', {
            title: `Log Viewer - ${filename}`,
            filename: filename,
            content: fileData.content,
            stats: fileData.stats,
            allFiles: allFiles,
            currentFile: filename
        });
    } catch (error) {
        next(error);
    }
});

// API endpoint to get list of log files
app.get('/api/logs', async (req, res, next) => {
    try {
        const logFiles = await getLogFilesWithErrorHandling(logsDir);
        
        res.json({
            success: true,
            files: logFiles,
            count: logFiles.length,
            totalSize: logFiles.reduce((sum, file) => sum + file.size, 0)
        });
    } catch (error) {
        next(error);
    }
});

// API endpoint to get specific log file content
app.get('/api/logs/:filename', async (req, res, next) => {
    try {
        const filename = req.params.filename;
        
        // Security checks
        if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
            const err = new Error('Invalid filename');
            err.statusCode = 400;
            throw err;
        }
        
        if (!filename.endsWith('.txt') && !filename.endsWith('.log')) {
            const err = new Error('Invalid file type');
            err.statusCode = 400;
            throw err;
        }
        
        const filePath = path.join(logsDir, filename);
        const fileData = await readLogFileWithErrorHandling(filePath);
        
        res.json({
            success: true,
            filename: filename,
            content: fileData.content,
            stats: fileData.stats
        });
    } catch (error) {
        next(error);
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0'
    });
});

// 404 handler for undefined routes
app.use((req, res, next) => {
    const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
    err.statusCode = 404;
    next(err);
});

// Request timeout middleware
app.use((req, res, next) => {
    req.setTimeout(30000, () => {
        const err = new Error('Request timeout');
        err.statusCode = 408;
        next(err);
    });
    next();
});

// Rate limiting for API endpoints
const rateLimit = {};
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100;

app.use('/api', (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!rateLimit[clientIP]) {
        rateLimit[clientIP] = { count: 1, resetTime: now + RATE_LIMIT_WINDOW };
    } else {
        if (now > rateLimit[clientIP].resetTime) {
            rateLimit[clientIP] = { count: 1, resetTime: now + RATE_LIMIT_WINDOW };
        } else {
            rateLimit[clientIP].count++;
            if (rateLimit[clientIP].count > RATE_LIMIT_MAX_REQUESTS) {
                const err = new Error('Too many requests');
                err.statusCode = 429;
                return next(err);
            }
        }
    }
    next();
});

// Enhanced error handling middleware
app.use((err, req, res, next) => {
    // Log error details
    const timestamp = new Date().toISOString();
    const errorLog = {
        timestamp,
        method: req.method,
        url: req.url,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        error: {
            message: err.message,
            stack: err.stack,
            statusCode: err.statusCode || 500
        }
    };
    
    console.error('=== ERROR LOG ===');
    console.error(JSON.stringify(errorLog, null, 2));
    console.error('================');
    
    // Determine error type and appropriate response
    const statusCode = err.statusCode || 500;
    let errorType = 'Internal Server Error';
    let userMessage = 'An unexpected error occurred';
    let suggestions = [];
    
    switch (statusCode) {
        case 400:
            errorType = 'Bad Request';
            userMessage = 'The request was invalid or malformed';
            suggestions = [
                'Check the URL format',
                'Verify request parameters',
                'Ensure proper file path syntax'
            ];
            break;
        case 403:
            errorType = 'Forbidden';
            userMessage = 'Access to this resource is forbidden';
            suggestions = [
                'Check file permissions',
                'Verify you have access to this log file',
                'Contact system administrator'
            ];
            break;
        case 404:
            errorType = 'Not Found';
            userMessage = err.message || 'The requested resource was not found';
            suggestions = [
                'Check if the log file exists',
                'Verify the file path is correct',
                'Return to the main page to see available files'
            ];
            break;
        case 408:
            errorType = 'Request Timeout';
            userMessage = 'The request took too long to process';
            suggestions = [
                'Try refreshing the page',
                'Check your internet connection',
                'The log file might be too large'
            ];
            break;
        case 413:
            errorType = 'File Too Large';
            userMessage = 'The log file is too large to display';
            suggestions = [
                'Try downloading the file instead',
                'Use command line tools for large files',
                'Contact administrator to split the log file'
            ];
            break;
        case 429:
            errorType = 'Too Many Requests';
            userMessage = 'Rate limit exceeded. Please wait before making more requests';
            suggestions = [
                'Wait a minute before trying again',
                'Reduce the frequency of requests',
                'Contact administrator if this persists'
            ];
            break;
        case 500:
        default:
            errorType = 'Internal Server Error';
            userMessage = process.env.NODE_ENV === 'production' 
                ? 'An internal server error occurred' 
                : err.message;
            suggestions = [
                'Try refreshing the page',
                'Check if the server is running properly',
                'Contact system administrator if the problem persists'
            ];
    }
    
    // Handle API requests differently
    if (req.path.startsWith('/api/')) {
        return res.status(statusCode).json({
            success: false,
            error: {
                type: errorType,
                message: userMessage,
                statusCode: statusCode,
                timestamp: timestamp,
                suggestions: suggestions
            }
        });
    }
    
    // Render error page for web requests
    res.status(statusCode).render('error', {
        title: `${statusCode} - ${errorType}`,
        error: {
            status: statusCode,
            type: errorType,
            message: userMessage,
            suggestions: suggestions,
            timestamp: timestamp,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack,
            canRetry: [408, 429, 500, 502, 503, 504].includes(statusCode),
            showDetails: process.env.NODE_ENV !== 'production'
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Log Viewer Server is running on http://localhost:${PORT}`);
    console.log(`📁 Serving log files from: ${LOGS_DIR}`);
    console.log(`🔍 Visit http://localhost:${PORT} to view available logs`);
    console.log(`💡 API endpoints available at /api/logs and /api/logs/:filename`);
});

// Export app for testing purposes
module.exports = app;
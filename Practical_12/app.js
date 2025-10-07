const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Helper function to validate if input is a number
function isValidNumber(value) {
    // Check if value exists and is not empty
    if (!value || value.trim() === '') {
        return false;
    }
    
    // Convert to number and check if it's valid
    const num = parseFloat(value.trim());
    return !isNaN(num) && isFinite(num);
}

// Helper function to perform calculations
function calculate(num1, num2, operation) {
    const a = parseFloat(num1);
    const b = parseFloat(num2);
    
    switch (operation) {
        case 'add':
            return a + b;
        case 'subtract':
            return a - b;
        case 'multiply':
            return a * b;
        case 'divide':
            if (b === 0) {
                throw new Error('Cannot divide by zero! 🚫');
            }
            return a / b;
        default:
            throw new Error('Invalid operation');
    }
}

// Routes
app.get('/', (req, res) => {
    res.render('calculator', {
        title: 'Kids Calculator 🧮',
        result: null,
        error: null,
        num1: '',
        num2: '',
        operation: '',
        showResult: false
    });
});

app.post('/calculate', (req, res) => {
    const { num1, num2, operation } = req.body;
    
    try {
        // Input validation
        if (!isValidNumber(num1)) {
            throw new Error('First number is not valid! Please enter numbers only (like 5, 10, 3.5) 🔢');
        }
        
        if (!isValidNumber(num2)) {
            throw new Error('Second number is not valid! Please enter numbers only (like 5, 10, 3.5) 🔢');
        }
        
        if (!operation) {
            throw new Error('Please select an operation! ➕➖✖️➗');
        }
        
        // Perform calculation
        const result = calculate(num1, num2, operation);
        
        // Format result for display
        let formattedResult = result;
        if (result % 1 !== 0) {
            // Round to 2 decimal places for non-integers
            formattedResult = Math.round(result * 100) / 100;
        }
        
        // Create operation symbol for display
        const operationSymbols = {
            'add': '+',
            'subtract': '-',
            'multiply': '×',
            'divide': '÷'
        };
        
        res.render('calculator', {
            title: 'Kids Calculator 🧮',
            result: formattedResult,
            error: null,
            num1: num1,
            num2: num2,
            operation: operation,
            operationSymbol: operationSymbols[operation],
            showResult: true
        });
        
    } catch (error) {
        res.render('calculator', {
            title: 'Kids Calculator 🧮',
            result: null,
            error: error.message,
            num1: num1 || '',
            num2: num2 || '',
            operation: operation || '',
            showResult: false
        });
    }
});

// Clear/Reset route
app.post('/clear', (req, res) => {
    res.redirect('/');
});

// Health check route
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Kids Calculator is working! 🎉',
        timestamp: new Date().toISOString()
    });
});

// 404 Error handler
app.use((req, res) => {
    res.status(404).render('error', {
        title: 'Page Not Found',
        status: 404,
        message: 'Oops! This page doesn\'t exist! 🤔'
    });
});

// General error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).render('error', {
        title: 'Something Went Wrong',
        status: 500,
        message: 'Don\'t worry! We\'ll fix this soon! 🔧'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('🎉 Kids Calculator is ready!');
    console.log(`🌐 Open your browser and go to: http://localhost:${PORT}`);
    console.log('🧮 Ready to help kids learn math!');
    console.log('📊 Health check available at: http://localhost:' + PORT + '/health');
});

module.exports = app;
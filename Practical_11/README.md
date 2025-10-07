# Express.js Dashboard Template

A modern, responsive dashboard template built with Express.js and EJS for team onboarding and rapid web application development.

## 🚀 Features

- **Modern Dashboard UI**: Clean, professional interface with responsive design
- **Express.js Backend**: Robust server framework with middleware support
- **EJS Templating**: Dynamic content rendering with embedded JavaScript
- **Static File Serving**: CSS, JavaScript, and asset management
- **Health Check Endpoint**: Built-in system monitoring
- **Error Handling**: Comprehensive 404 and 500 error pages
- **Mobile Responsive**: Optimized for all device sizes
- **Interactive Elements**: Smooth animations and user interactions

## 📁 Project Structure

```
practical_11/
├── app.js                 # Main Express.js server file
├── package.json           # Project dependencies and scripts
├── README.md             # Project documentation
├── views/                # EJS templates
│   └── home.ejs          # Dashboard home page template
├── public/               # Static assets
│   ├── styles.css        # Main stylesheet
│   └── script.js         # Client-side JavaScript
└── node_modules/         # Dependencies (auto-generated)
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Quick Start

1. **Clone or navigate to the project directory:**
   ```bash
   cd practical_11
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:3000
   ```

## 🌐 Available Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Redirects to `/home` |
| `/home` | GET | Main dashboard page |
| `/health` | GET | System health check (JSON response) |

## 🎨 Customization

### Modifying the Dashboard

1. **Update Content**: Edit `views/home.ejs` to customize the dashboard content
2. **Styling**: Modify `public/styles.css` for visual changes
3. **Functionality**: Add JavaScript features in `public/script.js`
4. **Server Logic**: Extend `app.js` for additional routes and middleware

### Template Variables

The home page template uses these variables (defined in `app.js`):

- `title`: Page title
- `teamName`: Organization/team name
- `message`: Welcome message
- `currentDate`: Current date and time
- `features`: Array of available features

### Adding New Routes

```javascript
// Example: Add a new route in app.js
app.get('/new-route', (req, res) => {
    res.render('new-template', {
        title: 'New Page',
        data: 'Your data here'
    });
});
```

## 🔧 Development

### Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start development server with auto-reload (if nodemon is installed)

### Installing Development Dependencies

```bash
# For auto-reload during development
npm install --save-dev nodemon

# Add to package.json scripts:
"dev": "nodemon app.js"
```

## 📱 Responsive Design

The template is fully responsive and includes:

- **Desktop**: Full-featured dashboard layout
- **Tablet**: Adapted grid layouts and navigation
- **Mobile**: Stacked layout with touch-friendly interactions

## 🛡️ Security Features

- Input validation and sanitization
- Error handling middleware
- Static file security headers
- CORS protection ready

## 🚀 Deployment

### Local Production

```bash
npm start
```

### Environment Variables

Create a `.env` file for environment-specific configurations:

```env
PORT=3000
NODE_ENV=production
TEAM_NAME=Your Team Name
```

### Docker Deployment (Optional)

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Team Onboarding

This template serves as a foundation for:

1. **New Team Members**: Familiar Express.js structure
2. **Rapid Prototyping**: Pre-built components and styling
3. **Consistent UI/UX**: Standardized design patterns
4. **Best Practices**: Error handling, routing, and project structure

## 📊 Health Monitoring

Access the health check endpoint:

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 3600,
  "message": "Server is running smoothly"
}
```

## 🎯 Next Steps

1. **Add Authentication**: Implement user login/logout
2. **Database Integration**: Connect to MongoDB, PostgreSQL, etc.
3. **API Endpoints**: Build RESTful APIs
4. **Real-time Features**: Add WebSocket support
5. **Testing**: Implement unit and integration tests

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤖 Support

For questions or issues:

1. Check the [Express.js Documentation](https://expressjs.com/)
2. Review the [EJS Documentation](https://ejs.co/)
3. Create an issue in the project repository

---

**Happy Coding! 🎉**

Built with ❤️ using Express.js, EJS, and modern web technologies.
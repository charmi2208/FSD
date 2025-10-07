# Practical 10 - Log Viewer Application

## 📋 Overview

A professional web-based log viewer application built with Express.js and EJS. This tool provides developers with an intuitive interface to view, search, and analyze server log files through a modern web interface.

## ✨ Features

- 📁 **File Browser**: Browse and view available log files in the logs directory
- 🔍 **Advanced Search**: Real-time search functionality with highlighting
- 📊 **File Information**: Display file size, modification date, and type
- 🎨 **Modern UI**: Clean, responsive design with professional styling
- ⚡ **Real-time Updates**: Auto-refresh capabilities for live log monitoring
- 📱 **Mobile Friendly**: Responsive design works on all devices
- 🔒 **Error Handling**: Comprehensive error handling for file access issues

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Template Engine**: EJS
- **Frontend**: HTML5, CSS3, JavaScript
- **Icons**: Font Awesome
- **Styling**: Modern CSS with gradients and animations

## 📁 Project Structure

```
practical_10/
├── server.js              # Main Express server
├── package.json           # Project dependencies
├── views/                 # EJS templates
│   ├── index.ejs         # Main log files listing
│   ├── log-viewer.ejs    # Individual log file viewer
│   └── error.ejs         # Error page template
├── public/               # Static assets
│   ├── styles.css        # Main stylesheet
│   └── script.js         # Client-side JavaScript
├── logs/                 # Log files directory (auto-created)
└── .gitignore           # Git ignore file
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)

### Quick Start

1. **Navigate to the project directory:**
   ```bash
   cd practical_10
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create logs directory (if not exists):**
   ```bash
   mkdir logs
   ```

4. **Add some sample log files:**
   ```bash
   echo "Sample log entry" > logs/app.log
   echo "Error log entry" > logs/error.log
   ```

5. **Start the server:**
   ```bash
   node server.js
   ```

6. **Open your browser:**
   ```
   http://localhost:3001
   ```

## 🌐 API Endpoints

### GET /
- **Description**: Main page showing available log files
- **Response**: HTML page with file listing

### GET /logs/:filename
- **Description**: View specific log file content
- **Parameters**: `filename` - Name of the log file
- **Response**: HTML page with log content and search functionality

### GET /health
- **Description**: Server health check
- **Response**: JSON with server status

## 🎯 Key Features Explained

### File Browser
- Automatically scans the `/logs` directory
- Displays file information (size, type, modification date)
- Provides direct links to view each file

### Log Viewer
- Syntax highlighting for better readability
- Search functionality with match highlighting
- Navigation between different log files
- Download capability for log files

### Search Functionality
- Real-time search as you type
- Highlights matching text
- Navigation between search results
- Case-insensitive search

## 🔧 Configuration

The server runs on port 3001 by default. You can change this by setting the PORT environment variable:

```bash
PORT=8080 node server.js
```

## 📝 Usage Examples

### Viewing Logs
1. Start the server
2. Navigate to `http://localhost:3001`
3. Click on any log file to view its contents
4. Use the search box to find specific entries

### Adding New Logs
Simply add `.log` files to the `logs/` directory and refresh the page.

## 🛡️ Security Features

- File path validation to prevent directory traversal
- Read-only access to log files
- Error handling for unauthorized file access
- Input sanitization for search queries

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Interactive Elements**: Hover effects and smooth animations
- **Loading States**: Visual feedback during operations
- **Error Messages**: User-friendly error handling

## 🔍 Troubleshooting

### Common Issues

1. **No log files showing**
   - Ensure the `logs/` directory exists
   - Add some `.log` files to the directory

2. **File access errors**
   - Check file permissions
   - Ensure files are readable by the application

3. **Port already in use**
   - Change the port using `PORT=3002 node server.js`

## 🚀 Future Enhancements

- Real-time log streaming
- Log filtering by date/level
- Export functionality
- User authentication
- Log rotation management
- Integration with logging frameworks

## 📄 License

This project is open source and available under the MIT License.

---

**Built for Developer Productivity** 🚀
# JobGenie - Government Job Portal

JobGenie is a comprehensive government job portal website similar to SarkariResult.com. It provides information about government job vacancies, exam results, admit cards, answer keys, syllabus, and more.

## Features

### User Features
- **Latest Jobs**: Browse and search for government job vacancies across various sectors
- **Results**: View exam results from different government organizations
- **Admit Cards**: Download admit cards for upcoming exams
- **Answer Keys**: Access answer keys for completed exams
- **Syllabus**: View and download syllabus for various government exams
- **Study Materials**: Access notes, ebooks, and video resources
- **Search**: Advanced search functionality to find specific information
- **Contact**: Get in touch with support team
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Theme Toggle**: Switch between light and dark modes
- **Modern UI**: Clean, professional interface with animations

### Admin Features
- **Dashboard**: Overview of all content and statistics
- **Job Management**: Add, edit, and delete job listings
- **Content Management**: Manage results, admit cards, answer keys, and syllabus
- **Study Materials**: Upload and manage educational resources
- **Important Links**: Manage external links and resources
- **Real-time Status**: Server status indicator
- **Responsive Admin Panel**: Mobile-friendly admin interface

## Technology Stack

### Frontend Technologies
- **HTML5** - Structure and markup
- **CSS3** - Styling and responsive design
  - Custom CSS modules (style.css, responsive.css, admin.css, etc.)
  - CSS Variables for theming
  - Flexbox and Grid layouts
  - CSS animations and transitions
- **Vanilla JavaScript (ES6+)** - Client-side functionality
  - Modular JavaScript architecture
  - DOM manipulation
  - API integration
  - Theme switching (light/dark mode)
  - Responsive navigation

### Backend Technologies
- **Node.js** (v14+) - Runtime environment
- **Express.js** (v4.21.2) - Web framework
- **MySQL** (v5.7+) - Database
- **MySQL2** (v3.6.1) - MySQL driver for Node.js

### External Libraries & CDNs
- **Font Awesome** (v6.4.0) - Icons
- **Particles.js** (v2.0.0) - Background animations
- **Google Fonts** - Typography (Times New Roman, etc.)

### Development Tools
- **npm** - Package management
- **Nodemon** (v3.0.1) - Development server auto-restart
- **Bash Scripts** - Server startup automation

### Architecture & Patterns
- **RESTful API** - Backend API design
- **MVC Pattern** - Separation of concerns
- **Modular JavaScript** - Organized code structure
- **Responsive Design** - Mobile-first approach
- **Progressive Enhancement** - Works without JavaScript

## Project Structure

```
eznaukri/
├── index.html                    # Homepage
├── latest-jobs.html              # Jobs listing page
├── results.html                  # Results listing page
├── admit-cards.html              # Admit cards listing page
├── answer-keys.html              # Answer keys listing page
├── syllabus.html                 # Syllabus listing page
├── study-materials.html          # Study materials page
├── search.html                   # Search page
├── contact.html                  # Contact page
├── job-details.html              # Individual job details
├── admit-card-details.html       # Individual admit card details
├── api-test.html                 # API testing page
├── css/
│   ├── style.css                 # Main stylesheet
│   ├── responsive.css            # Responsive design styles
│   ├── admin.css                 # Admin panel styles
│   ├── animations.css            # CSS animations
│   ├── job-cards.css             # Job card styles
│   ├── modern-search.css         # Search component styles
│   ├── page-headers.css          # Page header styles
│   └── section-colors.css        # Section color schemes
├── js/
│   ├── main.js                   # Main JavaScript file
│   ├── home.js                   # Homepage functionality
│   ├── jobs.js                   # Jobs page functionality
│   ├── results.js                # Results page functionality
│   ├── admit-cards.js            # Admit cards page functionality
│   ├── answer-keys.js            # Answer keys page functionality
│   ├── syllabus.js               # Syllabus page functionality
│   ├── search.js                 # Search page functionality
│   ├── contact.js                # Contact page functionality
│   ├── job-details.js            # Job details functionality
│   ├── api-service.js            # API service layer
│   ├── includes.js               # Header/footer includes
│   ├── theme-toggle.js           # Theme switching
│   ├── responsive.js             # Responsive functionality
│   ├── admin-handler.js          # Admin panel functionality
│   ├── admin-includes.js         # Admin includes
│   └── admin-responsive.js       # Admin responsive features
├── images/
│   ├── logo.webp                 # Website logo
│   ├── newlogo.png               # Alternative logo
│   ├── hero-image.png            # Hero section image
│   └── [other assets]            # Various images and icons
├── admin/
│   ├── index.html                # Admin login page
│   ├── dashboard.html            # Admin dashboard
│   ├── jobs.html                 # Admin jobs management
│   ├── results.html              # Admin results management
│   ├── admit-cards.html          # Admin admit cards management
│   ├── answer-keys.html          # Admin answer keys management
│   ├── syllabus.html             # Admin syllabus management
│   ├── study-materials.html      # Admin study materials management
│   └── admin-navbar.html         # Admin navigation
├── server/
│   ├── server.js                 # Main server file
│   ├── config.js                 # Database configuration
│   ├── db.js                     # Database connection
│   ├── init-db.js                # Database initialization
│   ├── package.json              # Server dependencies
│   └── routes/
│       ├── jobs.js               # Jobs API routes
│       ├── results.js            # Results API routes
│       ├── admitCards.js         # Admit cards API routes
│       ├── answerKeys.js         # Answer keys API routes
│       ├── syllabus.js           # Syllabus API routes
│       ├── studyMaterials.js     # Study materials API routes
│       ├── importantLinks.js     # Important links API routes
│       └── admissions.js         # Admissions API routes
├── start-server.sh               # Server startup script
├── server-status.js              # Server status checker
└── README.md                     # Project documentation
```

## How to Use

1. Clone or download the repository
2. Start the server (see Server Setup below)
3. Open `index.html` in a web browser to view the website
4. To access the admin panel, go to `admin/index.html` and log in with username: `admin` and password: `admin`

## Server Setup

The JobGenie website requires a backend server to be running to function properly. Follow these steps to set up and run the server:

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- **MySQL** (v5.7 or higher)

### Database Setup

1. **Install MySQL** and create a database:
   ```sql
   CREATE DATABASE jobgenie;
   ```

2. **Update database configuration** in `server/config.js`:
   ```javascript
   database: {
       host: 'localhost',
       user: 'your_username',
       password: 'your_password',
       database: 'jobgenie',
       port: 3306
   }
   ```

3. **Initialize the database** (optional - creates tables and sample data):
   ```bash
   cd JobGenie/server
   node init-db.js
   ```

### Starting the Server

1. Open a terminal/command prompt
2. Navigate to the server directory:
   ```
   cd JobGenie/server
   ```
3. Install dependencies (first time only):
   ```
   npm install
   ```
4. Start the server:
   ```
   node server.js
   ```
5. The server should start and display a message like:
   ```
   Server running on port 3000
   Database connected successfully
   ```

### Alternative: Using the Start Script

For convenience, you can use the provided start script:

1. Open a terminal/command prompt
2. Navigate to the JobGenie root directory:
   ```
   cd JobGenie
   ```
3. Make the script executable (Mac/Linux only):
   ```
   chmod +x start-server.sh
   ```
4. Run the script:
   ```
   ./start-server.sh
   ```

## Troubleshooting

### Server Connection Issues

If you see errors like "Failed to load resource: net::ERR_CONNECTION_REFUSED" or "Server Offline" in the admin dashboard, it means the server is not running. Make sure to start the server as described above.

### API Errors

If you see "Uncaught SyntaxError: Unexpected token '<'" errors in the console, it usually means the server is not running or is not responding correctly. Check if the server is running and restart it if necessary.

### Testing API Connection

You can use the provided API test page to check if the server is running correctly:

1. Open the file `JobGenie/api-test.html` in your browser
2. Click the "Run Test" button
3. The test will show if the API endpoints are working

## Admin Panel

The admin panel allows you to:

- Manage job listings (add, edit, delete)
- Manage results, admit cards, answer keys, and syllabus
- Add and manage study materials (notes, ebooks, videos)
- Add and manage important links

### Admin Credentials

To access the admin panel, use the following credentials:

- **Username:** admin
- **Password:** admin

These credentials are hardcoded in the `admin-handler.js` file for demonstration purposes.

### Server Status Indicator

A server status indicator is shown in the bottom-right corner of all admin pages. It shows:

- Green: Server is online and responding
- Red: Server is offline or not responding

Click on the indicator to refresh the status.

## Customization

You can customize the website by:

1. Modifying the API endpoints in `js/api-service.js`
2. Updating the styles in the CSS files
3. Adding more pages or features as needed
4. Modifying the server code in the `server` directory

## License

This project is open-source and available for personal and commercial use.

## API Endpoints

The backend provides RESTful API endpoints for all operations:

- `GET /api/jobs` - Get all jobs
- `GET /api/results` - Get all results
- `GET /api/admit-cards` - Get all admit cards
- `GET /api/answer-keys` - Get all answer keys
- `GET /api/syllabus` - Get all syllabus
- `GET /api/study-materials` - Get all study materials
- `GET /api/important-links` - Get all important links
- `GET /api/admissions` - Get all admissions

## Deployment

### Production Deployment
1. Set up a production MySQL database
2. Update `server/config.js` with production database credentials
3. Install PM2 for process management: `npm install -g pm2`
4. Start the server: `pm2 start server.js --name jobgenie`
5. Set up reverse proxy (Nginx/Apache) if needed

### Environment Variables
For production, consider using environment variables:
```bash
export DB_HOST=your_production_host
export DB_USER=your_production_user
export DB_PASSWORD=your_production_password
export DB_NAME=jobgenie
export PORT=3000
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is open-source and available for personal and commercial use.

## Credits

- **Font Awesome** (v6.4.0) for icons
- **Google Fonts** for typography
- **Particles.js** for background animations
- **Express.js** for the backend framework
- **MySQL** for database management
- Inspired by **SarkariResult.com**

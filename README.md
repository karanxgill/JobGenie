# JobGenie - Government Job Portal

JobGenie is a comprehensive government job portal website similar to SarkariResult.com. It provides information about government job vacancies, exam results, admit cards, answer keys, syllabus, and more.

## Features

- **Latest Jobs**: Browse and search for government job vacancies across various sectors
- **Results**: View exam results from different government organizations
- **Admit Cards**: Download admit cards for upcoming exams
- **Answer Keys**: Access answer keys for completed exams
- **Syllabus**: View and download syllabus for various government exams
- **Search**: Advanced search functionality to find specific information
- **Admin Panel**: Simple admin interface to manage website content

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js with Express
- **Data Storage**: JSON (stored in database)
- **API**: RESTful API for data operations

## Project Structure

```
eznaukri/
├── index.html              # Homepage
├── latest-jobs.html        # Jobs listing page
├── results.html            # Results listing page
├── admit-card.html         # Admit cards listing page
├── answer-key.html         # Answer keys listing page
├── syllabus.html           # Syllabus listing page
├── search.html             # Search page
├── contact.html            # Contact page
├── css/
│   ├── style.css           # Main stylesheet
│   ├── responsive.css      # Responsive design styles
│   └── admin.css           # Admin panel styles
├── js/
│   ├── data.js             # JSON data storage
│   ├── main.js             # Main JavaScript file
│   ├── jobs.js             # Jobs page functionality
│   ├── results.js          # Results page functionality
│   ├── admit-cards.js      # Admit cards page functionality
│   ├── answer-keys.js      # Answer keys page functionality
│   ├── syllabus.js         # Syllabus page functionality
│   ├── search.js           # Search page functionality
│   ├── contact.js          # Contact page functionality
│   ├── admin-login.js      # Admin login functionality
│   ├── admin.js            # Admin panel main functionality
│   └── admin-jobs.js       # Admin jobs management
├── images/
│   └── logo.png            # Website logo
├── admin/
│   ├── index.html          # Admin login page
│   ├── dashboard.html      # Admin dashboard
│   └── jobs.html           # Admin jobs management page
└── README.md               # Project documentation
```

## How to Use

1. Clone or download the repository
2. Start the server (see Server Setup below)
3. Open `index.html` in a web browser to view the website
4. To access the admin panel, go to `admin/index.html` and log in with username: `admin` and password: `admin`

## Server Setup

The EasyNaukri website requires a backend server to be running to function properly. Follow these steps to set up and run the server:

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Starting the Server

1. Open a terminal/command prompt
2. Navigate to the server directory:
   ```
   cd eznaukri/server
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
   ```

### Alternative: Using the Start Script

For convenience, you can use the provided start script:

1. Open a terminal/command prompt
2. Navigate to the JobGenie root directory:
   ```
   cd eznaukri
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

1. Open the file `eznaukri/api-test.html` in your browser
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

## Credits

- Font Awesome for icons
- Google Fonts for typography
- Inspired by SarkariResult.com

/**
 * Main server file for JobGenie
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const db = require('./db');
const studyMaterialsRoutes = require('./routes/studyMaterials');
const jobsRoutes = require('./routes/jobs');
const resultsRoutes = require('./routes/results');
const admitCardsRoutes = require('./routes/admitCards');
const answerKeysRoutes = require('./routes/answerKeys');
const syllabusRoutes = require('./routes/syllabus');
const importantLinksRoutes = require('./routes/importantLinks');
const admissionsRoutes = require('./routes/admissions');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the parent directory
app.use(express.static('../'));

// Routes
app.use('/api/study-materials', studyMaterialsRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/results', resultsRoutes);
app.use('/api/admit-cards', admitCardsRoutes);
app.use('/api/answer-keys', answerKeysRoutes);
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/important-links', importantLinksRoutes);
app.use('/api/admissions', admissionsRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to JobGenie API' });
});

// Start the server
async function startServer() {
    try {
        // Test database connection
        const dbConnected = await db.testConnection();
        if (!dbConnected) {
            console.error('Failed to connect to the database. Server will not start.');
            process.exit(1);
        }

        // Initialize database tables
        await db.initDatabase();

        // Start the server
        app.listen(config.server.port, () => {
            console.log(`Server is running on port ${config.server.port}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}

// Start the server
startServer();

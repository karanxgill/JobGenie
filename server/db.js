/**
 * Database connection module for JobGenie
 */

const mysql = require('mysql2/promise');
const config = require('./config');

// Create a connection pool
const pool = mysql.createPool({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test the database connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Database connection successful');
        connection.release();
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
}

// Initialize the database with required tables
async function initDatabase() {
    try {
        const connection = await pool.getConnection();

        // Create study_notes table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS study_notes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                category VARCHAR(50),
                download_link VARCHAR(255),
                featured BOOLEAN DEFAULT false,
                added_date DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create ebooks table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS ebooks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                category VARCHAR(50),
                download_link VARCHAR(255),
                featured BOOLEAN DEFAULT false,
                added_date DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create videos table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS videos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                category VARCHAR(50),
                video_link VARCHAR(255),
                thumbnail_image VARCHAR(255),
                featured BOOLEAN DEFAULT false,
                added_date DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create mock_tests table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS mock_tests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                category VARCHAR(50),
                test_link VARCHAR(255),
                featured BOOLEAN DEFAULT false,
                added_date DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);


        // Create jobs table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS jobs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                organization VARCHAR(255) NOT NULL,
                category VARCHAR(50),
                location VARCHAR(100),
                start_date DATE,
                last_date DATE,
                description TEXT,
                vacancies INT,
                qualification VARCHAR(255),
                age_limit VARCHAR(100),
                application_fee VARCHAR(255),
                apply_link VARCHAR(255),
                status ENUM('active', 'upcoming', 'expired') DEFAULT 'active',
                featured BOOLEAN DEFAULT false,
                posted_date DATE DEFAULT (CURRENT_DATE)
            )
        `);

        // Create results table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS results (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                organization VARCHAR(255) NOT NULL,
                category VARCHAR(50),
                result_date DATE,
                description TEXT,
                result_link VARCHAR(255),
                featured BOOLEAN DEFAULT false,
                added_date DATE DEFAULT (CURRENT_DATE)
            )
        `);

        // Create admit_cards table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS admit_cards (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                organization VARCHAR(255) NOT NULL,
                category VARCHAR(50),
                exam_date DATE,
                release_date DATE,
                description TEXT,
                download_link VARCHAR(255),
                featured BOOLEAN DEFAULT false,
                added_date DATE DEFAULT (CURRENT_DATE)
            )
        `);

        // Create answer_keys table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS answer_keys (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                organization VARCHAR(255) NOT NULL,
                category VARCHAR(50),
                exam_date DATE,
                release_date DATE,
                description TEXT,
                download_link VARCHAR(255),
                featured BOOLEAN DEFAULT false,
                added_date DATE DEFAULT (CURRENT_DATE)
            )
        `);

        // Create syllabus table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS syllabus (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                organization VARCHAR(255) NOT NULL,
                category VARCHAR(50),
                release_date DATE,
                description TEXT,
                download_link VARCHAR(255),
                featured BOOLEAN DEFAULT false,
                added_date DATE DEFAULT (CURRENT_DATE)
            )
        `);

        // Create important_links table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS important_links (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                link VARCHAR(255) NOT NULL,
                featured BOOLEAN DEFAULT false,
                added_date DATE DEFAULT (CURRENT_DATE)
            )
        `);

        // Create admissions table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS admissions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                organization VARCHAR(255) NOT NULL,
                category VARCHAR(50),
                start_date DATE,
                last_date DATE,
                description TEXT,
                apply_link VARCHAR(255),
                featured BOOLEAN DEFAULT false,
                added_date DATE DEFAULT (CURRENT_DATE)
            )
        `);

        console.log('Database tables created successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('Error initializing database:', error);
        return false;
    }
}

// Export the pool and helper functions
module.exports = {
    pool,
    testConnection,
    initDatabase
};

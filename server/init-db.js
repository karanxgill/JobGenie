/**
 * Database initialization script for JobGenie
 * This script will create the database and tables, and populate them with sample data
 */

const mysql = require('mysql2/promise');
const config = require('./config');

// Sample data
const sampleData = {
    notes: [
        {
            title: 'SSC CGL Study Notes',
            description: 'Comprehensive study notes for SSC CGL exam preparation',
            category: 'ssc',
            download_link: 'https://example.com/notes/ssc-cgl.pdf',
            featured: true
        },
        {
            title: 'UPSC Preparation Strategy',
            description: 'Detailed strategy and notes for UPSC Civil Services Examination',
            category: 'upsc',
            download_link: 'https://example.com/notes/upsc-strategy.pdf',
            featured: true
        }
    ],

    jobs: [
        {
            title: "UPSC Civil Services 2025",
            organization: "Union Public Service Commission",
            category: "central",
            location: "All India",
            start_date: "2025-05-01",
            last_date: "2025-05-31",
            description: "Applications are invited for Civil Services Examination 2025 for recruitment to various services and posts in the Government of India.",
            vacancies: 712,
            qualification: "Bachelor's Degree from a recognized University",
            age_limit: "21-32 years",
            application_fee: "₹100 for General/OBC, Free for SC/ST/PwD/Women",
            apply_link: "https://www.upsc.gov.in/",
            status: "active",
            featured: true,
            posted_date: "2025-04-15"
        },
        {
            title: "SSC CGL 2025",
            organization: "Staff Selection Commission",
            category: "central",
            location: "All India",
            start_date: "2025-04-15",
            last_date: "2025-05-15",
            description: "Staff Selection Commission Combined Graduate Level Examination 2025 for recruitment to various Group B and Group C posts.",
            vacancies: 7500,
            qualification: "Bachelor's Degree from a recognized University",
            age_limit: "18-32 years",
            application_fee: "₹100 for General/OBC, Free for SC/ST/PwD/Women",
            apply_link: "https://ssc.nic.in/",
            status: "active",
            featured: true,
            posted_date: "2025-04-10"
        },
        {
            title: "IBPS PO 2025",
            organization: "Institute of Banking Personnel Selection",
            category: "banking",
            location: "All India",
            start_date: "2025-05-10",
            last_date: "2025-06-10",
            description: "IBPS Probationary Officer Recruitment 2025 for various Public Sector Banks across India.",
            vacancies: 4500,
            qualification: "Bachelor's Degree from a recognized University",
            age_limit: "20-30 years",
            application_fee: "₹850 for General/OBC/EWS, ₹175 for SC/ST/PwD",
            apply_link: "https://www.ibps.in/",
            status: "upcoming",
            featured: true,
            posted_date: "2025-04-20"
        }
    ],
    results: [
        {
            title: "UPSC Civil Services 2024 Final Result",
            organization: "Union Public Service Commission",
            category: "central",
            result_date: "2025-04-10",
            description: "Final Result for Civil Services Examination 2024.",
            result_link: "https://www.upsc.gov.in/",
            featured: true
        },
        {
            title: "SSC CGL 2024 Final Result",
            organization: "Staff Selection Commission",
            category: "central",
            result_date: "2025-04-15",
            description: "Final Result for Combined Graduate Level Examination 2024.",
            result_link: "https://ssc.nic.in/",
            featured: true
        },
        {
            title: "IBPS PO 2024 Final Result",
            organization: "Institute of Banking Personnel Selection",
            category: "banking",
            result_date: "2025-04-05",
            description: "Final Result for Probationary Officer Examination 2024.",
            result_link: "https://www.ibps.in/",
            featured: false
        }
    ],
    admitCards: [
        {
            title: "UPSC Civil Services 2025 Prelims Admit Card",
            organization: "Union Public Service Commission",
            category: "central",
            exam_date: "2025-06-15",
            release_date: "2025-05-20",
            description: "Admit Card for Civil Services Preliminary Examination 2025.",
            download_link: "https://www.upsc.gov.in/",
            featured: true
        },
        {
            title: "SSC CGL 2025 Tier I Admit Card",
            organization: "Staff Selection Commission",
            category: "central",
            exam_date: "2025-06-10",
            release_date: "2025-05-25",
            description: "Admit Card for Combined Graduate Level Examination Tier I 2025.",
            download_link: "https://ssc.nic.in/",
            featured: true
        },
        {
            title: "NEET UG 2025 Admit Card",
            organization: "National Testing Agency",
            category: "teaching",
            exam_date: "2025-05-05",
            release_date: "2025-04-25",
            description: "Admit Card for National Eligibility cum Entrance Test for Undergraduate Medical Courses 2025.",
            download_link: "https://neet.nta.nic.in/",
            featured: true
        }
    ],
    answerKeys: [
        {
            title: "UPSC Civil Services 2025 Prelims Answer Key",
            organization: "Union Public Service Commission",
            category: "central",
            exam_date: "2025-06-15",
            release_date: "2025-06-20",
            description: "Answer Key for Civil Services Preliminary Examination 2025.",
            download_link: "https://www.upsc.gov.in/",
            featured: true
        },
        {
            title: "SSC CGL 2025 Tier I Answer Key",
            organization: "Staff Selection Commission",
            category: "central",
            exam_date: "2025-06-10",
            release_date: "2025-06-15",
            description: "Answer Key for Combined Graduate Level Examination Tier I 2025.",
            download_link: "https://ssc.nic.in/",
            featured: true
        }
    ],
    syllabus: [
        {
            title: "UPSC Civil Services Syllabus 2025",
            organization: "Union Public Service Commission",
            category: "central",
            release_date: "2025-04-01",
            description: "Detailed Syllabus for Civil Services Examination 2025.",
            download_link: "https://www.upsc.gov.in/",
            featured: true
        },
        {
            title: "SSC CGL Syllabus 2025",
            organization: "Staff Selection Commission",
            category: "central",
            release_date: "2025-04-05",
            description: "Detailed Syllabus for Combined Graduate Level Examination 2025.",
            download_link: "https://ssc.nic.in/",
            featured: true
        },
        {
            title: "IBPS PO Syllabus 2025",
            organization: "Institute of Banking Personnel Selection",
            category: "banking",
            release_date: "2025-04-10",
            description: "Detailed Syllabus for Probationary Officer Examination 2025.",
            download_link: "https://www.ibps.in/",
            featured: false
        }
    ],
    importantLinks: [
        {
            title: "MP Rojgar Panjiyan 2025",
            description: "Madhya Pradesh Employment Registration Portal 2025.",
            link: "https://mprojgar.gov.in/",
            featured: true
        },
        {
            title: "UP Scholarship Online Form 2025",
            description: "Uttar Pradesh Scholarship Application Portal 2025.",
            link: "https://scholarship.up.gov.in/",
            featured: true
        },
        {
            title: "SSC OTR Online Form 2025",
            description: "Staff Selection Commission One Time Registration Portal 2025.",
            link: "https://ssc.nic.in/",
            featured: true
        }
    ],
    admissions: [
        {
            title: "JEE Advanced 2025 Online Form",
            organization: "Indian Institute of Technology",
            category: "engineering",
            start_date: "2025-04-15",
            last_date: "2025-05-15",
            description: "Online Application for Joint Entrance Examination (Advanced) 2025.",
            apply_link: "https://jeeadv.ac.in/",
            featured: true
        },
        {
            title: "NEET PG 2025 Online Form",
            organization: "National Board of Examinations",
            category: "medical",
            start_date: "2025-04-10",
            last_date: "2025-05-10",
            description: "Online Application for National Eligibility cum Entrance Test for Postgraduate Medical Courses 2025.",
            apply_link: "https://nbe.edu.in/",
            featured: true
        },
        {
            title: "UP Polytechnic JEECUP 2025 Online Form",
            organization: "Joint Entrance Examination Council, Uttar Pradesh",
            category: "engineering",
            start_date: "2025-04-01",
            last_date: "2025-04-30",
            description: "Online Application for Joint Entrance Examination for Polytechnic 2025.",
            apply_link: "https://jeecup.admissions.nic.in/",
            featured: true
        }
    ],
    ebooks: [
        {
            title: 'Banking Awareness E-Book',
            description: 'Complete e-book for banking awareness for all banking exams',
            category: 'banking',
            download_link: 'https://example.com/ebooks/banking-awareness.pdf',
            featured: true
        },
        {
            title: 'General Knowledge Compendium',
            description: 'Comprehensive e-book covering all aspects of general knowledge',
            category: 'gk',
            download_link: 'https://example.com/ebooks/gk-compendium.pdf',
            featured: false
        }
    ],
    videos: [
        {
            title: 'Resume Building Masterclass',
            description: 'Learn how to create a professional resume that stands out',
            category: 'resume',
            video_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            thumbnail_image: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            featured: true
        },
        {
            title: 'Interview Preparation Guide',
            description: 'Tips and tricks for acing your job interview',
            category: 'interview',
            video_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            thumbnail_image: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            featured: true
        },
        {
            title: 'UPSC Preparation Strategy',
            description: 'Comprehensive strategy for UPSC preparation',
            category: 'upsc',
            video_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            thumbnail_image: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            featured: true
        },
        {
            title: 'Banking Exam Tips',
            description: 'Tips and tricks for banking exams',
            category: 'banking',
            video_link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            thumbnail_image: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            featured: true
        },
        {
            title: 'Test YouTube Short URL',
            description: 'This is a test video with a short YouTube URL',
            category: 'test',
            video_link: 'https://youtu.be/dQw4w9WgXcQ',
            thumbnail_image: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            featured: true
        }
    ],
    mockTests: [
        {
            title: 'SSC CGL Mock Test',
            description: 'Practice mock test for SSC CGL examination',
            category: 'ssc',
            test_link: 'https://example.com/mock-tests/ssc-cgl',
            featured: true
        },
        {
            title: 'Banking PO Mock Test',
            description: 'Practice mock test for Banking PO examination',
            category: 'banking',
            test_link: 'https://example.com/mock-tests/banking-po',
            featured: false
        }
    ]
};

// Initialize the database
async function initializeDatabase() {
    let connection;

    try {
        // Create connection without database
        connection = await mysql.createConnection({
            host: config.database.host,
            user: config.database.user,
            password: config.database.password,
            port: config.database.port
        });

        console.log('Connected to MySQL server');

        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.database.database}`);
        console.log(`Database '${config.database.database}' created or already exists`);

        // Use the database
        await connection.query(`USE ${config.database.database}`);

        // Create tables
        await createTables(connection);

        // Insert sample data
        await insertSampleData(connection);

        console.log('Database initialization completed successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed');
        }
    }
}

// Create tables
async function createTables(connection) {
    try {
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
        console.log('Table study_notes created or already exists');

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
        console.log('Table ebooks created or already exists');

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
        console.log('Table videos created or already exists');

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
        console.log('Table mock_tests created or already exists');


    } catch (error) {
        console.error('Error creating tables:', error);
        throw error;
    }
}

// Insert sample data
async function insertSampleData(connection) {
    try {
        // Check if tables are empty
        const [notesCount] = await connection.query('SELECT COUNT(*) as count FROM study_notes');
        const [ebooksCount] = await connection.query('SELECT COUNT(*) as count FROM ebooks');
        const [videosCount] = await connection.query('SELECT COUNT(*) as count FROM videos');
        const [mockTestsCount] = await connection.query('SELECT COUNT(*) as count FROM mock_tests');

        // Insert sample notes if table is empty
        if (notesCount[0].count === 0) {
            for (const note of sampleData.notes) {
                await connection.query(
                    'INSERT INTO study_notes (title, description, category, download_link, featured) VALUES (?, ?, ?, ?, ?)',
                    [note.title, note.description, note.category, note.download_link, note.featured]
                );
            }
            console.log(`Inserted ${sampleData.notes.length} sample notes`);
        } else {
            console.log('Table study_notes already has data, skipping sample data insertion');
        }

        // Insert sample ebooks if table is empty
        if (ebooksCount[0].count === 0) {
            for (const ebook of sampleData.ebooks) {
                await connection.query(
                    'INSERT INTO ebooks (title, description, category, download_link, featured) VALUES (?, ?, ?, ?, ?)',
                    [ebook.title, ebook.description, ebook.category, ebook.download_link, ebook.featured]
                );
            }
            console.log(`Inserted ${sampleData.ebooks.length} sample ebooks`);
        } else {
            console.log('Table ebooks already has data, skipping sample data insertion');
        }

        // Insert sample videos if table is empty
        if (videosCount[0].count === 0) {
            for (const video of sampleData.videos) {
                await connection.query(
                    'INSERT INTO videos (title, description, category, video_link, thumbnail_image, featured) VALUES (?, ?, ?, ?, ?, ?)',
                    [video.title, video.description, video.category, video.video_link, video.thumbnail_image, video.featured]
                );
            }
            console.log(`Inserted ${sampleData.videos.length} sample videos`);
        } else {
            console.log('Table videos already has data, skipping sample data insertion');
        }

        // Insert sample mock tests if table is empty
        if (mockTestsCount[0].count === 0) {
            for (const test of sampleData.mockTests) {
                await connection.query(
                    'INSERT INTO mock_tests (title, description, category, test_link, featured) VALUES (?, ?, ?, ?, ?)',
                    [test.title, test.description, test.category, test.test_link, test.featured]
                );
            }
            console.log(`Inserted ${sampleData.mockTests.length} sample mock tests`);
        } else {
            console.log('Table mock_tests already has data, skipping sample data insertion');
        }



        // Check if jobs table is empty
        const [jobsCount] = await connection.query('SELECT COUNT(*) as count FROM jobs');

        // Insert sample jobs if table is empty
        if (jobsCount[0].count === 0) {
            for (const job of sampleData.jobs) {
                await connection.query(
                    `INSERT INTO jobs (
                        title, organization, category, location, start_date, last_date,
                        description, vacancies, qualification, age_limit, application_fee,
                        apply_link, status, featured, posted_date
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        job.title, job.organization, job.category, job.location,
                        job.start_date, job.last_date, job.description, job.vacancies,
                        job.qualification, job.age_limit, job.application_fee,
                        job.apply_link, job.status, job.featured, job.posted_date
                    ]
                );
            }
            console.log(`Inserted ${sampleData.jobs.length} sample jobs`);
        } else {
            console.log('Table jobs already has data, skipping sample data insertion');
        }

        // Check if results table is empty
        const [resultsCount] = await connection.query('SELECT COUNT(*) as count FROM results');

        // Insert sample results if table is empty
        if (resultsCount[0].count === 0) {
            for (const result of sampleData.results) {
                await connection.query(
                    `INSERT INTO results (
                        title, organization, category, result_date, description,
                        result_link, featured
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [
                        result.title, result.organization, result.category,
                        result.result_date, result.description, result.result_link,
                        result.featured
                    ]
                );
            }
            console.log(`Inserted ${sampleData.results.length} sample results`);
        } else {
            console.log('Table results already has data, skipping sample data insertion');
        }

        // Check if admit_cards table is empty
        const [admitCardsCount] = await connection.query('SELECT COUNT(*) as count FROM admit_cards');

        // Insert sample admit cards if table is empty
        if (admitCardsCount[0].count === 0) {
            for (const admitCard of sampleData.admitCards) {
                await connection.query(
                    `INSERT INTO admit_cards (
                        title, organization, category, exam_date, release_date,
                        description, download_link, featured
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        admitCard.title, admitCard.organization, admitCard.category,
                        admitCard.exam_date, admitCard.release_date, admitCard.description,
                        admitCard.download_link, admitCard.featured
                    ]
                );
            }
            console.log(`Inserted ${sampleData.admitCards.length} sample admit cards`);
        } else {
            console.log('Table admit_cards already has data, skipping sample data insertion');
        }

        // Check if answer_keys table is empty
        const [answerKeysCount] = await connection.query('SELECT COUNT(*) as count FROM answer_keys');

        // Insert sample answer keys if table is empty
        if (answerKeysCount[0].count === 0) {
            for (const answerKey of sampleData.answerKeys) {
                await connection.query(
                    `INSERT INTO answer_keys (
                        title, organization, category, exam_date, release_date,
                        description, download_link, featured
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        answerKey.title, answerKey.organization, answerKey.category,
                        answerKey.exam_date, answerKey.release_date, answerKey.description,
                        answerKey.download_link, answerKey.featured
                    ]
                );
            }
            console.log(`Inserted ${sampleData.answerKeys.length} sample answer keys`);
        } else {
            console.log('Table answer_keys already has data, skipping sample data insertion');
        }

        // Check if syllabus table is empty
        const [syllabusCount] = await connection.query('SELECT COUNT(*) as count FROM syllabus');

        // Insert sample syllabus if table is empty
        if (syllabusCount[0].count === 0) {
            for (const syllabusItem of sampleData.syllabus) {
                await connection.query(
                    `INSERT INTO syllabus (
                        title, organization, category, release_date, description,
                        download_link, featured
                    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [
                        syllabusItem.title, syllabusItem.organization, syllabusItem.category,
                        syllabusItem.release_date, syllabusItem.description,
                        syllabusItem.download_link, syllabusItem.featured
                    ]
                );
            }
            console.log(`Inserted ${sampleData.syllabus.length} sample syllabus items`);
        } else {
            console.log('Table syllabus already has data, skipping sample data insertion');
        }

        // Check if important_links table is empty
        const [importantLinksCount] = await connection.query('SELECT COUNT(*) as count FROM important_links');

        // Insert sample important links if table is empty
        if (importantLinksCount[0].count === 0) {
            for (const importantLink of sampleData.importantLinks) {
                await connection.query(
                    `INSERT INTO important_links (
                        title, description, link, featured
                    ) VALUES (?, ?, ?, ?)`,
                    [
                        importantLink.title, importantLink.description,
                        importantLink.link, importantLink.featured
                    ]
                );
            }
            console.log(`Inserted ${sampleData.importantLinks.length} sample important links`);
        } else {
            console.log('Table important_links already has data, skipping sample data insertion');
        }

        // Check if admissions table is empty
        const [admissionsCount] = await connection.query('SELECT COUNT(*) as count FROM admissions');

        // Insert sample admissions if table is empty
        if (admissionsCount[0].count === 0) {
            for (const admission of sampleData.admissions) {
                await connection.query(
                    `INSERT INTO admissions (
                        title, organization, category, start_date, last_date,
                        description, apply_link, featured
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        admission.title, admission.organization, admission.category,
                        admission.start_date, admission.last_date, admission.description,
                        admission.apply_link, admission.featured
                    ]
                );
            }
            console.log(`Inserted ${sampleData.admissions.length} sample admissions`);
        } else {
            console.log('Table admissions already has data, skipping sample data insertion');
        }
    } catch (error) {
        console.error('Error inserting sample data:', error);
        throw error;
    }
}

// Run the initialization
initializeDatabase();

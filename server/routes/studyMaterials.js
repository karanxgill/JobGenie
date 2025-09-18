/**
 * Study materials routes for JobGenie
 */

const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * Get all study notes
 */
router.get('/notes', async (req, res) => {
    try {
        const [rows] = await db.pool.query('SELECT * FROM study_notes ORDER BY added_date DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching study notes:', error);
        res.status(500).json({ message: 'Error fetching study notes', error: error.message });
    }
});

/**
 * Get a study note by ID
 */
router.get('/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.pool.query('SELECT * FROM study_notes WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Study note not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching study note:', error);
        res.status(500).json({ message: 'Error fetching study note', error: error.message });
    }
});

/**
 * Get all ebooks
 */
router.get('/ebooks', async (req, res) => {
    try {
        const [rows] = await db.pool.query('SELECT * FROM ebooks ORDER BY added_date DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching ebooks:', error);
        res.status(500).json({ message: 'Error fetching ebooks', error: error.message });
    }
});

/**
 * Get an ebook by ID
 */
router.get('/ebooks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.pool.query('SELECT * FROM ebooks WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Ebook not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching ebook:', error);
        res.status(500).json({ message: 'Error fetching ebook', error: error.message });
    }
});

/**
 * Get all videos
 */
router.get('/videos', async (req, res) => {
    try {
        const [rows] = await db.pool.query('SELECT * FROM videos ORDER BY added_date DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ message: 'Error fetching videos', error: error.message });
    }
});

/**
 * Get a video by ID
 */
router.get('/videos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.pool.query('SELECT * FROM videos WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Video not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching video:', error);
        res.status(500).json({ message: 'Error fetching video', error: error.message });
    }
});

/**
 * Get all mock tests
 */
router.get('/mock-tests', async (req, res) => {
    try {
        const [rows] = await db.pool.query('SELECT * FROM mock_tests ORDER BY added_date DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching mock tests:', error);
        res.status(500).json({ message: 'Error fetching mock tests', error: error.message });
    }
});

/**
 * Get a mock test by ID
 */
router.get('/mock-tests/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.pool.query('SELECT * FROM mock_tests WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Mock test not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching mock test:', error);
        res.status(500).json({ message: 'Error fetching mock test', error: error.message });
    }
});

/**
 * Add a new study note
 */
router.post('/notes', async (req, res) => {
    try {
        const { title, description, category, download_link, featured } = req.body;

        const [result] = await db.pool.query(
            'INSERT INTO study_notes (title, description, category, download_link, featured) VALUES (?, ?, ?, ?, ?)',
            [title, description, category, download_link, featured || false]
        );

        res.status(201).json({
            id: result.insertId,
            message: 'Study note added successfully'
        });
    } catch (error) {
        console.error('Error adding study note:', error);
        res.status(500).json({ message: 'Error adding study note', error: error.message });
    }
});

/**
 * Add a new ebook
 */
router.post('/ebooks', async (req, res) => {
    try {
        const { title, description, category, download_link, featured } = req.body;

        const [result] = await db.pool.query(
            'INSERT INTO ebooks (title, description, category, download_link, featured) VALUES (?, ?, ?, ?, ?)',
            [title, description, category, download_link, featured || false]
        );

        res.status(201).json({
            id: result.insertId,
            message: 'Ebook added successfully'
        });
    } catch (error) {
        console.error('Error adding ebook:', error);
        res.status(500).json({ message: 'Error adding ebook', error: error.message });
    }
});

/**
 * Add a new video
 */
router.post('/videos', async (req, res) => {
    try {
        const { title, description, category, video_link, thumbnail_image, featured } = req.body;

        const [result] = await db.pool.query(
            'INSERT INTO videos (title, description, category, video_link, thumbnail_image, featured) VALUES (?, ?, ?, ?, ?, ?)',
            [title, description, category, video_link, thumbnail_image, featured || false]
        );

        res.status(201).json({
            id: result.insertId,
            message: 'Video added successfully'
        });
    } catch (error) {
        console.error('Error adding video:', error);
        res.status(500).json({ message: 'Error adding video', error: error.message });
    }
});

/**
 * Add a new mock test
 */
router.post('/mock-tests', async (req, res) => {
    try {
        const { title, description, category, test_link, featured } = req.body;

        const [result] = await db.pool.query(
            'INSERT INTO mock_tests (title, description, category, test_link, featured) VALUES (?, ?, ?, ?, ?)',
            [title, description, category, test_link, featured || false]
        );

        res.status(201).json({
            id: result.insertId,
            message: 'Mock test added successfully'
        });
    } catch (error) {
        console.error('Error adding mock test:', error);
        res.status(500).json({ message: 'Error adding mock test', error: error.message });
    }
});

/**
 * Update a study note
 */
router.put('/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, download_link, featured } = req.body;

        const [result] = await db.pool.query(
            'UPDATE study_notes SET title = ?, description = ?, category = ?, download_link = ?, featured = ? WHERE id = ?',
            [title, description, category, download_link, featured || false, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Study note not found' });
        }

        res.json({ message: 'Study note updated successfully' });
    } catch (error) {
        console.error('Error updating study note:', error);
        res.status(500).json({ message: 'Error updating study note', error: error.message });
    }
});

/**
 * Update an ebook
 */
router.put('/ebooks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, download_link, featured } = req.body;

        const [result] = await db.pool.query(
            'UPDATE ebooks SET title = ?, description = ?, category = ?, download_link = ?, featured = ? WHERE id = ?',
            [title, description, category, download_link, featured || false, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Ebook not found' });
        }

        res.json({ message: 'Ebook updated successfully' });
    } catch (error) {
        console.error('Error updating ebook:', error);
        res.status(500).json({ message: 'Error updating ebook', error: error.message });
    }
});

/**
 * Update a video
 */
router.put('/videos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, video_link, thumbnail_image, featured } = req.body;

        const [result] = await db.pool.query(
            'UPDATE videos SET title = ?, description = ?, category = ?, video_link = ?, thumbnail_image = ?, featured = ? WHERE id = ?',
            [title, description, category, video_link, thumbnail_image, featured || false, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Video not found' });
        }

        res.json({ message: 'Video updated successfully' });
    } catch (error) {
        console.error('Error updating video:', error);
        res.status(500).json({ message: 'Error updating video', error: error.message });
    }
});

/**
 * Update a mock test
 */
router.put('/mock-tests/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, test_link, featured } = req.body;

        const [result] = await db.pool.query(
            'UPDATE mock_tests SET title = ?, description = ?, category = ?, test_link = ?, featured = ? WHERE id = ?',
            [title, description, category, test_link, featured || false, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Mock test not found' });
        }

        res.json({ message: 'Mock test updated successfully' });
    } catch (error) {
        console.error('Error updating mock test:', error);
        res.status(500).json({ message: 'Error updating mock test', error: error.message });
    }
});

/**
 * Delete a study note
 */
router.delete('/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.pool.query('DELETE FROM study_notes WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Study note not found' });
        }

        res.json({ message: 'Study note deleted successfully' });
    } catch (error) {
        console.error('Error deleting study note:', error);
        res.status(500).json({ message: 'Error deleting study note', error: error.message });
    }
});

/**
 * Delete an ebook
 */
router.delete('/ebooks/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.pool.query('DELETE FROM ebooks WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Ebook not found' });
        }

        res.json({ message: 'Ebook deleted successfully' });
    } catch (error) {
        console.error('Error deleting ebook:', error);
        res.status(500).json({ message: 'Error deleting ebook', error: error.message });
    }
});

/**
 * Delete a video
 */
router.delete('/videos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.pool.query('DELETE FROM videos WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Video not found' });
        }

        res.json({ message: 'Video deleted successfully' });
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).json({ message: 'Error deleting video', error: error.message });
    }
});

/**
 * Delete a mock test
 */
router.delete('/mock-tests/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.pool.query('DELETE FROM mock_tests WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Mock test not found' });
        }

        res.json({ message: 'Mock test deleted successfully' });
    } catch (error) {
        console.error('Error deleting mock test:', error);
        res.status(500).json({ message: 'Error deleting mock test', error: error.message });
    }
});

module.exports = router;

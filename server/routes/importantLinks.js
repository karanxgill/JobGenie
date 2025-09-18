/**
 * Important Links routes for JobGenie
 */

const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * Get all important links
 * Optional query parameters:
 * - featured: Filter by featured status (true/false)
 */
router.get('/', async (req, res) => {
    try {
        let query = 'SELECT * FROM important_links';
        const queryParams = [];
        const conditions = [];
        
        // Add featured filter if provided
        if (req.query.featured !== undefined) {
            conditions.push('featured = ?');
            queryParams.push(req.query.featured === 'true');
        }
        
        // Add WHERE clause if conditions exist
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        // Add ORDER BY clause
        query += ' ORDER BY added_date DESC';
        
        const [rows] = await db.pool.query(query, queryParams);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching important links:', error);
        res.status(500).json({ message: 'Error fetching important links', error: error.message });
    }
});

/**
 * Get an important link by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await db.pool.query('SELECT * FROM important_links WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Important link not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching important link:', error);
        res.status(500).json({ message: 'Error fetching important link', error: error.message });
    }
});

/**
 * Add a new important link
 */
router.post('/', async (req, res) => {
    try {
        const { 
            title, description, link, featured
        } = req.body;
        
        // Validate required fields
        if (!title || !link) {
            return res.status(400).json({ message: 'Title and link are required' });
        }
        
        const [result] = await db.pool.query(
            `INSERT INTO important_links (
                title, description, link, featured
            ) VALUES (?, ?, ?, ?)`,
            [
                title, description, link, featured || false
            ]
        );
        
        res.status(201).json({ 
            id: result.insertId,
            message: 'Important link added successfully' 
        });
    } catch (error) {
        console.error('Error adding important link:', error);
        res.status(500).json({ message: 'Error adding important link', error: error.message });
    }
});

/**
 * Update an important link
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            title, description, link, featured
        } = req.body;
        
        // Validate required fields
        if (!title || !link) {
            return res.status(400).json({ message: 'Title and link are required' });
        }
        
        const [result] = await db.pool.query(
            `UPDATE important_links SET 
                title = ?, description = ?, link = ?, featured = ?
            WHERE id = ?`,
            [
                title, description, link, featured, id
            ]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Important link not found' });
        }
        
        res.json({ message: 'Important link updated successfully' });
    } catch (error) {
        console.error('Error updating important link:', error);
        res.status(500).json({ message: 'Error updating important link', error: error.message });
    }
});

/**
 * Delete an important link
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await db.pool.query('DELETE FROM important_links WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Important link not found' });
        }
        
        res.json({ message: 'Important link deleted successfully' });
    } catch (error) {
        console.error('Error deleting important link:', error);
        res.status(500).json({ message: 'Error deleting important link', error: error.message });
    }
});

module.exports = router;

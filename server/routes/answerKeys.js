/**
 * Answer Keys routes for JobGenie
 */

const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * Get all answer keys
 * Optional query parameters:
 * - category: Filter by category
 * - featured: Filter by featured status (true/false)
 */
router.get('/', async (req, res) => {
    try {
        let query = 'SELECT * FROM answer_keys';
        const queryParams = [];
        const conditions = [];
        
        // Add category filter if provided
        if (req.query.category) {
            conditions.push('category = ?');
            queryParams.push(req.query.category);
        }
        
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
        query += ' ORDER BY release_date DESC';
        
        const [rows] = await db.pool.query(query, queryParams);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching answer keys:', error);
        res.status(500).json({ message: 'Error fetching answer keys', error: error.message });
    }
});

/**
 * Get an answer key by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await db.pool.query('SELECT * FROM answer_keys WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Answer key not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching answer key:', error);
        res.status(500).json({ message: 'Error fetching answer key', error: error.message });
    }
});

/**
 * Add a new answer key
 */
router.post('/', async (req, res) => {
    try {
        const { 
            title, organization, category, exam_date, release_date,
            description, download_link, featured
        } = req.body;
        
        // Validate required fields
        if (!title || !organization) {
            return res.status(400).json({ message: 'Title and organization are required' });
        }
        
        const [result] = await db.pool.query(
            `INSERT INTO answer_keys (
                title, organization, category, exam_date, release_date,
                description, download_link, featured
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title, organization, category, exam_date, release_date,
                description, download_link, featured || false
            ]
        );
        
        res.status(201).json({ 
            id: result.insertId,
            message: 'Answer key added successfully' 
        });
    } catch (error) {
        console.error('Error adding answer key:', error);
        res.status(500).json({ message: 'Error adding answer key', error: error.message });
    }
});

/**
 * Update an answer key
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            title, organization, category, exam_date, release_date,
            description, download_link, featured
        } = req.body;
        
        // Validate required fields
        if (!title || !organization) {
            return res.status(400).json({ message: 'Title and organization are required' });
        }
        
        const [result] = await db.pool.query(
            `UPDATE answer_keys SET 
                title = ?, organization = ?, category = ?, exam_date = ?, release_date = ?,
                description = ?, download_link = ?, featured = ?
            WHERE id = ?`,
            [
                title, organization, category, exam_date, release_date,
                description, download_link, featured, id
            ]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Answer key not found' });
        }
        
        res.json({ message: 'Answer key updated successfully' });
    } catch (error) {
        console.error('Error updating answer key:', error);
        res.status(500).json({ message: 'Error updating answer key', error: error.message });
    }
});

/**
 * Delete an answer key
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await db.pool.query('DELETE FROM answer_keys WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Answer key not found' });
        }
        
        res.json({ message: 'Answer key deleted successfully' });
    } catch (error) {
        console.error('Error deleting answer key:', error);
        res.status(500).json({ message: 'Error deleting answer key', error: error.message });
    }
});

module.exports = router;

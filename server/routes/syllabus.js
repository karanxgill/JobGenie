/**
 * Syllabus routes for JobGenie
 */

const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * Get all syllabus items
 * Optional query parameters:
 * - category: Filter by category
 * - featured: Filter by featured status (true/false)
 */
router.get('/', async (req, res) => {
    try {
        let query = 'SELECT * FROM syllabus';
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
        console.error('Error fetching syllabus items:', error);
        res.status(500).json({ message: 'Error fetching syllabus items', error: error.message });
    }
});

/**
 * Get a syllabus item by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await db.pool.query('SELECT * FROM syllabus WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Syllabus item not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching syllabus item:', error);
        res.status(500).json({ message: 'Error fetching syllabus item', error: error.message });
    }
});

/**
 * Add a new syllabus item
 */
router.post('/', async (req, res) => {
    try {
        const { 
            title, organization, category, release_date,
            description, download_link, featured
        } = req.body;
        
        // Validate required fields
        if (!title || !organization) {
            return res.status(400).json({ message: 'Title and organization are required' });
        }
        
        const [result] = await db.pool.query(
            `INSERT INTO syllabus (
                title, organization, category, release_date,
                description, download_link, featured
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                title, organization, category, release_date,
                description, download_link, featured || false
            ]
        );
        
        res.status(201).json({ 
            id: result.insertId,
            message: 'Syllabus item added successfully' 
        });
    } catch (error) {
        console.error('Error adding syllabus item:', error);
        res.status(500).json({ message: 'Error adding syllabus item', error: error.message });
    }
});

/**
 * Update a syllabus item
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            title, organization, category, release_date,
            description, download_link, featured
        } = req.body;
        
        // Validate required fields
        if (!title || !organization) {
            return res.status(400).json({ message: 'Title and organization are required' });
        }
        
        const [result] = await db.pool.query(
            `UPDATE syllabus SET 
                title = ?, organization = ?, category = ?, release_date = ?,
                description = ?, download_link = ?, featured = ?
            WHERE id = ?`,
            [
                title, organization, category, release_date,
                description, download_link, featured, id
            ]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Syllabus item not found' });
        }
        
        res.json({ message: 'Syllabus item updated successfully' });
    } catch (error) {
        console.error('Error updating syllabus item:', error);
        res.status(500).json({ message: 'Error updating syllabus item', error: error.message });
    }
});

/**
 * Delete a syllabus item
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await db.pool.query('DELETE FROM syllabus WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Syllabus item not found' });
        }
        
        res.json({ message: 'Syllabus item deleted successfully' });
    } catch (error) {
        console.error('Error deleting syllabus item:', error);
        res.status(500).json({ message: 'Error deleting syllabus item', error: error.message });
    }
});

module.exports = router;

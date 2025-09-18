/**
 * Results routes for JobGenie
 */

const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * Get all results
 * Optional query parameters:
 * - category: Filter by category
 * - featured: Filter by featured status (true/false)
 */
router.get('/', async (req, res) => {
    try {
        let query = 'SELECT * FROM results';
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
        query += ' ORDER BY result_date DESC';
        
        const [rows] = await db.pool.query(query, queryParams);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ message: 'Error fetching results', error: error.message });
    }
});

/**
 * Get a result by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await db.pool.query('SELECT * FROM results WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Result not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching result:', error);
        res.status(500).json({ message: 'Error fetching result', error: error.message });
    }
});

/**
 * Add a new result
 */
router.post('/', async (req, res) => {
    try {
        const { 
            title, organization, category, result_date,
            description, result_link, featured
        } = req.body;
        
        // Validate required fields
        if (!title || !organization) {
            return res.status(400).json({ message: 'Title and organization are required' });
        }
        
        const [result] = await db.pool.query(
            `INSERT INTO results (
                title, organization, category, result_date,
                description, result_link, featured
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                title, organization, category, result_date,
                description, result_link, featured || false
            ]
        );
        
        res.status(201).json({ 
            id: result.insertId,
            message: 'Result added successfully' 
        });
    } catch (error) {
        console.error('Error adding result:', error);
        res.status(500).json({ message: 'Error adding result', error: error.message });
    }
});

/**
 * Update a result
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            title, organization, category, result_date,
            description, result_link, featured
        } = req.body;
        
        // Validate required fields
        if (!title || !organization) {
            return res.status(400).json({ message: 'Title and organization are required' });
        }
        
        const [result] = await db.pool.query(
            `UPDATE results SET 
                title = ?, organization = ?, category = ?, result_date = ?,
                description = ?, result_link = ?, featured = ?
            WHERE id = ?`,
            [
                title, organization, category, result_date,
                description, result_link, featured, id
            ]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Result not found' });
        }
        
        res.json({ message: 'Result updated successfully' });
    } catch (error) {
        console.error('Error updating result:', error);
        res.status(500).json({ message: 'Error updating result', error: error.message });
    }
});

/**
 * Delete a result
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await db.pool.query('DELETE FROM results WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Result not found' });
        }
        
        res.json({ message: 'Result deleted successfully' });
    } catch (error) {
        console.error('Error deleting result:', error);
        res.status(500).json({ message: 'Error deleting result', error: error.message });
    }
});

module.exports = router;

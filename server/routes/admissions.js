/**
 * Admissions routes for JobGenie
 */

const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * Get all admissions
 * Optional query parameters:
 * - category: Filter by category
 * - featured: Filter by featured status (true/false)
 */
router.get('/', async (req, res) => {
    try {
        let query = 'SELECT * FROM admissions';
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
        query += ' ORDER BY start_date DESC';
        
        const [rows] = await db.pool.query(query, queryParams);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching admissions:', error);
        res.status(500).json({ message: 'Error fetching admissions', error: error.message });
    }
});

/**
 * Get an admission by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await db.pool.query('SELECT * FROM admissions WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Admission not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching admission:', error);
        res.status(500).json({ message: 'Error fetching admission', error: error.message });
    }
});

/**
 * Add a new admission
 */
router.post('/', async (req, res) => {
    try {
        const { 
            title, organization, category, start_date, last_date,
            description, apply_link, featured
        } = req.body;
        
        // Validate required fields
        if (!title || !organization) {
            return res.status(400).json({ message: 'Title and organization are required' });
        }
        
        const [result] = await db.pool.query(
            `INSERT INTO admissions (
                title, organization, category, start_date, last_date,
                description, apply_link, featured
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title, organization, category, start_date, last_date,
                description, apply_link, featured || false
            ]
        );
        
        res.status(201).json({ 
            id: result.insertId,
            message: 'Admission added successfully' 
        });
    } catch (error) {
        console.error('Error adding admission:', error);
        res.status(500).json({ message: 'Error adding admission', error: error.message });
    }
});

/**
 * Update an admission
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            title, organization, category, start_date, last_date,
            description, apply_link, featured
        } = req.body;
        
        // Validate required fields
        if (!title || !organization) {
            return res.status(400).json({ message: 'Title and organization are required' });
        }
        
        const [result] = await db.pool.query(
            `UPDATE admissions SET 
                title = ?, organization = ?, category = ?, start_date = ?, last_date = ?,
                description = ?, apply_link = ?, featured = ?
            WHERE id = ?`,
            [
                title, organization, category, start_date, last_date,
                description, apply_link, featured, id
            ]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Admission not found' });
        }
        
        res.json({ message: 'Admission updated successfully' });
    } catch (error) {
        console.error('Error updating admission:', error);
        res.status(500).json({ message: 'Error updating admission', error: error.message });
    }
});

/**
 * Delete an admission
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await db.pool.query('DELETE FROM admissions WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Admission not found' });
        }
        
        res.json({ message: 'Admission deleted successfully' });
    } catch (error) {
        console.error('Error deleting admission:', error);
        res.status(500).json({ message: 'Error deleting admission', error: error.message });
    }
});

module.exports = router;

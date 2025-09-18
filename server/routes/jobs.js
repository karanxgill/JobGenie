/**
 * Jobs routes for JobGenie
 */

const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * Get all jobs
 * Optional query parameters:
 * - category: Filter by category
 * - featured: Filter by featured status (true/false)
 * - status: Filter by status (active, upcoming, expired)
 */
router.get('/', async (req, res) => {
    try {
        let query = 'SELECT * FROM jobs';
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
        
        // Add status filter if provided
        if (req.query.status) {
            conditions.push('status = ?');
            queryParams.push(req.query.status);
        }
        
        // Add WHERE clause if conditions exist
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        // Add ORDER BY clause
        query += ' ORDER BY posted_date DESC';
        
        const [rows] = await db.pool.query(query, queryParams);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Error fetching jobs', error: error.message });
    }
});

/**
 * Get a job by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [rows] = await db.pool.query('SELECT * FROM jobs WHERE id = ?', [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ message: 'Error fetching job', error: error.message });
    }
});

/**
 * Add a new job
 */
router.post('/', async (req, res) => {
    try {
        const { 
            title, organization, category, location, start_date, last_date,
            description, vacancies, qualification, age_limit, application_fee,
            apply_link, status, featured
        } = req.body;
        
        // Validate required fields
        if (!title || !organization) {
            return res.status(400).json({ message: 'Title and organization are required' });
        }
        
        const [result] = await db.pool.query(
            `INSERT INTO jobs (
                title, organization, category, location, start_date, last_date,
                description, vacancies, qualification, age_limit, application_fee,
                apply_link, status, featured
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title, organization, category, location, start_date, last_date,
                description, vacancies, qualification, age_limit, application_fee,
                apply_link, status || 'active', featured || false
            ]
        );
        
        res.status(201).json({ 
            id: result.insertId,
            message: 'Job added successfully' 
        });
    } catch (error) {
        console.error('Error adding job:', error);
        res.status(500).json({ message: 'Error adding job', error: error.message });
    }
});

/**
 * Update a job
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            title, organization, category, location, start_date, last_date,
            description, vacancies, qualification, age_limit, application_fee,
            apply_link, status, featured
        } = req.body;
        
        // Validate required fields
        if (!title || !organization) {
            return res.status(400).json({ message: 'Title and organization are required' });
        }
        
        const [result] = await db.pool.query(
            `UPDATE jobs SET 
                title = ?, organization = ?, category = ?, location = ?, 
                start_date = ?, last_date = ?, description = ?, vacancies = ?,
                qualification = ?, age_limit = ?, application_fee = ?,
                apply_link = ?, status = ?, featured = ?
            WHERE id = ?`,
            [
                title, organization, category, location, 
                start_date, last_date, description, vacancies,
                qualification, age_limit, application_fee,
                apply_link, status, featured, id
            ]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }
        
        res.json({ message: 'Job updated successfully' });
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ message: 'Error updating job', error: error.message });
    }
});

/**
 * Delete a job
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await db.pool.query('DELETE FROM jobs WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }
        
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ message: 'Error deleting job', error: error.message });
    }
});

module.exports = router;

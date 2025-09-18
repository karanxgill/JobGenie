/**
 * Simple API test script to check if the server is running
 */

// API base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Test endpoints
const endpoints = [
    '/jobs',
    '/results',
    '/admit-cards',
    '/answer-keys',
    '/syllabus',
    '/study-materials/notes',
    '/important-links'
];

// Test function
async function testEndpoint(endpoint) {
    try {
        console.log(`Testing endpoint: ${API_BASE_URL}${endpoint}`);
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        
        if (!response.ok) {
            console.error(`Error: ${response.status} ${response.statusText}`);
            return false;
        }
        
        const data = await response.json();
        console.log(`Success! Received ${Array.isArray(data) ? data.length : 'non-array'} items`);
        return true;
    } catch (error) {
        console.error(`Error testing ${endpoint}:`, error.message);
        return false;
    }
}

// Run tests
async function runTests() {
    console.log('Starting API tests...');
    
    let successCount = 0;
    let failCount = 0;
    
    for (const endpoint of endpoints) {
        const success = await testEndpoint(endpoint);
        if (success) {
            successCount++;
        } else {
            failCount++;
        }
    }
    
    console.log(`\nTest results: ${successCount} passed, ${failCount} failed`);
}

// Run the tests when the page loads
document.addEventListener('DOMContentLoaded', runTests);

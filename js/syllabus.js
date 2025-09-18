/**
 * JavaScript file for Syllabus page
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Initialize theme toggle
    initThemeToggle();

    // Load syllabus from API
    await loadSyllabusFromAPI();

    // Add event listeners
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            loadSyllabusFromAPI();
        });
    }

    // Handle Enter key in search input
    const syllabusSearch = document.getElementById('syllabus-search');
    if (syllabusSearch) {
        syllabusSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loadSyllabusFromAPI();
            }
        });
    }
});

/**
 * Load syllabus from API
 */
async function loadSyllabusFromAPI() {
    try {
        // Show loading indicator
        const syllabusContainer = document.getElementById('syllabus-container');
        if (syllabusContainer) {
            syllabusContainer.innerHTML = '<div class="loading">Loading syllabus...</div>';
        }

        // Get search parameters
        const syllabusSearch = document.getElementById('syllabus-search');
        const syllabusCategory = document.getElementById('syllabus-category');

        const keyword = syllabusSearch ? syllabusSearch.value.trim() : '';
        const category = syllabusCategory ? syllabusCategory.value : '';

        // Prepare filters
        const filters = {};
        if (category) {
            filters.category = category;
        }

        // Fetch syllabus from API
        const syllabusItems = await apiService.getSyllabus(filters);

        // Filter by keyword if provided
        let filteredSyllabus = syllabusItems;
        if (keyword) {
            filteredSyllabus = syllabusItems.filter(syllabus =>
                syllabus.title.toLowerCase().includes(keyword.toLowerCase()) ||
                syllabus.organization.toLowerCase().includes(keyword.toLowerCase()) ||
                (syllabus.description && syllabus.description.toLowerCase().includes(keyword.toLowerCase()))
            );
        }

        // Display syllabus
        displaySyllabus(filteredSyllabus);
    } catch (error) {
        console.error('Error loading syllabus:', error);
        const syllabusContainer = document.getElementById('syllabus-container');
        if (syllabusContainer) {
            syllabusContainer.innerHTML = `<div class="error">Error loading syllabus: ${error.message}</div>`;
        }
    }
}

/**
 * Display syllabus in the container
 * @param {Array} syllabusItems - Array of syllabus objects
 */
function displaySyllabus(syllabusItems) {
    const syllabusContainer = document.getElementById('syllabus-container');
    const paginationContainer = document.getElementById('pagination');

    if (!syllabusContainer) {
        console.error('Syllabus container not found');
        return;
    }

    // Clear container
    syllabusContainer.innerHTML = '';

    if (syllabusItems.length === 0) {
        syllabusContainer.innerHTML = '<div class="no-results">No syllabus found matching your criteria.</div>';
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }

    // Loop through syllabus items and create HTML
    syllabusItems.forEach(syllabus => {
        const syllabusElement = document.createElement('div');
        syllabusElement.className = 'syllabus-item';

        // Format date
        const releaseDate = syllabus.release_date ? formatDate(syllabus.release_date) : 'N/A';

        syllabusElement.innerHTML = `
            <h3><a href="${syllabus.download_link}" target="_blank">${syllabus.title}</a></h3>
            <div class="syllabus-meta">
                <span><i class="fas fa-building"></i> ${syllabus.organization}</span>
                <span><i class="fas fa-calendar-check"></i> Release Date: ${releaseDate}</span>
                ${syllabus.category ? `<span><i class="fas fa-tag"></i> ${getCategoryName(syllabus.category)}</span>` : ''}
            </div>
            <div class="syllabus-description">
                ${syllabus.description || ''}
            </div>
            <div class="syllabus-actions">
                <a href="${syllabus.download_link}" target="_blank" class="action-btn">Download Syllabus <i class="fas fa-download"></i></a>
            </div>
        `;

        syllabusContainer.appendChild(syllabusElement);
    });
}

/**
 * Format date to a readable format
 * @param {string} dateString - Date string in ISO format
 * @returns {string} - Formatted date
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
}

/**
 * Get category name from category code
 * @param {string} categoryCode - Category code
 * @returns {string} - Category name
 */
function getCategoryName(categoryCode) {
    const categories = {
        'central': 'Central Government',
        'state': 'State Government',
        'banking': 'Banking',
        'railway': 'Railway',
        'defence': 'Defence',
        'teaching': 'Teaching',
        'police': 'Police'
    };

    return categories[categoryCode] || categoryCode;
}

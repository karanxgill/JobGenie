/**
 * JavaScript file for Answer Keys page
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Initialize theme toggle
    initThemeToggle();

    // Load answer keys from API
    await loadAnswerKeysFromAPI();

    // Add event listeners
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            loadAnswerKeysFromAPI();
        });
    }

    // Handle Enter key in search input
    const answerKeySearch = document.getElementById('answer-key-search');
    if (answerKeySearch) {
        answerKeySearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loadAnswerKeysFromAPI();
            }
        });
    }
});

/**
 * Load answer keys from API
 */
async function loadAnswerKeysFromAPI() {
    try {
        // Show loading indicator
        const answerKeysContainer = document.getElementById('answer-keys-container');
        if (answerKeysContainer) {
            answerKeysContainer.innerHTML = '<div class="loading">Loading answer keys...</div>';
        }

        // Get search parameters
        const answerKeySearch = document.getElementById('answer-key-search');
        const answerKeyCategory = document.getElementById('answer-key-category');

        const keyword = answerKeySearch ? answerKeySearch.value.trim() : '';
        const category = answerKeyCategory ? answerKeyCategory.value : '';

        // Prepare filters
        const filters = {};
        if (category) {
            filters.category = category;
        }

        // Fetch answer keys from API
        const answerKeys = await apiService.getAnswerKeys(filters);

        // Filter by keyword if provided
        let filteredAnswerKeys = answerKeys;
        if (keyword) {
            filteredAnswerKeys = answerKeys.filter(answerKey =>
                answerKey.title.toLowerCase().includes(keyword.toLowerCase()) ||
                answerKey.organization.toLowerCase().includes(keyword.toLowerCase()) ||
                (answerKey.description && answerKey.description.toLowerCase().includes(keyword.toLowerCase()))
            );
        }

        // Display answer keys
        displayAnswerKeys(filteredAnswerKeys);
    } catch (error) {
        console.error('Error loading answer keys:', error);
        const answerKeysContainer = document.getElementById('answer-keys-container');
        if (answerKeysContainer) {
            answerKeysContainer.innerHTML = `<div class="error">Error loading answer keys: ${error.message}</div>`;
        }
    }
}

/**
 * Display answer keys in the container
 * @param {Array} answerKeys - Array of answer key objects
 */
function displayAnswerKeys(answerKeys) {
    const answerKeysContainer = document.getElementById('answer-keys-container');
    const paginationContainer = document.getElementById('pagination');

    if (!answerKeysContainer) {
        console.error('Answer keys container not found');
        return;
    }

    // Clear container
    answerKeysContainer.innerHTML = '';

    if (answerKeys.length === 0) {
        answerKeysContainer.innerHTML = '<div class="no-results">No answer keys found matching your criteria.</div>';
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }

    // Loop through answer keys and create HTML
    answerKeys.forEach(answerKey => {
        const answerKeyElement = document.createElement('div');
        answerKeyElement.className = 'answer-key-item';

        // Format dates
        const examDate = answerKey.exam_date ? formatDate(answerKey.exam_date) : 'N/A';
        const releaseDate = answerKey.release_date ? formatDate(answerKey.release_date) : 'N/A';

        answerKeyElement.innerHTML = `
            <h3><a href="${answerKey.download_link}" target="_blank">${answerKey.title}</a></h3>
            <div class="answer-key-meta">
                <span><i class="fas fa-building"></i> ${answerKey.organization}</span>
                <span><i class="fas fa-calendar-alt"></i> Exam Date: ${examDate}</span>
                <span><i class="fas fa-calendar-check"></i> Release Date: ${releaseDate}</span>
                ${answerKey.category ? `<span><i class="fas fa-tag"></i> ${getCategoryName(answerKey.category)}</span>` : ''}
            </div>
            <div class="answer-key-description">
                ${answerKey.description || ''}
            </div>
            <div class="answer-key-actions">
                <a href="${answerKey.download_link}" target="_blank" class="action-btn">Download Answer Key <i class="fas fa-download"></i></a>
            </div>
        `;

        answerKeysContainer.appendChild(answerKeyElement);
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

/**
 * JavaScript file for Results page
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Initialize theme toggle
    initThemeToggle();

    // Load results from API
    await loadResultsFromAPI();

    // Add event listeners
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            loadResultsFromAPI();
        });
    }

    // Handle Enter key in search input
    const resultSearch = document.getElementById('result-search');
    if (resultSearch) {
        resultSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loadResultsFromAPI();
            }
        });
    }
});

/**
 * Load results from API
 */
async function loadResultsFromAPI() {
    try {
        // Show loading indicator
        const resultsContainer = document.getElementById('results-container');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <p>Loading results...</p>
                </div>
            `;
        }

        // Get search parameters
        const resultSearch = document.getElementById('result-search');
        const resultCategory = document.getElementById('result-category');

        const keyword = resultSearch ? resultSearch.value.trim() : '';
        const category = resultCategory ? resultCategory.value : '';

        // Prepare filters
        const filters = {};
        if (category) {
            filters.category = category;
        }

        // Fetch results from API
        const results = await apiService.getResults(filters);

        // Filter by keyword if provided
        let filteredResults = results;
        if (keyword) {
            filteredResults = results.filter(result =>
                result.title.toLowerCase().includes(keyword.toLowerCase()) ||
                result.organization.toLowerCase().includes(keyword.toLowerCase()) ||
                (result.description && result.description.toLowerCase().includes(keyword.toLowerCase()))
            );
        }

        // Display results
        displayResults(filteredResults);
    } catch (error) {
        console.error('Error loading results:', error);
        const resultsContainer = document.getElementById('results-container');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="error">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Error loading results: ${error.message}</p>
                </div>
            `;
        }
    }
}

/**
 * Display results in the container
 * @param {Array} results - Array of result objects
 */
function displayResults(results) {
    const resultsContainer = document.getElementById('results-container');
    const paginationContainer = document.getElementById('pagination');

    if (!resultsContainer) {
        console.error('Results container not found');
        return;
    }

    // Clear container
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No results found matching your criteria.</p>
                <small>Try adjusting your search filters or try a different keyword.</small>
            </div>
        `;
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }

    // Loop through results and create HTML
    results.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.className = 'result-item';

        // Format date
        const resultDate = result.result_date ? formatDate(result.result_date) : 'N/A';

        resultElement.innerHTML = `
            <div class="job-card">
                <div class="job-card-logo">
                    <i class="fas fa-trophy"></i>
                </div>
                <div class="job-card-content">
                    <h3 class="job-card-title">${result.title}</h3>
                    <div class="job-org">${result.organization}</div>
                    <div class="job-meta">
                        <div class="job-meta-item">
                            <i class="fas fa-user"></i>
                            <span>${result.category || 'Multiple Positions'}</span>
                        </div>
                        <div class="job-meta-item">
                            <i class="fas fa-graduation-cap"></i>
                            <span>${result.qualification || 'Bachelor Degree'}</span>
                        </div>
                        <div class="job-meta-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span>Result Date: ${resultDate}</span>
                        </div>
                    </div>
                </div>
                <div class="job-card-footer">
                    <div class="job-type">${getCategoryName(result.category) || 'Result'}</div>
                    <a href="${result.result_link}" target="_blank" class="apply-btn">View Result</a>
                </div>
            </div>
        `;

        resultsContainer.appendChild(resultElement);
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

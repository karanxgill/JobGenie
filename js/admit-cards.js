/**
 * JavaScript file for Admit Cards page
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Initialize theme toggle
    initThemeToggle();

    // Load admit cards from API
    await loadAdmitCardsFromAPI();

    // Add event listeners
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            loadAdmitCardsFromAPI();
        });
    }

    // Handle Enter key in search input
    const admitCardSearch = document.getElementById('admit-card-search');
    if (admitCardSearch) {
        admitCardSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loadAdmitCardsFromAPI();
            }
        });
    }
});

/**
 * Load admit cards from API
 */
async function loadAdmitCardsFromAPI() {
    try {
        // Show loading indicator
        const admitCardsContainer = document.getElementById('admit-cards-container');
        if (admitCardsContainer) {
            admitCardsContainer.innerHTML = '<div class="loading">Loading admit cards...</div>';
        }

        // Get search parameters
        const admitCardSearch = document.getElementById('admit-card-search');
        const admitCardCategory = document.getElementById('admit-card-category');

        const keyword = admitCardSearch ? admitCardSearch.value.trim() : '';
        const category = admitCardCategory ? admitCardCategory.value : '';

        // Prepare filters
        const filters = {};
        if (category) {
            filters.category = category;
        }

        // Fetch admit cards from API
        const admitCards = await apiService.getAdmitCards(filters);

        // Filter by keyword if provided
        let filteredAdmitCards = admitCards;
        if (keyword) {
            filteredAdmitCards = admitCards.filter(admitCard =>
                admitCard.title.toLowerCase().includes(keyword.toLowerCase()) ||
                admitCard.organization.toLowerCase().includes(keyword.toLowerCase()) ||
                (admitCard.description && admitCard.description.toLowerCase().includes(keyword.toLowerCase()))
            );
        }

        // Display admit cards
        displayAdmitCards(filteredAdmitCards);
    } catch (error) {
        console.error('Error loading admit cards:', error);
        const admitCardsContainer = document.getElementById('admit-cards-container');
        if (admitCardsContainer) {
            admitCardsContainer.innerHTML = `<div class="error">Error loading admit cards: ${error.message}</div>`;
        }
    }
}

/**
 * Display admit cards in the container
 * @param {Array} admitCards - Array of admit card objects
 */
function displayAdmitCards(admitCards) {
    const admitCardsContainer = document.getElementById('admit-cards-container');
    const paginationContainer = document.getElementById('pagination');

    if (!admitCardsContainer) {
        console.error('Admit cards container not found');
        return;
    }

    // Clear container
    admitCardsContainer.innerHTML = '';

    if (admitCards.length === 0) {
        admitCardsContainer.innerHTML = '<div class="no-results">No admit cards found matching your criteria.</div>';
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }

    // Loop through admit cards and create HTML
    admitCards.forEach(admitCard => {
        const admitCardElement = document.createElement('div');
        admitCardElement.className = 'admit-card-item';

        // Format dates
        const examDate = admitCard.exam_date ? formatDate(admitCard.exam_date) : 'N/A';
        const releaseDate = admitCard.release_date ? formatDate(admitCard.release_date) : 'N/A';

        admitCardElement.innerHTML = `
            <h3><a href="${admitCard.download_link}" target="_blank">${admitCard.title}</a></h3>
            <div class="admit-card-meta">
                <span><i class="fas fa-building"></i> ${admitCard.organization}</span>
                <span><i class="fas fa-calendar-alt"></i> Exam Date: ${examDate}</span>
                <span><i class="fas fa-calendar-check"></i> Release Date: ${releaseDate}</span>
                ${admitCard.category ? `<span><i class="fas fa-tag"></i> ${getCategoryName(admitCard.category)}</span>` : ''}
            </div>
            <div class="admit-card-description">
                ${admitCard.description || ''}
            </div>
            <div class="admit-card-actions">
                <a href="${admitCard.download_link}" target="_blank" class="action-btn">Download Admit Card <i class="fas fa-download"></i></a>
            </div>
        `;

        admitCardsContainer.appendChild(admitCardElement);
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

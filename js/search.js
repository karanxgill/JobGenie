/**
 * JavaScript file for Search page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners
    const searchForm = document.getElementById('advanced-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            performSearch(1);
        });
    }

    const searchReset = document.getElementById('search-reset');
    if (searchReset) {
        searchReset.addEventListener('click', function() {
            document.getElementById('results-container').innerHTML = '<p class="no-results">Enter search criteria and click Search to find results.</p>';
            document.getElementById('pagination').innerHTML = '';
        });
    }

    // Initialize particles for CTA section
    if (typeof particlesJS !== 'undefined' && document.getElementById('cta-particles')) {
        particlesJS('cta-particles', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#ffffff" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
                move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out", bounce: false }
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" } },
                modes: { grab: { distance: 140, line_linked: { opacity: 1 } }, push: { particles_nb: 4 } }
            },
            retina_detect: true
        });
    }

    // Make all reveal elements fully visible
    document.querySelectorAll('.reveal').forEach(element => {
        element.classList.add('active');
    });
});

/**
 * Perform search with pagination
 * @param {number} page - Page number
 */
function performSearch(page = 1) {
    const resultsContainer = document.getElementById('results-container');
    const paginationContainer = document.getElementById('pagination');

    if (!resultsContainer) return;

    // Get search parameters
    const keyword = document.getElementById('search-keyword').value;
    const category = document.getElementById('search-category').value;
    const organization = document.getElementById('search-organization').value;
    const state = document.getElementById('search-state').value;
    const dateFrom = document.getElementById('search-date-from').value;
    const dateTo = document.getElementById('search-date-to').value;

    // Validate search parameters
    if (!keyword && !category && !organization && !state && !dateFrom && !dateTo) {
        resultsContainer.innerHTML = '<p class="no-results">Please enter at least one search criteria.</p>';
        paginationContainer.innerHTML = '';
        return;
    }

    // Determine which data arrays to search based on category
    let searchResults = [];

    if (!category || category === 'jobs') {
        const jobResults = searchData(jobsData, keyword, {}).map(item => ({
            ...item,
            type: 'job',
            date: item.postedDate,
            link: `job-details.html?id=${item.id}`
        }));
        searchResults = searchResults.concat(jobResults);
    }

    if (!category || category === 'results') {
        const resultResults = searchData(resultsData, keyword, {}).map(item => ({
            ...item,
            type: 'result',
            date: item.resultDate,
            link: `result-details.html?id=${item.id}`
        }));
        searchResults = searchResults.concat(resultResults);
    }

    if (!category || category === 'admit-cards') {
        const admitCardResults = searchData(admitCardsData, keyword, {}).map(item => ({
            ...item,
            type: 'admit-card',
            date: item.releaseDate,
            link: `admit-card-details.html?id=${item.id}`
        }));
        searchResults = searchResults.concat(admitCardResults);
    }

    if (!category || category === 'answer-keys') {
        const answerKeyResults = searchData(answerKeysData, keyword, {}).map(item => ({
            ...item,
            type: 'answer-key',
            date: item.releaseDate,
            link: `answer-key-details.html?id=${item.id}`
        }));
        searchResults = searchResults.concat(answerKeyResults);
    }

    if (!category || category === 'syllabus') {
        const syllabusResults = searchData(syllabusData, keyword, {}).map(item => ({
            ...item,
            type: 'syllabus',
            date: item.releaseDate,
            link: `syllabus-details.html?id=${item.id}`
        }));
        searchResults = searchResults.concat(syllabusResults);
    }

    // Filter by organization
    if (organization) {
        searchResults = searchResults.filter(item =>
            item.organization && item.organization.toLowerCase().includes(organization.toLowerCase())
        );
    }

    // Filter by state (location)
    if (state) {
        searchResults = searchResults.filter(item =>
            (item.location && item.location.toLowerCase().includes(state.toLowerCase())) ||
            (item.organization && item.organization.toLowerCase().includes(state.toLowerCase()))
        );
    }

    // Filter by date range
    if (dateFrom) {
        const fromDate = new Date(dateFrom);
        searchResults = searchResults.filter(item => {
            if (!item.date) return true;
            const itemDate = new Date(item.date);
            return itemDate >= fromDate;
        });
    }

    if (dateTo) {
        const toDate = new Date(dateTo);
        searchResults = searchResults.filter(item => {
            if (!item.date) return true;
            const itemDate = new Date(item.date);
            return itemDate <= toDate;
        });
    }

    // Sort by date (newest first)
    searchResults.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(b.date) - new Date(a.date);
    });

    // Pagination
    const itemsPerPage = 10;
    const totalPages = Math.ceil(searchResults.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedResults = searchResults.slice(startIndex, endIndex);

    // Generate HTML
    if (paginatedResults.length > 0) {
        let resultsHTML = '';

        paginatedResults.forEach(result => {
            let typeLabel = '';
            let typeIcon = '';

            switch (result.type) {
                case 'job':
                    typeLabel = 'Job';
                    typeIcon = 'briefcase';
                    break;
                case 'result':
                    typeLabel = 'Result';
                    typeIcon = 'poll';
                    break;
                case 'admit-card':
                    typeLabel = 'Admit Card';
                    typeIcon = 'id-card';
                    break;
                case 'answer-key':
                    typeLabel = 'Answer Key';
                    typeIcon = 'key';
                    break;
                case 'syllabus':
                    typeLabel = 'Syllabus';
                    typeIcon = 'book';
                    break;
            }

            resultsHTML += `
                <div class="search-result-item">
                    <div class="result-type">
                        <i class="fas fa-${typeIcon}"></i> ${typeLabel}
                    </div>
                    <h3><a href="${result.link}">${result.title}</a></h3>
                    <div class="result-meta">
                        <span><i class="fas fa-building"></i> ${result.organization || 'N/A'}</span>
                        <span><i class="fas fa-calendar-alt"></i> ${formatDate(result.date) || 'N/A'}</span>
                    </div>
                    <div class="result-description">
                        ${result.description || 'No description available.'}
                    </div>
                    <div class="result-actions">
                        <a href="${result.link}" class="action-btn">View Details</a>
                    </div>
                </div>
            `;
        });

        resultsContainer.innerHTML = resultsHTML;

        // Generate pagination
        if (totalPages > 1) {
            paginationContainer.innerHTML = generatePagination(page, totalPages, 'javascript:performSearch({page})');
        } else {
            paginationContainer.innerHTML = '';
        }
    } else {
        resultsContainer.innerHTML = '<div class="no-results">No results found matching your criteria.</div>';
        paginationContainer.innerHTML = '';
    }
}

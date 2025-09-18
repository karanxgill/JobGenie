/**
 * Unified Page Handler for JobGenie
 * This file consolidates all page-specific JavaScript functionality
 */

// Global variables and utility functions
let currentPage = window.location.pathname.split('/').pop().split('.')[0];
if (currentPage === '') currentPage = 'index';

// Global data variables
var studyNotesData = [];
var ebooksData = [];
var videosData = [];
var mockTestsData = [];

console.log('Current page:', currentPage);

/**
 * Initialize the page based on its type
 */
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize theme toggle for all pages
    if (typeof initThemeToggle === 'function') {
        initThemeToggle();
    }

    // Initialize page-specific functionality
    switch (currentPage) {
        case 'index':
            await initHomePage();
            break;
        case 'jobs':
        case 'latest-jobs':
            await initJobsPage();
            break;
        case 'results':
            await initResultsPage();
            break;
        case 'admit-cards':
            await initAdmitCardsPage();
            break;
        case 'answer-keys':
            await initAnswerKeysPage();
            break;
        case 'syllabus':
            await initSyllabusPage();
            break;
        case 'study-materials':
            await initStudyMaterialsPage();
            break;
        case 'contact':
            initContactPage();
            break;
        case 'search':
            initSearchPage();
            break;
        case 'job-details':
            await initJobDetailsPage();
            break;
        default:
            console.log('No specific initialization for this page:', currentPage);
            // Check if we're on the jobs page with a different filename
            if (window.location.pathname.includes('jobs')) {
                console.log('Detected jobs page, initializing...');
                await initJobsPage();
            }
    }
});

/**
 * Jobs Page Functionality
 */
async function initJobsPage() {
    console.log('Initializing Jobs page');

    // Get search parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const keywordFromUrl = urlParams.get('keyword');
    const locationFromUrl = urlParams.get('location');
    const categoryFromUrl = urlParams.get('category');

    console.log('URL parameters:', { keywordFromUrl, locationFromUrl, categoryFromUrl });

    // Set search inputs if parameters exist in URL
    const jobSearch = document.getElementById('job-search');
    const jobCategory = document.getElementById('job-category');

    console.log('Form elements:', {
        jobSearch: jobSearch ? 'Found' : 'Not found',
        jobCategory: jobCategory ? 'Found' : 'Not found',
        searchBtn: document.getElementById('search-btn') ? 'Found' : 'Not found'
    });

    if (jobSearch && keywordFromUrl) {
        jobSearch.value = decodeURIComponent(keywordFromUrl);
    }

    if (jobCategory && categoryFromUrl) {
        jobCategory.value = categoryFromUrl;
    }

    // Load jobs with URL parameters
    loadJobs(1, keywordFromUrl, locationFromUrl, categoryFromUrl);

    // Add event listeners
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        console.log('Adding click event listener to search button');
        searchBtn.addEventListener('click', function() {
            console.log('Search button clicked');
            loadJobs(1);
        });
    } else {
        console.error('Search button not found');
    }

    // Handle Enter key in search input
    if (jobSearch) {
        console.log('Adding keypress event listener to search input');
        jobSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                console.log('Enter key pressed in search input');
                loadJobs(1);
            }
        });
    } else {
        console.error('Job search input not found');
    }

    // Add submit event listener to the form
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        console.log('Adding submit event listener to search form');
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Search form submitted');
            loadJobs(1);
        });
    } else {
        console.error('Search form not found');
    }
}

/**
 * Load jobs with pagination
 * @param {number} page - Page number
 * @param {string} keywordFromUrl - Keyword from URL parameter
 * @param {string} locationFromUrl - Location from URL parameter
 * @param {string} categoryFromUrl - Category from URL parameter
 */
async function loadJobs(page = 1, keywordFromUrl = null, locationFromUrl = null, categoryFromUrl = null) {
    try {
        console.log('Loading jobs with parameters:', { page, keywordFromUrl, locationFromUrl, categoryFromUrl });

        const jobsContainer = document.getElementById('jobs-container');
        const paginationContainer = document.getElementById('pagination');
        const jobSearch = document.getElementById('job-search');
        const jobCategory = document.getElementById('job-category');

        console.log('Container elements:', {
            jobsContainer: jobsContainer ? 'Found' : 'Not found',
            paginationContainer: paginationContainer ? 'Found' : 'Not found'
        });

        if (!jobsContainer) {
            console.error('Jobs container not found, aborting loadJobs');
            return;
        }

        // Show loading indicator
        jobsContainer.innerHTML = '<div class="loading">Loading jobs...</div>';

        // Get search parameters (prioritize form inputs over URL parameters)
        const keyword = jobSearch ? jobSearch.value : (keywordFromUrl || '');
        const category = jobCategory ? jobCategory.value : (categoryFromUrl || '');
        const location = locationFromUrl || '';

        console.log('Search parameters:', { keyword, category, location });

        // Prepare filters
        const filters = {};
        if (category) {
            filters.category = category;
        }

        console.log('Fetching jobs with filters:', filters);

        // Fetch jobs from API
        const jobs = await apiService.getJobs(filters);
        console.log(`Received ${jobs ? jobs.length : 0} jobs from API`);

        // Filter by keyword and location if provided
        let filteredJobs = jobs;

        // Filter by keyword
        if (keyword) {
            console.log(`Filtering by keyword: ${keyword}`);
            filteredJobs = filteredJobs.filter(job =>
                job.title.toLowerCase().includes(keyword.toLowerCase()) ||
                job.organization.toLowerCase().includes(keyword.toLowerCase()) ||
                (job.description && job.description.toLowerCase().includes(keyword.toLowerCase()))
            );
            console.log(`${filteredJobs.length} jobs match the keyword`);
        }

        // Filter by location
        if (location) {
            console.log(`Filtering by location: ${location}`);
            filteredJobs = filteredJobs.filter(job =>
                job.location && job.location.toLowerCase().includes(location.toLowerCase())
            );
            console.log(`${filteredJobs.length} jobs match the location`);
        }

        // Pagination
        const itemsPerPage = 10;
        const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

        // Generate HTML
        if (paginatedJobs.length > 0) {
            let jobsHTML = '';

            paginatedJobs.forEach(job => {
                jobsHTML += `
                    <div class="job-card-simple">
                        <div class="job-icon">
                            <i class="fas fa-building"></i>
                        </div>
                        <h3 class="job-title"><a href="job-details.html?id=${job.id}">${job.title}</a></h3>
                        <div class="job-org">${job.organization}</div>
                        <div class="job-details">
                            <div class="job-detail-item">
                                <i class="fas fa-user"></i>
                                <span>${job.position || 'Multiple Positions'}</span>
                            </div>
                            <div class="job-detail-item">
                                <i class="fas fa-graduation-cap"></i>
                                <span>${job.qualification || 'Bachelor Degree in Any Stream in Any Recognized University in India.'}</span>
                            </div>
                            <div class="job-detail-item">
                                <i class="fas fa-calendar-alt"></i>
                                <span>Last Date: ${formatDate(job.last_date)}</span>
                            </div>
                            <div class="job-detail-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>Location: ${job.location || 'Not specified'}</span>
                            </div>
                        </div>
                        <div class="job-footer">
                            <div class="job-type">${job.job_type || 'Full Time'}</div>
                            <a href="job-details.html?id=${job.id}" class="apply-btn">View Details</a>
                        </div>
                    </div>
                `;
            });

            jobsContainer.innerHTML = jobsHTML;

            // Generate pagination
            if (totalPages > 1) {
                paginationContainer.innerHTML = generatePagination(page, totalPages, 'javascript:loadJobs({page})');
            } else {
                paginationContainer.innerHTML = '';
            }
        } else {
            jobsContainer.innerHTML = '<div class="no-results">No jobs found matching your criteria.</div>';
            paginationContainer.innerHTML = '';
        }
    } catch (error) {
        console.error('Error loading jobs:', error);
        const jobsContainer = document.getElementById('jobs-container');
        if (jobsContainer) {
            jobsContainer.innerHTML = `<div class="error">Error loading jobs: ${error.message}</div>`;
        }
    }
}

/**
 * Generate pagination HTML
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {string} urlTemplate - URL template with {page} placeholder
 * @returns {string} - Pagination HTML
 */
function generatePagination(currentPage, totalPages, urlTemplate) {
    let paginationHTML = '<div class="pagination">';

    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<a href="${urlTemplate.replace('{page}', currentPage - 1)}" class="page-link">&laquo; Previous</a>`;
    } else {
        paginationHTML += '<span class="page-link disabled">&laquo; Previous</span>';
    }

    // Page numbers
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    // Adjust start page if end page is maxed out
    if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    // First page
    if (startPage > 1) {
        paginationHTML += `<a href="${urlTemplate.replace('{page}', 1)}" class="page-link">1</a>`;
        if (startPage > 2) {
            paginationHTML += '<span class="page-link ellipsis">...</span>';
        }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
            paginationHTML += `<span class="page-link active">${i}</span>`;
        } else {
            paginationHTML += `<a href="${urlTemplate.replace('{page}', i)}" class="page-link">${i}</a>`;
        }
    }

    // Last page
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += '<span class="page-link ellipsis">...</span>';
        }
        paginationHTML += `<a href="${urlTemplate.replace('{page}', totalPages)}" class="page-link">${totalPages}</a>`;
    }

    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<a href="${urlTemplate.replace('{page}', currentPage + 1)}" class="page-link">Next &raquo;</a>`;
    } else {
        paginationHTML += '<span class="page-link disabled">Next &raquo;</span>';
    }

    paginationHTML += '</div>';

    return paginationHTML;
}

/**
 * Job Details Page Functionality
 */
async function initJobDetailsPage() {
    console.log('Initializing Job Details page');

    // Get job ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');

    if (!jobId) {
        console.error('No job ID provided');
        document.getElementById('job-details-container').innerHTML = '<div class="error">No job ID provided. Please go back to the jobs page and select a job.</div>';
        return;
    }

    // Load job details
    await loadJobDetails(jobId);
}

/**
 * Load job details
 * @param {string|number} jobId - Job ID
 */
async function loadJobDetails(jobId) {
    try {
        const jobDetailsContainer = document.getElementById('job-details-container');
        if (!jobDetailsContainer) return;

        // Show loading indicator
        jobDetailsContainer.innerHTML = '<div class="loading">Loading job details...</div>';

        // Fetch job details from API
        const job = await apiService.getJobById(jobId);

        if (!job) {
            jobDetailsContainer.innerHTML = '<div class="error">Job not found. It may have been removed or the ID is invalid.</div>';
            return;
        }

        // Generate HTML
        const jobHTML = `
            <div class="job-details">
                <div class="job-card-simple" style="max-width: 800px; margin: 0 auto;">
                    <div class="job-icon">
                        <i class="fas fa-building"></i>
                    </div>
                    <h3 class="job-title">${job.title}</h3>
                    <div class="job-org">${job.organization}</div>
                    <div class="job-details">
                        <div class="job-detail-item">
                            <i class="fas fa-user"></i>
                            <span>${job.position || 'Multiple Positions'}</span>
                        </div>
                        <div class="job-detail-item">
                            <i class="fas fa-graduation-cap"></i>
                            <span>${job.qualification || 'Bachelor Degree in Any Stream in Any Recognized University in India.'}</span>
                        </div>
                        <div class="job-detail-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span>Last Date: ${formatDate(job.last_date)}</span>
                        </div>
                    </div>

                    <div class="job-description">
                        <h3>Overview</h3>
                        <p>${job.description || 'No description available.'}</p>
                    </div>

                    <div class="job-dates">
                        <div class="date-item">
                            <span class="date-label">Start Date</span>
                            <span class="date-value">${formatDate(job.start_date)}</span>
                        </div>
                        <div class="date-item">
                            <span class="date-label">Last Date</span>
                            <span class="date-value">${formatDate(job.last_date)}</span>
                        </div>
                    </div>

                    <div class="job-card-details">
                        <h3>Key Details</h3>
                        <div class="detail-item">
                            <span class="detail-label"><i class="fas fa-graduation-cap"></i> Qualification</span>
                            <span class="detail-value">${job.qualification || 'Not specified'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label"><i class="fas fa-user"></i> Age Limit</span>
                            <span class="detail-value">${job.age_limit || 'Not specified'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label"><i class="fas fa-money-bill"></i> Application Fee</span>
                            <span class="detail-value">${job.application_fee || 'Not specified'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label"><i class="fas fa-users"></i> Vacancies</span>
                            <span class="detail-value">${job.vacancies || 'Not specified'}</span>
                        </div>
                    </div>

                    ${job.eligibility ? `
                    <div class="job-section">
                        <h3>Eligibility</h3>
                        <div class="job-description">
                            <p>${job.eligibility}</p>
                        </div>
                    </div>
                    ` : ''}

                    ${job.selection_process ? `
                    <div class="job-section">
                        <h3>Selection Process</h3>
                        <div class="job-description">
                            <p>${job.selection_process}</p>
                        </div>
                    </div>
                    ` : ''}

                    ${job.important_dates ? `
                    <div class="job-section">
                        <h3>Important Dates</h3>
                        <div class="job-description">
                            <p>${job.important_dates}</p>
                        </div>
                    </div>
                    ` : ''}

                    <div class="job-actions">
                        <a href="${job.apply_link}" target="_blank" class="action-btn primary-btn"><i class="fas fa-paper-plane"></i> Apply Now</a>
                        <a href="${job.notification_link || '#'}" target="_blank" class="action-btn"><i class="fas fa-file-alt"></i> View Notification</a>
                    </div>

                    <div class="job-footer">
                        <div class="job-type">${job.job_type || 'Full Time'}</div>
                        <a href="${job.apply_link || '#'}" class="apply-btn">Apply Now</a>
                    </div>
                </div>
            </div>
        `;

        jobDetailsContainer.innerHTML = jobHTML;
    } catch (error) {
        console.error('Error loading job details:', error);
        const jobDetailsContainer = document.getElementById('job-details-container');
        if (jobDetailsContainer) {
            jobDetailsContainer.innerHTML = `<div class="error">Error loading job details: ${error.message}</div>`;
        }
    }
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

/**
 * Home Page Functionality
 */
async function initHomePage() {
    console.log('Initializing Home page');
    await loadFeaturedContent();

    // Initialize home page search form
    initHomeSearchForm();
}

/**
 * Initialize the home page search form
 */
function initHomeSearchForm() {
    const searchForm = document.getElementById('home-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get search parameters
            const keyword = document.getElementById('home-job-search').value.trim();
            const location = document.getElementById('home-job-location').value.trim();

            // Build query string
            let queryParams = [];
            if (keyword) {
                queryParams.push(`keyword=${encodeURIComponent(keyword)}`);
            }
            if (location) {
                queryParams.push(`location=${encodeURIComponent(location)}`);
            }

            // Redirect to jobs page with search parameters
            const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
            window.location.href = `latest-jobs.html${queryString}`;
        });
    }

    // Add click event listeners to popular search links
    const popularSearchLinks = document.querySelectorAll('.popular-searches a');
    popularSearchLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            window.location.href = href;
        });
    });
}

/**
 * Load featured content from API
 */
async function loadFeaturedContent() {
    try {
        // Load featured jobs
        await loadFeaturedJobs();

        // Update job counts in categories
        await updateJobCounts();
    } catch (error) {
        console.error('Error loading featured content:', error);
    }
}

/**
 * Load featured jobs from API
 */
async function loadFeaturedJobs() {
    try {
        // Get featured jobs container
        const jobGrid = document.querySelector('.job-grid');
        if (!jobGrid) return;

        // Show loading indicator
        jobGrid.innerHTML = '<div class="loading">Loading featured jobs...</div>';

        // Fetch featured jobs from API
        const featuredJobs = await apiService.getJobs({ featured: true });

        // Check if we have jobs to display
        if (featuredJobs && featuredJobs.length > 0) {
            // Clear container
            jobGrid.innerHTML = '';

            // Display up to 3 featured jobs
            const jobsToDisplay = featuredJobs.slice(0, 3);

            // Create job cards
            jobsToDisplay.forEach(job => {
                // Create job card element
                const jobCard = document.createElement('div');
                jobCard.className = 'job-card';

                // Format date
                const lastDate = job.last_date ? formatDate(job.last_date) : 'N/A';

                // Set job card HTML
                jobCard.innerHTML = `
                    <div class="job-card-header">
                        <div class="job-card-logo">
                            <i class="fas fa-building"></i>
                        </div>
                        <div class="job-card-company">
                            <h3>${job.title}</h3>
                            <p>${job.organization}</p>
                        </div>
                    </div>
                    <div class="job-card-details">
                        <ul>
                            <li><i class="fas fa-briefcase"></i> ${job.position || 'Multiple Positions'}</li>
                            <li><i class="fas fa-graduation-cap"></i> ${job.qualification || 'Check Details'}</li>
                            <li><i class="fas fa-calendar-alt"></i> Last Date: ${lastDate}</li>
                        </ul>
                    </div>
                    <div class="job-card-footer">
                        <span class="job-type">${job.job_type || 'Full Time'}</span>
                        <a href="${job.apply_link}" target="_blank" class="apply-btn">Apply Now</a>
                    </div>
                `;

                // Add job card to grid
                jobGrid.appendChild(jobCard);
            });
        } else {
            // No featured jobs found
            jobGrid.innerHTML = '<div class="no-data">No featured jobs available at the moment.</div>';
        }
    } catch (error) {
        console.error('Error loading featured jobs:', error);
        const jobGrid = document.querySelector('.job-grid');
        if (jobGrid) {
            jobGrid.innerHTML = `<div class="error">Error loading featured jobs: ${error.message}</div>`;
        }
    }
}



/**
 * Update job counts in categories
 */
async function updateJobCounts() {
    try {
        // Get all jobs from API
        const allJobs = await apiService.getJobs();

        // Count jobs by category
        const jobCounts = {
            'banking': 0,
            'railway': 0,
            'defence': 0,
            'teaching': 0
        };

        // Count jobs in each category
        allJobs.forEach(job => {
            if (job.category && jobCounts[job.category] !== undefined) {
                jobCounts[job.category]++;
            }
        });

        // Update category cards with job counts
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            const categoryTitle = card.querySelector('h3').textContent.toLowerCase();
            let category = '';

            // Map category title to category code
            if (categoryTitle.includes('banking')) category = 'banking';
            else if (categoryTitle.includes('railways')) category = 'railway';
            else if (categoryTitle.includes('defense')) category = 'defence';
            else if (categoryTitle.includes('teaching')) category = 'teaching';

            // Update job count if category is found
            if (category && jobCounts[category] !== undefined) {
                const jobCountElement = card.querySelector('.job-count');
                if (jobCountElement) {
                    jobCountElement.textContent = `${jobCounts[category]} Jobs`;
                }
            }
        });
    } catch (error) {
        console.error('Error updating job counts:', error);
    }
}

/**
 * Results Page Functionality
 */
async function initResultsPage() {
    console.log('Initializing Results page');

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
}

/**
 * Load results from API
 */
async function loadResultsFromAPI() {
    try {
        // Show loading indicator
        const resultsContainer = document.getElementById('results-container');
        if (resultsContainer) {
            resultsContainer.innerHTML = '<div class="loading">Loading results...</div>';
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
            resultsContainer.innerHTML = `<div class="error">Error loading results: ${error.message}</div>`;
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
        resultsContainer.innerHTML = '<div class="no-results">No results found matching your criteria.</div>';
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }

    // Loop through results and create HTML
    results.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.className = 'result-item';
        resultElement.style.width = '100%';
        resultElement.style.boxSizing = 'border-box';
        resultElement.style.margin = '0 auto 20px';

        // Format date
        const resultDate = result.result_date ? formatDate(result.result_date) : 'N/A';

        // Generate a random username for the result (for display purposes)
        const username = result.username || generateRandomUsername();

        // Generate a category badge class
        const categoryClass = result.category ? `category-${result.category.toLowerCase().replace(/\s+/g, '-')}` : 'category-general';

        // Format exam date if available
        const examDate = result.exam_date ? formatDate(result.exam_date) : 'N/A';

        // Generate a random pass percentage for demo purposes
        const passPercentage = Math.floor(Math.random() * 30) + 50; // Random between 50-80%

        resultElement.innerHTML = `
            <h3>${result.title}</h3>
            <div class="result-meta">
                <span><i class="fas fa-building"></i> ${result.organization}</span>
                <span><i class="fas fa-calendar-alt"></i> Exam Date: ${examDate}</span>
                <span><i class="fas fa-calendar-check"></i> Release Date: ${resultDate}</span>
                ${result.category ? `<span><i class="fas fa-tag"></i> ${getCategoryName(result.category)}</span>` : ''}
            </div>
            <div class="result-description">
                ${result.description || `Results for ${result.title} have been announced. Candidates can check their results by clicking the button below.`}
            </div>
            <div class="result-actions">
                <a href="${result.result_link}" target="_blank" class="action-btn">View Result <i class="fas fa-download"></i></a>
            </div>
        `;

        resultsContainer.appendChild(resultElement);
    });
}

/**
 * Generate a random username for display purposes
 * @returns {string} - Random username
 */
function generateRandomUsername() {
    const firstNames = ['Rahul', 'Priya', 'Amit', 'Neha', 'Vikram', 'Anjali', 'Rajesh', 'Pooja', 'Sanjay', 'Meera'];
    const lastNames = ['Sharma', 'Patel', 'Singh', 'Gupta', 'Kumar', 'Verma', 'Joshi', 'Malhotra', 'Reddy', 'Kapoor'];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return `${firstName} ${lastName.charAt(0)}`;
}

/**
 * Admit Cards Page Functionality
 */
async function initAdmitCardsPage() {
    console.log('Initializing Admit Cards page');

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
}

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
        admitCardElement.style.width = '100%';
        admitCardElement.style.boxSizing = 'border-box';
        admitCardElement.style.margin = '0 auto 20px';

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
 * Answer Keys Page Functionality
 */
async function initAnswerKeysPage() {
    console.log('Initializing Answer Keys page');

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
}

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
 * Syllabus Page Functionality
 */
async function initSyllabusPage() {
    console.log('Initializing Syllabus page');

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
}

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
 * Study Materials Page Functionality
 */
async function initStudyMaterialsPage() {
    console.log('Initializing Study Materials page');

    // Reset data variables
    studyNotesData = [];
    ebooksData = [];
    videosData = [];
    mockTestsData = [];

    // Load data from API and study materials
    try {
        await loadDataFromApi();
        loadStudyMaterials();
    } catch (error) {
        console.error('Error initializing study materials:', error);
        showErrorMessage('Failed to load study materials. Please try refreshing the page.');
    }

    // Add tab switching functionality
    const tabs = document.querySelectorAll('.resource-tabs .tab');
    console.log('Found tabs:', tabs.length);

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            console.log('Tab clicked:', this.getAttribute('data-tab'));

            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            // Hide all tab content
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.classList.remove('active'));

            // Show selected tab content
            const tabName = this.getAttribute('data-tab');
            const targetContent = document.getElementById(`${tabName}-content`);

            if (targetContent) {
                targetContent.classList.add('active');
                console.log('Activated tab content:', tabName);
            } else {
                console.error('Tab content not found:', tabName);
            }
        });
    });

    // Initialize scroll reveal animations
    if (typeof initScrollReveal === 'function') {
        initScrollReveal();
    }

    // Initialize particles for CTA section
    initParticles();
}

/**
 * Show error message on the page
 * @param {string} message - Error message to display
 */
function showErrorMessage(message) {
    const containers = [
        document.querySelector('#notes-content .resource-grid'),
        document.querySelector('#ebooks-content .resource-grid'),
        document.querySelector('#videos-content .resource-grid'),
        document.querySelector('#mock-tests-content .resource-grid')
    ];

    containers.forEach(container => {
        if (container) {
            container.innerHTML = `<div class="error">${message} <button class="retry-btn" onclick="location.reload()">Retry</button></div>`;
        }
    });
}

/**
 * Get category name for display
 * @param {string} category - Category code
 * @returns {string} - Formatted category name
 */
function getCategoryName(category) {
    if (!category) return 'General';

    // If category is already formatted properly, return it
    if (category.includes(' ') || category.length > 10) {
        return category;
    }

    // Map of category codes to display names
    const categoryMap = {
        'banking': 'Banking',
        'ssc': 'SSC',
        'railway': 'Railway',
        'defence': 'Defence',
        'teaching': 'Teaching',
        'upsc': 'UPSC',
        'state': 'State PSC',
        'general': 'General'
    };

    // Convert to lowercase for case-insensitive matching
    const lowerCategory = category.toLowerCase();

    // Return mapped category or original if not found
    return categoryMap[lowerCategory] || category;
}

/**
 * Initialize particles for CTA section
 */
function initParticles() {
    const ctaParticles = document.getElementById('cta-particles');
    if (!ctaParticles) return;

    // Create particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;

        // Random size
        const size = Math.random() * 10 + 5;

        // Random opacity
        const opacity = Math.random() * 0.5 + 0.1;

        // Random animation duration
        const duration = Math.random() * 20 + 10;

        // Set styles
        particle.style.cssText = `
            position: absolute;
            top: ${posY}%;
            left: ${posX}%;
            width: ${size}px;
            height: ${size}px;
            background-color: rgba(255, 255, 255, ${opacity});
            border-radius: 50%;
            animation: float ${duration}s infinite ease-in-out;
            animation-delay: ${Math.random() * 5}s;
        `;

        ctaParticles.appendChild(particle);
    }

    // Add animation keyframes if not already added
    if (!document.getElementById('particle-animation')) {
        const style = document.createElement('style');
        style.id = 'particle-animation';
        style.textContent = `
            @keyframes float {
                0%, 100% {
                    transform: translateY(0) translateX(0);
                }
                25% {
                    transform: translateY(-20px) translateX(10px);
                }
                50% {
                    transform: translateY(-10px) translateX(20px);
                }
                75% {
                    transform: translateY(-30px) translateX(-10px);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

    // Tab event listeners are now handled in the initStudyMaterialsPage function

    // Add event listener for refresh button
    const refreshBtn = document.getElementById('refresh-data-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async function() {
            try {
                // Show loading indicator
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
                this.disabled = true;

                // Clear existing data
                studyNotesData = [];
                ebooksData = [];
                videosData = [];
                mockTestsData = [];

                // Load fresh data from API
                await loadDataFromApi();

                // Reload study materials
                loadStudyMaterials();

                // Restore button
                this.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
                this.disabled = false;

                // Show success message
                alert('Study materials refreshed successfully!');
            } catch (error) {
                console.error('Error refreshing data:', error);

                // Restore button
                this.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
                this.disabled = false;

                // Show error message
                alert('Error refreshing data. Please try again.');
            }
        });
    }

    /**
     * Load data from API
     */
    async function loadDataFromApi() {
        try {
            // Load all data types
            studyNotesData = await apiService.getNotes();
            console.log('Loaded notes:', studyNotesData);

            ebooksData = await apiService.getEbooks();
            console.log('Loaded ebooks:', ebooksData);

            videosData = await apiService.getVideos();
            console.log('Loaded videos:', videosData);

            mockTestsData = await apiService.getMockTests();
            console.log('Loaded mock tests:', mockTestsData);
        } catch (error) {
            console.error('Error loading data from API:', error);
            throw error;
        }
    }

    /**
     * Load study materials data into the page
     */
    function loadStudyMaterials() {
        // Load Notes
        loadNotesData();

        // Load E-Books
        loadEbooksData();

        // Load Videos
        loadVideosData();

        // Load Mock Tests
        loadMockTestsData();
    }

    /**
     * Load notes data
     */
    function loadNotesData() {
        const notesContainer = document.querySelector('#notes-content .resource-grid');
        if (!notesContainer) return;

        // Clear container
        notesContainer.innerHTML = '';

        if (studyNotesData && studyNotesData.length > 0) {
            // Sort by added date (newest first)
            studyNotesData.sort((a, b) => new Date(b.added_date) - new Date(a.added_date));

            // Display notes
            studyNotesData.forEach(note => {
                const noteCard = document.createElement('div');
                noteCard.className = 'resource-card';

                noteCard.innerHTML = `
                    <div class="resource-card-header">
                        <h3>${note.title}</h3>
                        <span class="resource-category">${getCategoryName(note.category)}</span>
                    </div>
                    <div class="resource-card-body">
                        <p>${note.description || 'No description available.'}</p>
                    </div>
                    <div class="resource-card-footer">
                        <a href="${note.download_link}" target="_blank" class="resource-btn">
                            <i class="fas fa-download"></i> Download Notes
                        </a>
                    </div>
                `;

                notesContainer.appendChild(noteCard);
            });
        } else {
            notesContainer.innerHTML = '<div class="no-data">No study notes available at the moment.</div>';
        }
    }

    /**
     * Load ebooks data
     */
    function loadEbooksData() {
        const ebooksContainer = document.querySelector('#ebooks-content .resource-grid');
        if (!ebooksContainer) return;

        // Clear container
        ebooksContainer.innerHTML = '';

        if (ebooksData && ebooksData.length > 0) {
            // Sort by added date (newest first)
            ebooksData.sort((a, b) => new Date(b.added_date) - new Date(a.added_date));

            // Display ebooks
            ebooksData.forEach(ebook => {
                const ebookCard = document.createElement('div');
                ebookCard.className = 'resource-card';

                ebookCard.innerHTML = `
                    <div class="resource-card-header">
                        <h3>${ebook.title}</h3>
                        <span class="resource-category">${getCategoryName(ebook.category)}</span>
                    </div>
                    <div class="resource-card-body">
                        <p>${ebook.description || 'No description available.'}</p>
                    </div>
                    <div class="resource-card-footer">
                        <a href="${ebook.download_link}" target="_blank" class="resource-btn">
                            <i class="fas fa-book"></i> Download E-Book
                        </a>
                    </div>
                `;

                ebooksContainer.appendChild(ebookCard);
            });
        } else {
            ebooksContainer.innerHTML = '<div class="no-data">No e-books available at the moment.</div>';
        }
    }

    /**
     * Load videos data
     */
    function loadVideosData() {
        const videosContainer = document.querySelector('#videos-content .resource-grid');
        if (!videosContainer) return;

        // Clear container
        videosContainer.innerHTML = '';

        if (videosData && videosData.length > 0) {
            // Sort by added date (newest first)
            videosData.sort((a, b) => new Date(b.added_date) - new Date(a.added_date));

            // Display videos
            videosData.forEach(video => {
                const videoCard = document.createElement('div');
                videoCard.className = 'resource-card video-card';

                // Get thumbnail URL or use default
                const thumbnailUrl = video.thumbnail_image || `https://img.youtube.com/vi/${extractYouTubeVideoId(video.video_link)}/mqdefault.jpg`;

                videoCard.innerHTML = `
                    <div class="resource-card-header">
                        <h3>${video.title}</h3>
                        <span class="resource-category">${getCategoryName(video.category)}</span>
                    </div>
                    <div class="video-thumbnail">
                        <img src="${thumbnailUrl}" alt="${video.title}">
                        <div class="play-button">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                    <div class="resource-card-body">
                        <p>${video.description || 'No description available.'}</p>
                    </div>
                    <div class="resource-card-footer">
                        <a href="${video.video_link}" target="_blank" class="resource-btn">
                            <i class="fas fa-video"></i> Watch Video
                        </a>
                    </div>
                `;

                videosContainer.appendChild(videoCard);
            });
        } else {
            videosContainer.innerHTML = '<div class="no-data">No videos available at the moment.</div>';
        }
    }

    /**
     * Load mock tests data
     */
    function loadMockTestsData() {
        const mockTestsContainer = document.querySelector('#mock-tests-content .resource-grid');
        if (!mockTestsContainer) return;

        // Clear container
        mockTestsContainer.innerHTML = '';

        if (mockTestsData && mockTestsData.length > 0) {
            // Sort by added date (newest first)
            mockTestsData.sort((a, b) => new Date(b.added_date) - new Date(a.added_date));

            // Display mock tests
            mockTestsData.forEach(test => {
                const testCard = document.createElement('div');
                testCard.className = 'resource-card';

                testCard.innerHTML = `
                    <div class="resource-card-header">
                        <h3>${test.title}</h3>
                        <span class="resource-category">${getCategoryName(test.category)}</span>
                    </div>
                    <div class="resource-card-body">
                        <p>${test.description || 'No description available.'}</p>
                    </div>
                    <div class="resource-card-footer">
                        <a href="${test.test_link}" target="_blank" class="resource-btn">
                            <i class="fas fa-clipboard-check"></i> Start Test
                        </a>
                    </div>
                `;

                mockTestsContainer.appendChild(testCard);
            });
        } else {
            mockTestsContainer.innerHTML = '<div class="no-data">No mock tests available at the moment.</div>';
        }
    }

    /**
     * Extract YouTube video ID from a URL
     * @param {string} url - YouTube URL
     * @returns {string|null} - YouTube video ID or null if not found
     */
    function extractYouTubeVideoId(url) {
        if (!url) return null;

        try {
            // Handle youtu.be short URLs
            if (url.includes('youtu.be/')) {
                const match = url.match(/youtu\.be\/([^?&\s]+)/);
                if (match && match[1]) {
                    return match[1];
                }
            }

            // Try to extract video ID from URL with si parameter
            const siMatch = url.match(/youtu\.be\/([^?]+)\?si=/);
            if (siMatch && siMatch[1]) {
                return siMatch[1];
            }

            // Handle standard youtube.com URLs
            let urlObj;
            try {
                urlObj = new URL(url);
            } catch (e) {
                console.error('Invalid URL:', url);
                return null;
            }

            // youtube.com/watch?v=VIDEO_ID
            if (urlObj.hostname.includes('youtube.com') && urlObj.pathname === '/watch') {
                const videoId = urlObj.searchParams.get('v');
                if (videoId) {
                    return videoId;
                }
            }

            // youtube.com/embed/VIDEO_ID
            if (urlObj.hostname.includes('youtube.com') && urlObj.pathname.startsWith('/embed/')) {
                const videoId = urlObj.pathname.split('/embed/')[1];
                if (videoId) {
                    return videoId;
                }
            }

            // Fallback to a default video ID
            return 'dQw4w9WgXcQ'; // Default video ID
        } catch (error) {
            console.error('Error extracting YouTube video ID:', error);
            return null;
        }
    }
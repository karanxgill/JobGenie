/**
 * Unified Admin Handler for JobGenie
 * This file consolidates all admin-specific JavaScript functionality
 */

// Global variables and utility functions
let currentAdminPage = window.location.pathname.split('/').pop().split('.')[0];
if (currentAdminPage === '') currentAdminPage = 'index';

console.log('Current admin page:', currentAdminPage);

/**
 * Helper function to safely set global flags on window object
 * This helps avoid TypeScript warnings
 * @param {string} flagName - Name of the flag to set
 * @param {any} value - Value to set
 */
function setGlobalFlag(flagName, value) {
    // @ts-ignore
    window[flagName] = value;
}

/**
 * Helper function to safely get global flags from window object
 * This helps avoid TypeScript warnings
 * @param {string} flagName - Name of the flag to get
 * @returns {any} - Value of the flag
 */
function getGlobalFlag(flagName) {
    // @ts-ignore
    return window[flagName];
}

// Initialize global flags
setGlobalFlag('isDeletingAdmitCard', false);
setGlobalFlag('isSavingAdmitCard', false);
setGlobalFlag('isSavingAnswerKey', false);
setGlobalFlag('isSavingSyllabus', false);

/**
 * Initialize the admin page based on its type
 */
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Admin handler initialized');

    // Check if admin is logged in (except for the login page)
    if (currentAdminPage !== 'index') {
        checkAdminLogin();
    }

    // Initialize page-specific functionality
    switch (currentAdminPage) {
        case 'index':
            initAdminLoginPage();
            break;
        case 'dashboard':
            initAdminDashboardPage();
            break;
        case 'jobs':
            // Prevent multiple initializations
            if (!window.jobsPageInitialized) {
                window.jobsPageInitialized = true;
                initAdminJobsPage();
            } else {
                console.log('Jobs page already initialized, skipping');
            }
            break;
        // Direct links case removed
        case 'study-materials':
            initAdminStudyMaterialsPage();
            break;
        case 'results':
            initAdminResultsPage();
            break;
        case 'admit-cards':
            initAdminAdmitCardsPage();
            break;
        case 'answer-keys':
            initAdminAnswerKeysPage();
            break;
        case 'syllabus':
            initAdminSyllabusPage();
            break;
        default:
            console.log('No specific initialization for this admin page');
    }

    // Add common event listeners
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
});

/**
 * Check if admin is logged in
 */
function checkAdminLogin() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');

    if (!isLoggedIn || isLoggedIn !== 'true') {
        // Redirect to login page
        window.location.href = 'index.html';
    }
}

/**
 * Handle admin logout
 */
function handleLogout() {
    // Clear login state
    localStorage.removeItem('adminLoggedIn');

    // Redirect to login page
    window.location.href = 'index.html';
}

/**
 * Get time ago string from date
 * @param {Date} date - Date to calculate time ago from
 * @returns {string} - Time ago string
 */
function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
        return diffDay === 1 ? 'Yesterday' : `${diffDay} days ago`;
    }

    if (diffHour > 0) {
        return `${diffHour} hour${diffHour === 1 ? '' : 's'} ago`;
    }

    if (diffMin > 0) {
        return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
    }

    return 'Just now';
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
 * Admin Login Page Functionality
 */
function initAdminLoginPage() {
    console.log('Initializing Admin Login page');

    // Add event listeners
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
}

/**
 * Handle admin login
 */
function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple validation
    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    // In a real implementation, this would validate credentials against a server
    // For this static implementation, we'll use a hardcoded admin/admin credential

    if (username === 'admin' && password === 'admin') {
        // Store login state in localStorage (not secure, just for demo)
        localStorage.setItem('adminLoggedIn', 'true');

        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid username or password. Please try again.');
    }
}

/**
 * Check if API is available
 * @returns {Promise<boolean>} - True if API is available, false otherwise
 */
async function checkApiAvailability() {
    try {
        console.log('Checking API availability...');

        // Use the health check API if available
        if (apiService && typeof apiService.checkHealth === 'function') {
            const isAvailable = await apiService.checkHealth();
            console.log('API health check result:', isAvailable);
            return isAvailable;
        }

        // Fallback to direct fetch if health check API is not available
        console.log('Health check API not available, falling back to direct fetch');
        const response = await fetch(`${apiService.API_BASE_URL}/health-check`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            // Short timeout to quickly detect if API is down
            signal: AbortSignal.timeout(3000)
        });

        if (response.ok) {
            console.log('API is available');
            return true;
        } else {
            console.warn('API returned non-OK status:', response.status);
            return false;
        }
    } catch (error) {
        console.error('API availability check failed:', error);
        return false;
    }
}

/**
 * Admin Dashboard Page Functionality
 */
function initAdminDashboardPage() {
    console.log('Initializing Admin Dashboard page');

    // First check if API is available
    checkApiAvailability().then(isAvailable => {
        if (isAvailable) {
            // API is available, update dashboard statistics
            updateDashboardStats();
        } else {
            // API is not available, show fallback data
            showApiUnavailableMessage();
            showFallbackDashboardData();
        }
    });
}

/**
 * Show API unavailable message
 */
function showApiUnavailableMessage() {
    // Create a dismissible alert
    const alertElement = document.createElement('div');
    alertElement.className = 'api-error-alert';
    alertElement.innerHTML = `
        <div class="alert-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span>API Service is not available. Showing cached data. Some features may be limited.</span>
        </div>
        <button class="alert-close" onclick="this.parentElement.remove()">×</button>
    `;

    // Insert at the top of the dashboard content
    const dashboardContent = document.querySelector('.dashboard-content');
    if (dashboardContent) {
        dashboardContent.insertBefore(alertElement, dashboardContent.firstChild);
    }
}

/**
 * Show fallback dashboard data when API is unavailable
 */
function showFallbackDashboardData() {
    console.log('Showing fallback dashboard data');

    // Use mock data from our API service if available
    if (apiService && typeof apiService.getMockData === 'function') {
        const mockJobs = apiService.getMockData('jobs');
        const mockResults = apiService.getMockData('results');
        const mockAdmitCards = apiService.getMockData('admit-cards');

        // Update stats with mock data
        const jobCount = document.querySelector('.stat-card:nth-child(1) .stat-number');
        if (jobCount) jobCount.textContent = mockJobs.length.toString();

        const resultCount = document.querySelector('.stat-card:nth-child(2) .stat-number');
        if (resultCount) resultCount.textContent = mockResults.length.toString();

        const admitCardCount = document.querySelector('.stat-card:nth-child(3) .stat-number');
        if (admitCardCount) admitCardCount.textContent = mockAdmitCards.length.toString();

        const visitorCount = document.querySelector('.stat-card:nth-child(4) .stat-number');
        if (visitorCount) visitorCount.textContent = '5,280';

        // Update recent activity with mock data
        updateRecentActivity(mockJobs, mockResults, mockAdmitCards,
            [...apiService.getMockData('notes'), ...apiService.getMockData('ebooks'),
             ...apiService.getMockData('videos'), ...apiService.getMockData('mock-tests')]);
    } else {
        // Fallback to hardcoded values if mock data is not available
        const jobCount = document.querySelector('.stat-card:nth-child(1) .stat-number');
        if (jobCount) jobCount.textContent = '245';

        const resultCount = document.querySelector('.stat-card:nth-child(2) .stat-number');
        if (resultCount) resultCount.textContent = '128';

        const admitCardCount = document.querySelector('.stat-card:nth-child(3) .stat-number');
        if (admitCardCount) admitCardCount.textContent = '87';

        const visitorCount = document.querySelector('.stat-card:nth-child(4) .stat-number');
        if (visitorCount) visitorCount.textContent = '5,280';
    }

    // No need to update activity list as it's already populated with sample data in the HTML
}

/**
 * Update dashboard statistics
 */
async function updateDashboardStats() {
    try {
        // Fetch data from API
        const jobs = await apiService.getJobs();
        const results = await apiService.getResults();
        const admitCards = await apiService.getAdmitCards();
        const answerKeys = await apiService.getAnswerKeys();
        const syllabusItems = await apiService.getSyllabus(); // Used in stats calculation
        // Direct links removed
        const studyMaterials = [
            ...(await apiService.getNotes()),
            ...(await apiService.getEbooks()),
            ...(await apiService.getVideos()),
            ...(await apiService.getMockTests())
        ];

        // Update job count
        const jobCount = document.querySelector('.stat-card:nth-child(1) .stat-number');
        if (jobCount) {
            jobCount.textContent = jobs.length;
        }

        // Update result count
        const resultCount = document.querySelector('.stat-card:nth-child(2) .stat-number');
        if (resultCount) {
            resultCount.textContent = results.length;
        }

        // Update admit card count
        const admitCardCount = document.querySelector('.stat-card:nth-child(3) .stat-number');
        if (admitCardCount) {
            admitCardCount.textContent = admitCards.length;
        }

        // Update answer key count
        const answerKeyCount = document.querySelector('.stat-card:nth-child(4) .stat-number');
        if (answerKeyCount) {
            answerKeyCount.textContent = answerKeys.length;
        }

        // Add additional cards to the stats cards
        const statsCards = document.querySelector('.stats-cards');
        if (statsCards) {
            // Check if syllabus card already exists
            const existingSyllabusCard = document.querySelector('.stat-card[data-type="syllabus"]');
            if (!existingSyllabusCard) {
                const syllabusCard = document.createElement('div');
                syllabusCard.className = 'stat-card';
                syllabusCard.setAttribute('data-type', 'syllabus');
                syllabusCard.innerHTML = `
                    <div class="stat-icon" style="background-color: rgba(40, 167, 69, 0.1); color: #28a745;">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="stat-info">
                        <h3>Syllabus</h3>
                        <p class="stat-number">${syllabusItems.length}</p>
                    </div>
                `;
                statsCards.appendChild(syllabusCard);
            }

            // Direct links card removed

            // Check if study materials card already exists
            const existingStudyMaterialsCard = document.querySelector('.stat-card[data-type="study-materials"]');
            if (!existingStudyMaterialsCard) {
                const studyMaterialsCard = document.createElement('div');
                studyMaterialsCard.className = 'stat-card';
                studyMaterialsCard.setAttribute('data-type', 'study-materials');
                studyMaterialsCard.innerHTML = `
                    <div class="stat-icon" style="background-color: rgba(0, 123, 255, 0.1); color: #007bff;">
                        <i class="fas fa-book"></i>
                    </div>
                    <div class="stat-info">
                        <h3>Study Materials</h3>
                        <p class="stat-number">${studyMaterials.length}</p>
                    </div>
                `;
                statsCards.appendChild(studyMaterialsCard);
            }
        }

        // Update recent activity
        updateRecentActivity(jobs, results, admitCards, studyMaterials);
    } catch (error) {
        console.error('Error updating dashboard stats:', error);
    }
}

/**
 * Update recent activity on dashboard
 * @param {Array} jobs - Jobs data
 * @param {Array} results - Results data
 * @param {Array} admitCards - Admit cards data
 * @param {Array} studyMaterials - Study materials data
 */
function updateRecentActivity(jobs, results, admitCards, studyMaterials) {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;

    // Create a combined array of all activities
    const allActivities = [
        ...jobs.map(job => ({
            type: 'job',
            action: 'add',
            title: job.title,
            date: new Date(job.posted_date || job.postedDate)
        })),
        ...results.map(result => ({
            type: 'result',
            action: 'add',
            title: result.title,
            date: new Date(result.result_date || result.resultDate)
        })),
        ...admitCards.map(card => ({
            type: 'admit-card',
            action: 'add',
            title: card.title,
            date: new Date(card.release_date || card.releaseDate)
        })),
        // Direct links removed
        ...studyMaterials.map(material => ({
            type: 'study-material',
            action: 'add',
            title: material.title,
            date: new Date(material.added_date || material.addedDate)
        }))
    ];

    // Sort by date (newest first)
    allActivities.sort((a, b) => b.date - a.date);

    // Take the 5 most recent activities
    const recentActivities = allActivities.slice(0, 5);

    // Generate HTML
    let activityHTML = '';

    recentActivities.forEach(activity => {
        let iconClass = 'add-icon';
        let icon = 'plus';
        let actionText = 'Added';

        if (activity.action === 'edit') {
            iconClass = 'edit-icon';
            icon = 'edit';
            actionText = 'Updated';
        } else if (activity.action === 'delete') {
            iconClass = 'delete-icon';
            icon = 'trash';
            actionText = 'Removed';
        }

        let typeText = '';
        switch (activity.type) {
            case 'job':
                typeText = 'Job';
                break;
            case 'result':
                typeText = 'Result';
                break;
            case 'admit-card':
                typeText = 'Admit Card';
                break;
            case 'direct-link':
                typeText = 'Direct Link';
                break;
            case 'study-material':
                typeText = 'Study Material';
                break;
            default:
                typeText = activity.type;
        }

        const timeAgo = getTimeAgo(activity.date);

        activityHTML += `
            <div class="activity-item">
                <div class="activity-icon ${iconClass}">
                    <i class="fas fa-${icon}"></i>
                </div>
                <div class="activity-details">
                    <h4>${typeText} ${actionText}</h4>
                    <p>${activity.title}</p>
                    <span class="activity-time">${timeAgo}</span>
                </div>
            </div>
        `;
    });

    activityList.innerHTML = activityHTML || '<div class="no-activity">No recent activity</div>';
}

/**
 * Admin Jobs Page Functionality
 */
function initAdminJobsPage() {
    console.log('Initializing Admin Jobs page');

    // Add debug log if available
    if (typeof window.debugLog === 'function') {
        window.debugLog('Initializing Admin Jobs page');
    }

    // Load jobs
    loadAdminJobs();

    // Add event listeners
    const addJobBtn = document.getElementById('add-job-btn');
    if (addJobBtn) {
        addJobBtn.addEventListener('click', function() {
            openJobModal();
        });
    }

    const cancelJobBtn = document.getElementById('cancel-job-btn');
    if (cancelJobBtn) {
        cancelJobBtn.addEventListener('click', function() {
            closeJobModal();
        });
    }

    // Check if job form already has a listener attached
    const jobForm = document.getElementById('job-form');
    if (jobForm && !jobForm.dataset.listenerAttached) {
        console.log('Attaching job form submit event listener from admin-handler.js');

        if (typeof window.debugLog === 'function') {
            window.debugLog('Attaching job form submit event listener from admin-handler.js');
        }

        // Remove any existing event listeners by cloning and replacing the form
        const newJobForm = jobForm.cloneNode(true);
        jobForm.parentNode.replaceChild(newJobForm, jobForm);

        // Add event listener to form submit
        newJobForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Job form submitted from admin-handler.js');

            if (typeof window.debugLog === 'function') {
                window.debugLog('Job form submitted from admin-handler.js');
            }

            // Use a flag to prevent multiple submissions
            if (window.isSubmittingJobForm) {
                console.log('Already submitting job form, preventing duplicate submission');

                if (typeof window.debugLog === 'function') {
                    window.debugLog('Already submitting job form, preventing duplicate submission');
                }
                return;
            }

            // Set flag to prevent multiple submissions
            window.isSubmittingJobForm = true;

            if (typeof window.debugLog === 'function') {
                window.debugLog('Set isSubmittingJobForm flag to true');
            }

            // Call saveJob function
            saveJob();

            // Reset flag after a short delay
            setTimeout(() => {
                window.isSubmittingJobForm = false;

                if (typeof window.debugLog === 'function') {
                    window.debugLog('Reset isSubmittingJobForm flag to false');
                }
            }, 1000);
        });

        // Mark the form as having a listener attached
        newJobForm.dataset.listenerAttached = 'true';
        console.log('Job form listener attached successfully from admin-handler.js');

        if (typeof window.debugLog === 'function') {
            window.debugLog('Job form listener attached successfully from admin-handler.js');
        }
    } else if (jobForm && jobForm.dataset.listenerAttached) {
        console.log('Job form already has a listener attached, skipping in admin-handler.js');

        if (typeof window.debugLog === 'function') {
            window.debugLog('Job form already has a listener attached, skipping in admin-handler.js');
        }
    }

    const closeModalBtns = document.querySelectorAll('.close-modal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            closeAllModals();
        });
    });

    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function() {
            closeDeleteModal();
        });
    }

    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            deleteJob();
        });
    }

    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            loadAdminJobs();
        });
    }

    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            document.getElementById('job-category-filter').value = '';
            document.getElementById('job-status-filter').value = '';
            loadAdminJobs();
        });
    }
}

/**
 * Load jobs for admin panel
 */
async function loadAdminJobs() {
    console.log('loadAdminJobs function called');

    if (typeof window.debugLog === 'function') {
        window.debugLog('loadAdminJobs function called');
    }

    const jobsTableBody = document.getElementById('jobs-table-body');

    if (!jobsTableBody) {
        console.log('Jobs table body not found');

        if (typeof window.debugLog === 'function') {
            window.debugLog('Jobs table body not found');
        }
        return;
    }

    // Show loading indicator
    jobsTableBody.innerHTML = `
        <tr>
            <td colspan="7" class="loading-message">Loading jobs...</td>
        </tr>
    `;

    try {
        // Get filter values
        const categoryFilter = document.getElementById('job-category-filter').value;
        const statusFilter = document.getElementById('job-status-filter').value;

        // Prepare filters
        const filters = {};
        if (categoryFilter) {
            filters.category = categoryFilter;
        }
        if (statusFilter) {
            filters.status = statusFilter;
        }

        // Check API availability
        const isApiAvailable = await checkApiAvailability();
        let jobs = [];

        if (isApiAvailable) {
            // Fetch jobs from API
            jobs = await apiService.getJobs(filters);
        } else {
            // Use mock data
            console.log('API not available, using mock data for jobs');
            jobs = apiService.getMockData('jobs');

            // Apply filters manually
            if (filters.category) {
                jobs = jobs.filter(job => job.category === filters.category);
            }
            if (filters.status) {
                jobs = jobs.filter(job => job.status === filters.status);
            }
        }

        // Generate HTML
        let jobsHTML = '';

        jobs.forEach(job => {
            let statusClass = '';

            switch (job.status) {
                case 'active':
                    statusClass = 'status-active';
                    break;
                case 'upcoming':
                    statusClass = 'status-upcoming';
                    break;
                case 'expired':
                    statusClass = 'status-expired';
                    break;
            }

            jobsHTML += `
                <tr>
                    <td>${job.id}</td>
                    <td>${job.title}</td>
                    <td>${job.organization}</td>
                    <td>${getCategoryName(job.category)}</td>
                    <td>${formatDate(job.last_date)}</td>
                    <td><span class="status-badge ${statusClass}">${job.status}</span></td>
                    <td>
                        <div class="table-actions">
                            <button class="view-btn" onclick="viewJob(${job.id})"><i class="fas fa-eye"></i></button>
                            <button class="edit-btn" onclick="editJob(${job.id})"><i class="fas fa-edit"></i></button>
                            <button class="delete-btn" onclick="confirmDeleteJob(${job.id})"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        });

        if (jobs.length === 0) {
            jobsHTML = `
                <tr>
                    <td colspan="7" class="no-data">No jobs found.</td>
                </tr>
            `;
        }

        jobsTableBody.innerHTML = jobsHTML;
    } catch (error) {
        console.error('Error loading jobs:', error);
        jobsTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="error-message">Error loading jobs: ${error.message}</td>
            </tr>
        `;
    }
}

/**
 * Open job modal for adding a new job
 */
function openJobModal() {
    // Reset form
    document.getElementById('job-form').reset();
    document.getElementById('job-id').value = '';
    document.getElementById('modal-title').textContent = 'Add New Job';

    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('job-start-date').value = today;

    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    document.getElementById('job-last-date').value = nextMonth.toISOString().split('T')[0];

    // Show modal
    document.getElementById('job-modal').style.display = 'block';
}

/**
 * Close job modal
 */
function closeJobModal() {
    document.getElementById('job-modal').style.display = 'none';
}

/**
 * Close all modals
 */
function closeAllModals() {
    // Close all possible modals
    const modals = [
        'job-modal',
        'delete-modal',
        'study-material-modal',
        'direct-link-modal',
        'result-modal',
        'admit-card-modal',
        'answer-key-modal',
        'syllabus-modal'
    ];

    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    });
}

/**
 * View job details
 * @param {number} jobId - Job ID
 */
async function viewJob(jobId) {
    // In a real implementation, this would open a detailed view
    // For this implementation, we'll just open the edit modal in read-only mode
    await editJob(jobId, true);
}

/**
 * Edit job
 * @param {number} jobId - Job ID
 * @param {boolean} readOnly - Whether to open in read-only mode
 */
async function editJob(jobId, readOnly = false) {
    try {
        // Check API availability
        const isApiAvailable = await checkApiAvailability();
        let job;

        if (isApiAvailable) {
            // Fetch job from API
            job = await apiService.getJob(jobId);
        } else {
            // Use mock data
            console.log('API not available, using mock data for job');
            const mockJobs = apiService.getMockData('jobs');
            job = mockJobs.find(j => j.id === jobId || j.id === parseInt(jobId));

            if (!job) {
                throw new Error('Job not found in mock data');
            }
        }

        // Set form values
        document.getElementById('job-id').value = job.id;
        document.getElementById('job-title').value = job.title;
        document.getElementById('job-organization').value = job.organization;
        document.getElementById('job-category').value = job.category || '';
        document.getElementById('job-location').value = job.location || '';
        document.getElementById('job-start-date').value = job.start_date || '';
        document.getElementById('job-last-date').value = job.last_date || '';
        document.getElementById('job-description').value = job.description || '';
        document.getElementById('job-vacancies').value = job.vacancies || '';
        document.getElementById('job-qualification').value = job.qualification || '';
        document.getElementById('job-age-limit').value = job.age_limit || '';
        document.getElementById('job-application-fee').value = job.application_fee || '';
        document.getElementById('job-apply-link').value = job.apply_link || '';
        document.getElementById('job-status').value = job.status || 'active';
        document.getElementById('job-featured').checked = job.featured || false;

        // Set modal title
        document.getElementById('modal-title').textContent = readOnly ? 'View Job' : 'Edit Job';

        // Set form fields to read-only if needed
        const formElements = document.getElementById('job-form').elements;
        for (let i = 0; i < formElements.length; i++) {
            formElements[i].readOnly = readOnly;
            if (formElements[i].type === 'select-one' || formElements[i].type === 'checkbox') {
                formElements[i].disabled = readOnly;
            }
        }

        // Hide/show buttons
        document.getElementById('save-job-btn').style.display = readOnly ? 'none' : 'block';

        // Show modal
        document.getElementById('job-modal').style.display = 'block';
    } catch (error) {
        console.error('Error fetching job:', error);
        alert(`Error fetching job: ${error.message}`);
    }
}

/**
 * Save job
 */
async function saveJob() {
    console.log('saveJob function called from admin-handler.js');

    // Add debug log if available
    if (typeof window.debugLog === 'function') {
        window.debugLog('saveJob function called from admin-handler.js');
    }

    // Prevent multiple submissions using a flag
    if (window.isSavingJob) {
        console.log('Already saving job, preventing duplicate submission');
        if (typeof window.debugLog === 'function') {
            window.debugLog('Already saving job, preventing duplicate submission');
        }
        return;
    }

    // Set flag to prevent multiple submissions
    window.isSavingJob = true;
    if (typeof window.debugLog === 'function') {
        window.debugLog('Set isSavingJob flag to true');
    }

    // Disable save button to prevent double submission
    const saveBtn = document.getElementById('save-job-btn');
    if (saveBtn) saveBtn.disabled = true;

    try {
        // Get form values
        const jobId = document.getElementById('job-id').value;
        const title = document.getElementById('job-title').value;
        const organization = document.getElementById('job-organization').value;
        const category = document.getElementById('job-category').value;
        const location = document.getElementById('job-location').value;
        const start_date = document.getElementById('job-start-date').value;
        const last_date = document.getElementById('job-last-date').value;
        const description = document.getElementById('job-description').value;
        const vacancies = document.getElementById('job-vacancies').value;
        const qualification = document.getElementById('job-qualification').value;
        const age_limit = document.getElementById('job-age-limit').value;
        const application_fee = document.getElementById('job-application-fee').value;
        const apply_link = document.getElementById('job-apply-link').value;
        const status = document.getElementById('job-status').value;
        const featured = document.getElementById('job-featured').checked;

        // Validate required fields
        if (!title || !organization || !category || !start_date || !last_date || !description || !apply_link || !status) {
            alert('Please fill in all required fields.');
            window.isSavingJob = false;
            if (saveBtn) saveBtn.disabled = false;
            return;
        }

        // Create job object
        const job = {
            title,
            organization,
            category,
            location,
            start_date,
            last_date,
            description,
            vacancies: vacancies ? parseInt(vacancies) : null,
            qualification,
            age_limit,
            application_fee,
            apply_link,
            status,
            featured,
            posted_date: new Date().toISOString() // Ensure we have a posted date
        };

        console.log('Job data to save:', job);

        // Show saving indicator
        const saveIndicator = document.createElement('span');
        saveIndicator.textContent = ' Saving...';
        saveIndicator.id = 'save-indicator';
        if (saveBtn && saveBtn.parentNode) saveBtn.parentNode.appendChild(saveIndicator);

        try {
            // Check API availability
            const isApiAvailable = await checkApiAvailability();

            if (isApiAvailable) {
                // Update or add job using API
                if (jobId) {
                    // Update existing job
                    console.log(`Updating job with ID: ${jobId}`);
                    await apiService.updateJob(jobId, job);
                } else {
                    // Add new job
                    console.log('Adding new job');
                    await apiService.addJob(job);
                }
            } else {
                // Simulate API success with mock data
                console.log('API not available, simulating job save operation');

                // Add a small delay to simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));

                // For demonstration purposes, we'll just log the operation
                if (jobId) {
                    console.log(`Mock update job with ID: ${jobId}`, job);
                } else {
                    // Generate a mock ID for new jobs
                    const mockId = 'job-' + Date.now();
                    console.log(`Mock add job with generated ID: ${mockId}`, job);
                }
            }

            // Remove saving indicator
            const indicator = document.getElementById('save-indicator');
            if (indicator) indicator.remove();

            // Close modal
            closeJobModal();

            // Show success message
            alert(`Job ${jobId ? 'updated' : 'added'} successfully.`);

            // Reload jobs after showing the success message
            await loadAdminJobs();
        } catch (saveError) {
            console.error('Error saving job:', saveError);

            // Remove saving indicator
            const indicator = document.getElementById('save-indicator');
            if (indicator) indicator.remove();

            // Show error message
            alert(`Error saving job: ${saveError.message}`);
        }
    } catch (error) {
        console.error('Unexpected error in saveJob function:', error);

        // Remove saving indicator
        const indicator = document.getElementById('save-indicator');
        if (indicator) indicator.remove();

        alert(`An unexpected error occurred: ${error.message}`);
    } finally {
        // Reset flag and re-enable button
        window.isSavingJob = false;
        if (saveBtn) saveBtn.disabled = false;
    }
}

/**
 * Confirm delete job
 * @param {number} jobId - Job ID
 */
function confirmDeleteJob(jobId) {
    // Store job ID for deletion
    document.getElementById('delete-modal').dataset.jobId = jobId;

    // Show delete confirmation modal
    document.getElementById('delete-modal').style.display = 'block';
}

/**
 * Close delete confirmation modal
 */
function closeDeleteModal() {
    // Hide the modal
    document.getElementById('delete-modal').style.display = 'none';

    // Reset loading indicator if it exists
    const loadingIndicator = document.getElementById('delete-loading');
    if (loadingIndicator) {
        loadingIndicator.style.display = 'none';
    }

    // Re-enable buttons if they exist
    const confirmBtn = document.getElementById('confirm-delete-btn');
    const cancelBtn = document.getElementById('cancel-delete-btn');

    if (confirmBtn) confirmBtn.disabled = false;
    if (cancelBtn) cancelBtn.disabled = false;
}

/**
 * Delete job
 */
async function deleteJob() {
    // Get loading indicator and buttons
    const loadingIndicator = document.getElementById('delete-loading');
    const confirmBtn = document.getElementById('confirm-delete-btn');
    const cancelBtn = document.getElementById('cancel-delete-btn');

    try {
        const jobId = document.getElementById('delete-modal').dataset.jobId;

        if (!jobId) {
            alert('Job ID not found.');
            return;
        }

        // Show loading indicator and disable buttons
        if (loadingIndicator) loadingIndicator.style.display = 'block';
        if (confirmBtn) confirmBtn.disabled = true;
        if (cancelBtn) cancelBtn.disabled = true;

        console.log(`Attempting to delete job with ID: ${jobId}`);

        // Skip the existence check and directly try to delete
        // This avoids race conditions where the job might exist during check but be deleted before the delete call

        try {
            // Check API availability
            const isApiAvailable = await checkApiAvailability();

            if (isApiAvailable) {
                // Delete job from API
                const response = await apiService.deleteJob(jobId);
                console.log('Delete response:', response);
            } else {
                // Simulate API success with mock data
                console.log('API not available, simulating job delete operation');

                // Add a small delay to simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));

                console.log(`Mock delete job with ID: ${jobId}`);
            }

            // Hide loading indicator
            if (loadingIndicator) loadingIndicator.style.display = 'none';

            // Close modal
            closeDeleteModal();

            // Show success message
            alert('Job deleted successfully.');

            // Reload jobs after showing the success message
            await loadAdminJobs();
        } catch (deleteError) {
            console.error(`Error deleting job with ID ${jobId}:`, deleteError);

            // Hide loading indicator
            if (loadingIndicator) loadingIndicator.style.display = 'none';

            // Handle specific error types
            if (deleteError.message.includes('404') ||
                deleteError.message.includes('not found')) {
                closeDeleteModal();
                alert('This job no longer exists or has already been deleted.');
            } else {
                // For other errors, keep the modal open and re-enable buttons
                if (confirmBtn) confirmBtn.disabled = false;
                if (cancelBtn) cancelBtn.disabled = false;
                alert(`Error deleting job: ${deleteError.message}`);
                return; // Return early to prevent table refresh for non-404 errors
            }

            // Refresh the table
            await loadAdminJobs();
        }
    } catch (error) {
        console.error('Unexpected error in deleteJob function:', error);

        // Hide loading indicator and re-enable buttons
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        if (confirmBtn) confirmBtn.disabled = false;
        if (cancelBtn) cancelBtn.disabled = false;

        alert(`An unexpected error occurred: ${error.message}`);

        // Refresh the table
        await loadAdminJobs();
    }
}

/**
 * Admin Direct Links Page Functionality
 */
function initAdminDirectLinksPage() {
    console.log('Initializing Admin Direct Links page');

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const actionParam = urlParams.get('action');

    console.log('URL parameters:', { categoryParam, actionParam });

    // Set active navigation item based on category
    setActiveNavItem(categoryParam);

    // Update page title based on category
    updatePageTitle(categoryParam);

    // Initialize filters
    initializeFilters(categoryParam);

    // Load direct links with category filter
    loadAdminDirectLinks();

    // Open add modal if action=add
    if (actionParam === 'add') {
        openDirectLinkModal(categoryParam);
    }

    // Add event listeners
    const addDirectLinkBtn = document.getElementById('add-direct-link-btn');
    if (addDirectLinkBtn) {
        addDirectLinkBtn.addEventListener('click', function() {
            openDirectLinkModal(categoryParam);
        });
    }

    const cancelDirectLinkBtn = document.getElementById('cancel-direct-link-btn');
    if (cancelDirectLinkBtn) {
        cancelDirectLinkBtn.addEventListener('click', function() {
            closeDirectLinkModal();
        });
    }

    const directLinkForm = document.getElementById('direct-link-form');
    if (directLinkForm) {
        directLinkForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveDirectLink();
        });
    }

    const closeModalBtns = document.querySelectorAll('.close-modal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            closeAllModals();
        });
    });

    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function() {
            closeDeleteModal();
        });
    }

    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            deleteDirectLink();
        });
    }

    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            console.log('Apply Filters button clicked');

            // Get filter values
            const categoryFilter = document.getElementById('direct-link-category-filter');
            const featuredFilter = document.getElementById('direct-link-featured-filter');

            console.log('Category filter value:', categoryFilter ? categoryFilter.value : 'not found');
            console.log('Featured filter value:', featuredFilter ? featuredFilter.value : 'not found');

            // Update URL with filter parameters without reloading the page
            const urlParams = new URLSearchParams(window.location.search);

            if (categoryFilter && categoryFilter.value) {
                urlParams.set('category', categoryFilter.value);
            } else {
                urlParams.delete('category');
            }

            // Update URL without reloading the page
            const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
            window.history.pushState({}, '', newUrl);

            // Load filtered direct links
            loadAdminDirectLinks();
        });
    }

    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            console.log('Clear Filters button clicked');

            const categoryFilter = document.getElementById('direct-link-category-filter');
            const featuredFilter = document.getElementById('direct-link-featured-filter');

            if (categoryFilter) categoryFilter.value = '';
            if (featuredFilter) featuredFilter.value = '';

            // Update URL by removing filter parameters
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.delete('category');

            // Update URL without reloading the page
            const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
            window.history.pushState({}, '', newUrl);

            // Load all direct links
            loadAdminDirectLinks();
        });
    }
}

/**
 * Initialize filter values from URL parameters
 * @param {string} categoryParam - Category parameter from URL
 */
function initializeFilters(categoryParam) {
    console.log('Initializing filters with category:', categoryParam);

    const categoryFilter = document.getElementById('direct-link-category-filter');
    if (categoryFilter && categoryParam) {
        categoryFilter.value = categoryParam;
        console.log('Set category filter to:', categoryParam);
    }

    // Add event listeners to filter dropdowns for immediate filtering
    const filterDropdowns = document.querySelectorAll('.filter-group select');
    filterDropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            console.log('Filter dropdown changed:', this.id, 'value:', this.value);
            // Automatically apply filters when dropdown changes
            document.getElementById('apply-filters-btn').click();
        });
    });
}

/**
 * Set active navigation item based on category
 * @param {string} category - Category code
 */
function setActiveNavItem(category) {
    // Remove active class from all nav items
    document.querySelectorAll('.sidebar-nav li').forEach(item => {
        item.classList.remove('active');
    });

    // Set active class based on category
    if (category) {
        const navItem = document.getElementById(`${category}-nav`);
        if (navItem) {
            navItem.classList.add('active');
        }
    } else {
        // If no category, set "All Direct Links" as active
        const allLinksNav = document.getElementById('all-links-nav');
        if (allLinksNav) {
            allLinksNav.classList.add('active');
        }
    }
}

/**
 * Update page title based on category
 * @param {string} category - Category code
 */
function updatePageTitle(category) {
    const contentHeader = document.querySelector('.content-header h1');
    if (!contentHeader) return;

    if (category) {
        const categoryName = getCategoryName(category);
        contentHeader.textContent = `Manage ${categoryName} Links`;

        // Update add button text
        const addBtn = document.getElementById('add-direct-link-btn');
        if (addBtn) {
            addBtn.innerHTML = `<i class="fas fa-plus"></i> Add New ${categoryName} Link`;
        }
    } else {
        contentHeader.textContent = 'Manage All Direct Links';
    }
}

/**
 * Load direct links for admin panel
 */
async function loadAdminDirectLinks() {
    console.log('Loading direct links...');

    const directLinksTableBody = document.getElementById('direct-links-table-body');

    if (!directLinksTableBody) {
        console.error('Direct links table body not found');
        return;
    }

    // Show loading indicator
    directLinksTableBody.innerHTML = '<tr><td colspan="8" class="loading">Loading direct links...</td></tr>';

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('category');
    console.log('Category from URL:', categoryFromUrl);

    // Get filter values
    const categoryFilterElement = document.getElementById('direct-link-category-filter');
    const featuredFilterElement = document.getElementById('direct-link-featured-filter');

    // Set the category filter value from URL if it exists and the filter element doesn't have a value
    if (categoryFilterElement && categoryFromUrl && !categoryFilterElement.value) {
        categoryFilterElement.value = categoryFromUrl;
    }

    const categoryFilter = categoryFilterElement ? categoryFilterElement.value : categoryFromUrl;
    const featuredFilter = featuredFilterElement ? featuredFilterElement.value : '';

    console.log('Category filter:', categoryFilter);
    console.log('Featured filter:', featuredFilter);

    // Prepare filters for API request
    const filters = {};
    if (categoryFilter) {
        filters.category = categoryFilter;
    }
    if (featuredFilter) {
        filters.featured = featuredFilter === 'true';
    }

    try {
        // Fetch direct links from API
        const directLinks = await apiService.getDirectLinks(filters);
        console.log('Fetched direct links from API:', directLinks);

        // Sort by display order if there are links
        let filteredDirectLinks = directLinks;
        if (filteredDirectLinks.length > 0) {
            filteredDirectLinks.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
        }

        // Generate HTML
        let directLinksHTML = '';

        if (filteredDirectLinks.length > 0) {
            filteredDirectLinks.forEach(link => {
                directLinksHTML += `
                    <tr>
                        <td>${link.id}</td>
                        <td>${link.title}</td>
                        <td>${getCategoryName(link.category)}</td>
                        <td><a href="${link.url}" target="_blank">${truncateText(link.url, 30)}</a></td>
                        <td>${link.display_order}</td>
                        <td><span class="status-badge ${link.featured ? 'status-active' : 'status-expired'}">${link.featured ? 'Yes' : 'No'}</span></td>
                        <td>${formatDate(link.added_date)}</td>
                        <td>
                            <div class="table-actions">
                                <button class="view-btn" onclick="viewDirectLink(${link.id})"><i class="fas fa-eye"></i></button>
                                <button class="edit-btn" onclick="editDirectLink(${link.id})"><i class="fas fa-edit"></i></button>
                                <button class="delete-btn" onclick="confirmDeleteDirectLink(${link.id})"><i class="fas fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>
                `;
            });
        } else {
            const categoryName = categoryFilter ? getCategoryName(categoryFilter) : 'direct links';
            directLinksHTML = `
                <tr>
                    <td colspan="8" class="no-data">No ${categoryName} found. Click "Add New" to create one.</td>
                </tr>
            `;
        }

        directLinksTableBody.innerHTML = directLinksHTML;
    } catch (error) {
        console.error('Error loading direct links:', error);
        directLinksTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="error">Error loading direct links: ${error.message}</td>
            </tr>
        `;
    }
}

/**
 * Truncate text if it's too long
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Open direct link modal for adding a new direct link
 * @param {string} category - Category code (optional)
 */
function openDirectLinkModal(category) {
    // Check if form elements exist
    const form = document.getElementById('direct-link-form');
    const idField = document.getElementById('direct-link-id');
    const categoryField = document.getElementById('direct-link-category');
    const titleField = document.getElementById('modal-title');
    const displayOrderField = document.getElementById('direct-link-display-order');
    const featuredField = document.getElementById('direct-link-featured');
    const modal = document.getElementById('direct-link-modal');

    if (!form || !modal) {
        console.error('Modal form elements not found');
        return;
    }

    // Reset form
    form.reset();
    if (idField) idField.value = '';

    // Set category if provided
    if (category && categoryField) {
        categoryField.value = category;
        const categoryName = getCategoryName(category);
        if (titleField) titleField.textContent = `Add New ${categoryName} Link`;
    } else {
        if (titleField) titleField.textContent = 'Add New Direct Link';
    }

    // Set default values
    if (displayOrderField) {
        // Default to display order 1, will be updated after API call
        displayOrderField.value = 1;

        // Try to get the highest display order from API
        apiService.getDirectLinks()
            .then(links => {
                if (links && links.length > 0) {
                    const maxDisplayOrder = Math.max(...links.map(link => link.display_order || 0));
                    displayOrderField.value = maxDisplayOrder + 1;
                }
            })
            .catch(error => {
                console.error('Error fetching display order:', error);
            });
    }

    // Set featured checkbox to true by default
    if (featuredField) featuredField.checked = true;

    // Show modal
    modal.style.display = 'block';
}

/**
 * Close direct link modal
 */
function closeDirectLinkModal() {
    document.getElementById('direct-link-modal').style.display = 'none';
}

/**
 * View direct link details
 * @param {number} linkId - Direct link ID
 */
function viewDirectLink(linkId) {
    // In a real implementation, this would open a detailed view
    // For this static implementation, we'll just open the edit modal in read-only mode
    editDirectLink(linkId, true);
}

/**
 * Edit direct link
 * @param {number} linkId - Direct link ID
 * @param {boolean} readOnly - Whether to open in read-only mode
 */
async function editDirectLink(linkId, readOnly = false) {
    try {
        // Show loading indicator
        document.getElementById('modal-title').textContent = 'Loading...';
        document.getElementById('direct-link-modal').style.display = 'block';

        // Fetch direct link from API
        const link = await apiService.getDirectLink(linkId);

        if (!link) {
            alert('Direct link not found.');
            document.getElementById('direct-link-modal').style.display = 'none';
            return;
        }

        // Set form values
        document.getElementById('direct-link-id').value = link.id;
        document.getElementById('direct-link-title').value = link.title;
        document.getElementById('direct-link-category').value = link.category;
        document.getElementById('direct-link-url').value = link.url;
        document.getElementById('direct-link-description').value = link.description || '';
        document.getElementById('direct-link-display-order').value = link.display_order || 1;
        document.getElementById('direct-link-featured').checked = link.featured || false;

        // Set modal title
        document.getElementById('modal-title').textContent = readOnly ? 'View Direct Link' : 'Edit Direct Link';

        // Set form fields to read-only if needed
        const formElements = document.getElementById('direct-link-form').elements;
        for (let i = 0; i < formElements.length; i++) {
            formElements[i].readOnly = readOnly;
            if (formElements[i].type === 'select-one' || formElements[i].type === 'checkbox') {
                formElements[i].disabled = readOnly;
            }
        }

        // Hide/show buttons
        document.getElementById('save-direct-link-btn').style.display = readOnly ? 'none' : 'block';
    } catch (error) {
        console.error('Error fetching direct link:', error);
        alert(`Error fetching direct link: ${error.message}`);
        document.getElementById('direct-link-modal').style.display = 'none';
    }
}

/**
 * Save direct link
 */
async function saveDirectLink() {
    try {
        // Get form values
        const linkId = document.getElementById('direct-link-id').value;
        const title = document.getElementById('direct-link-title').value;
        const category = document.getElementById('direct-link-category').value;
        const url = document.getElementById('direct-link-url').value;
        const description = document.getElementById('direct-link-description').value;
        const display_order = parseInt(document.getElementById('direct-link-display-order').value) || 1;
        const featured = document.getElementById('direct-link-featured').checked;

        // Validate required fields
        if (!title || !category || !url) {
            alert('Please fill in all required fields.');
            return;
        }

        // Validate URL
        try {
            new URL(url);
        } catch (e) {
            alert('Please enter a valid URL (including http:// or https://).');
            return;
        }

        // Create direct link object
        const directLink = {
            title,
            category,
            url,
            description,
            display_order,
            featured,
            added_date: new Date().toISOString()
        };

        // Update or add direct link
        if (linkId) {
            // Update existing direct link
            await apiService.updateDirectLink(linkId, directLink);
        } else {
            // Add new direct link
            await apiService.addDirectLink(directLink);
        }

        // Close modal
        closeDirectLinkModal();

        // Reload direct links
        await loadAdminDirectLinks();

        // Show success message
        alert(`Direct link ${linkId ? 'updated' : 'added'} successfully.`);
    } catch (error) {
        console.error('Error saving direct link:', error);
        alert(`Error saving direct link: ${error.message}`);
    }
}

/**
 * Confirm delete direct link
 * @param {number} linkId - Direct link ID
 */
function confirmDeleteDirectLink(linkId) {
    // Store link ID for deletion
    document.getElementById('delete-modal').dataset.linkId = linkId;

    // Show delete confirmation modal
    document.getElementById('delete-modal').style.display = 'block';
}

/**
 * Delete direct link
 */
async function deleteDirectLink() {
    try {
        const linkId = document.getElementById('delete-modal').dataset.linkId;

        if (!linkId) {
            alert('Direct link ID not found.');
            return;
        }

        // Delete direct link from API
        await apiService.deleteDirectLink(linkId);

        // Close modal
        closeDeleteModal();

        // Reload direct links
        await loadAdminDirectLinks();

        // Show success message
        alert('Direct link deleted successfully.');
    } catch (error) {
        console.error('Error deleting direct link:', error);
        alert(`Error deleting direct link: ${error.message}`);
    }
}

/**
 * Admin Study Materials Page Functionality
 */
function initAdminStudyMaterialsPage() {
    console.log('Initializing Admin Study Materials page');

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const actionParam = urlParams.get('action');
    let typeParam = urlParams.get('type');

    // Validate type parameter
    const validTypes = ['notes', 'ebooks', 'videos', 'mock-tests'];
    if (typeParam && !validTypes.includes(typeParam)) {
        console.warn(`Invalid type parameter: ${typeParam}. Defaulting to 'videos'`);
        typeParam = 'videos';

        // Update URL without reloading the page
        urlParams.set('type', typeParam);
        const newUrl = window.location.pathname + '?' + urlParams.toString();
        window.history.replaceState({}, '', newUrl);
    }

    console.log('URL parameters:', { actionParam, typeParam });

    // Initialize filters
    initializeStudyMaterialFilters(typeParam);

    // Load study materials
    loadAdminStudyMaterials();

    // Open add modal if action=add
    if (actionParam === 'add') {
        openStudyMaterialModal(typeParam);
    }

    // Add event listeners
    const addStudyMaterialBtn = document.getElementById('add-study-material-btn');
    if (addStudyMaterialBtn) {
        addStudyMaterialBtn.addEventListener('click', function() {
            openStudyMaterialModal();
        });
    }

    const cancelStudyMaterialBtn = document.getElementById('cancel-study-material-btn');
    if (cancelStudyMaterialBtn) {
        cancelStudyMaterialBtn.addEventListener('click', function() {
            closeStudyMaterialModal();
        });
    }

    const studyMaterialForm = document.getElementById('study-material-form');
    if (studyMaterialForm && !studyMaterialForm.dataset.listenerAttached) {
        studyMaterialForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveStudyMaterial();
        });
        studyMaterialForm.dataset.listenerAttached = 'true';
    }

    // Add event listener for type field to update form fields when type changes
    const typeField = document.getElementById('study-material-type');
    if (typeField) {
        typeField.addEventListener('change', function() {
            updateFormFields();
        });
    }

    const closeModalBtns = document.querySelectorAll('.close-modal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            closeAllModals();
        });
    });

    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function() {
            closeDeleteModal();
        });
    }

    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) {
        // Remove any previous listeners before adding a new one
        confirmDeleteBtn.replaceWith(confirmDeleteBtn.cloneNode(true));
        const newConfirmDeleteBtn = document.getElementById('confirm-delete-btn');
        newConfirmDeleteBtn.addEventListener('click', function() {
            deleteStudyMaterial();
        });
    }

    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            applyStudyMaterialFilters();
        });
    }

    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            clearStudyMaterialFilters();
        });
    }

    // This event listener is now added in the main initAdminStudyMaterialsPage function
}

/**
 * Initialize filter values from URL parameters for study materials
 * @param {string} typeParam - Type parameter from URL
 */
function initializeStudyMaterialFilters(typeParam) {
    const typeFilter = document.getElementById('study-material-type-filter');
    if (typeFilter && typeParam) {
        typeFilter.value = typeParam;
    }

    // Add event listeners to filter dropdowns for immediate filtering
    const filterDropdowns = document.querySelectorAll('.filter-group select');
    filterDropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', function() {
            // Automatically apply filters when dropdown changes
            document.getElementById('apply-filters-btn').click();
        });
    });
}

/**
 * Apply filters to study materials
 */
function applyStudyMaterialFilters() {
    // Get filter values
    const typeFilter = document.getElementById('study-material-type-filter');

    // Update URL with filter parameters without reloading the page
    const urlParams = new URLSearchParams(window.location.search);

    if (typeFilter && typeFilter.value) {
        urlParams.set('type', typeFilter.value);
    } else {
        urlParams.delete('type');
    }

    // Update URL without reloading the page
    const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
    window.history.pushState({}, '', newUrl);

    // Load filtered study materials
    loadAdminStudyMaterials();
}

/**
 * Clear all filters for study materials
 */
function clearStudyMaterialFilters() {
    const typeFilter = document.getElementById('study-material-type-filter');
    const categoryFilter = document.getElementById('study-material-category-filter');
    const featuredFilter = document.getElementById('study-material-featured-filter');

    if (typeFilter) typeFilter.value = '';
    if (categoryFilter) categoryFilter.value = '';
    if (featuredFilter) featuredFilter.value = '';

    // Update URL by removing filter parameters
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.delete('type');

    // Update URL without reloading the page
    const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
    window.history.pushState({}, '', newUrl);

    // Load all study materials
    loadAdminStudyMaterials();
}

/**
 * Get type name from type code
 * @param {string} typeCode - Type code
 * @returns {string} - Type name
 */
function getTypeName(typeCode) {
    const types = {
        'notes': 'Notes',
        'ebooks': 'E-Books',
        'videos': 'Videos',
        'mock-tests': 'Mock Tests'
    };

    return types[typeCode] || typeCode;
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
        'police': 'Police',
        'ssc': 'SSC',
        'upsc': 'UPSC'
    };

    return categories[categoryCode] || categoryCode;
}

/**
 * Load study materials for admin panel
 */
async function loadAdminStudyMaterials() {
    console.log('Loading study materials...');

    const studyMaterialsTableBody = document.getElementById('study-materials-table-body');

    if (!studyMaterialsTableBody) {
        console.error('Study materials table body not found');
        return;
    }

    // Show loading indicator
    studyMaterialsTableBody.innerHTML = '<tr><td colspan="8" class="loading">Loading study materials...</td></tr>';

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const typeFromUrl = urlParams.get('type');

    // Get filter values
    const typeFilterElement = document.getElementById('study-material-type-filter');
    const categoryFilterElement = document.getElementById('study-material-category-filter');
    const featuredFilterElement = document.getElementById('study-material-featured-filter');

    // Set the type filter value from URL if it exists and the filter element doesn't have a value
    if (typeFilterElement && typeFromUrl && !typeFilterElement.value) {
        typeFilterElement.value = typeFromUrl;
    }

    const typeFilter = typeFilterElement ? typeFilterElement.value : typeFromUrl;
    const categoryFilter = categoryFilterElement ? categoryFilterElement.value : '';
    const featuredFilter = featuredFilterElement ? featuredFilterElement.value : '';

    try {
        // Get the appropriate data array based on the type
        let dataArray = [];

        // Fetch data from API based on type
        switch (typeFilter) {
            case 'notes':
                dataArray = await apiService.getNotes();
                break;
            case 'ebooks':
                dataArray = await apiService.getEbooks();
                break;
            case 'videos':
                dataArray = await apiService.getVideos();
                break;
            case 'mock-tests':
                dataArray = await apiService.getMockTests();
                break;
            default:
                // Combine all arrays if no type filter
                const notes = await apiService.getNotes();
                const ebooks = await apiService.getEbooks();
                const videos = await apiService.getVideos();
                const mockTests = await apiService.getMockTests();

                dataArray = [
                    ...(notes || []).map(item => ({ ...item, type: 'notes' })),
                    ...(ebooks || []).map(item => ({ ...item, type: 'ebooks' })),
                    ...(videos || []).map(item => ({ ...item, type: 'videos' })),
                    ...(mockTests || []).map(item => ({ ...item, type: 'mock-tests' }))
                ];
        }

        // Filter by category if specified
        if (categoryFilter) {
            dataArray = dataArray.filter(item => item.category === categoryFilter);
        }

        // Filter by featured if specified
        if (featuredFilter) {
            const isFeatured = featuredFilter === 'true';
            dataArray = dataArray.filter(item => item.featured === isFeatured);
        }

        // Sort by added date (newest first)
        dataArray.sort((a, b) => new Date(b.added_date) - new Date(a.added_date));

        // Generate HTML
        let studyMaterialsHTML = '';

        if (dataArray.length > 0) {
            dataArray.forEach(item => {
                // Determine the link field based on the type
                let linkField = '';
                let linkText = '';

                switch (item.type) {
                    case 'notes':
                        linkField = item.download_link || '#';
                        linkText = 'View Notes';
                        break;
                    case 'ebooks':
                        linkField = item.download_link || '#';
                        linkText = 'Download E-Book';
                        break;
                    case 'videos':
                        linkField = item.video_link || '#';
                        linkText = 'Watch Video';
                        break;
                    case 'mock-tests':
                        linkField = item.test_link || '#';
                        linkText = 'Start Test';
                        break;
                    default:
                        linkField = '#';
                        linkText = 'View Link';
                }

                // Make sure we have a valid type for display
                const displayType = typeFilter || item.type || 'videos'; // Default to videos if type is missing

                studyMaterialsHTML += `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.title}</td>
                        <td>${getTypeName(displayType)}</td>
                        <td>${getCategoryName(item.category)}</td>
                        <td><a href="${linkField}" target="_blank">${linkText}</a></td>
                        <td><span class="status-badge ${item.featured ? 'status-active' : 'status-expired'}">${item.featured ? 'Yes' : 'No'}</span></td>
                        <td>${formatDate(item.added_date)}</td>
                        <td>
                            <div class="table-actions">
                                <button class="view-btn" onclick="viewStudyMaterial(${item.id}, '${displayType}')"><i class="fas fa-eye"></i></button>
                                <button class="edit-btn" onclick="editStudyMaterial(${item.id}, '${displayType}')"><i class="fas fa-edit"></i></button>
                                <button class="delete-btn" onclick="confirmDeleteStudyMaterial(${item.id}, '${displayType}')"><i class="fas fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>
                `;
            });
        } else {
            const typeName = typeFilter ? getTypeName(typeFilter) : 'study materials';
            studyMaterialsHTML = `
                <tr>
                    <td colspan="8" class="no-data">No ${typeName} found. Click "Add New" to create one.</td>
                </tr>
            `;
        }

        studyMaterialsTableBody.innerHTML = studyMaterialsHTML;
    } catch (error) {
        console.error('Error loading study materials:', error);
        studyMaterialsTableBody.innerHTML = `
            <tr>
                <td colspan="8" class="error">Error loading study materials: ${error.message}</td>
            </tr>
        `;
    }
}

/**
 * Extract YouTube video ID from a URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - YouTube video ID or null if not found
 */
function extractYouTubeVideoId(url) {
    if (!url) return null;

    console.log('Extracting video ID from URL:', url);

    try {
        // Handle youtu.be short URLs
        if (url.includes('youtu.be/')) {
            // Extract the part after youtu.be/ and before any query parameters
            const match = url.match(/youtu\.be\/([^?&\s]+)/);
            if (match && match[1]) {
                console.log('Extracted video ID from youtu.be URL:', match[1]);
                return match[1];
            }
        }

        // Try to extract video ID from URL with si parameter
        const siMatch = url.match(/youtu\.be\/([^?]+)\?si=/);
        if (siMatch && siMatch[1]) {
            console.log('Extracted video ID from youtu.be URL with si parameter:', siMatch[1]);
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
                console.log('Extracted video ID from youtube.com/watch URL:', videoId);
                return videoId;
            }
        }

        // youtube.com/embed/VIDEO_ID
        if (urlObj.hostname.includes('youtube.com') && urlObj.pathname.startsWith('/embed/')) {
            const videoId = urlObj.pathname.split('/embed/')[1];
            if (videoId) {
                console.log('Extracted video ID from youtube.com/embed URL:', videoId);
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

/**
 * Update form fields based on selected type
 */
function updateFormFields() {
    const typeField = document.getElementById('study-material-type');
    if (!typeField) return;

    const type = typeField.value;

    // Get link field container and help text
    const linkContainer = document.getElementById('link-field-container');
    const linkField = document.getElementById('study-material-link');
    const linkHelpText = document.getElementById('link-help-text');
    const thumbnailContainer = document.getElementById('thumbnail-field-container');

    // Update link field label and help text based on type
    if (linkContainer && linkField && linkHelpText) {
        // Show link field for all types
        linkContainer.style.display = 'block';

        // Update label and help text based on type
        switch (type) {
            case 'notes':
                linkContainer.querySelector('label').textContent = 'Download Link*';
                linkHelpText.textContent = 'Enter the URL where users can download the notes';
                if (thumbnailContainer) thumbnailContainer.style.display = 'none';
                break;
            case 'ebooks':
                linkContainer.querySelector('label').textContent = 'Download Link*';
                linkHelpText.textContent = 'Enter the URL where users can download the e-book';
                if (thumbnailContainer) thumbnailContainer.style.display = 'none';
                break;
            case 'videos':
                linkContainer.querySelector('label').textContent = 'Video Link*';
                linkHelpText.textContent = 'Enter the YouTube video URL';
                if (thumbnailContainer) thumbnailContainer.style.display = 'block';
                break;
            case 'mock-tests':
                linkContainer.querySelector('label').textContent = 'Test Link*';
                linkHelpText.textContent = 'Enter the URL where users can take the mock test';
                if (thumbnailContainer) thumbnailContainer.style.display = 'none';
                break;
            default:
                linkContainer.querySelector('label').textContent = 'Link*';
                linkHelpText.textContent = 'Enter the URL for the study material';
                if (thumbnailContainer) thumbnailContainer.style.display = 'none';
        }
    }

    // Update modal title
    const modalTitle = document.getElementById('modal-title');
    if (modalTitle) {
        const action = document.getElementById('study-material-id').value ? 'Edit' : 'Add New';
        modalTitle.textContent = `${action} ${getTypeName(type)}`;
    }
}

/**
 * Open study material modal for adding a new study material
 * @param {string} type - Type code (optional)
 */
function openStudyMaterialModal(type) {
    // Check if form elements exist
    const form = document.getElementById('study-material-form');
    const idField = document.getElementById('study-material-id');
    const typeField = document.getElementById('study-material-type');
    const titleField = document.getElementById('modal-title');
    const featuredField = document.getElementById('study-material-featured');
    const modal = document.getElementById('study-material-modal');

    if (!form || !modal) {
        console.error('Modal form elements not found');
        return;
    }

    // Reset form
    form.reset();
    if (idField) idField.value = '';

    // Set type if provided
    if (type && typeField) {
        typeField.value = type;
        const typeName = getTypeName(type);
        if (titleField) titleField.textContent = `Add New ${typeName}`;

        // Update form fields based on type
        updateFormFields();
    } else {
        if (titleField) titleField.textContent = 'Add New Study Material';
    }

    // Set featured checkbox to true by default
    if (featuredField) featuredField.checked = true;

    // Show modal
    modal.style.display = 'block';
}

/**
 * Close study material modal
 */
function closeStudyMaterialModal() {
    document.getElementById('study-material-modal').style.display = 'none';
}

/**
 * View study material details
 * @param {number} materialId - Study material ID
 * @param {string} type - Study material type
 */
async function viewStudyMaterial(materialId, type) {
    // In a real implementation, this would open a detailed view
    // For this implementation, we'll just open the edit modal in read-only mode
    await editStudyMaterial(materialId, type, true);
}

/**
 * Edit study material
 * @param {number} materialId - Study material ID
 * @param {string} type - Study material type
 * @param {boolean} readOnly - Whether to open in read-only mode
 */
async function editStudyMaterial(materialId, type, readOnly = false) {
    try {
        // Show loading indicator
        document.getElementById('modal-title').textContent = 'Loading...';
        document.getElementById('study-material-modal').style.display = 'block';

        // Fetch study material from API based on type
        let material;
        switch (type) {
            case 'notes':
                material = await apiService.getNote(materialId);
                break;
            case 'ebooks':
                material = await apiService.getEbook(materialId);
                break;
            case 'videos':
                material = await apiService.getVideo(materialId);
                break;
            case 'mock-tests':
                material = await apiService.getMockTest(materialId);
                break;
            default:
                alert(`Invalid study material type: ${type}`);
                document.getElementById('study-material-modal').style.display = 'none';
                return;
        }

        if (!material) {
            alert('Study material not found.');
            document.getElementById('study-material-modal').style.display = 'none';
            return;
        }

        // Set form values
        document.getElementById('study-material-id').value = material.id;
        document.getElementById('study-material-type').value = type;
        document.getElementById('study-material-title').value = material.title;
        document.getElementById('study-material-category').value = material.category;
        document.getElementById('study-material-description').value = material.description || '';
        document.getElementById('study-material-featured').checked = material.featured;

        // Set type-specific fields
        const linkField = document.getElementById('study-material-link');
        const thumbnailField = document.getElementById('study-material-thumbnail');

        if (linkField) {
            switch (type) {
                case 'notes':
                case 'ebooks':
                    linkField.value = material.download_link || '';
                    break;
                case 'videos':
                    linkField.value = material.video_link || '';
                    if (thumbnailField) {
                        thumbnailField.value = material.thumbnail_image || '';
                    }
                    break;
                case 'mock-tests':
                    linkField.value = material.test_link || '';
                    break;
            }
        }

        // Update form fields based on type
        updateFormFields();

        // Set modal title
        document.getElementById('modal-title').textContent = readOnly ? `View ${getTypeName(type)}` : `Edit ${getTypeName(type)}`;

        // Set form fields to read-only if needed
        const formElements = document.getElementById('study-material-form').elements;
        for (let i = 0; i < formElements.length; i++) {
            formElements[i].readOnly = readOnly;
            if (formElements[i].type === 'select-one' || formElements[i].type === 'checkbox') {
                formElements[i].disabled = readOnly;
            }
        }

        // Hide/show buttons
        document.getElementById('save-study-material-btn').style.display = readOnly ? 'none' : 'block';
    } catch (error) {
        console.error('Error fetching study material:', error);
        alert(`Error fetching study material: ${error.message}`);
        document.getElementById('study-material-modal').style.display = 'none';
    }
}

/**
 * Save study material
 */
let isSubmittingStudyMaterial = false;
async function saveStudyMaterial() {
    if (isSubmittingStudyMaterial) return;
    isSubmittingStudyMaterial = true;
    const saveBtn = document.getElementById('save-study-material-btn');
    if (saveBtn) saveBtn.disabled = true;
    try {
        // Get form values
        const materialId = document.getElementById('study-material-id').value;
        const type = document.getElementById('study-material-type').value;
        const title = document.getElementById('study-material-title').value;
        const category = document.getElementById('study-material-category').value;
        const description = document.getElementById('study-material-description').value;
        const featured = document.getElementById('study-material-featured').checked;
        const link = document.getElementById('study-material-link').value;
        const thumbnailInput = document.getElementById('study-material-thumbnail').value;

        // Validate required fields
        if (!title || !category || !type || !link) {
            alert('Please fill in all required fields.');
            return;
        }

        // Create study material object
        const studyMaterial = {
            title,
            category,
            description,
            featured,
            added_date: new Date().toISOString()
        };

        // Add type-specific fields
        switch (type) {
            case 'notes':
            case 'ebooks':
                studyMaterial.download_link = link;
                break;
            case 'videos':
                studyMaterial.video_link = link;

                // Extract video ID and set thumbnail if not provided
                const videoId = extractYouTubeVideoId(link);

                if (videoId && !thumbnailInput) {
                    studyMaterial.thumbnail_image = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                } else {
                    studyMaterial.thumbnail_image = thumbnailInput;
                }
                break;
            case 'mock-tests':
                studyMaterial.test_link = link;
                break;
            default:
                alert(`Invalid study material type: ${type}`);
                return;
        }

        // Update or add study material based on type
        if (materialId) {
            // Update existing study material
            switch (type) {
                case 'notes':
                    await apiService.updateNote(materialId, studyMaterial);
                    break;
                case 'ebooks':
                    await apiService.updateEbook(materialId, studyMaterial);
                    break;
                case 'videos':
                    await apiService.updateVideo(materialId, studyMaterial);
                    break;
                case 'mock-tests':
                    await apiService.updateMockTest(materialId, studyMaterial);
                    break;
            }
        } else {
            // Add new study material
            switch (type) {
                case 'notes':
                    await apiService.addNote(studyMaterial);
                    break;
                case 'ebooks':
                    await apiService.addEbook(studyMaterial);
                    break;
                case 'videos':
                    await apiService.addVideo(studyMaterial);
                    break;
                case 'mock-tests':
                    await apiService.addMockTest(studyMaterial);
                    break;
            }
        }

        // Close modal
        closeStudyMaterialModal();

        // Reload study materials
        await loadAdminStudyMaterials();

        // Show success message
        alert(`${getTypeName(type)} ${materialId ? 'updated' : 'added'} successfully.`);
    } catch (error) {
        console.error('Error saving study material:', error);
        alert(`Error saving study material: ${error.message}`);
    } finally {
        isSubmittingStudyMaterial = false;
        if (saveBtn) saveBtn.disabled = false;
    }
}

/**
 * Confirm delete study material
 * @param {number} materialId - Study material ID
 * @param {string} type - Study material type
 */
function confirmDeleteStudyMaterial(materialId, type) {
    // Store material ID and type for deletion
    document.getElementById('delete-modal').dataset.materialId = materialId;
    document.getElementById('delete-modal').dataset.materialType = type;

    // Show delete confirmation modal
    document.getElementById('delete-modal').style.display = 'block';
}

/**
 * Delete study material (admin)
 */
async function deleteStudyMaterial() {
    // Get loading indicator and buttons
    const loadingIndicator = document.getElementById('delete-loading');
    const confirmBtn = document.getElementById('confirm-delete-btn');
    const cancelBtn = document.getElementById('cancel-delete-btn');

    try {
        const modal = document.getElementById('delete-modal');
        const materialId = modal.dataset.materialId;
        const type = modal.dataset.materialType;

        if (!materialId || !type) {
            alert('Could not determine which study material to delete.');
            return;
        }

        // Show loading indicator and disable buttons
        if (loadingIndicator) loadingIndicator.style.display = 'block';
        if (confirmBtn) confirmBtn.disabled = true;
        if (cancelBtn) cancelBtn.disabled = true;

        console.log(`Attempting to delete study material with ID: ${materialId} and type: ${type}`);

        // First check if the study material exists
        try {
            switch (type) {
                case 'notes':
                    await apiService.getNote(materialId);
                    break;
                case 'ebooks':
                    await apiService.getEbook(materialId);
                    break;
                case 'videos':
                    await apiService.getVideo(materialId);
                    break;
                case 'mock-tests':
                    await apiService.getMockTest(materialId);
                    break;
                default:
                    throw new Error('Unknown study material type: ' + type);
            }
        } catch (checkError) {
            console.error(`Study material with ID ${materialId} and type ${type} not found:`, checkError);

            // Hide loading indicator
            if (loadingIndicator) loadingIndicator.style.display = 'none';

            closeDeleteModal();
            alert('This study material no longer exists or has already been deleted.');
            await loadAdminStudyMaterials(); // Refresh the table
            return;
        }

        // Delete study material from API
        let response;
        switch (type) {
            case 'notes':
                response = await apiService.deleteNote(materialId);
                break;
            case 'ebooks':
                response = await apiService.deleteEbook(materialId);
                break;
            case 'videos':
                response = await apiService.deleteVideo(materialId);
                break;
            case 'mock-tests':
                response = await apiService.deleteMockTest(materialId);
                break;
            default:
                throw new Error('Unknown study material type: ' + type);
        }
        console.log('Delete response:', response);

        // Hide loading indicator
        if (loadingIndicator) loadingIndicator.style.display = 'none';

        // Close modal
        closeDeleteModal();

        // Reload study materials
        await loadAdminStudyMaterials();

        // Show success message
        alert('Study material deleted successfully.');
    } catch (error) {
        console.error('Error deleting study material:', error);

        // Hide loading indicator and re-enable buttons
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        if (confirmBtn) confirmBtn.disabled = false;
        if (cancelBtn) cancelBtn.disabled = false;

        // Check for specific error types
        if (error.message.includes('404') || error.message.includes('not found')) {
            alert('This study material no longer exists or has already been deleted.');
            closeDeleteModal();
        } else {
            alert(`Error deleting study material: ${error.message}`);
            // Keep modal open for non-404 errors so user can try again
            return;
        }

        // Refresh the table
        await loadAdminStudyMaterials();
    }
}


/**
 * Close delete modal
 */
function closeDeleteModal() {
    console.log('Closing delete modal');
    const deleteModal = document.getElementById('delete-modal');
    if (deleteModal) {
        deleteModal.style.display = 'none';
    } else {
        console.error('Delete modal not found');
    }
}

/**
 * Close all modals
 */
function closeAllModals() {
    console.log('Closing all modals');
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}


/**
 * Admin Results Page Functionality
 */
function initAdminResultsPage() {
    console.log('Initializing Admin Results page');

    // Load results
    loadAdminResults();

    // Add event listeners
    const addResultBtn = document.getElementById('add-result-btn');
    if (addResultBtn) {
        addResultBtn.addEventListener('click', function() {
            openResultModal();
        });
    }

    const cancelResultBtn = document.getElementById('cancel-result-btn');
    if (cancelResultBtn) {
        cancelResultBtn.addEventListener('click', function() {
            closeResultModal();
        });
    }

    const resultForm = document.getElementById('result-form');
    if (resultForm && !resultForm.dataset.listenerAttached) {
        console.log('Attaching submit event listener to result form');

        if (typeof window.debugLog === 'function') {
            window.debugLog('Attaching result form submit event listener from admin-handler.js');
        }

        // Remove any existing event listeners by cloning and replacing the form
        const newResultForm = resultForm.cloneNode(true);
        resultForm.parentNode.replaceChild(newResultForm, resultForm);

        // Add event listener to form submit
        newResultForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Result form submitted from admin-handler.js');

            if (typeof window.debugLog === 'function') {
                window.debugLog('Result form submitted from admin-handler.js');
            }

            // Use a flag to prevent multiple submissions
            if (window.isSubmittingResultForm) {
                console.log('Already submitting result form, preventing duplicate submission');

                if (typeof window.debugLog === 'function') {
                    window.debugLog('Already submitting result form, preventing duplicate submission');
                }
                return;
            }

            // Set flag to prevent multiple submissions
            window.isSubmittingResultForm = true;

            if (typeof window.debugLog === 'function') {
                window.debugLog('Set isSubmittingResultForm flag to true');
            }

            // Call saveResult function
            saveResult();

            // Reset flag after a short delay
            setTimeout(() => {
                window.isSubmittingResultForm = false;

                if (typeof window.debugLog === 'function') {
                    window.debugLog('Reset isSubmittingResultForm flag to false');
                }
            }, 1000);
        });

        // Mark the form as having a listener attached
        newResultForm.dataset.listenerAttached = 'true';
        console.log('Result form listener attached successfully from admin-handler.js');

        if (typeof window.debugLog === 'function') {
            window.debugLog('Result form listener attached successfully from admin-handler.js');
        }
    } else if (resultForm && resultForm.dataset.listenerAttached) {
        console.log('Result form already has a listener attached, skipping in admin-handler.js');

        if (typeof window.debugLog === 'function') {
            window.debugLog('Result form already has a listener attached, skipping in admin-handler.js');
        }
    }

    const closeModalBtns = document.querySelectorAll('.close-modal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            closeAllModals();
        });
    });

    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function() {
            closeDeleteModal();
        });
    }

    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) {
        // Remove any previous event listeners to avoid multiple calls
        confirmDeleteBtn.replaceWith(confirmDeleteBtn.cloneNode(true));
        const newConfirmDeleteBtn = document.getElementById('confirm-delete-btn');
        newConfirmDeleteBtn.addEventListener('click', function() {
            deleteResult();
        });
    }

    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            loadAdminResults();
        });
    }

    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            document.getElementById('result-category-filter').value = '';
            loadAdminResults();
        });
    }
}

/**
 * Load results for admin panel
 */
async function loadAdminResults() {
    console.log('Loading admin results...');
    const resultsTableBody = document.getElementById('results-table-body');

    if (!resultsTableBody) {
        console.error('Results table body not found');
        return;
    }

    // Show loading indicator
    resultsTableBody.innerHTML = `
        <tr>
            <td colspan="7" class="loading-message">Loading results...</td>
        </tr>
    `;

    try {
        // Get filter values
        const categoryFilter = document.getElementById('result-category-filter').value;
        console.log('Category filter:', categoryFilter);

        // Prepare filters
        const filters = {};
        if (categoryFilter) {
            filters.category = categoryFilter;
        }
        console.log('Filters:', filters);

        // Fetch results from API
        console.log('Fetching results from API...');
        const results = await apiService.getResults(filters);
        console.log('Results fetched:', results);

        // Generate HTML
        let resultsHTML = '';

        if (results && results.length > 0) {
            console.log(`Found ${results.length} results`);
            results.forEach(result => {
                resultsHTML += `
                    <tr>
                        <td>${result.id}</td>
                        <td>${result.title}</td>
                        <td>${result.organization}</td>
                        <td>${getCategoryName(result.category)}</td>
                        <td>${formatDate(result.result_date)}</td>
                        <td><a href="${result.result_link}" target="_blank">View Result</a></td>
                        <td>
                            <div class="table-actions">
                                <button class="view-btn" onclick="viewResult('${result.id}')"><i class="fas fa-eye"></i></button>
                                <button class="edit-btn" onclick="editResult('${result.id}')"><i class="fas fa-edit"></i></button>
                                <button class="delete-btn" onclick="confirmDeleteResult('${result.id}')"><i class="fas fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>
                `;
            });
        } else {
            console.log('No results found');
            resultsHTML = `
                <tr>
                    <td colspan="7" class="no-data">No results found. Click "Add New" to create one.</td>
                </tr>
            `;
        }

        resultsTableBody.innerHTML = resultsHTML;
        console.log('Results table updated');
    } catch (error) {
        console.error('Error loading results:', error);
        resultsTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="error-message">Error loading results: ${error.message}</td>
            </tr>
        `;
    }
}

/**
 * Open result modal for adding a new result
 */
function openResultModal() {
    // Reset form
    document.getElementById('result-form').reset();
    document.getElementById('result-id').value = '';
    document.getElementById('modal-title').textContent = 'Add New Result';

    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('result-date').value = today;

    // Show modal
    document.getElementById('result-modal').style.display = 'block';
}

/**
 * Close result modal
 */
function closeResultModal() {
    document.getElementById('result-modal').style.display = 'none';
}

/**
 * View result details
 * @param {string|number} resultId - Result ID
 */
async function viewResult(resultId) {
    // In a real implementation, this would open a detailed view
    // For this implementation, we'll just open the edit modal in read-only mode
    await editResult(resultId, true);
}

/**
 * Edit result
 * @param {string|number} resultId - Result ID
 * @param {boolean} readOnly - Whether to open in read-only mode
 */
async function editResult(resultId, readOnly = false) {
    try {
        // Fetch result from API
        const result = await apiService.getResult(resultId);

        // Set form values
        document.getElementById('result-id').value = result.id;
        document.getElementById('result-title').value = result.title;
        document.getElementById('result-organization').value = result.organization;
        document.getElementById('result-category').value = result.category || '';
        document.getElementById('result-date').value = result.result_date || '';
        document.getElementById('result-description').value = result.description || '';
        document.getElementById('result-link').value = result.result_link || '';
        document.getElementById('result-featured').checked = result.featured || false;

        // Set modal title
        document.getElementById('modal-title').textContent = readOnly ? 'View Result' : 'Edit Result';

        // Set form fields to read-only if needed
        const formElements = document.getElementById('result-form').elements;
        for (let i = 0; i < formElements.length; i++) {
            formElements[i].readOnly = readOnly;
            if (formElements[i].type === 'select-one' || formElements[i].type === 'checkbox') {
                formElements[i].disabled = readOnly;
            }
        }

        // Hide/show buttons
        document.getElementById('save-result-btn').style.display = readOnly ? 'none' : 'block';

        // Show modal
        document.getElementById('result-modal').style.display = 'block';
    } catch (error) {
        console.error('Error fetching result:', error);
        alert(`Error fetching result: ${error.message}`);
    }
}

/**
 * Save result
 */
// Flag to prevent multiple submissions - use window object to share across scripts
window.isSavingResult = window.isSavingResult || false;

async function saveResult() {
    console.log('saveResult function called from admin-handler.js');

    // Add debug log if available
    if (typeof window.debugLog === 'function') {
        window.debugLog('saveResult function called from admin-handler.js');
    }

    // Prevent multiple submissions
    if (window.isSavingResult) {
        console.log('Already saving result, preventing duplicate submission');

        if (typeof window.debugLog === 'function') {
            window.debugLog('Already saving result, preventing duplicate submission');
        }
        return;
    }

    // Set flag to prevent multiple submissions
    window.isSavingResult = true;

    if (typeof window.debugLog === 'function') {
        window.debugLog('Set isSavingResult flag to true');
    }

    // Disable save button
    const saveBtn = document.getElementById('save-result-btn');
    if (saveBtn) saveBtn.disabled = true;

    try {
        console.log('Saving result...');

        // Get form values
        const resultId = document.getElementById('result-id').value;
        const title = document.getElementById('result-title').value;
        const organization = document.getElementById('result-organization').value;
        const category = document.getElementById('result-category').value;
        const result_date = document.getElementById('result-date').value;
        const description = document.getElementById('result-description').value;
        const result_link = document.getElementById('result-link').value;
        const featured = document.getElementById('result-featured').checked;

        // Validate required fields
        if (!title || !organization || !category || !result_date || !result_link) {
            alert('Please fill in all required fields.');
            window.isSavingResult = false;
            if (saveBtn) saveBtn.disabled = false;
            return;
        }

        // Create result object
        const result = {
            title,
            organization,
            category,
            result_date,
            description,
            result_link,
            featured,
            posted_date: new Date().toISOString()
        };

        console.log('Result data to save:', result);

        // Update or add result
        if (resultId) {
            // Update existing result
            console.log(`Updating result with ID: ${resultId}`);
            await apiService.updateResult(resultId, result);
        } else {
            // Add new result
            console.log('Adding new result');
            await apiService.addResult(result);
        }

        // Close modal
        closeResultModal();

        // Reload results
        await loadAdminResults();

        // Show success message
        alert(`Result ${resultId ? 'updated' : 'added'} successfully.`);
    } catch (error) {
        console.error('Error saving result:', error);
        alert(`Error saving result: ${error.message}`);
    } finally {
        // Reset flag and re-enable button
        window.isSavingResult = false;

        if (typeof window.debugLog === 'function') {
            window.debugLog('Reset isSavingResult flag to false');
        }

        if (saveBtn) saveBtn.disabled = false;
    }
}

/**
 * Confirm delete result
 * @param {string|number} resultId - Result ID
 */
function confirmDeleteResult(resultId) {
    // Store result ID for deletion
    document.getElementById('delete-modal').dataset.resultId = resultId;

    // Show delete confirmation modal
    document.getElementById('delete-modal').style.display = 'block';
}

/**
 * Delete result
 */
async function deleteResult() {
    // Get loading indicator and buttons
    const loadingIndicator = document.getElementById('delete-loading');
    const confirmBtn = document.getElementById('confirm-delete-btn');
    const cancelBtn = document.getElementById('cancel-delete-btn');

    try {
        const resultId = document.getElementById('delete-modal').dataset.resultId;

        if (!resultId) {
            alert('Result ID not found.');
            return;
        }

        // Show loading indicator and disable buttons
        if (loadingIndicator) loadingIndicator.style.display = 'block';
        if (confirmBtn) confirmBtn.disabled = true;
        if (cancelBtn) cancelBtn.disabled = true;

        console.log(`Attempting to delete result with ID: ${resultId}`);

        // First check if the result exists
        try {
            await apiService.getResult(resultId);
        } catch (checkError) {
            console.error(`Result with ID ${resultId} not found:`, checkError);

            // Hide loading indicator
            if (loadingIndicator) loadingIndicator.style.display = 'none';

            closeDeleteModal();
            alert('This result no longer exists or has already been deleted.');
            await loadAdminResults(); // Refresh the table
            return;
        }

        // Delete result from API
        const response = await apiService.deleteResult(resultId);
        console.log('Delete response:', response);

        // Hide loading indicator
        if (loadingIndicator) loadingIndicator.style.display = 'none';

        // Close modal
        closeDeleteModal();

        // Reload results
        await loadAdminResults();

        // Show success message
        alert('Result deleted successfully.');
    } catch (error) {
        console.error('Error deleting result:', error);

        // Hide loading indicator and re-enable buttons
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        if (confirmBtn) confirmBtn.disabled = false;
        if (cancelBtn) cancelBtn.disabled = false;

        // Check for specific error types
        if (error.message.includes('404') || error.message.includes('not found')) {
            alert('This result no longer exists or has already been deleted.');
            closeDeleteModal();
        } else {
            alert(`Error deleting result: ${error.message}`);
            // Keep modal open for non-404 errors so user can try again
            return;
        }

        // Refresh the table
        await loadAdminResults();
    }
}

/**
 * Admin Admit Cards Page Functionality
 */
function initAdminAdmitCardsPage() {
    console.log('Initializing Admin Admit Cards page');

    // Load admit cards
    loadAdminAdmitCards();

    // Add event listeners
    const addAdmitCardBtn = document.getElementById('add-admit-card-btn');
    if (addAdmitCardBtn) {
        addAdmitCardBtn.addEventListener('click', function() {
            openAdmitCardModal();
        });
    }

    const cancelAdmitCardBtn = document.getElementById('cancel-admit-card-btn');
    if (cancelAdmitCardBtn) {
        cancelAdmitCardBtn.addEventListener('click', function() {
            closeAdmitCardModal();
        });
    }

    const admitCardForm = document.getElementById('admit-card-form');
    if (admitCardForm) {
        admitCardForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveAdmitCard();
        });
    }

    const closeModalBtns = document.querySelectorAll('.close-modal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            closeAllModals();
        });
    });

    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function() {
            closeDeleteModal();
        });
    }

    // IMPORTANT: This is the key fix - properly set up the delete button
    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    console.log('Found confirm delete button:', !!confirmDeleteBtn);

    if (confirmDeleteBtn) {
        // First, remove the onclick attribute if it exists
        confirmDeleteBtn.removeAttribute('onclick');

        // Remove any existing event listeners by cloning and replacing
        const newConfirmDeleteBtn = confirmDeleteBtn.cloneNode(true);
        confirmDeleteBtn.parentNode.replaceChild(newConfirmDeleteBtn, confirmDeleteBtn);

        // Add new event listener with a direct function reference
        newConfirmDeleteBtn.addEventListener('click', function() {
            console.log('Delete button clicked from event listener');
            // Get the ID from the modal's dataset
            const deleteModal = document.getElementById('delete-modal');
            const admitCardId = deleteModal.dataset.admitCardId;
            console.log('Admit card ID from dataset in click handler:', admitCardId);

            // Call the delete function
            deleteAdmitCard();
        });

        console.log('Added event listener to delete button');
    }

    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            loadAdminAdmitCards();
        });
    }

    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            document.getElementById('admit-card-category-filter').value = '';
            loadAdminAdmitCards();
        });
    }
}

/**
 * Load admit cards for admin panel
 */
async function loadAdminAdmitCards() {
    const admitCardsTableBody = document.getElementById('admit-cards-table-body');

    if (!admitCardsTableBody) return;

    // Show loading indicator
    admitCardsTableBody.innerHTML = `
        <tr>
            <td colspan="7" class="loading-message">Loading admit cards...</td>
        </tr>
    `;

    try {
        // Get filter values
        const categoryFilter = document.getElementById('admit-card-category-filter').value;

        // Prepare filters
        const filters = {};
        if (categoryFilter) {
            filters.category = categoryFilter;
        }

        // Fetch admit cards from API
        const admitCards = await apiService.getAdmitCards(filters);

        // Generate HTML
        let admitCardsHTML = '';

        if (admitCards.length > 0) {
            admitCards.forEach(admitCard => {
                admitCardsHTML += `
                    <tr>
                        <td>${admitCard.id}</td>
                        <td>${admitCard.title}</td>
                        <td>${admitCard.organization}</td>
                        <td>${getCategoryName(admitCard.category)}</td>
                        <td>${formatDate(admitCard.release_date)}</td>
                        <td><a href="${admitCard.download_link}" target="_blank">Download</a></td>
                        <td>
                            <div class="table-actions">
                                <button class="view-btn" onclick="viewAdmitCard(${admitCard.id})"><i class="fas fa-eye"></i></button>
                                <button class="edit-btn" onclick="editAdmitCard(${admitCard.id})"><i class="fas fa-edit"></i></button>
                                <button class="delete-btn" onclick="confirmDeleteAdmitCard(${admitCard.id})"><i class="fas fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>
                `;
            });
        } else {
            admitCardsHTML = `
                <tr>
                    <td colspan="7" class="no-data">No admit cards found. Click "Add New" to create one.</td>
                </tr>
            `;
        }

        admitCardsTableBody.innerHTML = admitCardsHTML;
    } catch (error) {
        console.error('Error loading admit cards:', error);
        admitCardsTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="error-message">Error loading admit cards: ${error.message}</td>
            </tr>
        `;
    }
}

/**
 * Open admit card modal for adding a new admit card
 */
function openAdmitCardModal() {
    // Reset form
    document.getElementById('admit-card-form').reset();
    document.getElementById('admit-card-id').value = '';
    document.getElementById('modal-title').textContent = 'Add New Admit Card';

    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('admit-card-release-date').value = today;

    // Show modal
    document.getElementById('admit-card-modal').style.display = 'block';
}

/**
 * Close admit card modal
 */
function closeAdmitCardModal() {
    document.getElementById('admit-card-modal').style.display = 'none';
}

/**
 * View admit card details
 * @param {number} admitCardId - Admit card ID
 */
async function viewAdmitCard(admitCardId) {
    // In a real implementation, this would open a detailed view
    // For this implementation, we'll just open the edit modal in read-only mode
    await editAdmitCard(admitCardId, true);
}

/**
 * Edit admit card
 * @param {number} admitCardId - Admit card ID
 * @param {boolean} readOnly - Whether to open in read-only mode
 */
async function editAdmitCard(admitCardId, readOnly = false) {
    try {
        // Fetch admit card from API
        const admitCard = await apiService.getAdmitCard(admitCardId);

        // Set form values
        document.getElementById('admit-card-id').value = admitCard.id;
        document.getElementById('admit-card-title').value = admitCard.title;
        document.getElementById('admit-card-organization').value = admitCard.organization;
        document.getElementById('admit-card-category').value = admitCard.category || '';
        document.getElementById('admit-card-release-date').value = admitCard.release_date || '';
        document.getElementById('admit-card-description').value = admitCard.description || '';
        document.getElementById('admit-card-download-link').value = admitCard.download_link || '';
        document.getElementById('admit-card-featured').checked = admitCard.featured || false;

        // Set modal title
        document.getElementById('modal-title').textContent = readOnly ? 'View Admit Card' : 'Edit Admit Card';

        // Set form fields to read-only if needed
        const formElements = document.getElementById('admit-card-form').elements;
        for (let i = 0; i < formElements.length; i++) {
            formElements[i].readOnly = readOnly;
            if (formElements[i].type === 'select-one' || formElements[i].type === 'checkbox') {
                formElements[i].disabled = readOnly;
            }
        }

        // Hide/show buttons
        document.getElementById('save-admit-card-btn').style.display = readOnly ? 'none' : 'block';

        // Show modal
        document.getElementById('admit-card-modal').style.display = 'block';
    } catch (error) {
        console.error('Error fetching admit card:', error);
        alert(`Error fetching admit card: ${error.message}`);
    }
}

/**
 * Save admit card
 */
async function saveAdmitCard() {
    // Prevent multiple submissions using a flag
    if (getGlobalFlag('isSavingAdmitCard')) {
        console.log('Already saving admit card, preventing duplicate submission');
        return;
    }

    // Set flag to prevent multiple submissions
    setGlobalFlag('isSavingAdmitCard', true);

    // Disable save button to prevent double submission
    const saveBtn = document.getElementById('save-admit-card-btn');
    if (saveBtn) saveBtn.disabled = true;

    try {
        // Get form values
        const admitCardId = document.getElementById('admit-card-id').value;
        const title = document.getElementById('admit-card-title').value;
        const organization = document.getElementById('admit-card-organization').value;
        const category = document.getElementById('admit-card-category').value;
        const release_date = document.getElementById('admit-card-release-date').value;
        const description = document.getElementById('admit-card-description').value;
        const download_link = document.getElementById('admit-card-download-link').value;
        const featured = document.getElementById('admit-card-featured').checked;

        // Validate required fields
        if (!title || !organization || !category || !release_date || !download_link) {
            alert('Please fill in all required fields.');
            setGlobalFlag('isSavingAdmitCard', false);
            if (saveBtn) saveBtn.disabled = false;
            return;
        }

        // Create admit card object
        const admitCard = {
            title,
            organization,
            category,
            release_date,
            description,
            download_link,
            featured,
            posted_date: new Date().toISOString()
        };

        console.log('Admit card data to save:', admitCard);

        // Update or add admit card
        if (admitCardId) {
            // Update existing admit card
            console.log(`Updating admit card with ID: ${admitCardId}`);
            await apiService.updateAdmitCard(admitCardId, admitCard);
        } else {
            // Add new admit card
            console.log('Adding new admit card');
            await apiService.addAdmitCard(admitCard);
        }

        // Close modal
        closeAdmitCardModal();

        // Reload admit cards
        await loadAdminAdmitCards();

        // Show success message
        alert(`Admit card ${admitCardId ? 'updated' : 'added'} successfully.`);
    } catch (error) {
        console.error('Error saving admit card:', error);
        alert(`Error saving admit card: ${error.message}`);
    } finally {
        // Reset flag and re-enable button
        setGlobalFlag('isSavingAdmitCard', false);
        if (saveBtn) saveBtn.disabled = false;
    }
}

/**
 * Confirm delete admit card
 * @param {number} admitCardId - Admit card ID
 */
function confirmDeleteAdmitCard(admitCardId) {
    console.log(`Confirming delete for admit card ID: ${admitCardId}`);

    // Store admit card ID for deletion
    const deleteModal = document.getElementById('delete-modal');
    if (deleteModal) {
        // Set the admit card ID in the dataset
        deleteModal.dataset.admitCardId = admitCardId;
        console.log('Stored admit card ID in modal dataset:', deleteModal.dataset.admitCardId);

        // Make sure the delete button is enabled
        const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
        if (confirmDeleteBtn) {
            confirmDeleteBtn.disabled = false;
            console.log('Enabled delete button');
        }

        // Show delete confirmation modal
        deleteModal.style.display = 'block';
    } else {
        console.error('Delete modal not found in the DOM');
    }
}

/**
 * Delete admit card
 */
async function deleteAdmitCard() {
    console.log('deleteAdmitCard function called');

    // Prevent multiple executions
    if (getGlobalFlag('isDeletingAdmitCard')) {
        console.log('Already deleting admit card, preventing duplicate execution');
        return;
    }

    // Set flag to prevent multiple executions
    setGlobalFlag('isDeletingAdmitCard', true);

    // Get loading indicator and buttons
    const loadingIndicator = document.getElementById('delete-loading');
    const confirmBtn = document.getElementById('confirm-delete-btn');
    const cancelBtn = document.getElementById('cancel-delete-btn');
    const deleteModal = document.getElementById('delete-modal');

    console.log('Elements found:', {
        loadingIndicator: !!loadingIndicator,
        confirmBtn: !!confirmBtn,
        cancelBtn: !!cancelBtn,
        deleteModal: !!deleteModal
    });

    try {
        const admitCardId = deleteModal.dataset.admitCardId;
        console.log('Admit card ID from dataset:', admitCardId);

        if (!admitCardId) {
            alert('Admit card ID not found.');
            setGlobalFlag('isDeletingAdmitCard', false);
            return;
        }

        // Show loading indicator and disable buttons
        if (loadingIndicator) loadingIndicator.style.display = 'block';
        if (confirmBtn) confirmBtn.disabled = true;
        if (cancelBtn) cancelBtn.disabled = true;

        console.log('Calling API to delete admit card with ID:', admitCardId);

        // Delete admit card from API
        await apiService.deleteAdmitCard(admitCardId);
        console.log('API call successful, admit card deleted');

        // Close modal first
        closeDeleteModal();
        console.log('Delete modal closed');

        // Create a success message element
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Admit card deleted successfully.';
        document.body.appendChild(successMessage);
        console.log('Success message displayed');

        // Remove success message after 3 seconds
        setTimeout(() => {
            if (document.body.contains(successMessage)) {
                document.body.removeChild(successMessage);
                console.log('Success message removed');
            }
        }, 3000);

        // Reload admit cards table
        console.log('Reloading admit cards table');
        await loadAdminAdmitCards();
        console.log('Admit cards table reloaded');

    } catch (error) {
        console.error(`Error deleting admit card:`, error);

        // Hide loading indicator
        if (loadingIndicator) loadingIndicator.style.display = 'none';

        // Close modal
        closeDeleteModal();

        // Show error message
        alert(`Error deleting admit card: ${error.message}`);

        // Reload admit cards table to ensure it's up to date
        await loadAdminAdmitCards();
    } finally {
        // Reset flag
        setGlobalFlag('isDeletingAdmitCard', false);
        console.log('Delete operation completed, reset flag');
    }
}

/**
 * Admin Answer Keys Page Functionality
 */
function initAdminAnswerKeysPage() {
    console.log('Initializing Admin Answer Keys page');

    // Load answer keys
    loadAdminAnswerKeys();

    // Add event listeners
    const addAnswerKeyBtn = document.getElementById('add-answer-key-btn');
    if (addAnswerKeyBtn) {
        addAnswerKeyBtn.addEventListener('click', function() {
            openAnswerKeyModal();
        });
    }

    const cancelAnswerKeyBtn = document.getElementById('cancel-answer-key-btn');
    if (cancelAnswerKeyBtn) {
        cancelAnswerKeyBtn.addEventListener('click', function() {
            closeAnswerKeyModal();
        });
    }

    const answerKeyForm = document.getElementById('answer-key-form');
    if (answerKeyForm) {
        answerKeyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveAnswerKey();
        });
    }

    const closeModalBtns = document.querySelectorAll('.close-modal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            closeAllModals();
        });
    });

    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function() {
            closeDeleteModal();
        });
    }

    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            deleteAnswerKey();
        });
    }

    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            loadAdminAnswerKeys();
        });
    }

    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            document.getElementById('answer-key-category-filter').value = '';
            loadAdminAnswerKeys();
        });
    }
}

/**
 * Load answer keys for admin panel
 */
async function loadAdminAnswerKeys() {
    const answerKeysTableBody = document.getElementById('answer-keys-table-body');

    if (!answerKeysTableBody) return;

    // Show loading indicator
    answerKeysTableBody.innerHTML = `
        <tr>
            <td colspan="7" class="loading-message">Loading answer keys...</td>
        </tr>
    `;

    try {
        // Get filter values
        const categoryFilter = document.getElementById('answer-key-category-filter').value;

        // Prepare filters
        const filters = {};
        if (categoryFilter) {
            filters.category = categoryFilter;
        }

        // Fetch answer keys from API
        const answerKeys = await apiService.getAnswerKeys(filters);

        // Generate HTML
        let answerKeysHTML = '';

        if (answerKeys.length > 0) {
            answerKeys.forEach(answerKey => {
                answerKeysHTML += `
                    <tr>
                        <td>${answerKey.id}</td>
                        <td>${answerKey.title}</td>
                        <td>${answerKey.organization}</td>
                        <td>${getCategoryName(answerKey.category)}</td>
                        <td>${formatDate(answerKey.release_date)}</td>
                        <td><a href="${answerKey.download_link}" target="_blank">Download</a></td>
                        <td>
                            <div class="table-actions">
                                <button class="view-btn" onclick="viewAnswerKey(${answerKey.id})"><i class="fas fa-eye"></i></button>
                                <button class="edit-btn" onclick="editAnswerKey(${answerKey.id})"><i class="fas fa-edit"></i></button>
                                <button class="delete-btn" onclick="confirmDeleteAnswerKey(${answerKey.id})"><i class="fas fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>
                `;
            });
        } else {
            answerKeysHTML = `
                <tr>
                    <td colspan="7" class="no-data">No answer keys found. Click "Add New" to create one.</td>
                </tr>
            `;
        }

        answerKeysTableBody.innerHTML = answerKeysHTML;
    } catch (error) {
        console.error('Error loading answer keys:', error);
        answerKeysTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="error-message">Error loading answer keys: ${error.message}</td>
            </tr>
        `;
    }
}

/**
 * Open answer key modal for adding a new answer key
 */
function openAnswerKeyModal() {
    // Reset form
    document.getElementById('answer-key-form').reset();
    document.getElementById('answer-key-id').value = '';
    document.getElementById('modal-title').textContent = 'Add New Answer Key';

    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('answer-key-release-date').value = today;

    // Show modal
    document.getElementById('answer-key-modal').style.display = 'block';
}

/**
 * Close answer key modal
 */
function closeAnswerKeyModal() {
    document.getElementById('answer-key-modal').style.display = 'none';
}

/**
 * View answer key details
 * @param {number} answerKeyId - Answer key ID
 */
async function viewAnswerKey(answerKeyId) {
    // In a real implementation, this would open a detailed view
    // For this implementation, we'll just open the edit modal in read-only mode
    await editAnswerKey(answerKeyId, true);
}

/**
 * Edit answer key
 * @param {number} answerKeyId - Answer key ID
 * @param {boolean} readOnly - Whether to open in read-only mode
 */
async function editAnswerKey(answerKeyId, readOnly = false) {
    try {
        // Fetch answer key from API
        const answerKey = await apiService.getAnswerKey(answerKeyId);

        // Set form values
        document.getElementById('answer-key-id').value = answerKey.id;
        document.getElementById('answer-key-title').value = answerKey.title;
        document.getElementById('answer-key-organization').value = answerKey.organization;
        document.getElementById('answer-key-category').value = answerKey.category || '';
        document.getElementById('answer-key-release-date').value = answerKey.release_date || '';
        document.getElementById('answer-key-description').value = answerKey.description || '';
        document.getElementById('answer-key-download-link').value = answerKey.download_link || '';
        document.getElementById('answer-key-featured').checked = answerKey.featured || false;

        // Set modal title
        document.getElementById('modal-title').textContent = readOnly ? 'View Answer Key' : 'Edit Answer Key';

        // Set form fields to read-only if needed
        const formElements = document.getElementById('answer-key-form').elements;
        for (let i = 0; i < formElements.length; i++) {
            formElements[i].readOnly = readOnly;
            if (formElements[i].type === 'select-one' || formElements[i].type === 'checkbox') {
                formElements[i].disabled = readOnly;
            }
        }

        // Hide/show buttons
        document.getElementById('save-answer-key-btn').style.display = readOnly ? 'none' : 'block';

        // Show modal
        document.getElementById('answer-key-modal').style.display = 'block';
    } catch (error) {
        console.error('Error fetching answer key:', error);
        alert(`Error fetching answer key: ${error.message}`);
    }
}

/**
 * Save answer key
 */
async function saveAnswerKey() {
    // Prevent multiple submissions using a flag
    if (getGlobalFlag('isSavingAnswerKey')) {
        console.log('Already saving answer key, preventing duplicate submission');
        return;
    }

    // Set flag to prevent multiple submissions
    setGlobalFlag('isSavingAnswerKey', true);

    // Disable save button to prevent double submission
    const saveBtn = document.getElementById('save-answer-key-btn');
    if (saveBtn) saveBtn.disabled = true;

    try {
        // Get form values
        const answerKeyId = document.getElementById('answer-key-id').value;
        const title = document.getElementById('answer-key-title').value;
        const organization = document.getElementById('answer-key-organization').value;
        const category = document.getElementById('answer-key-category').value;
        const release_date = document.getElementById('answer-key-release-date').value;
        const description = document.getElementById('answer-key-description').value;
        const download_link = document.getElementById('answer-key-download-link').value;
        const featured = document.getElementById('answer-key-featured').checked;

        // Validate required fields
        if (!title || !organization || !category || !release_date || !download_link) {
            alert('Please fill in all required fields.');
            setGlobalFlag('isSavingAnswerKey', false);
            if (saveBtn) saveBtn.disabled = false;
            return;
        }

        // Create answer key object
        const answerKey = {
            title,
            organization,
            category,
            release_date,
            description,
            download_link,
            featured,
            posted_date: new Date().toISOString()
        };

        console.log('Answer key data to save:', answerKey);

        // Update or add answer key
        if (answerKeyId) {
            // Update existing answer key
            console.log(`Updating answer key with ID: ${answerKeyId}`);
            await apiService.updateAnswerKey(answerKeyId, answerKey);
        } else {
            // Add new answer key
            console.log('Adding new answer key');
            await apiService.addAnswerKey(answerKey);
        }

        // Close modal
        closeAnswerKeyModal();

        // Reload answer keys
        await loadAdminAnswerKeys();

        // Show success message
        alert(`Answer key ${answerKeyId ? 'updated' : 'added'} successfully.`);
    } catch (error) {
        console.error('Error saving answer key:', error);
        alert(`Error saving answer key: ${error.message}`);
    } finally {
        // Reset flag and re-enable button
        setGlobalFlag('isSavingAnswerKey', false);
        if (saveBtn) saveBtn.disabled = false;
    }
}

/**
 * Confirm delete answer key
 * @param {number} answerKeyId - Answer key ID
 */
function confirmDeleteAnswerKey(answerKeyId) {
    // Store answer key ID for deletion
    document.getElementById('delete-modal').dataset.answerKeyId = answerKeyId;

    // Show delete confirmation modal
    document.getElementById('delete-modal').style.display = 'block';
}

/**
 * Delete answer key
 */
async function deleteAnswerKey() {
    // Get loading indicator and buttons
    const loadingIndicator = document.getElementById('delete-loading');
    const confirmBtn = document.getElementById('confirm-delete-btn');
    const cancelBtn = document.getElementById('cancel-delete-btn');
    const deleteModal = document.getElementById('delete-modal');

    try {
        const answerKeyId = deleteModal.dataset.answerKeyId;

        if (!answerKeyId) {
            alert('Answer key ID not found.');
            return;
        }

        // Show loading indicator and disable buttons
        if (loadingIndicator) loadingIndicator.style.display = 'block';
        if (confirmBtn) confirmBtn.disabled = true;
        if (cancelBtn) cancelBtn.disabled = true;

        // Delete answer key from API
        await apiService.deleteAnswerKey(answerKeyId);

        // Close modal first
        closeDeleteModal();

        // Create a success message element
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Answer key deleted successfully.';
        document.body.appendChild(successMessage);

        // Remove success message after 3 seconds
        setTimeout(() => {
            if (document.body.contains(successMessage)) {
                document.body.removeChild(successMessage);
            }
        }, 3000);

        // Reload answer keys table
        await loadAdminAnswerKeys();

    } catch (error) {
        console.error(`Error deleting answer key:`, error);

        // Hide loading indicator
        if (loadingIndicator) loadingIndicator.style.display = 'none';

        // Close modal
        closeDeleteModal();

        // Reload answer keys table to ensure it's up to date
        await loadAdminAnswerKeys();
    }
}

/**
 * Admin Syllabus Page Functionality
 */
function initAdminSyllabusPage() {
    console.log('Initializing Admin Syllabus page');

    // Load syllabus items
    loadAdminSyllabus();

    // Add event listeners
    const addSyllabusBtn = document.getElementById('add-syllabus-btn');
    if (addSyllabusBtn) {
        addSyllabusBtn.addEventListener('click', function() {
            openSyllabusModal();
        });
    }

    const cancelSyllabusBtn = document.getElementById('cancel-syllabus-btn');
    if (cancelSyllabusBtn) {
        cancelSyllabusBtn.addEventListener('click', function() {
            closeSyllabusModal();
        });
    }

    const syllabusForm = document.getElementById('syllabus-form');
    if (syllabusForm && !syllabusForm.dataset.listenerAttached) {
        console.log('Attaching submit event listener to syllabus form');

        if (typeof window.debugLog === 'function') {
            window.debugLog('Attaching syllabus form submit event listener from admin-handler.js');
        }

        // Remove any existing event listeners by cloning and replacing the form
        const newSyllabusForm = syllabusForm.cloneNode(true);
        syllabusForm.parentNode.replaceChild(newSyllabusForm, syllabusForm);

        // Add event listener to form submit
        newSyllabusForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Syllabus form submitted from admin-handler.js');

            if (typeof window.debugLog === 'function') {
                window.debugLog('Syllabus form submitted from admin-handler.js');
            }

            // Use a flag to prevent multiple submissions
            if (window.isSubmittingSyllabusForm) {
                console.log('Already submitting syllabus form, preventing duplicate submission');

                if (typeof window.debugLog === 'function') {
                    window.debugLog('Already submitting syllabus form, preventing duplicate submission');
                }
                return;
            }

            // Set flag to prevent multiple submissions
            window.isSubmittingSyllabusForm = true;

            if (typeof window.debugLog === 'function') {
                window.debugLog('Set isSubmittingSyllabusForm flag to true');
            }

            // Call saveSyllabus function
            saveSyllabus();

            // Reset flag after a short delay
            setTimeout(() => {
                window.isSubmittingSyllabusForm = false;

                if (typeof window.debugLog === 'function') {
                    window.debugLog('Reset isSubmittingSyllabusForm flag to false');
                }
            }, 1000);
        });

        // Mark the form as having a listener attached
        newSyllabusForm.dataset.listenerAttached = 'true';
        console.log('Syllabus form listener attached successfully from admin-handler.js');

        if (typeof window.debugLog === 'function') {
            window.debugLog('Syllabus form listener attached successfully from admin-handler.js');
        }
    } else if (syllabusForm && syllabusForm.dataset.listenerAttached) {
        console.log('Syllabus form already has a listener attached, skipping in admin-handler.js');

        if (typeof window.debugLog === 'function') {
            window.debugLog('Syllabus form already has a listener attached, skipping in admin-handler.js');
        }
    }

    const closeModalBtns = document.querySelectorAll('.close-modal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            closeAllModals();
        });
    });

    const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function() {
            closeDeleteModal();
        });
    }

    const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            deleteSyllabus();
        });
    }

    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            loadAdminSyllabus();
        });
    }

    const clearFiltersBtn = document.getElementById('clear-filters-btn');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            document.getElementById('syllabus-category-filter').value = '';
            loadAdminSyllabus();
        });
    }
}

/**
 * Load syllabus items for admin panel
 */
async function loadAdminSyllabus() {
    const syllabusTableBody = document.getElementById('syllabus-table-body');

    if (!syllabusTableBody) return;

    // Show loading indicator
    syllabusTableBody.innerHTML = `
        <tr>
            <td colspan="7" class="loading-message">Loading syllabus items...</td>
        </tr>
    `;

    try {
        // Get filter values
        const categoryFilter = document.getElementById('syllabus-category-filter').value;

        // Prepare filters
        const filters = {};
        if (categoryFilter) {
            filters.category = categoryFilter;
        }

        // Fetch syllabus items from API
        const syllabusItems = await apiService.getSyllabus(filters);

        // Generate HTML
        let syllabusHTML = '';

        if (syllabusItems.length > 0) {
            syllabusItems.forEach(syllabus => {
                syllabusHTML += `
                    <tr>
                        <td>${syllabus.id}</td>
                        <td>${syllabus.title}</td>
                        <td>${syllabus.organization}</td>
                        <td>${getCategoryName(syllabus.category)}</td>
                        <td>${formatDate(syllabus.release_date)}</td>
                        <td><a href="${syllabus.download_link}" target="_blank">Download</a></td>
                        <td>
                            <div class="table-actions">
                                <button class="view-btn" onclick="viewSyllabus(${syllabus.id})"><i class="fas fa-eye"></i></button>
                                <button class="edit-btn" onclick="editSyllabus(${syllabus.id})"><i class="fas fa-edit"></i></button>
                                <button class="delete-btn" onclick="confirmDeleteSyllabus(${syllabus.id})"><i class="fas fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>
                `;
            });
        } else {
            syllabusHTML = `
                <tr>
                    <td colspan="7" class="no-data">No syllabus items found. Click "Add New" to create one.</td>
                </tr>
            `;
        }

        syllabusTableBody.innerHTML = syllabusHTML;
    } catch (error) {
        console.error('Error loading syllabus items:', error);
        syllabusTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="error-message">Error loading syllabus items: ${error.message}</td>
            </tr>
        `;
    }
}

/**
 * Open syllabus modal for adding a new syllabus item
 */
function openSyllabusModal() {
    // Reset form
    document.getElementById('syllabus-form').reset();
    document.getElementById('syllabus-id').value = '';
    document.getElementById('modal-title').textContent = 'Add New Syllabus';

    // Set default dates
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('syllabus-release-date').value = today;

    // Show modal
    document.getElementById('syllabus-modal').style.display = 'block';
}

/**
 * Close syllabus modal
 */
function closeSyllabusModal() {
    document.getElementById('syllabus-modal').style.display = 'none';
}

/**
 * View syllabus details
 * @param {number} syllabusId - Syllabus ID
 */
async function viewSyllabus(syllabusId) {
    // In a real implementation, this would open a detailed view
    // For this implementation, we'll just open the edit modal in read-only mode
    await editSyllabus(syllabusId, true);
}

/**
 * Edit syllabus
 * @param {number} syllabusId - Syllabus ID
 * @param {boolean} readOnly - Whether to open in read-only mode
 */
async function editSyllabus(syllabusId, readOnly = false) {
    try {
        // Fetch syllabus from API
        const syllabus = await apiService.getSyllabusItem(syllabusId);

        // Set form values
        document.getElementById('syllabus-id').value = syllabus.id;
        document.getElementById('syllabus-title').value = syllabus.title;
        document.getElementById('syllabus-organization').value = syllabus.organization;
        document.getElementById('syllabus-category').value = syllabus.category || '';
        document.getElementById('syllabus-release-date').value = syllabus.release_date || '';
        document.getElementById('syllabus-description').value = syllabus.description || '';
        document.getElementById('syllabus-download-link').value = syllabus.download_link || '';
        document.getElementById('syllabus-featured').checked = syllabus.featured || false;

        // Set modal title
        document.getElementById('modal-title').textContent = readOnly ? 'View Syllabus' : 'Edit Syllabus';

        // Set form fields to read-only if needed
        const formElements = document.getElementById('syllabus-form').elements;
        for (let i = 0; i < formElements.length; i++) {
            formElements[i].readOnly = readOnly;
            if (formElements[i].type === 'select-one' || formElements[i].type === 'checkbox') {
                formElements[i].disabled = readOnly;
            }
        }

        // Hide/show buttons
        document.getElementById('save-syllabus-btn').style.display = readOnly ? 'none' : 'block';

        // Show modal
        document.getElementById('syllabus-modal').style.display = 'block';
    } catch (error) {
        console.error('Error fetching syllabus:', error);
        alert(`Error fetching syllabus: ${error.message}`);
    }
}

/**
 * Save syllabus
 */
async function saveSyllabus() {
    console.log('saveSyllabus function called from admin-handler.js');

    // Add debug log if available
    if (typeof window.debugLog === 'function') {
        window.debugLog('saveSyllabus function called from admin-handler.js');
    }

    // Prevent multiple submissions using a flag
    if (getGlobalFlag('isSavingSyllabus')) {
        console.log('Already saving syllabus, preventing duplicate submission');

        if (typeof window.debugLog === 'function') {
            window.debugLog('Already saving syllabus, preventing duplicate submission');
        }
        return;
    }

    // Set flag to prevent multiple submissions
    setGlobalFlag('isSavingSyllabus', true);

    if (typeof window.debugLog === 'function') {
        window.debugLog('Set isSavingSyllabus flag to true');
    }

    // Disable save button to prevent double submission
    const saveBtn = document.getElementById('save-syllabus-btn');
    if (saveBtn) saveBtn.disabled = true;

    try {
        // Get form values
        const syllabusId = document.getElementById('syllabus-id').value;
        const title = document.getElementById('syllabus-title').value;
        const organization = document.getElementById('syllabus-organization').value;
        const category = document.getElementById('syllabus-category').value;
        const release_date = document.getElementById('syllabus-release-date').value;
        const description = document.getElementById('syllabus-description').value;
        const download_link = document.getElementById('syllabus-download-link').value;
        const featured = document.getElementById('syllabus-featured').checked;

        // Validate required fields
        if (!title || !organization || !category || !release_date || !download_link) {
            alert('Please fill in all required fields.');
            setGlobalFlag('isSavingSyllabus', false);
            if (saveBtn) saveBtn.disabled = false;
            return;
        }

        // Create syllabus object
        const syllabus = {
            title,
            organization,
            category,
            release_date,
            description,
            download_link,
            featured,
            posted_date: new Date().toISOString()
        };

        console.log('Syllabus data to save:', syllabus);

        // Update or add syllabus
        if (syllabusId) {
            // Update existing syllabus
            console.log(`Updating syllabus with ID: ${syllabusId}`);
            await apiService.updateSyllabusItem(syllabusId, syllabus);
        } else {
            // Add new syllabus
            console.log('Adding new syllabus');
            await apiService.addSyllabusItem(syllabus);
        }

        // Close modal
        closeSyllabusModal();

        // Reload syllabus items
        await loadAdminSyllabus();

        // Show success message
        alert(`Syllabus ${syllabusId ? 'updated' : 'added'} successfully.`);
    } catch (error) {
        console.error('Error saving syllabus:', error);
        alert(`Error saving syllabus: ${error.message}`);
    } finally {
        // Reset flag and re-enable button
        setGlobalFlag('isSavingSyllabus', false);

        if (typeof window.debugLog === 'function') {
            window.debugLog('Reset isSavingSyllabus flag to false');
        }

        if (saveBtn) saveBtn.disabled = false;
    }
}

/**
 * Confirm delete syllabus
 * @param {number} syllabusId - Syllabus ID
 */
function confirmDeleteSyllabus(syllabusId) {
    // Store syllabus ID for deletion
    document.getElementById('delete-modal').dataset.syllabusId = syllabusId;

    // Show delete confirmation modal
    document.getElementById('delete-modal').style.display = 'block';
}

/**
 * Delete syllabus
 */
async function deleteSyllabus() {
    // Get loading indicator and buttons
    const loadingIndicator = document.getElementById('delete-loading');
    const confirmBtn = document.getElementById('confirm-delete-btn');
    const cancelBtn = document.getElementById('cancel-delete-btn');
    const deleteModal = document.getElementById('delete-modal');

    try {
        const syllabusId = deleteModal.dataset.syllabusId;

        if (!syllabusId) {
            alert('Syllabus ID not found.');
            return;
        }

        // Show loading indicator and disable buttons
        if (loadingIndicator) loadingIndicator.style.display = 'block';
        if (confirmBtn) confirmBtn.disabled = true;
        if (cancelBtn) cancelBtn.disabled = true;

        // Delete syllabus from API
        await apiService.deleteSyllabusItem(syllabusId);

        // Close modal first
        closeDeleteModal();

        // Create a success message element
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Syllabus deleted successfully.';
        document.body.appendChild(successMessage);

        // Remove success message after 3 seconds
        setTimeout(() => {
            if (document.body.contains(successMessage)) {
                document.body.removeChild(successMessage);
            }
        }, 3000);

        // Reload syllabus table
        await loadAdminSyllabus();

    } catch (error) {
        console.error(`Error deleting syllabus:`, error);

        // Hide loading indicator
        if (loadingIndicator) loadingIndicator.style.display = 'none';

        // Close modal
        closeDeleteModal();

        // Reload syllabus table to ensure it's up to date
        await loadAdminSyllabus();
    }
}
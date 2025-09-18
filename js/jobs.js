/**
 * JavaScript file for Jobs page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load jobs
    loadJobs();
    
    // Add event listeners
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            loadJobs(1);
        });
    }
    
    // Handle Enter key in search input
    const jobSearch = document.getElementById('job-search');
    if (jobSearch) {
        jobSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                loadJobs(1);
            }
        });
    }
});

/**
 * Load jobs with pagination
 * @param {number} page - Page number
 */
function loadJobs(page = 1) {
    const jobsContainer = document.getElementById('jobs-container');
    const paginationContainer = document.getElementById('pagination');
    const jobSearch = document.getElementById('job-search');
    const jobCategory = document.getElementById('job-category');
    
    if (!jobsContainer) return;
    
    // Get search parameters
    const keyword = jobSearch ? jobSearch.value : '';
    const category = jobCategory ? jobCategory.value : '';
    
    // Filter jobs
    let filteredJobs = jobsData;
    
    if (keyword || category) {
        filteredJobs = searchData(jobsData, keyword, { category: category });
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
                <div class="job-item">
                    <h3><a href="job-details.html?id=${job.id}">${job.title}</a></h3>
                    <div class="job-meta">
                        <span><i class="fas fa-building"></i> ${job.organization}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                        <span><i class="fas fa-calendar-alt"></i> Posted: ${formatDate(job.postedDate)}</span>
                    </div>
                    <div class="job-meta">
                        <span><i class="fas fa-graduation-cap"></i> ${job.qualification || 'Not specified'}</span>
                        <span><i class="fas fa-user"></i> Age: ${job.ageLimit || 'Not specified'}</span>
                        <span><i class="fas fa-money-bill-wave"></i> Fee: ${job.applicationFee || 'Not specified'}</span>
                    </div>
                    <div class="job-description">
                        ${job.description}
                    </div>
                    <div class="job-meta">
                        <span><i class="fas fa-hourglass-start"></i> Start Date: ${formatDate(job.startDate)}</span>
                        <span><i class="fas fa-hourglass-end"></i> Last Date: ${formatDate(job.lastDate)}</span>
                        <span><i class="fas fa-users"></i> Vacancies: ${job.vacancies || 'Not specified'}</span>
                    </div>
                    <div class="job-actions">
                        <a href="job-details.html?id=${job.id}" class="action-btn">View Details</a>
                        <a href="${job.applyLink}" target="_blank" class="action-btn">Apply Now</a>
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
}

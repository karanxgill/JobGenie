/**
 * JavaScript file for Job Details page
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Initialize theme toggle
    initThemeToggle();
    
    // Get job ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');
    
    if (!jobId) {
        showError('Job ID is missing. Please go back to the jobs page and try again.');
        return;
    }
    
    // Load job details
    await loadJobDetails(jobId);
});

/**
 * Load job details from API
 * @param {string} jobId - Job ID
 */
async function loadJobDetails(jobId) {
    try {
        // Fetch job details from API
        const job = await apiService.getJob(jobId);
        
        // Update page title
        document.title = `${job.title} - JobGenie`;
        
        // Update job title in the page
        const jobTitleElement = document.getElementById('job-title');
        if (jobTitleElement) {
            jobTitleElement.textContent = job.title;
        }
        
        // Display job details
        displayJobDetails(job);
    } catch (error) {
        console.error('Error loading job details:', error);
        showError(`Error loading job details: ${error.message}`);
    }
}

/**
 * Display job details in the container
 * @param {Object} job - Job object
 */
function displayJobDetails(job) {
    const jobDetailsContainer = document.getElementById('job-details-container');
    
    if (!jobDetailsContainer) {
        console.error('Job details container not found');
        return;
    }
    
    // Format dates
    const startDate = job.start_date ? formatDate(job.start_date) : 'N/A';
    const lastDate = job.last_date ? formatDate(job.last_date) : 'N/A';
    const postedDate = job.posted_date ? formatDate(job.posted_date) : 'N/A';
    
    // Create HTML for job details
    jobDetailsContainer.innerHTML = `
        <div class="job-header">
            <h2>${job.title}</h2>
            <div class="job-meta">
                <span><i class="fas fa-building"></i> ${job.organization}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${job.location || 'Not specified'}</span>
                <span><i class="fas fa-calendar-alt"></i> Posted: ${postedDate}</span>
            </div>
        </div>
        
        <div class="job-section">
            <h3>Job Description</h3>
            <div class="job-description">
                <p>${job.description}</p>
            </div>
        </div>
        
        <div class="job-section">
            <h3>Job Details</h3>
            <div class="job-details-grid">
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-graduation-cap"></i> Qualification:</span>
                    <span class="detail-value">${job.qualification || 'Not specified'}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-users"></i> Vacancies:</span>
                    <span class="detail-value">${job.vacancies || 'Not specified'}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-birthday-cake"></i> Age Limit:</span>
                    <span class="detail-value">${job.age_limit || 'Not specified'}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-rupee-sign"></i> Application Fee:</span>
                    <span class="detail-value">${job.application_fee || 'Not specified'}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-hourglass-start"></i> Start Date:</span>
                    <span class="detail-value">${startDate}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label"><i class="fas fa-hourglass-end"></i> Last Date:</span>
                    <span class="detail-value">${lastDate}</span>
                </div>
            </div>
        </div>
        
        <div class="job-actions">
            <a href="${job.apply_link}" target="_blank" class="btn apply-now-btn">Apply Now</a>
            <button class="btn share-btn" onclick="shareJob()"><i class="fas fa-share-alt"></i> Share</button>
        </div>
    `;
}

/**
 * Show error message in the container
 * @param {string} message - Error message
 */
function showError(message) {
    const jobDetailsContainer = document.getElementById('job-details-container');
    
    if (jobDetailsContainer) {
        jobDetailsContainer.innerHTML = `<div class="error">${message}</div>`;
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
 * Share job on social media
 */
function shareJob() {
    // Get current URL
    const url = window.location.href;
    
    // Check if Web Share API is available
    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: url
        })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.error('Error sharing:', error));
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(url)
            .then(() => {
                alert('Link copied to clipboard!');
            })
            .catch((error) => {
                console.error('Error copying to clipboard:', error);
                alert('Failed to copy link. Please copy the URL manually.');
            });
    }
}

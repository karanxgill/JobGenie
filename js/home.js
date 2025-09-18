/**
 * JavaScript file for Home page
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Initialize theme toggle
    initThemeToggle();
    
    // Load featured content from API
    await loadFeaturedContent();
});

/**
 * Load featured content from API
 */
async function loadFeaturedContent() {
    try {
        // Load featured jobs
        await loadFeaturedJobs();
        
        // Load featured admissions
        await loadFeaturedAdmissions();
        
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
                            <li><i class="fas fa-calendar"></i> Last Date: ${lastDate}</li>
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
 * Load featured admissions from API
 */
async function loadFeaturedAdmissions() {
    try {
        // Get admissions container
        const admissionList = document.getElementById('admission-list');
        if (!admissionList) return;
        
        // Show loading indicator
        admissionList.innerHTML = '<li class="loading">Loading admissions...</li>';
        
        // Fetch featured admissions from API
        const featuredAdmissions = await apiService.getAdmissions({ featured: true });
        
        // Check if we have admissions to display
        if (featuredAdmissions && featuredAdmissions.length > 0) {
            // Clear container
            admissionList.innerHTML = '';
            
            // Display up to 5 featured admissions
            const admissionsToDisplay = featuredAdmissions.slice(0, 5);
            
            // Create admission list items
            admissionsToDisplay.forEach(admission => {
                // Create list item element
                const listItem = document.createElement('li');
                
                // Format date
                const lastDate = admission.last_date ? formatDate(admission.last_date) : 'N/A';
                
                // Set list item HTML
                listItem.innerHTML = `
                    <a href="${admission.apply_link}" target="_blank">
                        <span class="content-title">${admission.title}</span>
                        <span class="content-date">Last Date: ${lastDate}</span>
                    </a>
                `;
                
                // Add list item to admission list
                admissionList.appendChild(listItem);
            });
        } else {
            // No featured admissions found
            admissionList.innerHTML = '<li class="no-data">No admissions available at the moment.</li>';
        }
    } catch (error) {
        console.error('Error loading featured admissions:', error);
        const admissionList = document.getElementById('admission-list');
        if (admissionList) {
            admissionList.innerHTML = `<li class="error">Error loading admissions: ${error.message}</li>`;
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

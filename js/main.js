/**
 * Main JavaScript file for JobGenie website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Only load homepage content if we're on the homepage
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        loadHomepageContent();
        initHeroParticles();
        initRevealAnimations();
    }

    console.log('Main.js loaded - theme toggle handled by simple-theme.js');
});

/**
 * Initialize the particles effect in the hero section
 */
function initHeroParticles() {
    const particlesContainer = document.getElementById('hero-particles');
    if (!particlesContainer) return;

    // Create particles
    const particleCount = 50;
    const colors = ['#4F46E5', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;

        // Random size
        const size = Math.random() * 10 + 5;

        // Random color
        const color = colors[Math.floor(Math.random() * colors.length)];

        // Random opacity
        const opacity = Math.random() * 0.5 + 0.1;

        // Set styles
        particle.style.cssText = `
            position: absolute;
            top: ${posY}%;
            left: ${posX}%;
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            border-radius: 50%;
            opacity: ${opacity};
            filter: blur(${Math.random() * 2 + 1}px);
            animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: -${Math.random() * 10}s;
            z-index: 0;
        `;

        particlesContainer.appendChild(particle);
    }
}

// Add keyframes for particle animation
const style = document.createElement('style');
style.textContent = `
@keyframes floatParticle {
    0% {
        transform: translateY(0) translateX(0) rotate(0deg);
    }
    25% {
        transform: translateY(-20px) translateX(10px) rotate(90deg);
    }
    50% {
        transform: translateY(0) translateX(20px) rotate(180deg);
    }
    75% {
        transform: translateY(20px) translateX(10px) rotate(270deg);
    }
    100% {
        transform: translateY(0) translateX(0) rotate(360deg);
    }
}
`;
document.head.appendChild(style);

/**
 * Load content for the homepage
 */
async function loadHomepageContent() {
    try {
        // Load featured jobs grid
        const featuredJobsGrid = document.getElementById('featured-jobs-grid');
        if (featuredJobsGrid) {
            try {
                // Fetch featured jobs from API
                const featuredJobs = await apiService.getJobs({ featured: true, limit: 3 });

                if (featuredJobs && featuredJobs.length > 0) {
                    let jobCardsHTML = '';

                    featuredJobs.forEach(job => {
                        // Determine icon based on job category
                        let iconClass = 'fa-building';
                        if (job.category === 'railways') {
                            iconClass = 'fa-train';
                        } else if (job.category === 'defense') {
                            iconClass = 'fa-user-shield';
                        } else if (job.category === 'teaching') {
                            iconClass = 'fa-graduation-cap';
                        } else if (job.category === 'banking') {
                            iconClass = 'fa-university';
                        }

                        jobCardsHTML += `
                            <div class="job-card-simple">
                                <div class="job-icon">
                                    <i class="fas ${iconClass}"></i>
                                </div>
                                <h3 class="job-title"><a href="job-details.html?id=${job.id}">${job.title}</a></h3>
                                <div class="job-org">${job.organization || 'UKPSC'}</div>
                                <div class="job-details">
                                    <div class="job-detail-item">
                                        <i class="fas fa-user"></i>
                                        <span>${job.position || 'Multiple Positions'}</span>
                                    </div>
                                    <div class="job-detail-item">
                                        <i class="fas fa-graduation-cap"></i>
                                        <span>${job.qualification || 'Bachelor Degree'}</span>
                                    </div>
                                    <div class="job-detail-item">
                                        <i class="fas fa-calendar-alt"></i>
                                        <span>Last Date: ${job.last_date ? formatDate(job.last_date) : 'May 31, 2025'}</span>
                                    </div>
                                </div>
                                <div class="job-footer">
                                    <div class="job-type">${job.job_type || 'Full Time'}</div>
                                    <a href="${job.apply_link || '#'}" class="apply-btn">Apply Now</a>
                                </div>
                            </div>
                        `;
                    });

                    featuredJobsGrid.innerHTML = jobCardsHTML;
                } else {
                    featuredJobsGrid.innerHTML = '<div class="no-data">No featured jobs available at the moment.</div>';
                }
            } catch (error) {
                console.error('Error loading featured jobs:', error);
                featuredJobsGrid.innerHTML = '<div class="error">Error loading featured jobs. Please try again later.</div>';
            }
        }

        // Load latest jobs
        const latestJobsList = document.getElementById('latest-jobs-list');
        if (latestJobsList) {
            // Show loading indicator
            latestJobsList.innerHTML = '<li><em>Loading...</em></li>';

            try {
                // Fetch latest jobs from API
                const jobs = await apiService.getJobs({ featured: true, limit: 5 });

                if (jobs && jobs.length > 0) {
                    let latestJobsHTML = '';
                    jobs.forEach(job => {
                        latestJobsHTML += `
                            <li>
                                <a href="job-details.html?id=${job.id}">
                                    ${job.title}
                                </a>
                            </li>
                        `;
                    });
                    latestJobsList.innerHTML = latestJobsHTML;
                } else {
                    latestJobsList.innerHTML = '<li><em>No jobs available</em></li>';
                }
            } catch (error) {
                console.error('Error loading jobs:', error);
                latestJobsList.innerHTML = '<li><em>Error loading jobs</em></li>';
            }
        }

        // Load results
        const resultsList = document.getElementById('results-list');
        if (resultsList) {
            // Show loading indicator
            resultsList.innerHTML = '<li><em>Loading...</em></li>';

            try {
                // Fetch results from API
                const results = await apiService.getResults({ featured: true, limit: 5 });

                if (results && results.length > 0) {
                    let resultsHTML = '';
                    results.forEach(result => {
                        resultsHTML += `
                            <li>
                                <a href="result-details.html?id=${result.id}">
                                    ${result.title}
                                </a>
                            </li>
                        `;
                    });
                    resultsList.innerHTML = resultsHTML;
                } else {
                    resultsList.innerHTML = '<li><em>No results available</em></li>';
                }
            } catch (error) {
                console.error('Error loading results:', error);
                resultsList.innerHTML = '<li><em>Error loading results</em></li>';
            }
        }

        // Load admit cards
        const admitCardsList = document.getElementById('admit-cards-list');
        if (admitCardsList) {
            // Show loading indicator
            admitCardsList.innerHTML = '<li><em>Loading...</em></li>';

            try {
                // Fetch admit cards from API
                const admitCards = await apiService.getAdmitCards({ featured: true, limit: 5 });

                if (admitCards && admitCards.length > 0) {
                    let admitCardsHTML = '';
                    admitCards.forEach(admitCard => {
                        admitCardsHTML += `
                            <li>
                                <a href="admit-card-details.html?id=${admitCard.id}">
                                    ${admitCard.title}
                                </a>
                            </li>
                        `;
                    });
                    admitCardsList.innerHTML = admitCardsHTML;
                } else {
                    admitCardsList.innerHTML = '<li><em>No admit cards available</em></li>';
                }
            } catch (error) {
                console.error('Error loading admit cards:', error);
                admitCardsList.innerHTML = '<li><em>Error loading admit cards</em></li>';
            }
        }

        // Load answer keys
        const answerKeysList = document.getElementById('answer-keys-list');
        if (answerKeysList) {
            // Show loading indicator
            answerKeysList.innerHTML = '<li><em>Loading...</em></li>';

            try {
                // Fetch answer keys from API
                const answerKeys = await apiService.getAnswerKeys({ featured: true, limit: 5 });

                if (answerKeys && answerKeys.length > 0) {
                    let answerKeysHTML = '';
                    answerKeys.forEach(answerKey => {
                        answerKeysHTML += `
                            <li>
                                <a href="answer-key-details.html?id=${answerKey.id}">
                                    ${answerKey.title}
                                </a>
                            </li>
                        `;
                    });
                    answerKeysList.innerHTML = answerKeysHTML;
                } else {
                    answerKeysList.innerHTML = '<li><em>No answer keys available</em></li>';
                }
            } catch (error) {
                console.error('Error loading answer keys:', error);
                answerKeysList.innerHTML = '<li><em>Error loading answer keys</em></li>';
            }
        }

        // Load syllabus
        const syllabusList = document.getElementById('syllabus-list');
        if (syllabusList) {
            // Show loading indicator
            syllabusList.innerHTML = '<li><em>Loading...</em></li>';

            try {
                // Fetch syllabus from API
                const syllabusItems = await apiService.getSyllabus({ featured: true, limit: 5 });

                if (syllabusItems && syllabusItems.length > 0) {
                    let syllabusHTML = '';
                    syllabusItems.forEach(syllabus => {
                        syllabusHTML += `
                            <li>
                                <a href="syllabus-details.html?id=${syllabus.id}">
                                    ${syllabus.title}
                                </a>
                            </li>
                        `;
                    });
                    syllabusList.innerHTML = syllabusHTML;
                } else {
                    syllabusList.innerHTML = '<li><em>No syllabus items available</em></li>';
                }
            } catch (error) {
                console.error('Error loading syllabus:', error);
                syllabusList.innerHTML = '<li><em>Error loading syllabus</em></li>';
            }
        }

        // Load important links
        const importantList = document.getElementById('important-list');
        if (importantList) {
            // Show loading indicator
            importantList.innerHTML = '<li><em>Loading...</em></li>';

            try {
                // Fetch important links from API
                const importantLinks = await apiService.getImportantLinks({ featured: true, limit: 5 });

                if (importantLinks && importantLinks.length > 0) {
                    let importantHTML = '';
                    importantLinks.forEach(link => {
                        importantHTML += `
                            <li>
                                <a href="${link.url}" target="_blank">
                                    ${link.title}
                                </a>
                            </li>
                        `;
                    });
                    importantList.innerHTML = importantHTML;
                } else {
                    importantList.innerHTML = '<li><em>No important links available</em></li>';
                }
            } catch (error) {
                console.error('Error loading important links:', error);
                importantList.innerHTML = '<li><em>Error loading important links</em></li>';
            }
        }

        // Load admissions
        const admissionList = document.getElementById('admission-list');
        if (admissionList) {
            // Show loading indicator
            admissionList.innerHTML = '<li><em>Loading...</em></li>';

            try {
                // Fetch admissions from API
                const admissions = await apiService.getAdmissions({ featured: true, limit: 5 });

                if (admissions && admissions.length > 0) {
                    let admissionsHTML = '';
                    admissions.forEach(admission => {
                        admissionsHTML += `
                            <li>
                                <a href="admission-details.html?id=${admission.id}">
                                    ${admission.title}
                                </a>
                            </li>
                        `;
                    });
                    admissionList.innerHTML = admissionsHTML;
                } else {
                    admissionList.innerHTML = '<li><em>No admissions available</em></li>';
                }
            } catch (error) {
                console.error('Error loading admissions:', error);
                admissionList.innerHTML = '<li><em>Error loading admissions</em></li>';
            }
        }

        // Load job categories
        const jobCategoriesGrid = document.getElementById('job-categories-grid');
        if (jobCategoriesGrid) {
            try {
                // Define the main job categories
                const categories = [
                    { id: 'banking', name: 'Banking', icon: 'fa-university', description: 'SBI, IBPS, RBI and more' },
                    { id: 'railways', name: 'Railways', icon: 'fa-train', description: 'RRB, IRCTC, Metro Rail' },
                    { id: 'defense', name: 'Defense', icon: 'fa-user-shield', description: 'Army, Navy, Air Force' },
                    { id: 'teaching', name: 'Teaching', icon: 'fa-graduation-cap', description: 'Schools, Colleges, Universities' }
                ];

                let categoriesHTML = '';

                // For each category, fetch the count of jobs
                for (const category of categories) {
                    try {
                        // Get job count for this category
                        const categoryJobs = await apiService.getJobs({ category: category.id, count_only: true });
                        const jobCount = categoryJobs?.count || 0;

                        categoriesHTML += `
                            <div class="category-card">
                                <div class="category-icon">
                                    <i class="fas ${category.icon}"></i>
                                </div>
                                <h3>${category.name}</h3>
                                <p>${category.description}</p>
                                <span class="job-count">${jobCount} Jobs</span>
                            </div>
                        `;
                    } catch (error) {
                        console.error(`Error loading job count for category ${category.name}:`, error);

                        // Still show the category but with unknown job count
                        categoriesHTML += `
                            <div class="category-card">
                                <div class="category-icon">
                                    <i class="fas ${category.icon}"></i>
                                </div>
                                <h3>${category.name}</h3>
                                <p>${category.description}</p>
                                <span class="job-count">-- Jobs</span>
                            </div>
                        `;
                    }
                }

                jobCategoriesGrid.innerHTML = categoriesHTML;
            } catch (error) {
                console.error('Error loading job categories:', error);
                jobCategoriesGrid.innerHTML = '<div class="error">Error loading job categories. Please try again later.</div>';
            }
        }
    } catch (error) {
        console.error('Error loading homepage content:', error);
    }
}

/**
 * Format date for display
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {string} - Formatted date string
 */
function formatDate(dateString) {
    if (!dateString) return '';

    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', options);
}

/**
 * Generate pagination links
 * @param {number} currentPage - Current page number
 * @param {number} totalPages - Total number of pages
 * @param {string} urlPattern - URL pattern for pagination links
 * @returns {string} - HTML for pagination links
 */
function generatePagination(currentPage, totalPages, urlPattern) {
    if (totalPages <= 1) return '';

    let paginationHTML = '<div class="pagination">';

    // Previous page link
    if (currentPage > 1) {
        paginationHTML += `<a href="${urlPattern.replace('{page}', currentPage - 1)}">&laquo; Previous</a>`;
    }

    // Page links
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
        if (i === currentPage) {
            paginationHTML += `<span class="active">${i}</span>`;
        } else {
            paginationHTML += `<a href="${urlPattern.replace('{page}', i)}">${i}</a>`;
        }
    }

    // Next page link
    if (currentPage < totalPages) {
        paginationHTML += `<a href="${urlPattern.replace('{page}', currentPage + 1)}">Next &raquo;</a>`;
    }

    paginationHTML += '</div>';

    return paginationHTML;
}

/**
 * Get URL parameters
 * @returns {Object} - Object containing URL parameters
 */
function getUrlParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const pairs = queryString.split('&');

    for (const pair of pairs) {
        const [key, value] = pair.split('=');
        if (key) {
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
    }

    return params;
}

// No direct links functionality needed anymore as we're using the API



/**
 * Initialize reveal animations for elements with the reveal-item class
 */
function initRevealAnimations() {
    const revealItems = document.querySelectorAll('.reveal-item');

    if (revealItems.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealItems.forEach(item => {
        observer.observe(item);
    });
}

/**
 * Initialize theme toggle functionality
 * This function is now just a stub that calls the implementation in simple-theme.js
 * to avoid duplicate functionality
 */
function initThemeToggle() {
    // The actual implementation is now in simple-theme.js
    // This function is kept for backward compatibility
    console.log('Theme toggle initialized via simple-theme.js');
}

/**
 * Load header and footer for all pages
 */
function loadHeaderAndFooter() {
    // Load header
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('includes/header.html')
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.innerHTML = data;

                // Initialize theme toggle after header is loaded
                initThemeToggle();
            })
            .catch(error => {
                console.error('Error loading header:', error);
            });
    }

    // Load footer
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('includes/footer.html')
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
            })
            .catch(error => {
                console.error('Error loading footer:', error);
            });
    }
}

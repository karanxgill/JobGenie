/**
 * Admin Includes - Handles the injection of common elements like navbar
 * for the JobGenie admin panel and initializes page functionality
 */

// Store the original DOMContentLoaded event handlers
const originalDOMContentLoadedHandlers = [];

// Intercept addEventListener to capture DOMContentLoaded handlers
const originalAddEventListener = window.addEventListener;
window.addEventListener = function(type, listener, options) {
    if (type === 'DOMContentLoaded') {
        originalDOMContentLoadedHandlers.push(listener);
    } else {
        originalAddEventListener.call(window, type, listener, options);
    }
};

// Our custom DOMContentLoaded handler that runs first
document.addEventListener('DOMContentLoaded', function() {
    // Restore original addEventListener
    window.addEventListener = originalAddEventListener;

    console.log('Admin includes initializing...');

    // Insert admin navbar
    const navbarPlaceholder = document.getElementById('admin-navbar-placeholder');
    if (navbarPlaceholder) {
        // Get current page to highlight the active menu item
        const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';

        // Define the navbar HTML
        const navbarHTML = `
        <aside class="admin-sidebar">
            <div class="sidebar-header">
                <h2>JobGenie</h2>
            </div>
            <nav class="sidebar-nav">
                <ul>
                    <li ${currentPage === 'dashboard.html' ? 'class="active"' : ''} id="nav-dashboard">
                        <a href="dashboard.html" aria-label="Dashboard"><i class="fas fa-tachometer-alt"></i> <span>Dashboard</span></a>
                    </li>
                    <li ${currentPage === 'jobs.html' ? 'class="active"' : ''} id="nav-jobs">
                        <a href="jobs.html" aria-label="Jobs"><i class="fas fa-briefcase"></i> <span>Jobs</span></a>
                    </li>
                    <li ${currentPage === 'results.html' ? 'class="active"' : ''} id="nav-results">
                        <a href="results.html" aria-label="Results"><i class="fas fa-poll"></i> <span>Results</span></a>
                    </li>
                    <li ${currentPage === 'admit-cards.html' ? 'class="active"' : ''} id="nav-admit-cards">
                        <a href="admit-cards.html" aria-label="Admit Cards"><i class="fas fa-id-card"></i> <span>Admit Cards</span></a>
                    </li>
                    <li ${currentPage === 'answer-keys.html' ? 'class="active"' : ''} id="nav-answer-keys">
                        <a href="answer-keys.html" aria-label="Answer Keys"><i class="fas fa-key"></i> <span>Answer Keys</span></a>
                    </li>
                    <li ${currentPage === 'syllabus.html' ? 'class="active"' : ''} id="nav-syllabus">
                        <a href="syllabus.html" aria-label="Syllabus"><i class="fas fa-book"></i> <span>Syllabus</span></a>
                    </li>
                    <li ${currentPage === 'study-materials.html' ? 'class="active"' : ''} id="nav-study-materials">
                        <a href="study-materials.html" aria-label="Study Materials"><i class="fas fa-book-reader"></i> <span>Study Materials</span></a>
                    </li>
                </ul>
            </nav>
            <div class="sidebar-footer">
    
    <a href="#" id="logout-btn" aria-label="Logout"><i class="fas fa-sign-out-alt"></i> <span>Logout</span></a>
</div>
        </aside>
        `;

        // Insert the navbar HTML
        navbarPlaceholder.innerHTML = navbarHTML;

        // Initialize the unified theme toggle after injection
        if (typeof window.setupExistingThemeToggles === 'function') {
            window.setupExistingThemeToggles();
        }

        // Add event listener for logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                // If admin-handler.js is loaded, it will handle the logout
                if (typeof handleLogout === 'function') {
                    handleLogout();
                } else {
                    // Fallback logout handling
                    localStorage.removeItem('adminLoggedIn');
                    window.location.href = 'index.html';
                }
            });
        }
    }

    console.log('Admin navbar injected, now initializing page functionality...');

    // Now run the original DOMContentLoaded handlers
    originalDOMContentLoadedHandlers.forEach(handler => {
        try {
            handler();
        } catch (error) {
            console.error('Error executing original DOMContentLoaded handler:', error);
        }
    });

    // Reinitialize page-specific functionality if admin-handler.js is loaded
    if (typeof currentAdminPage !== 'undefined') {
        console.log('Reinitializing admin page:', currentAdminPage);

        // Call the appropriate initialization function based on the current page
        switch (currentAdminPage) {
            case 'dashboard':
                if (typeof initAdminDashboardPage === 'function') initAdminDashboardPage();
                break;
            case 'jobs':
                if (typeof initAdminJobsPage === 'function') initAdminJobsPage();
                break;
            case 'results':
                if (typeof initAdminResultsPage === 'function') initAdminResultsPage();
                break;
            case 'admit-cards':
                if (typeof initAdminAdmitCardsPage === 'function') initAdminAdmitCardsPage();
                break;
            case 'answer-keys':
                if (typeof initAdminAnswerKeysPage === 'function') initAdminAnswerKeysPage();
                break;
            case 'syllabus':
                if (typeof initAdminSyllabusPage === 'function') initAdminSyllabusPage();
                break;
            case 'study-materials':
                if (typeof initAdminStudyMaterialsPage === 'function') initAdminStudyMaterialsPage();
                break;
        }
    }
});

/**
 * Navigation Fix for JobGenie
 * This script fixes the dark flash issue when navigating between pages
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Navigation fix initialized');
    
    // Apply the saved theme immediately to prevent flash
    applyThemeImmediately();
    
    // Add event listeners to all internal links
    setupSmoothNavigation();
});

/**
 * Apply the saved theme immediately when the page starts loading
 * This prevents the flash of default theme before DOMContentLoaded
 */
function applyThemeImmediately() {
    // Get saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    // Apply theme class to html element (available before body is parsed)
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
    } else {
        document.documentElement.classList.remove('light-theme');
    }
}

/**
 * Set up smooth navigation between pages
 */
function setupSmoothNavigation() {
    // Get all internal links
    const internalLinks = document.querySelectorAll('a[href^="index.html"], a[href^="jobs.html"], a[href^="latest-jobs.html"], a[href^="results.html"], a[href^="admit-cards.html"], a[href^="answer-keys.html"], a[href^="syllabus.html"], a[href^="study-materials.html"], a[href^="contact.html"], a[href^="search.html"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only handle links to other pages (not anchors on same page)
            if (link.getAttribute('href') !== window.location.pathname.split('/').pop()) {
                e.preventDefault();
                
                // Get the current theme
                const currentTheme = localStorage.getItem('theme') || 'dark';
                
                // Add a transition overlay
                const overlay = document.createElement('div');
                overlay.className = 'page-transition-overlay';
                overlay.style.position = 'fixed';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.backgroundColor = currentTheme === 'dark' ? '#0a1929' : '#f8f9fa';
                overlay.style.zIndex = '9999';
                overlay.style.opacity = '0';
                overlay.style.transition = 'opacity 0.2s ease';
                overlay.style.pointerEvents = 'none';
                
                document.body.appendChild(overlay);
                
                // Fade in the overlay
                setTimeout(() => {
                    overlay.style.opacity = '1';
                }, 10);
                
                // Navigate to the new page after the fade effect
                setTimeout(() => {
                    window.location.href = link.getAttribute('href');
                }, 200);
            }
        });
    });
}

// Execute the theme application immediately (before DOMContentLoaded)
(function() {
    applyThemeImmediately();
})();

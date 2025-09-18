/**
 * Theme Toggle Script for JobGenie
 * This script handles theme toggling functionality for all pages
 */

// Initialize theme as soon as the script loads
(function() {
    // Get saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';

    // Apply theme to document body and html element
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
        try {
            document.body.classList.add('light');
            document.body.classList.remove('dark');
        } catch (e) {
            // Body not available yet, will be handled by DOMContentLoaded
            console.log('Body not available yet, theme will be applied when DOM is loaded');
        }
    } else {
        document.documentElement.classList.remove('light-theme');
        try {
            document.body.classList.remove('light');
            document.body.classList.add('dark');
        } catch (e) {
            // Body not available yet, will be handled by DOMContentLoaded
            console.log('Body not available yet, theme will be applied when DOM is loaded');
        }
    }
})();

// Initialize theme toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a short moment to ensure the admin navbar is loaded
    setTimeout(() => {
        initThemeToggle();
        setupSmoothNavigation();
    }, 100);
});

/**
 * Initialize the theme toggle button
 */
function initThemeToggle() {
    // Get the theme toggle button
    const themeToggleBtn = document.getElementById('theme-toggle');

    if (!themeToggleBtn) {
        console.error('Theme toggle button not found!');

        // Try again after a short delay (in case the navbar is still loading)
        setTimeout(() => {
            const retryToggleBtn = document.getElementById('theme-toggle');
            if (retryToggleBtn) {
                console.log('Theme toggle button found on retry');
                setupThemeToggle(retryToggleBtn);
            } else {
                console.error('Theme toggle button still not found after retry');
            }
        }, 500);
        return;
    }

    setupThemeToggle(themeToggleBtn);
}

/**
 * Set up the theme toggle button with event listeners
 */
function setupThemeToggle(toggleBtn) {
    // Update the icon based on current theme
    updateThemeIcon();

    // Remove any existing event listeners to prevent duplicates
    toggleBtn.removeEventListener('click', toggleTheme);

    // Add click event listener to toggle theme
    toggleBtn.addEventListener('click', function() {
        toggleTheme();
    });

    console.log('Theme toggle initialized');
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    console.log('Toggle theme clicked');

    // Get current theme
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Save new theme preference
    localStorage.setItem('theme', newTheme);

    // Create a transition overlay to prevent flash
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = currentTheme === 'dark' ? '#121212' : '#f8f9fa';
    overlay.style.zIndex = '9999';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.2s ease';
    overlay.style.pointerEvents = 'none';

    document.body.appendChild(overlay);

    // Fade in the overlay
    setTimeout(() => {
        overlay.style.opacity = '1';

        // Apply theme after a short delay
        setTimeout(() => {
            // Apply theme
            if (newTheme === 'light') {
                document.documentElement.classList.add('light-theme');
                document.body.classList.add('light');
                document.body.classList.remove('dark');
            } else {
                document.documentElement.classList.remove('light-theme');
                document.body.classList.remove('light');
                document.body.classList.add('dark');
            }

            // Update all theme toggle buttons
            const themeToggleBtns = document.querySelectorAll('.theme-toggle');
            themeToggleBtns.forEach(btn => {
                if (newTheme === 'dark') {
                    btn.innerHTML = '<i class="fas fa-sun"></i>';
                } else {
                    btn.innerHTML = '<i class="fas fa-moon"></i>';
                }
            });

            // Fade out the overlay
            setTimeout(() => {
                overlay.style.opacity = '0';

                // Remove the overlay after fade out
                setTimeout(() => {
                    document.body.removeChild(overlay);
                }, 200);
            }, 100);

            console.log('Theme switched to:', newTheme);
        }, 100);
    }, 10);
}

/**
 * Update the theme toggle icon based on current theme
 */
function updateThemeIcon() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (!themeToggleBtn) return;

    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Set the icon based on the current theme
    if (currentTheme === 'dark') {
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }

    // Add the text after the icon if it's in the sidebar
    if (themeToggleBtn.closest('.sidebar-footer')) {
        // The text will be added via CSS ::after pseudo-element
        console.log('Theme toggle button is in the sidebar');
    }
}

/**
 * Set up smooth navigation between pages
 */
function setupSmoothNavigation() {
    // Get all internal links
    const internalLinks = document.querySelectorAll('a[href^="../admin/"], a[href^="./"], a[href^="/admin/"]');

    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only handle links to other pages (not anchors on same page)
            const currentPage = window.location.pathname.split('/').pop();
            const targetPage = link.getAttribute('href').split('/').pop();

            if (targetPage !== currentPage) {
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
                overlay.style.backgroundColor = currentTheme === 'dark' ? '#121212' : '#f8f9fa';
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

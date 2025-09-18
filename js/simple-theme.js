/**
 * Simple Theme Toggle for JobGenie
 * This is a simplified implementation of theme toggling functionality
 */

// Initialize theme as soon as the script loads
(function() {
    // Get saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';

    // Apply theme to document body and html element
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
        // Use a try-catch to handle cases where body might not be available yet
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

// Set up theme toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the theme toggle button
    const themeToggleBtn = document.getElementById('theme-toggle');

    if (!themeToggleBtn) {
        console.error('Theme toggle button not found!');
        return;
    }

    // Update the icon based on current theme
    updateThemeIcon();

    // Add click event listener to toggle theme
    themeToggleBtn.addEventListener('click', function() {
        toggleTheme();
    });

    // Log that theme toggle is initialized
    console.log('Simple theme toggle initialized');
});

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
    overlay.style.backgroundColor = currentTheme === 'dark' ? '#0a1929' : '#f8f9fa';
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

            // Update the icon
            updateThemeIcon();

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
}

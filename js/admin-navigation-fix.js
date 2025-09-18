/**
 * Navigation Fix for JobGenie Admin Dashboard
 * This script fixes the theme toggle issue in the admin dashboard
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin navigation fix initialized');
    
    // Apply the saved theme immediately to prevent flash
    applyThemeImmediately();
    
    // Initialize theme toggle
    initAdminThemeToggle();
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
 * Initialize the theme toggle button for admin dashboard
 */
function initAdminThemeToggle() {
    // Get the theme toggle button
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    if (!themeToggleBtn) {
        console.error('Admin theme toggle button not found!');
        return;
    }
    
    // Update the icon based on current theme
    updateAdminThemeIcon();
    
    // Add click event listener to toggle theme
    themeToggleBtn.addEventListener('click', function() {
        toggleAdminTheme();
    });
    
    console.log('Admin theme toggle initialized');
}

/**
 * Toggle between light and dark themes for admin dashboard
 */
function toggleAdminTheme() {
    console.log('Admin toggle theme clicked');
    
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
            
            // Update the icon
            updateAdminThemeIcon();
            
            // Fade out the overlay
            setTimeout(() => {
                overlay.style.opacity = '0';
                
                // Remove the overlay after fade out
                setTimeout(() => {
                    document.body.removeChild(overlay);
                }, 200);
            }, 100);
            
            console.log('Admin theme switched to:', newTheme);
        }, 100);
    }, 10);
}

/**
 * Update the theme toggle icon based on current theme for admin dashboard
 */
function updateAdminThemeIcon() {
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

// Execute the theme application immediately (before DOMContentLoaded)
(function() {
    applyThemeImmediately();
})();

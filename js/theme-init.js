/**
 * Theme Initialization Script for JobGenie
 * This script applies the saved theme immediately before the page renders
 */

// Apply theme immediately before any rendering
(function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.className = savedTheme === 'light' ? 'light-theme' : '';
    
    // Add a class to indicate theme is being initialized
    document.documentElement.classList.add('theme-initializing');
    
    // Create a style element to prevent flash of unstyled content
    const style = document.createElement('style');
    style.textContent = `
        html.theme-initializing body {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Remove the initializing class after a short delay
    window.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            document.documentElement.classList.remove('theme-initializing');
        }, 50);
    });
})();

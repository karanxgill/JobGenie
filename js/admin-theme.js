/**
 * Admin Theme Toggle - A simplified theme toggle implementation for the admin dashboard
 */

// Apply theme immediately before any rendering (robust)
(function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    // Set html class
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
        document.documentElement.classList.remove('dark-theme');
    } else {
        document.documentElement.classList.remove('light-theme');
        document.documentElement.classList.add('dark-theme');
    }
    // Set body class as soon as body is available
    function applyBodyTheme() {
        if (!document.body) {
            setTimeout(applyBodyTheme, 10);
            return;
        }
        if (savedTheme === 'light') {
            document.body.classList.add('light');
            document.body.classList.remove('dark');
        } else {
            document.body.classList.remove('light');
            document.body.classList.add('dark');
        }
    }
    applyBodyTheme();
})();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Save new theme preference
    localStorage.setItem('theme', newTheme);
    
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
    updateAllThemeToggleIcons();
    
    console.log('Theme switched to:', newTheme);
}


    const themeToggles = document.querySelectorAll('.theme-toggle, #theme-toggle, .sidebar-theme-toggle, #sidebar-theme-toggle');
    
    themeToggles.forEach(toggle => {
        updateThemeToggleIcon(toggle);
    });
}


    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Check if it's the sidebar toggle with text
    if (toggle.classList.contains('sidebar-theme-toggle')) {
        toggle.innerHTML = `
            <i class="fas ${currentTheme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i>
            <span>Toggle Theme</span>
        `;
    } else {
        // Regular icon-only toggle
        toggle.innerHTML = `<i class="fas ${currentTheme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i>`;
    }
}

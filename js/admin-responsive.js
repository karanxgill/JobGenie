/**
 * Responsive functionality for JobGenie Admin Dashboard
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar toggle
    initSidebarToggle();

    // Make tables responsive
    makeTablesResponsive();

    // Add responsive class to content filters
    initResponsiveFilters();

    // Handle window resize
    window.addEventListener('resize', function() {
        // Reinitialize sidebar toggle on resize
        initSidebarToggle();
    });
});

/**
 * Initialize sidebar toggle functionality
 */
function initSidebarToggle() {
    const sidebar = document.querySelector('.admin-sidebar');
    const mainContent = document.querySelector('.admin-main');

    // Only create sidebar toggle if screen width is less than 992px
    const isMobile = window.innerWidth < 992;

    // Create sidebar toggle button if it doesn't exist and we're on mobile
    if (isMobile && !document.querySelector('.sidebar-toggle')) {
        const sidebarToggle = document.createElement('button');
        sidebarToggle.className = 'sidebar-toggle';
        sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
        sidebarToggle.setAttribute('aria-label', 'Toggle sidebar');

        document.body.appendChild(sidebarToggle);

        // Add event listener to sidebar toggle
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('expanded');
            mainContent.classList.toggle('sidebar-expanded');

            // Change icon based on state
            if (sidebar.classList.contains('expanded')) {
                sidebarToggle.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    } else if (!isMobile) {
        // Remove sidebar toggle if we're on desktop
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.remove();
        }
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        if (!sidebar || !sidebarToggle) return;

        const isClickInsideSidebar = sidebar.contains(event.target);
        const isClickOnToggle = sidebarToggle.contains(event.target);

        if (!isClickInsideSidebar && !isClickOnToggle && sidebar.classList.contains('expanded') && window.innerWidth < 992) {
            sidebar.classList.remove('expanded');
            mainContent.classList.remove('sidebar-expanded');
            sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
}

/**
 * Make tables responsive by adding a wrapper
 */
function makeTablesResponsive() {
    const tables = document.querySelectorAll('.content-table table');

    tables.forEach(table => {
        // Add data-label attributes to table cells for mobile view
        const headers = table.querySelectorAll('thead th');
        const headerTexts = Array.from(headers).map(header => header.textContent.trim());

        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, index) => {
                if (headerTexts[index]) {
                    cell.setAttribute('data-label', headerTexts[index]);
                }
            });
        });
    });
}

/**
 * Initialize responsive filters
 */
function initResponsiveFilters() {
    const filterGroups = document.querySelectorAll('.content-filters');

    filterGroups.forEach(filterGroup => {
        // Add wrapper for filter buttons if it doesn't exist
        if (!filterGroup.querySelector('.filter-buttons')) {
            const filterButtons = Array.from(filterGroup.querySelectorAll('.filter-btn'));

            if (filterButtons.length > 0) {
                // Create filter buttons wrapper
                const filterButtonsWrapper = document.createElement('div');
                filterButtonsWrapper.className = 'filter-buttons';

                // Move filter buttons to wrapper
                filterButtons.forEach(button => {
                    const parent = button.parentNode;
                    filterButtonsWrapper.appendChild(button);

                    // Remove empty parent if it's not the filter group itself
                    if (parent !== filterGroup && parent.children.length === 0) {
                        parent.remove();
                    }
                });

                // Append wrapper to filter group
                filterGroup.appendChild(filterButtonsWrapper);
            }
        }
    });
}

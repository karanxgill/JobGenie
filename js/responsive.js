/**
 * Responsive functionality for JobGenie
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initMobileMenu();

    // Make tables responsive
    makeTablesResponsive();

    // Handle window resize
    window.addEventListener('resize', function() {
        // Reinitialize mobile menu on resize
        initMobileMenu();
    });
});

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    // Only create mobile menu toggle if screen width is less than 992px
    const isMobile = window.innerWidth < 992;

    // Create mobile menu toggle button if it doesn't exist and we're on mobile
    if (isMobile && !document.querySelector('.mobile-menu-toggle')) {
        const header = document.querySelector('.header-top');
        if (header) {
            const mobileMenuToggle = document.createElement('button');
            mobileMenuToggle.className = 'mobile-menu-toggle';
            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            mobileMenuToggle.setAttribute('aria-label', 'Toggle mobile menu');

            // Insert inside header actions at the beginning
            const headerActions = document.querySelector('.header-actions');

            if (headerActions) {
                // Insert at the beginning of header actions
                headerActions.insertBefore(mobileMenuToggle, headerActions.firstChild);
            } else {
                // Fallback if header actions doesn't exist
                const logoContainer = document.querySelector('.logo-container');
                if (logoContainer) {
                    logoContainer.parentNode.insertBefore(mobileMenuToggle, logoContainer.nextSibling);
                } else {
                    header.appendChild(mobileMenuToggle);
                }
            }
        }
    } else if (!isMobile) {
        // Remove mobile menu toggle if we're on desktop
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.remove();
        }
    }

    // Create mobile navigation if it doesn't exist and we're on mobile
    if (isMobile && !document.querySelector('.mobile-nav')) {
        const mainNav = document.querySelector('.main-nav');
        if (mainNav) {
            // Create container div
            const container = document.querySelector('.container');

            // Clone the main navigation
            const mobileNav = document.createElement('nav');
            mobileNav.className = 'mobile-nav';

            // Clone the navigation items
            const navItems = mainNav.querySelector('ul').cloneNode(true);

            // Update IDs to avoid duplicates
            const navLinks = navItems.querySelectorAll('a');
            navLinks.forEach(link => {
                const oldId = link.getAttribute('id');
                if (oldId) {
                    link.setAttribute('id', 'mobile-' + oldId);
                }
            });

            mobileNav.appendChild(navItems);

            // Insert after main navigation
            if (container) {
                container.appendChild(mobileNav);
            } else {
                mainNav.parentNode.insertBefore(mobileNav, mainNav.nextSibling);
            }

            // Initially hide mobile navigation
            mobileNav.style.display = 'none';

            // Set active navigation item for mobile menu
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const mobileNavLinks = mobileNav.querySelectorAll('a');

            mobileNavLinks.forEach(link => {
                if (link.getAttribute('href') === currentPage) {
                    link.classList.add('active');
                    link.parentElement.classList.add('active');
                }
            });
        }
    } else if (!isMobile) {
        // Remove mobile navigation if we're on desktop
        const mobileNav = document.querySelector('.mobile-nav');
        if (mobileNav) {
            mobileNav.remove();
        }
    }

    // Add event listener to mobile menu toggle only if we're on mobile
    if (isMobile) {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileNav = document.querySelector('.mobile-nav');

        if (mobileMenuToggle && mobileNav) {
            // Remove existing event listeners
            const newMobileMenuToggle = mobileMenuToggle.cloneNode(true);
            mobileMenuToggle.parentNode.replaceChild(newMobileMenuToggle, mobileMenuToggle);

            // Add click event listener
            newMobileMenuToggle.addEventListener('click', function() {
                if (mobileNav.style.display === 'none' || !mobileNav.style.display) {
                    mobileNav.style.display = 'block';
                    newMobileMenuToggle.innerHTML = '<i class="fas fa-times"></i>';
                    mobileNav.classList.add('active');
                } else {
                    mobileNav.style.display = 'none';
                    newMobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    mobileNav.classList.remove('active');
                }
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', function(event) {
                if (mobileNav.style.display === 'block' &&
                    !mobileNav.contains(event.target) &&
                    !newMobileMenuToggle.contains(event.target)) {
                    mobileNav.style.display = 'none';
                    newMobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    mobileNav.classList.remove('active');
                }
            });

            // Close mobile menu when clicking on a link
            const mobileNavLinks = mobileNav.querySelectorAll('a');
            mobileNavLinks.forEach(link => {
                link.addEventListener('click', function() {
                    mobileNav.style.display = 'none';
                    newMobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    mobileNav.classList.remove('active');
                });
            });
        }
    }
}

/**
 * Make tables responsive by adding a wrapper
 */
function makeTablesResponsive() {
    const tables = document.querySelectorAll('table:not(.responsive-table)');

    tables.forEach(table => {
        // Skip tables that are already responsive
        if (table.parentNode.classList.contains('responsive-table')) {
            return;
        }

        // Create responsive wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'responsive-table';

        // Replace table with wrapper containing the table
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
    });
}

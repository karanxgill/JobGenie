// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Mobile menu script loaded');

    // Function to toggle mobile menu
    window.toggleMobileMenu = function(event) {
        if (event) {
            event.preventDefault();
        }
        console.log('Mobile menu toggle clicked');

        // Get or create mobile nav
        let mobileNav = document.querySelector('.mobile-nav');
        if (!mobileNav) {
            mobileNav = document.createElement('nav');
            mobileNav.className = 'mobile-nav';
            mobileNav.style.display = 'none';
            mobileNav.style.position = 'fixed';
            // Set top position based on screen width
            if (window.innerWidth <= 575.98) {
                mobileNav.style.top = '80px'; // Extra small screens
                mobileNav.style.maxHeight = 'calc(100vh - 80px)';
            } else if (window.innerWidth <= 767.98) {
                mobileNav.style.top = '90px'; // Small screens
                mobileNav.style.maxHeight = 'calc(100vh - 90px)';
            } else {
                mobileNav.style.top = '110px'; // Medium and larger screens
                mobileNav.style.maxHeight = 'calc(100vh - 110px)';
            }
            mobileNav.style.left = '0';
            mobileNav.style.width = '100%';
            mobileNav.style.backgroundColor = 'var(--background-color)';
            mobileNav.style.boxShadow = '0 5px 10px rgba(0, 0, 0, 0.1)';
            mobileNav.style.zIndex = '100';
            mobileNav.style.overflowY = 'auto';

            // Copy links from main nav
            const mainNavLinks = document.querySelectorAll('.main-nav a');
            const ul = document.createElement('ul');
            ul.style.display = 'flex';
            ul.style.flexDirection = 'column';
            ul.style.padding = '0';
            ul.style.margin = '0';
            ul.style.listStyle = 'none';

            mainNavLinks.forEach(link => {
                const li = document.createElement('li');
                li.style.width = '100%';

                const a = document.createElement('a');
                a.href = link.href;
                a.innerHTML = link.innerHTML;
                a.style.display = 'block';
                a.style.padding = '12px 20px';
                a.style.color = 'var(--text-color)';
                a.style.textDecoration = 'none';
                a.style.borderBottom = '1px solid var(--border-color)';
                a.style.transition = 'background-color 0.3s';

                if (link.classList.contains('active')) {
                    a.classList.add('active');
                    li.classList.add('active');
                    a.style.fontWeight = 'bold';
                    a.style.color = 'var(--white)';
                    a.style.backgroundColor = 'var(--primary-color)';

                    // Make sure the icon is also white
                    const icon = a.querySelector('i');
                    if (icon) {
                        icon.style.color = 'var(--white)';
                    }
                }

                li.appendChild(a);
                ul.appendChild(li);
            });

            mobileNav.appendChild(ul);
            document.querySelector('.main-header .container').appendChild(mobileNav);
        }

        // Toggle mobile nav visibility
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        if (mobileNav.style.display === 'none' || mobileNav.style.display === '') {
            mobileNav.style.display = 'block';
            mobileMenuToggle.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            mobileNav.style.display = 'none';
            mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    };

    // Set up click handler for mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    if (mobileMenuToggle) {
        // Force display the mobile menu toggle on small screens
        if (window.innerWidth <= 991) {
            mobileMenuToggle.style.display = 'flex';
        }

        // Add click event listener
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Add resize event listener to handle responsive behavior
    window.addEventListener('resize', function() {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const mobileNav = document.querySelector('.mobile-nav');

        if (mobileMenuToggle) {
            if (window.innerWidth <= 991) {
                mobileMenuToggle.style.display = 'flex';

                // Update mobile nav position based on screen width
                if (mobileNav) {
                    if (window.innerWidth <= 575.98) {
                        mobileNav.style.top = '80px'; // Extra small screens
                        mobileNav.style.maxHeight = 'calc(100vh - 80px)';
                    } else if (window.innerWidth <= 767.98) {
                        mobileNav.style.top = '90px'; // Small screens
                        mobileNav.style.maxHeight = 'calc(100vh - 90px)';
                    } else {
                        mobileNav.style.top = '110px'; // Medium screens
                        mobileNav.style.maxHeight = 'calc(100vh - 110px)';
                    }
                }
            } else {
                mobileMenuToggle.style.display = 'none';

                // Hide mobile nav when screen is resized to desktop
                if (mobileNav && mobileNav.style.display === 'block') {
                    mobileNav.style.display = 'none';
                    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        }
    });
});

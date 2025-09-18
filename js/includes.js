// Let's use a simpler approach - directly include the HTML content
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    // Insert header HTML directly
    document.getElementById('header-placeholder').innerHTML = `
    <!-- Header Section -->
    <header class="main-header">
        <div class="container">
            <div class="header-top" style="display: flex; justify-content: space-between; align-items: center;">
                <div class="logo-container" style="flex: 1; text-align: left;">
                    <div class="site-title">
                        <h1>JobGenie</h1>
                        <p class="site-subtitle">Your Career Wishes Granted</p>
                    </div>
                </div>

                <div class="header-actions" style="display: flex; align-items: center; justify-content: flex-end;">
                    <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Toggle mobile menu" style="display: none; align-items: center; justify-content: center; margin-right: 10px; background-color: #4285f4; color: white; border: none; border-radius: 4px; width: 36px; height: 36px; cursor: pointer; z-index: 1001; order: 0;">
                        <i class="fas fa-bars"></i>
                    </button>
                    <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme" style="margin-left: 10px;">
                        <i class="fas fa-sun"></i>
                    </button>
                </div>
            </div>

            <!-- Main Navigation -->
            <nav class="main-nav">
                <ul>
                    <li><a href="index.html" id="nav-home"><i class="fas fa-home"></i> Home</a></li>
                    <li><a href="latest-jobs.html" id="nav-jobs"><i class="fas fa-briefcase"></i> Jobs</a></li>
                    <li><a href="results.html" id="nav-results"><i class="fas fa-poll"></i> Results</a></li>
                    <li><a href="admit-cards.html" id="nav-admit"><i class="fas fa-id-card"></i> Admit Cards</a></li>
                    <li><a href="answer-keys.html" id="nav-answer"><i class="fas fa-key"></i> Answers</a></li>
                    <li><a href="syllabus.html" id="nav-syllabus"><i class="fas fa-book"></i> Syllabus</a></li>
                    <li><a href="study-materials.html" id="nav-study"><i class="fas fa-graduation-cap"></i> Study</a></li>
                    <li><a href="search.html" id="nav-search"><i class="fas fa-search"></i> Search</a></li>
                    <li><a href="contact.html" id="nav-contact"><i class="fas fa-envelope"></i> Contact</a></li>
                </ul>
            </nav>
        </div>
    </header>
    `;

    // Insert footer HTML directly
    document.getElementById('footer-placeholder').innerHTML = `
    <!-- Footer -->
    <footer class="main-footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-section">
                    <h3>About JobGenie</h3>
                    <p style="color: var(--light-text); margin-bottom: 15px; line-height: 1.6;">India's leading government job portal helping millions of job seekers find their dream career opportunities in various government sectors.</p>
                    <div class="social-links">
                        <a href="#" class="social-link" title="Twitter" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                        <a href="#" class="social-link" title="Telegram" aria-label="Telegram"><i class="fab fa-telegram"></i></a>
                        <a href="#" class="social-link" title="WhatsApp" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                        <a href="#" class="social-link" title="Instagram" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                        <a href="#" class="social-link" title="Facebook" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="social-link" title="LinkedIn" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                    </div>
                </div>

                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <ul class="footer-links">
                        <li><a href="index.html">Home</a></li>
                        <li><a href="latest-jobs.html">Latest Jobs</a></li>
                        <li><a href="results.html">Results</a></li>
                        <li><a href="admit-cards.html">Admit Cards</a></li>
                        <li><a href="answer-keys.html">Answer Keys</a></li>
                        <li><a href="syllabus.html">Syllabus</a></li>
                        <li><a href="study-materials.html">Study Materials</a></li>
                        <li><a href="contact.html">Contact Us</a></li>
                    </ul>
                </div>

                <div class="footer-section">
                    <h3>Popular Exams</h3>
                    <ul class="footer-links">
                        <li><a href="#">UPSC</a></li>
                        <li><a href="#">SSC</a></li>
                        <li><a href="#">IBPS</a></li>
                        <li><a href="#">BPSC</a></li>
                        <li><a href="#">UPSSSC</a></li>
                        <li><a href="#">Railway</a></li>
                        <li><a href="#">Defence</a></li>
                    </ul>
                </div>
            </div>

            <div class="copyright">
                <p>&copy; 2025 JobGenie. All Rights Reserved.</p>
                <div class="footer-legal-links">
                    <a href="privacy-policy.html">Privacy Policy</a>
                    <a href="terms-of-service.html">Terms of Service</a>
                </div>
            </div>
        </div>
    </footer>
    `;

    // Set active navigation item
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.main-nav a');

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
            link.parentElement.classList.add('active');
        }
    });

    // Add direct theme toggle functionality
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        // Update icon based on current theme
        const currentTheme = localStorage.getItem('theme') || 'dark';
        themeToggleBtn.innerHTML = currentTheme === 'dark' ?
            '<i class="fas fa-sun"></i>' :
            '<i class="fas fa-moon"></i>';

        // Add click event listener
        themeToggleBtn.addEventListener('click', function() {
            const currentTheme = localStorage.getItem('theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            // Save new theme preference
            localStorage.setItem('theme', newTheme);

            // Apply theme
            if (newTheme === 'light') {
                document.body.classList.add('light');
                document.body.classList.remove('dark');
            } else {
                document.body.classList.remove('light');
                document.body.classList.add('dark');
            }

            // Update icon
            themeToggleBtn.innerHTML = newTheme === 'dark' ?
                '<i class="fas fa-sun"></i>' :
                '<i class="fas fa-moon"></i>';

            console.log('Theme switched to:', newTheme);
        });
    }

    // Attach mobile menu toggle event after header is injected
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    if (mobileMenuToggle) {
        if (typeof window.toggleMobileMenu === 'function') {
            mobileMenuToggle.addEventListener('click', window.toggleMobileMenu);
        } else {
            console.warn('toggleMobileMenu is not defined. Ensure mobile-menu.js is loaded after includes.js.');
        }
    }
    // (Removed duplicate resize handler to avoid conflicts with mobile-menu.js)

    // Handle hero section image loading and errors
    function handleHeroImages() {
        // Get all hero section images
        const heroImages = document.querySelectorAll('.hero-section img');

        // Process each image
        heroImages.forEach(img => {
            // Add loading class
            img.closest('.success-photo').classList.add('loading');

            // Handle successful load
            img.addEventListener('load', function() {
                img.closest('.success-photo').classList.remove('loading');
                img.closest('.success-photo').classList.add('loaded');
            });

            // Handle load errors
            img.addEventListener('error', function() {
                // Remove the loading class
                img.closest('.success-photo').classList.remove('loading');

                // Add error class
                img.closest('.success-photo').classList.add('error');

                // Replace with a placeholder
                img.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22180%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20180%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1%20text%20%7B%20fill%3A%23999%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A10pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1%22%3E%3Crect%20width%3D%22180%22%20height%3D%22180%22%20fill%3D%22%23373940%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2256.5%22%20y%3D%2295%22%3EImage%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
                img.alt = 'Image could not be loaded';
            });
        });
    }

    // Call the function after DOM is loaded
    handleHeroImages();
});

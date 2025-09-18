/**
 * Dashboard Enhancement Script
 * Adds animations and interactive elements to the dashboard
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initAnimations();

    // Initialize scroll reveal
    initScrollReveal();

    // Initialize counters
    initCounters();

    // Initialize card interactions
    initCardInteractions();

    // Initialize particle background if available
    if (typeof initParticleBackground === 'function') {
        initParticleBackground();
    }
});

/**
 * Initialize animations for dashboard elements
 */
function initAnimations() {
    // Animate hero section elements
    const heroElements = document.querySelectorAll('.hero-text h1, .hero-text p, .hero-buttons, .hero-image');
    heroElements.forEach((element, index) => {
        element.classList.add('animate-fade-in-up');
        element.style.animationDelay = `${0.2 * index}s`;
    });

    // Animate job search section
    const jobSearchSection = document.querySelector('.job-search-section');
    if (jobSearchSection) {
        jobSearchSection.classList.add('animate-fade-in-up');
        jobSearchSection.style.animationDelay = '0.6s';
    }

    // Animate section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.classList.add('reveal');
    });

    // Add floating animation to feature icons
    const featureIcons = document.querySelectorAll('.feature-icon');
    featureIcons.forEach(icon => {
        icon.classList.add('animate-float');
    });

    // Add pulse animation to CTA button
    const ctaButtons = document.querySelectorAll('.cta-buttons .btn');
    ctaButtons.forEach(button => {
        button.classList.add('animate-pulse');
    });
}

/**
 * Initialize scroll reveal animations
 */
function initScrollReveal() {
    // Get all elements with reveal classes
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    // Observe all reveal elements
    revealElements.forEach(element => {
        observer.observe(element);
    });

    // Add reveal classes to elements that should animate on scroll
    const jobCards = document.querySelectorAll('.job-card');
    jobCards.forEach((card, index) => {
        card.classList.add('reveal');
        card.style.transitionDelay = `${0.1 * index}s`;
    });

    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.classList.add('reveal');
        card.style.transitionDelay = `${0.1 * index}s`;
    });

    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach((card, index) => {
        card.classList.add('reveal');
        card.style.transitionDelay = `${0.1 * index}s`;
    });

    // Add left/right reveal for about section
    const aboutImage = document.querySelector('.about-image');
    if (aboutImage) aboutImage.classList.add('reveal-left');

    const aboutText = document.querySelector('.about-text');
    if (aboutText) aboutText.classList.add('reveal-right');

    // Make sure all reveal elements are visible initially
    // This ensures elements are visible even if IntersectionObserver doesn't trigger
    setTimeout(() => {
        revealElements.forEach(element => {
            if (!element.classList.contains('active')) {
                element.classList.add('active');
            }
        });

        // Also make sure feature cards are visible
        document.querySelectorAll('.feature-card').forEach(card => {
            if (!card.classList.contains('active')) {
                card.classList.add('active');
            }
        });
    }, 500);
}

/**
 * Initialize animated counters for statistics
 */
function initCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.innerText.replace(/[^0-9]/g, ''));

                // Only animate if not already animated
                if (!target.classList.contains('counted')) {
                    animateCounter(target, 0, countTo, 2000);
                    target.classList.add('counted');
                }
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
}

/**
 * Animate counter from start to end value
 * @param {Element} element - Element to animate
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} duration - Animation duration in milliseconds
 */
function animateCounter(element, start, end, duration) {
    const originalText = element.innerText;
    const numericPart = originalText.replace(/[^0-9]/g, '');
    const prefix = originalText.split(numericPart)[0] || '';
    const suffix = originalText.split(numericPart)[1] || '';

    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        element.innerText = `${prefix}${currentValue}${suffix}`;

        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };

    window.requestAnimationFrame(step);
}

/**
 * Initialize card interactions
 */
function initCardInteractions() {
    // Add hover effects to cards
    const allCards = document.querySelectorAll('.job-card, .feature-card, .category-card');
    allCards.forEach(card => {
        card.classList.add('hover-lift', 'hover-glow');
    });

    // Add micro-interactions to buttons
    const allButtons = document.querySelectorAll('.btn, .action-btn, .apply-btn');
    allButtons.forEach(button => {
        button.classList.add('micro-bounce');
    });

    // Add micro-interactions to links with icons
    const iconLinks = document.querySelectorAll('a i');
    iconLinks.forEach(link => {
        link.parentElement.classList.add('micro-slide');
    });
}

/**
 * Initialize particle background (if particle.js is included)
 */
function initParticleBackground() {
    // Create canvas for particles
    const particleContainer = document.createElement('div');
    particleContainer.id = 'particles-js';
    particleContainer.style.position = 'absolute';
    particleContainer.style.top = '0';
    particleContainer.style.left = '0';
    particleContainer.style.width = '100%';
    particleContainer.style.height = '100%';
    particleContainer.style.zIndex = '0';
    particleContainer.style.pointerEvents = 'none';

    // Add to hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.style.position = 'relative';
        heroSection.style.overflow = 'hidden';
        heroSection.insertBefore(particleContainer, heroSection.firstChild);

        // Initialize particles
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#ffffff' },
                shape: { type: 'circle' },
                opacity: { value: 0.1, random: false },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.1, width: 1 },
                move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
            },
            interactivity: {
                detect_on: 'canvas',
                events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
                modes: { grab: { distance: 140, line_linked: { opacity: 0.3 } }, push: { particles_nb: 4 } }
            },
            retina_detect: true
        });
    }
}

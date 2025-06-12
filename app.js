// Portfolio Website JavaScript - Fixed Version
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupThemeToggle();
        this.setupSmoothScrolling();
        this.setupActiveNavigation();
        this.setupMobileNavigation();
        this.setupContactForm();
        this.setupAnimations();
        this.handleInitialLoad();
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleTheme();
            });
        }

        // Mobile navigation toggle
        const navToggle = document.getElementById('navToggle');
        if (navToggle) {
            navToggle.addEventListener('click', () => this.toggleMobileNav());
        }

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactForm(e));
        }

        // Scroll event for navbar background and active nav
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        // Resize event for mobile navigation
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    setupThemeToggle() {
        // Initialize theme system properly
        this.currentTheme = 'light';
        this.setTheme(this.currentTheme);
    }

    toggleTheme() {
        console.log('Toggle theme called, current theme:', this.currentTheme);
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(this.currentTheme);
    }

    setTheme(theme) {
        console.log('Setting theme to:', theme);
        this.currentTheme = theme;
        
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
        
        // Update theme icon
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
        }
        
        console.log('Theme applied:', document.documentElement.getAttribute('data-theme'));
    }

    setupSmoothScrolling() {
        // Smooth scrolling is handled by CSS scroll-behavior: smooth
        // This is a fallback for browsers that don't support it
        if (!('scrollBehavior' in document.documentElement.style)) {
            this.enablePolyfillSmoothScrolling();
        }
    }

    enablePolyfillSmoothScrolling() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    this.smoothScrollTo(targetElement);
                }
            });
        });
    }

    smoothScrollTo(element) {
        const startPosition = window.pageYOffset;
        const targetPosition = element.offsetTop - 80; // Account for fixed navbar
        const distance = targetPosition - startPosition;
        const duration = 800;
        let start = null;

        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const progressPercentage = Math.min(progress / duration, 1);
            
            // Easing function
            const easeInOutCubic = progressPercentage < 0.5 
                ? 4 * progressPercentage * progressPercentage * progressPercentage 
                : (progressPercentage - 1) * (2 * progressPercentage - 2) * (2 * progressPercentage - 2) + 1;
            
            window.scrollTo(0, startPosition + distance * easeInOutCubic);
            
            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        };
        
        window.requestAnimationFrame(step);
    }

    setupActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        if (sections.length === 0 || navLinks.length === 0) return;

        // Create intersection observer for better performance
        const observerOptions = {
            root: null,
            rootMargin: '-80px 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    this.updateActiveNavLink(id);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    updateActiveNavLink(activeId) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
            }
        });
    }

    setupMobileNavigation() {
        this.isMobileNavOpen = false;
    }

    toggleMobileNav() {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        
        if (!navMenu || !navToggle) return;

        this.isMobileNavOpen = !this.isMobileNavOpen;
        
        if (this.isMobileNavOpen) {
            navMenu.classList.add('active');
            navToggle.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    closeMobileNav() {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        
        if (!navMenu || !navToggle) return;

        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
        this.isMobileNavOpen = false;
    }

    handleNavClick(e) {
        const link = e.target.closest('.nav-link');
        if (!link) return;

        const href = link.getAttribute('href');
        
        // Handle internal links
        if (href && href.startsWith('#')) {
            e.preventDefault();
            
            // Close mobile nav if open
            if (this.isMobileNavOpen) {
                this.closeMobileNav();
            }
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    }

    handleScroll() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        // Add background to navbar on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    handleResize() {
        // Close mobile nav on resize to larger screen
        if (window.innerWidth > 768 && this.isMobileNavOpen) {
            this.closeMobileNav();
        }
    }

    setupContactForm() {
        // Simple form validation and handling (no backend)
        const form = document.getElementById('contactForm');
        if (!form) return;

        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styling
        field.classList.remove('error');
        this.removeFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required.';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }

        if (!isValid) {
            this.showFieldError(field, message);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        // Insert after the field
        field.parentNode.appendChild(errorElement);
    }

    removeFieldError(field) {
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        this.removeFieldError(field);
    }

    handleContactForm(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const fields = form.querySelectorAll('input, textarea');
        
        // Validate all fields
        let isFormValid = true;
        fields.forEach(field => {
            if (field.hasAttribute('required') && !field.value.trim()) {
                isFormValid = false;
                this.showFieldError(field, 'This field is required.');
            }
        });

        if (!isFormValid) {
            this.showFormMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Since we don't have a backend, we'll simulate form submission
        this.simulateFormSubmission(formData);
    }

    simulateFormSubmission(formData) {
        const submitButton = document.querySelector('#contactForm button[type="submit"]');
        if (!submitButton) return;
        
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate network delay
        setTimeout(() => {
            // Create mailto link with form data
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            const mailtoUrl = `mailto:bhuvirajeev@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
            
            // Open default email client
            window.location.href = mailtoUrl;
            
            // Show success message
            this.showFormMessage('Your message has been prepared! Your default email client should open now.', 'success');
            
            // Reset form
            document.getElementById('contactForm').reset();
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1500);
    }

    showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        // Add styles for the message
        messageElement.style.cssText = `
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 16px;
            font-weight: 500;
            ${type === 'success' 
                ? 'background-color: rgba(33, 128, 141, 0.1); color: #21808d; border: 1px solid rgba(33, 128, 141, 0.2);'
                : 'background-color: rgba(192, 21, 47, 0.1); color: #c0152f; border: 1px solid rgba(192, 21, 47, 0.2);'
            }
        `;
        
        // Insert at the top of the form
        const form = document.getElementById('contactForm');
        form.insertBefore(messageElement, form.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }

    setupAnimations() {
        // Simple fade-in animations without complex intersection observer
        const animationElements = document.querySelectorAll(
            '.hero-content, .about-content, .timeline-item, .skill-category, .education-item, .contact-content'
        );
        
        animationElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    handleInitialLoad() {
        // Add loaded class to body after initial load
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });

        // Handle page load from hash
        if (window.location.hash) {
            setTimeout(() => {
                const targetElement = document.querySelector(window.location.hash);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new PortfolioApp();
    console.log('Portfolio app initialized');
});

// Additional CSS for form validation and theme fixes (injected via JavaScript)
const additionalStyles = `
    .form-control.error {
        border-color: #c0152f !important;
        box-shadow: 0 0 0 3px rgba(192, 21, 47, 0.1) !important;
    }
    
    .field-error {
        color: #c0152f;
        font-size: 12px;
        margin-top: 4px;
        font-weight: 500;
    }
    
    .nav-bar.scrolled {
        background: rgba(255, 255, 255, 0.98) !important;
        backdrop-filter: blur(20px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    [data-theme="dark"] .nav-bar.scrolled {
        background: rgba(26, 26, 26, 0.98) !important;
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
    }
    
    /* Fix contact form positioning */
    .contact-form {
        position: relative;
        z-index: 1;
    }
    
    .contact-form .btn {
        position: relative;
        z-index: 2;
    }
    
    /* Ensure sections have proper min-height */
    section {
        min-height: auto;
    }
    
    .hero-section {
        min-height: 100vh;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
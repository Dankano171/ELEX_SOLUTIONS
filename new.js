document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
    initContactForm();
    initScrollAnimations();
    initHomeIconMenu();
    initAdminLoginModal();
    initScrollToTopButton(); // Initialize scroll-to-top

    // Old header functions - keep console warnings if their elements are truly gone
    // initMobileNav();
    // initScrollSpy();
});

/**
 * Initializes smooth scrolling for anchor links.
 */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const hrefAttribute = this.getAttribute('href');
            if (hrefAttribute && hrefAttribute.length > 1 && hrefAttribute.startsWith('#')) {
                const targetId = hrefAttribute.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * Initializes the contact form handling on the main page.
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('contactFormStatus'); // Get status message element
    const submitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;


    if (contactForm && formStatus && submitButton) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const originalButtonText = submitButton.textContent;

            // Disable button and show sending state
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            formStatus.style.display = 'none'; // Hide previous status
            formStatus.className = 'status-message'; // Reset class

            console.log('Main Contact Form Submitted (Frontend):', Object.fromEntries(formData));

            // Simulate network request
            setTimeout(() => {
                formStatus.textContent = `Thank you for your message, ${name}! We'll be in touch. (Demo)`;
                formStatus.classList.add('success');
                formStatus.style.display = 'block';
                contactForm.reset();

                // Re-enable button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;

                // Optionally hide success message after a few seconds
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 5000);

            }, 1500); // Simulate 1.5 second delay
        });
    } else {
        console.warn('Main page contact form (id="contactForm"), status element (id="contactFormStatus"), or submit button not found.');
    }
}

/**
 * Initializes scroll-triggered animations for elements on the page.
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    if (!animatedElements.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observerInstance.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// --- NEW HEADER FUNCTIONALITY ---

/**
 * Initializes the home icon dropdown menu in the new header.
 */
function initHomeIconMenu() {
    const homeMenuButton = document.getElementById('homeMenuButton');
    const homeDropdownMenu = document.getElementById('homeDropdownMenu');

    if (homeMenuButton && homeDropdownMenu) {
        homeMenuButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const isActive = homeDropdownMenu.classList.toggle('active');
            homeMenuButton.setAttribute('aria-expanded', isActive.toString());
            homeMenuButton.classList.toggle('active', isActive);
        });

        document.addEventListener('click', (event) => {
            if (homeDropdownMenu.classList.contains('active')) {
                if (!homeMenuButton.contains(event.target) && !homeDropdownMenu.contains(event.target)) {
                    homeDropdownMenu.classList.remove('active');
                    homeMenuButton.setAttribute('aria-expanded', 'false');
                    homeMenuButton.classList.remove('active');
                }
            }
        });

        const dropdownItems = homeDropdownMenu.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                homeDropdownMenu.classList.remove('active');
                homeMenuButton.setAttribute('aria-expanded', 'false');
                homeMenuButton.classList.remove('active');
            });
        });

    } else {
        console.warn('New header home menu elements (homeMenuButton or homeDropdownMenu) not found.');
    }
}

/**
 * Initializes the Admin Login Modal functionality.
 */
function initAdminLoginModal() {
    const adminLoginButton = document.getElementById('adminLoginButton');
    const adminLoginModal = document.getElementById('adminLoginModal');
    const closeLoginModalButton = document.getElementById('closeLoginModal');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const loginStatusMessage = document.getElementById('loginStatusMessage'); // Changed from loginErrorMessage
    let focusedElementBeforeModal;

    function openAdminModal() {
        if (adminLoginModal) {
            focusedElementBeforeModal = document.activeElement;
            adminLoginModal.classList.add('active');
            const firstInput = adminLoginModal.querySelector('input[type="email"], input[type="password"], input[type="text"]');
            if (firstInput) {
                firstInput.focus();
            }
        }
    }

    function closeAdminModal() {
        if (adminLoginModal) {
            adminLoginModal.classList.remove('active');
            if (loginStatusMessage) {
                loginStatusMessage.style.display = 'none';
                loginStatusMessage.className = 'status-message'; // Reset class
            }
            if (adminLoginForm) adminLoginForm.reset();
            if (focusedElementBeforeModal) {
                focusedElementBeforeModal.focus();
            }
        }
    }

    if (adminLoginButton) {
        adminLoginButton.addEventListener('click', openAdminModal);
    }

    if (closeLoginModalButton) {
        closeLoginModalButton.addEventListener('click', closeAdminModal);
    }

    if (adminLoginModal) {
        adminLoginModal.addEventListener('click', (event) => {
            if (event.target === adminLoginModal) {
                closeAdminModal();
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && adminLoginModal && adminLoginModal.classList.contains('active')) {
            closeAdminModal();
        }
    });

    if (adminLoginForm && loginStatusMessage) {
        adminLoginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const loginButton = adminLoginForm.querySelector('button[type="submit"]');
            const originalButtonText = loginButton.textContent;
            const email = adminLoginForm.adminEmail.value;
            const password = adminLoginForm.adminPassword.value;

            loginButton.disabled = true;
            loginButton.textContent = 'Logging in...';
            loginStatusMessage.style.display = 'none';
            loginStatusMessage.className = 'status-message'; // Reset class

            setTimeout(() => {
                if (email === 'admin@elex.com' && password === 'password123') {
                    loginStatusMessage.textContent = 'Login successful! (Demo)';
                    loginStatusMessage.classList.add('success');
                    // Optionally close modal on success after a short delay
                    setTimeout(() => {
                        closeAdminModal();
                    }, 1500);
                } else {
                    loginStatusMessage.textContent = 'Invalid details. Please try again.';
                    loginStatusMessage.classList.add('error');
                }
                loginStatusMessage.style.display = 'block';
                loginButton.disabled = false;
                loginButton.textContent = originalButtonText;
            }, 1000);
        });
    }

    if (!adminLoginButton || !adminLoginModal || !closeLoginModalButton || !adminLoginForm || !loginStatusMessage) {
        console.warn('One or more Admin Login Modal elements not found.');
    }
}

/**
 * Initializes the Scroll-to-Top button functionality.
 */
function initScrollToTopButton() {
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) { // Show button after scrolling 300px
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    } else {
        console.warn('Scroll-to-top button (id="scrollToTopBtn") not found.');
    }
}
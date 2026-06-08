/**
 * Personal Profile Website Interaction Script
 * Author: Duong Huy Bao
 * Description: Logic for theme switching, navigation, animations, and contact form handling.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // Theme Toggle (Light / Dark Mode)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    const bodyElement = document.body;

    // Check for saved theme preference, otherwise use system preference (default dark)
    const savedTheme = localStorage.getItem('theme') || 'dark';
    bodyElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = bodyElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        bodyElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun'; // Show sun icon to switch to light mode
        } else {
            themeIcon.className = 'fas fa-moon'; // Show moon icon to switch to dark mode
        }
    }

    // ==========================================================================
    // Mobile Navigation Menu
    // ==========================================================================
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileNavToggle.addEventListener('click', () => {
        mobileNavToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });

    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNavToggle.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });

    // Close menu when clicking outside of navbar
    document.addEventListener('click', (event) => {
        const isClickInsideNav = navLinksContainer.contains(event.target) || mobileNavToggle.contains(event.target);
        if (!isClickInsideNav && navLinksContainer.classList.contains('active')) {
            mobileNavToggle.classList.remove('active');
            navLinksContainer.classList.remove('active');
        }
    });

    // ==========================================================================
    // Typewriter Effect
    // ==========================================================================
    const typewriterElement = document.getElementById('typewriter');
    const words = ["Backend Developer", "API Architect", "Database Optimizer", "System Engineer"];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Speed up when deleting
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing speed
        }

        // Handle word transitions
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 2000; // Wait before starting delete
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Wait briefly before typing next word
        }

        setTimeout(typeEffect, typingSpeed);
    }

    // Initialize typewriter if element exists
    if (typewriterElement) {
        setTimeout(typeEffect, 1000);
    }

    // ==========================================================================
    // Scroll Reveal & Active Nav Link Observer
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const sections = document.querySelectorAll('section');

    // Scroll reveal observer
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Active link highlighter on scroll
    const activeLinkObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: "-80px 0px -40% 0px" // Account for fixed header height
    });

    sections.forEach(section => {
        activeLinkObserver.observe(section);
    });

    // ==========================================================================
    // Contact Form Submission Handling
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (name && email && message) {
                // Here, you would normally send a fetch request to a server or email service
                console.log('Form Submitted successfully:', { name, email, message });
                
                // Show dynamic success notification
                showSuccessNotification(name);
                
                // Reset the form
                contactForm.reset();
            }
        });
    }

    function showSuccessNotification(senderName) {
        // Create custom notification popup
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.bottom = '30px';
        notification.style.right = '30px';
        notification.style.background = 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)';
        notification.style.color = '#ffffff';
        notification.style.padding = '16px 28px';
        notification.style.borderRadius = '8px';
        notification.style.boxShadow = '0 10px 30px rgba(99, 102, 241, 0.4)';
        notification.style.zIndex = '9999';
        notification.style.fontFamily = 'var(--font-heading)';
        notification.style.fontWeight = '600';
        notification.style.fontSize = '0.95rem';
        notification.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
        notification.style.transform = 'translateY(100px)';
        notification.style.opacity = '0';
        notification.style.display = 'flex';
        notification.style.alignItems = 'center';
        notification.style.gap = '10px';
        
        notification.innerHTML = `<i class="fas fa-check-circle"></i> Thank you, ${senderName}! Your message was sent successfully.`;
        
        document.body.appendChild(notification);
        
        // Trigger reflow & slide-in
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 100);

        // Hide and remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateY(100px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 400);
        }, 5000);
    }
});

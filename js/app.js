/**
 * Personal Profile Website Interaction Script v2.0
 * Author: Duong Huy Bao
 * Description: Theme switching, navigation, typewriter, scroll animations,
 *              card tilt effect, staggered reveals, and contact form.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // Theme Toggle (Light / Dark Mode)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    const bodyElement = document.body;

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
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    // ==========================================================================
    // Header Scroll Effect
    // ==========================================================================
    const mainHeader = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    }, { passive: true });

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

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNavToggle.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });

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
    const words = [
        "AI-powered platforms",
        "browser-based games",
        "NestJS backend systems",
        "real-time web apps",
        "full-stack solutions"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 90;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 400;
        }

        setTimeout(typeEffect, typingSpeed);
    }

    if (typewriterElement) {
        setTimeout(typeEffect, 800);
    }

    // ==========================================================================
    // Scroll Reveal with Staggered Animations
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const sections = document.querySelectorAll('section');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -60px 0px"
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
        threshold: 0.4,
        rootMargin: "-80px 0px -40% 0px"
    });

    sections.forEach(section => {
        activeLinkObserver.observe(section);
    });

    // ==========================================================================
    // Card Tilt Effect (3D perspective on mouse move)
    // ==========================================================================
    const tiltCards = document.querySelectorAll('.glass-panel');
    const TILT_MAX = 4; // Max degrees of tilt
    const TILT_SPEED = 300; // Transition speed in ms

    tiltCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = `transform 0.1s ease-out, border-color var(--transition-smooth), box-shadow var(--transition-smooth)`;
        });

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;

            const rotateX = (-mouseY / (rect.height / 2)) * TILT_MAX;
            const rotateY = (mouseX / (rect.width / 2)) * TILT_MAX;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = `transform ${TILT_SPEED}ms ease-out, border-color var(--transition-smooth), box-shadow var(--transition-smooth)`;
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    // ==========================================================================
    // Contact Form Submission Handling
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (name && email && message) {
                console.log('Form Submitted:', { name, email, message });
                showSuccessNotification(name);
                contactForm.reset();
            }
        });
    }

    function showSuccessNotification(senderName) {
        const notification = document.createElement('div');
        notification.className = 'toast-notification';
        notification.innerHTML = `<i class="fas fa-check-circle"></i> Thank you, ${senderName}! Your message was sent successfully.`;
        
        document.body.appendChild(notification);
        
        // Trigger slide-in
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                notification.classList.add('show');
            });
        });

        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }

    // ==========================================================================
    // Mouse-Following Spotlight
    // ==========================================================================
    const mouseLight = document.getElementById('mouse-light');
    let mouseLightActive = false;

    document.addEventListener('mousemove', (e) => {
        if (!mouseLightActive) {
            mouseLight.classList.add('active');
            mouseLightActive = true;
        }
        mouseLight.style.left = `${e.clientX}px`;
        mouseLight.style.top = `${e.clientY}px`;
    });

    document.addEventListener('mouseleave', () => {
        mouseLight.classList.remove('active');
        mouseLightActive = false;
    });

    // ==========================================================================
    // Canvas Node Network
    // ==========================================================================
    const canvas = document.getElementById('node-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let mouseX = -1000, mouseY = -1000;
        const CONNECT_DIST = 200;
        const MOUSE_RADIUS = 150;

        // Node categories with labels and colors
        const categories = [
            { label: 'AI', color: 'rgba(168, 85, 247, 0.6)' },
            { label: 'Backend', color: 'rgba(99, 102, 241, 0.6)' },
            { label: 'Cloud', color: 'rgba(6, 182, 212, 0.6)' },
            { label: 'Game', color: 'rgba(236, 72, 153, 0.6)' },
            { label: '', color: 'rgba(99, 102, 241, 0.3)' }
        ];

        class Node {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * (width || window.innerWidth);
                this.y = Math.random() * (height || window.innerHeight);
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.baseRadius = Math.random() * 2 + 1.5;
                this.radius = this.baseRadius;
                const cat = categories[Math.floor(Math.random() * categories.length)];
                this.label = cat.label;
                this.color = cat.color;
                this.glowPhase = Math.random() * Math.PI * 2;
                this.glowSpeed = 0.005 + Math.random() * 0.01;
            }

            update() {
                // Gentle ambient movement
                this.x += this.vx;
                this.y += this.vy;

                // Breathing glow
                this.glowPhase += this.glowSpeed;
                this.radius = this.baseRadius + Math.sin(this.glowPhase) * 0.5;

                // Mouse interaction — gentle push away
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < MOUSE_RADIUS && dist > 0) {
                    const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.8;
                    this.x += (dx / dist) * force;
                    this.y += (dy / dist) * force;
                }

                // Bounce off edges with padding
                if (this.x < 20) { this.x = 20; this.vx *= -1; }
                if (this.x > width - 20) { this.x = width - 20; this.vx *= -1; }
                if (this.y < 20) { this.y = 20; this.vy *= -1; }
                if (this.y > height - 20) { this.y = height - 20; this.vy *= -1; }
            }

            draw() {
                // Node glow
                const glowAlpha = 0.15 + Math.sin(this.glowPhase) * 0.08;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2);
                ctx.fillStyle = this.color.replace(/[\d.]+\)$/, `${glowAlpha})`);
                ctx.fill();

                // Node core
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();

                // Label
                if (this.label) {
                    ctx.font = '500 9px "Plus Jakarta Sans", sans-serif';
                    ctx.fillStyle = this.color.replace(/[\d.]+\)$/, '0.8)');
                    ctx.textAlign = 'center';
                    ctx.fillText(this.label, this.x, this.y - this.radius * 4 - 4);
                }
            }
        }

        let nodes = [];

        function initNodes() {
            const count = Math.min(Math.floor((width * height) / 50000), 30);
            nodes = Array.from({ length: Math.max(count, 12) }, () => new Node());
        }

        function drawConnections() {
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < CONNECT_DIST) {
                        const alpha = (1 - dist / CONNECT_DIST) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            drawConnections();
            nodes.forEach(node => {
                node.update();
                node.draw();
            });
            requestAnimationFrame(animate);
        }

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        // Track mouse for node interaction
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        document.addEventListener('mouseleave', () => {
            mouseX = -1000;
            mouseY = -1000;
        });

        // Click ripple on nodes
        document.addEventListener('click', (e) => {
            if (e.target.closest('a, button, input, textarea, select, form')) return;
            
            // Push nodes away from click point
            nodes.forEach(node => {
                const dx = node.x - e.clientX;
                const dy = node.y - e.clientY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 300 && dist > 0) {
                    const force = (300 - dist) / 300 * 3;
                    node.vx += (dx / dist) * force;
                    node.vy += (dy / dist) * force;
                    // Dampen velocity back to normal over time
                    setTimeout(() => {
                        node.vx *= 0.3;
                        node.vy *= 0.3;
                    }, 800);
                }
            });
        });

        window.addEventListener('resize', () => {
            resize();
            initNodes();
        });

        resize();
        initNodes();
        animate();
    }
});

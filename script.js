/* ===================================
   PORTFOLIO JAVASCRIPT
   Handles: navigation, scroll animations,
   skill bars, stat counters, contact form
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ---- Elements ----
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('back-to-top');
    const contactForm = document.getElementById('contact-form');
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const skillBars = document.querySelectorAll('.skill-progress');
    const statNumbers = document.querySelectorAll('.stat-number');

    // ---- Navbar scroll effect ----
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top visibility
        if (currentScroll > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        // Active nav link based on scroll position
        updateActiveNavLink();

        lastScroll = currentScroll;
    });

    // ---- Mobile nav toggle ----
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile nav on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ---- Active nav link on scroll ----
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ---- Back to top ----
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---- Intersection Observer for scroll animations ----
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation delay
                const delay = Array.from(animatedElements).indexOf(entry.target) % 6;
                entry.target.style.transitionDelay = `${delay * 0.08}s`;
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // ---- Skill bars animation ----
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = targetWidth + '%';
                }, 200);
                skillObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => skillObserver.observe(bar));

    // ---- Stat counter animation ----
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                animateCounter(el, target);
                statObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => statObserver.observe(num));

    function animateCounter(el, target) {
        let current = 0;
        const increment = target / 30;
        const duration = 1500;
        const stepTime = duration / 30;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current);
        }, stepTime);
    }

    // ---- Smooth scroll for all anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---- Contact form handling ----
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('submit-btn');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;

            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'form-success';
            successMsg.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully! I\'ll get back to you soon.';
            successMsg.style.cssText = `
                background: rgba(34, 197, 94, 0.1);
                border: 1px solid rgba(34, 197, 94, 0.3);
                color: #22c55e;
                padding: 1rem;
                border-radius: 0.75rem;
                margin-top: 1rem;
                font-size: 0.875rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                animation: fadeIn 0.3s ease;
            `;

            // Remove previous success message if exists
            const prevMsg = contactForm.querySelector('.form-success');
            if (prevMsg) prevMsg.remove();

            contactForm.appendChild(successMsg);
            contactForm.reset();

            // Remove success message after 5 seconds
            setTimeout(() => {
                successMsg.style.opacity = '0';
                successMsg.style.transform = 'translateY(-10px)';
                successMsg.style.transition = '0.3s ease';
                setTimeout(() => successMsg.remove(), 300);
            }, 5000);
        }, 1500);
    });

    // ---- Typing effect for hero subtitle ----
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        heroSubtitle.style.borderRight = '2px solid var(--accent)';

        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroSubtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 40);
            } else {
                // Remove cursor after typing is done
                setTimeout(() => {
                    heroSubtitle.style.borderRight = 'none';
                }, 1000);
            }
        }

        // Start typing after a delay
        setTimeout(typeWriter, 800);
    }

    // ---- Parallax effect for hero orbs ----
    window.addEventListener('mousemove', (e) => {
        const orbs = document.querySelectorAll('.hero-orb');
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        orbs.forEach((orb, i) => {
            const speed = (i + 1) * 15;
            orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });

    // ---- Initial call to set active nav ----
    updateActiveNavLink();

    // ---- Trigger initial animations for elements in view ----
    setTimeout(() => {
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('animated');
            }
        });
    }, 100);
});

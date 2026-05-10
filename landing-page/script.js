/* ============================================================
   NEXUS LANDING PAGE — script.js
   ============================================================ */

(function () {
    'use strict';

    /* --------------------------------------------------------
       Utility: DOM helpers
    -------------------------------------------------------- */
    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    /* --------------------------------------------------------
       Scroll Progress Indicator
    -------------------------------------------------------- */
    const progressBar = $('#scrollProgress');

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (progressBar) progressBar.style.width = progress + '%';
    }

    /* --------------------------------------------------------
       Navigation: Sticky + active state
    -------------------------------------------------------- */
    const header = $('#header');
    const navLinks = $$('.nav__link');
    const sections = $$('section[id]');

    function updateNav() {
        const scrollY = window.scrollY;

        // Sticky glass effect
        if (header) {
            header.classList.toggle('scrolled', scrollY > 20);
        }

        // Active link highlight based on scroll position
        let currentId = '';
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentId = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
        });
    }

    /* --------------------------------------------------------
       Mobile Navigation Toggle
    -------------------------------------------------------- */
    const navToggle = $('#navToggle');
    const navMenu = $('#navMenu');

    // Create overlay element for mobile nav
    const overlay = document.createElement('div');
    overlay.className = 'nav__overlay';
    document.body.appendChild(overlay);

    function openNav() {
        navMenu.classList.add('open');
        overlay.classList.add('open');
        navToggle.innerHTML = '<i class="bi bi-x-lg"></i>';
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        navMenu.classList.remove('open');
        overlay.classList.remove('open');
        navToggle.innerHTML = '<i class="bi bi-list"></i>';
        document.body.style.overflow = '';
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.contains('open') ? closeNav() : openNav();
        });
    }

    overlay.addEventListener('click', closeNav);

    // Close nav when a link is clicked
    $$('.nav__link, .nav__cta-mobile').forEach((link) => {
        link.addEventListener('click', closeNav);
    });

    /* --------------------------------------------------------
       Scroll To Top Button
    -------------------------------------------------------- */
    const scrollTopBtn = $('#scrollTop');

    function updateScrollTopBtn() {
        if (scrollTopBtn) {
            scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
        }
    }

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* --------------------------------------------------------
       Combined Scroll Handler (single rAF-throttled listener)
    -------------------------------------------------------- */
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateScrollProgress();
                updateNav();
                updateScrollTopBtn();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Run once on load
    updateScrollProgress();
    updateNav();

    /* --------------------------------------------------------
       Intersection Observer — Reveal Animations
    -------------------------------------------------------- */
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, parseInt(delay, 10));
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    $$('.reveal-up, .reveal-left, .reveal-right').forEach((el) => {
        revealObserver.observe(el);
    });

    /* --------------------------------------------------------
       Stats Counter Animation
    -------------------------------------------------------- */
    const statNumbers = $$('.stat-card__number[data-target]');

    function animateCounter(el) {
        const target = parseFloat(el.dataset.target);
        const duration = 2000; // ms
        const start = performance.now();

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out quad
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * target;

            // Format nicely
            el.textContent = target >= 1000
                ? Math.floor(current).toLocaleString()
                : current.toFixed(target < 10 ? 1 : 0);

            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target >= 1000 ? target.toLocaleString() : target;
        }

        requestAnimationFrame(step);
    }

    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    statNumbers.forEach((el) => counterObserver.observe(el));

    /* --------------------------------------------------------
       Hero Particle System
    -------------------------------------------------------- */
    const particleContainer = $('#heroParticles');

    function createParticles() {
        if (!particleContainer) return;
        const count = 24;
        const colors = [
            'var(--clr-primary-light)',
            'var(--clr-accent)',
            'rgba(255,255,255,0.6)'
        ];

        for (let i = 0; i < count; i++) {
            const p = document.createElement('span');
            p.className = 'particle';
            p.style.setProperty('--dur', (Math.random() * 6 + 4) + 's');
            p.style.setProperty('--delay', (Math.random() * 8) + 's');
            p.style.left = Math.random() * 100 + '%';
            p.style.top = Math.random() * 100 + '%';
            p.style.background = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 4 + 2;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            particleContainer.appendChild(p);
        }
    }

    createParticles();

    /* --------------------------------------------------------
       Parallax Effect on Hero Blobs
    -------------------------------------------------------- */
    const blob1 = $('.hero__blob--1');
    const blob2 = $('.hero__blob--2');
    const heroSection = $('#home');

    function applyParallax() {
        if (!heroSection) return;
        const scrollY = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        if (scrollY > heroHeight) return; // only parallax within hero

        if (blob1) blob1.style.transform = `translate(${scrollY * 0.06}px, ${scrollY * 0.08}px)`;
        if (blob2) blob2.style.transform = `translate(${-scrollY * 0.04}px, ${scrollY * 0.05}px)`;
    }

    window.addEventListener('scroll', applyParallax, { passive: true });

    /* --------------------------------------------------------
       Smooth Active Link Hover (optional visual flourish)
    -------------------------------------------------------- */
    navLinks.forEach((link) => {
        link.addEventListener('mouseenter', function () {
            this.style.transition = 'color 0.2s ease';
        });
    });

    /* --------------------------------------------------------
       Feature Cards: Tilt Effect on Hover (subtle)
    -------------------------------------------------------- */
    $$('.feature-card, .testimonial-card').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s ease, border-color 0.35s, box-shadow 0.35s';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease, border-color 0.35s, box-shadow 0.35s';
        });
    });

    /* --------------------------------------------------------
       Newsletter Form — Submit Handler
    -------------------------------------------------------- */
    const newsletterForm = $('#newsletterForm');
    const newsletterSuccess = $('#newsletterSuccess');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = $('#newsletterEmail');
            if (!emailInput || !emailInput.value) return;

            // Simulate submission with loading state
            const submitBtn = newsletterForm.querySelector('[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = 'Subscribing… <i class="bi bi-hourglass-split"></i>';
                submitBtn.disabled = true;
            }

            setTimeout(() => {
                if (newsletterForm) newsletterForm.hidden = true;
                if (newsletterSuccess) newsletterSuccess.hidden = false;
            }, 1200);
        });
    }

    /* --------------------------------------------------------
       Footer Year
    -------------------------------------------------------- */
    const yearSpan = $('#footerYear');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    /* --------------------------------------------------------
       Smooth Scroll for Anchor Links
    -------------------------------------------------------- */
    $$('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const target = $(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 72;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* --------------------------------------------------------
       Bar chart animation re-trigger on hero visibility
    -------------------------------------------------------- */
    const chartBars = $$('.chart__bar');
    chartBars.forEach((bar, i) => {
        bar.style.animationDelay = (i * 0.1) + 's';
    });

})();

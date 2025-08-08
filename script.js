// BuildWise Landingpage JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Tabs (Bauträger/Dienstleister)
    initTabs();

    // Tilt-Effekt für Karten
    initTilt('.tilt-card');

    // Blueprint-Outline zeichnen, sobald sichtbar
    initDrawOnScroll();

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
        
        lastScrollTop = scrollTop;
    });

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form handling (contact)
    const contactForm = document.querySelector('section#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
    }

    // Beta form handling
    const betaForm = document.getElementById('beta-form');
    if (betaForm) {
        betaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = document.getElementById('beta-email');
            const email = (emailInput?.value || '').trim();
            const isValid = /.+@.+\..+/.test(email);
            if (isValid) {
                showNotification('Danke! Wir melden uns in Kürze mit deinem Beta-Zugang.', 'success');
                trackEvent('beta_signup', { email });
                betaForm.reset();
            } else {
                showNotification('Bitte gib eine gültige E-Mail-Adresse ein.', 'error');
            }
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .pricing-card');
    animateElements.forEach(el => observer.observe(el));

    // Counter animation
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };

        // Start counter when element is visible
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    counterObserver.unobserve(entry.target);
                }
            });
        });

        counterObserver.observe(counter);
    });

    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.3;
            heroSection.style.transform = `translateY(${rate}px)`;
        });
    }

    // Tooltip functionality
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            showTooltip(this);
        });
        
        element.addEventListener('mouseleave', function() {
            hideTooltip();
        });
    });

    // Pricing toggle (if needed)
    const pricingToggle = document.querySelector('.pricing-toggle');
    if (pricingToggle) {
        pricingToggle.addEventListener('change', function() {
            togglePricingDisplay(this.checked);
        });
    }

    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewsletterSubscription(this);
        });
    }

    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Search functionality (if needed)
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            handleSearch(this.value);
        });
    }

    // Cookie consent
    if (!localStorage.getItem('cookieConsent')) {
        showCookieConsent();
    }
});

// Tabs logic
function initTabs() {
    const container = document.getElementById('audience-tabs');
    if (!container) return;
    const buttons = container.querySelectorAll('.tab-btn');
    const panels = [
        document.getElementById('tab-bautraeger'),
        document.getElementById('tab-dienstleister')
    ];
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tab = btn.getAttribute('data-tab');
            panels.forEach(p => {
                const isActive = p.id === `tab-${tab}`;
                p.classList.toggle('hidden', !isActive);
                p.setAttribute('aria-hidden', String(!isActive));
            });
        });
    });
}

// Tilt effect for cards
function initTilt(selector) {
    const cards = document.querySelectorAll(selector);
    const strength = 8;
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rx = ((y - rect.height / 2) / rect.height) * -strength;
            const ry = ((x - rect.width / 2) / rect.width) * strength;
            card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg)';
        });
    });
}

// Draw-on-scroll for blueprint SVG
function initDrawOnScroll() {
    const svg = document.querySelector('.draw-on-scroll');
    if (!svg) return;
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                svg.classList.add('is-drawn');
                obs.unobserve(svg);
            }
        });
    }, { threshold: 0.2 });
    obs.observe(svg);
}

// Phasen-Expander (horizontal)
(function initPhases(){
    const track = document.querySelector('.phases-track');
    const panels = document.querySelectorAll('.phase-panel');
    const progress = document.querySelector('.phases-progress');
    if (!track || panels.length === 0) return;
    track.addEventListener('click', (e) => {
        const btn = e.target.closest('.phase-card');
        if (!btn) return;
        const id = btn.getAttribute('data-phase');
        track.querySelectorAll('.phase-card').forEach(b => {
            b.classList.toggle('is-active', b === btn);
            b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
        });
        panels.forEach(p => {
            const active = p.id === `phase-${id}`;
            p.classList.toggle('hidden', !active);
            p.setAttribute('aria-hidden', String(!active));
        });
        if (progress) {
            const pct = { '1': 25, '2': 50, '3': 75, '4': 100 }[id] || 25;
            progress.style.width = pct + '%';
        }
        // sanft zum aktiven Tab scrollen
        btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
})();

// FAQ Accordion (ein Panel offen)
(function initAccordion(){
    const root = document.querySelector('[data-accordion]');
    if (!root) return;
    root.addEventListener('click', (e) => {
        const header = e.target.closest('.acc-header');
        if (!header) return;
        const expanded = header.getAttribute('aria-expanded') === 'true';
        // alle schließen
        root.querySelectorAll('.acc-header').forEach(h => h.setAttribute('aria-expanded','false'));
        root.querySelectorAll('.acc-panel').forEach(p => p.hidden = true);
        // angeklicktes öffnen, wenn vorher zu
        if (!expanded) {
            header.setAttribute('aria-expanded','true');
            const panel = header.nextElementSibling;
            if (panel && panel.classList.contains('acc-panel')) panel.hidden = false;
        }
    });
})();

// Form submission handler
function handleFormSubmission(form) {
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    // Show loading state
    submitButton.textContent = 'Wird gesendet...';
    submitButton.disabled = true;

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showNotification('Nachricht erfolgreich gesendet!', 'success');
        form.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// Newsletter subscription handler
function handleNewsletterSubscription(form) {
    const email = form.querySelector('input[type="email"]').value;
    
    if (email) {
        showNotification('Newsletter-Anmeldung erfolgreich!', 'success');
        form.reset();
    } else {
        showNotification('Bitte geben Sie eine gültige E-Mail-Adresse ein.', 'error');
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="flex items-center">
            <span class="mr-2">${getNotificationIcon(type)}</span>
            <span>${message}</span>
            <button class="ml-auto text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `;

    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Get notification icon
function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return '<svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>';
        case 'error':
            return '<svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>';
        default:
            return '<svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>';
    }
}

// Tooltip functions
function showTooltip(element) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-popup';
    tooltip.textContent = element.getAttribute('data-tooltip');
    tooltip.style.cssText = `
        position: absolute;
        background: #1f2937;
        color: white;
        padding: 0.5rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s;
    `;

    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    
    setTimeout(() => {
        tooltip.style.opacity = '1';
    }, 10);
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip-popup');
    if (tooltip) {
        tooltip.style.opacity = '0';
        setTimeout(() => {
            tooltip.remove();
        }, 300);
    }
}

// Pricing toggle function
function togglePricingDisplay(isAnnual) {
    const monthlyPrices = document.querySelectorAll('.price-monthly');
    const annualPrices = document.querySelectorAll('.price-annual');
    
    if (isAnnual) {
        monthlyPrices.forEach(el => el.style.display = 'none');
        annualPrices.forEach(el => el.style.display = 'block');
    } else {
        monthlyPrices.forEach(el => el.style.display = 'block');
        annualPrices.forEach(el => el.style.display = 'none');
    }
}

// Search functionality
function handleSearch(query) {
    // Implement search logic here
    console.log('Searching for:', query);
}

// Cookie consent
function showCookieConsent() {
    const consent = document.createElement('div');
    consent.className = 'fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 z-50';
    consent.innerHTML = `
        <div class="max-w-7xl mx-auto flex items-center justify-between">
            <div class="flex-1">
                <p class="text-sm">
                    Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern. 
                    <a href="#" class="underline">Mehr erfahren</a>
                </p>
            </div>
            <div class="flex space-x-4 ml-4">
                <button onclick="acceptCookies()" class="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-sm">
                    Akzeptieren
                </button>
                <button onclick="declineCookies()" class="border border-gray-600 hover:bg-gray-800 px-4 py-2 rounded text-sm">
                    Ablehnen
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(consent);
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    document.querySelector('.fixed.bottom-0').remove();
}

function declineCookies() {
    localStorage.setItem('cookieConsent', 'declined');
    document.querySelector('.fixed.bottom-0').remove();
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimization
const optimizedScrollHandler = throttle(function() {
    // Handle scroll events efficiently
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Service Worker registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Analytics tracking (example)
function trackEvent(eventName, properties = {}) {
    // Implement analytics tracking here
    console.log('Event tracked:', eventName, properties);
}

// Track page views
trackEvent('page_view', {
    page: window.location.pathname,
    title: document.title
});

// Track button clicks
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href="#beta"], a[href="#problem-solution"], button')) {
        trackEvent('button_click', {
            button_text: e.target.textContent.trim(),
            button_type: e.target.tagName.toLowerCase()
        });
    }
}); 
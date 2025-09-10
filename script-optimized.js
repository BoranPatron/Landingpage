// BuildWise Landingpage - Performance Optimiert
'use strict';

// === CORE INITIALIZATION === //
document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initMobileMenu();
    initTabs();
    initAccordion();
    initForms();
    initSmoothScrolling();
    initLazyLoading();
    initNotifications();
    
    // Performance-optimierte Animationen nur auf Desktop
    if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        initScrollAnimations();
    }
});

// === NAVBAR === //
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let ticking = false;
    
    function updateNavbar() {
        const scrolled = window.pageYOffset > 50;
        navbar.classList.toggle('navbar-scrolled', scrolled);
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }, { passive: true });
}

// === MOBILE MENU === //
function initMobileMenu() {
    const button = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');
    
    if (!button || !menu) return;
    
    button.addEventListener('click', function() {
        const isOpen = !menu.classList.contains('hidden');
        menu.classList.toggle('hidden', isOpen);
        document.body.style.overflow = isOpen ? '' : 'hidden';
    });
    
    // Close on link click
    menu.addEventListener('click', function(e) {
        if (e.target.tagName === 'A') {
            menu.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });
    
    // Close on escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !menu.classList.contains('hidden')) {
            menu.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });
}

// === TABS === //
function initTabs() {
    const tabContainers = document.querySelectorAll('[data-tabs]');
    
    tabContainers.forEach(container => {
        const buttons = container.querySelectorAll('.tab-btn');
        const panels = container.querySelectorAll('.tab-panel');
        
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                
                // Update buttons
                buttons.forEach(btn => {
                    btn.classList.remove('active');
                    btn.setAttribute('aria-selected', 'false');
                });
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                
                // Update panels
                panels.forEach(panel => {
                    panel.classList.remove('active');
                    panel.setAttribute('hidden', 'true');
                });
                
                const targetPanel = container.querySelector(`[data-panel="${targetTab}"]`);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                    targetPanel.removeAttribute('hidden');
                }
            });
        });
    });
}

// === ACCORDION === //
function initAccordion() {
    const accordions = document.querySelectorAll('[data-accordion]');
    
    accordions.forEach(accordion => {
        accordion.addEventListener('click', function(e) {
            const header = e.target.closest('.acc-header');
            if (!header) return;
            
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            const panel = header.nextElementSibling;
            
            // Close all panels in this accordion
            accordion.querySelectorAll('.acc-header').forEach(h => {
                h.setAttribute('aria-expanded', 'false');
            });
            accordion.querySelectorAll('.acc-panel').forEach(p => {
                p.hidden = true;
            });
            
            // Open clicked panel if it was closed
            if (!isExpanded && panel) {
                header.setAttribute('aria-expanded', 'true');
                panel.hidden = false;
            }
        });
    });
}

// === FORMS === //
function initForms() {
    // Beta form
    const betaForm = document.getElementById('beta-form');
    if (betaForm) {
        betaForm.addEventListener('submit', handleBetaSubmission);
    }
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmission);
    }
}

async function handleBetaSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const emailInput = form.querySelector('#beta-email');
    const submitBtn = form.querySelector('button[type="submit"]');
    const email = emailInput?.value?.trim();
    
    // Validation
    if (!email || !isValidEmail(email)) {
        showNotification('Bitte gib eine gültige E-Mail-Adresse ein.', 'error');
        return;
    }
    
    // Loading state
    const originalText = submitBtn?.textContent;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Wird gesendet...';
    }
    
    try {
        await subscribeToBeta(email);
        showNotification('Danke! Wir melden uns in Kürze mit deinem Beta-Zugang.', 'success');
        form.reset();
        
        // Redirect to thanks page
        setTimeout(() => {
            window.location.href = '/thanks.html';
        }, 1500);
        
    } catch (error) {
        console.error('Beta subscription failed:', error);
        showNotification('Anmeldung fehlgeschlagen. Bitte versuche es später erneut.', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText || 'Beta-Zugang sichern!';
        }
    }
}

function handleContactSubmission(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    
    // Basic validation
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const message = formData.get('message')?.trim();
    
    if (!name || !email || !message || !isValidEmail(email)) {
        showNotification('Bitte fülle alle Felder korrekt aus.', 'error');
        return;
    }
    
    // Loading state
    const originalText = submitBtn?.textContent;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Wird gesendet...';
    }
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showNotification('Nachricht erfolgreich gesendet!', 'success');
        form.reset();
        
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText || 'Nachricht senden';
        }
    }, 2000);
}

// === BETA SUBSCRIPTION === //
async function subscribeToBeta(email) {
    const apiBase = window.BUILDWISE_API_BASE || '';
    
    try {
        const response = await fetch(`${apiBase}/beta-subscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        if (data.status !== 'ok') {
            throw new Error(data.message || 'Subscription failed');
        }
        
        return data;
        
    } catch (error) {
        // Fallback error message
        throw new Error('Anmeldung derzeit nicht möglich. Bitte später erneut versuchen.');
    }
}

// === SMOOTH SCROLLING === //
function initSmoothScrolling() {
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;
        
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
}

// === LAZY LOADING === //
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            img.classList.add('lazy');
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// === SCROLL ANIMATIONS === //
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    if ('IntersectionObserver' in window && animatedElements.length > 0) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => observer.observe(el));
    }
}

// === NOTIFICATIONS === //
function initNotifications() {
    // Create notification container if it doesn't exist
    if (!document.getElementById('notification-container')) {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 1rem;
            right: 1rem;
            z-index: 1000;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }
}

function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.pointerEvents = 'auto';
    
    const icon = getNotificationIcon(type);
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            ${icon}
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="margin-left: auto; background: none; border: none; color: inherit; cursor: pointer; opacity: 0.7;">
                ✕
            </button>
        </div>
    `;
    
    container.appendChild(notification);
    
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

function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

// === UTILITIES === //
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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

// === ANALYTICS === //
function trackEvent(eventName, properties = {}) {
    // Implement analytics tracking here
    console.log('Event tracked:', eventName, properties);
}

// Track page view
trackEvent('page_view', {
    page: window.location.pathname,
    title: document.title
});

// Track button clicks
document.addEventListener('click', function(e) {
    const button = e.target.closest('button, a[href="#beta"], a[href="#contact"]');
    if (button) {
        trackEvent('button_click', {
            button_text: button.textContent?.trim(),
            button_type: button.tagName.toLowerCase()
        });
    }
});

// === SERVICE WORKER === //
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}

// === PERFORMANCE MONITORING === //
window.addEventListener('load', function() {
    // Log performance metrics
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Page load time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
    }
});

// === ERROR HANDLING === //
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You could send this to an error tracking service
});

// === RESIZE HANDLER === //
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Handle responsive changes
        const isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('mobile', isMobile);
    }, 250);
});

// Initial mobile class
document.body.classList.toggle('mobile', window.innerWidth <= 768);

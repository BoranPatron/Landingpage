// BuildWise Landing Page - Simplified JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // Initialize AOS (Animate On Scroll)
    // ============================================
    
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 600,
            easing: 'ease-out',
            once: true,
            offset: 100
        });
    }
    
    // ============================================
    // Hero Rotating Text Animation
    // ============================================
    
    const heroRotatingItems = document.querySelectorAll('.hero-rotating-item');
    let currentTitleIndex = 0;
    let rotationTimeout = null;
    
    if (heroRotatingItems.length > 0) {
        const titles = Array.from(heroRotatingItems);
        
        // Initialize: hide all items except first
        titles.forEach((item, index) => {
            if (index === 0) {
                item.classList.add('hero-rotating-active');
            } else {
                item.classList.add('hero-rotating-hidden');
            }
        });
        
        // Function to rotate titles
        function rotateTitle() {
            const prevIndex = currentTitleIndex;
            currentTitleIndex = (currentTitleIndex + 1) % titles.length;
            
            const prevItem = titles[prevIndex];
            const nextItem = titles[currentTitleIndex];
            
            // Remove active class from previous
            prevItem.classList.remove('hero-rotating-active');
            prevItem.classList.add('hero-rotating-exit');
            
            // Set up next item
            nextItem.classList.remove('hero-rotating-hidden');
            nextItem.classList.add('hero-rotating-enter');
            
            // After transition, clean up classes
            setTimeout(() => {
                prevItem.classList.remove('hero-rotating-exit');
                prevItem.classList.add('hero-rotating-hidden');
                
                nextItem.classList.remove('hero-rotating-enter');
                nextItem.classList.add('hero-rotating-active');
            }, 300);
            
            // Schedule next rotation
            rotationTimeout = setTimeout(rotateTitle, 2000);
        }
        
        // Start rotation after initial delay
        rotationTimeout = setTimeout(rotateTitle, 2000);
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', function() {
            if (rotationTimeout) {
                clearTimeout(rotationTimeout);
            }
        });
    }
    
    // ============================================
    // Smooth Scrolling for Anchor Links
    // ============================================
    
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ============================================
    // FAQ Accordion
    // ============================================
    
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const answer = this.nextElementSibling;
            
            // Close all other FAQs
            faqQuestions.forEach(q => {
                q.setAttribute('aria-expanded', 'false');
                const ans = q.nextElementSibling;
                if (ans) ans.hidden = true;
            });
            
            // Toggle current FAQ
            this.setAttribute('aria-expanded', String(!isExpanded));
            if (answer) answer.hidden = isExpanded;
        });
    });
    
    // ============================================
    // Beta Form Submission
    // ============================================
    
    const betaForm = document.getElementById('beta-form');
    if (betaForm) {
        betaForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('beta-email');
            const emailError = document.getElementById('beta-email-error');
            const submitBtn = betaForm.querySelector('button[type="submit"]');
            
            const email = (emailInput?.value || '').trim();
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            
            // Reset errors
            if (emailError) {
                emailError.hidden = true;
                emailError.textContent = '';
            }
            emailInput?.setAttribute('aria-invalid', 'false');
            
            if (!isValid) {
                if (emailError) {
                    emailError.hidden = false;
                    emailError.textContent = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
                }
                emailInput?.setAttribute('aria-invalid', 'true');
                return;
            }
            
            // Disable button and show loading state
            const originalText = submitBtn?.textContent;
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Wird gesendet...';
            }
            
            try {
                await subscribeToBeta(email);
                showNotification('Erfolgreich angemeldet! Wir melden uns in Kürze.', 'success');
                betaForm.reset();
            } catch (err) {
                console.error('Beta-Anmeldung fehlgeschlagen:', err);
                const msg = (err && err.message) ? err.message : 'Die Anmeldung ist fehlgeschlagen. Bitte versuchen Sie es später erneut.';
                showNotification(msg, 'error');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText || 'Kostenlos starten';
                }
            }
        });
    }
    
    // ============================================
    // Beta Subscribe Function
    // ============================================
    
    async function subscribeToBeta(email) {
        const apiBase = window.BUILDWISE_CONFIG?.API_BASE || '';
        const response = await fetch(`${apiBase}/beta-subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        if (!response.ok) {
            throw new Error('Server-Fehler. Bitte später erneut versuchen.');
        }
        
        const data = await response.json();
        if (data.status !== 'ok') {
            throw new Error('Anmeldung fehlgeschlagen.');
        }
        
        return data;
    }
    
    // ============================================
    // Notification System
    // ============================================
    
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelectorAll('.notification-toast');
        existing.forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification-toast notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 1rem;
            right: 1rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `;
        
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
});

// ============================================
// Utility Functions (Global)
// ============================================

// Track events for analytics
function trackEvent(eventName, properties = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    console.log('Event tracked:', eventName, properties);
}

// Export for potential external use
window.BuildWise = {
    trackEvent,
    subscribeToBeta: async function(email) {
        // Implementation can be expanded
    }
};

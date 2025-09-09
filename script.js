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
    
    // Pricing Tabs
    initPricingTabs();

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

    // Beta form handling (Brevo Integration)
    const betaForm = document.getElementById('beta-form');
    if (betaForm) {
        betaForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const emailInput = document.getElementById('beta-email');
            const emailError = document.getElementById('beta-email-error');
            const statusLive = document.getElementById('beta-status');
            const submitBtn = betaForm.querySelector('button[type="submit"]');
            const email = (emailInput?.value || '').trim();
            const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            // Reset errors
            if (emailError) { emailError.hidden = true; emailError.textContent = ''; }
            emailInput?.setAttribute('aria-invalid', 'false');

            if (!isValid) {
                if (emailError) { emailError.hidden = false; emailError.textContent = 'Bitte gib eine gültige E-Mail-Adresse ein.'; }
                emailInput?.setAttribute('aria-invalid', 'true');
                showNotification('Bitte gib eine gültige E-Mail-Adresse ein.', 'error');
                return;
            }

            const originalLabel = submitBtn?.innerHTML;
            if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '<span>Wird gesendet...</span>'; }
            statusLive && (statusLive.textContent = 'Sende Anmeldung an Brevo...');

            try {
                await subscribeToBeta(email);
                showNotification('Danke! Wir melden uns in Kürze mit deinem Beta-Zugang.', 'success');
                statusLive && (statusLive.textContent = 'Erfolgreich angemeldet.');
                trackEvent('beta_signup', { email });
                betaForm.reset();

                // Weiterleitung zur Countdown-Seite
                try { window.location.href = '/thanks.html'; } catch(_) {}
            } catch (err) {
                console.error('Brevo Beta-Anmeldung fehlgeschlagen:', err);
                const msg = (err && err.message) ? err.message : 'Die Anmeldung ist fehlgeschlagen. Bitte versuche es später erneut.';
                showNotification(msg, 'error');
                statusLive && (statusLive.textContent = 'Anmeldung fehlgeschlagen.');
            } finally {
                if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalLabel || '<span>Beta-Zugang sichern!</span>'; }
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

    // Demo functionality
    initDemo();

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

    // Process section observer (sticky stepper sync)
    (function initProcess(){
      const items = document.querySelectorAll('.process .process-item');
      const nav = document.querySelectorAll('.process .process-nav a');
      if (!items.length || !nav.length) return;
      const map = new Map();
      items.forEach((it, idx) => { map.set(it.id, nav[idx]); });
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            items.forEach(i => i.classList.remove('is-inview'));
            e.target.classList.add('is-inview');
            nav.forEach(a => a.classList.remove('is-active'));
            const a = map.get(e.target.id);
            if (a) a.classList.add('is-active');
          }
        });
      }, { rootMargin: '-40% 0px -40% 0px', threshold: 0.01 });
      items.forEach(i => obs.observe(i));

      // Smooth nav
      nav.forEach(a => a.addEventListener('click', (ev) => {
        ev.preventDefault();
        const id = a.getAttribute('href');
        const el = document.querySelector(id);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }));
    })();

    // Reveal workflow steps
    (function initWorkflowReveal(){
      const steps = document.querySelectorAll('.wf-step');
      if (!steps.length) return;
      const obs = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{ if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); } });
      }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
      steps.forEach(s=>obs.observe(s));
    })();

    // Mobile carousel dots sync
    (function initWFCarousel(){
      const track = document.querySelector('.wf-track');
      const dots = document.querySelectorAll('.wf-dots button');
      if (!track || !dots.length) return;
      const cards = track.querySelectorAll('.wf-card');
      const update = () => {
        const rect = track.getBoundingClientRect();
        let active = 0;
        cards.forEach((c, i) => {
          const r = c.getBoundingClientRect();
          const visible = Math.max(0, Math.min(r.right, rect.right) - Math.max(r.left, rect.left));
          if (visible > (rect.width * 0.5)) active = i;
        });
        dots.forEach((d, i) => d.classList.toggle('is-active', i === active));
      };
      track.addEventListener('scroll', () => { requestAnimationFrame(update); }, { passive: true });
      dots.forEach((d, i) => d.addEventListener('click', () => { cards[i].scrollIntoView({ behavior: 'smooth', inline: 'start' }); }));
      update();
    })();

    // Bubble grid interaction
    (function initBubbles(){
      const bubbles = document.querySelectorAll('.bw-bubble');
      if (!bubbles.length) return;
      bubbles.forEach((b, i) => {
        const dur = (8 + Math.random() * 5).toFixed(1) + 's'; // etwas schneller
        b.style.setProperty('--dur', dur);
        b.style.animationDelay = (-Math.random() * 8).toFixed(1) + 's';
        const d = b.getAttribute('data-desc') || '';
        const desc = b.querySelector('.bw-desc');
        if (desc) desc.textContent = d;
      });
      // Hover-only Reveal; Keyboard-Nutzer sehen weiterhin Label (kein Toggle nötig)
      // Mobile/Touch: Tap-to-Reveal
      const isTouch = matchMedia('(hover: none)').matches || 'ontouchstart' in window;
      if (isTouch) {
        const sheet = document.getElementById('bwSheet');
        const sheetTitle = document.getElementById('bwSheetTitle');
        const sheetText = document.getElementById('bwSheetText');
        const sheetBackdrop = document.getElementById('bwSheetBackdrop');
        const sheetClose = document.getElementById('bwSheetClose');

        function openSheet(title, text){
          sheetTitle.textContent = title;
          sheetText.textContent = text;
          sheet.hidden = false; sheetBackdrop.hidden = false;
          requestAnimationFrame(()=>{ sheet.classList.add('is-open'); sheetBackdrop.classList.add('is-open'); });
        }
        function closeSheet(){
          sheet.classList.remove('is-open'); sheetBackdrop.classList.remove('is-open');
          setTimeout(()=>{ sheet.hidden = true; sheetBackdrop.hidden = true; }, 250);
        }
        sheetBackdrop?.addEventListener('click', closeSheet);
        sheetClose?.addEventListener('click', closeSheet);
        document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') closeSheet(); });

        bubbles.forEach(b => {
          b.addEventListener('click', (e) => {
            e.preventDefault();
            const title = b.getAttribute('data-title') || b.querySelector('.bw-label')?.textContent?.trim() || '';
            const text = b.getAttribute('data-desc') || '';
            openSheet(title, text);
          });
        });
      }
    })();

    // Floating bubbles
    (function initFloatingBubbles(){
      const containers = document.querySelectorAll('.bw-floating');
      if (!containers.length) return;
      containers.forEach(container => {
        const rect = () => container.getBoundingClientRect();
        const bubbles = container.querySelectorAll('.bw-bubble');
        const place = () => {
          const r = rect();
          const cols = Math.max(2, Math.floor(r.width / 260));
          const rows = Math.max(2, Math.ceil(bubbles.length / cols));
          const cellW = r.width / cols;
          const cellH = Math.max(200, r.height / rows);
          bubbles.forEach((b, i) => {
            const c = i % cols; const row = Math.floor(i / cols);
            let x = c * cellW + cellW/2 + (Math.random()*50 - 25);
            let y = row * cellH + cellH/2 + (Math.random()*50 - 25);
            x = Math.max(80, Math.min(r.width - 80, x));
            y = Math.max(80, Math.min(r.height - 80, y));
            b.style.setProperty('--x', `${x}px`);
            b.style.setProperty('--y', `${y}px`);
            const dur = (7 + Math.random() * 5).toFixed(1) + 's';
            b.style.setProperty('--dur', dur);
            b.style.animationDelay = (-Math.random() * 8).toFixed(1) + 's';
          });
        };
        place();
        let to;
        window.addEventListener('resize', () => { clearTimeout(to); to = setTimeout(place, 150); });
      });
    })();

    // Simple 2D physics for feature bubbles
    (function initBubblePhysics(){
      const containers = document.querySelectorAll('.bw-physics');
      if (!containers.length) return;
      containers.forEach(container => {
        const bubbles = Array.from(container.querySelectorAll('.bw-bubble'));
        if (!bubbles.length) return;
        const state = bubbles.map((el, i) => ({ el, x: 0, y: 0, vx: 0, vy: 0, r: 0, angle: Math.random()*Math.PI*2, freq: 0.4 + Math.random()*0.3, speed: 8 + Math.random()*6 }));

        function positionEl(s){ s.el.style.setProperty('--x', `${s.x}px`); s.el.style.setProperty('--y', `${s.y}px`); }

        function layout() {
          const rect = container.getBoundingClientRect();
          const cols = Math.max(2, Math.floor(rect.width / 260));
          const rows = Math.max(2, Math.ceil(bubbles.length / cols));
          const cellW = rect.width / cols;
          const cellH = Math.max(200, rect.height / rows);
          state.forEach((s, i) => {
            const b = s.el; const c = i % cols; const row = Math.floor(i / cols);
            const w = b.offsetWidth || 200; const h = b.offsetHeight || 200;
            s.r = Math.max(w, h) / 2;
            s.x = c * cellW + cellW / 2 + (Math.random()*40 - 20);
            s.y = row * cellH + cellH / 2 + (Math.random()*40 - 20);
            s.vx = (Math.random()*2 - 1) * 10;
            s.vy = (Math.random()*2 - 1) * 10;
            positionEl(s);
          });
        }

        function step(dtMs){
          const rect = container.getBoundingClientRect();
          const minX = -60, minY = -60, maxX = rect.width + 60, maxY = rect.height + 60;
          const dt = Math.max(0.001, dtMs / 1000);
          state.forEach(s => {
            s.angle += s.freq * dt;
            const drive = s.speed;
            s.vx += Math.cos(s.angle) * drive * dt;
            s.vy += Math.sin(s.angle) * drive * dt;
          });
          for (let i = 0; i < state.length; i++) {
            for (let j = i+1; j < state.length; j++) {
              const a = state[i], b = state[j];
              const dx = b.x - a.x, dy = b.y - a.y; const dist = Math.hypot(dx, dy) || 0.0001;
              const nx = dx / dist, ny = dy / dist;
              const target = a.r + b.r - 16;
              const softRange = target + 24;
              if (dist < softRange) {
                const k = 60;
                const force = (softRange - dist) / softRange * k;
                a.vx -= nx * force * dt; a.vy -= ny * force * dt;
                b.vx += nx * force * dt; b.vy += ny * force * dt;
              }
              if (dist < target) {
                const overlap = (target - dist) * 0.5;
                a.x -= nx * overlap; a.y -= ny * overlap;
                b.x += nx * overlap; b.y += ny * overlap;
              }
            }
          }
          state.forEach(s => {
            const kWall = 90;
            if (s.x < minX) s.vx += (minX - s.x) * kWall * dt;
            if (s.x > maxX) s.vx -= (s.x - maxX) * kWall * dt;
            if (s.y < minY) s.vy += (minY - s.y) * kWall * dt;
            if (s.y > maxY) s.vy -= (s.y - maxY) * kWall * dt;
          });
          state.forEach(s => {
            const maxV = 48;
            s.vx *= 0.985; s.vy *= 0.985;
            const v = Math.hypot(s.vx, s.vy);
            if (v > maxV) { const scale = maxV / v; s.vx *= scale; s.vy *= scale; }
          });
          state.forEach(s => { s.x += s.vx * dt; s.y += s.vy * dt; positionEl(s); });
        }

        let last = performance.now();
        function loop(now){
          const dt = Math.min(40, now - last); last = now;
          step(dt);
          requestAnimationFrame(loop);
        }
        layout();
        requestAnimationFrame(loop);
        window.addEventListener('resize', () => { layout(); });
      });
    })();
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
    const section = document.querySelector('#phases');
    const track = document.querySelector('.phases-track');
    const panels = document.querySelectorAll('.phase-panel');
    const progress = document.querySelector('.phases-progress');
    if (!track) return;

    const setActive = (id) => {
        track.querySelectorAll('.phase-card').forEach(b => {
            const active = b.getAttribute('data-phase') === id;
            b.classList.toggle('is-active', active);
            b.setAttribute('aria-selected', active ? 'true' : 'false');
            b.setAttribute('aria-expanded', active ? 'true' : 'false');
        });
        if (progress) {
            const pct = { '1': 25, '2': 50, '3': 75, '4': 100 }[id] || 25;
            progress.style.width = pct + '%';
        }
    };

    // Wenn alte Panels existieren, ignorieren; wir nutzen Beschreibungen in Cards

    let autoplayTimer = null;
    let current = '1';
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const usingCssAnimation = window.matchMedia('(min-width: 1024px)').matches;

    const startAutoplay = () => {
        if (autoplayTimer || prefersReduced || usingCssAnimation) return;
        autoplayTimer = setInterval(() => {
            const next = ({ '1': '2', '2': '3', '3': '4', '4': '1' })[current] || '2';
            current = next;
            setActive(current);
            const btn = track.querySelector(`.phase-card[data-phase="${current}"]`);
            if (btn) btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }, 4000);
    };
    const stopAutoplay = () => { clearInterval(autoplayTimer); autoplayTimer = null; };

    // Initial
    setActive(current);
    if (section?.dataset.auto === 'true') startAutoplay();

    ['click','touchstart','mouseenter'].forEach(evt => {
        track.addEventListener(evt, () => { current = document.querySelector('.phase-card.is-active')?.getAttribute('data-phase') || current; stopAutoplay(); }, { passive: true });
    });

    const visObs = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{
            if (e.isIntersecting && section?.dataset.auto === 'true') startAutoplay(); else stopAutoplay();
        });
    }, { threshold: 0.25 });
    visObs.observe(section);

    track.addEventListener('click', (e) => {
        const btn = e.target.closest('.phase-card');
        if (!btn) return;
        const id = btn.getAttribute('data-phase');
        current = id;
        setActive(id);
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

// Beta-Subscribe via Backend-Proxy (verhindert CORS/Key-Exposure)
async function subscribeToBeta(email) {
    // 1) Preferred: Serverless/Proxy (Netlify)
    try {
        // Render API Service: absolute oder relative URL (bei gleicher Domain Subpfad verwenden)
        // Verwende ENV-Variable via Template-Injection falls vorhanden; sonst relative Route
        const apiBase = window.BUILDWISE_API_BASE || '';
        let resp = await fetch(`${apiBase}/beta-subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ email })
        });
        if (resp.ok) {
            const ct = resp.headers.get('content-type') || '';
            // Schütze vor statischen 200-HTML Antworten
            if (!ct.includes('application/json')) {
                throw new Error('Ungültige Server-Antwort (kein JSON). Prüfe API-URL in config.js');
            }
            const data = await resp.json().catch(() => null);
            if (!data || data.status !== 'ok') {
                throw new Error('Anmeldung fehlgeschlagen (unerwartete Antwort).');
            }
            return;
        }
        // Wenn 404/ECONNREFUSED o.ä., probiere Direktaufruf
    } catch (e) {
        // Ignoriere und versuche Direktaufruf
    }

    // 2) Kein direkter Brevo-Fallback mehr im Frontend (Geheimnis-Schutz)
    throw new Error('Anmeldung derzeit nicht möglich (Server nicht erreichbar oder falsche API-URL). Bitte später erneut versuchen.');
}

// Pricing Tab System
function initPricingTabs() {
    const tabs = document.querySelectorAll('.pricing-tab');
    const panels = document.querySelectorAll('.pricing-tab-panel');
    
    if (!tabs.length || !panels.length) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Update tabs
            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            // Update panels
            panels.forEach(panel => {
                panel.classList.remove('active');
                panel.setAttribute('hidden', 'true');
            });
            
            const targetPanel = document.getElementById(`tab-${targetTab}-pricing`);
            if (targetPanel) {
                targetPanel.classList.add('active');
                targetPanel.removeAttribute('hidden');
            }
        });
        
        // Keyboard navigation
        tab.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Demo System
function initDemo() {
    const demoButton = document.getElementById('demo-button');
    const demoModal = document.getElementById('demo-modal');
    const demoModalContent = document.getElementById('demo-modal-content');
    const demoClose = document.getElementById('demo-close');
    const demoBautraeger = document.getElementById('demo-bautraeger');
    const demoDienstleister = document.getElementById('demo-dienstleister');
    
    if (!demoButton || !demoModal) return;
    
    // Demo-Button Click
    demoButton.addEventListener('click', function() {
        showDemoModal();
        trackEvent('demo_modal_opened');
    });
    
    // Modal schließen
    demoClose?.addEventListener('click', closeDemoModal);
    demoModal.addEventListener('click', function(e) {
        if (e.target === demoModal) {
            closeDemoModal();
        }
    });
    
    // ESC-Taste zum Schließen
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && demoModal.style.display !== 'none') {
            closeDemoModal();
        }
    });
    
    // Rollenauswahl
    demoBautraeger?.addEventListener('click', function() {
        startDemo('bautraeger');
    });
    
    demoDienstleister?.addEventListener('click', function() {
        startDemo('dienstleister');
    });
    
    function showDemoModal() {
        demoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Animation
        requestAnimationFrame(() => {
            demoModalContent.style.transform = 'scale(1)';
            demoModalContent.style.opacity = '1';
        });
    }
    
    function closeDemoModal() {
        demoModalContent.style.transform = 'scale(0.95)';
        demoModalContent.style.opacity = '0';
        
        setTimeout(() => {
            demoModal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
    
    async function startDemo(role) {
        trackEvent('demo_started', { role });
        closeDemoModal();
        
        // Zeige Loading-Nachricht
        showNotification(`Demo wird gestartet für ${role === 'bautraeger' ? 'Bauträger' : 'Dienstleister'}...`, 'info');
        
        try {
            // Finde verfügbare Frontend-URL
            const frontendUrl = await findAvailableFrontendUrl(role);
            
            if (!frontendUrl) {
                throw new Error('Frontend nicht verfügbar');
            }
            
            // Öffne Demo in neuem Tab
            const demoWindow = window.open(frontendUrl, '_blank', 'noopener,noreferrer');
            
            if (demoWindow) {
                showNotification('Demo wurde in einem neuen Tab geöffnet', 'success');
                
                // Prüfe nach 3 Sekunden ob Tab noch offen ist
                setTimeout(() => {
                    if (demoWindow.closed) {
                        showNotification('Demo-Tab wurde geschlossen. Sie können die Demo jederzeit neu starten.', 'info');
                    }
                }, 3000);
            } else {
                // Fallback wenn Popup blockiert
                showFallbackOptions(frontendUrl, role);
            }
        } catch (error) {
            console.error('Demo start error:', error);
            showDemoErrorFallback(role);
        }
    }
    
    async function findAvailableFrontendUrl(role) {
        const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        if (isDevelopment) {
            return getDemoUrl(role, 'http://localhost:5173');
        }
        
        // Für Produktion: Verwende Frontend unter gleicher Domain als Unterverzeichnis
        const baseUrl = 'https://www.buildwise.ch/app';
        
        try {
            // Prüfe ob Frontend verfügbar ist (mit kurzer Timeout)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            await fetch(baseUrl, { 
                method: 'HEAD', 
                signal: controller.signal,
                mode: 'no-cors'
            });
            
            clearTimeout(timeoutId);
            return getDemoUrl(role, baseUrl);
            
        } catch (error) {
            // Frontend noch nicht deployed - zeige hilfreiche Nachricht
            console.warn('Frontend nicht unter /app gefunden:', error);
            return getDemoUrl(role, baseUrl); // Verwende URL trotzdem für Deployment-Hinweis
        }
    }
    
    function showFallbackOptions(frontendUrl, role) {
        const fallbackHtml = `
            <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); max-width: 400px; margin: 20px auto;">
                <h3 style="color: #333; margin-bottom: 15px;">Demo öffnen</h3>
                <p style="color: #666; margin-bottom: 20px;">Popup wurde blockiert. Wählen Sie eine Option:</p>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <a href="${frontendUrl}" target="_blank" style="background: #3b82f6; color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; text-align: center; font-weight: 500;">
                        🚀 Demo in neuem Tab öffnen
                    </a>
                    <button onclick="window.location.href='${frontendUrl}'" style="background: #6b7280; color: white; padding: 12px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: 500;">
                        📱 Demo in diesem Tab öffnen
                    </button>
                </div>
                <p style="color: #999; font-size: 12px; margin-top: 15px; text-align: center;">
                    Demo für ${role === 'bautraeger' ? 'Bauträger' : 'Dienstleister'}
                </p>
            </div>
        `;
        
        showNotification(fallbackHtml, 'info');
    }
    
    function showDemoErrorFallback(role) {
        const errorMessage = `
            <div style="text-align: center; padding: 20px; max-width: 500px; margin: 0 auto;">
                <h3 style="color: #ef4444; margin-bottom: 10px;">🚧 Frontend wird eingerichtet</h3>
                <p style="color: #666; margin-bottom: 15px;">
                    Das BuildWise Frontend ist noch nicht unter <strong>www.buildwise.ch/app</strong> verfügbar.
                </p>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: left;">
                    <h4 style="color: #374151; margin: 0 0 10px 0; font-size: 14px;">📋 Deployment-Anweisungen:</h4>
                    <ol style="color: #6b7280; font-size: 13px; margin: 0; padding-left: 20px;">
                        <li>Frontend unter <code>/app</code> Pfad deployen</li>
                        <li>URL: <code>https://www.buildwise.ch/app</code></li>
                        <li>Oder temporär externe URL in config.js eintragen</li>
                    </ol>
                </div>
                <p style="color: #666; margin-bottom: 20px; font-size: 14px;">
                    Kontaktieren Sie uns für Unterstützung beim Deployment oder eine persönliche Demo.
                </p>
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                    <button onclick="location.reload()" style="background: #3b82f6; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
                        🔄 Erneut versuchen
                    </button>
                    <a href="#contact" style="background: #10b981; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 14px;">
                        📧 Kontakt aufnehmen
                    </a>
                </div>
            </div>
        `;
        
        showNotification(errorMessage, 'error');
    }
    
    function getDemoUrl(role, customBaseUrl = null) {
        let baseUrl = customBaseUrl;
        
        if (!baseUrl) {
            // Bestimme die Frontend-URL basierend auf der Umgebung
            const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            
            if (isDevelopment) {
                // Lokale Entwicklung - Frontend läuft normalerweise auf Port 5173 (Vite)
                baseUrl = 'http://localhost:5173';
            } else {
                // Produktion - Verwende erste verfügbare URL aus Config
                baseUrl = window.BUILDWISE_FRONTEND_URL || 'https://app.buildwise.ch';
            }
        }
        
        // Demo-Credentials basierend auf Rolle
        const demoCredentials = getDemoCredentials(role);
        
        // URL mit Demo-Parametern
        return `${baseUrl}/login?demo=true&role=${role}&email=${encodeURIComponent(demoCredentials.email)}&password=${encodeURIComponent(demoCredentials.password)}`;
    }
    
    function getDemoCredentials(role) {
        // Demo-Zugangsdaten für verschiedene Rollen
        const credentials = {
            bautraeger: {
                email: 'demo.bautraeger@buildwise.ch',
                password: 'demo123'
            },
            dienstleister: {
                email: 'demo.dienstleister@buildwise.ch',
                password: 'demo123'
            }
        };
        
        return credentials[role] || credentials.bautraeger;
    }
}
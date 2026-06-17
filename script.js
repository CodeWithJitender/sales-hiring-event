/* ===================================================================
   SALES HIRING EVENT — MAIN JAVASCRIPT
   Handles: Mobile menu, countdown, scroll reveal, FAQ, navbar,
            EmailJS form submission, hero parallax
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── EmailJS Initialization ─────────────────────────────────────────
  emailjs.init('QpkBmnT4LJ4PGyWTX');

  // ── Mobile Menu ────────────────────────────────────────────────────
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileLinks = mobileMenu.querySelectorAll('a');

  function openMenu() {
    menuToggle.classList.add('active');
    mobileMenu.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menuToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', () => {
    if (mobileMenu.classList.contains('active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mobileOverlay.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ── Navbar Scroll Effect ───────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  function handleNavbarScroll() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // Run once on load

  // ── Countdown Timer ────────────────────────────────────────────────
  // Set the target date to 30 days from now
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 30);
  targetDate.setHours(23, 59, 59, 0);

  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate.getTime() - now;

    if (distance <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ── Scroll Reveal (IntersectionObserver) ───────────────────────────
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-stagger');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once revealed, stop observing for performance
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ── FAQ Accordion ──────────────────────────────────────────────────
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ── Smooth Scroll for Nav Links ────────────────────────────────────
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // ── Active Nav Link Highlighting ───────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          desktopNavLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${id}`) {
              link.style.color = 'var(--color-cta)';
            }
          });
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: '-70px 0px -50% 0px',
    }
  );

  sections.forEach(section => sectionObserver.observe(section));

  // ── Parallax-like effect on hero shapes ────────────────────────────
  const heroShapes = document.querySelectorAll('.hero-shape');

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    heroShapes.forEach((shape, index) => {
      const speed = (index + 1) * 8;
      const rotateSpeed = (index + 1) * 2;
      shape.style.transform = `translate(${x * speed}px, ${y * speed}px) rotate(${x * rotateSpeed}deg)`;
    });
  }, { passive: true });

  // ── Counter Animation for Hero Stats ───────────────────────────────
  const statValues = document.querySelectorAll('.hero-stat-value');
  let statsAnimated = false;

  function animateCounter(el) {
    const text = el.textContent.trim();
    // Extract the number
    const match = text.match(/(\d+)/);
    if (!match) return;

    const target = parseInt(match[1]);
    const prefix = text.substring(0, text.indexOf(match[1]));
    const suffix = text.substring(text.indexOf(match[1]) + match[1].length);
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = prefix + current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = text; // Ensure exact final value
      }
    }

    requestAnimationFrame(update);
  }

  const heroStatsEl = document.querySelector('.hero-stats');
  if (heroStatsEl) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            statValues.forEach(el => animateCounter(el));
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statsObserver.observe(heroStatsEl);
  }
  // ── Form Validation Helpers ─────────────────────────────────────────
  function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    clearFieldError(fieldId);
    field.style.borderColor = '#ff4444';
    const errorEl = document.createElement('span');
    errorEl.className = 'field-error';
    errorEl.textContent = message;
    errorEl.style.cssText = 'color:#ff6b6b;font-size:0.78rem;margin-top:4px;display:block;';
    field.parentElement.appendChild(errorEl);
  }

  function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.style.borderColor = '';
    const existing = field.parentElement.querySelector('.field-error');
    if (existing) existing.remove();
  }

  function sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML.trim();
  }

  function validateForm() {
    let isValid = true;

    // Name: letters, spaces, dots, hyphens only — min 2 chars
    const nameVal = document.getElementById('form-name').value.trim();
    clearFieldError('form-name');
    if (nameVal.length < 2) {
      showFieldError('form-name', 'Name must be at least 2 characters.');
      isValid = false;
    } else if (!/^[a-zA-Z\s.\-']+$/.test(nameVal)) {
      showFieldError('form-name', 'Name can only contain letters, spaces, dots and hyphens.');
      isValid = false;
    }

    // Email: standard email regex
    const emailVal = document.getElementById('form-email').value.trim();
    clearFieldError('form-email');
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailVal)) {
      showFieldError('form-email', 'Please enter a valid email address.');
      isValid = false;
    }

    // Phone: 10-digit Indian mobile number (optional +91 prefix)
    const phoneVal = document.getElementById('form-phone').value.trim();
    clearFieldError('form-phone');
    const phoneClean = phoneVal.replace(/[\s\-\+]/g, '');
    const phoneRegex = /^(91)?[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneClean)) {
      showFieldError('form-phone', 'Please enter a valid 10-digit Indian mobile number.');
      isValid = false;
    }

    // Message: optional but sanitize — max 1000 chars
    const messageVal = document.getElementById('form-message').value.trim();
    clearFieldError('form-message');
    if (messageVal.length > 1000) {
      showFieldError('form-message', 'Message must be under 1000 characters.');
      isValid = false;
    }

    return isValid;
  }

  // Real-time validation on blur
  ['form-name', 'form-email', 'form-phone', 'form-message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('blur', () => validateForm());
      el.addEventListener('input', () => clearFieldError(id));
    }
  });

  // ── EmailJS Form Submission ────────────────────────────────────────
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Run validation first
      if (!validateForm()) return;

      // Show loading state
      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoader = submitBtn.querySelector('.btn-loader');
      btnText.style.display = 'none';
      btnLoader.style.display = 'inline-flex';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      // Gather & sanitize form data
      const templateParams = {
        name: sanitize(document.getElementById('form-name').value.trim()),
        email: sanitize(document.getElementById('form-email').value.trim()),
        phone: sanitize(document.getElementById('form-phone').value.trim()),
        message: sanitize(document.getElementById('form-message').value.trim()),
        time: new Date().toLocaleString('en-IN', {
          dateStyle: 'full',
          timeStyle: 'short',
        }),
      };

      // Send via EmailJS
      emailjs.send('service_5ukbpwr', 'template_s33irls', templateParams)
        .then(() => {
          // Redirect to thank you page on success
          window.location.href = 'thankyou.html';
        })
        .catch((error) => {
          console.error('EmailJS Error:', error);
          alert('Something went wrong. Please try again or contact us directly.');
          // Reset button state
          btnText.style.display = '';
          btnLoader.style.display = 'none';
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        });
    });
  }

});

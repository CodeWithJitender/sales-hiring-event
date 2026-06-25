/* ===================================================================
   INDIA'S FIRST GLOBAL SALES TALENT HUNT — MAIN JAVASCRIPT
   Handles: Lenis smooth scroll, GSAP ScrollTrigger animations,
            split text, parallax, pin animations, horizontal scroll,
            word-by-word reveal, magnetic buttons, cursor glow,
            countdown, FAQ, navbar, EmailJS form submission
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── Register GSAP Plugins ──────────────────────────────────────────
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // ══════════════════════════════════════════════════════════════════
  //  LENIS SMOOTH SCROLL
  // ══════════════════════════════════════════════════════════════════
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 2,
  });

  // Sync Lenis with GSAP's ticker for perfect animation timing
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);


  // ── EmailJS Initialization ─────────────────────────────────────────
  emailjs.init('QpkBmnT4LJ4PGyWTX');

  // ── Phone Input: Numbers Only ──────────────────────────────────────
  const phoneInput = document.getElementById('form-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      phoneInput.value = phoneInput.value.replace(/[^0-9]/g, '');
    });
    phoneInput.addEventListener('keydown', (e) => {
      const allowed = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
      if (allowed.includes(e.key)) return;
      if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) return;
      if (!/^[0-9]$/.test(e.key)) {
        e.preventDefault();
      }
    });
    phoneInput.addEventListener('paste', (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData || window.clipboardData).getData('text');
      phoneInput.value = pasted.replace(/[^0-9]/g, '').slice(0, 10);
    });
  }

  // ── Navbar Scroll Effect ───────────────────────────────────────────
  const navbar = document.getElementById('navbar');

  ScrollTrigger.create({
    start: 50,
    onUpdate: (self) => {
      if (self.scroll() > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });

  // ── Countdown Timer ────────────────────────────────────────────────
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


  // ══════════════════════════════════════════════════════════════════
  //  SPLIT TEXT ANIMATION
  // ══════════════════════════════════════════════════════════════════

  function splitTextIntoChars(element) {
    const children = Array.from(element.childNodes);
    element.innerHTML = '';

    children.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.split(/(\s+)/);
        words.forEach(word => {
          if (word.match(/^\s+$/)) {
            element.appendChild(document.createTextNode(' '));
            return;
          }
          if (word === '') return;
          const wordSpan = document.createElement('span');
          wordSpan.className = 'word';
          word.split('').forEach(char => {
            const charSpan = document.createElement('span');
            charSpan.className = 'char';
            charSpan.textContent = char;
            wordSpan.appendChild(charSpan);
          });
          element.appendChild(wordSpan);
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const clone = node.cloneNode(false);
        const text = node.textContent;
        const words = text.split(/(\s+)/);
        words.forEach(word => {
          if (word.match(/^\s+$/)) {
            clone.appendChild(document.createTextNode(' '));
            return;
          }
          if (word === '') return;
          const wordSpan = document.createElement('span');
          wordSpan.className = 'word';
          word.split('').forEach(char => {
            const charSpan = document.createElement('span');
            charSpan.className = 'char';
            charSpan.textContent = char;
            wordSpan.appendChild(charSpan);
          });
          clone.appendChild(wordSpan);
        });
        element.appendChild(clone);
      }
    });

    return element.querySelectorAll('.char');
  }

  // Split headings
  const splitElements = document.querySelectorAll('[data-split]');
  splitElements.forEach(el => {
    const chars = splitTextIntoChars(el);

    if (el.classList.contains('hero-title')) {
      gsap.fromTo(chars,
        { opacity: 0, y: 60, rotateX: -40 },
        {
          opacity: 1, y: 0, rotateX: 0,
          duration: 0.6,
          stagger: 0.03,
          ease: 'back.out(1.7)',
          delay: 0.3,
        }
      );
    } else {
      gsap.fromTo(chars,
        { opacity: 0, y: 60, rotateX: -40 },
        {
          opacity: 1, y: 0, rotateX: 0,
          duration: 0.5,
          stagger: 0.02,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );
    }
  });


  // ══════════════════════════════════════════════════════════════════
  //  WORD-BY-WORD SCRUB REVEAL (Bartosz Kolenda style)
  // ══════════════════════════════════════════════════════════════════

  document.querySelectorAll('[data-word-reveal]').forEach(el => {
    const text = el.textContent;
    const words = text.split(/\s+/).filter(w => w.length > 0);
    el.innerHTML = '';

    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'word-reveal';
      span.textContent = word;
      el.appendChild(span);
      if (i < words.length - 1) {
        el.appendChild(document.createTextNode(' '));
      }
    });

    const wordSpans = el.querySelectorAll('.word-reveal');

    // Scrub-based: each word fades in as you scroll through the section
    gsap.fromTo(wordSpans,
      { opacity: 0.15 },
      {
        opacity: 1,
        stagger: 0.05,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'bottom 40%',
          scrub: 1,
        }
      }
    );
  });


  // ══════════════════════════════════════════════════════════════════
  //  HERO ENTRANCE TIMELINE
  // ══════════════════════════════════════════════════════════════════

  const heroTL = gsap.timeline({ delay: 0.2 });

  heroTL
    .fromTo('.hero-tag',
      { opacity: 0, y: 30, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
    )
    .fromTo('.hero-subtitle',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.3'
    )
    .fromTo('.hero-cta',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.2'
    )
    .fromTo('.hero-stats',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      '-=0.2'
    )
    .fromTo('.hero-form-wrapper',
      { opacity: 0, x: 60, rotateY: -8 },
      { opacity: 1, x: 0, rotateY: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    );


  // ══════════════════════════════════════════════════════════════════
  //  HERO CURSOR GLOW (Desktop only)
  // ══════════════════════════════════════════════════════════════════

  if (window.innerWidth > 768) {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      const glow = document.createElement('div');
      glow.className = 'hero-cursor-glow';
      heroSection.appendChild(glow);

      heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        gsap.to(glow, {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          duration: 0.6,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });
    }
  }


  // ══════════════════════════════════════════════════════════════════
  //  PARALLAX EFFECTS
  // ══════════════════════════════════════════════════════════════════

  const heroBgImage = document.querySelector('.hero-bg-image');
  const heroShapes = document.querySelectorAll('.hero-shape');

  if (heroBgImage) {
    gsap.to(heroBgImage, {
      y: 200,
      scale: 1.15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      }
    });
  }

  heroShapes.forEach((shape, i) => {
    gsap.to(shape, {
      y: (i + 1) * 80,
      rotate: (i + 1) * 15,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      }
    });
  });

  // Mouse parallax on hero shapes (desktop only)
  if (window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      heroShapes.forEach((shape, index) => {
        gsap.to(shape, {
          x: x * (index + 1) * 8,
          duration: 0.6,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });
    }, { passive: true });
  }

  // Subtle parallax on noise-bg sections
  document.querySelectorAll('.noise-bg').forEach(section => {
    gsap.to(section, {
      backgroundPositionY: '30%',
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      }
    });
  });


  // ══════════════════════════════════════════════════════════════════
  //  ABOUT SECTION — SCRUB REVEAL
  // ══════════════════════════════════════════════════════════════════

  gsap.fromTo('#about .about-content',
    { opacity: 0, y: 60 },
    {
      opacity: 1, y: 0, duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#about',
        start: 'top 70%',
        toggleActions: 'play none none none',
      }
    }
  );


  // ══════════════════════════════════════════════════════════════════
  //  ELIGIBILITY CARDS — SCRUB SCALE + 3D REVEAL
  // ══════════════════════════════════════════════════════════════════

  const eligCards = gsap.utils.toArray('.eligibility-card');
  eligCards.forEach((card, i) => {
    gsap.fromTo(card,
      {
        opacity: 0,
        y: 80,
        scale: 0.85,
        rotateX: -10,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          end: 'top 50%',
          scrub: 1,
        }
      }
    );
  });


  // ══════════════════════════════════════════════════════════════════
  //  TIMELINE SECTION — DRAW LINE + STAGGER STEPS
  // ══════════════════════════════════════════════════════════════════

  const timelineLine = document.querySelector('.timeline-line');
  const timelineSteps = gsap.utils.toArray('.timeline-step');

  if (timelineLine) {
    gsap.fromTo(timelineLine,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline',
          start: 'top 75%',
          end: 'bottom 50%',
          scrub: 1,
        }
      }
    );
  }

  timelineSteps.forEach((step, i) => {
    const stepNumber = step.querySelector('.step-number');
    const stepContent = step.querySelector('.step-content');

    const stepTL = gsap.timeline({
      scrollTrigger: {
        trigger: step,
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });

    stepTL
      .fromTo(stepNumber,
        { opacity: 0, scale: 0, rotate: -180 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(2)' }
      )
      .fromTo(stepContent,
        { opacity: 0, x: 60, rotateY: -10 },
        { opacity: 1, x: 0, rotateY: 0, duration: 0.7, ease: 'power3.out' },
        '-=0.3'
      );
  });


  // ══════════════════════════════════════════════════════════════════
  //  BENEFITS — HORIZONTAL SCROLL PIN (Desktop)
  // ══════════════════════════════════════════════════════════════════

  const benefitsWrap = document.querySelector('.benefits-horizontal-wrap');
  const benefitsGrid = document.querySelector('.benefits-pin-section .benefits-grid');

  if (benefitsWrap && benefitsGrid && window.innerWidth > 768) {
    // Calculate scroll distance
    const getScrollAmount = () => {
      return -(benefitsGrid.scrollWidth - window.innerWidth + 100);
    };

    gsap.to(benefitsGrid, {
      x: getScrollAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: '.benefits-pin-section',
        start: 'top 15%',
        end: () => `+=${Math.abs(getScrollAmount())}`,
        pin: true,
        scrub: 1.2,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      }
    });

    // Individual card parallax within horizontal scroll
    const benefitCards = gsap.utils.toArray('.benefit-card');
    benefitCards.forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'left 80%',
            containerAnimation: gsap.getById?.('benefitsHoriz'),
            toggleActions: 'play none none none',
          }
        }
      );
    });
  } else {
    // Mobile: standard stagger reveal
    const benefitCards = gsap.utils.toArray('.benefit-card');
    benefitCards.forEach((card, i) => {
      const fromX = i % 2 === 0 ? -60 : 60;

      gsap.fromTo(card,
        {
          opacity: 0,
          x: fromX,
          y: 40,
          rotateY: i % 2 === 0 ? 10 : -10,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          rotateY: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );
    });
  }


  // ══════════════════════════════════════════════════════════════════
  //  3D CARD TILT ON MOUSE (Desktop)
  // ══════════════════════════════════════════════════════════════════

  if (window.innerWidth > 768) {
    const tiltCards = document.querySelectorAll('.benefit-card, .eligibility-card');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -5;
        const rotateY = (x - centerX) / centerX * 5;

        gsap.to(card, {
          rotateX: rotateX,
          rotateY: rotateY,
          y: -8,
          scale: 1.02,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 800,
          overwrite: 'auto',
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)',
          overwrite: 'auto',
        });
      });
    });
  }


  // ══════════════════════════════════════════════════════════════════
  //  MAGNETIC BUTTONS (Desktop — Peachweb style)
  // ══════════════════════════════════════════════════════════════════

  if (window.innerWidth > 768) {
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-outline, .btn-cta');

    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
          x: x * 0.3,
          y: y * 0.3,
          duration: 0.3,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)',
          overwrite: 'auto',
        });
      });
    });
  }


  // ══════════════════════════════════════════════════════════════════
  //  FAQ ITEMS — ALTERNATING SLIDE REVEAL
  // ══════════════════════════════════════════════════════════════════

  const faqItems = gsap.utils.toArray('.faq-item');
  faqItems.forEach((item, i) => {
    const fromX = i % 2 === 0 ? -60 : 60;
    gsap.fromTo(item,
      { opacity: 0, x: fromX, y: 20 },
      {
        opacity: 1, x: 0, y: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 90%',
          toggleActions: 'play none none none',
        }
      }
    );
  });


  // ══════════════════════════════════════════════════════════════════
  //  SECTION SUBTITLES — FADE UP
  // ══════════════════════════════════════════════════════════════════

  gsap.utils.toArray('.section-subtitle').forEach(sub => {
    gsap.fromTo(sub,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sub,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      }
    );
  });


  // ══════════════════════════════════════════════════════════════════
  //  COUNTDOWN STRIP — PIN + SCALE IN
  // ══════════════════════════════════════════════════════════════════

  gsap.fromTo('.countdown-strip',
    { opacity: 0, scaleY: 0 },
    {
      opacity: 1, scaleY: 1, duration: 0.5,
      ease: 'power2.out',
      transformOrigin: 'top center',
      scrollTrigger: {
        trigger: '.countdown-strip',
        start: 'top 95%',
        toggleActions: 'play none none none',
      }
    }
  );


  // ══════════════════════════════════════════════════════════════════
  //  FOOTER REVEAL
  // ══════════════════════════════════════════════════════════════════

  gsap.fromTo('.footer-content',
    { opacity: 0, y: 50 },
    {
      opacity: 1, y: 0, duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.footer',
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    }
  );


  // ══════════════════════════════════════════════════════════════════
  //  COUNTER ANIMATION FOR HERO STATS
  // ══════════════════════════════════════════════════════════════════

  const statValues = document.querySelectorAll('.hero-stat-value');
  let statsAnimated = false;

  function animateCounter(el) {
    const text = el.textContent.trim();
    const match = text.match(/(\d+)/);
    if (!match) return;

    const target = parseInt(match[1]);
    const prefix = text.substring(0, text.indexOf(match[1]));
    const suffix = text.substring(text.indexOf(match[1]) + match[1].length);
    const obj = { val: 0 };

    gsap.to(obj, {
      val: target,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = prefix + Math.floor(obj.val) + suffix;
      },
      onComplete: () => {
        el.textContent = text;
      }
    });
  }

  ScrollTrigger.create({
    trigger: '.hero-stats',
    start: 'top 80%',
    onEnter: () => {
      if (!statsAnimated) {
        statsAnimated = true;
        statValues.forEach(el => animateCounter(el));
      }
    }
  });


  // ══════════════════════════════════════════════════════════════════
  //  FAQ ACCORDION
  // ══════════════════════════════════════════════════════════════════

  const faqItemsDOM = document.querySelectorAll('.faq-item');

  faqItemsDOM.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItemsDOM.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });


  // ══════════════════════════════════════════════════════════════════
  //  SMOOTH SCROLL FOR NAV LINKS (via Lenis)
  // ══════════════════════════════════════════════════════════════════

  const navLinksAll = document.querySelectorAll('a[href^="#"]');

  navLinksAll.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        lenis.scrollTo(targetEl, {
          offset: -navbar.offsetHeight,
          duration: 1.5,
        });
      }
    });
  });


  // ══════════════════════════════════════════════════════════════════
  //  ACTIVE NAV LINK HIGHLIGHTING
  // ══════════════════════════════════════════════════════════════════

  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-links a');

  sections.forEach(section => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 30%',
      end: 'bottom 30%',
      onEnter: () => highlightNav(section.id),
      onEnterBack: () => highlightNav(section.id),
    });
  });

  function highlightNav(id) {
    desktopNavLinks.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === `#${id}`) {
        link.style.color = 'var(--color-cta)';
      }
    });
  }


  // ══════════════════════════════════════════════════════════════════
  //  SECTION TITLE UNDERLINE SCRUB
  // ══════════════════════════════════════════════════════════════════

  document.querySelectorAll('.section-title').forEach(title => {
    const after = title;
    gsap.fromTo(after,
      { '--underline-width': '0px' },
      {
        '--underline-width': '120px',
        ease: 'none',
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
          end: 'top 50%',
          scrub: 1,
        }
      }
    );
  });


  // ══════════════════════════════════════════════════════════════════
  //  FORM VALIDATION & SUBMISSION
  // ══════════════════════════════════════════════════════════════════

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

    const nameVal = document.getElementById('form-name').value.trim();
    clearFieldError('form-name');
    if (nameVal.length < 2) {
      showFieldError('form-name', 'Name must be at least 2 characters.');
      isValid = false;
    } else if (!/^[a-zA-Z\s.\-']+$/.test(nameVal)) {
      showFieldError('form-name', 'Name can only contain letters, spaces, dots and hyphens.');
      isValid = false;
    }

    const emailVal = document.getElementById('form-email').value.trim();
    clearFieldError('form-email');
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailVal)) {
      showFieldError('form-email', 'Please enter a valid email address.');
      isValid = false;
    }

    const phoneVal = document.getElementById('form-phone').value.trim();
    clearFieldError('form-phone');
    const phoneClean = phoneVal.replace(/[\s\-\+]/g, '');
    const phoneRegex = /^(91)?[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneClean)) {
      showFieldError('form-phone', 'Please enter a valid 10-digit Indian mobile number.');
      isValid = false;
    }

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

      if (!validateForm()) return;

      const btnText = submitBtn.querySelector('.btn-text');
      const btnLoader = submitBtn.querySelector('.btn-loader');
      btnText.style.display = 'none';
      btnLoader.style.display = 'inline-flex';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

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

      emailjs.send('service_5ukbpwr', 'template_s33irls', templateParams)
        .then(() => {
          window.location.href = 'thankyou.html';
        })
        .catch((error) => {
          console.error('EmailJS Error:', error);
          alert('Something went wrong. Please try again or contact us directly.');
          btnText.style.display = '';
          btnLoader.style.display = 'none';
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        });
    });
  }

});

/* ===================================================================
   INDIA'S FIRST GLOBAL SALES TALENT HUNT — MAIN JAVASCRIPT
   Handles: Lenis smooth scroll, GSAP ScrollTrigger animations,
            split text, parallax, pin animations, horizontal scroll,
            word-by-word reveal, magnetic buttons, cursor glow,
            countdown, FAQ, navbar, video modal, floating CTA,
            schedule tabs
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
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
  });

  // Sync Lenis with GSAP's ticker for perfect animation timing
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);


  // ══════════════════════════════════════════════════════════════════
  //  GLOBAL INTERACTIVE CUSTOM CURSOR (Bartosz Kolenda & Peachweb style)
  // ══════════════════════════════════════════════════════════════════
  if (window.innerWidth > 1024) {
    const cursorDot = document.getElementById('custom-cursor-dot');
    const cursorFollower = document.getElementById('custom-cursor-follower');

    if (cursorDot && cursorFollower) {
      // Center the elements using GSAP percentage offsets (keeps elements centered as they resize)
      gsap.set(cursorDot, { xPercent: -50, yPercent: -50 });
      gsap.set(cursorFollower, { xPercent: -50, yPercent: -50 });

      // Create quickTo setter functions for performance
      const xDotTo = gsap.quickTo(cursorDot, "x", { duration: 0.08, ease: "power3.out" });
      const yDotTo = gsap.quickTo(cursorDot, "y", { duration: 0.08, ease: "power3.out" });

      const xFollowerTo = gsap.quickTo(cursorFollower, "x", { duration: 0.3, ease: "power3.out" });
      const yFollowerTo = gsap.quickTo(cursorFollower, "y", { duration: 0.3, ease: "power3.out" });

      window.addEventListener('mousemove', (e) => {
        xDotTo(e.clientX);
        yDotTo(e.clientY);
        xFollowerTo(e.clientX);
        yFollowerTo(e.clientY);
      }, { passive: true });

      // Click reactions
      window.addEventListener('mousedown', () => {
        cursorFollower.classList.add('clicking');
      });
      window.addEventListener('mouseup', () => {
        cursorFollower.classList.remove('clicking');
      });

      // Hover trigger hooks
      const hoverSelector = 'a, button, .btn-primary, .btn-outline, .btn-cta, .faq-question, .footer-social-center a';
      document.body.addEventListener('mouseenter', (e) => {
        if (e.target.matches && e.target.matches(hoverSelector)) {
          cursorFollower.classList.add('hovering');
          gsap.to(cursorDot, { scale: 1.5, backgroundColor: '#0350E3', duration: 0.2 });
        }
      }, true);

      document.body.addEventListener('mouseleave', (e) => {
        if (e.target.matches && e.target.matches(hoverSelector)) {
          cursorFollower.classList.remove('hovering');
          gsap.to(cursorDot, { scale: 1, backgroundColor: 'var(--color-cta)', duration: 0.2 });
        }
      }, true);

      // Card hover states
      const cardSelector = '.eligibility-card, .benefit-card';
      document.body.addEventListener('mouseenter', (e) => {
        if (e.target.matches && e.target.matches(cardSelector)) {
          cursorFollower.classList.add('card-hovering');
        }
      }, true);

      document.body.addEventListener('mouseleave', (e) => {
        if (e.target.matches && e.target.matches(cardSelector)) {
          cursorFollower.classList.remove('card-hovering');
        }
      }, true);
    }
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
  const targetDate = new Date('2026-08-08T00:00:00');

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

  // Hero content — no entrance animation (show immediately)


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
  //  MOVEMENT SECTION — SCRUB REVEAL
  // ══════════════════════════════════════════════════════════════════

  gsap.fromTo('#movement .movement-content',
    { opacity: 0, y: 60 },
    {
      opacity: 1, y: 0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#movement',
        start: 'top 85%',
        end: 'top 55%',
        scrub: 1,
      }
    }
  );


  // ══════════════════════════════════════════════════════════════════
  //  ELIGIBILITY CARDS — STAGGERED 3D ENTRANCE SCRUB (Peachweb style)
  // ══════════════════════════════════════════════════════════════════

  gsap.fromTo('.eligibility-card',
    {
      opacity: 0,
      y: 60,
      rotateX: -15,
      scale: 0.9,
    },
    {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.eligibility-grid',
        start: 'top 85%',
        end: 'bottom 75%',
        scrub: 1,
      }
    }
  );


  // ══════════════════════════════════════════════════════════════════
  //  TIMELINE SECTION — PINNING + DRAW LINE + STAGGER STEPS SCRUB
  // ══════════════════════════════════════════════════════════════════

  // Pin the left heading while the 6 timeline cards scroll on the right
  const journeySection = document.querySelector('#journey');
  const journeyText = document.querySelector('.journey-text');
  const timelineEl = document.querySelector('.timeline');

  if (journeySection && journeyText && timelineEl && window.innerWidth > 1024) {
    ScrollTrigger.create({
      trigger: journeySection,
      start: 'top 80px',
      end: () => {
        // Pin until the bottom of the timeline section is reached
        const timelineHeight = timelineEl.offsetHeight;
        const textHeight = journeyText.offsetHeight;
        const diff = timelineHeight - textHeight;
        return `+=${Math.max(diff, 200)}`;
      },
      pin: journeyText,
      pinSpacing: false,
    });
  }

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
        start: 'top 90%',
        end: 'top 70%',
        scrub: 1.2,
      }
    });

    stepTL
      .fromTo(stepNumber,
        { opacity: 0, scale: 0, rotate: -180 },
        { opacity: 1, scale: 1, rotate: 0 }
      )
      .fromTo(stepContent,
        { opacity: 0, x: 60, rotateY: -10 },
        { opacity: 1, x: 0, rotateY: 0 },
        '-=0.2'
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

    const benefitsTween = gsap.to(benefitsGrid, {
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
            containerAnimation: benefitsTween,
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
  //  FAQ ITEMS — ALTERNATING SLIDE REVEAL SCRUB
  // ══════════════════════════════════════════════════════════════════

  const faqItems = gsap.utils.toArray('.faq-item');
  faqItems.forEach((item, i) => {
    const fromX = i % 2 === 0 ? -60 : 60;
    gsap.fromTo(item,
      { opacity: 0, x: fromX, y: 20 },
      {
        opacity: 1, x: 0, y: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 95%',
          end: 'top 75%',
          scrub: 1,
        }
      }
    );
  });


  // ══════════════════════════════════════════════════════════════════
  //  SECTION SUBTITLES — FADE UP SCRUB
  // ══════════════════════════════════════════════════════════════════

  gsap.utils.toArray('.section-subtitle').forEach(sub => {
    gsap.fromTo(sub,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sub,
          start: 'top 90%',
          end: 'top 70%',
          scrub: 1,
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
  //  FOOTER REVEAL SCRUB
  // ══════════════════════════════════════════════════════════════════

  gsap.fromTo('.footer-content',
    { opacity: 0, y: 50 },
    {
      opacity: 1, y: 0,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.footer',
        start: 'top 95%',
        end: 'bottom bottom',
        scrub: 1,
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
  //  FAQ ACCORDION (GSAP Height Transition)
  // ══════════════════════════════════════════════════════════════════

  const faqItemsDOM = document.querySelectorAll('.faq-item');

  faqItemsDOM.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other items
      faqItemsDOM.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          gsap.to(otherItem.querySelector('.faq-answer'), { height: 0, duration: 0.4, ease: 'power2.out' });
        }
      });

      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
        question.setAttribute('aria-expanded', 'false');
        gsap.to(answer, { height: 0, duration: 0.4, ease: 'power2.out' });
      } else {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        gsap.to(answer, { height: 'auto', duration: 0.5, ease: 'power2.out' });
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
  //  VIDEO MODAL
  // ══════════════════════════════════════════════════════════════════

  function openVideoModal() {
    document.getElementById('video-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeVideoModal() {
    document.getElementById('video-modal').classList.remove('active');
    document.body.style.overflow = '';
  }

  // Make functions globally accessible
  window.openVideoModal = openVideoModal;
  window.closeVideoModal = closeVideoModal;

  // Close modal on overlay click
  document.getElementById('video-modal')?.addEventListener('click', function(e) {
    if (e.target === this) closeVideoModal();
  });

  // Close modal on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeVideoModal();
  });


  // ══════════════════════════════════════════════════════════════════
  //  FLOATING CTA BAR
  // ══════════════════════════════════════════════════════════════════

  const floatingCta = document.getElementById('floating-cta');
  if (floatingCta) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 600) {
        floatingCta.classList.add('visible');
      } else {
        floatingCta.classList.remove('visible');
      }
    });
  }


  // ══════════════════════════════════════════════════════════════════
  //  SCHEDULE TABS
  // ══════════════════════════════════════════════════════════════════

  const scheduleTabs = document.querySelectorAll('.schedule-tab-btn');
  const scheduleDays = document.querySelectorAll('.schedule-day');
  scheduleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      scheduleTabs.forEach(t => t.classList.remove('active'));
      scheduleDays.forEach(d => d.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.target);
      if (target) target.classList.add('active');
    });
  });

  // ══════════════════════════════════════════════════════════════════
  //  DYNAMIC CARD HOVER SHEEN EFFECT
  // ══════════════════════════════════════════════════════════════════
  const sheenCards = document.querySelectorAll('.benefit-card, .eligibility-card');
  sheenCards.forEach(card => {
    const sheen = document.createElement('div');
    sheen.className = 'card-sheen';
    card.appendChild(sheen);

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--sheen-x', `${x}px`);
      card.style.setProperty('--sheen-y', `${y}px`);
    }, { passive: true });
  });

 // ══════════════════════════════════════════════════════════════════
//  EMAILJS INITIALIZATION & FORM SUBMISSION
// ══════════════════════════════════════════════════════════════════

// Initialize EmailJS
if (typeof emailjs !== 'undefined') {
  emailjs.init('QpkBmnT4LJ4PGyWTX');
}

// CV Upload Handler
const cvInput = document.getElementById('reg-cv');
const cvUploadArea = document.getElementById('cv-upload-area');
const cvUploadText = document.getElementById('cv-upload-text');

if (cvInput) {
  cvInput.addEventListener('change', function () {
    if (this.files && this.files[0]) {
      const file = this.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (file.size > maxSize) {
        alert('File size exceeds 5MB. Please upload a smaller file.');
        this.value = '';
        return;
      }

      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a PDF, DOC, or DOCX file.');
        this.value = '';
        return;
      }

      cvUploadText.textContent = file.name;
      cvUploadText.classList.add('file-selected');
      cvUploadArea.classList.add('has-file');
    }
  });
}

// Phone input — digits only
const phoneInput = document.getElementById('reg-phone');
if (phoneInput) {
  phoneInput.addEventListener('input', function () {
    this.value = this.value.replace(/[^0-9+\-\s]/g, '');
  });
}

// Form Submission
const regForm = document.getElementById('registration-form');
if (regForm) {
  regForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Clear previous errors
    this.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));

    // Validate
    const name = document.getElementById('reg-name');
    const email = document.getElementById('reg-email');
    const phone = document.getElementById('reg-phone');
    const source = document.getElementById('reg-source');
    const cv = document.getElementById('reg-cv');
    let hasError = false;

    if (!name.value.trim()) {
      name.closest('.form-group').classList.add('error');
      hasError = true;
    }
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.closest('.form-group').classList.add('error');
      hasError = true;
    }
    if (!phone.value.trim() || phone.value.replace(/[^0-9]/g, '').length < 10) {
      phone.closest('.form-group').classList.add('error');
      hasError = true;
    }
    if (!source.value) {
      source.closest('.form-group').classList.add('error');
      hasError = true;
    }
    if (!cv.files || !cv.files[0]) {
      cv.closest('.form-group').classList.add('error');
      hasError = true;
    }

    if (hasError) return;

    // Disable button while submitting
    const submitBtn = document.getElementById('form-submit-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="btn-loader"><svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/></svg> SUBMITTING...</span>';

    try {
      // Use sendForm instead of send to handle files seamlessly.
      // Make sure your form elements have matching 'name' attributes for your EmailJS Template tags!
      await emailjs.sendForm('service_5ukbpwr', 'template_s33irls', this);

      // Show success
      const formCard = document.querySelector('.hero-form-card');
      let successOverlay = formCard.querySelector('.form-success-overlay');
      if (!successOverlay) {
        successOverlay = document.createElement('div');
        successOverlay.className = 'form-success-overlay';
        successOverlay.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 12l3 3 5-5"/>
          </svg>
          <h4>Application Sent!</h4>
          <p>We've received your details. Our team will reach out to you soon.</p>
        `;
        formCard.appendChild(successOverlay);
      }
      setTimeout(() => successOverlay.classList.add('active'), 50);

      // Reset form
      regForm.reset();
      cvUploadText.textContent = 'Click to upload your CV';
      cvUploadText.classList.remove('file-selected');
      cvUploadArea.classList.remove('has-file');

    } catch (error) {
      console.error('EmailJS Error:', error);
      alert('Something went wrong. Please try again or contact us directly.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

});

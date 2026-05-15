// Asistora Website - Interactive JavaScript (Original Restored)
document.addEventListener('DOMContentLoaded', function() {
  // Loading screen
  const loading = document.querySelector('.loading');
  if (loading) {
    window.addEventListener('load', () => {
      loading.classList.add('hidden');
      setTimeout(() => loading.style.display = 'none', 500);
    });
  }

  // Navbar mobile toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    const setExpanded = (expanded) => {
      mobileToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    };

    const toggleMenu = () => {
      const next = !navMenu.classList.contains('active');
      navMenu.classList.toggle('active', next);
      mobileToggle.classList.toggle('active', next);
      setExpanded(next);
    };

    mobileToggle.addEventListener('click', (e) => {
      e.preventDefault();
      toggleMenu();
    });

    mobileToggle.addEventListener('touchstart', (e) => {
      // Prevent iOS from triggering click twice
      e.stopPropagation();
    }, { passive: true });

    mobileToggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        setExpanded(false);
      });
    });
  }

  // Smooth scrolling
  document.querySelectorAll('a[href^=\"#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Scroll reveal (premium + subtle)
  // - Uses IntersectionObserver
  // - Only triggers when elements enter viewport
  // - Adds `.reveal.in-view` (CSS handles fade-up + blur-to-clear)
  // - Stagger via `data-stagger` (set in HTML) or by DOM order fallback
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -10% 0px'
  };

  const revealSelector = '[data-reveal], .reveal, .fade-in-up';
  const toReveal = Array.from(document.querySelectorAll(revealSelector));

  // Normalize: map legacy `.fade-in-up` usage to the new `.reveal` system, without breaking old animation.
  toReveal.forEach((el) => {
    if (el.classList.contains('fade-in-up') && !el.classList.contains('reveal')) {
      el.classList.add('reveal');
    }
    if (!el.hasAttribute('data-reveal')) {
      // Allow stagger if caller already set --stagger; otherwise we compute later.
      if (el.style && el.style.getPropertyValue('--stagger') === '') {
        // no-op
      }
    }
  });

  // Assign a simple stagger index if none provided.
  // This keeps the motion premium without requiring HTML updates everywhere.
  let cursor = 0;
  const step = 1;
  toReveal.forEach((el) => {
    if (!el.style.getPropertyValue('--stagger') && el.getAttribute('data-stagger') == null) {
      el.style.setProperty('--stagger', String(cursor * step));
      cursor += 1;
    }
  });

  if (!prefersReduced) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    toReveal.forEach((el) => observer.observe(el));
  } else {
    // Respect reduced motion: make everything visible immediately.
    toReveal.forEach((el) => el.classList.add('in-view'));
  }


  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(255, 255, 255, 0.98)';
      navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      navbar.style.boxShadow = 'none';
    }
  });

  // Active nav link
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Testimonials slider (supports current homepage markup)
  // Prefer explicit testimonial cards if present; otherwise fall back to the homepage testimonial section cards.
  const testimonialCards = Array.from(
    document.querySelectorAll('section[aria-label="Testimonials"] .card')
  );

  let currentTestimonial = 0;


  function showTestimonial(index) {
    testimonialCards.forEach((t, i) => {
      t.style.display = i === index ? 'block' : 'none';
      if (i === index) t.classList.add('slide-in-left');
      else t.classList.remove('slide-in-left');
    });
  }


  if (testimonialCards.length > 0) {
    // Ensure consistent initial state
    showTestimonial(0);
    setInterval(() => {
      currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
      showTestimonial(currentTestimonial);
    }, 5000);
  }


  // FAQ accordion (click + keyboard + ARIA)
  document.querySelectorAll('.faq-question').forEach(question => {
    const toggleFAQ = () => {
      const answer = question.nextElementSibling;
      const icon = question.querySelector('.faq-icon');
      const isExpanded = question.getAttribute('aria-expanded') === 'true';

      answer.classList.toggle('active');
      question.setAttribute('aria-expanded', (!isExpanded).toString());

      // Close others
      document.querySelectorAll('.faq-answer.active').forEach(a => {
        if (a !== answer) {
          a.classList.remove('active');
          const q = a.previousElementSibling;
          if (q && q.classList && q.classList.contains('faq-question')) q.setAttribute('aria-expanded', 'false');
          const otherIcon = q ? q.querySelector('.faq-icon') : null;
          if (otherIcon) otherIcon.classList.remove('rotated');
        }
      });

      if (icon) icon.classList.toggle('rotated');
    };

    question.addEventListener('click', toggleFAQ);

    question.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFAQ();
      }
    });
  });


  // Contact form
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = this.querySelector('#email').value;
      const message = this.querySelector('#message').value;
      if (email && message && /\S+@\S+\.\S+/.test(email)) {
        alert('Thank you! Message sent (demo).');
        this.reset();
      } else {
        alert('Please fill correctly.');
      }
    });
  }

  // Newsletter
  const newsletterForm = document.querySelector('#newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = this.querySelector('input[type="email"]').value;
      if (email && /\S+@\S+\.\S+/.test(email)) {
        alert('Subscribed! (demo)');
        this.reset();
      } else {
        alert('Valid email required.');
      }
    });
  }

  // Chatbot toggle
  const chatbotToggle = document.querySelector('.chatbot-float');
  const chatbotWindow = document.querySelector('.chatbot-window');
  if (chatbotToggle && chatbotWindow && !window.AsistoraChatbotLoaded) {
    chatbotToggle.addEventListener('click', () => {
      chatbotWindow.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
      if (!chatbotWindow.contains(e.target) && !chatbotToggle.contains(e.target)) {
        chatbotWindow.classList.remove('active');
      }
    });
  }

  // Scroll to top
  const scrollTopBtn = document.querySelector('.scroll-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      scrollTopBtn?.classList.add('show');
    } else {
      scrollTopBtn?.classList.remove('show');
    }
  });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Google Fonts
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@500;600;700;800&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
});

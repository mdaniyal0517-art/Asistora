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
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active');
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
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

  // Scroll reveal
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        entry.target.classList.add('animate');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in-up, .card, .step-item').forEach(el => {
    observer.observe(el);
  });

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

  // Testimonials slider
  const testimonials = document.querySelectorAll('.testimonial');
  let currentTestimonial = 0;

  function showTestimonial(index) {
    testimonials.forEach((t, i) => {
      t.style.display = i === index ? 'block' : 'none';
      if (i === index) t.classList.add('slide-in-left');
    });
  }

  if (testimonials.length > 0) {
    setInterval(() => {
      currentTestimonial = (currentTestimonial + 1) % testimonials.length;
      showTestimonial(currentTestimonial);
    }, 5000);
    showTestimonial(0);
  }

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const answer = question.nextElementSibling;
      const icon = question.querySelector('.faq-icon');

      answer.classList.toggle('active');

      // Close others
      document.querySelectorAll('.faq-answer.active').forEach(a => {
        if (a !== answer) a.classList.remove('active');
      });

      if (icon) icon.classList.toggle('rotated');
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

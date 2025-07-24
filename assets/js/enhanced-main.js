// =============================
// Enhanced Portfolio JavaScript
// Modern Interactions & Animations
// =============================

// =============================
// Utility Functions
// =============================
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
};

// =============================
// Enhanced Smooth Scrolling
// =============================
class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    // Enhanced smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// =============================
// Enhanced Navbar
// =============================
class EnhancedNavbar {
  constructor() {
    this.navbar = document.querySelector('.navbar') || document.querySelector('nav');
    this.lastScrollY = window.scrollY;
    this.init();
  }

  init() {
    if (!this.navbar) return;

    // Scroll effects
    window.addEventListener('scroll', throttle(() => {
      this.handleScroll();
    }, 16));

    // Active section highlighting
    this.highlightActiveSection();
  }

  handleScroll() {
    const currentScrollY = window.scrollY;
    
    // Add/remove scrolled class
    if (currentScrollY > 50) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }

    // Hide/show navbar on scroll
    if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
      this.navbar.style.transform = 'translateY(-100%)';
    } else {
      this.navbar.style.transform = 'translateY(0)';
    }

    this.lastScrollY = currentScrollY;
  }

  highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', throttle(() => {
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 100) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    }, 16));
  }
}

// =============================
// Enhanced Scroll Animations
// =============================
class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    this.init();
  }

  init() {
    // Create intersection observer
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
        }
      });
    }, this.observerOptions);

    // Observe elements
    this.observeElements();
  }

  observeElements() {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll(`
      .glass-card,
      .premium-card,
      .skill-card,
      .project-card,
      .section-title,
      .hero-content > *
    `);

    animatedElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
      this.observer.observe(el);
    });
  }

  animateElement(element) {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
    this.observer.unobserve(element);
  }
}

// =============================
// Enhanced Particle Background
// =============================
class ParticleBackground {
  constructor(container) {
    this.container = container || document.body;
    this.particles = [];
    this.particleCount = 50;
    this.init();
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '-1';
    this.canvas.style.opacity = '0.3';
    
    this.container.appendChild(this.canvas);
    
    this.resize();
    this.createParticles();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 215, 0, ${particle.opacity})`;
      this.ctx.fill();
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// =============================
// Enhanced Form Handling
// =============================
class EnhancedForm {
  constructor() {
    this.form = document.querySelector('#contact-form');
    this.init();
  }

  init() {
    if (!this.form) return;

    // Add floating labels
    this.addFloatingLabels();
    
    // Add form validation
    this.addValidation();
    
    // Add submit handling
    this.handleSubmit();
  }

  addFloatingLabels() {
    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      const label = input.previousElementSibling;
      if (label && label.tagName === 'LABEL') {
        input.addEventListener('focus', () => {
          label.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
          if (!input.value) {
            label.classList.remove('focused');
          }
        });
        
        // Check if input has value on load
        if (input.value) {
          label.classList.add('focused');
        }
      }
    });
  }

  addValidation() {
    const inputs = this.form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });
    });
  }

  validateField(field) {
    const isValid = field.checkValidity();
    const errorElement = field.parentNode.querySelector('.error-message');
    
    if (!isValid) {
      field.classList.add('error');
      if (!errorElement) {
        const error = document.createElement('span');
        error.className = 'error-message';
        error.textContent = field.validationMessage;
        field.parentNode.appendChild(error);
      }
    } else {
      field.classList.remove('error');
      if (errorElement) {
        errorElement.remove();
      }
    }
  }

  handleSubmit() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Validate all fields
      const inputs = this.form.querySelectorAll('input[required], textarea[required]');
      let isFormValid = true;
      
      inputs.forEach(input => {
        this.validateField(input);
        if (!input.checkValidity()) {
          isFormValid = false;
        }
      });
      
      if (isFormValid) {
        this.submitForm();
      }
    });
  }

  async submitForm() {
    const submitBtn = this.form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      this.showMessage('Message sent successfully!', 'success');
      this.form.reset();
      
    } catch (error) {
      this.showMessage('Failed to send message. Please try again.', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  showMessage(text, type) {
    const message = document.createElement('div');
    message.className = `form-message ${type}`;
    message.textContent = text;
    
    this.form.appendChild(message);
    
    setTimeout(() => {
      message.remove();
    }, 5000);
  }
}

// =============================
// Enhanced Swiper Configuration
// =============================
class EnhancedSwipers {
  constructor() {
    this.init();
  }

  init() {
    // Projects Swiper
    if (document.querySelector('.projectsSwiper')) {
      new Swiper('.projectsSwiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          640: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        },
        effect: 'coverflow',
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        },
      });
    }

    // Certifications Swiper
    if (document.querySelector('.certificationSwiper')) {
      new Swiper('.certificationSwiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        },
      });
    }

    // Testimonials Swiper
    if (document.querySelector('.testimonialSwiper')) {
      new Swiper('.testimonialSwiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
          delay: 6000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
          },
        },
      });
    }
  }
}

// =============================
// Enhanced Back to Top Button
// =============================
class BackToTop {
  constructor() {
    this.button = document.querySelector('#back-to-top');
    this.init();
  }

  init() {
    if (!this.button) return;

    // Show/hide button based on scroll
    window.addEventListener('scroll', throttle(() => {
      this.updateVisibility();
      this.updateProgress();
    }, 16));

    // Click handler
    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  updateVisibility() {
    if (window.scrollY > 300) {
      this.button.classList.add('show');
    } else {
      this.button.classList.remove('show');
    }
  }

  updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = scrollTop / docHeight;
    
    const progressBar = this.button.querySelector('.progress-bar');
    if (progressBar) {
      const circumference = 2 * Math.PI * 24; // radius = 24
      const offset = circumference - (scrollPercent * circumference);
      progressBar.style.strokeDashoffset = offset;
    }
  }
}

// =============================
// Enhanced Mobile Menu
// =============================
class MobileMenu {
  constructor() {
    this.menuToggle = document.querySelector('#menu-toggle');
    this.mobileMenu = document.querySelector('#mobile-menu');
    this.init();
  }

  init() {
    if (!this.menuToggle || !this.mobileMenu) return;

    this.menuToggle.addEventListener('click', () => {
      this.toggleMenu();
    });

    // Close menu when clicking on links
    this.mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.menuToggle.contains(e.target) && !this.mobileMenu.contains(e.target)) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    this.mobileMenu.classList.toggle('hidden');
    this.menuToggle.classList.toggle('active');
  }

  closeMenu() {
    this.mobileMenu.classList.add('hidden');
    this.menuToggle.classList.remove('active');
  }
}

// =============================
// Enhanced Flip Cards
// =============================
class FlipCards {
  constructor() {
    this.init();
  }

  init() {
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
      });
    });
  }
}

// =============================
// Performance Optimization
// =============================
class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    // Lazy load images
    this.lazyLoadImages();
    
    // Preload critical resources
    this.preloadResources();
    
    // Optimize animations for performance
    this.optimizeAnimations();
  }

  lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('loading');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => {
      img.classList.add('loading');
      imageObserver.observe(img);
    });
  }

  preloadResources() {
    // Preload critical fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap';
    fontLink.as = 'style';
    document.head.appendChild(fontLink);
  }

  optimizeAnimations() {
    // Reduce animations on low-end devices
    if (navigator.hardwareConcurrency <= 2) {
      document.body.classList.add('reduced-motion');
    }
  }
}

// =============================
// Theme System
// =============================
class ThemeSystem {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.createThemeToggle();
  }

  createThemeToggle() {
    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.innerHTML = '<i class="fas fa-moon"></i>';
    toggle.setAttribute('aria-label', 'Toggle theme');
    
    toggle.addEventListener('click', () => {
      this.toggleTheme();
    });

    // Add to navbar
    const navbar = document.querySelector('.nav-container');
    if (navbar) {
      navbar.appendChild(toggle);
    }
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    
    const toggle = document.querySelector('.theme-toggle i');
    if (toggle) {
      toggle.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  }
}

// =============================
// Initialize Everything
// =============================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  new SmoothScroll();
  new EnhancedNavbar();
  new ScrollAnimations();
  new EnhancedForm();
  new EnhancedSwipers();
  new BackToTop();
  new MobileMenu();
  new FlipCards();
  new PerformanceOptimizer();
  new ThemeSystem();
  
  // Initialize particle background (optional)
  if (window.innerWidth > 768) {
    new ParticleBackground();
  }
  
  // Add loading complete class
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);
});

// =============================
// Additional Utility Functions
// =============================

// Ripple effect for buttons
function addRippleEffect() {
  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// Initialize ripple effect
document.addEventListener('DOMContentLoaded', addRippleEffect);

// Typing animation for hero text
function initTypingAnimation() {
  const typingElement = document.querySelector('.typing-text');
  if (!typingElement) return;
  
  const texts = ['Full Stack Developer', 'Graphic Designer', 'UI/UX Designer', 'WordPress Expert'];
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  function type() {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
      typingElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }
    
    let typeSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentText.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      typeSpeed = 500;
    }
    
    setTimeout(type, typeSpeed);
  }
  
  type();
}

// Initialize typing animation
document.addEventListener('DOMContentLoaded', initTypingAnimation);


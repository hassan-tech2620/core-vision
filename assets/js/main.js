// CoreVision Main JavaScript File
document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initAnimations();
    initForms();
    initBlogFunctionality();
    initFAQFunctionality();
    initCarousels();
    initScrollEffects();
    initLoadingAnimations();
    initLazyLoading();
  });
  
  
  // ======================
  // Navigation Functions
  // ======================
  function initNavigation() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  
    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
          navbar.style.background = 'rgba(255, 255, 255, 0.98)';
          navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
          navbar.style.background = 'rgba(255, 255, 255, 0.95)';
          navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
      });
    }
  
    // Mobile menu toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
  
    if (navbarToggler && navbarCollapse) {
      navbarToggler.addEventListener('click', function () {
        navbarCollapse.classList.toggle('show');
      });
  
      // Close mobile menu when clicking on nav links
      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function () {
          if (navbarCollapse.classList.contains('show')) {
            navbarCollapse.classList.remove('show');
          }
        });
      });
    }
  }
  
  
  // ======================
  // Animation Functions
  // ======================
  function initAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
  
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          const siblings = entry.target.parentElement.querySelectorAll('.animate-on-scroll');
          siblings.forEach((sibling, index) => {
            if (sibling === entry.target) {
              setTimeout(() => {
                sibling.classList.add('animated');
              }, index * 100);
            }
          });
        }
      });
    }, observerOptions);
  
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  
    animateCounters();
  }
  
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-item h3, .stat-card h3');
  
    counters.forEach(counter => {
      const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
      if (target && target > 0) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = counter.textContent.replace(/\d+/, target);
            clearInterval(timer);
          } else {
            counter.textContent = counter.textContent.replace(/\d+/, Math.floor(current));
          }
        }, 30);
      }
    });
  }
  
  
  // ======================
  // Form Functions
  // ======================
  function initForms() {
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');
  
    if (contactForm) contactForm.addEventListener('submit', handleContactForm);
    if (newsletterForm) newsletterForm.addEventListener('submit', handleNewsletterForm);
  
    initFormValidation();
  }
  
  function handleContactForm(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
  
    if (!validateForm(form)) return;
  
    // Show loading state
    btnText.classList.add('d-none');
    btnLoading.classList.remove('d-none');
    submitBtn.disabled = true;
  
    setTimeout(() => {
      const successAlert = document.getElementById('formSuccess');
      if (successAlert) {
        successAlert.classList.remove('d-none');
        successAlert.scrollIntoView({ behavior: 'smooth' });
      }
  
      form.reset();
      form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
  
      btnText.classList.remove('d-none');
      btnLoading.classList.add('d-none');
      submitBtn.disabled = false;
  
      setTimeout(() => {
        if (successAlert) {
          successAlert.classList.add('d-none');
        }
      }, 5000);
    }, 2000);
  }
  
  function handleNewsletterForm(e) {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
    const submitBtn = form.querySelector('button[type="submit"]');
  
    if (!email || !isValidEmail(email)) {
      showNotification('Please enter a valid email address', 'error');
      return;
    }
  
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Subscribing...';
    submitBtn.disabled = true;
  
    setTimeout(() => {
      showNotification('Successfully subscribed to our newsletter!', 'success');
      form.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 1500);
  }
  
  function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
  
    requiredFields.forEach(field => {
      const value = field.value.trim();
      if (!value || (field.type === 'email' && !isValidEmail(value))) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
        isValid = false;
      } else {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
      }
    });
  
    return isValid;
  }
  
  function initFormValidation() {
    document.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('is-invalid')) {
          validateField(field);
        }
      });
    });
  }
  
  function validateField(field) {
    const value = field.value.trim();
    if (field.hasAttribute('required') && !value) {
      field.classList.add('is-invalid');
      field.classList.remove('is-valid');
      return false;
    }
    if (field.type === 'email' && value && !isValidEmail(value)) {
      field.classList.add('is-invalid');
      field.classList.remove('is-valid');
      return false;
    }
  
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
    return true;
  }
  
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  
  // ======================
  // Blog Functions
  // ======================
  function initBlogFunctionality() {
    const blogSearch = document.getElementById('blogSearch');
    if (blogSearch) {
      blogSearch.addEventListener('input', function () {
        filterBlogPosts(this.value);
      });
    }
  
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const category = this.getAttribute('data-category');
        filterBlogPostsByCategory(category);
      });
    });
  
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', loadMoreBlogPosts);
    }
  }
  
  function filterBlogPosts(searchTerm) {
    const blogItems = document.querySelectorAll('.blog-item');
    const searchLower = searchTerm.toLowerCase();
  
    blogItems.forEach(item => {
      const title = item.querySelector('h4').textContent.toLowerCase();
      const content = item.querySelector('p').textContent.toLowerCase();
  
      if (title.includes(searchLower) || content.includes(searchLower)) {
        item.style.display = 'block';
        item.classList.add('animate-on-scroll');
      } else {
        item.style.display = 'none';
      }
    });
  }
  
  function filterBlogPostsByCategory(category) {
    const blogItems = document.querySelectorAll('.blog-item');
    blogItems.forEach(item => {
      if (category === 'all' || item.getAttribute('data-category') === category) {
        item.style.display = 'block';
        item.classList.add('animate-on-scroll');
      } else {
        item.style.display = 'none';
      }
    });
  }
  
  function loadMoreBlogPosts() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const originalText = loadMoreBtn.innerHTML;
    loadMoreBtn.innerHTML = 'Loading...';
    loadMoreBtn.disabled = true;
  
    setTimeout(() => {
      showNotification('All articles loaded!', 'info');
      loadMoreBtn.style.display = 'none';
    }, 1500);
  }
  
  
  // ======================
  // FAQ Functions
  // ======================
  function initFAQFunctionality() {
    const faqSearch = document.getElementById('faqSearch');
    if (faqSearch) {
      faqSearch.addEventListener('input', function () {
        filterFAQs(this.value);
      });
    }
  
    const categoryLinks = document.querySelectorAll('.category-link');
    categoryLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        categoryLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  
    window.addEventListener('scroll', updateActiveFAQCategory);
  }
  
  function filterFAQs(searchTerm) {
    const faqItems = document.querySelectorAll('.faq-item');
    const searchLower = searchTerm.toLowerCase();
    let hasResults = false;
  
    faqItems.forEach(item => {
      const question = item.querySelector('.accordion-button').textContent.toLowerCase();
      const answer = item.querySelector('.accordion-body').textContent.toLowerCase();
  
      if (question.includes(searchLower) || answer.includes(searchLower)) {
        item.style.display = 'block';
        hasResults = true;
        if (searchTerm) {
          highlightSearchTerm(item, searchTerm);
        }
      } else {
        item.style.display = 'none';
      }
    });
  
    showFAQNoResults(!hasResults && searchTerm);
  }
  
  function highlightSearchTerm(element, term) {
    const textElements = element.querySelectorAll('.accordion-button, .accordion-body');
    textElements.forEach(el => {
      const text = el.textContent;
      const regex = new RegExp(`(${term})`, 'gi');
      el.innerHTML = text.replace(regex, '<mark>$1</mark>');
    });
  }
  
  function showFAQNoResults(show) {
    let noResultsMsg = document.getElementById('faqNoResults');
    if (show && !noResultsMsg) {
      noResultsMsg = document.createElement('div');
      noResultsMsg.id = 'faqNoResults';
      noResultsMsg.className = 'text-center py-5';
      noResultsMsg.innerHTML = `<p>No results found. Please try a different keyword.</p>`;
      document.querySelector('#faqContainer')?.appendChild(noResultsMsg);
    } else if (!show && noResultsMsg) {
      noResultsMsg.remove();
    }
  }
  
  
  // ======================
  // Placeholder Functions
  // ======================
  function initCarousels() {}
  function initScrollEffects() {}
  function initLoadingAnimations() {}
  function initLazyLoading() {}
  function updateActiveFAQCategory() {}
  function showNotification(message, type) {
    alert(`[${type.toUpperCase()}] ${message}`); // Placeholder for toast/alert
  }
  
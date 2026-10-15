/* ═══════════════════════════════════════════════════════
   script.js — Content Creator Kit Landing Page
   Zero dependencies. ES6+.
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initAccordion();
  initFormValidation();
  initScrollAnimations();
  initSmoothScroll();
});


/* ── FAQ Accordion ─────────────────────────────────────── */
function initAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const button = item.querySelector('.faq-item__question');

    button.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-open') === 'true';

      // Close all others (single-open behavior)
      faqItems.forEach(other => {
        other.setAttribute('data-open', 'false');
        other.querySelector('.faq-item__question')
             .setAttribute('aria-expanded', 'false');
      });

      // Toggle current
      if (!isOpen) {
        item.setAttribute('data-open', 'true');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
}


/* ── Form Validation & Submission ──────────────────────── */
function initFormValidation() {
  const form      = document.getElementById('signup-form');
  const nameInput = document.getElementById('signup-name');
  const emailInput= document.getElementById('signup-email');
  const nameError = document.getElementById('name-error');
  const emailError= document.getElementById('email-error');
  const thankYou  = document.getElementById('thank-you');

  if (!form) return;

  // Real-time: clear error on input
  nameInput.addEventListener('input', () => {
    nameInput.classList.remove('input--error');
    nameInput.removeAttribute('aria-invalid');
    nameError.textContent = '';
  });

  emailInput.addEventListener('input', () => {
    emailInput.classList.remove('input--error');
    emailInput.removeAttribute('aria-invalid');
    emailError.textContent = '';
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Name validation
    if (!nameInput.value.trim()) {
      nameInput.classList.add('input--error');
      nameInput.setAttribute('aria-invalid', 'true');
      nameError.textContent = 'Please enter your name.';
      shakeElement(nameInput);
      valid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      emailInput.classList.add('input--error');
      emailInput.setAttribute('aria-invalid', 'true');
      emailError.textContent = 'Please enter your email.';
      shakeElement(emailInput);
      valid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      emailInput.classList.add('input--error');
      emailInput.setAttribute('aria-invalid', 'true');
      emailError.textContent = 'Please enter a valid email address.';
      shakeElement(emailInput);
      valid = false;
    }

    if (!valid) return;

    // ✅ Success — swap form for thank-you
    form.style.opacity = '0';
    form.style.transition = 'opacity 0.3s ease';

    setTimeout(() => {
      form.style.display = 'none';
      thankYou.classList.add('is-visible');
      thankYou.setAttribute('tabindex', '-1');
      thankYou.focus();
    }, 300);
  });
}

/** Shake animation for invalid fields */
function shakeElement(el) {
  el.style.animation = 'none';
  // Trigger reflow to restart animation
  void el.offsetHeight;
  el.style.animation = 'shake 0.4s ease';
}


/* ── Scroll-Triggered Fade-In ──────────────────────────── */
function initScrollAnimations() {
  // Respect reduced-motion preference
  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReduced) return;

  const targets = document.querySelectorAll(
    '.section:not(.hero)'  // hero is visible on load
  );

  // Set initial hidden state
  targets.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach(section => observer.observe(section));

  // Staggered checklist items
  const checkItems = document.querySelectorAll('.whats-inside__list li');
  checkItems.forEach((item, i) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(12px)';
    item.style.transition = `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s`;
  });

  const checkObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('li');
          items.forEach(item => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          });
          checkObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  const checkList = document.querySelector('.whats-inside__list');
  if (checkList) checkObserver.observe(checkList);
}


/* ── Smooth Scroll for CTA Links ───────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);

      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Move focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });
}

// =============================================
// CUIDADENTE — Script
// =============================================

document.addEventListener('DOMContentLoaded', function () {

  // ---- HEADER SCROLL EFFECT ----
  const header = document.getElementById('header');
  function onScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- HAMBURGER MENU ----
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ---- REVEAL ON SCROLL (IntersectionObserver) ----
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length > 0) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all immediately (screenshots / print)
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // ---- SMOOTH SCROLL ----
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href !== '#') {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerHeight = header ? header.offsetHeight : 80;
          const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    });
  });

  // ---- CONTACT FORM SUBMISSION ----
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
});

async function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  const data = {
    service: formData.get('service') || 'contact_form',
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    subject: formData.get('subject'),
    message: formData.get('message'),
    consent: formData.get('consent') === 'on',
  };

  if (!data.name || !data.email || !data.phone || !data.subject) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }
  if (!data.consent) {
    alert('Por favor, autorize o contacto para continuarmos.');
    return;
  }

  const submitBtn = form.querySelector('.submit-button');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'A enviar...';

  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      alert('Pedido enviado com sucesso! Entraremos em contacto em breve.');
      form.reset();
    } else {
      const err = await response.json().catch(() => ({}));
      alert('Erro ao enviar: ' + (err.message || 'Tente novamente ou ligue para 21 828 20 08.'));
    }
  } catch (err) {
    console.error('Form error:', err);
    alert('Erro de ligação. Ligue directamente para 21 828 20 08.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

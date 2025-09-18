// ===== Utilities =====
const $ = (s, ctx=document) => ctx.querySelector(s);
const $$ = (s, ctx=document) => Array.from(ctx.querySelectorAll(s));

document.addEventListener('DOMContentLoaded', () => {
  // Current year
  $('#year').textContent = new Date().getFullYear();

  // Mobile nav
  const navToggle = $('#navToggle');
  const navList = $('#navList');
  navToggle.addEventListener('click', () => {
    const open = navList.style.display === 'block';
    navList.style.display = open ? 'none' : 'block';
  });
  // Close menu on nav click (mobile)
  $$('#navList a').forEach(a => a.addEventListener('click', ()=> {
    if (window.innerWidth < 980) navList.style.display = 'none';
  }));

  // Smooth scroll offset for sticky header
  const headerHeight = $('.site-header').offsetHeight;
  $$('#navList a, .footer-links a, .header-cta, .btn[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (!hash || !hash.startsWith('#')) return;
      e.preventDefault();
      const target = document.querySelector(hash);
      if (!target) return;
      const y = target.getBoundingClientRect().top + window.scrollY - (headerHeight - 1);
      window.scrollTo({ top: y, behavior: 'smooth' });
      history.pushState(null, '', hash);
    });
  });

  // Scrollspy (highlight active section)
  const sections = ['home','about','services','industries','why','testimonials','contact'];
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        $$('#navList a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) spyObserver.observe(el);
  });

  // Reveal on scroll
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  $$('.reveal').forEach(el => revealObserver.observe(el));

  // Counters
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-counter'), 10);
    const suffix = el.getAttribute('data-suffix') || '+';
    let start = 0;
    const duration = 1200;
    const startTs = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - startTs) / duration);
      const val = Math.floor(p * target);
      el.textContent = `${val}${p === 1 ? suffix : ''}`;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const countersObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  $$('[data-counter]').forEach(el => countersObserver.observe(el));

  // Parallax hero background
  const heroImg = $('.hero-img');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (heroImg) heroImg.style.transform = `translateY(${y * 0.15}px) scale(1.02)`;
  }, { passive: true });

  // Testimonials carousel
  const items = [
    {
      quote: "Absolute IT filled three critical roles in 30 days. Candidate quality was outstanding and the process was seamless.",
      name: "VP Engineering, FinTech"
    },
    {
      quote: "They became an extension of our TA team—our time-to-hire dropped by 40% without sacrificing bar.",
      name: "Director of Talent, HealthTech"
    },
    {
      quote: "Consultants integrated quickly and shipped from week one. Exactly what our roadmap needed.",
      name: "Product Lead, SaaS"
    }
  ];
  const quote = $('#quote');
  const author = $('#author');
  const dots = $('#dots');
  let idx = 0;

  const renderDots = () => {
    dots.innerHTML = '';
    items.forEach((_, i) => {
      const b = document.createElement('button');
      b.className = i === idx ? 'active' : '';
      b.addEventListener('click', () => {
        idx = i; updateTestimonial(true);
      });
      dots.appendChild(b);
    });
  };

  const updateTestimonial = (manual=false) => {
    quote.classList.remove('visible');
    author.classList.remove('visible');
    setTimeout(() => {
      quote.textContent = `“${items[idx].quote}”`;
      author.textContent = `— ${items[idx].name}`;
      renderDots();
      quote.classList.add('visible');
      author.classList.add('visible');
    }, manual ? 50 : 200);
  };

  renderDots();
  updateTestimonial(true);
  let timer = setInterval(() => {
    idx = (idx + 1) % items.length;
    updateTestimonial();
  }, 5000);
  $('#testimonial').addEventListener('mouseenter', ()=> clearInterval(timer));
  $('#testimonial').addEventListener('mouseleave', ()=> {
    timer = setInterval(()=>{ idx = (idx + 1) % items.length; updateTestimonial(); }, 5000);
  });

  // Contact form -> mailto
  $('#contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));
    const body = encodeURIComponent(
      `Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || ''}\nMessage: ${data.message}`
    );
    window.location.href = `mailto:info@absoluting.com?subject=Website%20Inquiry&body=${body}`;
  });
});

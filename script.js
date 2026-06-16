/* ===== KOPERASI SARIMANAH - script.js ===== */

// ── Loading Screen ──────────────────────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hide');
    document.body.classList.remove('loading');
    // Trigger hero animations after load
    document.querySelectorAll('.animate-up').forEach(el => {
      el.style.opacity = '1';
    });
  }, 1600);
});

// ── Navbar Scroll Behavior ──────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('scrollTop').classList.toggle('show', window.scrollY > 400);
});

// ── Hamburger Menu ──────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── Dark Mode Toggle ────────────────────────────────────────────
const darkToggle = document.getElementById('darkModeToggle');
const darkIcon = darkToggle.querySelector('i');

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') applyDark();

function applyDark() {
  document.body.classList.add('dark');
  darkIcon.classList.replace('fa-moon', 'fa-sun');
}
function removeDark() {
  document.body.classList.remove('dark');
  darkIcon.classList.replace('fa-sun', 'fa-moon');
}

darkToggle.addEventListener('click', () => {
  if (document.body.classList.contains('dark')) {
    removeDark();
    localStorage.setItem('theme', 'light');
  } else {
    applyDark();
    localStorage.setItem('theme', 'dark');
  }
});

// ── Scroll to Top ───────────────────────────────────────────────
document.getElementById('scrollTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Copyright Year ──────────────────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ── Counter Animation ───────────────────────────────────────────
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target.toLocaleString('id-ID'); clearInterval(timer); }
    else el.textContent = Math.floor(start).toLocaleString('id-ID');
  }, 16);
}

let countersStarted = false;
function startCounters() {
  if (countersStarted) return;
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    animateCounter(el, parseInt(el.dataset.target));
  });
  countersStarted = true;
}

// ── Intersection Observer – Reveal & Counters ───────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Counter observer (fires when stat-bar is visible)
const statBar = document.querySelector('.stat-bar');
if (statBar) {
  const counterObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { startCounters(); counterObserver.disconnect(); }
  }, { threshold: 0.3 });
  counterObserver.observe(statBar);
}

// ── FAQ Accordion ───────────────────────────────────────────────
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-a');
    const isOpen = btn.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-q.open').forEach(b => {
      b.classList.remove('open');
      b.closest('.faq-item').querySelector('.faq-a').classList.remove('open');
    });

    // Open current if it was closed
    if (!isOpen) {
      btn.classList.add('open');
      answer.classList.add('open');
    }
  });
});

// ── Loan Calculator ─────────────────────────────────────────────
const elNominal   = document.getElementById('nominalPinjaman');
const elAngsuran  = document.getElementById('lamaAngsuran');
const sliderN     = document.getElementById('sliderNominal');
const sliderA     = document.getElementById('sliderAngsuran');

// Sync inputs with sliders
sliderN.addEventListener('input', () => { elNominal.value = sliderN.value; calculate(); });
sliderA.addEventListener('input', () => { elAngsuran.value = sliderA.value; calculate(); });
elNominal.addEventListener('input', () => {
  const v = Math.min(Math.max(parseInt(elNominal.value) || 0, 0), 30000000);
  sliderN.value = v; calculate();
});
elAngsuran.addEventListener('input', () => {
  const v = Math.min(Math.max(parseInt(elAngsuran.value) || 1, 1), 36);
  sliderA.value = v; calculate();
});

// Set defaults
elNominal.value = 5000000;
elAngsuran.value = 12;

function formatRp(n) {
  return 'Rp' + Math.round(n).toLocaleString('id-ID');
}

function calculate() {
  const pokok  = parseFloat(elNominal.value)  || 0;
  const bulan  = parseInt(elAngsuran.value)   || 0;
  const rate   = 0.02; // 2% per bulan menurun

  document.getElementById('resPinjaman').textContent = formatRp(pokok);

  if (pokok <= 0 || bulan <= 0) {
    document.getElementById('resCicilan1').textContent = 'Rp0';
    document.getElementById('resCicilanN').textContent = 'Rp0';
    document.getElementById('resTotal').textContent    = 'Rp0';
    return;
  }

  const angsuranPokok = pokok / bulan;
  let total = 0;
  let cicilan1 = 0, cicilanN = 0;

  for (let i = 1; i <= bulan; i++) {
    const sisaPokok = pokok - angsuranPokok * (i - 1);
    const bunga     = sisaPokok * rate;
    const cicilan   = angsuranPokok + bunga;
    total += cicilan;
    if (i === 1)    cicilan1 = cicilan;
    if (i === bulan) cicilanN = cicilan;
  }

  document.getElementById('resCicilan1').textContent = formatRp(cicilan1);
  document.getElementById('resCicilanN').textContent = formatRp(cicilanN);
  document.getElementById('resTotal').textContent    = formatRp(total);
}

calculate(); // initial render

// ── Contact Form ────────────────────────────────────────────────
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const nama   = document.getElementById('fNama').value.trim();
  const wa     = document.getElementById('fWa').value.trim();
  const pesan  = document.getElementById('fPesan').value.trim();

  if (!nama || !wa || !pesan) {
    showToast('Mohon lengkapi semua kolom.', 'error'); return;
  }
  if (!/^[0-9+\s-]{8,15}$/.test(wa)) {
    showToast('Nomor WhatsApp tidak valid.', 'error'); return;
  }

  // Compose WhatsApp message (fallback since no server)
  const msg = encodeURIComponent(`Halo Koperasi Sarimanah,\n\nNama: ${nama}\nWA: ${wa}\n\nPesan:\n${pesan}`);
  showToast('Pesan berhasil dikirim! Kami akan segera menghubungi Anda.', 'success');
  this.reset();
});

// ── Toast Notification ──────────────────────────────────────────
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;

  Object.assign(toast.style, {
    position: 'fixed', bottom: '80px', right: '24px', zIndex: '9998',
    background: type === 'success' ? '#16a34a' : '#dc2626',
    color: 'white', padding: '14px 20px', borderRadius: '12px',
    fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem', fontWeight: '500',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    display: 'flex', alignItems: 'center', gap: '10px',
    animation: 'slideInRight 0.4s ease',
    maxWidth: '320px'
  });

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// Add slideInRight keyframe dynamically
const style = document.createElement('style');
style.textContent = `@keyframes slideInRight {
  from { transform: translateX(100px); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}`;
document.head.appendChild(style);

// ── Smooth Scroll for all anchor links ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 75;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

// ── Active nav link highlight on scroll ─────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
  });
  navAnchors.forEach(a => {
    a.style.color = '';
    a.style.background = '';
    if (a.getAttribute('href') === '#' + current) {
      a.style.color = 'var(--green)';
      a.style.background = 'rgba(22,163,74,0.08)';
    }
  });
});

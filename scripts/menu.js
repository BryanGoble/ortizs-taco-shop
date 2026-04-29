// ---- Theme Toggle ----
const toggleButton = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const savedTheme = localStorage.getItem('theme') || 'light';

if (savedTheme === 'dark') {
  document.documentElement.setAttribute('data-theme', 'dark');
  themeIcon.textContent = '☀️';
}

toggleButton.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    themeIcon.textContent = '🌙';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    themeIcon.textContent = '☀️';
  }
});

// ---- Tabbed Menu ----
function openMenu(evt, menuName) {
  document.querySelectorAll('.menu').forEach(panel => panel.classList.remove('active'));
  document.querySelectorAll('.tablink').forEach(tab => tab.classList.remove('active'));

  const target = document.getElementById(menuName);
  if (target) target.classList.add('active');
  if (evt && evt.currentTarget) evt.currentTarget.classList.add('active');
}

// ---- Smart Open/Closed Status ----
// Hours: Mon–Sat 8:00am – 9:00pm. Closed Sundays.
function getOpenStatus(now = new Date()) {
  const day = now.getDay(); // 0 = Sun, 1 = Mon, ... 6 = Sat
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const OPEN  = 8 * 60;
  const CLOSE = 21 * 60;

  if (day === 0) {
    return { open: false, message: 'Closed today · opens Monday at 8am' };
  }
  if (minutesNow >= OPEN && minutesNow < CLOSE) {
    return { open: true, message: 'Open now · 8am – 9pm' };
  }
  if (minutesNow < OPEN) {
    return { open: false, message: 'Closed · opens today at 8am' };
  }
  if (day === 6) {
    return { open: false, message: 'Closed · opens Monday at 8am' };
  }
  return { open: false, message: 'Closed · opens tomorrow at 8am' };
}

function updateOpenStatus() {
  const wrapper = document.getElementById('hero-status');
  const textEl = document.getElementById('hero-status-text');
  if (!wrapper || !textEl) return;

  const status = getOpenStatus();
  wrapper.classList.toggle('closed', !status.open);
  textEl.textContent = status.message;
}

document.addEventListener('DOMContentLoaded', () => {
  updateOpenStatus();
  setInterval(updateOpenStatus, 60 * 1000);

  const firstTab = document.querySelector('.tablink');
  if (firstTab) firstTab.click();

  // ---- Scroll-aware Navbar ----
  const navbar = document.getElementById('myNavbar');
  const onScroll = () => {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Scroll Reveal ----
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }
});

/* --- AI PM PORTFOLIO INTERACTIVE CORE JS --- */

document.addEventListener('DOMContentLoaded', () => {

  /* --- 1. THEME SWITCHER (SAKURA PINK ↔ DARK TECH) --- */
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeToggleIcon = document.getElementById('theme-toggle-icon');
  const themeToggleText = document.getElementById('theme-toggle-text');

  // Load saved theme from localStorage or default to 'sakura'
  const savedTheme = localStorage.getItem('portfolio-theme') || 'sakura';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'sakura';
      const newTheme = currentTheme === 'sakura' ? 'dark' : 'sakura';
      applyTheme(newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (document.body) {
      document.body.setAttribute('data-theme', theme);
    }
    if (themeToggleIcon && themeToggleText) {
      if (theme === 'dark') {
        themeToggleIcon.textContent = '🌙';
        themeToggleText.textContent = 'Dark Tech';
      } else {
        themeToggleIcon.textContent = '🌸';
        themeToggleText.textContent = 'Sakura';
      }
    }
  }

  /* --- 2. NAVBAR SCROLL EFFECT & MOBILE MENU TOGGLE --- */
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && e.target !== mobileToggle) {
        navLinks.classList.remove('open');
      }
    });
  }

  /* --- 3. DYNAMIC CUSTOM TRAILING CURSOR & HOVER EFFECTS --- */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorCircle = document.getElementById('cursor-circle');

  if (cursorDot && cursorCircle && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let circleX = mouseX;
    let circleY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function animateCursor() {
      circleX += (mouseX - circleX) * 0.15;
      circleY += (mouseY - circleY) * 0.15;
      cursorCircle.style.left = `${circleX}px`;
      cursorCircle.style.top = `${circleY}px`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverables = document.querySelectorAll('a, button, .glass-card');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hover');
        cursorCircle.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hover');
        cursorCircle.classList.remove('hover');
      });
    });
  }

  /* --- 4. DYNAMIC 3D SAKURA / GLOWING AMBIENT CANVAS ANIMATION --- */
  const canvas = document.getElementById('sakura-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const petalCount = 28;
    const sakuraColors = [
      'rgba(244, 63, 94, 0.45)',
      'rgba(236, 72, 153, 0.4)',
      'rgba(251, 113, 133, 0.35)',
      'rgba(190, 24, 93, 0.3)'
    ];
    const darkColors = [
      'rgba(244, 63, 94, 0.55)',
      'rgba(244, 114, 182, 0.45)',
      'rgba(168, 85, 247, 0.4)',
      'rgba(99, 102, 241, 0.35)'
    ];

    class SakuraPetal {
      constructor(fromTop = false) {
        this.reset(fromTop);
      }

      reset(fromTop = false) {
        this.x = Math.random() * width;
        this.y = fromTop ? -20 : Math.random() * height;
        this.w = 10 + Math.random() * 12;
        this.h = 8 + Math.random() * 10;
        this.vY = 0.8 + Math.random() * 1.2;
        this.vX = -0.4 + Math.random() * 0.8;
        this.rX = Math.random() * Math.PI;
        this.rY = Math.random() * Math.PI;
        this.rZ = Math.random() * Math.PI * 2;
        this.vrX = 0.01 + Math.random() * 0.02;
        this.vrY = 0.01 + Math.random() * 0.02;
        this.vrZ = 0.005 + Math.random() * 0.015;
        this.swayFreq = 0.005 + Math.random() * 0.01;
        this.time = Math.random() * 100;
        this.colorIdx = Math.floor(Math.random() * sakuraColors.length);
      }

      update() {
        this.time += this.swayFreq;
        this.y += this.vY;
        this.x += this.vX + Math.sin(this.time) * 0.3;
        this.rX += this.vrX;
        this.rY += this.vrY;
        this.rZ += this.vrZ;

        if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
          this.reset(true);
        }
      }

      draw() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const activeColor = isDark ? darkColors[this.colorIdx] : sakuraColors[this.colorIdx];

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rZ);
        ctx.scale(Math.sin(this.rX), Math.cos(this.rY));
        ctx.beginPath();
        ctx.fillStyle = activeColor;
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.w / 2, -this.h / 2, -this.w, this.h / 3, 0, this.h);
        ctx.bezierCurveTo(this.w, this.h / 3, this.w / 2, -this.h / 2, 0, 0);
        ctx.fill();
        ctx.restore();
      }
    }

    const petals = [];
    for (let i = 0; i < petalCount; i++) {
      petals.push(new SakuraPetal(false));
    }

    function renderSakura() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < petalCount; i++) {
        petals[i].update();
        petals[i].draw();
      }
      requestAnimationFrame(renderSakura);
    }
    renderSakura();
  }
});

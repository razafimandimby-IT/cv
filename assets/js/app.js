(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const header = document.querySelector('.site-header');
  const navLinks = [...document.querySelectorAll('.main-nav a')];
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');

  root.classList.add('js');

  const premiumStyle = document.createElement('link');
  premiumStyle.rel = 'stylesheet';
  premiumStyle.href = 'assets/css/premium.css';
  document.head.appendChild(premiumStyle);

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    root.dataset.theme = savedTheme;
  } else if (window.matchMedia?.('(prefers-color-scheme: light)').matches) {
    root.dataset.theme = 'light';
  }

  const syncThemeColor = () => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    meta.setAttribute('content', root.dataset.theme === 'light' ? '#f4f7f6' : '#08110e');
  };

  syncThemeColor();

  themeToggle?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', root.dataset.theme);
    syncThemeColor();
  });

  const closeMenu = () => {
    nav?.classList.remove('open');
    menuToggle?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Ouvrir le menu');
  };

  menuToggle?.addEventListener('click', () => {
    const open = !nav?.classList.contains('open');
    nav?.classList.toggle('open', open);
    menuToggle.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });

  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1000) closeMenu();
  }, { passive: true });

  const initReadingProgress = () => {
    const bar = document.createElement('div');
    bar.className = 'reading-progress';
    bar.setAttribute('aria-hidden', 'true');
    const fill = document.createElement('span');
    bar.appendChild(fill);
    body.prepend(bar);

    const update = () => {
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const ratio = Math.min(1, Math.max(0, window.scrollY / scrollable));
      fill.style.transform = `scaleX(${ratio})`;
      header?.classList.toggle('is-scrolled', window.scrollY > 18);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
  };

  const initHeroWelcome = () => {
    const hero = document.querySelector('.hero');
    const copy = hero?.querySelector('.hero-copy');
    if (!hero || !copy) return;

    const ordered = [
      copy.querySelector('.eyebrow'),
      copy.querySelector('.hero-role'),
      copy.querySelector('h1'),
      copy.querySelector('.hero-lead'),
      copy.querySelector('.hero-domains'),
      copy.querySelector('.hero-actions')
    ].filter(Boolean);

    ordered.forEach((element, index) => {
      element.classList.add('hero-intro-item');
      element.style.setProperty('--intro-order', index);
    });

    const card = hero.querySelector('.executive-card');
    if (card) {
      card.classList.add('hero-intro-card');
      card.style.setProperty('--intro-order', ordered.length);
    }

    const ambience = document.createElement('div');
    ambience.className = 'hero-ambience';
    ambience.setAttribute('aria-hidden', 'true');

    ['orb-a', 'orb-b', 'orb-c'].forEach(className => {
      const orb = document.createElement('span');
      orb.className = `ambient-orb ${className}`;
      ambience.appendChild(orb);
    });

    hero.prepend(ambience);
    requestAnimationFrame(() => root.classList.add('hero-welcome-ready'));
  };

  const revealSelectors = [
    '.section-heading',
    '.profile-panel',
    '.expertise-card',
    '.delivery-flow',
    '.case-study',
    '.project-card',
    '.experience-card',
    '.skills-grid > article',
    '.education-main',
    '.cert-list > article',
    '.languages',
    '.contact-shell',
    '.site-footer .container'
  ];

  const initReveal = () => {
    const elements = [...document.querySelectorAll(revealSelectors.join(','))];
    if (!elements.length) return;

    const groups = new Map();
    elements.forEach(element => {
      element.classList.add('reveal-item');
      const parent = element.parentElement;
      if (!groups.has(parent)) groups.set(parent, []);
      groups.get(parent).push(element);
    });

    groups.forEach(group => {
      group.forEach((element, index) => {
        element.style.setProperty('--reveal-order', Math.min(index, 7));
      });
    });

    if (reduceMotion?.matches || !('IntersectionObserver' in window)) {
      elements.forEach(element => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.12
    });

    elements.forEach(element => observer.observe(element));
  };

  const initNavigationSpy = () => {
    const sections = [...document.querySelectorAll('main section[id]')];
    if (!sections.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;

      navLinks.forEach(link => {
        const active = link.getAttribute('href') === `#${visible.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }, {
      rootMargin: '-22% 0px -62% 0px',
      threshold: [0.05, 0.2, 0.5]
    });

    sections.forEach(section => observer.observe(section));
  };

  const initCardSpotlight = () => {
    if (reduceMotion?.matches || !window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return;

    const cards = document.querySelectorAll([
      '.executive-card',
      '.profile-panel',
      '.expertise-card',
      '.case-study',
      '.project-card',
      '.experience-card',
      '.education-main',
      '.cert-list article',
      '.contact-shell'
    ].join(','));

    cards.forEach(card => {
      card.classList.add('premium-card');

      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--pointer-x', `${x}%`);
        card.style.setProperty('--pointer-y', `${y}%`);
      }, { passive: true });

      card.addEventListener('pointerleave', () => {
        card.style.removeProperty('--pointer-x');
        card.style.removeProperty('--pointer-y');
      }, { passive: true });
    });
  };

  const initMagneticButtons = () => {
    if (reduceMotion?.matches || !window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return;

    document.querySelectorAll('.btn, .theme-toggle').forEach(button => {
      button.addEventListener('pointermove', event => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - (rect.left + rect.width / 2);
        const y = event.clientY - (rect.top + rect.height / 2);
        button.style.setProperty('--magnetic-x', `${x * 0.07}px`);
        button.style.setProperty('--magnetic-y', `${y * 0.07}px`);
      }, { passive: true });

      button.addEventListener('pointerleave', () => {
        button.style.setProperty('--magnetic-x', '0px');
        button.style.setProperty('--magnetic-y', '0px');
      }, { passive: true });
    });
  };

  const initMetricEntrance = () => {
    const metrics = document.querySelectorAll('.executive-metrics > div');
    metrics.forEach((metric, index) => metric.style.setProperty('--metric-order', index));
  };

  const initSectionAccents = () => {
    document.querySelectorAll('.section').forEach(section => {
      section.classList.add('premium-section');
    });

    document.querySelectorAll('.section-kicker').forEach(kicker => {
      kicker.classList.add('animated-kicker');
    });
  };

  const init = () => {
    initReadingProgress();
    initHeroWelcome();
    initReveal();
    initNavigationSpy();
    initCardSpotlight();
    initMagneticButtons();
    initMetricEntrance();
    initSectionAccents();
    root.classList.add('premium-ready');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();

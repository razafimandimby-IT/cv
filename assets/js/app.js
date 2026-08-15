(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const navLinks = [...document.querySelectorAll('.main-nav a')];

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    root.dataset.theme = savedTheme;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    root.dataset.theme = 'light';
  }

  themeToggle?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', root.dataset.theme);
  });

  const closeMenu = () => {
    nav?.classList.remove('open');
    menuToggle?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  };

  menuToggle?.addEventListener('click', () => {
    const open = !nav?.classList.contains('open');
    nav?.classList.toggle('open', open);
    menuToggle.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  const sections = [...document.querySelectorAll('main section[id]')];
  if ('IntersectionObserver' in window) {
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
    }, { rootMargin: '-20% 0px -65% 0px', threshold: [0.05, 0.2, 0.5] });

    sections.forEach(section => observer.observe(section));
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1000) closeMenu();
  });
})();

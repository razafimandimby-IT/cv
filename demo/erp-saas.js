(() => {
  'use strict';
  const root = document.documentElement;
  const build = '20260818c';
  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (_) { saved = null; }
  if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  else root.dataset.theme = window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

  ['erp-v2-calendar.css','erp-v2-itam.css','erp-v2-theme.css','erp-v2-product.css','erp-v2-hotfix.css'].forEach(name => {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = `${name}?v=${build}`;
    document.head.appendChild(css);
  });

  const loadScript = (src, onload) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    if (onload) script.addEventListener('load', onload, { once: true });
    script.addEventListener('error', () => console.error(`[ERP Demo] Impossible de charger ${src}`), { once: true });
    document.head.appendChild(script);
  };

  const modules = [
    'erp-v2-base.js',
    'erp-v2-calendar.js',
    'erp-v2-calendar-data.js',
    'erp-v2-itam-data.js',
    'erp-v2-itam-actions.js',
    'erp-v2-init.js'
  ];
  const loadModules = index => {
    if (index >= modules.length) return;
    loadScript(`${modules[index]}?v=${build}`, () => loadModules(index + 1));
  };

  loadScript(`erp-v2-preflight.js?v=${build}`, () => {
    loadScript(`erp-saas-core.js?v=${build}`, () => loadModules(0));
  });
})();

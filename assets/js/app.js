(() => {
  'use strict';

  const version = '20260818-supportops-cta-theme';

  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = `assets/css/supportops-cv.css?v=${version}`;
  document.head.appendChild(style);

  const loadScript = (src, done) => {
    const script = document.createElement('script');
    script.src = `${src}?v=${version}`;
    script.async = false;
    if (done) script.addEventListener('load', done, { once: true });
    document.head.appendChild(script);
  };

  loadScript('assets/js/app-core.js', () => {
    loadScript('assets/js/supportops-cv.js');
  });
})();

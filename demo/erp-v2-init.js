(() => {
  'use strict';
  const NS = window.ERP_DEMO_V2 || {};
  const init = () => {
    NS.initBase?.();
    NS.initCalendar?.();
    NS.initItam?.();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();

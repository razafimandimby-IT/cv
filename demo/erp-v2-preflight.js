(() => {
  'use strict';

  const section = document.querySelector('section#calendar');
  const nav = document.querySelector('.nav');
  const back = document.querySelector('.back');

  if (nav && back) {
    nav.appendChild(back);
    back.classList.add('nav-back-bottom');
  }

  if (!section) return;

  const originalMarkup = section.innerHTML;
  let restoring = false;

  const restoreCalendarShell = () => {
    if (restoring) return;
    if (section.querySelector('.view[data-view="cal-main"]')) return;

    restoring = true;
    section.innerHTML = originalMarkup;
    restoring = false;

    queueMicrotask(() => {
      const ns = window.ERP_DEMO_V2;
      ns?.renderCalendar?.();
      ns?.renderLeaveDashboard?.();
    });
  };

  const observer = new MutationObserver(restoreCalendarShell);
  observer.observe(section, { childList: true, subtree: false });

  window.ERP_CALENDAR_GUARD = {
    restore: restoreCalendarShell,
    observer
  };
})();

(() => {
  'use strict';
  const NS = window.ERP_DEMO_V2 = window.ERP_DEMO_V2 || {};
  const $ = NS.$ = (s, r = document) => r.querySelector(s);
  const $$ = NS.$$ = (s, r = document) => [...r.querySelectorAll(s)];
  NS.reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  NS.root = document.documentElement;
  NS.root.classList.add('erp-v2');

  NS.safeText = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  NS.fmtMoney = value => `${new Intl.NumberFormat('fr-FR').format(value)} Ar`;
  NS.badge = status => {
    const map = {active:['ok','En service'],maintenance:['warn','Maintenance'],stock:['blue','En stock'],retired:['','Retiré'],down:['danger','Hors service'],approved:['ok','Approuvé'],pending:['warn','En attente'],rejected:['danger','Rejeté'],planned:['blue','Planifié'],in_progress:['warn','En cours'],done:['ok','Terminé']};
    const x = map[status] || ['', status];
    return `<span class="badge ${x[0]}">${x[1]}</span>`;
  };
  NS.openModal = (title, body, actions = '') => {
    const bg=$('#modalBg'), t=$('#modalTitle'), b=$('#modalBody'), a=$('#modalActions');
    if(!bg||!t||!b||!a) return;
    t.textContent=title; b.innerHTML=body; a.innerHTML=actions||'<button class="btn" data-close-modal>Fermer</button>'; bg.hidden=false; $('.modal')?.focus();
  };
  NS.toast = message => {
    const t=$('#toast'); if(!t) return; t.textContent=message; t.classList.add('show'); clearTimeout(NS.toastTimer); NS.toastTimer=setTimeout(()=>t.classList.remove('show'),2200);
  };

  NS.moduleLabels = {dashboard:'Dashboard',rh:'Ressources humaines',pointage:'Pointage',bridge:'Bridge biométrique',crm:'CRM',ged:'GED',helpdesk:'HelpDesk',achats:'Achats',stock:'Supply Chain & Stock',calendar:'Calendrier & congés',messages:'Messagerie',parc:'Parc IT',architecture:'Architecture'};
  NS.notifications = [
    ['warning','SLA HelpDesk','HD-1042 approche de sa fenêtre de traitement.','Il y a 12 min'],
    ['info','Congé à valider','LV-204 · Fara Ramanantsoa · 3 jours.','Il y a 34 min'],
    ['success','Edge biométrique','Les deux terminaux sont synchronisés, aucun retry.','Il y a 1 h'],
    ['info','Parc IT','Une garantie arrive à échéance dans moins de 90 jours.','Il y a 2 h']
  ];
  NS.auditEvents = [
    ['08:52','RH','Congé LV-201 approuvé','Fara R.'],['08:41','HelpDesk','Ticket HD-1042 pris en charge','Aina R.'],['08:28','Messagerie','Message envoyé dans Équipe IT','Utilisateur démo'],['08:12','Supply Chain','PO-2608-18 prêt pour réception','Hery R.'],['07:58','Bridge','Heartbeat Edge .106 reçu','system']
  ];

  NS.syncTheme = () => {
    const btn=$('#erpThemeToggle'); if(!btn) return;
    const dark=NS.root.dataset.theme!=='light';
    btn.innerHTML=`<span aria-hidden="true">${dark?'☀':'◐'}</span><b>${dark?'Clair':'Sombre'}</b>`;
    btn.title=dark?'Passer au thème clair':'Passer au thème sombre';
    let meta=$('meta[name="theme-color"]'); if(!meta){meta=document.createElement('meta');meta.name='theme-color';document.head.appendChild(meta)} meta.content=dark?'#07100d':'#f4f6f8';
  };
  NS.toggleTheme = () => { NS.root.dataset.theme=NS.root.dataset.theme==='light'?'dark':'light'; try{localStorage.setItem('theme',NS.root.dataset.theme)}catch(_){} NS.syncTheme(); };

  NS.renderCommandResults = query => {
    const box=$('#erpCommandResults'); if(!box) return;
    const items=[...Object.entries(NS.moduleLabels).map(([id,label])=>({id:`module:${id}`,label,hint:'Module ERP',icon:'↗'})),{id:'action:theme',label:'Basculer thème clair / sombre',hint:'Interface',icon:'◐'},{id:'action:notifications',label:'Ouvrir le centre de notifications',hint:'Supervision',icon:'◉'},{id:'action:new-event',label:'Créer un événement calendrier',hint:'Calendrier',icon:'＋'},{id:'action:new-asset',label:'Créer un actif Parc IT',hint:'ITAM',icon:'＋'}];
    const q=String(query||'').trim().toLowerCase(), filtered=items.filter(i=>`${i.label} ${i.hint}`.toLowerCase().includes(q)).slice(0,14);
    box.innerHTML=filtered.length?filtered.map(i=>`<button type="button" data-v2-command="${i.id}"><i>${i.icon}</i><span><b>${NS.safeText(i.label)}</b><small>${NS.safeText(i.hint)}</small></span><kbd>Entrée</kbd></button>`).join(''):'<div class="command-empty">Aucun résultat.</div>';
  };
  NS.toggleCommand = open => { const bg=$('#erpCommandPalette'); if(!bg)return; const next=open??bg.hidden; bg.hidden=!next; if(next){const input=$('#erpCommandSearch'); if(input){input.value='';NS.renderCommandResults('');setTimeout(()=>input.focus(),0)}} };
  NS.toggleDrawer = open => { const d=$('#erpDrawer'),s=$('#erpDrawerScrim'); if(!d||!s)return; const next=open??!d.classList.contains('open'); d.classList.toggle('open',next); d.setAttribute('aria-hidden',String(!next)); s.hidden=!next; };
  NS.setBreadcrumb = module => { const n=$('#erpBreadcrumbModule'); if(n)n.textContent=NS.moduleLabels[module]||module; };

  NS.addProductChrome = () => {
    const topFirst=$('.top > div:first-child');
    if(topFirst&&!$('#erpBreadcrumb')) topFirst.insertAdjacentHTML('afterbegin','<div class="erp-breadcrumb" id="erpBreadcrumb"><span>ERP SaaS</span><i>›</i><b id="erpBreadcrumbModule">Dashboard</b></div>');
    const actions=$('.top .actions');
    if(actions&&!$('#erpThemeToggle')){
      actions.insertAdjacentHTML('beforeend','<span class="pill rbac-pill"><i class="rbac-dot"></i> RBAC actif</span><button type="button" class="btn command-button" id="erpCommandButton" aria-label="Ouvrir la palette de commandes"><span>⌘</span><b>Rechercher</b><kbd>Ctrl K</kbd></button><button type="button" class="btn notify-button" id="erpNotifications" aria-label="Ouvrir les notifications"><span aria-hidden="true">◉</span><b>Alertes</b><em>4</em></button><button type="button" class="btn theme-switch" id="erpThemeToggle" aria-label="Changer le thème clair ou sombre"></button>');
    }
    if(!$('#erpDrawer')) document.body.insertAdjacentHTML('beforeend',`<aside class="erp-drawer" id="erpDrawer" aria-hidden="true"><div class="drawer-head"><div><span class="kicker">Centre opérationnel</span><h2>Notifications & audit</h2></div><button class="icon" type="button" data-v2-drawer-close aria-label="Fermer">×</button></div><div class="drawer-tabs"><button class="active" type="button" data-v2-drawer-tab="notifications">Notifications <span>4</span></button><button type="button" data-v2-drawer-tab="audit">Audit trail</button></div><div class="drawer-view active" data-drawer-view="notifications">${NS.notifications.map((n,i)=>`<button class="notification-item" type="button" data-v2-notification="${i}"><i class="${n[0]}"></i><div><b>${NS.safeText(n[1])}</b><span>${NS.safeText(n[2])}</span><small>${NS.safeText(n[3])}</small></div></button>`).join('')}</div><div class="drawer-view" data-drawer-view="audit"><div class="audit-list">${NS.auditEvents.map(a=>`<div><time>${a[0]}</time><span class="audit-module">${NS.safeText(a[1])}</span><p><b>${NS.safeText(a[2])}</b><small>${NS.safeText(a[3])}</small></p></div>`).join('')}</div><p class="muted drawer-note">Journal de démonstration : aucune donnée réelle ni identifiant sensible n'est exposé.</p></div></aside><div class="drawer-scrim" id="erpDrawerScrim" hidden></div>`);
    if(!$('#erpCommandPalette')) document.body.insertAdjacentHTML('beforeend','<div class="command-palette-bg" id="erpCommandPalette" hidden><section class="command-palette" role="dialog" aria-modal="true" aria-labelledby="commandTitle"><div class="command-search"><span>⌘</span><input id="erpCommandSearch" autocomplete="off" placeholder="Rechercher un module ou une action…" aria-label="Rechercher une commande"><kbd>Esc</kbd></div><div class="command-meta"><span id="commandTitle">Navigation rapide</span><small>Ctrl/Cmd + K</small></div><div class="command-results" id="erpCommandResults"></div></section></div>');
    NS.renderCommandResults(''); NS.syncTheme();
  };

  NS.addDashboardInsights = () => {
    const dashboard=$('#dashboard'), metrics=$('.metrics.six',dashboard); if(!dashboard||!metrics||$('.v2-dashboard-insights',dashboard))return;
    metrics.insertAdjacentHTML('afterend','<div class="grid two section v2-dashboard-insights"><article class="card glass-panel"><div class="card-headline"><div><span class="kicker">Pilotage opérationnel</span><h3>Activité des modules · 7 jours</h3></div><span class="badge ok">Stable</span></div><div class="mini-chart" aria-label="Histogramme activité sur sept jours"><span style="--v:42%"><i>Lun</i></span><span style="--v:58%"><i>Mar</i></span><span style="--v:49%"><i>Mer</i></span><span style="--v:76%"><i>Jeu</i></span><span style="--v:64%"><i>Ven</i></span><span style="--v:31%"><i>Sam</i></span><span style="--v:37%"><i>Dim</i></span></div><div class="chart-legend"><span><b>1 284</b> opérations métier</span><span><b>99,4%</b> succès jobs</span><span><b>0</b> erreur bloquante démo</span></div></article><article class="card glass-panel"><div class="card-headline"><div><span class="kicker">À surveiller</span><h3>Priorités du tenant</h3></div><button class="btn compact" type="button" data-v2-open-audit>Audit</button></div><div class="priority-list"><button data-module="helpdesk"><i class="danger"></i><span><b>Ticket VPN urgent</b><small>HD-1042 · SLA 01h42</small></span><em>HelpDesk</em></button><button data-module="calendar"><i class="warn"></i><span><b>Congé en attente</b><small>LV-204 · 3 jours</small></span><em>RH</em></button><button data-module="parc"><i class="warn"></i><span><b>Garantie à surveiller</b><small>Parc IT · 3 actifs</small></span><em>ITAM</em></button><button data-module="stock"><i class="success"></i><span><b>Supply Chain</b><small>WMS / ledger cohérents</small></span><em>Stock</em></button></div></article></div>');
  };

  NS.animateActivePage = () => {
    if(NS.reduceMotion?.matches)return; const page=$('.page.active'); if(!page?.animate)return;
    $$(':scope > .hero,:scope > .metrics,:scope > .grid,:scope > .tabs,:scope > .view.active > .metrics,:scope > .view.active > .grid,:scope > .view.active > .tablewrap,:scope > .view.active > .toolbar',page).slice(0,12).forEach((el,i)=>el.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:360,delay:i*38,easing:'cubic-bezier(.2,.8,.2,1)',fill:'both'}));
  };

  NS.bindBase = () => {
    document.addEventListener('click',e=>{
      const mod=e.target.closest('[data-module]'); if(mod)setTimeout(()=>{NS.setBreadcrumb(mod.dataset.module); if(mod.dataset.module==='calendar')NS.onCalendarModule?.(); if(mod.dataset.module==='parc')NS.onItamModule?.(); NS.animateActivePage();},0);
      if(e.target.closest('#erpThemeToggle')){NS.toggleTheme();return}
      if(e.target.closest('#erpNotifications')){NS.toggleDrawer(true);return}
      if(e.target.closest('[data-v2-drawer-close]')||e.target.id==='erpDrawerScrim'){NS.toggleDrawer(false);return}
      const dt=e.target.closest('[data-v2-drawer-tab]'); if(dt){$$('.drawer-tabs button').forEach(b=>b.classList.toggle('active',b===dt));$$('.drawer-view').forEach(v=>v.classList.toggle('active',v.dataset.drawerView===dt.dataset.v2DrawerTab));return}
      if(e.target.closest('#erpCommandButton')){NS.toggleCommand(true);return}
      if(e.target.closest('[data-v2-open-audit]')){NS.toggleDrawer(true);$('[data-v2-drawer-tab="audit"]')?.click();return}
      const cmd=e.target.closest('[data-v2-command]'); if(cmd){const id=cmd.dataset.v2Command;NS.toggleCommand(false);if(id.startsWith('module:'))$(`.side [data-module="${id.split(':')[1]}"]`)?.click();else if(id==='action:theme')NS.toggleTheme();else if(id==='action:notifications')NS.toggleDrawer(true);else if(id==='action:new-event'){$('.side [data-module="calendar"]')?.click();setTimeout(()=>NS.openCalendarEventForm?.(),0)}else if(id==='action:new-asset'){$('.side [data-module="parc"]')?.click();setTimeout(()=>NS.openNewAsset?.(),0)}return}
    });
    document.addEventListener('input',e=>{if(e.target.id==='erpCommandSearch')NS.renderCommandResults(e.target.value)});
    document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();NS.toggleCommand(true)}else if(e.key==='Escape'){NS.toggleCommand(false);NS.toggleDrawer(false)}else if(e.key==='Enter'&&!$('#erpCommandPalette')?.hidden&&e.target.id==='erpCommandSearch')$('#erpCommandResults button')?.click()});
    $('#erpCommandPalette')?.addEventListener('click',e=>{if(e.target.id==='erpCommandPalette')NS.toggleCommand(false)});
    window.addEventListener('scroll',()=>$('.top')?.classList.toggle('is-scrolled',window.scrollY>12),{passive:true});
  };

  NS.initBase = () => { NS.addProductChrome(); NS.addDashboardInsights(); NS.setBreadcrumb('dashboard'); NS.bindBase(); NS.animateActivePage(); };
})();

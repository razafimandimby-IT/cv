(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const pageTitles={
    dashboard:['Support Operations Center','ITSM, automatisation, SLA et observabilité dans une seule console de pilotage.'],
    incidents:['Incidents & ITSM','Qualification, priorité, SLA, automatisation et escalade dans un workflow unique.'],
    automation:['Automation Center','Bibliothèque de runbooks Python, PowerShell et Bash avec exécution simulée et gouvernée.'],
    sla:['SLA Management','Objectifs de prise en charge, résolution, risque de dépassement et conformité globale.'],
    monitoring:['Monitoring & Observability','Services, métriques techniques, disponibilité et signaux Prometheus consolidés.'],
    alerts:['Alert Center','Corrélation des alertes techniques et conversion en incidents ITSM.'],
    knowledge:['Knowledge Base','Procédures, diagnostics, erreurs connues et runbooks réutilisables.'],
    analytics:['Analytics & Automation ROI',"Visualiser l'impact opérationnel de l'automatisation sur le support."],
    project:['Automation Program','Pilotage de la feuille de route, backlog, équipe et amélioration continue.'],
    architecture:['Architecture SupportOps','Architecture cible d’une plateforme ITSM + automation + observabilité.']
  };
  const toast=msg=>{const t=$('#toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(window.__soV2Hotfix);window.__soV2Hotfix=setTimeout(()=>t.classList.remove('show'),2200)};
  const modal=(title,body)=>{const bg=$('#modalBg'),h=$('#modalTitle'),b=$('#modalBody'),a=$('#modalActions');if(!bg||!h||!b||!a)return;h.textContent=title;b.innerHTML=body;a.innerHTML='<button class="btn" data-close-modal>Fermer</button>';bg.hidden=false};

  function forcePage(id){
    if(!pageTitles[id])return;
    $$('.page').forEach(p=>p.classList.toggle('active',p.id===id));
    $$('.side-nav [data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===id));
    const [title,subtitle]=pageTitles[id];
    const crumb=$('#breadcrumbPage'),h=$('#pageTitle'),sub=$('#pageSubtitle');
    if(crumb)crumb.textContent=title;if(h)h.textContent=title;if(sub)sub.textContent=subtitle;
    const page=$(`#${id}`);
    if(page){
      const firstTab=$('.v2-tabs [data-v2-tab="overview"]',page)||$('.v2-tabs [data-v2-tab]',page);
      if(firstTab){
        $$('.v2-tabs [data-v2-tab]',page).forEach(b=>b.classList.toggle('active',b===firstTab));
        $$('.v2-panel',page).forEach(p=>p.classList.toggle('active',p.dataset.v2Panel===(firstTab.dataset.v2Tab||'overview')));
      }
    }
    $('#sidebar')?.classList.remove('open');
    const scrim=$('#scrim');if(scrim)scrim.hidden=true;
    try{window.scrollTo({top:0,behavior:'auto'})}catch(_){}
  }

  document.addEventListener('click',e=>{
    const nav=e.target.closest('.side-nav [data-page]');
    if(nav){
      e.preventDefault();
      forcePage(nav.dataset.page);
      toast(`${pageTitles[nav.dataset.page][0]} · module V2 ouvert`);
      return;
    }
    const service=e.target.closest('#serviceMap .service-node');
    if(service){const name=service.querySelector('b')?.textContent||'Service';const status=service.querySelector('.node-state')?.textContent.trim()||'—';const availability=service.querySelector('span')?.textContent||'—';modal(`Service · ${name}`,`<div class="kv"><div><span>État</span><b>${status}</b></div><div><span>Disponibilité</span><b>${availability.replace('Disponibilité 30j · ','')}</b></div><div><span>Supervision</span><b>Prometheus / synthetic checks</b></div><div><span>Owner</span><b>Équipe fictive SupportOps</b></div></div><p class="muted">Drill-down de démonstration : aucune télémétrie réelle n'est interrogée.</p>`);return}
    if(e.target.closest('[data-v2-save-policy]')){toast('Politique SLA enregistrée uniquement dans la démo');return}
    if(e.target.closest('[data-v2-recluster]')){const btn=e.target.closest('[data-v2-recluster]');btn.disabled=true;btn.textContent='Analyse…';setTimeout(()=>{btn.disabled=false;btn.textContent='Recalculer les candidats';toast('3 clusters récurrents détectés dans la simulation')},650);return}
    const dep=e.target.closest('[data-v2-dependency-mode]');if(dep){const map=$('#v2DependencyMap');map?.classList.toggle('impact-mode');dep.textContent=map?.classList.contains('impact-mode')?'Mode normal':'Mode impact';const detail=$('#v2DependencyDetail');if(detail)detail.textContent=map?.classList.contains('impact-mode')?'Mode impact : API Legacy est le composant fictif le plus dégradé et propage un risque vers les services dépendants.':'Sélectionnez un service pour voir ses dépendances.';return}
    const end=e.target.closest('[data-v2-end-silence]');if(end){end.closest('article')?.remove();toast(`Silence ${end.dataset.v2EndSilence} terminé dans la démo`);return}
    const action=e.target.closest('[data-v2-new-probe],[data-v2-new-route],[data-v2-new-silence],[data-v2-new-known],[data-v2-new-milestone],[data-v2-new-risk],[data-v2-new-major],[data-v2-new-postmortem]');
    if(action){setTimeout(()=>{const title=$('#modalTitle');if(title)title.dataset.v2Source='creation'},0)}
  },true);

  document.addEventListener('dblclick',e=>{const node=e.target.closest('[data-v2-dependency]');if(node)toast(`Focus dépendance : ${node.dataset.v2Dependency}`)});

  window.SupportOpsV2Nav={open:forcePage};
  document.documentElement.classList.add('supportops-v2-ready');
  const badge=$('#v2VersionBadge');if(badge)badge.title='SupportOps V2 chargé — navigation renforcée';
})();

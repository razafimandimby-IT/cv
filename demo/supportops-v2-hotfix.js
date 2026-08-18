(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const toast=msg=>{const t=$('#toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(window.__soV2Hotfix);window.__soV2Hotfix=setTimeout(()=>t.classList.remove('show'),2200)};
  const modal=(title,body)=>{const bg=$('#modalBg'),h=$('#modalTitle'),b=$('#modalBody'),a=$('#modalActions');if(!bg||!h||!b||!a)return;h.textContent=title;b.innerHTML=body;a.innerHTML='<button class="btn" data-close-modal>Fermer</button>';bg.hidden=false};
  document.addEventListener('click',e=>{
    const service=e.target.closest('#serviceMap .service-node');
    if(service){const name=service.querySelector('b')?.textContent||'Service';const status=service.querySelector('.node-state')?.textContent.trim()||'—';const availability=service.querySelector('span')?.textContent||'—';modal(`Service · ${name}`,`<div class="kv"><div><span>État</span><b>${status}</b></div><div><span>Disponibilité</span><b>${availability.replace('Disponibilité 30j · ','')}</b></div><div><span>Supervision</span><b>Prometheus / synthetic checks</b></div><div><span>Owner</span><b>Équipe fictive SupportOps</b></div></div><p class="muted">Drill-down de démonstration : aucune télémétrie réelle n'est interrogée.</p>`);return}
    if(e.target.closest('[data-v2-save-policy]')){toast('Politique SLA enregistrée uniquement dans la démo');return}
    if(e.target.closest('[data-v2-recluster]')){const btn=e.target.closest('[data-v2-recluster]');btn.disabled=true;btn.textContent='Analyse…';setTimeout(()=>{btn.disabled=false;btn.textContent='Recalculer les candidats';toast('3 clusters récurrents détectés dans la simulation')},650);return}
    const dep=e.target.closest('[data-v2-dependency-mode]');if(dep){const map=$('#v2DependencyMap');map?.classList.toggle('impact-mode');dep.textContent=map?.classList.contains('impact-mode')?'Mode normal':'Mode impact';$('#v2DependencyDetail').textContent=map?.classList.contains('impact-mode')?'Mode impact : API Legacy est le composant fictif le plus dégradé et propage un risque vers les services dépendants.':'Sélectionnez un service pour voir ses dépendances.';return}
    const end=e.target.closest('[data-v2-end-silence]');if(end){end.closest('article')?.remove();toast(`Silence ${end.dataset.v2EndSilence} terminé dans la démo`);return}
    const policy=e.target.closest('[data-v2-new-policy]');if(policy){return}
    const action=e.target.closest('[data-v2-new-probe],[data-v2-new-route],[data-v2-new-silence],[data-v2-new-known],[data-v2-new-milestone],[data-v2-new-risk],[data-v2-new-major],[data-v2-new-postmortem]');
    if(action){setTimeout(()=>{const title=$('#modalTitle');if(title)title.dataset.v2Source='creation'},0)}
  },true);
  document.addEventListener('dblclick',e=>{const node=e.target.closest('[data-v2-dependency]');if(node)toast(`Focus dépendance : ${node.dataset.v2Dependency}`)});
})();

(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const uid = () => `demo-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const icons = {
    grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v17H7.5A3.5 3.5 0 0 0 4 22z"/><path d="M4 5.5V22M8 6h8M8 10h7"/></svg>',
    gauge:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 18a8 8 0 1 1 16 0"/><path d="m12 14 4-5"/><path d="M6 18h12"/></svg>',
    chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>'
  };
  $$('[data-icon]').forEach(node => node.outerHTML = icons[node.dataset.icon] || '');

  const sources = [
    {id:'S1', name:'Brief fictif du projet', scope:'Dossier', version:'1.2', date:'05/11/2026', description:'Données inventées pour cette démonstration publique. Aucun client réel.'},
    {id:'S2', name:'Plan de masse fictif', scope:'Dossier', version:'Démo A', date:'05/11/2026', description:'Caractéristiques illustratives utilisées pour expliquer la comparaison règle / projet.'},
    {id:'O1', name:'Géoportail de l’urbanisme', scope:'Source officielle', version:'Consultation simulée', date:'05/11/2026', url:'https://www.geoportail-urbanisme.gouv.fr/', description:'Point d’entrée public vers les documents d’urbanisme. La démo ne réalise aucune requête réelle.'},
    {id:'O2', name:'Géorisques', scope:'Source officielle', version:'Consultation simulée', date:'05/11/2026', url:'https://www.georisques.gouv.fr/', description:'Portail public des risques. Toute conclusion doit être confirmée sur la parcelle exacte.'},
    {id:'O3', name:'Code de l’urbanisme · Légifrance', scope:'National', version:'Lien public', date:'05/11/2026', url:'https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006074075/', description:'Référentiel juridique national. Les règles locales et la situation du terrain restent à examiner.'},
    {id:'O4', name:'Service-Public.fr · Autorisations d’urbanisme', scope:'Guide national', version:'Lien public', date:'05/11/2026', url:'https://www.service-public.gouv.fr/particuliers/vosdroits/N319', description:'Informations administratives générales. Cette fiche ne remplace pas le règlement applicable au terrain.'}
  ];

  const stepCatalog = [
    ['Préparer le dossier','Rassembler les informations connues et signaler les pièces manquantes.'],
    ['Localiser l’adresse','Proposer une localisation à confronter au terrain et aux plans.'],
    ['Identifier la parcelle','Contrôler la cohérence entre adresse, commune et référence cadastrale.'],
    ['Consulter les règles locales','Repérer document, zonage, prescriptions, OAP et servitudes.'],
    ['Examiner les risques','Consulter les couches pertinentes et conserver leur portée.'],
    ['Préparer la note de cadrage','Assembler les constats, les citations et les points à confirmer.']
  ];

  const makeSteps = done => stepCatalog.map((step, index) => ({label:step[0], note:step[1], status:index < done ? 'done' : 'pending', result:index < done ? [
    'Données du brief fictif structurées.',
    'Localisation illustrative obtenue, contrôle humain requis.',
    'Référence de démonstration cohérente avec le dossier.',
    'Documents et prescriptions à lire dans leur version en vigueur.',
    'Couches pertinentes examinées dans la simulation.',
    'Brouillon sourcé disponible pour relecture.'
  ][index] : ''}));

  const dossiers = [
    {
      id:'clairiere', title:'Maison Clairière', type:'Construction neuve', address:'12 rue des Exemples · Commune fictive', commune:'Commune fictive', parcel:'DÉMO-AB-0042', revision:3, status:'validated', readiness:92, done:6,
      missing:['Confirmer la teinte définitive de la couverture'],
      docs:[['Brief projet fictif','Administration','v1.2'],['Plan de masse fictif','Terrain','Démo A'],['Extrait de règlement illustratif','Règles','v1']],
      matrix:[['Recul illustratif','6,2 m sur le plan fictif','Compatible dans la simulation'],['Hauteur illustrative','6,8 m','À confirmer sur la coupe définitive'],['Aspect extérieur','Teinte encore ouverte','Choix à documenter']],
      synthesis:'NOTE DE CADRAGE TERRITORIAL — DOSSIER FICTIF\n\nLe dossier de démonstration contient une adresse, une référence parcellaire illustrative et des plans de travail. La recherche simulée a identifié les familles de règles à contrôler : implantation, hauteur, aspect extérieur, accès et gestion des eaux. [S1] [S2] [O1]\n\nPOINT À VÉRIFIER\n- Confirmer la teinte définitive de la couverture et la confronter au règlement local complet.\n\nCette note prépare la relecture. Elle ne constitue ni une autorisation ni une garantie de faisabilité.'
    },
    {
      id:'rivage', title:'Extension Rivage', type:'Travaux sur existant', address:'8 allée du Rivage · Commune fictive', commune:'Commune fictive', parcel:'DÉMO-CD-0118', revision:2, status:'review', readiness:76, done:5,
      missing:['Vérifier l’emprise exacte du projet par rapport à la zone de risque','Ajouter la coupe avec le terrain naturel'],
      docs:[['Demande client fictive','Administration','v1'],['Plan existant / projet fictif','Terrain','v2'],['Note de risque illustrative','Risques','v1']],
      matrix:[['Zone de risque illustrative','Emprise projet à proximité','Intersection exacte à confirmer'],['Hauteur','Coupe absente','Donnée manquante'],['Implantation','Distance indiquée : 4,5 m','Règle locale à comparer']],
      synthesis:'NOTE DE CADRAGE TERRITORIAL — DOSSIER FICTIF\n\nL’extension est localisée sur une parcelle illustrative pour laquelle une couche de risque a été repérée dans la simulation. Sa portée sur l’emprise exacte du projet reste à confirmer. [S1] [S2] [O2]\n\nINFORMATIONS MANQUANTES\n- Coupe avec terrain naturel.\n- Confirmation de l’intersection entre l’emprise et la zone de risque.\n\nAucune conclusion définitive ne peut être formulée avant ces contrôles.'
    },
    {
      id:'tilleuls', title:'Atelier des Tilleuls', type:'Changement de destination', address:'Adresse partielle · Commune à confirmer', commune:'À confirmer', parcel:'Référence ambiguë', revision:1, status:'draft', readiness:38, done:2,
      missing:['Confirmer la commune et l’adresse complète','Obtenir la référence cadastrale exacte','Ajouter les plans de l’existant','Préciser la destination actuelle et projetée'],
      docs:[['Courriel de demande fictif','Administration','v1']],
      matrix:[['Destination / usage','Informations incomplètes','À confirmer'],['Parcelle','Plusieurs correspondances possibles','À confirmer'],['Plans','Non fournis','Analyse impossible en l’état']],
      synthesis:'NOTE DE CADRAGE TERRITORIAL — DOSSIER FICTIF\n\nLe dossier ne permet pas encore d’identifier avec certitude le terrain ni de décrire le changement de destination. [S1]\n\nINFORMATIONS À VÉRIFIER\n- Commune, adresse et parcelle exacte.\n- Destination actuelle et destination projetée.\n- Plans et caractéristiques de l’existant.\n\nLe traitement doit rester au stade de la collecte. Aucune règle locale ne peut être déclarée applicable sans localisation fiable.'
    }
  ];
  dossiers.forEach(dossier => dossier.steps = makeSteps(dossier.done));

  const state = {
    view:'dashboard', dossier:null, tab:'overview', running:false,
    chat:{}, syntheses:{}, validation:{}, feedback:{}, theme:localStorage.getItem('parcelle-scope-demo-theme') || 'light'
  };
  try {
    state.syntheses = JSON.parse(localStorage.getItem('parcelle-scope-demo-notes') || '{}');
    state.validation = JSON.parse(localStorage.getItem('parcelle-scope-demo-validation') || '{}');
  } catch (_) {}
  document.documentElement.dataset.theme = state.theme;

  const workspace = $('#workspace');
  const breadcrumb = $('#breadcrumb');
  const toastNode = $('#toast');
  let toastTimer;
  function toast(message){toastNode.textContent=message;toastNode.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toastNode.classList.remove('show'),2600)}
  function pill(text, type=''){return `<span class="pill ${type}">${escapeHtml(text)}</span>`}
  function statusLabel(status){return status==='validated'?'Validé':status==='review'?'En relecture':'En préparation'}
  function isValidated(dossier){return Object.prototype.hasOwnProperty.call(state.validation,dossier.id)?state.validation[dossier.id]:dossier.status==='validated'}
  function effectiveStatus(dossier){return isValidated(dossier)?'validated':dossier.status==='validated'?'review':dossier.status}
  function heading(kicker,title,text,actions=''){return `<header class="page-head"><div><span class="eyebrow">${escapeHtml(kicker)}</span><h1>${escapeHtml(title)}</h1><p>${escapeHtml(text)}</p></div>${actions?`<div class="head-actions">${actions}</div>`:''}</header>`}
  function saveLocal(){localStorage.setItem('parcelle-scope-demo-notes',JSON.stringify(state.syntheses));localStorage.setItem('parcelle-scope-demo-validation',JSON.stringify(state.validation))}

  function renderDossiers(){
    const query=$('#dossierSearch').value.trim().toLocaleLowerCase('fr');
    const rows=dossiers.filter(d=>`${d.title} ${d.address} ${d.type}`.toLocaleLowerCase('fr').includes(query));
    $('#dossierCount').textContent=dossiers.length;
    $('#dossierList').innerHTML=rows.map(d=>`<button class="dossier-item ${state.dossier?.id===d.id?'active':''}" data-open-dossier="${d.id}">${escapeHtml(d.title)}<small>${escapeHtml(d.type)} · ${statusLabel(effectiveStatus(d))}</small></button>`).join('')||'<p class="muted" style="padding:8px">Aucun dossier trouvé.</p>';
  }

  function setNav(view){$$('.side-nav').forEach(button=>button.classList.toggle('active',button.dataset.adminView===view));renderDossiers()}
  function closeMobile(){ $('#sidebar').classList.remove('open'); $('#scrim').hidden=true; $('#mobileMenu').setAttribute('aria-expanded','false') }

  function renderDashboard(){
    state.view='dashboard';state.dossier=null;breadcrumb.textContent='Vue d’ensemble';setNav('dashboard');closeMobile();
    workspace.innerHTML=heading('PROTOTYPE INTERACTIF','Du territoire au dossier de contrôle.','Explorez trois cas fictifs et suivez la préparation d’une pré-analyse territoriale sourcée.','<button class="btn primary" data-open-dossier="clairiere">Explorer un dossier</button>')+`
      <div class="notice info" style="margin-bottom:16px"><strong>Périmètre de la démo.</strong> Les résultats sont préécrits et illustratifs. Aucun service externe, aucune IA et aucune base privée ne sont appelés.</div>
      <div class="stat-grid">
        <article class="stat"><span class="stat-label">Dossiers fictifs</span><strong>${dossiers.length}</strong><small>Standard, risque et parcelle incertaine</small></article>
        <article class="stat"><span class="stat-label">Traitements simulés</span><strong>${dossiers.filter(d=>d.steps.every(s=>s.status==='done')).length}</strong><small>Six étapes traçables</small></article>
        <article class="stat highlight"><span class="stat-label">Validation humaine</span><strong>${dossiers.filter(isValidated).length}</strong><small>Aucune conclusion automatique</small></article>
        <article class="stat"><span class="stat-label">Données envoyées</span><strong>0</strong><small>Tout reste dans ce navigateur</small></article>
      </div>
      <div class="grid two">
        <section class="card"><div class="card-head"><div><h2>Priorités de travail</h2><p class="muted">Chaque dossier illustre un niveau différent de maturité.</p></div>${pill('Démo locale','ok')}</div>
          <div class="activity-list">${dossiers.map((d,index)=>`<button class="activity" data-open-dossier="${d.id}" style="width:100%;border:0;background:transparent;text-align:left;color:inherit;cursor:pointer"><span class="activity-icon">0${index+1}</span><div><strong>${escapeHtml(d.title)}</strong><small>${escapeHtml(d.missing.length?d.missing[0]:'Prêt pour relecture')}</small></div><time>${d.readiness}%</time></button>`).join('')}</div>
        </section>
        <section class="card"><div class="card-head"><div><h2>Services représentés</h2><p class="muted">État illustratif du produit complet.</p></div></div>
          <div class="connection-list">
            ${[['Assistant avec citations','Disponible dans la simulation','ok'],['Sources officielles','Liens publics uniquement','ok'],['Documents du dossier','Fichiers fictifs','ok'],['Outils métier externes','Non connectés dans la démo','warn'],['Validation','Action locale du visiteur','ok']].map(row=>`<div class="connection"><span>${row[0]}<small class="muted" style="display:block">${row[1]}</small></span>${pill(row[2]==='ok'?'Illustré':'Hors démo',row[2])}</div>`).join('')}
          </div>
        </section>
      </div>`;
  }

  function openDossier(id,tab='overview'){
    const dossier=dossiers.find(d=>d.id===id);if(!dossier)return;
    state.dossier=dossier;state.view='dossier';state.tab=tab;breadcrumb.textContent=dossier.title;setNav('');closeMobile();renderDossier();
  }

  function renderDossier(){
    const d=state.dossier;
    workspace.innerHTML=`
      <section class="dossier-hero"><div><span class="eyebrow" style="color:#f4c565">DOSSIER FICTIF · RÉVISION ${d.revision}</span><h1>${escapeHtml(d.title)}</h1><p>${escapeHtml(d.type)} · ${escapeHtml(d.address)}</p></div><div class="readiness"><strong>${d.readiness}%</strong><small>niveau de préparation illustratif</small></div></section>
      <div class="tabs" role="tablist" aria-label="Espaces du dossier">
        ${[['overview','Vue d’ensemble'],['workflow','Traitement'],['assistant','Assistant'],['documents','Documents & sources'],['synthesis','Note de cadrage']].map(([key,label])=>`<button role="tab" aria-selected="${state.tab===key}" class="${state.tab===key?'active':''}" data-tab="${key}">${label}</button>`).join('')}
      </div><section id="dossierPanel"></section>`;
    if(state.tab==='overview')renderOverview();
    if(state.tab==='workflow')renderWorkflow();
    if(state.tab==='assistant')renderAssistant();
    if(state.tab==='documents')renderDocuments();
    if(state.tab==='synthesis')renderSynthesis();
    renderDossiers();
  }

  function renderOverview(){
    const d=state.dossier, complete=d.steps.filter(s=>s.status==='done').length;
    $('#dossierPanel').innerHTML=`<div class="grid two">
      <div class="grid">
        <section class="card"><div class="card-head"><div><h2>Identité du dossier</h2><p class="muted">Les valeurs sont fictives et uniquement destinées à la démonstration.</p></div>${pill(statusLabel(effectiveStatus(d)),isValidated(d)?'ok':effectiveStatus(d)==='review'?'warn':'')}</div>
          <div class="info-grid"><div class="info"><span>Projet</span><strong>${escapeHtml(d.type)}</strong></div><div class="info"><span>Commune</span><strong>${escapeHtml(d.commune)}</strong></div><div class="info"><span>Parcelle</span><strong>${escapeHtml(d.parcel)}</strong></div><div class="info"><span>Traitement</span><strong>${complete}/6 étapes</strong></div></div>
        </section>
        <section class="card"><div class="card-head"><div><h2>Matrice règle / projet</h2><p class="muted">Exemple de raisonnement structuré, sans valeur juridique.</p></div></div>
          <table class="matrix"><thead><tr><th>Disposition à contrôler</th><th>Donnée du projet fictif</th><th>Résultat</th></tr></thead><tbody>${d.matrix.map(row=>`<tr><td>${escapeHtml(row[0])}</td><td>${escapeHtml(row[1])}</td><td>${escapeHtml(row[2])}</td></tr>`).join('')}</tbody></table>
        </section>
      </div>
      <div class="grid">
        <section class="card"><div class="card-head"><div><h2>Informations à vérifier</h2><p class="muted">Une incertitude n’est jamais remplacée par une hypothèse.</p></div>${pill(String(d.missing.length),d.missing.length?'warn':'ok')}</div><div class="checks">${d.missing.map(item=>`<div class="check warn"><span>!</span><div><b>${escapeHtml(item)}</b><small>Confirmation humaine nécessaire</small></div>${pill('À vérifier','warn')}</div>`).join('')||'<div class="notice info">Aucune information manquante dans ce scénario fictif.</div>'}</div></section>
        <section class="card"><h2>Prochaine action</h2><p class="muted">${complete<6?'Poursuivre le traitement guidé et conserver les sources de chaque étape.':'Relire le brouillon, vérifier les réserves puis valider la note.'}</p><div class="actions"><button class="btn primary" data-tab="${complete<6?'workflow':'synthesis'}">${complete<6?'Ouvrir le traitement':'Relire la note'}</button><button class="btn" data-tab="assistant">Questionner l’assistant</button></div></section>
      </div></div>`;
  }

  function renderWorkflow(){
    const d=state.dossier,complete=d.steps.filter(s=>s.status==='done').length;
    $('#dossierPanel').innerHTML=`<div class="wf-layout"><section class="card"><div class="card-head"><div><h2>Un traitement, six étapes</h2><p class="muted">Chaque résultat conserve sa portée et ses réserves.</p></div>${pill(complete===6?'Terminé':state.running?'En cours':`${complete}/6`,complete===6?'ok':state.running?'warn':'')}</div>
      <div class="notice info" style="margin-bottom:14px">La simulation ne consulte aucun service externe. Elle montre le comportement attendu du Studio.</div>
      <ol class="wf-steps">${d.steps.map((step,index)=>`<li class="wf-step ${step.status}"><span class="step-marker">${step.status==='done'?'✓':index+1}</span><div class="step-content"><div class="step-title"><strong>${escapeHtml(step.label)}</strong>${pill(step.status==='done'?'Terminé':step.status==='running'?'En cours':'En attente',step.status==='done'?'ok':step.status==='running'?'warn':'')}</div><p>${escapeHtml(step.note)}</p>${step.result?`<div class="step-result">${escapeHtml(step.result)}</div>`:''}</div></li>`).join('')}</ol>
      <div class="actions" style="margin-top:16px"><button class="btn primary" id="runWorkflow" ${state.running?'disabled':''}>${complete===6?'Relancer la simulation':'Lancer / reprendre la simulation'}</button><button class="btn" data-tab="synthesis" ${complete<6?'disabled':''}>Ouvrir le brouillon</button></div></section>
      <aside class="grid"><section class="card"><h2>Données du terrain</h2><div class="field-list"><label>Nom du dossier<input value="${escapeHtml(d.title)}" readonly></label><label>Adresse<input value="${escapeHtml(d.address)}" readonly></label><label>Commune<input value="${escapeHtml(d.commune)}" readonly></label><label>Parcelle<input value="${escapeHtml(d.parcel)}" readonly></label></div><p class="muted" style="font-size:9px">Dans le produit, une modification de ces données invalide la note précédente.</p></section>
      <section class="card"><h2>Mesure du processus</h2><div class="connection"><span>Référence manuelle fictive</span><strong>${d.id==='clairiere'?'95 min':'Non mesurée'}</strong></div><div class="connection"><span>Relecture fictive</span><strong>${d.id==='clairiere'?'28 min':'À mesurer'}</strong></div><p class="muted" style="font-size:9px">Ces valeurs illustrent le mécanisme. Elles ne constituent pas un résultat réel.</p></section></aside></div>`;
    const button=$('#runWorkflow');if(button)button.onclick=runWorkflow;
  }

  function runWorkflow(){
    if(state.running)return;const d=state.dossier;state.running=true;
    if(d.steps.every(s=>s.status==='done'))d.steps=makeSteps(0);
    let index=d.steps.findIndex(s=>s.status!=='done');
    const advance=()=>{
      if(index>0&&d.steps[index-1]?.status==='running'){d.steps[index-1].status='done';d.steps[index-1].result=makeSteps(index)[index-1].result}
      if(index>=d.steps.length){state.running=false;d.done=6;d.readiness=Math.max(d.readiness,82);renderWorkflow();renderDossiers();toast('Simulation terminée. Le brouillon est prêt à relire.');return}
      d.steps[index].status='running';renderWorkflow();index++;setTimeout(advance,520)
    };
    advance();
  }

  function initialChat(d){return [{id:uid(),role:'assistant',body:`Bonjour. Je peux vous aider à relire le cadrage territorial fictif de « ${d.title} », retrouver les sources disponibles ou préparer une note de cadrage. Mes réponses restent des propositions à vérifier.`,citations:[]}]}
  function renderAssistant(){
    const d=state.dossier;if(!state.chat[d.id])state.chat[d.id]=initialChat(d);const messages=state.chat[d.id];
    $('#dossierPanel').innerHTML=`<div class="chat-layout"><section class="card conversation"><div class="card-head"><div><h2>Assistant de cadrage</h2><p class="muted">Conversation simulée avec citations contrôlables.</p></div>${pill('Mode démo','ok')}</div><div class="messages" id="messages">${messages.map(renderMessage).join('')}</div><form class="chat-composer" id="chatForm"><label>Votre question<textarea id="chatInput" maxlength="400" placeholder="Ex. Quelles informations restent à vérifier ?" required></textarea></label><button class="btn primary" type="submit">Envoyer</button></form></section>
      <aside><section class="card"><h3>Questions suggérées</h3><div class="suggestions" style="margin-top:12px">${['Quelles informations restent à vérifier ?','Quelles sources encadrent ce cadrage territorial ?','Prépare une note de cadrage sourcée.'].map(q=>`<button data-question="${escapeHtml(q)}">${escapeHtml(q)}</button>`).join('')}</div></section><section class="card" style="margin-top:12px"><h3>Règles de confiance</h3><p class="muted" style="font-size:9px">L’assistant distingue la parcelle, la commune et le niveau national. Une source absente ou une donnée ambiguë produit « à vérifier ».</p><div class="notice">La démo n’interroge ni IA ni API officielle.</div></section></aside></div>`;
    $('#chatForm').onsubmit=event=>{event.preventDefault();ask($('#chatInput').value)};
    $$('[data-question]').forEach(button=>button.onclick=()=>ask(button.dataset.question));
    $('#messages').scrollTop=$('#messages').scrollHeight;
  }

  function renderMessage(message){
    return `<article class="message ${message.role}"><div class="meta"><span>${message.role==='user'?'Vous':'Assistant'}</span><span>${message.role==='assistant'?'Proposition à relire':'Question fictive'}</span></div><div>${message.body.split('\n').map(line=>line?`<p>${escapeHtml(line)}</p>`:'').join('')}</div>${message.citations?.length?`<div class="citations">${message.citations.map(id=>`<button class="citation" data-source="${id}">[${id}] ${escapeHtml(sources.find(s=>s.id===id)?.name||'Source')}</button>`).join('')}</div><div class="message-actions"><button data-use-message="${message.id}">Reprendre dans la note</button><button data-feedback="${message.id}">${state.feedback[message.id]||'Utile ?'}</button></div>`:''}</article>`
  }

  function ask(question){
    question=question.trim();if(!question)return;const d=state.dossier,chat=state.chat[d.id];chat.push({id:uid(),role:'user',body:question,citations:[]});renderAssistant();
    setTimeout(()=>{
      const lower=question.toLocaleLowerCase('fr');let body,citations;
      if(lower.includes('source')){body=`Les sources disponibles dans ce cas fictif sont le brief et les plans de démonstration. Les portails officiels indiqués servent à retrouver les documents d’urbanisme et les risques, mais aucune consultation réelle n’est effectuée ici. La portée parcellaire doit toujours être confirmée.`;citations=['S1','S2','O1','O2']}
      else if(lower.includes('note')||lower.includes('cadrage')||lower.includes('synth')){body=(state.syntheses[d.id]||d.synthesis).replace(/^NOTE[^\n]*\n+/,'');citations=d.id==='rivage'?['S1','S2','O2']:d.id==='tilleuls'?['S1']:['S1','S2','O1']}
      else {body=d.missing.length?`Points à vérifier pour ce dossier fictif :\n${d.missing.map(item=>`• ${item}`).join('\n')}\nCes manques doivent rester visibles dans la note et empêchent toute conclusion définitive.`:'Aucun point manquant n’est enregistré dans ce scénario fictif. La relecture des documents originaux reste toutefois obligatoire.';citations=['S1',...(d.docs.length>1?['S2']:[])]}
      chat.push({id:uid(),role:'assistant',body,citations});renderAssistant();toast('Réponse simulée ajoutée')
    },420)
  }

  function renderDocuments(query=''){
    const d=state.dossier,filtered=sources.filter(source=>`${source.name} ${source.scope} ${source.description}`.toLocaleLowerCase('fr').includes(query.toLocaleLowerCase('fr')));
    $('#dossierPanel').innerHTML=`<div class="documents-grid"><section class="card"><div class="card-head"><div><h2>Pièces du dossier</h2><p class="muted">Fichiers fictifs, sans téléchargement ni donnée client.</p></div>${pill(String(d.docs.length),'ok')}</div>${d.docs.map((doc,index)=>`<div class="docrow"><span class="row-icon">${index+1}</span><div><strong>${escapeHtml(doc[0])}</strong><small>${escapeHtml(doc[1])} · ${escapeHtml(doc[2])}</small><small>${index===0?'Texte fictif indexé pour la démo':'Consultation simulée'}</small></div>${pill('Fictif')}</div>`).join('')}<div class="notice info" style="margin-top:16px">Dans le produit, les droits d’accès s’appliquent aussi à la recherche et au téléchargement des pièces.</div></section>
      <section class="card"><h2>Explorer les connaissances</h2><p class="muted">Recherchez une source par nom, portée ou thème.</p><form class="source-search" id="sourceSearch"><input id="sourceQuery" type="search" value="${escapeHtml(query)}" placeholder="PLU, risque, autorisation…"><button class="btn" type="submit">Rechercher</button></form><div class="source-list">${filtered.map(sourceCard).join('')||'<div class="notice">Aucune source trouvée dans le corpus de démonstration.</div>'}</div></section></div>`;
    $('#sourceSearch').onsubmit=event=>{event.preventDefault();renderDocuments($('#sourceQuery').value)};
  }

  function sourceCard(source){return `<details class="source-card"><summary><strong>[${source.id}] ${escapeHtml(source.name)}</strong><span class="scope">${escapeHtml(source.scope)}</span></summary><div class="source-body"><p>Version : ${escapeHtml(source.version)} · ${escapeHtml(source.date)}</p><p>${escapeHtml(source.description)}</p>${source.url?`<a href="${source.url}" target="_blank" rel="noopener noreferrer">Ouvrir la source publique ↗</a>`:''}</div></details>`}

  function renderSynthesis(){
    const d=state.dossier,body=state.syntheses[d.id]??d.synthesis,validated=isValidated(d);
    $('#dossierPanel').innerHTML=`<div class="synthesis-grid"><section class="card editor"><div class="card-head"><div><h2>Note de cadrage territorial</h2><p class="muted">Modifiez le texte, enregistrez-le localement puis exportez-le.</p></div>${pill(validated?'Validée':'Brouillon',validated?'ok':'warn')}</div><label>Contenu de la note<textarea id="synthesisText">${escapeHtml(body)}</textarea></label><div class="actions"><button class="btn primary" id="saveSynthesis">Enregistrer dans ce navigateur</button><button class="btn" id="exportSynthesis">Exporter .md</button><button class="btn" id="resetSynthesis">Réinitialiser</button></div><details style="margin-top:18px"><summary>Sources citées dans le modèle</summary>${['S1',...(d.docs.length>1?['S2']:[]),...(d.id==='rivage'?['O2']:d.id==='clairiere'?['O1']:[])].map(id=>sourceCard(sources.find(s=>s.id===id))).join('')}</details></section>
      <aside class="grid"><section class="card editor missing"><h2>Informations manquantes</h2><label>Un point par ligne<textarea readonly>${escapeHtml(d.missing.join('\n'))}</textarea></label></section><section class="card"><h2>Relecture & validation</h2><div class="validation-box ${validated?'validated':''}"><strong>${validated?'Validation simulée enregistrée':'Relecture humaine requise'}</strong><p class="muted" style="font-size:9px">${validated?'Cette validation reste locale à votre navigateur.':'La validation ne transforme pas cette démo en analyse réelle.'}</p><button class="btn ${validated?'':'primary'}" id="validateSynthesis">${validated?'Annuler la validation locale':'Valider après relecture'}</button></div><p class="muted" style="font-size:9px">Dans le produit, l’identité et la date sont enregistrées. Une modification du dossier annule la validation.</p></section></aside></div>`;
    $('#saveSynthesis').onclick=()=>{state.syntheses[d.id]=$('#synthesisText').value;state.validation[d.id]=false;saveLocal();toast('Brouillon enregistré localement. La validation a été retirée.');renderSynthesis()};
    $('#resetSynthesis').onclick=()=>{delete state.syntheses[d.id];state.validation[d.id]=false;saveLocal();renderSynthesis();toast('Texte fictif réinitialisé')};
    $('#validateSynthesis').onclick=()=>{state.syntheses[d.id]=$('#synthesisText').value;state.validation[d.id]=!validated;saveLocal();renderSynthesis();renderDossiers();toast(state.validation[d.id]?'Validation locale enregistrée':'Validation locale annulée')};
    $('#exportSynthesis').onclick=()=>download(`${d.title.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}-demo.md`,$('#synthesisText').value+'\n\n---\nDémonstration publique · données fictives · aucune valeur juridique.');
  }

  function download(name,text){const blob=new Blob([text],{type:'text/markdown;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=name;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);toast('Export de démonstration préparé')}

  function renderKnowledge(){
    state.view='knowledge';state.dossier=null;breadcrumb.textContent='Base de connaissances';setNav('knowledge');closeMobile();
    workspace.innerHTML=heading('PILOTAGE','Des connaissances traçables.','Le corpus public de cette démo est volontairement limité et ne contient aucune procédure interne.')+`<div class="stat-grid"><article class="stat"><span class="stat-label">Sources fictives</span><strong>2</strong><small>Brief et plan de démonstration</small></article><article class="stat"><span class="stat-label">Liens officiels</span><strong>4</strong><small>Portails publics à consulter</small></article><article class="stat highlight"><span class="stat-label">Secrets exposés</span><strong>0</strong><small>Aucune clé ni identifiant</small></article><article class="stat"><span class="stat-label">Apprentissage automatique</span><strong>0</strong><small>Réponses déterministes</small></article></div><div class="notice info" style="margin-bottom:16px">Le produit complet conserve l’origine, la version, la date et la portée de chaque source. Cette page n’indexe aucun document réel.</div><section class="library-list">${sources.map(source=>`<article class="library-item"><span class="scope">${escapeHtml(source.scope)}</span><h3>[${source.id}] ${escapeHtml(source.name)}</h3><p>${escapeHtml(source.description)}</p><p>Version : ${escapeHtml(source.version)} · ${escapeHtml(source.date)}</p>${source.url?`<a href="${source.url}" target="_blank" rel="noopener noreferrer">Consulter le portail public ↗</a>`:''}</article>`).join('')}</section>`;
  }

  function renderUsage(){
    state.view='usage';state.dossier=null;breadcrumb.textContent='Usage & connexions';setNav('usage');closeMobile();
    const quotas=[['Conversations simulées',3,20],['Traitements simulés',2,10],['Recherches locales',5,50],['Fichiers transférés',0,10]];
    workspace.innerHTML=heading('PILOTAGE','Usage & connexions.','Un aperçu fictif du suivi des plafonds et des services.')+`<div class="grid equal"><section class="card"><h2>Compteurs de démonstration</h2><p class="muted">Valeurs illustratives, réinitialisées avec le navigateur.</p>${quotas.map(q=>`<div class="quota-item"><div class="progress-label"><strong>${q[0]}</strong><span>${q[1]} / ${q[2]}</span></div><div class="progress-track"><span style="width:${q[1]/q[2]*100}%"></span></div></div>`).join('')}</section><section class="card"><h2>Services représentés</h2>${[['Assistant','Simulation locale','ok'],['Légifrance','Lien public uniquement','ok'],['Stockage','Aucun transfert','ok'],['Suivi de projet','Hors démo','warn'],['Gestion documentaire','Hors démo','warn']].map(row=>`<div class="connection"><span>${row[0]}<small class="muted" style="display:block">${row[1]}</small></span>${pill(row[2]==='ok'?'Sûr':'Non connecté',row[2])}</div>`).join('')}</section></div>`;
  }

  function renderQuality(){
    state.view='quality';state.dossier=null;breadcrumb.textContent='Performance & qualité';setNav('quality');closeMobile();
    workspace.innerHTML=heading('AMÉLIORATION CONTINUE','Mesurer avant de conclure.','Les indicateurs ci-dessous expliquent le dispositif. Les valeurs sont fictives et ne représentent aucun résultat opérationnel réel.')+`<div class="stat-grid"><article class="stat"><span class="stat-label">Cas de test</span><strong>3</strong><small>Parcours fonctionnels fictifs</small></article><article class="stat"><span class="stat-label">Référence manuelle</span><strong>95 min</strong><small>Exemple illustratif</small></article><article class="stat highlight"><span class="stat-label">Relecture</span><strong>28 min</strong><small>Exemple illustratif</small></article><article class="stat"><span class="stat-label">Gain démontré</span><strong>—</strong><small>Recette réelle nécessaire</small></article></div><div class="quality-grid"><section class="card"><h2>Qualité de l’assistant</h2><p class="muted">Exemple de tableau de suivi, sans score d’exactitude juridique.</p>${[['Réponses avec citations',86],['Informations manquantes signalées',92],['Réponses jugées utiles',74],['Réponses à corriger',18]].map(row=>`<div class="bar-row"><span>${row[0]}</span><div class="bar"><span style="width:${row[1]}%"></span></div><strong>${row[1]}%</strong></div>`).join('')}<div class="notice">Ces pourcentages sont purement illustratifs. Une recette métier doit produire les mesures réelles.</div></section><section class="card"><h2>Critères de mesure</h2><div class="checks">${['Même périmètre entre référence manuelle et traitement','Dossier et note de cadrage dans leur version courante','Toutes les étapes terminées','Temps de relecture arrêté','Validation par un professionnel'].map(item=>`<div class="check"><span>✓</span><div><b>${escapeHtml(item)}</b><small>Condition requise pour compter un gain</small></div></div>`).join('')}</div></section></div>`;
  }

  function openModal(title,body){$('#modalTitle').textContent=title;$('#modalBody').innerHTML=body;$('#modal').showModal()}
  function createDossierModal(){
    openModal('Nouveau dossier fictif',`<p class="muted">Ce dossier restera uniquement dans la page jusqu’à son actualisation.</p><form id="newDossierForm"><div class="field-list"><label class="wide">Nom du projet<input name="title" required maxlength="80" placeholder="Ex. Véranda Horizon"></label><label>Type<select name="type"><option>Construction neuve</option><option>Travaux sur existant</option><option>Aménagement / équipement</option></select></label><label>Commune fictive<input name="commune" value="Commune fictive"></label><label class="wide">Adresse fictive<input name="address" placeholder="Adresse de démonstration"></label><label class="wide">Parcelle fictive<input name="parcel" placeholder="DÉMO-EF-0001"></label></div><div class="actions"><button class="btn primary" type="submit">Créer dans la démo</button><button class="btn" type="button" data-close-modal>Annuler</button></div></form>`);
    $('#newDossierForm').onsubmit=event=>{event.preventDefault();const data=Object.fromEntries(new FormData(event.target));const dossier={id:uid(),title:data.title,type:data.type,address:data.address||'Adresse à confirmer',commune:data.commune||'À confirmer',parcel:data.parcel||'À confirmer',revision:1,status:'draft',readiness:25,done:0,missing:['Compléter les informations du projet','Ajouter les plans et pièces utiles'],docs:[['Brief saisi dans la démo','Administration','v1']],matrix:[['Localisation','Données saisies par le visiteur','À confirmer'],['Projet','Brief initial','À préciser']],synthesis:'NOTE DE CADRAGE TERRITORIAL — DOSSIER FICTIF\n\nNouveau dossier créé localement. Les informations doivent être complétées avant toute analyse. [S1]',steps:makeSteps(0)};dossiers.push(dossier);$('#modal').close();renderDossiers();openDossier(dossier.id,'workflow');toast('Dossier fictif créé localement')}
  }

  document.addEventListener('click',event=>{
    const dossierButton=event.target.closest('[data-open-dossier]');if(dossierButton){openDossier(dossierButton.dataset.openDossier);return}
    const tabButton=event.target.closest('[data-tab]');if(tabButton&&!tabButton.disabled&&state.dossier){state.tab=tabButton.dataset.tab;renderDossier();workspace.scrollIntoView({block:'start'});return}
    const navButton=event.target.closest('[data-admin-view]');if(navButton){({dashboard:renderDashboard,knowledge:renderKnowledge,usage:renderUsage,quality:renderQuality})[navButton.dataset.adminView]?.();return}
    const sourceButton=event.target.closest('[data-source]');if(sourceButton){const source=sources.find(s=>s.id===sourceButton.dataset.source);if(source)openModal(`[${source.id}] ${source.name}`,sourceCard(source));return}
    const useButton=event.target.closest('[data-use-message]');
    if(useButton&&state.dossier){
      const message=state.chat[state.dossier.id].find(m=>m.id===useButton.dataset.useMessage);
      if(message){
        state.syntheses[state.dossier.id]=`NOTE DE CADRAGE PROPOSÉE — DOSSIER FICTIF\n\n${message.body}\n\nSources : ${(message.citations||[]).map(id=>`[${id}]`).join(' ')}`;
        state.validation[state.dossier.id]=false;saveLocal();state.tab='synthesis';renderDossier();toast('Proposition reprise dans la note');
      }
      return;
    }
    const feedbackButton=event.target.closest('[data-feedback]');if(feedbackButton){state.feedback[feedbackButton.dataset.feedback]=state.feedback[feedbackButton.dataset.feedback]==='Utile ✓'?'Retour retiré':'Utile ✓';renderAssistant();toast('Retour conservé uniquement dans cette session');return}
    if(event.target.closest('[data-close-modal]')){$('#modal').close();return}
  });

  $('#dossierSearch').oninput=renderDossiers;
  $('#newDemoDossier').onclick=createDossierModal;
  $('#brandHome').onclick=event=>{event.preventDefault();renderDashboard()};
  $('#modalClose').onclick=()=>$('#modal').close();
  $('#mobileMenu').onclick=()=>{$('#sidebar').classList.add('open');$('#scrim').hidden=false;$('#mobileMenu').setAttribute('aria-expanded','true')};
  $('#scrim').onclick=closeMobile;
  $('#themeToggle').onclick=()=>{state.theme=state.theme==='light'?'dark':'light';document.documentElement.dataset.theme=state.theme;localStorage.setItem('parcelle-scope-demo-theme',state.theme)};
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMobile()});

  renderDossiers();renderDashboard();
})();

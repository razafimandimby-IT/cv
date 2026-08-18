(() => {
  'use strict';

  const initSupportOpsCv = () => {
    if (document.getElementById('supportops-case-study')) return;

    const projects = document.querySelector('#projets .container');
    const projectGrid = projects?.querySelector('.project-grid');
    if (projects && projectGrid) {
      const article = document.createElement('article');
      article.id = 'supportops-case-study';
      article.className = 'case-study case-study-featured supportops-case-study premium-card reveal-item is-visible';
      article.innerHTML = `
        <div class="case-study-head">
          <div>
            <span class="case-label">Projet phare · ITSM / Support Automation</span>
            <h3>SupportOps Control Center</h3>
            <p class="case-intro">
              Une démonstration produit qui transforme mon expérience de Support Automation Lead en cas concret :
              relier incidents, runbooks, SLA, observabilité, connaissances et pilotage dans une seule console opérationnelle.
            </p>
          </div>
          <div class="case-status"><span></span> V2 interactive</div>
        </div>

        <div class="supportops-value-strip" aria-label="Résultats associés à l'expérience Support Automation Lead">
          <div><strong>-35%</strong><span>MTTR observé dans l'expérience professionnelle associée</span></div>
          <div><strong>&gt;95%</strong><span>conformité SLA maintenue</span></div>
          <div><strong>+40%</strong><span>visibilité via reporting et dashboards opérationnels</span></div>
          <div><strong>3 pers.</strong><span>équipe encadrée sur le programme d'automatisation</span></div>
        </div>

        <div class="case-grid">
          <div>
            <h4>Enjeu opérationnel</h4>
            <p>Réduire les diagnostics manuels, accélérer la résolution, limiter les escalades inutiles et donner au management une lecture claire de la qualité de service.</p>
          </div>
          <div>
            <h4>Valeur ajoutée</h4>
            <p>Passer d'une collection de scripts isolés à un système gouverné : règles de déclenchement, approbations, audit, connaissances réutilisables et mesure de l'impact.</p>
          </div>
          <div>
            <h4>Fonctions démontrées</h4>
            <p>ITSM, Major Incident, Problem Management, Automation Center, SLA, Monitoring, Alert Center, Knowledge Base, Analytics ROI, Kanban et architecture cible.</p>
          </div>
          <div>
            <h4>Gouvernance & sécurité</h4>
            <p>Dry-run, RBAC conceptuel, approbation des remédiations, journalisation, séparation diagnostic/remédiation et simulation publique sans exécution réelle.</p>
          </div>
        </div>

        <div class="supportops-flow" aria-label="Chaîne de valeur SupportOps">
          <div><small>01</small><b>Détecter</b><span>Alertes, métriques et signaux de disponibilité.</span></div>
          <div><small>02</small><b>Qualifier</b><span>Impact, urgence, priorité et fenêtre SLA.</span></div>
          <div><small>03</small><b>Automatiser</b><span>Runbook de diagnostic ou remédiation contrôlée.</span></div>
          <div><small>04</small><b>Capitaliser</b><span>Knowledge Base, Known Errors et post-mortems.</span></div>
          <div><small>05</small><b>Piloter</b><span>MTTR, SLA, ROI automation et charge équipe.</span></div>
        </div>

        <div class="case-stack">
          <span>ITSM / ITIL</span><span>Python</span><span>PowerShell</span><span>Bash</span><span>Prometheus</span><span>Grafana</span><span>Automation</span><span>SLA</span><span>Observability</span>
        </div>

        <p class="supportops-note">
          SupportOps est un projet portfolio dérivé de problématiques réelles de support et d'automatisation. Les données affichées dans la démo sont fictives et ne reproduisent aucune donnée interne Datajet.
        </p>

        <div class="case-actions">
          <a class="btn btn-primary" href="demo/supportops.html">Voir la démo SupportOps</a>
          <a class="text-link" href="demo/supportops-v2.html">Explorer directement la V2 <span>↗</span></a>
        </div>`;
      projectGrid.before(article);
    }

    const roleBlocks = [...document.querySelectorAll('.role-block')];
    const automationRole = roleBlocks.find(block => block.textContent.includes('Support Automation Lead'));
    if (automationRole && !automationRole.querySelector('.supportops-experience-link')) {
      const title = automationRole.querySelector('strong');
      if (title && !title.querySelector('.supportops-badge')) {
        const badge = document.createElement('span');
        badge.className = 'supportops-badge';
        badge.textContent = 'Cas portfolio';
        title.appendChild(badge);
      }
      const link = document.createElement('div');
      link.className = 'supportops-experience-link';
      link.innerHTML = '<span>Cette expérience est matérialisée par une démonstration interactive dédiée : ITSM, automatisation, SLA, observabilité et ROI.</span><a class="text-link" href="demo/supportops.html">Voir SupportOps ↗</a>';
      automationRole.appendChild(link);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupportOpsCv, { once: true });
  } else {
    initSupportOpsCv();
  }
})();

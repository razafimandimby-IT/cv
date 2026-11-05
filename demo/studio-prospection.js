const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const initialCompanies = [
  { id: 'DEMO-101', name: 'Atelier fictif A', city: 'Paris', segment: 'Architecture', email: 'contact@atelier-a.example', source: 'Annuaire fictif', review: null },
  { id: 'DEMO-102', name: 'Cabinet fictif B', city: 'Lyon', segment: 'Topographie', email: 'contact@cabinet-b.example', source: 'Annuaire fictif', review: null },
  { id: 'DEMO-103', name: 'Construction fictive C', city: 'Nantes', segment: 'Construction', email: 'contact@construction-c.example', source: 'Annuaire fictif', review: null },
  { id: 'DEMO-104', name: 'Promotion fictive D', city: 'Lille', segment: 'Promotion immobilière', email: 'contact@promotion-d.example', source: 'Annuaire fictif', review: null },
];
const sampleLot = [
  { id: 'DEMO-101', name: 'Atelier fictif A', city: 'Paris', segment: 'Architecture', email: 'equipe@atelier-a.example', kind: 'match', source: 'Lot fictif' },
  { id: 'DEMO-105', name: 'Études fictives E', city: 'Bordeaux', segment: 'Bureau d’études', email: 'contact@etudes-e.example', kind: 'new', source: 'Lot fictif' },
  { id: '', name: 'Atelier fictif A', city: 'Rouen', segment: 'Architecture', email: 'contact@atelier-rouen.example', kind: 'ambiguous', source: 'Lot fictif' },
];
const viewTitles = {
  overview: ["Vue d'ensemble", 'Du fichier source au prospect qualifié, avec validation humaine.'],
  import: ['Importer', 'Prévisualiser les données et éviter les imports aveugles.'],
  match: ['Rapprocher', 'Comparer les identifiants et traiter les cas ambigus.'],
  review: ['Qualifier', 'Valider les preuves avant d’intégrer une fiche au livrable.'],
  export: ['Livrable', 'Un export limité aux fiches qualifiées dans cette démonstration.'],
};
let state;

function reset() {
  state = { companies: structuredClone(initialCompanies), suggestions: [], previewed: false, imported: false, resolved: 0 };
  $('#import-preview').hidden = true;
  $('#commit-import').disabled = true;
  $('#preview-import').disabled = false;
  $('#import-feedback').textContent = 'Cliquez sur « Prévisualiser le lot » pour examiner les trois lignes.';
  $('#import-feedback').className = 'feedback';
  $('#review-form').reset();
  $('#review-feedback').textContent = '';
  renderAll();
  showView('overview');
}

function showView(name) {
  $$('.page').forEach((page) => page.classList.toggle('active', page.id === name));
  $$('.nav button').forEach((button) => button.classList.toggle('active', button.dataset.view === name));
  const [title, subtitle] = viewTitles[name];
  $('#view-title').textContent = title;
  $('#view-subtitle').textContent = subtitle;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function node(tag, value = '', className = '') {
  const item = document.createElement(tag);
  item.textContent = value;
  if (className) item.className = className;
  return item;
}

function badge(kind) {
  const words = { match: 'Doublon exact', new: 'Nouvelle fiche', ambiguous: 'À confirmer' };
  return node('span', words[kind], `badge ${kind}`);
}

function renderMetrics() {
  $('#metric-companies').textContent = String(state.companies.length);
  $('#metric-suggestions').textContent = String(state.suggestions.filter((row) => !row.resolution).length);
  $('#metric-qualified').textContent = String(state.companies.filter((row) => row.review?.qualified).length);
  $('#metric-duplicates').textContent = String(state.suggestions.filter((row) => row.kind === 'match' || row.kind === 'ambiguous').length);
}

function renderPreview() {
  const body = $('#preview-rows');
  body.replaceChildren(...sampleLot.map((row) => {
    const tr = node('tr');
    [row.name, row.id || 'Non fourni', row.city].forEach((value) => tr.append(node('td', value)));
    const status = node('td');
    status.append(badge(row.kind));
    tr.append(status);
    return tr;
  }));
}

function action(label, handler, className = 'button secondary') {
  const button = node('button', label, className);
  button.type = 'button';
  button.addEventListener('click', handler);
  return button;
}

function resolveSuggestion(index, decision) {
  const row = state.suggestions[index];
  if (!row || row.resolution) return;
  if (decision === 'add') {
    const id = row.id || 'DEMO-106';
    if (state.companies.some((company) => company.id === id)) return;
    state.companies.push({ ...row, id, review: null });
  }
  if (decision === 'merge') {
    const company = state.companies.find((item) => item.id === row.id);
    if (!company) return;
    company.source = 'Annuaire fictif + lot fictif';
    // L'adresse proposée reste visible comme source ; elle ne remplace jamais une coordonnée validée.
  }
  row.resolution = decision;
  state.resolved++;
  renderAll();
}

function renderSuggestions() {
  const list = $('#suggestion-list');
  list.replaceChildren();
  const pending = state.suggestions.filter((row) => !row.resolution).length;
  $('#match-count').textContent = `${pending} suggestion${pending > 1 ? 's' : ''} à examiner`;
  $('#match-empty').hidden = pending > 0;
  if (!pending && state.imported) $('#match-empty').textContent = 'Toutes les propositions ont été traitées. Poursuivez la qualification.';
  state.suggestions.forEach((row, index) => {
    if (row.resolution) return;
    const card = node('article', '', 'panel');
    const head = node('div', '', 'suggestion-head');
    const text = node('div');
    text.append(node('h3', row.name), node('p', `${row.city} · ${row.segment} · ${row.id || 'identifiant absent'}`));
    head.append(text, badge(row.kind));
    const explanation = {
      match: 'Identifiant DEMO-101 déjà présent. Une adresse supplémentaire est proposée, sans validation automatique.',
      new: 'Aucun identifiant identique trouvé dans le catalogue fictif.',
      ambiguous: 'Nom proche d’une fiche existante, mais ville différente et identifiant absent. Décision humaine requise.',
    };
    const note = node('p', explanation[row.kind], 'source-note');
    const buttons = node('div', '', 'choice-row');
    if (row.kind === 'match') buttons.append(action('Rapprocher les sources', () => resolveSuggestion(index, 'merge'), 'button primary'));
    if (row.kind === 'new' || row.kind === 'ambiguous') buttons.append(action('Créer une fiche distincte', () => resolveSuggestion(index, 'add'), 'button primary'));
    buttons.append(action('Ignorer la proposition', () => resolveSuggestion(index, 'ignore')));
    card.append(head, note, buttons);
    list.append(card);
  });
}

function renderCompanySelect() {
  const select = $('#company-select');
  const current = select.value;
  select.replaceChildren(...state.companies.map((company) => {
    const option = node('option', `${company.name} · ${company.city}`);
    option.value = company.id;
    return option;
  }));
  if (state.companies.some((company) => company.id === current)) select.value = current;
  renderCompany();
}

function renderCompany() {
  const company = state.companies.find((item) => item.id === $('#company-select').value);
  if (!company) return;
  const details = $('#company-details');
  details.replaceChildren();
  const rows = [
    ['Identifiant fictif', company.id], ['Ville', company.city], ['Segment proposé', company.segment],
    ['Coordonnée fictive', company.email], ['Source', company.source],
    ['Décision', company.review?.qualified ? 'Qualifiée dans la démo' : 'À vérifier'],
  ];
  rows.forEach(([label, value]) => {
    const row = node('div', '', 'detail');
    row.append(node('span', label), node('strong', value));
    details.append(row);
  });
  $('#review-form').reset();
  $('#review-feedback').textContent = company.review?.qualified ? 'Cette fiche a déjà été qualifiée dans la démo.' : '';
  $('#review-feedback').className = 'feedback';
}

function renderQualified() {
  const body = $('#qualified-rows');
  const qualified = state.companies.filter((row) => row.review?.qualified);
  body.replaceChildren(...qualified.map((company) => {
    const tr = node('tr');
    [company.name, company.segment, company.city, company.email].forEach((value) => tr.append(node('td', value)));
    tr.append(node('td', 'Qualification humaine simulée', 'status-qualified'));
    return tr;
  }));
  $('#export-empty').hidden = qualified.length > 0;
  $('#download').disabled = qualified.length === 0;
}

function renderAll() {
  renderMetrics();
  renderSuggestions();
  renderCompanySelect();
  renderQualified();
}

$$('[data-view]').forEach((button) => button.addEventListener('click', () => showView(button.dataset.view)));
$('#reset').addEventListener('click', reset);
$('#preview-import').addEventListener('click', () => {
  state.previewed = true;
  $('#import-preview').hidden = false;
  $('#commit-import').disabled = false;
  $('#import-feedback').textContent = 'Aperçu prêt : 1 doublon exact, 1 nouvelle fiche et 1 rapprochement ambigu.';
  $('#import-feedback').className = 'feedback success';
  renderPreview();
});
$('#commit-import').addEventListener('click', () => {
  if (!state.previewed || state.imported) return;
  state.suggestions = structuredClone(sampleLot);
  state.imported = true;
  $('#commit-import').disabled = true;
  $('#preview-import').disabled = true;
  $('#import-feedback').textContent = 'Trois propositions intégrées. Examinez-les dans « Rapprocher ».';
  renderAll();
  showView('match');
});
$('#company-select').addEventListener('change', renderCompany);
$('#review-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const feedback = $('#review-feedback');
  if (!$('#check-activity').checked || !$('#check-decision').checked || !$('#check-contact').checked || !$('#evidence').value.trim()) {
    feedback.textContent = 'Cochez les trois contrôles et ajoutez une note de vérification.';
    feedback.className = 'feedback error';
    return;
  }
  if ($('#check-opposition').checked) {
    feedback.textContent = 'Opposition détectée : cette fiche ne peut pas entrer dans le livrable.';
    feedback.className = 'feedback error';
    return;
  }
  const company = state.companies.find((item) => item.id === $('#company-select').value);
  company.review = { qualified: true, evidence: $('#evidence').value.trim() };
  feedback.textContent = 'Qualification enregistrée pour cette démonstration.';
  feedback.className = 'feedback success';
  renderMetrics();
  renderQualified();
  showView('export');
});
$('#download').addEventListener('click', () => {
  const qualified = state.companies.filter((row) => row.review?.qualified);
  if (!qualified.length) return;
  const quote = (value) => {
    const cell = String(value);
    const safe = /^[=+@\-\t\r]/.test(cell.trimStart()) ? `'${cell}` : cell;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  const lines = [['Entreprise fictive', 'Identifiant fictif', 'Segment', 'Ville', 'Coordonnée fictive', 'Note de démo'],
    ...qualified.map((row) => [row.name, row.id, row.segment, row.city, row.email, row.review.evidence])];
  const csv = '\ufeff' + lines.map((row) => row.map(quote).join(';')).join('\r\n') + '\r\n';
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'prototype-prospection-donnees-fictives.csv';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

reset();

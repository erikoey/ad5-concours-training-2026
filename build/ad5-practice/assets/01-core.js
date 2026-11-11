'use strict';
/* ============ core: helpers, config, state, i18n, storage, router, shell ============ */
const D = window.AD5_DATA;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const fmtT = s => { s = Math.max(0, Math.ceil(s)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60); return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(s % 60).padStart(2, '0'); };
const iso = () => new Date().toISOString();
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const L = 'ABCDE';
const pct = (a, b) => b ? Math.round(a / b * 100) : 0;
const num = (x, d = 1) => (Math.round(x * 10 ** d) / 10 ** d).toLocaleString(lang() === 'de' ? 'de-DE' : 'en-GB', { minimumFractionDigits: 0, maximumFractionDigits: d });
const when = s => new Date(s).toLocaleString(lang() === 'de' ? 'de-DE' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' });

const store = {
  get(k, d) { try { const v = localStorage.getItem('ad5.' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('ad5.' + k, JSON.stringify(v)); return true; } catch { return false; } },
  del(k) { try { localStorage.removeItem('ad5.' + k); } catch { /* ignore */ } },
};

/* ---- language: the interface follows the language of the test that is running; elsewhere the user's choice */
let ui = store.get('lang', (navigator.language || 'de').toLowerCase().startsWith('de') ? 'de' : 'en');
let run = null;      // active test run (memory only)
let forceLang = null; // set by the writing editor (Language 2 = English)
const lang = () => forceLang || (run && !run.done ? run.lang : ui);
const T = (de, en) => (lang() === 'de' ? de : en);

/* ---- official format (notice EPSO/AD/427/26 as amended by C/2026/3362) ---- */
const NOTICE = 'https://eur-lex.europa.eu/eli/C/2026/3362/oj';
const TESTS = {
  verbal:    { part: 1, lang: 'de', n: 20, min: 35, max: 20, pass: 10, w: [40, 35], ic: 'V', name: ['Verbales Denken', 'Verbal reasoning'], bank: 'verbal',
               blurb: ['Textaufgaben: Was lässt sich aus dem Text ableiten?', 'Text-based questions: what follows from the text?'] },
  numerical: { part: 1, lang: 'de', n: 10, min: 20, max: 10, pass: null, w: [0, 0], ic: 'N', name: ['Numerisches Denken', 'Numerical reasoning'], bank: 'numerical',
               blurb: ['Tabellen und Rechenaufgaben mit Taschenrechner.', 'Tables and calculations, with a calculator.'] },
  abstract:  { part: 1, lang: 'de', n: 10, min: 10, max: 10, pass: null, w: [0, 0], ic: 'A', name: ['Abstraktes Denken', 'Abstract reasoning'], bank: 'abstract',
               blurb: ['Figurenreihen und Matrizen.', 'Figure sequences and matrices.'] },
  eu:        { part: 2, lang: 'en', n: 30, min: 40, max: 30, pass: 15, w: [30, 25], ic: 'EU', name: ['EU-Wissen', 'EU knowledge'], bank: 'eu',
               blurb: ['Institutionen, Verfahren und Politikbereiche.', 'Institutions, procedures and main policies.'] },
  digital:   { part: 2, lang: 'en', n: 40, min: 30, max: 40, pass: 20, w: [30, 25], ic: 'DS', name: ['Digitale Kompetenzen', 'Digital skills'], bank: 'digital',
               blurb: ['Fünf DigComp-Bereiche, je acht Fragen.', 'Five DigComp areas, eight questions each.'] },
  eufte:     { part: 2, lang: 'en', n: 0, min: 40, max: 10, pass: 5, w: [0, 15], ic: 'W', name: ['Schreibtest (EUFTE)', 'Written test (EUFTE)'], bank: null,
               blurb: ['Aufsatz zu EU-Themen mit Unterlagen.', 'Essay on EU matters based on documentation.'] },
};
const MCQ = ['verbal', 'numerical', 'abstract', 'eu', 'digital'];
const tname = (id, l = lang()) => TESTS[id].name[l === 'de' ? 0 : 1];
const tblurb = (id, l = lang()) => TESTS[id].blurb[l === 'de' ? 0 : 1];
const REASON_COMBINED = 10; // numerical + abstract combined pass score /20

/* ---- history / simulation state ---- */
let history = store.get('history', []);
let sim = store.get('sim', null);
const saveHistory = () => { if (history.length > 300) history = history.slice(-300); store.set('history', history); };
const bankOf = id => D[TESTS[id].bank];
const itemById = (test, id) => (bankOf(test) || []).find(q => q.id === id);
const lastOf = t => [...history].reverse().find(r => r.test === t);
const bestOf = t => history.filter(r => r.test === t && r.mode === 'exam').reduce((m, r) => Math.max(m, pct(r.score, r.max)), 0);

/* ---- theme ---- */
function applyTheme() {
  const t = store.get('theme', null);
  document.documentElement.dataset.theme = t || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  if (window.paintFigures) paintFigures();
}
function toggleTheme() { store.set('theme', document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); applyTheme(); }

/* ---- dialog + toast ---- */
function ask({ title, text, ok, cancel, danger }) {
  return new Promise(res => {
    const d = $('#dlg');
    d.innerHTML = `<form method="dialog"><h2>${esc(title)}</h2><p>${esc(text)}</p><div class="row" style="justify-content:flex-end;margin-top:8px"><button class="btn" value="no">${esc(cancel || T('Abbrechen', 'Cancel'))}</button><button class="btn ${danger ? 'danger' : 'primary'}" value="yes">${esc(ok || 'OK')}</button></div></form>`;
    d.onclose = () => res(d.returnValue === 'yes');
    d.returnValue = 'no'; d.showModal();
  });
}
let toastTimer;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 3200); }
function announce(msg) { const a = $('#live'); a.textContent = ''; setTimeout(() => { a.textContent = msg; }, 50); }

/* ---- download helper ---- */
function download(name, data, type = 'application/json') {
  const blob = new Blob([typeof data === 'string' ? data : JSON.stringify(data, null, 2)], { type });
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/* ---- shell: top bar ---- */
const NAV = [['home', 'Start', 'Home'], ['sim', 'Simulation', 'Simulation'], ['practice', 'Üben', 'Practice'], ['writing', 'Schreibtest', 'Writing'], ['results', 'Ergebnisse', 'Results'], ['sources', 'Quellen', 'Sources']];
const STARS = Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<circle cx="${(50 + 38 * Math.sin(a)).toFixed(1)}" cy="${(50 - 38 * Math.cos(a)).toFixed(1)}" r="4.6"/>`; }).join('');
const LOGO = `<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" rx="24" fill="#1f4fd8"/><g fill="#ffcc00">${STARS}</g></svg>`;
function shell(active) {
  const l = ui;
  $('#topbar').innerHTML = `<div class="topbar-in"><a class="brand" href="#/home">${LOGO}<span>AD5 Concours 2026<small>${l === 'de' ? 'Übungsumgebung · EPSO/AD/427/26' : 'Practice environment · EPSO/AD/427/26'}</small></span></a>
  <nav class="nav" aria-label="${l === 'de' ? 'Hauptnavigation' : 'Main navigation'}">${NAV.map(([k, de, en]) => `<a href="#/${k}" ${k === active ? 'aria-current="page"' : ''}>${l === 'de' ? de : en}</a>`).join('')}</nav>
  <div class="tools"><button class="icon-btn" id="b-lang" title="${l === 'de' ? 'Sprache der Oberfläche' : 'Interface language'}" aria-label="${l === 'de' ? 'Sprache wechseln' : 'Switch language'}">${l === 'de' ? 'EN' : 'DE'}</button>
  <button class="icon-btn" id="b-theme" title="${l === 'de' ? 'Hell / Dunkel' : 'Light / dark'}" aria-label="${l === 'de' ? 'Farbschema wechseln' : 'Toggle colour theme'}">◐</button></div></div>`;
  $('#skip').textContent = l === 'de' ? 'Zum Inhalt' : 'Skip to content';
  $('#b-lang').onclick = () => { ui = ui === 'de' ? 'en' : 'de'; store.set('lang', ui); route_(); };
  $('#b-theme').onclick = toggleTheme;
  document.documentElement.lang = lang();
  $('#foot').innerHTML = `<p>${l === 'de' ? 'Unabhängiges Übungsmaterial, kein EPSO-Produkt. Ergebnisse bleiben lokal in diesem Browser.' : 'Independent practice material, not an EPSO product. Results stay local in this browser.'}</p>`;
}

/* ---- router ---- */
const VIEWS = {};
function parseHash() { const parts = (location.hash || '#/home').split('/'); return [parts[1] || 'home', parts.slice(2).join('/')]; }
let leaving = false;
async function route_() {
  const [name, arg] = parseHash();
  if (run && !run.done && name !== 'run') {
    if (leaving) return; leaving = true;
    const ok = await ask({ title: T('Test verlassen?', 'Leave the test?'), text: T('Dein laufender Versuch wird verworfen.', 'Your attempt in progress will be discarded.'), ok: T('Verlassen', 'Leave'), cancel: T('Weiter üben', 'Keep going'), danger: true });
    leaving = false;
    if (!ok) { location.hash = '#/run'; return; }
    clearInterval(run.timer); run = null;
  }
  if (name === 'run' && !run) { location.replace('#/home'); return; }
  const v = VIEWS[name] || VIEWS.home;
  shell(name === 'setup' ? 'practice' : name === 'result' ? 'results' : name === 'run' ? '' : (VIEWS[name] ? name : 'home'));
  forceLang = null;
  const main = $('#main'); main.innerHTML = ''; v(main, arg);
  if (window.paintFigures) paintFigures();
  window.scrollTo({ top: 0 }); main.focus({ preventScroll: true });
}
window.addEventListener('hashchange', route_);

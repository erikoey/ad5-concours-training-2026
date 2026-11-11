/* ============ views: home, practice, setup, simulation, results, sources ============ */
const weightTxt = c => c.w[0] || c.w[1] ? `${c.w[0] ? c.w[0] + ' %' : '–'} / ${c.w[1] ? c.w[1] + ' %' : '–'}` : '–';
function formatTable() {
  const rows = Object.entries(TESTS).map(([id, c]) => `<tr><td><b>${esc(tname(id))}</b></td><td>${c.part}</td><td>${c.lang === 'de' ? T('Sprache 1 (Deutsch)', 'Language 1 (German)') : T('Sprache 2 (Englisch)', 'Language 2 (English)')}${id === 'numerical' || id === 'abstract' ? ' <span class="xs muted">(' + T('sprachunabhängig', 'language-neutral') + ')</span>' : ''}</td><td class="num">${c.n || '–'}</td><td class="num">${c.min} min</td><td class="num">${id === 'numerical' || id === 'abstract' ? T('gemeinsam', 'combined') + ' ' + REASON_COMBINED + '/20' : c.pass + '/' + c.max}</td><td class="num">${weightTxt(c)}</td></tr>`).join('');
  return `<div class="table-wrap"><table><thead><tr><th>${T('Test', 'Test')}</th><th>${T('Teil', 'Part')}</th><th>${T('Sprache', 'Language')}</th><th class="num">${T('Fragen', 'Questions')}</th><th class="num">${T('Zeit', 'Time')}</th><th class="num">${T('Bestehen', 'Pass')}</th><th class="num">${T('Gewicht vorl. / final', 'Weight prelim. / final')}</th></tr></thead><tbody>${rows}</tbody></table></div>
  <p class="sm muted" style="margin:10px 0 0">${T('Teil 2 nur nach Bestehen von Teil 1. Der Digitaltest wird nur bewertet, wenn EU-Wissen bestanden ist.', 'Part 2 only after passing Part 1. The digital test is scored only if EU knowledge is passed.')} <a href="${NOTICE}" target="_blank" rel="noopener">C/2026/3362 ↗</a></p>`;
}
function weakAreas() {
  const a = {};
  history.filter(r => r.areas && r.test !== 'eufte').forEach(r => Object.entries(r.areas).forEach(([k, [c, t]]) => { const key = r.test + '|' + k; (a[key] = a[key] || [r.test, k, 0, 0]); a[key][2] += c; a[key][3] += t; }));
  return Object.values(a).filter(x => x[3] >= 4).map(x => ({ test: x[0], area: x[1], c: x[2], t: x[3], p: x[2] / x[3] })).sort((x, y) => x.p - y.p).slice(0, 5);
}
function recentRows(n = 6) {
  return [...history].reverse().slice(0, n).map(r => `<tr><td><a href="#/result/${r.id}">${esc(tname(r.test))}</a></td><td class="muted">${when(r.at)}</td><td>${r.mode === 'exam' ? T('Prüfung', 'Exam') : T('Training', 'Training')}</td><td class="num"><b>${r.test === 'eufte' ? num(r.score, 0) + '/10' : r.score + '/' + r.n}</b></td></tr>`).join('');
}

VIEWS.home = main => {
  const weak = weakAreas(), mins = Math.round(history.reduce((s, r) => s + (r.sec || 0), 0) / 60);
  main.innerHTML = `<div class="stack">
  <section><h1 style="max-width:22ch">${T('Übung für den AD5-Concours 2026', 'Practice for the AD5 competition 2026')}</h1>
    <p class="muted" style="margin-bottom:18px">EPSO/AD/427/26 · ${T('alle Testteile mit Zeitlimit, Bestehensgrenzen und Gewichtung', 'all test parts with time limits, pass scores and weightings')}</p>
    <div class="row"><a class="btn primary" href="#/sim">${T('Komplette Simulation', 'Full simulation')}</a><a class="btn" href="#/practice">${T('Einzelne Tests', 'Single tests')}</a><a class="btn" href="#/writing">${T('Schreibtest', 'Written test')}</a></div></section>
  <section><h2>${T('Das Format', 'The format')}</h2>${formatTable()}</section>
  ${history.length ? `<div class="grid g2">
    <section class="card"><h2>${T('Schwächste Themen', 'Weakest topics')}</h2>${weak.length ? weak.map(w => `<div style="margin:12px 0"><div class="row spread sm"><span>${esc(w.area)} <span class="muted xs">· ${esc(tname(w.test))}</span></span><span class="mono muted">${w.c}/${w.t}</span></div><div class="bar ${w.p >= .7 ? 'ok' : w.p < .5 ? 'bad' : 'warn'}"><i style="width:${Math.round(w.p * 100)}%"></i></div></div>`).join('') : `<p class="muted">${T('Noch zu wenige Antworten.', 'Not enough answers yet.')}</p>`}</section>
    <section class="card"><div class="row spread"><h2 style="margin:0">${T('Zuletzt', 'Recent')}</h2><a class="sm" href="#/results">${T('Alle', 'All')}</a></div><div class="table-wrap" style="margin-top:12px"><table><tbody>${recentRows()}</tbody></table></div><p class="sm muted" style="margin:10px 0 0">${history.length} ${T('Durchgänge', 'sessions')} · ${mins} min</p></section></div>` : ''}</div>`;
};

/* ---- practice overview ---- */
function testCard(id) {
  const c = TESTS[id], last = lastOf(id), best = bestOf(id), pool = c.bank ? bankOf(id).length : null;
  return `<article class="card tcard"><div><h3>${esc(tname(id))}</h3><p class="sm muted" style="margin:0">${c.n ? c.n + ' ' + T('Fragen', 'questions') + ' · ' : ''}${c.min} min${pool ? ' · ' + T('Pool', 'pool') + ' ' + pool : ''}</p></div>
    <div class="foot"><a class="btn primary" href="${id === 'eufte' ? '#/writing' : '#/setup/' + id}">${T('Starten', 'Start')}</a>${last ? `<span class="sm muted">${T('Zuletzt', 'Last')} ${id === 'eufte' ? num(last.score, 0) + '/10' : pct(last.score, last.n) + ' %'}${best ? ' · ' + T('Bestwert', 'best') + ' ' + best + ' %' : ''}</span>` : ''}</div></article>`;
}
VIEWS.practice = main => {
  main.innerHTML = `<div class="stack"><h1>${T('Einzelne Tests', 'Single tests')}</h1>
  <h2 class="part-label" style="margin-top:0">${T('Teil 1 · Reasoning (Deutsch)', 'Part 1 · Reasoning (German)')}</h2><div class="grid g3">${['verbal', 'numerical', 'abstract'].map(testCard).join('')}</div>
  <h2 class="part-label">${T('Teil 2 · Wissen und Schreiben (Englisch)', 'Part 2 · Knowledge and writing (English)')}</h2><div class="grid g3">${['eu', 'digital', 'eufte'].map(testCard).join('')}</div></div>`;
};

/* ---- setup ---- */
VIEWS.setup = (main, id) => {
  const c = TESTS[id]; if (!c || !c.bank) { location.replace('#/practice'); return; }
  const bank = bankOf(id), areas = [...new Set(bank.map(q => q.area || q.tag))].sort();
  let mode = 'exam';
  const body = () => {
    const tr = mode === 'training';
    main.innerHTML = `<div class="stack" style="max-width:760px"><a href="#/practice" class="sm">← ${T('Zurück', 'Back')}</a>
    <h1>${esc(tname(id))}</h1>
    <form class="card stack" id="f"><fieldset style="border:0;padding:0;margin:0"><legend class="sm" style="font-weight:700;margin-bottom:8px">${T('Modus', 'Mode')}</legend><div class="seg" role="group">
      <button type="button" data-m="exam" aria-pressed="${!tr}">${T('Prüfung', 'Exam')}</button><button type="button" data-m="training" aria-pressed="${tr}">${T('Training', 'Training')}</button></div></fieldset>
    ${tr ? `<div class="grid g2"><label class="field">${T('Anzahl Fragen', 'Number of questions')}<select name="count">${[5, 10, 20, c.n].filter((v, i, a) => v && a.indexOf(v) === i && v <= bank.length).sort((a, b) => a - b).map(v => `<option ${v === 10 ? 'selected' : ''} value="${v}">${v}</option>`).join('')}<option value="all">${T('Alle im Filter', 'All in filter')} (${bank.length})</option></select></label>
      ${id === 'abstract' ? `<label class="field">${T('Schwierigkeit', 'Difficulty')}<select name="level"><option value="all">${T('Alle', 'All')}</option>${Object.entries(LEVEL).map(([k, v]) => `<option value="${k}">${v[ui === 'de' ? 0 : 1]}</option>`).join('')}</select></label>`
        : `<label class="field">${T('Themenbereich', 'Topic area')}<select name="area"><option value="all">${T('Alle', 'All')}</option>${areas.map(a => `<option>${esc(a)}</option>`).join('')}</select></label>`}</div>`
    : `<p class="muted" style="margin:0"><b style="color:var(--text)">${c.n} ${T('Fragen in', 'questions in')} ${c.min} ${T('Minuten', 'minutes')}.</b> ${c.pass ? T(`Bestehensgrenze ${c.pass} von ${c.max}.`, `Pass score ${c.pass} of ${c.max}.`) : T('Bestehensgrenze gemeinsam mit Abstraktion bzw. Numerik: 10 von 20.', 'Pass score shared with abstract / numerical: 10 of 20.')} ${T('Lösungen nach der Abgabe.', 'Solutions after submission.')}</p>`}
    <div class="row"><button class="btn primary" type="submit">${T('Test starten', 'Start test')}</button></div></form></div>`;
    $$('[data-m]', main).forEach(b => b.onclick = () => { mode = b.dataset.m; body(); });
    $('#f').onsubmit = e => {
      e.preventDefault(); const fd = new FormData(e.target), o = { count: mode === 'exam' ? c.n : (fd.get('count') === 'all' ? 'all' : +fd.get('count')), area: fd.get('area'), level: fd.get('level') };
      const items = pick(id, o); if (!items.length) { toast(T('Keine Fragen im Filter.', 'No questions match the filter.')); return; }
      startRun({ test: id, mode, items });
    };
  };
  body();
};

/* ---- simulation ---- */
const SIM_ORDER = ['verbal', 'numerical', 'abstract', 'eu', 'digital', 'eufte'];
function simStep(t) { return sim && sim.steps[t]; }
function simGates() {
  const s = id => simStep(id), v = s('verbal'), n = s('numerical'), a = s('abstract'), eu = s('eu'), ds = s('digital'), ef = s('eufte');
  const p1done = !!(v && n && a), p2done = !!(eu && ds && ef);
  const g1 = p1done ? { v: v.score >= TESTS.verbal.pass, c: (n.score + a.score) >= REASON_COMBINED, comb: n.score + a.score } : null;
  if (g1) g1.ok = g1.v && g1.c;
  const g2 = p2done ? { eu: eu.score >= TESTS.eu.pass, ds: ds.score >= TESTS.digital.pass, ef: ef.score >= TESTS.eufte.pass } : null;
  if (g2) g2.ok = g2.eu && g2.ds && g2.ef;
  let prelim = null, final = null;
  if (v && eu && ds) prelim = 100 * (.40 * v.score / 20 + .30 * eu.score / 30 + .30 * ds.score / 40);
  if (v && eu && ds && ef) final = 100 * (.35 * v.score / 20 + .25 * eu.score / 30 + .25 * ds.score / 40 + .15 * ef.score / 10);
  return { g1, g2, p1done, p2done, prelim, final };
}
function startSimStep(t) {
  if (t === 'eufte') { location.hash = '#/writing/sim'; return; }
  startRun({ test: t, mode: 'exam', items: pick(t, { count: TESTS[t].n }), simStep: true });
}
VIEWS.sim = main => {
  if (!sim) {
    main.innerHTML = `<div class="stack" style="max-width:760px"><h1>${T('Komplette Simulation', 'Full simulation')}</h1>
    <p class="muted">${T('Sechs Tests in der Reihenfolge der Ausschreibung: Teil 1 (65 Minuten), dann Teil 2 (110 Minuten). Am Ende siehst du Bestehensgrenzen und eine gewichtete Gesamtwertung. Den Schreibtest bewertest du selbst.', 'Six tests in the order of the notice: Part 1 (65 minutes), then Part 2 (110 minutes). At the end you see the pass scores and a weighted overall score. You rate the written test yourself.')}</p>
    <div><button class="btn primary" id="sim-new">${T('Simulation starten', 'Start simulation')}</button></div></div>`;
    $('#sim-new').onclick = () => { sim = { id: uid(), started: iso(), steps: {} }; store.set('sim', sim); route_(); };
    return;
  }
  const G = simGates(), next = SIM_ORDER.find(t => !simStep(t)), part2Open = G.p1done;
  const stepHTML = t => {
    const c = TESTS[t], r = simStep(t), locked = c.part === 2 && !part2Open, isNext = t === next && !locked;
    const pass = r && c.pass != null && t !== 'numerical' && t !== 'abstract' ? r.score >= c.pass : null;
    const cls = r ? (pass === false ? 'fail' : 'done') : isNext ? 'next' : locked ? 'locked' : '';
    return `<div class="step ${cls}"><div class="n">${r ? (pass === false ? '✕' : '✓') : SIM_ORDER.indexOf(t) + 1}</div><div><b>${esc(tname(t))}</b><div class="xs muted">${c.n ? c.n + ' ' + T('Fragen', 'questions') + ' · ' : ''}${c.min} min${c.pass != null && t !== 'numerical' && t !== 'abstract' ? ' · ' + T('Bestehen', 'pass') + ' ' + c.pass + '/' + c.max : ''}</div></div>
      <div class="row">${r ? `<b class="mono" style="color:var(--${pass === false ? 'bad' : 'ok'})">${num(r.score, 1)} / ${c.max}</b>${r.rec ? `<a class="btn sm" href="#/result/${r.rec}">${T('Details', 'Details')}</a>` : ''}` : locked ? `<span class="sm muted">${T('gesperrt', 'locked')}</span>` : `<button class="btn ${isNext ? 'primary' : ''} sm" data-t="${t}">${T('Starten', 'Start')}</button>`}</div></div>`;
  };
  const gateCard = (g, which) => !g ? '' : which === 1
    ? `<div class="callout"><div><b>${g.ok ? T('Teil 1 bestanden – du würdest zu Teil 2 eingeladen.', 'Part 1 passed – you would be invited to Part 2.') : T('Teil 1 nicht bestanden – im echten Concours endete das Verfahren hier.', 'Part 1 not passed – in the real competition the procedure would end here.')}</b><br>${T('Verbal', 'Verbal')}: ${g.v ? '✓' : '✕'} ${num(simStep('verbal').score, 0)}/20 (≥ 10) · ${T('Numerik + Abstraktion', 'Numerical + abstract')}: ${g.c ? '✓' : '✕'} ${num(g.comb, 0)}/20 (≥ 10)${g.ok ? '' : '<br>' + T('Zum Üben kannst du trotzdem Teil 2 absolvieren.', 'For practice you can still take Part 2.')}</div></div>`
    : `<div class="callout"><div><b>${g.ok ? T('Alle Bestehensgrenzen in Teil 2 erreicht.', 'All Part 2 pass scores reached.') : T('Mindestens eine Bestehensgrenze in Teil 2 verfehlt.', 'At least one Part 2 pass score missed.')}</b><br>EU ${g.eu ? '✓' : '✕'} ${num(simStep('eu').score, 0)}/30 (≥ 15) · ${T('Digital', 'Digital')} ${g.ds ? '✓' : '✕'} ${num(simStep('digital').score, 0)}/40 (≥ 20)${g.eu ? '' : ' <span class="muted">(' + T('im Concours nicht gewertet', 'not scored in the competition') + ')</span>'} · EUFTE ${g.ef ? '✓' : '✕'} ${num(simStep('eufte').score, 1)}/10 (≥ 5)</div></div>`;
  main.innerHTML = `<div class="stack" style="max-width:900px"><div class="row spread"><div><h1 style="margin:0">${T('Simulation', 'Simulation')}</h1><span class="sm muted">${when(sim.started)}</span></div><button class="btn danger sm" id="sim-reset">${T('Verwerfen', 'Discard')}</button></div>
  <h2 class="part-label" style="margin-top:0">${T('Teil 1 · Reasoning', 'Part 1 · Reasoning')}</h2><div class="steps">${['verbal', 'numerical', 'abstract'].map(stepHTML).join('')}</div>${gateCard(G.g1, 1)}
  <h2 class="part-label">${T('Teil 2 · EU-Wissen, Digital, EUFTE', 'Part 2 · EU knowledge, digital, EUFTE')}</h2><div class="steps">${['eu', 'digital', 'eufte'].map(stepHTML).join('')}</div>${gateCard(G.g2, 2)}
  ${G.final != null ? `<section class="card pad-lg"><h2>${T('Gewichtete Gesamtwertung', 'Weighted overall score')}</h2><div class="grid g2"><div class="stat"><span class="l">${T('Vorläufig (Reasoning verbal 40 · EU 30 · Digital 30)', 'Preliminary (verbal 40 · EU 30 · digital 30)')}</span><span class="v">${num(G.prelim, 1)}</span></div><div class="stat"><span class="l">${T('Endgültig (35 · 25 · 25 · EUFTE 15)', 'Final (35 · 25 · 25 · EUFTE 15)')}</span><span class="v">${num(G.final, 1)}</span></div></div>
  <p class="sm muted" style="margin-bottom:0">${T('Richtwert von 0 bis 100: jeder Wert als Anteil seines Maximums, gewichtet nach der Ausschreibung. EPSOs Normierung ist nicht veröffentlicht; der EUFTE-Wert ist deine Selbstbewertung.', 'Indicative value from 0 to 100: each score as a share of its maximum, weighted as in the notice. EPSO’s normalisation is not published; the EUFTE value is your own rating.')}</p></section>` : ''}</div>`;
  $$('[data-t]', main).forEach(b => b.onclick = () => startSimStep(b.dataset.t));
  $('#sim-reset').onclick = async () => { if (await ask({ title: T('Simulation verwerfen?', 'Discard the simulation?'), text: T('Die Einzelergebnisse bleiben unter „Ergebnisse“ erhalten.', 'The individual results stay under “Results”.'), ok: T('Verwerfen', 'Discard'), danger: true })) { sim = null; store.del('sim'); route_(); } };
};

/* ---- results list ---- */
VIEWS.results = main => {
  let f = 'all';
  const draw = () => {
    const list = [...history].reverse().filter(r => f === 'all' || r.test === f);
    const pts = [...history].filter(r => r.test !== 'eufte' && (f === 'all' || r.test === f)).map(r => pct(r.score, r.n));
    const spark = pts.length > 1 ? (() => { const w = 600, h = 80, st = w / (pts.length - 1); return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="${T('Verlauf der Ergebnisse in Prozent', 'Result trend in percent')}"><polyline fill="none" stroke="var(--brand)" stroke-width="3" stroke-linejoin="round" points="${pts.map((p, i) => `${(i * st).toFixed(1)},${(h - 4 - p / 100 * (h - 8)).toFixed(1)}`).join(' ')}"/></svg>`; })() : '';
    main.innerHTML = `<div class="stack"><div class="row spread"><h1 style="margin:0">${T('Ergebnisse', 'Results')}</h1>
    <div class="row"><button class="btn sm" id="r-exp">${T('Exportieren', 'Export')}</button><label class="btn sm" style="cursor:pointer">${T('Importieren', 'Import')}<input type="file" accept="application/json" id="r-imp" hidden></label><button class="btn sm danger" id="r-clr">${T('Alles löschen', 'Delete all')}</button></div></div>
    <div class="card"><div class="row spread"><div class="seg" role="group">${[['all', T('Alle', 'All')], ...Object.keys(TESTS).map(t => [t, tname(t)])].map(([k, l]) => `<button data-f="${k}" aria-pressed="${f === k}">${esc(l)}</button>`).join('')}</div><span class="sm muted">${list.length} ${T('Einträge', 'entries')}</span></div>${spark ? `<div style="margin-top:14px">${spark}<div class="xs muted">${T('Ergebnis in % über die Zeit (ohne Schreibtest)', 'Score in % over time (excluding written test)')}</div></div>` : ''}</div>
    ${list.length ? `<div class="table-wrap"><table><thead><tr><th>${T('Test', 'Test')}</th><th>${T('Datum', 'Date')}</th><th>${T('Modus', 'Mode')}</th><th class="num">${T('Punkte', 'Score')}</th><th class="num">%</th><th class="num">${T('Zeit', 'Time')}</th></tr></thead><tbody>${list.map(r => `<tr><td><a href="#/result/${r.id}">${esc(tname(r.test))}</a>${r.sim ? ' <span class="xs muted">(Sim)</span>' : ''}</td><td class="muted">${when(r.at)}</td><td>${r.mode === 'exam' ? T('Prüfung', 'Exam') : T('Training', 'Training')}</td><td class="num">${r.test === 'eufte' ? num(r.score, 1) + '/10' : r.score + '/' + r.n}</td><td class="num">${r.test === 'eufte' ? pct(r.score, 10) : pct(r.score, r.n)}</td><td class="num mono">${fmtT(r.sec || 0)}</td></tr>`).join('')}</tbody></table></div>` : `<div class="card"><p class="muted" style="margin:0">${T('Keine Ergebnisse.', 'No results.')}</p></div>`}</div>`;
    $$('[data-f]', main).forEach(b => b.onclick = () => { f = b.dataset.f; draw(); });
    $('#r-exp').onclick = () => download('ad5-results-' + iso().slice(0, 10) + '.json', { version: 2, exported: iso(), history, sim });
    $('#r-imp').onchange = async e => {
      try { const d = JSON.parse(await e.target.files[0].text()); const inc = Array.isArray(d) ? d : d.history; if (!Array.isArray(inc)) throw 0; const have = new Set(history.map(r => r.id)); inc.forEach(r => { if (r && r.id && r.test && !have.has(r.id)) history.push(r); }); history.sort((a, b) => a.at.localeCompare(b.at)); saveHistory(); toast(T('Import abgeschlossen.', 'Import complete.')); draw(); } catch { toast(T('Datei konnte nicht gelesen werden.', 'Could not read the file.')); }
    };
    $('#r-clr').onclick = async () => { if (await ask({ title: T('Alle Ergebnisse löschen?', 'Delete all results?'), text: T('Das kann nicht rückgängig gemacht werden. Exportiere vorher eine Sicherung.', 'This cannot be undone. Export a backup first.'), ok: T('Löschen', 'Delete'), danger: true })) { history = []; sim = null; store.del('history'); store.del('sim'); draw(); } };
  };
  draw();
};

/* ---- sources ---- */
VIEWS.sources = main => {
  const R = D.resources, cats = [...new Set(R.map(r => r.category))].sort(), kinds = [...new Set(R.map(r => r.kind))].sort();
  const st = { q: '', c: 'all', k: 'all', free: false };
  const draw = () => {
    const l = ui === 'de', f = R.filter(r => (st.c === 'all' || r.category === st.c) && (st.k === 'all' || r.kind === st.k) && (!st.free || r.access === 'free') &&
      (!st.q || ((l ? r.titleDE || r.title : r.title) + ' ' + (l ? r.descriptionDE || r.description : r.description)).toLowerCase().includes(st.q.toLowerCase())));
    $('#res-list').innerHTML = f.length ? f.map(r => `<div class="res"><div class="row"><a class="t" href="${esc(r.url)}" target="_blank" rel="noopener">${esc(l ? r.titleDE || r.title : r.title)} ↗</a>${r.new ? `<b class="sm" style="color:var(--brand)">${T('neu', 'new')}</b>` : ''}</div>
      <p class="sm muted" style="margin:0">${esc(l ? r.descriptionDE || r.description : r.description)}</p><p class="xs muted" style="margin:0">${esc(r.category)} · ${esc(r.kind)} · ${r.access === 'free' ? T('kostenlos', 'free') : T('kostenpflichtig', 'paid')} · ${esc(r.language)}</p></div>`).join('') : `<p class="muted">${T('Keine Treffer.', 'No matches.')}</p>`;
    $('#res-n').textContent = f.length + ' / ' + R.length;
  };
  main.innerHTML = `<div class="stack"><div><h1>${T('Quellen', 'Sources')}</h1><p class="muted">${T('Rechtlich verbindlich ist nur die Ausschreibung. Die Quellenliste für den EU-Wissenstest erscheint laut EPSO etwa zwei Monate vor dem Test.', 'Only the notice is legally binding. EPSO publishes the EU knowledge source list about two months before the test.')}</p></div>
  <div class="filters"><label class="field grow">${T('Suche', 'Search')}<input type="search" id="s-q" placeholder="${T('Stichwort …', 'Keyword …')}"></label><label class="field">${T('Kategorie', 'Category')}<select id="s-c"><option value="all">${T('Alle', 'All')}</option>${cats.map(c => `<option>${esc(c)}</option>`).join('')}</select></label><label class="field">${T('Art', 'Type')}<select id="s-k"><option value="all">${T('Alle', 'All')}</option>${kinds.map(c => `<option>${esc(c)}</option>`).join('')}</select></label><label class="row sm" style="min-height:44px"><input type="checkbox" id="s-f"> ${T('nur kostenlos', 'free only')}</label><span class="sm muted" id="res-n"></span></div>
  <div class="card" id="res-list"></div></div>`;
  $('#s-q').oninput = e => { st.q = e.target.value; draw(); }; $('#s-c').onchange = e => { st.c = e.target.value; draw(); }; $('#s-k').onchange = e => { st.k = e.target.value; draw(); }; $('#s-f').onchange = e => { st.free = e.target.checked; draw(); };
  draw();
};

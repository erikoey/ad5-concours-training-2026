/* ============ engine: item selection, test runs, rendering, scoring, review ============ */
const LEVEL = { standard: ['Standard', 'Standard'], hard: ['Schwer', 'Hard'], expert: ['Sehr schwer', 'Expert'] };
const areaOf = (q, test) => (test === 'eu' || test === 'digital') ? q.area : test === 'abstract' ? (LEVEL[q.level][lang() === 'de' ? 0 : 1]) : q.tag;

/* ---- selection: exam draws follow the structure of the real test; training may filter ---- */
function allocate(groups, n) {                       // groups: {key: [items]}; largest-remainder proportional allocation
  const keys = Object.keys(groups), total = keys.reduce((s, k) => s + groups[k].length, 0);
  const quota = keys.map(k => n * groups[k].length / total), base = quota.map(Math.floor);
  let rest = n - base.reduce((a, b) => a + b, 0);
  quota.map((q, i) => [q - base[i], i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (rest > 0) { base[i]++; rest--; } });
  return keys.flatMap((k, i) => shuffle(groups[k]).slice(0, Math.min(base[i], groups[k].length)));
}
const groupBy = (arr, f) => arr.reduce((o, x) => ((o[f(x)] = o[f(x)] || []).push(x), o), {});
function sample(test, n, filtered, pool) {
  n = Math.min(n, pool.length);
  if (filtered) return shuffle(pool).slice(0, n);
  if (test === 'abstract' && n === 10) { const g = groupBy(pool, q => q.level); return shuffle([...shuffle(g.standard).slice(0, 6), ...shuffle(g.hard).slice(0, 2), ...shuffle(g.expert).slice(0, 2)]); }
  if (test === 'digital' && n === 40) { const g = groupBy(pool, q => q.area); return shuffle(Object.values(g).flatMap(a => shuffle(a).slice(0, 8))); }
  if (test === 'eu') return shuffle(allocate(groupBy(pool, q => q.area), n));
  return shuffle(pool).slice(0, n);
}
function pick(test, o = {}) {
  const cfg = TESTS[test]; let pool = bankOf(test), filtered = false;
  if (o.area && o.area !== 'all') { pool = pool.filter(q => (q.area || q.tag) === o.area); filtered = true; }
  if (o.level && o.level !== 'all') { pool = pool.filter(q => q.level === o.level); filtered = true; }
  const n = o.count === 'all' ? pool.length : (o.count || cfg.n);
  return sample(test, n, filtered, pool);
}

/* ---- run lifecycle ---- */
function startRun({ test, mode, items, simStep }) {
  const cfg = TESTS[test], scale = items.length / cfg.n;
  const limit = mode === 'exam' ? Math.round(cfg.min * 60 * (scale > 1 ? 1 : scale)) : null;
  run = { id: uid(), test, mode, lang: cfg.lang, items, answers: items.map(() => null), flags: items.map(() => false), checked: items.map(() => false), times: items.map(() => 0),
    idx: 0, startedAt: iso(), t0: Date.now(), limit, done: false, simStep: !!simStep, since: Date.now(), warned: {}, calc: '' };
  run.timer = setInterval(tick, 250);
  if (location.hash === '#/run') route_(); else location.hash = '#/run';
}
function accrue() { if (run && !run.done) { const n = Date.now(); run.times[run.idx] += (n - run.since) / 1000; run.since = n; } }
function remaining() { return run.limit == null ? null : run.limit - (Date.now() - run.t0) / 1000; }
function tick() {
  if (!run || run.done) return;
  const t = $('#timer'); if (!t) return;
  const rem = remaining(), el = (Date.now() - run.t0) / 1000;
  t.textContent = fmtT(rem == null ? el : rem);
  t.classList.toggle('low', rem != null && rem < 300); t.classList.toggle('crit', rem != null && rem < 60);
  if (rem != null) {
    if (rem < 300 && !run.warned[5]) { run.warned[5] = 1; announce(T('Noch fünf Minuten.', 'Five minutes left.')); }
    if (rem < 60 && !run.warned[1]) { run.warned[1] = 1; announce(T('Noch eine Minute.', 'One minute left.')); }
    if (rem <= 0) finishRun(true);
  }
}
function select(i, v) { if (run.mode === 'training' && run.checked[i]) return; run.answers[i] = v; renderRun(); }
function go(i) { if (i < 0 || i >= run.items.length) return; accrue(); run.idx = i; renderRun(); }
async function submitRun() {
  const un = run.answers.filter(a => a === null).length, fl = run.flags.filter(Boolean).length;
  const ok = await ask({ title: T('Test abgeben?', 'Submit the test?'), ok: T('Abgeben', 'Submit'), cancel: T('Zurück', 'Back'),
    text: (un ? T(`${un} Frage(n) sind unbeantwortet. `, `${un} question(s) are unanswered. `) : T('Alle Fragen sind beantwortet. ', 'All questions are answered. ')) + (fl ? T(`${fl} markiert. `, `${fl} flagged. `) : '') + T('Danach sind keine Änderungen mehr möglich.', 'You cannot change answers afterwards.') });
  if (ok) finishRun(false);
}
function finishRun(expired) {
  if (!run || run.done) return;
  accrue(); clearInterval(run.timer); run.done = true;
  const cfg = TESTS[run.test], items = run.items;
  const score = items.reduce((s, q, i) => s + (run.answers[i] === q.answer ? 1 : 0), 0);
  const areas = {}; items.forEach((q, i) => { const a = (q.area || q.tag || q.level); (areas[a] = areas[a] || [0, 0]); areas[a][1]++; if (run.answers[i] === q.answer) areas[a][0]++; });
  const rec = { id: run.id, test: run.test, mode: run.mode, at: run.startedAt, sec: Math.round((Date.now() - run.t0) / 1000), limit: run.limit, expired: !!expired,
    score, n: items.length, max: items.length, full: items.length === cfg.n, scaled: items.length ? score / items.length * cfg.max : 0,
    items: items.map((q, i) => ({ id: q.id, sel: run.answers[i], sec: Math.round(run.times[i]), flag: run.flags[i] })), areas, sim: run.simStep };
  history.push(rec); saveHistory();
  if (run.simStep && sim) { sim.steps[run.test] = { rec: rec.id, score: rec.scaled, raw: score, n: rec.n, at: rec.at }; store.set('sim', sim); }
  if (expired) toast(T('Zeit abgelaufen – der Test wurde automatisch abgegeben.', 'Time is up – the test was submitted automatically.'));
  location.hash = '#/result/' + rec.id;
}

/* ---- calculator (numerical test) ---- */
function calcEval(src) {
  const s = src.replace(/,/g, '.').replace(/×/g, '*').replace(/÷/g, '/').replace(/\s+/g, '');
  if (!s || !/^[0-9+\-*/().%^]+$/.test(s)) return null;
  let p = 0;
  const peek = () => s[p];
  const number = () => { const m = /^\d*\.?\d+/.exec(s.slice(p)); if (!m) throw 0; p += m[0].length; return parseFloat(m[0]); };
  const prim = () => {
    let v;
    if (peek() === '(') { p++; v = expr(); if (peek() !== ')') throw 0; p++; }
    else if (peek() === '-') { p++; v = -prim(); }
    else if (peek() === '+') { p++; v = prim(); }
    else v = number();
    while (peek() === '%') { p++; v /= 100; }
    return v;
  };
  const pow = () => { let v = prim(); if (peek() === '^') { p++; v = Math.pow(v, pow()); } return v; };
  const term = () => { let v = pow(); while (peek() === '*' || peek() === '/') { const o = s[p++]; const r = pow(); v = o === '*' ? v * r : v / r; } return v; };
  const expr = () => { let v = term(); while (peek() === '+' || peek() === '-') { const o = s[p++]; const r = term(); v = o === '+' ? v + r : v - r; } return v; };
  try { const v = expr(); return p === s.length && isFinite(v) ? v : null; } catch { return null; }
}

/* ---- rendering building blocks (shared by run and review) ---- */
function tableHTML(q) {
  return `<div class="table-wrap" style="margin-bottom:16px"><table class="dtable"><caption>${esc(q.caption)}</caption><thead><tr>${q.headers.map((h, i) => `<th class="${i ? 'num' : ''}">${esc(h)}</th>`).join('')}</tr></thead><tbody>${q.rows.map(r => `<tr>${r.map((c, i) => `<td class="${i ? 'num' : ''}">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
function stimulus(q, test) {
  if (test === 'verbal') return `<div class="passage">${esc(q.passage)}</div>`;
  if (test === 'numerical') return tableHTML(q);
  if (test === 'abstract') {
    const f = q.figs.map((f, i) => frameHTML(q.style, f, i + 1));
    if (q.kind !== 'matrix') f.push(frameHTML(q.style, null, q.figs.length + 1));
    return `<div class="figs ${q.kind === 'matrix' ? 'matrix' : ''}" role="group" aria-label="${q.kind === 'matrix' ? T('Matrix, Feld unten rechts fehlt', '3×3 matrix, bottom-right field missing') : T('Reihe, das letzte Feld fehlt', 'Sequence, last field missing')}">${f.join('')}</div>`;
  }
  return '';
}
function optionsHTML(q, test, { sel = null, show = false, locked = false, name = 'o' }) {
  const fig = test === 'abstract';
  return `<fieldset class="options ${fig ? 'fig-opts' : ''}"><legend class="sr">${T('Antwort wählen', 'Choose an answer')}</legend>${q.options.map((o, i) => {
    const right = show && i === q.answer, wrong = show && sel === i && i !== q.answer;
    const cls = `opt ${right ? 'right' : ''} ${wrong ? 'wrong' : ''} ${locked ? 'locked' : ''}`;
    const tag = show ? (right ? `<span class="tag" style="color:var(--ok)">✓ ${T('Richtige Antwort', 'Correct answer')}</span>` : wrong ? `<span class="tag" style="color:var(--bad)">✕ ${T('Deine Antwort', 'Your answer')}</span>` : '') : '';
    return `<label class="${cls}"><input type="radio" name="${name}" value="${i}" ${sel === i ? 'checked' : ''} ${locked ? 'disabled' : ''}><span class="k">${L[i]}</span>${fig ? `<span>${frameHTML(q.style, o, '', T('Antwortoption', 'Answer option') + ' ' + L[i])}${tag}</span>` : `<span>${esc(o)}${tag}</span>`}</label>`;
  }).join('')}</fieldset>`;
}
function feedbackHTML(q, sel, test) {
  const ok = sel === q.answer, notes = (q.notes || []).filter(Boolean);
  const head = ok ? T('Richtig.', 'Correct.') : sel === null ? T('Nicht beantwortet.', 'Not answered.') : T('Nicht richtig.', 'Not correct.');
  return `<div class="feedback ${ok ? 'ok' : sel === null ? '' : 'bad'}"><b>${head}</b> ${T('Lösung', 'Answer')}: <b>${L[q.answer]}</b><p style="margin:.5em 0 0">${esc(q.explanation)}</p>${notes.length ? `<details style="margin-top:.5em"><summary>${T('Warum die anderen Antworten nicht passen', 'Why the other options fail')}</summary><ul>${notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul></details>` : ''}${q.source ? `<p class="sm" style="margin:.6em 0 0"><a href="${esc(q.source)}" target="_blank" rel="noopener">${T('Quelle / Rechtsgrundlage', 'Source / legal basis')} ↗</a></p>` : ''}</div>`;
}
const questionText = q => q.q;

/* ---- the run view ---- */
function renderRun() {
  const main = $('#main'), i = run.idx, q = run.items[i], test = run.test, cfg = TESTS[test], training = run.mode === 'training';
  const checked = run.checked[i], sel = run.answers[i], n = run.items.length, answered = run.answers.filter(a => a !== null).length;
  const rem = remaining();
  main.innerHTML = `
  <div class="runbar" role="region" aria-label="${T('Teststatus', 'Test status')}">
    <div><div class="title">${esc(tname(test))}</div><div class="xs muted">${T('Teil', 'Part')} ${cfg.part} · ${training ? T('Training', 'Training') : T('Prüfungsmodus', 'Exam mode')}</div></div>
    <div class="progress"><div class="bar" aria-hidden="true"><i style="width:${pct(answered, n)}%"></i></div><div class="xs muted" style="margin-top:3px">${answered}/${n} ${T('beantwortet', 'answered')}</div></div>
    <div class="timer mono ${rem != null && rem < 60 ? 'crit' : rem != null && rem < 300 ? 'low' : ''}" id="timer" role="timer" aria-label="${rem == null ? T('Verstrichene Zeit', 'Elapsed time') : T('Verbleibende Zeit', 'Time remaining')}">${fmtT(rem == null ? (Date.now() - run.t0) / 1000 : rem)}</div>
    <button class="btn primary" data-act="submit">${T('Abgeben', 'Submit')}</button>
  </div>
  <div class="run-grid">
    <section class="card qcard" aria-labelledby="qtitle">
      <div class="qmeta"><h2 id="qtitle" style="margin:0;font-size:1.05rem">${T('Frage', 'Question')} ${i + 1} / ${n}</h2><span class="muted sm">${esc(areaOf(q, test))}</span>
        <span class="grow"></span><button class="btn sm ${run.flags[i] ? 'primary' : ''}" data-act="flag" aria-pressed="${run.flags[i]}">⚑ ${run.flags[i] ? T('Markiert', 'Flagged') : T('Markieren', 'Flag')}</button></div>
      ${stimulus(q, test)}
      <p class="qtext">${esc(questionText(q))}</p>
      ${optionsHTML(q, test, { sel, show: training && checked, locked: training && checked, name: 'ans' })}
      ${training && checked ? feedbackHTML(q, sel, test) : ''}
      <div class="row" style="margin-top:20px">
        <button class="btn" data-act="prev" ${i === 0 ? 'disabled' : ''}>← ${T('Zurück', 'Previous')}</button>
        <button class="btn" data-act="next" ${i === n - 1 ? 'disabled' : ''}>${T('Weiter', 'Next')} →</button>
        <span class="grow"></span>
        ${sel !== null && !checked ? `<button class="btn ghost sm" data-act="clear">${T('Auswahl löschen', 'Clear answer')}</button>` : ''}
        ${training && !checked ? `<button class="btn primary" data-act="check" ${sel === null ? 'disabled' : ''}>${T('Antwort prüfen', 'Check answer')}</button>` : ''}
      </div>
      <p class="xs muted" style="margin:14px 0 0">${T('A–E wählen · ←/→ navigieren · F markieren', 'A–E select · ←/→ navigate · F flag')}</p>
    </section>
    <aside class="side" aria-label="${T('Fragenübersicht', 'Question overview')}">
      <div class="card flat"><h3>${T('Übersicht', 'Overview')}</h3><div class="qnav" role="group">${run.items.map((_, k) => {
        const c = [run.answers[k] !== null ? 'done' : '', k === i ? 'cur' : '', run.flags[k] ? 'flag' : '', training && run.checked[k] ? (run.answers[k] === run.items[k].answer ? 'ok' : 'no') : ''].join(' ');
        return `<button class="${c}" data-go="${k}" aria-label="${T('Frage', 'Question')} ${k + 1}${run.answers[k] !== null ? ', ' + T('beantwortet', 'answered') : ''}${run.flags[k] ? ', ' + T('markiert', 'flagged') : ''}" ${k === i ? 'aria-current="true"' : ''}>${k + 1}</button>`; }).join('')}</div></div>
      ${test === 'numerical' ? `<div class="card flat calc"><h3>${T('Taschenrechner', 'Calculator')}</h3><label class="sr" for="calc-in">${T('Rechenausdruck', 'Expression')}</label><input id="calc-in" type="text" inputmode="decimal" autocomplete="off" placeholder="z. B. 12,5 * 1,19" value="${esc(run.calc)}"><output id="calc-out" aria-live="polite">${(() => { const v = calcEval(run.calc); return v == null ? '–' : num(v, 6); })()}</output><p class="xs muted" style="margin:0">+ − * / ( ) % ^ · ${T('Komma oder Punkt', 'comma or dot')}</p></div>` : ''}
    </aside>
  </div>`;
  paintFigures(main);
  const ci = $('#calc-in'); if (ci) ci.oninput = () => { run.calc = ci.value; const v = calcEval(ci.value); $('#calc-out').textContent = v == null ? '–' : num(v, 6); };
}
VIEWS.run = () => renderRun();

document.addEventListener('click', e => {
  if (!run || run.done || parseHash()[0] !== 'run') return;
  const b = e.target.closest('[data-act],[data-go]'); if (!b) return;
  const a = b.dataset.act;
  if (b.dataset.go !== undefined) go(+b.dataset.go);
  else if (a === 'prev') go(run.idx - 1); else if (a === 'next') go(run.idx + 1);
  else if (a === 'flag') { run.flags[run.idx] = !run.flags[run.idx]; renderRun(); }
  else if (a === 'clear') { run.answers[run.idx] = null; renderRun(); }
  else if (a === 'check') { run.checked[run.idx] = true; renderRun(); }
  else if (a === 'submit') submitRun();
});
document.addEventListener('change', e => {
  if (!run || run.done || !e.target.matches('input[name="ans"]')) return;
  select(run.idx, +e.target.value);
  const r = $(`input[name="ans"][value="${run.answers[run.idx]}"]`); if (r) r.focus({ preventScroll: true });
});
document.addEventListener('keydown', e => {
  if (!run || run.done || parseHash()[0] !== 'run' || e.target.closest('input[type=text],textarea,select,dialog') || e.ctrlKey || e.metaKey || e.altKey) return;
  const k = e.key.toLowerCase(), q = run.items[run.idx], idx = 'abcde'.indexOf(k);
  if (idx >= 0 && idx < q.options.length) { e.preventDefault(); select(run.idx, idx); const r = $(`input[name="ans"][value="${idx}"]`); if (r) r.focus({ preventScroll: true }); }
  else if (k === 'arrowright') { e.preventDefault(); go(run.idx + 1); } else if (k === 'arrowleft') { e.preventDefault(); go(run.idx - 1); }
  else if (k === 'f') { run.flags[run.idx] = !run.flags[run.idx]; renderRun(); }
  else if (k === 'enter' && run.mode === 'training' && run.answers[run.idx] !== null && !run.checked[run.idx]) { run.checked[run.idx] = true; renderRun(); }
});
window.addEventListener('beforeunload', e => { if (run && !run.done) { e.preventDefault(); e.returnValue = ''; } });

/* ---- result view ---- */
function verdict(rec) {
  const cfg = TESTS[rec.test];
  if (!rec.full || rec.mode !== 'exam') return null;
  if (cfg.pass != null) return rec.score >= cfg.pass ? 'ok' : 'bad';
  return null;
}
function breakdownHTML(areas) {
  const rows = Object.entries(areas).sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1]);
  return rows.map(([a, [c, t]]) => `<div style="margin:10px 0"><div class="row spread sm"><span>${esc(a)}</span><span class="mono muted">${c}/${t}</span></div><div class="bar ${pct(c, t) >= 70 ? 'ok' : pct(c, t) < 50 ? 'bad' : 'warn'}"><i style="width:${pct(c, t)}%"></i></div></div>`).join('');
}
VIEWS.result = (main, id) => {
  const rec = history.find(r => r.id === id);
  if (!rec) { main.innerHTML = `<div class="card"><p>${T('Ergebnis nicht gefunden.', 'Result not found.')}</p><a class="btn" href="#/results">${T('Zu den Ergebnissen', 'Back to results')}</a></div>`; return; }
  const cfg = TESTS[rec.test], v = verdict(rec), p = pct(rec.score, rec.n), un = rec.items.filter(x => x.sel === null).length;
  const items = rec.items.map((x, i) => ({ ...x, q: itemById(rec.test, x.id), n: i + 1 })).filter(x => x.q);
  const note = rec.test === 'numerical' || rec.test === 'abstract'
    ? T(`Numerik und Abstraktion werden gemeinsam gewertet: mindestens ${REASON_COMBINED} von 20 Punkten.`, `Numerical and abstract are scored together: at least ${REASON_COMBINED} of 20 points.`) : '';
  main.innerHTML = `<div class="stack">
  <div class="card pad-lg"><div class="score-hero">
    <div class="ring ${v || ''}" style="--p:${p};--s:132px"><span>${p}%</span></div>
    <div class="grow"><h1 style="margin-bottom:.15em">${esc(tname(rec.test, ui))}</h1>
      <p class="muted" style="margin:0 0 10px">${rec.score} / ${rec.n} ${T('Punkte', 'points')} · ${rec.mode === 'exam' ? T('Prüfungsmodus', 'Exam mode') : T('Training', 'Training')}${rec.sim ? ' · ' + T('Simulation', 'Simulation') : ''}</p>
      <div class="row">${v ? `<span class="chip ${v}">${v === 'ok' ? T('Bestehensgrenze erreicht', 'Pass score reached') : T('Bestehensgrenze nicht erreicht', 'Pass score not reached')} (${cfg.pass}/${cfg.max})</span>` : `<span class="sm muted">${rec.full ? T('Keine eigene Bestehensgrenze', 'No separate pass score') : T('Teilumfang, keine offizielle Wertung', 'Partial set, no official scoring')}</span>`}
        <span class="sm muted">${T('Zeit', 'Time')} ${fmtT(rec.sec)}${rec.limit ? ' / ' + fmtT(rec.limit) : ''}${rec.expired ? ' · ' + T('abgelaufen', 'expired') : ''}${un ? ' · ' + un + ' ' + T('unbeantwortet', 'unanswered') : ''}</span></div>
      ${note ? `<p class="sm muted" style="margin:12px 0 0">${esc(note)}</p>` : ''}</div></div>
    <div class="row" style="margin-top:20px">${rec.sim ? `<a class="btn primary" href="#/sim">${T('Weiter in der Simulation', 'Continue the simulation')} →</a>` : `<a class="btn primary" href="#/setup/${rec.test}">${T('Neuer Versuch', 'New attempt')}</a>`}
      ${(items.some(x => x.sel !== x.q.answer)) && !rec.sim ? `<button class="btn" id="retry-wrong">${T('Nur Fehler wiederholen', 'Retry mistakes only')}</button>` : ''}
      <button class="btn ghost" id="export-one">${T('Als JSON exportieren', 'Export as JSON')}</button></div></div>
  <div class="grid g2"><div class="card"><h3>${T('Nach Themenbereich', 'By topic area')}</h3>${breakdownHTML(rec.areas)}</div>
    <div class="card"><h3>${T('Zeitverteilung', 'Time distribution')}</h3><p class="sm muted">${T('Ø pro Frage', 'Average per question')}: <b class="mono">${num(rec.sec / Math.max(1, rec.n), 0)} s</b>${cfg.n ? ` · ${T('Zielwert in der Prüfung', 'target in the real test')}: <b class="mono">${num(cfg.min * 60 / cfg.n, 0)} s</b>` : ''}</p>
      <div class="qnav">${items.map(x => `<button class="${x.sel === x.q.answer ? 'ok' : 'no'}" disabled title="${x.sec}s">${x.n}</button>`).join('')}</div>
      </div></div>
  <div class="card"><div class="row spread"><h2 style="margin:0">${T('Auswertung der Fragen', 'Question review')}</h2>
    <div class="seg" role="group" aria-label="${T('Filter', 'Filter')}">${[['all', T('Alle', 'All')], ['wrong', T('Fehler', 'Mistakes')], ['flag', T('Markiert', 'Flagged')], ['blank', T('Offen', 'Blank')]].map(([k, l], j) => `<button data-f="${k}" aria-pressed="${j === 0}">${l}</button>`).join('')}</div></div>
    <div id="rev" class="stack" style="margin-top:14px">${items.map(x => {
      const ok = x.sel === x.q.answer, st = x.sel === null ? 'blank' : ok ? 'ok' : 'bad';
      return `<details class="card flat review-item" data-k="${x.sel === null ? 'blank ' : ''}${ok ? '' : 'wrong '}${x.flag ? 'flag' : ''}"><summary><span class="chip ${st === 'ok' ? 'ok' : st === 'bad' ? 'bad' : 'warn'}">${st === 'ok' ? '✓' : st === 'bad' ? '✕' : '–'} ${x.n}</span><span class="grow sm" style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(rec.test === 'abstract' ? x.q.q : x.q.q)}</span>${x.flag ? '<span class="chip warn">⚑</span>' : ''}<span class="xs muted mono">${x.sec}s</span></summary>
        <div class="body">${stimulus(x.q, rec.test)}<p class="qtext">${esc(x.q.q)}</p>${optionsHTML(x.q, rec.test, { sel: x.sel, show: true, locked: true, name: 'r' + x.n })}${feedbackHTML(x.q, x.sel, rec.test)}</div></details>`; }).join('')}</div></div></div>`;
  $$('[data-f]', main).forEach(b => b.onclick = () => { $$('[data-f]', main).forEach(o => o.setAttribute('aria-pressed', o === b)); const f = b.dataset.f; $$('.review-item', main).forEach(d => { d.hidden = f !== 'all' && !d.dataset.k.includes(f); }); paintFigures(main); });
  $$('.review-item', main).forEach(d => d.addEventListener('toggle', () => paintFigures(d)));
  $('#export-one').onclick = () => download(`ad5-${rec.test}-${rec.at.slice(0, 10)}.json`, rec);
  const rw = $('#retry-wrong'); if (rw) rw.onclick = () => startRun({ test: rec.test, mode: 'training', items: shuffle(items.filter(x => x.sel !== x.q.answer).map(x => x.q)) });
};

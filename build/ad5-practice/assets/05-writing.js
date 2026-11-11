/* ============ writing: EUFTE practice (40 min, self-rated on five anchors) ============ */
const WR = {
  eca: { en: 'Briefing note: ECA Special Report 26/2022 (Eurostat)', de: 'Briefing Note: ECA-Sonderbericht 26/2022 (Eurostat)',
    task: 'Imagine that you work at Eurostat and the Court’s Special Report 26/2022 has recently been published. The Director-General of the Internal Audit Service wants to discuss its findings concerning peer reviews with the Director-General of Eurostat. Draft a briefing note, including speaking points, to prepare her for this meeting.',
    rules: 'You have 40 minutes. Do not include identifying marks. Consulting advance notes or taking notes during the test is prohibited. Annexes, Commission replies, timeline, audit-team and copyright sections are excluded. The assignment states no word limit.' },
  unit: { en: D.essay.title, de: 'Briefing für eine neue Referatsleitung: Wer macht was in der EU', task: D.essay.task, rules: 'Practice target 500–700 words; not an official limit. Distinguish what is in the source pack from your own recommendations.' },
};
let wr = null, pdfUrl = null;
/* the ECA report is an asset: its base64 payload is loaded once (cached) so getPdfUrl() stays synchronous */
let pdfB64 = null;
async function loadPdf() {
  if (pdfB64 != null) return;
  const res = await fetch('assets/eca-sr-26-2022-report.pdf.b64').then(r => r.text().trim());
  pdfB64 = res;
}
function getPdfUrl() {
  if (pdfUrl) return pdfUrl;
  loadPdf();
  return (pdfUrl = URL.createObjectURL(new Blob([pdfB64], { type: 'application/pdf' })));
}
const words = s => s.trim() ? s.trim().split(/\s+/).length : 0;
const draftKey = k => 'draft.' + k;

VIEWS.writing = (main, arg) => {
  if (arg === 'sim') { if (!sim) { location.replace('#/sim'); return; } return editor(main, wr && !wr.done && wr.sim ? wr.kind : (Math.random() < .5 ? 'eca' : 'unit'), true); }
  if (arg === 'eca' || arg === 'unit') return editor(main, arg, false);
  main.innerHTML = `<div class="stack"><div><h1>${T('Schreibtest (EUFTE)', 'Written test (EUFTE)')}</h1><p class="muted">${T('40 Minuten, 0 bis 10 Punkte, Bestehensgrenze 5. Bewertet werden Struktur, Prägnanz, Klarheit, Adressatenbezug und Nutzung der Unterlagen.', '40 minutes, 0 to 10 points, pass score 5. Assessed: structure, concision, clarity, fit to the audience and use of the supplied information.')}</p></div>
  <div class="grid g2">${['eca', 'unit'].map(k => `<article class="card tcard"><div><h3>${esc(WR[k][ui])}</h3><p class="sm muted" style="margin:0">${k === 'eca' ? T('Rechnungshof-Bericht (PDF)', 'Court of Auditors report (PDF)') : T('Kurzes Quellenpaket', 'Short source pack')}</p></div>
    <div class="foot"><a class="btn primary" href="#/writing/${k}">${T('Öffnen', 'Open')}</a>${store.get(draftKey(k)) ? `<span class="sm muted">${T('Entwurf gespeichert', 'draft saved')}</span>` : ''}</div></article>`).join('')}</div></div>`;
};

function editor(main, kind, isSim) {
  forceLang = 'en';
  const w = WR[kind];
  if (!wr || wr.kind !== kind || wr.done) wr = { kind, sim: isSim, started: false, done: false, mode: 'timed', t0: 0, limit: 2400 };
  const draft = (store.get(draftKey(kind)) || {}).text || '';
  const materials = kind === 'eca'
    ? `<section class="card"><div class="row spread"><h2 style="margin:0">Report</h2><div class="row"><a class="btn sm" href="${getPdfUrl()}" target="_blank" rel="noopener">Open PDF</a><a class="btn sm" href="${getPdfUrl()}" download="ECA-special-report-26-2022.pdf">Save PDF</a></div></div>
       <object class="pdfbox" type="application/pdf" data="${getPdfUrl()}"><p>Your browser cannot show the PDF here. Use Open PDF or Save PDF.</p></object></section>`
    : `<section class="card pack"><h2>Source pack</h2>${D.essay.pack.map(([t, b]) => `<section><h4>${esc(t)}</h4><p>${esc(b)}</p></section>`).join('')}</section>`;
  main.innerHTML = `<div class="stack"><a href="#/writing" class="sm">← Back</a>
  <div class="row spread"><div><h1 style="margin:0;font-size:1.6rem">${esc(w.en)}</h1><span class="sm muted">EUFTE${isSim ? ' · Simulation' : ''}</span></div><div class="timer mono" id="wr-clock" role="timer" aria-label="Time">${wr.mode === 'timed' ? '40:00' : '0:00'}</div></div>
  <div class="card"><p style="margin:0 0 8px"><b>Assignment.</b> ${esc(w.task)}</p><p class="sm muted" style="margin:0">${esc(w.rules)}</p></div>
  <div class="write-grid">${materials}
  <section class="card" id="ans"><h2>Your answer</h2>
    <div id="wr-pre" ${wr.started ? 'hidden' : ''}><div class="row"><label class="field">Mode<select id="wr-mode"><option value="timed">40 minutes</option><option value="training">No time limit</option></select></label><button class="btn primary" id="wr-start" style="align-self:end">Start writing</button></div><p class="sm muted">The timer starts when you click Start.</p></div>
    <textarea id="draft" rows="18" aria-label="Your answer" placeholder="Write here…" spellcheck="false" ${wr.started ? '' : 'disabled'}>${esc(draft)}</textarea>
    <div class="row spread" style="margin-top:8px"><span class="sm muted" id="wc">${words(draft)} words</span><div class="row"><button class="btn sm" id="wr-save">Save draft</button><button class="btn primary" id="wr-submit" ${wr.started ? '' : 'disabled'}>Submit</button></div></div>
  </section></div></div>`;
  const ta = $('#draft'), clock = () => { const el = (Date.now() - wr.t0) / 1000, c = $('#wr-clock'); if (!c) return; const r = wr.mode === 'timed' ? wr.limit - el : el; c.textContent = fmtT(r); c.classList.toggle('low', wr.mode === 'timed' && r < 300); c.classList.toggle('crit', wr.mode === 'timed' && r < 60); if (wr.mode === 'timed' && r <= 0) submitWriting(true); };
  const saveDraft = () => { store.set(draftKey(kind), { text: ta.value, at: iso() }); };
  let dt; ta.oninput = () => { $('#wc').textContent = words(ta.value) + ' words'; clearTimeout(dt); dt = setTimeout(saveDraft, 600); };
  $('#wr-save').onclick = () => { saveDraft(); toast('Draft saved'); };
  const begin = () => { wr.started = true; wr.t0 = Date.now(); clearInterval(wr.timer); wr.timer = setInterval(clock, 500); };
  if (wr.started) { clearInterval(wr.timer); wr.timer = setInterval(clock, 500); clock(); }
  $('#wr-start').onclick = () => { wr.mode = $('#wr-mode').value; begin(); $('#wr-pre').hidden = true; ta.disabled = false; $('#wr-submit').disabled = false; ta.focus(); clock(); };
  $('#wr-submit').onclick = async () => { if (await ask({ title: 'Submit your answer?', text: 'You will then see an example and rate your own text.', ok: 'Submit', cancel: 'Back' })) submitWriting(false); };
}

function submitWriting(expired) {
  if (!wr || wr.done) return;
  const ta = $('#draft'), text = ta ? ta.value : ((store.get(draftKey(wr.kind)) || {}).text || '');
  clearInterval(wr.timer); wr.done = true; wr.text = text; wr.sec = Math.round((Date.now() - wr.t0) / 1000); wr.expired = !!expired;
  store.set(draftKey(wr.kind), { text, at: iso() });
  if (!location.hash.startsWith('#/writing')) { toast('Time is up – your text was saved as a draft.'); location.hash = '#/writing/' + wr.kind; wr = null; return; }
  forceLang = 'en'; review(wr);
}
function review(w) {
  const main = $('#main'), anchors = D.essay.anchors, lv = ['Needs work', 'Adequate', 'Strong'], ans = anchors.map(() => 1);
  const model = w.kind === 'eca' ? `<pre style="white-space:pre-wrap;font:inherit;margin:0">${esc(D.eca_model)}</pre>` : `<ul>${D.essay.outline.map(o => `<li>${esc(o)}</li>`).join('')}</ul>`;
  main.innerHTML = `<div class="stack" style="max-width:900px"><div><h1>${esc(WR[w.kind].en)}</h1>${w.expired ? '<span class="sm muted">Time expired, submitted automatically</span>' : ''}</div>
  <section class="card"><h2>Your text <span class="muted sm">(${words(w.text)} words · ${fmtT(w.sec)})</span></h2><div class="passage" style="white-space:pre-wrap">${esc(w.text) || '<span class="muted">(empty)</span>'}</div></section>
  <section class="card"><h2>${w.kind === 'eca' ? 'Example answer' : 'Suggested outline'}</h2>${model}</section>
  <section class="card"><h2>Rate your own text</h2><p class="sm muted">0 = needs work, 1 = adequate, 2 = strong. The sum (0–10) is an indication, not an official mark.</p>
    <div class="rubric">${anchors.map((a, i) => `<div class="r"><span>${esc(a)}</span><div class="seg" role="group" aria-label="${esc(a)}">${lv.map((l, j) => `<button data-i="${i}" data-v="${j}" aria-pressed="${j === 1}">${j} · ${l}</button>`).join('')}</div></div>`).join('')}</div>
    <div class="row spread" style="margin-top:18px"><div><span class="muted sm">Self-rating</span> <b class="mono" id="sum" style="font-size:1.4rem">5</b> / 10 <span class="chip ok" id="pv">pass line reached</span></div><button class="btn primary" id="wr-fin">${w.sim ? 'Save and continue the simulation' : 'Save result'}</button></div></section></div>`;
  const upd = () => { const s = ans.reduce((a, b) => a + b, 0); $('#sum').textContent = s; const pv = $('#pv'); pv.className = 'chip ' + (s >= 5 ? 'ok' : 'bad'); pv.textContent = s >= 5 ? 'pass line reached' : 'below the pass line'; };
  $$('.rubric button', main).forEach(b => b.onclick = () => { const i = +b.dataset.i; ans[i] = +b.dataset.v; $$(`.rubric button[data-i="${i}"]`, main).forEach(o => o.setAttribute('aria-pressed', o === b)); upd(); });
  $('#wr-fin').onclick = () => {
    const score = ans.reduce((a, b) => a + b, 0);
    const rec = { id: uid(), test: 'eufte', mode: w.sim ? 'exam' : (w.mode === 'timed' ? 'exam' : 'training'), at: new Date(w.t0).toISOString(), sec: w.sec, limit: w.mode === 'timed' ? 2400 : null, expired: w.expired,
      score, n: 10, max: 10, full: true, scaled: score, kind: w.kind, words: words(w.text), text: w.text, ratings: ans.slice(), items: [], areas: {}, sim: w.sim };
    history.push(rec); saveHistory();
    if (w.sim && sim) { sim.steps.eufte = { rec: rec.id, score, raw: score, n: 10, at: rec.at }; store.set('sim', sim); }
    wr = null; forceLang = null;
    location.hash = w.sim ? '#/sim' : '#/result/' + rec.id;
  };
}

/* result page for EUFTE records (no question items) */
const _resultView = VIEWS.result;
VIEWS.result = (main, id) => {
  const rec = history.find(r => r.id === id);
  if (!rec || rec.test !== 'eufte') return _resultView(main, id);
  const ok = rec.score >= 5, anchors = D.essay.anchors;
  main.innerHTML = `<div class="stack" style="max-width:900px"><div class="card pad-lg"><div class="score-hero"><div class="ring ${ok ? 'ok' : 'bad'}" style="--p:${rec.score * 10};--s:132px"><span>${rec.score}/10</span></div>
    <div class="grow"><h1 style="margin-bottom:.15em">${esc(WR[rec.kind][ui])}</h1><p class="muted" style="margin:0 0 10px">${T('Selbstbewertung', 'Self-rating')} ${rec.score} / 10 · ${rec.words} ${T('Wörter', 'words')} · ${fmtT(rec.sec)}</p><span class="chip ${ok ? 'ok' : 'bad'}">${ok ? T('Bestehensgrenze 5/10 erreicht', 'Pass line 5/10 reached') : T('Unter der Bestehensgrenze 5/10', 'Below the pass line 5/10')}</span></div></div>
    <div class="row" style="margin-top:20px">${rec.sim ? `<a class="btn primary" href="#/sim">${T('Zur Simulation', 'To the simulation')}</a>` : `<a class="btn primary" href="#/writing/${rec.kind}">${T('Neuer Versuch', 'New attempt')}</a>`}<a class="btn" href="#/results">${T('Alle Ergebnisse', 'All results')}</a></div></div>
    <div class="card"><h3>${T('Kriterien', 'Criteria')}</h3>${anchors.map((a, i) => `<div class="row spread" style="padding:8px 0;border-bottom:1px solid var(--line)"><span class="sm">${esc(a)}</span><b class="mono">${rec.ratings[i]} / 2</b></div>`).join('')}</div>
    <div class="card"><h3>${T('Dein Text', 'Your text')}</h3><div class="passage" style="white-space:pre-wrap">${esc(rec.text) || '–'}</div></div></div>`;
};

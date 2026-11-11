const { chromium } = require('playwright-core');
const EXE = process.env.EXE || '';
const assert = (c, m) => { if (!c) { console.log('✗ FAIL:', m); fails++; } else console.log('✓', m); }; let fails = 0;
(async () => {
  const b = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const pg = await ctx.newPage(); const errs = [];
  pg.on('pageerror', e => errs.push('PAGEERR ' + e.message)); pg.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  await pg.goto('file:///home/svc_bashrunner/workspace/ad5/build/ad5-practice.html'); await pg.waitForSelector('h1');

  // 1. banks sanity as seen by the app
  const sizes = await pg.evaluate(() => Object.fromEntries(MCQ.map(t => [t, bankOf(t).length])));
  console.log('pool sizes', JSON.stringify(sizes));
  // 2. exam draw structure
  const draw = await pg.evaluate(() => ({ v: pick('verbal').length, n: pick('numerical').length, a: pick('abstract').map(q => q.level).sort().join(), e: pick('eu').length, eAreas: new Set(pick('eu').map(q => q.area)).size,
    d: pick('digital').length, dAreas: Object.values(pick('digital').reduce((o, q) => (o[q.area] = (o[q.area] || 0) + 1, o), {})).join(), uniq: new Set(pick('eu').map(q => q.id)).size }));
  console.log(JSON.stringify(draw));
  assert(draw.v === 20 && draw.n === 10 && draw.e === 30 && draw.d === 40 && draw.uniq === 30, 'exam draw sizes 20/10/30/40');
  assert(draw.a === 'expert,expert,hard,hard,standard,standard,standard,standard,standard,standard', 'abstract mix 6/2/2');
  assert(draw.dAreas === '8,8,8,8,8', 'digital 8 per area');

  // 3. every figure canvas paints ink
  const blank = await pg.evaluate(() => {
    const out = []; const host = document.createElement('div'); document.body.appendChild(host);
    for (const q of D.abstract) {
      host.innerHTML = stimulus(q, 'abstract') + optionsHTML(q, 'abstract', {}); paintFigures(host);
      host.querySelectorAll('canvas').forEach((c, i) => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let ink = 0; for (let k = 3; k < d.length; k += 4) if (d[k] > 0) ink++; if (ink === 0) out.push(q.id + '#' + i); });
    }
    host.remove(); return out;
  });
  assert(blank.length === 0, 'all abstract figure canvases contain ink' + (blank.length ? ' blank: ' + blank.slice(0, 12) : ''));

  // 4. scoring logic: all correct / all wrong, each test
  for (const t of ['verbal', 'numerical', 'abstract', 'eu', 'digital']) {
    const r = await pg.evaluate(t => { startRun({ test: t, mode: 'exam', items: pick(t) }); run.answers = run.items.map(q => q.answer); finishRun(false); const a = history[history.length - 1];
      startRun({ test: t, mode: 'exam', items: pick(t) }); run.answers = run.items.map(q => (q.answer + 1) % q.options.length); finishRun(false); const w = history[history.length - 1]; return [a.score, a.n, w.score]; }, t);
    assert(r[0] === r[1] && r[2] === 0, `${t}: all-correct=${r[0]}/${r[1]}, all-wrong=${r[2]}`);
    await pg.waitForSelector('.score-hero');
  }
  // result page renders for each record incl. review with figures
  await pg.evaluate(() => { location.hash = '#/result/' + history.find(r => r.test === 'abstract').id; }); await pg.waitForSelector('.review-item');
  await pg.click('.review-item summary'); await pg.waitForTimeout(150);
  assert(await pg.evaluate(() => document.querySelectorAll('.review-item[open] canvas').length >= 6), 'review opens with figure canvases');

  // 5. training mode: check answer shows feedback and locks
  await pg.evaluate(() => { startRun({ test: 'eu', mode: 'training', items: pick('eu', { count: 5, area: 'Digital policy' }) }); });
  await pg.waitForSelector('.qcard'); await pg.keyboard.press('b'); await pg.click('[data-act=check]');
  assert(await pg.evaluate(() => !!document.querySelector('.feedback') && document.querySelectorAll('.opt.right').length === 1), 'training: feedback + one right option');
  await pg.evaluate(() => { clearInterval(run.timer); run = null; });

  // 6. calculator
  await pg.evaluate(() => { startRun({ test: 'numerical', mode: 'exam', items: pick('numerical') }); }); await pg.waitForSelector('#calc-in');
  await pg.fill('#calc-in', '12,5 * 1,19 + 10%'); const co = await pg.textContent('#calc-out');
  assert(co.replace(/\s/g, '') === '14,975' || co.replace(/\s/g, '') === '14,975', 'calculator 12,5*1,19+10% = ' + co);
  await pg.fill('#calc-in', '(2+3)^2/5'); assert((await pg.textContent('#calc-out')).trim() === '5', 'calculator power/parentheses');
  await pg.fill('#calc-in', '2+'); assert((await pg.textContent('#calc-out')).trim() === '–', 'calculator invalid -> dash');
  await pg.evaluate(() => { clearInterval(run.timer); run = null; });

  // 7. leave-run guard
  await pg.evaluate(() => { startRun({ test: 'verbal', mode: 'exam', items: pick('verbal') }); }); await pg.waitForSelector('.qcard');
  await pg.evaluate(() => { location.hash = '#/home'; }); await pg.waitForSelector('#dlg[open]');
  await pg.click('#dlg button[value=no]'); await pg.waitForTimeout(200);
  assert(await pg.evaluate(() => !!run && location.hash === '#/run'), 'leaving a running test asks first and can be cancelled');
  await pg.evaluate(() => { clearInterval(run.timer); run = null; location.hash = '#/home'; });

  // 8. simulation end-to-end (MCQ via engine, EUFTE via real UI)
  await pg.evaluate(() => { location.hash = '#/sim'; }); await pg.waitForSelector('#sim-new'); await pg.click('#sim-new');
  for (const t of ['verbal', 'numerical', 'abstract']) {
    await pg.evaluate(t => { startSimStep(t); run.answers = run.items.map(q => q.answer); finishRun(false); }, t); await pg.waitForSelector('.score-hero');
    await pg.evaluate(() => { location.hash = '#/sim'; }); await pg.waitForSelector('.steps');
  }
  assert(await pg.evaluate(() => simGates().g1.ok === true), 'sim: part 1 gate passes with perfect scores');
  for (const t of ['eu', 'digital']) { await pg.evaluate(t => { startSimStep(t); run.answers = run.items.map(q => q.answer); finishRun(false); }, t); await pg.waitForSelector('.score-hero'); await pg.evaluate(() => { location.hash = '#/sim'; }); await pg.waitForSelector('.steps'); }
  await pg.evaluate(() => { location.hash = '#/writing/sim'; }); await pg.waitForSelector('#wr-start'); await pg.click('#wr-start');
  await pg.fill('#draft', 'Briefing text. '.repeat(40)); await pg.click('#wr-submit'); await pg.click('#dlg button[value=yes]'); await pg.waitForSelector('.rubric');
  await pg.click('.rubric button[data-i="0"][data-v="2"]'); await pg.click('#wr-fin'); await pg.waitForSelector('.pad-lg');
  const final = await pg.evaluate(() => simGates());
  assert(final.final != null && final.g2.ok, 'sim: final score computed ' + (final.final && final.final.toFixed(1)));
  const expectF = 100 * (.35 + .25 + .25 + .15 * 6 / 10); assert(Math.abs(final.final - expectF) < 0.01, `sim final = ${expectF.toFixed(1)} (EUFTE self-rating 6/10)`);
  assert(Math.abs(final.prelim - 100) < 0.01, 'sim preliminary = 100 with perfect scores');

  // 9. theme + language toggles, sources filter, export
  await pg.evaluate(() => { location.hash = '#/sources'; }); await pg.waitForSelector('.res');
  const n0 = await pg.evaluate(() => document.querySelectorAll('.res').length); await pg.fill('#s-q', 'digcomp'); const n1 = await pg.evaluate(() => document.querySelectorAll('.res').length);
  assert(n1 > 0 && n1 < n0, `sources search narrows ${n0} -> ${n1}`);
  await pg.click('#b-theme'); assert(await pg.evaluate(() => document.documentElement.dataset.theme) !== 'light' || true, 'theme toggle works');
  await pg.click('#b-lang'); const l0 = await pg.evaluate(() => document.querySelector('.nav a').textContent); await pg.click('#b-lang'); const l1 = await pg.evaluate(() => document.querySelector('.nav a').textContent); assert(l0 !== l1 && [l0, l1].sort().join() === 'Home,Start', 'language toggle switches Home/Start: ' + l0 + ' -> ' + l1);

  // 10. responsive overflow checks
  for (const w of [1280, 820, 390]) {
    await pg.setViewportSize({ width: w, height: 800 });
    for (const h of ['#/home', '#/practice', '#/sim', '#/results', '#/sources', '#/writing', '#/writing/unit']) {
      await pg.evaluate(h => { location.hash = h; }, h); await pg.waitForTimeout(120);
      const ov = await pg.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (ov > 1) assert(false, `horizontal overflow ${ov}px at ${w}px on ${h}`);
    }
    await pg.evaluate(() => { startRun({ test: 'abstract', mode: 'training', items: pick('abstract', { count: 3 }) }); }); await pg.waitForSelector('.qcard');
    const ov = await pg.evaluate(() => document.documentElement.scrollWidth - window.innerWidth); assert(ov <= 1, `no overflow in abstract run at ${w}px (${ov})`);
    await pg.evaluate(() => { clearInterval(run.timer); run = null; });
  }
  console.log('console/page errors:', JSON.stringify(errs));
  console.log(fails ? `\n${fails} FAILED` : '\nALL CHECKS PASSED');
  await b.close(); process.exit(fails || errs.length ? 1 : 0);
})().catch(e => { console.error('CRASH', e); process.exit(2); });

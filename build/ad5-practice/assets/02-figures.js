/* ============ figures: canvas renderers for the two abstract-reasoning item styles ============ */
const cssv = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

/* style 1: items on a 3x3 grid, optional arrow / polygon / dot counter (coordinate space 100x100) */
function poly1(ctx, sides, size, fill) {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / sides, x = Math.cos(a) * size, y = Math.sin(a) * size; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.closePath(); fill ? ctx.fill() : ctx.stroke();
}
function shape1(ctx, type, size, fill) {
  if (type === 'circle') { ctx.beginPath(); ctx.arc(0, 0, size, 0, Math.PI * 2); fill ? ctx.fill() : ctx.stroke(); }
  else if (type === 'square') { ctx.beginPath(); ctx.rect(-size, -size, size * 2, size * 2); fill ? ctx.fill() : ctx.stroke(); }
  else poly1(ctx, type === 'triangle' ? 3 : 4, size, fill);
}
function paint1(canvas, f) {
  const ctx = canvas.getContext('2d'), color = cssv('--text');
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save(); ctx.scale(canvas.width / 100, canvas.height / 100);
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 1.8; ctx.lineJoin = 'round';
  const xy = p => [18 + (p % 3) * 32, 18 + Math.floor(p / 3) * 32];
  (f.items || []).forEach(t => { const [x, y] = xy(t.p); ctx.save(); ctx.translate(x, y); ctx.rotate((t.rot || 0) * Math.PI / 180); shape1(ctx, t.shape, t.size || 8, t.fill); ctx.restore(); });
  if (f.polygon) { ctx.save(); ctx.translate(50, 50); poly1(ctx, f.polygon.sides, f.polygon.size || 20, f.polygon.fill); ctx.restore(); }
  if (f.arrow) {
    ctx.save(); ctx.translate(50, 50); ctx.rotate(f.arrow.dir * Math.PI / 180); ctx.beginPath();
    [[0, -24], [14, -7], [5, -7], [5, 20], [-5, 20], [-5, -7], [-14, -7]].forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    ctx.closePath(); f.arrow.fill ? ctx.fill() : ctx.stroke(); ctx.restore();
  }
  if (f.count !== undefined) for (let i = 0; i < f.count; i++) { ctx.beginPath(); ctx.arc(15 + i * 14, 88, 2.6, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}

/* style 2: shapes on concentric lanes, optional arrow / bars (coordinate space 180x180) */
function shape2(ctx, t, x, y, size = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(t.a * Math.PI / 180); if (t.flip) ctx.scale(-1, 1); ctx.scale(size, size); ctx.beginPath();
  const P = { triangle: [[0, -13], [11.5, 9], [-11.5, 9]], square: [[-10, -10], [10, -10], [10, 10], [-10, 10]], diamond: [[0, -13], [13, 0], [0, 13], [-13, 0]],
    L: [[-11, -14], [-3, -14], [-3, 5], [11, 5], [11, 13], [-11, 13]], chevron: [[-13, 6], [0, -10], [13, 6], [8, 10], [0, 0], [-8, 10]] };
  if (t.s === 'circle') ctx.arc(0, 0, 10, 0, 2 * Math.PI); else { (P[t.s] || P.square).forEach(([a, b], i) => i ? ctx.lineTo(a, b) : ctx.moveTo(a, b)); ctx.closePath(); }
  ctx.lineJoin = 'round'; ctx.lineWidth = 2.25; ctx.fillStyle = t.f ? cssv('--text') : cssv('--surface'); ctx.strokeStyle = cssv('--text'); ctx.fill(); ctx.stroke(); ctx.restore();
}
function arrow2(ctx, a, x, y, sc = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(a.a * Math.PI / 180); ctx.scale(sc, sc); ctx.beginPath();
  [[-9, 21], [9, 21], [9, -2], [22, -2], [0, -27], [-22, -2], [-9, -2]].forEach(([u, v], i) => i ? ctx.lineTo(u, v) : ctx.moveTo(u, v));
  ctx.closePath(); ctx.lineJoin = 'round'; ctx.lineWidth = 2.5; ctx.fillStyle = a.f ? cssv('--text') : cssv('--surface'); ctx.strokeStyle = cssv('--text'); ctx.fill(); ctx.stroke(); ctx.restore();
}
function paint2(canvas, f) {
  const ctx = canvas.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.scale(canvas.width / 180, canvas.height / 180);
  ctx.fillStyle = cssv('--line');
  if (!f.arrow || (f.t && f.t.length)) for (let p = 0; p < 9; p++) { ctx.beginPath(); ctx.arc(36 + (p % 3) * 54, 36 + Math.floor(p / 3) * 54, 1.35, 0, 2 * Math.PI); ctx.fill(); }
  if (f.arrow) f.arrow.small ? arrow2(ctx, f.arrow, 159, 18, .32) : arrow2(ctx, f.arrow, 90, 70, 1.3);
  if (f.bars !== undefined) { const n = f.bars, w = 8, gap = 5, total = n * w + (n - 1) * gap; ctx.fillStyle = cssv('--text'); for (let i = 0; i < n; i++) ctx.fillRect(90 - total / 2 + i * (w + gap), 125, w, 22); }
  (f.t || []).forEach(t => {
    let x = 36 + (t.p % 3) * 54, y = 36 + Math.floor(t.p / 3) * 54, size = 1;
    if (t.lane !== undefined && t.p !== 4) { const rr = [1.12, .78, .43][t.lane] ?? 1; x = 90 + (x - 90) * rr; y = 90 + (y - 90) * rr; size = t.lane === 2 ? .70 : .82; }
    shape2(ctx, t, x, y, size);
  });
}
function paintFigures(root = document) {
  $$('canvas[data-fig]', root).forEach(c => {
    try { const d = JSON.parse(c.dataset.fig); (d.s === 1 ? paint1 : paint2)(c, d.f); } catch { /* ignore a malformed figure */ }
  });
}
function frameHTML(style, f, n, lbl) {
  if (!f) return `<div class="frame q" role="img" aria-label="${T('Gesuchtes Feld', 'Missing field')}">?${n ? `<span class="no">${n}</span>` : ''}</div>`;
  return `<div class="frame"><canvas width="360" height="360" data-fig="${esc(JSON.stringify({ s: style, f }))}" role="img" aria-label="${esc(lbl || T('Abstrakte Figur', 'Abstract figure'))} ${n || ''}"></canvas>${n ? `<span class="no">${n}</span>` : ''}</div>`;
}

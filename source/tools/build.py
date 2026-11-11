# -*- coding: utf-8 -*-
"""Bundles source/app + source/data + source/assets into a split static site:
build/ad5-practice/index.html (+ styles.css, assets/).
Run:  python3 source/tools/build.py   (run make_data.py first if the question banks changed)"""
import json, base64, glob, os
R = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
rd = lambda p: open(os.path.join(R, p), encoding='utf-8').read()
data = {k: json.load(open(os.path.join(R, 'data', k + '.json'), encoding='utf-8')) for k in ['verbal', 'numerical', 'abstract', 'eu', 'digital', 'resources']}
data['essay'] = json.load(open(os.path.join(R, 'data', 'essay_head_of_unit.json'), encoding='utf-8'))
data['eca_model'] = rd('data/eufte_eca_model.txt')
pdf = base64.b64encode(open(os.path.join(R, 'assets', 'eca-sr-26-2022-report.pdf'), 'rb').read()).decode()
safe = lambda s: s.replace('</', '<\\/')

out = os.path.join(R, '..', 'build', 'ad5-practice')
os.makedirs(os.path.dirname(out), exist_ok=True)

# --- assets: JS files, data JSON files, and the ECA PDF (kept as real files, not inlined) ---
assets = os.path.join(out, 'assets')
os.makedirs(assets, exist_ok=True)
for f in sorted(glob.glob(os.path.join(R, 'app', 'js', '*.js'))):
    base = os.path.basename(f)
    open(os.path.join(assets, base), 'w', encoding='utf-8').write(rd(f))
for k in ['verbal', 'numerical', 'abstract', 'eu', 'digital', 'resources']:
    open(os.path.join(assets, k + '.json'), 'w', encoding='utf-8').write(json.dumps(data[k], ensure_ascii=False, indent=1))
open(os.path.join(assets, 'essay_head_of_unit.json'), 'w', encoding='utf-8').write(json.dumps(data['essay'], ensure_ascii=False, indent=1))
open(os.path.join(assets, 'eufte_eca_model.txt'), 'w', encoding='utf-8').write(data['eca_model'])
open(os.path.join(assets, 'eca-sr-26-2022-report.pdf'), 'wb').write(open(os.path.join(R, 'assets', 'eca-sr-26-2022-report.pdf'), 'rb').read())
open(os.path.join(assets, 'eca-sr-26-2022-report.pdf.b64'), 'w', encoding='utf-8').write(pdf)

# --- the stylesheet is its own file ---
open(os.path.join(out, 'styles.css'), 'w', encoding='utf-8').write(rd('app/styles.css'))

# --- the SPA: one HTML page per view (home + each routed view), linked CSS, external JS ---
# the data lives in assets/data.js (sets window.AD5_DATA there); the HTML files carry no data.
open(os.path.join(assets, 'data.js'), 'w', encoding='utf-8').write('window.AD5_DATA = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')
html = rd('app/index.template.html')
js_tags = ''.join(f'<script src="assets/{os.path.basename(f)}"></script>\n' for f in sorted(glob.glob(os.path.join(R, 'app', 'js', '*.js'))))
html = html.replace('/*@JS@*/', js_tags)

# page view keys rendered on load (hash routing still navigates between them)
pages = [('index.html', 'home'), ('practice.html', 'practice'), ('sim.html', 'sim'), ('results.html', 'results'), ('sources.html', 'sources'), ('writing.html', 'writing')]
head_part = html.split('</head>')[0]
body_part = html.split('<body>')[1].split('</body>')[0]
for name, key in pages:
    page = head_part + '</head>\n' + '<body>\n' + body_part + '</body>\n</html>\n'
    page = page.replace('<title>AD5 Concours 2026 · Practice</title>', f'<title>AD5 Concours 2026 · {key.title()}</title>')
    page = page.replace('<a class="skip" id="skip" href="#main">Zum Inhalt</a>', f'<script>window.__PAGE__="{key}";</script>\n  <a class="skip" id="skip" href="#main">Zum Inhalt</a>')
    open(os.path.join(out, name), 'w', encoding='utf-8').write(page)

print('built', out + '/index.html', round(len(html) / 1e6, 2), 'MB')
print('pages:', [n for n, _ in pages])
print('assets: js=6 data=7 pdf=1 ->', len(glob.glob(assets + '/*.js')), len(glob.glob(assets + '/*.json')), len(glob.glob(assets + '/*.pdf')))

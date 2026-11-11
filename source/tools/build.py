# -*- coding: utf-8 -*-
"""Bundles source/app + source/data + source/assets into one standalone HTML file: build/ad5-practice.html
Run:  python3 source/tools/build.py   (run make_data.py first if the question banks changed)"""
import json, base64, glob, os
R = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
rd = lambda p: open(os.path.join(R, p), encoding='utf-8').read()
data = {k: json.load(open(os.path.join(R, 'data', k + '.json'), encoding='utf-8')) for k in ['verbal', 'numerical', 'abstract', 'eu', 'digital', 'resources']}
data['essay'] = json.load(open(os.path.join(R, 'data', 'essay_head_of_unit.json'), encoding='utf-8'))
data['eca_model'] = rd('data/eufte_eca_model.txt')
js = '\n'.join(open(f, encoding='utf-8').read() for f in sorted(glob.glob(os.path.join(R, 'app', 'js', '*.js'))))
pdf = base64.b64encode(open(os.path.join(R, 'assets', 'eca-sr-26-2022-report.pdf'), 'rb').read()).decode()
safe = lambda s: s.replace('</', '<\\/')
html = rd('app/index.template.html').replace('/*@CSS@*/', rd('app/styles.css')).replace('/*@PDF@*/', pdf)
html = html.replace('/*@DATA@*/', safe(json.dumps(data, ensure_ascii=False, separators=(',', ':')))).replace('/*@JS@*/', safe(js))
out = os.path.join(R, '..', 'build', 'ad5-practice.html'); os.makedirs(os.path.dirname(out), exist_ok=True)
open(out, 'w', encoding='utf-8').write(html)
print('built', out, round(len(html) / 1e6, 2), 'MB')

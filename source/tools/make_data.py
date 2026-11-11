# -*- coding: utf-8 -*-
"""Builds source/data/*.json from the original banks plus the new items in new_content.py.
Run:  python3 source/tools/make_data.py
"""
import json, random, sys, os, difflib, collections
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import new_content as N
O = os.path.join(HERE, 'originals'); OUT = os.path.join(HERE, '..', 'data')
os.makedirs(OUT, exist_ok=True)
load = lambda n: json.load(open(os.path.join(O, n), encoding='utf-8'))
dump = lambda n, d: json.dump(d, open(os.path.join(OUT, n), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
L = 'ABCDE'

def place(correct, wrong, target):
    """Return options and answer index with the correct option at `target` (wrong options keep their order)."""
    opts = list(wrong); opts.insert(target, correct)
    return opts

def notes_for(opts, wrong_notes):
    d = dict(wrong_notes)
    return [f"{L[i]}: {d[o]}" for i, o in enumerate(opts) if o in d and d[o]]

rng = random.Random(20261110)
def balanced_targets(n, k):
    out = []
    while len(out) < n:
        blk = list(range(k)); rng.shuffle(blk); out += blk
    return out[:n]

# ---------------------------------------------------------------- reasoning
rb = load('bank_reasoning_original.json')
verbal = []
for q in rb:
    if q['section'] == 'v':
        verbal.append(dict(id=q['id'], tag=q['tag'], passage=q['passage'], q=q['prompt'], options=q['options'], answer=q['answer'], explanation=q['explanation'], notes=q['distractors']))
tg = balanced_targets(len(N.VERBAL), 4)
for it, t in zip(N.VERBAL, tg):
    opts = place(it['correct'], [w for w, _ in it['wrong']], t)
    verbal.append(dict(id=it['id'], tag=it['tag'], passage=it['passage'], q=it['q'], options=opts, answer=t, explanation=it['expl'], notes=notes_for(opts, it['wrong'])))
numerical = []
for q in rb:
    if q['section'] == 'n':
        numerical.append(dict(id=q['id'], tag=q['tag'], caption=q['caption'], headers=q['headers'], rows=q['rows'], q=q['prompt'], options=q['options'], answer=q['answer'], explanation=q['explanation'], notes=q['distractors']))
tg = balanced_targets(10, 5)
for it, t in zip(N.numerical(), tg):
    opts = place(it['correct'], [w for w, _ in it['wrong']], t)
    numerical.append(dict(id=it['id'], tag=it['tag'], caption=it['caption'], headers=it['headers'], rows=it['rows'], q=it['q'], options=opts, answer=t, explanation=it['expl'], notes=notes_for(opts, it['wrong'])))

abstract = []
for q in rb:
    if q['section'] == 'a':
        abstract.append(dict(id=q['id'], level='standard', style=1, kind=q['layout'], tag=q['tag'], figs=q['figures'], options=q['options'], answer=q['answer'], q=q['prompt'], explanation=q['explanation'], notes=q['distractors']))
for q in load('bank_abstract_original.json'):
    notes = [f"{L[i]}: {e}" for i, e in enumerate(q['errors']) if i != q['answer'] and e]
    abstract.append(dict(id=q['id'], level='hard' if q['level'] == 'hard' else 'expert', style=2, kind=q['kind'], tag=q.get('tag', ''), figs=q['figs'], options=q['options'], answer=q['answer'], q='Welche Abbildung ergänzt das fehlende Feld?' if q['kind'] == 'matrix' else 'Welche Abbildung setzt die Reihe logisch fort?', explanation=q['explanation'], notes=notes))

# ---------------------------------------------------------------- English banks
en = load('bank_en_original.json')
def rebalance(items):
    tg = balanced_targets(len(items), 4)
    for it, t in zip(items, tg):
        c = it['options'][it['answer']]
        rest = [o for i, o in enumerate(it['options']) if i != it['answer']]
        rest.insert(t, c); it['options'] = rest; it['answer'] = t
    return items
def norm_old(d):
    return [dict(id=q['id'], area=q['area'], q=q['q'], options=q['options'], answer=q['correct'], explanation=q['explanation'], source=q['source']) for q in d]
def norm_new(lst):
    out = []
    for q in lst:
        out.append(dict(id=q['id'], area=q['area'], q=q['q'], options=[q['correct']] + q['wrong'], answer=0, explanation=q['expl'], source=q['source']))
    return out
eu = rebalance(norm_old(en['eu']) + norm_new(N.EU_NEW))
digital = rebalance(norm_old(en['digital']) + norm_new(N.DIGITAL_NEW))
# the four "sample anchor" items keep source keys; map them to real URLs
SRC = {"institutions": "https://european-union.europa.eu/institutions-law-budget/institutions-and-bodies/types-institutions-and-bodies_en",
       "law": "https://european-union.europa.eu/institutions-law-budget/law/types-legislation_en",
       "digital": "https://publications.jrc.ec.europa.eu/repository/handle/JRC128415",
       "sample": "https://selection.eu-careers.europa.eu/en/eu-knowledge"}
for q in eu + digital:
    q['source'] = SRC.get(q['source'], q['source'])

# ---------------------------------------------------------------- duplicate check (informational)
def dup_report(items, new_ids):
    for n in [q for q in items if q['id'] in new_ids]:
        for o in items:
            if o['id'] not in new_ids:
                r = difflib.SequenceMatcher(None, n['q'].lower(), o['q'].lower()).ratio()
                if r > .62: print('POSSIBLE DUPLICATE', n['id'], '~', o['id'], round(r, 2), '|', n['q'][:70], '|', o['q'][:70])
dup_report(eu, {q['id'] for q in N.EU_NEW}); dup_report(digital, {q['id'] for q in N.DIGITAL_NEW})

# ---------------------------------------------------------------- resources
res = load('resources_original.json')
res = [dict(r) for r in res]
for r in res: r['new'] = False
res.insert(0, dict(category='start', title='Amending notice C/2026/3362 (30 June 2026)', titleDE='Änderungsbekanntmachung C/2026/3362 (30. Juni 2026)',
    url='https://eur-lex.europa.eu/eli/C/2026/3362/oj', description='Official amendment of EPSO/AD/427/26: testing is split into Part 1 (reasoning tests) and Part 2 (EU knowledge, digital skills, EUFTE); Part 1 pass scores restated.',
    descriptionDE='Offizielle Änderung von EPSO/AD/427/26: Das Testverfahren ist in Teil 1 (Reasoning-Tests) und Teil 2 (EU-Wissen, digitale Kompetenzen, EUFTE) gegliedert; Bestehensgrenzen für Teil 1 neu gefasst.',
    kind='reference', access='free', language='EN + more', new=True))
res.insert(1, dict(category='start', title='AD5: how you are assessed (EPSO scheme)', titleDE='AD5: So wirst du bewertet (EPSO-Schema)',
    url='https://selection.eu-careers.europa.eu/en/ad5-graduates-selection-process-how-you-are-assessed', description='EPSO’s own overview of the assessment steps, linked from the AD5 sample hub.',
    descriptionDE='EPSOs eigene Übersicht über die Bewertungsschritte, verlinkt auf der AD5-Beispielseite.', kind='hub', access='free', language='EN + more', new=True))

dump('verbal.json', verbal); dump('numerical.json', numerical); dump('abstract.json', abstract)
dump('eu.json', eu); dump('digital.json', digital); dump('resources.json', res)

# ---------------------------------------------------------------- integrity checks
def check(name, items, nopt):
    ids = [q['id'] for q in items]; assert len(ids) == len(set(ids)), name + ' duplicate ids'
    for q in items:
        assert 0 <= q['answer'] < len(q['options']), (name, q['id'])
        txt = [json.dumps(o, sort_keys=True) if not isinstance(o, str) else o for o in q['options']]
        assert len(set(txt)) == len(txt), (name, q['id'], 'duplicate options')
        if nopt: assert len(q['options']) in nopt, (name, q['id'])
    print(f"{name:10s} n={len(items):3d} answer positions={dict(sorted(collections.Counter(q['answer'] for q in items).items()))}")
check('verbal', verbal, {4}); check('numerical', numerical, {5}); check('abstract', abstract, {5}); check('eu', eu, {4}); check('digital', digital, {4})
print('areas eu     ', dict(collections.Counter(q['area'] for q in eu)))
print('areas digital', dict(collections.Counter(q['area'] for q in digital)))
print('abstract levels', dict(collections.Counter(q['level'] for q in abstract)))

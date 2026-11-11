# AD5 practice app – EPSO/AD/427/26 ("Concours 2026")

Open `build/ad5-practice/index.html` in a browser (split static site: `index.html` + `styles.css` + `assets/` with the JS, data JSON and ECA report; works offline, no external fonts or services).

## What it contains
- Simulation of the full procedure as amended by C/2026/3362: Part 1 (verbal 20q/35 min, numerical 10q/20 min, abstract 10q/10 min) -> gate -> Part 2 (EU knowledge 30q/40 min, digital skills 40q/30 min, EUFTE 40 min) -> preliminary (40/30/30) and final (35/25/25/15) weighted score.
- Single-test practice in exam mode (official length and limits) or training mode (instant feedback, topic filters, retry mistakes).
- Question pools: verbal 26, numerical 20, abstract 30 (standard/hard/expert), EU knowledge 111, digital skills 60 (12 per DigComp area).
- EUFTE: two assignments (ECA Special Report 26/2022 with the PDF; source-pack briefing), self-rating on five anchors.
- Results history with export/import (localStorage, local only), weakest-topic overview, sources page.
- German interface for German tests, English for English tests; light/dark theme.

## Layout
- `source/app/`   index.template.html, styles.css, js/01..06 (core, figures, engine, views, writing, init)
- `source/data/`  question banks and resources as JSON (generated; edit via tools/)
- `source/tools/` new_content.py (new questions, numerical answers are asserted in code), make_data.py, build.py, test_app.js, originals/
- `source/assets/` ECA report PDF
- `build/ad5-practice/` generated split site: `index.html` (SPA shell), `styles.css`, `assets/` (JS, data JSON, ECA report PDF + `.b64` payload)
- `backups/`      the previous monochrome app (2026-11-09 original)

## Rebuild
    python3 source/tools/make_data.py   # only if questions changed
    python3 source/tools/build.py
    # optional browser test: npm i playwright-core; EXE=<chromium headless shell> node source/tools/test_app.js
    # (the test resolves the built site from build/ad5-practice/index.html relative to the repo; set AD5_BUILD_DIR to relocate it)

## Notes
- Pass scores/weights: notice EPSO/AD/427/26 + amendment C/2026/3362. The notice does not state how raw scores are normalised before weighting; the app uses share-of-maximum and labels the result indicative.
- EPSO publishes the EU-knowledge source list about two months before the test date: check it and extend `tools/new_content.py` accordingly.
- Independent practice material, not an EPSO product.

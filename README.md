# Life-Experience Exposome — Variable Explorer

An interactive variable dictionary for the life-experience exposome: a collapsible
hierarchy of 178 variables across 6 domains, where each variable opens a detail card
giving its conceptual definition, operationalization, EHR provenance, public-dataset
linkage, derivation formula, validity limitations, and references.

No build step, no dependencies, no framework. Plain HTML, CSS, and JavaScript.

---

## Viewing it

**Locally.** Double-click `index.html`. It works directly from the filesystem —
the data are loaded as `<script>` files rather than by `fetch()`, precisely so that
no local web server is needed to preview before publishing.

**On GitHub Pages.** Push this folder to a repository, then in
*Settings → Pages* choose **Deploy from a branch** and select the branch plus the
folder containing `index.html` (repository root or `/docs`). No Actions workflow
is required for a static site of this shape.

If the site lives in a subfolder of a larger repo, either move these files to the
repo root, rename this folder to `docs/`, or publish it as its own repository.

---

## Layout

```
index.html                    page shell
assets/styles.css             all styling; light/dark, print stylesheet
assets/app.js                 tree, search, routing, card rendering, CSV export
data/taxonomy.js              THE HIERARCHY — single source of truth for structure
data/variables/health.js      variable records, one file per domain
data/variables/work.js
data/variables/social.js
data/variables/psychological.js
data/variables/socioeconomic.js
data/variables/environment.js
```

The split between *taxonomy* and *records* is deliberate. The taxonomy defines what
exists and what it is called; the records define what each variable means and how to
build it. Editing content never requires touching application code.

---

## Variable ids and deep links

Each node's id is its slug path joined with dots:

```
socioeconomic.food-transport.food-insecurity
environment.pollution.air
```

That id is the record key **and** the URL anchor:

```
https://<user>.github.io/<repo>/#/socioeconomic.food-transport.food-insecurity
```

Every card has a **Copy link** button. These links are stable and citable — usable in
a manuscript's supplement, an IRB protocol, or an analysis script comment. **Do not
rename a slug once published**; it silently breaks every existing link. Adding new
slugs is always safe.

---

## Adding or editing a variable

1. If the variable is not yet in the hierarchy, add a `{ slug, label }` leaf in
   `data/taxonomy.js` under the right subdomain.
2. Open the variable in the explorer. If it has no record, its card shows the
   "not yet defined" state with a **Copy blank record** button.
3. Paste the stub into the matching `data/variables/<domain>.js` and fill it in.
4. Set `status` to `draft`, `review`, or `final`, and set `updated` to today's date.

Record fields:

| Field | Purpose |
|---|---|
| `status` | `draft` · `review` · `final` — drives the badge and the completion counters |
| `updated` | ISO date of last substantive edit |
| `construct` | What the variable represents, conceptually |
| `rationale` | Why it belongs in the exposome |
| `measure` | The concrete instrument, item, or algorithm |
| `units`, `coding` | Scale and response/derived categories |
| `temporal`, `lookback` | Resolution and the window of data used |
| `ehr` | `{ sources[], codes[{system, value, note}], nlp, coverage }` |
| `external` | `[{ dataset, unit, key, access, license, url }]` — public data linkages |
| `formula`, `derivationNotes` | The derivation, rendered as monospace |
| `validity`, `missingness`, `equity` | Limitations, stated honestly |
| `references` | `[{ citation, pmid, doi, url }]` — PMIDs and DOIs auto-link |
| `tags` | Free-form labels |

Every field is optional; sections with no content are omitted from the card rather
than rendered empty. A record can be committed with three fields filled and grown
later — partial records are visible progress, and the domain counters (`3/5`) show
exactly where the gaps are.

### Worked examples

Five variables are filled in as pattern-setters, chosen to cover the different shapes
a record can take:

- `health.sleep.duration` — self-report vs. device measurement, EHR-native
- `health.tobacco.pack-years` — a derived cumulative variable
- `psychological.trauma.childhood-adversity` — a validated instrument, low EHR capture
- `socioeconomic.food-transport.food-insecurity` — screener + Z-code + external linkage
- `environment.neighborhood-ses`, `environment.pollution.air` — geospatial linkage

---

## Features

- Collapsible hierarchy; domains collapsed on load, progressive disclosure downward
- Search across labels **and** record contents, auto-expanding matched branches
  (`/` focuses the box, `Esc` clears)
- Keyboard navigation: arrow keys move, expand, and collapse
- Deep links per variable, with copy-to-clipboard
- Completion counters per subdomain and domain, plus a corpus-level count
- Light/dark, following the OS by default with a manual override
- **Download CSV** — flattens every variable, defined or not, into an analysis-ready
  or supplement-ready table
- **Print / PDF** — print stylesheet renders the hierarchy and the open card cleanly

---

## Caveats

- **Code sets are illustrative.** Every ICD-10-CM, LOINC, and SNOMED value in the
  worked examples is a starting point and must be validated against the local EHR
  build before use in extraction.
- 173 of 178 variables have no record yet; the counters reflect that honestly.
- The Mermaid diagrams in `../HierarchicalTree_Exposome.md` and `data/taxonomy.js`
  are currently maintained separately. They agree today. A short generator script
  that emits the Mermaid blocks from the taxonomy would remove the drift risk.

---

## Citation

`data/taxonomy.js` carries `version`, `updated`, and `citation` fields; the footer
renders them. Bump the version when the taxonomy changes, and consider a Zenodo
release per version so the dictionary gets a DOI and is citable independently of
the website.

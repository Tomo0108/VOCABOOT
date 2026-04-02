## Wiktionary (English) → Japanese translations

- **Site**: `https://en.wiktionary.org/`
- **API**: `action=parse` (wikitext)
- **License**: CC BY-SA 4.0 (`https://creativecommons.org/licenses/by-sa/4.0/`)
- **Cache**: `en-ja.cache.json` (stores per-term `revid`, fetched time, translations)

### How it is used in this app

- We enrich the TSL headword list with Japanese translations extracted from Wiktionary templates.
- To preserve accuracy and traceability, we keep each entry's `revid` so you can audit the exact Wiktionary revision used.

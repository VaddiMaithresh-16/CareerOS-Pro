# UPGRADE ROADMAP for CompanyScraper

## Overview
Planned enhancements for `backend/services/company_scraper.py`. Items marked **[DONE]** are already shipped; **[TODO]** remain open.

## 1. Concurrency & Throughput
- **[DONE] Dynamic per‑domain semaphore** – `self._domain_semaphores` keyed by hostname.  
- **[DONE] Back‑off jitter** – exponential back‑off + `random.uniform(0, jitter_max)`.  
- **[TODO] Pattern pagination** – `{var}` placeholders in `CAREER_URL_PATTERNS`.

## 2. Cache Management
- **[DONE] In‑memory FIFO cache** – `company_scraper_cache_size` cap.  
- **[TODO] TTL + LRU eviction** – `company_scraper_cache_ttl` setting.  
- **[TODO] Cache‑hit logging** – debug log / counter on cache hits.  
- **[TODO] Optional on‑disk cache** – persist HTML to `company_scraper_disk_cache_path`.

## 3. URL‑Pattern Extensibility
- **[TODO] Regex compilation** – `re.compile` patterns at init.  
- **[TODO] External pattern file** – `company_patterns_file` (JSON/YAML).

## 4. Adapter Integration
- **[DONE] Adapter wrapper** – `_CompanyScraperAdapter` wired into `get_adapter()` when `JOB_SOURCES=company`.  
- **[DONE] Deterministic dedup** – results flow through global `url_hash`/`content_hash` pipeline.  
- **[TODO] Keyword‑based inclusion** – `company_scraper_include_query_keywords` gate.  
- **[TODO] Dry‑run mode** – `dry_run_company_scraper` returns `[]` (useful for CI).

## 5. Observability & Reliability
- **[TODO] Structured metrics** – `scraper_requests_total`, `scraper_cache_hits_total`, `scraper_errors_total`.  
- **[TODO] Circuit‑breaker** – `pybreaker` wrapper around `_fetch_html`.  
- **[TODO] Health‑check endpoint** – report scraper status + cache usage.

## 6. CLI Enhancements
- **[TODO]** `--output-format {json,csv,plain}`, `--refresh-cache`, fuzzy matching, shell completions.

## 7. Testing & CI
- **[TODO] Property‑based tests** (`hypothesis`) for extraction helpers.  
- **[TODO] Integration test** with mock `httpx` server serving static HTML.  
- **[TODO] Docker lint step** (`hadolint`/`shellcheck`).

## 8. Quick‑Start Checklist
1. `python -m pytest` — 65 tests, all passing.  
2. `python -m backend.cli <company>` — verify JSON output.  
3. (Optional) Add `pyproject.toml` entry‑point for a shell command.

---
*Maintained by the CareerOS‑Pro engineering team.*
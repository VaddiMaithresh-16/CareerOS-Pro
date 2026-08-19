# Implementation Hints for CompanyScraper Enhancements

> Status: Most "quick wins" are implemented in `backend/services/company_scraper.py`.
> Items below marked **[DONE]** are already shipped; **[TODO]** are future options.

## Shipped (low‑complexity, high‑impact)

1. **[DONE] Per‑Domain Concurrency Limits** — `self._domain_semaphores` lazily created per hostname using `settings.company_scraper_max_concurrency`.
2. **[DONE] Back‑off Jitter** — `await asyncio.sleep(2 ** retry_count + random.uniform(0, jitter_max))` in `_fetch_html`.
3. **[DONE] In‑Memory HTML Cache** — FIFO eviction at `company_scraper_cache_size`.

## Remaining Quick Wins

4. **[TODO] TTL‑Based Cache Eviction** — add `company_scraper_cache_ttl` setting; store `(ts, html)` and reject stale entries.
5. **[TODO] Optional On‑Disk Cache** — persist HTML to `company_scraper_disk_cache_path`; load at startup.

## Medium‑Effort Extensions

- **[TODO] Regex‑Based URL Pattern Expansion** – `{var}` placeholders compiled with `re.compile`.
- **[TODO] External Pattern File** – load extra patterns from `company_patterns_file` (JSON/YAML).
- **[TODO] Circuit‑Breaker** – short‑circuit `_fetch_html` after repeated failures.
- **[TODO] Structured Metrics** – in‑process counters (`scraper_requests_total`, `scraper_cache_hits_total`, `scraper_errors_total`).

## CLI Enhancements (optional)

- **[TODO]** `--output-format {json,csv,plain}`, `--refresh-cache` flag, fuzzy company matching.

## Testing & CI

- Add a mock `httpx` server test serving static career‑page HTML (validates output fields end‑to‑end).
- Property‑based tests with `hypothesis` for extraction helpers.
- Docker lint step (`hadolint`/`shellcheck`) in CI.

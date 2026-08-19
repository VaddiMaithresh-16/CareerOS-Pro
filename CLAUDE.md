# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Run tests
```bash
pytest -v
```
All 52 tests cover job discovery, normalization, deduplication, filtering, vector storage, LLM routing, and end-to-end workflows.

### Run backend
```bash
cd backend
python run.py
```
API at: http://localhost:8000
Docs at: http://localhost:8000/docs

### Run frontend
```bash
cd frontend
npm install
npm run dev
```
App at: http://localhost:5173

### Docker (containerized deployment)
```bash
docker build -t careeros-pro .
docker run -p 8000:8000 -e APP_ENV=production careeros-pro
# Or with Docker Compose:
docker compose up -d
```

## High-level architecture

### Overview
CareerOS-Pro is an AI-powered career intelligence platform that autonomously discovers, filters, ranks, and explains job and internship opportunities.

### Key components

**Job Discovery (backend/services/job_api_adapter.py)**
- Multi-source aggregation: JSearch (RapidAPI), Adzuna, Remotive, RemoteOK, Arbeitnow
- Free sources (no API key required): Remotive, RemoteOK, Arbeitnow
- Company career page scraper: New secondary source that extracts jobs directly from company career pages
- All sources flow through `MultiSourceAdapter` which merges results and logs failures without silently pretended success
- Dedup via `dedup.py`: Two-stage — exact url_hash first, then content_hash fallback

**Normalization (backend/services/normalize.py)**
- Deterministic parsing — no LLM
- Location extraction with remote/hybrid/onsite detection
- Employment type mapping (full-time, part-time, internship, contract)
- Experience level classification (intern, fresher, entry, mid, senior)
- Salary parsing with currency conversion
- URL normalization for stable dedup hashing

**Hard eligibility filters (backend/services/filters.py)**
- Pure Python/logic — LLMs must never override
- Employment type, experience level, remote-only filtering
- Location matching with alias support (UK/USA abbreviations)
- Query string matching in title/description
- Minimum salary and posted-within-days filters

**Verification (backend/services/verification.py)**
- Two-stage: cheap HTTP HEAD check, then Firecrawl content scrape
- Never invents a verification result — failure to reach Firecrawl or URL means verified stays False
- Checks for dead posting markers (filled, expired, closed)

**Database (backend/models.py)**
- MySQL is the source of truth (Qdrant/Redis are not canonical)
- Job model with url_hash (unique, indexed) and content_hash for dedup
- Fields: source, source_id, title, company, location_raw/normalized, employment_type, experience_level, remote, description, skills_required, salary_min/max/currency, apply_url, posted_at, is_active, verified, verified_at, created_at, updated_at

**Configuration (backend/config.py)**
- Environment-driven via pydantic_settings
- No secrets hard-coded — all via .env file
- Sections: Application, Database, Job APIs, AI/LLM, Vector Search, Verification, Security

### Adding new job sources
1. Create a class implementing `JobSourceAdapter` protocol (async `search(query, location)` → `list[RawJobPosting]`)
2. Add credential config to `backend/config.py` if needed
3. Register in `get_adapter()` function if `job_api_mode=live`
4. The `MultiSourceAdapter` handles aggregation and failure logging automatically

### Adding company career page scraping
- The company scraper (`backend/services/company_scraper.py`) is a free, no-credential-required source
- It scrapes known career page URL patterns and extracts job cards using HTML parsing
- Results flow through the same dedup pipeline (`url_hash` + `content_hash`)
- Use `JOB_SOURCES=company` in `.env` to enable

### Testing
- Run all tests: `pytest -v`
- Individual test files are in `tests/` directory
- Mock-based tests for API adapters use `respx` for HTTP mocking
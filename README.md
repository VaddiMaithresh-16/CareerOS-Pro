# CareerOS‑Pro

AI‑powered career intelligence platform that **autonomously discovers, filters, ranks, and explains** job and internship opportunities. It aggregates listings from multiple free and paid sources, normalizes them deterministically, deduplicates, applies hard eligibility filters, and uses an LLM routing pipeline to explain matches.

---

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Docker Deployment](#docker-deployment)
- [Configuration](#configuration)
- [CLI Usage](#cli-usage)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Multi‑source aggregation** — JSearch (RapidAPI), Adzuna, Remotive, RemoteOK, Arbeitnow, plus a free company‑career‑page scraper (BeautifulSoup4).
- **Deterministic normalization** — no LLM in the parsing path. Location/remote classification, employment‑type mapping, experience‑level classification, and salary parsing with currency conversion.
- **Two‑stage deduplication** — exact `url_hash` first, then `content_hash` fallback.
- **Hard eligibility filters** — pure logic, LLM never overrides (employment type, experience, remote‑only, location alias matching, query string, min salary, posted‑within‑days).
- **LLM routing & explanation** — LangGraph state machine with multi‑provider fallback (LlamaCpp → NVIDIA NIM → OpenRouter → Gemini).
- **Two‑stage verification** — cheap HTTP HEAD check, then Firecrawl content scrape. Never invents a result.
- **Polite company scraper** — per‑domain concurrency control (semaphore), exponential backoff with jitter, in‑memory HTML cache.

---

## Architecture

```
Frontend (React 19 + Vite + Framer Motion)
        │  REST / CORS
        ▼
Backend (FastAPI + Granian)
  ├─ services/job_api_adapter.py   → MultiSourceAdapter (JSearch, Adzuna, Remotive, RemoteOK, Arbeitnow)
  ├─ services/company_scraper.py    → BeautifulSoup4 career‑page scraper
  ├─ services/normalize.py          → deterministic field normalization
  ├─ services/dedup.py              → url_hash + content_hash dedup
  ├─ services/filters.py            → hard eligibility filters
  ├─ services/verification.py       → HEAD + Firecrawl verify
  ├─ graph.py                       → LangGraph match/explain pipeline
  ├─ models.py                      → MySQL (source of truth)
  └─ config.py                      → pydantic_settings, env‑driven
        │
        ├─ MySQL (canonical job store)
        └─ Qdrant (vector retrieval for semantic ranking)
```

**Data flow:** Sources → Normalize → Dedup → Filters → DB → (optional) LLM match/verify → Frontend.

---

## Quick Start

```bash
# Backend (terminal 1)
cd backend && pip install -r ../requirements.txt && python run.py
# API:    http://localhost:8000
# Docs:   http://localhost:8000/docs

# Frontend (terminal 2)
cd frontend && npm install && npm run dev
# App:    http://localhost:5173
```

Requires Python 3.11+ and Node 20+.

---

## Backend Setup

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r ../requirements.txt
cp ../.env.example ../.env   # then fill in DB + API keys
python run.py
```

The backend expects a reachable MySQL instance. `DATABASE_URL` is constructed from `MYSQL_*` env vars (see `.env.example`). Qdrant is optional for semantic ranking but recommended.

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend reads `VITE_API_BASE` (defaults to `http://localhost:8000`). CORS is pre‑configured for ports `5173` and `3000`.

---

## Docker Deployment

```bash
# Build and start full stack (backend + MySQL + Qdrant + frontend)
docker compose up -d

# Or backend image only
docker build -t careeros-pro .
docker run -p 8000:8000 -e APP_ENV=production careeros-pro
```

**Security note:** The `Dockerfile` does **not** copy `.env` files into the image. Mount secrets at runtime via `env_file` in `docker-compose.yml` or `-e` flags. `.env` is git‑ignored.

---

## Configuration

All configuration is environment‑driven via `backend/config.py` (pydantic_settings). Key groups:

| Group | Highlights |
|-------|-----------|
| Application | `APP_ENV` (development \| production) |
| Database | `MYSQL_*` components or explicit `DATABASE_URL` (MySQL only) |
| Job APIs | `JOB_API_MODE` (mock \| live), `JOB_SOURCES`, JSearch/Adzuna keys |
| AI/LLM | `LLM_PROVIDER_MODE`, per‑provider keys & models |
| Vector | `QDRANT_URL` |
| Verification | `FIRECRAWL_API_KEY` |
| Security | `API_KEY`, `RATE_LIMIT_PER_MINUTE` |

See [`.env.example`](.env.example) for the full template with inline docs.

### Company Scraper Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `company_scraper_max_concurrency` | `5` | Max concurrent requests **per domain**. |
| `company_scraper_jitter_max` | `0.5` | Max seconds of random jitter on retry backoff. |
| `company_scraper_cache_size` | `100` | Max cached HTML responses (in memory). |
| `company_career_page_patterns` | `[]` | Custom URL patterns for career pages. |

Enable via `JOB_SOURCES=company`.

---

## CLI Usage

```bash
python -m backend.cli <company_name> [options]
```

| Flag | Type | Description |
|------|------|-------------|
| `--location <text>` | string | Location filter (e.g., "Remote"). |
| `--url <text>` | string | Custom career‑page URL (bypasses auto‑construction). |
| `--salary-min <float>` | float | Minimum salary filter. |
| `--salary-max <float>` | float | Maximum salary filter. |
| `--max-concurrency <int>` | int | Override per‑domain concurrency. |
| `--jitter-max <float>` | float | Override max retry jitter. |

Example:
```bash
python -m backend.cli Google --max-concurrency 10 --jitter-max 1.0
```

---

## Testing

```bash
# All tests (52+ covering discovery, normalize, dedup, filters, vector, LLM, e2e)
pytest -v

# Single file
pytest tests/test_company_scraper.py -v
```

Tests use `respx` for HTTP mocking — no real network calls.

---

## Contributing

1. Follow existing code style and type‑hint conventions.
2. Include unit tests for new functionality.
3. Update `UPGRADE_ROADMAP.md` for user‑facing changes.
4. Never hard‑code secrets — use `.env` (git‑ignored).

---

## License

MIT — see [LICENSE](LICENSE).

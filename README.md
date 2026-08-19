# CareerOS‑Pro

AI‑powered career intelligence platform that **autonomously discovers, filters, ranks, and explains** job and internship opportunities. It aggregates listings from multiple free and paid sources, normalizes them deterministically, deduplicates, applies hard eligibility filters, and uses an LLM routing pipeline to explain matches.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Supported Platforms](#supported-platforms)
- [Setup Order of Execution](#setup-order-of-execution)
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

## Supported Platforms

CareerOS‑Pro runs on **macOS**, **Linux**, and **Windows**. Commands below are shown per platform where they differ.

| Requirement | Version | Notes |
|-------------|---------|-------|
| Python      | 3.11+   | Backend runtime |
| Node.js     | 20+     | Frontend toolchain |
| MySQL       | 8.0+    | Canonical job store |
| Docker      | 24+     | Optional, for containerized deploy |
| Git         | any modern | For cloning |

**Shell conventions used in this guide**

| Platform | Shell | Notes |
|----------|-------|-------|
| macOS / Linux | Bash / Zsh | Commands run as‑written. |
| Windows (PowerShell) | `PS>` | Use `python` or `py` depending on install; paths use backslashes or quoted forward slashes. |
| Windows (WSL2) | Bash | Same as Linux — recommended for the smoothest experience. |
| Windows (CMD) | `C:\>` | Use `python` instead of `python3`; `venv\Scripts\activate.bat` instead of `source`. |

> **Tip (Windows):** If `python` is not on your PATH, use `py` (the Python launcher). For the backend venv on Windows, activate with `venv\Scripts\activate` (PowerShell) or `venv\Scripts\activate.bat` (CMD).

---

## Setup Order of Execution

Run these steps **in order**. Later steps depend on earlier ones being complete.

1. **Clone the repository** — get the code locally.
2. **Install toolchains** — Python 3.11+ and Node 20+ must both be available.
3. **Provision the database** — start MySQL (native or via Docker) and ensure it is reachable. The backend builds the schema on first run.
4. **Create and configure `.env`** — copy `.env.example` to `.env` and fill in DB credentials and any API keys. This must exist before the backend starts.
5. **Install backend dependencies** — create a venv and install requirements.
6. **Install frontend dependencies** — `npm install` in the frontend directory.
7. **Start the backend** — runs the API on `http://localhost:8000`.
8. **Start the frontend** — runs the app on `http://localhost:5173`.
9. **(Optional) Run tests** — verify the setup with `pytest`.

Do **not** start the frontend before the backend is up, since the frontend calls the API at `http://localhost:8000` by default.

---

## Quick Start

### macOS / Linux (Bash / Zsh)

```bash
# Backend (terminal 1)
cd backend
python -m venv venv && source venv/bin/activate
pip install -r ../requirements.txt
cp ../.env.example ../.env   # then fill in DB + API keys
python run.py
# API:    http://localhost:8000
# Docs:   http://localhost:8000/docs

# Frontend (terminal 2)
cd frontend
npm install
npm run dev
# App:    http://localhost:5173
```

### Windows (PowerShell)

```powershell
# Backend (terminal 1)
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r ..\requirements.txt
Copy-Item ..\.env.example ..\.env   # then fill in DB + API keys
python run.py
# API:    http://localhost:8000
# Docs:   http://localhost:8000/docs

# Frontend (terminal 2)
cd frontend
npm install
npm run dev
# App:    http://localhost:5173
```

### Windows (WSL2 — Bash)

```bash
# Same as macOS / Linux. WSL2 shares the Windows filesystem but runs a real Linux shell.
# Backend (terminal 1)
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r ../requirements.txt
cp ../.env.example ../.env
python run.py

# Frontend (terminal 2)
cd frontend && npm install && npm run dev
```

> Requires Python 3.11+ and Node 20+ on all platforms.

---

## Backend Setup

### macOS / Linux

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r ../requirements.txt
cp ../.env.example ../.env   # then fill in DB + API keys
python run.py
```

### Windows (PowerShell)

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r ..\requirements.txt
Copy-Item ..\.env.example ..\.env
python run.py
```

### Windows (CMD)

```cmd
cd backend
python -m venv venv
venv\Scripts\activate.bat
pip install -r ..\requirements.txt
copy ..\.env.example ..\.env
python run.py
```

The backend expects a reachable MySQL instance. `DATABASE_URL` is constructed from `MYSQL_*` env vars (see `.env.example`). Qdrant is optional for semantic ranking but recommended.

#### Starting MySQL (per platform)

**macOS (Homebrew):**
```bash
brew install mysql
brew services start mysql
```

**Linux (Debian/Ubuntu):**
```bash
sudo apt update && sudo apt install -y mysql-server
sudo service mysql start
```

**Windows (WSL2):**
```bash
sudo apt update && sudo apt install -y mysql-server
sudo service mysql start
```

**Any platform (Docker):**
```bash
docker run -d --name careeros-mysql \
  -e MYSQL_ROOT_PASSWORD=rootpass \
  -e MYSQL_DATABASE=careeros \
  -p 3306:3306 \
  mysql:8.0
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend reads `VITE_API_BASE` (defaults to `http://localhost:8000`). CORS is pre‑configured for ports `5173` and `3000`. On Windows, the same commands apply in PowerShell, CMD, or WSL2.

---

## Docker Deployment

```bash
# Build and start full stack (backend + MySQL + Qdrant + frontend)
docker compose up -d

# Or backend image only
docker build -t careeros-pro .
docker run -p 8000:8000 -e APP_ENV=production careeros-pro
```

**Multi‑platform builds:** To build for a non‑native architecture (e.g., ARM on an x86 machine, or vice versa):

```bash
docker buildx create --use
docker buildx build --platform linux/amd64,linux/arm64 -t careeros-pro . --load
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
# macOS / Linux
python -m backend.cli <company_name> [options]

# Windows (use py if python is not on PATH)
py -m backend.cli <company_name> [options]
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
# macOS / Linux / WSL2
pytest -v

# Windows
py -m pytest -v
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

# CareerOS-Pro

**Your AI-powered career intelligence platform** — autonomously discovers, filters, ranks, and explains job and internship opportunities. Built for today's competitive job market, combining smart automation with human-centered design to help you find the right opportunities faster.

Whether you're hunting for internships, entry-level positions, or career moves, CareerOS-Pro adapts to your needs with India-optimized defaults (perfect for Hyderabad-based searches) while remaining globally compatible.

<hr>

## 🚀 Quick Start

Get running in minutes with two options:

### Option 1: Development (local)
```bash
# 1. Clone the repository
git clone https://github.com/VaddiMaithresh-16/CareerOs-Pro.git
cd CareerOs-Pro

# 2. Start the backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Copy and configure environment
cp .env.example .env
# Edit .env with your API keys and MySQL credentials

# Start the servers
# Terminal 1 — Backend
cd backend
python run.py
# API at: http://localhost:8000
# Docs at:  http://localhost:8000/docs

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
# App at: http://localhost:5173
```

### Option 2: Docker (containerized)
```bash
# Build the image
docker build -t careeros-pro .

# Run the container
docker run -p 8000:8000 -e APP_ENV=production careeros-pro
# Or with Docker Compose:
# docker-compose up -d
```

<hr>

## 🛠️ Setup & Configuration

### Prerequisites

- **Python 3.12+** (tested with 3.12.13)
- **Node.js 18+** (for frontend)
- **MySQL 8.0+** (required — no SQLite fallback)
- **Git** (for version control)

### Environment Configuration

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

The `.env` file is organized into clear sections:

| Section | Purpose |
|---------|---------|
| **Application** | `APP_ENV=development` or `production` |
| **Database** | MySQL credentials or explicit `DATABASE_URL` |
| **Job APIs** | Enable sources: `jsearch,adzuna,remotive,remoteok,arbeitnow` |
| **AI/LLM** | Provider mode and API keys (Gemini, NVIDIA NIM, OpenRouter, etc.) |
| **Vector Search** | Qdrant local or cloud deployment |
| **Verification** | Firecrawl API for job validation |
| **Security** | Optional `API_KEY` for endpoint protection |

### Database Setup

CareerOS-Pro requires MySQL. The system auto-builds your connection URL from these components:

```bash
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_DATABASE=careeros
MYSQL_USER=your_username
MYSQL_PASSWORD=your_secure_password
```

Or provide an explicit `DATABASE_URL`:
```bash
DATABASE_URL=mysql+pymysql://careeros:password@127.0.0.1:3306/careeros
```

<hr>

## ✨ Core Features

### 🔍 Smart Job Discovery

- **Multi-source search**: JSearch, Adzuna, Remotive, RemoteOK, and Arbeitnow
- **India-first optimization**: Pre-configured for Adzuna India, Hyderabad as default
- **Zero-config startup**: Free sources work immediately — add keys for premium platforms

### 🎯 Intelligent Filtering & Deduplication

- **Smart normalization**: Standardizes job data from different sources
- **Advanced deduplication**: URL fingerprinting + content hashing
- **Hard filters**: Location, employment type, experience, salary, recency — LLMs can't override

### 🧠 Evidence-Based Matching

- **Hybrid search**: Vector search (Qdrant) + LLM precision
- **Transparent AI**: Every recommendation includes explainable evidence
- **Multiple LLM support**: Google Gemini, NVIDIA NIM, OpenRouter, or local Llama.cpp

### ✅ Trust & Verification

- **Real-time validation**: Firecrawl checks if postings are still active
- **Trustworthy recommendations**: Only verifiable, active opportunities
- **Continuous monitoring**: Keeps recommendations fresh and reliable

### ⚡ Built for Performance

- **Lightning-fast backend**: FastAPI + Granian (faster than Uvicorn)
- **Scalable architecture**: Microservices-inspired design
- **Production-ready**: Complete deployment package

<hr>

## 🛠️ Usage

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Detailed health check (database, API status, system readiness) |
| `GET /health/ready` | Readiness probe — 200 if app can serve requests, 503 otherwise |
| `POST /jobs/search` | Discover jobs with filters (requires API key) |
| `GET /jobs/{job_id}` | Retrieve a specific job |
| `POST /jobs/match` | Full pipeline: discover → normalize → dedup → filter → match → rank |
| `POST /jobs/{job_id}/verify` | Firecrawl-backed verification pass |

### Filtering

Apply filters at the database level or in Python:

- **Employment type**: `engineering`, `full-time`, `internship`, etc.
- **Experience level**: `Senior`, `Mid`, `Entry`, `Fresher`, `Intern`, `Any`
- **Remote only**: Filter remote vs on-site vs hybrid
- **Minimum salary**: Exclude jobs below threshold
- **Posted within days**: Filter by recency (1h, 3d, 7d, 14d, 30d)

### API Key Protection

Set `API_KEY` in `.env` to require `X-API-Key` header on all endpoints:

```bash
X-API-Key: your_secure_api_key_here
```

<hr>

## 🧪 Testing

Run the comprehensive test suite:

```bash
pytest -v
```

**All 52 tests cover:**

- Job discovery from all platforms
- Data normalization and deduplication
- Hard filtering systems
- Vector storage and search operations
- LLM routing and model selection
- Middleware (security, rate limiting, request ID)
- End-to-end workflow validation

<hr>

## ☁️ Production Deployment

### Checklist

1. **Database**: Point to production MySQL via `.env`
2. **Environment**: Set `APP_ENV=production` in `.env`
3. **Performance**: Run with multiple workers:
   ```bash
   python run.py --host 0.0.0.0 --port 8000 --workers 4
   ```
4. **Security**:
   - Set `API_KEY` in `.env` for authentication
   - Configure proper MySQL credentials
   - Set up hosted Qdrant instance (change `QDRANT_URL`)
   - Use Redis-backed rate limiter (upgrade from in-memory)
5. **Reliability**:
   - Configure proper logging & monitoring
   - Set `FIRECRAWL_API_KEY` for job verification
   - Use production embedding model (upgrade from HashingVectorizer)
   - Set `APP_ENV=production` (enforces MySQL, disables SQLite fallback)

### Docker Deployment

CareerOS-Pro can be containerized for production using Docker Compose. The
Dockerfile at the project root builds a non-root containerized backend with
Granian. Use the following `docker-compose.yml` (no explicit version tag —
compose v2+ handles defaults automatically) to get started:

```yaml
services:
  backend:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      - APP_ENV=production
      - MYSQL_HOST=mysql
      - MYSQL_DATABASE=careeros
    depends_on:
      - mysql
      - qdrant

  frontend:
    build: ./frontend
    ports: ["5173:5173"]

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_DATABASE=careeros
      - MYSQL_ROOT_PASSWORD=secret

  qdrant:
    image: qdrant/qdrant:latest
    ports: ["6333:6333"]
```

#### Deploy on macOS, Windows, or Linux

Docker Desktop is available for all three platforms. After installing Docker
Desktop, follow these steps:

1. **Open a terminal** (PowerShell on Windows, Terminal on macOS/Linux)
2. **Build and start the stack:**
   ```bash
   docker compose up --build -d
   ```
   - The `--build` flag rebuilds images if the Dockerfile or compose file
     changed.
   - The `-d` flag runs the containers in detached (background) mode.
3. **Verify the services are running:**
   ```bash
   docker compose ps
   ```
   - Backend API should be reachable at `http://localhost:8000`
   - Frontend should be reachable at `http://localhost:5173`
   - MySQL port 3306 is forwarded internally; use `127.0.0.1` with your
     local MySQL client if port-mapped.
   - Qdrant dashboard should be available at `http://localhost:6333`
4. **View logs for a specific service:**
   ```bash
   docker compose logs -f backend
   ```
5. **Stop the stack:**
   ```bash
   docker compose down
   ```
   - This stops and removes containers, networks, and volumes created by `up`.

#### Customizing for Production

- **Environment variables:** Copy `.env.example` to `.env` and set
  `APP_ENV=production`, `MYSQL_ROOT_PASSWORD`, `FIRECRAWL_API_KEY`, etc.
- **Persistent volumes:** Add volume mounts under each service in
  `docker-compose.yml` to persist MySQL data and Qdrant data across container
  restarts.
- **Reverse proxy:** For external access, place a Traefik or Nginx reverse
  proxy in front of the containers and terminate TLS.
- **Resource limits:** Add `deploy.resources.limits` to the compose file to
  cap CPU/memory per service.

See the [Dockerfile](Dockerfile) for the backend container configuration and
available environment variables.

**Ready to transform your job search?** Clone the repo, add your API keys, and
let CareerOS-Pro do the hard work while you focus on what matters—your next
career move.

*Last updated: 2026-08-17*

<hr>

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for:

- How to report bugs and suggest features
- Development setup and code standards
- Pull request process and guidelines
- Commit message conventions
- Testing requirements

**Please ensure your contributions:**

- Follow PEP 8 style guidelines
- Include appropriate tests
- Pass all existing tests
- Document any new functionality

<hr>

## 📄 License

CareerOS-Pro is free and open-source software licensed under the [MIT License](LICENSE).

<hr>

## 🙏 Acknowledgments

- **Built with**: FastAPI, LangGraph, and React/Vite
- **Job data**: JSearch, Adzuna, Remotive, RemoteOK, and Arbeitnow APIs
- **AI capabilities**: Google Gemini, NVIDIA NIM, OpenRouter, and local Llama.cpp models
- **Inspired by**: Everyone who's ever spent too much time searching for jobs

---

**Ready to transform your job search?** Clone the repo, add your API keys, and let CareerOS-Pro do the hard work while you focus on what matters—your next career move.

*Last updated: 2026-08-17*

<hr>

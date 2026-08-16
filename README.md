# CareerOS

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Python](https://img.shields.io/badge/python-3.12+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green.svg)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)

**CareerOS** is your AI-powered career intelligence platform that autonomously discovers, filters, ranks, and explains job and internship opportunities. Built specifically for today's competitive job market, it combines smart automation with human-centered design to help you find the right opportunities faster.

## 🚀 Overview

Tired of endless job searching? CareerOS does the heavy lifting for you. It intelligently searches multiple job platforms, applies smart filters, and uses AI to match you with the most relevant opportunities—all while explaining *why* each recommendation makes sense for your career goals.

Whether you're hunting for internships, entry-level positions, or career moves, CareerOS adapts to your needs with India-optimized defaults (perfect for Hyderabad-based searches) while remaining globally compatible.

## ✨ Core Features

### 🔍 Smart Job Discovery
- **Multi-source search**: Simultaneously checks JSearch, Adzuna, Remotive, RemoteOK, and Arbeitnow
- **India-first optimization**: Pre-configured for Adzuna India and Hyderabad as default location
- **Zero-configuration startup**: Free sources work immediately—add API keys to unlock premium platforms

### 🎯 Intelligent Filtering & Deduplication
- **Smart normalization**: Standardizes job data from different sources for fair comparison
- **Advanced deduplication**: Eliminates duplicates using URL fingerprinting and content hashing
- **Hard filters that work**: Location, employment type, experience level, salary, and recency filters that LLMs can't override

### 🧠 Evidence-Based Matching
- **Hybrid search technology**: Combines vector search (Qdrant) with LLMs for precise matching
- **Transparent AI**: Every recommendation comes with explainable evidence—see *why* you're a good fit
- **Multiple LLM support**: Works with Google Gemini, NVIDIA NIM, OpenRouter, or local Llama models

### ✅ Trust & Verification
- **Real-time validation**: Checks if job postings are still active using Firecrawl
- **Trustworthy recommendations**: Only suggests verifiable, active opportunities
- **Continuous monitoring**: Ongoing verification keeps recommendations fresh and reliable

### ⚡ Built for Performance
- **Lightning-fast backend**: Powered by FastAPI and Granian (significantly faster than Uvicorn)
- **Scalable architecture**: Microservices-inspired design that grows with your needs
- **Production-ready**: Includes all the pieces needed for serious deployment

## 🏗️ Architecture

CareerOS follows a clean, modular architecture with a clear separation of concerns:

### Backend (`backend/` directory)
1. **API Layer** (`backend/main.py`): FastAPI endpoints that power search and matching operations
2. **Workflow Orchestration** (`backend/graph.py`): LangGraph state machine managing the complete job discovery pipeline
3. **Service Layer**:
   - 🔌 **Job discovery adapters** (`backend/services/job_api_adapter.py`): Connectors to JSearch, Adzuna, Remotive, RemoteOK, and Arbeitnow
   - 🧹 **Normalization & deduplication** (`backend/services/normalize.py`, `backend/services/dedup.py`): Standardizes job data and eliminates duplicates
   - 🔍 **Filtering** (`backend/services/filters.py`): Applies hard eligibility filters that ensure quality
   - 🔍 **Vector storage & search** (`backend/services/vector_store.py`): Qdrant-powered vector storage for semantic search
   - 🧠 **Embedding generation** (`backend/services/embeddings.py`): Creates vector representations of job data
   - 🔀 **Model routing** (`backend/services/model_router.py`): Intelligent LLM routing with OpenRouter + NVIDIA support
   - 📊 **Reranking** (`backend/services/reranker.py`): Improves match relevance with additional ranking signals
   - 🛡️ **Verification** (`backend/services/verification.py`): Validates job postings using Firecrawl
4. **Data Layer** (`backend/models.py`): SQLAlchemy ORM with MySQL backend for persistent storage

### Frontend (`frontend/` directory)
5. **User Interface**: Modern React/Vite web dashboard (`frontend/src/`) that's fast, responsive, and delightful to use

## 🔧 Required APIs & Services

CareerOS is designed to work out-of-the-box with free job sources, but adding API keys unlocks its full potential. Here's what you can integrate:

| Service | What It Does | Cost / Free Tier | How to Get Started |
|---------|--------------|------------------|-------------------|
| **Remotive** | Remote-only tech jobs | **Free** (No key needed) | Already configured—just works! |
| **RemoteOK** | Remote & startup jobs | **Free** (No key needed) | Already configured—just works! |
| **Arbeitnow** | EU & India remote jobs | **Free** (No key needed) | Already configured—just works! |
| **JSearch** | Global job aggregation | ~200 requests/month free | Sign up at [RapidAPI JSearch](https://rapidapi.com/letscrape-6bRBa3QG1q/api/jsearch) |
| **Adzuna** | Global jobs (India-optimized) | ~1,000 requests/month free | Register at [Adzuna Developer](https://developer.adzuna.com/) |
| **Firecrawl** | Live job verification | 500 credits/month free | Get key at [Firecrawl.dev](https://www.firecrawl.dev/) |
| **Google Gemini** | LLM for matching explanations | Generous free tier | Get key at [Google AI Studio](https://aistudio.google.com/app/apikey) |
| **llama.cpp** | Local LLM (private & free) | Free, runs locally | Install [llama.cpp](https://github.com/ggerganov/llama.cpp) |
| **OpenRouter** | Access to 100+ AI models | Free tier available | Get key at [OpenRouter](https://openrouter.ai/keys) |
| **NVIDIA NIM** | Optimized AI inference | Free tier available | Get key at [NVIDIA Build](https://build.nvidia.com/explore/discover) |

## ⚙️ AI Provider Flexibility

Choose how CareerOS handles AI explanations with `LLM_PROVIDER_MODE`:

- `auto` **(Recommended)**: Smart fallback – tries local Llama → NVIDIA NIM → OpenRouter → Gemini
- `llama`: Use only your local Llama.cpp installation (100% private)
- `gemini`: Google Gemini only (great for quality explanations)
- `openrouter`: Access to hundreds of models through one API
- `nvidia`: NVIDIA NIM only (optimized for speed)
- `none`: No LLM – returns basic match scores without explanations

Configure these in your `.env` file:
```bash
LLM_PROVIDER_MODE=auto
OPENROUTER_API_KEY=your_openrouter_key_here
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
NVIDIA_API_KEY=your_nvidia_key_here
NVIDIA_MODEL=meta/llama-3.1-70b-instruct
GEMINI_API_KEY=your_gemini_key_here
GEMINI_MODEL=gemini-flash-latest
LLAMA_CPP_BASE_URL=http://localhost:8080
```

## 🛠️ Installation & Setup

### Prerequisites
- **Python 3.12+** (we've tested with 3.12.13)
- **Git** (for version control)
- **MySQL** (required – CareerOS uses MySQL for all environments)

### Step-by-Step Setup

#### 1. Get the Code
```bash
git clone https://github.com/VaddiMaithresh-16/CareerOs-Pro.git
cd CareerOs-Pro
```

#### 2. Create Your Virtual Environment
**macOS/Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

**Windows:**
```cmd
python -m venv .venv
.venv\Scripts\activate
```

#### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 4. Configure Your Environment
```bash
# macOS/Linux
cp .env.example .env

# Windows
copy .env.example .env
```

Then edit `.env` to add your API keys (see the "Required APIs & Services" section above).

> 💡 **Important**: CareerOS requires MySQL. Make sure it's running! The system automatically builds your database URL from:
> ```bash
> MYSQL_HOST=127.0.0.1
> MYSQL_PORT=3306
> MYSQL_DATABASE=careeros
> MYSQL_USER=your_mysql_username
> MYSQL_PASSWORD=your_secure_password
> ```

#### 5. Launch the Application
**Start the backend (Terminal 1):**
```bash
python run.py
# API available at http://localhost:8000
# Docs at http://localhost:8000/docs
```

**Start the frontend (Terminal 2):**
```bash
cd frontend
npm run dev
# App available at http://localhost:5173
```

## 🧪 Testing

Verify everything works with our comprehensive test suite:
```bash
pytest -v
```
You should see all 52 tests passing. The suite covers:
- Job discovery from all platforms
- Data normalization and deduplication
- Hard filtering systems
- Vector storage and search operations
- LLM routing and model selection
- Middleware (security, rate limiting, request ID)
- End-to-end workflow validation

## ☁️ Production Deployment

Ready for production? Here's your checklist:

1. **Database**: Point to your production MySQL instance via `.env`
2. **Environment**: Set `APP_ENV=production` in `.env`
3. **Performance**: Run with multiple workers:
   ```bash
   python run.py --host 0.0.0.0 --port 8000 --workers 4
   ```
4. **Security**:
   - Set `API_KEY` in `.env` for authentication
   - Configure proper MySQL credentials
   - Set up a hosted Qdrant instance (change `QDRANT_URL`)
   - Use Redis-backed rate limiter (upgrade from in-memory)
5. **Reliability**:
   - Configure proper logging & monitoring
   - Set `FIRECRAWL_API_KEY` for job verification
   - Use a production embedding model (upgrade from HashingVectorizer)
   - Set `APP_ENV=production` (enforces MySQL, disables SQLite fallback)

## 🤝 Contributing

We welcome contributions that make CareerOS better! Here's how to help:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Add tests for any new functionality
5. Ensure all existing tests still pass
6. Commit with a clear message: `git commit -m "Add: [brief description]"`
7. Push to your branch: `git push origin feature/your-feature-name`
8. Open a Pull Request

**Please ensure your contributions:**
- Follow PEP 8 style guidelines
- Include appropriate tests
- Pass all existing tests
- Document any new functionality

## 📄 License

CareerOS is free and open-source software licensed under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **Built with**: [FastAPI](https://fastapi.tiangolo.com/), [LangGraph](https://langchain-ai.github.io/langgraph/), and [React/Vite](https://vitejs.dev/)
- **Job data provided by**: JSearch, Adzuna, Remotive, RemoteOK, and Arbeitnow APIs
- **AI capabilities powered by**: Google Gemini, NVIDIA NIM, OpenRouter, and local Llama.cpp models
- **Inspired by**: Everyone who's ever spent too much time searching for jobs and wished there was a better way

---

**Ready to transform your job search?**  
Clone the repo, add your API keys, and let CareerOS do the hard work while you focus on what matters—your next career move.

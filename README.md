# CareerOS‑Pro Job Scraper

A lightweight, high‑performance scraper that extracts job postings from company career pages.  
It is designed to be **fast**, **polite**, and **configurable**, making it suitable for both personal use and integration into larger job‑aggregation pipelines.

---

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Configuration (`backend/config.py`)](#configuration)
- [Command‑Line Interface](#cli-usage)
- [Advanced Usage](#advanced-usage)
- [Running the Test Suite](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Per‑domain concurrency control** – each company’s career page runs within its own semaphore, preventing over‑loading any single site.  
- **Retry jitter** – exponential back‑off with a random jitter component to avoid thundering‑herd effects.  
- **In‑memory HTML caching** with configurable size and TTL.  
- **Deterministic deduplication** – unchanged hash‑based dedup logic.  
- **Rich CLI** – JSON output with optional overrides for concurrency and jitter.  
- **Extensible URL patterns** – add new career‑page patterns via configuration.  

---

## Installation

```bash
# Clone the repository
git clone https://github.com/your‑org/CareerOS-Pro.git
cd CareerOS-Pro

# Install in editable mode (recommended for development)
pip install -e .
```

The package requires Python 3.12+ and the following dependencies:

```text
httpx
beautifulsoup4
pydantic
```

---

## Configuration (`backend/config.py`)

The scraper reads the following settings (all with sensible defaults):

| Setting | Default | Description |
|---------|---------|-------------|
| `company_scraper_max_concurrency` | `5` | Maximum number of concurrent requests **per domain**. |
| `company_scraper_jitter_max` | `0.5` | Maximum seconds of random jitter added to each retry delay. |
| `company_scraper_cache_size` | `100` | Maximum number of cached HTML responses. |
| `company_career_page_patterns` | `[]` | Custom URL patterns for career pages (override or extend). |

You can override any of these values via environment variables, a `.env` file, or directly in code.

---

## CLI Usage

The scraper ships with a ready‑to‑use command‑line interface:

```bash
python -m backend.cli <company_name> [options]
```

### Options

| Flag | Type | Description |
|------|------|-------------|
| `--location <text>` | string | Optional location filter (e.g., "Remote", "United States"). |
| `--url <text>` | string | Custom career‑page URL (bypasses auto‑URL construction). |
| `--salary-min <float>` | float | Minimum monthly salary (numeric) to filter jobs. |
| `--salary-max <float>` | float | Maximum monthly salary (numeric) to filter jobs. |
| `--max-concurrency <int>` | int | Override the per‑domain concurrency limit. |
| `--jitter-max <float>` | float | Override the maximum jitter added to retry delays. |
| `-h, --help` | | Show the help message. |

### Example Calls

```bash
# Basic fetch – uses all defaults
python -m backend.cli Google

# Increase concurrency and jitter for faster (but still polite) scraping
python -m backend.cli Google --max-concurrency 10 --jitter-max 1.0

# Fetch a specific URL and apply a location filter
python -m backend.cli "Acme Corp" --location "Remote" --url https://acme.com/careers
```

The tool prints a neatly formatted JSON array of job postings:

```json
[
  {
    "source": "company_scraper",
    "source_id": "1a2b3c4d5e6f7g8h",
    "title": "Senior Software Engineer",
    "company": "Acme Corp",
    "location_raw": "Remote",
    "location_normalized": "Remote",
    "employment_type_raw": "full_time",
    "description": "Lead large‑scale distributed systems…",
    "apply_url": "https://acme.com/careers/apply/123",
    "posted_at_raw": null,
    "salary_raw": null
  }
]
```

---

## Advanced Usage

### Adding New Career‑Page Patterns
Edit `backend/config.py` and extend the `company_career_page_patterns` list:

```python
company_career_page_patterns: List[str] = [
    "/careers",
    "/careers?",
    "/jobs",
    "/{dept}/jobs",   # Example of a placeholder you can fill programmatically
]
```

The scraper will automatically include these patterns when constructing URLs.

### Persisting Cache to Disk (Optional)
The current implementation caches HTML in memory only. For long‑running processes that benefit from cache persistence across restarts, you can:

1. Extend `CompanyScraper._fetch_html` to write cached HTML to a configurable directory (`company_scraper_disk_cache_path`).  
2. Load previously saved files on startup.  

This change is straightforward and does not affect the public API.

### Running the Test Suite
```bash
pytest backend/tests/test_company_scraper_concurrency.py -v
```

All tests are designed to run without making real HTTP requests, ensuring a safe CI environment.

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.  
When adding new features, please:

1. Follow the existing code style and type‑hint conventions.  
2. Include unit tests for any new functionality.  
3. Update the roadmap (`backend/UPGRADE_ROADMAP.md`) with any new user‑facing changes.  

---

## License

MIT License – see the `LICENSE` file for details.

---

**Enjoy building smarter job pipelines!** 🚀
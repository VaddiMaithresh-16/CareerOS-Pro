# Contributing to CareerOS

Thank you for your interest in contributing to CareerOS! We welcome contributions that make this project better—whether that's bug fixes, new features, documentation improvements, or anything in between.

## 🎯 Ways to Contribute

- **Report bugs** — Found something broken? Open an issue with clear reproduction steps
- **Suggest features** — Have an idea? We'd love to hear it
- **Improve documentation** — README, docstrings, comments, guides
- **Fix bugs** — Pick up an issue or find your own
- **Add features** — Implement new functionality with tests
- **Write tests** — Increase coverage, add edge case tests

## 🚀 Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+ (for frontend)
- MySQL 8.0+ (required)
- Git

### Development Setup

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/CareerOs-Pro.git
cd CareerOs-Pro

# 2. Set up Python environment
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env with your API keys and database credentials

# 4. Start development servers
# Terminal 1 - Backend
python run.py

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
```

### Running Tests

```bash
# Backend tests
pytest -v

# Frontend tests (if added)
cd frontend && npm test
```

## 📝 Code Standards

### Python (Backend)

- **Style**: PEP 8 with Black formatting (`black .`)
- **Type hints**: Use them everywhere—function signatures, return types, variables
- **Docstrings**: Google-style docstrings for public functions/classes
- **Imports**: Absolute imports from `backend.*`, grouped (stdlib → third-party → local)

```python
# Good
from backend.services.filters import apply_hard_filters
from sqlalchemy import select

def apply_filters(jobs: list[Job], criteria: SearchRequest) -> list[Job]:
    """Apply hard filters to job list.
    
    Args:
        jobs: List of Job objects to filter
        criteria: SearchRequest with filter parameters
        
    Returns:
        Filtered list of Job objects
    """
    return apply_hard_filters(jobs, criteria)
```

### JavaScript/React (Frontend)

- **Style**: ESLint + Prettier (configured in `.oxlintrc.json`)
- **Components**: Functional components with hooks
- **Props**: Type with JSDoc or TypeScript (when migrated)
- **CSS**: CSS custom properties (design tokens) only—no hardcoded values

```jsx
// Good
/**
 * Filters — permanently visible advanced filters.
 * @param {{filters: Object, onChange: Function}} props
 */
export default function Filters({ filters, onChange }) {
  // ...
}
```

### Git Commit Messages

Follow conventional commits for clear history:

```
type(scope): brief description

feat(filters): add experience level reordering
fix(backpack): resolve MySQL connection encoding
docs(readme): update installation steps
refactor(graph): simplify workflow nodes
test(normalize): add edge cases for salary parsing
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `style`, `perf`

## 🔀 Pull Request Process

1. **Create a branch** from `main` with a descriptive name:
   ```bash
   git checkout -b feat/meaningful-short-name
   ```

2. **Make focused changes** — one logical change per PR

3. **Write tests** for new functionality

4. **Ensure all tests pass**:
   ```bash
   pytest -v
   ```

5. **Run linting**:
   ```bash
   # Backend
   black backend/
   
   # Frontend
   cd frontend && npm run lint
   ```

6. **Update documentation** if behavior changes

7. **Submit PR** with:
   - Clear title and description
   - Reference related issues (`Fixes #123`)
   - Screenshots for UI changes

## ✅ PR Checklist

Before submitting, verify:

- [ ] All existing tests pass
- [ ] New tests added for new functionality
- [ ] Code follows project style (Black, ESLint)
- [ ] Type hints / JSDoc present
- [ ] Documentation updated (README, docstrings, comments)
- [ ] No unrelated changes (no formatting-only commits mixed with functional changes)
- [ ] Commit messages follow convention
- [ ] No `.env` or secrets committed

## 🏗️ Architecture Guidelines

CareerOS follows a clean architecture with these layers:

```
backend/
├── main.py              # API endpoints (thin)
├── graph.py             # Workflow orchestration (LangGraph)
├── services/            # Business logic (thick)
│   ├── normalize.py
│   ├── dedup.py
│   ├── filters.py
│   ├── embeddings.py
│   ├── vector_store.py
│   ├── model_router.py
│   ├── reranker.py
│   └── verification.py
├── models.py            # SQLAlchemy ORM models
├── schemas.py           # Pydantic request/response models
├── middleware.py        # Cross-cutting concerns
└── config.py            # Settings (pydantic-settings)
```

**Principles:**
- **Thin controllers, thick services** — API layer only handles HTTP; business logic lives in services
- **Single responsibility** — each service module has one clear purpose
- **Dependency inversion** — endpoints depend on abstractions (interfaces), not concretions
- **Testability** — services are easily testable in isolation

## 🐛 Reporting Issues

When opening an issue, include:

- **Environment**: OS, Python version, Node version
- **Steps to reproduce** (minimal, complete)
- **Expected vs actual behavior**
- **Logs/error messages** (sanitize secrets!)
- **Screenshots** for UI issues

Use labels:
- `bug` — Something isn't working
- `enhancement` — New feature or improvement
- `documentation` — Docs need updates
- `good first issue` — Suitable for newcomers
- `help wanted` — Community help needed

## 💬 Communication

- **GitHub Issues** — Bug reports, feature requests, questions
- **Pull Requests** — Code reviews and discussion
- **Discussions** — General questions, ideas (if enabled)

Be respectful, constructive, and patient. We're all here to build something great.

## 📜 Code of Conduct

By participating, you agree to uphold a welcoming, inclusive environment:

- Be respectful and constructive
- No harassment, discrimination, or abusive behavior
- Focus on the code, not the person
- Assume good intent

Violations may result in removal from the project.

---

**Questions?** Open an issue or start a discussion. We're happy to help!

*Last updated: 2026-08-17*
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m careeros
USER careeros

# Copy requirements first for caching
COPY --chown=careeros:careeros requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code (no .env files — mount secrets at runtime)
COPY --chown=careeros:careeros backend/ ./backend/

# Expose backend port
EXPOSE 8000

# Start the backend with Granian
CMD ["python", "-m", "backend.run", "--host", "0.0.0.0", "--port", "8000"]

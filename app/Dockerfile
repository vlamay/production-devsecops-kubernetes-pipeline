# STAGE 1: Builder
FROM python:3.11-slim AS builder
WORKDIR /build

# Install system dependencies needed to compile PostgreSQL drivers (psycopg2)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
# Install to a local folder to easily copy to the next stage
RUN pip install --user --no-cache-dir -r requirements.txt

# STAGE 2: Runtime (The final small image)
FROM python:3.11-slim
WORKDIR /app

# Install ONLY the runtime library for Postgres (much smaller than libpq-dev)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy only the installed packages from the builder
COPY --from=builder /root/.local /root/.local
COPY . .

# Ensure the installed packages are in the PATH
ENV PATH=/root/.local/bin:$PATH
# Ensure logs are sent straight to terminal without buffering
ENV PYTHONUNBUFFERED=1

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

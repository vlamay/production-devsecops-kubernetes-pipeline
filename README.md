
# Sentinel Auth — Production-Grade 3-Tier DevSecOps Ecosystem
# 🛡️ Sentinel-Auth

A fully automated DevSecOps pipeline that builds, scans, and deploys
a containerized 3-tier application (Frontend, Backend, PostgreSQL)
to AWS using Terraform, Ansible, and Kubernetes.

## Architecture
<p align="center">
<img width="800" height="1024" alt="ChatGPT Image Mar 13, 2026, 04_38_14 PM" src="https://github.com/user-attachments/assets/49749a53-2722-4ed9-a300-f6637a61cfb9" />
</p>


# Quick Start

# Prerequisites

| Tool       | Version  |
|------------|----------|
| Python     | 3.10+    |
| Node.js    | 20.19+   |
| PostgreSQL | 13+ *(only for production — tests use SQLite)* |

# 1. Backend

cd Secure-Auth

**Install dependencies**
pip install -r requirements.txt

**Run the server (Explicitly bind to 127.0.0.1 for local dev harmony)**
  uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
  http://127.0.0.1:8000
  Swagger UI: http://127.0.0.1:8000/docs

 **2. Frontend**

cd Secure-Auth/frontend

**Install dependencies**
npm install

**Start dev server**
npm run dev
http://127.0.0.1:5173

**3. Run Tests**

cd Secure-Auth
pytest tests/ -v


**API Reference**

**GET /health**
Returns service status and current UTC timestamp.

**GET /ping**

Simple diagnostic endpoint for connectivity testing. Returns text `"pong"`.

**OPTIONS /register**

Handled explicitly for CORS preflight robustness.

json
{
  "status": "ok",
  "timestamp": "2026-03-08T00:30:00+00:00"
}


**POST /register**

Register a new user.

**Request Body:**
json
{
  "username": "sentinel_admin",
  "password": "Str0ngP@ss!"
}


**Success (201):**
json
{
  "id": 1,
  "username": "sentinel_admin",
  "created_at": "2026-03-08T00:30:00+00:00"
}


**Duplicate (400):**
json
{ "detail": "Username already registered" }

## Environment Variables

| Variable      | Default         | Description              |
|---------------|-----------------|--------------------------|
| `DB_USER`     | `postgres`      | PostgreSQL username      |
| `DB_PASSWORD` | `postgres`      | PostgreSQL password      |
| `DB_HOST`     | `localhost`     | Database host            |
| `DB_PORT`     | `5432`          | Database port            |
| `DB_NAME`     | `sentinel_auth` | Database name            |


## Frontend Features

| Feature             | Description                                                    |
|---------------------|----------------------------------------------------------------|
| **Register Tab**    | Username + password form → `POST /register` with toast alerts  |
| **Status Tab**      | Live health polling (30s), green pulse / red offline indicator  |
| **Manual Refresh**  | Re-check backend health on demand                              |
| **Toast Alerts**    | 🛡️ Account Created · ❌ Username Taken · 📡 Backend Offline    |
| **Responsive**      | Centered card layout that works on any screen size             |


## Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Backend    | FastAPI · SQLAlchemy 2.0 · Pydantic v2  |
| Auth       | passlib + bcrypt                        |
| Database   | PostgreSQL (prod) · SQLite (tests)      |
| Frontend   | React · Vite · Tailwind CSS · Axios     |
| Testing    | pytest · httpx · FastAPI TestClient      |

### 📚 What I Learned
- Designing a full DevSecOps CI/CD pipeline
- Automating cloud infrastructure using Terraform
- Secure GitHub Actions authentication with AWS OIDC
- Container security scanning using Bandit and Trivy
- Automated server configuration using Ansible
- Kubernetes deployment and service orchestration

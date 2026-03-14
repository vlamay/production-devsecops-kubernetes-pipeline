"""Sentinel-Auth — FastAPI application entry point."""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import time
import logging

from app.api.routes import router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("sentinel-auth")

app = FastAPI(
    title="Sentinel-Auth",
    description="Secure user registration service",
    version="1.0.0",
)

# CORS — allow ANY local development origin (regex for all ports)
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    # Log specific details for OPTIONS/preflight to catch 400s
    if request.method == "OPTIONS":
        logger.info(f"PREFLIGHT: Path={request.url.path} Origin={request.headers.get('origin')} Headers={list(request.headers.keys())}")
    
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    
    logger.info(f"Method: {request.method} Path: {request.url.path} Status: {response.status_code} Duration: {duration:.2f}s")
    return response

@app.get("/ping")
def ping():
    return "pong"

app.include_router(router)

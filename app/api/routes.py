"""API route handlers for /health and /register."""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.schemas import UserCreate, UserOut
from app.core.security import hash_password
from app.db.models import User
from app.db.session import get_db

router = APIRouter()


@router.get("/health", tags=["Health"])
def health_check():
    """Return service status and current UTC timestamp."""
    return {
        "status": "ok",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@router.options("/register")
def options_register():
    """Manual preflight handler if middleware is bypassed."""
    return {}

@router.post(
    "/register",
    response_model=UserOut,
    status_code=status.HTTP_201_CREATED,
    tags=["Auth"],
)
def register_user(payload: UserCreate, db: Session = Depends(get_db)):
    """Register a new user with a hashed password."""
    # Check for duplicate username
    existing = db.query(User).filter(User.username == payload.username).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )

    user = User(
        username=payload.username,
        hashed_password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

"""Pydantic schemas for user registration request and response."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class UserCreate(BaseModel):
    """Schema for the POST /register request body."""

    username: str = Field(..., min_length=3, max_length=150)
    password: str = Field(..., min_length=8, max_length=128)


class UserOut(BaseModel):
    """Schema returned after successful registration — never exposes password."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    created_at: datetime

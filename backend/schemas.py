import re
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import List, Optional
from datetime import datetime
from models import UserRole, JobStatus, MilestoneStatus

def sanitize_text(v: str) -> str:
    """Sanitizes text strings against XSS script injection and HTML tags."""
    if not isinstance(v, str):
        return v
    v = re.sub(r"<script.*?>.*?</script>", "", v, flags=re.DOTALL | re.IGNORECASE)
    v = re.sub(r"<[^>]*>", "", v)
    v = re.sub(r"(?i)ignore (previous|all) instructions", "[redacted instruction override]", v)
    v = re.sub(r"(?i)system prompt:", "[redacted system prompt]", v)
    return v.strip()

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)
    role: UserRole = UserRole.FREELANCER
    bio: Optional[str] = Field(None, max_length=2000)
    skills: List[str] = Field(default=[], max_length=20)
    hourly_rate: Optional[float] = Field(None, ge=0.0, le=1000.0)

    @field_validator("full_name", "bio", mode="before")
    @classmethod
    def validate_user_text(cls, v):
        return sanitize_text(v) if v else v

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=128)

class UserResponse(UserBase):
    id: str
    rating: float
    created_at: datetime

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None

# Job Schemas
class JobBase(BaseModel):
    title: str = Field(..., min_length=5, max_length=150)
    description: str = Field(..., min_length=20, max_length=5000)
    budget: float = Field(..., gt=0.0, le=1000000.0)
    skills_required: List[str] = Field(default=[], max_length=15)

    @field_validator("title", "description", mode="before")
    @classmethod
    def validate_job_text(cls, v):
        return sanitize_text(v)

class JobCreate(JobBase):
    pass

class JobResponse(JobBase):
    id: str
    client_id: str
    status: JobStatus
    created_at: datetime

    class Config:
        from_attributes = True

# Proposal Schemas
class ProposalCreate(BaseModel):
    job_id: str = Field(..., min_length=1)
    bid_amount: float = Field(..., gt=0.0, le=1000000.0)
    cover_letter: str = Field(..., min_length=20, max_length=3000)

    @field_validator("cover_letter", mode="before")
    @classmethod
    def validate_cover_letter(cls, v):
        return sanitize_text(v)

class ProposalResponse(BaseModel):
    id: str
    job_id: str
    freelancer_id: str
    bid_amount: float
    cover_letter: str
    ai_match_score: float
    ai_reasoning: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# Escrow / Milestone Schemas
class MilestoneCreate(BaseModel):
    contract_id: str
    title: str = Field(..., min_length=3, max_length=100)
    amount: float = Field(..., gt=0.0)

class MilestoneResponse(BaseModel):
    id: str
    contract_id: str
    title: str
    amount: float
    status: MilestoneStatus
    deliverable_note: Optional[str] = None
    deliverable_url: Optional[str] = None

    class Config:
        from_attributes = True

class FundMilestoneRequest(BaseModel):
    milestone_id: str
    amount: float = Field(..., gt=0.0)

class SubmitDeliverableRequest(BaseModel):
    milestone_id: str
    deliverable_note: str = Field(..., min_length=5, max_length=2000)
    deliverable_url: str = Field(..., max_length=500)

    @field_validator("deliverable_note", mode="before")
    @classmethod
    def validate_note(cls, v):
        return sanitize_text(v)

class ReleaseEscrowRequest(BaseModel):
    milestone_id: str

# PayPal Specific Schemas
class CreatePayPalOrderRequest(BaseModel):
    milestone_id: str
    amount: float = Field(..., gt=0.0)
    currency: str = "USD"

class CapturePayPalOrderRequest(BaseModel):
    order_id: str
    milestone_id: str

class PayPalPayoutRequest(BaseModel):
    milestone_id: str
    receiver_email: EmailStr
    amount: float = Field(..., gt=0.0)
    currency: str = "USD"

# AI Analysis Schema
class AIMatchRequest(BaseModel):
    job_id: str
    freelancer_skills: List[str] = Field(..., max_length=20)
    freelancer_bio: str = Field(..., min_length=10, max_length=3000)

    @field_validator("freelancer_bio", mode="before")
    @classmethod
    def validate_ai_bio(cls, v):
        return sanitize_text(v)

class AIMatchResponse(BaseModel):
    job_id: str
    ai_match_score: float
    matching_skills: List[str]
    missing_skills: List[str]
    recommendation_summary: str

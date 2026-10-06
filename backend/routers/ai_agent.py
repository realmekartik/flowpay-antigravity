from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Job
from schemas import AIMatchRequest, AIMatchResponse
from services.ai_matcher import ai_matcher
from services.rate_limiter import rate_limit_ai

router = APIRouter(prefix="/ai", tags=["AI Engine & Agents"])

@router.post("/match-candidate", response_model=AIMatchResponse, dependencies=[Depends(rate_limit_ai)])
def evaluate_candidate_match(req: AIMatchRequest, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == req.job_id).first()
    required_skills = job.skills_required if job and job.skills_required else ["React", "FastAPI"]
    job_description = job.description if job else "Software development position"

    result = ai_matcher.calculate_match_score(
        required_skills=required_skills,
        candidate_skills=req.freelancer_skills,
        job_description=job_description,
        candidate_bio=req.freelancer_bio
    )

    return {
        "job_id": req.job_id,
        "ai_match_score": result["ai_match_score"],
        "matching_skills": result["matching_skills"],
        "missing_skills": result["missing_skills"],
        "recommendation_summary": result["recommendation_summary"]
    }

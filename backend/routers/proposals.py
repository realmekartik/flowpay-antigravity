from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Proposal, Job, User
from schemas import ProposalCreate, ProposalResponse
from services.job_service import job_service
from services.ai_matcher import ai_matcher

router = APIRouter(prefix="/proposals", tags=["Proposals & Bidding"])

@router.post("", response_model=ProposalResponse, status_code=status.HTTP_201_CREATED)
def submit_proposal(
    prop_in: ProposalCreate,
    freelancer_id: str = "usr_demo_freelancer",
    db: Session = Depends(get_db)
):
    job = db.query(Job).filter(Job.id == prop_in.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    freelancer = db.query(User).filter(User.id == freelancer_id).first()
    freelancer_skills = freelancer.skills if freelancer and freelancer.skills else ["React", "FastAPI", "Python", "Tailwind CSS"]
    freelancer_bio = freelancer.bio if freelancer and freelancer.bio else prop_in.cover_letter

    # AI Match Evaluation
    ai_result = ai_matcher.calculate_match_score(
        required_skills=job.skills_required or [],
        candidate_skills=freelancer_skills,
        job_description=job.description,
        candidate_bio=freelancer_bio
    )

    proposal = job_service.create_proposal(
        db, prop_in, freelancer_id,
        ai_score=ai_result["ai_match_score"],
        ai_reasoning=ai_result["recommendation_summary"]
    )
    return proposal

@router.get("/job/{job_id}", response_model=List[ProposalResponse])
def get_job_proposals(job_id: str, db: Session = Depends(get_db)):
    return db.query(Proposal).filter(Proposal.job_id == job_id).order_by(Proposal.ai_match_score.desc()).all()

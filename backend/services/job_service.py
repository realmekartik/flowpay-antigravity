import uuid
from sqlalchemy.orm import Session
from models import Job, Proposal, User
from schemas import JobCreate, ProposalCreate

class JobService:
    @staticmethod
    def create_job(db: Session, job_in: JobCreate, client_id: str) -> Job:
        job = Job(
            id=f"job_{uuid.uuid4().hex[:8]}",
            client_id=client_id,
            title=job_in.title,
            description=job_in.description,
            budget=job_in.budget,
            skills_required=job_in.skills_required
        )
        db.add(job)
        db.commit()
        db.refresh(job)
        return job

    @staticmethod
    def list_jobs(db: Session, limit: int = 50):
        return db.query(Job).order_by(Job.created_at.desc()).limit(limit).all()

    @staticmethod
    def get_job(db: Session, job_id: str):
        return db.query(Job).filter(Job.id == job_id).first()

    @staticmethod
    def create_proposal(db: Session, prop_in: ProposalCreate, freelancer_id: str, ai_score: float = 0.0, ai_reasoning: str = "") -> Proposal:
        proposal = Proposal(
            id=f"prop_{uuid.uuid4().hex[:8]}",
            job_id=prop_in.job_id,
            freelancer_id=freelancer_id,
            bid_amount=prop_in.bid_amount,
            cover_letter=prop_in.cover_letter,
            ai_match_score=ai_score,
            ai_reasoning=ai_reasoning
        )
        db.add(proposal)
        db.commit()
        db.refresh(proposal)
        return proposal

job_service = JobService()

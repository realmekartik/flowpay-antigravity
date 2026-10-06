from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Job
from schemas import JobCreate, JobResponse
from services.job_service import job_service

router = APIRouter(prefix="/jobs", tags=["Jobs Marketplace"])

@router.get("", response_model=List[JobResponse])
def get_all_jobs(db: Session = Depends(get_db)):
    return job_service.list_jobs(db)

@router.post("", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(job_in: JobCreate, client_id: str = "usr_demo_client", db: Session = Depends(get_db)):
    return job_service.create_job(db, job_in, client_id)

@router.get("/{job_id}", response_model=JobResponse)
def get_job_details(job_id: str, db: Session = Depends(get_db)):
    job = job_service.get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job posting not found")
    return job

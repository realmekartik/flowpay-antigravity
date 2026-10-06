from sqlalchemy import Column, String, Float, Integer, ForeignKey, DateTime, Text, Enum, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base

class UserRole(str, enum.Enum):
    CLIENT = "CLIENT"
    FREELANCER = "FREELANCER"
    ADMIN = "ADMIN"

class JobStatus(str, enum.Enum):
    OPEN = "OPEN"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class MilestoneStatus(str, enum.Enum):
    PENDING = "PENDING"
    FUNDED = "FUNDED"
    SUBMITTED = "SUBMITTED"
    RELEASED = "RELEASED"
    DISPUTED = "DISPUTED"

class TransactionType(str, enum.Enum):
    DEPOSIT = "DEPOSIT"
    PAYOUT = "PAYOUT"
    REFUND = "REFUND"

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default=UserRole.FREELANCER.value)
    bio = Column(Text, nullable=True)
    skills = Column(JSON, default=list)  # List of skill strings
    hourly_rate = Column(Float, nullable=True)
    rating = Column(Float, default=5.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    jobs = relationship("Job", back_populates="client")
    proposals = relationship("Proposal", back_populates="freelancer")

class Job(Base):
    __tablename__ = "jobs"

    id = Column(String, primary_key=True, index=True)
    client_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    budget = Column(Float, nullable=False)
    status = Column(String, default=JobStatus.OPEN.value)
    skills_required = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

    client = relationship("User", back_populates="jobs")
    proposals = relationship("Proposal", back_populates="job")
    contracts = relationship("Contract", back_populates="job")

class Proposal(Base):
    __tablename__ = "proposals"

    id = Column(String, primary_key=True, index=True)
    job_id = Column(String, ForeignKey("jobs.id"), nullable=False)
    freelancer_id = Column(String, ForeignKey("users.id"), nullable=False)
    bid_amount = Column(Float, nullable=False)
    cover_letter = Column(Text, nullable=False)
    ai_match_score = Column(Float, default=0.0)
    ai_reasoning = Column(Text, nullable=True)
    status = Column(String, default="PENDING")  # PENDING, ACCEPTED, REJECTED
    created_at = Column(DateTime, default=datetime.utcnow)

    job = relationship("Job", back_populates="proposals")
    freelancer = relationship("User", back_populates="proposals")

class Contract(Base):
    __tablename__ = "contracts"

    id = Column(String, primary_key=True, index=True)
    job_id = Column(String, ForeignKey("jobs.id"), nullable=False)
    client_id = Column(String, ForeignKey("users.id"), nullable=False)
    freelancer_id = Column(String, ForeignKey("users.id"), nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String, default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)

    job = relationship("Job", back_populates="contracts")
    milestones = relationship("Milestone", back_populates="contract")

class Milestone(Base):
    __tablename__ = "milestones"

    id = Column(String, primary_key=True, index=True)
    contract_id = Column(String, ForeignKey("contracts.id"), nullable=False)
    title = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String, default=MilestoneStatus.PENDING.value)
    deliverable_note = Column(Text, nullable=True)
    deliverable_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    contract = relationship("Contract", back_populates="milestones")
    transactions = relationship("EscrowTransaction", back_populates="milestone")

class EscrowTransaction(Base):
    __tablename__ = "escrow_transactions"

    id = Column(String, primary_key=True, index=True)
    milestone_id = Column(String, ForeignKey("milestones.id"), nullable=False)
    amount = Column(Float, nullable=False)
    transaction_type = Column(String, nullable=False)  # DEPOSIT, PAYOUT, REFUND
    tx_hash = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    milestone = relationship("Milestone", back_populates="transactions")

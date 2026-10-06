import uuid
from datetime import datetime
from typing import Dict, Any
from sqlalchemy.orm import Session
from models import Milestone, MilestoneStatus, EscrowTransaction, TransactionType

class EscrowService:
    """
    Manages fund locks, deliverable milestone submissions, automated releases,
    and dispute holds on the FlowPay escrow vault.
    """

    @staticmethod
    def fund_milestone(db: Session, milestone_id: str, amount: float) -> Dict[str, Any]:
        milestone = db.query(Milestone).filter(Milestone.id == milestone_id).first()
        if not milestone:
            return {"success": False, "error": "Milestone not found"}

        milestone.status = MilestoneStatus.FUNDED.value

        tx_hash = f"0x{uuid.uuid4().hex[:16]}"
        escrow_tx = EscrowTransaction(
            id=f"tx_{uuid.uuid4().hex[:8]}",
            milestone_id=milestone.id,
            amount=amount,
            transaction_type=TransactionType.DEPOSIT.value,
            tx_hash=tx_hash,
            timestamp=datetime.utcnow()
        )
        db.add(escrow_tx)
        db.commit()
        db.refresh(milestone)

        return {
            "success": True,
            "status": milestone.status,
            "tx_hash": tx_hash,
            "message": f"Successfully locked ${amount:.2f} into Escrow Vault"
        }

    @staticmethod
    def submit_deliverable(db: Session, milestone_id: str, deliverable_note: str, deliverable_url: str) -> Dict[str, Any]:
        milestone = db.query(Milestone).filter(Milestone.id == milestone_id).first()
        if not milestone:
            return {"success": False, "error": "Milestone not found"}

        milestone.status = MilestoneStatus.SUBMITTED.value
        milestone.deliverable_note = deliverable_note
        milestone.deliverable_url = deliverable_url
        db.commit()
        db.refresh(milestone)

        return {
            "success": True,
            "status": milestone.status,
            "message": "Deliverable submitted successfully. Awaiting client approval / AI audit."
        }

    @staticmethod
    def release_funds(db: Session, milestone_id: str) -> Dict[str, Any]:
        milestone = db.query(Milestone).filter(Milestone.id == milestone_id).first()
        if not milestone:
            return {"success": False, "error": "Milestone not found"}

        milestone.status = MilestoneStatus.RELEASED.value

        tx_hash = f"0x{uuid.uuid4().hex[:16]}"
        escrow_tx = EscrowTransaction(
            id=f"tx_{uuid.uuid4().hex[:8]}",
            milestone_id=milestone.id,
            amount=milestone.amount,
            transaction_type=TransactionType.PAYOUT.value,
            tx_hash=tx_hash,
            timestamp=datetime.utcnow()
        )
        db.add(escrow_tx)
        db.commit()
        db.refresh(milestone)

        return {
            "success": True,
            "status": milestone.status,
            "tx_hash": tx_hash,
            "message": f"Escrow released! ${milestone.amount:.2f} transferred to freelancer wallet."
        }

escrow_service = EscrowService()

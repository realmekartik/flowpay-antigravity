from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models import Milestone
from schemas import (
    FundMilestoneRequest,
    SubmitDeliverableRequest,
    ReleaseEscrowRequest,
    MilestoneResponse,
    CreatePayPalOrderRequest,
    CapturePayPalOrderRequest,
    PayPalPayoutRequest
)
from services.escrow_service import escrow_service
from services.paypal_service import paypal_service
from config import settings

router = APIRouter(prefix="/escrow", tags=["Smart Escrow Vault & PayPal"])

@router.get("/milestones", response_model=List[MilestoneResponse])
def get_all_milestones(db: Session = Depends(get_db)):
    """Fetch list of contract milestones in escrow."""
    return db.query(Milestone).all()

@router.get("/paypal/config")
def get_paypal_config():
    """Returns PayPal mode and public client ID for frontend SDK rendering."""
    return {
        "mode": settings.PAYPAL_MODE,
        "client_id": settings.PAYPAL_CLIENT_ID or "PAYPAL_SANDBOX_PUBLIC_CLIENT_ID",
        "currency": "USD"
    }

@router.post("/fund")
def fund_milestone(req: FundMilestoneRequest, db: Session = Depends(get_db)):
    result = escrow_service.fund_milestone(db, req.milestone_id, req.amount)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error"))
    return result

@router.post("/paypal/create-order")
async def create_paypal_checkout_order(req: CreatePayPalOrderRequest):
    """Creates a PayPal Checkout Order (intent: CAPTURE) for milestone funding."""
    result = await paypal_service.create_checkout_order(
        amount=req.amount,
        currency=req.currency,
        custom_id=req.milestone_id
    )
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error"))
    return result

@router.post("/paypal/capture-order")
async def capture_paypal_checkout_order(req: CapturePayPalOrderRequest, db: Session = Depends(get_db)):
    """Captures an approved PayPal Checkout Order and updates milestone vault status to FUNDED."""
    capture_res = await paypal_service.capture_checkout_order(req.order_id)
    if not capture_res.get("success"):
        raise HTTPException(status_code=400, detail=capture_res.get("error"))

    # Update DB milestone escrow status
    fund_res = escrow_service.fund_milestone(db, req.milestone_id, amount=0.0)
    return {
        "success": True,
        "paypal_capture": capture_res,
        "escrow_vault": fund_res
    }

@router.post("/submit")
def submit_deliverable(req: SubmitDeliverableRequest, db: Session = Depends(get_db)):
    result = escrow_service.submit_deliverable(db, req.milestone_id, req.deliverable_note, req.deliverable_url)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error"))
    return result

@router.post("/release")
def release_escrow(req: ReleaseEscrowRequest, db: Session = Depends(get_db)):
    result = escrow_service.release_funds(db, req.milestone_id)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error"))
    return result

@router.post("/paypal/payout")
async def execute_paypal_payout(req: PayPalPayoutRequest, db: Session = Depends(get_db)):
    """Executes a PayPal Batch Payout to freelancer's wallet and releases milestone funds."""
    payout_res = await paypal_service.create_batch_payout(
        receiver_email=req.receiver_email,
        amount=req.amount,
        currency=req.currency,
        note=f"FlowPay Milestone Release for {req.milestone_id}"
    )
    if not payout_res.get("success"):
        raise HTTPException(status_code=400, detail=payout_res.get("error"))

    release_res = escrow_service.release_funds(db, req.milestone_id)
    return {
        "success": True,
        "paypal_payout": payout_res,
        "escrow_vault": release_res
    }

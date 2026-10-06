from fastapi import APIRouter, Request, Header, HTTPException, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from services.paypal_service import paypal_security_service
from services.escrow_service import escrow_service
import logging

logger = logging.getLogger("flowpay.webhooks")
router = APIRouter(prefix="/webhooks", tags=["Secure Webhooks & Payments"])

@router.post("/paypal")
async def handle_paypal_webhook(
    request: Request,
    paypal_transmission_id: str = Header(None, alias="PAYPAL-TRANSMISSION-ID"),
    paypal_transmission_time: str = Header(None, alias="PAYPAL-TRANSMISSION-TIME"),
    paypal_transmission_sig: str = Header(None, alias="PAYPAL-TRANSMISSION-SIG"),
    paypal_cert_url: str = Header(None, alias="PAYPAL-CERT-URL"),
    paypal_auth_algo: str = Header(None, alias="PAYPAL-AUTH-ALGO"),
    db: Session = Depends(get_db)
):
    """
    Secure Webhook Handler for PayPal Escrow Payments.
    1. Validates presence of PayPal signature headers.
    2. Verifies cryptographic signature against PayPal notification API.
    3. Enforces idempotency against replay attacks via transmission_id tracking.
    4. Safely updates milestone escrow vault state upon verified payment capture.
    """
    if not paypal_transmission_id or not paypal_transmission_sig:
        logger.warning("Rejecting PayPal webhook call due to missing security headers.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing PayPal security verification headers."
        )

    try:
        body_json = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON webhook payload.")

    # 1. Cryptographic Signature & Replay Attack Verification
    is_valid = await paypal_security_service.verify_webhook_signature(
        transmission_id=paypal_transmission_id,
        transmission_time=paypal_transmission_time or "",
        transmission_sig=paypal_transmission_sig,
        cert_url=paypal_cert_url or "",
        auth_algo=paypal_auth_algo or "",
        webhook_body=body_json
    )

    if not is_valid:
        logger.error(f"PayPal Webhook signature verification FAILED for transmission_id: {paypal_transmission_id}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="PayPal cryptographic signature verification failed or replay attack detected."
        )

    # 2. Process Webhook Event Type
    event_type = body_json.get("event_type")
    resource = body_json.get("resource", {})
    logger.info(f"Verified PayPal Webhook Event received: {event_type}")

    if event_type == "PAYMENT.CAPTURE.COMPLETED":
        # Capture completed -> Lock milestone escrow vault
        custom_id = resource.get("custom_id") or resource.get("invoice_id")
        amount_val = float(resource.get("amount", {}).get("value", 0.0))
        if custom_id:
            logger.info(f"Locking milestone {custom_id} for verified amount ${amount_val}")
            escrow_service.fund_milestone(db, milestone_id=custom_id, amount=amount_val)

    elif event_type == "CHECKOUT.ORDER.APPROVED":
        logger.info("Checkout order approved by client. Awaiting capture.")

    elif event_type == "PAYMENT.CAPTURE.DENIED":
        logger.warning("Payment capture denied by processor.")

    return {
        "status": "success",
        "event_type": event_type,
        "transmission_id": paypal_transmission_id,
        "verified": True
    }

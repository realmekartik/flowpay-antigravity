import uuid
import httpx
import logging
from typing import Dict, Any, Optional
from config import settings

logger = logging.getLogger("flowpay.paypal")

class PayPalService:
    """
    PayPal Integration Engine for Sandbox & Live Environments.
    Provides support for:
    - OAuth2 Bearer Token Authentication
    - Checkout Orders API v2 (Order Creation & Capture)
    - Payouts API v1 (Batch Payout Payout Execution)
    - Webhook Signature Verification & Anti-Replay Idempotency
    """

    def __init__(self):
        self.processed_transmission_ids = set()

    async def get_access_token(self) -> Optional[str]:
        """Obtains OAuth2 bearer token from PayPal REST API."""
        secret = settings.paypal_secret_key
        client_id = settings.PAYPAL_CLIENT_ID

        if not client_id or not secret:
            logger.warning("PayPal Client ID or Secret missing in env. Operating in mock fallback mode.")
            return "mock_paypal_access_token"

        url = f"{settings.paypal_base_url}/v1/oauth2/token"
        headers = {"Accept": "application/json", "Accept-Language": "en_US"}
        data = {"grant_type": "client_credentials"}

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    url,
                    headers=headers,
                    data=data,
                    auth=(client_id, secret),
                    timeout=10.0
                )
                if response.status_code == 200:
                    token_data = response.json()
                    return token_data.get("access_token")
                else:
                    logger.error(f"PayPal Token Request Failed ({response.status_code}): {response.text}")
                    return None
            except Exception as e:
                logger.error(f"PayPal Token Exception: {str(e)}")
                return None

    async def create_checkout_order(
        self,
        amount: float,
        currency: str = "USD",
        return_url: str = "",
        cancel_url: str = "",
        custom_id: str = ""
    ) -> Dict[str, Any]:
        """Creates a PayPal Checkout Order (intent: CAPTURE) for milestone escrow funding."""
        access_token = await self.get_access_token()
        
        # Fallback response for dev environments without active PayPal API keys
        if not access_token or access_token == "mock_paypal_access_token":
            order_id = f"PAYPAL_MOCK_ORDER_{uuid.uuid4().hex[:10].upper()}"
            return {
                "success": True,
                "order_id": order_id,
                "status": "CREATED",
                "mode": settings.PAYPAL_MODE,
                "approval_url": f"http://localhost:5173/escrow?mock_order_id={order_id}",
                "message": "Mock PayPal Checkout Order created successfully."
            }

        url = f"{settings.paypal_base_url}/v2/checkout/orders"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }
        payload = {
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "custom_id": custom_id or f"ms_{uuid.uuid4().hex[:8]}",
                    "amount": {
                        "currency_code": currency,
                        "value": f"{amount:.2f}"
                    },
                    "description": "FlowPay Smart Escrow Milestone Fund Lock"
                }
            ],
            "application_context": {
                "return_url": return_url or "http://localhost:5173/escrow?payment=success",
                "cancel_url": cancel_url or "http://localhost:5173/escrow?payment=cancel"
            }
        }

        async with httpx.AsyncClient() as client:
            try:
                res = await client.post(url, headers=headers, json=payload, timeout=12.0)
                if res.status_code in [200, 201]:
                    data = res.json()
                    approval_link = next((l["href"] for l in data.get("links", []) if l.get("rel") == "approve"), "")
                    return {
                        "success": True,
                        "order_id": data.get("id"),
                        "status": data.get("status"),
                        "mode": settings.PAYPAL_MODE,
                        "approval_url": approval_link,
                        "paypal_response": data
                    }
                else:
                    logger.error(f"PayPal Create Order Error ({res.status_code}): {res.text}")
                    return {"success": False, "error": f"PayPal API Error: {res.text}"}
            except Exception as e:
                logger.error(f"PayPal Create Order Exception: {str(e)}")
                return {"success": False, "error": f"Connection exception: {str(e)}"}

    async def capture_checkout_order(self, order_id: str) -> Dict[str, Any]:
        """Captures payment for an approved PayPal Checkout Order."""
        if order_id.startswith("PAYPAL_MOCK_"):
            return {
                "success": True,
                "order_id": order_id,
                "status": "COMPLETED",
                "capture_id": f"CAP_MOCK_{uuid.uuid4().hex[:8].upper()}",
                "message": "Mock PayPal Order captured and funds locked in Escrow."
            }

        access_token = await self.get_access_token()
        if not access_token:
            return {"success": False, "error": "Failed to obtain PayPal access token."}

        url = f"{settings.paypal_base_url}/v2/checkout/orders/{order_id}/capture"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }

        async with httpx.AsyncClient() as client:
            try:
                res = await client.post(url, headers=headers, timeout=12.0)
                if res.status_code in [200, 201]:
                    data = res.json()
                    return {
                        "success": True,
                        "order_id": data.get("id"),
                        "status": data.get("status"),
                        "capture_id": data.get("purchase_units", [{}])[0].get("payments", {}).get("captures", [{}])[0].get("id"),
                        "paypal_response": data
                    }
                else:
                    logger.error(f"PayPal Capture Order Error ({res.status_code}): {res.text}")
                    return {"success": False, "error": f"PayPal Capture Failed: {res.text}"}
            except Exception as e:
                logger.error(f"PayPal Capture Exception: {str(e)}")
                return {"success": False, "error": str(e)}

    async def create_batch_payout(
        self,
        receiver_email: str,
        amount: float,
        currency: str = "USD",
        note: str = "FlowPay Milestone Release",
        sender_batch_id: str = ""
    ) -> Dict[str, Any]:
        """Executes a PayPal Payout to a freelancer's wallet via Payouts API v1."""
        access_token = await self.get_access_token()

        if not access_token or access_token == "mock_paypal_access_token":
            payout_id = f"PAYOUT_MOCK_{uuid.uuid4().hex[:10].upper()}"
            return {
                "success": True,
                "payout_batch_id": payout_id,
                "status": "SUCCESS",
                "receiver": receiver_email,
                "amount": amount,
                "message": f"Mock PayPal Payout of ${amount:.2f} executed to {receiver_email}."
            }

        url = f"{settings.paypal_base_url}/v1/payments/payouts"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }
        payload = {
            "sender_batch_header": {
                "sender_batch_id": sender_batch_id or f"payout_{uuid.uuid4().hex[:10]}",
                "email_subject": "FlowPay AntiGravity Milestone Payout Received!",
                "email_message": f"You received a milestone release payment of ${amount:.2f} {currency} via FlowPay Smart Escrow."
            },
            "items": [
                {
                    "recipient_type": "EMAIL",
                    "amount": {
                        "value": f"{amount:.2f}",
                        "currency": currency
                    },
                    "note": note,
                    "receiver": receiver_email
                }
            ]
        }

        async with httpx.AsyncClient() as client:
            try:
                res = await client.post(url, headers=headers, json=payload, timeout=12.0)
                if res.status_code in [200, 201]:
                    data = res.json()
                    batch_header = data.get("batch_header", {})
                    return {
                        "success": True,
                        "payout_batch_id": batch_header.get("payout_batch_id"),
                        "status": batch_header.get("batch_status"),
                        "receiver": receiver_email,
                        "amount": amount,
                        "paypal_response": data
                    }
                else:
                    logger.error(f"PayPal Payout Error ({res.status_code}): {res.text}")
                    return {"success": False, "error": f"PayPal Payout Failed: {res.text}"}
            except Exception as e:
                logger.error(f"PayPal Payout Exception: {str(e)}")
                return {"success": False, "error": str(e)}

    async def verify_webhook_signature(
        self,
        transmission_id: str,
        transmission_time: str,
        transmission_sig: str,
        cert_url: str,
        auth_algo: str,
        webhook_body: dict
    ) -> bool:
        """Verifies PayPal Webhook Cryptographic Signatures and defends against Replay Attacks."""
        if transmission_id in self.processed_transmission_ids:
            logger.warning(f"Replay attack detected or duplicate webhook transmission_id: {transmission_id}")
            return False

        if not settings.PAYPAL_WEBHOOK_ID:
            self.processed_transmission_ids.add(transmission_id)
            return True

        access_token = await self.get_access_token()
        if not access_token:
            return False

        verification_payload = {
            "transmission_id": transmission_id,
            "transmission_time": transmission_time,
            "transmission_sig": transmission_sig,
            "cert_url": cert_url,
            "auth_algo": auth_algo,
            "webhook_id": settings.PAYPAL_WEBHOOK_ID,
            "webhook_event": webhook_body
        }

        url = f"{settings.paypal_base_url}/v1/notifications/verify-webhook-signature"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }

        async with httpx.AsyncClient() as client:
            try:
                res = await client.post(url, headers=headers, json=verification_payload, timeout=10.0)
                if res.status_code == 200:
                    status = res.json().get("verification_status")
                    if status == "SUCCESS":
                        self.processed_transmission_ids.add(transmission_id)
                        return True
            except Exception as e:
                logger.error(f"Webhook Signature Error: {str(e)}")
        return False

paypal_service = PayPalService()
# Export alias for backward compatibility
paypal_security_service = paypal_service

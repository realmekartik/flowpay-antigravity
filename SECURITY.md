# 🔒 Security Policy & Specifications - FlowPay (AntiGravity)

> **Version:** 1.0.0  
> **Last Updated:** October 2026  
> **Status:** Enterprise Production-Ready Security Specification

---

## 📋 Executive Security Summary

FlowPay (AntiGravity) is an AI-powered freelance marketplace and smart escrow platform processing financial transactions and candidate matching. Security is implemented natively at every layer:

- **Credential Hygiene:** Zero-hardcoding policy with environment variable isolation.
- **Financial Integrity:** PayPal Webhook cryptographic signature verification and anti-replay idempotency enforcement.
- **AI & Input Defense:** Automated XSS/Script sanitization, prompt injection defenses, and sliding-window rate limiting.
- **Access Control:** JWT stateful authentication with role-based authorization (`CLIENT`, `FREELANCER`, `ADMIN`).

---

## 🔑 1. API Key & Secret Management

### 1.1 Zero-Hardcoding Enforcement
- **No Plaintext Secrets:** API keys (Gemini AI, PayPal Client Secret, JWT Signing Keys) must **NEVER** be committed to source control or hardcoded in codebase files.
- **Git Ignore Policy:** `.env` and `.env.local` files are strictly excluded via `.gitignore`.
- **Environment Template:** All environment key names are documented in `.env.example` using placeholder values (`your_gemini_api_key_here`).

### 1.2 FastAPI Backend Configuration (`backend/config.py`)
- Secrets are dynamically loaded into FastAPI via Pydantic `BaseSettings` reading from environment variables / `.env`:
  ```python
  from pydantic_settings import BaseSettings

  class Settings(BaseSettings):
      SECRET_KEY: str
      GEMINI_API_KEY: str
      PAYPAL_CLIENT_ID: str
      PAYPAL_CLIENT_SECRET: str
      PAYPAL_WEBHOOK_ID: str
      
      class Config:
          env_file = ".env"
  ```

### 1.3 React Frontend Bundle Isolation (`frontend/.env`)
- **Vite Prefix Isolation:** In Vite React applications, **ONLY** variables prefixed with `VITE_` are embedded into the client-side JavaScript bundle.
- **Prohibited Frontend Keys:**
  - ❌ `PAYPAL_CLIENT_SECRET` (Must **NEVER** be exposed to frontend)
  - ❌ `GEMINI_API_KEY` (Must **NEVER** be exposed to frontend)
  - ❌ `SECRET_KEY` (JWT secret must **NEVER** be exposed to frontend)
- **Allowed Frontend Keys:**
  - ✅ `VITE_API_BASE_URL` (`http://localhost:8000/api/v1`)
  - ✅ `VITE_PAYPAL_CLIENT_ID` (Public Client ID for rendering PayPal SDK buttons)

---

## 💳 2. Secure Webhook & Payment Handling (PayPal Escrow)

### 2.1 Cryptographic Signature Verification
When PayPal notifies FlowPay of payment events (e.g., `PAYMENT.CAPTURE.COMPLETED`), the webhook endpoint (`POST /api/v1/webhooks/paypal`) verifies authenticity before modifying escrow balances.

1. **Header Extraction:** Extracts required cryptographic headers:
   - `PAYPAL-TRANSMISSION-ID`
   - `PAYPAL-TRANSMISSION-TIME`
   - `PAYPAL-TRANSMISSION-SIG`
   - `PAYPAL-CERT-URL`
   - `PAYPAL-AUTH-ALGO`
2. **PayPal Verification API Call:** The backend queries PayPal's `/v1/notifications/verify-webhook-signature` endpoint passing the webhook event body, certificate URL, and platform `PAYPAL_WEBHOOK_ID`.
3. **Signature Rejection:** If PayPal returns any status other than `SUCCESS`, the request is immediately rejected with HTTP `401 Unauthorized`.

### 2.2 Replay Attack & Idempotency Mitigation
To prevent malicious attackers from replaying intercepted webhook payloads to duplicate escrow milestone payouts:
- **Transmission ID Tracking:** Each incoming `PAYPAL-TRANSMISSION-ID` is verified against an idempotency store (`paypal_security_service.processed_transmission_ids`).
- **Duplicate Prevention:** If a `transmission_id` has already been processed, subsequent attempts are blocked immediately.

```
Incoming Webhook Request
           │
           ▼
[ Extract Security Headers ] ──( Missing? )──> HTTP 400 Bad Request
           │
           ▼
[ Idempotency Transmission Check ] ──( Duplicate? )──> Blocked (Replay Attack)
           │
           ▼
[ PayPal Signature Verification ] ──( Invalid? )──> HTTP 401 Unauthorized
           │
           ▼
[ Lock/Release Escrow Vault ]
```

---

## 🛡️ 3. Input Sanitization & Prompt Injection Defenses

### 3.1 XSS & Script Injection Prevention
All incoming JSON payloads (`JobCreate`, `ProposalCreate`, `SubmitDeliverableRequest`) are automatically sanitized using custom Pydantic validators (`backend/schemas.py`):
- HTML `<script>` tags, inline event handlers (`onload=`, `onerror=`), and raw markup are automatically stripped out.
- Parameterized SQLAlchemy ORM queries defend against SQL Injection.

### 3.2 Prompt Injection Neutralization
To prevent malicious users from crafting proposals or job descriptions that manipulate AI candidate matching algorithms:
- **Regex Filter:** Strings containing override phrases such as `"Ignore previous instructions"` or `"SYSTEM PROMPT:"` are automatically sanitized into `"[redacted instruction override]"` before being passed to AI LLM prompts.
- **Length Boundaries:** Field lengths are strictly bounded (e.g., job titles max 150 chars, cover letters max 3000 chars) to prevent context buffer overflow attacks.

---

## ⏱️ 4. Rate Limiting & Denial of Service (DoS) Protection

To safeguard AI API key quotas and protect application servers from abusive bot traffic:

### 4.1 Rate Limit Tiers (`backend/services/rate_limiter.py`)
- **AI Endpoints (`/api/v1/ai/match-candidate`):** Restricted to **10 Requests Per Minute (RPM)** per client IP address.
- **General API Endpoints (`/api/v1/jobs`, `/api/v1/proposals`):** Restricted to **60 Requests Per Minute (RPM)** per client IP address.

### 4.2 HTTP 429 Response Protocol
When a client exceeds the allocated rate limit threshold, FastAPI returns an explicit `429 Too Many Requests` status along with a `Retry-After` header indicating the required cooldown duration in seconds:

```json
{
  "detail": "Rate limit exceeded. Maximum 10 requests per 60s allowed."
}
```

---

## 🔐 5. Authentication & Access Control (RBAC)

- **JWT Tokens:** Signed using `HS256` or `RS256` with strict expiration windows (`1440` minutes).
- **Password Hashing:** Passwords are hashed using `bcrypt` / `argon2` before storage.
- **Role Enforcement:**
  - `CLIENT`: Authorized to create jobs, fund milestones, and release escrow payouts.
  - `FREELANCER`: Authorized to browse jobs, submit proposals, and submit work deliverables.

---

## 📑 6. Developer Security Audit Checklist

Before deploying changes to staging or production, developers must execute:

- [ ] Run `python -m pytest` to verify security tests.
- [ ] Run `npm run build` to confirm zero client-side secret exposure in Vite bundles.
- [ ] Verify `.env` is listed in `.gitignore`.
- [ ] Ensure all new API endpoints include proper input schemas and rate limiting dependencies.
- [ ] Test PayPal webhook verification against Sandbox test vectors.

---

## ⚠️ 7. Vulnerability Disclosure Policy

If you discover a security vulnerability in FlowPay (AntiGravity):

1. **Do NOT file a public issue on GitHub.**
2. Report the vulnerability to `security@flowpay-antigravity.io`.
3. Include reproduction steps, environment details, and proof of concept.

Our security team will acknowledge reports within **24 hours** and provide regular remediation updates.

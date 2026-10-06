<div align="center">

# ⚡ FlowPay (AntiGravity)

### *Defying freelance friction through AI-driven milestones & instant PayPal payouts.*

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini API](https://img.shields.io/badge/Google_Gemini_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![PayPal SDK](https://img.shields.io/badge/PayPal_REST_API-003087?style=for-the-badge&logo=paypal&logoColor=white)](https://developer.paypal.com/)
[![Python](https://img.shields.io/badge/Python_3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Vite](https://img.shields.io/badge/Vite_Build-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

[Features Matrix](#-zero-gravity-features-matrix) • [Quick Start](#-quick-start-guide) • [Architecture](#-architecture-overview) • [API Specs](#-api-endpoint-reference) • [Security](#-security--fraud-defenses)

---

</div>

## 🌌 Overview

**FlowPay (AntiGravity)** is a next-generation AI-powered freelance marketplace and smart escrow protocol engineered to eliminate platform friction, high dispute fees, and payment delays. 

By combining **Google Gemini AI semantic candidate matching**, **automated deliverable code auditing**, and **PayPal Sandbox/Live milestone escrow vaults**, FlowPay creates a trustless, zero-gravity ecosystem for global developers and clients.

```
       CLIENT                           FLOWPAY ENGINE                        FREELANCER
  ┌──────────────┐                 ┌──────────────────────┐                ┌──────────────┐
  │ Post Job     │ ──────────────> │ Gemini Skill Matcher │ <───────────── │ Submit Bid   │
  └──────────────┘                 └──────────────────────┘                └──────────────┘
         │                                    │                                   │
         ▼                                    ▼                                   ▼
  ┌──────────────┐                 ┌──────────────────────┐                ┌──────────────┐
  │ PayPal Lock  │ ──────────────> │ Smart Escrow Vault   │ ─────────────> │ Deliver PR   │
  └──────────────┘                 └──────────────────────┘                └──────────────┘
                                              │
                                              ▼ (AI Code Audit Pass)
                                   ┌──────────────────────┐
                                   │ Instant PayPal Payout│
                                   └──────────────────────┘
```

---

## ⚡ Zero-Gravity Features Matrix

| Feature | Legacy Freelance Platforms (Upwork/Fiverr) | ⚡ FlowPay (AntiGravity) Engine |
| :--- | :--- | :--- |
| **Candidate Matching** | Keyword search & manual resume review (Hours/Days) | **Gemini AI Semantic Compatibility Scoring** (0.2s) |
| **Escrow Security** | High commission fees (20%) & 14-day hold periods | **Milestone-Locked Vaults** with zero holding latency |
| **Deliverable Review** | Manual client check, high risk of dispute abuse | **Automated AI Deliverable & Code Audit** |
| **Payment Execution** | Slow manual payouts with high withdrawal fees | **Instant PayPal Orders & Batch Payouts API** |
| **System Resilience** | Monolithic server single-point of failure | **Heuristic Fallback Engine** during rate limits |
| **Security Standard** | Standard cookie sessions | **HMAC-SHA256 Cryptographic Webhooks & Idempotency** |

---

## 🛠️ System Architecture

FlowPay relies on an enterprise **3-Tier Architecture**:
1. **Presentation Tier:** React 18 SPA built with Vite, Tailwind CSS v4, Lucide icons, and interactive Client, Freelancer, and Escrow Control Dashboards.
2. **Application Tier:** FastAPI REST backend powered by Pydantic v2 validation, SQLAlchemy ORM, sliding-window rate limiting (10 RPM AI / 60 RPM API), and security HTTP headers.
3. **Intelligence & Financial Tier:** Dual engines incorporating Google Gemini LLM candidate matchers and PayPal REST API v2 Sandbox/Live payment vaults with cryptographic signature verification.

For architectural diagrams and sequence flows, inspect [`ARCHITECTURE.md`](file:///c:/Users/ritka/Downloads/Flowpay%20ai/ARCHITECTURE.md) and [`docs/ARCHITECTURE_DIAGRAMS.md`](file:///c:/Users/ritka/Downloads/Flowpay%20ai/docs/ARCHITECTURE_DIAGRAMS.md).

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm 9+**

### 1. Clone & Set Up Environment
```bash
git clone https://github.com/your-org/flowpay-antigravity.git
cd flowpay-antigravity

# Create root environment file
cp .env.example .env
```

### 2. Launch FastAPI Backend
```bash
cd backend

# Create & activate Python virtual environment
python -m venv venv

# On Windows (PowerShell):
.\venv\Scripts\activate
# On Linux / macOS:
source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Start FastAPI development server
uvicorn main:app --reload --port 8000
```
- **Backend Server:** [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Launch React Frontend
Open a new terminal window:
```bash
cd frontend

# Install Node dependencies
npm install

# Start Vite React development server
npm run dev
```
- **Frontend App:** [http://localhost:5173](http://localhost:5173)

---

## 🔐 Environment Configuration Guide

Map your credentials in `.env` as defined in [`.env.example`](file:///c:/Users/ritka/Downloads/Flowpay%20ai/.env.example):

| Variable Name | Environment Scope | Description |
| :--- | :--- | :--- |
| `SECRET_KEY` | Backend Only | 32-character JWT signing key |
| `GEMINI_API_KEY` | Backend Only | Google Gemini API Key for semantic matching |
| `PAYPAL_MODE` | Backend Only | Payment environment mode (`sandbox` or `live`) |
| `PAYPAL_CLIENT_ID` | Backend Only | PayPal REST API Client ID |
| `PAYPAL_CLIENT_SECRET` | Backend Only | PayPal REST API Client Secret |
| `PAYPAL_WEBHOOK_ID` | Backend Only | PayPal Webhook ID for HMAC signature verification |
| `RATE_LIMIT_AI_RPM` | Backend Only | Max AI request limit per minute (Default: `10`) |
| `VITE_API_BASE_URL` | Frontend Public | REST API base path (`http://localhost:8000/api/v1`) |
| `VITE_PAYPAL_CLIENT_ID`| Frontend Public | Public PayPal Client ID for JS SDK buttons |

---

## 🔌 API Endpoint Reference

| Method | Endpoint Path | Rate Limit | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Unrestricted | System health & DB connection status |
| `POST` | `/api/v1/auth/register` | 60 RPM | User registration (`CLIENT` / `FREELANCER`) |
| `POST` | `/api/v1/auth/login` | 60 RPM | Authenticate user & issue JWT bearer token |
| `GET` | `/api/v1/jobs` | 60 RPM | List active marketplace job postings |
| `POST` | `/api/v1/jobs` | 60 RPM | Create a new job posting with tech stack tags |
| `POST` | `/api/v1/proposals` | 60 RPM | Submit proposal & auto-trigger AI candidate match |
| `POST` | `/api/v1/ai/match-candidate` | **10 RPM** | Evaluate candidate AI compatibility score |
| `GET` | `/api/v1/escrow/milestones` | 60 RPM | Fetch contract milestones in escrow |
| `GET` | `/api/v1/escrow/paypal/config` | 60 RPM | Returns PayPal mode & public Client ID |
| `POST` | `/api/v1/escrow/paypal/create-order` | 60 RPM | Generates PayPal Checkout Order (`intent: CAPTURE`) |
| `POST` | `/api/v1/escrow/paypal/capture-order` | 60 RPM | Captures PayPal payment & locks funds in vault |
| `POST` | `/api/v1/escrow/paypal/payout` | 60 RPM | Executes PayPal Batch Payout to freelancer |
| `POST` | `/api/v1/webhooks/paypal` | Unrestricted | Verifies PayPal webhook signatures & idempotency |

---

## 🔒 Security & Resilience Highlights

1. **Zero Client Secret Exposure:** All PayPal Secrets and Gemini Keys are kept strictly inside the FastAPI backend container.
2. **Cryptographic Webhook Verification:** Uses PayPal's `/v1/notifications/verify-webhook-signature` REST endpoint to validate incoming payment events.
3. **Replay Attack Defense:** Tracks `PAYPAL-TRANSMISSION-ID` to guarantee idempotency.
4. **Heuristic Rate-Limit Fallback:** If Gemini API experiences rate limits (HTTP 429), the engine shifts to a deterministic skill-set algorithm seamlessly without throwing HTTP 500 errors.
5. **Input Sanitization:** Automated Pydantic field filters neutralize XSS tags and prompt injection attacks.

For detailed security guidelines, refer to [`SECURITY.md`](file:///c:/Users/ritka/Downloads/Flowpay%20ai/SECURITY.md).

---

## 🏆 Hackathon Submission & Team Credits

- **Hackathon Track:** AI + Fintech & Smart Escrow Protocols
- **Project Name:** FlowPay (AntiGravity)
- **Status:** Complete MVP & Production Architecture Specification

Built with ⚡ for the **AntiGravity AI & Web3 Hackathon**.

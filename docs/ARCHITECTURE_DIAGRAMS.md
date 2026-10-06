# FlowPay (AntiGravity) - Architecture Diagrams

This document contains visual diagrams illustrating the core workflows in FlowPay (AntiGravity).

---

## 1. AI Talent Matching & Proposal Flow

```mermaid
sequenceDiagram
    autonumber
    actor Client
    actor Freelancer
    participant Frontend as React App
    participant API as FastAPI Backend
    participant AIMatcher as AI Engine
    participant DB as SQLite/PostgreSQL

    Client->>Frontend: Post Job (Title, Budget, Stack)
    Frontend->>API: POST /api/v1/jobs
    API->>DB: Save Job (Status: OPEN)
    API-->>Frontend: Job Created Response

    Freelancer->>Frontend: Submit Proposal
    Frontend->>API: POST /api/v1/proposals
    API->>AIMatcher: Analyze Compatibility (Job vs Freelancer)
    AIMatcher-->>API: Match Score (88%) + AI Insights
    API->>DB: Save Proposal (Match Score & Insights)
    API-->>Frontend: Proposal Submitted Successfully

    Client->>Frontend: View Job Proposals
    Frontend->>API: GET /api/v1/jobs/{id}/proposals
    API-->>Frontend: List Proposals Ranked by AI Match Score
```

---

## 2. Automated Smart Escrow & Milestone Life Cycle

```mermaid
stateDiagram-v2
    [*] --> PENDING: Milestone Created
    PENDING --> FUNDED: Client Deposits Funds into Escrow Vault
    FUNDED --> SUBMITTED: Freelancer Submits Deliverable & Proof
    
    state SUBMITTED {
        [*] --> AI_AUDIT: Deliverable Scan
        AI_AUDIT --> PASSED: Quality & Spec Met
        AI_AUDIT --> MANUAL_REVIEW: Flagged Issues
    }

    PASSED --> RELEASED: Client Approves / Auto-Release Triggered
    MANUAL_REVIEW --> RELEASED: Client Approves
    MANUAL_REVIEW --> DISPUTED: Client Rejects Submission

    DISPUTED --> REFUNDED: Dispute Resolved in Client Favor
    DISPUTED --> RELEASED: Dispute Resolved in Freelancer Favor

    RELEASED --> [*]: Funds Transferred to Freelancer Wallet
    REFUNDED --> [*]: Funds Returned to Client Wallet
```

---

## 3. High-Level System Architecture

```mermaid
flowchart TB
    subgraph Client Layer
        UI[React + Tailwind Frontend]
    end

    subgraph API Layer
        FastAPI[FastAPI Server - main.py]
        Auth[Auth Router & JWT]
        Jobs[Jobs Router]
        Escrow[Escrow Router]
        AI[AI Agent Router]
    end

    subgraph Business Logic & Storage
        AuthService[Auth Service]
        JobService[Job Service]
        EscrowService[Escrow Service]
        AIMatcher[AI Matcher Engine]
        DB[(SQLAlchemy Database)]
    end

    UI -->|REST API| FastAPI
    FastAPI --> Auth
    FastAPI --> Jobs
    FastAPI --> Escrow
    FastAPI --> AI

    Auth --> AuthService
    Jobs --> JobService
    Escrow --> EscrowService
    AI --> AIMatcher

    AuthService --> DB
    JobService --> DB
    EscrowService --> DB
    AIMatcher --> DB
```

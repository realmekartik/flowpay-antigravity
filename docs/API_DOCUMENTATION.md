# FlowPay (AntiGravity) - REST API Documentation

Base URL: `http://localhost:8000/api/v1`

---

## 🔐 Authentication Endpoints (`/auth`)

### `POST /auth/register`
Register a new user (Client or Freelancer).
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "full_name": "Jane Doe",
    "role": "FREELANCER",
    "skills": ["React", "Python", "FastAPI"]
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "id": "usr_987654",
    "email": "user@example.com",
    "full_name": "Jane Doe",
    "role": "FREELANCER"
  }
  ```

### `POST /auth/login`
Authenticate and obtain JWT bearer token.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1Ni...",
    "token_type": "bearer"
  }
  ```

---

## 💼 Jobs Endpoints (`/jobs`)

### `GET /jobs`
Fetch active jobs with optional filtering.
- **Query Params:** `skills` (optional string), `min_budget` (optional int)
- **Response (200 OK):** Array of Job objects.

### `POST /jobs`
Create a new job posting (Requires `CLIENT` role).
- **Request Body:**
  ```json
  {
    "title": "Build AI Analytics Dashboard",
    "description": "Looking for a fullstack developer to build a real-time dashboard...",
    "budget": 3500.0,
    "skills_required": ["React", "FastAPI", "Tailwind CSS"]
  }
  ```

---

## 📄 Proposal & AI Matching Endpoints (`/proposals` & `/ai`)

### `POST /proposals`
Submit a proposal for a job posting.
- **Request Body:**
  ```json
  {
    "job_id": "job_123",
    "bid_amount": 3200.0,
    "cover_letter": "I have extensive experience with FastAPI and React..."
  }
  ```

### `POST /ai/match-proposal`
Calculate AI compatibility score for a candidate proposal.
- **Response (200 OK):**
  ```json
  {
    "proposal_id": "prop_456",
    "ai_match_score": 92.5,
    "matching_skills": ["React", "FastAPI"],
    "missing_skills": [],
    "recommendation_summary": "Highly recommended. Candidate matches 100% of required tech stack."
  }
  ```

---

## 🔒 Escrow Endpoints (`/escrow`)

### `POST /escrow/fund`
Lock client funds into milestone escrow vault.
- **Request Body:**
  ```json
  {
    "milestone_id": "ms_789",
    "amount": 1500.0
  }
  ```

### `POST /escrow/release`
Release milestone funds to freelancer upon completion.
- **Request Body:**
  ```json
  {
    "milestone_id": "ms_789",
    "deliverable_url": "https://github.com/freelancer/repo-submission"
  }
  ```

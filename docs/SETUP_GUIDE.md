# FlowPay (AntiGravity) - Developer Setup & Installation Guide

Welcome to FlowPay (AntiGravity). This guide will help you quickly set up the full-stack application on your local machine.

---

## 📋 Prerequisites

Before starting, ensure you have the following installed on your system:
- **Python 3.10+** (`python --version`)
- **Node.js 18+** (`node --version`)
- **npm 9+** (`npm --version`)
- **Git** (`git --version`)

---

## 🛠️ 1. Cloning & Environment Setup

```bash
# Clone the repository
git clone https://github.com/your-org/flowpay-antigravity.git
cd flowpay-antigravity

# Create root environment file from template
cp .env.example .env
```

---

## 🐍 2. Backend Setup (FastAPI)

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   - **Windows:**
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```
   - **Linux / macOS:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install backend dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the FastAPI development server:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

5. **Verify backend installation:**
   - Open your browser to `http://localhost:8000`
   - Interactive Swagger API docs are available at `http://localhost:8000/docs`
   - Health check endpoint: `http://localhost:8000/api/v1/health`

---

## ⚛️ 3. Frontend Setup (React + Tailwind CSS)

1. **Open a new terminal window and navigate to `frontend/`:**
   ```bash
   cd frontend
   ```

2. **Install Node modules:**
   ```bash
   npm install
   ```

3. **Start the Vite development server:**
   ```bash
   npm run dev
   ```

4. **Verify frontend installation:**
   - Open your browser to `http://localhost:5173`
   - The interactive FlowPay dashboard should load with full support for Client, Freelancer, and Escrow views!

---

## 🧪 4. Testing & Verification

### Running Backend Tests
```bash
cd backend
pytest
```

### Building Frontend for Production
```bash
cd frontend
npm run build
```

---

## ❓ Troubleshooting

- **CORS Issues:** Verify `VITE_API_BASE_URL` in `frontend/.env` matches your backend address (`http://localhost:8000/api/v1`).
- **Database Errors:** SQLite is used by default for simple setup. Delete `backend/flowpay.db` to re-initialize schema cleanly.

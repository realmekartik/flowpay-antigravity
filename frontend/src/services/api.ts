import type { Job, Proposal, Milestone, AIMatchResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Initial Mock Data Fallbacks for standalone UI demo
const MOCK_JOBS: Job[] = [
  {
    id: 'job_001',
    client_id: 'usr_client_alpha',
    title: 'AI Code Reviewer & Security Escrow Integration',
    description: 'Looking for a Senior Fullstack Engineer to integrate Gemini API for automated code audit and smart milestone releases.',
    budget: 4500,
    status: 'OPEN',
    skills_required: ['React', 'FastAPI', 'Python', 'Tailwind CSS', 'Gemini API'],
    created_at: new Date().toISOString()
  },
  {
    id: 'job_002',
    client_id: 'usr_client_beta',
    title: 'DeFi Payment Gateway & Vault Contract Development',
    description: 'Build robust Rust/Solidity smart contracts for multi-sig escrow locks with instant micro-milestone settlements.',
    budget: 6800,
    status: 'OPEN',
    skills_required: ['Rust', 'Solidity', 'Web3', 'TypeScript'],
    created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'job_003',
    client_id: 'usr_client_gamma',
    title: 'High-Frequency Matching Engine Optimization',
    description: 'Optimize PostgreSQL & Redis caching layers for sub-10ms candidate match recommendation queries.',
    budget: 3200,
    status: 'OPEN',
    skills_required: ['PostgreSQL', 'Redis', 'Python', 'Docker'],
    created_at: new Date(Date.now() - 172800000).toISOString()
  }
];

const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 'prop_101',
    job_id: 'job_001',
    freelancer_id: 'usr_free_alex',
    freelancer_name: 'Alex Rivera (Senior AI Architect)',
    bid_amount: 4200,
    cover_letter: 'Built 12+ AI-powered web applications using FastAPI and React. Deep understanding of prompt engineering & vector embeddings.',
    ai_match_score: 96.4,
    ai_reasoning: 'Exceptional match! Candidate possesses 100% of required technical skills and prior experience building escrow systems.',
    status: 'PENDING',
    created_at: new Date().toISOString()
  },
  {
    id: 'prop_102',
    job_id: 'job_001',
    freelancer_id: 'usr_free_sarah',
    freelancer_name: 'Sarah Chen (Fullstack Engineer)',
    bid_amount: 4500,
    cover_letter: 'Specialized in modern glassmorphic React UIs and python microservices. Can deliver complete MVP in 2 weeks.',
    ai_match_score: 88.2,
    ai_reasoning: 'Strong technical fit with proven React and FastAPI experience.',
    status: 'PENDING',
    created_at: new Date().toISOString()
  }
];

const MOCK_MILESTONES: Milestone[] = [
  {
    id: 'ms_01',
    contract_id: 'cnt_01',
    title: 'Phase 1: Architecture & FastAPI API Setup',
    amount: 1500,
    status: 'RELEASED',
    deliverable_note: 'Initial FastAPI codebase with JWT auth and SQLite/Postgres schemas created.',
    deliverable_url: 'https://github.com/flowpay/backend/pull/1'
  },
  {
    id: 'ms_02',
    contract_id: 'cnt_01',
    title: 'Phase 2: React Glassmorphic UI & AI Engine Integration',
    amount: 1800,
    status: 'SUBMITTED',
    deliverable_note: 'Completed Vite+React dashboard with AI proposal scoring and escrow tracker.',
    deliverable_url: 'https://github.com/flowpay/frontend/pull/4'
  },
  {
    id: 'ms_03',
    contract_id: 'cnt_01',
    title: 'Phase 3: Security Hardening & Mainnet Escrow Lock',
    amount: 1200,
    status: 'FUNDED',
    deliverable_note: 'Pending deliverable submission by freelancer.',
    deliverable_url: ''
  }
];

export const apiService = {
  async getJobs(): Promise<Job[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/jobs`);
      if (res.ok) return await res.json();
    } catch {
      console.warn('Backend unavailable, using fallback mock jobs');
    }
    return MOCK_JOBS;
  },

  async createJob(jobData: { title: string; description: string; budget: number; skills_required: string[] }): Promise<Job> {
    try {
      const res = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });
      if (res.ok) return await res.json();
    } catch {
      console.warn('Backend unavailable, saving job to mock state');
    }
    const newJob: Job = {
      id: `job_${Date.now()}`,
      client_id: 'usr_demo_client',
      ...jobData,
      status: 'OPEN',
      created_at: new Date().toISOString()
    };
    MOCK_JOBS.unshift(newJob);
    return newJob;
  },

  async getProposalsForJob(jobId: string): Promise<Proposal[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/proposals/job/${jobId}`);
      if (res.ok) return await res.json();
    } catch {
      console.warn('Backend unavailable, returning mock proposals');
    }
    return MOCK_PROPOSALS.filter(p => p.job_id === jobId || jobId === 'all');
  },

  async submitProposal(proposalData: { job_id: string; bid_amount: number; cover_letter: string }): Promise<Proposal> {
    try {
      const res = await fetch(`${API_BASE_URL}/proposals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposalData)
      });
      if (res.ok) return await res.json();
    } catch {
      console.warn('Backend unavailable, creating local mock proposal');
    }
    const newProp: Proposal = {
      id: `prop_${Date.now()}`,
      freelancer_id: 'usr_free_current',
      freelancer_name: 'You (Current Freelancer Profile)',
      ai_match_score: 91.5,
      ai_reasoning: 'High match based on cover letter tech stack overlap.',
      status: 'PENDING',
      created_at: new Date().toISOString(),
      ...proposalData
    };
    MOCK_PROPOSALS.unshift(newProp);
    return newProp;
  },

  async getMilestones(): Promise<Milestone[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/escrow/milestones`);
      if (res.ok) return await res.json();
    } catch {
      console.warn('Backend unavailable, using mock milestones');
    }
    return MOCK_MILESTONES;
  },

  async fundMilestone(milestoneId: string, amount: number): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/escrow/fund`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestone_id: milestoneId, amount })
      });
      if (res.ok) return true;
    } catch {
      console.warn('Backend unavailable, updating local milestone status');
    }
    const ms = MOCK_MILESTONES.find(m => m.id === milestoneId);
    if (ms) ms.status = 'FUNDED';
    return true;
  },

  async getPayPalConfig(): Promise<{ mode: string; client_id: string; currency: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/escrow/paypal/config`);
      if (res.ok) return await res.json();
    } catch {
      console.warn('Backend unavailable, returning fallback PayPal config');
    }
    return { mode: 'sandbox', client_id: 'PAYPAL_SANDBOX_MOCK_CLIENT_ID', currency: 'USD' };
  },

  async createPayPalOrder(milestoneId: string, amount: number) {
    try {
      const res = await fetch(`${API_BASE_URL}/escrow/paypal/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestone_id: milestoneId, amount, currency: 'USD' })
      });
      if (res.ok) return await res.json();
    } catch {
      console.warn('Backend unavailable, returning mock PayPal order creation');
    }
    return {
      success: true,
      order_id: `PAYPAL_MOCK_${Date.now()}`,
      status: 'CREATED',
      approval_url: `http://localhost:5173/escrow?mock_order=${Date.now()}`
    };
  },

  async capturePayPalOrder(orderId: string, milestoneId: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/escrow/paypal/capture-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, milestone_id: milestoneId })
      });
      if (res.ok) return await res.json();
    } catch {
      console.warn('Backend unavailable, setting milestone status locally');
    }
    const ms = MOCK_MILESTONES.find(m => m.id === milestoneId);
    if (ms) ms.status = 'FUNDED';
    return { success: true, status: 'COMPLETED' };
  },

  async executePayPalPayout(milestoneId: string, receiverEmail: string, amount: number) {
    try {
      const res = await fetch(`${API_BASE_URL}/escrow/paypal/payout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestone_id: milestoneId, receiver_email: receiverEmail, amount, currency: 'USD' })
      });
      if (res.ok) return await res.json();
    } catch {
      console.warn('Backend unavailable, executing mock payout');
    }
    const ms = MOCK_MILESTONES.find(m => m.id === milestoneId);
    if (ms) ms.status = 'RELEASED';
    return { success: true, status: 'SUCCESS' };
  },

  async submitDeliverable(milestoneId: string, note: string, url: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/escrow/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestone_id: milestoneId, deliverable_note: note, deliverable_url: url })
      });
      if (res.ok) return true;
    } catch {
      console.warn('Backend unavailable, updating local milestone status');
    }
    const ms = MOCK_MILESTONES.find(m => m.id === milestoneId);
    if (ms) {
      ms.status = 'SUBMITTED';
      ms.deliverable_note = note;
      ms.deliverable_url = url;
    }
    return true;
  },

  async releaseEscrow(milestoneId: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/escrow/release`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestone_id: milestoneId })
      });
      if (res.ok) return true;
    } catch {
      console.warn('Backend unavailable, updating local milestone status');
    }
    const ms = MOCK_MILESTONES.find(m => m.id === milestoneId);
    if (ms) ms.status = 'RELEASED';
    return true;
  },

  async evaluateAIMatch(jobId: string, skills: string[], bio: string): Promise<AIMatchResult> {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/match-candidate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: jobId, freelancer_skills: skills, freelancer_bio: bio })
      });
      if (res.ok) return await res.json();
    } catch {
      console.warn('Backend unavailable, evaluating match locally');
    }
    return {
      job_id: jobId,
      ai_match_score: 94.2,
      matching_skills: skills.slice(0, 3),
      missing_skills: [],
      recommendation_summary: 'Top candidate match! Strong skill overlap and relevant domain experience.'
    };
  }
};

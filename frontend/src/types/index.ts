export type UserRole = 'CLIENT' | 'FREELANCER' | 'ADMIN';

export type JobStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type MilestoneStatus = 'PENDING' | 'FUNDED' | 'SUBMITTED' | 'RELEASED' | 'DISPUTED';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  bio?: string;
  skills: string[];
  hourly_rate?: number;
  rating: number;
}

export interface Job {
  id: string;
  client_id: string;
  title: string;
  description: string;
  budget: number;
  status: JobStatus;
  skills_required: string[];
  created_at: string;
}

export interface Proposal {
  id: string;
  job_id: string;
  freelancer_id: string;
  bid_amount: number;
  cover_letter: string;
  ai_match_score: number;
  ai_reasoning?: string;
  status: string;
  created_at: string;
  freelancer_name?: string;
}

export interface Milestone {
  id: string;
  contract_id: string;
  title: string;
  amount: number;
  status: MilestoneStatus;
  deliverable_note?: string;
  deliverable_url?: string;
}

export interface AIMatchResult {
  job_id: string;
  ai_match_score: number;
  matching_skills: string[];
  missing_skills: string[];
  recommendation_summary: string;
}

import React, { useState, useEffect } from 'react';
import type { Job, Proposal } from '../types';
import { apiService } from '../services/api';
import { Briefcase, Sparkles, Plus, Users, CheckCircle } from 'lucide-react';

interface ClientDashboardProps {
  onPostJobClick: () => void;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ onPostJobClick }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('job_001');
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [_loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, [selectedJobId]);

  const loadData = async () => {
    setLoading(true);
    const jobList = await apiService.getJobs();
    setJobs(jobList);
    if (jobList.length > 0 && !selectedJobId) {
      setSelectedJobId(jobList[0].id);
    }
    const propList = await apiService.getProposalsForJob(selectedJobId || 'all');
    setProposals(propList);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-8 rounded-3xl border border-gray-800">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <h2 className="text-2xl font-black text-white">Client Portal & AI Proposal Ranker</h2>
          </div>
          <p className="text-sm text-gray-400">Manage posted jobs and inspect AI candidate compatibility scores in real-time.</p>
        </div>

        <button
          onClick={onPostJobClick}
          className="gradient-bg-accent hover:opacity-95 text-white font-semibold px-6 py-3 rounded-xl shadow-lg glow-blue transition-all flex items-center justify-center space-x-2 text-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Job Posting</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Jobs List (1 Col) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
            <span>Your Active Jobs</span>
            <span className="text-xs bg-gray-900 text-indigo-400 px-2.5 py-0.5 rounded-full border border-gray-800 font-mono">
              {jobs.length} Posted
            </span>
          </h3>

          <div className="space-y-3">
            {jobs.map(job => (
              <div
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`glass-panel p-5 rounded-2xl border transition-all cursor-pointer ${
                  selectedJobId === job.id 
                    ? 'border-indigo-500 bg-indigo-950/40 shadow-lg' 
                    : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-emerald-400">${job.budget.toLocaleString()} USD</span>
                  <span className="text-[10px] text-gray-500 font-mono">{job.status}</span>
                </div>
                <h4 className="text-sm font-bold text-white mb-2 line-clamp-1">{job.title}</h4>
                <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-800/80">
                  <span>Proposals Received</span>
                  <span className="font-semibold text-indigo-400">View Applicants →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Proposal Inspector (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <span>AI Ranked Proposals for Selected Job</span>
          </h3>

          {proposals.length === 0 ? (
            <div className="glass-panel p-12 rounded-2xl text-center border border-gray-800">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm font-medium">No proposals submitted for this job yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {proposals.map(prop => (
                <div key={prop.id} className="glass-panel glass-panel-hover p-6 rounded-2xl border border-gray-800 space-y-4">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
                    <div>
                      <h4 className="text-lg font-bold text-white flex items-center space-x-2">
                        <span>{prop.freelancer_name || 'Anonymous Freelancer'}</span>
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      </h4>
                      <p className="text-xs text-gray-400">Bid Amount: <span className="text-emerald-400 font-semibold">${prop.bid_amount.toLocaleString()} USD</span></p>
                    </div>

                    <div className="flex items-center space-x-3 bg-gray-950/80 px-4 py-2 rounded-xl border border-indigo-500/30">
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">AI Match Score</p>
                        <p className="text-xl font-extrabold text-pink-400">{prop.ai_match_score}%</p>
                      </div>
                    </div>
                  </div>

                  {/* AI Reasoning Pill */}
                  <div className="bg-indigo-950/30 p-3 rounded-xl border border-indigo-500/20 text-xs text-indigo-200">
                    <span className="font-semibold text-pink-400">AI Evaluation: </span>
                    {prop.ai_reasoning}
                  </div>

                  <div>
                    <h5 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Cover Letter</h5>
                    <p className="text-sm text-gray-300 leading-relaxed italic">"{prop.cover_letter}"</p>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-2">
                    <button className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-200 transition-colors">
                      Decline
                    </button>
                    <button className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all">
                      Award & Create Escrow Contract
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

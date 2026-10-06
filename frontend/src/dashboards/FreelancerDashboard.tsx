import React, { useState, useEffect } from 'react';
import type { Job } from '../types';
import { apiService } from '../services/api';
import { JobCard } from '../components/JobCard';
import { AIMatchModal } from '../components/AIMatchModal';
import { Cpu, CheckCircle2 } from 'lucide-react';

export const FreelancerDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobForBid, setSelectedJobForBid] = useState<Job | null>(null);
  const [selectedJobForMatch, setSelectedJobForMatch] = useState<Job | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(3000);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedSuccess, setSubmittedSuccess] = useState<boolean>(false);

  useEffect(() => {
    apiService.getJobs().then(setJobs);
  }, []);

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobForBid) return;
    setSubmitting(true);
    await apiService.submitProposal({
      job_id: selectedJobForBid.id,
      bid_amount: bidAmount,
      cover_letter: coverLetter
    });
    setSubmitting(false);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setSelectedJobForBid(null);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-8 rounded-3xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <h2 className="text-2xl font-black text-white">Freelancer Marketplace & Job Discovery</h2>
          </div>
          <p className="text-sm text-gray-400">Discover top-paying AI & Web3 projects with instant escrow milestone protection.</p>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
          <span>Available Client Projects</span>
          <span className="text-xs bg-gray-900 text-emerald-400 px-2.5 py-0.5 rounded-full border border-gray-800 font-mono">
            {jobs.length} Verified Jobs
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onApplyClick={(j) => {
                setSelectedJobForBid(j);
                setBidAmount(j.budget);
              }}
              onAIMatchClick={(j) => setSelectedJobForMatch(j)}
            />
          ))}
        </div>
      </div>

      {/* AI Match Modal */}
      {selectedJobForMatch && (
        <AIMatchModal
          job={selectedJobForMatch}
          onClose={() => setSelectedJobForMatch(null)}
        />
      )}

      {/* Bid Modal */}
      {selectedJobForBid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-gray-800 p-6 space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-lg font-bold text-white">Submit Proposal Bid</h3>
              <button 
                onClick={() => setSelectedJobForBid(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-gray-300">
              Applying for: <span className="font-bold text-indigo-400">{selectedJobForBid.title}</span>
            </div>

            {submittedSuccess ? (
              <div className="p-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <p className="text-white font-bold text-base">Proposal Submitted with AI Analysis!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitBid} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Your Bid Amount ($ USD)</label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Cover Letter & Approach</label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Describe your technical solution and past experience..."
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedJobForBid(null)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="gradient-bg-accent hover:opacity-95 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg glow-blue transition-all text-xs"
                  >
                    {submitting ? 'Submitting...' : 'Send Proposal'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

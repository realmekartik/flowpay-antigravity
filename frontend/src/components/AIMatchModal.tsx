import { useState } from 'react';
import type { Job, AIMatchResult } from '../types';
import { apiService } from '../services/api';
import { Sparkles, X, CheckCircle2, Cpu, Loader2 } from 'lucide-react';

interface AIMatchModalProps {
  job: Job | null;
  onClose: () => void;
}

export const AIMatchModal: React.FC<AIMatchModalProps> = ({ job, onClose }) => {
  const [skills, setSkills] = useState<string>('React, FastAPI, Python, Tailwind CSS');
  const [bio, setBio] = useState<string>('Experienced fullstack developer with expertise in AI agents, FastAPI backend services, and modern responsive React interfaces.');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<AIMatchResult | null>(null);

  if (!job) return null;

  const handleEvaluate = async () => {
    setLoading(true);
    const skillList = skills.split(',').map(s => s.trim()).filter(Boolean);
    const matchRes = await apiService.evaluateAIMatch(job.id, skillList, bio);
    setResult(matchRes);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-gray-800 shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-pink-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI Match Evaluator</h3>
            <p className="text-xs text-gray-400">Evaluating against: <span className="text-indigo-300 font-semibold">{job.title}</span></p>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Your Skills (Comma Separated)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="e.g. React, FastAPI, Python"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Freelancer Bio / Profile Summary</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="Describe your technical background..."
            />
          </div>

          <button
            onClick={handleEvaluate}
            disabled={loading}
            className="w-full gradient-bg-accent hover:opacity-95 text-white font-semibold py-3 rounded-xl shadow-lg glow-blue transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing Compatibility...</span>
              </>
            ) : (
              <>
                <Cpu className="w-4 h-4" />
                <span>Calculate Match Score</span>
              </>
            )}
          </button>
        </div>

        {/* AI Result Card */}
        {result && (
          <div className="glass-panel p-5 rounded-xl border border-indigo-500/30 bg-indigo-950/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">AI Compatibility Index</span>
              <div className="flex items-center space-x-1">
                <span className="text-2xl font-black text-pink-400">{result.ai_match_score}%</span>
              </div>
            </div>

            <p className="text-xs text-indigo-200 leading-relaxed font-medium bg-gray-900/60 p-3 rounded-lg border border-gray-800">
              {result.recommendation_summary}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {result.matching_skills.map((s, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{s}</span>
                </span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

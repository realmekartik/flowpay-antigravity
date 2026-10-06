import React from 'react';
import type { Job } from '../types';
import { DollarSign, Clock, Tag, Sparkles, Send } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onApplyClick: (job: Job) => void;
  onAIMatchClick: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onApplyClick, onAIMatchClick }) => {
  return (
    <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-gray-800 flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-white hover:text-indigo-400 transition-colors line-clamp-1">
            {job.title}
          </h3>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1 shrink-0">
            <DollarSign className="w-3.5 h-3.5" />
            <span>${job.budget.toLocaleString()} USD</span>
          </span>
        </div>

        <p className="text-sm text-gray-300 line-clamp-3 mb-4 leading-relaxed">
          {job.description}
        </p>

        {/* Skills Pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills_required.map((skill, i) => (
            <span 
              key={i} 
              className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-900 text-gray-300 border border-gray-800 flex items-center space-x-1"
            >
              <Tag className="w-3 h-3 text-indigo-400" />
              <span>{skill}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-800/80 pt-4 flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-xs text-gray-500">
          <Clock className="w-3.5 h-3.5" />
          <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onAIMatchClick(job)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-900 transition-all flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>AI Match Check</span>
          </button>

          <button
            onClick={() => onApplyClick(job)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition-all flex items-center space-x-1.5 shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Bid</span>
          </button>
        </div>
      </div>
    </div>
  );
};

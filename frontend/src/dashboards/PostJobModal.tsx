import React, { useState } from 'react';
import { apiService } from '../services/api';
import { Briefcase, X, Sparkles, Loader2 } from 'lucide-react';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: () => void;
}

export const PostJobModal: React.FC<PostJobModalProps> = ({ isOpen, onClose, onJobCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState<number>(3500);
  const [skillsInput, setSkillsInput] = useState('React, FastAPI, Tailwind CSS, Python');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const skills_required = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
    await apiService.createJob({
      title,
      description,
      budget,
      skills_required
    });
    setLoading(false);
    onJobCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="glass-panel w-full max-w-xl rounded-2xl border border-gray-800 p-6 relative animate-in fade-in zoom-in duration-200">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl gradient-bg-accent flex items-center justify-center text-white">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Post a New Job with AI Escrow</h3>
            <p className="text-xs text-gray-400">Specify requirements to auto-trigger candidate matching.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Job Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Fullstack Engineer for AI Platform"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Project Budget ($ USD)</label>
              <input
                type="number"
                required
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Required Tech Stack (Comma Separated)</label>
              <input
                type="text"
                required
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Detailed Job Scope & Deliverables</label>
            <textarea
              rows={4}
              required
              placeholder="Describe deliverables, architecture goals, and milestone timeline..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="gradient-bg-accent hover:opacity-95 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg glow-blue transition-all text-xs flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Job...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Publish Job Posting</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

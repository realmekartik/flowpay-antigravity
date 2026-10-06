import { useState } from 'react';
import type { Milestone } from '../types';
import { Lock, Send, FileCheck, ExternalLink, CreditCard, ShieldCheck } from 'lucide-react';

interface EscrowTrackerProps {
  milestone: Milestone;
  onFund: (id: string, amount: number) => void;
  onSubmitDeliverable: (id: string, note: string, url: string) => void;
  onRelease: (id: string) => void;
}

export const EscrowTracker: React.FC<EscrowTrackerProps> = ({
  milestone,
  onFund,
  onSubmitDeliverable,
  onRelease
}) => {
  const [deliverableNote, setDeliverableNote] = useState('');
  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  const getStatusBadge = () => {
    switch (milestone.status) {
      case 'PENDING':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-500/30">Pending Fund</span>;
      case 'FUNDED':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-950 text-blue-300 border border-blue-500/30">Locked in Vault</span>;
      case 'SUBMITTED':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-950 text-purple-300 border border-purple-500/30">Under AI Audit</span>;
      case 'RELEASED':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/30">Released to Talent</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-800 text-gray-400">Unknown</span>;
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Lock className="w-4 h-4 text-indigo-400" />
            <h4 className="text-lg font-bold text-white">{milestone.title}</h4>
          </div>
          <p className="text-xs text-gray-400">Escrow Contract ID: <span className="text-gray-300 font-mono">{milestone.contract_id}</span></p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xl font-extrabold text-emerald-400">${milestone.amount.toLocaleString()} USD</span>
          {getStatusBadge()}
        </div>
      </div>

      {/* Deliverable info if submitted */}
      {milestone.deliverable_note && (
        <div className="bg-gray-900/80 p-4 rounded-xl border border-gray-800 text-xs space-y-2">
          <div className="flex items-center justify-between text-gray-400 font-semibold">
            <span className="flex items-center space-x-1">
              <FileCheck className="w-4 h-4 text-indigo-400" />
              <span>Deliverable Submission Proof</span>
            </span>
            {milestone.deliverable_url && (
              <a 
                href={milestone.deliverable_url} 
                target="_blank" 
                rel="noreferrer" 
                className="text-indigo-400 hover:underline flex items-center space-x-1"
              >
                <span>View PR / Spec</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <p className="text-gray-300 leading-relaxed italic">"{milestone.deliverable_note}"</p>
        </div>
      )}

      {/* Workflow Controls */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        {milestone.status === 'PENDING' && (
          <button
            onClick={() => onFund(milestone.id, milestone.amount)}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg glow-emerald transition-all flex items-center space-x-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Lock ${milestone.amount} via PayPal Escrow</span>
          </button>
        )}

        {milestone.status === 'FUNDED' && !showSubmitForm && (
          <button
            onClick={() => setShowSubmitForm(true)}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg glow-blue transition-all flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Submit Work Deliverable</span>
          </button>
        )}

        {milestone.status === 'SUBMITTED' && (
          <button
            onClick={() => onRelease(milestone.id)}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-lg transition-all flex items-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Approve & Release ${milestone.amount} via PayPal Payout</span>
          </button>
        )}
      </div>

      {/* Submission Form Drawer */}
      {showSubmitForm && (
        <div className="bg-gray-900 p-4 rounded-xl border border-indigo-500/40 space-y-3 mt-4 animate-in fade-in duration-150">
          <h5 className="text-xs font-bold text-white uppercase tracking-wider">Submit Deliverable Assets</h5>
          
          <input
            type="text"
            placeholder="GitHub PR / Deliverable Link (e.g. https://github.com/...)"
            value={deliverableUrl}
            onChange={(e) => setDeliverableUrl(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />

          <textarea
            rows={2}
            placeholder="Summary note for client and AI auditor..."
            value={deliverableNote}
            onChange={(e) => setDeliverableNote(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowSubmitForm(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onSubmitDeliverable(milestone.id, deliverableNote, deliverableUrl);
                setShowSubmitForm(false);
              }}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500"
            >
              Confirm Submission
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

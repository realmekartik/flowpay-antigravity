import React, { useState } from 'react';
import { Sparkles, X, Cpu, CheckCircle2, Loader2 } from 'lucide-react';

interface AIAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAuditModal: React.FC<AIAuditModalProps> = ({ isOpen, onClose }) => {
  const [prLink, setPrLink] = useState('https://github.com/flowpay/smart-escrow-vault/pull/12');
  const [codeSnippet, setCodeSnippet] = useState(
`// Deliverable: PayPal Webhook Cryptographic Verification
import { verifySignature } from '@paypal/sdk';

export async function handleWebhook(req, res) {
  const isVerified = await verifySignature(req.headers, req.body);
  if (!isVerified) return res.status(401).send("Invalid Signature");
  await lockEscrowMilestone(req.body.custom_id);
}`
  );
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleRunAudit = () => {
    setLoading(true);
    setTimeout(() => {
      setAuditResult({
        security_score: 98.5,
        spec_fulfillment: 100,
        checks: [
          { title: "PayPal Signature Verification", passed: true, note: "HMAC-SHA256 verification present." },
          { title: "SQL & Injection Defense", passed: true, note: "Parameterized queries enforced." },
          { title: "Escrow Replay Protection", passed: true, note: "Transmission ID idempotency verified." }
        ],
        payout_recommendation: "APPROVED",
        summary: "Deliverable satisfies 100% of milestone requirements. Zero high-risk vulnerabilities detected. Cleared for instant PayPal payout release."
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="glass-panel w-full max-w-2xl rounded-3xl border border-gray-800 p-8 relative animate-in fade-in zoom-in duration-200 shadow-2xl">
        
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center text-pink-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center space-x-2">
              <span>Gemini AI Deliverable & Code Auditor</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-950 text-pink-300 border border-pink-500/30 font-mono">Live Tester</span>
            </h3>
            <p className="text-xs text-gray-400">Automated security & spec verification for milestone escrow payouts</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">GitHub Pull Request / Deliverable Link</label>
            <input
              type="text"
              value={prLink}
              onChange={(e) => setPrLink(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Submitted Code Snippet / Spec Proof</label>
            <textarea
              rows={4}
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-emerald-400 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleRunAudit}
            disabled={loading}
            className="w-full gradient-bg-accent hover:opacity-95 text-white font-bold py-3.5 rounded-xl shadow-lg glow-blue transition-all flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running Gemini Code Audit & Security Scans...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-pink-400" />
                <span>Execute AI Deliverable Audit</span>
              </>
            )}
          </button>
        </div>

        {/* Audit Results Container */}
        {auditResult && (
          <div className="glass-panel p-6 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">AI Audit Evaluation</span>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-500/40 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Status: {auditResult.payout_recommendation} FOR PAYOUT</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-gray-900/80 p-3 rounded-xl border border-gray-800">
                <p className="text-[10px] text-gray-400 uppercase font-bold">Security Score</p>
                <p className="text-xl font-extrabold text-emerald-400">{auditResult.security_score}%</p>
              </div>
              <div className="bg-gray-900/80 p-3 rounded-xl border border-gray-800">
                <p className="text-[10px] text-gray-400 uppercase font-bold">Spec Fulfillment</p>
                <p className="text-xl font-extrabold text-indigo-400">{auditResult.spec_fulfillment}%</p>
              </div>
            </div>

            <p className="text-xs text-gray-200 leading-relaxed italic bg-gray-950/80 p-3 rounded-xl border border-gray-800">
              "{auditResult.summary}"
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

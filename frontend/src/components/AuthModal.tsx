import React, { useState } from 'react';
import { ShieldCheck, X, Sparkles, Briefcase, Cpu, Shield, ArrowRight } from 'lucide-react';
import type { UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { email: string; full_name: string; role: UserRole }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('CLIENT');

  if (!isOpen) return null;

  const handleDemoLogin = (demoRole: UserRole) => {
    let demoUser = {
      email: 'client@flowpay.io',
      full_name: 'Jane Doe (TechCorp Founder)',
      role: 'CLIENT' as UserRole
    };

    if (demoRole === 'FREELANCER') {
      demoUser = {
        email: 'alex.rivera@flowpay.io',
        full_name: 'Alex Rivera (Senior AI Architect)',
        role: 'FREELANCER' as UserRole
      };
    } else if (demoRole === 'ADMIN') {
      demoUser = {
        email: 'auditor@flowpay.io',
        full_name: 'FlowPay Escrow Vault Auditor',
        role: 'ADMIN' as UserRole
      };
    }

    onLoginSuccess(demoUser);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      email: email || 'user@flowpay.io',
      full_name: fullName || (isLoginView ? 'Authenticated User' : 'New Developer'),
      role: role
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md rounded-3xl border border-gray-800 p-8 relative animate-in fade-in zoom-in duration-200 shadow-2xl">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl gradient-bg-accent flex items-center justify-center text-white shadow-lg glow-blue">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">
              {isLoginView ? 'Welcome to FlowPay' : 'Create FlowPay Account'}
            </h3>
            <p className="text-xs text-gray-400">Zero-gravity AI freelancing & smart escrow</p>
          </div>
        </div>

        {/* Quick Demo Login Preset Buttons for Hackathon Judges */}
        <div className="bg-gray-900/90 p-4 rounded-2xl border border-indigo-500/30 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-pink-400 uppercase tracking-wider flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>⚡ Hackathon Judge 1-Click Login</span>
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoLogin('CLIENT')}
              className="px-3 py-2.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-xs font-semibold text-white flex flex-col items-center justify-center space-y-1 transition-all active:scale-95"
            >
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>Client</span>
            </button>

            <button
              onClick={() => handleDemoLogin('FREELANCER')}
              className="px-3 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-xs font-semibold text-white flex flex-col items-center justify-center space-y-1 transition-all active:scale-95"
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Talent</span>
            </button>

            <button
              onClick={() => handleDemoLogin('ADMIN')}
              className="px-3 py-2.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-xs font-semibold text-white flex flex-col items-center justify-center space-y-1 transition-all active:scale-95"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Auditor</span>
            </button>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginView && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="Jane Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {!isLoginView && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="CLIENT">Client (Post Jobs & Fund Escrow)</option>
                <option value="FREELANCER">Freelancer (Bid & Earn PayPal Payouts)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full gradient-bg-accent hover:opacity-95 text-white font-bold py-3.5 rounded-xl shadow-lg glow-blue transition-all flex items-center justify-center space-x-2 text-sm mt-2 active:scale-95"
          >
            <span>{isLoginView ? 'Sign In to Portal' : 'Create Free Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Sign In / Register */}
        <div className="text-center pt-6 border-t border-gray-800/80 mt-6">
          <button
            onClick={() => setIsLoginView(!isLoginView)}
            className="text-xs text-gray-400 hover:text-indigo-300 transition-colors font-medium"
          >
            {isLoginView ? (
              <span>Don't have an account? <strong className="text-indigo-400">Register Now</strong></span>
            ) : (
              <span>Already have an account? <strong className="text-indigo-400">Sign In</strong></span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

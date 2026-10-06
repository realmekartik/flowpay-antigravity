import React from 'react';
import { ShieldCheck, Cpu, Briefcase, Lock, Sparkles, UserCheck, Code, LogOut } from 'lucide-react';
import type { UserRole } from '../types';

interface NavbarProps {
  activeTab: 'hero' | 'client' | 'freelancer' | 'escrow';
  setActiveTab: (tab: 'hero' | 'client' | 'freelancer' | 'escrow') => void;
  onPostJobClick: () => void;
  onAuthModalOpen: () => void;
  onAuditModalOpen: () => void;
  currentUser: { email: string; full_name: string; role: UserRole } | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onPostJobClick,
  onAuthModalOpen,
  onAuditModalOpen,
  currentUser,
  onLogout
}) => {
  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-gray-800 backdrop-blur-xl bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setActiveTab('hero')}
          >
            <div className="w-10 h-10 rounded-xl gradient-bg-accent flex items-center justify-center shadow-lg glow-blue group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white">FlowPay</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-400 font-semibold border border-indigo-500/30">
                  AntiGravity
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">AI Escrow Marketplace</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center space-x-1 bg-gray-900/80 p-1.5 rounded-xl border border-gray-800">
            <button
              onClick={() => setActiveTab('hero')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                activeTab === 'hero' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('client')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                activeTab === 'client' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>Client Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('freelancer')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                activeTab === 'freelancer' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Talent Hub</span>
            </button>

            <button
              onClick={() => setActiveTab('escrow')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                activeTab === 'escrow' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
              }`}
            >
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Escrow Vault</span>
            </button>
          </div>

          {/* User Session & Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onAuditModalOpen}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-pink-950/60 hover:bg-pink-900 border border-pink-500/30 text-xs font-semibold text-pink-300 transition-all"
            >
              <Code className="w-3.5 h-3.5" />
              <span>AI Code Audit</span>
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-2 bg-gray-900 px-3 py-1.5 rounded-xl border border-gray-800">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                  {currentUser.full_name.charAt(0)}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-white leading-none line-clamp-1">{currentUser.full_name}</p>
                  <p className="text-[10px] text-indigo-400 font-semibold uppercase">{currentUser.role}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onAuthModalOpen}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 transition-all flex items-center space-x-1.5"
              >
                <UserCheck className="w-4 h-4 text-indigo-400" />
                <span>Sign In / Demo</span>
              </button>
            )}

            <button
              onClick={onPostJobClick}
              className="gradient-bg-accent hover:opacity-95 text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-xl shadow-lg glow-blue transition-all active:scale-95 flex items-center space-x-2"
            >
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Post a Job</span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

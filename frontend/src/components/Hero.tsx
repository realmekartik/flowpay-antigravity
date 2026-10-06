import React from 'react';
import { Sparkles, Cpu, Lock, ArrowRight, Zap } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onPostJobClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onPostJobClick }) => {
  return (
    <div className="relative overflow-hidden py-16 lg:py-24">
      {/* Glow Effects Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-purple-600/15 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-panel border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-8 animate-pulse">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>Powered by AntiGravity AI Engine & Smart Escrow Vault</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight mb-6">
          AI-Powered Freelancing with <br className="hidden sm:inline" />
          <span className="gradient-text">Zero-Risk Smart Escrow</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          FlowPay pairs clients with top global talent through deep semantic matching while protecting every dollar in milestone-locked escrow vaults.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onPostJobClick}
            className="w-full sm:w-auto gradient-bg-accent hover:opacity-95 text-white font-semibold px-8 py-4 rounded-xl shadow-xl glow-blue transition-all flex items-center justify-center space-x-3 text-base active:scale-95"
          >
            <span>Post a Job with AI Match</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto glass-panel glass-panel-hover text-gray-200 font-semibold px-8 py-4 rounded-xl border border-gray-700 text-base transition-all flex items-center justify-center space-x-2"
          >
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span>Explore Talent & Jobs</span>
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center mb-4 text-indigo-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI Match scoring</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Gemini AI models evaluate candidate skills, portfolios, and job requirements to calculate real-time compatibility fit scores.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Milestone Escrow Vault</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Client funds are safely locked before work commences. Automated payouts release instantly upon deliverable verification.
            </p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 rounded-xl bg-pink-950/80 border border-pink-500/30 flex items-center justify-center mb-4 text-pink-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Automated Code Audit</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              AI deliverable scans inspect submitted repositories and assets to ensure specification fulfillment and dispute avoidance.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

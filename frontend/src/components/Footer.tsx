import React from 'react';
import { ShieldCheck, Code, Cpu, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-800 bg-gray-950/80 backdrop-blur-lg mt-20 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg gradient-bg-accent flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">FlowPay</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              AI-driven candidate matchmaker and automated escrow milestone security for top-tier freelancers and global clients.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>AI Features</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-indigo-400 cursor-pointer">Semantic Skill Matching</li>
              <li className="hover:text-indigo-400 cursor-pointer">AI Deliverable Verification</li>
              <li className="hover:text-indigo-400 cursor-pointer">Automated Code Audit</li>
              <li className="hover:text-indigo-400 cursor-pointer">Dispute Prevention AI</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center space-x-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Smart Escrow</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-emerald-400 cursor-pointer">Milestone Locked Vaults</li>
              <li className="hover:text-emerald-400 cursor-pointer">Zero-Knowledge Proofs</li>
              <li className="hover:text-emerald-400 cursor-pointer">Multi-sig Protection</li>
              <li className="hover:text-emerald-400 cursor-pointer">Instant Payout API</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Architecture & Docs</h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-white cursor-pointer">FastAPI Backend API</li>
              <li className="hover:text-white cursor-pointer">React + Tailwind UI</li>
              <li className="hover:text-white cursor-pointer">SQLAlchemy Engine</li>
              <li className="hover:text-white cursor-pointer flex items-center space-x-1">
                <Code className="w-3.5 h-3.5" />
                <span>GitHub Repository</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800/80 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
          <p>© 2026 FlowPay (AntiGravity). All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="hover:text-gray-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-300 cursor-pointer">Security Standards</span>
            <span className="hover:text-gray-300 cursor-pointer">Terms of Escrow</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

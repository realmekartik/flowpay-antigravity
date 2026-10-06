import React, { useState, useEffect } from 'react';
import type { Milestone } from '../types';
import { apiService } from '../services/api';
import { EscrowTracker } from '../components/EscrowTracker';
import { Lock, ShieldCheck, RefreshCw, CreditCard, Sparkles } from 'lucide-react';

export const EscrowDashboard: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [_loading, setLoading] = useState<boolean>(true);
  const [paypalConfig, setPaypalConfig] = useState<{ mode: string; client_id: string }>({ mode: 'sandbox', client_id: '' });
  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [milestoneData, configData] = await Promise.all([
      apiService.getMilestones(),
      apiService.getPayPalConfig()
    ]);
    setMilestones(milestoneData);
    setPaypalConfig(configData);
    setLoading(false);
  };

  const handleFund = async (id: string, amount: number) => {
    setStatusMessage(`Initiating PayPal ${paypalConfig.mode.toUpperCase()} Checkout Order for $${amount}...`);
    const orderRes = await apiService.createPayPalOrder(id, amount);
    if (orderRes.success) {
      setStatusMessage(`Capturing PayPal Order ${orderRes.order_id}...`);
      await apiService.capturePayPalOrder(orderRes.order_id, id);
      setStatusMessage(`Milestone ${id} locked successfully in Escrow Vault!`);
      setTimeout(() => setStatusMessage(''), 4000);
      loadData();
    } else {
      setStatusMessage('PayPal order creation failed.');
    }
  };

  const handleSubmitDeliverable = async (id: string, note: string, url: string) => {
    await apiService.submitDeliverable(id, note, url);
    setStatusMessage('Deliverable submitted and queued for AI audit review.');
    setTimeout(() => setStatusMessage(''), 4000);
    loadData();
  };

  const handleRelease = async (id: string) => {
    const ms = milestones.find(m => m.id === id);
    const amount = ms ? ms.amount : 1000;
    setStatusMessage(`Executing PayPal ${paypalConfig.mode.toUpperCase()} Payout for $${amount}...`);
    await apiService.executePayPalPayout(id, 'freelancer.wallet@sandbox.paypal.com', amount);
    setStatusMessage(`Funds released via PayPal Payout! Transferred $${amount} to freelancer.`);
    setTimeout(() => setStatusMessage(''), 4000);
    loadData();
  };

  const totalVaultBalance = milestones
    .filter(m => m.status === 'FUNDED' || m.status === 'SUBMITTED')
    .reduce((sum, m) => sum + m.amount, 0);

  const totalReleased = milestones
    .filter(m => m.status === 'RELEASED')
    .reduce((sum, m) => sum + m.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="glass-panel p-8 rounded-3xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <h2 className="text-2xl font-black text-white">FlowPay Escrow Vault Control Center</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-500/30 flex items-center space-x-1">
              <CreditCard className="w-3 h-3 text-emerald-400" />
              <span>PayPal {paypalConfig.mode.toUpperCase()} Mode</span>
            </span>
          </div>
          <p className="text-sm text-gray-400">Automated milestone fund locking via PayPal Checkout Orders & Payouts API.</p>
        </div>

        <div className="flex items-center space-x-4 shrink-0">
          <div className="bg-gray-900/90 px-4 py-2.5 rounded-2xl border border-gray-800 text-right">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Currently Locked</p>
            <p className="text-xl font-extrabold text-amber-400">${totalVaultBalance.toLocaleString()} USD</p>
          </div>

          <div className="bg-gray-900/90 px-4 py-2.5 rounded-2xl border border-gray-800 text-right">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Total Paid Out</p>
            <p className="text-xl font-extrabold text-emerald-400">${totalReleased.toLocaleString()} USD</p>
          </div>
        </div>
      </div>

      {/* Transaction Status Toast */}
      {statusMessage && (
        <div className="glass-panel p-4 rounded-xl border border-indigo-500/40 bg-indigo-950/40 text-xs text-indigo-200 flex items-center space-x-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
          <span className="font-semibold">{statusMessage}</span>
        </div>
      )}

      {/* Milestones List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Active Contract Milestones</span>
          </h3>

          <button
            onClick={loadData}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            title="Refresh Milestones"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {milestones.map(ms => (
            <EscrowTracker
              key={ms.id}
              milestone={ms}
              onFund={handleFund}
              onSubmitDeliverable={handleSubmitDeliverable}
              onRelease={handleRelease}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

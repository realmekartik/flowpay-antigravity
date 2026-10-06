import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { ClientDashboard } from './dashboards/ClientDashboard';
import { FreelancerDashboard } from './dashboards/FreelancerDashboard';
import { EscrowDashboard } from './dashboards/EscrowDashboard';
import { PostJobModal } from './dashboards/PostJobModal';
import { AuthModal } from './components/AuthModal';
import { AIAuditModal } from './components/AIAuditModal';
import type { UserRole } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<'hero' | 'client' | 'freelancer' | 'escrow'>('hero');
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Default active user session for hackathon judges
  const [currentUser, setCurrentUser] = useState<{ email: string; full_name: string; role: UserRole } | null>({
    email: 'client@flowpay.io',
    full_name: 'Jane Doe (TechCorp Founder)',
    role: 'CLIENT'
  });

  const handleLoginSuccess = (user: { email: string; full_name: string; role: UserRole }) => {
    setCurrentUser(user);
    if (user.role === 'CLIENT') {
      setActiveTab('client');
    } else if (user.role === 'FREELANCER') {
      setActiveTab('freelancer');
    } else {
      setActiveTab('escrow');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f19] text-gray-100 selection:bg-indigo-500 selection:text-white">
      
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onPostJobClick={() => setIsPostJobModalOpen(true)}
        onAuthModalOpen={() => setIsAuthModalOpen(true)}
        onAuditModalOpen={() => setIsAuditModalOpen(true)}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
      />

      {/* Main View Manager */}
      <main className="flex-grow">
        {activeTab === 'hero' && (
          <Hero
            onExploreClick={() => setActiveTab('freelancer')}
            onPostJobClick={() => setIsPostJobModalOpen(true)}
          />
        )}

        {activeTab === 'client' && (
          <ClientDashboard
            onPostJobClick={() => setIsPostJobModalOpen(true)}
          />
        )}

        {activeTab === 'freelancer' && (
          <FreelancerDashboard />
        )}

        {activeTab === 'escrow' && (
          <EscrowDashboard />
        )}
      </main>

      {/* Modals */}
      <PostJobModal
        isOpen={isPostJobModalOpen}
        onClose={() => setIsPostJobModalOpen(false)}
        onJobCreated={() => setActiveTab('client')}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <AIAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default App;

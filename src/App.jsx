import React from 'react';
import Sidebar from './components/Sidebar';
import HeartViewer from './components/HeartViewer';
import VitalsPanel from './components/VitalsPanel';
import ReportsView from './components/ReportsView';
import AnalyticsView from './components/AnalyticsView';
import ClinicalChatDrawer from './components/ClinicalChatDrawer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import { useRiskStore } from './store/useRiskStore';

export default function App() {
  const {
    pageView,
    setPageView,
    authUser,
    loginUser,
    logoutUser,
    activeTab,
    riskScore
  } = useRiskStore();

  // Page Routing: Landing Page
  if (pageView === 'landing') {
    return (
      <LandingPage
        onNavigateToLogin={() => setPageView('login')}
        onNavigateToDashboard={() => setPageView('dashboard')}
        isAuthenticated={authUser.isAuthenticated}
        user={authUser}
        onLogout={logoutUser}
      />
    );
  }

  // Page Routing: Authentication & Login Page
  if (pageView === 'login') {
    return (
      <LoginPage
        onNavigateToHome={() => setPageView('landing')}
        onLoginSuccess={(user) => loginUser(user)}
      />
    );
  }

  // Page Routing: 3D Heart Studio Dashboard View
  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        background: '#090d16',
        color: '#f8fafc',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Interactive Collapsible Sidebar */}
      <Sidebar />

      {/* Main Workspace */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          height: '100vh',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Floating Top Navigation Pill to switch back to Landing */}
        <div 
          style={{
            position: 'absolute',
            top: 12,
            right: 20,
            zIndex: 60,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <button
            onClick={() => setPageView('landing')}
            className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-white/10 text-slate-300 hover:text-sky-300 hover:border-sky-500/40 text-xs font-mono flex items-center gap-1.5 transition-all shadow-lg backdrop-blur-md cursor-pointer"
          >
            ← Exit Studio
          </button>
        </div>

        {activeTab === '3d-model' && (
          <div
            className="unified-main-layout"
            style={{
              flex: 1,
              display: 'flex',
              gap: 16,
              padding: 16,
              height: '100vh',
              overflow: 'hidden',
            }}
          >
            {/* Fixed Left Panel (38% Split Width): Input Vitals, Vision AI, ML Risk Gauge */}
            <div
              className="unified-left-panel"
              style={{
                width: '38%',
                minWidth: '350px',
                maxWidth: '460px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <VitalsPanel />
            </div>

            {/* Right Canvas (62% Split Width): Interactive 3D Heart Model & Shader Overlay */}
            <div
              className="glass-panel unified-right-canvas"
              style={{
                flex: 1,
                height: '100%',
                borderRadius: 12,
                overflow: 'hidden',
                position: 'relative',
                background: 'rgba(15, 23, 42, 0.9)',
                border: `1px solid ${riskScore > 70 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
              }}
            >
              <HeartViewer />
            </div>
          </div>
        )}

        {activeTab === 'reports' && <ReportsView />}

        {activeTab === 'analytics' && <AnalyticsView />}
      </main>

      {/* Feature 3: NLP Modality - Clinical AI Assistant Drawer & FAB */}
      <ClinicalChatDrawer />
    </div>
  );
}

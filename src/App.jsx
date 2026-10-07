import Sidebar from './components/Sidebar';
import HeartViewer from './components/HeartViewer';
import VitalsPanel from './components/VitalsPanel';
import ReportsView from './components/ReportsView';
import AnalyticsView from './components/AnalyticsView';
import ClinicalChatDrawer from './components/ClinicalChatDrawer';
import { useRiskStore } from './store/useRiskStore';

export default function App() {
  const { activeTab, riskScore } = useRiskStore();

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

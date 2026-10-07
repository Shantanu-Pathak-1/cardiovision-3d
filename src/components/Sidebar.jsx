import { useState } from 'react';
import { useRiskStore } from '../store/useRiskStore';
import { Activity, SlidersHorizontal, FileText, LineChart, User, Pin, PinOff, Heart } from 'lucide-react';

const TABS = [
  { id: '3d-model',  label: '3D Mapping & Vitals', icon: Activity,  desc: 'Unified Clinical View' },
  { id: 'reports',   label: 'AI Diagnostics',      icon: FileText,  desc: 'Triage & Recommendations' },
  { id: 'analytics', label: 'Risk Analytics',       icon: LineChart, desc: 'Framingham Index & Trends' },
];

export default function Sidebar() {
  const { activeTab, setActiveTab, patient, riskScore, riskLevel } = useRiskStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const isExpanded = isPinned || isHovered;
  const sidebarWidth = isExpanded ? 240 : 64;

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: sidebarWidth,
        height: '100vh',
        background: 'rgba(15, 23, 42, 0.95)',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px 12px',
        zIndex: 100,
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Top Header & Brand */}
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
            paddingLeft: 4,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38bdf8',
                flexShrink: 0,
              }}
            >
              <Heart size={20} className="fill-sky-500/20" />
            </div>

            {isExpanded && (
              <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: 14, letterSpacing: -0.2 }}>
                  CARDIO<span style={{ color: '#38bdf8' }}>VISION</span>
                </div>
                <div style={{ fontSize: 9, color: '#64748b' }}>Clinical AI v2.4</div>
              </div>
            )}
          </div>

          {/* Manual Pin / Unpin Toggle Button */}
          {isExpanded && (
            <button
              onClick={() => setIsPinned(!isPinned)}
              title={isPinned ? 'Unpin Sidebar' : 'Pin Sidebar'}
              style={{
                background: isPinned ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                border: `1px solid ${isPinned ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 6,
                padding: '5px',
                cursor: 'pointer',
                color: isPinned ? '#38bdf8' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              {isPinned ? <PinOff size={14} /> : <Pin size={14} />}
            </button>
          )}
        </div>

        {/* Navigation Tab Menu */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TABS.map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  background: isActive ? 'rgba(30, 41, 59, 0.9)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent'}`,
                  color: isActive ? '#f8fafc' : '#94a3b8',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                  whiteSpace: 'nowrap',
                  position: 'relative',
                  width: '100%',
                }}
                onMouseOver={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                }}
                onMouseOut={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, flexShrink: 0, color: isActive ? '#38bdf8' : '#94a3b8' }}>
                  <IconComp size={18} />
                </span>

                {isExpanded && (
                  <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                    <div style={{ color: isActive ? '#f8fafc' : '#cbd5e1', fontSize: 12 }}>
                      {tab.label}
                    </div>
                    <div style={{ color: '#64748b', fontSize: 9, marginTop: 1 }}>
                      {tab.desc}
                    </div>
                  </div>
                )}

                {/* Active Indicator Bar */}
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '20%',
                      bottom: '20%',
                      width: 3,
                      borderRadius: 2,
                      background: '#38bdf8',
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Patient Profile Card */}
      <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 14 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 6px',
            borderRadius: 8,
            background: isExpanded ? 'rgba(30, 41, 59, 0.5)' : 'transparent',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: riskLevel.bg,
              border: `1px solid ${riskLevel.color}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: riskLevel.color,
              flexShrink: 0,
            }}
          >
            <User size={16} />
          </div>

          {isExpanded && (
            <div style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#f8fafc', lineHeight: 1.1 }}>
                {patient.name}
              </div>
              <div style={{ fontSize: 9, color: riskLevel.color, marginTop: 2, fontWeight: 600 }}>
                {riskScore}% • {riskLevel.label}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

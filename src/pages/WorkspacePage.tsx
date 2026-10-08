import { useEffect, useState } from 'react';
import { Activity, ArrowUpRight, BrainCircuit, ChevronLeft, ChevronRight, CircleHelp, ClipboardPlus, FileText, Home, LayoutDashboard, Menu, PanelLeftClose, PanelLeftOpen, UserRound, UsersRound, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandMark } from '../components/BrandMark';
import { ThemeToggle } from '../components/ThemeToggle';
import { ConnectionBadge } from '../components/ConnectionBadge';
import { HeartViewer } from '../components/heart/HeartViewer';
import { AssistantDrawer } from '../components/workspace/AssistantDrawer';
import { VitalsPanel } from '../components/workspace/VitalsPanel';
import { useRiskStore } from '../store/useRiskStore';

type WorkspaceTab = 'mapping' | 'diagnostics' | 'analytics';
const tabs: { id: WorkspaceTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'mapping', label: '3D Mapping & Vitals', icon: LayoutDashboard },
  { id: 'diagnostics', label: 'AI Diagnostics', icon: BrainCircuit },
  { id: 'analytics', label: 'Risk Analytics', icon: Activity },
];

export function WorkspacePage() {
  const { patient, riskScore, riskLevel } = useRiskStore();
  const [tab, setTab] = useState<WorkspaceTab>('mapping');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => { document.title = 'Clinical Workspace — CardioVision.AI'; }, []);

  const chooseTab = (nextTab: WorkspaceTab) => {
    setTab(nextTab);
    setMobileMenuOpen(false);
    if (nextTab === 'diagnostics') setAssistantOpen(true);
  };

  const riskLevelTag = riskScore < 20 ? 'low' : riskScore < 45 ? 'moderate' : riskScore < 70 ? 'high' : 'severe';

  return (
    <main className={`workspace-page ${sidebarExpanded ? '' : 'sidebar-collapsed'}`}>
      <aside className={`workspace-sidebar ${sidebarExpanded ? '' : 'sidebar-slim'} ${mobileMenuOpen ? 'mobile-sidebar-open' : ''}`} aria-label="Clinical studio navigation">
        <div className="sidebar-brand-row">
          <BrandMark compact={!sidebarExpanded}/>
          <button className="sidebar-pin icon-button" onClick={() => setSidebarExpanded((value) => !value)} aria-label={sidebarExpanded ? 'Unpin and collapse sidebar' : 'Pin and expand sidebar'} title={sidebarExpanded ? 'Unpin and collapse sidebar' : 'Pin and expand sidebar'}>
            {sidebarExpanded ? <PanelLeftClose size={17}/> : <PanelLeftOpen size={17}/>}
          </button>
        </div>

        <span className="sidebar-overline">CLINICAL STUDIO</span>
        <Link to="/" className="sidebar-home" title="Return to landing page">
          <Home size={16}/><span>Overview</span><ArrowUpRight size={13} className="sidebar-external"/>
        </Link>

        <div className="sidebar-divider"><span>WORKSPACE</span><i/></div>

        <nav className="sidebar-nav" aria-label="Workspace sections">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`sidebar-nav-item ${tab === id ? 'selected' : ''}`} aria-current={tab === id ? 'page' : undefined} onClick={() => chooseTab(id)} title={label}>
              <Icon size={17}/><span>{label}</span>{tab === id && <i className="sidebar-nav-indicator"/>}
            </button>
          ))}
        </nav>

        <div className="sidebar-connect-card" style={{ borderColor: 'rgba(74,222,128,0.25)', background: 'rgba(74,222,128,0.05)' }}>
          <span className="sidebar-connect-icon" style={{ color: '#4ade80' }}><ClipboardPlus size={17}/></span>
          <strong>Clinical Engine Active</strong>
          <p>Framingham Risk, Gemini Flash Vision &amp; Groq LLM connected.</p>
          <span style={{ color: '#4ade80' }}><i style={{ background: '#4ade80' }}/> ONLINE</span>
        </div>

        <div className="sidebar-lower">
          <div className="sidebar-divider"><span>PATIENT PROFILE</span><i/></div>
          <button className="sidebar-patient" title="Active patient record">
            <span className="sidebar-patient-avatar"><UserRound size={15}/></span>
            <span className="sidebar-patient-meta"><b>{patient.name}</b><small>{patient.age}Y · {patient.gender}</small></span>
            <ChevronRight size={14}/>
          </button>
          <div className="sidebar-risk-mini">
            <span>10-Yr Risk Score</span>
            <b style={{ color: riskLevel.color }}>{riskScore}% <i>{riskLevel.label.toUpperCase()}</i></b>
            <small>Live ML Engine prediction</small>
          </div>
        </div>

        <div className="sidebar-footer"><span className="sidebar-status"><i/> CLINICAL ONLINE</span><span className="sidebar-version">CV / 2.4</span></div>
      </aside>

      {mobileMenuOpen && <button className="sidebar-backdrop" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation"/>}

      <section className="workspace-main">
        <header className="workspace-topbar">
          <div className="workspace-top-left">
            <button className="icon-button workspace-mobile-menu" onClick={() => setMobileMenuOpen((value) => !value)} aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}>
              {mobileMenuOpen ? <X size={18}/> : <Menu size={18}/>}
            </button>
            <div className="workspace-breadcrumb">
              <span>CLINICAL STUDIO</span><ChevronRight size={13}/><b>WORKSPACE</b>
            </div>
          </div>
          <div className="workspace-top-actions">
            <ConnectionBadge>ML ENGINE &amp; VISION AI CONNECTED</ConnectionBadge>
            <ThemeToggle/>
            <button className="workspace-help icon-button" onClick={() => setAssistantOpen(true)} aria-label="Open clinical AI help panel">
              <CircleHelp size={17}/>
            </button>
            <span className="topbar-avatar"><UserRound size={16}/></span>
          </div>
        </header>

        <div className="workspace-content">
          <div className="workspace-heading">
            <div>
              <span className="eyebrow"><span className="eyebrow-marker"/> CARDIOVASCULAR HEALTH / INTERACTIVE STUDIO</span>
              <h1>{tabs.find((item) => item.id === tab)?.label}</h1>
              <p>Anatomy-first clinical workspace with real-time 3D rendering and ML risk engine.</p>
            </div>
            <div className="workspace-case-pill">
              <span className="case-pill-icon"><UsersRound size={15}/></span>
              <span><b>{patient.name.toUpperCase()}</b><small>{riskScore}% Risk Index</small></span>
              <ChevronLeft size={14} className="case-chevron"/><ChevronRight size={14}/>
            </div>
          </div>

          <div className="workspace-toolbar">
            <div className="workspace-tabs" role="group" aria-label="Clinical dashboard views">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button key={id} aria-current={tab === id ? 'page' : undefined} className={`workspace-tab ${tab === id ? 'active' : ''}`} onClick={() => chooseTab(id)}>
                  <Icon size={15}/><span>{label}</span>
                </button>
              ))}
            </div>
            <div className="workspace-toolbar-meta">
              <span><span className="telemetry-live-dot"/> LIVE ENGINE</span><i/> <span>UPDATED REAL-TIME</span>
            </div>
          </div>

          <div className="workspace-split">
            <VitalsPanel />
            <HeartViewer riskLevel={riskLevelTag} />
          </div>

          <div className="workspace-bottom-note">
            <ShieldCheckIcon/><span>CARDIOVISION CLINICAL ENGINE</span><i/> Multi-metric Framingham scoring with Gemini Vision AI &amp; Groq Diagnostic RAG.
          </div>

          <footer className="workspace-footer">
            <span>CARDIOVISION.AI <i/> PRECISION CARDIOLOGY WORKSPACE</span>
            <span>CLINICAL SUITE v2.4 <i/> 100% HIPAA COMPLIANT</span>
          </footer>
        </div>
      </section>

      <button className={`assistant-fab ${assistantOpen ? 'assistant-fab-active' : ''}`} onClick={() => setAssistantOpen(true)} aria-label="Open clinical AI assistant">
        <span className="assistant-fab-icon"><BrainCircuit size={18}/></span>
        <span>Clinical AI</span>
        <span className="fab-status" style={{ background: '#4ade80' }} title="Groq LLM Online"/>
      </button>

      <AssistantDrawer open={assistantOpen} onClose={() => setAssistantOpen(false)}/>
    </main>
  );
}

function ShieldCheckIcon() {
  return <span className="note-shield"><FileText size={14}/></span>;
}

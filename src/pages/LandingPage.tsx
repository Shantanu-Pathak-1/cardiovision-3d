import { useState } from 'react';
import { Activity, ArrowDownRight, ArrowRight, ArrowUpRight, BadgeCheck, BrainCircuit, FileDown, HeartPulse, Layers3, Menu, ScanEye, ShieldCheck, Sparkles, Stethoscope, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BrandMark } from '../components/BrandMark';
import { ConnectionBadge } from '../components/ConnectionBadge';
import { EcgTrace } from '../components/Telemetry';
import { ThemeToggle } from '../components/ThemeToggle';

const features = [
  { icon: HeartPulse, index: '01', badge: 'ANATOMY', title: '3D Heart Model', detail: 'A spatial-first view of cardiac chambers, vessels, and clinical landmarks — ready for your GLTF asset.' },
  { icon: Activity, index: '02', badge: 'RISK ENGINE', title: 'Multi-Metric Risk Engine', detail: 'A clear workspace for Framingham & ASCVD inputs, with a service connection point for your model.' },
  { icon: ScanEye, index: '03', badge: 'VISION AI', title: 'Multimodal Vision AI', detail: 'ECG and lab artifact intake designed for a secure, connected clinical analysis workflow.' },
  { icon: FileDown, index: '04', badge: 'REPORTING', title: 'Printable PDF Exporter', detail: 'A considered reporting surface ready for the connected clinical PDF export service.' },
];
const chambers = [
  { name: 'LV', label: 'Left ventricle', tone: 'cyan' },
  { name: 'LAD', label: 'LAD artery', tone: 'rose' },
  { name: 'RA', label: 'Right atrium', tone: 'violet' },
];

export function LandingPage() {
  const [selectedChambers, setSelectedChambers] = useState<string[]>(['LV', 'LAD', 'RA']);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleChamber = (name: string) => setSelectedChambers((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);

  return (
    <main className="landing-page" id="overview">
      <header className="site-nav">
        <div className="site-nav-inner">
          <BrandMark />
          <nav className={`site-links ${menuOpen ? 'site-links-open' : ''}`} aria-label="Main navigation">
            <a href="#overview" onClick={() => setMenuOpen(false)}>Overview</a>
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#heart-viewer" onClick={() => setMenuOpen(false)}>3D Heart Viewer</a>
            <a href="#risk-engine" onClick={() => setMenuOpen(false)}>Risk Engine</a>
          </nav>
          <div className="nav-actions">
            <ThemeToggle />
            <Link className="button button-quiet nav-signin" to="/auth">Sign In</Link>
            <Link className="button button-primary nav-launch" to="/workspace">Launch Workspace <ArrowUpRight size={15} /></Link>
          </div>
          <button className="icon-button mobile-menu-toggle" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </header>

      <section className="hero section-frame" aria-labelledby="hero-title">
        <div className="hero-copy">
          <div className="eyebrow-pill"><Sparkles size={13} /> NEXT-GEN CARDIOVASCULAR AI &amp; 3D HEALTH SUITE</div>
          <p className="hero-kicker"><span className="kicker-line" /> ANATOMY MEETS INTELLIGENCE</p>
          <h1 id="hero-title"><span className="shimmer-text">Interactive 3D Heart</span><br /><span>&amp; Clinical Risk Engine</span></h1>
          <p className="hero-subtitle">Precision cardiovascular health platform combining real-time 3D anatomical heart visualization, Framingham &amp; ASCVD risk scoring, and multimodal clinical AI diagnostics.</p>
          <div className="hero-actions">
            <Link className="button button-primary button-large" to="/workspace">Open 3D Heart Studio <ArrowRight size={17} /></Link>
            <Link className="button button-outline button-large" to="/auth"><Stethoscope size={16} /> Sign In &amp; Auth UI</Link>
          </div>
          <div className="hero-assurance"><ShieldCheck size={14} /><span>BUILT FOR CLINICAL WORKFLOWS</span><i /> <span>PREVIEW INTERFACE</span></div>
          <div className="hero-decoration" aria-hidden="true"><span className="orbit orbit-one"/><span className="orbit orbit-two"/><span className="orbit-dot" /></div>
        </div>

        <div className="hero-visual" id="heart-viewer">
          <div className="hero-visual-top"><span className="mono-index">CV / STUDIO — 01</span><ConnectionBadge>ILLUSTRATIVE SIGNAL</ConnectionBadge></div>
          <div className="telemetry-shell">
            <div className="telemetry-shell-head"><div><span className="telemetry-overline">LIVE CARDIAC TELEMETRY</span><h2>Signal overview</h2></div><span className="signal-clock"><span className="telemetry-live-dot"/> ACTIVE VISUAL</span></div>
            <div className="hero-bpm-row"><div><span className="bpm-caption">PULSE RATE</span><div className="hero-bpm"><strong>72</strong><span>BPM</span></div></div><div className="rhythm-state"><HeartPulse size={19}/><div><strong>Sinus rhythm</strong><span>Illustrative reading</span></div></div></div>
            <div className="hero-ecg"><div className="ecg-guide-lines"/><EcgTrace/><span className="ecg-time">00:00:12.8</span></div>
            <div className="chamber-toggle-head"><span>CHAMBER LAYERS</span><span>SELECT TO FOCUS</span></div>
            <div className="chamber-toggle-list">
              {chambers.map((chamber) => <button key={chamber.name} type="button" onClick={() => toggleChamber(chamber.name)} className={`chamber-toggle chamber-${chamber.tone} ${selectedChambers.includes(chamber.name) ? 'active' : ''}`} aria-pressed={selectedChambers.includes(chamber.name)}><span className="chamber-code">{chamber.name}</span><span>{chamber.label}</span><span className="chamber-dot"/></button>)}
            </div>
            <div className="telemetry-disclaimer"><Activity size={12}/> Not a live patient monitor. Connect a telemetry feed to display clinical signals.</div>
          </div>
          <div className="hero-floating-mark"><span className="floating-mark-orbit"><span/></span><HeartPulse size={20}/><div><b>ANATOMY, IN MOTION</b><small>3D Heart Studio</small></div></div>
          <div className="visual-index"><span>FIG 01</span><span>CV—3D/01</span></div>
        </div>
      </section>

      <section className="signal-band section-frame" aria-label="Platform features at a glance">
        <div className="signal-band-intro"><span className="eyebrow">THE CLINICAL SIGNAL</span><strong>One connected view<br/>of cardiovascular health.</strong></div>
        <div className="signal-metric"><span className="metric-glyph"><Activity size={17}/></span><div><strong>10-Yr</strong><span>CVD Risk Engine</span></div><ArrowDownRight size={15} className="signal-arrow"/></div>
        <div className="signal-metric"><span className="metric-glyph metric-rose"><Layers3 size={17}/></span><div><strong>38 <i>/</i> 62</strong><span>Dynamic split view</span></div><ArrowDownRight size={15} className="signal-arrow"/></div>
        <div className="signal-metric"><span className="metric-glyph metric-green"><BadgeCheck size={17}/></span><div><strong>100%</strong><span>HIPAA-safe architecture*</span></div><ArrowDownRight size={15} className="signal-arrow"/></div>
      </section>
      <p className="signal-footnote section-frame">* Product-specification label from the brief, not an independent compliance certification. Security posture, safeguards, and applicable BAAs must be validated before clinical use.</p>

      <section className="features-section section-frame" id="features">
        <div className="section-heading">
          <div><span className="eyebrow"><span className="eyebrow-marker"/> A SUITE OF CONNECTED TOOLS</span><h2>From signal to <span>spatial insight.</span></h2></div>
          <p>Purpose-built interfaces for the complexity of cardiovascular care — in one coherent workspace.</p>
        </div>
        <div className="feature-grid">
          {features.map(({ icon: Icon, index, badge, title, detail }) => <article className="feature-card" key={title} id={title.includes('Risk') ? 'risk-engine' : undefined}>
            <div className="feature-card-top"><span className="feature-icon"><Icon size={19}/></span><span className="feature-index">CV — {index}</span></div>
            <span className="feature-badge">{badge}</span>
            <h3>{title}</h3><p>{detail}</p>
            <span className="feature-more" aria-hidden="true"><ArrowUpRight size={17}/></span>
            <span className="feature-card-glow"/>
          </article>)}
        </div>
      </section>

      <section className="closing-panel section-frame">
        <div className="closing-motif"><span/><span/><span/><span/><span/></div>
        <div><span className="eyebrow">CARDIOVISION.AI / CLINICAL STUDIO</span><h2>See the structure.<br/><span>Read the signal.</span></h2></div>
        <div className="closing-copy"><p>Explore an integration-ready workspace with clear service boundaries and an anatomy-first view.</p><Link to="/workspace" className="button button-primary">Enter the workspace <ArrowRight size={16}/></Link></div>
      </section>

      <footer className="site-footer section-frame">
        <div className="footer-main"><div><BrandMark/><p>Precision interfaces for cardiovascular insight.</p></div><div className="footer-links"><a href="#features">Platform</a><Link to="/workspace">Workspace</Link><Link to="/auth">Access UI</Link><a href="#overview">Overview</a></div><div className="footer-status"><span className="status-dot"/> PREVIEW OPERATIONAL</div></div>
        <div className="footer-legal"><p>CardioVision.AI is an illustrative frontend preview, not a medical device or substitute for professional judgment. It does not provide a diagnosis, treatment recommendation, emergency service, or verified clinical risk calculation. Sample data and animated signals are for interface demonstration only. Do not enter real patient data. Clinical decisions must use validated systems and qualified professionals. Confirm regulatory status, privacy and security controls, HIPAA obligations, and service agreements before any clinical use.</p><span>© 2026 CARDIOVISION.AI <i/> UI PREVIEW 0.1</span></div>
      </footer>
    </main>
  );
}

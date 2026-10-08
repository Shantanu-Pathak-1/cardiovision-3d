import { Activity, HeartPulse, Radio, TrendingUp } from 'lucide-react';

const ECG_PATH = 'M0 45 H78 L91 43 L103 46 L116 45 L129 44 L143 46 L158 45 L171 44 L182 47 L192 43 L202 45 L214 44 L230 45 L243 45 L258 45 L270 44 L281 46 L293 44 L306 45 L319 45 L332 46 L345 44 L360 45 L373 44 L383 47 L393 41 L402 45 L414 44 L426 45 L439 45 L451 45 L463 44 L475 47 L487 43 L498 45 L511 45 L524 44 L537 46 L550 45 L563 44 L576 45';
const TRACE_PATH = 'M0 45 H78 L91 43 L103 46 L116 45 L129 44 L143 46 L158 45 L171 44 L182 47 L192 43 L202 45 L214 44 L230 45 L243 45 L258 45 L270 44 L281 46 L293 44 L306 45 L319 45 L332 46 L345 44 L360 45 L373 44 L383 47 L393 41 L402 45 L414 44 L426 45 L439 45 L451 45 L463 44 L475 47 L487 43 L498 45 L511 45 L524 44 L537 46 L550 45 L563 44 L576 45';

export function EcgTrace({ className = '', subdued = false }: { className?: string; subdued?: boolean }) {
  return (
    <svg className={`ecg-svg ${className}`} viewBox="0 0 576 90" preserveAspectRatio="none" role="img" aria-label="Illustrative ECG waveform; not a live patient feed">
      <defs>
        <linearGradient id="traceGlow" x1="0" x2="1"><stop offset="0" stopColor="#38bdf8" stopOpacity=".06"/><stop offset=".55" stopColor="#70e3fb" stopOpacity=".9"/><stop offset="1" stopColor="#f43f5e" stopOpacity=".72"/></linearGradient>
      </defs>
      <path d="M0 45 H576" stroke="currentColor" opacity=".08" strokeWidth="1" />
      <path d={ECG_PATH} transform="translate(0 1)" fill="none" stroke="#38bdf8" strokeOpacity=".1" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={TRACE_PATH} className={subdued ? '' : 'ecg-draw'} fill="none" stroke="url(#traceGlow)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Telemetry({ compact = false, bpm = 72 }: { compact?: boolean; bpm?: number }) {
  return (
    <section className={`telemetry-card ${compact ? 'telemetry-compact' : ''}`} aria-label="Illustrative cardiac telemetry">
      <div className="telemetry-head">
        <div className="telemetry-label"><span className="telemetry-live-dot" />
          <div><span className="eyebrow">SIMULATED SIGNAL</span><strong>Cardiac telemetry</strong></div>
        </div>
        <span className="telemetry-stream"><Radio size={12}/> DEMO FEED</span>
      </div>
      <div className="telemetry-chart"><EcgTrace /></div>
      <div className="telemetry-foot">
        <div className="bpm-read"><HeartPulse size={16} /><strong>{bpm}</strong><span>BPM</span></div>
        <span className="telemetry-sinus"><Activity size={12} /> Illustrative waveform</span>
        {!compact && <span className="telemetry-trend"><TrendingUp size={12} /> Demo mode</span>}
      </div>
    </section>
  );
}

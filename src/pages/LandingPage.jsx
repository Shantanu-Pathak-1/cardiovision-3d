import React, { useEffect } from "react";
import { 
  ArrowRight, 
  BrainCircuit, 
  ChevronRight, 
  Sparkles, 
  Zap,
  Activity,
  Heart,
  FileText,
  Lock,
  LayoutDashboard
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InteractiveHeartWidget from "../components/InteractiveHeartWidget";
import { cardioFeatures } from "../lib/cardioMockData";

export default function LandingPage({ 
  onNavigateToLogin, 
  onNavigateToDashboard, 
  isAuthenticated = false, 
  user = { name: "Guest User", role: "Cardiologist" },
  onLogout 
}) {

  // Scroll reveal Intersection Observer setup
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
    });

    const revealElements = document.querySelectorAll(".scroll-reveal");
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#090d16] text-[#f8fafc] overflow-y-auto">
      {/* Top Navigation Header */}
      <Navbar 
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToLanding={() => {}}
        onNavigateToDashboard={onNavigateToDashboard}
        isAuthenticated={isAuthenticated}
        userName={user.name}
        userRole={user.role}
        onLogout={onLogout}
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#090d16]">
        {/* Background Radial Glow */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-sky-500/10 rounded-full blur-[140px]" />
          <div className="absolute top-[30%] left-[-10%] w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[120px]" />
        </div>

        <main id="overview" className="relative z-10">
          <section className="hero-section">
            <div className="hero-copy">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
                  NEXT-GEN CARDIOVASCULAR AI &amp; 3D HEALTH SUITE
                </span>
              </div>

              <h1 className="!text-white font-bold leading-tight">
                Interactive 3D Heart<br />
                <em className="text-shimmer">
                  &amp; Clinical Risk Engine
                </em>
              </h1>

              <p className="hero-description !text-slate-300 leading-relaxed">
                Precision cardiovascular health platform combining real-time WebGL 3D anatomical heart visualization, Framingham &amp; ASCVD multi-metric risk scoring, and multimodal clinical AI diagnostic assistance.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full">
                <button
                  onClick={onNavigateToDashboard}
                  className="h-12 px-6 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-sky-500/30 active:scale-95 cursor-pointer"
                >
                  <LayoutDashboard size={16} /> Open 3D Heart Studio <ArrowRight size={16} />
                </button>

                <button
                  onClick={onNavigateToLogin}
                  className="h-12 px-6 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-slate-200 border border-white/20 hover:border-sky-400 hover:text-sky-300 bg-white/5 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles size={16} /> Sign In &amp; Auth UI <ChevronRight size={16} />
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-5">
                <span className="px-3 py-1.5 rounded-lg border border-white/10 bg-slate-900/80 text-xs font-mono text-slate-300 flex items-center gap-2">
                  <Zap size={14} className="text-amber-400" /> React 18 + WebGL Fast 60FPS
                </span>
                <span className="px-3 py-1.5 rounded-lg border border-white/10 bg-slate-900/80 text-xs font-mono text-slate-300 flex items-center gap-2">
                  <BrainCircuit size={14} className="text-sky-400" /> Multimodal Vision AI Diagnostics
                </span>
                <span className="px-3 py-1.5 rounded-lg border border-white/10 bg-slate-900/80 text-xs font-mono text-slate-300 flex items-center gap-2">
                  <Lock size={14} className="text-emerald-400" /> HIPAA-Compliant Architecture
                </span>
              </div>
            </div>

            {/* Interactive Visual Heart Telemetry Card */}
            <div className="hero-risk-card">
              <InteractiveHeartWidget />
            </div>
          </section>
        </main>
      </div>

      {/* Signal Band Ticker */}
      <div className="px-4 max-w-7xl mx-auto">
        <section className="signal-band scroll-reveal">
          <div className="signal-lead">
            <p className="font-mono text-xs text-sky-400 font-bold uppercase tracking-wider mb-1">
              CLINICAL CAPABILITIES
            </p>
            <strong className="text-xl font-bold text-white">
              End-to-End Cardiovascular Suite.<br />
              <em className="text-sky-400 font-sans font-normal">Real-time risk scoring, 3D heart rendering &amp; AI diagnostic tools.</em>
            </strong>
          </div>
          <div className="signal-stat">
            <strong>10-YR</strong>
            <span>CVD Risk Engine</span>
          </div>
          <div className="signal-stat">
            <strong>38 / 62</strong>
            <span>Unified Split View</span>
          </div>
          <div className="signal-stat">
            <strong>100%</strong>
            <span>HIPAA-Safe Design</span>
          </div>
        </section>
      </div>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16 scroll-reveal" id="features">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs text-sky-400 font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20">
            SYSTEM ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-4">
            Built for Modern Cardiology &amp; Clinical Workflow
          </h2>
          <p className="text-sm text-slate-400 font-sans">
            Modular components designed for seamless medical data integration, dynamic vitals analysis, and instant diagnostic summary reporting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cardioFeatures.map((feat) => (
            <div key={feat.id} className="glass-card p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] text-sky-400 font-bold tracking-widest uppercase">
                  {feat.badge}
                </span>
                <h3 className="text-xl font-bold text-white mt-2 mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {feat.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-sky-300">
                <button onClick={onNavigateToDashboard} className="hover:underline flex items-center gap-1.5 cursor-pointer">
                  <span>Open Tool</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action Card */}
      <section className="max-w-5xl mx-auto px-6 py-16 scroll-reveal">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to explore the 3D Heart Studio?
          </h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto mb-8 font-sans">
            Experience our interactive 3D heart model, real-time vitals sliders, and AI clinical assistant right now.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onNavigateToDashboard}
              className="h-12 px-8 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-all shadow-xl shadow-sky-500/20 active:scale-95 cursor-pointer"
            >
              <LayoutDashboard size={16} /> Open Workspace <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onNavigateToLanding={() => {}} onNavigateToDashboard={onNavigateToDashboard} />
    </div>
  );
}

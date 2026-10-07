import React from "react";
import BrandLogo from "./BrandLogo";

export default function Footer({ onNavigateToLanding, onNavigateToDashboard }) {
  return (
    <footer className="border-t border-white/10 bg-[#060911] py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <BrandLogo showText={true} title="CARDIOVISION" subtitle="CLINICAL AI PLATFORM" />
          <p className="text-xs text-slate-400 mt-4 leading-relaxed font-sans">
            Next-generation 3D cardiovascular visualization, Framingham &amp; ASCVD risk engine, and multimodal AI diagnostic suite for modern cardiology.
          </p>
        </div>

        <div>
          <h4 className="font-mono text-xs text-sky-400 font-bold uppercase tracking-wider mb-4">
            Clinical Tools
          </h4>
          <ul className="space-y-2 text-xs text-slate-300 font-sans">
            <li><button onClick={onNavigateToDashboard} className="hover:text-sky-300 transition-colors text-left">3D Anatomical Heart Canvas</button></li>
            <li><button onClick={onNavigateToDashboard} className="hover:text-sky-300 transition-colors text-left">Framingham 10-Yr Risk Engine</button></li>
            <li><button onClick={onNavigateToDashboard} className="hover:text-sky-300 transition-colors text-left">Gemini Multimodal Vision AI</button></li>
            <li><button onClick={onNavigateToDashboard} className="hover:text-sky-300 transition-colors text-left">Clinical Report PDF Exporter</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-xs text-sky-400 font-bold uppercase tracking-wider mb-4">
            Platform &amp; Standards
          </h4>
          <ul className="space-y-2 text-xs text-slate-300 font-sans">
            <li><a href="#" className="hover:text-sky-300 transition-colors">HIPAA Compliance Architecture</a></li>
            <li><a href="#" className="hover:text-sky-300 transition-colors">ACC/AHA Guideline Reference</a></li>
            <li><a href="#" className="hover:text-sky-300 transition-colors">Framingham Heart Study Formulas</a></li>
            <li><a href="#" className="hover:text-sky-300 transition-colors">Vite + WebGL 60 FPS Engine</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-xs text-sky-400 font-bold uppercase tracking-wider mb-4">
            System Operational Status
          </h4>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            AI Diagnostics Online
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-mono">
            v2.4.0 · Precision Cardiology Edition
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono text-slate-500">
        <div>© 2026 CardioVision AI Health Suite. All rights reserved.</div>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Clinical Terms</a>
          <a href="#" className="hover:text-white transition-colors">Security Audit</a>
        </div>
      </div>
    </footer>
  );
}

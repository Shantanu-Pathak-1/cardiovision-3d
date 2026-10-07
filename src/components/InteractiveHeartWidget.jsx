import React, { useState, useEffect } from "react";
import { Activity, Heart, ShieldAlert, Zap, Radio } from "lucide-react";

export default function InteractiveHeartWidget() {
  const [activeChamber, setActiveChamber] = useState("Left Ventricle");
  const [bpm, setBpm] = useState(72);

  // Pulse oscillation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBpm(Math.floor(70 + Math.random() * 8));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const chambers = [
    { id: "LV", name: "Left Ventricle", risk: "34%", status: "ELEVATED RISK", flow: "1.2 L/min", color: "text-amber-400" },
    { id: "LAD", name: "Coronary Artery (LAD)", risk: "68%", status: "HIGH STENOSIS", flow: "0.4 L/min", color: "text-rose-400" },
    { id: "RA", name: "Right Atrium", risk: "12%", status: "NORMAL", flow: "2.1 L/min", color: "text-emerald-400" },
  ];

  const current = chambers.find(c => c.name === activeChamber) || chambers[0];

  return (
    <div className="rounded-2xl border border-sky-500/20 bg-slate-900/90 p-4 sm:p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

      {/* Header telemetry band */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
          <span className="font-mono text-xs text-sky-300 font-semibold tracking-wider uppercase flex items-center gap-1.5">
            <Activity size={14} className="text-sky-400" /> LIVE CARDIAC TELEMETRY
          </span>
        </div>
        <div className="flex gap-1">
          {chambers.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveChamber(c.name)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                activeChamber === c.name
                  ? "bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {c.id}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Cardiac Visual Canvas */}
      <div className="relative z-10 my-4 h-56 rounded-xl bg-[#070b14] border border-sky-500/15 overflow-hidden flex items-center justify-center p-3">
        <svg className="w-full h-full opacity-90" viewBox="0 0 400 200">
          <defs>
            <radialGradient id="heartGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#f43f5e" stopOpacity="0.2" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background ECG Grid Waveform */}
          <path 
            d="M 10,100 L 70,100 L 85,60 L 100,140 L 115,80 L 130,110 L 145,100 L 250,100 L 265,50 L 280,150 L 295,70 L 310,115 L 325,100 L 390,100" 
            fill="none" 
            stroke="#38bdf8" 
            strokeWidth="2" 
            strokeDasharray="6,6"
            className="opacity-40 animate-pulse" 
          />

          {/* Animated Glowing Chamber Nodes */}
          <circle cx="200" cy="100" r="50" fill="url(#heartGlow)" />
          
          {/* Anatomical Heart Contour Mockup */}
          <path 
            d="M 200,65 C 170,35 125,70 150,115 C 170,140 200,165 200,165 C 200,165 230,140 250,115 C 275,70 230,35 200,65 Z" 
            fill="none" 
            stroke="#f43f5e" 
            strokeWidth="2.5" 
            strokeDasharray="4,2"
            className="animate-pulse"
          />

          <circle cx="200" cy="115" r="7" fill="#ef4444" className="animate-ping" />
          <circle cx="200" cy="115" r="5" fill="#ffffff" />
          
          <circle cx="165" cy="85" r="4" fill="#38bdf8" />
          <circle cx="235" cy="85" r="4" fill="#fbbf24" />

          {/* Active Chamber Tag */}
          <text x="215" y="120" fill="#f8fafc" fontSize="11" fontFamily="monospace" fontWeight="bold">
            {current.name} [{current.risk}]
          </text>
        </svg>

        {/* Live BPM Badge Overlay */}
        <div className="absolute top-3 right-3 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-sky-400/30 text-xs font-mono text-sky-300 flex items-center gap-1.5 shadow-lg">
          <Heart size={14} className="text-rose-500 fill-rose-500 animate-bounce" /> 
          <span className="font-bold text-white">{bpm}</span> <span className="text-[10px] text-slate-400">BPM</span>
        </div>

        <div className="absolute bottom-3 left-3 bg-slate-900/90 px-3 py-1.5 rounded-lg border border-white/10 text-[11px] font-mono text-sky-300 flex items-center gap-2">
          <Radio size={14} className="text-emerald-400" /> WebGL 3D Model Attached
        </div>
      </div>

      {/* Stats Widget Footer */}
      <div className="relative z-10 grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center font-mono">
        <div className="bg-white/5 p-2 rounded-lg">
          <div className="text-[10px] text-slate-400">ISCHEMIC RISK</div>
          <div className={`text-sm font-bold ${current.color}`}>{current.risk}</div>
        </div>
        <div className="bg-white/5 p-2 rounded-lg">
          <div className="text-[10px] text-slate-400">CORONARY FLOW</div>
          <div className="text-sm font-bold text-sky-300">{current.flow}</div>
        </div>
        <div className="bg-white/5 p-2 rounded-lg">
          <div className="text-[10px] text-slate-400">DIAGNOSIS</div>
          <div className="text-[11px] font-bold text-emerald-400 mt-0.5 truncate">{current.status}</div>
        </div>
      </div>
    </div>
  );
}

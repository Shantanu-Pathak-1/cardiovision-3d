import React, { useState, useRef, useEffect } from "react";
import { ArrowUpRight, LogIn, LogOut, Sparkles, User, ChevronDown, LayoutDashboard } from "lucide-react";
import BrandLogo from "./BrandLogo";

export default function Navbar({
  onNavigateToLogin,
  onNavigateToLanding,
  onNavigateToDashboard,
  isAuthenticated = false,
  userRole = "Cardiologist",
  userName = "Dr. Alex Vance",
  onLogout
}) {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setIsAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="topbar">
      <div 
        onClick={onNavigateToLanding}
        className="brand-lockup flex items-center gap-3.5 group cursor-pointer"
      >
        <BrandLogo showText={true} title="CARDIOVISION" subtitle="3D HEALTH & AI SUITE" />
      </div>

      {/* Nav Links */}
      <nav className="hidden md:flex items-center gap-7">
        <a 
          href="#overview" 
          onClick={onNavigateToLanding} 
          className="text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-sky-400 transition-colors"
        >
          Overview
        </a>
        <a 
          href="#features" 
          onClick={onNavigateToLanding} 
          className="text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-sky-400 transition-colors"
        >
          Features
        </a>
        <button 
          onClick={onNavigateToDashboard} 
          className="text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-sky-400 transition-colors cursor-pointer"
        >
          3D Heart Viewer
        </button>
        <button 
          onClick={onNavigateToDashboard} 
          className="text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-sky-400 transition-colors cursor-pointer"
        >
          Risk Engine
        </button>
      </nav>

      <div className="top-actions flex items-center gap-3 relative" ref={accountMenuRef}>
        <button
          onClick={onNavigateToDashboard}
          className="h-9 px-3.5 rounded-lg bg-sky-500/10 border border-sky-400/30 hover:bg-sky-500/20 text-sky-300 font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
        >
          <LayoutDashboard size={14} /> Launch Workspace
        </button>

        {!isAuthenticated ? (
          <button
            onClick={onNavigateToLogin}
            className="h-9 px-4 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-sky-500/25 active:scale-95 cursor-pointer"
          >
            <LogIn size={14} /> Sign In
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className="h-9 px-3 rounded-lg bg-slate-900 border border-sky-500/40 text-sky-300 font-mono text-xs font-semibold flex items-center gap-2 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <User size={14} />
              <span className="max-w-[110px] truncate">{userName}</span>
              <ChevronDown size={14} />
            </button>

            {isAccountOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-xl bg-slate-900 border border-sky-500/30 shadow-2xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-2 border-b border-white/10 mb-1">
                  <div className="text-xs font-bold text-white truncate">{userName}</div>
                  <div className="text-[10px] font-mono text-sky-400 uppercase tracking-wider">{userRole}</div>
                </div>

                <button
                  onClick={() => {
                    setIsAccountOpen(false);
                    onNavigateToDashboard();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-mono text-slate-200 hover:bg-white/5 flex items-center gap-2 transition-colors cursor-pointer mb-1"
                >
                  <LayoutDashboard size={14} className="text-sky-400" /> Open 3D Heart Studio
                </button>

                <button
                  onClick={() => {
                    setIsAccountOpen(false);
                    onLogout?.();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-mono text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

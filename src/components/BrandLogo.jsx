import React from "react";
import { Heart, Activity } from "lucide-react";

export default function BrandLogo({
  className = "",
  size = 38,
  showText = true,
  title = "CARDIOVISION",
  subtitle = "3D HEALTH SUITE",
  onClick
}) {
  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {/* SVG Emblem */}
      <div 
        style={{ width: size, height: size }} 
        className="shrink-0 rounded-xl bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-700 flex items-center justify-center p-2 shadow-[0_0_18px_rgba(56,189,248,0.4)] relative border border-sky-400/30"
      >
        <Heart className="w-full h-full text-white fill-sky-200/20 stroke-[2.2]" />
        <Activity className="absolute inset-0 m-auto w-1/2 h-1/2 text-sky-200 animate-pulse stroke-[2.5]" />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-base font-bold tracking-wider text-white font-sans">
              {title}
            </span>
            <span className="text-xs font-mono font-bold tracking-wider text-sky-400">
              .AI
            </span>
          </div>
          <span className="text-[9px] font-mono text-sky-400/80 tracking-wider mt-1 uppercase">
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
}

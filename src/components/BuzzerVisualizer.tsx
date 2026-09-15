import React from "react";
import { Volume2, Zap, ShieldCheck } from "lucide-react";

interface BuzzerVisualizerProps {
  isBuzzing?: boolean;
  selectedVoltage: "24V AC/DC" | "230V AC";
}

export const BuzzerVisualizer: React.FC<BuzzerVisualizerProps> = ({
  isBuzzing = false,
  selectedVoltage,
}) => {
  return (
    <div
      id="buzzer-visualizer"
      className="relative flex flex-col items-center justify-center p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden"
    >
      {/* Sound waves animation when buzzing */}
      {isBuzzing && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="absolute w-44 h-44 rounded-full border-2 border-amber-400/40 animate-ping opacity-75" />
          <div className="absolute w-56 h-56 rounded-full border-2 border-amber-500/30 animate-pulse" />
          <div className="absolute w-72 h-72 rounded-full border border-amber-500/20" />
        </div>
      )}

      {/* Floating Badges */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold">
        <Volume2 className="w-3.5 h-3.5" />
        <span>84 dB(A) @ 1m</span>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>IP65 Water/Dust</span>
      </div>

      {/* Industrial Buzzer Render */}
      <div className="relative my-4 flex items-center justify-center">
        {/* Outer Panel Face Ring (Black Polycarbonate) */}
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 p-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.8)] border border-slate-600 flex items-center justify-center relative">
          {/* Ring Screws / Textured Bezel */}
          <div className="absolute inset-1 rounded-full border border-dashed border-slate-600/50" />

          {/* Auer Signal Brand and Spec Engraving on Bezel */}
          <div className="absolute top-2.5 text-[9px] uppercase tracking-widest font-mono text-slate-400 font-bold">
            AUER SIGNAL
          </div>
          <div className="absolute bottom-2.5 text-[9px] uppercase tracking-wider font-mono text-amber-400 font-semibold">
            {selectedVoltage} • 84 dB
          </div>

          {/* Rubber Gasket Rim (IP65) */}
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-gradient-to-b from-slate-900 to-black p-3 flex items-center justify-center border-2 border-slate-700 shadow-inner">
            {/* Acoustic Acoustic Chamber / Grille */}
            <div
              className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-slate-950 via-zinc-900 to-slate-900 p-3 flex flex-col items-center justify-center border border-slate-800 transition-colors duration-300 ${
                isBuzzing
                  ? "shadow-[0_0_25px_rgba(245,158,11,0.5)] border-amber-500/60"
                  : ""
              }`}
            >
              {/* Radial Grille Openings for 84 dB Acoustic Emission */}
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Concentric sound slots */}
                <div className="absolute w-28 h-28 rounded-full border border-slate-700/60" />
                <div className="absolute w-20 h-20 rounded-full border border-slate-700/60" />
                <div className="absolute w-12 h-12 rounded-full border border-slate-700/60" />

                {/* Piezo Central Diaphragm */}
                <div
                  className={`w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center ${
                    isBuzzing
                      ? "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.9)] scale-110"
                      : "bg-gradient-to-br from-zinc-700 to-zinc-900 border border-zinc-600"
                  }`}
                >
                  <Volume2
                    className={`w-5 h-5 ${
                      isBuzzing ? "text-slate-950 animate-bounce" : "text-zinc-400"
                    }`}
                  />
                </div>

                {/* Slotted radial vent lines */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <div
                    key={deg}
                    className="absolute w-full h-0.5 bg-slate-800/80 pointer-events-none"
                    style={{ transform: `rotate(${deg}deg)` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mounting & Specs Footer */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
        <span className="flex items-center gap-1 font-mono">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          Cutout: Ø 22.5 mm (M22)
        </span>
        <span className="text-slate-600">•</span>
        <span className="flex items-center gap-1 font-mono text-cyan-400">
          <Zap className="w-3.5 h-3.5" />
          {selectedVoltage === "24V AC/DC"
            ? "24V AC/DC (18-30V)"
            : "230V AC (115-230V)"}
        </span>
        <span className="text-slate-600">•</span>
        <span className="font-mono text-emerald-400">Finger-Safe Terminals</span>
      </div>
    </div>
  );
};

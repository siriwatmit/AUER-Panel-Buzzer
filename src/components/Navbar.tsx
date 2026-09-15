import React from "react";
import {
  Volume2,
  Phone,
  ShoppingCart,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface NavbarProps {
  onOpenOrderModal: () => void;
  onQuickTTSOverview: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenOrderModal,
  onQuickTTSOverview,
}) => {
  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-base shadow-lg shadow-amber-500/20">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white font-sans">
                AUER SIGNAL
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Austria 1910
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Panel Buzzer 84 dB • 24V & 230V
            </p>
          </div>
        </div>

        {/* Feature Badges for Quick Reference */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-white">84 dB</span>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>24V AC/DC & 230V AC</span>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>IP65 ติดตั้งง่าย ปลอดภัย</span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            id="nav-btn-tts-listen"
            onClick={onQuickTTSOverview}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-800 hover:border-slate-700 transition-colors shadow-sm"
            title="ฟังเสียงบรรยายด้วย Gemini 3.1 Flash TTS"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">ฟังเสียง AI TTS</span>
          </button>

          <button
            id="nav-btn-order-now"
            onClick={onOpenOrderModal}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all transform active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>สั่งซื้อได้เลย</span>
          </button>
        </div>
      </div>
    </header>
  );
};

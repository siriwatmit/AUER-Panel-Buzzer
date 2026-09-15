import React, { useState, useRef } from "react";
import { Navbar } from "./components/Navbar";
import { ProductHero } from "./components/ProductHero";
import { TTSPlayerBar } from "./components/TTSPlayerBar";
import { BuzzerAcousticDemo } from "./components/BuzzerAcousticDemo";
import { TechnicalSpecs } from "./components/TechnicalSpecs";
import { InstallationGuide } from "./components/InstallationGuide";
import { OrderFormModal } from "./components/OrderFormModal";
import {
  Volume2,
  Zap,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Phone,
  Mail,
  Award,
  CheckCircle,
} from "lucide-react";
import { PRODUCT_MODELS } from "./data/productData";

export default function App() {
  const [selectedVoltage, setSelectedVoltage] = useState<"24V AC/DC" | "230V AC">("24V AC/DC");
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [isBuzzing, setIsBuzzing] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeTTSScriptId, setActiveTTSScriptId] = useState<string | null>(null);

  const acousticDemoRef = useRef<HTMLDivElement>(null);
  const ttsPanelRef = useRef<HTMLDivElement>(null);

  const scrollToSoundDemo = () => {
    acousticDemoRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTTS = () => {
    ttsPanelRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleTriggerTTS = (scriptId: string) => {
    setActiveTTSScriptId(scriptId);
    scrollToTTS();
  };

  const currentModel =
    PRODUCT_MODELS.find((m) => m.voltage === selectedVoltage) ||
    PRODUCT_MODELS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        onOpenOrderModal={() => setIsOrderModalOpen(true)}
        onQuickTTSOverview={() => handleTriggerTTS("overview")}
      />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        {/* 1. Hero Showcase */}
        <ProductHero
          selectedVoltage={selectedVoltage}
          onVoltageChange={setSelectedVoltage}
          onOpenOrderModal={() => setIsOrderModalOpen(true)}
          onTriggerTTS={handleTriggerTTS}
          onScrollToSoundDemo={scrollToSoundDemo}
          isBuzzing={isBuzzing || isSpeaking}
        />

        {/* 2. Text-to-Speech Engine (Gemini 3.1 Flash TTS Preview) */}
        <div ref={ttsPanelRef} className="scroll-mt-20">
          <TTSPlayerBar
            onSpeakingChange={setIsSpeaking}
            externalTriggerScriptId={activeTTSScriptId}
          />
        </div>

        {/* 3. 84 dB Acoustic Simulation & Tone Tester */}
        <div ref={acousticDemoRef} className="scroll-mt-20">
          <BuzzerAcousticDemo
            onBuzzerStateChange={setIsBuzzing}
            onTriggerTTS={handleTriggerTTS}
          />
        </div>

        {/* 4. Technical Specifications & Voltage Guide */}
        <TechnicalSpecs onTriggerTTS={handleTriggerTTS} />

        {/* 5. Easy & Safe Installation Guide */}
        <InstallationGuide onTriggerTTS={handleTriggerTTS} />

        {/* 6. Instant Order Banner CTA */}
        <section
          id="order-cta-banner"
          className="relative rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-900 border border-amber-500/40 p-6 sm:p-8 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              <Award className="w-3.5 h-3.5" />
              <span>สินค้า Auer Signal ของแท้ 100% รับประกัน 1 ปี</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              พร้อมติดตั้งในตู้คอนโทรลของคุณ สั่งซื้อได้ทันที!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              รองรับทั้งรุ่น 24V AC/DC (฿890) และ 230V AC (฿990) ส่งด่วนถึงหน้างานทั่วประเทศไทย 
              พร้อมใบกำกับภาษีเต็มรูปแบบ
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              id="cta-bottom-order-btn"
              onClick={() => setIsOrderModalOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>สั่งซื้อ Auer Buzzer ทันที</span>
            </button>
          </div>
        </section>
      </main>

      {/* Sticky Mobile Quick-Order Bar */}
      <div className="md:hidden sticky bottom-0 z-30 bg-slate-950/95 backdrop-blur border-t border-slate-800 p-3 px-4 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <div className="text-[11px] text-slate-400">รุ่น {selectedVoltage} (84 dB)</div>
          <div className="text-base font-bold text-amber-400 font-mono">
            ฿{currentModel.priceTHB.toLocaleString()}
          </div>
        </div>

        <button
          onClick={() => setIsOrderModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/30"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>สั่งซื้อได้เลย</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-12 bg-slate-950 border-t border-slate-900 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-semibold text-slate-400">
              Auer Signal Industrial Acoustic Panel Buzzer
            </span>
            <span>• 84 dB • 24VAC/DC & 230VAC</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Gemini 3.1 Flash TTS Preview</span>
            <span>•</span>
            <span>มาตรฐาน CE / IP65 / VDE</span>
          </div>
        </div>
      </footer>

      {/* Order Modal */}
      <OrderFormModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        initialModelId={currentModel.id}
      />
    </div>
  );
}

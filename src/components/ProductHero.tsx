import React from "react";
import {
  Volume2,
  Zap,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Radio,
  Sliders,
} from "lucide-react";
import { PRODUCT_MODELS } from "../data/productData";
import { BuzzerVisualizer } from "./BuzzerVisualizer";

interface ProductHeroProps {
  selectedVoltage: "24V AC/DC" | "230V AC";
  onVoltageChange: (voltage: "24V AC/DC" | "230V AC") => void;
  onOpenOrderModal: (modelId?: string) => void;
  onTriggerTTS: (scriptId: string) => void;
  onScrollToSoundDemo: () => void;
  isBuzzing?: boolean;
}

export const ProductHero: React.FC<ProductHeroProps> = ({
  selectedVoltage,
  onVoltageChange,
  onOpenOrderModal,
  onTriggerTTS,
  onScrollToSoundDemo,
  isBuzzing = false,
}) => {
  const currentModel =
    PRODUCT_MODELS.find((m) => m.voltage === selectedVoltage) ||
    PRODUCT_MODELS[0];

  return (
    <section id="product-hero-section" className="relative py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Information & Selection */}
        <div className="lg:col-span-7 space-y-6">
          {/* Badge Ribbon */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
              <Volume2 className="w-3.5 h-3.5" />
              เสียงดังระดับ 84 dB(A) ชัดเจน
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              รองรับ 24VAC/DC & 230VAC
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              ติดตั้งง่าย ปลอดภัย IP65
            </span>
          </div>

          {/* Main Title */}
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Panel Buzzer จาก Auer <br />
              <span className="text-amber-400">เสียงดังคมชัด 84 dB</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              ออดเตือนภัยติดหน้าตู้สวิตช์บอร์ดคุณภาพพรีเมียมจาก Auer Signal ประเทศออสเตรีย 
              รองรับไฟเลี้ยงทั้งแบบ <strong>24V AC/DC</strong> และ <strong>230V AC</strong> ต่อตรง 
              ติดตั้งง่ายด้วยช่องเจาะมาตรฐาน M22 (Ø 22.5 mm) ปลอดภัยด้วยขั้วต่อ Finger-proof พร้อมสั่งซื้อได้เลยทันที
            </p>
          </div>

          {/* Voltage Selector Toggle */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                เลือกรุ่นไฟเลี้ยง (Voltage Variant):
              </span>
              <span className="text-xs text-emerald-400 font-medium">
                พร้อมส่งทั้ง 2 รุ่น
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="select-voltage-24v"
                onClick={() => onVoltageChange("24V AC/DC")}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedVoltage === "24V AC/DC"
                    ? "bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="font-bold text-sm text-white flex items-center justify-between">
                  <span>24V AC/DC</span>
                  <span className="text-amber-400 font-mono">฿890</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  แรงดันต่ำ 18-30V สำหรับ PLC/Automation
                </div>
              </button>

              <button
                type="button"
                id="select-voltage-230v"
                onClick={() => onVoltageChange("230V AC")}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  selectedVoltage === "230V AC"
                    ? "bg-amber-500/15 border-amber-500 text-white shadow-lg shadow-amber-500/10"
                    : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="font-bold text-sm text-white flex items-center justify-between">
                  <span>230V AC</span>
                  <span className="text-amber-400 font-mono">฿990</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  ไฟเมน 115-230V ต่อตรงไม่ต้องใช้หม้อแปลง
                </div>
              </button>
            </div>
          </div>

          {/* Quick Key Features Bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>ความดัง 84 dB(A) ที่ระยะ 1 เมตร</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>ขนาดเจาะรูมาตรฐาน Ø 22.5 mm (M22)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>กันน้ำกันฝุ่น IP65 หน้าตู้</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>ขั้วต่อสาย Finger-Safe IP20 ปลอดภัย</span>
            </div>
          </div>

          {/* Price & Primary CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <div>
              <div className="text-[11px] text-slate-400">ราคาพิเศษ (รวมส่ง):</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-amber-400 font-mono">
                  ฿{currentModel.priceTHB.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 line-through font-mono">
                  ฿{currentModel.originalPriceTHB.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                id="hero-order-button"
                onClick={() => onOpenOrderModal(currentModel.id)}
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>สั่งซื้อได้เลยทันที</span>
              </button>

              <button
                id="hero-sound-test-button"
                onClick={onScrollToSoundDemo}
                className="px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs flex items-center gap-2 border border-slate-700 transition-colors"
              >
                <Radio className="w-4 h-4 text-amber-400" />
                <span>ทดสอบเสียง 84 dB</span>
              </button>

              <button
                id="hero-tts-overview-button"
                onClick={() => onTriggerTTS("overview")}
                className="px-4 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-semibold text-xs flex items-center gap-2 border border-amber-500/30 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>ฟังเสียงแนะนำ (AI TTS)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Visualizer & Live Acoustic Display */}
        <div className="lg:col-span-5">
          <BuzzerVisualizer
            isBuzzing={isBuzzing}
            selectedVoltage={selectedVoltage}
          />
        </div>
      </div>
    </section>
  );
};

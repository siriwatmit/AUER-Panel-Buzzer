import React from "react";
import {
  Zap,
  Volume2,
  Shield,
  Layers,
  Settings,
  Cpu,
  CheckCircle,
  HelpCircle,
  FileText,
} from "lucide-react";
import { TECHNICAL_SPECIFICATIONS } from "../data/productData";

interface TechnicalSpecsProps {
  onTriggerTTS?: (scriptId: string) => void;
}

export const TechnicalSpecs: React.FC<TechnicalSpecsProps> = ({
  onTriggerTTS,
}) => {
  return (
    <div
      id="technical-specifications"
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">
              ข้อมูลทางเทคนิค (Technical Specifications)
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              มาตรฐาน Auer Signal
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            สเปกมาตรฐานอุตสาหกรรมยุโรป IEC/EN 60947 สำหรับตู้คอนโทรลและแผงสวิตช์บอร์ด
          </p>
        </div>

        <button
          onClick={() => onTriggerTTS && onTriggerTTS("voltage_support")}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>ฟังคำอธิบายระบบไฟ 24V / 230V</span>
        </button>
      </div>

      {/* Voltage Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Model 24V AC/DC */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              รุ่น 24V AC/DC
            </span>
            <span className="text-xs font-mono text-slate-400">Art. No. 814.500.405</span>
          </div>
          <h4 className="text-white font-semibold text-sm mb-1">
            รองรับไฟเลี้ยง 24V AC หรือ 24V DC ในตัวเดียว
          </h4>
          <p className="text-xs text-slate-400 mb-3">
            เหมาะสำหรับตู้ควบคุม PLC, Automation, เซ็นเซอร์ และระบบควบคุมแรงดันต่ำทั่วไป
          </p>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>แรงดันใช้งานกว้าง: 18 - 30 V AC/DC</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>กินกระแสต่ำเพียง 20 mA ปลอดภัยไม่โหลดเพาเวอร์ซัพพลาย</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>ขั้วต่อแบบ Screw Clamp ไม่สลับขั้ว (Bi-polar safe)</span>
            </div>
          </div>
        </div>

        {/* Model 230V AC */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              รุ่น 230V AC
            </span>
            <span className="text-xs font-mono text-slate-400">Art. No. 814.500.313</span>
          </div>
          <h4 className="text-white font-semibold text-sm mb-1">
            ต่อตรงไฟเมน 230V AC ไม่ต้องใช้เพาเวอร์ซัพพลาย
          </h4>
          <p className="text-xs text-slate-400 mb-3">
            เหมาะสำหรับตู้ MDB, ตู้เมนเบรกเกอร์, ปั๊มน้ำ, อาคาร และเครื่องจักรอุตสาหกรรม
          </p>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>แรงดันใช้งาน: 115 - 230 V AC (50/60 Hz)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>ลดต้นทุนติดตั้ง ไม่ต้องเดินสาย Power Supply เพิ่ม</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>มีฝาครอบฉนวนกันสัมผัสตามมาตรฐาน Finger-proof IP20</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <tbody className="divide-y divide-slate-800">
            {TECHNICAL_SPECIFICATIONS.map((spec, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-slate-950/40" : "bg-slate-900/40"}
              >
                <td className="py-3 px-4 font-medium text-slate-400 w-1/3 border-r border-slate-800/80">
                  {spec.label}
                </td>
                <td className="py-3 px-4 font-mono font-medium text-white">
                  {spec.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import React from "react";
import {
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  AlertOctagon,
  ArrowRight,
  Disc,
} from "lucide-react";

interface InstallationGuideProps {
  onTriggerTTS?: (scriptId: string) => void;
}

export const InstallationGuide: React.FC<InstallationGuideProps> = ({
  onTriggerTTS,
}) => {
  const steps = [
    {
      step: 1,
      title: "เจาะรูหน้าตู้คอนโทรล Ø 22.5 mm (M22)",
      desc: "ใช้หัวเจาะโฮลซอว์ขนาดมาตรฐาน 22.5 มม. ตรงกับช่องสวิตช์ปุ่มกดอุตสาหกรรมทั่วไป โดยไม่ต้องดัดแปลงตู้",
      tip: "แนะนำให้ทำความสะอาดเศษเหล็กขอบรูเพื่อการแนบสนิทของซีลยาง",
    },
    {
      step: 2,
      title: "สวมยางซีลกันน้ำ EPDM (IP65 Seal)",
      desc: "สวมแหวนยางกันน้ำด้านหน้าตู้ เพื่อป้องกันน้ำกระเซ็น ฝุ่นผง และความชื้นเข้าสู่ภายในตู้คอนโทรล",
      tip: "ซีลยาง EPDM คุณภาพสูงทนทานต่อสารเคมีและแสงแดด",
    },
    {
      step: 3,
      title: "สวมบัซเซอร์เข้าหน้าตู้ และขันแหวนล็อคด้านหลัง",
      desc: "ร้อยตัวบัซเซอร์เข้าจากหน้าตู้ จากนั้นขันแหวนล็อคพลาสติก (Fixing Nut M22) ด้านหลังด้วยมือให้แน่นตึง",
      tip: "มีร่องบากกันหมุน (Anti-rotation notch) ป้องกันการหมุนตามขณะขัน",
    },
    {
      step: 4,
      title: "เข้าสายไฟขั้วสกรูนิรภัย (Finger-Safe IP20)",
      desc: "สอดสายไฟขนาด 0.5-1.5 mm² เข้าขั้วต่อสกรูนิรภัย ขันสกรูให้แน่น ปลอดภัยไร้กังวลเรื่องไฟรั่วหรือการสัมผัสโดนขั้วเปลือย",
      tip: "สำหรับรุ่น 24V ไม่ต้องกังวลขั้วบวกลบ / รุ่น 230V ต่อ L และ N ได้โดยตรง",
    },
  ];

  return (
    <div
      id="installation-guide"
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">
              คู่มือการติดตั้งที่ง่ายและปลอดภัย (Easy & Safe Installation)
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Finger-Safe & IP65
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            ติดตั้งเสร็จได้ใน 4 ขั้นตอน ใช้เวลาไม่เกิน 3 นาที ปลอดภัยตามมาตรฐานสากล
          </p>
        </div>

        <button
          onClick={() => onTriggerTTS && onTriggerTTS("installation")}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>ฟังคำอธิบายขั้นตอนการติดตั้ง</span>
        </button>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {steps.map((item) => (
          <div
            key={item.step}
            className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shadow-md shadow-amber-500/20">
                  {item.step}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  STEP {item.step}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white mb-2 leading-snug">
                {item.title}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-amber-300/80 flex items-start gap-1">
              <span className="font-semibold text-amber-400 shrink-0">Tip:</span>
              <span>{item.tip}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Safety Notice Box */}
      <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs">
          <div className="font-semibold text-emerald-300 mb-1">
            มาตรฐานความปลอดภัยสูงสุด (Safe Installation Guarantee)
          </div>
          <p className="text-slate-300 leading-relaxed">
            ตัวเรือนผลิตจากพลาสติกทนความร้อนสูงไม่ลามไฟ (Flame-retardant Polycarbonate V2) 
            ขั้วต่อสกรูมีแผงกั้นฉนวนรอบด้าน ป้องกันนิ้วมือสัมผัสโดนส่วนมีกระแสไฟ (Finger-proof IP20) 
            และด้านหน้าตู้เมื่อติดตั้งพร้อมซีลยางจะได้รับระดับการป้องกันน้ำและฝุ่น IP65 ตามมาตรฐานสากล
          </p>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Play, Square, Activity, AlertTriangle, Radio } from "lucide-react";
import { buzzerSimulator } from "../services/soundSimulator";

interface BuzzerAcousticDemoProps {
  onBuzzerStateChange?: (isBuzzing: boolean) => void;
  onTriggerTTS?: (scriptId: string) => void;
}

export const BuzzerAcousticDemo: React.FC<BuzzerAcousticDemoProps> = ({
  onBuzzerStateChange,
  onTriggerTTS,
}) => {
  const [activeTone, setActiveTone] = useState<"continuous" | "pulsed" | null>(null);
  const [volume, setVolume] = useState<number>(0.5);

  const handleStartTone = (mode: "continuous" | "pulsed") => {
    if (activeTone === mode) {
      buzzerSimulator.stop();
      setActiveTone(null);
      if (onBuzzerStateChange) onBuzzerStateChange(false);
    } else {
      buzzerSimulator.play(mode, volume);
      setActiveTone(mode);
      if (onBuzzerStateChange) onBuzzerStateChange(true);
    }
  };

  const handleStop = () => {
    buzzerSimulator.stop();
    setActiveTone(null);
    if (onBuzzerStateChange) onBuzzerStateChange(false);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    buzzerSimulator.setVolume(newVol);
  };

  useEffect(() => {
    return () => {
      buzzerSimulator.stop();
    };
  }, []);

  return (
    <div
      id="buzzer-acoustic-demo"
      className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-white">
              ทดสอบเสียงบัซเซอร์จริง (Acoustic Sound Demo 84 dB)
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              84 dB(A) @ 1m
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            ความถี่ 2,400 Hz มาตรฐาน Auer Signal เพื่อการเตือนภัยที่ได้ยินเด่นชัดและเจาะทะลุเสียงรบกวนในโรงงาน
          </p>
        </div>

        <button
          onClick={() => onTriggerTTS && onTriggerTTS("sound_feature")}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>ฟังคำอธิบายระดับเสียง 84 dB</span>
        </button>
      </div>

      {/* Interactive Sound Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Continuous Tone */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            activeTone === "continuous"
              ? "bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/10"
              : "bg-slate-800/50 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-semibold text-white text-sm flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400" />
                Continuous Tone (เสียงต่อเนื่อง)
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                ระดับ 84 dB ส่งเสียงเตือนยาวต่อเนื่อง เมื่อเกิดเหตุขัดข้องเร่งด่วน
              </div>
            </div>
          </div>

          <button
            id="btn-tone-continuous"
            onClick={() => handleStartTone("continuous")}
            className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
              activeTone === "continuous"
                ? "bg-rose-600 text-white shadow-md hover:bg-rose-500 animate-pulse"
                : "bg-amber-500 text-slate-950 hover:bg-amber-400"
            }`}
          >
            {activeTone === "continuous" ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>หยุดเสียงต่อเนื่อง (กำลังส่งเสียง 84 dB)</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>ทดลองฟังเสียงต่อเนื่อง (Continuous Tone)</span>
              </>
            )}
          </button>
        </div>

        {/* Pulsed Tone */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            activeTone === "pulsed"
              ? "bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/10"
              : "bg-slate-800/50 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="font-semibold text-white text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-400" />
                Pulsed Tone (เสียงบี๊บเป็นจังหวะ)
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                ความถี่ 2 Hz (บี๊บ 2 ครั้ง/วินาที) สำหรับแจ้งสถานะเครื่องจักรหรือคำเตือน
              </div>
            </div>
          </div>

          <button
            id="btn-tone-pulsed"
            onClick={() => handleStartTone("pulsed")}
            className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
              activeTone === "pulsed"
                ? "bg-rose-600 text-white shadow-md hover:bg-rose-500 animate-pulse"
                : "bg-amber-500 text-slate-950 hover:bg-amber-400"
            }`}
          >
            {activeTone === "pulsed" ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>หยุดเสียงจังหวะ (กำลังส่งเสียงบี๊บ)</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>ทดลองฟังเสียงบี๊บ (Pulsed Tone)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Volume Slider & Decibel Meter */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-amber-400" />
            ระดับความดังจำลองในลำโพงของคุณ:
          </span>
          <span className="font-mono text-white font-bold">
            {Math.round(volume * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0.05"
          max="1"
          step="0.05"
          value={volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />

        {/* Decibel Comparison Chart */}
        <div className="mt-4 pt-4 border-t border-slate-800">
          <div className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            ตารางเปรียบเทียบระดับเสียงจริงในสิ่งแวดล้อม (dB Scale):
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>กระซิบแผ่วเบา / ห้องสมุด</span>
              <span className="font-mono">30 dB</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-slate-600 h-full w-[25%]" />
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span>สำนักงาน / เสียงสนทนาทั่วไป</span>
              <span className="font-mono">60 dB</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-slate-500 h-full w-[50%]" />
            </div>

            {/* Auer Buzzer 84 dB Highlight */}
            <div className="flex items-center justify-between text-amber-300 font-bold bg-amber-500/10 px-2 py-1 rounded">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Auer Panel Buzzer (เสียงดังคมชัด 84 dB)
              </span>
              <span className="font-mono text-sm">84 dB(A)</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-amber-500/40">
              <div className="bg-gradient-to-r from-amber-500 to-amber-300 h-full rounded-full w-[70%]" />
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span>เครื่องจักรหนัก / เครื่องตัดเหล็ก</span>
              <span className="font-mono">95 dB</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500/70 h-full w-[80%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

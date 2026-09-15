import React, { useState, useEffect } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Sparkles,
  RefreshCw,
  Sliders,
  Send,
  CheckCircle2,
  AlertCircle,
  Headphones,
} from "lucide-react";
import { TTS_SCRIPTS } from "../data/productData";
import { ttsService } from "../services/ttsService";

interface TTSPlayerBarProps {
  onSpeakingChange?: (isSpeaking: boolean) => void;
  externalTriggerScriptId?: string | null;
}

export const TTSPlayerBar: React.FC<TTSPlayerBarProps> = ({
  onSpeakingChange,
  externalTriggerScriptId,
}) => {
  const [selectedScriptId, setSelectedScriptId] = useState<string>("overview");
  const [customText, setCustomText] = useState<string>(TTS_SCRIPTS[0].text);
  const [voice, setVoice] = useState<"Kore" | "Puck" | "Charon" | "Fenrir" | "Zephyr">("Kore");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeAudioObj, setActiveAudioObj] = useState<HTMLAudioElement | null>(null);
  const [lastGeneratedSource, setLastGeneratedSource] = useState<"gemini" | "browser" | null>(null);

  // When an external script is requested (e.g. from a card button)
  useEffect(() => {
    if (externalTriggerScriptId) {
      const script = TTS_SCRIPTS.find((s) => s.id === externalTriggerScriptId);
      if (script) {
        setSelectedScriptId(script.id);
        setCustomText(script.text);
        handlePlayText(script.text);
      }
    }
  }, [externalTriggerScriptId]);

  const handleSelectPreset = (scriptId: string) => {
    setSelectedScriptId(scriptId);
    const found = TTS_SCRIPTS.find((s) => s.id === scriptId);
    if (found) {
      setCustomText(found.text);
    }
  };

  const stopPlayback = () => {
    ttsService.stopAll();
    if (activeAudioObj) {
      activeAudioObj.pause();
      setActiveAudioObj(null);
    }
    setIsPlaying(false);
    if (onSpeakingChange) onSpeakingChange(false);
  };

  const handlePlayText = async (textToSpeak: string) => {
    if (!textToSpeak.trim()) return;

    stopPlayback();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Call Gemini TTS endpoint (model: gemini-3.1-flash-tts-preview)
      const result = await ttsService.requestTTS(textToSpeak, voice);
      setLastGeneratedSource(result.source);
      setIsLoading(false);
      setIsPlaying(true);
      if (onSpeakingChange) onSpeakingChange(true);

      const audio = ttsService.playAudioUrl(
        result.audioUrl,
        () => {
          setIsPlaying(false);
          setActiveAudioObj(null);
          if (onSpeakingChange) onSpeakingChange(false);
        },
        (err) => {
          console.warn("Audio playback error, trying browser fallback", err);
          fallbackToBrowserSpeech(textToSpeak);
        }
      );
      setActiveAudioObj(audio);
    } catch (err: any) {
      console.warn("TTS API call failed, falling back to speech synthesis:", err);
      fallbackToBrowserSpeech(textToSpeak);
    }
  };

  const fallbackToBrowserSpeech = (textToSpeak: string) => {
    setIsLoading(false);
    setLastGeneratedSource("browser");
    setIsPlaying(true);
    if (onSpeakingChange) onSpeakingChange(true);

    ttsService.playBrowserFallback(
      textToSpeak,
      () => {
        setIsPlaying(true);
      },
      () => {
        setIsPlaying(false);
        if (onSpeakingChange) onSpeakingChange(false);
      }
    );
  };

  return (
    <div
      id="gemini-tts-control-panel"
      className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100"
    >
      {/* Header with Model Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base text-white">
                ระบบสังเคราะห์เสียง AI Text-to-Speech
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                gemini-3.1-flash-tts-preview
              </span>
            </div>
            <p className="text-xs text-slate-400">
              กดฟังเสียงบรรยายข้อมูล Auer Panel Buzzer 84 dB หรือพิมพ์ข้อความที่ต้องการทดสอบ
            </p>
          </div>
        </div>

        {/* Voice Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5" />
            เสียงพากย์:
          </span>
          <select
            id="tts-voice-selector"
            aria-label="เลือกเสียงพากย์ AI"
            value={voice}
            onChange={(e) =>
              setVoice(
                e.target.value as "Kore" | "Puck" | "Charon" | "Fenrir" | "Zephyr"
              )
            }
            className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
          >
            <option value="Kore">Kore (ธรรมชาติ/นุ่มนวล)</option>
            <option value="Puck">Puck (กระฉับกระเฉง)</option>
            <option value="Zephyr">Zephyr (อบอุ่น/ชัดเจน)</option>
            <option value="Charon">Charon (สุขุม/วิชาการ)</option>
            <option value="Fenrir">Fenrir (ทุ้มลึก/มั่นใจ)</option>
          </select>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="mt-4">
        <div className="text-xs font-medium text-slate-400 mb-2 flex items-center gap-1.5">
          <Headphones className="w-3.5 h-3.5 text-amber-400" />
          หัวข้อบรรยายแนะนำ (คลิกเพื่อฟังเสียงได้ทันที):
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TTS_SCRIPTS.map((script) => {
            const isSelected = selectedScriptId === script.id;
            return (
              <button
                key={script.id}
                id={`tts-preset-${script.id}`}
                onClick={() => {
                  handleSelectPreset(script.id);
                  handlePlayText(script.text);
                }}
                className={`text-left p-2.5 rounded-xl border text-xs transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-amber-500/15 border-amber-500/50 text-amber-200 shadow-sm"
                    : "bg-slate-800/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="font-medium line-clamp-1">{script.tag}</div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {script.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Text Area & Live Player Controls */}
      <div className="mt-4">
        <label
          htmlFor="tts-custom-text-input"
          className="block text-xs text-slate-400 mb-1"
        >
          ข้อความที่กำลังสังเคราะห์เสียง (แก้ไขข้อความได้อิสระ):
        </label>
        <div className="relative">
          <textarea
            id="tts-custom-text-input"
            rows={3}
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="พิมพ์ข้อความที่ต้องการให้ Gemini 3.1 Flash TTS อ่านออกเสียง..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none font-sans"
          />
        </div>

        {/* Action Controls & Sound Wave Animation */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {!isPlaying ? (
              <button
                id="btn-play-tts"
                onClick={() => handlePlayText(customText)}
                disabled={isLoading || !customText.trim()}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-colors"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>กำลังสร้างเสียงด้วย Gemini...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>สังเคราะห์เสียงพูด (TTS)</span>
                  </>
                )}
              </button>
            ) : (
              <button
                id="btn-stop-tts"
                onClick={stopPlayback}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-colors"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>หยุดการเล่นเสียง</span>
              </button>
            )}

            {/* Audio Waveform Indicator */}
            {isPlaying && (
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <span className="w-1 h-3 bg-amber-400 animate-pulse" />
                <span className="w-1 h-5 bg-amber-400 animate-bounce" />
                <span className="w-1 h-2 bg-amber-400 animate-pulse" />
                <span className="w-1 h-4 bg-amber-400 animate-bounce" />
                <span className="text-[11px] text-amber-300 font-mono ml-1">
                  กำลังเล่นเสียง (24 kHz)
                </span>
              </div>
            )}
          </div>

          {/* Status badge */}
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            {lastGeneratedSource === "gemini" ? (
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ขับเคลื่อนด้วย Gemini 3.1 Flash TTS Preview
              </span>
            ) : lastGeneratedSource === "browser" ? (
              <span className="text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                โหมดเสียงสังเคราะห์สำรอง
              </span>
            ) : (
              <span>คลิกเพื่อฟังเสียงบรรยายด้วย AI คุณภาพสูง</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

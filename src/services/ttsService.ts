export interface TTSResponse {
  success: boolean;
  model: string;
  voice: string;
  audioUrl?: string;
  error?: string;
}

class TTSService {
  private currentAudio: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private cache: Map<string, string> = new Map();

  async requestTTS(
    text: string,
    voice: string = "Kore"
  ): Promise<{ audioUrl: string; source: "gemini" | "browser" }> {
    const cacheKey = `${voice}_${text}`;
    if (this.cache.has(cacheKey)) {
      return { audioUrl: this.cache.get(cacheKey)!, source: "gemini" };
    }

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned status ${res.status}`);
      }

      const data: TTSResponse = await res.json();
      if (data.success && data.audioUrl) {
        this.cache.set(cacheKey, data.audioUrl);
        return { audioUrl: data.audioUrl, source: "gemini" };
      }
      throw new Error(data.error || "No audio URL in response");
    } catch (err: any) {
      console.warn("Gemini TTS API error, fallback to browser synthesis:", err);
      // Fallback: throw so UI knows, but provide browser fallback helper
      throw err;
    }
  }

  stopAll() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  playAudioUrl(
    url: string,
    onEnded?: () => void,
    onError?: (err: any) => void
  ): HTMLAudioElement {
    this.stopAll();
    const audio = new Audio(url);
    this.currentAudio = audio;

    audio.onended = () => {
      this.currentAudio = null;
      if (onEnded) onEnded();
    };

    audio.onerror = (e) => {
      this.currentAudio = null;
      if (onError) onError(e);
    };

    audio.play().catch((err) => {
      console.error("Audio playback error:", err);
      if (onError) onError(err);
    });

    return audio;
  }

  playBrowserFallback(
    text: string,
    onStart?: () => void,
    onEnded?: () => void
  ) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    this.stopAll();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "th-TH"; // Default to Thai
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      if (onStart) onStart();
    };
    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnded) onEnded();
    };
    utterance.onerror = () => {
      this.currentUtterance = null;
      if (onEnded) onEnded();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }
}

export const ttsService = new TTSService();

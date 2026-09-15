class BuzzerSoundSimulator {
  private audioCtx: AudioContext | null = null;
  private osc: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private pulseInterval: number | null = null;
  private isRunning: boolean = false;
  private currentMode: "continuous" | "pulsed" | null = null;

  private initCtx() {
    if (!this.audioCtx) {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  play(mode: "continuous" | "pulsed" = "continuous", volume = 0.5) {
    this.stop();
    this.initCtx();
    if (!this.audioCtx) return;

    this.isRunning = true;
    this.currentMode = mode;

    const ctx = this.audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // 2400 Hz is the standard resonant frequency of Auer industrial piezoceramic buzzers
    osc.type = "sine";
    osc.frequency.setValueAtTime(2400, ctx.currentTime);

    // Initial safe gain
    gain.gain.setValueAtTime(volume * 0.4, ctx.currentTime);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    this.osc = osc;
    this.gainNode = gain;

    if (mode === "pulsed") {
      let isOn = true;
      this.pulseInterval = window.setInterval(() => {
        if (!this.gainNode || !this.audioCtx) return;
        isOn = !isOn;
        const targetGain = isOn ? volume * 0.4 : 0.0001;
        this.gainNode.gain.cancelScheduledValues(this.audioCtx.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(
          targetGain,
          this.audioCtx.currentTime + 0.03
        );
      }, 250); // 2 pulses per second
    }
  }

  setVolume(vol: number) {
    if (this.gainNode && this.audioCtx && this.isRunning) {
      this.gainNode.gain.linearRampToValueAtTime(
        vol * 0.4,
        this.audioCtx.currentTime + 0.05
      );
    }
  }

  stop() {
    if (this.pulseInterval) {
      clearInterval(this.pulseInterval);
      this.pulseInterval = null;
    }
    if (this.osc) {
      try {
        this.osc.stop();
        this.osc.disconnect();
      } catch (e) {
        // ignore
      }
      this.osc = null;
    }
    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch (e) {
        // ignore
      }
      this.gainNode = null;
    }
    this.isRunning = false;
    this.currentMode = null;
  }

  getState() {
    return {
      isPlaying: this.isRunning,
      mode: this.currentMode,
    };
  }
}

export const buzzerSimulator = new BuzzerSoundSimulator();

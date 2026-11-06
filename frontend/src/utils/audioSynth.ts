// Web Audio synthesizer for ambient sound effects, call voice simulation, and regional TTS playback

class SoundFXController {
  private ctx: AudioContext | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientPlaying = false;
  private currentAudioElement: HTMLAudioElement | null = null;
  private voicesLoaded = false;
  private isMuted = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // Pre-warm voices
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.voicesLoaded = true;
        };
      }
    }
  }

  public initCtx() {
    if (typeof window === 'undefined') return;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch {
      // AudioContext policy
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAll();
    }
  }

  // Play a brief click / beep UI sound
  public playClick(freq = 600, duration = 0.08) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Safe catch
    }
  }

  // Play synthetic police siren background ambience
  public startSirenAmbience() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || this.isAmbientPlaying) return;

      const osc = this.ctx.createOscillator();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(650, this.ctx.currentTime);

      // Low frequency modulation for siren wail (0.6 Hz)
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.6, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(220, this.ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      lfo.start();

      this.ambientOsc = osc;
      this.ambientGain = gain;
      this.isAmbientPlaying = true;
    } catch {
      // Safe catch
    }
  }

  public stopAmbient() {
    try {
      if (this.ambientOsc) {
        this.ambientOsc.stop();
        this.ambientOsc.disconnect();
        this.ambientOsc = null;
      }
      this.isAmbientPlaying = false;
    } catch {
      // Safe catch
    }
  }

  // Play alert horn / warning chime
  public playWarningChime() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc2.frequency.setValueAtTime(440, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(this.ctx.currentTime + 0.8);
      osc2.stop(this.ctx.currentTime + 0.8);
    } catch {
      // Safe catch
    }
  }

  // Stop any active speech or audio
  private utteranceQueue: Array<{
    speaker: string;
    text: string;
    onEnd?: () => void;
  }> = [];
  private isProcessingQueue = false;
  private currentUtteranceTimer: NodeJS.Timeout | null = null;
  private isEmergencyWarningActive = false;

  public stopSpeech() {
    this.utteranceQueue = [];
    this.isProcessingQueue = false;
    this.isEmergencyWarningActive = false;
    if (this.currentUtteranceTimer) {
      clearTimeout(this.currentUtteranceTimer);
      this.currentUtteranceTimer = null;
    }
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement = null;
      } catch {
        // Safe catch
      }
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Safe catch
      }
    }
  }

  // Stop everything (ambient + speech + sounds)
  public stopAll() {
    this.stopAmbient();
    this.stopSpeech();
  }

  // Speaks an individual call utterance with character-appropriate voice/pitch using a sequential queue
  public speakUtterance(speaker: string, text: string, onEnd?: () => void) {
    if (this.isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    // If an emergency voice shield is active, avoid overlaying scammer voice
    if (this.isEmergencyWarningActive) {
      if (onEnd) onEnd();
      return;
    }

    // Add to speech queue
    this.utteranceQueue.push({ speaker, text, onEnd });
    if (!this.isProcessingQueue) {
      this.processNextInQueue();
    }
  }

  private processNextInQueue() {
    if (this.utteranceQueue.length === 0) {
      this.isProcessingQueue = false;
      return;
    }
    if (this.isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.utteranceQueue = [];
      this.isProcessingQueue = false;
      return;
    }

    this.isProcessingQueue = true;
    const item = this.utteranceQueue.shift()!;

    try {
      this.initCtx();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(item.text);
      const isOfficer = item.speaker.toLowerCase().includes('officer') || item.speaker.toLowerCase().includes('inspector') || item.speaker.toLowerCase().includes('cbi');
      const isVictim = item.speaker.toLowerCase().includes('victim') || item.speaker.toLowerCase().includes('uncle') || item.speaker.toLowerCase().includes('customer') || item.speaker.toLowerCase().includes('aunt');
      const isIVR = item.speaker.toLowerCase().includes('ivr') || item.speaker.toLowerCase().includes('automated');

      // Detect language roughly from text characters
      const hasDevanagari = /[\u0900-\u097F]/.test(item.text);
      const hasKannada = /[\u0C80-\u0CFF]/.test(item.text);
      const hasTamil = /[\u0B80-\u0BFF]/.test(item.text);

      let targetLang = 'hi-IN';
      if (hasKannada) targetLang = 'kn-IN';
      else if (hasTamil) targetLang = 'ta-IN';
      else if (hasDevanagari) targetLang = 'hi-IN';
      else targetLang = 'hi-IN'; // Default Hinglish to Hindi voice for natural Indian accent

      utterance.lang = targetLang;

      // Character voice pitch & speed
      if (isOfficer) {
        utterance.pitch = 0.85; // Authoritative, stern, deep
        utterance.rate = 1.0;
      } else if (isVictim) {
        utterance.pitch = 1.15; // Worried, elderly, anxious
        utterance.rate = 1.05;
      } else if (isIVR) {
        utterance.pitch = 1.0;
        utterance.rate = 0.95;
      } else {
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
      }

      // Pick matching voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const matchingVoice = voices.find((v) =>
          v.lang.toLowerCase().replace('_', '-').startsWith(targetLang.slice(0, 2).toLowerCase())
        ) || voices.find((v) => v.lang.toLowerCase().includes('in')) || voices[0];

        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }
      }

      let hasEnded = false;
      const advanceQueue = () => {
        if (hasEnded) return;
        hasEnded = true;
        if (this.currentUtteranceTimer) {
          clearTimeout(this.currentUtteranceTimer);
          this.currentUtteranceTimer = null;
        }
        if (item.onEnd) {
          try { item.onEnd(); } catch {}
        }
        // Brief natural conversational pause before next dialogue turn
        setTimeout(() => {
          this.processNextInQueue();
        }, 200);
      };

      utterance.onend = advanceQueue;
      utterance.onerror = advanceQueue;

      // Safety timeout: calculate speech duration based on text length (avg ~120ms per character + 2.5s)
      const maxMs = Math.max(3500, item.text.length * 120 + 2500);
      this.currentUtteranceTimer = setTimeout(advanceQueue, maxMs);

      window.speechSynthesis.speak(utterance);
    } catch {
      this.isProcessingQueue = false;
      if (item.onEnd) item.onEnd();
    }
  }

  // Play emergency voice warning (chime + spoken warning)
  public playWarningVoice(
    warningText: string = 'सावधान! यह एक फ़र्ज़ी डिजिटल अरेस्ट स्कैम है। तुरंत कॉल काट दें!',
    langCode: string = 'hi',
    onEnd?: () => void
  ) {
    this.playWarningChime();
    setTimeout(() => {
      this.speakViaWebSpeech(warningText, langCode, onEnd);
    }, 400);
  }

  // Play base64 audio or speak warning with Web Speech API
  public playSpeechWarning(
    base64Wav: string | undefined,
    fallbackText: string,
    langCode: string = 'hi',
    onEnd?: () => void
  ) {
    this.stopSpeech();
    this.isEmergencyWarningActive = true;
    this.initCtx();

    // If live Gnani Timbre base64 WAV is provided and is long enough to be speech (>10KB), try audio element
    if (base64Wav && base64Wav.length > 10000) {
      try {
        const audio = new Audio(`data:audio/wav;base64,${base64Wav}`);
        audio.volume = 1.0;
        this.currentAudioElement = audio;

        audio.onended = () => {
          this.currentAudioElement = null;
          this.isEmergencyWarningActive = false;
          if (onEnd) onEnd();
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            this.speakViaWebSpeech(fallbackText, langCode, onEnd);
          });
        }
        return;
      } catch {
        // Fallback
      }
    }

    // Otherwise speak with browser Web Speech synthesis
    this.playWarningChime();
    setTimeout(() => {
      this.speakViaWebSpeech(fallbackText, langCode, () => {
        this.isEmergencyWarningActive = false;
        if (onEnd) onEnd();
      });
    }, 400);
  }

  public speakViaWebSpeech(text: string, langCode: string, onEnd?: () => void) {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        this.initCtx();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        let targetLang = 'hi-IN';
        if (langCode === 'kn') targetLang = 'kn-IN';
        else if (langCode === 'ta') targetLang = 'ta-IN';
        else if (langCode === 'en') targetLang = 'en-IN';
        else if (langCode === 'hinglish') targetLang = 'hi-IN';

        utterance.lang = targetLang;
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          const matchingVoice =
            voices.find((v) => v.lang.toLowerCase().replace('_', '-').startsWith(targetLang.slice(0, 2).toLowerCase())) ||
            voices.find((v) => v.lang.toLowerCase().includes('in')) ||
            voices[0];
          if (matchingVoice) {
            utterance.voice = matchingVoice;
          }
        }

        utterance.onend = () => {
          this.isEmergencyWarningActive = false;
          if (onEnd) onEnd();
        };
        utterance.onerror = () => {
          this.isEmergencyWarningActive = false;
          if (onEnd) onEnd();
        };

        window.speechSynthesis.speak(utterance);
      } catch {
        this.isEmergencyWarningActive = false;
        if (onEnd) onEnd();
      }
    } else {
      this.isEmergencyWarningActive = false;
      if (onEnd) onEnd();
    }
  }
}

export const soundFX = new SoundFXController();

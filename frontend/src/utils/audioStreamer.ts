/**
 * Kavach AI - Live 16kHz 16-bit Mono PCM Audio Streamer
 * Primary Pipeline for Gnani Prisma v2.5 Streaming STT over WebSockets (/ws/stream)
 * Eliminates Web Speech API ambiguity and delivers true 16kHz PCM audio stream.
 */

export interface AudioStreamerOptions {
  onStatusChange?: (isRecording: boolean) => void;
  onError?: (error: string) => void;
  onLatencyMeasured?: (rttMs: number) => void;
  sampleRate?: number;
  chunkIntervalMs?: number;
}

export class GnaniPrismaAudioStreamer {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private isStreaming: boolean = false;
  private pcmBuffer: Int16Array[] = [];
  private flushTimer: any = null;
  private ws: WebSocket | null = null;
  private language: string = 'hi-IN';
  private onLatencyMeasured?: (rttMs: number) => void;
  private onError?: (error: string) => void;
  private onStatusChange?: (isRecording: boolean) => void;

  constructor(options?: AudioStreamerOptions) {
    this.onStatusChange = options?.onStatusChange;
    this.onError = options?.onError;
    this.onLatencyMeasured = options?.onLatencyMeasured;
  }

  public setWebSocket(ws: WebSocket | null) {
    this.ws = ws;
  }

  public setLanguage(lang: string) {
    if (lang === 'kn') this.language = 'kn-IN';
    else if (lang === 'ta') this.language = 'ta-IN';
    else if (lang === 'en') this.language = 'en-IN';
    else this.language = 'hi-IN';
  }

  public getIsStreaming(): boolean {
    return this.isStreaming;
  }

  /**
   * Starts capturing 16kHz Mono 16-bit PCM audio from the user's microphone
   * and pipes PCM chunks to the FastAPI backend over WebSocket.
   */
  public async start(ws: WebSocket, language: string = 'hi-IN'): Promise<boolean> {
    if (this.isStreaming) return true;
    this.ws = ws;
    this.setLanguage(language);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone access is not supported in this browser.');
      }

      // Request 16kHz mono audio with noise suppression and echo cancellation
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx({ sampleRate: 16000 });

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);

      // ScriptProcessor with 4096 buffer size (~256ms at 16kHz)
      const bufferSize = 4096;
      this.processorNode = this.audioContext.createScriptProcessor(bufferSize, 1, 1);

      this.processorNode.onaudioprocess = (e: AudioProcessingEvent) => {
        if (!this.isStreaming) return;

        const inputData = e.inputBuffer.getChannelData(0);
        // Convert Float32Array (-1.0 to 1.0) to 16-bit signed PCM
        const pcm16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        this.pcmBuffer.push(pcm16);
      };

      this.sourceNode.connect(this.processorNode);
      this.processorNode.connect(this.audioContext.destination);

      this.isStreaming = true;
      this.pcmBuffer = [];

      // Flush PCM audio chunks to WebSocket every ~1.5 seconds for streaming STT
      this.flushTimer = setInterval(() => {
        this.flushAudioChunk();
      }, 1500);

      this.onStatusChange?.(true);
      return true;
    } catch (err: any) {
      console.error('Gnani Prisma AudioStreamer initialization error:', err);
      const errMsg = err?.name === 'NotAllowedError'
        ? 'Microphone permission denied. Please allow microphone access to monitor speakerphone calls.'
        : err?.message || 'Could not access microphone.';
      this.onError?.(errMsg);
      this.stop();
      return false;
    }
  }

  /**
   * Flushes accumulated 16kHz 16-bit Mono PCM buffer as base64 over WebSocket
   */
  private flushAudioChunk() {
    if (!this.isStreaming || this.pcmBuffer.length === 0) return;
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    // Concatenate all buffered Int16Array chunks
    let totalLength = 0;
    for (const chunk of this.pcmBuffer) {
      totalLength += chunk.length;
    }

    if (totalLength < 1600) {
      // Less than 100ms of audio, wait for next cycle
      return;
    }

    const merged = new Int16Array(totalLength);
    let offset = 0;
    for (const chunk of this.pcmBuffer) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }
    this.pcmBuffer = [];

    // Convert Int16Array bytes to base64
    const u8 = new Uint8Array(merged.buffer);
    let binary = '';
    const len = u8.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(u8[i]);
    }
    const b64 = window.btoa(binary);

    const clientTimestamp = Date.now();
    this.ws.send(
      JSON.stringify({
        type: 'audio_chunk',
        audio_data: b64,
        sample_rate: 16000,
        language: this.language,
        speaker: 'Incoming Call (Speakerphone Companion Mic)',
        client_timestamp: clientTimestamp
      })
    );
  }

  /**
   * Stops recording and releases microphone hardware
   */
  public stop() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    // Flush any remaining audio
    if (this.pcmBuffer.length > 0) {
      this.flushAudioChunk();
    }

    if (this.processorNode) {
      this.processorNode.disconnect();
      this.processorNode = null;
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    if (this.audioContext) {
      try {
        this.audioContext.close();
      } catch {}
      this.audioContext = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    this.isStreaming = false;
    this.pcmBuffer = [];
    this.onStatusChange?.(false);
  }
}

export const gnaniPrismaStreamer = new GnaniPrismaAudioStreamer();

// Web Speech API wrapper for real-time Hinglish/English/Hindi microphone input

export interface SpeechRecognitionResultItem {
  transcript: string;
  isFinal: boolean;
}

export type SpeechCallback = (result: SpeechRecognitionResultItem) => void;
export type ErrorCallback = (error: string) => void;

interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export class LiveSpeechRecognizer {
  private recognition: any = null;
  private isListening: boolean = false;
  private onResultCb: SpeechCallback | null = null;
  private onErrorCb: ErrorCallback | null = null;
  private lang: string = 'hi-IN';

  constructor() {
    if (typeof window !== 'undefined') {
      const win = window as unknown as IWindow;
      const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

      if (SpeechRecognitionClass) {
        try {
          this.recognition = new SpeechRecognitionClass();
          this.recognition.continuous = true;
          this.recognition.interimResults = true;
          this.recognition.maxAlternatives = 1;
          this.recognition.lang = 'hi-IN'; // Supports Hindi + Indian English code mixing

          this.recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
              const part = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                finalTranscript += part;
              } else {
                interimTranscript += part;
              }
            }

            const text = (finalTranscript || interimTranscript).trim();
            if (text && this.onResultCb) {
              this.onResultCb({
                transcript: text,
                isFinal: !!finalTranscript
              });
            }
          };

          this.recognition.onerror = (event: any) => {
            const err = event.error || 'speech-error';
            // 'no-speech' is normal when someone pauses speaking; don't terminate or report error
            if (err === 'no-speech') {
              return;
            }
            if (this.onErrorCb) {
              this.onErrorCb(err);
            }
          };

          this.recognition.onend = () => {
            if (this.isListening) {
              // Automatically restart continuous listening if still active
              try {
                this.recognition.start();
              } catch {
                // If restart fails immediately, retry after short delay
                setTimeout(() => {
                  if (this.isListening) {
                    try { this.recognition.start(); } catch {}
                  }
                }, 300);
              }
            }
          };
        } catch (e) {
          console.warn('SpeechRecognition initialization error', e);
        }
      }
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public start(onResult: SpeechCallback, onError: ErrorCallback, lang: string = 'hi-IN'): boolean {
    this.onResultCb = onResult;
    this.onErrorCb = onError;
    this.lang = lang;

    if (!this.recognition) {
      onError('Browser does not support native Web Speech API. Microphone fallback will be used.');
      return false;
    }

    try {
      this.recognition.lang = lang === 'en' ? 'en-IN' : lang === 'kn' ? 'kn-IN' : lang === 'ta' ? 'ta-IN' : 'hi-IN';
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (e) {
      console.warn('Could not start recognition:', e);
      return false;
    }
  }

  public stop() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Safe catch
      }
    }
  }
}

export const liveSpeechRecognizer = new LiveSpeechRecognizer();

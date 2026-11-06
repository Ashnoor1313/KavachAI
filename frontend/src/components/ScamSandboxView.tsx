'use client';

import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Volume2,
  VolumeX,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Send,
  Mic,
  MicOff,
  RotateCcw
} from 'lucide-react';
import { soundFX } from '@/utils/audioSynth';
import { liveSpeechRecognizer } from '@/utils/speechRecognition';
import { getBackendBaseUrl } from '@/utils/apiConfig';

interface ScamSandboxViewProps {
  selectedLanguage: string;
  onOpenWhatsAppModal: () => void;
  onDownloadCustomPDF: (text: string, result: any) => void;
}

export const ScamSandboxView: React.FC<ScamSandboxViewProps> = ({
  selectedLanguage,
  onOpenWhatsAppModal,
  onDownloadCustomPDF
}) => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [isDictating, setIsDictating] = useState(false);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

  const presets = [
    {
      title: 'CBI Digital Arrest',
      badge: '96% Risk',
      color: 'border-rose-500/60 bg-rose-950/20 text-rose-300',
      text: 'Main Mumbai Crime Branch se Inspector Rathore bol raha hoon. Aapka FAKE-AADHAAR-0000 international money laundering syndicate se linked hai. Supreme Court ne non-bailable FIR darj kar di hai. Aap DIGITAL ARREST par hain! Video call bilkul mat kaatna! Turant RBI verification account par 4,80,000 rupaye RTGS kijiye.'
    },
    {
      title: 'Electricity Bill Cutoff',
      badge: '88% Risk',
      color: 'border-amber-500/60 bg-amber-950/20 text-amber-300',
      text: 'BSES Power alert: Aapka electricity bill update nahi hua hai. Aaj raat bijli connection cut kar diya jayega. Turant Play Store se QuickSupport app download kijiye aur PhonePe kholkar secret UPI PIN enter karke verification kijiye.'
    },
    {
      title: 'FedEx Customs Narcotics',
      badge: '92% Risk',
      color: 'border-rose-500/60 bg-rose-950/20 text-rose-300',
      text: 'Urgent notice from FedEx Mumbai Customs Hub. Your parcel contains 140 grams MDMA Narcotics and fake passports. Customs clearance requires immediate security deposit to government bond account or police will raid your house.'
    },
    {
      title: 'Safe Amazon Delivery',
      badge: 'Safe Control',
      color: 'border-emerald-500/60 bg-emerald-950/20 text-emerald-300',
      text: 'Bhaiya namaste, main Amazon delivery se Manoj bol raha hoon. Aapka kitchen appliance package lekar gate par khada hoon. Prepaid order hai, bas OTP bata dijiye aur main reception par drop kar deta hoon.'
    }
  ];

  const handleAnalyze = async (textToAnalyze?: string) => {
    const text = textToAnalyze || inputText;
    if (!text.trim()) return;

    soundFX.playClick(750);
    setIsAnalyzing(true);

    try {
      const response = await fetch(`${getBackendBaseUrl()}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          language: selectedLanguage === 'kn' ? 'kn-IN' : selectedLanguage === 'ta' ? 'ta-IN' : 'hi-IN'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysisResult(data);
        if (data.threat_score >= 75) {
          soundFX.playWarningChime();
        }
      }
    } catch {
      // Fallback local rule analysis if offline
      const isCBI = /cbi|police|crime branch|arrest|fir|warrant/i.test(text);
      const isFin = /rtgs|upi|pin|money|transfer|bank|rupaye/i.test(text);
      const isIso = /video call|disconnect|secret|turant|mat katna/i.test(text);

      let score = 10;
      if (isCBI) score += 40;
      if (isFin) score += 30;
      if (isIso) score += 20;

      setAnalysisResult({
        threat_score: Math.min(98, score),
        risk_level: score >= 75 ? 'CRITICAL_SCAM' : score >= 35 ? 'SUSPICIOUS' : 'SAFE',
        scam_category: isCBI ? 'Digital Arrest / Authority Impersonation' : isFin ? 'UPI / Payment Fraud' : 'Benign Message',
        authority_score: isCBI ? 85 : 10,
        isolation_score: isIso ? 80 : 5,
        financial_score: isFin ? 90 : 10,
        all_flagged_keywords: isCBI ? ['Police', 'Arrest', 'FIR'] : [],
        recommended_intervention_hinglish: 'Savdhaan! Yeh ek fake scam attempt hai. Kisi ko paise na bhejein aur 1930 par call karein.',
        recommended_intervention_hindi: 'सावधान! यह एक नकली स्कैम है। तुरंत कॉल काट दें और 1930 पर रिपोर्ट करें।',
        recommended_intervention_english: 'WARNING: Potential extortion attempt detected. Never transfer funds or share secret PINs. Call 1930.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleDictation = () => {
    soundFX.playClick(600);
    if (isDictating) {
      liveSpeechRecognizer.stop();
      setIsDictating(false);
      return;
    }

    const started = liveSpeechRecognizer.start(
      (result) => {
        setInputText(result.transcript);
        if (result.isFinal) {
          handleAnalyze(result.transcript);
        }
      },
      () => {
        setIsDictating(false);
      },
      selectedLanguage
    );

    setIsDictating(started);
  };

  const handlePlayVoice = () => {
    if (!analysisResult) return;
    soundFX.playClick(850);
    setIsPlayingTTS(true);

    const textToSpeak =
      (selectedLanguage === 'kn' ? analysisResult.recommended_intervention_kannada :
       selectedLanguage === 'ta' ? analysisResult.recommended_intervention_tamil :
       selectedLanguage === 'hinglish' ? analysisResult.recommended_intervention_hinglish :
       selectedLanguage === 'en' ? analysisResult.recommended_intervention_english :
       analysisResult.recommended_intervention_hindi) ||
      analysisResult.recommended_intervention_hinglish ||
      'Savdhaan! Yeh ek fake Digital Arrest scam hai. Turant call cut karein aur 1930 dial karein!';

    soundFX.playSpeechWarning(undefined, textToSpeak, selectedLanguage, () => {
      setIsPlayingTTS(false);
    });
  };

  const handleStopVoice = () => {
    soundFX.stopSpeech();
    setIsPlayingTTS(false);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800/80 p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-cyan-400" />
              <span>Interactive Scam Analyzer & Testing Sandbox</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Test any suspicious SMS, WhatsApp message, spoken phrase, or simulated caller transcript against the Kavach Multi-Vector Engine.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleDictation}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isDictating
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {isDictating ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{isDictating ? 'Listening...' : 'Dictate with Voice'}</span>
            </button>
          </div>
        </div>

        {/* 1-Click Preset Templates */}
        <div className="mt-4 pt-3 border-t border-slate-800/70">
          <span className="text-[11px] font-semibold text-slate-400 block mb-2">
            Quick Preset Test Cases:
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(preset.text);
                  handleAnalyze(preset.text);
                }}
                className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all hover:scale-[1.02] flex items-center gap-1.5 ${preset.color}`}
              >
                <span>{preset.title}</span>
                <span className="text-[10px] font-bold opacity-80">({preset.badge})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Textarea (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800/80 p-5 shadow-lg flex flex-col flex-1">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/70">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Suspect Message / Call Transcript
              </span>
              {inputText && (
                <button
                  onClick={() => setInputText('')}
                  className="text-[11px] text-slate-400 hover:text-white transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste or type any suspicious call dialog, WhatsApp forward, or extortion threat here (e.g., 'Main Inspector bol raha hoon, aapke Aadhaar par FIR hai, 50,000 rupaye transfer kijiye')..."
              rows={7}
              className="w-full mt-3 p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors leading-relaxed font-sans"
            />

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500">
                {inputText.length} characters • Hinglish / English / Hindi
              </span>

              <button
                onClick={() => handleAnalyze()}
                disabled={isAnalyzing || !inputText.trim()}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md ${
                  isAnalyzing || !inputText.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-950/40'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{isAnalyzing ? 'Analyzing Neural Lexicons...' : 'Analyze Threat'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Real-Time Results & Vector Breakdown (6 cols) */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800/80 p-5 shadow-lg flex-1">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/70">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Analysis Verdict & Telemetry
              </span>
              {analysisResult && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  analysisResult.threat_score >= 75
                    ? 'bg-rose-950 text-rose-300 border-rose-800'
                    : analysisResult.threat_score >= 35
                    ? 'bg-amber-950 text-amber-300 border-amber-800'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                }`}>
                  {analysisResult.risk_level}
                </span>
              )}
            </div>

            {analysisResult ? (
              <div className="mt-4 space-y-4">
                {/* Score & Category */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Classified Category</span>
                    <h3 className="text-sm font-bold text-white mt-0.5">
                      {analysisResult.scam_category || 'Scam Assessment'}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Threat Index</span>
                    <span className={`text-2xl font-black ${
                      analysisResult.threat_score >= 75
                        ? 'text-rose-400'
                        : analysisResult.threat_score >= 35
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}>
                      {analysisResult.threat_score}%
                    </span>
                  </div>
                </div>

                {/* 3 Vector Bars */}
                <div className="space-y-2.5 p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/70">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Psychological Vectors:
                  </span>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1 text-slate-300">
                      <span>Authority Impersonation</span>
                      <span className="font-mono font-bold">{analysisResult.authority_score || 0}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        style={{ width: `${analysisResult.authority_score || 0}%` }}
                        className="h-full bg-rose-500 rounded-full transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1 text-slate-300">
                      <span>Panic & Isolation Pressure</span>
                      <span className="font-mono font-bold">{analysisResult.isolation_score || 0}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        style={{ width: `${analysisResult.isolation_score || 0}%` }}
                        className="h-full bg-amber-500 rounded-full transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1 text-slate-300">
                      <span>Financial Demands</span>
                      <span className="font-mono font-bold">{analysisResult.financial_score || 0}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        style={{ width: `${analysisResult.financial_score || 0}%` }}
                        className="h-full bg-cyan-400 rounded-full transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Flagged Keywords Chips */}
                {analysisResult.all_flagged_keywords && analysisResult.all_flagged_keywords.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                      Flagged Coercion Triggers:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.all_flagged_keywords.map((kw: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-800/50"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Countermeasures & TTS Playback */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={isPlayingTTS ? handleStopVoice : handlePlayVoice}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isPlayingTTS
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                    }`}
                  >
                    {isPlayingTTS ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    <span>{isPlayingTTS ? 'Stop Voice' : 'Synthesize Voice Warning'}</span>
                  </button>

                  <button
                    onClick={onOpenWhatsAppModal}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>WhatsApp Family SOS</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-56 flex flex-col items-center justify-center text-center text-slate-500">
                <Search className="w-8 h-8 text-slate-600 mb-2" />
                <p className="text-xs font-medium text-slate-400">
                  Ready for Evaluation
                </p>
                <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                  Type custom message or click any quick preset on the left to inspect the Coercion Threat Engine breakdown.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

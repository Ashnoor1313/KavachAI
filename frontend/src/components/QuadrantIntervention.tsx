'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, RotateCcw, FileText, Send, AlertOctagon, ShieldCheck } from 'lucide-react';
import { soundFX } from '@/utils/audioSynth';

interface QuadrantInterventionProps {
  threatScore: number;
  scamCategory: string;
  selectedLanguage: string;
  interventions: {
    hi?: string;
    kn?: string;
    ta?: string;
    hinglish?: string;
    en?: string;
  };
  latestAudioBase64?: string;
  onDownloadPDF: () => void;
  onOpenWhatsAppModal: () => void;
}

export const QuadrantIntervention: React.FC<QuadrantInterventionProps> = ({
  threatScore,
  scamCategory,
  selectedLanguage,
  interventions,
  latestAudioBase64,
  onDownloadPDF,
  onOpenWhatsAppModal
}) => {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [hasAutoTriggered, setHasAutoTriggered] = useState(false);

  // Default regional texts
  const warningText =
    (selectedLanguage === 'kn' ? interventions?.kn :
     selectedLanguage === 'ta' ? interventions?.ta :
     selectedLanguage === 'hinglish' ? interventions?.hinglish :
     selectedLanguage === 'en' ? interventions?.en :
     interventions?.hi) ||
    'सावधान! यह एक नकली डिजिटल अरेस्ट स्कैम है। पुलिस या सीबीआई कभी वीडियो कॉल पर पैसे या आधार वेरिफिकेशन नहीं मांगती। तुरंत कॉल काट दें!';

  // Trigger alert voice automatically when threat escalates past 75%
  useEffect(() => {
    if (threatScore >= 75 && !hasAutoTriggered) {
      setHasAutoTriggered(true);
      soundFX.playWarningChime();
      playVoiceShield();
    } else if (threatScore < 30) {
      setHasAutoTriggered(false);
    }
  }, [threatScore]);

  const playVoiceShield = () => {
    setIsPlayingVoice(true);
    soundFX.playSpeechWarning(latestAudioBase64, warningText, selectedLanguage);
    setTimeout(() => {
      setIsPlayingVoice(false);
    }, 4500);
  };

  const isCritical = threatScore >= 75;

  return (
    <div className={`flex flex-col bg-slate-900/40 backdrop-blur-xl rounded-2xl border p-4 shadow-lg transition-all duration-300 ${
      isCritical ? 'border-rose-500/70 shadow-lg shadow-rose-950/40' : 'border-slate-800/70'
    }`}>
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isCritical ? 'bg-rose-500 animate-ping' : 'bg-cyan-400'}`}></div>
          <span className="text-xs font-semibold text-slate-200 tracking-wide">
            Countermeasures & Defense
          </span>
        </div>

        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-950/60 text-violet-300 border border-violet-800/40">
          Timbre Regional TTS
        </span>
      </div>

      {/* Dynamic Status / Alert Strip */}
      <div className="mt-3">
        {isCritical ? (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/60 shadow-sm flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-rose-600 text-white shrink-0">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wide">
                  Critical Scam Threat Detected
                </h3>
                <p className="text-[10px] text-rose-300 mt-0.5">
                  High probability of extortion. Regional voice intervention engaged.
                </p>
              </div>
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-rose-900/80 text-rose-200 border border-rose-700/60 uppercase shrink-0">
              Shield Level 1
            </span>
          </div>
        ) : (
          <div className="p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 flex items-center gap-2.5 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-[11px]">
              {threatScore >= 35
                ? 'Elevated risk detected. Monitoring speech vectors for financial coercion.'
                : 'Shield active. Monitoring incoming speech streams in real-time.'}
            </span>
          </div>
        )}
      </div>

      {/* Synthesized Voice Warning Box */}
      <div className="mt-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/60 flex flex-col justify-between gap-2.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Elder Safety Warning (Synthesized Voice)</span>
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-mono">
            {selectedLanguage.toUpperCase()}
          </span>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/40 italic">
          &ldquo;{warningText}&rdquo;
        </p>

        {/* Replay Button */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-slate-500">
            Audio Status: {isPlayingVoice ? 'Playing warning...' : 'Ready'}
          </span>
          <button
            onClick={playVoiceShield}
            disabled={isPlayingVoice}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isPlayingVoice
                ? 'bg-cyan-600 text-white animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700'
            }`}
          >
            <RotateCcw className={`w-3 h-3 ${isPlayingVoice ? 'animate-spin' : ''}`} />
            <span>{isPlayingVoice ? 'Broadcasting...' : 'Replay Voice Alert'}</span>
          </button>
        </div>
      </div>

      {/* Action Buttons: 1930 PDF & WhatsApp SOS */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          onClick={onDownloadPDF}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs font-medium transition-colors shadow-sm"
        >
          <FileText className="w-3.5 h-3.5 text-cyan-400" />
          <span>Download 1930 PDF</span>
        </button>

        <button
          onClick={onOpenWhatsAppModal}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md shadow-emerald-950/40"
          title="1-Tap WhatsApp Family SOS (Pre-Filled GPS Deep Link)"
        >
          <Send className="w-3.5 h-3.5" />
          <span>1-Tap WhatsApp Family SOS (Pre-Filled GPS Deep Link)</span>
        </button>
      </div>
    </div>
  );
};

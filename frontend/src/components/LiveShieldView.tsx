'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Play,
  Square,
  Volume2,
  VolumeX,
  FileText,
  Share2,
  Radio,
  AlertOctagon,
  ShieldCheck,
  AlertTriangle,
  Siren,
  Clock,
  Sparkles,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { SyntheticScenario, UtteranceItem, ThreatVectors, RiskLevel } from '@/types';
import { soundFX } from '@/utils/audioSynth';

interface LiveShieldViewProps {
  scenarios: SyntheticScenario[];
  activeScenarioId: string | null;
  isPlaying: boolean;
  onStartScenario: (scenarioId: string, speed: number) => void;
  onStopScenario: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  ambientNoise: boolean;
  onAmbientToggle: () => void;
  isMicActive: boolean;
  onToggleMic: () => void;
  utterances: UtteranceItem[];
  threatScore: number;
  riskLevel: RiskLevel;
  scamCategory: string;
  vectors: ThreatVectors;
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

export const LiveShieldView: React.FC<LiveShieldViewProps> = ({
  scenarios,
  activeScenarioId,
  isPlaying,
  onStartScenario,
  onStopScenario,
  speed,
  onSpeedChange,
  ambientNoise,
  onAmbientToggle,
  isMicActive,
  onToggleMic,
  utterances,
  threatScore,
  riskLevel,
  scamCategory,
  vectors,
  selectedLanguage,
  interventions,
  latestAudioBase64,
  onDownloadPDF,
  onOpenWhatsAppModal
}) => {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [utterances]);

  const isCritical = threatScore >= 75;
  const isSuspicious = threatScore >= 35 && threatScore < 75;

  // Selected warning text based on language
  const warningText =
    (selectedLanguage === 'kn' ? interventions?.kn :
     selectedLanguage === 'ta' ? interventions?.ta :
     selectedLanguage === 'hinglish' ? interventions?.hinglish :
     selectedLanguage === 'en' ? interventions?.en :
     interventions?.hi) ||
    'सावधान! यह एक 100% नकली डिजिटल अरेस्ट स्कैम है। पुलिस या सीबीआई कभी वीडियो कॉल पर गिरफ्तारी नहीं करती। तुरंत कॉल काट दें!';

  const handlePlayVoice = () => {
    soundFX.playClick(800);
    setIsPlayingVoice(true);
    soundFX.playSpeechWarning(latestAudioBase64, warningText, selectedLanguage, () => {
      setIsPlayingVoice(false);
    });
  };

  const handleStopVoice = () => {
    soundFX.stopSpeech();
    setIsPlayingVoice(false);
  };

  // Helper to highlight trigger keywords
  const renderHighlightedText = (text: string, flaggedKeywords?: string[]) => {
    if (!flaggedKeywords || flaggedKeywords.length === 0) {
      return <span>{text}</span>;
    }

    const escaped = flaggedKeywords
      .filter((k) => k && k.trim().length > 1)
      .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    if (escaped.length === 0) return <span>{text}</span>;

    const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, i) => {
          const isFlagged = flaggedKeywords.some(
            (k) => k.toLowerCase() === part.toLowerCase()
          );

          if (isFlagged) {
            return (
              <span
                key={i}
                className="inline-block px-1.5 py-0.5 mx-0.5 rounded-md text-xs font-bold bg-rose-950/80 text-rose-300 border border-rose-600/60 shadow-sm"
              >
                {part}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 1. Status Banner: Clear, Simple, Uncluttered */}
      <div className={`p-4 sm:p-5 rounded-3xl border transition-all shadow-xl ${
        isCritical
          ? 'bg-rose-950/50 border-rose-500/70 shadow-rose-950/40'
          : isSuspicious
          ? 'bg-amber-950/40 border-amber-500/60 shadow-amber-950/30'
          : 'bg-slate-900/60 border-slate-800/80'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
              isCritical
                ? 'bg-rose-600 text-white animate-bounce'
                : isSuspicious
                ? 'bg-amber-500 text-slate-950'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}>
              {isCritical ? (
                <Siren className="w-6 h-6" />
              ) : isSuspicious ? (
                <AlertTriangle className="w-6 h-6" />
              ) : (
                <ShieldCheck className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isCritical
                    ? 'bg-rose-900/80 text-rose-200'
                    : isSuspicious
                    ? 'bg-amber-900/80 text-amber-200'
                    : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                }`}>
                  {isCritical ? 'CRITICAL SCAM DETECTED' : isSuspicious ? 'SUSPICIOUS CALL PATTERN' : 'LIVE SHIELD ACTIVE'}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Threat Index: <strong className={isCritical ? 'text-rose-400 font-extrabold text-sm' : isSuspicious ? 'text-amber-400' : 'text-emerald-400'}>{threatScore}%</strong>
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white mt-1">
                {isCritical
                  ? `Extortion in Progress: ${scamCategory}`
                  : isSuspicious
                  ? `Caution Advised: Unverified authority pressure detected`
                  : `Listening to Call Stream • Normal Conversation`}
              </h2>
            </div>
          </div>

          {/* Quick Countermeasures when threat is high */}
          {isCritical && (
            <div className="flex items-center gap-2.5">
              <button
                onClick={isPlayingVoice ? handleStopVoice : handlePlayVoice}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-950/50"
              >
                {isPlayingVoice ? <VolumeX className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
                <span>{isPlayingVoice ? 'Stop Warning Voice' : 'Play Voice Shield'}</span>
              </button>

              <button
                onClick={onOpenWhatsAppModal}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-950/50"
              >
                <Share2 className="w-4 h-4" />
                <span>Alert Family</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Main Two-Column Clean Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Call Simulator, Live Mic & Interactive Transcript (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Audio Input & Controls Panel */}
          <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800/80 p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/70">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Call Stream Controller
              </span>

              <div className="flex items-center gap-2">
                {/* Siren Ambience */}
                <button
                  onClick={onAmbientToggle}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium border transition-colors ${
                    ambientNoise
                      ? 'bg-amber-950/70 border-amber-500/50 text-amber-300'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                  title="Toggle police siren ambience sound effect"
                >
                  <Radio className={`w-3.5 h-3.5 ${ambientNoise ? 'text-amber-400 animate-pulse' : ''}`} />
                  <span>Siren Ambience</span>
                </button>

                {/* Speed Multiplier */}
                <div className="flex items-center bg-slate-950/60 rounded-xl border border-slate-800 p-0.5 text-xs">
                  {[1, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => onSpeedChange(s)}
                      className={`px-2 py-0.5 rounded-lg text-xs font-medium transition-colors ${
                        speed === s
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Mic & Action Buttons */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={onToggleMic}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md ${
                  isMicActive
                    ? 'bg-rose-600 text-white shadow-rose-950/50 animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {isMicActive ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-cyan-400" />}
                <span>{isMicActive ? 'Listening to Mic (Click to Stop)' : 'Use Live Microphone'}</span>
              </button>

              {isPlaying && (
                <button
                  onClick={onStopScenario}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-rose-950/60 hover:bg-rose-900/70 text-rose-300 border border-rose-800 text-xs font-bold transition-colors"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop Active Call</span>
                </button>
              )}
            </div>

            {/* Quick 1-Click Scenario Selectors (Simple & Clean) */}
            <div className="mt-4 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                Select a Call Simulation Scenario:
              </span>
              <div className="grid grid-cols-1 gap-2">
                {scenarios.map((scenario) => {
                  const isActive = activeScenarioId === scenario.id && isPlaying;
                  const isScam = scenario.id !== 'scenario-3';

                  return (
                    <button
                      key={scenario.id}
                      onClick={() => {
                        soundFX.playClick(700);
                        if (isActive) onStopScenario();
                        else onStartScenario(scenario.id, speed);
                      }}
                      className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isActive
                          ? 'bg-cyan-950/30 border-cyan-500/80 shadow-md shadow-cyan-950/30'
                          : 'bg-slate-950/40 hover:bg-slate-800/40 border-slate-800/80'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${isScam ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                          <h4 className="text-xs font-bold text-white truncate">
                            {scenario.title}
                          </h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                            isScam ? 'bg-rose-950/70 text-rose-300 border-rose-800/40' : 'bg-emerald-950/70 text-emerald-300 border-emerald-800/40'
                          }`}>
                            {scenario.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 truncate">
                          {scenario.subtitle}
                        </p>
                      </div>

                      <div className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors ${
                        isActive
                          ? 'bg-rose-600 text-white'
                          : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
                      }`}>
                        {isActive ? (
                          <>
                            <Square className="w-3 h-3 fill-current" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current text-cyan-400" />
                            <span>Simulate</span>
                          </>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live Transcript Stream */}
          <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800/80 p-5 shadow-lg flex flex-col flex-1 min-h-[380px]">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/70">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Live Hinglish Transcript Stream
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {utterances.length} utterances transcribed
              </span>
            </div>

            {/* Transcript Messages List */}
            <div ref={scrollRef} className="flex-1 mt-4 space-y-3.5 overflow-y-auto max-h-[420px] pr-1">
              {utterances.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-center text-slate-500">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 mb-3">
                    <Sparkles className="w-5 h-5 text-cyan-400/60" />
                  </div>
                  <p className="text-xs font-medium text-slate-400">
                    Awaiting Audio Feed
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                    Click &quot;Simulate&quot; on any test scenario above or turn on the Live Microphone to watch speech transcribed in real-time.
                  </p>
                </div>
              ) : (
                utterances.map((u, index) => {
                  const s = u.speaker.toLowerCase();
                  const isVictim = s.includes('victim') || s.includes('ramesh') || s.includes('uncle') || s.includes('you') || s.includes('shanti') || s.includes('customer');
                  const isOfficer = !isVictim;
                  const isHighRisk = (u.threat_score || 0) >= 70 || u.is_critical;

                  return (
                    <React.Fragment key={u.id || index}>
                      {/* Aligned Bubble Container */}
                      <div
                        className={`flex flex-col ${
                          isVictim ? 'items-end ml-auto max-w-[85%]' : 'items-start mr-auto max-w-[85%]'
                        }`}
                      >
                        {/* Speaker Label with Metadata */}
                        <div className={`flex items-center gap-1.5 mb-1 px-1 text-[11px] ${isVictim ? 'flex-row-reverse' : 'flex-row'}`}>
                          <span className="text-slate-400 font-mono text-[10px]">{u.timestamp}</span>
                          <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] border ${
                            isVictim
                              ? 'bg-blue-950/80 text-blue-300 border-blue-800/60'
                              : isHighRisk
                              ? 'bg-rose-950/80 text-rose-300 border-rose-800/60'
                              : 'bg-slate-800/80 text-slate-300 border-slate-700/60'
                          }`}>
                            {isVictim ? '👤 ' : '📞 '}
                            {u.speaker}
                          </span>
                          {!isVictim && u.latency_ms && (
                            <span className="text-cyan-400/80 font-mono text-[9px]">{u.latency_ms}ms</span>
                          )}
                        </div>

                        {/* Speech Bubble */}
                        <div
                          className={`p-3.5 rounded-2xl border text-xs leading-relaxed transition-all shadow-md ${
                            isVictim
                              ? 'bg-blue-950/40 border-blue-500/40 rounded-tr-sm text-slate-100 text-right'
                              : isHighRisk
                              ? 'bg-rose-950/40 border-rose-500/50 rounded-tl-sm text-slate-100 text-left'
                              : 'bg-slate-900/80 border-slate-800/80 rounded-tl-sm text-slate-200 text-left'
                          }`}
                        >
                          {renderHighlightedText(u.text, u.flagged_keywords)}
                        </div>
                      </div>

                      {/* Kavach AI In-Line Intervention Alert Card */}
                      {isHighRisk && (
                        <div className="w-full my-2.5 p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/90 via-slate-900/95 to-rose-950/90 border-2 border-rose-500/80 shadow-lg shadow-rose-950/40 animate-pulse text-white">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <AlertOctagon className="w-4 h-4 text-rose-400" />
                              <span className="text-xs font-black tracking-wider text-rose-200">
                                🛡️ KAVACH AI INTERVENTION • EXTORTION BLOCKED
                              </span>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white">
                              ACTIVE SHIELD
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-100 leading-relaxed">
                            {interventions[selectedLanguage as keyof typeof interventions] ||
                             interventions.hi ||
                             "सावधान! यह कॉल एक फ़र्ज़ी डिजिटल अरेस्ट स्कैम है। पुलिस कभी वीडियो कॉल पर गिरफ़्तारी या पैसे ट्रांसफर करने को नहीं कहती। तुरंत कॉल काट दें!"}
                          </p>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Speedometer, Psychological Vectors & Defense Actions (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Psychological Coercion Index & Vectors */}
          <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800/80 p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/70">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Psychological Coercion Meter
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                isCritical
                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                  : isSuspicious
                  ? 'bg-amber-950 text-amber-300 border-amber-800'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-800'
              }`}>
                {riskLevel}
              </span>
            </div>

            {/* Semicircle SVG Speedometer */}
            <div className="flex flex-col items-center justify-center pt-4 pb-2">
              <div className="relative w-48 h-28 flex items-end justify-center">
                <svg className="w-48 h-28 overflow-visible" viewBox="0 0 190 100">
                  <defs>
                    <linearGradient id="shieldGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="45%" stopColor="#f59e0b" />
                      <stop offset="85%" stopColor="#f43f5e" />
                    </linearGradient>
                  </defs>

                  {/* Background Track */}
                  <path
                    d="M 20 95 A 75 75 0 0 1 170 95"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />

                  {/* Active Value Arc */}
                  <path
                    d="M 20 95 A 75 75 0 0 1 170 95"
                    fill="none"
                    stroke="url(#shieldGaugeGradient)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={Math.PI * 75}
                    strokeDashoffset={(Math.PI * 75) - (Math.min(100, Math.max(0, threatScore)) / 100) * (Math.PI * 75)}
                    className="transition-all duration-500 ease-out"
                  />
                </svg>

                <div className="absolute flex flex-col items-center justify-center bottom-1">
                  <span className={`text-4xl font-black tracking-tight ${
                    isCritical ? 'text-rose-400' : isSuspicious ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {threatScore}%
                  </span>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Extortion Risk
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Simple, Clear Psychological Vector Bars */}
            <div className="mt-4 space-y-3 pt-3 border-t border-slate-800/70">
              {/* Authority Impersonation */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">1. Authority Impersonation</span>
                  <span className="font-bold text-white font-mono">{vectors.authority}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    style={{ width: `${vectors.authority}%` }}
                    className="h-full bg-rose-500 rounded-full transition-all duration-300"
                  />
                </div>
              </div>

              {/* Panic & Isolation Lock */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">2. Panic & Isolation Pressure</span>
                  <span className="font-bold text-white font-mono">{vectors.isolation}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    style={{ width: `${vectors.isolation}%` }}
                    className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  />
                </div>
              </div>

              {/* Financial Demand */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">3. Financial Extortion Demand</span>
                  <span className="font-bold text-white font-mono">{vectors.financial}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    style={{ width: `${vectors.financial}%` }}
                    className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Direct Action & Voice Shield Interventions */}
          <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800/80 p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/70">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Voice Shield & Evidence Export
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">
                Timbre TTS v2.5
              </span>
            </div>

            {/* Synthesized Voice Warning Box */}
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  Regional Voice Countermeasure
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {selectedLanguage}
                </span>
              </div>

              <blockquote className="text-xs text-slate-300 italic border-l-2 border-cyan-500/60 pl-3 leading-relaxed">
                &ldquo;{warningText}&rdquo;
              </blockquote>

              <button
                onClick={isPlayingVoice ? handleStopVoice : handlePlayVoice}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                  isPlayingVoice
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                }`}
              >
                {isPlayingVoice ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isPlayingVoice ? 'Stop Speaking' : 'Play Regional Voice Shield'}</span>
              </button>
            </div>

            {/* 2 Primary Action Buttons: WhatsApp SOS & 1930 PDF */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={onOpenWhatsAppModal}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/40"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp SOS</span>
              </button>

              <button
                onClick={onDownloadPDF}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700 shadow-md"
              >
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Download 1930 PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

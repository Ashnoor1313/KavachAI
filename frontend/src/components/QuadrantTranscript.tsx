'use client';

import React, { useRef, useEffect } from 'react';
import { MessageSquareText, Radio, Clock, ShieldAlert, PhoneIncoming, User, ShieldCheck } from 'lucide-react';
import { UtteranceItem } from '@/types';

interface QuadrantTranscriptProps {
  utterances: UtteranceItem[];
  activeScenarioTitle: string;
}

export const QuadrantTranscript: React.FC<QuadrantTranscriptProps> = ({
  utterances,
  activeScenarioTitle
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest utterance
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [utterances]);

  // Function to highlight scam trigger words inline with sleek badges
  const renderHighlightedText = (text: string, flaggedKeywords: string[]) => {
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
            const isCritical =
              part.toLowerCase().includes('arrest') ||
              part.toLowerCase().includes('rtgs') ||
              part.toLowerCase().includes('cbi') ||
              part.toLowerCase().includes('narcotics') ||
              part.toLowerCase().includes('pin');

            return (
              <span
                key={i}
                className={`inline-block px-1.5 py-0.5 mx-0.5 rounded text-[11px] font-semibold transition-all ${
                  isCritical
                    ? 'bg-rose-950/70 text-rose-300 border border-rose-600/50 shadow-sm shadow-rose-950/40'
                    : 'bg-amber-950/70 text-amber-300 border border-amber-600/50'
                }`}
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

  const isVictimSpeaker = (speaker: string) => {
    const s = speaker.toLowerCase();
    return s.includes('victim') || s.includes('ramesh') || s.includes('shanti') || s.includes('uncle') || s.includes('you') || s.includes('customer');
  };

  const getSpeakerStyle = (speaker: string) => {
    const s = speaker.toLowerCase();
    if (s.includes('cbi') || s.includes('crime branch') || s.includes('police')) {
      return {
        pill: 'bg-rose-950/80 text-rose-300 border-rose-800/60',
        dot: 'bg-rose-400',
        icon: <PhoneIncoming className="w-3 h-3 text-rose-400" />
      };
    }
    if (s.includes('fedex') || s.includes('customs') || s.includes('rahul') || s.includes('bses')) {
      return {
        pill: 'bg-amber-950/80 text-amber-300 border-amber-800/60',
        dot: 'bg-amber-400',
        icon: <PhoneIncoming className="w-3 h-3 text-amber-400" />
      };
    }
    if (isVictimSpeaker(speaker)) {
      return {
        pill: 'bg-blue-950/80 text-blue-300 border-blue-800/60',
        dot: 'bg-blue-400',
        icon: <User className="w-3 h-3 text-blue-400" />
      };
    }
    if (s.includes('amazon') || s.includes('delivery')) {
      return {
        pill: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60',
        dot: 'bg-emerald-400',
        icon: <PhoneIncoming className="w-3 h-3 text-emerald-400" />
      };
    }
    return {
      pill: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
      dot: 'bg-slate-400',
      icon: <PhoneIncoming className="w-3 h-3 text-slate-400" />
    };
  };

  return (
    <div className="flex flex-col flex-1 min-h-[340px] bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-800/70 p-4 shadow-lg transition-all">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
          <span className="text-xs font-semibold text-slate-200 tracking-wide">
            Live Aligned Transcript
          </span>
          {activeScenarioTitle && (
            <span className="text-[10px] text-slate-400 hidden sm:inline truncate max-w-[200px]">
              • {activeScenarioTitle}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400">
            {utterances.length} {utterances.length === 1 ? 'turn' : 'turns'}
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
            Prisma STT (&lt;180ms)
          </span>
        </div>
      </div>

      {/* Transcript Feed with Left (Caller) vs Right (Victim/You) alignment */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto mt-3 pr-1 space-y-3 max-h-[420px] scroll-smooth"
      >
        {utterances.length === 0 ? (
          <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-center text-slate-400 mb-3">
              <MessageSquareText className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-slate-300">
              Awaiting Speech Input
            </p>
            <p className="text-[11px] text-slate-400 max-w-sm mt-1">
              Select a synthetic scam scenario above or turn on Live Mic to inspect real-time Hinglish transcription and keyword detection.
            </p>
          </div>
        ) : (
          utterances.map((item) => {
            const isVictim = isVictimSpeaker(item.speaker);
            const speakerStyle = getSpeakerStyle(item.speaker);
            const isHighRisk = item.threat_score >= 70;

            return (
              <React.Fragment key={item.id}>
                {/* Aligned Bubble Container */}
                <div
                  className={`flex flex-col ${
                    isVictim ? 'items-end ml-auto max-w-[85%]' : 'items-start mr-auto max-w-[85%]'
                  }`}
                >
                  {/* Speaker Label with Icon */}
                  <div className={`flex items-center gap-1.5 mb-1 px-1 text-[11px] ${isVictim ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-slate-400 font-mono text-[10px]">{item.timestamp}</span>
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[10px] border ${speakerStyle.pill}`}>
                      {speakerStyle.icon}
                      <span>{item.speaker}</span>
                    </span>
                    {!isVictim && item.latency_ms && (
                      <span className="text-cyan-400/80 font-mono text-[9px]">{item.latency_ms}ms</span>
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
                    {renderHighlightedText(item.text, item.flagged_keywords || [])}
                  </div>
                </div>

                {/* Kavach AI In-Line Intervention Alert Card */}
                {(isHighRisk || item.is_critical) && (
                  <div className="w-full my-2.5 p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/90 via-slate-900/95 to-rose-950/90 border-2 border-rose-500/80 shadow-lg shadow-rose-950/40 animate-pulse text-white">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-rose-400" />
                        <span className="text-xs font-black tracking-wider text-rose-200">
                          🛡️ KAVACH AI INTERVENTION • EXTORTION ALERT
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-600 text-white">
                        ACTIVE DEFENSE
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-100 leading-relaxed">
                      {item.interventions?.hi ||
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
  );
};

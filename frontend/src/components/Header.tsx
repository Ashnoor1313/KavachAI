'use client';

import React from 'react';
import { Shield, ShieldAlert, Phone, Globe, Layers, BookOpen, Activity } from 'lucide-react';
import { TelemetryData } from '@/types';

export type AppViewMode = 'elder' | 'shield' | 'sandbox' | 'forensics' | 'guide';

interface HeaderProps {
  telemetry: TelemetryData | null;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  isConnected: boolean;
  currentView: AppViewMode;
  onViewChange: (view: AppViewMode) => void;
  threatScore?: number;
}

export const Header: React.FC<HeaderProps> = ({
  selectedLanguage,
  onLanguageChange,
  currentView,
  onViewChange,
  threatScore = 0
}) => {
  const isHighThreat = threatScore >= 75;

  const languages = [
    { id: 'hi', label: 'हिंदी' },
    { id: 'hinglish', label: 'Hinglish' },
    { id: 'en', label: 'English' },
    { id: 'kn', label: 'ಕನ್ನಡ' },
    { id: 'ta', label: 'தமிழ்' }
  ];

  return (
    <header className="w-full bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        
        {/* Brand: Clean & Minimalist */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
            isHighThreat
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
          }`}>
            {isHighThreat ? <ShieldAlert className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white">
                Kavach <span className="text-emerald-400 font-extrabold">AI</span>
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-300 border border-slate-700/60">
                Call Shield
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Live Protection from Fake Police & Scam Calls
            </p>
          </div>
        </div>

        {/* Minimal Navigation: Simple & Clear */}
        <nav className="flex items-center bg-slate-900/90 rounded-2xl border border-slate-800 p-1 gap-1">
          <button
            onClick={() => onViewChange('elder')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              currentView === 'elder'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Simple Shield</span>
          </button>

          <button
            onClick={() => onViewChange('shield')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentView === 'shield'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Full Monitor</span>
          </button>

          <button
            onClick={() => onViewChange('guide')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentView === 'guide'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Safety Tips</span>
          </button>
        </nav>

        {/* Right: Language Selector & Emergency Helpline */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Single Clean Language Selector */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedLanguage}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer pr-1"
              aria-label="Select Language"
            >
              {languages.map((l) => (
                <option key={l.id} value={l.id} className="bg-slate-900 text-white">
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* 1930 Helpline Button */}
          <a
            href="tel:1930"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/70 hover:bg-rose-900 text-rose-300 border border-rose-800/60 text-xs font-bold transition-all shadow-sm"
            title="Dial 1930 Cyber Helpline"
          >
            <Phone className="w-3.5 h-3.5 text-rose-400" />
            <span>1930 Help</span>
          </a>
        </div>

      </div>
    </header>
  );
};

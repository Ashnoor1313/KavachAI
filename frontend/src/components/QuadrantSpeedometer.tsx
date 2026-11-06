'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, Siren, Users, Lock, CreditCard } from 'lucide-react';
import { ThreatVectors, RiskLevel } from '@/types';

interface QuadrantSpeedometerProps {
  threatScore: number;
  riskLevel: RiskLevel;
  scamCategory: string;
  vectors: ThreatVectors;
}

export const QuadrantSpeedometer: React.FC<QuadrantSpeedometerProps> = ({
  threatScore,
  riskLevel,
  scamCategory,
  vectors
}) => {
  // SVG Arc Speedometer Calculation
  const radius = 75;
  const strokeWidth = 10;
  const circumference = Math.PI * radius; // 180-degree half-circle
  const scorePercent = Math.min(100, Math.max(0, threatScore));
  const strokeDashoffset = circumference - (scorePercent / 100) * circumference;

  const getColorScheme = () => {
    if (scorePercent >= 75) {
      return {
        badgeBg: 'bg-rose-950/60 text-rose-300 border-rose-600/50',
        scoreColor: 'text-rose-400',
        label: 'CRITICAL EXTORTION',
        icon: <Siren className="w-3.5 h-3.5 text-rose-400 animate-bounce" />,
        borderGlow: 'border-rose-500/60 shadow-lg shadow-rose-950/40'
      };
    }
    if (scorePercent >= 35) {
      return {
        badgeBg: 'bg-amber-950/60 text-amber-300 border-amber-600/50',
        scoreColor: 'text-amber-400',
        label: 'SUSPICIOUS CALL',
        icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
        borderGlow: 'border-amber-500/40'
      };
    }
    return {
      badgeBg: 'bg-emerald-950/60 text-emerald-300 border-emerald-600/50',
      scoreColor: 'text-emerald-400',
      label: 'BENIGN ENVIRONMENT',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />,
      borderGlow: 'border-slate-800/70'
    };
  };

  const scheme = getColorScheme();

  return (
    <div className={`flex flex-col bg-slate-900/40 backdrop-blur-xl rounded-2xl border p-4 shadow-lg transition-all duration-300 ${scheme.borderGlow}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${threatScore >= 75 ? 'bg-rose-500 animate-ping' : 'bg-cyan-400'}`}></div>
          <span className="text-xs font-semibold text-slate-200 tracking-wide">
            Threat & Coercion Index
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${scheme.badgeBg}`}>
            {scheme.icon}
            <span>{scheme.label}</span>
          </span>
        </div>
      </div>

      {/* Speedometer Arc & Big Score Display */}
      <div className="flex flex-col items-center justify-center pt-3 pb-1">
        <div className="relative w-48 h-26 flex items-end justify-center">
          <svg className="w-48 h-26 overflow-visible" viewBox="0 0 190 100">
            <defs>
              <linearGradient id="minimalGaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="45%" stopColor="#f59e0b" />
                <stop offset="85%" stopColor="#f43f5e" />
              </linearGradient>
            </defs>

            {/* Inactive Track */}
            <path
              d="M 20 95 A 75 75 0 0 1 170 95"
              fill="none"
              stroke="#1e293b"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />

            {/* Active Colored Arc */}
            <path
              d="M 20 95 A 75 75 0 0 1 170 95"
              fill="none"
              stroke="url(#minimalGaugeGradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500 ease-out"
            />
          </svg>

          {/* Centered Score */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 pointer-events-none">
            <span className={`text-3xl font-extrabold tracking-tight ${scheme.scoreColor} font-sans`}>
              {scorePercent}<span className="text-base font-semibold text-slate-400">%</span>
            </span>
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
              Coercion Threat
            </span>
          </div>
        </div>

        {/* Scam Category Pill */}
        <div className="mt-2 text-center">
          <span className="inline-block text-[11px] font-medium text-slate-300 bg-slate-950/60 px-3 py-1 rounded-full border border-slate-800">
            Category: <strong className="text-white font-semibold">{scamCategory || 'Benign Audio Stream'}</strong>
          </span>
        </div>
      </div>

      {/* 3 Psychological Vector Bars */}
      <div className="mt-3 pt-3 border-t border-slate-800/60 space-y-2.5">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
          <span>Psychological Threat Vectors</span>
          <span>Index</span>
        </div>

        {/* Vector 1: Authority Impersonation */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Authority Impersonation (CBI/Police)</span>
            </span>
            <span className="font-mono text-cyan-300 font-medium text-[11px]">
              {vectors.authority}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, vectors.authority)}%` }}
            />
          </div>
        </div>

        {/* Vector 2: Panic & Isolation Lock */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Panic & Isolation (&quot;Don&apos;t cut call&quot;)</span>
            </span>
            <span className="font-mono text-amber-300 font-medium text-[11px]">
              {vectors.isolation}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, vectors.isolation)}%` }}
            />
          </div>
        </div>

        {/* Vector 3: Financial Extortion */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-slate-300">
              <CreditCard className="w-3.5 h-3.5 text-rose-400" />
              <span>Financial Extortion (RTGS / UPI PIN)</span>
            </span>
            <span className="font-mono text-rose-300 font-medium text-[11px]">
              {vectors.financial}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, vectors.financial)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

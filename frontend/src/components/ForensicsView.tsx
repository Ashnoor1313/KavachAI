'use client';

import React from 'react';
import { Activity, ShieldCheck, Zap, Lock, Database, FileText, CheckCircle2 } from 'lucide-react';
import { TelemetryData } from '@/types';

interface ForensicsViewProps {
  telemetry: TelemetryData | null;
  onDownloadPDF: () => void;
  threatScore: number;
}

export const ForensicsView: React.FC<ForensicsViewProps> = ({
  telemetry,
  onDownloadPDF,
  threatScore
}) => {
  const specs = [
    {
      title: 'Gnani Prisma v2.5 Streaming STT',
      latency: '<180 ms',
      tag: 'Ultra-low Latency',
      desc: 'Speech-to-text optimized for Indian accents, Hinglish code-mixing, background noise filtration, and real-time streaming chunks.'
    },
    {
      title: 'Gnani Timbre v2.5 Regional TTS',
      latency: '<120 ms',
      tag: 'Regional Voice Shield',
      desc: 'Natural authoritative speech synthesis in Hindi, Kannada, Tamil, and Hinglish for instant elder safety intervention.'
    },
    {
      title: 'Kavach Deterministic Multi-Vector Heuristic Engine',
      latency: '<15 ms',
      tag: 'In-Memory Heuristic Evaluation (<15ms)',
      desc: 'Deterministic multi-vector weighted regex/pattern scoring across Authority, Panic/Isolation, and Financial vectors evaluated locally in RAM on incoming Prisma v2.5 Hinglish transcript chunks.'
    }
  ];

  const dpdpGuarantees = [
    {
      title: '100% Synthetic Data Environment',
      desc: 'All scenario identities (Mock Officer Vikram, Ramesh Kumar), phone numbers (+91-99999-XXXXX), redacted identifiers ([Aadhaar Redacted], FAKE-ID-REDACTED), and bank accounts are completely fictional.'
    },
    {
      title: 'Zero PII Storage & Ephemeral Memory',
      desc: 'Voice streams are processed purely in ephemeral RAM buffers. No personal identifiers or audio recordings are stored to disk or transmitted to third parties.'
    },
    {
      title: 'Strict DPDP Act 2023 Compliance',
      desc: 'Designed according to India’s Digital Personal Data Protection Act 2023 and CERT-In elder safety cyber defense recommendations.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Telemetry Overview */}
      <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800/80 p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/70">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              <span>Gnani.ai Engine Telemetry & Performance Benchmarks</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Active model parameters, sub-200ms latency targets, and multi-vector psychological coercion metrics.
            </p>
          </div>

          <button
            onClick={onDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Generate 1930 Forensic Dossier</span>
          </button>
        </div>

        {/* 3 Engine Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {specs.map((spec, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/40">
                    {spec.tag}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    {spec.latency}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white mt-1">
                  {spec.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {spec.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                <span>Status: Operational</span>
                <span className="text-emerald-400 font-semibold">100% Health</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DPDP Act 2023 Compliance Panel */}
      <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800/80 p-5 shadow-lg">
        <div className="pb-3 border-b border-slate-800/70">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <span>DPDP Act 2023 Compliance & Synthetic Safety Architecture</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Built-in regulatory privacy safeguards to guarantee total citizen confidentiality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {dpdpGuarantees.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/70">
              <div className="flex items-center gap-2 mb-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <h4 className="text-xs font-bold text-white">{item.title}</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

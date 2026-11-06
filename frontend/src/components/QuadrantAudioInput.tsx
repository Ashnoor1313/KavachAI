'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Play, Square, FastForward, ShieldAlert, Zap, PackageCheck, Radio, Sparkles } from 'lucide-react';
import { SyntheticScenario } from '@/types';
import { soundFX } from '@/utils/audioSynth';

interface QuadrantAudioInputProps {
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
}

export const QuadrantAudioInput: React.FC<QuadrantAudioInputProps> = ({
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
  onToggleMic
}) => {
  // Waveform bars state
  const [waveBars, setWaveBars] = useState<number[]>([8, 14, 10, 18, 12, 16, 9, 14, 20, 11, 7, 13]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying || isMicActive) {
      interval = setInterval(() => {
        setWaveBars(Array.from({ length: 14 }, () => Math.floor(Math.random() * 22) + 6));
      }, 120);
    } else {
      setWaveBars([6, 8, 7, 9, 6, 8, 7, 8, 6, 9, 7, 6, 8, 6]);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isMicActive]);

  const handleScenarioClick = (id: string) => {
    soundFX.playClick(700);
    if (isPlaying && activeScenarioId === id) {
      onStopScenario();
    } else {
      onStartScenario(id, speed);
    }
  };

  const scenarioMeta = {
    'scenario-1': {
      icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
      badge: '96% Critical',
      badgeClass: 'bg-rose-950/60 text-rose-400 border-rose-800/40',
      activeBorder: 'border-rose-500/70 bg-rose-950/20 shadow-rose-950/30'
    },
    'scenario-2': {
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      badge: '88% High Risk',
      badgeClass: 'bg-amber-950/60 text-amber-400 border-amber-800/40',
      activeBorder: 'border-amber-500/70 bg-amber-950/20 shadow-amber-950/30'
    },
    'scenario-3': {
      icon: <PackageCheck className="w-4 h-4 text-emerald-400" />,
      badge: '8% Safe Control',
      badgeClass: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40',
      activeBorder: 'border-emerald-500/70 bg-emerald-950/20 shadow-emerald-950/30'
    }
  };

  return (
    <div className="flex flex-col bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-800/70 p-4 shadow-lg transition-all">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50"></div>
          <span className="text-xs font-semibold text-slate-200 tracking-wide">
            Audio Feed & Simulator
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Siren Ambience Toggle */}
          <button
            onClick={() => {
              soundFX.playClick(800);
              onAmbientToggle();
            }}
            title="Toggle Police Siren & Background Noise Simulation"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-colors ${
              ambientNoise
                ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                : 'bg-slate-950/40 border-slate-800/70 text-slate-400 hover:text-slate-300'
            }`}
          >
            <Radio className={`w-3 h-3 ${ambientNoise ? 'animate-pulse text-amber-400' : ''}`} />
            <span>Siren: {ambientNoise ? 'ON' : 'OFF'}</span>
          </button>

          {/* Speed Selector */}
          <div className="flex items-center bg-slate-950/60 rounded-lg border border-slate-800/80 p-0.5 text-[10px]">
            <FastForward className="w-3 h-3 text-slate-400 ml-1 mr-0.5" />
            {[1, 1.5, 2].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
                  speed === s
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Mic & Audio Visualizer Bar */}
      <div className="mt-3 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60 flex items-center justify-between gap-3">
        <button
          onClick={onToggleMic}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isMicActive
              ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/40 animate-pulse'
              : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/50'
          }`}
        >
          {isMicActive ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-cyan-400" />}
          <span>{isMicActive ? 'Mute Mic' : 'Live Mic'}</span>
        </button>

        {/* Dynamic Waveform Visualizer */}
        <div className="flex-1 flex items-center justify-center gap-1 h-7 px-2 bg-slate-900/40 rounded-lg border border-slate-800/40">
          {waveBars.map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}px` }}
              className={`w-1 rounded-full transition-all duration-100 ${
                isPlaying || isMicActive
                  ? activeScenarioId === 'scenario-1'
                    ? 'bg-rose-400'
                    : 'bg-cyan-400'
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Stop Button */}
        {isPlaying && (
          <button
            onClick={() => {
              soundFX.playClick(500);
              onStopScenario();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/50 text-xs font-medium transition-colors"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>Stop Call</span>
          </button>
        )}
      </div>

      {/* 3 Prominent Synthetic Scenarios */}
      <div className="mt-3 space-y-2">
        <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
          <span>Test Scenarios (1-Click Simulation):</span>
          <span className="text-[10px] text-cyan-400/80 font-mono">Prisma v2.5 Hinglish</span>
        </div>

        {scenarios.map((scenario) => {
          const isCurrentActive = activeScenarioId === scenario.id && isPlaying;
          const meta = scenarioMeta[scenario.id as keyof typeof scenarioMeta] || {
            icon: <ShieldAlert className="w-4 h-4 text-cyan-400" />,
            badge: scenario.badge,
            badgeClass: 'bg-cyan-950/60 text-cyan-400 border-cyan-800/40',
            activeBorder: 'border-cyan-500/70 bg-cyan-950/20'
          };

          return (
            <button
              key={scenario.id}
              onClick={() => handleScenarioClick(scenario.id)}
              className={`group w-full text-left p-2.5 rounded-xl border transition-all ${
                isCurrentActive
                  ? `${meta.activeBorder} shadow-md`
                  : 'bg-slate-950/30 hover:bg-slate-800/40 border-slate-800/70 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                    {meta.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                        {scenario.title}
                      </h4>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded border shrink-0 ${meta.badgeClass}`}>
                        {meta.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {scenario.subtitle}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  <div
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      isCurrentActive
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-800/90 text-slate-300 group-hover:bg-slate-700 group-hover:text-white'
                    }`}
                  >
                    {isCurrentActive ? (
                      <>
                        <Square className="w-2.5 h-2.5 fill-current" />
                        <span className="text-[11px]">Streaming</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-2.5 h-2.5 fill-current text-cyan-400" />
                        <span className="text-[11px]">Simulate</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { X, Check, Copy, Share2, MapPin, AlertTriangle, ShieldAlert, Phone, ExternalLink, Send } from 'lucide-react';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  threatScore: number;
  scamCategory: string;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  threatScore,
  scamCategory
}) => {
  const [caregiverPhone, setCaregiverPhone] = useState('+919876543210');
  const [caregiverName, setCaregiverName] = useState('Amit Kumar (Son)');
  const [copied, setCopied] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const victimName = 'Ramesh Kumar (Father)';
  const locationText = 'Tower 4, Flat 502, Green Glen Layout, Bengaluru';
  const mapsLink = 'https://maps.google.com/?q=12.9716,77.5946';

  const emergencyMessage = `🚨 URGENT SCAM EMERGENCY — KAVACH AI ALERT 🚨

Dear ${caregiverName},

Your father ${victimName} is CURRENTLY on a high-risk scam call (${scamCategory || 'Digital Arrest Extortion'}) with a Threat Score of ${threatScore || 96}%.

⚠️ The caller is impersonating Law Enforcement / Mumbai Crime Branch, claiming a fake Narcotics parcel and coercing an urgent RTGS security deposit!

IMMEDIATE ACTION NEEDED:
1. Call his phone IMMEDIATELY to break the scammer's isolation grip!
2. Tell him: "DO NOT TRANSFER ANY MONEY! Police never does Digital Arrests on Skype/WhatsApp."
3. Location: ${locationText}
Map: ${mapsLink}

Kavach AI Voice Shield is currently active.
National Cyber Crime Helpline: 1930`;

  const handleCopy = () => {
    navigator.clipboard.writeText(emergencyMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleOpenWhatsApp = () => {
    const cleanNumber = caregiverPhone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(emergencyMessage);
    const waUrl = cleanNumber
      ? `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSimulateSend = () => {
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-emerald-950/70 border-b border-emerald-800/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Emergency Family Caregiver Dispatch</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/90 text-emerald-300 font-semibold border border-emerald-700/60">
                  WhatsApp SOS
                </span>
              </h3>
              <p className="text-xs text-emerald-300/80 mt-0.5">
                Instantly notify trusted family members to break the victim&apos;s psychological isolation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Quick Target Number Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800/80">
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">
                Family Caregiver Name
              </label>
              <input
                type="text"
                value={caregiverName}
                onChange={(e) => setCaregiverName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/70 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-400 block mb-1">
                WhatsApp Phone Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={caregiverPhone}
                  onChange={(e) => setCaregiverPhone(e.target.value)}
                  placeholder="+919876543210"
                  className="w-full bg-slate-900 border border-slate-700/70 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* WhatsApp Message Preview Bubble */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-300">Message Preview</span>
              <span className="text-[10px] text-emerald-400 font-mono">Auto-generated with live telemetry</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0b141a] border border-[#1f2c34] text-slate-200 text-xs font-sans space-y-2.5 shadow-inner">
              <div className="flex items-center justify-between pb-2 border-b border-[#222e35] text-[11px] text-[#8696a0]">
                <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                  <ShieldAlert className="w-4 h-4" /> Kavach AI Shield Bot
                </span>
                <span>Just Now</span>
              </div>

              <div className="space-y-2 text-xs leading-relaxed text-slate-200">
                <p className="text-rose-400 font-bold text-sm">
                  🚨 URGENT SCAM EMERGENCY — KAVACH AI ALERT 🚨
                </p>
                <p>
                  Dear <span className="font-semibold text-white">{caregiverName}</span>, your father{' '}
                  <span className="font-semibold text-white">{victimName}</span> is{' '}
                  <span className="text-rose-400 font-bold">CURRENTLY</span> being targeted by a coercive{' '}
                  <span className="text-amber-300 font-semibold">{scamCategory || 'Digital Arrest'}</span> scam with a Threat Score of <span className="text-rose-400 font-bold">{threatScore}%</span>.
                </p>
                <p className="text-slate-300 text-[11px]">
                  Caller is impersonating Crime Branch and demanding an urgent money transfer!
                </p>
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2 text-cyan-300 text-xs">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{locationText}</span>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <span className="text-[10px] text-[#8696a0] flex items-center gap-1">
                  Ready to send <Check className="w-3.5 h-3.5 text-cyan-400 inline" />
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              DPDP Compliance Notice: All mock numbers & names are synthetic for testing purposes.
            </span>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy SOS Message'}</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleOpenWhatsApp}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-950/50"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open in WhatsApp</span>
            </button>

            <button
              onClick={handleSimulateSend}
              disabled={isSent}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isSent
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/50'
              }`}
            >
              {isSent ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Sent via API!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Simulate API Dispatch</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

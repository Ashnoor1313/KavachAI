'use client';

import React, { useState } from 'react';
import { BookOpen, ShieldAlert, Phone, ExternalLink, Copy, Check } from 'lucide-react';

export const SafetyGuideView: React.FC = () => {
  const [copiedDraft, setCopiedDraft] = useState(false);

  const complaintDraft = `TO: Cyber Crime Reporting Portal (Helpline 1930)

SUBJECT: Report of Scam / Extortion Call Attempt

RESPECTED SIR/MADAM,

I wish to report a scam phone call:
- Date & Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
- Scam Type: Fake Police / Arrest Scam / Extortion Call
- What happened: The caller impersonated a police or customs officer and demanded money or personal details under false threats.
- Outcome: Protected by Kavach AI; call was hung up before any money was transferred.

Please block the scammer's number and investigate.

Thank you,
Concerned Citizen`;

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(complaintDraft);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2200);
  };

  const simpleRules = [
    {
      num: '01',
      title: 'Police never arrest people over video calls',
      desc: 'Real police or CBI will NEVER call you on WhatsApp, Skype, or phone to place you under "Digital Arrest". If someone demands this, hang up immediately.'
    },
    {
      num: '02',
      title: 'Banks never ask you to transfer money to "safe accounts"',
      desc: 'The Reserve Bank of India (RBI) or your bank will never tell you to move your savings into a verification account. That is always a fraud.'
    },
    {
      num: '03',
      title: 'Never install screen sharing apps (AnyDesk, QuickSupport)',
      desc: 'Nobody from your electricity board or bank needs to control your phone screen to update a bill or KYC. Never download apps for callers.'
    },
    {
      num: '04',
      title: 'UPI PIN is only to send money, never to receive money',
      desc: 'You never have to enter your secret UPI PIN to receive money, refunds, or cashback. Entering your PIN sends money out of your bank.'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <span>Simple Safety Guide & 1930 Helpline</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Basic rules everyone should know to avoid phone call frauds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:1930"
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow"
            >
              <Phone className="w-4 h-4" />
              <span>Call Helpline: 1930</span>
            </a>

            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
            >
              <span>cybercrime.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* 4 Simple Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {simpleRules.map((rule, idx) => (
          <div
            key={idx}
            className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5"
          >
            <div className="text-base font-black text-emerald-400 font-mono bg-emerald-950/60 w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-emerald-800/40">
              {rule.num}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {rule.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {rule.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Simple 1930 Complaint Draft */}
      <div className="bg-slate-900/60 rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Ready Complaint Message for 1930</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Copy and use if you need to file a report at cybercrime.gov.in.
            </p>
          </div>

          <button
            onClick={handleCopyDraft}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700"
          >
            {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedDraft ? 'Copied!' : 'Copy Text'}</span>
          </button>
        </div>

        <div className="mt-3.5 p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
          {complaintDraft}
        </div>
      </div>
    </div>
  );
};

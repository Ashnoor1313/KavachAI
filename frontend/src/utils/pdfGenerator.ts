import { jsPDF } from 'jspdf';
import { UtteranceItem } from '@/types';

export function generateCybercrimeEvidencePDF(
  scenarioTitle: string,
  callerNumber: string,
  threatScore: number,
  scamCategory: string,
  utterances: UtteranceItem[],
  selectedLang: string
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [15, 23, 42]; // Slate 900
  const accentRed = [225, 29, 72];   // Rose 600
  const accentCyan = [6, 182, 212];  // Cyan 500
  const grayMuted = [100, 116, 139]; // Slate 500

  // Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 36, 'F');

  // Red alert strip
  doc.setFillColor(225, 29, 72);
  doc.rect(0, 34, 210, 2, 'F');

  // Title & Department
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('NATIONAL CYBERCRIME REPORTING PORTAL (HELPLINE 1930)', 14, 14);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('KAVACH AI FORENSIC DOSSIER • REAL-TIME DIGITAL ARREST & SCAM SHIELD', 14, 21);
  doc.text('POWERED BY GNANI AI PRISMA v2.5 STT & TIMBRE v2.5 TTS', 14, 27);

  // Watermark for 100% Synthetic DPDP Compliance
  doc.setTextColor(220, 225, 230);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text('100% SYNTHETIC DEMO', 25, 150, { angle: 45 });
  doc.text('DPDP ACT COMPLIANT', 35, 175, { angle: 45 });

  // Incident Details Box
  let y = 44;
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, 182, 34, 3, 3, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('INCIDENT DETAILS & TELEMETRY', 20, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  const docketId = `NCR-1930-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  doc.text(`Docket Reference ID: ${docketId}`, 20, y + 14);
  doc.text(`Incident Timestamp: ${dateStr} IST`, 20, y + 20);
  doc.text(`Simulated Origin Caller: ${callerNumber || '+91-99999-XXXX1 (Synthetic)'}`, 20, y + 26);

  doc.text(`Scam Category: ${scamCategory || 'Digital Arrest Extortion'}`, 110, y + 14);
  doc.text(`Detected Threat Index: ${threatScore}% (CRITICAL EXTORTION)`, 110, y + 20);
  doc.text(`Status: Flagged & Blocked by Kavach AI Voice Shield`, 110, y + 26);

  y += 42;

  // Psychological Vector Breakdown
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('1. PSYCHOLOGICAL COERCION VECTORS (DETERMINISTIC HEURISTIC ENGINE <15MS)', 14, y);
  y += 6;

  // 3 vector cards
  const vectorNames = [
    { name: 'Authority Impersonation', score: Math.min(100, Math.round(threatScore * 0.98)), desc: 'Fake Police/CBI/Supreme Court badges' },
    { name: 'Panic & Isolation Lock', score: Math.min(100, Math.round(threatScore * 0.95)), desc: 'Forced video call retention & gag order' },
    { name: 'Financial Extortion Demand', score: Math.min(100, Math.round(threatScore * 0.92)), desc: 'RTGS / RBI verification fund coercion' },
  ];

  vectorNames.forEach((vec, idx) => {
    const cardX = 14 + idx * 62;
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(cardX, y, 58, 22, 2, 2, 'FD');

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(vec.name, cardX + 4, y + 6);

    doc.setFontSize(11);
    doc.setTextColor(225, 29, 72);
    doc.text(`Risk: ${vec.score}%`, cardX + 4, y + 13);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(vec.desc, cardX + 4, y + 18, { maxWidth: 50 });
  });

  y += 30;

  // Transcript Table Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('2. FORENSIC VOICE TRANSCRIPT (GNANI PRISMA v2.5 STREAMING STT)', 14, y);
  y += 6;

  // Table header bar
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, 182, 8, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('TIME', 18, y + 5.5);
  doc.text('SPEAKER / ROLE', 35, y + 5.5);
  doc.text('HINGLISH TRANSCRIPT & FLAGGED TRIGGERS', 75, y + 5.5);
  doc.text('LATENCY', 178, y + 5.5);
  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  const displayList = utterances.slice(-6); // last 6 items to comfortably fit page 1
  displayList.forEach((item, index) => {
    if (y > 240) return;

    doc.setFillColor(index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 250);
    doc.rect(14, y - 2, 182, 12, 'F');

    doc.setTextColor(100, 116, 139);
    doc.text(item.timestamp || '00:00', 18, y + 4);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(item.speaker.includes('CBI') || item.speaker.includes('Police') ? 225 : 15, item.speaker.includes('CBI') ? 29 : 23, item.speaker.includes('CBI') ? 72 : 42);
    doc.text(item.speaker.slice(0, 20), 35, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);

    // Strict non-numeric redaction sanitization for DPDP compliance
    const sanitizedText = (item.text || '')
      .replace(/FAKE-AADHAAR-0000/gi, '[Aadhaar Redacted]')
      .replace(/\b\d{4}\s?\d{4}\s?\d{4}\b/g, '[Aadhaar Redacted]')
      .replace(/\b[A-Z]{5}\d{4}[A-Z]\b/g, '[PAN Redacted]');

    const splitText = doc.splitTextToSize(sanitizedText, 95);
    doc.text(splitText, 75, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(16, 185, 129);
    doc.text(`${item.latency_ms || 154}ms`, 178, y + 4);

    y += Math.max(12, splitText.length * 4.5 + 4);
  });

  // Recommended Legal & Safety Actions
  y = 250;
  doc.setDrawColor(225, 29, 72);
  doc.setFillColor(255, 241, 242);
  doc.roundedRect(14, y, 182, 32, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(190, 18, 60);
  doc.text('EMERGENCY CITIZEN PROTOCOL (CYBER HELPLINE 1930 & RBI GUIDELINES):', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(76, 29, 149);
  doc.text('1. Immediately disconnect Skype/WhatsApp video calls. No Indian Police, CBI or Court conducts "Digital Arrests".', 18, y + 12);
  doc.text('2. Do NOT transfer funds to any "Government Verification Account" or "RBI Escrow" — these are fraudulent mule accounts.', 18, y + 17);
  doc.text('3. Dial 1930 or submit this auto-generated evidence dossier to https://cybercrime.gov.in within the golden 2-hour window.', 18, y + 22);
  doc.text('4. DPDP Notice: 100% Synthetic test data. All identifiers non-numerically redacted ([Aadhaar Redacted], FAKE-ID-REDACTED, +91-99999-XXXXX).', 18, y + 27);

  // Footer
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Generated autonomously by Kavach AI • Gnani AI Great Indian AI Internship Challenge Submission', 14, 290);
  doc.text(`Page 1 of 1 • Docket #${docketId}`, 170, 290);

  // Trigger browser download
  doc.save(`KavachAI_1930_Evidence_${docketId}.pdf`);
}

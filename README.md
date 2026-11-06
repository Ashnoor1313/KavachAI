# 🛡️ KAVACH AI — Live Digital Arrest & UPI Scam Shield
### *Submission for Gnani.ai "Great Indian AI Internship Challenge"*
**Real-Time Psychological Coercion & Digital Arrest Defense System Powered by Gnani AI**

---

## 📌 Executive Summary
**Kavach AI** is a real-time, multilingual cybersecurity shield built to protect Indian senior citizens and vulnerable citizens from **"Digital Arrest" extortion** (fake CBI, Mumbai Police, Narcotics, and Customs video calls) and **urgent UPI/KYC fraud**.

By fusing **Gnani AI Prisma v2.5** (Ultra-low latency streaming Speech-to-Text with Hinglish code-mixing) and **Gnani AI Timbre v2.5** (Regional Text-to-Speech Voice Shield in Hindi, Kannada, and Tamil), Kavach AI intercepts coercive audio streams in real time, computes a multi-vector Psychological Coercion Index, and deploys high-priority voice counter-measures before victims transfer life savings to fraudulent accounts.

---

## 🏛️ DPDP Act 2023 Compliance & Synthetic Safety Guarantee
- **100% Synthetic Data Only**: To strictly comply with India's **Digital Personal Data Protection (DPDP) Act 2023**, all pre-loaded scenarios, officer names (e.g. *Mock Officer Vikram*, *Inspector Rathore*), Aadhaar numbers (`FAKE-AADHAAR-0000`), phone numbers (`+91-99999-XXXXX`), and transaction IDs are completely fictional.
- Visible **"DPDP Compliant • 100% Synthetic Demo Environment"** badge is active throughout the system.
- Zero PII is stored or transmitted.

---

## ⚡ Gnani AI Engine Integration
| Engine | Model Version | Target Latency | Key Role in Kavach AI |
|---|---|---|---|
| **Streaming STT** | **Gnani Prisma v2.5** | **<180 ms** | Transcribes Indian English + Hindi (Hinglish) code-mixing in real time |
| **Regional TTS** | **Gnani Timbre v2.5** | **<120 ms** | Synthesizes authoritative elder-safety warnings in Hindi, Tamil, & Kannada |
| **Coercion Engine** | **Kavach Multi-Vector Engine** | **<15 ms** | Real-time Coercion scoring across Authority, Isolation, & Financial vectors |

---

## 🖥️ 4-Quadrant Command Center Architecture (Single-Screen Demo)
```
+----------------------------------------------------------------------------------------------------+
| TOP HEADER: KAVACH AI • Gnani Prisma v2.5 (<180ms) • Gnani Timbre v2.5 • DPDP Compliant • Lang Sel  |
+--------------------------------------------------+-------------------------------------------------+
| QUADRANT 1 (Top-Left): Audio Input & Simulator   | QUADRANT 3 (Top-Right): Coercion Speedometer   |
| • Live Microphone with Animated Audio Waveform   | • 0–100% Semi-Circle Arc Dynamic Gauge          |
| • 1-Click Synthetic Scam Scenarios:              | • Dynamic Color Shifts: Green -> Amber -> Red   |
|   1. FedEx Narcotics & Fake CBI Digital Arrest   | • 3 Psychological Vector Bars:                  |
|   2. Electricity Bill & Bank KYC UPI Scam        |    - Authority Impersonation (CBI/Police)       |
|   3. Amazon Delivery Call (Benign Control)       |    - Panic & Isolation ("Don't cut video call") |
| • Speed Multiplier (1x/1.5x/2x) & Siren Ambience |    - Financial Extortion (RTGS / RBI / UPI PIN) |
+--------------------------------------------------+-------------------------------------------------+
| QUADRANT 2 (Bottom-Left): Live Transcript Stream | QUADRANT 4 (Bottom-Right): Voice Intervention   |
| • Gnani Prisma v2.5 Hinglish Streaming STT       | • Timbre v2.5 Regional Voice Warning Playback   |
| • Per-utterance Latency Badge (e.g. 154ms)       | • Full-Card Flashing Red Banner at >=75% Threat |
| • Glowing Red/Amber Inline Keyword Highlights    | • Download 1930 Cybercrime Evidence PDF (jsPDF) |
| • Speaker Roles (Officer / Victim / IVR)         | • Send WhatsApp SOS Broadcast to Caregiver      |
+--------------------------------------------------+-------------------------------------------------+
```

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- **Node.js**: v18+ or v20+
- **Python**: v3.10+
- **npm** or **pnpm**

### 2. Environment Configuration
Copy `.env.example` to `backend/.env`:
```bash
# In project root:
cp .env.example backend/.env
```

Your `backend/.env` file:
```env
# Gnani.ai API Credentials (Optional: Built-in Demo Simulation Mode works out-of-the-box)
GNANI_API_KEY=your_gnani_api_key_here
GNANI_TOKEN=your_gnani_token_here
GNANI_STT_URL=https://api.gnani.ai/prisma/v2.5/stt
GNANI_TTS_URL=https://api.gnani.ai/timbre/v2.5/tts

# Demo Simulation Mode (Allows 100% offline demonstration conserving API credits)
DEMO_SIMULATION_MODE=true
BACKEND_PORT=8000
DPDP_COMPLIANCE_MODE=true
SYNTHETIC_DATA_ONLY=true
```

---

### 3. Running the Backend (FastAPI + WebSockets)
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
Backend API will be running at: `http://localhost:8000`  
Interactive Swagger docs: `http://localhost:8000/docs`  
WebSocket Stream: `ws://localhost:8000/ws/stream`

---

### 4. Running the Frontend (Next.js 14 App Router)
In a separate terminal window:
```bash
cd frontend
npm install
npm run dev
```
Frontend will be running at: `http://localhost:3000`

---

## 🧪 Testing the 3 Pre-Loaded Synthetic Scenarios
Open `http://localhost:3000`:
1. **Scenario 1: FedEx Narcotics & Fake CBI Digital Arrest**
   - Click **"Simulate"** on Scenario 1.
   - Watch the siren audio activate, Gnani Prisma v2.5 streaming Hinglish transcript, and threat score escalate from **18% -> 52% -> 82% -> 96%**.
   - At **>= 75%**, the flashing red alert banner triggers, and **Gnani Timbre v2.5** speaks the regional warning out loud!
2. **Scenario 2: Electricity Bill & Bank KYC UPI Scam**
   - Watch the coercion engine catch the QuickSupport screen-share and UPI PIN harvesting attempt (**88% High Risk**).
3. **Scenario 3: Amazon Delivery & Family Call (Benign Control)**
   - Stays under **8% (Green/Safe)** to demonstrate zero false positives on everyday Hinglish conversations.

---

## 📄 Forensic Evidence & 1930 Cybercrime Dossier
- Click **"Download 1930 Evidence PDF"** to generate an official-looking evidence dossier formatted for India's **National Cybercrime Reporting Portal (Helpline 1930 / cybercrime.gov.in)**.
- Includes automated Docket ID, incident timestamp, psychological coercion breakdown, full timestamped voice transcript with trigger tags, and the synthetic DPDP compliance watermark.

---

## 👥 Built with Pride for Gnani AI
Designed and engineered for the **Gnani AI Great Indian AI Internship Challenge**.
Protected by Kavach AI • DPDP Act 2023 Compliant.

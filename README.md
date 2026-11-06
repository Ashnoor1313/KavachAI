# 🛡️ KAVACH AI — Live Digital Arrest & Scam Call Shield
**Submission for the "Great Indian AI Internship Challenge 2026 by Gnani AI"**  
*Real-Time Psychological Coercion & Digital Arrest Defense System Powered by Gnani AI*

---

## 🏆 Target Challenge Award Tracks
* **Mixed Vibes:** Native Hinglish code-mixed speech transcription and coercion detection via **Gnani Prisma v2.5**.
* **Real Deal:** Tackling India's high-stakes "Digital Arrest" and UPI extortion crisis targeting senior citizens.
* **Noise Canceller:** Extracting scammer intimidation speech accurately even over background police sirens and acoustic speakerphone noise.

---

## 📌 1. Executive Summary & Problem Statement
In India, "Digital Arrest" extortion scams and urgent UPI/KYC fraud have escalated into a national cybersecurity emergency. Fraudsters impersonate officers from the CBI, Mumbai Crime Branch, Narcotics Control Bureau (NCB), Customs, and the Supreme Court, using aggressive psychological coercion, fake arrest warrants, and threats of immediate raids over WhatsApp and video calls to intimidate citizens—particularly senior citizens—into transferring their life savings into fraudulent "verification accounts."

**Kavach AI** is a real-time, multilingual cybersecurity web companion operating in **Speakerphone Companion Mode**. By fusing **Gnani AI's Prisma v2.5** (streaming Speech-to-Text with Hinglish code-mixing) and **Timbre v2.5** (regional Text-to-Speech Voice Shield), Kavach AI listens to live speakerphone call audio, evaluates psychological extortion patterns in sub-15ms via an in-memory deterministic heuristic engine, and triggers decisive visual and spoken regional countermeasures before victims can transfer funds.

---

## ⚡ 2. Core Gnani AI Engine Integrations

| Component | Engine / Version | Benchmark / Local Latency | Role in Kavach AI |
| :--- | :--- | :--- | :--- |
| **Streaming STT** | **Gnani Prisma v2.5** | `<180 ms` (Engine Benchmark) | Transcribes live 16kHz PCM audio with Indian English, Hindi, and Hinglish code-mixing in real time. |
| **Regional TTS** | **Gnani Timbre v2.5** | `<120 ms` (Engine Benchmark) | Synthesizes authoritative elder-safety voice warnings in Hindi, Hinglish, Kannada, Tamil, and English. |
| **Coercion Scorer** | **Kavach Heuristic Engine v2.5** | `<15 ms` (Local In-Memory) | Deterministic multi-vector weighted regex/pattern scoring across Authority, Panic/Isolation, and Financial vectors. |

*Note: Sub-15ms coercion scoring is evaluated locally in-memory on incoming Prisma v2.5 transcript chunks. End-to-end API round-trip latency is dynamically measured and displayed in the live UI.*

---

## 🧠 3. How It Works: The 3-Vector Coercion Detection
Unlike single-keyword filters, Kavach AI evaluates the **Psychological Coercion Index (0–100%)** across three distinct extortion vectors:

```text
                      ┌────────────────────────────────────────┐
                      │  INCOMING SPEAKERPHONE CALL AUDIO      │
                      │    (16kHz Mono PCM Web Audio Stream)   │
                      └──────────────────┬─────────────────────┘
                                         ▼
                      ┌────────────────────────────────────────┐
                      │    Gnani Prisma v2.5 Streaming STT     │
                      │   (Hinglish Code-Mixed Transcription)  │
                      └──────────────────┬─────────────────────┘
                                         ▼
                      ┌────────────────────────────────────────┐
                      │  Kavach Deterministic Heuristic Engine │
                      │     (<15ms In-Memory Pattern Scorer)   │
                      ├────────────────────────────────────────┤
                      │  Vector 1: Authority Impersonation     │
                      │  (CBI, Police, Customs, Warrant, FIR)  │
                      │                                        │
                      │  Vector 2: Panic & Isolation Pressure  │
                      │  ("Don't cut call", "Secret Act")      │
                      │                                        │
                      │  Vector 3: Financial Extortion Demand  │
                      │  (RTGS, Verification Account, UPI PIN) │
                      └──────────────────┬─────────────────────┘
                                         ▼
            ┌────────────────────────────┴────────────────────────────┐
            ▼                                                         ▼
  [Threat Score < 35%: SAFE]                              [Threat Score >= 75%: CRITICAL DANGER]
• Soft green status                                     • Screen flashes red with pulsing alert
• "All Safe — Normal Call"                              • Timbre v2.5 Regional Voice Warning spoken aloud
                                                        • 1-Tap WhatsApp SOS Deep Link to family (with GPS)
                                                        • 1-Tap 1930 Cyber Helpline dialer
                                                        • Auto-generated 1930 Police Evidence PDF (jsPDF)
```

---

## 🎙️ 4. Audio Pipeline & Technical Architecture

### Speakerphone Companion Mode
Web browsers cannot intercept native cellular GSM calls directly without OS-level Android `CallScreeningService` permissions. Kavach AI operates in **Speakerphone Companion Mode**: when an incoming suspicious or unknown call arrives, the user puts the call on speakerphone and places the phone near their laptop or companion device.

### Primary Live Pipeline: 16kHz Mono PCM Streaming
- **Microphone Capture:** Uses `AudioContext` / `MediaStream` configured for 16kHz 16-bit Mono PCM audio with active noise suppression, echo cancellation, and automatic gain control.
- **WebSocket Streaming:** Chunks of 16-bit signed PCM audio are transmitted in real time over `/ws/stream` to FastAPI's Gnani Prisma v2.5 connector.
- **Offline UI Sandbox Mode Isolation:** Any browser Web Speech API (`webkitSpeechRecognition`) fallback is strictly isolated behind an explicit toggle labeled **"Offline UI Sandbox Mode (No API Credits Used)"**, ensuring complete transparency during technical review. The default active pipeline is **"Live Gnani Prisma v2.5 API Stream (16kHz PCM)"**.

---

## 📊 5. Telemetry & Latency Honesty
Kavach AI avoids unverified claims by strictly distinguishing between:
1. **Engine Benchmarks:**
   - Gnani Prisma v2.5 Streaming STT: `<180 ms`
   - Gnani Timbre v2.5 Regional TTS: `<120 ms`
2. **In-Memory Heuristic Evaluation:**
   - Coercion vector calculation: `<15 ms` (transparent, zero-latency weighted regex/pattern matching in RAM)
3. **Measured API Round-Trip Latency (ms):**
   - Dynamically calculated from client request to response receipt timestamps and updated live in the top telemetry bar and live monitor.

---

## 🔒 6. 100% Synthetic DPDP Act 2023 Compliance
To guarantee strict compliance with India's **Digital Personal Data Protection (DPDP) Act 2023** and CERT-In elder safety guidelines:
- **Non-Numeric Redactions:** All mock scenarios, transcript displays, and PDF reports use non-numeric placeholders for government IDs and credentials:
  - Aadhaar: `[Aadhaar Redacted]`
  - PAN: `[PAN Redacted]`
  - Phone: `+91-99999-XXXXX`
  - Officer Names: Fictional synthetic identities (*Mock Officer Vikram*, *Inspector Rathore*)
- **Zero Disk Retention:** Audio chunks and intermediate transcripts are processed ephemerally in RAM buffers and never stored on disk.
- **Watermarked Evidence Dossier:** Auto-generated 1930 Cybercrime Police Dossiers contain an explicit synthetic compliance watermark.

---

## 🚀 7. Quickstart & Deployment Guide

### Prerequisites
- **Node.js**: v18+ or v20+
- **Python**: v3.10+
- **npm** or **pnpm**

### Environment Configuration
Copy `.env.example` to `backend/.env`:
```bash
cp .env.example backend/.env
```

`backend/.env`:
```env
GNANI_API_KEY=your_gnani_api_key_here
GNANI_TOKEN=your_gnani_token_here
GNANI_STT_URL=https://api.gnani.ai/prisma/v2.5/stt
GNANI_TTS_URL=https://api.gnani.ai/timbre/v2.5/tts

# Demo Simulation Mode (Allows 100% offline testing without consuming API credits)
DEMO_SIMULATION_MODE=true
BACKEND_PORT=8000
DPDP_COMPLIANCE_MODE=true
SYNTHETIC_DATA_ONLY=true
```

### Running Locally
```bash
# Terminal 1: Backend
cd backend
python -m pip install -r requirements.txt
python run.py

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```
- Frontend UI: `http://localhost:3000`
- Backend API Docs: `http://localhost:8000/docs`
- WebSocket Endpoint: `ws://localhost:8000/ws/stream`

### Docker Deployment
```bash
docker-compose up --build
```

---

## 🏛️ Submission Details
- **Project Name:** Kavach AI — Live Digital Arrest & Scam Call Shield
- **Target Internship:** Great Indian AI Internship Challenge 2026 by Gnani AI
- **Developer:** Ashnoor Singh
- **Repository:** [Ashnoor1313/KavachAI](https://github.com/Ashnoor1313/KavachAI)

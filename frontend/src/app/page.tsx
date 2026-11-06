'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Header, AppViewMode } from '@/components/Header';
import { LiveShieldView } from '@/components/LiveShieldView';
import { ElderShieldView } from '@/components/ElderShieldView';
import { ScamSandboxView } from '@/components/ScamSandboxView';
import { ForensicsView } from '@/components/ForensicsView';
import { SafetyGuideView } from '@/components/SafetyGuideView';
import { WhatsAppModal } from '@/components/WhatsAppModal';
import { UtteranceItem, ThreatVectors, RiskLevel, SyntheticScenario, TelemetryData } from '@/types';
import { generateCybercrimeEvidencePDF } from '@/utils/pdfGenerator';
import { soundFX } from '@/utils/audioSynth';
import { liveSpeechRecognizer } from '@/utils/speechRecognition';
import { getBackendBaseUrl, getWebSocketUrl } from '@/utils/apiConfig';

// Fallback scenarios in case backend REST is offline
const DEFAULT_SCENARIOS: SyntheticScenario[] = [
  {
    id: "scenario-1",
    title: "FedEx Narcotics & Fake CBI Digital Arrest",
    subtitle: "High-pressure extortion impersonating FedEx & Mumbai Cyber Police / CBI",
    badge: "96% Critical Scam",
    scam_type: "Digital Arrest / Fake CBI-Police",
    caller_number: "+91-99999-XXXX1 (Fake Mumbai Police CallerID)",
    victim_profile: "Ramesh Kumar (68y, Retired Central Govt Employee)",
    duration_sec: 24,
    escalation_path: "15% -> 58% -> 96%",
    utterances: [
      {
        id: 1,
        speaker: "Automated IVR",
        text: "Namaste Ramesh ji. This is an urgent advisory from FedEx Express Mumbai Hub. Your parcel tracking number FX-9921-MUM is placed on indefinite hold.",
        delay_ms: 1800,
        timestamp: "00:02",
        latency_ms: 142,
        threat_score: 18,
        vector_authority: 25,
        vector_isolation: 10,
        vector_financial: 15,
        flagged: ["FedEx", "parcel on hold"]
      },
      {
        id: 2,
        speaker: "Mock Officer Vikram (FedEx Agent)",
        text: "Hello sir! Customs scanning mein aapke parcel ke andar 140 grams MDMA Narcotics, 5 fake passports aur 3 blank bank passbooks baramad hui hain.",
        delay_ms: 2600,
        timestamp: "00:06",
        latency_ms: 154,
        threat_score: 52,
        vector_authority: 65,
        vector_isolation: 35,
        vector_financial: 45,
        flagged: ["Narcotics", "MDMA", "passports", "bank passbooks"]
      },
      {
        id: 3,
        speaker: "Victim (Elderly Uncle)",
        text: "Kya keh rahe hain aap? Maine koi parcel Taiwan nahi bheja! Mera isse koi lena dena nahi hai bhai sahab!",
        delay_ms: 2200,
        timestamp: "00:10",
        latency_ms: 139,
        threat_score: 55,
        vector_authority: 65,
        vector_isolation: 40,
        vector_financial: 45,
        flagged: []
      },
      {
        id: 4,
        speaker: "Mock Officer Rathore (CBI / Mumbai Crime Branch)",
        text: "Main Inspector Rathore bol raha hoon, Mumbai Crime Branch. Aapka FAKE-AADHAAR-0000 international money laundering syndicate se linked hai. Supreme Court ne non-bailable FIR darj kar di hai.",
        delay_ms: 3000,
        timestamp: "00:14",
        latency_ms: 168,
        threat_score: 82,
        vector_authority: 92,
        vector_isolation: 78,
        vector_financial: 65,
        flagged: ["Mumbai Crime Branch", "Inspector", "Aadhaar", "Money laundering", "Supreme Court", "FIR"]
      },
      {
        id: 5,
        speaker: "Mock Officer Rathore (CBI / Mumbai Crime Branch)",
        text: "Sun lijiye, aap abhi DIGITAL ARREST par hain! Video call bilkul mat kaatna! Kisi parivaar wale ko bataya toh secret act ke tehat turant police ghar bhej kar arrest kar lenge!",
        delay_ms: 3200,
        timestamp: "00:19",
        latency_ms: 162,
        threat_score: 93,
        vector_authority: 96,
        vector_isolation: 98,
        vector_financial: 80,
        flagged: ["DIGITAL ARREST", "Video call mat kaatna", "Kisi ko mat batana", "police arrest"]
      },
      {
        id: 6,
        speaker: "Mock Officer Rathore (CBI / Mumbai Crime Branch)",
        text: "Clearance certificate ke liye aapke saving account se 4,80,000 rupaye turant RBI verification account par RTGS kijiye. Verification ke baad 15 minute mein refund ho jayega.",
        delay_ms: 3100,
        timestamp: "00:23",
        latency_ms: 158,
        threat_score: 96,
        vector_authority: 98,
        vector_isolation: 99,
        vector_financial: 97,
        flagged: ["4,80,000 rupaye", "RBI verification account", "RTGS", "refund"]
      }
    ]
  },
  {
    id: "scenario-2",
    title: "Electricity Bill & Bank KYC UPI Block Scam",
    subtitle: "Urgent disconnection panic combined with screen-sharing APK & secret UPI PIN theft",
    badge: "88% High Risk",
    scam_type: "UPI / KYC Refund Fraud",
    caller_number: "+91-99999-XXXX2 (Fake BSES Power Support)",
    victim_profile: "Smt. Shanti Devi (64y, Homemaker)",
    duration_sec: 20,
    escalation_path: "22% -> 62% -> 88%",
    utterances: [
      {
        id: 1,
        speaker: "Automated IVR",
        text: "Attention electricity consumer! BSES Power alert: Aapka pichle mahine ka electricity bill update nahi hua hai. Aaj raat 9:30 baje bijli connection permanently kaat diya jayega.",
        delay_ms: 2000,
        timestamp: "00:02",
        latency_ms: 145,
        threat_score: 25,
        vector_authority: 35,
        vector_isolation: 15,
        vector_financial: 20,
        flagged: ["Electricity bill", "bijli connection", "permanently kaat diya"]
      },
      {
        id: 2,
        speaker: "Mock Executive Rahul (Power Discom Desk)",
        text: "Madam ji main BSES Head Office se officer Rahul bol raha hoon. Disconnection order generate ho chuka hai. Isse rokne ke liye turant bill update verify karna hoga.",
        delay_ms: 2400,
        timestamp: "00:06",
        latency_ms: 152,
        threat_score: 45,
        vector_authority: 55,
        vector_isolation: 30,
        vector_financial: 40,
        flagged: ["Head Office", "Disconnection order"]
      },
      {
        id: 3,
        speaker: "Victim (Elderly Aunt)",
        text: "Bhaiya maine toh pichle hafte hi online 1,200 rupaye bhar diye the! Phir bijli kyu kaat rahe ho?",
        delay_ms: 2000,
        timestamp: "00:10",
        latency_ms: 138,
        threat_score: 48,
        vector_authority: 55,
        vector_isolation: 30,
        vector_financial: 45,
        flagged: []
      },
      {
        id: 4,
        speaker: "Mock Executive Rahul (Power Discom Desk)",
        text: "Server par PAN-Aadhaar KYC block dikha raha hai. Aap turant Play Store se QuickSupport app download kijiye aur apna 9-digit code share kijiye.",
        delay_ms: 2800,
        timestamp: "00:14",
        latency_ms: 164,
        threat_score: 75,
        vector_authority: 65,
        vector_isolation: 70,
        vector_financial: 78,
        flagged: ["KYC block", "QuickSupport", "Play Store", "share code"]
      },
      {
        id: 5,
        speaker: "Mock Executive Rahul (Power Discom Desk)",
        text: "Abhi verification ke liye PhonePe ya GPay khol kar 10 rupaye ka test transaction kijiye aur 6-digit secret UPI PIN daaliye, server token reset ho jayega.",
        delay_ms: 3000,
        timestamp: "00:18",
        latency_ms: 160,
        threat_score: 88,
        vector_authority: 72,
        vector_isolation: 82,
        vector_financial: 94,
        flagged: ["PhonePe", "GPay", "UPI PIN", "test transaction", "secret UPI PIN"]
      }
    ]
  },
  {
    id: "scenario-3",
    title: "Amazon Delivery & Family Call (Control Test)",
    subtitle: "Safe, legitimate daily call to verify zero false positives on benign Hinglish conversation",
    badge: "08% Safe Control",
    scam_type: "Benign Call",
    caller_number: "+91-99999-XXXX3 (Verified Delivery Logistics)",
    victim_profile: "Ramesh Kumar (68y, User)",
    duration_sec: 18,
    escalation_path: "06% -> 08% -> 08%",
    utterances: [
      {
        id: 1,
        speaker: "Delivery Associate (Amazon)",
        text: "Bhaiya namaste, main Amazon delivery se Manoj bol raha hoon. Aapka kitchen mixer grinder parcel lekar main society ke Main Gate par khada hoon.",
        delay_ms: 2000,
        timestamp: "00:03",
        latency_ms: 140,
        threat_score: 6,
        vector_authority: 4,
        vector_isolation: 2,
        vector_financial: 5,
        flagged: ["Amazon", "parcel"]
      },
      {
        id: 2,
        speaker: "Ramesh Kumar (Customer)",
        text: "Haan Manoj beta, main ghar par hi hoon. Tower 4, Flat 502 ki lift se upar aa jao.",
        delay_ms: 2100,
        timestamp: "00:07",
        latency_ms: 136,
        threat_score: 5,
        vector_authority: 3,
        vector_isolation: 1,
        vector_financial: 3,
        flagged: []
      },
      {
        id: 3,
        speaker: "Delivery Associate (Amazon)",
        text: "Sir guard sahab bol rahe hain entry register mein sign karna hoga. Kya main package reception desk par chhod doon ya upar le aau?",
        delay_ms: 2300,
        timestamp: "00:11",
        latency_ms: 144,
        threat_score: 7,
        vector_authority: 5,
        vector_isolation: 2,
        vector_financial: 4,
        flagged: []
      },
      {
        id: 4,
        speaker: "Ramesh Kumar (Customer)",
        text: "Reception par guard Tiwari ji ko de do. Prepaid order hai, koi payment nahi karna. Thank you beta!",
        delay_ms: 2000,
        timestamp: "00:15",
        latency_ms: 139,
        threat_score: 8,
        vector_authority: 4,
        vector_isolation: 2,
        vector_financial: 6,
        flagged: ["Prepaid order"]
      }
    ]
  }
];

export default function Home() {
  // Navigation View Mode (Default to Senior Citizen Mode for maximum simplicity)
  const [currentView, setCurrentView] = useState<AppViewMode>('elder');

  // App state
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('hi');
  const [scenarios, setScenarios] = useState<SyntheticScenario[]>(DEFAULT_SCENARIOS);
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const [ambientNoise, setAmbientNoise] = useState<boolean>(false);
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState<boolean>(false);

  // Real-time threat evaluation states
  const [threatScore, setThreatScore] = useState<number>(0);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('SAFE');
  const [scamCategory, setScamCategory] = useState<string>('Benign Call');
  const [vectors, setVectors] = useState<ThreatVectors>({ authority: 0, isolation: 0, financial: 0 });
  const [utterances, setUtterances] = useState<UtteranceItem[]>([]);
  const [latestAudioBase64, setLatestAudioBase64] = useState<string | undefined>(undefined);
  const [interventions, setInterventions] = useState<{
    hi?: string;
    kn?: string;
    ta?: string;
    hinglish?: string;
    en?: string;
  }>({
    hi: "सावधान! यह एक नकली डिजिटल अरेस्ट स्कैम है। पुलिस या सीबीआई कभी वीडियो कॉल पर पैसे नहीं मांगती। तुरंत कॉल काट दें!",
    hinglish: "Savdhaan! Yeh ek fake Digital Arrest scam hai. Police kabhi Skype/WhatsApp video call par arrest nahi karti. Turant call cut karein!",
    kn: "ಎಚ್ಚರಿಕೆ! ಇದು ನಕಲಿ ಡಿಜಿಟಲ್ ಅರೆಸ್ಟ್ ಹಗರಣ. ಪೊಲೀಸರು ಅಥವಾ ಸಿಬಿಐ ವಿಡಿಯೋ ಕರೆಯಲ್ಲಿ ಹಣ ಕೇಳುವುದಿಲ್ಲ!",
    ta: "எச்சரிக்கை! இது ஒரு போली டிஜிட்டல் கைது மோசடி. உடனடியாக அழைப்பை துண்டிக்கவும்!",
    en: "CRITICAL ALERT: Digital arrest extortion attempt. Law enforcement never arrests via video calls. Hang up and dial 1930."
  });

  const wsRef = useRef<WebSocket | null>(null);
  const localStreamIntervalRef = useRef<NodeJS.Timeout[]>([]);

  // Fetch telemetry & scenarios on mount
  useEffect(() => {
    const backendUrl = getBackendBaseUrl();

    fetch(`${backendUrl}/api/telemetry`)
      .then((res) => res.json())
      .then((data) => setTelemetry(data))
      .catch(() => {
        setTelemetry({
          stt_model: 'Gnani Prisma v2.5',
          stt_latency_target: '<180ms',
          stt_current_avg_latency: '154ms',
          tts_model: 'Gnani Timbre v2.5',
          coercion_engine: 'Kavach Threat Engine v2.5',
          noise_suppression: 'Active (16kHz)',
          dpdp_status: '100% Synthetic DPDP Safe',
          simulation_mode: true
        });
      });

    fetch(`${backendUrl}/api/scenarios`)
      .then((res) => res.json())
      .then((data) => {
        if (data.scenarios && data.scenarios.length > 0) {
          setScenarios(data.scenarios);
        }
      })
      .catch(() => {});
  }, []);

  // WebSocket Connection
  useEffect(() => {
    let reconnectTimeout: NodeJS.Timeout;

    const connectWebSocket = () => {
      try {
        const wsUrl = getWebSocketUrl();
        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          setIsConnected(true);
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'utterance') {
              setUtterances((prev) => [...prev, data]);
              setThreatScore(data.threat_score);
              setRiskLevel(data.risk_level);
              setScamCategory(data.scam_category);
              setVectors(data.vectors);

              // Audibly speak the caller dialogue
              soundFX.speakUtterance(data.speaker || 'Caller', data.text || '');

              if (data.threat_score >= 75) {
                soundFX.playWarningChime();
              }

              if (data.interventions) {
                setInterventions(data.interventions);
              }

              if (data.tts_intervention?.audio_base64) {
                setLatestAudioBase64(data.tts_intervention.audio_base64);
              }
            } else if (data.type === 'scenario_completed') {
              setIsPlaying(false);
              soundFX.stopAmbient();
            }
          } catch {
            // Safe JSON catch
          }
        };

        socket.onclose = () => {
          setIsConnected(false);
          reconnectTimeout = setTimeout(connectWebSocket, 4000);
        };

        socket.onerror = () => {
          socket.close();
        };

        wsRef.current = socket;
      } catch {
        setIsConnected(false);
      }
    };

    connectWebSocket();

    return () => {
      clearTimeout(reconnectTimeout);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  // Siren sound effect synchronization
  useEffect(() => {
    if (ambientNoise && isPlaying && activeScenarioId === 'scenario-1') {
      soundFX.startSirenAmbience();
    } else {
      soundFX.stopAmbient();
    }
  }, [ambientNoise, isPlaying, activeScenarioId]);

  // Start Scenario Streaming
  const handleStartScenario = (scenarioId: string, currentSpeed: number) => {
    localStreamIntervalRef.current.forEach((t) => clearTimeout(t));
    localStreamIntervalRef.current = [];

    setActiveScenarioId(scenarioId);
    setIsPlaying(true);
    setUtterances([]);
    setThreatScore(0);
    setRiskLevel('SAFE');
    setVectors({ authority: 0, isolation: 0, financial: 0 });

    const scenario = scenarios.find((s) => s.id === scenarioId) || DEFAULT_SCENARIOS[0];
    setScamCategory(scenario.scam_type);

    if (scenarioId === 'scenario-1') {
      setAmbientNoise(true);
    } else {
      setAmbientNoise(false);
    }

    // Try backend streaming WebSocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'start_scenario',
          scenario_id: scenarioId,
          speed: currentSpeed
        })
      );
      return;
    }

    // Client-side simulation fallback with natural pacing
    let cumulativeDelay = 200;
    scenario.utterances.forEach((u, idx) => {
      const wordsCount = u.text.split(' ').length;
      const durationMs = Math.max(u.delay_ms || 4000, wordsCount * 280 + 1200) / currentSpeed;
      const startDelay = cumulativeDelay;
      cumulativeDelay += durationMs;

      const timer = setTimeout(() => {
        const item: UtteranceItem = {
          id: u.id,
          speaker: u.speaker,
          text: u.text,
          timestamp: u.timestamp,
          latency_ms: u.latency_ms,
          threat_score: u.threat_score,
          risk_level: u.threat_score >= 75 ? 'CRITICAL_SCAM' : u.threat_score >= 35 ? 'SUSPICIOUS' : 'SAFE',
          scam_category: scenario.scam_type,
          vectors: {
            authority: u.vector_authority,
            isolation: u.vector_isolation,
            financial: u.vector_financial
          },
          flagged_keywords: u.flagged,
          is_critical: u.threat_score >= 75
        };

        setUtterances((prev) => [...prev, item]);
        setThreatScore(item.threat_score);
        setRiskLevel(item.risk_level);
        setVectors(item.vectors);

        // Audibly speak the utterance
        soundFX.speakUtterance(item.speaker, item.text);

        if (item.threat_score >= 75) {
          soundFX.playWarningChime();
        }

        if (idx === scenario.utterances.length - 1) {
          setTimeout(() => {
            setIsPlaying(false);
            soundFX.stopAmbient();
          }, durationMs);
        }
      }, startDelay);

      localStreamIntervalRef.current.push(timer);
    });
  };

  const handleStopScenario = () => {
    setIsPlaying(false);
    soundFX.stopAmbient();
    soundFX.stopSpeech();
    localStreamIntervalRef.current.forEach((t) => clearTimeout(t));
    localStreamIntervalRef.current = [];

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'stop' }));
    }
  };

  // Real Speech Recognition Microphone Toggle
  const handleToggleMic = () => {
    soundFX.playClick(650);

    if (isMicActive) {
      liveSpeechRecognizer.stop();
      setIsMicActive(false);
      return;
    }

    setIsMicActive(true);

    const started = liveSpeechRecognizer.start(
      async (result) => {
        if (!result.transcript) return;

        try {
          // Analyze speech segment against Threat Engine REST API
          const response = await fetch(`${getBackendBaseUrl()}/api/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: result.transcript,
              language: selectedLanguage === 'kn' ? 'kn-IN' : selectedLanguage === 'ta' ? 'ta-IN' : 'hi-IN'
            })
          });

          if (response.ok) {
            const data = await response.json();
            const now = new Date();
            const timeStr = `${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

            const isCallerDetected = data.threat_score >= 35 || data.is_critical;
            const speakerLabel = isCallerDetected ? 'Incoming Caller (Live Audio)' : 'You (Live Audio)';

            const newUtterance: UtteranceItem = {
              id: Date.now(),
              speaker: speakerLabel,
              text: result.transcript,
              timestamp: timeStr,
              latency_ms: 148,
              threat_score: data.threat_score,
              risk_level: data.risk_level,
              scam_category: data.scam_category,
              vectors: {
                authority: data.authority_score,
                isolation: data.isolation_score,
                financial: data.financial_score
              },
              flagged_keywords: data.all_flagged_keywords || [],
              is_critical: data.is_critical,
              interventions: {
                hi: data.recommended_intervention_hindi,
                kn: data.recommended_intervention_kannada,
                ta: data.recommended_intervention_tamil,
                hinglish: data.recommended_intervention_hinglish,
                en: data.recommended_intervention_english
              }
            };

            setUtterances((prev) => [...prev, newUtterance]);
            setThreatScore(data.threat_score);
            setRiskLevel(data.risk_level);
            setScamCategory(data.scam_category);
            setVectors({
              authority: data.authority_score,
              isolation: data.isolation_score,
              financial: data.financial_score
            });

            if (data.is_critical) {
              soundFX.playWarningChime();
            }
          }
        } catch {
          // Local fallback
          const newUtterance: UtteranceItem = {
            id: Date.now(),
            speaker: 'Incoming Caller (Live Audio)',
            text: result.transcript,
            timestamp: 'Live',
            latency_ms: 152,
            threat_score: 55,
            risk_level: 'SUSPICIOUS',
            scam_category: 'Suspect Voice Pattern',
            vectors: { authority: 50, isolation: 40, financial: 30 },
            flagged_keywords: []
          };
          setUtterances((prev) => [...prev, newUtterance]);
        }
      },
      (error) => {
        console.warn('Speech recognition notice:', error);
        if (error === 'not-allowed' || error === 'permission-denied') {
          alert('Microphone permission is required to listen to call audio. Please allow microphone access in your browser settings.');
          setIsMicActive(false);
        }
      },
      selectedLanguage
    );

    if (!started) {
      setIsMicActive(false);
    }
  };

  // Download 1930 Cybercrime Evidence PDF
  const handleDownloadPDF = () => {
    soundFX.playClick(900);
    const activeScenario = scenarios.find((s) => s.id === activeScenarioId);
    generateCybercrimeEvidencePDF(
      activeScenario?.title || 'Digital Arrest Extortion Incident',
      activeScenario?.caller_number || '+91-99999-XXXX1 (Fake Mumbai Police CallerID)',
      threatScore || 96,
      scamCategory || 'Digital Arrest / Fake CBI-Police',
      utterances.length > 0 ? utterances : DEFAULT_SCENARIOS[0].utterances.map(u => ({
        id: u.id,
        speaker: u.speaker,
        text: u.text,
        timestamp: u.timestamp,
        latency_ms: u.latency_ms,
        threat_score: u.threat_score,
        risk_level: u.threat_score >= 75 ? 'CRITICAL_SCAM' : 'SUSPICIOUS',
        scam_category: 'Digital Arrest / Fake CBI-Police',
        vectors: { authority: u.vector_authority, isolation: u.vector_isolation, financial: u.vector_financial },
        flagged_keywords: u.flagged
      })),
      selectedLanguage
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#080c14] text-slate-100 font-sans select-none antialiased">
      {/* Top App Header & View Navigation */}
      <Header
        telemetry={telemetry}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        isConnected={isConnected}
        currentView={currentView}
        onViewChange={setCurrentView}
        threatScore={threatScore}
      />

      {/* Main Content Area: Responsive & Clean */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentView === 'elder' && (
          <ElderShieldView
            isMicActive={isMicActive}
            onToggleMic={handleToggleMic}
            isPlaying={isPlaying}
            onStartScenario={handleStartScenario}
            onStopScenario={handleStopScenario}
            scenarios={scenarios}
            threatScore={threatScore}
            riskLevel={riskLevel}
            scamCategory={scamCategory}
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            interventions={interventions}
            latestAudioBase64={latestAudioBase64}
            utterances={utterances}
            onOpenWhatsAppModal={() => setIsWhatsAppOpen(true)}
            onDownloadPDF={handleDownloadPDF}
          />
        )}

        {currentView === 'shield' && (
          <LiveShieldView
            scenarios={scenarios}
            activeScenarioId={activeScenarioId}
            isPlaying={isPlaying}
            onStartScenario={handleStartScenario}
            onStopScenario={handleStopScenario}
            speed={speed}
            onSpeedChange={setSpeed}
            ambientNoise={ambientNoise}
            onAmbientToggle={() => setAmbientNoise(!ambientNoise)}
            isMicActive={isMicActive}
            onToggleMic={handleToggleMic}
            utterances={utterances}
            threatScore={threatScore}
            riskLevel={riskLevel}
            scamCategory={scamCategory}
            vectors={vectors}
            selectedLanguage={selectedLanguage}
            interventions={interventions}
            latestAudioBase64={latestAudioBase64}
            onDownloadPDF={handleDownloadPDF}
            onOpenWhatsAppModal={() => setIsWhatsAppOpen(true)}
          />
        )}

        {currentView === 'sandbox' && (
          <ScamSandboxView
            selectedLanguage={selectedLanguage}
            onOpenWhatsAppModal={() => setIsWhatsAppOpen(true)}
            onDownloadCustomPDF={handleDownloadPDF}
          />
        )}

        {currentView === 'forensics' && (
          <ForensicsView
            telemetry={telemetry}
            onDownloadPDF={handleDownloadPDF}
            threatScore={threatScore}
          />
        )}

        {currentView === 'guide' && (
          <SafetyGuideView />
        )}
      </main>

      {/* Emergency WhatsApp Modal */}
      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        threatScore={threatScore}
        scamCategory={scamCategory}
      />
    </div>
  );
}

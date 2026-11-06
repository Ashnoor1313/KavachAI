export type RiskLevel = 'SAFE' | 'SUSPICIOUS' | 'CRITICAL_SCAM';

export interface ThreatVectors {
  authority: number;
  isolation: number;
  financial: number;
}

export interface FlaggedPhrase {
  phrase: string;
  category: string;
  weight: number;
  matched_text: string;
}

export interface UtteranceItem {
  id: number;
  speaker: string;
  text: string;
  timestamp: string;
  latency_ms: number;
  threat_score: number;
  risk_level: RiskLevel;
  scam_category: string;
  vectors: ThreatVectors;
  flagged_keywords: string[];
  flagged_phrases?: FlaggedPhrase[];
  is_critical?: boolean;
  interventions?: {
    hi?: string;
    kn?: string;
    ta?: string;
    hinglish?: string;
    en?: string;
  };
  tts_intervention?: {
    audio_base64?: string;
    format?: string;
    language?: string;
    latency_ms?: number;
    model?: string;
  } | null;
  measured_latency_ms?: number;
  engine_benchmark?: string;
  heuristic_latency?: string;
  client_timestamp?: number;
}

export interface SyntheticScenario {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  scam_type: string;
  caller_number: string;
  victim_profile: string;
  duration_sec: number;
  escalation_path: string;
  utterances: {
    id: number;
    speaker: string;
    text: string;
    delay_ms: number;
    timestamp: string;
    latency_ms: number;
    threat_score: number;
    vector_authority: number;
    vector_isolation: number;
    vector_financial: number;
    flagged: string[];
  }[];
}

export interface TelemetryData {
  stt_model: string;
  stt_engine_benchmark?: string;
  stt_latency_target?: string;
  stt_current_avg_latency?: string;
  measured_api_latency?: string;
  tts_model: string;
  tts_engine_benchmark?: string;
  coercion_engine: string;
  heuristic_evaluation_latency?: string;
  noise_suppression: string;
  dpdp_status: string;
  simulation_mode: boolean;
}

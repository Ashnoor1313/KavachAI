"""
Kavach AI - Threat Analysis & Psychological Coercion Detection Engine
Specialized in Indian Hinglish Digital Arrest & UPI/KYC fraud patterns.
"""

import re
from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field

class FlaggedPhrase(BaseModel):
    phrase: str
    category: str
    weight: int
    matched_text: str

class ThreatAnalysisResult(BaseModel):
    threat_score: int = Field(ge=0, le=100)
    risk_level: str  # "SAFE", "SUSPICIOUS", "CRITICAL_SCAM"
    scam_category: str
    authority_score: int
    isolation_score: int
    financial_score: int
    flagged_phrases: List[FlaggedPhrase]
    all_flagged_keywords: List[str]
    is_critical: bool
    recommended_intervention_hindi: str
    recommended_intervention_kannada: str
    recommended_intervention_tamil: str
    recommended_intervention_hinglish: str
    recommended_intervention_english: str
    incident_summary: str
    timestamp: str = ""

# Keyword lexicons with weights and regex patterns (supporting Hinglish code-mixing)
AUTHORITY_PATTERNS = [
    (r"\b(cbi|central bureau of investigation)\b", "CBI Impersonation", 25),
    (r"\b(mumbai crime branch|crime branch|delhi police|police station|cyber cell|cyber police)\b", "Law Enforcement Impersonation", 25),
    (r"\b(customs|customs officer|customs department|narcotics|ncb|narcotics control)\b", "Customs / Narcotics Authority", 24),
    (r"\b(supreme court|high court|court order|non-bailable|warrant|arrest warrant)\b", "Judicial Pressure", 26),
    (r"\b(fir|section 420|money laundering|pmla|human trafficking|terror funding)\b", "Fabricated Charges", 24),
    (r"\b(inspector|dsp|commissioner|head office officer|customs clearance)\b", "Authority Designation", 18),
    (r"\b(bses|electricity board|discom|telecom regulatory|trai)\b", "Utility Authority Impersonation", 18),
]

ISOLATION_PATTERNS = [
    (r"\b(digital arrest|digitally arrested|house arrest|video arrest)\b", "Digital Arrest Intimidation", 35),
    (r"\b(video call mat kaatna|call mat katna|disconnect mat karna|do not disconnect)\b", "Forced Call Retention", 28),
    (r"\b(kisi ko mat batana|kisi se share mat karna|confidential|secret act|official secrets)\b", "Psychological Isolation", 27),
    (r"\b(stay on skype|whatsapp video|skype video|camera on rakho|door lock kar lo)\b", "Visual Surveillance Coercion", 26),
    (r"\b(turant police bhejenge|ghar par team bhej rahe hain|police aane wali hai)\b", "Urgent Extortion Threat", 25),
    (r"\b(aaj raat|within 15 minutes|immediately|turant|ab ke ab)\b", "Artificial Urgency", 16),
]

FINANCIAL_PATTERNS = [
    (r"\b(rtgs|neft|imps|security deposit|clearance fund|verification account)\b", "Direct Wire Coercion", 30),
    (r"\b(rbi audit|rbi verification|reserve bank account|government bond account)\b", "Fake RBI Verification Scheme", 30),
    (r"\b(upi pin|secret pin|enter pin|6-digit pin|4-digit pin)\b", "UPI PIN Harvest Attempt", 32),
    (r"\b(quicksupport|anydesk|teamviewer|screen share|apk download|play store)\b", "Remote Access Screen Hijack", 28),
    (r"\b(phonepe|gpay|google pay|paytm|bhim upi)\b", "Payment App Targeting", 20),
    (r"\b(aadhaar card|pan card|kyc block|account frozen|sim block)\b", "Identity & Account Panic", 22),
    (r"\b(refund ho jayega|15 minute mein wapas|refundable deposit)\b", "False Refund Assurance", 20),
]

class CoercionThreatEngine:
    """Hybrid fast rule-based & psychological vector detection engine."""

    def __init__(self):
        self.authority_compiled = [(re.compile(p, re.IGNORECASE), name, weight) for p, name, weight in AUTHORITY_PATTERNS]
        self.isolation_compiled = [(re.compile(p, re.IGNORECASE), name, weight) for p, name, weight in ISOLATION_PATTERNS]
        self.financial_compiled = [(re.compile(p, re.IGNORECASE), name, weight) for p, name, weight in FINANCIAL_PATTERNS]

    def analyze_segment(self, text: str, cumulative_history: Optional[List[str]] = None) -> ThreatAnalysisResult:
        """
        Analyzes a single utterance or full conversational context.
        Returns detailed psychological vectors and threat assessment.
        """
        full_text = text
        if cumulative_history:
            full_text = " ".join(cumulative_history) + " " + text

        flagged: List[FlaggedPhrase] = []
        all_keywords: List[str] = []

        # Vector score accumulators
        auth_sum = 0
        iso_sum = 0
        fin_sum = 0

        # Check Authority patterns
        for pattern, name, weight in self.authority_compiled:
            matches = list(pattern.finditer(full_text))
            if matches:
                auth_sum += weight * len(matches)
                for m in matches:
                    matched_str = m.group(0)
                    flagged.append(FlaggedPhrase(
                        phrase=name,
                        category="Authority Impersonation",
                        weight=weight,
                        matched_text=matched_str
                    ))
                    all_keywords.append(matched_str)

        # Check Isolation patterns
        for pattern, name, weight in self.isolation_compiled:
            matches = list(pattern.finditer(full_text))
            if matches:
                iso_sum += weight * len(matches)
                for m in matches:
                    matched_str = m.group(0)
                    flagged.append(FlaggedPhrase(
                        phrase=name,
                        category="Psychological Isolation",
                        weight=weight,
                        matched_text=matched_str
                    ))
                    all_keywords.append(matched_str)

        # Check Financial patterns
        for pattern, name, weight in self.financial_compiled:
            matches = list(pattern.finditer(full_text))
            if matches:
                fin_sum += weight * len(matches)
                for m in matches:
                    matched_str = m.group(0)
                    flagged.append(FlaggedPhrase(
                        phrase=name,
                        category="Financial Coercion",
                        weight=weight,
                        matched_text=matched_str
                    ))
                    all_keywords.append(matched_str)

        # Normalize individual vectors (0-100 scale)
        authority_score = min(100, int(auth_sum * 1.15))
        isolation_score = min(100, int(iso_sum * 1.25))
        financial_score = min(100, int(fin_sum * 1.20))

        # Combined threat score formula:
        # Digital Arrest is characterized by high authority + high isolation + high financial extortion
        raw_threat = 0.35 * authority_score + 0.35 * isolation_score + 0.30 * financial_score

        # Extra multipliers for lethal combinations (e.g., Digital Arrest + RTGS or Video call + CBI)
        has_digital_arrest = any("digital arrest" in k.lower() for k in all_keywords)
        has_video_lock = any("video" in k.lower() or "mat kaatna" in k.lower() for k in all_keywords)
        has_bank_transfer = any("rtgs" in k.lower() or "pin" in k.lower() or "rbi" in k.lower() for k in all_keywords)
        has_police_cbi = any("cbi" in k.lower() or "police" in k.lower() or "crime branch" in k.lower() for k in all_keywords)

        if has_digital_arrest:
            raw_threat = max(raw_threat, 85.0)
            if has_bank_transfer:
                raw_threat = max(raw_threat, 96.0)
        elif has_police_cbi and has_video_lock:
            raw_threat = max(raw_threat, 88.0)
        elif has_bank_transfer and (isolation_score > 30 or authority_score > 30):
            raw_threat = max(raw_threat, 80.0)

        # Benign phrases check (reduce false positive on normal conversations)
        benign_indicators = ["mixer grinder", "reception", "lift se upar", "prepaid order", "tiwari ji", "family call"]
        if any(b in full_text.lower() for b in benign_indicators) and not (has_digital_arrest or has_bank_transfer):
            raw_threat = min(raw_threat * 0.15, 12.0)
            authority_score = min(authority_score, 10)
            isolation_score = min(isolation_score, 5)
            financial_score = min(financial_score, 10)

        threat_score = int(round(min(100, max(0, raw_threat))))

        # Determine Risk Level
        if threat_score >= 75:
            risk_level = "CRITICAL_SCAM"
            is_critical = True
        elif threat_score >= 35:
            risk_level = "SUSPICIOUS"
            is_critical = False
        else:
            risk_level = "SAFE"
            is_critical = False

        # Determine Scam Category
        if has_digital_arrest or (authority_score >= 60 and isolation_score >= 50):
            scam_category = "Digital Arrest / Fake CBI-Police"
        elif "parcel" in full_text.lower() and ("narcotics" in full_text.lower() or "customs" in full_text.lower() or "fedex" in full_text.lower()):
            scam_category = "FedEx / Customs Parcel Scam"
        elif "bill" in full_text.lower() or "kyc" in full_text.lower() or "quicksupport" in full_text.lower() or "upi" in full_text.lower():
            scam_category = "UPI / KYC Refund Fraud"
        elif threat_score < 30:
            scam_category = "Benign Call"
        else:
            scam_category = "Suspicious Financial / Authority Coercion"

        # Unique keyword list
        seen = set()
        dedup_keywords = []
        for kw in all_keywords:
            low = kw.lower()
            if low not in seen:
                seen.add(low)
                dedup_keywords.append(kw)

        # Multi-lingual regional interventions
        intervention_hi = (
            "सावधान! यह एक नकली डिजिटल अरेस्ट और साइबर फ्रॉड कॉल है। "
            "भारत में पुलिस, सीबीआई या सुप्रीम कोर्ट कभी भी वीडियो कॉल पर 'डिजिटल अरेस्ट' नहीं करती "
            "और न ही आरबीआई वेरिफिकेशन के नाम पर पैसे मांगती है। तुरंत कॉल काटें और 1930 पर शिकायत करें!"
        )

        intervention_kn = (
            "ಎಚ್ಚರಿಕೆ! ಇದು ನಕಲಿ ಡಿಜಿಟಲ್ ಅರೆಸ್ಟ್ ಹಗರಣ. "
            "ಪೊಲೀಸರು, ಸಿಬಿಐ ಅಥವಾ ನ್ಯಾಯಾಲಯವು ಎಂದಿಗೂ ವೀಡಿಯೊ ಕರೆಯಲ್ಲಿ ಬಂಧಿಸುವುದಿಲ್ಲ "
            "ಅಥವಾ ಪರಿಶೀಲನೆಗಾಗಿ ಹಣವನ್ನು ವರ್ಗಾಯಿಸಲು ಕೇಳುವುದಿಲ್ಲ. ತಕ್ಷಣ ಕರೆಯನ್ನು ಕಡಿತಗೊಳಿಸಿ!"
        )

        intervention_ta = (
            "எச்சரிக்கை! இது ஒரு ஆபத்தான போலி டிஜிட்டல் கைது மோசடி. "
            "இந்தியாவில் காவல்துறையோ, சிபிஐயோ வீடியோ காலில் கைது செய்ய மாட்டார்கள். "
            "சரிபார்ப்பு என்ற பெயரில் பணம் அனுப்ப வேண்டாம். உடனே இணைப்பை துண்டிக்கவும்!"
        )

        intervention_hinglish = (
            "Savdhaan! Yeh ek 100% fake Digital Arrest scam hai. "
            "Police ya CBI kabhi Skype/WhatsApp video call par arrest nahi karti aur na hi RTGS maangti hai. "
            "Turant call cut karein aur Cyber Helpline 1930 par report karein!"
        )

        intervention_en = (
            "CRITICAL ALERT: Digital Arrest Extortion Attempt detected! "
            "Indian law enforcement agencies (CBI/Police/Customs) DO NOT conduct 'digital arrests' "
            "nor do they demand security deposits. Hang up immediately and dial 1930."
        )

        incident_summary = (
            f"{scam_category} detected with Threat Index of {threat_score}%. "
            f"Psychological vectors: Authority Impersonation ({authority_score}%), "
            f"Isolation Pressure ({isolation_score}%), Financial Demand ({financial_score}%)."
        )

        return ThreatAnalysisResult(
            threat_score=threat_score,
            risk_level=risk_level,
            scam_category=scam_category,
            authority_score=authority_score,
            isolation_score=isolation_score,
            financial_score=financial_score,
            flagged_phrases=flagged,
            all_flagged_keywords=dedup_keywords,
            is_critical=is_critical,
            recommended_intervention_hindi=intervention_hi,
            recommended_intervention_kannada=intervention_kn,
            recommended_intervention_tamil=intervention_ta,
            recommended_intervention_hinglish=intervention_hinglish,
            recommended_intervention_english=intervention_en,
            incident_summary=incident_summary
        )

# Global threat engine singleton
threat_engine = CoercionThreatEngine()

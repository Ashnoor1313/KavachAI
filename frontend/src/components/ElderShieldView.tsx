'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Siren,
  PhoneCall,
  Volume2,
  VolumeX,
  Share2,
  Mic,
  MicOff,
  PhoneOff,
  HelpCircle,
  Play,
  Square,
  Sparkles,
  FileDown,
  PhoneIncoming,
  User,
  AlertOctagon,
  CheckCircle2
} from 'lucide-react';
import { SyntheticScenario, UtteranceItem, RiskLevel } from '@/types';
import { soundFX } from '@/utils/audioSynth';

interface ElderShieldViewProps {
  isMicActive: boolean;
  onToggleMic: () => void;
  isPlaying: boolean;
  onStartScenario: (scenarioId: string, speed: number) => void;
  onStopScenario: () => void;
  scenarios: SyntheticScenario[];
  threatScore: number;
  riskLevel: RiskLevel;
  scamCategory: string;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  interventions: {
    hi?: string;
    kn?: string;
    ta?: string;
    hinglish?: string;
    en?: string;
  };
  latestAudioBase64?: string;
  utterances: UtteranceItem[];
  onOpenWhatsAppModal: () => void;
  onDownloadPDF: () => void;
}

export const ElderShieldView: React.FC<ElderShieldViewProps> = ({
  isMicActive,
  onToggleMic,
  isPlaying,
  onStartScenario,
  onStopScenario,
  scenarios,
  threatScore,
  selectedLanguage,
  interventions,
  latestAudioBase64,
  utterances,
  onOpenWhatsAppModal,
  onDownloadPDF
}) => {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const isCritical = threatScore >= 75;
  const isSuspicious = threatScore >= 35 && threatScore < 75;

  // Simple, plain language without difficult or technical words
  const textByLang: Record<string, {
    safeBadge: string;
    safeTitle: string;
    safeDesc: string;
    cautionBadge: string;
    cautionTitle: string;
    cautionDesc: string;
    dangerBadge: string;
    dangerTitle: string;
    dangerDesc: string;
    startShieldBtn: string;
    stopShieldBtn: string;
    shieldActiveDesc: string;
    shieldInactiveDesc: string;
    listenWarningBtn: string;
    stopWarningBtn: string;
    hangUpNotice: string;
    callFamilyBtn: string;
    callHelplineBtn: string;
    testCallTitle: string;
    testCallDesc: string;
    fakePoliceTest: string;
    fakePoliceDesc: string;
    electricityTest: string;
    electricityDesc: string;
    benignTest: string;
    benignDesc: string;
    rulesTitle: string;
    rule1: string;
    rule2: string;
    rule3: string;
    pdfDownloadBtn: string;
  }> = {
    hi: {
      safeBadge: "सब सुरक्षित है",
      safeTitle: "कॉल पूरी तरह सुरक्षित है",
      safeDesc: "कोई धोखाधड़ी या खतरा नहीं मिला। बातचीत सामान्य है।",
      cautionBadge: "सावधान रहें",
      cautionTitle: "संदेहास्पद कॉल: सतर्क रहें",
      cautionDesc: "कॉलर आपकी निजी जानकारी या बैंक विवरण मांग रहा है। OTP या पिन कभी न बताएं।",
      dangerBadge: "खतरा! फ्रॉड कॉल",
      dangerTitle: "तुरंत फोन काटें! यह फर्जी कॉल है!",
      dangerDesc: "यह फ्रॉड है। असली पुलिस या बैंक कभी वीडियो कॉल पर गिरफ्तारी या पैसे नहीं मांगते।",
      startShieldBtn: "कॉल सुरक्षा चालू करें",
      stopShieldBtn: "सुरक्षा बंद करें",
      shieldActiveDesc: "सुरक्षा चालू है • कॉल की आवाज़ पर नज़र रखी जा रही है",
      shieldInactiveDesc: "अज्ञात नंबर से कॉल आते ही नीचे बटन दबाएं",
      listenWarningBtn: "चेतावनी सुनें",
      stopWarningBtn: "आवाज़ बंद करें",
      hangUpNotice: "अभी कॉल काटें! असली पुलिस कभी वीडियो कॉल पर अरेस्ट नहीं करती।",
      callFamilyBtn: "परिवार को WhatsApp SOS भेजें",
      callHelplineBtn: "1930 हेल्पलाइन पर कॉल करें",
      testCallTitle: "डेमो कॉल चलाकर देखें",
      testCallDesc: "देखें कि फ्रॉड कॉल आने पर कवच कैसे चेतावनी देता है:",
      fakePoliceTest: "फर्जी पुलिस / CBI कॉल",
      fakePoliceDesc: "धमकी देकर पैसे मांगने वाला फ्रॉड",
      electricityTest: "बिजली बिल व OTP फ्रॉड",
      electricityDesc: "बिल कटने का झांसा देकर OTP चोरी",
      benignTest: "सामान्य डिलीवरी कॉल",
      benignDesc: "रोज़मर्रा की सुरक्षित डिलीवरी कॉल",
      rulesTitle: "बुज़ुर्गों के लिए 3 आसान सुरक्षा नियम",
      rule1: "पुलिस या CBI कभी WhatsApp/Skype वीडियो कॉल पर गिरफ़्तार नहीं करती।",
      rule2: "बैंक या पुलिस कभी किसी खाते में पैसे ट्रांसफर करने को नहीं कहती।",
      rule3: "अगर कोई कहे 'फोन मत काटना और किसी को मत बताना', तो तुरंत फोन काट दें!",
      pdfDownloadBtn: "1930 पुलिस शिकायत हेतु रिपोर्ट (PDF) डाउनलोड करें"
    },
    hinglish: {
      safeBadge: "All Safe",
      safeTitle: "Aap Puri Tarah Safe Hain",
      safeDesc: "Call par koi fraud nahi mila. Normal conversation chal rahi hai.",
      cautionBadge: "Alert",
      cautionTitle: "Savdhaan Rahein: Alert!",
      cautionDesc: "Caller aapse personal details maang raha hai. OTP ya PIN kisi ko mat dein.",
      dangerBadge: "Danger: Scam Alert",
      dangerTitle: "Turant Phone Kaatein! Fake Call Hai!",
      dangerDesc: "Yeh scam hai. Police ya Bank kabhi video call par arrest ya paise transfer nahi maangti.",
      startShieldBtn: "Suraksha Chalu Karein",
      stopShieldBtn: "Suraksha Band Karein",
      shieldActiveDesc: "Shield Active • Listening for any scam or fraud",
      shieldInactiveDesc: "Unknown call aate hi neeche button dabayein",
      listenWarningBtn: "Voice Warning Sunein",
      stopWarningBtn: "Voice Band Karein",
      hangUpNotice: "Abhi call disconnect karein! Police kabhi video call par arrest nahi karti.",
      callFamilyBtn: "Family ko WhatsApp SOS Bhejein",
      callHelplineBtn: "1930 Helpline Lagayein",
      testCallTitle: "Demo Call Chala Kar Dekhein",
      testCallDesc: "Check karein Kavach AI scam par kaise alert deta hai:",
      fakePoliceTest: "Fake Police / CBI Call",
      fakePoliceDesc: "Arrest ki dhamki dekar paise maangne ka scam",
      electricityTest: "Electricity Bill Scam",
      electricityDesc: "Bill update ke bahane OTP maangna",
      benignTest: "Normal Delivery Call",
      benignDesc: "Safe parcel delivery call",
      rulesTitle: "3 Simple Safety Rules",
      rule1: "Police ya CBI kabhi WhatsApp video call par arrest nahi karti.",
      rule2: "Bank ya Police kabhi paise transfer karne ko nahi kehti.",
      rule3: "Agar koi bole 'Phone mat kaatna', toh turant call cut kar dein!",
      pdfDownloadBtn: "1930 Cyber Report PDF Download Karein"
    },
    en: {
      safeBadge: "All Clear",
      safeTitle: "You Are Completely Safe",
      safeDesc: "No scam or threat detected. This call is safe.",
      cautionBadge: "Caution",
      cautionTitle: "Be Careful: Suspicious Call",
      cautionDesc: "Caller is asking for personal details. Never share OTP, PIN, or passwords.",
      dangerBadge: "Danger: Scam Call",
      dangerTitle: "Hang Up Immediately! This Is A Scam!",
      dangerDesc: "Real police or government officers never arrest people on video calls or ask for money.",
      startShieldBtn: "Start Call Protection",
      stopShieldBtn: "Stop Protection",
      shieldActiveDesc: "Shield Active • Listening to the call to protect you",
      shieldInactiveDesc: "Tap the button when you receive an unknown call",
      listenWarningBtn: "Listen to Warning",
      stopWarningBtn: "Stop Audio",
      hangUpNotice: "Hang up now! Real police never arrest citizens over video calls.",
      callFamilyBtn: "Send WhatsApp SOS to Family",
      callHelplineBtn: "Call 1930 Helpline",
      testCallTitle: "Try a Demo Call",
      testCallDesc: "See how Kavach alerts you when a scam call happens:",
      fakePoliceTest: "Fake Police / CBI Call",
      fakePoliceDesc: "Scammer threatens arrest to extort money",
      electricityTest: "Fake Electricity Bill Scam",
      electricityDesc: "Threatens disconnection to steal OTP",
      benignTest: "Normal Delivery Call",
      benignDesc: "Everyday safe package delivery call",
      rulesTitle: "3 Simple Rules to Stay Safe",
      rule1: "Police or CBI never arrest citizens over WhatsApp or video calls.",
      rule2: "Banks and police never ask you to transfer money to verify accounts.",
      rule3: "If someone tells you 'Do not cut the call', hang up immediately!",
      pdfDownloadBtn: "Download 1930 Cyber Crime Report (PDF)"
    },
    kn: {
      safeBadge: "ಸುರಕ್ಷಿತವಾಗಿದೆ",
      safeTitle: "ನೀವು ಸಂಪೂರ್ಣ ಸುರಕ್ಷಿತರಾಗಿದ್ದೀರಿ",
      safeDesc: "ಯಾವುದೇ ವಂಚನೆ ಕಂಡುಬಂದಿಲ್ಲ. ಕರೆ ಸಹಜವಾಗಿದೆ.",
      cautionBadge: "ಎಚ್ಚರ",
      cautionTitle: "ಜಾಗರೂಕರಾಗಿರಿ: ಸಂಶಯಾಸ್ಪದ ಕರೆ",
      cautionDesc: "ಕರೆ ಮಾಡಿದವರು ಖಾಸಗಿ ಮಾಹಿತಿ ಕೇಳುತ್ತಿದ್ದಾರೆ. ಯಾವುದೇ OTP ನೀಡಬೇಡಿ.",
      dangerBadge: "ಅಪಾಯ! ವಂಚನೆ ಕರೆ",
      dangerTitle: "ತಕ್ಷಣ ಕರೆ ಕಟ್ ಮಾಡಿ! ಇದು ವಂಚನೆ!",
      dangerDesc: "ಪೊಲೀಸರು ಎಂದಿಗೂ ವಿಡಿಯೋ ಕಾಲಿನಲ್ಲಿ ಬಂಧಿಸುವುದಿಲ್ಲ ಅಥವಾ ಹಣ ಕೇಳುವುದಿಲ್ಲ.",
      startShieldBtn: "ರಕ್ಷಣೆ ಪ್ರಾರಂಭಿಸಿ",
      stopShieldBtn: "ರಕ್ಷಣೆ ನಿಲ್ಲಿಸಿ",
      shieldActiveDesc: "ರಕ್ಷಣೆ ಸಕ್ರಿಯವಾಗಿದೆ • ಕರೆ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ",
      shieldInactiveDesc: "ಅಪರಿಚಿತ ಕರೆ ಬಂದಾಗ ಕೆಳಗಿನ ಬಟನ್ ಒತ್ತಿ",
      listenWarningBtn: "ಧ್ವನಿ ಎಚ್ಚರಿಕೆ ಆಲಿಸಿ",
      stopWarningBtn: "ಧ್ವನಿ ನಿಲ್ಲಿಸಿ",
      hangUpNotice: "ಈಗಲೇ ಫೋನ್ ಕಟ್ ಮಾಡಿ! ಪೊಲೀಸರು ವಿಡಿಯೋ ಕರೆಯಲ್ಲಿ ಬಂಧಿಸುವುದಿಲ್ಲ.",
      callFamilyBtn: "ಕುಟುಂಬಕ್ಕೆ WhatsApp ಸಂದೇಶ ಕಳುಹಿಸಿ",
      callHelplineBtn: "1930 ಸಹಾಯವಾಣಿ ಕರೆ ಮಾಡಿ",
      testCallTitle: "ಡೆಮೊ ಕರೆ ಪರೀಕ್ಷಿಸಿ",
      testCallDesc: "ವಂಚನೆ ಕರೆ ಎದುರಾದಾಗ ಎಚ್ಚರಿಕೆ ಹೇಗೆ ಬರುತ್ತದೆ ನೋಡಿ:",
      fakePoliceTest: "ನಕಲಿ ಪೊಲೀಸ್ ಕರೆ",
      fakePoliceDesc: "ಬಂಧನದ ಹೆದರಿಕೆ ಹಾಕಿ ಹಣ ಕೇಳುವ ವಂಚನೆ",
      electricityTest: "ವಿದ್ಯುತ್ ಬಿಲ್ ವಂಚನೆ",
      electricityDesc: "ಬಿಲ್ ಹೆಸರಿನಲ್ಲಿ OTP ಕದಿಯುವ ಯತ್ನ",
      benignTest: "ಸಾಮಾನ್ಯ ಡೆಲಿವರಿ ಕರೆ",
      benignDesc: "ಸುರಕ್ಷಿತ ಸಾಮಾನ್ಯ ಡೆಲಿವರಿ ಕರೆ",
      rulesTitle: "ಹಿರಿಯರಿಗೆ 3 ಮುಖ್ಯ ನಿಯಮಗಳು",
      rule1: "ಪೊಲೀಸರು ಎಂದಿಗೂ WhatsApp ವಿಡಿಯೋ ಕರೆಯಲ್ಲಿ ಬಂಧಿಸುವುದಿಲ್ಲ.",
      rule2: "ಬ್ಯಾಂಕ್ ಅಥವಾ ಪೊಲೀಸರು ಎಂದಿಗೂ ಹಣ ವರ್ಗಾಯಿಸಲು ಹೇಳುವುದಿಲ್ಲ.",
      rule3: "ಯಾರಾದರೂ 'ಫೋನ್ ಕಟ್ ಮಾಡಬೇಡಿ' ಎಂದು ಹೆದರಿಸಿದರೆ ತಕ್ಷಣ ಕಟ್ ಮಾಡಿ!",
      pdfDownloadBtn: "1930 ಸೈಬರ್ ವರದಿ PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ"
    },
    ta: {
      safeBadge: "பாதுகாப்பானது",
      safeTitle: "நீங்கள் முழு பாதுகாப்பாக உள்ளீர்கள்",
      safeDesc: "எந்த அச்சுறுத்தலும் இல்லை. அழைப்பு சாதாரணமாக உள்ளது.",
      cautionBadge: "எச்சரிக்கை",
      cautionTitle: "விழிப்புடன் இருங்கள்: சந்தேக அழைப்பு",
      cautionDesc: "அழைப்பாளர் தனிப்பட்ட தகவல் கேட்கிறார். OTP பகிர வேண்டாம்.",
      dangerBadge: "ஆபத்து! மோசடி அழைப்பு",
      dangerTitle: "உடனே போனை வையுங்கள்! இது மோசடி!",
      dangerDesc: "போலீஸ் ஒருபோதும் வீடியோ காலில் கைது செய்யாது அல்லது பணம் கேட்காது.",
      startShieldBtn: "பாதுகாப்பை தொடங்குங்கள்",
      stopShieldBtn: "பாதுகாப்பை நிறுத்துங்கள்",
      shieldActiveDesc: "பாதுகாப்பு செயலில் உள்ளது • அழைப்பு கண்காணிக்கப்படுகிறது",
      shieldInactiveDesc: "தெரியாத அழைப்பு வரும்போது பொத்தானை அழுத்தவும்",
      listenWarningBtn: "எச்சரிக்கையை கேளுங்கள்",
      stopWarningBtn: "குரலை நிறுத்துங்கள்",
      hangUpNotice: "உடனே போனை வையுங்கள்! போலீஸ் வீடியோ காலில் கைது செய்யாது.",
      callFamilyBtn: "குடும்பத்திற்கு WhatsApp SOS அனுப்பவும்",
      callHelplineBtn: "1930 உதவி எண் அழைக்கவும்",
      testCallTitle: "மாதிரி அழைப்பை இயக்கவும்",
      testCallDesc: "மோசடி அழைப்பு வரும்போது எப்படி எச்சரிக்கிறது என்று பாருங்கள்:",
      fakePoliceTest: "போலி போலீஸ் அழைப்பு",
      fakePoliceDesc: "கைது மிரட்டல் விடுத்து பணம் பறிக்கும் மோசடி",
      electricityTest: "மின்சார கட்டண மோசடி",
      electricityDesc: "கட்டண பெயரில் OTP திருடும் முயற்சி",
      benignTest: "சாதாரண டெலிவரி அழைப்பு",
      benignDesc: "தினசரி பாதுகாப்பான டெலிவரி அழைப்பு",
      rulesTitle: "முதியோருக்கான 3 முக்கிய விதிகள்",
      rule1: "போலீஸ் ஒருபோதும் வீடியோ காலில் கைது செய்வதில்லை.",
      rule2: "வங்கி அல்லது போலீஸ் ஒருபோதும் பணம் செலுத்த சொல்லாது.",
      rule3: "'போனை வைக்காதே' என்று மிரட்டினால் உடனே வைத்து விடுங்கள்!",
      pdfDownloadBtn: "1930 புகார் அறிக்கை PDF பதிவிறக்கவும்"
    }
  };

  const t = textByLang[selectedLanguage] || textByLang['hi'];

  const warningText =
    interventions[selectedLanguage as keyof typeof interventions] ||
    interventions.hi ||
    interventions.hinglish ||
    "सावधान! यह कॉल एक फ़र्ज़ी डिजिटल अरेस्ट स्कैम है। तुरंत कॉल काट दें!";

  const handlePlayVoice = () => {
    setIsPlayingVoice(true);
    soundFX.playSpeechWarning(
      latestAudioBase64,
      warningText,
      selectedLanguage,
      () => setIsPlayingVoice(false)
    );
  };

  const handleStopVoice = () => {
    setIsPlayingVoice(false);
    soundFX.stopAll();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
      
      {/* Unified Hero Status & Action Card */}
      <div
        className={`rounded-2xl sm:rounded-3xl p-5 sm:p-8 border-2 transition-all shadow-xl relative overflow-hidden ${
          isCritical
            ? 'bg-rose-950/70 border-rose-500 shadow-rose-950/40'
            : isSuspicious
            ? 'bg-amber-950/60 border-amber-500 shadow-amber-950/30'
            : 'bg-slate-900/80 border-slate-800 shadow-slate-950/30'
        }`}
      >
        <div className="flex flex-col items-center text-center space-y-3.5 sm:space-y-4">
          
          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isCritical
                ? 'bg-rose-600 text-white animate-pulse'
                : isSuspicious
                ? 'bg-amber-400 text-slate-950'
                : isMicActive || isPlaying
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            {isCritical ? (
              <Siren className="w-3.5 h-3.5" />
            ) : isSuspicious ? (
              <AlertTriangle className="w-3.5 h-3.5" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-950" />
            )}
            <span>
              {isCritical ? t.dangerBadge : isSuspicious ? t.cautionBadge : t.safeBadge}
            </span>
          </span>

          {/* Large Friendly Status Icon */}
          <div
            className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg transition-transform ${
              isCritical
                ? 'bg-rose-600 text-white animate-bounce'
                : isSuspicious
                ? 'bg-amber-500 text-slate-950'
                : isMicActive || isPlaying
                ? 'bg-emerald-500 text-slate-950 scale-105 shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            {isCritical ? (
              <Siren className="w-10 h-10" />
            ) : isSuspicious ? (
              <AlertTriangle className="w-10 h-10" />
            ) : (
              <ShieldCheck className="w-10 h-10" />
            )}
          </div>

          {/* Clean Headline & Subtitle */}
          <div className="space-y-1 sm:space-y-1.5 max-w-lg">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              {isCritical ? t.dangerTitle : isSuspicious ? t.cautionTitle : t.safeTitle}
            </h1>
            <p className="text-xs sm:text-base text-slate-300 font-medium">
              {isCritical ? t.dangerDesc : isSuspicious ? t.cautionDesc : t.safeDesc}
            </p>
          </div>

          {/* Emergency Danger Actions (Displayed when high risk detected) */}
          {isCritical && (
            <div className="w-full pt-3 sm:pt-4 space-y-2.5 sm:space-y-3">
              <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-rose-900/90 border border-rose-400 text-white font-bold text-xs sm:text-base flex items-center justify-center gap-2">
                <PhoneOff className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300 shrink-0" />
                <span>{t.hangUpNotice}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5 pt-1">
                <button
                  onClick={isPlayingVoice ? handleStopVoice : handlePlayVoice}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white hover:bg-slate-100 text-rose-700 font-bold text-xs sm:text-sm shadow active:scale-95 transition-transform"
                >
                  {isPlayingVoice ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isPlayingVoice ? t.stopWarningBtn : t.listenWarningBtn}</span>
                </button>

                <a
                  href="tel:1930"
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow active:scale-95 transition-transform"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>{t.callHelplineBtn}</span>
                </a>

                <button
                  onClick={onOpenWhatsAppModal}
                  className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow active:scale-95 transition-transform"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{t.callFamilyBtn}</span>
                </button>
              </div>
            </div>
          )}

          {/* Single Clean Primary Action Button */}
          <div className="w-full pt-3 sm:pt-4 max-w-md">
            <button
              onClick={onToggleMic}
              className={`w-full flex items-center justify-center gap-2.5 sm:gap-3 py-3.5 sm:py-4 px-4 sm:px-6 rounded-2xl font-black text-base sm:text-lg transition-all shadow-lg active:scale-95 ${
                isMicActive
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-950/40 ring-4 ring-rose-500/20'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-950/40 ring-4 ring-emerald-500/20 hover:scale-[1.01]'
              }`}
            >
              {isMicActive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              <span>{isMicActive ? t.stopShieldBtn : t.startShieldBtn}</span>
            </button>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-2">
              {isMicActive ? t.shieldActiveDesc : t.shieldInactiveDesc}
            </p>
          </div>

        </div>
      </div>

      {/* Live Conversation Stream (Simple Chat View) */}
      {utterances && utterances.length > 0 && (
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-5 sm:p-6 space-y-3.5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>💬</span>
              <span>Live Call Audio (कॉल की बातचीत)</span>
            </h3>
            <span className="text-[11px] font-semibold text-slate-400">
              {utterances.length} lines detected
            </span>
          </div>

          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {utterances.map((u, idx) => {
              const s = (u.speaker || '').toLowerCase();
              const isVictim = s.includes('victim') || s.includes('ramesh') || s.includes('uncle') || s.includes('you') || s.includes('shanti') || s.includes('customer');
              const isHighRisk = (u.threat_score || 0) >= 70 || u.is_critical;

              return (
                <div key={u.id || idx} className="space-y-1.5">
                  <div className={`flex flex-col ${isVictim ? 'items-end ml-auto max-w-[85%]' : 'items-start mr-auto max-w-[85%]'}`}>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-0.5">
                      {isVictim ? <User className="w-3 h-3 text-cyan-400" /> : <PhoneIncoming className="w-3 h-3 text-rose-400" />}
                      <span className="font-semibold">{isVictim ? 'You (आप)' : u.speaker}</span>
                      <span>•</span>
                      <span className="font-mono">{u.timestamp}</span>
                    </div>

                    <div className={`p-3.5 rounded-2xl text-xs sm:text-sm font-medium leading-relaxed ${
                      isVictim
                        ? 'bg-cyan-950/40 text-cyan-100 border border-cyan-800/40 rounded-tr-none'
                        : isHighRisk
                        ? 'bg-rose-950/40 text-rose-100 border border-rose-700/60 rounded-tl-none font-semibold'
                        : 'bg-slate-950/80 text-slate-200 border border-slate-800/80 rounded-tl-none'
                    }`}>
                      {u.text}
                    </div>
                  </div>

                  {/* Clean In-Line Alert for high danger lines */}
                  {isHighRisk && (
                    <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-xs text-rose-200 font-bold flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <AlertOctagon className="w-4 h-4 text-amber-300 shrink-0" />
                        <span>⚠️ Scam Detected: Disconnect immediately!</span>
                      </div>
                      <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white font-bold shrink-0">
                        Hang Up
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 1-Click Practice Scenarios (Simplified & Minimalist) */}
      <div className="bg-slate-900/60 rounded-2xl sm:rounded-3xl border border-slate-800 p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t.testCallTitle}</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400">{t.testCallDesc}</p>
          </div>

          {isPlaying && (
            <button
              onClick={onStopScenario}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-bold border border-slate-700 active:scale-95 transition-transform"
            >
              <Square className="w-3.5 h-3.5" />
              <span>Stop Demo</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          <button
            onClick={() => onStartScenario('scenario-1', 1)}
            disabled={isPlaying}
            className="flex flex-col text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-950/50 hover:bg-slate-950/90 border border-slate-800 hover:border-rose-500/50 active:scale-[0.98] transition-all disabled:opacity-50 group"
          >
            <span className="text-[11px] sm:text-xs font-bold text-rose-400">🚨 Scam Call</span>
            <span className="text-xs sm:text-sm font-bold text-white mt-1 group-hover:text-rose-200">
              {t.fakePoliceTest}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">{t.fakePoliceDesc}</span>
          </button>

          <button
            onClick={() => onStartScenario('scenario-2', 1)}
            disabled={isPlaying}
            className="flex flex-col text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-950/50 hover:bg-slate-950/90 border border-slate-800 hover:border-amber-500/50 active:scale-[0.98] transition-all disabled:opacity-50 group"
          >
            <span className="text-[11px] sm:text-xs font-bold text-amber-400">⚡ OTP Scam</span>
            <span className="text-xs sm:text-sm font-bold text-white mt-1 group-hover:text-amber-200">
              {t.electricityTest}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">{t.electricityDesc}</span>
          </button>

          <button
            onClick={() => onStartScenario('scenario-3', 1)}
            disabled={isPlaying}
            className="flex flex-col text-left p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-950/50 hover:bg-slate-950/90 border border-slate-800 hover:border-emerald-500/50 active:scale-[0.98] transition-all disabled:opacity-50 group"
          >
            <span className="text-[11px] sm:text-xs font-bold text-emerald-400">📦 Safe Call</span>
            <span className="text-xs sm:text-sm font-bold text-white mt-1 group-hover:text-emerald-200">
              {t.benignTest}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">{t.benignDesc}</span>
          </button>
        </div>
      </div>

      {/* 3 Simple Safety Rules */}
      <div className="bg-slate-900/60 rounded-2xl sm:rounded-3xl border border-slate-800 p-4 sm:p-6 space-y-3 sm:space-y-3.5 shadow-sm">
        <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          <span>{t.rulesTitle}</span>
        </h3>

        <div className="space-y-2 sm:space-y-2.5">
          <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-950/50 border border-slate-800/80 flex items-start gap-2.5 sm:gap-3">
            <span className="text-base sm:text-lg">👮‍♂️</span>
            <p className="text-xs sm:text-sm text-slate-200 font-medium">{t.rule1}</p>
          </div>

          <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-950/50 border border-slate-800/80 flex items-start gap-2.5 sm:gap-3">
            <span className="text-base sm:text-lg">🏦</span>
            <p className="text-xs sm:text-sm text-slate-200 font-medium">{t.rule2}</p>
          </div>

          <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-slate-950/50 border border-slate-800/80 flex items-start gap-2.5 sm:gap-3">
            <span className="text-base sm:text-lg">📵</span>
            <p className="text-xs sm:text-sm text-slate-200 font-medium">{t.rule3}</p>
          </div>
        </div>

        <div className="pt-1 text-center">
          <button
            onClick={onDownloadPDF}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-300 active:scale-95 transition-transform"
          >
            <FileDown className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t.pdfDownloadBtn}</span>
          </button>
        </div>
      </div>

    </div>
  );
};

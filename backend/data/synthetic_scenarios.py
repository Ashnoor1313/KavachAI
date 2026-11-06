"""
Kavach AI - Synthetic Scenarios Dataset
100% SYNTHETIC & DPDP ACT COMPLIANT
All phone numbers, Aadhaar numbers, officer names, and transaction IDs are completely fictional.
"""

SYNTHETIC_SCENARIOS = [
    {
        "id": "scenario-1",
        "title": "FedEx Narcotics & Fake CBI Digital Arrest",
        "subtitle": "Classic high-pressure Digital Arrest impersonating FedEx & Mumbai Cyber Police / CBI",
        "badge": "CRITICAL THREAT (96%)",
        "scam_type": "Digital Arrest / Fake CBI-Police",
        "ambient_audio": "siren_office_chatter",
        "duration_sec": 24,
        "caller_number": "+91-99999-XXXX1 (Fake Mumbai Police CallerID)",
        "victim_profile": "Ramesh Kumar (68y, Retired Central Govt Employee)",
        "escalation_path": "15% (FedEx parcel notification) -> 58% (Narcotics & FIR mention) -> 96% (Digital Arrest Skype lockdown & RTGS demand)",
        "utterances": [
            {
                "id": 1,
                "speaker": "Automated IVR",
                "text": "Namaste Ramesh ji. This is an urgent advisory from FedEx Express Mumbai Hub. Your parcel tracking number FX-9921-MUM is placed on indefinite hold.",
                "delay_ms": 1800,
                "timestamp": "00:02",
                "latency_ms": 142,
                "threat_score": 18,
                "vector_authority": 25,
                "vector_isolation": 10,
                "vector_financial": 15,
                "flagged": ["FedEx", "parcel on hold"]
            },
            {
                "id": 2,
                "speaker": "Mock Officer Vikram (FedEx Agent)",
                "text": "Hello sir! Customs scanning mein aapke parcel ke andar 140 grams MDMA Narcotics, 5 fake passports aur 3 blank bank passbooks baramad hui hain.",
                "delay_ms": 2600,
                "timestamp": "00:06",
                "latency_ms": 154,
                "threat_score": 52,
                "vector_authority": 65,
                "vector_isolation": 35,
                "vector_financial": 45,
                "flagged": ["Narcotics", "MDMA", "passports", "bank passbooks"]
            },
            {
                "id": 3,
                "speaker": "Victim (Elderly Uncle)",
                "text": "Kya keh rahe hain aap? Maine koi parcel Taiwan nahi bheja! Mera isse koi lena dena nahi hai bhai sahab!",
                "delay_ms": 2200,
                "timestamp": "00:10",
                "latency_ms": 139,
                "threat_score": 55,
                "vector_authority": 65,
                "vector_isolation": 40,
                "vector_financial": 45,
                "flagged": []
            },
            {
                "id": 4,
                "speaker": "Mock Officer Rathore (CBI / Mumbai Crime Branch)",
                "text": "Main Inspector Rathore bol raha hoon, Mumbai Crime Branch. Aapka [Aadhaar Redacted] international money laundering syndicate se linked hai. Supreme Court ne non-bailable FIR darj kar di hai.",
                "delay_ms": 3000,
                "timestamp": "00:14",
                "latency_ms": 168,
                "threat_score": 82,
                "vector_authority": 92,
                "vector_isolation": 78,
                "vector_financial": 65,
                "flagged": ["Mumbai Crime Branch", "Inspector", "Aadhaar", "Money laundering", "Supreme Court", "FIR"]
            },
            {
                "id": 5,
                "speaker": "Mock Officer Rathore (CBI / Mumbai Crime Branch)",
                "text": "Sun lijiye, aap abhi DIGITAL ARREST par hain! Video call bilkul mat kaatna! Kisi parivaar wale ko bataya toh secret act ke tehat turant police ghar bhej kar arrest kar lenge!",
                "delay_ms": 3200,
                "timestamp": "00:19",
                "latency_ms": 162,
                "threat_score": 93,
                "vector_authority": 96,
                "vector_isolation": 98,
                "vector_financial": 80,
                "flagged": ["DIGITAL ARREST", "Video call mat kaatna", "Kisi ko mat batana", "police arrest"]
            },
            {
                "id": 6,
                "speaker": "Mock Officer Rathore (CBI / Mumbai Crime Branch)",
                "text": "Clearance certificate ke liye aapke saving account se 4,80,000 rupaye turant RBI verification account par RTGS kijiye. Verification ke baad 15 minute mein refund ho jayega.",
                "delay_ms": 3100,
                "timestamp": "00:23",
                "latency_ms": 158,
                "threat_score": 96,
                "vector_authority": 98,
                "vector_isolation": 99,
                "vector_financial": 97,
                "flagged": ["4,80,000 rupaye", "RBI verification account", "RTGS", "refund"]
            }
        ]
    },
    {
        "id": "scenario-2",
        "title": "Electricity Bill & Bank KYC UPI Block Scam",
        "subtitle": "Urgent disconnection panic combined with screen-sharing APK & UPI security transfer",
        "badge": "HIGH RISK (88%)",
        "scam_type": "UPI / KYC Refund Fraud",
        "ambient_audio": "callcenter_background",
        "duration_sec": 20,
        "caller_number": "+91-99999-XXXX2 (Fake BSES Power Support)",
        "victim_profile": "Smt. Shanti Devi (64y, Homemaker)",
        "escalation_path": "22% (Electricity cut off warning) -> 62% (Bank KYC block threat) -> 88% (QuickSupport APK & UPI transfer coercion)",
        "utterances": [
            {
                "id": 1,
                "speaker": "Automated IVR",
                "text": "Attention electricity consumer! BSES Power alert: Aapka pichle mahine ka electricity bill update nahi hua hai. Aaj raat 9:30 baje bijli connection permanently kaat diya jayega.",
                "delay_ms": 2000,
                "timestamp": "00:02",
                "latency_ms": 145,
                "threat_score": 25,
                "vector_authority": 35,
                "vector_isolation": 15,
                "vector_financial": 20,
                "flagged": ["Electricity bill", "bijli connection", "permanently kaat diya"]
            },
            {
                "id": 2,
                "speaker": "Mock Executive Rahul (Power Discom Desk)",
                "text": "Madam ji main BSES Head Office se officer Rahul bol raha hoon. Disconnection order generate ho chuka hai. Isse rokne ke liye turant bill update verify karna hoga.",
                "delay_ms": 2400,
                "timestamp": "00:06",
                "latency_ms": 152,
                "threat_score": 45,
                "vector_authority": 55,
                "vector_isolation": 30,
                "vector_financial": 40,
                "flagged": ["Head Office", "Disconnection order"]
            },
            {
                "id": 3,
                "speaker": "Victim (Elderly Aunt)",
                "text": "Bhaiya maine toh pichle hafte hi online 1,200 rupaye bhar diye the! Phir bijli kyu kaat rahe ho?",
                "delay_ms": 2000,
                "timestamp": "00:10",
                "latency_ms": 138,
                "threat_score": 48,
                "vector_authority": 55,
                "vector_isolation": 30,
                "vector_financial": 45,
                "flagged": []
            },
            {
                "id": 4,
                "speaker": "Mock Executive Rahul (Power Discom Desk)",
                "text": "Server par PAN-Aadhaar KYC block dikha raha hai. Aap turant Play Store se QuickSupport app download kijiye aur apna 9-digit code share kijiye.",
                "delay_ms": 2800,
                "timestamp": "00:14",
                "latency_ms": 164,
                "threat_score": 75,
                "vector_authority": 65,
                "vector_isolation": 70,
                "vector_financial": 78,
                "flagged": ["KYC block", "QuickSupport", "Play Store", "share code"]
            },
            {
                "id": 5,
                "speaker": "Mock Executive Rahul (Power Discom Desk)",
                "text": "Abhi verification ke liye PhonePe ya GPay khol kar 10 rupaye ka test transaction kijiye aur 6-digit secret UPI PIN daaliye, server token reset ho jayega.",
                "delay_ms": 3000,
                "timestamp": "00:18",
                "latency_ms": 160,
                "threat_score": 88,
                "vector_authority": 72,
                "vector_isolation": 82,
                "vector_financial": 94,
                "flagged": ["PhonePe", "GPay", "UPI PIN", "test transaction", "secret UPI PIN"]
            }
        ]
    },
    {
        "id": "scenario-3",
        "title": "Amazon Delivery & Family Call (Control Test)",
        "subtitle": "Safe, legitimate daily call to verify zero false positives on benign Hinglish conversation",
        "badge": "SAFE (08%)",
        "scam_type": "Benign Call",
        "ambient_audio": "none",
        "duration_sec": 18,
        "caller_number": "+91-99999-XXXX3 (Verified Delivery Logistics)",
        "victim_profile": "Ramesh Kumar (68y, User)",
        "escalation_path": "06% (Gate arrival) -> 08% (Security guard delivery) -> 08% (Family greeting - Benign)",
        "utterances": [
            {
                "id": 1,
                "speaker": "Delivery Associate (Amazon)",
                "text": "Bhaiya namaste, main Amazon delivery se Manoj bol raha hoon. Aapka kitchen mixer grinder parcel lekar main society ke Main Gate par khada hoon.",
                "delay_ms": 2000,
                "timestamp": "00:03",
                "latency_ms": 140,
                "threat_score": 6,
                "vector_authority": 4,
                "vector_isolation": 2,
                "vector_financial": 5,
                "flagged": ["Amazon", "parcel"]
            },
            {
                "id": 2,
                "speaker": "Ramesh Kumar (Customer)",
                "text": "Haan Manoj beta, main ghar par hi hoon. Tower 4, Flat 502 ki lift se upar aa jao.",
                "delay_ms": 2100,
                "timestamp": "00:07",
                "latency_ms": 136,
                "threat_score": 5,
                "vector_authority": 3,
                "vector_isolation": 1,
                "vector_financial": 3,
                "flagged": []
            },
            {
                "id": 3,
                "speaker": "Delivery Associate (Amazon)",
                "text": "Sir guard sahab bol rahe hain entry register mein sign karna hoga. Kya main package reception desk par chhod doon ya upar le aau?",
                "delay_ms": 2300,
                "timestamp": "00:11",
                "latency_ms": 144,
                "threat_score": 7,
                "vector_authority": 5,
                "vector_isolation": 2,
                "vector_financial": 4,
                "flagged": []
            },
            {
                "id": 4,
                "speaker": "Ramesh Kumar (Customer)",
                "text": "Reception par guard Tiwari ji ko de do. Prepaid order hai, koi payment nahi karna. Thank you beta!",
                "delay_ms": 2000,
                "timestamp": "00:15",
                "latency_ms": 139,
                "threat_score": 8,
                "vector_authority": 4,
                "vector_isolation": 2,
                "vector_financial": 6,
                "flagged": ["Prepaid order"]
            }
        ]
    }
]

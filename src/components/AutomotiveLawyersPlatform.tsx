import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scale, Search, FileText, MessageSquare, Calendar, UploadCloud, CheckCircle, 
  AlertCircle, ThumbsUp, Star, Globe, MapPin, Sparkles, Clock, ArrowLeft, 
  Send, File, Check, BookOpen, ShieldAlert, Trash2, ChevronRight, Landmark, RefreshCw
} from 'lucide-react';

// Multi-language translation table
type LangMode = 'en' | 'lt' | 'de' | 'pl';

const TRANSLATIONS: Record<LangMode, Record<string, string>> = {
  en: {
    title: "Car Legal Help Portal",
    subtitle: "Get simple and reliable help with car purchase contracts, insurance problems, mileage fraud, and shipping disputes from trusted lawyers.",
    searchPlaceholder: "Search lawyers by name, city, or specialty...",
    specialties: "Specialty",
    location: "Location",
    language: "Languages",
    rating: "Rating",
    country: "Country",
    city: "City",
    caseType: "Type of Case",
    bookBtn: "Book Consultation",
    chatBtn: "Open Secure Chat",
    aiAssistant: "AI Contract Scan",
    caseDocTitle: "My Cases",
    evidenceVault: "Evidence Folder",
    certifications: "Credentials & Licenses",
    articles: "Helpful Articles & Guides",
    privateFeedback: "Send Your Feedback"
  },
  lt: {
    title: "Saugus Automobilių Teisės Centras",
    subtitle: "Sutarčių auditai, draudimo atmetimo apeliacijos, ridos klastojimo persekiojimas ir tarpvalstybinis atstovavimas teisme su registruotais Europos advokatais.",
    searchPlaceholder: "Ieškoti advokatų pagal vardą, miestą ar raktažodį...",
    specialties: "Pagrindinė Specializacija",
    location: "Vietovė / Miestas",
    language: "Sutarčių Kalbos",
    rating: "Autoriteto Reitingas",
    country: "Šalis",
    city: "Miestas",
    caseType: "Konsultacijos Pobūdis",
    bookBtn: "Užsakyti Teisinę Konsultaciją",
    chatBtn: "Atidaryti Įrodymų Pokalbį",
    aiAssistant: "AI Sutarčių ir Klausimų Analizatorius",
    caseDocTitle: "Aktyvios Teisinės Bylos ir Dosjė",
    evidenceVault: "Saugus Įrodymų Depozitoriumas",
    certifications: "Sertifikatai ir Advokatų Gildijos Licencijos",
    articles: "Teisės Straipsniai ir Publikacijos",
    privateFeedback: "Teikti Konfidencialią Atitikties Ataskaitą"
  },
  de: {
    title: "Automobil-Rechtszentrum & Kanzleiportal",
    subtitle: "Vertragsprüfungen, Anfechtung von Versicherungsablehnungen, Strafverfolgung von Kilometerbetrug und grenzüberschreitende Schadensregulierung.",
    searchPlaceholder: "Anwalt nach Name, Stadt oder Spezialgebiet suchen...",
    specialties: "Hauptbereich",
    location: "Standort / NL",
    language: "Korrespondenzsprachen",
    rating: "Kanzlei-Klassifizierung",
    country: "Mitgliedstaat",
    city: "Stadt",
    caseType: "Beratungsgegenstand",
    bookBtn: "Konsultation Buchen",
    chatBtn: "Abhörsicheren Chat Starten",
    aiAssistant: "KI Vertrags- & Klauselprüfung",
    caseDocTitle: "Aktive Rechtsstreite & Mandate",
    evidenceVault: "Verschlüsseltes Beweisarchiv",
    certifications: "Kammerzulassungen & Zertifikate",
    articles: "Fachpublikationen & Urteilsanalysen",
    privateFeedback: "Anonymes Qualitätsfeedback einreichen"
  },
  pl: {
    title: "Centrum Pomocy Prawnej w Motoryzacji",
    subtitle: "Audyty umów kupna, odwołania od decyzji ubezpieczeniowych, ściganie oszustw licznikowych i spory o ukryte wady fizyczne pojazdów.",
    searchPlaceholder: "Szukaj prawników po nazwisku, mieście lub specjalności...",
    specialties: "Główna Specjalność",
    location: "Lokalizacja / Biuro",
    language: "Języki Koncesyjne",
    rating: "Ocena Kancelarii",
    country: "Państwo",
    city: "Miasto",
    caseType: "Rodzaj Konsultacji",
    bookBtn: "Zarezerwuj Konsultację",
    chatBtn: "Otwórz Bezpieczny Czat",
    aiAssistant: "Asystent Analizy Umów AI",
    caseDocTitle: "Bieżące Sprawy i Akta Klienta",
    evidenceVault: "Zaszyfrowany Sejf Dowodowy",
    certifications: "Uprawnienia Krajowej Izby Prawniczej",
    articles: "Publikacje i Artykuły Branżowe",
    privateFeedback: "Prześlij Poufną Recenzję Usługi"
  }
};

interface LawyerArticle {
  id: string;
  title: string;
  journal: string;
  date: string;
  summary: string;
}

interface Lawyer {
  id: string;
  name: string;
  firm: string;
  title: string;
  specialty: 'Vehicle Fraud' | 'Accident Claims' | 'Insurance Disputes' | 'Import/Export' | 'Leasing Issues' | 'Contracts';
  location: string;
  city: string;
  country: string;
  languages: string[];
  rating: number;
  reviewsCount: number;
  hourlyRate: number;
  bio: string;
  avatar: string;
  certifications: string[];
  articles: LawyerArticle[];
}

const INITIAL_LAWYERS: Lawyer[] = [
  {
    id: 'law-1',
    name: 'Dr. Sandra Kairyte',
    firm: 'Kairys & Baltic Legal Partners',
    title: 'Senior Litigation Partner',
    specialty: 'Vehicle Fraud',
    location: 'Vilnius, Lithuania',
    city: 'Vilnius',
    country: 'Lithuania',
    languages: ['Lithuanian', 'English', 'German'],
    rating: 4.9,
    reviewsCount: 78,
    hourlyRate: 180,
    bio: 'Renowned expert in trans-EEA salvage import compliance, vehicle identity theft, and high-value luxury vehicle odometer tampering disputes. Regularly represents dealerships in disputes before the State Roadways Inspectorate.',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCu8732s9UqLpxzPThvYvEWeW0S2T5iO_I6G2K54Y-w1S8k779-uTz80o08X7V-JWeK96AXY09jVxXz2X8-VwY7zT9I8NEXXw=s200',
    certifications: [
      'Lithuanian Bar Association License № LT-8849',
      'EU Salvage Arbitration Expert Panel Certification',
      'Certified Legal Technologist, Leipzig Institute of Law'
    ],
    articles: [
      {
        id: 'art-1-1',
        title: 'Contesting Non-Disclosure of Battery Degrades in Cross-Border Tesla Sales',
        journal: 'Baltic Journal of Consumer Protection',
        date: 'Jan 2026',
        summary: 'An depth clausal examination of legal avenues under state seller obligation frameworks when lithium cell degradation state is deliberately masked at auction terminals.'
      },
      {
        id: 'art-1-2',
        title: 'Mitigating Overlapping Customs Tariffs for Restored Salvage Shell Imports',
        journal: 'European Customs & Trade review',
        date: 'Oct 2025',
        summary: 'How to successfully structure de-registration records to clear RO-RO customs without paying double tax duty.'
      }
    ]
  },
  {
    id: 'law-2',
    name: 'Klaus Richter',
    firm: 'Richter & Cargo Attorneys',
    title: 'Principal Trade Attorney',
    specialty: 'Import/Export',
    location: 'Klaipėda Office, Lithuania / Hamburg HQ',
    city: 'Klaipėda',
    country: 'Germany/Lithuania',
    languages: ['German', 'English', 'Polish', 'Lithuanian'],
    rating: 4.8,
    reviewsCount: 54,
    hourlyRate: 240,
    bio: 'Focuses strictly on international maritime car shipping contracts, bulk container port damage claims, and custom tax classification mitigation. Specialist in advising freight consolidators shipping salvage luxury brands down Baltic routes.',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200',
    certifications: [
      'Hamburg Chamber of Attorneys (Hanseatische Rechtsanwaltskammer)',
      'Certified Transnational Baltic Transport Counsel',
      'Admitted Counsel to the European Port Claims Commission'
    ],
    articles: [
      {
        id: 'art-2-1',
        title: 'Carrier Liability Thresholds in RO-RO Electric Vehicle Fire Hazards',
        journal: 'Maritime Logistics & Liability Digest',
        date: 'Feb 2026',
        summary: 'Investigating the intersection of warranty holdouts and carrier liability when high-voltage batteries experience thermal incidents at dry ports.'
      }
    ]
  },
  {
    id: 'law-3',
    name: 'Marta Kowalska',
    firm: 'Kowalska & Gidaszewska Adwokaci',
    title: 'Managing Director, Accident Recovery',
    specialty: 'Accident Claims',
    location: 'Warsaw, Poland / Kaunas Branch',
    city: 'Warsaw',
    country: 'Poland',
    languages: ['Polish', 'English'],
    rating: 4.7,
    reviewsCount: 92,
    hourlyRate: 150,
    bio: 'Dedicated to fighting predatory insurance valuation markdowns. Uses paint thickness sensor analytics and electronic diagnostic logs to prove impact structural damage angles that third-party adjusters try to dismiss.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
    certifications: [
      'Polish Bar Council Admission (ORA Warszawa № ORA-33412)',
      'Expert Witness in Micro-Impact Damage Trajectory',
      'Adviser to the Warsaw Motorist Insurance Coalition'
    ],
    articles: [
      {
        id: 'art-3-1',
        title: 'Overturning Lowball Structural Total Loss Declarations: A Sensor-Driven Approach',
        journal: 'Motor Insurance Claims Quarterly',
        date: 'Dec 2025',
        summary: 'Applying microdynamic paint calibration records to force complete insurance payout settlements on rare vintage vehicles.'
      }
    ]
  },
  {
    id: 'law-4',
    name: 'Arturas Berzins',
    firm: 'Berzins & Riga Transit Legal',
    title: 'Senior Contract Auditor',
    specialty: 'Leasing Issues',
    location: 'Riga, Latvia',
    city: 'Riga',
    country: 'Latvia',
    languages: ['Latvian', 'English', 'Russian'],
    rating: 4.9,
    reviewsCount: 41,
    hourlyRate: 160,
    bio: 'Unrivaled expertise drafting complex lease-to-own agreements, reclaiming fleet vehicle assets held by fraudulent logistics fronts, and negotiating down malicious lease-end wear-and-tear claim fees.',
    avatar: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=200&h=200',
    certifications: [
      'Latvian Council of Sworn Advocates (Zvērināti advokāti № LAT-112)',
      'Chairperson, Baltic Equipment Lease Counsel Circle'
    ],
    articles: [
      {
        id: 'art-4-1',
        title: 'Hidden Interest Capitalization in Sub-Prime Baltic Auto Leases',
        journal: 'Riga FinTech & Law Review',
        date: 'Nov 2025',
        summary: 'Deconstructing complex compounded lease interest multipliers that hide behind regulatory grey holes.'
      }
    ]
  }
];

// Mock cases in the case documentation system
interface CaseDossier {
  id: string;
  title: string;
  lawyerName: string;
  status: 'In intake' | 'Analysis' | 'Evidence lock' | 'Litigation Filed' | 'Settled';
  specialty: string;
  creationDate: string;
  activeFlag: boolean;
  documents: Array<{ name: string; date: string; category: string; hashHash: string }>;
  milestones: Array<{ date: string; text: string; completed: boolean }>;
}

const INITIAL_CASES: CaseDossier[] = [
  {
    id: 'case-901',
    title: 'VIN Tampering Dispute (Porsche 911 S)',
    lawyerName: 'Dr. Sandra Kairyte',
    status: 'Evidence lock',
    specialty: 'Vehicle Fraud',
    creationDate: '2026-05-12',
    activeFlag: true,
    documents: [
      { name: 'Odometer_Discrepancy_Sovereign_State_Audit.pdf', date: '2026-05-13', category: 'Official State Records', hashHash: '0x884a...912f' },
      { name: 'Factory_ECU_Dump_Analysis_HexCode.txt', date: '2026-05-14', category: 'Telematics Dump', hashHash: '0xf012...89ee' }
    ],
    milestones: [
      { date: '2026-05-12', text: 'Case registered following biometric identity link approval', completed: true },
      { date: '2026-05-13', text: 'Subpoena delivered to Munich secondary broker node', completed: true },
      { date: '2026-05-20', text: 'Deposition of technical laser scanning inspector', completed: false }
    ]
  }
];

export default function AutomotiveLawyersPlatform() {
  const [lang, setLang] = useState<LangMode>('en');
  const [selectedLawyerId, setSelectedLawyerId] = useState<string | null>(null);

  // Search parameters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');

  // Interactive booking state
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('10:00');
  const [bookingType, setBookingType] = useState('Video consultation (Encrypted)');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Private Ratings and feedback state
  const [userRating, setUserRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [lawyersList, setLawyersList] = useState<Lawyer[]>(INITIAL_LAWYERS);
  const [feedbackSucess, setFeedbackSuccess] = useState(false);

  // Secure Chat & Evidence system state
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: 'user' | 'lawyer' | 'system'; text: string; timestamp: string; files?: string[] }>>([
    {
      id: 'msg-1',
      sender: 'system',
      text: 'Secure end-to-end Signal protocol handshake active. All transcript files and evidence vaults are shielded by Baltic statutory legal protection mandates.',
      timestamp: '09:00'
    },
    {
      id: 'msg-2',
      sender: 'lawyer',
      text: 'Greetings. I have initialized your dispute dossier. Please upload any contracts, paint reports, or odometer snapshots directly into this thread.',
      timestamp: '09:02'
    }
  ]);
  const [newMessageText, setNewMessageText] = useState('');
  const [chatAttachedFiles, setChatAttachedFiles] = useState<string[]>([]);

  // AI Legal Assistant states
  const [aiAnalysisType, setAiAnalysisType] = useState<'summary' | 'clausal_risk' | 'evidence_organization'>('summary');
  const [contractTextInput, setContractTextInput] = useState('');
  const [aiIsAnalyzing, setAiIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<null | {
    summary: string;
    criticalFlags: string[];
    obligations: string[];
    courtPrecedents: string[];
  }>(null);

  // Case Documentation state
  const [activeCases, setActiveCases] = useState<CaseDossier[]>(INITIAL_CASES);

  // Close booking message after delay
  useEffect(() => {
    if (bookingSuccess) {
      const timer = setTimeout(() => setBookingSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [bookingSuccess]);

  // Handle Search and Filter logic
  const filteredLawyers = lawyersList.filter(l => {
    const textMatch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      l.firm.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      l.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      l.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    const specMatch = selectedSpecialty === 'All' || l.specialty === selectedSpecialty;
    const countryMatch = selectedCountry === 'All' || l.country.toLowerCase().includes(selectedCountry.toLowerCase());
    const langMatch = selectedLanguage === 'All' || l.languages.includes(selectedLanguage);

    return textMatch && specMatch && countryMatch && langMatch;
  });

  const selectedLawyer = lawyersList.find(l => l.id === selectedLawyerId);

  // Book a consultation
  const handleInitiateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate) {
      alert("Please select a valid consultation calendar date.");
      return;
    }

    setBookingSuccess(true);
    
    // Add a corresponding milestone or system notice to their active case
    const mockCaseId = `case-${Date.now().toString().slice(-3)}`;
    const newCase: CaseDossier = {
      id: mockCaseId,
      title: `Consultation: ${bookingType} with ${selectedLawyer?.name || 'Counsel'}`,
      lawyerName: selectedLawyer?.name || 'Sovereign Attorney',
      status: 'In intake',
      specialty: selectedLawyer?.specialty || 'General Counsel',
      creationDate: bookingDate,
      activeFlag: true,
      documents: bookingNotes ? [{ name: 'User_Pre_consultation_brief.txt', date: bookingDate, category: 'Briefing Notes', hashHash: '0x3201...ab00' }] : [],
      milestones: [
        { date: bookingDate, text: `Scheduled Live ${bookingType} at ${bookingTime}`, completed: true },
        { date: bookingDate, text: `AI agent pre-scans linked vehicle history reports`, completed: false }
      ]
    };

    setActiveCases(prev => [newCase, ...prev]);
    setBookingNotes('');
  };

  // Submit Private feedback
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      alert("Please enter confidential audit text.");
      return;
    }

    if (!selectedLawyerId) return;

    // Direct injection into localized rating logic
    setLawyersList(prev => prev.map(l => {
      if (l.id === selectedLawyerId) {
        const newCount = l.reviewsCount + 1;
        const newRating = parseFloat(((l.rating * l.reviewsCount + userRating) / newCount).toFixed(2));
        return { ...l, rating: newRating, reviewsCount: newCount };
      }
      return l;
    }));

    setFeedbackSuccess(true);
    setFeedbackText('');
    setTimeout(() => setFeedbackSuccess(false), 4000);
  };

  // Chat message send
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() && chatAttachedFiles.length === 0) return;

    const userMsgId = `user-msg-${Date.now()}`;
    const filePayload = chatAttachedFiles.length > 0 ? [...chatAttachedFiles] : undefined;
    
    const userMsg = {
      id: userMsgId,
      sender: 'user' as const,
      text: newMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      files: filePayload
    };

    setChatMessages(prev => [...prev, userMsg]);
    setNewMessageText('');
    setChatAttachedFiles([]);

    // Simulate Lawyers response depending on what they said
    setTimeout(() => {
      let responseText = `I have received your files. Let me incorporate them into our files.`;
      if (userMsg.text.toLowerCase().includes('contract') || userMsg.text.toLowerCase().includes('lease')) {
        responseText = `This leasing document contains custom liquidated damages parameters. I advise you to run this text draft through our "AI Contract Analyser" tab above to check for hidden compliance pitfalls!`;
      } else if (userMsg.text.toLowerCase().includes('fraud') || userMsg.text.toLowerCase().includes(' kilometer') || userMsg.text.toLowerCase().includes('milage')) {
        responseText = `Under Statutory Article 308 (Teisės aktai), odometer rollbacks are prosecuted under civil fraud channels. Our next step is locking this state registry historical log to compile with the lawsuit.`;
      }

      setChatMessages(prev => [...prev, {
        id: `lawyer-ans-${Date.now()}`,
        sender: 'lawyer' as const,
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      // If document was attached, automatically add to active case documents
      if (filePayload) {
        setActiveCases(prev => prev.map(c => {
          if (c.activeFlag) {
            return {
              ...c,
              documents: [
                ...c.documents,
                ...filePayload.map(fName => ({
                  name: fName,
                  date: '2026-06-17',
                  category: 'Evidence File Upload',
                  hashHash: `0x${Math.floor(Math.random()*100000).toString(16)}...9cf0`
                }))
              ]
            };
          }
          return c;
        }));
      }

    }, 1500);
  };

  // Simulate file drag/selection for Chat
  const triggerChatFileUpload = (fileName: string) => {
    setChatAttachedFiles(prev => [...prev, fileName]);
  };

  // AI Contract execution simulations
  const runAiContractAnalysis = () => {
    if (!contractTextInput.trim()) {
      alert("Please provide the legal contract text, sale clause draft, or insurance waiver details.");
      return;
    }

    setAiIsAnalyzing(true);
    setAiResult(null);

    setTimeout(() => {
      setAiIsAnalyzing(false);

      if (aiAnalysisType === 'summary') {
        setAiResult({
          summary: "An automotive procurement agreement draft binding Baltic Import escrow buffers to transport components. Significant financial exposure exists in the event of default on transit timelines.",
          criticalFlags: [
            "⚠️ LIQUIDATED RESTRICTIONS: Section 12.2 charges €250/day late fees during custom clearance holdouts, even if caused by port strikes.",
            "⚠️ EXCLUSION CLAUSE: Section 8.4 completely waives provider liability for mechanical damage sustained during shipping on third-party Ro-Ro vessels.",
            "⚠️ FORUM SELECT: Any legal action must be filed in the arbitration courts of Riga, limiting Baltic local options."
          ],
          obligations: [
            "Escrow buyer must deliver 20% down-payment within 48 business hours of digital signature.",
            "Consignee is obligated to inspect hydraulic structures and seal welds immediately at container release gates."
          ],
          courtPrecedents: [
            "VPTI State Council vs. Cargo Baltija (2024): Confirmed third-party damage waivers hold no weight if willful neglect in battery cooling can be established.",
            "Hamburg Trade Dispute № 12b (2023): Odometer discrepancy liability always returns to originating transit seller regardless of transfer-of-risk checkpoints."
          ]
        });
      } else if (aiAnalysisType === 'clausal_risk') {
        setAiResult({
          summary: "High-exposure litigation indicators found regarding warranty exclusion and forced arbitration rules.",
          criticalFlags: [
            "⚡ SEVERE EXPOSURE: The contract waives all mechanical warranty parameters immediately upon buyer signing delivery paper, ignoring Lithuanian statutory 2-year secondary consumer protections.",
            "⚡ SUBSIDY PENALTY: Section 19.1 forbids third-party mechanics from using non-OEM parts on battery frames or the warranty is instantly void."
          ],
          obligations: [
            "Pre-existing condition photos must be synced to the smart-ledger BEFORE boarding container.",
            "Taxes & customs are entirely designated to the consignor."
          ],
          courtPrecedents: [
            "ECJ Ruling C-411/22: National law overrides arbitrary forum selection clauses in retail direct automotive transactions."
          ]
        });
      } else {
        // Evidence organization
        setAiResult({
          summary: "Automatic layout of chronological evidence mapped against regulatory proof targets for Baltic dispute committees.",
          criticalFlags: [
            "✓ Diagnostics mapped to Proof Point A",
            "✓ Paint records map to Proof Point B"
          ],
          obligations: [
            "Generate formal report PDF and submit to bar council registry.",
            "Request official manufacturer diagnostic calibration files."
          ],
          courtPrecedents: [
            "Vilnius Regional Court Decision 2A-443/2025: Self-certified micro-paint calibration reports accepted as standard evidence in fraud claims."
          ]
        });
      }
    }, 2000);
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen text-slate-900 pb-12" id="automotive-lawyers-platform-module">

      {/* Main Container */}
      <div className="max-w-[1240px] mx-auto px-4 pt-8 space-y-8 select-none">
        
        {/* HEADER AREA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-200">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 font-sans">
              {TRANSLATIONS[lang].title}
            </h1>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-zinc-200 shadow-sm self-start">
            <Globe className="w-4 h-4 text-zinc-400" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mr-1">UI:</span>
            <div className="flex gap-1">
              {(['en', 'lt', 'de', 'pl'] as LangMode[]).map((curL) => (
                <button
                  key={curL}
                  onClick={() => setLang(curL)}
                  className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase transition-colors ${
                    lang === curL 
                      ? 'bg-[#8B0000] text-white' 
                      : 'text-zinc-500 hover:text-zinc-950'
                  }`}
                >
                  {curL}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ACTIVE DOSSIER BRIEF AND STATE WARNINGS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-12">
            <div className="bg-[#8B0000] text-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1 relative z-10 max-w-4xl">
                <p className="text-base font-black tracking-tight">Protect Yourself Against Car Scams & Fake VINs</p>
                <p className="text-xs text-zinc-200 leading-relaxed font-normal">
                  Our network of lawyers works directly with official European transport registries to verify vehicles. We highly recommend talking to a lawyer before signing any contract or sending money.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RENDER VIEW CONTROLLER: MAIN EXPLORER OR DETAIL PAGE */}
        <AnimatePresence mode="wait">
          {!selectedLawyerId ? (
            
            // ============================================
            // VIEW A: LAWYERS SEARCH DIRECTORY & EXPLORER
            // ============================================
            <motion.div
              key="directory"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* LEGAL SEARCH BAR AND MULTI-FILTERS */}
              <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
                
                {/* Text search section */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={TRANSLATIONS[lang].searchPlaceholder}
                    className="w-full bg-zinc-50 border border-zinc-200 pl-10 pr-4 py-3 rounded-xl text-zinc-800 outline-none placeholder:text-zinc-400 font-sans text-xs focus:bg-white focus:border-[#8B0000] transition-colors"
                  />
                </div>

                {/* Grid layout filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end text-xs">
                  
                  {/* Specialty */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{TRANSLATIONS[lang].specialties}</label>
                    <select
                      value={selectedSpecialty}
                      onChange={(e) => setSelectedSpecialty(e.target.value)}
                      className="w-full bg-white border border-zinc-200 p-2.5 rounded-xl font-medium text-zinc-800 outline-none focus:border-[#8B0000]"
                    >
                      <option value="All">All Specialties</option>
                      <option value="Vehicle Fraud">Vehicle Fraud (Odometer, VIN)</option>
                      <option value="Accident Claims">Accident Claims (Collision, Total Loss)</option>
                      <option value="Insurance Disputes">Insurance Disputes</option>
                      <option value="Import/Export">Import/Export & Customs</option>
                      <option value="Leasing Issues">Leasing & Finance Disputes</option>
                      <option value="Contracts">Contracts & Transactions</option>
                    </select>
                  </div>

                  {/* Country */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{TRANSLATIONS[lang].country}</label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full bg-white border border-zinc-200 p-2.5 rounded-xl font-medium text-zinc-800 outline-none focus:border-[#8B0000]"
                    >
                      <option value="All">All Countries</option>
                      <option value="Lithuania">Lithuania</option>
                      <option value="Germany">Germany</option>
                      <option value="Poland">Poland</option>
                      <option value="Latvia">Latvia</option>
                    </select>
                  </div>

                  {/* Language */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{TRANSLATIONS[lang].language}</label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full bg-white border border-zinc-200 p-2.5 rounded-xl font-medium text-zinc-800 outline-none focus:border-[#8B0000]"
                    >
                      <option value="All">All Languages</option>
                      <option value="English">English</option>
                      <option value="Lithuanian">Lithuanian</option>
                      <option value="German">German</option>
                      <option value="Polish">Polish</option>
                      <option value="Russian">Russian</option>
                    </select>
                  </div>

                  {/* Quick stats indicator */}
                  <div className="h-10 bg-zinc-50 border border-zinc-200 px-4 rounded-xl flex items-center justify-between w-full">
                    <span className="text-[9px] text-zinc-400 font-bold tracking-wider uppercase">MATCHES</span>
                    <span className="text-xs font-bold text-[#8B0000]">
                      {filteredLawyers.length} Lawyers Found
                    </span>
                  </div>

                </div>

              </div>

              {/* LAWYERS PROFILE CARD GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredLawyers.map((lawyer) => (
                  <div 
                    key={lawyer.id} 
                    className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col justify-between"
                  >
                    {/* Upper body */}
                    <div className="p-6 space-y-4">
                      
                      <div className="flex gap-4 items-start">
                        <img 
                          src={lawyer.avatar} 
                          alt={lawyer.name}
                          className="w-14 h-14 rounded-xl object-cover border border-zinc-100 shadow-sm mt-0.5" 
                        />
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] text-[#8B0000] font-black uppercase tracking-wider">
                              {lawyer.firm}
                            </span>
                            <div className="flex items-center gap-1 text-zinc-650">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span className="font-bold text-neutral-900 text-xs">{lawyer.rating}</span>
                              <span className="text-[10px] text-zinc-400">({lawyer.reviewsCount})</span>
                            </div>
                          </div>
                          
                          <h3 className="text-base font-extrabold text-neutral-900 tracking-tight">{lawyer.name}</h3>
                          <p className="text-[11px] text-zinc-400 font-medium">{lawyer.title}</p>
                        </div>
                      </div>

                      <p className="text-xs text-zinc-500 leading-relaxed font-normal line-clamp-3">
                        {lawyer.bio}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-1 text-[10px]">
                        <span className="bg-[#8B0000]/5 text-[#8B0000] border border-[#8B0000]/10 px-2.5 py-1 rounded-lg font-bold">
                          Specialty: {lawyer.specialty}
                        </span>
                        <span className="bg-neutral-50 border border-zinc-200 text-zinc-700 px-2.5 py-1 rounded-lg font-medium inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-zinc-400" /> {lawyer.location}
                        </span>
                      </div>

                    </div>

                    {/* Lower actions bar */}
                    <div className="bg-zinc-50/70 border-t border-zinc-150 px-6 py-3.5 flex items-center justify-between gap-4 text-xs font-sans">
                      <div className="space-y-0.5">
                        <span className="text-[8px] text-zinc-400 block font-bold uppercase tracking-wider">HOURLY RATE</span>
                        <span className="text-zinc-900 font-extrabold font-mono">€{lawyer.hourlyRate} <span className="text-[10px] text-zinc-400 font-normal">/ hour</span></span>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedLawyerId(lawyer.id);
                          window.scrollTo({ top: 0, behavior: 'instant' });
                        }}
                        className="px-4 py-2.5 bg-[#8B0000] hover:bg-red-700 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                      >
                        Book Counsel <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                ))}

                {filteredLawyers.length === 0 && (
                  <div className="col-span-2 text-center py-12 bg-white rounded-3xl border border-dashed border-zinc-200 text-zinc-500 space-y-3">
                    <AlertCircle className="w-10 h-10 text-neutral-300 mx-auto" />
                    <div>
                      <p className="text-xs font-bold">No registered vehicle attorneys match the specified filters.</p>
                      <p className="text-[10px] uppercase font-mono text-zinc-400 mt-1">Try resetting the specialty category options above.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* INTEGRATED PERSISTENT ACTIVE TRIAL DOSSIER WATCHER */}
              {activeCases.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-5 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-zinc-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#8B0000]/5 flex items-center justify-center shrink-0">
                        <FileText className="w-4.5 h-4.5 text-[#8B0000]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-neutral-900 tracking-tight">
                          {TRANSLATIONS[lang].caseDocTitle}
                        </h3>
                        <p className="text-[11px] text-zinc-500 leading-normal">Live view of your active cases and files.</p>
                      </div>
                    </div>
                    <span className="text-[10px] bg-zinc-100 text-zinc-700 font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider self-start sm:self-center">
                      {activeCases.length} Active {activeCases.length === 1 ? 'Case' : 'Cases'}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {activeCases.map((cs) => (
                      <div key={cs.id} className="bg-zinc-50 rounded-xl border border-zinc-200 p-5 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <span className="text-[9px] font-bold text-[#8B0000] uppercase tracking-wider">Case ID: {cs.id}</span>
                            <h4 className="font-extrabold text-neutral-900 text-sm">{cs.title}</h4>
                            <p className="text-[11px] text-zinc-500 font-normal">Assigned Lawyer: <strong className="text-zinc-800">{cs.lawyerName}</strong></p>
                          </div>
                          
                          {/* Case status badge */}
                          <div className="px-3 py-1 rounded-lg bg-[#8B0000] font-bold text-white tracking-wider text-[10px] uppercase self-start sm:self-center">
                            {cs.status}
                          </div>
                        </div>

                        {/* Evidence files list */}
                        {cs.documents.length > 0 ? (
                          <div className="space-y-2">
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Evidence Files:</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {cs.documents.map((doc, idx) => (
                                <div key={idx} className="bg-white p-2.5 rounded-xl border border-zinc-200 flex items-center justify-between text-[11px]">
                                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                                    <File className="w-4 h-4 text-zinc-400 shrink-0" />
                                    <div className="truncate">
                                      <span className="font-bold text-neutral-800 block truncate">{doc.name}</span>
                                      <span className="text-[9px] text-zinc-400 block">{doc.category}</span>
                                    </div>
                                  </div>
                                  <span className="text-[9px] text-emerald-600 font-bold shrink-0">VERIFIED</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="text-[10px] text-zinc-400 italic">No files uploaded yet. You can upload documents in the secure chat with your lawyer.</p>
                        )}

                        {/* Milestones timeline check */}
                        <div className="space-y-2.5 pt-1">
                          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Case Timeline:</span>
                          <div className="flex flex-col gap-2">
                            {cs.milestones.map((ms, idx) => (
                              <div key={idx} className="flex gap-2.5 items-center">
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                                  ms.completed ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-zinc-200 text-zinc-500'
                                } text-[9px]`}>
                                  {ms.completed ? '✓' : '●'}
                                </div>
                                <div className="flex-1 flex justify-between gap-4 text-[11px]">
                                  <span className={ms.completed ? 'text-zinc-400 line-through' : 'text-zinc-700 font-medium'}>{ms.text}</span>
                                  <span className="text-zinc-400 text-[10px]">{ms.date}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>

                </div>
              )}

            </motion.div>
          ) : (
            
            // ============================================
            // VIEW B: INDIVIDUAL PORTRAIT PROFILE VIEW
            // ============================================
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Back Button */}
              <button
                onClick={() => setSelectedLawyerId(null)}
                className="px-4 py-2 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 text-[10px] uppercase font-bold tracking-wider rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-zinc-500" /> Return to Directory
              </button>

              {/* LAWYER HERO DETAILS BLOCK */}
              {selectedLawyer && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: BIO CARD + SECURE EVIDENCE CHAT + PRIVATE REVIEWS (8 Columns) */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    {/* Portrait info */}
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
                      
                      <div className="flex flex-col sm:flex-row gap-5 items-start">
                        <img 
                          src={selectedLawyer.avatar} 
                          alt={selectedLawyer.name}
                          className="w-24 h-24 rounded-xl object-cover border border-zinc-200 shadow-sm shrink-0" 
                        />
                        <div className="space-y-2 flex-1 text-xs">
                          <span className="text-[10px] bg-red-50 text-[#8B0000] font-black tracking-wider uppercase px-2.5 py-1 rounded">
                            {selectedLawyer.firm}
                          </span>
                          
                          <h2 className="text-2xl font-black text-zinc-950 font-sans mt-0.5">{selectedLawyer.name}</h2>
                          <p className="text-xs text-neutral-400 font-medium">{selectedLawyer.title}</p>
                          
                          <div className="flex flex-wrap gap-2 pt-1 text-[10px]">
                            <span className="bg-neutral-50 px-2 py-1 rounded border border-zinc-200 text-zinc-650 inline-flex items-center gap-1 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-zinc-400" /> {selectedLawyer.location}
                            </span>
                            <span className="bg-neutral-50 px-2 py-1 rounded border border-zinc-200 text-zinc-650 inline-flex items-center gap-1 font-medium">
                              <Globe className="w-3.5 h-3.5 text-zinc-400" /> Languages: {selectedLawyer.languages.join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-zinc-150 pt-4 text-xs font-normal leading-relaxed text-zinc-600 block whitespace-normal">
                        <h4 className="font-extrabold text-zinc-900 uppercase tracking-wider text-[10.5px] mb-1">About Me & Legal Focus:</h4>
                        <p>{selectedLawyer.bio}</p>
                      </div>

                      {/* Bar admissions & Certifications */}
                      <div className="space-y-2 text-xs">
                        <h4 className="font-extrabold text-zinc-900 uppercase tracking-wider text-[10.5px]">{TRANSLATIONS[lang].certifications}:</h4>
                        <ul className="space-y-1">
                          {selectedLawyer.certifications.map((cert, index) => (
                            <li key={index} className="flex gap-2 items-center text-[11px] text-zinc-650">
                              <Landmark className="w-4 h-4 text-[#8B0000] shrink-0" />
                              <span>{cert}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>

                    {/* WIZARD TABS: SECURE EVIDENCE CHAT OR AI CONTRACT SCANNER */}
                    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden text-xs">
                      
                      {/* Sub-tab selection */}
                      <div className="bg-zinc-50/70 p-2 border-b border-zinc-150 flex gap-2">
                        <div className="flex-1 py-2 bg-white text-[#8B0000] font-black rounded-lg border border-zinc-200 shadow-xs inline-flex items-center justify-center gap-1.5 uppercase tracking-wider text-[10px]">
                          <Sparkles className="w-4 h-4 text-amber-500" /> {TRANSLATIONS[lang].aiAssistant}
                        </div>
                      </div>

                      <div className="p-6 space-y-6">
                        
                        {/* THE AI LEGAL ASSISTANT UTILITY PANEL */}
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <h4 className="font-black text-zinc-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
                              <Scale className="w-4 h-4 text-[#8B0000]" /> Contract & Document Auditor
                            </h4>
                            <p className="text-zinc-500 font-normal leading-normal text-[11px]">
                              Paste any car sales contract, leasing agreement, or transaction receipt below to scan for liability risks, mileage rules, and legal issues.
                            </p>
                          </div>

                          {/* Options radio filters */}
                          <div className="grid grid-cols-3 gap-2 text-[10px] font-bold uppercase tracking-wider">
                            <button
                              type="button"
                              onClick={() => { setAiAnalysisType('summary'); setAiResult(null); }}
                              className={`p-2 rounded-lg text-center border transition-colors ${
                                aiAnalysisType === 'summary' 
                                  ? 'bg-[#8B0000] text-white border-[#8B0000]' 
                                  : 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100'
                              }`}
                            >
                              General Overview
                            </button>
                            <button
                              type="button"
                              onClick={() => { setAiAnalysisType('clausal_risk'); setAiResult(null); }}
                              className={`p-2 rounded-lg text-center border transition-colors ${
                                aiAnalysisType === 'clausal_risk' 
                                  ? 'bg-[#8B0000] text-white border-[#8B0000]' 
                                  : 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100'
                              }`}
                            >
                              Liability Risks
                            </button>
                            <button
                              type="button"
                              onClick={() => { setAiAnalysisType('evidence_organization'); setAiResult(null); }}
                              className={`p-2 rounded-lg text-center border transition-colors ${
                                aiAnalysisType === 'evidence_organization' 
                                  ? 'bg-[#8B0000] text-white border-[#8B0000]' 
                                  : 'bg-zinc-50 text-zinc-500 border-zinc-200 hover:bg-zinc-100'
                              }`}
                            >
                              Evidence Map
                            </button>
                          </div>

                          <div className="space-y-3">
                            <textarea
                              rows={5}
                              value={contractTextInput}
                              onChange={(e) => setContractTextInput(e.target.value)}
                              placeholder={`Paste legal contract rows here: e.g. "Section 12: General warranties. The electric powertrain block, battery high-voltage structure, and custom calibration parameters are sold strictly AS-IS without state warranty representation. Any litigation must occur in Riga arbitration council panel..."`}
                              className="w-full bg-zinc-50 border border-zinc-200 p-4 rounded-2xl outline-none font-mono text-[11px] placeholder:text-zinc-400 focus:bg-white focus:border-red-650"
                            />
                            <div className="flex gap-2 justify-between">
                              <span className="text-[9px] text-zinc-400 font-mono mt-1 leading-normal max-w-sm">
                                *AI legal scans represent a high-fidelity natural language analysis of statutory laws — it is not synthetic substitute for dedicated bar representation.
                              </span>
                              <button
                                type="button"
                                onClick={runAiContractAnalysis}
                                disabled={aiIsAnalyzing}
                                className="px-5 py-3 bg-[#8B0000] hover:bg-red-700 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-colors shadow-sm flex items-center gap-1.5 shrink-0 self-start disabled:opacity-50 cursor-pointer"
                              >
                                {aiIsAnalyzing ? (
                                  <>
                                    <RefreshCw className="w-4 h-4 animate-spin text-white" /> Scanning Document...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-4 h-4 text-amber-300" /> Start Audit Scan
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* AI analysis result layout */}
                          {aiResult && (
                            <div className="bg-[#FAF9F6] border border-zinc-200 p-5 rounded-xl space-y-4 animate-in fade-in duration-300">
                              <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
                                <span className="text-[10px] bg-red-50 text-[#8B0000] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md flex items-center gap-1">
                                  ✓ Document Audit Report
                                </span>
                              </div>

                              <div className="space-y-1">
                                <strong className="text-zinc-800 uppercase text-[9.5px] font-bold block tracking-wider">Summary:</strong>
                                <p className="text-zinc-600 leading-relaxed font-normal p-3 bg-white border border-zinc-200 rounded-lg">{aiResult.summary}</p>
                              </div>

                              <div className="space-y-1">
                                <strong className="text-[#8B0000] uppercase text-[9.5px] font-bold block tracking-wider">🚨 Critical Risks:</strong>
                                <div className="space-y-1.5 pt-1">
                                  {aiResult.criticalFlags.map((flg, idx) => (
                                    <div key={idx} className="p-3 bg-red-50 text-red-950 font-medium font-sans rounded-lg border border-red-100">
                                      {flg}
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                <div className="space-y-1">
                                  <strong className="text-zinc-800 uppercase text-[9.5px] font-bold block">Your Obligations:</strong>
                                  <ul className="space-y-1 bg-white p-3 rounded-lg border border-zinc-200">
                                    {aiResult.obligations.map((ob, idx) => (
                                      <li key={idx} className="list-disc list-inside text-zinc-600 leading-normal">{ob}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="space-y-1">
                                  <strong className="text-zinc-800 uppercase text-[9.5px] font-bold block">Legal Precedents:</strong>
                                  <ul className="space-y-1 bg-white p-3 rounded-lg border border-zinc-200">
                                    {aiResult.courtPrecedents.map((pr, idx) => (
                                      <li key={idx} className="list-disc list-inside text-zinc-600 leading-normal">{pr}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              {/* Integrate Action Button to sync directly with active cases */}
                              <div className="pt-2 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const analysisCase: CaseDossier = {
                                      id: `case-ai-${Date.now().toString().slice(-3)}`,
                                      title: `AI Contract Analysis Audit Log`,
                                      lawyerName: selectedLawyer.name,
                                      status: 'Analysis',
                                      specialty: 'Contracts',
                                      creationDate: '2026-06-17',
                                      activeFlag: true,
                                      documents: [
                                        { name: 'AI_Generated_Sovereign_Contract_Report.pdf', date: '2026-06-17', category: 'AI Generated Report', hashHash: '0x992a...0b2a' }
                                      ],
                                      milestones: [
                                        { date: '2026-06-17', text: 'AI clausal scan report generated successfully', completed: true },
                                        { date: '2026-06-17', text: 'Counsel flagged to inspect Section 12 anomalies', completed: false }
                                      ]
                                    };
                                    setActiveCases(prev => [analysisCase, ...prev]);
                                    alert("Analysis report saved to your active cases successfully.");
                                  }}
                                  className="px-4 py-2 bg-[#8B0000] hover:bg-black text-white text-[10.5px] font-bold uppercase rounded-lg transition-colors shadow-xs"
                                >
                                  Save Analysis to My Cases
                                </button>
                              </div>
                            </div>
                          )}

                        </div>

                      </div>
                    </div>

                    {/* SECURE CHAT + DOCUMENT/EVIDENCE SHARING SECTION */}
                    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden text-xs">
                      
                      <div className="bg-[#8B0000] text-white p-4 flex items-center justify-between border-b border-zinc-150">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4.5 h-4.5 text-white" />
                          <div>
                            <span className="font-extrabold text-[12.5px] leading-none block">Secure Chat with Lawyer</span>
                          </div>
                        </div>
                      </div>

                      {/* Chat screen timeline */}
                      <div className="p-5 bg-zinc-50/50 h-[320px] overflow-y-auto space-y-4">
                        
                        {chatMessages.map((msg, index) => (
                          <div 
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : (msg.sender === 'system' ? 'justify-center' : 'justify-start')}`}
                          >
                            {msg.sender === 'system' ? (
                              <div className="bg-amber-50 border border-amber-200 text-amber-900 text-[10px] py-1.5 px-4 rounded-lg text-center max-w-lg">
                                {msg.text}
                              </div>
                            ) : (
                              <div className={`max-w-md p-4 rounded-xl text-[11.5px] leading-relaxed shadow-sm space-y-1.5 ${
                                msg.sender === 'user' 
                                  ? 'bg-[#8B0000] text-white rounded-tr-none' 
                                  : 'bg-white border border-zinc-200 rounded-tl-none text-zinc-850'
                              }`}>
                                <div className="flex justify-between items-center gap-4 text-[9px] opacity-70">
                                  <span className="font-bold uppercase tracking-wider">{msg.sender === 'user' ? 'You' : selectedLawyer.name}</span>
                                  <span>{msg.timestamp}</span>
                                </div>
                                <p className="font-normal font-sans leading-normal whitespace-pre-wrap">{msg.text}</p>
                                
                                {msg.files && (
                                  <div className="pt-2 border-t border-white/10 flex flex-wrap gap-1.5">
                                    {msg.files.map((file, idx) => (
                                      <span key={idx} className="bg-white/10 border border-white/20 text-white rounded px-2 py-0.5 text-[9px] inline-flex items-center gap-1 font-medium">
                                        <File className="w-3 h-3 text-emerald-300" /> {file}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}

                      </div>

                      {/* Chat uploads & Input bar */}
                      <div className="p-4 bg-white border-t border-zinc-150 space-y-3">
                        
                        {/* Attached pending files display */}
                        {chatAttachedFiles.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-0.5">
                            {chatAttachedFiles.map((file, idx) => (
                              <span key={idx} className="bg-red-50 text-[#8B0000] border border-[#8B0000]/15 px-2.5 py-1 rounded-full font-bold text-[9px] flex items-center gap-1">
                                <File className="w-3 h-3 text-[#8B0000]" /> {file}
                                <button type="button" onClick={() => setChatAttachedFiles(prev => prev.filter(f => f !== file))} className="text-zinc-400 hover:text-red-700 font-sans ml-1 text-xs">×</button>
                              </span>
                            ))}
                          </div>
                        )}

                        <form onSubmit={handleSendChatMessage} className="flex gap-3">
                          {/* Simulated Easy Upload options */}
                          <div className="flex gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => triggerChatFileUpload('Purchase_Agreement_Lithuanian.pdf')}
                              className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-750 rounded-xl transition-colors text-[10px] uppercase border border-zinc-200 font-bold cursor-pointer"
                              title="Attach Sales Agreement"
                            >
                              + Contract
                            </button>
                            <button
                              type="button"
                              onClick={() => triggerChatFileUpload('Diagnostic_ECU_Dump.json')}
                              className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-750 rounded-xl transition-colors text-[10px] uppercase border border-zinc-200 font-bold cursor-pointer"
                              title="Attach Diagnostic Log"
                            >
                              + Logs
                            </button>
                          </div>

                          <input
                            type="text"
                            value={newMessageText}
                            onChange={(e) => setNewMessageText(e.target.value)}
                            placeholder="Type your message here..."
                            className="flex-1 bg-zinc-50 p-3 rounded-xl border border-zinc-200 outline-none placeholder:text-zinc-400 focus:bg-white text-zinc-850 focus:border-[#8B0000] font-sans text-xs transition-colors"
                          />

                          <button
                            type="submit"
                            className="px-4 py-3 bg-[#8B0000] hover:bg-red-700 text-white font-extrabold text-[11px] uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-1 shrink-0 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </form>

                      </div>

                    </div>

                    {/* CONFIDENTIAL QUALITY PRIVATE FEEDBACK REPORT */}
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4 text-xs">
                      <div className="flex flex-col gap-1 pb-2 border-b border-zinc-150">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                            <Star className="w-4.5 h-4.5 text-[#8B0000] fill-[#8B0000]" />
                          </div>
                          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                            {TRANSLATIONS[lang].privateFeedback}
                          </h3>
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-normal">
                          Your review helps us keep high-quality legal support for everyone.
                        </p>
                      </div>

                      {feedbackSucess ? (
                        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-150 flex items-center gap-2 font-medium">
                          <CheckCircle className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                          <span>Review submitted successfully. Thank you for your feedback!</span>
                        </div>
                      ) : (
                        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                          
                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Rating:</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setUserRating(star)}
                                  className="focus:outline-none cursor-pointer"
                                >
                                  <Star className={`w-5 h-5 ${star <= userRating ? 'text-amber-500 fill-amber-500' : 'text-zinc-200'}`} />
                                </button>
                              ))}
                            </div>
                            <span className="text-[11px] text-zinc-700 font-bold">{userRating} / 5 stars</span>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Your Review Details</label>
                            <textarea
                              rows={3}
                              value={feedbackText}
                              onChange={(e) => setFeedbackText(e.target.value)}
                              placeholder="Describe your experience with this lawyer..."
                              className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl outline-none font-medium placeholder:text-zinc-400 text-zinc-800 focus:bg-white focus:border-[#8B0000] transition-colors"
                            />
                          </div>

                          <button
                            type="submit"
                            className="px-4 py-2.5 bg-zinc-950 hover:bg-neutral-900 text-white font-bold text-[11px] uppercase tracking-wider rounded-xl transition-colors shadow-xs cursor-pointer"
                          >
                            Submit Review
                          </button>

                        </form>
                      )}

                    </div>

                  </div>

                  {/* Right Column: APARTMENT SCHEDULER WIDGET & BAR SPECIALTY INSIGHTS (4 Columns) */}
                  <div className="lg:col-span-4 space-y-6">

                    {/* BOOKING CALENDAR WIDGET */}
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-5 text-xs">
                      
                      <div className="flex items-center gap-2 pb-2.5 border-b border-zinc-150">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                          <Calendar className="w-4.5 h-4.5 text-[#8B0000]" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                            Book a Consultation
                          </h3>
                          <p className="text-[10px] text-zinc-500 font-normal">Schedule a meeting with this lawyer.</p>
                        </div>
                      </div>

                      {bookingSuccess ? (
                        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-150 flex flex-col gap-2 font-medium">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                            <strong className="text-emerald-950 block">Booking Confirmed!</strong>
                          </div>
                          <p className="text-[11px] leading-relaxed text-emerald-800 font-normal">
                            Your meeting is scheduled for {bookingDate} at {bookingTime}. It has been saved to your cases.
                          </p>
                        </div>
                      ) : (
                        <form onSubmit={handleInitiateBooking} className="space-y-4">
                          
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Select Date</label>
                            <input
                              type="date"
                              required
                              value={bookingDate}
                              onChange={(e) => setBookingDate(e.target.value)}
                              className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-lg font-bold outline-none text-zinc-800"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Select Time</label>
                            <select
                              value={bookingTime}
                              onChange={(e) => setBookingTime(e.target.value)}
                              className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-lg font-bold text-zinc-700 outline-none"
                            >
                              <option value="09:00">09:00 CET</option>
                              <option value="10:00">10:00 CET</option>
                              <option value="11:30">11:30 CET</option>
                              <option value="13:00">13:00 CET</option>
                              <option value="14:30">14:30 CET</option>
                              <option value="16:00">16:00 CET</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Consultation Type</label>
                            <select
                              value={bookingType}
                              onChange={(e) => setBookingType(e.target.value)}
                              className="w-full bg-zinc-50 border border-zinc-200 p-2.5 rounded-lg font-bold text-zinc-700 outline-none"
                            >
                              <option value="Video consultation (Encrypted)">Video Consultation</option>
                              <option value="In-Person Document Review">In-Person Document Review</option>
                              <option value="Secure Messaging Fast-Track">Message Consultation Only</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest block">Describe Your Case</label>
                            <textarea
                              rows={2.5}
                              value={bookingNotes}
                              onChange={(e) => setBookingNotes(e.target.value)}
                              placeholder="e.g. Need assistance reviewing a car sales contract from Germany..."
                              className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-lg outline-none font-medium text-zinc-800 placeholder:text-zinc-400 focus:bg-white focus:border-[#8B0000] transition-colors"
                            />
                          </div>

                          <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-150 space-y-1">
                            <span className="text-[9px] text-zinc-400 block font-bold uppercase">Estimated Cost:</span>
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-neutral-800">30 Min Consultation</span>
                              <span className="font-bold text-[#8B0000]">€{(selectedLawyer.hourlyRate / 2).toFixed(0)} EUR</span>
                            </div>
                          </div>

                          <button
                            type="submit"
                            className="w-full py-3 bg-[#8B0000] hover:bg-red-700 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                          >
                            Book Consultation
                          </button>

                        </form>
                      )}

                    </div>

                    {/* RECENT PROFESSIONAL TREATISES SECTION */}
                    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4 text-xs">
                      
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center">
                          <BookOpen className="w-4.5 h-4.5 text-zinc-650" />
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                            {TRANSLATIONS[lang].articles}
                          </h3>
                          <p className="text-[10px] text-zinc-500 font-normal">Legal guides and news articles published by this lawyer.</p>
                        </div>
                      </div>

                      <div className="space-y-4 pt-1.5">
                        {selectedLawyer.articles.map((art) => (
                          <div key={art.id} className="p-4 bg-red-50/20 border border-zinc-150 rounded-xl space-y-2">
                            <div className="flex items-center justify-between text-[9px] text-zinc-400">
                              <span className="font-bold">{art.journal}</span>
                              <span className="shrink-0">{art.date}</span>
                            </div>
                            <h4 className="font-bold text-neutral-900 text-[11.5px] leading-relaxed">{art.title}</h4>
                            <p className="text-[10.5px] text-zinc-500 font-normal leading-relaxed">{art.summary}</p>
                          </div>
                        ))}
                      </div>

                    </div>

                  </div>

                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

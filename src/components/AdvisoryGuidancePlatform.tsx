import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, Search, Filter, DollarSign, Globe, Percent, Calculator, 
  ShieldAlert, CheckCircle2, HelpCircle, Activity, FileText, ChevronDown, 
  ChevronUp, RefreshCw, AlertTriangle, Car, Sliders, Eye, Scale, ListTodo, ArrowRight,
  Sparkles, Check, Info, ArrowLeft, ArrowUpDown
} from 'lucide-react';

// Language support for multi-region accessibility (EN / LT / DE / PL)
type AdvisoryLanguage = 'en' | 'lt' | 'de' | 'pl';

interface TranslationSet {
  hubTitle: string;
  hubSubtitle: string;
  searchPlaceholder: string;
  filterTopic: string;
  filterCountry: string;
  adviceTab: string;
  modelTab: string;
  taxTab: string;
  leasingTab: string;
  riskTab: string;
  calcTitle: string;
}

const LANGUAGES: Record<AdvisoryLanguage, TranslationSet> = {
  en: {
    hubTitle: "Car Advice & Guide Center",
    hubSubtitle: "Your easy guide to check car history, find common model issues, calculate car tax, and plan your leasing costs.",
    searchPlaceholder: "Search guides, car models, taxes, or tips...",
    filterTopic: "All Topics",
    filterCountry: "All Countries",
    adviceTab: "Advice Library",
    modelTab: "Brand & Reliability DB",
    taxTab: "Tax & Registration",
    leasingTab: "Leasing Info Hub",
    riskTab: "Pre-Purchase Risk Assessor",
    calcTitle: "Interactive Leasing Calculator"
  },
  lt: {
    hubTitle: "Automobilių patarimų ir gairių centras",
    hubSubtitle: "Paprastas gidas, padedantis patikrinti automobilio istoriją, rasti gedimus, apskaičiuoti mokesčius ir lizingą.",
    searchPlaceholder: "Ieškoti vadovų, modelių, mokesčių ar patarimų...",
    filterTopic: "Visos temos",
    filterCountry: "Visos šalys",
    adviceTab: "Patarimų biblioteka",
    modelTab: "Modelių patikimumas",
    taxTab: "Mokesčiai ir registracija",
    leasingTab: "Lizingo gidai",
    riskTab: "Rizikos skaičiuoklė",
    calcTitle: "Interaktyvi lizingo skaičiuoklė"
  },
  de: {
    hubTitle: "Auto-Beratungs- & Infocenter",
    hubSubtitle: "Ihr einfacher Leitfaden zur Überprüfung der Fahrzeughistorie, zu Modellmängeln, Steuern und Leasingkosten.",
    searchPlaceholder: "Suche nach Ratgebern, Modellen, Steuern oder Tipps...",
    filterTopic: "Alle Themen",
    filterCountry: "Alle Länder",
    adviceTab: "Ratgeber-Bibliothek",
    modelTab: "Modell-Datenbank",
    taxTab: "Steuer & Zulassung",
    leasingTab: "Leasing-Infozentrum",
    riskTab: "Kauf-Risikoanalyse",
    calcTitle: "Interaktiver Leasingrechner"
  },
  pl: {
    hubTitle: "Centrum porad i informacji o autach",
    hubSubtitle: "Twój prosty poradnik weryfikacji historii aut, typowych usterek, podatków i kosztów leasingowych.",
    searchPlaceholder: "Szukaj poradników, modeli samochodów, podatków lub wskazówek...",
    filterTopic: "Wszystkie tematy",
    filterCountry: "Wszystkie kraje",
    adviceTab: "Biblioteka porad",
    modelTab: "Niezawodność marek",
    taxTab: "Podatki i rejestracja",
    leasingTab: "Strefa lizingu",
    riskTab: "Ocena ryzyka zakupu",
    calcTitle: "Interaktywny kalkulator leasingowy"
  }
};

// 1. General Advice Library data structure
interface AdviceArticle {
  id: string;
  category: 'buying' | 'scam' | 'checklist' | 'transfer' | 'finance';
  title: string;
  readingTime: string;
  summary: string;
  content: string[];
  checklist?: string[];
  alert?: string;
}

const ADVICE_ARTICLES: AdviceArticle[] = [
  {
    id: 'art-buying-1',
    category: 'buying',
    title: 'Smart Buying: Essential Checks for Used Vehicles',
    readingTime: '5 min read',
    summary: 'A simple guide to help you check a used car and avoid buying a damaged or bad vehicle.',
    content: [
      'Buying a used car in Europe is easy if you do a few simple checks on the car and its history.',
      'Always ask the seller to show you the original car registration papers before you pay any money.',
      'Make sure the car\'s serial number (VIN) matches the papers exactly. You can find this number under the passenger carpet, on the front window, and on the papers.'
    ],
    checklist: [
      'Check that the car\'s serial number (VIN) is clean and looks original',
      'Check the body panels to see if they were ever replaced or painted',
      'Check the tires to see if they are wearing down evenly',
      'Start the engine when cold to hear if it sounds healthy'
    ],
    alert: 'Watch out for newly painted parts in the engine bay. Sellers sometimes use fresh paint to hide oil leaks or rust.'
  },
  {
    id: 'art-scam-1',
    category: 'scam',
    title: 'How to Spot Mileage Fraud & Fake Serial Numbers',
    readingTime: '8 min read',
    summary: 'Many used cars in Europe have their mileage rolled back to look newer. Learn how to protect yourself.',
    content: [
      'Mileage fraud (changing the odometer to show fewer kilometers) is a crime. Sellers do this to make the car look less used.',
      'Bad sellers can easily change the numbers on the dashboard screen by using computer tools.',
      'But you can find the real history by using standard diagnostic scanners or checking the official state records.'
    ],
    checklist: [
      'Check the wear on the steering wheel, pedals, and seats to see if it matches the mileage',
      'Look up the car\'s registration history on free state websites',
      'Check for timing belt stickers under the hood to see when they were last changed',
      'Ask a mechanic to scan the car\'s computer modules for the real mileage history'
    ],
    alert: 'If the seller says the paperwork is missing or being updated, do not buy the car. This is usually a sign of a hidden accident.'
  },
  {
    id: 'art-checklist-1',
    category: 'checklist',
    title: 'What to Check When You Pick Up the Car',
    readingTime: '6 min read',
    summary: 'A simple list of things to inspect when you meet the seller to pick up your car.',
    content: [
      'When you go to pick up the car, always meet the seller in bright daylight. Do not inspect a car in the dark or in the rain.',
      'Take your time to look at every part of the car carefully before you sign any paperwork or pay the final amount.'
    ],
    checklist: [
      'Use a cheap paint meter to see if the car was repainted after an accident',
      'Check that all the windows have the same year code stamped on them',
      'For hybrid or electric cars, make sure all charging cables are included',
      'Open the coolant tank to check for oil traces, which means a broken engine',
      'Test the heater, air conditioner, and radio to make sure everything works'
    ],
    alert: 'Do not ignore any warning lights on the dashboard, even if the seller says it is just a cheap sensor issue.'
  },
  {
    id: 'art-transfer-1',
    category: 'transfer',
    title: 'Buying and Registering a Car from Another Country',
    readingTime: '7 min read',
    summary: 'How to buy a car from Germany, Poland, or other countries and bring it home legally.',
    content: [
      'To register an imported car, you need the official purchase contract, the registration book, and temporary license plates.',
      'Check if you need to pay import taxes (VAT) in your home country depending on the car\'s age and mileage.'
    ],
    checklist: [
      'Get both parts of the original registration papers from the seller',
      'Ask for the Certificate of Conformity (CoC) to prove the car is legal in Europe',
      'Make sure the purchase contract clearly states the total price and tax details',
      'Get temporary plates and insurance so you can drive the car home legally'
    ],
    alert: 'Never buy an imported car if the seller does not give you the original registration papers. You will not be able to register it at home.'
  },
  {
    id: 'art-finance-1',
    category: 'finance',
    title: 'Easy Guide to Car Loans and Leasing',
    readingTime: '5 min read',
    summary: 'Learn how car loans work, and find out how to avoid paying too much interest.',
    content: [
      'Getting a loan or lease is a great way to buy a car, but some contracts have hidden fees.',
      'Know the difference between leasing (where you return the car) and a loan (where you keep the car).'
    ],
    checklist: [
      'Ask if you can use any repair shop, or if the bank forces you to use expensive dealers',
      'Check the final payment amount (balloon payment) due at the end of the loan',
      'Check if you need special insurance to cover the loan if the car gets totaled'
    ],
    alert: 'Always read the small print. Some contracts charge extra fees if you want to pay off the loan early.'
  }
];

// 2. Vehicle Brand & Model Database structure
interface VehicleModelStat {
  id: string;
  brand: string;
  model: string;
  generation: string;
  years: string;
  reliabilityScore: number; // Out of 5
  maintenanceCost: string;  // e.g. "€450–€750 / year"
  commonIssues: string[];
  inspectionAdvice: string;
  buyerRating: 'Excellent' | 'Good' | 'Average' | 'Risk Warning';
}

const VEHICLE_MODELS_DB: VehicleModelStat[] = [
  {
    id: 'm-1',
    brand: 'BMW',
    model: '3-Series',
    generation: 'G20',
    years: '2019–2025',
    reliabilityScore: 4.2,
    maintenanceCost: '€650–€950 / year',
    commonIssues: [
      'Plastic coolant tank can crack and leak fluid over time',
      'Steering rack may make clicking noises during slow turns',
      'Safety camera behind the mirror can overheat and turn off'
    ],
    inspectionAdvice: 'Ask a mechanic to scan the computer logs for any hidden battery drain issues.',
    buyerRating: 'Good'
  },
  {
    id: 'm-2',
    brand: 'Volkswagen',
    model: 'Golf',
    generation: 'MK8',
    years: '2020–2026',
    reliabilityScore: 3.8,
    maintenanceCost: '€350–€550 / year',
    commonIssues: [
      'Screen and radio software can freeze or turn black',
      'DSG automatic gearbox might make rattling noises in low gears',
      'Touch buttons on the steering wheel can activate by themselves'
    ],
    inspectionAdvice: 'Check if the software has been updated to the latest version by a dealer.',
    buyerRating: 'Average'
  },
  {
    id: 'm-3',
    brand: 'Toyota',
    model: 'RAV4 Hybrid',
    generation: 'XA50',
    years: '2019–2026',
    reliabilityScore: 4.8,
    maintenanceCost: '€250–€400 / year',
    commonIssues: [
      'Hybrid battery cable under the car can rust from winter salt',
      'Electric trunk motor can wear out and become noisy',
      'Wind noise can leak through the front door seals at high speed'
    ],
    inspectionAdvice: 'Ask a mechanic to inspect the orange high-voltage cable under the car for rust.',
    buyerRating: 'Excellent'
  },
  {
    id: 'm-4',
    brand: 'Tesla',
    model: 'Model 3',
    generation: 'Pre-Refresh & Highland',
    years: '2018–2026',
    reliabilityScore: 4.0,
    maintenanceCost: '€200–€350 / year',
    commonIssues: [
      'Front suspension arms can squeak when driving over bumps',
      'Paint can chip easily near the rear wheels',
      'Moisture can build up inside the headlights and trunk'
    ],
    inspectionAdvice: 'Open the car\'s screen settings, go to Service Mode, and check the battery health. It should be above 88%.',
    buyerRating: 'Good'
  },
  {
    id: 'm-5',
    brand: 'Audi',
    model: 'A4',
    generation: 'B9 (8W)',
    years: '2016–2024',
    reliabilityScore: 4.1,
    maintenanceCost: '€600–€900 / year',
    commonIssues: [
      'Water pump can leak coolant and cause the engine to overheat',
      'AdBlue heater can fail on diesel models, preventing the car from starting',
      'Digital dashboard screen can sometimes freeze'
    ],
    inspectionAdvice: 'Look under the hood for pink fluid stains around the water pump, which means a leak.',
    buyerRating: 'Good'
  },
  {
    id: 'm-6',
    brand: 'Mercedes-Benz',
    model: 'E-Class',
    generation: 'W213',
    years: '2016–2023',
    reliabilityScore: 4.3,
    maintenanceCost: '€800–€1200 / year',
    commonIssues: [
      'Air suspension pumps or bags can leak, causing the rear of the car to sag',
      'Exhaust filter (DPF) sensors can fail on high-mileage diesel cars',
      'Seat leather can split or crack on the side bolsters over time'
    ],
    inspectionAdvice: 'Let the car sit overnight and check if any corner has sagged before starting it.',
    buyerRating: 'Good'
  }
];

// 3. Country Tax Data
interface CountryTaxGuide {
  countryCode: string;
  countryName: string;
  pollutionTaxFormula: string;
  registrationFees: string;
  importDutyStatus: string;
  inspectionRequirements: string;
  usefulTip: string;
}

const COUNTRY_TAX_GUIDES: CountryTaxGuide[] = [
  {
    countryCode: 'LT',
    countryName: 'Lithuania (Lietuva)',
    pollutionTaxFormula: 'Tax depends on CO2 emissions starting from 115g/km. You pay this when you register the car.',
    registrationFees: 'Getting your license plates and simple car inspection costs between €15 and €40.',
    importDutyStatus: 'No customs tax when buying from another EU country. If importing from non-EU countries like the UK, you pay standard import tax.',
    inspectionRequirements: 'You must pass a safety and emission test every 2 years.',
    usefulTip: 'A valid Owner Declaration Code (SDK) is legally required to complete the sale. Make sure the seller provides it.'
  },
  {
    countryCode: 'DE',
    countryName: 'Germany (Deutschland)',
    pollutionTaxFormula: 'Annual car tax based on engine size and CO2 emissions.',
    registrationFees: 'Registration fee is around €35 to €50. Export plates with temporary insurance cost about €120.',
    importDutyStatus: 'Free trade within the EU. Importing from outside the EU has a 10% customs fee plus 19% import tax.',
    inspectionRequirements: 'TÜV inspection is required every 2 years to check for rust and safety.',
    usefulTip: 'Cars with rust underneath will fail the TÜV inspection instantly. Always check the chassis before buying.'
  },
  {
    countryCode: 'PL',
    countryName: 'Poland (Polska)',
    pollutionTaxFormula: 'Excise tax based on car value: 3.1% for engines up to 2.0L, and 18.6% for larger engines. Hybrids get a 50% discount.',
    registrationFees: 'License plates and registration books cost about €38.',
    importDutyStatus: 'Free within the EU. Non-EU imports pay 10% customs plus 23% VAT.',
    inspectionRequirements: 'Safety inspection is required every year.',
    usefulTip: 'The tax jumps a lot for engines larger than 2.0L. Make sure to double-check the exact engine size.'
  },
  {
    countryCode: 'LV',
    countryName: 'Latvia (Latvija)',
    pollutionTaxFormula: 'Registration tax is €55. Annual road tax depends on the weight and engine size of the car.',
    registrationFees: 'New license plates and registration certificate cost about €44.',
    importDutyStatus: 'Free within the EU. Non-EU imports pay standard tax.',
    inspectionRequirements: 'CSDD safety inspection is required every year.',
    usefulTip: 'You must have the official deregistration paper from the previous country before registering here.'
  }
];

export default function AdvisoryGuidancePlatform() {
  const [lang, setLang] = useState<AdvisoryLanguage>('en');
  const t = LANGUAGES[lang];

  // Search and Filters
  const [activeTab, setActiveTab] = useState<'advice' | 'models' | 'tax' | 'leasing' | 'risk'>('advice');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<'All' | 'buying' | 'scam' | 'checklist' | 'transfer' | 'finance'>('All');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('All');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');

  // Expanded article states
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(null);

  // Leasing Calculator state
  const [vehiclePrice, setVehiclePrice] = useState<number>(35000);
  const [downpaymentPercent, setDownpaymentPercent] = useState<number>(15);
  const [leaseTermMonths, setLeaseTermMonths] = useState<number>(48);
  const [interestRatePercent, setInterestRatePercent] = useState<number>(4.9);
  const [residualValuePercent, setResidualValuePercent] = useState<number>(30);

  // Risk Evaluator checklist state
  const [checklistAnswers, setChecklistAnswers] = useState<Record<string, boolean>>({
    vinMatches: false,
    paintThicknessTested: false,
    serviceHistoryVerified: false,
    diagnosticScanDone: false,
    scamToldNoEscrow: false,
    testDriveCompleted: false,
    sellerIdentityRegistered: false,
    exportDeregistered: false
  });

  // Calculate leasing outputs
  const leasingOutputs = useMemo(() => {
    const downpaymentAmount = vehiclePrice * (downpaymentPercent / 100);
    const principalToAmortize = vehiclePrice - downpaymentAmount;
    const residualAmount = vehiclePrice * (residualValuePercent / 100);

    // Using simplified standard auto-leasing math integrating residual balloon value
    const monthlyInterestRate = (interestRatePercent / 100) / 12;
    
    // If interest is zero or interest calculation is simple
    if (monthlyInterestRate <= 0) {
      const monthlyPayment = (principalToAmortize - residualAmount) / leaseTermMonths;
      return {
        downpaymentAmount,
        residualAmount,
        monthlyPayment: Math.max(0, monthlyPayment),
        totalInterest: 0,
        totalCost: vehiclePrice
      };
    }

    // Amortization math
    const num = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, leaseTermMonths);
    const den = Math.pow(1 + monthlyInterestRate, leaseTermMonths) - 1;
    
    // Formula incorporating balloon payment
    const rawPaymentPart1 = principalToAmortize * (num / den);
    const rawPaymentPart2 = (residualAmount * monthlyInterestRate) / den;
    const monthlyPayment = rawPaymentPart1 - rawPaymentPart2;

    const totalPaidOverTerm = (monthlyPayment * leaseTermMonths) + downpaymentAmount + residualAmount;
    const totalInterestPayable = totalPaidOverTerm - vehiclePrice;

    return {
      downpaymentAmount,
      residualAmount,
      monthlyPayment: Math.max(0, monthlyPayment),
      totalInterest: Math.max(0, totalInterestPayable),
      totalCost: Math.max(vehiclePrice, totalPaidOverTerm)
    };
  }, [vehiclePrice, downpaymentPercent, leaseTermMonths, interestRatePercent, residualValuePercent]);

  // Risk evaluation score calculator
  const computedRiskScore = useMemo(() => {
    let score = 100;
    
    // Positive factors
    if (!checklistAnswers.vinMatches) score -= 25;
    if (!checklistAnswers.paintThicknessTested) score -= 15;
    if (!checklistAnswers.serviceHistoryVerified) score -= 20;
    if (!checklistAnswers.diagnosticScanDone) score -= 15;
    if (!checklistAnswers.scamToldNoEscrow) score -= 15;
    if (!checklistAnswers.testDriveCompleted) score -= 10;
    
    // Score limits
    return Math.max(0, score);
  }, [checklistAnswers]);

  const getRiskStatus = (score: number) => {
    if (score >= 85) return { label: 'Extremely Safe', color: 'text-emerald-605 bg-emerald-500/10 border-emerald-500/25', icon: CheckCircle2, desc: 'All primary audit benchmarks verified. Risk level is minimal.' };
    if (score >= 60) return { label: 'Moderate Risk', color: 'text-amber-700 bg-amber-500/10 border-amber-500/25', icon: Info, desc: 'Some secondary inspection gaps detected. We recommend pursuing direct paint scans.' };
    return { label: 'High Alert: Risk Heavy', color: 'text-rose-600 bg-rose-500/10 border-rose-500/25', icon: AlertTriangle, desc: 'Critical verification gaps exist! Do not wire any deposits until checking VIN histories.' };
  };

  const riskStatus = getRiskStatus(computedRiskScore);

  // Filter logic for Advice
  const filteredArticles = useMemo(() => {
    return ADVICE_ARTICLES.filter(art => {
      const queryMatch = searchQuery === '' || 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.content.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const topicMatch = selectedTopic === 'All' || art.category === selectedTopic;
      
      return queryMatch && topicMatch;
    });
  }, [searchQuery, selectedTopic]);

  // Filter logic for Models
  const filteredModels = useMemo(() => {
    return VEHICLE_MODELS_DB.filter(m => {
      const queryMatch = searchQuery === '' || 
        m.brand.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.model.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.commonIssues.some(issue => issue.toLowerCase().includes(searchQuery.toLowerCase()));

      const brandMatch = selectedBrand === 'All' || m.brand === selectedBrand;
      
      return queryMatch && brandMatch;
    });
  }, [searchQuery, selectedBrand]);

  const toggleChecklist = (key: string) => {
    setChecklistAnswers(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Pre-fill model details in the scenario analyzer to assist the buyer
  const [selectedScenarioBrand, setSelectedScenarioBrand] = useState('BMW');
  const [selectedScenarioCountry, setSelectedScenarioCountry] = useState('LT');
  const [hasScannedHistory, setHasScannedHistory] = useState(false);
  const [isSimulatingScenario, setIsSimulatingScenario] = useState(false);
  const [scenarioReport, setScenarioReport] = useState<null | {
    summary: string;
    inspectionPoints: string[];
    taxCalculations: string;
    scamAlerts: string;
    overallRecommendation: string;
  }>(null);

  const simulatePersonalizedGuidance = () => {
    setIsSimulatingScenario(true);
    setScenarioReport(null);

    setTimeout(() => {
      setIsSimulatingScenario(false);
      let brandInfo = VEHICLE_MODELS_DB.find(m => m.brand === selectedScenarioBrand) || VEHICLE_MODELS_DB[0];
      let taxInfo = COUNTRY_TAX_GUIDES.find(c => c.countryCode === selectedScenarioCountry) || COUNTRY_TAX_GUIDES[0];

      setScenarioReport({
        summary: `Importing a ${brandInfo.brand} ${brandInfo.model} into ${taxInfo.countryName} is highly viable, provided you execute dedicated localized compliance inspections to bypass mechanical blindspots.`,
        inspectionPoints: [
          `Target core issues reported on G20/F-series models: **${brandInfo.commonIssues[0]}** is common.`,
          `Make sure a technician verifies: **${brandInfo.inspectionAdvice}**`,
          'Perform a paint thickness audit to ensure no salvage panels are hidden beneath new outer seals.'
        ],
        taxCalculations: `For registration in **${taxInfo.countryName}**, you must prepare for: **${taxInfo.pollutionTaxFormula}**. The fixed registration fees will count around **${taxInfo.registrationFees}**.`,
        scamAlerts: `Ensure you verify clean telemetry states. Odometer fraud is active across cross-border routes. Always refuse transactions where the seller is unable to provide the **SDK/Official registration books**.`,
        overallRecommendation: `Score: ${brandInfo.reliabilityScore}/5. This represents a highly structured, reliable choice if paired with our specialized Automotive Lawyers representation during title transfer workflows.`
      });
    }, 1500);
  };

  return (
    <div className="bg-white min-h-screen text-zinc-900 pb-16 font-sans" id="advisory-guidance-platform">
      
      {/* Minimalist Premium Header */}
      <div className="bg-white border-b border-zinc-150 py-10 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2.5">
            <h1 id="advisory-guidance-heading" className="text-3xl font-extrabold tracking-tight text-slate-900 mt-1 font-sans">
              {t.hubTitle}
            </h1>
          </div>

          {/* Quick UI Language Selector */}
          <div className="flex items-center gap-1 shrink-0 bg-zinc-50 border border-zinc-200 p-1 rounded-lg">
            {(['en', 'lt', 'de', 'pl'] as AdvisoryLanguage[]).map((langOpt) => (
              <button
                key={langOpt}
                id={`lang-btn-${langOpt}`}
                onClick={() => setLang(langOpt)}
                className={`px-3 py-1.5 rounded text-[10px] font-black uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                  lang === langOpt 
                    ? 'bg-[#8B0000] text-white shadow-sm' 
                    : 'text-zinc-500 hover:text-[#8B0000] hover:bg-zinc-100'
                }`}
              >
                {langOpt}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 pt-8 space-y-8">
        
        {/* SLEEK MINIMALIST SUB-NAV */}
        <div className="border-b border-zinc-200 pb-px flex items-center justify-start gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {[
            { key: 'advice', label: t.adviceTab, icon: BookOpen, desc: 'Buying tips & checklists', id: 'tab-advice-btn' },
            { key: 'models', label: t.modelTab, icon: Car, desc: 'Common issues & reliability', id: 'tab-models-btn' },
            { key: 'tax', label: t.taxTab, icon: Globe, desc: 'Country tax & registration', id: 'tab-tax-btn' },
            { key: 'leasing', label: t.leasingTab, icon: Percent, desc: 'Monthly calculator & traps', id: 'tab-leasing-btn' },
            { key: 'risk', label: t.riskTab, icon: ShieldAlert, desc: 'Evaluate vehicle risk', id: 'tab-risk-btn' },
          ].map((tabItem) => {
            const Icon = tabItem.icon;
            const isSelected = activeTab === tabItem.key;
            return (
               <button
                 key={tabItem.key}
                 id={tabItem.id}
                 onClick={() => {
                   setActiveTab(tabItem.key as any);
                   if (tabItem.key === 'advice') setExpandedArticleId(null);
                 }}
                 className={`py-3.5 px-4 flex items-center gap-2 border-b-2 text-xs font-black uppercase tracking-wider transition-all duration-250 shrink-0 cursor-pointer ${
                   isSelected
                     ? 'border-[#8B0000] text-[#8B0000]'
                     : 'border-transparent text-zinc-450 hover:text-zinc-900'
                 }`}
               >
                 <Icon className="w-4 h-4 shrink-0" />
                 <span>{tabItem.label}</span>
               </button>
            );
          })}
        </div>

        {/* SEARCH CRITERIA INPUT - ONLY SHOW ON APPLICABLE TABS */}
        {(activeTab === 'advice' || activeTab === 'models') && (
          <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl flex flex-col md:flex-row items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full font-sans">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-white border border-zinc-250 pl-10 pr-4 py-2 rounded-xl text-xs font-medium outline-none placeholder:text-zinc-400 focus:border-[#8B0000] transition-all"
              />
            </div>

            {/* Sub Filters based on Active Tab */}
            {activeTab === 'advice' && (
              <div className="flex items-center gap-1.5 w-full md:w-auto shrink-0 font-sans">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest hidden lg:inline">Category:</span>
                <select
                  value={selectedTopic}
                  onChange={(e: any) => setSelectedTopic(e.target.value)}
                  className="w-full md:w-auto bg-white border border-zinc-250 px-3 py-2 rounded-xl text-xs font-bold text-zinc-700 outline-none focus:border-[#8B0000]"
                >
                  <option value="All">{t.filterTopic}</option>
                  <option value="buying">Buying Tips</option>
                  <option value="scam">Scam Avoidance</option>
                  <option value="checklist">Inspection Checklists</option>
                  <option value="transfer">Ownership Transfer</option>
                  <option value="finance">Loan or Insurance</option>
                </select>
              </div>
            )}

            {activeTab === 'models' && (
              <div className="flex items-center gap-1.5 w-full md:w-auto shrink-0 font-sans">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest hidden lg:inline">Brand:</span>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full md:w-auto bg-white border border-zinc-250 px-3 py-2 rounded-xl text-xs font-bold text-zinc-700 outline-none focus:border-[#8B0000]"
                >
                  <option value="All">All Brands</option>
                  <option value="BMW">BMW</option>
                  <option value="Volkswagen">Volkswagen</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Tesla">Tesla</option>
                  <option value="Audi">Audi</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                </select>
              </div>
            )}

          </div>
        )}

                  {/* =======================
              TAB 1: ADVICE LIBRARY 
             ======================= */}
          {activeTab === 'advice' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Article list (8 Cols) */}
                <div className="lg:col-span-8 space-y-6">
                  {filteredArticles.map((article) => {
                    const isExpanded = expandedArticleId === article.id;
                    return (
                      <div 
                        key={article.id}
                        id={`advice-article-${article.id}`}
                        className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div 
                          onClick={() => setExpandedArticleId(isExpanded ? null : article.id)}
                          className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none hover:bg-red-50/10"
                        >
                          <div className="space-y-1.5 flex-1 text-xs">
                            <h3 className="text-sm font-extrabold text-[#8B0000] hover:text-red-700 font-sans transition-colors">{article.title}</h3>
                            <p className="text-xs text-zinc-650 font-normal leading-relaxed">{article.summary}</p>
                          </div>
                          
                          <div className="p-1.5 rounded-lg bg-zinc-50 border border-zinc-200 text-zinc-400 hover:text-[#8B0000] mt-0.5 shrink-0 transition-colors">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </div>

                        {/* Expandable Contents */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-t border-zinc-150 bg-zinc-50/20 p-6 space-y-4 text-xs font-normal text-zinc-600 block whitespace-normal"
                            >
                              {article.content.map((p, idx) => (
                                <p key={idx} className="leading-relaxed text-zinc-600">{p}</p>
                              ))}

                              {article.checklist && (
                                <div className="space-y-2 bg-white p-4.5 rounded-xl border border-zinc-200 mt-4">
                                  <h4 className="font-extrabold text-[#8B0000] flex items-center gap-1.5 text-xs">
                                    <ListTodo className="w-4 h-4 text-[#8B0000]" /> Checklist:
                                  </h4>
                                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-zinc-650 font-sans">
                                    {article.checklist.map((item, idx) => (
                                      <li key={idx} className="flex gap-2 items-start leading-tight">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8B0000] shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {article.alert && (
                                <div className="bg-red-50/30 text-zinc-800 p-3.5 rounded-xl border border-red-100 flex gap-2.5 items-start mt-3">
                                  <AlertTriangle className="w-4 h-4 text-[#8B0000] shrink-0 mt-0.5" />
                                  <div className="text-[11px] leading-relaxed text-zinc-700">
                                    <strong className="font-bold text-[#8B0000]">Warning:</strong> {article.alert}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </div>
                    );
                  })}

                  {filteredArticles.length === 0 && (
                    <div className="bg-white p-12 text-center border border-dashed border-zinc-200 rounded-2xl text-zinc-400 space-y-2">
                      <HelpCircle className="w-10 h-10 text-zinc-300 mx-auto" />
                      <p className="text-xs font-extrabold">No guide articles found matching "{searchQuery}".</p>
                      <p className="text-[10px] text-zinc-400">Try searching for generic terms like 'papers', 'Checklist', or 'Odometer'.</p>
                    </div>
                  )}
                </div>

                {/* Right Side: Quick Action & Guidance (4 Cols) */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Specialized Local Checklist Builder */}
                  <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-zinc-150 pb-3">
                      <Scale className="w-4.5 h-4.5 text-[#8B0000]" />
                      <div>
                        <h4 className="font-extrabold text-[#8B0000] text-xs uppercase tracking-wide">Quick Advisory Alert</h4>
                      </div>
                    </div>
                    
                    <p className="text-xs font-normal leading-relaxed text-zinc-500">
                      Buying a second-hand car from a private seller has no guarantee or returns. You must verify all documents and vehicle conditions yourself before paying.
                    </p>

                    <div className="p-4 bg-[#8B0000] text-white rounded-xl text-[11px] leading-normal space-y-1.5 font-sans">
                      <span className="font-black text-white uppercase text-[10px] tracking-wider block">🛡️ Need Legal Help?</span>
                      <p className="text-zinc-100 font-light text-[10.5px]">
                        Our lawyers help you with mileage fraud issues, car check records, and registering imported vehicles safely.
                      </p>
                    </div>
                  </div>

                  {/* Dynamic scenario analyzer card */}
                  <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#8B0000]/5 rounded-full filter blur-xl"></div>
                    <div className="space-y-1 relative z-10">
                      <h4 className="font-extrabold text-[#8B0000] text-xs uppercase tracking-wide">Scenario Calculator</h4>
                    </div>

                    <div className="space-y-2 text-xs relative z-10">
                      <div className="space-y-1">
                        <label className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">Choose Brand:</label>
                        <select
                          value={selectedScenarioBrand}
                          onChange={(e) => setSelectedScenarioBrand(e.target.value)}
                          className="w-full bg-zinc-50 border border-zinc-200 p-2 rounded-lg font-bold text-zinc-700 outline-none"
                        >
                          <option value="BMW">BMW</option>
                          <option value="Volkswagen">Volkswagen</option>
                          <option value="Toyota">Toyota</option>
                          <option value="Tesla">Tesla</option>
                          <option value="Audi">Audi</option>
                          <option value="Mercedes-Benz">Mercedes-Benz</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">Choose Country:</label>
                        <select
                          value={selectedScenarioCountry}
                          onChange={(e) => setSelectedScenarioCountry(e.target.value)}
                          className="w-full bg-zinc-50 border border-zinc-200 p-2 rounded-lg font-bold text-zinc-700 outline-none"
                        >
                          <option value="LT">Lithuania (LT)</option>
                          <option value="DE">Germany (DE)</option>
                          <option value="PL">Poland (PL)</option>
                          <option value="LV">Latvia (LV)</option>
                        </select>
                      </div>

                      <button
                        onClick={simulatePersonalizedGuidance}
                        disabled={isSimulatingScenario}
                        className="w-full py-2.5 bg-[#8B0000] hover:bg-neutral-950 text-white font-extrabold tracking-wider uppercase text-[10px] rounded-lg transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                      >
                        {isSimulatingScenario ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Calculating...
                          </>
                        ) : (
                          <>
                            Get Simple Tips <Sparkles className="w-3.5 h-3.5 text-white/80" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Scenario report output */}
                    {scenarioReport && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 text-[10.5px] leading-relaxed space-y-2.5"
                      >
                        <div className="flex items-center gap-1.5 border-b border-zinc-200 pb-1.5 font-bold text-[#8B0000]">
                          <Info className="w-3.5 h-3.5 text-[#8B0000]" /> Simple Report:
                        </div>
                        <p className="text-zinc-600 font-medium">{scenarioReport.summary}</p>
                        
                        <div className="space-y-1">
                          <span className="font-extrabold text-neutral-800 block text-[9.5px] uppercase tracking-wider">THINGS TO CHECK:</span>
                          <ul className="list-disc pl-3.5 space-y-0.5 text-zinc-500">
                            {scenarioReport.inspectionPoints.map((p, idx) => (
                              <li key={idx} dangerouslySetInnerHTML={{ __html: p }}></li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-2.5 bg-red-50/20 rounded-lg border border-[#8B0000]/20 text-zinc-700 font-sans text-[10px] leading-normal">
                          <strong>TAX PREVIEW:</strong> {scenarioReport.taxCalculations}
                        </div>

                        <p className="text-[9.5px] text-[#8B0000] font-extrabold leading-normal">
                          {scenarioReport.overallRecommendation}
                        </p>
                      </motion.div>
                    )}

                  </div>

                </div>

              </div>

            </div>
          )}

          {/* =======================
              TAB 2: BRAND DATABASE 
             ======================= */}
          {activeTab === 'models' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModels.map((item) => (
                  <div 
                    key={item.id}
                    id={`model-card-${item.id}`}
                    className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    
                    {/* Upper detail section */}
                    <div className="p-5 space-y-4">
                      
                      <div className="flex items-start justify-between gap-2 border-b border-zinc-100 pb-3">
                        <div className="space-y-0.5">
                          <h3 className="text-base font-extrabold text-[#8B0000]">{item.brand} {item.model}</h3>
                          <p className="text-[10px] text-zinc-400 font-bold font-mono">Generation: {item.generation} ({item.years})</p>
                        </div>
                        
                        {/* Reliability score display */}
                        <div className="text-right">
                          <span className="text-[8px] text-zinc-400 block font-bold uppercase tracking-wider">RELIABILITY</span>
                          <div className="flex items-center gap-1 justify-end font-extrabold text-neutral-800 text-sm font-mono mt-0.5">
                            <span className="text-emerald-600">{item.reliabilityScore}</span>
                            <span className="text-zinc-300">/</span>
                            <span>5.0</span>
                          </div>
                        </div>
                      </div>

                      {/* Common issues */}
                      <div className="space-y-1.5 text-xs">
                        <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">Common Weaknesses:</span>
                        <ul className="space-y-1">
                          {item.commonIssues.map((issue, idx) => (
                            <li key={idx} className="flex gap-1.5 items-start text-[11px] text-zinc-650 leading-snug">
                              <span className="text-[#8B0000] shrink-0 mt-0.5 font-bold">⚠️</span>
                              <span>{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Professional inspection advice */}
                      <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200/65 text-[10.5px] leading-relaxed text-zinc-500 font-normal italic">
                        <strong className="text-zinc-900 font-bold not-italic block mb-0.5">💡 Expert Pre-Purchase Advice:</strong>
                        {item.inspectionAdvice}
                      </div>

                    </div>

                    {/* Lower actions bar */}
                    <div className="bg-zinc-50/70 border-t border-zinc-150 px-5 py-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-extrabold text-[#8B0000] font-mono">{item.maintenanceCost}</span>
                      </div>

                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-wider font-mono border ${
                        item.buyerRating === 'Excellent' 
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-250' 
                          : item.buyerRating === 'Good'
                          ? 'bg-red-55 border-red-200 text-[#8B0000]'
                          : 'bg-amber-50 text-amber-800 border-amber-250'
                      }`}>
                        {item.buyerRating}
                      </span>
                    </div>

                  </div>
                ))}

                {filteredModels.length === 0 && (
                  <div className="col-span-3 bg-white p-12 text-center border border-dashed border-zinc-200 rounded-xl text-zinc-400 space-y-2">
                    <Car className="w-10 h-10 text-zinc-300 mx-auto" />
                    <p className="text-xs font-bold">No models matching "{searchQuery}" exist in the database.</p>
                    <p className="text-[10px] text-zinc-400">Try checking brand selectors like 'BMW' or 'Toyota'.</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* =======================
              TAB 3: TAX & REGISTRATIONS 
             ======================= */}
          {activeTab === 'tax' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {COUNTRY_TAX_GUIDES.map((guide) => (
                  <div 
                    key={guide.countryCode} 
                    id={`tax-guide-${guide.countryCode}`}
                    className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    
                    <div className="p-6 space-y-5">
                      
                      <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#8B0000]/5 text-[#8B0000] flex items-center justify-center font-extrabold font-mono text-[11px] border border-[#8B0000]/15">
                            {guide.countryCode}
                          </div>
                          <h3 className="text-sm font-extrabold text-[#8B0000]">{guide.countryName}</h3>
                        </div>
                      </div>

                      <div className="space-y-4 text-xs font-normal">
                        
                        <div className="space-y-1">
                          <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">Pollution & CO2 Tax Formula:</span>
                          <p className="text-zinc-650 leading-relaxed font-sans">{guide.pollutionTaxFormula}</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="space-y-1">
                            <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">Registration Fees:</span>
                            <p className="text-zinc-650 leading-relaxed font-sans">{guide.registrationFees}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">Customs & Import Duties:</span>
                            <p className="text-zinc-650 leading-relaxed font-sans">{guide.importDutyStatus}</p>
                          </div>
                        </div>

                        <div className="space-y-1 border-t border-zinc-100 pt-3">
                          <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">Technical Inspector Frameworks:</span>
                          <p className="text-zinc-650 leading-relaxed font-sans">{guide.inspectionRequirements}</p>
                        </div>

                      </div>

                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* =======================
              TAB 4: LEASING INFO HUB 
             ======================= */}
          {activeTab === 'leasing' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Dynamic Leasing Simulator Form (5 Cols) */}
                <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-5 text-xs">
                  <div className="flex items-center gap-2 border-b border-zinc-150 pb-3">
                    <Calculator className="w-5 h-5 text-[#8B0000]" />
                    <div>
                      <h4 className="font-extrabold text-[#8B0000] text-xs uppercase tracking-wide">{t.calcTitle}</h4>
                    </div>
                  </div>

                  <div className="space-y-4">
                    
                    {/* Price Slider */}
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-extrabold text-zinc-650 uppercase tracking-wide">Vehicle Asset Price:</span>
                        <span className="font-mono text-[#8B0000] font-black">€{vehiclePrice.toLocaleString()}</span>
                      </div>
                      <input
                        type="range"
                        min="5000"
                        max="150000"
                        step="1000"
                        value={vehiclePrice}
                        onChange={(e) => setVehiclePrice(Number(e.target.value))}
                        className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#8B0000]"
                      />
                    </div>

                    {/* Downpayment percent slider */}
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-extrabold text-zinc-650 uppercase tracking-wide">Downpayment Amount:</span>
                        <span className="font-mono text-zinc-900 font-bold">
                          {downpaymentPercent}% ({(vehiclePrice * (downpaymentPercent / 100)).toLocaleString('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })})
                        </span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        step="5"
                        value={downpaymentPercent}
                        onChange={(e) => setDownpaymentPercent(Number(e.target.value))}
                        className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#8B0000]"
                      />
                    </div>

                    {/* Term range */}
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-extrabold text-zinc-650 uppercase tracking-wide">Lease Period (Months):</span>
                        <span className="font-mono text-zinc-900 font-bold">{leaseTermMonths} months</span>
                      </div>
                      <input
                        type="range"
                        min="12"
                        max="84"
                        step="12"
                        value={leaseTermMonths}
                        onChange={(e) => setLeaseTermMonths(Number(e.target.value))}
                        className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#8B0000]"
                      />
                    </div>

                    {/* Interest Rate */}
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-extrabold text-zinc-650 uppercase tracking-wide">Annual APR Interest Rate:</span>
                        <span className="font-mono text-[#8B0000] font-black">{interestRatePercent}%</span>
                      </div>
                      <input
                        type="range"
                        min="1.9"
                        max="14.9"
                        step="0.1"
                        value={interestRatePercent}
                        onChange={(e) => setInterestRatePercent(Number(e.target.value))}
                        className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#8B0000]"
                      />
                    </div>

                    {/* Residual value (balloon payment) */}
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-extrabold text-zinc-650 uppercase tracking-wide">Residual Balloon Value Percent:</span>
                        <span className="font-mono text-zinc-900 font-bold">
                          {residualValuePercent}% ({(vehiclePrice * (residualValuePercent / 100)).toLocaleString('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })})
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="50"
                        step="5"
                        value={residualValuePercent}
                        onChange={(e) => setResidualValuePercent(Number(e.target.value))}
                        className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#8B0000]"
                      />
                    </div>

                  </div>

                </div>

                {/* Right Side: Results + Clauses Traps list (7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Results Display */}
                  <div className="bg-white text-zinc-900 p-6 rounded-xl border border-zinc-200 shadow-sm flex flex-col sm:flex-row items-stretch justify-between gap-6 relative overflow-hidden">
                    <div className="space-y-4 flex-1 flex flex-col justify-between relative z-10">
                      <div className="space-y-1">
                        <h3 className="text-xs font-semibold text-zinc-500">Your potential monthly lease rate under standard parameters:</h3>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[8px] text-zinc-400 block font-bold uppercase tracking-wider">EST. MONTHLY PAYMENT</span>
                        <span id="leasing-monthly-payment" className="text-3xl sm:text-4xl font-black text-[#8B0000] font-mono tracking-tight">
                          €{Math.round(leasingOutputs.monthlyPayment)} <span className="text-xs font-normal text-zinc-500">/ month</span>
                        </span>
                      </div>
                      
                      <p className="text-[10px] text-zinc-500 font-light font-sans max-w-sm leading-relaxed">
                        Calculated using a downpayment of €{Math.round(leasingOutputs.downpaymentAmount).toLocaleString()} and a final balloon payment of €{Math.round(leasingOutputs.residualAmount).toLocaleString()}.
                      </p>
                    </div>

                    <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-lg sm:w-60 flex flex-col justify-center space-y-3 shrink-0 text-xs text-zinc-700 font-sans relative z-10">
                      <div className="space-y-0.5">
                        <span className="text-[8.5px] text-zinc-400 block font-bold uppercase tracking-wider">TOTAL TERM INTEREST</span>
                        <span className="text-base font-black text-zinc-900 font-mono">€{Math.round(leasingOutputs.totalInterest).toLocaleString()}</span>
                      </div>
                      
                      <div className="space-y-0.5">
                        <span className="text-[8.5px] text-zinc-400 block font-bold uppercase tracking-wider">TOTAL FINANCE COST</span>
                        <span className="text-base font-black text-[#8B0000] font-mono">€{Math.round(leasingOutputs.totalCost).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Leasing traps accordion/checklist */}
                  <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-4">
                    <h3 className="text-xs font-extrabold text-[#8B0000] uppercase tracking-wide flex items-center gap-1.5 border-b border-zinc-150 pb-3">
                      <ShieldAlert className="w-4.5 h-4.5 text-[#8B0000]" /> Leasing Agreement Danger Zones & Traps
                    </h3>

                    <div className="space-y-4 text-xs font-normal leading-relaxed text-zinc-600 block whitespace-normal">
                      
                      <div className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-red-50 text-[#8B0000] flex items-center justify-center font-bold font-mono text-[10px] shrink-0 border border-red-100">1</div>
                        <div className="space-y-1.5">
                          <h4 className="font-extrabold text-[#8B0000] text-[11.5px]">Mileage Limits & Extra Fees</h4>
                          <p>
                            Most leasing contracts limit how many kilometers you can drive per year (for example, 20,000 km). If you drive more, you will have to pay an extra fee of €0.08 to €0.25 for every extra kilometer. Check if this is calculated per year or at the end of the contract.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-red-50 text-[#8B0000] flex items-center justify-center font-bold font-mono text-[10px] shrink-0 border border-red-100">2</div>
                        <div className="space-y-1.5">
                          <h4 className="font-extrabold text-[#8B0000] text-[11.5px]">Unrealistic Final Balloon Payments</h4>
                          <p>
                            Some dealers make the final payment (balloon payment) very high to keep your monthly payments low. At the end of the lease, you will have to pay a huge lump sum to keep the car, or you might owe money if the car's value dropped.
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-5 h-5 rounded-full bg-red-50 text-[#8B0000] flex items-center justify-center font-bold font-mono text-[10px] shrink-0 border border-red-100">3</div>
                        <div className="space-y-1.5">
                          <h4 className="font-extrabold text-[#8B0000] text-[11.5px]">Standard Wear and Tear Fees</h4>
                          <p>
                            When you return the car, the dealer will inspect it for scratches and minor damages. They might charge you high fees for simple wear and tear. Make sure your contract has a clear guide on what counts as normal wear.
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ==================================
              TAB 5: PRE-PURCHASE RISK ENGINE 
             ================================== */}
          {activeTab === 'risk' && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side Checklist Form (7 Cols) */}
                <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-5">
                  <div>
                    <h3 className="text-xs font-extrabold text-[#8B0000] uppercase tracking-wide border-b border-zinc-150 pb-3">
                      Simple Safety Checklist
                    </h3>
                    <p className="text-[11px] text-zinc-500 font-normal mt-1 leading-normal">
                      Check each item below to test the car's safety. The tool will calculate a safety score for you automatically.
                    </p>
                  </div>

                  <div className="space-y-3">
                    
                    {/* Item 1 */}
                    <div 
                      id="criteria-vinMatches"
                      onClick={() => toggleChecklist('vinMatches')}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        checklistAnswers.vinMatches 
                          ? 'bg-red-50/10 border-[#8B0000] text-zinc-800 font-medium' 
                          : 'bg-white hover:bg-zinc-50 border-zinc-200'
                      }`}
                    >
                      <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                        checklistAnswers.vinMatches ? 'bg-[#8B0000] border-[#8B0000] text-white' : 'border-zinc-350 bg-white'
                      }`}>
                        {checklistAnswers.vinMatches && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="text-xs">
                        <strong className="text-neutral-900 block font-bold">1. Check the Car Serial Number (VIN)</strong>
                        <span className="text-[10px] text-zinc-500 line-clamp-2">Check that the number on the window, the engine, and the registration book matches exactly. Make sure the stamped number under the carpet is clean and has not been tampered with.</span>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div 
                      id="criteria-paintThickness"
                      onClick={() => toggleChecklist('paintThicknessTested')}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        checklistAnswers.paintThicknessTested 
                          ? 'bg-red-50/10 border-[#8B0000] text-zinc-800 font-medium' 
                          : 'bg-white hover:bg-zinc-50 border-zinc-200'
                      }`}
                    >
                      <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                        checklistAnswers.paintThicknessTested ? 'bg-[#8B0000] border-[#8B0000] text-white' : 'border-zinc-350 bg-white'
                      }`}>
                        {checklistAnswers.paintThicknessTested && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="text-xs">
                        <strong className="text-neutral-900 block font-bold">2. Use a Paint Thickness Meter</strong>
                        <span className="text-[10px] text-zinc-500 line-clamp-2">Check all metal panels (doors, hood, roof) with a paint meter. Normal factory paint is between 80 to 140 microns. Thick paint or body filler means the car was in an accident.</span>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div 
                      id="criteria-serviceHistory"
                      onClick={() => toggleChecklist('serviceHistoryVerified')}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        checklistAnswers.serviceHistoryVerified 
                          ? 'bg-red-50/10 border-[#8B0000] text-zinc-800 font-medium' 
                          : 'bg-white hover:bg-zinc-50 border-zinc-200'
                      }`}
                    >
                      <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                        checklistAnswers.serviceHistoryVerified ? 'bg-[#8B0000] border-[#8B0000] text-white' : 'border-zinc-350 bg-white'
                      }`}>
                        {checklistAnswers.serviceHistoryVerified && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="text-xs">
                        <strong className="text-neutral-900 block font-bold">3. Check the Service History Papers</strong>
                        <span className="text-[10px] text-zinc-500 line-clamp-2">Make sure the car has regular service stamps from official dealers or certified garages with clean dates and mileage records.</span>
                      </div>
                    </div>

                    {/* Item 4 */}
                    <div 
                      id="criteria-diagnosticScan"
                      onClick={() => toggleChecklist('diagnosticScanDone')}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        checklistAnswers.diagnosticScanDone 
                          ? 'bg-red-50/10 border-[#8B0000] text-zinc-800 font-medium' 
                          : 'bg-white hover:bg-zinc-50 border-zinc-200'
                      }`}
                    >
                      <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                        checklistAnswers.diagnosticScanDone ? 'bg-[#8B0000] border-[#8B0000] text-white' : 'border-zinc-350 bg-white'
                      }`}>
                        {checklistAnswers.diagnosticScanDone && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="text-xs">
                        <strong className="text-neutral-900 block font-bold">4. Scan the Car's Computer (OBD-II)</strong>
                        <span className="text-[10px] text-zinc-500 line-clamp-2">Use a diagnostic scanner to check for hidden error codes. Sellers sometimes clear warning lights before a buyer arrives, but a deep scan will find them.</span>
                      </div>
                    </div>

                    {/* Item 5 */}
                    <div 
                      id="criteria-[#8B0000]"
                      onClick={() => toggleChecklist('scamToldNoEscrow')}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        checklistAnswers.scamToldNoEscrow 
                          ? 'bg-red-50/10 border-[#8B0000] text-zinc-800 font-medium' 
                          : 'bg-white hover:bg-zinc-50 border-zinc-200'
                      }`}
                    >
                      <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                        checklistAnswers.scamToldNoEscrow ? 'bg-[#8B0000] border-[#8B0000] text-white' : 'border-zinc-350 bg-white'
                      }`}>
                        {checklistAnswers.scamToldNoEscrow && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="text-xs">
                        <strong className="text-neutral-900 block font-bold">5. Safe Payment (Never Wire Money Directly)</strong>
                        <span className="text-[10px] text-zinc-500 line-clamp-2">Never send a bank transfer or deposit to a seller before seeing the car. Only use safe payment methods, bank drafts, or secure escrow services.</span>
                      </div>
                    </div>

                    {/* Item 6 */}
                    <div 
                      id="criteria-testDrive"
                      onClick={() => toggleChecklist('testDriveCompleted')}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        checklistAnswers.testDriveCompleted 
                          ? 'bg-red-50/10 border-[#8B0000] text-zinc-800 font-medium' 
                          : 'bg-white hover:bg-zinc-50 border-zinc-200'
                      }`}
                    >
                      <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center shrink-0 mt-0.5 ${
                        checklistAnswers.testDriveCompleted ? 'bg-[#8B0000] border-[#8B0000] text-white' : 'border-zinc-350 bg-white'
                      }`}>
                        {checklistAnswers.testDriveCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="text-xs">
                        <strong className="text-neutral-900 block font-bold">6. Take the Car for a Cold-Start Test Drive</strong>
                        <span className="text-[10px] text-zinc-500 line-clamp-2">Start the car when the engine is completely cold. Drive on different roads to test the steering, brakes, gears, and suspension.</span>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Right Side Calculated Risk Gauge (5 Cols) */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Score Card Display */}
                  <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm text-center space-y-4">

                    <div className="space-y-1">
                      <span id="risk-score-display" className="text-5xl font-black text-[#8B0000] font-mono tracking-tight">
                        {computedRiskScore} <span className="text-xs text-zinc-400">/ 100</span>
                      </span>
                    </div>

                    {/* Direct Advice Action based on score */}
                    <div className="text-left bg-zinc-50 p-4.5 rounded-xl text-[11px] text-zinc-650 font-sans leading-relaxed space-y-2">
                       <span className="font-bold text-neutral-800 uppercase text-[9px] tracking-wider block">Recommended Actions:</span>
                      
                      {computedRiskScore === 100 ? (
                        <p className="text-emerald-700 font-semibold flex items-center gap-1">
                          ✓ Everything checked! You are safe to buy this car.
                        </p>
                      ) : (
                        <ul className="list-disc pl-4 space-y-1">
                          {!checklistAnswers.vinMatches && (
                            <li>Check the vehicle identification number (VIN) matches all papers exactly.</li>
                          )}
                          {!checklistAnswers.paintThicknessTested && (
                            <li>Use a paint thickness meter to find hidden accident repairs.</li>
                          )}
                          {!checklistAnswers.serviceHistoryVerified && (
                            <li>Check that the service book stamps match real dates and mileage.</li>
                          )}
                          {!checklistAnswers.diagnosticScanDone && (
                            <li>Scan the car with an OBD-II scanner to find hidden fault codes.</li>
                          )}
                          {!checklistAnswers.scamToldNoEscrow && (
                            <li className="text-[#8B0000] font-bold">Do not send money in advance! Use safe payment methods.</li>
                          )}
                        </ul>
                      )}
                    </div>

                    {/* Reset Button */}
                    <button
                      onClick={() => setChecklistAnswers({
                        vinMatches: false,
                        paintThicknessTested: false,
                        serviceHistoryVerified: false,
                        diagnosticScanDone: false,
                        scamToldNoEscrow: false,
                        testDriveCompleted: false,
                        sellerIdentityRegistered: false,
                        exportDeregistered: false
                      })}
                      className="text-[10px] font-bold text-zinc-400 hover:text-[#8B0000] underline cursor-pointer uppercase font-mono tracking-wider transition-colors"
                    >
                      Reset Evaluation Form
                    </button>

                  </div>

                  {/* General disclaimer */}
                  <div className="bg-white p-5 rounded-xl text-[10px] leading-relaxed text-zinc-400 border border-zinc-200">
                    <strong>DISCLAIMER:</strong> This tool is only for advice. It is not legal or official representation. Always talk to a lawyer or specialist for expensive transactions.
                  </div>

                </div>

              </div>

            </div>
          )}

      </div>

    </div>
  );
}

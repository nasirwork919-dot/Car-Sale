import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, Percent, ShieldAlert, Cpu, Layers, Scale, Globe, Building, 
  CheckCircle2, Zap, AlertCircle, Calendar, DollarSign, Eye, Download, 
  Link, FileText, Check, Settings, PenTool, TrendingUp, Info, FileCheck, 
  Sparkles, CheckSquare, RefreshCw, X, FileSignature, ArrowRight, Wallet, ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { VEHICLES } from '../data';
import { Vehicle } from '../types';

// Types for the Finance & Leasing Hub
export interface FinanceProvider {
  id: string;
  name: string;
  logoColor: string;
  country: string;
  baseApr: number; // Annual Percentage Rate (e.g. 4.5 for 4.5%)
  maxTermMonths: number;
  minDownPaymentPct: number; // e.g. 10 for 10%
  approvalRequirements: string[];
  type: 'Both' | 'New Only' | 'Used Only';
  rating: number;
  badge?: string;
  description: string;
}

export interface FinanceAgreement {
  id: string;
  providerName: string;
  vehicleName: string;
  vehicleVin: string;
  principalAmount: number;
  downPayment: number;
  termMonths: number;
  interestRate: number;
  monthlyPayment: number;
  totalRepayment: number;
  status: 'Draft' | 'Sent' | 'Approved' | 'Signed' | 'Linked To Vehicle';
  linkToProfile: boolean;
  documentName: string;
  createdAt: string;
  aprClass: 'low' | 'medium' | 'high';
  aiSummary?: {
    summaryText: string;
    balloonPayment?: number;
    exclusions: string[];
    riskFlags: string[];
  };
}

export default function FinancePlatform() {
  // Navigation Tabs at the Top
  // 'calculator': Comparative Tool & Estimator
  // 'leasing': Leasing Deals Calculations & Custom Inquiry 
  // 'vault': Agreement Vault, AI Analyser & Vehicle Wallet Linker
  const [activeTab, setActiveTab] = useState<'calculator' | 'leasing' | 'vault'>('calculator');

  // Comparative Calculator state
  const [calcCarVin, setCalcCarVin] = useState('');
  const [calcCarPrice, setCalcCarPrice] = useState<number>(45000);
  const [calcCarCondition, setCalcCarCondition] = useState<'new' | 'used'>('new');
  const [calcCountry, setCalcCountry] = useState<string>('Lithuania'); // 'Lithuania' | 'Germany' | 'USA' | 'Latvia' | 'Poland'
  const [calcDownPayment, setCalcDownPayment] = useState<number>(9000); // Baseline 20%
  const [calcTermMonths, setCalcTermMonths] = useState<number>(48); // 36, 48, 60, 72, 84
  const [calcUsageType, setCalcUsageType] = useState<'private' | 'business'>('private');

  // Comparative results state
  const [isComparingOffers, setIsComparingOffers] = useState(false);
  const [comparedOffers, setComparedOffers] = useState<any[]>([]);

  // Selected Offer to Apply/Sign Modal State
  const [selectedOfferToSign, setSelectedOfferToSign] = useState<any | null>(null);
  
  // Signature Pad State
  const [signatureName, setSignatureName] = useState('');
  const [isSignCanvasActive, setIsSignCanvasActive] = useState(false);
  const [signDrawing, setSignDrawing] = useState<boolean>(false);
  const [signPoints, setSignPoints] = useState<string[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signingInProgress, setSigningInProgress] = useState(false);

  // Dynamic user storage for financing agreements
  const [agreements, setAgreements] = useState<FinanceAgreement[]>([
    {
      id: 'FIN-AGR-4910',
      providerName: 'Sovereign Baltic Credit',
      vehicleName: 'Porsche 911 Carrera S',
      vehicleVin: 'WP0AB2A92MS299212',
      principalAmount: 120000,
      downPayment: 30000,
      termMonths: 60,
      interestRate: 6.8,
      monthlyPayment: 2364,
      totalRepayment: 141840,
      status: 'Signed',
      linkToProfile: false,
      documentName: 'baltic_sovereign_signed_911.pdf',
      createdAt: '2026-05-12',
      aprClass: 'medium',
      aiSummary: {
        summaryText: 'Standard vehicle credit line matching high-net-worth client profiling. Features fixed APR with standard monthly compound cycles.',
        balloonPayment: 0,
        exclusions: ['Late payment penance of 0.1% daily accumulation compounding in Baltic ledger.', 'Lien asset restricted from secondary international customs registry changes prior to total liquidation.'],
        riskFlags: [
          'COMPENDIUM TERM EXTENSION: Moving payment schedule beyond 48 months triggers interest accumulation surcharge of 0.45%.',
          'BALTIC DEBT PRIORITY: Direct direct-billing is wired; defaults prompt rapid regional customs lien holds.'
        ]
      }
    },
    {
      id: 'FIN-AGR-0028',
      providerName: 'Lietuvos Land leasing',
      vehicleName: 'Audi RS6 Avant',
      vehicleVin: 'WAUB8AF21MN05XXXX',
      principalAmount: 80000,
      downPayment: 15000,
      termMonths: 36,
      interestRate: 12.5, // High APR
      monthlyPayment: 2676,
      totalRepayment: 96336,
      status: 'Approved',
      linkToProfile: false,
      documentName: 'audi_rs6_lietuvos_offer.pdf',
      createdAt: '2026-06-10',
      aprClass: 'high',
      aiSummary: {
        summaryText: 'Aggressive leasing structure with residual purchase options. Accelerated payment terms but features high risk rate conditions.',
        balloonPayment: 12000,
        exclusions: ['Operation by drivers possessing less than 3 years of regional commercial license certification.', 'Mileage excess surcharge of €0.45 per kilometer beyond the pre-filed boundaries.'],
        riskFlags: [
          '🚫 CRITICAL HIGH APR ALERT: The interest rate of 12.5% is significantly above standard EU market levels (typically 4.2% - 6.5%). Double-check alternatives.',
          '🚨 BALLOON OPTION RISK: A final cash payment of €12,000 is required to completely clear the vehicle title transfer ownership.'
        ]
      }
    }
  ]);

  // Alert/Feedback Message
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Link selected agreement to vehicle profile
  const [linkedVehicleMap, setLinkedVehicleMap] = useState<Record<string, string>>({
    'WP0AB2A92MS299212': 'Sovereign Baltic Credit'
  });

  // Pre-seeded financial providers grouped or calibrated by country limits
  const FINANCE_PROVIDERS: FinanceProvider[] = [
    {
      id: "prov-sebb",
      name: "Sovereign Baltic Credit Group",
      logoColor: "bg-blue-600",
      country: "Lithuania",
      baseApr: 4.8,
      maxTermMonths: 84,
      minDownPaymentPct: 10,
      approvalRequirements: ["Identity audit via Digital ID", "Standard credit record rating above 720", "Minimum down payment of 10%"],
      type: "Both",
      rating: 4.9,
      badge: "Sovereign Preferred",
      description: "Direct wire clearing. Specialized in high-valuation supercars, mixed enterprise logistics assets, and zero-hold state finance."
    },
    {
      id: "prov-liet",
      name: "Lietuvos Leasing Corp",
      logoColor: "bg-emerald-600",
      country: "Lithuania",
      baseApr: 5.2,
      maxTermMonths: 60,
      minDownPaymentPct: 15,
      approvalRequirements: ["Lithuanian corporate credentials", "Sovereign vat clearance papers", "Quarterly balance sheets review"],
      type: "Both",
      rating: 4.7,
      description: "Optimized corporate fleet programs allowing immediate capital deduction of luxury leasing packages."
    },
    {
      id: "prov-db",
      name: "Deutsche AutoBank Gateway",
      logoColor: "bg-[#8B0000]",
      country: "Germany",
      baseApr: 3.9,
      maxTermMonths: 72,
      minDownPaymentPct: 10,
      approvalRequirements: ["German permanent address registry", "Payslip telemetry matching", "Schufa rank score ≥ 'A'"],
      type: "Both",
      rating: 4.8,
      badge: "Lowest Euro APR",
      description: "Highly stable German rates with near-instant direct debit setup. Instant API sync directly with your digital wallet."
    },
    {
      id: "prov-bayer",
      name: "Bayerische Asset Leasing",
      logoColor: "bg-cyan-500",
      country: "Germany",
      baseApr: 4.2,
      maxTermMonths: 48,
      minDownPaymentPct: 20,
      approvalRequirements: ["Co-signer if driver under 25", "Corporate capitalization statement", "Insurance comprehensive coverage active"],
      type: "New Only",
      rating: 4.6,
      description: "Specialized in pristine luxury German sport sedans (BMW, Porsche, Audi) matching lease return packages."
    },
    {
      id: "prov-chase",
      name: "Chase Auto Premium Credit",
      logoColor: "bg-indigo-700",
      country: "USA",
      baseApr: 6.4,
      maxTermMonths: 84,
      minDownPaymentPct: 10,
      approvalRequirements: ["US Social Security Validation", "W2 telemetry document link", "FICO Rating above 680"],
      type: "Both",
      rating: 4.9,
      badge: "Top US Provider",
      description: "America's prominent auto lending brand. Features rapid approvals, mobile-check transfers, and cross-state registration assistance."
    },
    {
      id: "prov-ally",
      name: "Ally Fleet Financers",
      logoColor: "bg-purple-600",
      country: "USA",
      baseApr: 7.2,
      maxTermMonths: 72,
      minDownPaymentPct: 5,
      approvalRequirements: ["3-Month active bank records download", "Proof of annual income ≥ $45k", "Driver mileage logs"],
      type: "Both",
      rating: 4.5,
      description: "High-flexibility credit categories with minimal downpayments, tailored for private daily commuters."
    },
    {
      id: "prov-swed",
      name: "Nordia Swed & Baltic Capital",
      logoColor: "bg-yellow-500",
      country: "Latvia",
      baseApr: 5.5,
      maxTermMonths: 84,
      minDownPaymentPct: 10,
      approvalRequirements: ["Baltic state resident passport ID", "Tax authority revenue certification", "Vehicles matching sovereign registration"],
      type: "Both",
      rating: 4.6,
      description: "Pristine capital routing in Latvian and Baltic markets. Quick paperless digital signature processing."
    },
    {
      id: "prov-pkob",
      name: "PKO Polski Bank AutoLease",
      logoColor: "bg-blue-800",
      country: "Poland",
      baseApr: 5.9,
      maxTermMonths: 60,
      minDownPaymentPct: 15,
      approvalRequirements: ["PESEL registration telemetry", "NIP corporate registration if business", "3 months bank logs mapping"],
      type: "Both",
      rating: 4.7,
      description: "Premier Polish automotive credit and leasing programs with favorable loan terms for mixed transport vehicles."
    }
  ];

  // LEASING CALCULATOR STATE variables
  const [leaseVehiclePrice, setLeaseVehiclePrice] = useState<number>(55000);
  const [leaseDownpaymentPct, setLeaseDownpaymentPct] = useState<number>(15); // Percentage downpayment
  const [leaseTermMonths, setLeaseTermMonths] = useState<number>(36); // Months: 24, 36, 48
  const [leaseAnnualMileageLimit, setLeaseAnnualMileageLimit] = useState<number>(12000); // Mileage limit
  const [leaseInquirySubmitted, setLeaseInquirySubmitted] = useState<boolean>(false);
  
  // Calculate Leasing variables
  const computedLeaseOutputs = useMemo(() => {
    const downpaymentVal = Math.round((leaseVehiclePrice * leaseDownpaymentPct) / 100);
    const residualVal = Math.round(leaseVehiclePrice * (leaseTermMonths === 24 ? 0.62 : leaseTermMonths === 36 ? 0.52 : 0.44));
    
    // Simple lease calculation structure:
    // Depreciation fee = (Price - Downpayment - Residual) / Term
    // Interest/Money-factor fee = (Price - Downpayment + Residual) * 0.0022 (approx 5.28% apr)
    const depreciationAmt = (leaseVehiclePrice - downpaymentVal - residualVal);
    const baseLeasePayment = depreciationAmt > 0 ? (depreciationAmt / leaseTermMonths) : 150;
    
    // Mileage adjustment surcharge factor
    const mileageFactor = leaseAnnualMileageLimit > 15000 ? 55 : leaseAnnualMileageLimit > 10000 ? 25 : 0;
    const finalMonthlyLeasePrice = Math.round(baseLeasePayment * 1.05 + mileageFactor);
    const totalPaymentsInterest = Math.round(finalMonthlyLeasePrice * leaseTermMonths + downpaymentVal);

    return {
      downpaymentVal,
      residualVal,
      finalMonthlyLeasePrice,
      totalPaymentsInterest,
      acquisitionFee: 850
    };
  }, [leaseVehiclePrice, leaseDownpaymentPct, leaseTermMonths, leaseAnnualMileageLimit]);

  // Autocomplete by Vin
  const handleCarVinAutocomplete = (vin: string) => {
    setCalcCarVin(vin);
    const match = VEHICLES.find(v => v.vin.toUpperCase() === vin.toUpperCase() || v.vin.includes(vin));
    if (match) {
      setCalcCarPrice(match.price);
      setCalcCarCondition(match.year >= 2024 ? 'new' : 'used');
      setCalcDownPayment(Math.round(match.price * 0.2));
    }
  };

  // Compare offers
  const handleCompareOffers = (e: React.FormEvent) => {
    e.preventDefault();
    setIsComparingOffers(true);
    setComparedOffers([]);

    setTimeout(() => {
      // Filter providers by selected country
      const filtered = FINANCE_PROVIDERS.filter(p => p.country === calcCountry);

      // Determine adjusted APR based on inputs
      const offers = filtered.map(p => {
        let aprAdjust = p.baseApr;
        
        // Penalize used condition with higher rates (risk adjustments)
        if (calcCarCondition === 'used') aprAdjust += 1.4;
        
        // Term length penalties (interest curves)
        if (calcTermMonths > 60) aprAdjust += 0.8;
        if (calcTermMonths > 72) aprAdjust += 1.25;

        // Business rates usually slightly cheaper or tax integrated
        if (calcUsageType === 'business') aprAdjust -= 0.35;

        // Ensure down payment discount
        const downPaymentPct = (calcDownPayment / calcCarPrice) * 100;
        if (downPaymentPct >= 30) aprAdjust -= 0.6; // lower rate for high equity
        if (downPaymentPct < 15) aprAdjust += 0.55;

        // Standard Amortization formula to calculate monthly cost
        const principal = calcCarPrice - calcDownPayment;
        const monthlyRate = (aprAdjust / 100) / 12;
        const n = calcTermMonths;
        
        let monthlyPayment = 0;
        if (monthlyRate === 0) {
          monthlyPayment = principal / n;
        } else {
          monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
        }

        const formattedMonthly = Math.round(monthlyPayment);
        const formattedTotalRepayment = Math.round(formattedMonthly * n + calcDownPayment);

        return {
          ...p,
          finalApr: parseFloat(aprAdjust.toFixed(2)),
          monthlyPayment: formattedMonthly,
          totalRepayment: formattedTotalRepayment,
          principalAmount: principal
        };
      });

      setComparedOffers(offers);
      setIsComparingOffers(false);
    }, 1200);
  };

  // Signature drawing helper mechanics
  const handleSignMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setSignDrawing(true);
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSignPoints(prev => [...prev, `M ${x} ${y}`]);
  };

  const handleSignMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!signDrawing) return;
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSignPoints(prev => {
      const last = prev[prev.length - 1];
      return [...prev.slice(0, prev.length - 1), `${last} L ${x} ${y}`];
    });
  };

  const handleSignMouseUp = () => {
    setSignDrawing(false);
  };

  const clearSignatureCanvas = () => {
    setSignPoints([]);
  };

  const executeFinancingSigningProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signatureName || !selectedOfferToSign) return;

    setSigningInProgress(true);

    setTimeout(() => {
      // Determine if APR triggers caution
      const aprVal = selectedOfferToSign.finalApr;
      const aprClass = aprVal >= 12.0 ? 'high' : aprVal >= 7.5 ? 'medium' : 'low';
      
      const newAgrId = `FIN-AGR-${Math.floor(1000 + Math.random() * 9000)}`;

      // Generate AI summary based on APR rate
      let summaryText = `Standard retail financing contract finalized with ${selectedOfferToSign.name}. Document cleared through digital signature certificates.`;
      let riskFlags: string[] = [];
      let exclusions = ['Commercial cargo hauling without fleet logging riders.', 'Exporting of collateral asset outer territory borders without banking notification.'];
      let balloonPayment = 0;

      if (aprClass === 'high') {
        riskFlags.push(`🚫 HIGH APR CONSTRAINTS RECOGNIZED: Interest accumulation is marked critical at ${aprVal}% APR. Default structures can prompt rapid regional court asset repo holds.`);
        summaryText = `High interest vehicle loan agreement signature bound on ${selectedOfferToSign.name}. Contract features tight grace-period penalties.`;
      } else if (aprClass === 'medium') {
        riskFlags.push(`⚠️ WARNING: Average to moderate level APR interest verified. Avoid late payments beyond 5 days log intervals to prevent penalty fee compounding.`);
      } else {
        riskFlags.push(`✓ HEALTHY FINANCING RATE: Premium tier ${aprVal}% APR. Highly stable repayment schedules registered.`);
      }

      const carName = calcCarVin ? VEHICLES.find(v => v.vin.toUpperCase() === calcCarVin.toUpperCase())?.model || "Audi RS6 Avant" : "Prestige Premium Car";

      const newAgr: FinanceAgreement = {
        id: newAgrId,
        providerName: selectedOfferToSign.name,
        vehicleName: `${calcCarCondition === 'new' ? 'New' : 'Used'} ${calcCarVin ? VEHICLES.find(v => v.vin.toUpperCase() === calcCarVin.toUpperCase())?.make : 'Vehicle'} ${carName}`,
        vehicleVin: calcCarVin || 'WAUB8AF21MN05XXXX',
        principalAmount: selectedOfferToSign.principalAmount,
        downPayment: calcDownPayment,
        termMonths: calcTermMonths,
        interestRate: aprVal,
        monthlyPayment: selectedOfferToSign.monthlyPayment,
        totalRepayment: selectedOfferToSign.totalRepayment,
        status: 'Signed',
        linkToProfile: false,
        documentName: `${selectedOfferToSign.name.toLowerCase().replace(/\s+/g, '_')}_signed_finance.pdf`,
        createdAt: new Date().toISOString().split('T')[0],
        aprClass: aprClass,
        aiSummary: {
          summaryText,
          balloonPayment,
          exclusions,
          riskFlags
        }
      };

      setAgreements(prev => [newAgr, ...prev]);
      setFeedbackMessage(`SUCCESS! Agreement ${newAgrId} signed by owner ${signatureName} & approved instantly by ${selectedOfferToSign.name}. Bound to Vault.`);
      
      // Auto register to linked vehicle profile
      if (calcCarVin) {
        setLinkedVehicleMap(prev => ({
          ...prev,
          [calcCarVin.toUpperCase()]: selectedOfferToSign.name
        }));
      }

      setSigningInProgress(false);
      setIsSignCanvasActive(false);
      setSelectedOfferToSign(null);

      // Scroll to vault
      setTimeout(() => {
        setActiveTab('vault');
        // Clear banner message after 8 seconds
        setTimeout(() => setFeedbackMessage(null), 8005);
      }, 300);
    }, 2000);
  };

  // Perform Manual Binding from file input
  const triggerManualDocumentImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.docx,.doc';
    input.onchange = (e: any) => {
      if (e.target.files?.[0]) {
        const file = e.target.files[0];
        
        // Simulate scanning and parsing with AI
        const parsedAgr: FinanceAgreement = {
          id: `FIN-IMPORT-${Math.floor(1000 + Math.random() * 9000)}`,
          providerName: 'Imported Nordea Contract',
          vehicleName: 'BMW M5 Competition',
          vehicleVin: 'WBA53BJ0XPX881270',
          principalAmount: 85000,
          downPayment: 25000,
          termMonths: 48,
          interestRate: 8.95, // Medium/High
          monthlyPayment: 2112,
          totalRepayment: 101376,
          status: 'Signed',
          linkToProfile: true,
          documentName: file.name,
          createdAt: new Date().toISOString().split('T')[0],
          aprClass: 'medium',
          aiSummary: {
            summaryText: `AI extracted details from imported file ${file.name}. Valid contract elements decoded successfully.`,
            exclusions: ['Unregistered track tests', 'Extreme cold starts without 5-minute engine lubrication sequence (oil preheat).'],
            riskFlags: [
              '⚠️ MODERATE APR WARNING: 8.95% extracted interest rate falls above standard EU benchmarks.',
              'COLLATERAL LIEN DETECTED: Bank holds primary sovereign vehicle title registry lien.'
            ]
          }
        };

        setAgreements(prev => [parsedAgr, ...prev]);
        setFeedbackMessage(`AI Scanned & Imported Nordea Contract File "${file.name}"! Discovered 8.95% APR.`);
        setTimeout(() => setFeedbackMessage(null), 8000);
      }
    };
    input.click();
  };

  // Toggle vehicle registry lien mapping
  const toggleVehicleLienLinkage = (vin: string, providerName: string, id: string) => {
    setLinkedVehicleMap(prev => {
      const match = prev[vin.toUpperCase()];
      if (match) {
        const copy = { ...prev };
        delete copy[vin.toUpperCase()];
        return copy;
      } else {
        return {
          ...prev,
          [vin.toUpperCase()]: providerName
        };
      }
    });

    setAgreements(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, status: a.status === 'Linked To Vehicle' ? 'Signed' : 'Linked To Vehicle', linkToProfile: !a.linkToProfile };
      }
      return a;
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 bg-white text-left" id="finance-hub-root">
      
      {/* Upper Navigation Hero */}
      <div className="relative rounded-xl overflow-hidden bg-white text-left p-6 shadow-xs border border-slate-200">
        
        <div className="relative space-y-1.5 max-w-3xl">
          <h1 id="finance-portal-heading" className="text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
            Auto Banking &amp; Lease Portal
          </h1>
        </div>

        {/* Tab switcher Inside Hero */}
        <div className="relative pt-4 flex flex-wrap gap-2 max-w-[650px]">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`py-1.5 px-3 rounded text-[10px] font-bold uppercase transition duration-150 flex items-center gap-1 cursor-pointer border ${
              activeTab === 'calculator'
                ? 'bg-[#8B0000] text-white border-transparent shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Financing Estimator Tool</span>
          </button>

          <button
            onClick={() => setActiveTab('leasing')}
            className={`py-1.5 px-3 rounded text-[10px] font-bold uppercase transition duration-150 flex items-center gap-1 cursor-pointer border ${
              activeTab === 'leasing'
                ? 'bg-[#8B0000] text-white border-transparent shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Leasing Calculation Offers</span>
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`py-1.5 px-3 rounded text-[10px] font-bold uppercase transition duration-150 flex items-center gap-1 cursor-pointer border ${
              activeTab === 'vault'
                ? 'bg-[#8B0000] text-white border-transparent shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Agreement Vault &amp; AI summary</span>
          </button>
        </div>
      </div>

      {feedbackMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold p-4 rounded-xl flex items-center gap-2.5 animate-slideDown shadow-xs">
          <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Main Containers */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: FINANCING COMPARISON TOOL */}
        {activeTab === 'calculator' && (
          <motion.div
            key="calc-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-12"
          >
            {/* Split layout: Calculator inputs LEFT, Results RIGHT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Inputs Form Left */}
              <form onSubmit={handleCompareOffers} className="lg:col-span-5 border border-slate-200/80 rounded-3xl p-6 sm:p-7 bg-white space-y-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#8B0000] flex items-center justify-center">
                    <Scale className="w-5 h-5 text-[#8B0000]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">Rate Comparison Matrix</h3>
                  </div>
                </div>

                {/* Pre-fill Option */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Pre-fill via Vehicle price</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'Porsche 911 Carrera S', vin: 'WP0AB2A92MS299212' },
                      { name: 'BMW M5 Competition', vin: 'WBA53BJ0XPX881270' },
                      { name: 'Tesla Model S', vin: '5YJSA1E4XPF231495' },
                      { name: 'Land Rover Range Rover Sport', vin: 'SAJGV2RE8MA124850' }
                    ].map((car) => (
                      <button
                        key={car.vin}
                        type="button"
                        onClick={() => handleCarVinAutocomplete(car.vin)}
                        className={`text-[10px] font-bold py-1.5 px-3 rounded-lg border transition-all cursor-pointer ${
                          calcCarVin === car.vin 
                            ? 'bg-red-50 text-[#8B0000] border-[#8B0000]/40 font-bold' 
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {car.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vehicle Price Slider */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    <span>Vehicle Capital Value</span>
                    <span className="font-mono text-slate-900 text-sm sm:text-base font-extrabold">${calcCarPrice.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="200000"
                    step="5000"
                    value={calcCarPrice}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCalcCarPrice(val);
                      setCalcDownPayment(Math.round(val * 0.2));
                    }}
                    style={{
                      background: `linear-gradient(to right, #8B0000 0%, #8B0000 ${((calcCarPrice - 10000) / 190000) * 100}%, #e2e8f0 ${((calcCarPrice - 10000) / 190000) * 100}%, #e2e8f0 100%)`
                    }}
                    className="w-full appearance-none h-1.5 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#8B0000] [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#8B0000] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md focus:outline-none"
                  />
                </div>

                {/* Down Payment Slider */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    <span>Down Payment (Equity) ({Math.round((calcDownPayment / calcCarPrice) * 100)}%)</span>
                    <span className="font-mono text-slate-900 text-sm sm:text-base font-extrabold">${calcDownPayment.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={calcCarPrice * 0.8}
                    step="1000"
                    value={calcDownPayment}
                    onChange={(e) => setCalcDownPayment(Number(e.target.value))}
                    style={{
                      background: `linear-gradient(to right, #8B0000 0%, #8B0000 ${(calcCarPrice * 0.8 > 0 ? (calcDownPayment / (calcCarPrice * 0.8)) * 100 : 0)}%, #e2e8f0 ${(calcCarPrice * 0.8 > 0 ? (calcDownPayment / (calcCarPrice * 0.8)) * 100 : 0)}%, #e2e8f0 100%)`
                    }}
                    className="w-full appearance-none h-1.5 rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#8B0000] [&::-webkit-slider-thumb]:border-0 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#8B0000] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:shadow-md focus:outline-none"
                  />
                </div>

                {/* Condition & Country Options */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#8B0000] uppercase tracking-wider">Origin Country</label>
                    <div className="relative">
                      <select
                        className="w-full text-xs font-bold p-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-[#8B0000] appearance-none pr-10 cursor-pointer"
                        value={calcCountry}
                        onChange={(e) => setCalcCountry(e.target.value)}
                      >
                        <option value="Lithuania">Lithuania (LT 🇪🇪)</option>
                        <option value="Germany">Germany (DE 🇩🇪)</option>
                        <option value="USA">United States (US 🇺🇸)</option>
                        <option value="Latvia">Latvia (LV 🇱🇻)</option>
                        <option value="Poland">Poland (PL 🇵🇱)</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Condition Category</label>
                    <div className="grid grid-cols-2 p-1 bg-white border border-slate-200 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setCalcCarCondition('new')}
                        className={`py-2 text-xs font-bold rounded-lg transition-all text-center cursor-pointer ${
                          calcCarCondition === 'new' 
                            ? 'bg-[#8B0000] text-white shadow-xs' 
                            : 'bg-white text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        New
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalcCarCondition('used')}
                        className={`py-2 text-xs font-bold rounded-lg transition-all text-center cursor-pointer ${
                          calcCarCondition === 'used' 
                            ? 'bg-[#8B0000] text-white shadow-xs' 
                            : 'bg-white text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Used
                      </button>
                    </div>
                  </div>
                </div>

                {/* Term & Private/Business Option */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Repayment Term</label>
                    <div className="relative">
                      <select
                        className="w-full text-xs font-bold p-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:border-[#8B0000] appearance-none pr-10 cursor-pointer"
                        value={calcTermMonths}
                        onChange={(e) => setCalcTermMonths(Number(e.target.value))}
                      >
                        <option value={24}>24 Months (2 yrs)</option>
                        <option value={36}>36 Months (3 yrs)</option>
                        <option value={48}>48 Months (4 yrs)</option>
                        <option value={60}>60 Months (5 yrs)</option>
                        <option value={72}>72 Months (6 yrs)</option>
                        <option value={84}>84 Months (7 yrs)</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Borrower Profile</label>
                    <div className="grid grid-cols-2 p-1 bg-white border border-slate-200 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setCalcUsageType('private')}
                        className={`py-2 text-xs font-bold rounded-lg transition-all text-center cursor-pointer ${
                          calcUsageType === 'private' 
                            ? 'bg-[#8B0000] text-white shadow-xs' 
                            : 'bg-white text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Private
                      </button>
                      <button
                        type="button"
                        onClick={() => setCalcUsageType('business')}
                        className={`py-2 text-xs font-bold rounded-lg transition-all text-center cursor-pointer ${
                          calcUsageType === 'business' 
                            ? 'bg-[#8B0000] text-white shadow-xs' 
                            : 'bg-white text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        Business
                      </button>
                    </div>
                  </div>
                </div>

                {/* Target Serial VIN display */}
                {calcCarVin && (
                  <div className="bg-red-50/50 p-2.5 rounded-xl border border-red-100 flex justify-between items-center text-[10px]">
                    <div className="font-semibold text-[#8B0000]">
                      <span>Mapped VIN: </span>
                      <strong className="font-mono uppercase text-slate-900">{calcCarVin}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCalcCarVin('')}
                      className="text-red-650 hover:font-bold text-[10px]"
                    >
                      Clear
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isComparingOffers}
                  className="w-full bg-[#8B0000] hover:bg-[#9a0a0a] text-white font-extrabold uppercase py-3.5 rounded-xl text-xs tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 border border-transparent shadow-[0px_4px_12px_rgba(139,0,0,0.15)] active:translate-y-[1px] disabled:opacity-80"
                >
                  {isComparingOffers ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Querying Regional Ledgers...</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4 text-white" />
                      <span>Compare Rates Across {calcCountry.toUpperCase()} Banks</span>
                    </>
                  )}
                </button>
              </form>

              {/* Offer Results Right */}
              <div className="lg:col-span-7 space-y-4">
                {comparedOffers.length === 0 ? (
                  <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center bg-white space-y-1.5">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800 text-xs">No Query Results Compiled Yet</h4>
                      <p className="text-[10px] text-slate-500 max-w-xs mx-auto leading-normal">
                        Adjust parameters in the Rate Comparison Matrix on the left and dispatch queries directly to cross-border underwriting banks.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                        Accredited Bank Offers In {calcCountry}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {comparedOffers.map((offer) => (
                        <div key={offer.id} className="border border-slate-200 bg-white rounded-xl p-4 hover:border-slate-300 transition duration-150 relative overflow-hidden flex flex-col justify-between">
                          
                          {offer.badge && (
                            <span className="absolute top-0 right-0 bg-[#8B0000] text-white text-[7.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-bl">
                              {offer.badge}
                            </span>
                          )}

                          <div className="space-y-3 text-left">
                            <div className="flex items-center gap-2">
                              <span className={`w-2.5 h-2.5 rounded-full ${offer.logoColor}`}></span>
                              <h4 className="font-bold text-slate-900 text-[12px]">{offer.name}</h4>
                            </div>

                            <p className="text-slate-500 text-[10px] leading-relaxed">
                              {offer.description}
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 border-t border-b border-slate-100 py-2.5 text-[10px] font-medium">
                              <div>
                                <span className="text-[8.5px] text-slate-400 block uppercase">Monthly Repay</span>
                                <span className="text-[#8B0000] text-xs font-mono font-bold">${offer.monthlyPayment.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-[8.5px] text-slate-400 block uppercase">Calculated APR</span>
                                <span className={`text-xs font-mono block ${offer.finalApr >= 7.5 ? 'text-amber-600 font-bold' : 'text-[#8B0000] font-bold'}`}>
                                  {offer.finalApr}%
                                </span>
                              </div>
                              <div>
                                <span className="text-[8.5px] text-slate-400 block uppercase">Principal Amount</span>
                                <span className="text-slate-600 font-mono">${offer.principalAmount.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-[8.5px] text-slate-400 block uppercase">Total Repayment</span>
                                <span className="text-slate-600 font-mono">${offer.totalRepayment.toLocaleString()}</span>
                              </div>
                            </div>

                            {/* Requirements box */}
                            <div className="bg-slate-50 p-2.5 rounded-lg space-y-0.5 text-[9.5px] text-slate-600">
                              <strong className="text-slate-700 block uppercase tracking-wider text-[7.5px]">Mandated Approval Requirements:</strong>
                              <ul className="list-disc pl-3.5 space-y-0.5">
                                {offer.approvalRequirements.map((req: string, idx: number) => (
                                  <li key={idx}>{req}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="mt-2.5 pt-1.5 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedOfferToSign(offer);
                                setIsSignCanvasActive(true);
                              }}
                              className="bg-[#8B0000] hover:bg-[#a60c0c] text-white font-bold uppercase text-[9px] py-1.5 px-3 rounded transition flex items-center gap-1 cursor-pointer"
                            >
                              <span>Apply &amp; Sign Agreement</span>
                              <FileSignature className="w-3 h-3 text-white" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: LEASING OFFERS SECTION */}
        {activeTab === 'leasing' && (
          <motion.div
            key="lease-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Split calculator structure */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Leasing Params Left */}
              <div className="lg:col-span-5 border border-slate-200 p-4 bg-white rounded-xl space-y-3.5 text-left">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded bg-red-50 text-[#8B0000] flex items-center justify-center animate-pulse">
                    <TrendingUp className="w-4 h-4 text-[#8B0000]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">Leasing Custom Config</h3>
                  </div>
                </div>

                {/* Pre-fill Option */}
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Pre-fill via Vehicle selection</span>
                  <div className="grid grid-cols-2 gap-1">
                    {VEHICLES.slice(0, 4).map((car) => (
                      <button
                        key={car.vin}
                        type="button"
                        onClick={() => setLeaseVehiclePrice(car.price)}
                        className={`text-[8px] font-bold py-1 px-1.5 rounded border transition-all text-left truncate flex justify-between cursor-pointer ${
                          leaseVehiclePrice === car.price 
                            ? 'bg-[#8B0000] text-white border-transparent' 
                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-350'
                        }`}
                      >
                        <span>{car.make} {car.model}</span>
                        <span className="font-mono opacity-80">${Math.round(car.price/1000)}k</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Capital Value Price Slider */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase flex justify-between">
                    <span>Target Car Price</span>
                    <span className="font-mono text-slate-800 text-[10.5px] font-bold">${leaseVehiclePrice.toLocaleString()}</span>
                  </label>
                  <input
                    type="range"
                    min="15000"
                    max="180000"
                    step="5000"
                    value={leaseVehiclePrice}
                    onChange={(e) => setLeaseVehiclePrice(Number(e.target.value))}
                    className="w-full accent-[#8B0000] h-1.5 bg-slate-200 rounded cursor-pointer"
                  />
                </div>

                {/* Downpayment Percentage */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-500 uppercase flex justify-between">
                    <span>Lease Downpayment ({leaseDownpaymentPct}%)</span>
                    <span className="font-mono text-slate-800 text-[10.5px] font-bold">
                      ${computedLeaseOutputs.downpaymentVal.toLocaleString()}
                    </span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    step="5"
                    value={leaseDownpaymentPct}
                    onChange={(e) => setLeaseDownpaymentPct(Number(e.target.value))}
                    className="w-full accent-[#8B0000] h-1.5 bg-slate-200 rounded cursor-pointer"
                  />
                </div>

                {/* Term */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-450 uppercase">Lease Term Period</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[24, 36, 48].map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setLeaseTermMonths(term)}
                        className={`py-1 text-[10px] font-bold rounded border transition duration-150 cursor-pointer ${
                          leaseTermMonths === term 
                            ? 'bg-[#8B0000] text-white border-transparent shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {term} Mo ({term / 12} yrs)
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mileage Limit */}
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Annual Mileage Limit Allowance</label>
                  <select
                    className="w-full text-[10px] p-2 rounded border border-slate-200 bg-white font-semibold text-slate-700"
                    value={leaseAnnualMileageLimit}
                    onChange={(e) => setLeaseAnnualMileageLimit(Number(e.target.value))}
                  >
                    <option value={7500}>7,500 mpy (Low usage)</option>
                    <option value={10000}>10,000 mpy (Occasional commute)</option>
                    <option value={12000}>12,000 mpy (Standard commute)</option>
                    <option value={15000}>15,000 mpy (Active driver)</option>
                    <option value={20000}>20,000 mpy (Commercial transits)</option>
                  </select>
                </div>

                {/* Calculation Info Note */}
                <div className="bg-slate-50 p-2.5 rounded text-[9px] text-slate-500 leading-normal flex items-start gap-1">
                  <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>Residual purchase option is set after term completion based on typical depreciation curves (ranging from 44% to 62% initial value).</span>
                </div>
              </div>

              {/* Lease Calculation Outputs Right */}
              <div className="lg:col-span-7 space-y-4">
                <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-4 text-left">
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-[8px] font-bold text-[#8B0000] bg-red-50 px-2 py-0.5 rounded inline-block uppercase font-mono tracking-wider mb-1">
                      Acquisition Forecast Matrix
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">Calculated Residual Leasing Breakdown</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 space-y-1">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Estimated Lease Cost</span>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xl font-bold text-slate-900 font-mono">${computedLeaseOutputs.finalMonthlyLeasePrice}</span>
                        <span className="text-[9.5px] text-slate-400">/ month</span>
                      </div>
                      <p className="text-[9px] text-slate-500 leading-normal">
                        Subject to credit review. Excludes local VAT registry fees in Lithunia/Germany.
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-150 space-y-1">
                      <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Residual Value Option</span>
                      <div className="flex items-baseline gap-0.5">
                        <span className="text-xl font-bold text-slate-900 font-mono">${computedLeaseOutputs.residualVal.toLocaleString()}</span>
                      </div>
                      <p className="text-[9px] text-slate-500 leading-normal">
                        Value guaranteed to purchase vehicle outright once the payment term ends completely.
                      </p>
                    </div>

                  </div>

                  <div className="bg-slate-50/50 p-3 rounded-lg border border-slate-150 space-y-2 text-[10px] text-slate-700">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Acquisition Document Fee:</span>
                      <span className="font-mono text-slate-800 font-bold">${computedLeaseOutputs.acquisitionFee}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Initial Downpayment Capital:</span>
                      <span className="font-mono text-slate-800 font-bold">${computedLeaseOutputs.downpaymentVal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Total Sum Payments &amp; Interest:</span>
                      <span className="font-mono text-slate-800 font-bold">${computedLeaseOutputs.totalPaymentsInterest.toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-slate-200"></div>
                    <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-900">
                      <span>Incurred Term Interest:</span>
                      <span className="font-mono text-[#8B0000]">~4.85% fixed money factor</span>
                    </div>
                  </div>

                  {leaseInquirySubmitted ? (
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="text-[10px] font-bold text-emerald-800">
                        <h4>Leasing Inquiry Filed Successfully!</h4>
                        <p className="font-normal text-emerald-700 mt-0.5">Sovereign fleet advisers will prepare documentation files shortly.</p>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setLeaseInquirySubmitted(true);
                        setTimeout(() => setLeaseInquirySubmitted(false), 5100);
                      }}
                      className="w-full bg-[#8B0000] hover:bg-[#a60c0c] text-white font-bold uppercase text-[10px] py-2 rounded transition cursor-pointer text-center"
                    >
                      Dispatch Digital Lease Inquiry Packet
                    </button>
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 3: SIGNED AGREEMENTS VAULT & AI STUDY */}
        {activeTab === 'vault' && (
          <motion.div
            key="vault-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 text-left"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-[#8B0000]" />
                  Secure Agreement Document Vault
                </h3>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={triggerManualDocumentImport}
                  className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-[9px] uppercase py-1 px-2.5 rounded transition cursor-pointer flex items-center gap-1.5 border border-slate-200"
                >
                  <Download className="w-3 h-3" />
                  <span>Import External Agreement</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Agreements Storage List (7/12) */}
              <div className="lg:col-span-7 space-y-3">
                {agreements.length === 0 ? (
                  <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center bg-white">
                    <p className="text-slate-500 font-semibold text-[10.5px]">No signed agreements registered in vault ledger yet.</p>
                  </div>
                ) : (
                  agreements.map((agr) => {
                    // Check linked status
                    const isLinked = linkedVehicleMap[agr.vehicleVin.toUpperCase()] !== undefined;

                    return (
                      <div key={agr.id} className="border border-slate-200 bg-white rounded-xl p-4 space-y-3 transition-all relative overflow-hidden text-left">
                        
                        {/* Expiry / Status flags */}
                        <div className="flex justify-between items-start">
                          <div className="space-y-0.5">
                            <span className="text-[9px] font-bold text-slate-400 block uppercase font-mono tracking-wider">{agr.id}</span>
                            <h4 className="font-bold text-slate-900 text-[11px] flex items-center gap-1">
                              {agr.providerName} Match
                              {isLinked && (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[7.5px] font-bold px-1.5 py-0.5 rounded uppercase font-mono flex items-center gap-1 animate-pulse">
                                  <Link className="w-2.5 h-2.5 text-emerald-650" /> Title Lien Linked
                                </span>
                              )}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-mono">VIN: {agr.vehicleVin}</p>
                          </div>

                          <div className="text-right">
                            <span className="text-[14px] font-bold font-mono text-[#8B0000] block">${agr.monthlyPayment}/mo</span>
                            <span className="text-[9px] text-slate-400 block">{agr.termMonths} months • {agr.interestRate}% APR</span>
                          </div>
                        </div>

                        {/* Agreement details layout */}
                        <div className="bg-slate-50 border border-slate-100 rounded p-2.5 space-y-1.5 font-medium text-[10px] text-slate-650">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Target Vehicle Model:</span>
                            <span className="text-slate-900 font-bold">{agr.vehicleName}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Principal Collateral:</span>
                            <strong className="text-slate-800 font-mono">${agr.principalAmount.toLocaleString()}</strong>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-slate-400">Ex exclusions:</span>
                            <span className="text-slate-605 text-[9.5px] truncate max-w-[200px]">{agr.aiSummary?.exclusions.join(', ')}</span>
                          </div>
                        </div>

                        {/* Link to Vehicle Garage Wallet mechanics */}
                        <div className="border-t border-slate-100 pt-2.5 flex flex-wrap gap-2 justify-between items-center">
                          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                            <FileText className="w-3.5 h-3.5" />
                            <span className="font-mono underline text-[9.5px] block truncate max-w-[150px]">{agr.documentName}</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleVehicleLienLinkage(agr.vehicleVin, agr.providerName, agr.id)}
                            className={`text-[8.5px] font-bold uppercase py-1 px-2.5 rounded transition cursor-pointer flex items-center gap-1 border ${
                              isLinked 
                                ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100' 
                                : 'bg-[#8B0000] text-white border-transparent hover:bg-[#a60c0c]'
                            }`}
                          >
                            {isLinked ? (
                              <>
                                <X className="w-3 h-3 text-amber-700" />
                                <span>Unlink Registry Lien</span>
                              </>
                            ) : (
                              <>
                                <Link className="w-3 h-3 text-white" />
                                <span>Link approved financing to vehicle</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* AI Agreement Analyzers & Risks RIGHT (5/12) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded bg-red-50 text-[#8B0000] flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[#8B0000]" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Neural Agreement Study</h3>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                    Our AI automatically matches APR ranges, hidden default guidelines, balloon payment margins, and regional registration exclusions. Below is the live warning output summary:
                  </p>

                  <div className="space-y-2.5">
                    {agreements.map((agr) => {
                      const isHighApr = agr.aprClass === 'high';
                      const isMedApr = agr.aprClass === 'medium';

                      return (
                        <div key={`study-${agr.id}`} className={`border rounded-lg p-3 space-y-2 text-[10px] leading-relaxed ${
                          isHighApr ? 'bg-red-50/50 border-red-100' : isMedApr ? 'bg-amber-50/50 border-amber-100' : 'bg-emerald-50/50 border-emerald-100'
                        }`}>
                          <div className="flex justify-between items-center text-[8.5px] font-bold">
                            <span className="text-slate-800 uppercase font-mono tracking-wider">{agr.providerName} summary</span>
                            <span className={`px-2 py-0.5 rounded uppercase font-mono ${
                              isHighApr ? 'bg-red-100 text-[#8B0000]' : isMedApr ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {agr.aprClass.toUpperCase()} APR ALERT
                            </span>
                          </div>

                          <p className="text-[10px] text-slate-655 font-semibold text-slate-600">{agr.aiSummary?.summaryText}</p>

                          {agr.aiSummary?.riskFlags && agr.aiSummary.riskFlags.length > 0 && (
                            <div className="space-y-1 pt-0.5">
                              {agr.aiSummary.riskFlags.map((risk, idx) => (
                                <div key={idx} className="flex items-start gap-1 text-[9px] font-bold">
                                  <ShieldAlert className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isHighApr ? 'text-[#8B0000]' : 'text-amber-600'}`} />
                                  <span className={isHighApr ? 'text-red-800' : 'text-amber-800'}>{risk}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Simulated Vehicle garage linkages statuses overview */}
                <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2.5">
                  <h4 className="text-[10px] font-bold uppercase text-slate-700 tracking-wider">Lien Holder Titles Registry</h4>
                  <p className="text-[9.5px] text-slate-400 leading-normal">Regional customs registry database holdings matching your cars:</p>
                  
                  <div className="space-y-1.5 text-[10px] font-semibold">
                    {VEHICLES.slice(0, 3).map((car) => {
                      const lienHolder = linkedVehicleMap[car.vin.toUpperCase()];
                      return (
                        <div key={car.vin} className="bg-slate-50 border border-slate-100 rounded p-2 flex justify-between items-center">
                          <div>
                            <span className="text-slate-700 block text-[10.5px] font-bold">{car.make} {car.model}</span>
                          </div>
                          <div>
                            {lienHolder ? (
                              <span className="text-[#8B0000] text-[9.5px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                                <Building className="w-3 h-3 text-[#8B0000]" /> LIEN BY: {lienHolder.indexOf(' ') > 0 ? lienHolder.split(' ')[0] : lienHolder}
                              </span>
                            ) : (
                              <span className="text-emerald-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                                <CheckSquare className="w-3 h-3 text-emerald-500" /> UNENCUMBERED
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* MODAL: SIGNING FLOW SANDBOX */}
      {selectedOfferToSign && isSignCanvasActive && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-left">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-2xl w-full space-y-6 relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => {
                setSelectedOfferToSign(null);
                setIsSignCanvasActive(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-805 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-3">
              <span className="text-[9px] font-black text-[#8B0000] bg-red-50 border border-red-150 px-2.5 py-1 rounded inline-block uppercase tracking-wider mb-2">
                Digital Agreement Signature Sandbox
              </span>
              <h3 className="text-lg font-black text-slate-905 tracking-tight">
                Authorize Vehicle Financing Contract for {selectedOfferToSign.name}
              </h3>
              <p className="text-xs text-slate-400 font-semibold font-mono">PRINCIPAL LINE: ${(calcCarPrice - calcDownPayment).toLocaleString()} • APR RATE: {selectedOfferToSign.finalApr}%</p>
            </div>

            <form onSubmit={executeFinancingSigningProcess} className="space-y-4">
              <div className="space-y-2 text-xs leading-relaxed text-slate-550 border rounded-xl p-4 bg-slate-50 max-h-40 overflow-y-auto font-medium">
                <span className="font-bold text-slate-800 block text-[10px] uppercase">COVENANT EXCLUSION TERMS DECLARATION:</span>
                <p>1. The Borrower agrees to pay standard compounding monthly interest installments of <b>${selectedOfferToSign.monthlyPayment}</b> for a continuous execution span of <b>{calcTermMonths} months</b> into the regional clearing accounts of {selectedOfferToSign.name}.</p>
                <p>2. Collateral possession remains tied. Transferring this asset beyond national cross-border customs queues (e.g. Lithuania/Germany exits) without banking written waiver logs triggers immediate defaults.</p>
                <p>3. Default occurrences matching late payments beyond 30 consecutive days authorize the Lender to begin standard vehicle repossession protocols under applicable state law.</p>
                <p>4. <b>Exclusions details:</b> {selectedOfferToSign.approvalRequirements.join(', ')}</p>
              </div>

              {/* Signature parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Signee Human Name */}
                <div className="space-y-1 text-xs">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Write Full Owner Signee Legal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Algirdas Brazauskas"
                    className="w-full text-xs font-bold p-3 rounded-xl border border-slate-200 outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                  />
                </div>

                {/* Terms Accept */}
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="accept-terms-check"
                    required
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 accent-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="accept-terms-check" className="text-[10.5px] font-bold text-slate-600 leading-tight">
                    I accept contract exclusions, APR rates &amp; Baltic repository holds.
                  </label>
                </div>

              </div>

              {/* Digital drawing canvas mock signature */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase flex justify-between">
                  <span>Sign manually using mouse or touch scroll:</span>
                  <button
                    type="button"
                    onClick={clearSignatureCanvas}
                    className="text-red-650 hover:underline text-[9px]"
                  >
                    Clear Slate
                  </button>
                </label>
                
                <div className="border border-slate-200 rounded-xl bg-slate-55 relative h-32 overflow-hidden bg-slate-50">
                  <canvas
                    onMouseDown={handleSignMouseDown}
                    onMouseMove={handleSignMouseMove}
                    onMouseUp={handleSignMouseUp}
                    onMouseLeave={handleSignMouseUp}
                    className="w-full h-full cursor-crosshair relative z-10"
                  />
                  {signPoints.length > 0 ? (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                      <path
                        d={signPoints.join(' ')}
                        fill="none"
                        stroke="#1e3a8a"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-300 text-xs font-bold font-mono">
                      <PenTool className="w-5 h-5 opacity-40 mr-1.5" /> DRAW SIGNATURE IN THIS BOX
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={signingInProgress || !termsAccepted || signPoints.length === 0}
                className="w-full bg-[#8B0000] hover:bg-slate-900 text-white font-black uppercase text-xs tracking-wider py-4 rounded-xl transition cursor-pointer flex justify-center items-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {signingInProgress ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Seeding digital certificate audit...</span>
                  </>
                ) : (
                  <>
                    <FileSignature className="w-4 h-4 text-white" />
                    <span>Authorize &amp; Dispatch Certified PDF Lease</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Bottom Certifications Row */}
      <div className="pt-10 space-y-6">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
          Accredited cross-border financing partnerships
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center opacity-80 hover:opacity-100 transition duration-300 max-w-4xl mx-auto text-center font-black tracking-tighter text-slate-700 font-display text-sm">
          <div className="flex items-center justify-center p-5 bg-white rounded-2xl shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-1 hover:scale-[1.03] transition-all duration-300 border border-black/[0.03] cursor-pointer">
            LIETUVOS BANKAS
          </div>
          <div className="flex items-center justify-center p-5 bg-white rounded-2xl shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-1 hover:scale-[1.03] transition-all duration-300 border border-black/[0.03] cursor-pointer">
            DEUTSCHE BUNDESBANK
          </div>
          <div className="flex items-center justify-center p-5 bg-white rounded-2xl shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-1 hover:scale-[1.03] transition-all duration-300 border border-black/[0.03] cursor-pointer">
            SOVEREIGN BALTIC CAP
          </div>
          <div className="flex items-center justify-center p-5 bg-white rounded-2xl shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-1 hover:scale-[1.03] transition-all duration-300 border border-black/[0.03] cursor-pointer">
            USA CHASE CO
          </div>
          <div className="flex items-center justify-center p-5 bg-white rounded-2xl shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-1 hover:scale-[1.03] transition-all duration-300 border border-black/[0.03] cursor-pointer font-mono text-[10px] text-emerald-600">
            SLA APPROVED 99.9%
          </div>
        </div>
      </div>

    </div>
  );
}

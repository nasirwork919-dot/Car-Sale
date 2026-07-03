import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, ShieldCheck, AlertTriangle, FileText, Upload, Plus, Search, 
  Trash2, ArrowRight, CheckCircle2, X, RefreshCw, Landmark, Briefcase, 
  Activity, Sparkles, Layers, ShieldAlert, FileSearch, BadgeInfo, Scale, 
  TrendingUp, Cpu, Check, ExternalLink, HelpCircle, FileSignature, LogIn,
  DollarSign, Users, Building, AlertCircle, Copy, Lock, Settings, Terminal, Car, Clock
} from 'lucide-react';
import { VEHICLES } from '../data';
import { Vehicle } from '../types';

// Types for our Insurance platform
export interface InsuranceProvider {
  id: string;
  name: string;
  logoColor: string;
  rating: number;
  baseMonthlyPremium: number;
  specialties: string[];
  badges: string[];
  description: string;
  isAIProfileDraft: boolean;
  status: 'Draft' | 'Active' | 'Under Review';
  fileUploadedName?: string;
  approvedBy?: string;
}

export interface UserVehiclePolicy {
  id: string;
  vehicleVin: string;
  vehicleName: string;
  providerId: string;
  providerName: string;
  policyNumber: string;
  coverageType: 'Liability' | 'Comprehensive' | 'Collision' | 'Premium Comprehensive';
  deductible: number;
  limitAmount: number;
  mileageLimit: number;
  startDate: string;
  endDate: string; // Expiration checks
  exclusions: string[];
  status: 'Active' | 'Expiring Soon' | 'Expired';
}

export interface InsuranceClaim {
  id: string;
  vehicleName: string;
  policyNumber: string;
  incidentType: string;
  requestedAmount: number;
  claimDate: string;
  status: 'Pending' | 'Approved' | 'Denied' | 'Under Investigation';
  evidenceScore: number; // 0-100%
  description: string;
}

export interface QuoteComparisonResult {
  providerId: string;
  providerName: string;
  logoColor: string;
  monthlyPremium: number;
  annualPremium: number;
  coverageDetails: string;
  deductible: number;
  badges: string[];
}

export default function InsurancePlatform() {
  // Navigation Tabs at the Top
  // 'directory': Directory & Calculator
  // 'analyzer': AI Policy Analyzer
  // 'insurer_dashboard': Insurance Company Dashboard
  const [activeTab, setActiveTab] = useState<'directory' | 'analyzer' | 'insurer_dashboard'>('directory');

  // Directory Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('All');

  // Selected Provider Details Modal State
  const [selectedProvider, setSelectedProvider] = useState<InsuranceProvider | null>(null);

  // States for 'Build Profile via AI' (draft upload) inside Directory
  const [isBuildingProfile, setIsBuildingProfile] = useState(false);
  const [aiUploadedFileName, setAiUploadedFileName] = useState('');
  const [aiDocContent, setAiDocContent] = useState('');
  const [aiAnalysisSuccess, setAiAnalysisSuccess] = useState(false);

  // Initial State: Pre-seeded Insurance Providers
  const [providers, setProviders] = useState<InsuranceProvider[]>([
    {
      id: 'prov-chubb',
      name: 'Chubb Elite Luxury Auto',
      logoColor: 'bg-indigo-600',
      rating: 4.9,
      baseMonthlyPremium: 145,
      specialties: ['Luxury & Exotics', 'High-Valuation Guaranteed', 'Mixed'],
      badges: ['Claims-Approved Network', 'SLA Partner 99%', 'Direct-Billing Certified'],
      description: 'Chubb is the world’s largest publicly traded property and casualty insurance company. Renowned for white-glove service, original OEM replacement parts guaranteed, and rapid claims validation pipelines for luxury high-end supercars.',
      isAIProfileDraft: false,
      status: 'Active'
    },
    {
      id: 'prov-ergo',
      name: 'ERGO Global & Fleet Care',
      logoColor: 'bg-[#8B0000]',
      rating: 4.8,
      baseMonthlyPremium: 98,
      specialties: ['Commercial Vehicles', 'Mixed', 'High-Valuation Guaranteed'],
      badges: ['Sovereign Title Verified', 'Claims-Approved Network', 'Digital Token Escrow'],
      description: 'Specializing in European commercial transport routes, high-mileage mixed catalogs, and corporate fleet integrations. Provides API auto-sync reporting directly into logistics tracking dashboards.',
      isAIProfileDraft: false,
      status: 'Active'
    },
    {
      id: 'prov-allstate',
      name: 'Allstate Prestige Guard',
      logoColor: 'bg-emerald-600',
      rating: 4.7,
      baseMonthlyPremium: 72,
      specialties: ['Mixed', 'Daily Commuters'],
      badges: ['Claims-Approved Network', 'Eco-Mileage Discount'],
      description: 'Comprehensive coverage tailored to day-to-day driving habits. Integrates directly with state safety log tracking to provide automated discounts for cautious driver categories.',
      isAIProfileDraft: false,
      status: 'Active'
    },
    {
      id: 'prov-statefarm',
      name: 'State Farm Direct Network',
      logoColor: 'bg-blue-600',
      rating: 4.6,
      baseMonthlyPremium: 65,
      specialties: ['Daily Commuters', 'Mixed'],
      badges: ['Widespread Repair Cert', 'Direct-Billing Certified'],
      description: 'Value-first premium structures backed by America’s largest automotive repair accreditation pool. Enjoy near-instant diagnostics approval in over 15,000 certified mechanics shop centers.',
      isAIProfileDraft: false,
      status: 'Active'
    },
    {
      id: 'prov-draft-zenith',
      name: 'Zenith Premium Safe (AI Compiled)',
      logoColor: 'bg-amber-600',
      rating: 4.8,
      baseMonthlyPremium: 110,
      specialties: ['Mixed', 'Luxury & Exotics'],
      badges: ['Claims-Approved Network', 'AI Pre-Audited'],
      description: 'DRAFT PROFILE built via uploaded zenith-corporate-branding.pdf. Features an automated coverage multiplier matching low-emissions vehicles.',
      isAIProfileDraft: true,
      status: 'Under Review',
      fileUploadedName: 'zenith-corporate-branding.pdf'
    }
  ]);

  // Initial State: Active User Policies on their personal/business vehicles
  const [userPolicies, setUserPolicies] = useState<UserVehiclePolicy[]>([
    {
      id: 'pol-01',
      vehicleVin: 'WP0AB2A92MS299212',
      vehicleName: 'Porsche 911 Carrera S',
      providerId: 'prov-chubb',
      providerName: 'Chubb Elite Luxury Auto',
      policyNumber: 'CH-AUTO-9118',
      coverageType: 'Premium Comprehensive',
      deductible: 500,
      limitAmount: 150000,
      mileageLimit: 5000,
      startDate: '2025-06-15',
      endDate: '2026-06-15', // Close to expiry (assuming date is mid-June 2026)
      exclusions: ['Competitive track racing events', 'Modified ECU diagnostics', 'Unregistered secondary drivers'],
      status: 'Expiring Soon'
    },
    {
      id: 'pol-02',
      vehicleVin: 'WAUB8AF21MN05XXXX',
      vehicleName: 'Audi RS6 Avant',
      providerId: 'prov-allstate',
      providerName: 'Allstate Prestige Guard',
      policyNumber: 'AL-RS6-0199',
      coverageType: 'Comprehensive',
      deductible: 1000,
      limitAmount: 95000,
      mileageLimit: 12000,
      startDate: '2025-01-01',
      endDate: '2025-12-31', // Already expired!
      exclusions: ['Cross-border transport without prior log filing', 'Severe off-road terrain traversal'],
      status: 'Expired'
    },
    {
      id: 'pol-03',
      vehicleVin: 'WBA53BJ0XPX881270',
      vehicleName: 'BMW M5 Competition',
      providerId: 'prov-ergo',
      providerName: 'ERGO Global & Fleet Care',
      policyNumber: 'ER-M5-8821',
      coverageType: 'Collision',
      deductible: 1500,
      limitAmount: 110000,
      mileageLimit: 15000,
      startDate: '2025-09-01',
      endDate: '2027-09-01', // Active
      exclusions: ['Mechanical transmission burnout', 'Non-authorized valet parking damage'],
      status: 'Active'
    }
  ]);

  // Initial State: Insurers Dashboard Claims Track
  const [claims, setClaims] = useState<InsuranceClaim[]>([
    {
      id: 'CLM-7841',
      vehicleName: 'Audi RS6 Avant (WAUB8A...)',
      policyNumber: 'AL-RS6-0199',
      incidentType: 'Collision: Rear Bumper collision during reverse parking',
      requestedAmount: 4850,
      claimDate: '2026-06-12',
      status: 'Pending',
      evidenceScore: 89,
      description: 'Photos uploaded showing verified dent. Paint thickness sensor data matches collision angle. Police incident report hash attached.'
    },
    {
      id: 'CLM-0428',
      vehicleName: 'Porsche 911 Carrera S (WP0AB2...)',
      policyNumber: 'CH-AUTO-9118',
      incidentType: 'Glass: Highway gravel chip on front windshield',
      requestedAmount: 1850,
      claimDate: '2026-04-18',
      status: 'Approved',
      evidenceScore: 95,
      description: 'Full ADAS sensor recalibration and certified premium glass replacement at authorized state partner garage.'
    },
    {
      id: 'CLM-5912',
      vehicleName: 'Tesla Model S Plaid (5YJSA1...)',
      policyNumber: 'UNBOUND',
      incidentType: 'Suspicious claim: Complete battery failure log discrepancy',
      requestedAmount: 12000,
      claimDate: '2026-05-30',
      status: 'Under Investigation',
      evidenceScore: 18,
      description: 'Battery diagnostic telemetry log shows overheating caused by repetitive illegal drag races. Prohibited by standard terms.'
    }
  ]);

  // Initial States for general customer interactions
  const [interactions, setInteractions] = useState([
    { id: 1, customer: 'Liam Neeson', topic: 'Coverage limit extension query', date: '2026-06-15', urgent: true, replyText: '' },
    { id: 2, customer: 'Sophia Loren', topic: 'Direct-billing verification for ERGO', date: '2026-06-16', urgent: false, replyText: '' }
  ]);

  // States for API-based Quote Calculator Widget
  const [calcVin, setCalcVin] = useState('');
  const [calcVehicleDetails, setCalcVehicleDetails] = useState({
    year: 2023,
    make: 'Tesla',
    model: 'Model Y',
    price: 52000,
    riskScore: 'Low' as 'Low' | 'Medium' | 'High',
  });
  const [calcDriverAge, setCalcDriverAge] = useState<number>(30);
  const [calcAnnualMileage, setCalcAnnualMileage] = useState<number>(10000);
  const [calcCoverageType, setCalcCoverageType] = useState<'Liability' | 'Comprehensive' | 'Collision' | 'Premium Comprehensive'>('Comprehensive');
  
  const [isComparingQuotes, setIsComparingQuotes] = useState(false);
  const [quoteResults, setQuoteResults] = useState<QuoteComparisonResult[]>([]);
  const [quoteSelectedMessage, setQuoteSelectedMessage] = useState<string | null>(null);

  // States for AI Policy Analyzer Tool
  const [analyzerManualText, setAnalyzerManualText] = useState('');
  const [analyzerUploadedFile, setAnalyzerUploadedFile] = useState<File | null>(null);
  const [analyzerUploadedFileName, setAnalyzerUploadedFileName] = useState('');
  const [qrScannedNotification, setQrScannedNotification] = useState(false);
  const [isAnalyzingPolicy, setIsAnalyzingPolicy] = useState(false);
  const [analyzerReport, setAnalyzerReport] = useState<{
    coverage: string;
    exclusions: string[];
    deductibles: string;
    period: string;
    mileageLimit: string;
    expiryDate: string;
    flaggedRisks: string[];
  } | null>(null);

  // Handle autocomplete of vehicle in calculator via pre-seeded ones
  const handleVinAutocomplete = (vin: string) => {
    setCalcVin(vin);
    const vehicle = VEHICLES.find(v => v.vin.toUpperCase() === vin.toUpperCase() || v.vin.includes(vin));
    if (vehicle) {
      setCalcVehicleDetails({
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model,
        price: vehicle.price,
        riskScore: vehicle.riskScore as any || 'Low',
      });
    }
  };

  // Run Quote Comparison via Simulated API Endpoints
  const handleCompareQuotes = (e: React.FormEvent) => {
    e.preventDefault();
    setIsComparingQuotes(true);
    setQuoteResults([]);

    setTimeout(() => {
      // Calculate premium factor base multipliers
      let ageFactor = 1.0;
      if (calcDriverAge < 25) ageFactor = 1.55; // Young driver risk penalty
      if (calcDriverAge > 65) ageFactor = 1.20; // Elderly driver risk variance

      let vehiclePriceFactor = calcVehicleDetails.price / 40000;
      let riskFactor = calcVehicleDetails.riskScore === 'High' ? 1.6 : calcVehicleDetails.riskScore === 'Medium' ? 1.25 : 0.95;
      let mileageFactor = calcAnnualMileage > 15000 ? 1.3 : calcAnnualMileage > 8000 ? 1.0 : 0.85;

      let coverageMultiplier = 1.0;
      if (calcCoverageType === 'Liability') coverageMultiplier = 0.5;
      if (calcCoverageType === 'Collision') coverageMultiplier = 0.85;
      if (calcCoverageType === 'Premium Comprehensive') coverageMultiplier = 1.4;

      // Filter to only approved / active providers
      const activeProviders = providers.filter(p => p.status === 'Active');

      // Generate customized quotes comparing across all providers (API simulation)
      const results: QuoteComparisonResult[] = activeProviders.map(p => {
        let base = p.baseMonthlyPremium;
        let calculatedMonthly = Math.round(base * ageFactor * vehiclePriceFactor * riskFactor * mileageFactor * coverageMultiplier);
        
        // Custom coverage specifications based on provider specialties
        let coverageDetails = 'Covers road collisions up to actual cash value plus standard rental transport substitute benefit.';
        let deductible = 500;
        
        if (p.id === 'prov-chubb') {
          coverageDetails = 'Ultimate replacement value protection. Guarantees certified manufacturer OEM factory brand elements with immediate roadside towing logs.';
          deductible = 500;
        } else if (p.id === 'prov-ergo') {
          coverageDetails = 'Commercial duty ready. Up to $1M aggregate commercial coverage with multi-vehicle logistics transshipment guard features.';
          deductible = 1000;
        } else if (p.id === 'prov-allstate') {
          coverageDetails = 'Smart drive certified. Features vanishing deductibles state credits matching positive connected sensor scores.';
          deductible = 250;
        } else if (p.id === 'prov-statefarm') {
          coverageDetails = 'Direct payment network. Immediate cash claim authorization for fast mechanical repair workflow matching.';
          deductible = 750;
        }

        return {
          providerId: p.id,
          providerName: p.name,
          logoColor: p.logoColor,
          monthlyPremium: calculatedMonthly,
          annualPremium: Math.round(calculatedMonthly * 12 * 0.9), // 10% discount for annual package
          coverageDetails,
          deductible,
          badges: p.badges
        };
      });

      setQuoteResults(results);
      setIsComparingQuotes(false);
    }, 1500);
  };

  // Bind quote to the selected vehicle and insert as policy
  const handleSelectQuoteAndAttach = (quote: QuoteComparisonResult) => {
    const vinToBind = calcVin || 'WP0AB2A92MS299212';
    const vehicleObj = VEHICLES.find(v => v.vin.toUpperCase() === vinToBind.toUpperCase()) || VEHICLES[0];
    const targetVehicleName = `${vehicleObj.make} ${vehicleObj.model}`;
    const policyNum = `POL-${quote.providerId.substring(5).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPolicy: UserVehiclePolicy = {
      id: `pol-user-${Date.now()}`,
      vehicleVin: vinToBind,
      vehicleName: targetVehicleName,
      providerId: quote.providerId,
      providerName: quote.providerName,
      policyNumber: policyNum,
      coverageType: calcCoverageType,
      deductible: quote.deductible,
      limitAmount: vehicleObj.price * 1.2,
      mileageLimit: calcAnnualMileage,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 31536000000).toISOString().split('T')[0], // 1 year from now
      exclusions: ['Competitive track racing', 'Modified engine chips under 2.5L limits'],
      status: 'Active'
    };

    // Remove any previous policy with the same Vin first to prevent duplicating policy
    setUserPolicies(prev => [newPolicy, ...prev.filter(p => p.vehicleVin !== vinToBind)]);
    setQuoteSelectedMessage(`Successfully Bound! Policy ${policyNum} from ${quote.providerName} is now active on your virtual garage ${targetVehicleName}.`);
    
    // Clear message banner timer
    setTimeout(() => setQuoteSelectedMessage(null), 8000);
  };

  // Upload custom policy / brand manual for 'Build Profile via AI' (draft workflow)
  const handleBuildAIProviderProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiUploadedFileName && !aiDocContent) return;

    setIsBuildingProfile(true);

    setTimeout(() => {
      const generatedId = `prov-ai-${Date.now()}`;
      const name = aiUploadedFileName ? aiUploadedFileName.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ") : "AI Built Sovereign Safe";
      
      const newDraftProvider: InsuranceProvider = {
        id: generatedId,
        name: name.toUpperCase().includes('INSURANCE') ? name : `${name} Insurance`,
        logoColor: 'bg-emerald-705 bg-purple-600',
        rating: 4.8,
        baseMonthlyPremium: 85,
        specialties: ['Luxury & Exotics', 'Mixed'],
        badges: ['AI Pre-Audited', 'Pending Human Audit License'],
        description: `This custom insurance provider profile was built in 1.4 seconds by analyzing ${aiUploadedFileName || 'the pasted document'}. Custom policy factors extracted successfully. Currently pending manual review and approval.`,
        isAIProfileDraft: true,
        status: 'Under Review',
        fileUploadedName: aiUploadedFileName || 'Manual Clipboard Data'
      };

      setProviders(prev => [newDraftProvider, ...prev]);
      setIsBuildingProfile(false);
      setAiAnalysisSuccess(true);
      setAiUploadedFileName('');
      setAiDocContent('');

      setTimeout(() => setAiAnalysisSuccess(false), 5000);
    }, 2000);
  };

  // Runs Mock AI Policy Analyzer parsing structural data with visual loader
  const handleAnalyzePolicyDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const sourceText = analyzerManualText || analyzerUploadedFileName || 'Default Premium Policy Document';
    if (!sourceText) return;

    setIsAnalyzingPolicy(true);
    setAnalyzerReport(null);

    setTimeout(() => {
      // Simulate highly descriptive AI extraction matching user patterns
      setAnalyzerReport({
        coverage: calcCoverageType === 'Premium Comprehensive' ? 'Premium Full Coverage including road hazard, vandalism, towing, and comprehensive glass treatment.' : 'Extended Comprehensive with standard Collision protections.',
        exclusions: [
          'Off-highway competitive trial racing track scenarios without pre-filed permit coordinates.',
          'Damage occurring when the vehicle is operated by drivers under the age of 21 who are not registered on original declaration sheets.',
          'Dumb mechanical engine malfunctions or gearbox fluid leaks not stemming from external direct impact events.'
        ],
        deductibles: '$500 standard deductible per comprehensive claim event. Glass claims eligible for zero-liability discount.',
        period: '12 Months (Standard cycle)',
        mileageLimit: calcAnnualMileage ? `${calcAnnualMileage.toLocaleString()} absolute annual miles` : '15,000 baseline miles cap before mileage charge tier activation.',
        expiryDate: new Date(Date.now() + 31536000000).toLocaleDateString(),
        flaggedRisks: [
          'LOW DEDUCTIBLE RECOGNIZED: Your premium levels are highly optimized but any repeated comprehensive claims below $500 will not clear standard threshold payouts.',
          'YOUTH DISALLOWANCE: Strict exclusions are flagged regarding unlicensed drivers under 21 years old operating this vehicle.'
        ]
      });
      setIsAnalyzingPolicy(false);
    }, 1800);
  };

  // Insurer Dashboard Functions: Approve AI Draft Profiles
  const handleApproveDraft = (draftId: string) => {
    setProviders(prev => prev.map(p => {
      if (p.id === draftId) {
        return {
          ...p,
          isAIProfileDraft: false,
          status: 'Active',
          badges: [...p.badges.filter(b => b !== 'Pending Human Audit License'), 'Claims-Approved Network', 'Approved by Representative'],
          description: p.description.replace('Currently pending manual review and approval.', 'This profile was successfully audited, approved, and authorized into the public directory catalog.')
        };
      }
      return p;
    }));
  };

  // Insurer Dashboard Functions: Delete / Decline Draft
  const handleRejectDraft = (draftId: string) => {
    setProviders(prev => prev.filter(p => p.id !== draftId));
  };

  // Insurer Dashboard Functions: Update Base Premiums
  const handleUpdateBasePremium = (providerId: string, inputVal: string) => {
    const numValue = parseInt(inputVal) || 0;
    setProviders(prev => prev.map(p => p.id === providerId ? { ...p, baseMonthlyPremium: numValue } : p));
  };

  // Insurer Dashboard Functions: Approve Claims
  const handleProcessClaim = (claimId: string, action: 'Approved' | 'Denied' | 'Under Investigation') => {
    setClaims(prev => prev.map(c => c.id === claimId ? { ...c, status: action } : c));
  };

  // Customer Interactions Reply Handler
  const handleSendInteractionReply = (id: number, text: string) => {
    setInteractions(prev => prev.map(i => i.id === id ? { ...i, replyText: text } : i));
  };

  // Filter providers directory
  const filteredProviders = useMemo(() => {
    return providers.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty = specialtyFilter === 'All' || p.specialties.includes(specialtyFilter);
      return matchesSearch && matchesSpecialty;
    });
  }, [providers, searchQuery, specialtyFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 bg-white" id="insurance-suite-root">
      
      {/* Upper Navigation Hero */}
      <div className="relative rounded-xl overflow-hidden bg-white border border-slate-200 text-slate-900 p-5 md:p-6 shadow-sm text-left">
        
        <div className="relative space-y-2 max-w-3xl">
          <h1 id="insurance-portal-heading" className="text-3xl font-extrabold tracking-tight text-slate-950 font-sans">
            Auto Insurance &amp; Policy Ledger
          </h1>
        </div>

        {/* Tab switcher Inside Hero */}
        <div className="relative pt-4 flex flex-wrap gap-2 max-w-[650px]">
          <button
            onClick={() => setActiveTab('directory')}
            className={`py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border ${
              activeTab === 'directory'
                ? 'bg-[#8B0000] text-white border-transparent shadow-xs'
                : 'bg-white text-slate-650 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Insurance Directory &amp; Calc</span>
          </button>

          <button
            onClick={() => setActiveTab('analyzer')}
            className={`py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border ${
              activeTab === 'analyzer'
                ? 'bg-[#8B0000] text-white border-transparent shadow-xs'
                : 'bg-white text-slate-650 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8B0000]" />
            <span>AI Policy Analyzer</span>
          </button>

          <button
            onClick={() => setActiveTab('insurer_dashboard')}
            className={`py-1.5 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer border ${
              activeTab === 'insurer_dashboard'
                ? 'bg-[#8B0000] text-white border-transparent shadow-xs'
                : 'bg-white text-slate-650 hover:bg-slate-50 border-slate-200'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Insurance Dashboard</span>
          </button>
        </div>
      </div>

      {/* Main Container Sections */}
      <AnimatePresence mode="wait">
        {activeTab === 'directory' && (
          <motion.div
            key="directory-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-12 text-left"
          >
            
            {/* 1. Active Expiry Notifications Bar */}
            <div className="bg-white border-l-4 border-[#8B0000] border-y border-r border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-[#8B0000] shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-xs.5 flex items-center gap-2">
                    Active Expiry Warning Checkpulse
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-0.5">
                    Our sovereign ledger found that your Audi RS6 policy **AL-RS6-0199** has completely **EXPIRED** and your Porsche 911 quote is expiring within **30 days**. Use the Comparison Calculator below to update coverage credentials instantly.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  const el = document.getElementById('quotes-estimator-form');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#8B0000] hover:bg-neutral-900 text-white font-bold text-[10px] uppercase px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap"
              >
                Launch Calculator
              </button>
            </div>

            {/* Split layout: Selector Garage Policies LEFT, Quote Estimator Widget RIGHT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* LEFT Column: User Virtual Garage Policies (5/12 grid) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <h3 className="text-xs font-bold text-slate-950 tracking-tight flex items-center gap-1.5 font-display">
                        <Car className="w-4 h-4 text-[#8B0000]" />
                        Active Vehicle Wallet
                      </h3>
                      <p className="text-slate-400 text-[9.5px] font-medium">Your garage coverage profiles and expirations.</p>
                    </div>
                  </div>

                  {quoteSelectedMessage && (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10.5px] font-semibold p-2.5 rounded-lg flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{quoteSelectedMessage}</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    {userPolicies.map((pol) => {
                      const isExpired = pol.status === 'Expired';
                      const isExpiring = pol.status === 'Expiring Soon';

                      return (
                        <div key={pol.id} className="bg-white border border-slate-150 rounded-xl p-3.5 space-y-2.5 shadow-xs relative overflow-hidden">
                          <div className={`absolute top-0 right-0 left-0 h-[3px] ${isExpired ? 'bg-[#8B0000]' : isExpiring ? 'bg-amber-500' : 'bg-slate-300'}`}></div>
                          
                          <div className="flex justify-between items-start pt-1">
                            <div>
                              <h4 className="font-extrabold text-slate-900 text-xs.5">{pol.vehicleName}</h4>
                              <p className="text-slate-400 text-[9px] font-mono select-all">VIN: {pol.vehicleVin}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 border-t border-slate-100 pt-2.5 text-[10px] font-medium text-slate-500">
                            <div>
                              <span className="text-slate-400 block text-[8px] uppercase tracking-tight font-bold">Insurer Brand</span>
                              <span className="text-slate-800 font-bold">{pol.providerName}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[8px] uppercase tracking-tight font-bold">Policy Number</span>
                              <span className="text-slate-800 font-mono font-medium">{pol.policyNumber}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[8px] uppercase tracking-tight font-bold">Coverage Category</span>
                              <span className="text-slate-800">{pol.coverageType}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block text-[8px] uppercase tracking-tight font-bold">Deductible / Period</span>
                              <span className="text-slate-800">${pol.deductible} • {pol.endDate}</span>
                            </div>
                          </div>

                          <div className="bg-slate-50 rounded-lg p-2 text-[9px] text-slate-500 leading-normal">
                            <strong className="text-slate-700">Exclusions:</strong> {pol.exclusions.join(', ')}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Manual Policy Upload Bind */}
                  <div className="border border-dashed border-slate-200 rounded-xl p-3 bg-white space-y-2 hover:border-slate-300 transition-colors">
                    <div className="text-center space-y-1 py-0.5">
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-500">
                        <Upload className="w-4 h-4" />
                      </div>
                      <h4 className="text-[11px] font-bold text-slate-800">Manually Binding External Policy</h4>
                      <p className="text-[9.5px] text-slate-400 font-medium">Match scan paper declarations directly into your vehicle profile.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[9.5px] font-bold">
                      <button 
                        onClick={() => {
                          const fileInput = document.createElement('input');
                          fileInput.type = 'file';
                          fileInput.accept = '.pdf,.doc,.docx,.png';
                          fileInput.onchange = (e: any) => {
                            if (e.target.files?.[0]) {
                              const f = e.target.files[0];
                              // Simulate successful import mapping
                              const mockPolicy: UserVehiclePolicy = {
                                id: `pol-uploaded-${Date.now()}`,
                                vehicleVin: '5YJSA1E4XPF231495',
                                vehicleName: 'Tesla Model S Plaid',
                                providerId: 'prov-allstate',
                                providerName: 'Allstate Prestige Guard',
                                policyNumber: `POL-EXT-${Math.floor(1000 + Math.random() * 9000)}`,
                                coverageType: 'Comprehensive',
                                deductible: 1000,
                                limitAmount: 90000,
                                mileageLimit: 12000,
                                startDate: new Date().toISOString().split('T')[0],
                                endDate: new Date(Date.now() + 31536000000).toISOString().split('T')[0],
                                exclusions: ['Non-registered drivers under 25 years old', 'Track acceleration test runs'],
                                status: 'Active'
                              };
                              setUserPolicies(prev => [mockPolicy, ...prev]);
                              setQuoteSelectedMessage(`Discovered & attached external policy for Tesla Model S Plaid successfully!`);
                              setTimeout(() => setQuoteSelectedMessage(null), 8000);
                            }
                          };
                          fileInput.click();
                        }}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold py-1.5 rounded-lg text-center cursor-pointer flex justify-center items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Select File</span>
                      </button>

                      <button 
                        onClick={() => {
                          setActiveTab('analyzer');
                        }}
                        className="bg-slate-900 hover:bg-neutral-800 text-white font-bold py-1.5 rounded-lg text-center cursor-pointer flex justify-center items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-[#8B0000]" />
                        <span>AI Analyzer</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT Column: Active Insurance Calculator Widget (7/12 grid) */}
              <div className="lg:col-span-7 space-y-4" id="quotes-estimator-form">
                <form onSubmit={handleCompareQuotes} className="border border-slate-200 rounded-xl p-5 bg-white space-y-4 shadow-sm text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-[#8B0000]">
                      <Cpu className="w-4 h-4 text-[#8B0000]" />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-xs.5 text-xs font-bold text-slate-900 tracking-tight font-display">Comparative Insurance Quotes</h3>
                      <p className="text-[11px] text-slate-500">Calculate estimated rates based on driver and vehicle profiles.</p>
                    </div>
                  </div>

                  {/* Pre-fill via Existing Fleet cars */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex flex-wrap gap-1.5">
                      {VEHICLES.slice(0, 4).map((car) => (
                        <button
                          key={car.vin}
                          type="button"
                          onClick={() => handleVinAutocomplete(car.vin)}
                          className={`text-[9.5px] font-bold py-1 px-2.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                            calcVin === car.vin 
                              ? 'bg-[#8B0000] text-white border-transparent' 
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span>{car.make} {car.model}</span>
                          <span className="font-mono bg-slate-100 text-slate-500 px-1 rounded text-[8.5px] font-medium">{car.riskScore}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* VIN Entry */}
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Automotive Serial VIN</label>
                      <input 
                        type="text" 
                        placeholder="e.g. WP0AB2A92MS299212"
                        className="w-full text-[11px] font-mono px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000] font-medium uppercase"
                        value={calcVin} 
                        onChange={(e) => handleVinAutocomplete(e.target.value)}
                      />
                    </div>

                    {/* Driver Age */}
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Primary Driver Age</label>
                      <div className="flex items-center gap-3 bg-white px-3 py-1 rounded-lg border border-slate-200 h-[34px]">
                        <input
                          type="range"
                          min="16"
                          max="90"
                          value={calcDriverAge}
                          onChange={(e) => setCalcDriverAge(Number(e.target.value))}
                          className="flex-1 accent-[#8B0000] h-1 bg-slate-100 rounded-lg cursor-pointer"
                        />
                        <span className="font-mono text-xs font-bold text-slate-800 whitespace-nowrap">{calcDriverAge} yrs</span>
                      </div>
                    </div>

                    {/* Annual Expected Mileage */}
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Annual Expected Mileage</label>
                      <select 
                        className="w-full text-[11px] px-2 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-705 focus:outline-none focus:border-[#8B0000]"
                        value={calcAnnualMileage}
                        onChange={(e) => setCalcAnnualMileage(Number(e.target.value))}
                      >
                        <option value={5000}>Under 5,000 miles (Weekend)</option>
                        <option value={10000}>5,000 – 12,000 miles (Average)</option>
                        <option value={18000}>12,000 – 20,000 (High Mileage)</option>
                        <option value={25000}>Over 20,000 (Commercial)</option>
                      </select>
                    </div>

                    {/* Coverage Category */}
                    <div className="space-y-0.5">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Coverage Tier Package</label>
                      <select 
                        className="w-full text-[11px] px-2 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-705 focus:outline-none focus:border-[#8B0000]"
                        value={calcCoverageType}
                        onChange={(e) => setCalcCoverageType(e.target.value as any)}
                      >
                        <option value="Liability">Liability Only (Legal baseline)</option>
                        <option value="Collision">Collision Standard</option>
                        <option value="Comprehensive">Comprehensive standard</option>
                        <option value="Premium Comprehensive">Premium Comprehensive</option>
                      </select>
                    </div>
                  </div>

                  {/* Bound specifications display */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[10px] text-slate-500 font-medium grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-[8px] uppercase tracking-wider block text-slate-400">Target Vehicle</span>
                      <span className="text-slate-800 font-bold block">{calcVehicleDetails.make} {calcVehicleDetails.model} ({calcVehicleDetails.year})</span>
                    </div>
                    <div>
                      <span className="text-[8px] uppercase tracking-wider block text-slate-400">Valuation catalog baseline</span>
                      <span className="text-slate-800 font-mono font-bold block">${calcVehicleDetails.price.toLocaleString()} • {calcVehicleDetails.riskScore}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isComparingQuotes}
                    className="w-full bg-[#8B0000] hover:bg-neutral-900 text-white font-bold uppercase tracking-wider py-2.5 rounded-lg text-xs transition duration-200 cursor-pointer flex justify-center items-center gap-1.5"
                  >
                    {isComparingQuotes ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                        <span>Calculating Estimates...</span>
                      </>
                    ) : (
                      <>
                        <Scale className="w-3.5 h-3.5 text-white" />
                        <span>Compare Quotes</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Simulated API Quote Results */}
                {quoteResults.length > 0 && (
                  <div className="space-y-3 animate-fadeIn text-left">
                    <div className="flex justify-between items-center px-1">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Available Quotes</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-35 gap-3">
                      {quoteResults.map((quote) => (
                        <div key={quote.providerId} className="border border-slate-205 border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between hover:border-slate-300 hover:bg-white transition-all shadow-xs relative">
                          <div className="space-y-2.5">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${quote.logoColor}`}></span>
                                <h5 className="font-extrabold text-slate-900 text-xs.5 leading-tight">{quote.providerName}</h5>
                              </div>
                              <span className="bg-white border text-blue-800 border-blue-100 text-[9px] font-mono px-1.5 py-0.5 rounded">
                                Deductible ${quote.deductible}
                              </span>
                            </div>

                            <p className="text-[10.5px] text-slate-500 font-medium leading-relaxed">
                              {quote.coverageDetails}
                            </p>

                            {/* Certificates Badge Row */}
                            <div className="flex flex-wrap gap-1">
                              {quote.badges.map((badge, idx) => (
                                <span key={idx} className="text-[8px] font-bold uppercase text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                                  {badge}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-slate-200 mt-3 pt-3 flex items-center justify-between">
                            <div className="text-left">
                              <span className="text-md font-black text-slate-900 font-mono">${quote.monthlyPremium}</span>
                              <span className="text-slate-400 text-[10px] font-semibold">/mo</span>
                            </div>
                            <button
                              onClick={() => handleSelectQuoteAndAttach(quote)}
                              className="bg-neutral-900 text-white text-[9.5px] font-black uppercase py-1.5 px-3 rounded-lg hover:bg-[#8B0000] cursor-pointer transition-all flex items-center gap-1"
                            >
                              <span>Attach Policy</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Insurance Provider Directory Grid */}
            <div className="border-t border-slate-100 pt-8 space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="space-y-0.5 text-left">
                  <h2 className="text-xs.5 text-xs font-bold text-slate-900 tracking-tight font-display flex items-center gap-1.5">
                    <Landmark className="w-4 h-4 text-[#8B0000]" />
                    Accredited Provider Directory
                  </h2>
                  <p className="text-slate-400 text-[10px] font-medium">
                    Review accredited underwriting providers currently directbilling into law-enforcement and registered customs frameworks.
                  </p>
                </div>

                {/* Directory Controls */}
                <div className="flex gap-1.5 w-full md:w-auto">
                  <div className="relative flex-1 md:w-52">
                    <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search providers query..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full text-[11px] pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000]"
                    />
                  </div>

                  <select
                    value={specialtyFilter}
                    onChange={e => setSpecialtyFilter(e.target.value)}
                    className="text-[11px] px-2 py-1.5 border rounded-lg bg-white font-semibold text-slate-650 cursor-pointer focus:outline-none focus:border-[#8B0000]"
                  >
                    <option value="All">All Specialties</option>
                    <option value="Luxury & Exotics">Exotics Specialists</option>
                    <option value="Commercial Vehicles">Commercial Fleet</option>
                    <option value="Daily Commuters">Daily Commuter Saver</option>
                  </select>
                </div>
              </div>

              {/* Providers Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {filteredProviders.map((prov) => {
                  const isDraft = prov.isAIProfileDraft;

                  return (
                    <div 
                      key={prov.id} 
                      className={`border rounded-xl p-4 flex flex-col justify-between text-left transition-all relative ${
                        isDraft 
                          ? 'bg-amber-100/5 border-amber-302 border-dashed shadow-xs' 
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      {/* Flag states for Draft */}
                      {isDraft && (
                        <span className="absolute top-3 right-3 bg-amber-50 text-amber-800 text-[8px] font-bold tracking-wider uppercase px-2 py-0.5 rounded font-mono">
                          AI Draft
                        </span>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-inner ${prov.logoColor}`}>
                            {prov.name[0]}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-905 text-slate-900 text-xs.5 leading-tight">
                              {prov.name}
                            </h4>
                            <span className="text-[9px] text-[#8B0000] font-bold font-mono">
                              ★ {prov.rating} Score
                            </span>
                          </div>
                        </div>

                        <p className="text-[10px] text-slate-500 font-medium leading-normal">
                          {prov.description}
                        </p>

                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {prov.badges.map((b, i) => (
                            <span 
                              key={i} 
                              className={`text-[8px] font-bold uppercase inline-flex items-center gap-0.5 px-2 py-0.5 rounded ${
                                isDraft 
                                  ? 'bg-amber-50 text-amber-800' 
                                  : 'bg-slate-50 text-slate-700'
                              }`}
                            >
                              <ShieldCheck className="w-2.5 h-2.5 text-blue-500 shrink-0" />
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between">
                        <div>
                          <span className="text-[8.5px] uppercase block text-slate-400 font-bold">Base Rate</span>
                          <span className="text-xs font-extrabold text-slate-800 font-mono">${prov.baseMonthlyPremium} / Month</span>
                        </div>
                        <button 
                          onClick={() => setSelectedProvider(prov)}
                          className="text-[10px] font-bold text-[#8B0000] hover:text-white border border-[#8B0000] hover:bg-[#8B0000] py-1 px-2.5 rounded transition duration-150 cursor-pointer"
                        >
                          Show Profile
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* DIRECTORY SPECIAL ACTION: Build Profile via AI */}
                <div className="border border-dashed border-red-100 rounded-xl p-4 bg-red-50/10 text-left flex flex-col justify-between min-h-[210px]">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[#8B0000]">
                        <Cpu className="w-4 h-4 text-[#8B0000]" />
                      </div>
                      <h4 className="font-extrabold text-[#8B0000] text-xs font-display tracking-tight">AI Profile Creator</h4>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                      Upload corporate policy manual, or paste unstructured text coverage terms. Our Gemini system will instantly define an accredited card.
                    </p>

                    {aiAnalysisSuccess && (
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-semibold py-1.5 px-2.5 rounded-lg animate-fadeIn font-display">
                        ✓ AI Draft compiled! Go to Dashboard to approve.
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleBuildAIProviderProfile} className="space-y-2 mt-2">
                    <div className="flex gap-1.5">
                      <input 
                        type="text" 
                        placeholder="Company name..."
                        value={aiUploadedFileName}
                        onChange={e => setAiUploadedFileName(e.target.value)}
                        className="flex-1 text-[11px] px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-800 focus:ring-1 focus:ring-[#8B0000] focus:border-[#8B0000] focus:outline-none"
                        required
                        disabled={isBuildingProfile}
                      />
                      <button 
                        type="submit"
                        disabled={isBuildingProfile}
                        className="bg-neutral-900 text-white font-bold hover:bg-[#8B0000] text-[9.5px] uppercase py-1.5 px-3 rounded-lg transition duration-150 cursor-pointer"
                      >
                        {isBuildingProfile ? 'Working...' : 'Build'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            
          </motion.div>
        )}

        {activeTab === 'analyzer' && (
          <motion.div
            key="analyzer-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-12 text-left"
          >
            {/* AI Policy Analyzer Tool Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Manual input column */}
              <div className="lg:col-span-5 space-y-4">
                <form onSubmit={handleAnalyzePolicyDocument} className="border border-slate-200 bg-white rounded-xl p-4 space-y-4 shadow-xs">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-[#8B0000] uppercase tracking-wider flex items-center gap-1 font-mono">
                      <Sparkles className="w-3 h-3" /> High-Utility NLP Processing
                    </span>
                    <h3 className="text-xs.5 text-xs font-bold text-slate-900 font-display tracking-tight">AI Policy Analyzer Engine</h3>
                    <p className="text-[10px] text-slate-400 font-medium leading-normal">
                      Upload scan insurance papers or paste clauses. Our interpreter decodes deductible layers, and warnings.
                    </p>
                  </div>

                  {/* Drag-drop file zone */}
                  <div className="border border-dashed border-slate-200 bg-slate-50 rounded-xl p-4 transition-all hover:border-slate-300">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      
                      {/* Left section: drag-drop & file selection */}
                      <div className="col-span-1 md:col-span-8 flex flex-col justify-center items-center text-center space-y-2.5">
                        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[#8B0000]">
                          <Upload className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10.5px] font-bold text-slate-800 leading-snug">
                            {analyzerUploadedFileName ? `Loaded: ${analyzerUploadedFileName}` : 'Drag & Drop Policy Document'}
                          </p>
                          <span className="text-[9px] text-slate-400 block font-medium">Supports PDF, DOCX, PNG, TXT</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const selector = document.createElement('input');
                            selector.type = 'file';
                            selector.accept = '.pdf,.doc,.docx,.png,.txt';
                            selector.onchange = (e: any) => {
                              if (e.target.files) {
                                setAnalyzerUploadedFile(e.target.files[0]);
                                setAnalyzerUploadedFileName(e.target.files[0].name);
                                setQrScannedNotification(false);
                              }
                            };
                            selector.click();
                          }}
                          className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-[9px] uppercase py-2 px-3.5 rounded-lg cursor-pointer transition shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                        >
                          Choose file
                        </button>
                      </div>

                      {/* Right section: Mobile QR upload (Desktop version only) */}
                      <div className="hidden md:flex col-span-1 md:col-span-4 flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-200/80 pt-4 md:pt-0 md:pl-4 text-center space-y-2">
                        <button
                          type="button"
                          onClick={() => {
                            setAnalyzerUploadedFile(new File([""], "mobile-scanned-policy-911.pdf"));
                            setAnalyzerUploadedFileName("mobile-scanned-policy-911.pdf");
                            setQrScannedNotification(true);
                            // Auto reset notification badge after 4 seconds
                            setTimeout(() => {
                              setQrScannedNotification(false);
                            }, 4000);
                          }}
                          className="p-2 bg-white rounded-xl border border-slate-200/80 shadow-xs relative group cursor-pointer transition-all hover:border-[#8B0000] hover:shadow-md"
                          title="Simulate Mobile Scan"
                        >
                          <div className="absolute inset-0 bg-black/85 text-white rounded-xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center p-1 transition-opacity duration-200 text-center select-none">
                            <span className="text-[8px] font-bold uppercase text-[#8B0000] tracking-wider mb-0.5">Simulate</span>
                            <span className="text-[7px] text-slate-300 font-semibold leading-tight">Mobile Camera Scan</span>
                          </div>
                          
                          {/* Vector QR Code */}
                          <svg className="w-14 h-14 text-slate-800" viewBox="0 0 29 29" fill="currentColor">
                            {/* Position detection patterns */}
                            <rect x="0" y="0" width="7" height="7" />
                            <rect x="1" y="1" width="5" height="5" fill="white" />
                            <rect x="2" y="2" width="3" height="3" />

                            <rect x="22" y="0" width="7" height="7" />
                            <rect x="23" y="1" width="5" height="5" fill="white" />
                            <rect x="24" y="2" width="3" height="3" />

                            <rect x="0" y="22" width="7" height="7" />
                            <rect x="1" y="23" width="5" height="5" fill="white" />
                            <rect x="2" y="24" width="3" height="3" />

                            {/* Center-right alignment anchor */}
                            <rect x="20" y="20" width="5" height="5" />
                            <rect x="21" y="21" width="3" height="3" fill="white" />
                            <rect x="22" y="22" width="1" height="1" />

                            {/* Pixel density dots */}
                            <rect x="9" y="0" width="1" height="1" />
                            <rect x="11" y="0" width="2" height="1" />
                            <rect x="14" y="0" width="1" height="2" />
                            <rect x="17" y="0" width="3" height="1" />
                            <rect x="9" y="2" width="2" height="1" />
                            <rect x="12" y="2" width="1" height="3" />
                            <rect x="15" y="2" width="2" height="1" />
                            <rect x="18" y="2" width="1" height="1" />
                            <rect x="20" y="2" width="1" height="2" />
                            
                            <rect x="8" y="4" width="1" height="2" />
                            <rect x="10" y="5" width="2" height="1" />
                            <rect x="13" y="4" width="3" height="1" />
                            <rect x="17" y="5" width="1" height="3" />
                            <rect x="19" y="4" width="2" height="1" />
                            
                            <rect x="0" y="9" width="2" height="1" />
                            <rect x="3" y="8" width="1" height="2" />
                            <rect x="5" y="9" width="2" height="1" />
                            <rect x="8" y="8" width="3" height="1" />
                            <rect x="12" y="8" width="1" height="3" />
                            <rect x="14" y="9" width="4" height="1" />
                            <rect x="19" y="8" width="1" height="2" />
                            <rect x="21" y="9" width="3" height="1" />
                            <rect x="25" y="8" width="2" height="2" />
                            
                            <rect x="1" y="11" width="1" height="3" />
                            <rect x="3" y="12" width="2" height="1" />
                            <rect x="6" y="11" width="1" height="2" />
                            <rect x="8" y="12" width="3" height="1" />
                            <rect x="12" y="12" width="2" height="1" />
                            <rect x="15" y="11" width="1" height="3" />
                            <rect x="17" y="12" width="3" height="1" />
                            <rect x="21" y="11" width="2" height="1" />
                            <rect x="24" y="12" width="1" height="3" />
                            <rect x="26" y="11" width="3" height="1" />

                            <rect x="0" y="15" width="3" height="1" />
                            <rect x="4" y="14" width="1" height="2" />
                            <rect x="6" y="15" width="2" height="1" />
                            <rect x="9" y="14" width="1" height="3" />
                            <rect x="11" y="15" width="3" height="1" />
                            <rect x="15" y="15" width="2" height="1" />
                            <rect x="18" y="14" width="1" height="2" />
                            <rect x="20" y="15" width="3" height="1" />
                            <rect x="24" y="14" width="2" height="1" />
                            <rect x="27" y="15" width="2" height="1" />

                            <rect x="1" y="18" width="2" height="1" />
                            <rect x="4" y="17" width="3" height="1" />
                            <rect x="8" y="18" width="1" height="1" />
                            <rect x="10" y="17" width="2" height="2" />
                            <rect x="13" y="18" width="3" height="1" />
                            <rect x="17" y="17" width="1" height="3" />
                            <rect x="19" y="18" width="2" height="1" />
                            <rect x="22" y="17" width="4" height="1" />
                            <rect x="27" y="18" width="1" height="2" />

                            <rect x="8" y="21" width="2" height="1" />
                            <rect x="11" y="20" width="3" height="1" />
                            <rect x="15" y="21" width="1" height="2" />
                            <rect x="17" y="21" width="2" height="1" />
                            <rect x="9" y="23" width="1" height="3" />
                            <rect x="11" y="24" width="3" height="1" />
                            <rect x="15" y="23" width="2" height="1" />
                            <rect x="18" y="24" width="1" height="2" />

                            <rect x="8" y="27" width="3" height="1" />
                            <rect x="12" y="26" width="1" height="3" />
                            <rect x="14" y="27" width="4" height="1" />
                            <rect x="19" y="26" width="1" height="1" />
                            <rect x="26" y="26" width="3" height="1" />
                            <rect x="27" y="27" width="1" height="2" />
                          </svg>
                        </button>
                        
                        <div className="space-y-0.5">
                          <p className="text-[9px] font-bold text-slate-700 leading-tight">Or Scan QR Code</p>
                          <span className="text-[7.5px] text-slate-400 block font-medium leading-tight">Instant mobile document upload</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {qrScannedNotification && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-center text-emerald-800 text-[10px] font-semibold animate-fadeIn flex items-center justify-center gap-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                      <span className="inline-flex w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                      <span>📱 Connected to Mobile Camera: Scanned document successfully linked!</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Or Copy Paste Clauses Manually</label>
                    <textarea
                      placeholder="Paste exclusions, deductibles, or policy clauses here..."
                      value={analyzerManualText}
                      onChange={e => setAnalyzerManualText(e.target.value)}
                      rows={4}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-[#8B0000] focus:border-[#8B0000]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isAnalyzingPolicy}
                    className="w-full bg-[#8B0000] text-white font-bold uppercase tracking-wider py-2 rounded-lg text-xs transition duration-150 cursor-pointer flex justify-center items-center gap-1.5"
                  >
                    {isAnalyzingPolicy ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                        <span>OCR Segmenting...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                        <span>Analyze Coverage Fineprints</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Regulatory Disclaimer Block */}
                <div className="border border-red-150 rounded-xl p-3.5 bg-red-50/5 text-[10px] text-red-800 space-y-1">
                  <div className="flex items-center gap-1 font-bold text-red-950 uppercase tracking-wider text-[8.5px]">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-700" /> Legal Compliance Notice
                  </div>
                  <p className="font-semibold text-red-900 leading-normal">
                    This AI analysis is formulated for rapid information grouping. This summary does not constitute formal legal defense material.
                  </p>
                </div>
              </div>

              {/* Reports display column */}
              <div className="lg:col-span-7">
                {isAnalyzingPolicy ? (
                  <div className="border border-slate-200 rounded-xl p-6 text-center space-y-3 bg-white flex flex-col justify-center items-center min-h-[300px]">
                    <div className="w-10 h-10 rounded-full border-2 border-slate-100 border-t-[#8B0000] animate-spin"></div>
                    <h3 className="font-bold text-slate-800 text-xs.5">Extracting fineprints via Neural Vision...</h3>
                    <p className="text-[10px] text-slate-400 max-w-sm mx-auto font-medium">
                      Running local checking exclusion lists and deductibles.
                    </p>
                  </div>
                ) : analyzerReport ? (
                  <div className="border border-slate-200 bg-white rounded-xl p-4 space-y-4 animate-fadeIn">
                    <div className="flex justify-between items-center border-b pb-2.5">
                      <div>
                        <h3 className="text-xs.5 font-bold text-slate-900 tracking-tight flex items-center gap-1.5 font-display">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          AI Coverage Extraction Report
                        </h3>
                        <p className="text-slate-400 text-[9px] font-mono leading-none mt-1">Processed at: {new Date().toLocaleDateString()} via OCR Engine</p>
                      </div>
                      <span className="bg-emerald-50 text-emerald-800 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded inline-flex items-center gap-1">
                        ★ Rating: Safe
                      </span>
                    </div>

                    {/* Extracted stats details grids */}
                    <div className="space-y-4 text-[10.5px] text-slate-500 font-medium">
                      
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-150 text-left">
                        <span className="text-[8px] font-bold uppercase text-slate-400 block pb-0.5">Identified Coverage Package</span>
                        <p className="text-slate-850 font-bold block">{analyzerReport.coverage}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="bg-slate-50 p-2.5 rounded-lg border">
                          <span className="text-[8px] uppercase block text-slate-400 font-bold">Deductible Base Term</span>
                          <span className="text-slate-800 font-extrabold block">{analyzerReport.deductibles}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-lg border">
                          <span className="text-[8px] uppercase block text-slate-400 font-bold">Standard Period</span>
                          <span className="text-slate-800 font-extrabold block">{analyzerReport.period}</span>
                        </div>
                        <div className="bg-slate-50 p-2.5 rounded-lg border">
                          <span className="text-[8px] uppercase block text-slate-400 font-bold">Expected Mileage Limits</span>
                          <span className="text-slate-800 font-extrabold block">{analyzerReport.mileageLimit}</span>
                        </div>
                      </div>

                      {/* Exclusions List */}
                      <div className="space-y-1.5">
                        <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5 text-red-650 text-red-650" />
                          Critical Policy Exclusions Discovered ({analyzerReport.exclusions.length})
                        </h4>
                        <div className="space-y-1.5">
                          {analyzerReport.exclusions.map((exc, idx) => (
                            <div key={idx} className="bg-red-50/10 border border-red-50 p-2 rounded-lg text-[10px] leading-normal flex items-start gap-1.5 text-slate-650 font-medium">
                              <span className="font-mono text-charcoal font-bold shrink-0">#{idx + 1}</span>
                              <span>{exc}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Flagged Risks Alerts */}
                      <div className="space-y-1.5 border-t pt-3">
                        <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1 text-amber-700">
                          <BadgeInfo className="w-3.5 h-3.5 text-amber-600" />
                          Risk Optimization Pointers
                        </h4>
                        <div className="space-y-1.5">
                          {analyzerReport.flaggedRisks.map((risk, idx) => (
                            <div key={idx} className="bg-amber-50/20 border border-amber-200 p-2 rounded-lg text-[10px] leading-normal flex items-start gap-1.5 text-slate-650 font-medium">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span>{risk}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center space-y-3 bg-white flex flex-col justify-center items-center min-h-[300px]">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                      <FileSearch className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-850 text-xs">Waiting for OCR indexing...</h3>
                      <p className="text-[10px] text-slate-400 max-w-sm mx-auto font-medium">
                        Select an external policy document on the left or paste clauses to generate report.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'insurer_dashboard' && (
          <motion.div
            key="insurer-dashboard-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-8 text-left"
          >
            
            {/* Split layout: Claims LEFT, Interactions & Rules RIGHT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Claims Review Panel (7/12) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="border border-black/10 bg-white rounded-2xl p-5 space-y-5 shadow-3d-premium transition-all duration-305 hover:shadow-3d-elevated">
                  <div className="flex justify-between items-center pb-3 border-b border-black/5">
                    <div className="space-y-0.5">
                      <h3 className="text-xs.5 text-xs font-bold text-slate-900 tracking-tight font-display flex items-center gap-1">
                        <Landmark className="w-4 h-4 text-[#8B0000]" />
                        B2B Claims Underwriter Portal
                      </h3>
                      <p className="text-slate-400 text-[10px] font-medium">Authorized claims queue awaiting payouts.</p>
                    </div>
                    <span className="text-[9px] font-bold bg-[#8B0000]/5 text-[#8B0000] px-2 py-0.5 rounded font-mono">
                      {claims.filter(c => c.status === 'Pending').length} Pending
                    </span>
                  </div>

                  <div className="space-y-3.5">
                    {claims.map((claim) => (
                      <div key={claim.id} className="border border-black/5 bg-slate-50/50 rounded-xl p-4 space-y-3.5 flex flex-col justify-between text-left shadow-[0_2px_8px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-3d-premium transition-all duration-300 hover:border-black/10">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8.5px] font-mono bg-slate-200 text-slate-700 py-0.5 px-1.5 rounded font-semibold">
                              ID: {claim.id} • {claim.claimDate}
                            </span>
                            <h4 className="font-extrabold text-slate-900 text-xs mt-1.5">{claim.vehicleName}</h4>
                            <p className="text-slate-400 text-[9px] font-mono mt-0.5">Policy: {claim.policyNumber}</p>
                          </div>
                          
                          <div className="text-right">
                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                              claim.status === 'Approved' ? 'bg-emerald-50 text-emerald-800' :
                              claim.status === 'Denied' ? 'bg-red-50 text-red-800' : 'bg-amber-50 text-amber-800'
                            }`}>
                              {claim.status}
                            </span>
                          </div>
                        </div>

                        <div className="text-[10.5px] space-y-1.5 text-slate-500 font-medium leading-normal">
                          <div>
                            <strong className="text-slate-700">Incident:</strong> {claim.incidentType}
                          </div>
                          <div className="bg-white p-2.5 rounded-lg border border-black/5 text-slate-500 font-medium text-[10px] bevel-inset">
                            {claim.description}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-black/5 pt-2.5 mt-0.5">
                          <div className="flex items-center gap-2.5">
                            <div>
                              <span className="block text-[8px] uppercase font-bold text-slate-400">Payout</span>
                              <span className="font-mono text-[11px] font-bold text-slate-800">${claim.requestedAmount.toLocaleString()}</span>
                            </div>
                            <div className="h-4 w-px bg-slate-200"></div>
                            <div>
                              <span className="block text-[8px] uppercase font-bold text-slate-400">Evidence</span>
                              <span className={`font-mono text-[10px] font-bold ${claim.evidenceScore > 70 ? 'text-emerald-600' : claim.evidenceScore > 40 ? 'text-amber-600' : 'text-red-650'}`}>
                                {claim.evidenceScore}% Strength
                              </span>
                            </div>
                          </div>

                          {claim.status === 'Pending' && (
                            <div className="flex gap-1 animate-fadeIn">
                              <button 
                                onClick={() => handleProcessClaim(claim.id, 'Denied')}
                                className="bg-white border border-black/10 hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-slate-700 text-[9px] font-bold uppercase py-1.5 px-3 rounded-lg cursor-pointer transition shadow-[0_1px_2px_rgba(0,0,0,0.05)] hover:shadow-sm"
                              >
                                Decline
                              </button>
                              <button 
                                onClick={() => handleProcessClaim(claim.id, 'Approved')}
                                className="bg-[#8B0000] text-white text-[9px] font-bold uppercase py-1.5 px-3.5 rounded-lg hover:bg-[#b30000] cursor-pointer transition shadow-[0_2px_6px_rgba(153,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98]"
                              >
                                Authorize
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Insurer Actions Panel: AI Content Approval & Profile Review */}
              <div className="lg:col-span-5 space-y-5">
                
                {/* 1. AI Content Approval Queue */}
                <div className="border border-amber-200 bg-amber-50/15 rounded-2xl p-5 space-y-4 shadow-3d-premium">
                  <div className="space-y-0.5 text-left">
                    <span className="text-[8px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded inline-flex items-center gap-0.5 uppercase tracking-wider font-mono">
                      <Plus className="w-3 h-3 text-amber-700" /> Human Flow
                    </span>
                    <h3 className="text-xs.5 text-xs font-bold text-slate-800 tracking-tight font-display">AI Draft Approvals</h3>
                    <p className="text-[10px] text-slate-500 font-medium leading-normal">
                      Accept or discard carrier directory drafts generated from unstructured policy text.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {providers.filter(p => p.isAIProfileDraft).length === 0 ? (
                      <div className="text-center py-4 bg-white border border-black/5 rounded-xl text-[9.5px] text-slate-400 font-medium shadow-xs">
                        No drafts waiting review. Create drafts via the Directory page.
                      </div>
                    ) : (
                      providers.filter(p => p.isAIProfileDraft).map((draft) => (
                        <div key={draft.id} className="bg-white border border-black/10 rounded-xl p-4 space-y-3 pb-3.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-3d-premium transition-all duration-300">
                          <div className="flex justify-between items-start text-left">
                            <div>
                              <h5 className="font-bold text-slate-900 text-[10.5px]">{draft.name}</h5>
                              <span className="text-[8.5px] text-slate-400 font-mono block">Via: {draft.fileUploadedName}</span>
                            </div>
                            <span className="text-[8px] font-bold bg-amber-50 text-amber-805 px-1.5 py-0.5 rounded uppercase font-mono">
                              Draft
                            </span>
                          </div>

                          <p className="text-[9.5px] text-slate-500 leading-normal font-medium text-left">
                            {draft.description}
                          </p>

                          <div className="flex gap-1.5 justify-end pt-1">
                            <button
                              onClick={() => handleRejectDraft(draft.id)}
                              className="text-[9px] font-bold uppercase text-slate-500 hover:text-red-700 hover:border-red-200 py-1.5 px-3 border border-black/10 rounded-lg cursor-pointer transition shadow-[0_1px_2px_rgba(0,0,0,0.05)] bg-white"
                            >
                              Discard
                            </button>
                            <button
                              onClick={() => handleApproveDraft(draft.id)}
                              className="text-[9px] font-bold uppercase bg-[#8B0000] hover:bg-[#b30000] text-white py-1.5 px-3.5 rounded-lg flex items-center gap-1 cursor-pointer transition shadow-[0_2px_6px_rgba(153,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <Check className="w-2.5 h-2.5 text-white" />
                              <span>Publish</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 2. Directory Base Rate Pricing Control */}
                <div className="border border-black/10 bg-white rounded-2xl p-5 space-y-4 shadow-3d-premium">
                  <div className="space-y-0.5 text-left">
                    <h3 className="text-xs.5 text-xs font-bold text-slate-800 tracking-tight uppercase">Update base premiums</h3>
                    <p className="text-slate-400 text-[10px] font-medium">Modify monthly baseline pricing mapped to the calculator.</p>
                  </div>

                  <div className="space-y-2">
                    {providers.filter(p => !p.isAIProfileDraft).map((prov) => (
                      <div key={prov.id} className="flex justify-between items-center text-[10.5px] bg-slate-50/50 p-2.5 px-3.5 rounded-xl border border-black/5 shadow-[0_1px_3px_rgba(0,0,0,0.01),inset_0_1px_0_rgba(255,255,255,0.9)] hover:shadow-sm hover:border-black/10 transition-all duration-200">
                        <span className="font-bold text-slate-850 text-slate-700">{prov.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 font-mono font-medium">$</span>
                          <input 
                            type="number" 
                            value={prov.baseMonthlyPremium}
                            onChange={e => handleUpdateBasePremium(prov.id, e.target.value)}
                            className="w-12 font-mono text-center p-1 rounded-md border border-black/10 bg-white focus:outline-none focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000] text-[10px] font-bold text-slate-900 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Customer interactions */}
                <div className="border border-black/10 bg-slate-50/40 rounded-2xl p-5 space-y-4 shadow-3d-premium">
                  <div className="space-y-0.5 text-left">
                    <h3 className="text-xs.5 text-xs font-bold text-slate-800 tracking-tight uppercase">Client Interactions Desk</h3>
                    <p className="text-slate-400 text-[10px] font-medium">Incoming consumer inquiries.</p>
                  </div>

                  <div className="space-y-2.5">
                    {interactions.map((int) => (
                      <div key={int.id} className="bg-white border border-black/10 rounded-xl p-3.5 space-y-2 text-[10.5px] text-left shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-3d-premium transition-all duration-300">
                        <div className="flex justify-between items-center animate-fadeIn">
                          <strong className="text-slate-800">{int.customer}</strong>
                          {int.urgent && (
                            <span className="bg-red-50 text-red-700 text-[8px] font-bold uppercase px-1.5 py-0.5 rounded font-mono animate-pulse">URGENT</span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium leading-normal">{int.topic}</p>

                        {int.replyText ? (
                          <div className="bg-slate-50 border border-black/5 p-2.5 rounded-lg text-[9.5px] text-slate-700 font-medium leading-normal bevel-inset">
                            <strong className="text-slate-900">Agency response:</strong> {int.replyText}
                          </div>
                        ) : (
                          <div className="flex gap-1 pt-0.5">
                            <input 
                              type="text" 
                              placeholder="Reply & press Enter..."
                              onKeyDown={(e: any) => {
                                if (e.key === 'Enter' && e.target.value) {
                                  handleSendInteractionReply(int.id, e.target.value);
                                  e.target.value = '';
                                }
                              }}
                              className="w-full text-[9px] p-1.5 border border-black/10 rounded-md bg-white focus:outline-none focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000] placeholder:text-slate-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Provider Details Dialog Modal Popover */}
      {selectedProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn text-left">
          <div className="bg-white rounded-xl max-w-sm w-full p-4.5 p-4 space-y-4 shadow-xl relative overflow-hidden">
            <div className={`absolute top-0 right-0 left-0 h-1 bg-[#8B0000]`}></div>
            
            <button 
              onClick={() => setSelectedProvider(null)}
              className="absolute top-4 right-4 w-6 h-6 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-inner bg-[#8B0000]`}>
                  {selectedProvider.name[0]}
                </div>
                <div>
                  <h3 className="text-xs.5 font-bold text-slate-900 tracking-tight font-display">{selectedProvider.name}</h3>
                  <span className="text-[9px] text-amber-600 font-bold font-mono">★ {selectedProvider.rating} Client Index</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 font-medium leading-normal">
                {selectedProvider.description}
              </p>

              {/* Expiry / Accredit details */}
              <div className="border bg-slate-50 rounded-lg p-2.5 space-y-2 text-[10px] text-slate-650">
                <div className="flex justify-between border-b pb-1.5 font-medium">
                  <span className="text-slate-400 font-medium">Underwriting specialty</span>
                  <span className="text-slate-900 font-bold">{selectedProvider.specialties.join(', ')}</span>
                </div>
                <div className="flex justify-between border-b pb-1.5 font-medium">
                  <span className="text-slate-400 font-medium">Monthly baseline premium</span>
                  <span className="text-[#8B0000] font-mono font-bold">${selectedProvider.baseMonthlyPremium}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-slate-400 font-medium">Claims authorization</span>
                  <span className="text-slate-900 font-bold">~2 hr SLA</span>
                </div>
              </div>

              {/* Cert Badges list */}
              <div className="space-y-1.5">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Accreditation Certifications</span>
                <div className="flex flex-wrap gap-1">
                  {selectedProvider.badges.map((b, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-650 px-2 py-0.5 rounded text-[8.5px] font-bold uppercase flex items-center gap-0.5 border border-slate-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedProvider(null)}
              className="w-full bg-[#8B0000] hover:bg-[#a60c0c] text-white font-bold text-[10px] uppercase py-2 rounded cursor-pointer text-center transition"
            >
              Close Profile Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

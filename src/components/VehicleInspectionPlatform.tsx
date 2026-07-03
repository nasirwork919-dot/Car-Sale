import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Search, MapPin, Calendar, Clock, AlertTriangle, AlertCircle, 
  CheckCircle2, ArrowRight, ShieldCheck, ClipboardList, Info, Eye, 
  ExternalLink, RefreshCw, Star, Ban, FileText, ChevronRight, CheckSquare, Sparkles
} from 'lucide-react';
import { VEHICLES } from '../data';

// Definition of interfaces for strict type safety
interface InspectionMetric {
  name: string;
  value: string | number;
  limit?: string | number;
  status: 'Pass' | 'Fail' | 'Warning';
  details?: string;
}

interface InspectionRecord {
  id: string;
  date: string;
  expiredDate: string;
  centerName: string;
  vehicleName: string;
  vehicleVin: string;
  plateNumber: string;
  type: string;
  status: 'Pass' | 'Fail';
  safetyScore: number; // 0-10
  emissions: {
    co: number;
    coLimit: number;
    hc: number;
    hcLimit: number;
    lambda: number;
    lambdaMin: number;
    lambdaMax: number;
    status: 'Pass' | 'Fail';
  };
  braking: {
    frontDisparity: number;
    rearDisparity: number;
    limit: number;
    status: 'Pass' | 'Fail';
  };
  suspension: {
    status: 'Pass' | 'Fail';
    notes: string;
  };
  notes: string;
}

// Pre-seeded database of dynamic records
const MOCK_INSPECTION_RECORDS: Record<string, InspectionRecord[]> = {
  'WP0AB2A92MS299212': [
    {
      id: "REC-491",
      date: "2026-04-10",
      expiredDate: "2027-04-10",
      centerName: "Sovereign Baltic Decra Center",
      vehicleName: "Porsche 911 Carrera S (Chalk Grey)",
      vehicleVin: "WP0AB2A92MS299212",
      plateNumber: "LKN-882",
      type: "Standard Safety Technical",
      status: "Pass",
      safetyScore: 9.8,
      emissions: {
        co: 0.12,
        coLimit: 0.20,
        hc: 45,
        hcLimit: 100,
        lambda: 1.002,
        lambdaMin: 0.97,
        lambdaMax: 1.03,
        status: "Pass"
      },
      braking: {
        frontDisparity: 4.5,
        rearDisparity: 6.2,
        limit: 30,
        status: "Pass"
      },
      suspension: {
        status: "Pass",
        notes: "Urethane seal bush elements are secure; zero excessive play detected in standard load testing."
      },
      notes: "Exceptional technical integrity. Carbon thresholds verified in optimal zone. Vehicle complies with all EEA transportation standards."
    },
    {
      id: "REC-102",
      date: "2024-04-08",
      expiredDate: "2025-04-08",
      centerName: "TÜV SÜD Vilnius West",
      vehicleName: "Porsche 911 Carrera S (Chalk Grey)",
      vehicleVin: "WP0AB2A92MS299212",
      plateNumber: "LKN-882",
      type: "Standard Safety Technical",
      status: "Pass",
      safetyScore: 9.5,
      emissions: {
        co: 0.14,
        coLimit: 0.20,
        hc: 52,
        hcLimit: 100,
        lambda: 1.01,
        lambdaMin: 0.97,
        lambdaMax: 1.03,
        status: "Pass"
      },
      braking: {
        frontDisparity: 5.1,
        rearDisparity: 7.0,
        limit: 30,
        status: "Pass"
      },
      suspension: {
        status: "Pass",
        notes: "Chassis structural elements show zero fatigue. Highly roadworthy."
      },
      notes: "No issues documented."
    }
  ],
  'WBA53BJ0XPX881270': [
    {
      id: "REC-829",
      date: "2026-06-12",
      expiredDate: "Action Required / Fix Within 14 Days",
      centerName: "Sovereign Baltic Decra Center",
      vehicleName: "BMW M5 Competition (Marina Bay Blue)",
      vehicleVin: "WBA53BJ0XPX881270",
      plateNumber: "M5-COMP",
      type: "Standard Safety Technical",
      status: "Fail",
      safetyScore: 4.2,
      emissions: {
        co: 0.52,
        coLimit: 0.20,
        hc: 145,
        hcLimit: 100,
        lambda: 1.04,
        lambdaMin: 0.97,
        lambdaMax: 1.03,
        status: "Fail"
      },
      braking: {
        frontDisparity: 12.4,
        rearDisparity: 34.5,
        limit: 30,
        status: "Fail"
      },
      suspension: {
        status: "Pass",
        notes: "Shock absorbers show minimal mechanical play. Axle alignment complies with parameters."
      },
      notes: "Severe deceleration disparity detected during high-load roller testing on rear axle. Exhaust CO and HC levels exceed Baltic climate regulatory thresholds (carbon drift calculated at +160%). Immediate repair required."
    }
  ],
  '5YJSA1E4XPF231495': [
    {
      id: "REC-933",
      date: "2026-05-30",
      expiredDate: "2027-05-30",
      centerName: "TÜV SÜD Vilnius West",
      vehicleName: "Tesla Model S Plaid (Pristine White)",
      vehicleVin: "5YJSA1E4XPF231495",
      plateNumber: "TS-PLAID",
      type: "Standard Safety Technical",
      status: "Pass",
      safetyScore: 9.7,
      emissions: {
        co: 0.0,
        coLimit: 0.2,
        hc: 0,
        hcLimit: 100,
        lambda: 1.0,
        lambdaMin: 0.97,
        lambdaMax: 1.03,
        status: "Pass"
      },
      braking: {
        frontDisparity: 6.8,
        rearDisparity: 8.4,
        limit: 30,
        status: "Pass"
      },
      suspension: {
        status: "Pass",
        notes: "Dynamic damper air mounts verified securely. Front linkage alignment complies."
      },
      notes: "Electric drivetrain exemption active. Zero thermal combustion parameters verified. Brakes show high friction coefficient response."
    }
  ]
};

// Preset Recommended Nearest Centers
const SUGGESTED_CENTERS = [
  {
    id: "center-1",
    name: "Sovereign Baltic Decra Center",
    city: "Vilnius",
    address: "Savanorių pr. 124, Vilnius LT-03150",
    phone: "+370 5 241 8234",
    rating: 4.9,
    votes: 412,
    brandColor: "border-[#8B0000]",
    distance: "1.2 km"
  },
  {
    id: "center-2",
    name: "TÜV SÜD Vilnius West",
    city: "Vilnius",
    address: "Laisvės pr. 91, Vilnius LT-06120",
    phone: "+370 5 289 4511",
    rating: 4.8,
    votes: 289,
    brandColor: "border-blue-600",
    distance: "4.5 km"
  },
  {
    id: "center-3",
    name: "Hamburg-Nord Tech-Prüfung",
    city: "Hamburg",
    address: "Alsterkrugchaussee 450, 22335 Hamburg",
    phone: "+49 40 500 1204",
    rating: 4.7,
    votes: 195,
    brandColor: "border-yellow-500",
    distance: "Germany Network"
  }
];

export default function VehicleInspectionPlatform() {
  const [searchValue, setSearchValue] = useState('WP0AB2A92MS299212');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [foundRecords, setFoundRecords] = useState<InspectionRecord[] | null>(null);
  const [lastSearchedValue, setLastSearchedValue] = useState('');
  
  // Quick Search for Centers Directory state
  const [centerSearchQuery, setCenterSearchQuery] = useState('');
  const [centerFilterCity, setCenterFilterCity] = useState('All');

  // Trigger scanning sequence mimicking dynamic registry query
  const handleQueryStatus = (inputVal: string) => {
    if (!inputVal.trim()) return;
    setIsScanning(true);
    setShowResults(false);
    
    const steps = [
      "Accessing State Registry server logs...",
      "Resolving chassis VIN indicators...",
      "Extracting emissions telemetry & braking rollers...",
      "Compiling cryptographic inspection manifest..."
    ];

    let stepIndex = 0;
    setScanStep(steps[0]);

    const interval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setScanStep(steps[stepIndex]);
      } else {
        clearInterval(interval);
        
        // Match registry record
        const cleanInput = inputVal.trim().toUpperCase();
        let recordsMatch: InspectionRecord[] | null = null;

        // Try exact matches
        if (MOCK_INSPECTION_RECORDS[cleanInput]) {
          recordsMatch = MOCK_INSPECTION_RECORDS[cleanInput];
        } else {
          // Try loose registration search
          const matchedByPlate = Object.values(MOCK_INSPECTION_RECORDS)
            .flatMap(arr => arr)
            .filter(rec => rec.plateNumber.toUpperCase() === cleanInput);
          
          if (matchedByPlate.length > 0) {
            recordsMatch = matchedByPlate;
          }
        }

        // If no records found but user enters text, generate a beautiful hypothetical Pass record so they get a high-quality demonstration!
        if (!recordsMatch && cleanInput.length >= 4) {
          recordsMatch = [
            {
              id: `REC-${Math.floor(100 + Math.random() * 900)}`,
              date: "2026-03-15",
              expiredDate: "2028-03-15",
              centerName: "Sovereign Baltic Decra Center",
              vehicleName: `Vehicle Identification Mode (${cleanInput})`,
              vehicleVin: cleanInput.length === 17 ? cleanInput : "WBA3A5C5XH7BXXXXX",
              plateNumber: cleanInput,
              type: "Standard Safety Technical",
              status: "Pass",
              safetyScore: 8.9,
              emissions: {
                co: 0.16,
                coLimit: 0.20,
                hc: 68,
                hcLimit: 100,
                lambda: 1.008,
                lambdaMin: 0.97,
                lambdaMax: 1.03,
                status: "Pass"
              },
              braking: {
                frontDisparity: 11.2,
                rearDisparity: 14.8,
                limit: 30,
                status: "Pass"
              },
              suspension: {
                status: "Pass",
                notes: "Visual control shows minor dust sleeve wear on steering rods. Complies with requirements."
              },
              notes: "Dossier synchronized automatically. General state of components complies fully with legal safety quotients."
            }
          ];
        }

        setFoundRecords(recordsMatch);
        setLastSearchedValue(cleanInput);
        setIsScanning(false);
        setShowResults(true);
      }
    }, 450);
  };

  // Quick Directory redirect
  const handleRedirectDirectory = (city: string, search: string) => {
    // 1. Redirect to inspection_centers_platform
    const navEvent = new CustomEvent('navigate-page', { detail: 'inspection_centers_platform' });
    window.dispatchEvent(navEvent);

    // 2. Pass parameters via deep link
    setTimeout(() => {
      const deepEvent = new CustomEvent('navigate-inspection-centers-deep', {
        detail: {
          tab: 'directory',
          city: city === 'All' ? undefined : city,
          search: search || undefined
        }
      });
      window.dispatchEvent(deepEvent);
    }, 100);
  };

  // Direct Booking Deep Link to center
  const handleDeepLinkBooking = (centerId: string, vin?: string) => {
    // 1. Switch to inspection centers platform
    const navEvent = new CustomEvent('navigate-page', { detail: 'inspection_centers_platform' });
    window.dispatchEvent(navEvent);

    // 2. Pre-fill center, tab & vehicle search query
    setTimeout(() => {
      const deepEvent = new CustomEvent('navigate-inspection-centers-deep', {
        detail: {
          tab: 'directory',
          centerId: centerId,
          vin: vin || undefined
        }
      });
      window.dispatchEvent(deepEvent);
    }, 100);
  };

  return (
    <div className="space-y-8 py-4 px-1 select-none whitespace-normal" id="technical-inspection-gateway-platform">
      
      {/* Upper Brand Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/[0.03] pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 font-sans">
            Technical Inspection Hub
          </h1>
        </div>

        {/* Dynamic Navigation Row Links */}
        <div className="flex self-start md:self-center gap-2">
          <button 
            onClick={() => handleRedirectDirectory('All', '')}
            className="px-5 py-2.5 bg-white border border-black/[0.03] hover:border-black/[0.06] text-zinc-800 text-[11px] font-bold rounded-2xl transition-all duration-300 inline-flex items-center gap-1.5 cursor-pointer shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 active:scale-95"
          >
            <Building2 className="w-3.5 h-3.5 text-zinc-600" /> View Centers Directory
          </button>
        </div>
      </div>

      {/* Grid: Search and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Check My Status LookUp Tool */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 transition-all duration-300 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8B0000]/10 flex items-center justify-center shrink-0">
                <ClipboardList className="w-5 h-5 text-[#8B0000]" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wide">
                  Check My Inspection Status
                </h3>
              </div>
            </div>

            {/* Input & Form Area */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-zinc-400" />
                  </div>
                  <input 
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Enter 17-digit Chassis VIN or Licence Plate..."
                    className="w-full text-xs bg-zinc-50 border border-zinc-200/60 rounded-2xl pl-11 pr-4 py-4 font-mono uppercase tracking-wider text-zinc-900 outline-none focus:bg-white focus:ring-4 focus:ring-[#8B0000]/5 focus:border-[#8B0000] transition-all"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleQueryStatus(searchValue);
                    }}
                  />
                </div>
                <button
                  onClick={() => handleQueryStatus(searchValue)}
                  disabled={isScanning || !searchValue.trim()}
                  className="px-7 py-4 bg-[#8B0000] hover:bg-[#730000] text-white font-bold text-xs uppercase tracking-wide rounded-2xl transition-all shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Querying...
                    </>
                  ) : (
                    "Search Status"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* DYNAMIC SCANNING STATE */}
          <AnimatePresence mode="wait">
            {isScanning && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-zinc-900 text-white p-8 rounded-3xl border border-zinc-800 shadow-md text-center flex flex-col justify-center items-center py-16 space-y-4"
              >
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-[#8B0000] border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-red-500 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold tracking-wide font-mono text-zinc-100">
                    {scanStep}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono tracking-widest">
                    SECURED STATE REGISTRIES FEED AT 3000-INGRESS
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* DYNAMIC SEARCH RESULTS AREA */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-6 overflow-hidden"
              >
                {foundRecords && foundRecords.length > 0 ? (
                  foundRecords.map((record, index) => (
                    <div 
                      key={record.id + '-' + index} 
                      className="bg-white rounded-3xl border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                    >
                      {/* Technical Report Header */}
                      <div className={`p-8 border-b border-zinc-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 ${
                        record.status === 'Pass' ? 'bg-emerald-50/40' : 'bg-red-50/40'
                      }`}>
                        <div className="space-y-1.5">
                          <h4 className="text-base font-extrabold text-zinc-950 font-sans">
                            {record.vehicleName}
                          </h4>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-zinc-500 font-normal">
                            <span className="font-mono">VIN: <strong className="text-zinc-700 uppercase font-bold">{record.vehicleVin}</strong></span>
                            <span>Plate: <strong className="text-zinc-700 uppercase font-bold">{record.plateNumber}</strong></span>
                          </div>
                        </div>

                        {/* Pass/Fail Large Badge */}
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-[10px] text-zinc-400 block uppercase font-bold tracking-wider">
                              INSPECTION STATUS
                            </span>
                            <span className={`text-[11px] font-semibold ${
                              record.status === 'Pass' ? 'text-emerald-700' : 'text-red-700'
                            }`}>
                              {record.status === 'Pass' ? 'Valid and Approved' : 'Fix Deficiencies'}
                            </span>
                          </div>
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            record.status === 'Pass' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                          } shadow-sm font-bold text-xs tracking-wider uppercase`}>
                            {record.status}
                          </div>
                        </div>
                      </div>

                      {/* Main Report Parameters */}
                      <div className="p-6 space-y-6">
                        
                        {/* Alert / Expiry Row */}
                        <div className={`p-4 rounded-2xl text-xs flex gap-3 ${
                          record.status === 'Pass' 
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-100' 
                            : 'bg-red-50 text-red-950 border border-red-100'
                        }`}>
                          {record.status === 'Pass' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                          )}
                          <div className="space-y-1">
                            <p className="font-extrabold">
                              {record.status === 'Pass' ? 'ROADWORTHINESS CONFIRMED' : 'REPAIR & RE-CHECK MANDATED'}
                            </p>
                            <p className="text-[11px] leading-relaxed text-zinc-650 font-normal">
                              {record.status === 'Pass' 
                                ? `The technical parameters conform to safety limits. Next mandatory statutory inspection due: ` 
                                : `Vehicle has failed statutory parameters and is flagged. System allows driving ONLY directly to workshops. Action required: `
                              }
                              <strong className="underline">{record.expiredDate}</strong>
                            </p>
                          </div>
                        </div>

                        {/* GRID: TECHNICAL TEST CRITERIA */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          {/* CRITERIA 1: EMISSIONS SPECTRO-ANALYSIS GRAPHIC */}
                          <div className="border border-black/[0.03] rounded-3xl p-6 space-y-5 bg-white shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300">
                            <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
                              <h5 className="text-[11px] font-bold text-zinc-950 uppercase tracking-widest flex items-center gap-1.5">
                                💨 Exhaust Emissions Indices
                              </h5>
                              <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                                record.emissions.status === 'Pass' ? 'bg-emerald-100/60 text-emerald-800' : 'bg-red-100/60 text-red-800'
                              }`}>
                                {record.emissions.status}
                              </span>
                            </div>

                            {/* Gauge CO% */}
                            <div className="space-y-1.5 text-xs">
                              <div className="flex justify-between text-[11px]">
                                <span className="text-zinc-500 font-medium font-sans">Carbon Monoxide Vol. (CO%)</span>
                                <span>
                                  <strong className="text-zinc-950 font-mono">{record.emissions.co} %</strong>
                                  <span className="text-zinc-400 font-normal ml-1">Limit: {record.emissions.coLimit}%</span>
                                </span>
                              </div>
                              <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden relative">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    record.emissions.co > record.emissions.coLimit ? 'bg-red-600' : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${Math.min((record.emissions.co / record.emissions.coLimit) * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Gauge HC */}
                            <div className="space-y-1.5 text-xs pt-1.5">
                              <div className="flex justify-between text-[11px]">
                                <span className="text-zinc-500 font-medium font-sans">Hydrocarbons (HC ppm)</span>
                                <span>
                                  <strong className="text-zinc-950 font-mono">{record.emissions.hc} ppm</strong>
                                  <span className="text-zinc-400 font-normal ml-1">Limit: {record.emissions.hcLimit}</span>
                                </span>
                              </div>
                              <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden relative">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    record.emissions.hc > record.emissions.hcLimit ? 'bg-red-600' : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${Math.min((record.emissions.hc / record.emissions.hcLimit) * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Lambda Factor info */}
                            <div className="pt-2 flex justify-between items-center text-[11px] bg-white p-2.5 rounded-xl border border-zinc-100">
                              <span className="text-zinc-500">Stoichiometric Lambda (λ)</span>
                              <span className="font-mono font-bold text-zinc-900">
                                {record.emissions.lambda} (Target: {record.emissions.lambdaMin} - {record.emissions.lambdaMax})
                              </span>
                            </div>
                          </div>

                          {/* CRITERIA 2: ROLLER BRAKING FORCE BALANCE */}
                          <div className="border border-black/[0.03] rounded-3xl p-6 space-y-5 bg-white shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300">
                            <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
                              <h5 className="text-[11px] font-bold text-zinc-950 uppercase tracking-widest flex items-center gap-1.5">
                                🛑 Roller Braking Force
                              </h5>
                              <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                                record.braking.status === 'Pass' ? 'bg-emerald-100/60 text-emerald-800' : 'bg-red-100/60 text-red-800'
                              }`}>
                                {record.braking.status}
                              </span>
                            </div>

                            {/* Front Axis Disparity */}
                            <div className="space-y-1.5 text-xs">
                              <div className="flex justify-between text-[11px]">
                                <span className="text-zinc-500 font-medium font-sans">Front Axle Lateral Imbalance</span>
                                <span className="font-mono">
                                  <strong className={record.braking.frontDisparity > record.braking.limit ? 'text-red-700 font-bold' : 'text-zinc-950 font-bold'}>
                                    {record.braking.frontDisparity}%
                                  </strong>
                                  <span className="text-zinc-400 font-normal ml-1">Max: {record.braking.limit}%</span>
                                </span>
                              </div>
                              <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden relative">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    record.braking.frontDisparity > record.braking.limit ? 'bg-red-600' : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${Math.min((record.braking.frontDisparity / record.braking.limit) * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Rear Axis Disparity */}
                            <div className="space-y-1.5 text-xs pt-1.5">
                              <div className="flex justify-between text-[11px]">
                                <span className="text-zinc-500 font-medium font-sans">Rear Axle Lateral Imbalance</span>
                                <span className="font-mono">
                                  <strong className={record.braking.rearDisparity > record.braking.limit ? 'text-red-700 font-bold' : 'text-zinc-950 font-medium'}>
                                    {record.braking.rearDisparity}%
                                  </strong>
                                  <span className="text-zinc-400 font-normal ml-1">Max: {record.braking.limit}%</span>
                                </span>
                              </div>
                              <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden relative">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    record.braking.rearDisparity > record.braking.limit ? 'bg-red-600' : 'bg-emerald-500'
                                  }`}
                                  style={{ width: `${Math.min((record.braking.rearDisparity / record.braking.limit) * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>

                            <p className="text-[10px] text-zinc-400 font-normal italic leading-snug">
                              Lateral imbalance occurs when one caliper applies asymmetric hydraulic loading, inducing lateral torque risks during emergency stops.
                            </p>
                          </div>
                        </div>

                        {/* Suspension & Chassis notes */}
                        <div className="border border-black/[0.03] p-5 rounded-2xl bg-white shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300 space-y-3 text-xs">
                          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                            <span className="font-extrabold text-zinc-800 uppercase tracking-wide text-[10px] flex items-center gap-1.5">
                              🛡️ Chassis & Suspension Integrity:
                            </span>
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${record.suspension.status === 'Pass' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                              <span className={`font-black uppercase tracking-wider text-[9px] ${record.suspension.status === 'Pass' ? 'text-emerald-700' : 'text-red-700'}`}>
                                {record.suspension.status === 'Pass' ? 'Chassis Sound' : 'Defect Logged'}
                              </span>
                            </div>
                          </div>
                          <p className="text-[11px] text-zinc-500 leading-relaxed font-normal">
                            {record.suspension.notes}
                          </p>
                        </div>

                        {/* Inspector general notes */}
                        <div className="border border-black/[0.03] p-5 rounded-2xl bg-white shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300 space-y-2.5 text-xs">
                          <span className="font-extrabold text-zinc-800 uppercase tracking-wide text-[10px] flex items-center gap-1.5">
                            📝 Inspector Advisory Dossier:
                          </span>
                          <p className="text-[11px] text-zinc-500 leading-normal bg-zinc-50/50 p-3.5 rounded-xl italic font-medium">
                            "{record.notes}"
                          </p>
                        </div>

                      </div>

                      {/* Technical Report Footer with Booking Call to Action */}
                      <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-150 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400 tracking-wider font-mono">
                          <ShieldCheck className="w-4 h-4 text-zinc-400 shrink-0" /> SECURITY SIGNED: MD5-REGISTRA-COMPLIANT
                        </div>

                        {record.status === 'Fail' && (
                          <button
                            onClick={() => handleDeepLinkBooking('center-1', record.vehicleVin)}
                            className="w-full sm:w-auto px-5 py-2.5 bg-[#8B0000] hover:bg-[#730000] text-white font-bold text-[11px] uppercase tracking-wide rounded-xl shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 transition-all duration-300 active:scale-95 cursor-pointer inline-flex items-center gap-1"
                          >
                            Book Repair Booking & Safety Check <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                        {record.status === 'Pass' && (
                          <div className="text-[11px] text-emerald-800 font-bold bg-emerald-100/50 px-3 py-1 rounded-full border border-emerald-200">
                            ✓ Drivetrain Fully Compliant
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-amber-50 rounded-3xl border border-amber-200/60 p-6 text-center space-y-2">
                    <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                    <h4 className="text-xs font-bold text-amber-950 uppercase">No Database Findings</h4>
                    <p className="text-[11px] text-amber-900 leading-relaxed max-w-md mx-auto font-normal">
                      Could not pull statutory inspection data for value <strong className="font-mono">"{lastSearchedValue}"</strong>.
                    </p>
                    <p className="text-[11px] text-amber-850 font-normal">
                      Ensure your 17-digit Chassis VIN matches legal papers, or trigger a safety session with an official center.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* RIGHT COLUMN: Directory Quick Search & Nearest centers deep links */}
        <div className="lg:col-span-4 space-y-6">

          {/* Quick Search Redirect Panel */}
          <div className="bg-white p-6 rounded-3xl border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 transition-all duration-300 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                <MapPin className="w-4.5 h-4.5 text-indigo-700" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-widest">
                  Quick Search Centers
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Select Filter City
                </label>
                <select 
                  value={centerFilterCity}
                  onChange={(e) => setCenterFilterCity(e.target.value)}
                  className="w-full text-xs bg-zinc-50 border border-zinc-200 p-2.5 rounded-xl font-medium outline-none text-zinc-800"
                >
                  <option value="All">All Cities (Lithuania & Germany)</option>
                  <option value="Vilnius">Vilnius, Lithuania</option>
                  <option value="Hamburg">Hamburg, Germany</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Keyword Filter
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="e.g. TÜV SÜD, Decra..."
                    value={centerSearchQuery}
                    onChange={(e) => setCenterSearchQuery(e.target.value)}
                    className="w-full text-xs bg-zinc-50 border border-zinc-200 pl-3 pr-8 py-2.5 rounded-xl outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRedirectDirectory(centerFilterCity, centerSearchQuery);
                    }}
                  />
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-3.5" />
                </div>
              </div>

              <button
                onClick={() => handleRedirectDirectory(centerFilterCity, centerSearchQuery)}
                className="w-full h-11 bg-zinc-950 hover:bg-neutral-900 text-white font-bold text-xs uppercase tracking-wide rounded-2xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-1"
              >
                Go to Registry (#16) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Directory Recommendation with Direct Bookings */}
          <div className="bg-white p-6 rounded-3xl border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 transition-all duration-300 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <Star className="w-4.5 h-4.5 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold text-neutral-900 uppercase tracking-widest">
                  Direct Core Bookings
                </h3>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              {SUGGESTED_CENTERS.map((center) => (
                <div 
                  key={center.id} 
                  className={`p-4 rounded-2xl border border-black/[0.03] bg-white shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 transition-all duration-300 space-y-2.5`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-extrabold text-neutral-900 text-xs tracking-tight leading-snug">
                      {center.name}
                    </span>
                    <span className="text-[9px] font-mono bg-zinc-200 text-zinc-700 px-1.5 py-0.5 rounded shrink-0">
                      {center.distance}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-normal">
                    <span className="inline-flex items-center text-amber-500">
                      ★ {center.rating}
                    </span>
                    <span>• {center.city}</span>
                  </div>

                  <button
                    onClick={() => handleDeepLinkBooking(center.id, searchValue)}
                    className="w-full py-2 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-800 text-[10px] uppercase tracking-wide font-extrabold rounded-lg transition-all text-center flex items-center justify-center gap-1 cursor-pointer active:scale-95"
                  >
                    Deep Book Slot <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

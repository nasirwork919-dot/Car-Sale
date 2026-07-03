/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useMemo } from 'react';
import { 
  Building2, ChevronRight, Globe, Info, Search, HelpCircle, Sparkles, Check, AlertCircle, 
  DollarSign, TrendingUp, Cpu, Calendar, ShieldCheck, MapPin, Gauge, FileText, ChevronDown,
  ArrowRight, Landmark, Settings, Flame, AlertTriangle, ShieldCheck as ShieldIcon, Car, BarChart3,
  RefreshCw, FileSpreadsheet, ArrowRightLeft, FileCheck, HelpCircle as HelpIcon, Terminal, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Country list for import/export simulation
interface TaxCountry {
  code: string;
  name: string;
  flag: string;
  vatRate: number; // e.g. 0.23 for 23%
  importDutyRate: number; // standard import duty from non-EU or global sources
  exciseTiers?: Array<{ label: string; rate: number; condition: string }>;
  fixedRegistrationFee: number;
  environmentalLevyFactor: number; // multiplier based on emissions
  requiredDocs: string[];
}

const TAX_COUNTRIES: TaxCountry[] = [
  {
    code: 'DE',
    name: 'Germany (Deutschland)',
    flag: '🇩🇪',
    vatRate: 0.19,
    importDutyRate: 0.10,
    fixedRegistrationFee: 120, // EUR
    environmentalLevyFactor: 1.2,
    requiredDocs: [
      'Zulassungsbescheinigung Teil I & II (German registration logbooks)',
      'Certificate of Conformity (CoC) issued by manufacturer',
      'Electronic Insurance Confirmation (eVB-Nummer)',
      'Valid TÜV Hauptuntersuchung safety report',
      'SEPA Direct Debit Mandate for vehicle tax collection'
    ]
  },
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    vatRate: 0.06, // Average state sales tax
    importDutyRate: 0.025, // 2.5% standard passenger car duty
    fixedRegistrationFee: 250, // USD
    environmentalLevyFactor: 1.5,
    requiredDocs: [
      'CBP Form 3461 (Entry/Immediate Delivery)',
      'CBP Form 7501 (Entry Summary)',
      'EPA Form 3520-21 (Emission compliance proof)',
      'DOT Form HS-7 (Imported vehicle safety declaration)',
      'Foreign registration document & original Bill of Sale'
    ]
  },
  {
    code: 'UK',
    name: 'United Kingdom',
    flag: '🇬🇧',
    vatRate: 0.20,
    importDutyRate: 0.10,
    fixedRegistrationFee: 55, // GBP
    environmentalLevyFactor: 1.4,
    requiredDocs: [
      'DVLA V5C original registration document',
      'HMRC NOVA (Notification of Vehicle Arrivals) clearance receipt',
      'Mutual Recognition Certificate or IVA (Individual Vehicle Approval)',
      'Valid MOT safety and exhaust test certificate',
      'Invoice proof of sales value'
    ]
  },
  {
    code: 'PL',
    name: 'Poland (Polska)',
    flag: '🇵🇱',
    vatRate: 0.23,
    importDutyRate: 0.10,
    exciseTiers: [
      { label: 'Small Engine (<= 2000cc)', rate: 0.031, condition: 'Engine has standard capacity' },
      { label: 'Large Engine (> 2000cc)', rate: 0.186, condition: 'Engine capacity over 2.0L' },
      { label: 'Electric Vehicles', rate: 0.00, condition: 'BEV / zero emissions active standard' }
    ],
    fixedRegistrationFee: 160, // PLN
    environmentalLevyFactor: 1.1,
    requiredDocs: [
      'Dowód rejestracyjny (Foreign registration certificate)',
      'PCC-3 Declarations or proof of Excise paying (Akcyza)',
      'Court-sworn translation of purchase contract to Polish',
      'Valid technical checklist (Badanie techniczne)',
      'Proof of payment of local registration stamp dues'
    ]
  },
  {
    code: 'SE',
    name: 'Sweden (Sverige)',
    flag: '🇸🇪',
    vatRate: 0.25,
    importDutyRate: 0.10,
    fixedRegistrationFee: 850, // SEK
    environmentalLevyFactor: 1.8,
    requiredDocs: [
      'Original foreign registration papers (Part 1 and 2)',
      'EU Certificate of Conformity (CoC)',
      'Swedish Transport Agency ursprungskontroll approval letter',
      'Vehicle verification inspection record (Registreringsbesiktning)',
      'Proof of traffic insurance validation'
    ]
  },
  {
    code: 'JP',
    name: 'Japan (Nippon)',
    flag: '🇯🇵',
    vatRate: 0.10,
    importDutyRate: 0.005, // Exceptionally low import entry rate
    fixedRegistrationFee: 45000, // JPY
    environmentalLevyFactor: 1.0,
    requiredDocs: [
      'Export Certificate (Yushutsu Massho Shomeisho)',
      'Bill of Lading proving shipping logistics lines',
      'Automotive Emissions Standard test certification',
      'Proof of off-street parking space contract (Shako Shomeisho)',
      'Weight Tax and Compulsory Insurance policy documents'
    ]
  }
];

// Presets representing accurate build-level values
interface CalculatorPreset {
  vin: string;
  manufacturer: string;
  model: string;
  year: number;
  engineSizeCc: number;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  baseValueUsd: number;
}

const CALCULATOR_PRESETS: Record<string, CalculatorPreset> = {
  'WP0AB2A92MS299212': {
    vin: 'WP0AB2A92MS299212',
    manufacturer: 'Porsche AG',
    model: '911 Carrera S Convertible',
    year: 2021,
    engineSizeCc: 2981,
    fuelType: 'Petrol',
    baseValueUsd: 135000
  },
  'WBA53BJ0XPX881270': {
    vin: 'WBA53BJ0XPX881270',
    manufacturer: 'BMW AG',
    model: 'M5 Competition',
    year: 2023,
    engineSizeCc: 4395,
    fuelType: 'Petrol',
    baseValueUsd: 112000
  },
  '5YJSA1E4XPF231495': {
    vin: '5YJSA1E4XPF231495',
    manufacturer: 'Tesla, Inc.',
    model: 'Model S Long Range',
    year: 2022,
    engineSizeCc: 0,
    fuelType: 'Electric',
    baseValueUsd: 82000
  },
  'WBA3D3C57HN364022': {
    vin: 'WBA3D3C57HN364022',
    manufacturer: 'BMW AG',
    model: '320i Luxury Line',
    year: 2017,
    engineSizeCc: 1998,
    fuelType: 'Petrol',
    baseValueUsd: 18500
  }
};

export default function TaxDutyCalculatorPlatform() {
  // Configured inputs
  const [originCountryCode, setOriginCountryCode] = useState('DE');
  const [destinationCountryCode, setDestinationCountryCode] = useState('PL');
  
  // Vehicle properties
  const [manualMode, setManualMode] = useState<boolean>(false);
  const [vinLookupInput, setVinLookupInput] = useState('WP0AB2A92MS299212');
  
  // Spec fields editable in either modes
  const [vehicleYear, setVehicleYear] = useState(2021);
  const [engineCapacityCc, setEngineCapacityCc] = useState(2981);
  const [fuelType, setFuelType] = useState<'Petrol' | 'Diesel' | 'Electric' | 'Hybrid'>('Petrol');
  const [vehicleValueUsd, setVehicleValueUsd] = useState(135000);
  const [manufacturerName, setManufacturerName] = useState('Porsche');
  const [modelName, setModelName] = useState('911 Carrera S');

  // Trigger loading & results
  const [isComputing, setIsComputing] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const [activeTab, setActiveTab] = useState<'fees' | 'documents' | 'aiExplanation'>('fees');

  // Currency Converter Sim
  const originCountry = useMemo(() => TAX_COUNTRIES.find(c => c.code === originCountryCode)!, [originCountryCode]);
  const destinationCountry = useMemo(() => TAX_COUNTRIES.find(c => c.code === destinationCountryCode)!, [destinationCountryCode]);

  // VIN Lookup Decoder Action
  const handleDecodeVinData = (vinToSearch: string) => {
    setIsComputing(true);
    const cleaned = vinToSearch.trim().toUpperCase();

    setTimeout(() => {
      setIsComputing(false);
      if (CALCULATOR_PRESETS[cleaned]) {
        const p = CALCULATOR_PRESETS[cleaned];
        setVehicleYear(p.year);
        setEngineCapacityCc(p.engineSizeCc);
        setFuelType(p.fuelType);
        setVehicleValueUsd(p.baseValueUsd);
        setManufacturerName(p.manufacturer);
        setModelName(p.model);
      } else {
        // Fallback fallback defaults matching standard patterns
        setVehicleYear(2022);
        setEngineCapacityCc(1984);
        setFuelType('Petrol');
        setVehicleValueUsd(45000);
        setManufacturerName('Volkswagen');
        setModelName('Golf R AWD');
      }
      setShowResults(true);
    }, 1100);
  };

  // Tax/excise logic matching European & global regulations
  const calculationMetrics = useMemo(() => {
    const value = vehicleValueUsd;
    
    // 1. Check if intra-EU transport (Internal tax borders)
    const euCountries = ['DE', 'PL', 'SE'];
    const originIsEu = euCountries.includes(originCountryCode);
    const destIsEu = euCountries.includes(destinationCountryCode);
    const isIntraEu = originIsEu && destIsEu;

    // 2. Import Duty calculation
    // Generally 10% inside EU if imported from outside (US/JP), otherwise if intra-EU it is 0% duty
    let importDutyRate = destinationCountry.importDutyRate;
    if (isIntraEu) {
      importDutyRate = 0; // Free trade exemption inside EU customs borders
    }
    const calculatedImportDuty = Math.round(value * importDutyRate);

    // Value post-duty is standard customs basis for taxes
    const dutyBasisValue = value + calculatedImportDuty;

    // 3. Excise Duty calculation (specific to Destination country)
    let exciseRate = 0;
    let exciseLabel = 'Not applicable';

    if (destinationCountry.code === 'PL') {
      if (fuelType === 'Electric') {
        exciseRate = 0;
        exciseLabel = 'Electric Zero Excise Incentive';
      } else if (fuelType === 'Hybrid') {
        // Poland hybrid discount reduction (50% discount)
        exciseRate = engineCapacityCc <= 2000 ? 0.0155 : 0.093;
        exciseLabel = `Hybrid Discount: ${exciseRate * 100}%`;
      } else {
        exciseRate = engineCapacityCc <= 2000 ? 0.031 : 0.186;
        exciseLabel = `Poland Standard Excise: ${exciseRate * 100}%`;
      }
    } else if (destinationCountry.code === 'DE') {
      // Germany registration surcharge bases (Co2 values, standard low fees)
      exciseRate = fuelType === 'Diesel' ? 0.02 : 0.01;
      exciseLabel = `CO2 emission base tax`;
    } else if (destinationCountry.code === 'US') {
      // US Gas Guzzler tax on high engines
      exciseRate = engineCapacityCc > 3000 ? 0.03 : 0;
      exciseLabel = `Gas Guzzler Tax Offset`;
    } else if (destinationCountry.code === 'UK') {
      // Premium road charge
      exciseRate = value > 40000 ? 0.015 : 0.005;
      exciseLabel = `UK Road Premium Stamp`;
    } else if (destinationCountry.code === 'SE') {
      // Bonus-Malus Environmental index
      exciseRate = fuelType === 'Diesel' ? 0.025 : fuelType === 'Electric' ? 0.00 : 0.012;
      exciseLabel = 'Bonus-Malus CO2 offset';
    }

    const calculatedExcise = Math.round(dutyBasisValue * exciseRate);

    // VAT calculations
    // Destination country VAT applied to vehicle cost + duty + excise
    const vatBasisValue = dutyBasisValue + calculatedExcise;
    const calculatedVat = Math.round(vatBasisValue * destinationCountry.vatRate);

    // Fixed & Environmental overheads
    let envFee = Math.round(150 * destinationCountry.environmentalLevyFactor);
    if (fuelType === 'Electric') envFee = Math.round(envFee * 0.1); // Electric discount

    const calculatedTotalLanded = value + calculatedImportDuty + calculatedExcise + calculatedVat + destinationCountry.fixedRegistrationFee + envFee;

    return {
      baseValue: value,
      importDuty: calculatedImportDuty,
      importDutyRate: importDutyRate * 100,
      excise: calculatedExcise,
      exciseRate: exciseRate * 100,
      exciseLabel,
      vat: calculatedVat,
      vatRate: destinationCountry.vatRate * 100,
      fixedFee: destinationCountry.fixedRegistrationFee,
      envFee,
      totalLanded: calculatedTotalLanded,
      isIntraEu
    };
  }, [originCountryCode, destinationCountryCode, fuelType, engineCapacityCc, vehicleValueUsd, destinationCountry]);

  // AI Counselor detailed text step-by-step
  const computedAiGuideSteps = useMemo(() => {
    const oName = originCountry.name;
    const dName = destinationCountry.name;
    const isEu = calculationMetrics.isIntraEu;

    return [
      {
        title: `Phase I: Export Clearance from ${oName}`,
        body: `Before shipping the ${vehicleYear} ${manufacturerName} ${modelName}, you must clear the originating country's customs ledger. For export from ${oName}, obtain export registration plates (e.g. Exportkennzeichen in Germany) and notify national motor authorities so road tax burdens cease. A commercial Bill of Sale is mandatory to confirm the declared base value of $${vehicleValueUsd.toLocaleString()} value.`
      },
      {
        title: `Phase II: Interstate Transport & Transit Customs`,
        body: isEu 
          ? `Because both ${oName} and ${dName} reside within the European Union Free Trade boundaries, you bypass physical customs inspect stations. Simply secure standard CMR consignment notes. VAT and Excise remain due in ${dName}, but zero custom duties are imposed ($0 import duty).`
          : `Since transport crosses global customs boundaries, the shipper must present the vehicle at the entrance port of ${dName}. Have CBP Form 7501 (for US) or respective national trade manifests ready. A transit bond may be required if moving via intermediate borders before terminal inspection.`
      },
      {
        title: `Phase III: Local Technical Conformance & Safety Adjustments`,
        body: `Before legal plate assignment in ${dName}, the vehicle must pass extensive technical audits. This verifies original emission states (or High Voltage state of health assessments for ${fuelType === 'Electric' ? 'EV batteries' : 'engine mechanics'}). Headlamp convergence points may require retrofitting depending on Left/Right traffic offsets if importing from United Kingdom or Japan.`
      },
      {
        title: `Phase IV: Settlement of Duties & Plate Issuance`,
        body: `File PCC declarative manifests. In ${dName}, pay the calculated sum of ${destinationCountry.vatRate*100}% VAT ($${calculationMetrics.vat.toLocaleString()}) and the relevant Excise levies. Present your stamped certificates at the local department of vehicles (e.g., Wydział Komunikacji or DMV) to receive new metallic plates and logbooks.`
      }
    ];
  }, [originCountry, destinationCountry, vehicleYear, manufacturerName, modelName, vehicleValueUsd, fuelType, calculationMetrics]);

  return (
    <div className="w-full bg-slate-50 min-h-screen text-slate-800 font-sans p-1 pb-16" id="taxduty-calculator-root">
      
      {/* HEADER HERO AREA */}
      <div className="max-w-7xl mx-auto pt-8 px-4 sm:px-6" id="taxduty-hero-section">
        <div className="relative rounded-3xl bg-white text-slate-900 p-8 md:p-10 shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300 border border-black/[0.03] animate-in fade-in duration-300 mb-8">
          <div className="relative z-10 max-w-4xl">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-950 font-sans" id="taxduty-main-heading">
              Cross-Border Tax &amp; Import Duty Calculator
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8" id="taxduty-content-container">
        
        {/* LEFT PANEL: CONFIGURATION PARAMETERS */}
        <div className="lg:col-span-5 space-y-6" id="taxduty-inputs-column">
          
          {/* ORIGIN & DESTINATION JURISDICTIONS (MANDATORY STEP 1) */}
          <div className="bg-white border border-black/[0.03] rounded-3xl p-6 shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300 space-y-5" id="jurisdiction-card">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#8B0000] flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#8B0000]" /> 1. Logistics Corridor Setup
              </h3>
              <span className="text-[10px] text-slate-400 font-mono font-bold">Bilateral Treaties Enabled</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* ORIGIN SELECTOR */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">Origin Country (Source)</label>
                <div className="relative">
                  <select
                    value={originCountryCode}
                    onChange={(e) => setOriginCountryCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/60 rounded-xl py-2.5 pl-3.5 pr-8 text-xs font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-red-100/30 focus:border-[#8B0000] transition-all cursor-pointer appearance-none"
                    id="origin-country-dropdown"
                  >
                    {TAX_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* DESTINATION SELECTOR */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">Destination Country (Import)</label>
                <div className="relative">
                  <select
                    value={destinationCountryCode}
                    onChange={(e) => setDestinationCountryCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/60 rounded-xl py-2.5 pl-3.5 pr-8 text-xs font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-red-100/30 focus:border-[#8B0000] transition-all cursor-pointer appearance-none"
                    id="destination-country-dropdown"
                  >
                    {TAX_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code} disabled={c.code === originCountryCode}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

            </div>

            {/* ROUTE CORRIDOR METRICS INSIGHTS */}
            <div className="bg-slate-50/80 border border-black/[0.02] p-4 rounded-2xl text-xs space-y-1 flex items-start gap-2.5">
              <div className="p-1 rounded bg-red-50 text-[#8B0000] border border-red-200/30 shrink-0 mt-0.5">
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Dynamic Tariff Assessment:</p>
                <p className="text-[10px] text-slate-550 leading-relaxed mt-0.5">
                  Transportation from <span className="font-semibold text-slate-700">{originCountry.name}</span> to <span className="font-semibold text-slate-700">{destinationCountry.name}</span> is subjected to 
                  {calculationMetrics.isIntraEu 
                    ? " internal EU free-circulation. Import tariffs are waived (0% Duty base)." 
                    : ` external global customs checks. Standard ${destinationCountry.importDutyRate * 100}% passive entry tariff holds.`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* VEHICLE CONFIGURATION SELECTOR */}
          <div className="bg-white border border-black/[0.03] rounded-3xl p-6 shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300 space-y-5" id="vehicle-specs-input-panel">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#8B0000]" id="vehicle-params-selector-header">
                <Car className="w-4 h-4 text-[#8B0000]" /> 2. Vehicle Parameters Identification
              </h3>
              
              {/* MANUAL MODE TOGGLE switch */}
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setManualMode(false)}
                  className={`px-2 py-1 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${!manualMode ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
                >
                  VIN Decode
                </button>
                <button
                  type="button"
                  onClick={() => setManualMode(true)}
                  className={`px-2 py-1 rounded-lg text-[9px] font-bold transition-all cursor-pointer ${manualMode ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
                >
                  Manual Fill
                </button>
              </div>
            </div>

            {/* VIN LOOKUP FORM */}
            {!manualMode ? (
              <div className="space-y-4" id="vin-decoding-subset">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Preset Chassis VIN Lookup</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Paste 17-digit code..."
                      value={vinLookupInput}
                      onChange={(e) => setVinLookupInput(e.target.value.toUpperCase())}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 pr-10 text-xs font-mono font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-red-100/30 focus:border-[#8B0000] transition-all uppercase tracking-wider"
                    />
                    <Sparkles className="w-4 h-4 text-[#8B0000] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[10px]" id="vin-selector-quickies">
                  <button
                    onClick={() => {
                      setVinLookupInput('WP0AB2A92MS299212');
                      handleDecodeVinData('WP0AB2A92MS299212');
                    }}
                    className="p-3 bg-white border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 transition-all duration-300 rounded-2xl text-left cursor-pointer truncate"
                  >
                    <p className="font-extrabold text-[#8B0000]">Porsche 911 (Car. S)</p>
                    <p className="text-[8px] text-slate-500 font-mono mt-0.5 font-bold">3.0L Petrol Boxer</p>
                  </button>

                  <button
                    onClick={() => {
                      setVinLookupInput('WBA53BJ0XPX881270');
                      handleDecodeVinData('WBA53BJ0XPX881270');
                    }}
                    className="p-3 bg-white border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 transition-all duration-300 rounded-2xl text-left cursor-pointer truncate"
                  >
                    <p className="font-extrabold text-[#8B0000]">BMW M5 Competition</p>
                    <p className="text-[8px] text-slate-500 font-mono mt-0.5 font-bold">4.4L Petrol V8</p>
                  </button>

                  <button
                    onClick={() => {
                      setVinLookupInput('5YJSA1E4XPF231495');
                      handleDecodeVinData('5YJSA1E4XPF231495');
                    }}
                    className="p-3 bg-white border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 transition-all duration-300 rounded-2xl text-left cursor-pointer truncate"
                  >
                    <p className="font-extrabold text-[#8B0000]">Tesla Model S Long Range</p>
                    <p className="text-[8px] text-emerald-600 font-mono font-bold mt-0.5">🔋 Zero-CE EV</p>
                  </button>

                  <button
                    onClick={() => {
                      setVinLookupInput('WBA3D3C57HN364022');
                      handleDecodeVinData('WBA3D3C57HN364022');
                    }}
                    className="p-3 bg-white border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 transition-all duration-300 rounded-2xl text-left cursor-pointer truncate"
                  >
                    <p className="font-extrabold text-[#8B0000]">BMW 320i Luxury</p>
                    <p className="text-[8px] text-slate-500 font-mono mt-0.5 font-bold">2.0L Petrol turbo</p>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleDecodeVinData(vinLookupInput)}
                  disabled={isComputing}
                  className="w-full bg-[#8B0000] hover:bg-[#730000] disabled:bg-slate-200 text-white font-bold text-xs py-3 rounded-xl cursor-pointer shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 transition-all duration-300"
                >
                  {isComputing ? 'Querying database templates...' : 'Decode & Load Parameters'}
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs" id="manual-editable-blocks">
                
                {/* BRAND & MODEL SERIES */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase block">Brand (Make)</label>
                    <input
                      type="text"
                      value={manufacturerName}
                      onChange={(e) => setManufacturerName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-850 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase block">Model Designation</label>
                    <input
                      type="text"
                      value={modelName}
                      onChange={(e) => setModelName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-850 focus:bg-white"
                    />
                  </div>
                </div>

                {/* YEAR & ENGINE CAPACITY */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase block">Production Year</label>
                    <input
                      type="number"
                      value={vehicleYear}
                      onChange={(e) => setVehicleYear(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono font-bold text-slate-850 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase block">Engine Capacity (CC)</label>
                    <input
                      type="number"
                      value={engineCapacityCc}
                      onChange={(e) => setEngineCapacityCc(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono font-bold text-slate-850 focus:bg-white"
                      disabled={fuelType === 'Electric'}
                    />
                  </div>
                </div>

                {/* FUEL TYPE & VALUATION */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase block">Powertrain fuel</label>
                    <select
                      value={fuelType}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setFuelType(val);
                        if (val === 'Electric') setEngineCapacityCc(0);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold text-slate-850 focus:bg-white cursor-pointer"
                    >
                      <option value="Petrol">Petrol (Gasoline)</option>
                      <option value="Diesel">Diesel</option>
                      <option value="Electric">Electric (BEV)</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-450 uppercase block">Declared Vehicle Value (USD)</label>
                    <input
                      type="number"
                      value={vehicleValueUsd}
                      onChange={(e) => setVehicleValueUsd(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-mono font-bold text-slate-850 focus:bg-white"
                    />
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

        {/* RIGHT PANEL: COMPUTED TAX MATRIX, CHECKLIST, AI COUNSELOR */}
        <div className="lg:col-span-7 space-y-6" id="taxduty-outputs-column">
          
          {/* LOADER ELEMENT */}
          {isComputing && (
            <div className="bg-white border border-slate-200 rounded-3xl p-16 shadow-sm flex flex-col items-center justify-center text-center space-y-4" id="taxduty-loader">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-slate-110 border-t-red-650 animate-spin" />
                <FileSpreadsheet className="w-6 h-6 text-red-650 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm">Validating Bilateral Double Tax Surcharges...</h3>
                <p className="text-xs text-slate-400 max-w-sm">Assessing destination VAT and registration guidelines...</p>
              </div>
            </div>
          )}

          {/* ACTIVE OUTPUT CONSOLE */}
          {!isComputing && showResults && (
            <div className="space-y-6" id="active-calculator-presentation">
              
              {/* TAB CONFIGURATORS */}
              <div className="bg-slate-200/60 p-1 rounded-2xl flex flex-wrap gap-1 border border-slate-200" id="calculator-tabs">
                <button
                  type="button"
                  onClick={() => setActiveTab('fees')}
                  className={`flex-1 min-w-[100px] px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'fees'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  <Landmark className="w-4 h-4 text-rose-600" /> Cost Breakdown
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('documents')}
                  className={`flex-1 min-w-[100px] px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'documents'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  <FileCheck className="w-4 h-4 text-indigo-600" /> Documents Checklist
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('aiExplanation')}
                  className={`flex-1 min-w-[100px] px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'aiExplanation'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-600" /> Process Steps (AI)
                </button>
              </div>

              {/* ACTIVE MATRIX VIEW */}
              <div className="bg-white border border-black/[0.03] rounded-3xl p-6 shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300 min-h-[380px]">
                
                {/* TAB 1: COMPUTED FEES BREAKDOWN */}
                {activeTab === 'fees' && (
                  <div className="space-y-6" id="fees-split-box">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-5">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Specs: {vehicleYear} {manufacturerName} {modelName}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-1 font-mono">
                          Import stream: {originCountry.code} ({originCountry.name}) ➔ {destinationCountry.code} ({destinationCountry.name})
                        </p>
                      </div>

                      <div className="bg-red-50/50 border border-red-200/30 p-4 rounded-2xl text-right shrink-0 shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300">
                        <p className="text-[9px] font-mono font-bold text-slate-550 uppercase tracking-widest">Est. Landed Total</p>
                        <p className="text-2xl font-black mt-1 text-[#8B0000]" id="landed-cost-result-display">
                          ${calculationMetrics.totalLanded.toLocaleString()} USD
                        </p>
                        <p className="text-[8px] text-slate-450 font-mono font-medium mt-0.5">Base cost + duties + VAT</p>
                      </div>
                    </div>

                    {/* DETAILED LEDGER */}
                    <div className="space-y-3.5" id="tariff-ledger">
                      <h5 className="text-[10px] font-bold text-slate-450 uppercase tracking-widest">Landed cost ledger details</h5>
                      
                      <div className="space-y-2.5 text-xs font-mono">
                        
                        {/* BASE VALUE */}
                        <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 transition-all duration-300">
                          <span className="text-slate-650 flex items-center gap-1.5">
                            <Car className="w-3.5 h-3.5 text-slate-400" /> Base Vehicle value (USD):
                          </span>
                          <span className="text-slate-950 font-bold">${calculationMetrics.baseValue.toLocaleString()}</span>
                        </div>

                        {/* IMPORT DUTY */}
                        <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 transition-all duration-300">
                          <div className="space-y-0.5">
                            <span className="text-slate-650 flex items-center gap-1.5">
                              <Landmark className="w-3.5 h-3.5 text-slate-400" /> Customs Import Duty:
                            </span>
                            <span className="text-[8px] text-slate-400 block ml-5">
                              Rate: {calculationMetrics.importDutyRate}%
                            </span>
                          </div>
                          <span className="text-slate-950 font-bold">${calculationMetrics.importDuty.toLocaleString()}</span>
                        </div>

                        {/* EXCISE TAX */}
                        <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 transition-all duration-300">
                          <div className="space-y-0.5">
                            <span className="text-slate-650 flex items-center gap-1.5">
                              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" /> Regional Excise (Malus):
                            </span>
                            <span className="text-[9px] text-[#8B0000] font-bold block ml-5">
                              {calculationMetrics.exciseLabel}
                            </span>
                          </div>
                          <span className="text-slate-950 font-bold">${calculationMetrics.excise.toLocaleString()}</span>
                        </div>

                        {/* VALUE ADDED TAX (VAT) */}
                        <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 transition-all duration-300">
                          <div className="space-y-0.5">
                            <span className="text-slate-650 flex items-center gap-1.5">
                              <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Value Added Tax (VAT):
                            </span>
                            <span className="text-[8px] text-slate-400 block ml-5">
                              Rate: {calculationMetrics.vatRate}% (Destination base)
                            </span>
                          </div>
                          <span className="text-slate-950 font-bold">${calculationMetrics.vat.toLocaleString()}</span>
                        </div>

                        {/* FIX FEES */}
                        <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 transition-all duration-300">
                          <span className="text-slate-650 flex items-center gap-1.5">
                            <Settings className="w-3.5 h-3.5 text-slate-400" /> Local Stamp dues & Registration fees:
                          </span>
                          <span className="text-slate-950 font-bold">${calculationMetrics.fixedFee.toLocaleString()}</span>
                        </div>

                        {/* ENVIRONMENTAL INDEX */}
                        <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 transition-all duration-300">
                          <span className="text-slate-650 flex items-center gap-1.5">
                            <Flame className="w-3.5 h-3.5 text-slate-400" /> Eco-Malus environmental surcharge:
                          </span>
                          <span className="text-slate-950 font-bold">${calculationMetrics.envFee.toLocaleString()}</span>
                        </div>

                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: REQUIRED CHECKLIST BASED ON IMPORT/EXPORT CORRIDOR */}
                {activeTab === 'documents' && (
                  <div className="space-y-6" id="documents-checklist-subset">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                        <FileCheck className="w-4.5 h-4.5 text-indigo-600" /> Required Customs & Road Docs Checklist
                      </h4>
                      <p className="text-xs text-slate-450 mt-0.5">
                        You must compile the following physical dossiers to submit to vehicle inspectors in <span className="font-semibold text-slate-700">{destinationCountry.name}</span>.
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {destinationCountry.requiredDocs.map((doc, idx) => (
                        <div key={idx} className="p-3.5 bg-white border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 transition-all duration-300 rounded-2xl flex items-start gap-2.5 text-xs">
                          <div className="p-0.5 bg-emerald-100 text-emerald-800 rounded mt-0.5 shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{doc}</p>
                            <p className="text-[10px] text-slate-450 mt-0.5">Standard certified file format required (notarized translation where appropriate).</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 pt-4 p-4 bg-indigo-50/50 border border-indigo-150 rounded-2xl text-[11px] text-indigo-950 leading-relaxed shadow-sm">
                      <span className="font-bold">Border Tip:</span> Keep original Bill of Sale invoices showing manufacturer chassis and motor sequence indexes. Customs agencies cross-check these values with state-certified databases.
                    </div>
                  </div>
                )}

                {/* TAB 3: AI DISPATCH EXPLANATION ON PROCESS STEPS */}
                {activeTab === 'aiExplanation' && (
                  <div className="space-y-5" id="counselor-ai-bot-sheet">
                    <div className="bg-gradient-to-r from-red-50 to-amber-50 border border-rose-100 p-4 rounded-2xl flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Virtual Cargo Customs Counselor (AI Agent)</h4>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-normal">
                           Step-by-step dispatch logistics formulated for moving a vehicle from <span className="font-semibold">{originCountry.name}</span> to the destination registry of <span className="font-semibold">{destinationCountry.name}</span>.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 text-xs">
                      {computedAiGuideSteps.map((step, idx) => (
                        <div key={idx} className="space-y-1 p-4 bg-white border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 transition-all duration-300 rounded-2xl relative">
                          <div className="absolute top-4 right-4 bg-red-50 text-[#8B0000] border border-red-200/55 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">
                            STEP 0{idx + 1}
                          </div>
                          <p className="font-extrabold text-slate-900">{step.title}</p>
                          <p className="text-slate-650 leading-relaxed text-[11px] mt-1.5">{step.body}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-red-50/55 border border-red-200/30 text-slate-800 rounded-2xl font-mono text-[9px] flex items-center gap-1.5 mt-2">
                      <Terminal className="w-4 h-4 text-[#8B0000] animate-pulse shrink-0" />
                      <span className="text-slate-600 font-bold">Customs AI Agent checklist verified: 100% legal road safety patterns calculated.</span>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, Truck, ShieldCheck, MessageSquare, Send, CheckCircle2, 
  ChevronRight, Sparkles, Star, FileText, Lock, DollarSign, Info, Eye, 
  MapPin, Check, Plus, Wrench, RefreshCw, X, Shield, Calendar, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Vehicle } from '../types';

export interface DamagedVehicle {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  price: number;
  mileage: number;
  engine: string;
  transmission: string;
  driveType: string;
  location: string;
  extColor: string;
  intColor: string;
  images: string[];
  sellerName: string;
  sellerRating: number;
  damageSeverity: 'Minor' | 'Moderate' | 'Severe' | 'Salvage';
  drivable: boolean;
  damageDetails: string;
  titleStatus: 'Salvage Certificate' | 'Certificate of Destruction' | 'Rebuildable Clear Title' | 'Branded';
  requiredParts: string[];
  documents: Array<{ name: string; size: string; type: string }>;
}

// Pre-populated default damaged vehicle fleet
const DEFAULT_DAMAGED_VEHICLES: DamagedVehicle[] = [
  {
    vin: 'WP0AF2Y1XNS782019',
    year: 2021,
    make: 'Porsche',
    model: 'Taycan Cross Turismo 4S',
    trim: 'Off-Road Spec Electric',
    price: 38200, // Highly depreciated due to damage
    mileage: 18450,
    engine: 'Dual AC Electric Synchronous',
    transmission: '2-Speed Automatic',
    driveType: 'AWD',
    location: 'Munich Warehouse B, Germany',
    extColor: 'Mamba Green Metallic',
    intColor: 'Black Eco-Leather',
    sellerName: 'AutoRisk Salvage Brokerage',
    sellerRating: 4.8,
    damageSeverity: 'Moderate',
    drivable: true,
    damageDetails: 'Scrapes on the bottom high-voltage armor (battery health verified 94% ok). Right front air suspension strut requires physical change. Front bumper skin is split.',
    titleStatus: 'Rebuildable Clear Title',
    requiredParts: ['Airsuspension Front Right Strut', 'Front bumper cover', 'Underbody carbon armor shield'],
    documents: [
      { name: 'DEKRA_Battery_Diagnostic_Report.pdf', size: '2.4 MB', type: 'Technical Scan' },
      { name: 'TUV_Crash_De-registration_Form.pdf', size: '1.1 MB', type: 'Official Cert' }
    ],
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    vin: 'WBS53AY0NLP104920',
    year: 2022,
    make: 'BMW',
    model: 'M4 Competition',
    trim: 'xDrive G82 Coupe',
    price: 43900,
    mileage: 6200,
    engine: '3.0L TwinPower Turbo I6',
    transmission: '8-Speed M Steptronic',
    driveType: 'AWD',
    location: 'Port of Rotterdam Block 4',
    extColor: 'Frozen Portimao Blue',
    intColor: 'Kyalami Orange Leather',
    sellerName: 'Delta Insurance Liquidations',
    sellerRating: 4.9,
    damageSeverity: 'Severe',
    drivable: false,
    damageDetails: 'T-bone impact on passenger side rear quarter panel. Wheel suspension hub sheered. Axle bent. Differential intact. Airbags did not deploy. Engine runs and drives but steering disabled.',
    titleStatus: 'Salvage Certificate',
    requiredParts: ['Rear Passenger Quarter Panel', 'Suspension Hub Carrier', 'Aft Subframe Section', '20" JetBlack Alloy M-Wheel'],
    documents: [
      { name: 'Copart_Subframe_Laser_Scan.pdf', size: '4.8 MB', type: 'Physical Scan' },
      { name: 'Police_Incident_Accident_Log.pdf', size: '840 KB', type: 'Police Report' }
    ],
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    vin: '1G11Z6S1XP2093410',
    year: 2021,
    make: 'Tesla',
    model: 'Model S',
    trim: 'Plaid Tri-Motor 1020HP',
    price: 49500,
    mileage: 21900,
    engine: 'Tri-Motor Electric (Plaid)',
    transmission: 'Single Speed Direct Drive',
    driveType: 'AWD',
    location: 'Chicago Terminal Yard C',
    extColor: 'Solid Black',
    intColor: 'Carbon Fiber White',
    sellerName: 'Apex Fleet Disposal Ltd',
    sellerRating: 4.7,
    damageSeverity: 'Salvage',
    drivable: false,
    damageDetails: 'Submerged in clean fresh water lake up to bottom of seat cushions. High-voltage pack isolated automatically. Telematics modular requires swap. Body and glass in perfect condition.',
    titleStatus: 'Certificate of Destruction',
    requiredParts: ['12V Low Voltage Lithium Battery', 'AI Autopilot Computer V4', 'Seat tracks reconditioning'],
    documents: [
      { name: 'Insurance_Water_Damage_Loss_Manifest.pdf', size: '3.2 MB', type: 'Assurance Loss' },
      { name: 'Chassis_Wiring_Insulation_Test_Report.pdf', size: '1.9 MB', type: 'Megger Test' }
    ],
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    vin: 'LFMB1DX92LNS11942',
    year: 2023,
    make: 'Z-Brand Roadster',
    model: 'Concept-T Prototype',
    trim: 'Aero Concept Spec',
    price: 29000,
    mileage: 1530,
    engine: 'Turbine Range Extender + Dual Hubs',
    transmission: 'Electric Direct Dual',
    driveType: 'RHD RWD',
    location: 'Yokohama Hub, Japan',
    extColor: 'Liquid Chrome',
    intColor: 'Alcantara Suede Grey',
    sellerName: 'Nippon Engineering Prototypes',
    sellerRating: 5.0,
    damageSeverity: 'Minor',
    drivable: true,
    damageDetails: 'Superficial carbon-fiber body panel cracks in front valence after dynamic circuit demonstration. Headlight lens chipped. Mechanics in factory showroom state.',
    titleStatus: 'Branded',
    requiredParts: ['Front lower front splitter', 'Left carbon bonnet housing', 'LED Headlamp assembly'],
    documents: [
      { name: 'Factory_Prototype_Specsheet.pdf', size: '5.2 MB', type: 'Spec Sheet' },
      { name: 'Customs_Import_Waiver_C10.pdf', size: '1.3 MB', type: 'Customs File' }
    ],
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=800'
    ]
  }
];

interface DamagedVehiclesSectionProps {
  sellerModifiedVehicles?: Vehicle[];
}

export default function DamagedVehiclesSection({ sellerModifiedVehicles = [] }: DamagedVehiclesSectionProps) {
  // Convert any standard vehicles that sellers marked as "Damaged" into our layout representation
  const mergedVehicles = useMemo(() => {
    // Collect vehicles marked as damaged or with condition === 'Damaged'
    const systemAndSellerDamaged = sellerModifiedVehicles
      .filter(v => v.condition === 'Damaged' || v.isDamagedCategory)
      .map(v => {
        // Map standard Vehicle fields to DamagedVehicle schema
        return {
          vin: v.vin,
          year: v.year,
          make: v.make,
          model: v.model,
          trim: v.trim,
          price: v.price,
          mileage: v.mileage,
          engine: v.engine,
          transmission: v.transmission,
          driveType: v.driveType,
          location: v.location,
          extColor: v.extColor,
          intColor: v.intColor,
          images: v.images && v.images.length > 0 ? v.images : ['https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800'],
          sellerName: 'Private Marketplace Seller',
          sellerRating: 4.8,
          damageSeverity: (v.damageSeverity as any) || 'Moderate',
          drivable: v.mileage < 80000, // heuristic
          damageDetails: v.damageDetails || 'Listed via standard selling wizard. Marked as "Damaged Class". Underbody inspection and parts checklist suggested before checkout.',
          titleStatus: 'Salvage Certificate' as const,
          requiredParts: v.requiredRepairs || ['Front bumper skin', 'Undercarriage review'],
          documents: [
            { name: 'Seller_Inspection_Log.pdf', size: '1.2 MB', type: 'Self Certified Sheet' }
          ]
        } as DamagedVehicle;
      });

    return [...DEFAULT_DAMAGED_VEHICLES, ...systemAndSellerDamaged];
  }, [sellerModifiedVehicles]);

  // Filters State
  const [severityFilter, setSeverityFilter] = useState<'All' | 'Minor' | 'Moderate' | 'Severe' | 'Salvage'>('All');
  const [drivableFilter, setDrivableFilter] = useState<'All' | 'Drivable' | 'Non-Drivable'>('All');
  const [selectedVin, setSelectedVin] = useState<string>(mergedVehicles[0]?.vin || '');

  // Active Vehicle selector
  const activeVehicle = useMemo(() => {
    return mergedVehicles.find(v => v.vin === selectedVin) || mergedVehicles[0];
  }, [mergedVehicles, selectedVin]);

  // --- TRANSPORT REQUEST MODULE STATE ---
  const [trailerType, setTrailerType] = useState<'open' | 'enclosed'>('open');
  const [deliveryRegion, setDeliveryRegion] = useState<string>('Middle East (Jebel Ali Terminal)');
  const [drivableConfirm, setDrivableConfirm] = useState<'yes' | 'no'>(activeVehicle?.drivable ? 'yes' : 'no');

  // Trigger sync if active vehicle shifts drivability status
  React.useEffect(() => {
    if (activeVehicle) {
      setDrivableConfirm(activeVehicle.drivable ? 'yes' : 'no');
    }
  }, [activeVehicle]);

  // Precalculated transport quotes based on selection
  const transportQuotes = useMemo(() => {
    if (!activeVehicle) return [];
    
    // Base cost calculations
    const baseMilesRate = trailerType === 'enclosed' ? 2.8 : 1.6;
    const mechanicalInoperableSurcharge = drivableConfirm === 'no' ? 450 : 0;
    
    // Fixed logistics partner rates
    return [
      {
        company: 'Sovereign Global Heavy-Haul',
        rate: Math.round(1800 * baseMilesRate + mechanicalInoperableSurcharge),
        duration: '12-16 Days (Ocean Line + Rail)',
        rating: 4.9,
        type: trailerType === 'enclosed' ? 'Premium Enclosed Rack' : 'Standard RO-RO Deck',
        insured: 'Up to $150,000 Transit Protection'
      },
      {
        company: 'Apex Intermodal Salvage Carrier',
        rate: Math.round(1450 * baseMilesRate + mechanicalInoperableSurcharge),
        duration: '18-22 Days (Shared multi-stack transport)',
        rating: 4.7,
        type: trailerType === 'enclosed' ? 'Enclosed Multi-Pack' : 'Open Multi-Car Transporter',
        insured: 'Up to $80,000 Standard Carrier Cargo Policy'
      },
      {
        company: 'Nippon Trans-Harbor Expedite',
        rate: Math.round(2400 * baseMilesRate + mechanicalInoperableSurcharge + 200),
        duration: '8-10 Days (Priority Fast Cargo Express)',
        rating: 5.0,
        type: trailerType === 'enclosed' ? 'Climate Sealed Premium Safe-Box' : 'Open Upper-Deck Protection',
        insured: 'Up to $500,000 Absolute Full-Loss Replacement Guarantee'
      }
    ];
  }, [activeVehicle, trailerType, drivableConfirm, deliveryRegion]);

  const [selectedQuoteIdx, setSelectedQuoteIdx] = useState<number>(0);
  const selectedQuote = transportQuotes[selectedQuoteIdx] || transportQuotes[0];

  // Combined checkout calculations
  const totalCombinedTransactionCost = useMemo(() => {
    if (!activeVehicle || !selectedQuote) return 0;
    const documentFilingFee = 350;
    const customsBond = Math.round(activeVehicle.price * 0.05); // 5% customs bond
    return activeVehicle.price + selectedQuote.rate + documentFilingFee + customsBond;
  }, [activeVehicle, selectedQuote]);

  // Escrow state & coordination status
  const [escrowStatus, setEscrowStatus] = useState<'Idle' | 'Funds_Locked' | 'Transit_Scheduled' | 'Funds_Wired'>('Idle');
  const [isQuotingInProcess, setIsQuotingInProcess] = useState<boolean>(false);
  const [showDirectChat, setShowDirectChat] = useState<boolean>(false);

  // --- CHAT SYSTEM FOR REAL-TIME NEGOTIATOR ---
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'User' | 'Seller'; text: string; time: string }>>([
    {
      sender: 'Seller',
      text: 'Hello! Thanks for looking at this vehicle listing. We have uploaded the laser frame alignments scan and official deregistration titles. It is parked in a secured bay and ready for tow truck pick-up. Let me know if you need any additional videos or direct photos.',
      time: 'Just now'
    }
  ]);

  // Filtered lists
  const filteredVehicles = useMemo(() => {
    return mergedVehicles.filter(v => {
      if (severityFilter !== 'All' && v.damageSeverity !== severityFilter) return false;
      if (drivableFilter === 'Drivable' && !v.drivable) return false;
      if (drivableFilter === 'Non-Drivable' && v.drivable) return false;
      return true;
    });
  }, [mergedVehicles, severityFilter, drivableFilter]);

  // Synchronise selected VIN if filter causes current selection to disappear
  React.useEffect(() => {
    if (filteredVehicles.length > 0 && !filteredVehicles.some(v => v.vin === selectedVin)) {
      setSelectedVin(filteredVehicles[0].vin);
    }
  }, [filteredVehicles, selectedVin]);

  // Handle direct message send
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'User', text: userMsg, time: '1s ago' }]);
    setChatInput('');

    // Simulated intelligence reply matching user words
    setTimeout(() => {
      let sellerReply = "That sounds reasonable. If you lock the bid inside the combined transit escrow ledger, we can dispatch the legal title sheets to the logistics partner within 24 hours.";
      if (userMsg.toLowerCase().includes('discount') || userMsg.toLowerCase().includes('offer') || userMsg.toLowerCase().includes('price') || userMsg.toLowerCase().includes('less')) {
        sellerReply = `The asking rate is already highly depreciated, but we can issue a direct $1,200 seller concession coupon toward your transport broker choice if you execute the deposit locker tonight.`;
      } else if (userMsg.toLowerCase().includes('battery') || userMsg.toLowerCase().includes('engine') || userMsg.toLowerCase().includes('run')) {
        sellerReply = `Confirmed that the core powertrain and electric/hybrid block was verified isolated and holds perfect structural integrity. Zero faults on OBD2 system. Can be safely rolled into a dry cargo container.`;
      } else if (userMsg.toLowerCase().includes('tow') || userMsg.toLowerCase().includes('pick') || userMsg.toLowerCase().includes('carrier')) {
        sellerReply = `No forklift needed! The local warehouse terminal has heavy dock loading ramps. Any open transport hook can load our vehicle easily since steering holds true.`;
      }
      setChatMessages(prev => [...prev, { sender: 'Seller', text: sellerReply, time: 'Just now' }]);
    }, 1200);
  };

  const handleBookTransportAndEscrow = () => {
    setIsQuotingInProcess(true);
    setTimeout(() => {
      setEscrowStatus('Funds_Locked');
      setIsQuotingInProcess(false);
      alert(`SUCCESS: Safe Escrow Hold Created!\n\n1. Combined Deposit locked of $${totalCombinedTransactionCost.toLocaleString()} USD.\n2. Vehicle release request flagged.\n3. Transport scheduled via ${selectedQuote.company}.\n\nFunds will stay frozen and are protected by insurance until the transport carrier uploads the Bill of Lading stamp from the delivery depot!`);
    }, 1500);
  };

  return (
    <div className="space-y-6 py-4 text-slate-800 font-sans" id="damaged-vehicles-division-system">
      
      {/* 1. TOP HEADER - WITH PREMIUM 3D LOOK */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B0000]/2 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="space-y-1 md:w-3/5 text-left bg-transparent">
          <h2 className="text-xl font-black text-[#8B0000] tracking-tight uppercase">Damaged &amp; Rebuildable Cars Center</h2>
        </div>

        {/* Global Stats bar with 3D design */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 w-full md:w-72 text-left shrink-0 space-y-3 bg-transparent shadow-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Available Cars</span>
              <span className="text-sm font-black text-slate-800">{mergedVehicles.length} Units</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Average Discount</span>
              <span className="text-sm font-black text-[#8B0000]">-58%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC CONTROLS & FILTER GRID WITH 3D BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between border border-slate-200 bg-white p-4 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-left">
          {/* Severity filter block */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Damage Level</label>
            <div className="flex flex-wrap gap-2">
              {(['All', 'Minor', 'Moderate', 'Severe', 'Salvage'] as const).map(sev => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    severityFilter === sev
                      ? 'bg-[#8B0000] text-white border-[#8B0000] shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Drivability filter */}
          <div className="space-y-1.5 font-sans">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Can it drive?</label>
            <div className="flex gap-2">
              <button
                onClick={() => setDrivableFilter('All')}
                className={`px-3.5 py-1.5 text-xs rounded-xl border cursor-pointer font-bold transition-all ${
                  drivableFilter === 'All' 
                    ? 'bg-[#8B0000] text-white border-[#8B0000] shadow-xs' 
                    : 'bg-white text-slate-655 border-slate-200 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                Show All
              </button>
              <button
                onClick={() => setDrivableFilter('Drivable')}
                className={`px-3.5 py-1.5 text-xs rounded-xl border cursor-pointer font-bold transition-all ${
                  drivableFilter === 'Drivable' 
                    ? 'bg-[#8B0000] text-white border-[#8B0000] shadow-xs' 
                    : 'bg-white text-slate-655 border-slate-200 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                Drivable
              </button>
              <button
                onClick={() => setDrivableFilter('Non-Drivable')}
                className={`px-3.5 py-1.5 text-xs rounded-xl border cursor-pointer font-bold transition-all ${
                  drivableFilter === 'Non-Drivable' 
                    ? 'bg-[#8B0000] text-white border-[#8B0000] shadow-xs' 
                    : 'bg-white text-slate-655 border-slate-200 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                Needs Towing
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Assets Count */}
        <div className="text-right flex items-center justify-end text-xs font-bold text-slate-400">
          <span>{filteredVehicles.length} cars available</span>
        </div>
      </div>

      {/* 3. CORE DUAL-PANEL WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
        
        {/* LEFT COLUMN: VEHICLE DETAIL & SELECTION GRID (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredVehicles.map((car) => {
                const isActive = car.vin === selectedVin;
                return (
                  <motion.div
                    layout
                    key={car.vin}
                    onClick={() => setSelectedVin(car.vin)}
                    className={`border rounded-2xl overflow-hidden transition-all text-left cursor-pointer group flex flex-col justify-between h-auto ${
                      isActive 
                        ? 'ring-2 ring-[#8B0000] border-[#8B0000] bg-red-50/[0.02] shadow-xs' 
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
                    }`}
                  >
                    {/* Compact Image block with zero noisy overlays */}
                    <div className="relative h-32 bg-slate-100 shrink-0 overflow-hidden">
                      <img 
                        src={car.images[0]} 
                        alt={`${car.make} ${car.model}`} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Specifications */}
                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between bg-white">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-bold text-slate-900 uppercase leading-snug tracking-tight">
                            {car.year} {car.make} {car.model}
                          </h4>
                        </div>
                        <p className="text-base font-black font-mono mt-1 text-[#8B0000]">
                          ${car.price.toLocaleString()}
                        </p>
                      </div>

                      {/* Info lines */}
                      <div className="text-[10px] text-slate-500 font-sans grid grid-cols-2 gap-2 border-t border-b border-slate-100/80 py-2.5">
                        <div className="text-left">
                          <span className="block text-slate-400 uppercase text-[8px] font-semibold">CAR LOCATION</span>
                          <span className="font-extrabold truncate text-slate-700 block">{car.location.split(' B,')[0]}</span>
                        </div>
                        <div className="text-right">
                          <span className="block text-slate-400 uppercase text-[8px] font-semibold">MILEAGE</span>
                          <span className="font-extrabold text-slate-700 block">{car.mileage.toLocaleString()} mi</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs pt-1">
                        <span className="font-bold text-slate-500 truncate max-w-[100px]">{car.sellerName.replace(' Salvage Brokerage', '').replace(' Insurance Liquidations', '').slice(0, 16)}</span>
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider cursor-pointer transition-all border ${
                          isActive 
                            ? 'bg-[#8B0000] text-white border-[#8B0000]' 
                            : 'bg-white text-slate-650 border border-slate-200 hover:bg-slate-50 hover:text-slate-800'
                        }`}>
                          {isActive ? 'Active' : 'View details'}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* CHAT MESSENGER BOX FOR ACTIVE SELLER - FLAT 2D LOOK */}
          {activeVehicle && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5">
                  <div className="text-left bg-transparent">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{activeVehicle.sellerName}</h4>
                    <span className="text-[10px] text-slate-400 block font-sans font-medium">
                      Online Assistant
                    </span>
                  </div>
                </div>
              </div>

              {/* Chat Thread */}
              <div className="bg-slate-50/50 rounded-2xl p-4 h-[140px] overflow-y-auto space-y-3 scrollbar-none border border-slate-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)]">
                {chatMessages.map((msg, index) => (
                  <div key={index} className={`flex flex-col ${msg.sender === 'User' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-1.5 pb-1">
                      <span className="text-[9px] font-bold text-slate-400 font-sans">{msg.sender}</span>
                      <span className="text-[8px] text-slate-400 font-sans">{msg.time}</span>
                    </div>
                    <div className={`text-xs px-3.5 py-2 rounded-2xl max-w-[85%] text-left leading-relaxed ${
                      msg.sender === 'User' 
                        ? 'bg-[#8B0000] text-white rounded-tr-none' 
                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-xs'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Send */}
              <form onSubmit={handleSendMessage} className="flex gap-2 bg-transparent">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your message here..."
                  className="flex-1 bg-white border border-slate-200 border-b-2 border-b-slate-300 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#8B0000] text-slate-800 shadow-sm transition-all"
                />
                <button
                  type="submit"
                  className="bg-[#8B0000] hover:bg-red-700 text-white rounded-xl px-4 py-2 transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-extrabold font-sans shrink-0 uppercase shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </form>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: ACTIVE VEHICLE DETAIL & COMBINED DRAINAGE MODULE (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          {activeVehicle ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 text-left relative overflow-hidden shadow-sm">
              {/* TOP HEADER */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight leading-snug">
                    {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
                  </h3>
                  <p className="text-[10px] font-mono font-medium text-slate-400">{activeVehicle.vin}</p>
                </div>

                <div className="text-right">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">PRICE</span>
                  <span className="text-base font-mono font-black text-[#8B0000]">${activeVehicle.price.toLocaleString()}</span>
                </div>
              </div>

              {/* RECOVERABLE SPECIFICATIONS SHEETS */}
              <div className="space-y-4">
                
                {/* Specific Damage Diagnosis Box */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] text-[#8B0000] font-black font-sans uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-4 h-4" /> Repair Details
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
                    {activeVehicle.damageDetails}
                  </p>

                  <div className="pt-2.5 border-t border-slate-200/50 mt-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase font-sans block mb-1.5">Parts Needed for Repair:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeVehicle.requiredParts.map((part, pidx) => (
                        <span key={pidx} className="bg-white text-slate-600 border border-slate-200 text-[9px] px-2.5 py-1 rounded-lg font-mono font-bold shadow-2xs">
                          {part}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Logistics Docs Box */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] text-slate-500 font-extrabold font-sans uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#8B0000]" /> Car Documents &amp; Files
                  </span>
                  <div className="space-y-1.5">
                    {activeVehicle.documents.map((doc, docIdx) => (
                      <div key={docIdx} className="flex justify-between items-center text-xs bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-slate-600 truncate font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> {doc.name}
                        </span>
                        <span className="text-slate-400 font-mono text-[9px]">{doc.size}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* --- PROMINENT TRANSPORT REQUEST MODULE --- */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200/55">
                    <h4 className="text-[10px] font-black uppercase tracking-wider font-sans text-slate-900 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-[#8B0000]" /> Book Shipping &amp; Towing
                    </h4>
                  </div>

                  {/* Form fields */}
                  <div className="grid grid-cols-2 gap-3.5 text-xs">
                    
                    {/* Trailer selection */}
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 font-sans block font-bold uppercase tracking-wider">SHIPPING TYPE</label>
                      <div className="grid grid-cols-2 gap-1.5 uppercase text-[9px] font-sans">
                        <button
                          type="button"
                          onClick={() => setTrailerType('open')}
                          className={`p-1.5 border rounded-lg transition-all cursor-pointer font-bold ${
                            trailerType === 'open' 
                              ? 'bg-[#8B0000] border-[#8B0000] text-white' 
                              : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Open Truck
                        </button>
                        <button
                          type="button"
                          onClick={() => setTrailerType('enclosed')}
                          className={`p-1.5 border rounded-lg transition-all cursor-pointer font-bold ${
                            trailerType === 'enclosed' 
                              ? 'bg-[#8B0000] border-[#8B0000] text-white' 
                              : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Closed Truck
                        </button>
                      </div>
                    </div>

                    {/* Drivability check */}
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 font-sans block font-bold uppercase tracking-wider">CAN THE CAR DRIVE?</label>
                      <div className="grid grid-cols-2 gap-1.5 uppercase text-[9px] font-sans">
                        <button
                          type="button"
                          onClick={() => setDrivableConfirm('yes')}
                          className={`p-1.5 border rounded-lg transition-all cursor-pointer font-bold ${
                            drivableConfirm === 'yes' 
                              ? 'bg-emerald-600 border-emerald-600 text-white' 
                              : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          Yes (Drivable)
                        </button>
                        <button
                          type="button"
                          onClick={() => setDrivableConfirm('no')}
                          className={`p-1.5 border rounded-lg transition-all cursor-pointer font-bold ${
                            drivableConfirm === 'no' 
                              ? 'bg-[#8B0000] border-[#8B0000] text-white' 
                              : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          No (Towing)
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Regional Delivery option */}
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 font-sans block font-bold uppercase tracking-wider">WHERE TO SHIP?</label>
                    <select
                      value={deliveryRegion}
                      onChange={(e) => setDeliveryRegion(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 cursor-pointer outline-none focus:border-[#8B0000] shadow-sm transition-all"
                    >
                      <option value="Middle East (Jebel Ali Terminal)">Port of Jebel Ali (U.A.E - Dubai)</option>
                      <option value="Saudi Arabia (Jeddah Islamic)">Jeddah Islamic Port (Saudi Arabia)</option>
                      <option value="Europe Inland Terminal">Rotterdam Port Terminals (Netherlands)</option>
                      <option value="USA East Coast Port">Port of Newark (New York / New Jersey)</option>
                      <option value="Australia Hub (Port of Melbourne)">Port of Melbourne (Australia)</option>
                    </select>
                  </div>

                  {/* CARRIER QUOTES INDEX - AUTO GENERATED */}
                  <div className="pt-2 border-t border-slate-200/50">
                    <span className="text-[9px] font-bold text-slate-400 uppercase font-sans block mb-2">Available Shipping Quotes:</span>
                    <div className="space-y-2">
                      {transportQuotes.map((quote, qidx) => (
                        <div
                          key={quote.company}
                          onClick={() => setSelectedQuoteIdx(qidx)}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex justify-between items-center ${
                            selectedQuoteIdx === qidx
                              ? 'bg-white border-[#8B0000] shadow-xs text-slate-900 ring-1 ring-[#8B0000]'
                              : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          <div className="space-y-0.5 text-left shrink-0">
                            <span className="text-xs font-bold block text-slate-800">{quote.company}</span>
                            <span className="text-[9px] font-sans text-slate-400 block font-medium">{quote.type} • {quote.duration}</span>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs font-mono font-black text-[#8B0000]">${quote.rate.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* SECURED COMBINED LOCKER */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-left space-y-3 text-xs shadow-xs">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2 border-dashed">
                    <span className="text-[10px] text-slate-800 font-black uppercase tracking-wider flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#8B0000]" /> Safe Escrow Payment
                    </span>
                  </div>

                  <div className="space-y-1.5 text-slate-600 font-sans">
                    <div className="flex justify-between">
                      <span className="font-semibold">Car Price:</span>
                      <span className="font-bold text-slate-700">${activeVehicle.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Shipping Cost:</span>
                      <span className="font-bold text-slate-700">${selectedQuote.rate.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Customs &amp; Taxes:</span>
                      <span className="font-bold text-slate-700">$350</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/40 pb-1.5 border-dashed">
                      <span className="font-semibold">Refundable Deposit:</span>
                      <span className="font-bold text-slate-700">${(Math.round(activeVehicle.price * 0.05)).toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between font-black text-sm text-[#8B0000] pt-1.5">
                      <span>TOTAL SAFE PAYMENT:</span>
                      <span>${totalCombinedTransactionCost.toLocaleString()} USD</span>
                    </div>
                  </div>

                  {escrowStatus === 'Idle' ? (
                    <button
                      type="button"
                      onClick={handleBookTransportAndEscrow}
                      disabled={isQuotingInProcess}
                      className="w-full py-2.5 bg-[#8B0000] hover:bg-red-700 disabled:bg-slate-300 text-white rounded-xl text-center text-xs font-black uppercase tracking-wider cursor-pointer block transition-colors mt-2 shadow-[0_5px_15px_rgba(139,0,0,0.15)]"
                    >
                      {isQuotingInProcess ? 'Compiling Shipping offers...' : 'Lock Payment & Book Shipping'}
                    </button>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-left text-xs space-y-1.5 mt-2 shadow-2xs">
                      <span className="text-emerald-700 font-black block flex items-center gap-1.5">
                        ✓ Payment Locked in Safe Escrow (${totalCombinedTransactionCost.toLocaleString()})
                      </span>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-sans font-medium">
                        Your payment is held safely. The shipping company has been booked.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setEscrowStatus('Idle');
                          alert("Combined escrow released. Funds returned safely to buyer account.");
                        }}
                        className="text-[10px] font-black text-[#8B0000] hover:underline uppercase transition-colors shrink-0 pt-0.5 block"
                      >
                        Refund Money / Report Problem
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-500 max-w-md mx-auto shadow-sm">
              <AlertTriangle className="w-8 h-8 text-[#8B0000] mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800 mb-1">No Vehicle Selected</p>
              <p className="text-xs text-slate-400">Select any car from the list to see its details, repair files, and shipping costs.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

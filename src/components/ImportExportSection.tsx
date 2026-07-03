/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Globe, MapPin, Ship, FileText, CheckCircle2, ArrowRight, UploadCloud, 
  ShieldCheck, MessageSquare, Send, HelpCircle, Info, Lock, Scale, 
  DollarSign, SlidersHorizontal, Languages, UserCheck, RefreshCw, 
  AlertTriangle, Trash2, Users, Check, ExternalLink, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Vehicle } from '../types';
import UniversalSmartUpload from './UniversalSmartUpload';

export interface ExporterDealer {
  id: string;
  name: string;
  languages: string[];
  rating: number;
  completedExports: number;
  originHub: string;
  location: string;
  avatarBg: string;
  badge: string;
}

export interface ExportVehicle {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  price: number; // in USD
  vatEligible: boolean;
  vatAmount: number; // e.g. 19%
  status: 'VAT Eligible' | 'Customs Cleared' | 'Tax-Free Export' | 'Non-EU Spot';
  origin: string;
  image: string;
  regStatus: string;
  customsInfo: string;
  specs: {
    engine: string;
    transmission: string;
    mileage: number;
  };
}

const EXPORTERS: ExporterDealer[] = [
  {
    id: 'EXP-AUTORING',
    name: 'AutoRing Global Logistics GmbH',
    languages: ['German (DE)', 'English (EN)', 'Arabic (AR)', 'Turkish (TR)'],
    rating: 4.9,
    completedExports: 342,
    originHub: 'Port of Hamburg Terminal',
    location: 'Hamburg, Germany',
    avatarBg: 'bg-emerald-950 text-emerald-400 border-emerald-900/40',
    badge: 'Elite Exporter Seal'
  },
  {
    id: 'EXP-JPTRANSIT',
    name: 'Sovereign Nippon Shippers Ltd',
    languages: ['Japanese (JA)', 'English (EN)', 'Russian (RU)'],
    rating: 5.0,
    completedExports: 520,
    originHub: 'Yokohama Port Yard B',
    location: 'Yokohama, Japan',
    avatarBg: 'bg-indigo-950 text-indigo-400 border-indigo-900/40',
    badge: 'JEVIC Certified Broker'
  },
  {
    id: 'EXP-BISCAMP',
    name: 'Biscayne Export Merchants LLC',
    languages: ['English (EN)', 'Spanish (ES)', 'Portuguese (PT)'],
    rating: 4.8,
    completedExports: 219,
    originHub: 'Port of Miami Terminal 4',
    location: 'Miami, USA',
    avatarBg: 'bg-amber-950 text-amber-400 border-amber-900/40',
    badge: 'US CBP Certified Shipper'
  }
];

const EXPORT_VEHICLES: ExportVehicle[] = [
  {
    vin: 'WP0ZZZ99ZNS270034',
    year: 2021,
    make: 'Porsche',
    model: 'Taycan Cross Turismo 4S',
    trim: 'Off-Road Design SPEC',
    price: 76500,
    vatEligible: true,
    vatAmount: 14535, // 19%
    status: 'VAT Eligible',
    origin: 'Germany',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800',
    regStatus: 'German car ownership papers are fully verified.',
    customsInfo: 'Ready for shipping. All certificates are ready.',
    specs: { engine: 'Electric Motor (571 HP)', transmission: 'Automatic', mileage: 28400 }
  },
  {
    vin: 'WJDF820XLS2910403',
    year: 2023,
    make: 'Mercedes-Benz',
    model: 'G-Class G63 AMG',
    trim: 'Stronger Than Time Edition',
    price: 189000,
    vatEligible: true,
    vatAmount: 35910,
    status: 'Tax-Free Export',
    origin: 'Germany',
    image: 'https://images.unsplash.com/photo-1520050206274-a1ae446cb3cc?auto=format&fit=crop&q=80&w=800',
    regStatus: 'Clean VIN record with zero accidents.',
    customsInfo: 'Tax refund available. Ready for global shipping.',
    specs: { engine: '4.0L BiTurbo V8', transmission: '9-Speed Auto', mileage: 8200 }
  },
  {
    vin: 'JTHY30D50P5011928',
    year: 2022,
    make: 'Lexus',
    model: 'LX 600',
    trim: 'F-Sport Premium Command Suite',
    price: 104000,
    vatEligible: false,
    vatAmount: 0,
    status: 'Customs Cleared',
    origin: 'Japan',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
    regStatus: 'Export certificate is issued. Right-hand drive model.',
    customsInfo: 'Cleared for immediate delivery to global ports.',
    specs: { engine: '3.4L Twin-Turbo V6', transmission: '10-Speed Auto', mileage: 11400 }
  },
  {
    vin: '1FM5K8GC8LNC39103',
    year: 2020,
    make: 'Ford',
    model: 'Explorer ST',
    trim: '4WD Performance Spec',
    price: 34900,
    vatEligible: false,
    vatAmount: 0,
    status: 'Non-EU Spot',
    origin: 'USA',
    image: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=800',
    regStatus: 'Clean US title with no accidents. Ready for shipping.',
    customsInfo: 'Meets safety and environment standards.',
    specs: { engine: '3.0L EcoBoost V6', transmission: '10-Speed Auto', mileage: 45700 }
  }
];

export default function ImportExportSection() {
  const [vehicles, setVehicles] = useState<ExportVehicle[]>(EXPORT_VEHICLES);
  const [selectedVin, setSelectedVin] = useState<string>('WP0ZZZ99ZNS270034'); // Default select first
  
  // Country filter pairings
  const [originCountry, setOriginCountry] = useState<string>('Germany');
  const [destinationCountry, setDestinationCountry] = useState<string>('United Arab Emirates');
  const [preferredPort, setPreferredPort] = useState<string>('Jebel Ali Port (Dubai)');
  const [freightMode, setFreightMode] = useState<'RORO' | 'CONTAINER' | 'AIR'>('CONTAINER');

  // Interactive filters
  const [vatFilter, setVatFilter] = useState<'All' | 'VAT_Eligible' | 'Tax_Free'>('All');
  const [originFilter, setOriginFilter] = useState<'All' | 'Germany' | 'Japan' | 'USA'>('All');

  // Document Checklist state (dynamic based on countries and vehicle status)
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ id: string; name: string; type: string; status: 'Analyzing' | 'Verified' | 'Error' }>>([
    { id: '1', name: 'Original_Fahrzeugbrief_II.pdf', type: 'Registration Certificate', status: 'Verified' },
    { id: '2', name: 'EU_Certificate_of_Conformity_CoC.pdf', type: 'Manufacturer Certificate', status: 'Verified' }
  ]);
  const [newFileType, setNewFileType] = useState('Customs Declaration Form 104');
  const [dragActive, setDragActive] = useState(false);
  const [latestExportDocSrc, setLatestExportDocSrc] = useState<string | null>(null);

  // Escrow Transaction Steps Simulator
  const [escrowStep, setEscrowStep] = useState<1 | 2 | 3 | 4>(1); // 1: Deposit, 2: Verification, 3: Port Transit, 4: Confirmed Receipt
  const [escrowDepositLocked, setEscrowDepositLocked] = useState(false);

  // AI Export Assistant interaction
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'User' | 'AI'; text: string; timestamp: string }>>([
    {
      sender: 'AI',
      text: 'Hello! I am your AI Shipping Assistant. I am here to help you ship your car, calculate taxes, and handle customs paperwork. Please select any car above to see a simple export checklist!',
      timestamp: '09:00 AM'
    }
  ]);

  const activeVehicle = useMemo(() => {
    return vehicles.find(v => v.vin === selectedVin) || vehicles[0];
  }, [vehicles, selectedVin]);

  // Destination Port Options based on destinationCountry selection
  const destinationPorts = useMemo(() => {
    switch (destinationCountry) {
      case 'United Arab Emirates':
        return ['Jebel Ali Port (Dubai)', 'Port Khalid (Sharjah)', 'Khalifa Port (Abu Dhabi)'];
      case 'Saudi Arabia':
        return ['Jeddah Islamic Port', 'King Abdulaziz Port (Dammam)'];
      case 'Australia':
        return ['Port of Melbourne', 'Port of Sydney (Botany)', 'Port of Brisbane'];
      case 'Switzerland':
        return ['Basel Rhine Terminal (Inland Roro/Rail)'];
      case 'Nigeria':
        return ['Tin Can Island Port (Lagos)', 'Apapa Port'];
      default:
        return ['Global Transit Gateway Terminal'];
    }
  }, [destinationCountry]);

  // Sync preferredPort if destination country changes
  useEffect(() => {
    if (destinationPorts.length > 0) {
      setPreferredPort(destinationPorts[0]);
    }
  }, [destinationCountry, destinationPorts]);

  // Trigger AI advice when country mapping or vehicle changes
  useEffect(() => {
    if (!activeVehicle) return;
    
    // Simulate smart agent text dispatch
    const updatedChecklistAdvice = `Shipping Assistant: I am checking the export requirements for the ${activeVehicle.year} ${activeVehicle.make} ${activeVehicle.model} from ${activeVehicle.origin} to ${destinationCountry} (unloading at ${preferredPort}). Since this car is marked as ${activeVehicle.status}, customs taxes are estimated to be about 5% of the car price, and you may be able to get a VAT refund of $${activeVehicle.vatAmount.toLocaleString()}!`;
    
    setChatMessages(prev => [
      ...prev,
      {
        sender: 'AI',
        text: updatedChecklistAdvice,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [selectedVin, destinationCountry, preferredPort]);

  // Filter exports
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      if (originFilter !== 'All' && v.origin !== originFilter) return false;
      if (vatFilter === 'VAT_Eligible' && !v.vatEligible) return false;
      if (vatFilter === 'Tax_Free' && v.status !== 'Tax-Free Export') return false;
      return true;
    });
  }, [vehicles, vatFilter, originFilter]);

  // Compute shipping fees
  const calculatedShippingRates = useMemo(() => {
    let base = 2100;
    if (freightMode === 'AIR') base = 9800;
    if (freightMode === 'RORO') base = 1600;

    // source/destination complexity additions
    if (activeVehicle?.origin === 'Japan' && destinationCountry === 'Switzerland') base += 1400; // complex land transit
    if (activeVehicle?.origin === 'USA' && destinationCountry === 'Australia') base += 900;

    return {
      freightCost: base,
      customsAssurance: Math.round(activeVehicle?.price * 0.015),
      vatReclaimEst: activeVehicle?.vatAmount > 0 ? activeVehicle.vatAmount : 0,
      totalEstPay: Math.round(activeVehicle?.price + base + (activeVehicle?.price * 0.015))
    };
  }, [freightMode, destinationCountry, activeVehicle]);

  // Document Upload handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      addNewUploadedFile(file.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      addNewUploadedFile(e.target.files[0].name);
    }
  };

  const handleSmartExportUpload = (dataUrl: string, fileName: string) => {
    setLatestExportDocSrc(dataUrl);
    const newDoc = {
      id: Date.now().toString(),
      name: fileName,
      type: newFileType,
      status: 'Analyzing' as const
    };
    setUploadedFiles(prev => [...prev, newDoc]);

    setTimeout(() => {
      setUploadedFiles(prev => prev.map(f => f.id === newDoc.id ? { ...f, status: 'Verified' } : f));
    }, 2000);
  };

  const addNewUploadedFile = (fileName: string) => {
    const newDoc = {
      id: Date.now().toString(),
      name: fileName,
      type: newFileType,
      status: 'Analyzing' as const
    };
    setUploadedFiles(prev => [...prev, newDoc]);

    // Simulate validation ledger registry inside micro-second
    setTimeout(() => {
      setUploadedFiles(prev => prev.map(f => f.id === newDoc.id ? { ...f, status: 'Verified' } : f));
    }, 2000);
  };

  const deleteUploadedFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  };

  // AI Assistant Custom Chat submit
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const text = chatInput;
    setChatMessages(prev => [
      ...prev,
      { sender: 'User', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setChatInput('');

    // Formulate intelligent agent responses
    setTimeout(() => {
      let aiResponseText = "I understand. This car is classified under code 8703. Our safe escrow system connects with trusted local shipping agents to handle all customs papers for you.";
      if (text.toLowerCase().includes('tax') || text.toLowerCase().includes('vat')) {
        aiResponseText = `Yes! Since this ${activeVehicle?.make} is eligible for a tax-free export, you can get a 19% VAT refund once the car leaves the country. The escrow system holds this refund and releases it to you safely after the car arrives.`;
      } else if (text.toLowerCase().includes('how long') || text.toLowerCase().includes('time') || text.toLowerCase().includes('shipping')) {
        aiResponseText = `Shipping by ${freightMode === 'CONTAINER' ? 'Dry Box Container' : freightMode === 'RORO' ? 'Roro Ship' : 'Air Freight'} to ${preferredPort} usually takes about 14 to 28 days. Container shipping keeps your car extremely safe and secure during the journey.`;
      }
      setChatMessages(prev => [
        ...prev,
        { sender: 'AI', text: aiResponseText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 1200);
  };

  return (
    <div className="space-y-6 py-2 text-slate-800 font-sans" id="export-integrated-division-division">
      
      {/* 1. TOP HEADER CONTAINER - FLAT 2D LOOK */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B0000]/2 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="space-y-1 md:w-3/5 text-left">
          <h2 className="text-xl font-black text-[#8B0000] tracking-tight uppercase">Global Shipping &amp; Export Terminal</h2>
          <p className="text-xs text-slate-500 font-sans leading-relaxed">
            Ship your car worldwide easily. Choose where your car starts and where it is going, check customs, and pay safely.
          </p>
        </div>

        {/* Global Selector Widget with flat 2D elements */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 w-full md:w-80 text-left shrink-0 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[9px] text-slate-400 block font-sans uppercase font-bold mb-1">Shipping From</label>
              <select
                value={originCountry}
                onChange={(e) => setOriginCountry(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-sans cursor-pointer focus:border-[#8B0000] outline-none shadow-xs transition-all"
              >
                <option value="Germany">Germany (EU)</option>
                <option value="Japan">Japan (APAC)</option>
                <option value="USA">USA (NAFTA)</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] text-slate-400 block font-sans uppercase font-bold mb-1">Shipping To</label>
              <select
                value={destinationCountry}
                onChange={(e) => setDestinationCountry(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-sans cursor-pointer focus:border-[#8B0000] outline-none shadow-xs transition-all"
              >
                <option value="United Arab Emirates">U.A.E (Dubai)</option>
                <option value="Saudi Arabia">S.A. (Riyadh)</option>
                <option value="Australia">Australia</option>
                <option value="Switzerland">Switzerland</option>
                <option value="Nigeria">Nigeria</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DUAL INTERACTIVE WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
        
        {/* LEFT COLUMN: VEHICLE GRID AND BROKERS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* VEHICLE GRID CONTAINER - FLAT 2D LOOK */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
              <div className="space-y-0.5">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Choose a Car to Ship</h3>
                <p className="text-xs text-slate-500 font-sans">Select a car from the list below to see shipping details.</p>
              </div>

              {/* Grid Filter Tools with flat 2D buttons */}
              <div className="flex gap-2 self-stretch sm:self-auto uppercase text-[9px] font-sans">
                <button
                  onClick={() => setVatFilter('All')}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    vatFilter === 'All' 
                      ? 'bg-[#8B0000] text-white border-[#8B0000] font-bold shadow-xs' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  All Cars
                </button>
                <button
                  onClick={() => setVatFilter('VAT_Eligible')}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    vatFilter === 'VAT_Eligible' 
                      ? 'bg-[#8B0000] text-white border-[#8B0000] font-bold shadow-xs' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  VAT Refund
                </button>
                <button
                  onClick={() => setVatFilter('Tax_Free')}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    vatFilter === 'Tax_Free' 
                      ? 'bg-[#8B0000] text-white border-[#8B0000] font-bold shadow-xs' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  Tax-Free
                </button>
              </div>
            </div>

            {/* List/Grid displays with flat 2D design */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredVehicles.map((car) => (
                <div
                  key={car.vin}
                  onClick={() => setSelectedVin(car.vin)}
                  className={`border rounded-2xl overflow-hidden transition-all text-left cursor-pointer group flex flex-col justify-between h-auto ${
                    selectedVin === car.vin 
                      ? 'border-[#8B0000] bg-red-50/[0.01] shadow-xs' 
                      : 'bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50/50 shadow-xs'
                  }`}
                >
                  <div className="relative h-32 bg-slate-100 shrink-0 overflow-hidden">
                    <img 
                      src={car.image} 
                      alt={car.model} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 uppercase leading-snug tracking-tight">
                        {car.year} {car.make} {car.model}
                      </h4>
                    </div>

                    {/* Specs strip */}
                    <div className="text-[10px] text-slate-500 font-sans grid grid-cols-3 gap-1.5 py-2 border-t border-b border-slate-100/80">
                      <div>
                        <span className="block text-slate-400 uppercase text-[8px] font-semibold">ENGINE</span>
                        <span className="font-extrabold truncate text-slate-700 block">{car.specs.engine.split(' ')[0]}</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 uppercase text-[8px] font-semibold">TRANS</span>
                        <span className="font-extrabold truncate text-slate-700 block">{car.specs.transmission.split(' ')[0]}</span>
                      </div>
                      <div>
                        <span className="block text-slate-400 uppercase text-[8px] font-semibold">MILEAGE</span>
                        <span className="font-extrabold text-slate-700 block">{car.specs.mileage.toLocaleString()} mi</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-1">
                      <div>
                        <span className="text-[8px] text-slate-400 font-bold tracking-wider block">SPOT PRICE</span>
                        <span className="text-sm font-black font-mono text-[#8B0000]">${car.price.toLocaleString()}</span>
                      </div>
                      <span className="text-[10px] font-extrabold text-slate-400 font-sans group-hover:text-[#8B0000] transition-colors flex items-center gap-1">
                        Select <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EXPORTER NETWORK CONTAINER - FLAT 2D LOOK */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
            <div className="space-y-0.5">
              <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase">
                <Users className="w-5 h-5 text-[#8B0000]" /> Our Shipping Experts
              </h3>
              <p className="text-xs text-slate-500 font-sans">Our team will help you handle local taxes, customs, and delivery.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {EXPORTERS.map(agent => (
                <div key={agent.id} className="p-3.5 bg-white border border-slate-200 rounded-2xl text-left space-y-2 relative overflow-hidden flex flex-col justify-between transition-all duration-250 shadow-xs hover:bg-slate-50/50">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-[#8B0000] uppercase truncate leading-snug">{agent.name.replace(' Global Logistics GmbH', '').replace(' Shippers Ltd', '').replace(' Export Merchants LLC', '')}</h4>
                    <span className="text-[10px] text-slate-500 font-medium block">{agent.location}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-sans text-slate-500 pt-2 border-t border-slate-100">
                    <span className="text-[#8B0000] font-black">★ {agent.rating}</span>
                    <span className="font-semibold text-slate-600">{agent.completedExports} trades</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: DETAIL ASSISTANT PANEL - SCROLL INTERACTIVE TABS (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">

          {/* ACTIVE EXPORT VEHICLE LOGISTICS CALCULATOR & CHECKLIST - FLAT 2D LOOK */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm relative overflow-hidden text-slate-800">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#8B0000]/2 rounded-full blur-[60px] pointer-events-none" />

            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <h4 className="text-sm font-black text-[#8B0000] uppercase tracking-tight font-sans">
                  {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
                </h4>
              </div>
            </div>

            {/* Registration status and customs details panel */}
            <div className="space-y-4 pt-1 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-1">
                  <span className="text-[9px] text-slate-400 font-sans font-bold uppercase block">CAR DOCUMENTS</span>
                  <p className="text-[11px] text-slate-600 font-sans leading-relaxed font-medium">{activeVehicle.regStatus.replace('German De-registered Title (Fahrzeugbrief II held)', 'German Registration Document (Fahrzeugbrief II)')}</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-1">
                  <span className="text-[9px] text-slate-400 font-sans font-bold uppercase block">SHIPPING STATUS</span>
                  <p className="text-[11px] text-slate-600 font-sans leading-relaxed font-medium">{activeVehicle.customsInfo}</p>
                </div>
              </div>

              {/* Dynamic checklist generator based on Country matching */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <span className="text-[10px] text-[#8B0000] font-black font-sans uppercase tracking-wider flex items-center gap-1.5">
                     Export Checklist
                  </span>
                </div>

                <ul className="space-y-2 text-xs font-sans">
                  <li className="flex items-center justify-between py-1 border-b border-slate-100/50 text-slate-700">
                    <span className="font-semibold">Registration Document Check</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1 text-[10px]">
                      Verified <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </span>
                  </li>

                  <li className="flex items-center justify-between py-1 border-b border-slate-100/50 text-slate-700">
                    <span className="font-semibold">Certificate of Conformity</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1 text-[10px]">
                      Verified <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </span>
                  </li>

                  <li className="flex items-center justify-between py-1 border-b border-slate-100/50 text-slate-700">
                    <span className="font-semibold">Customs Declaration Form</span>
                    {uploadedFiles.some(f => f.type.includes('Customs')) ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1 text-[10px]">
                        Verified <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </span>
                    ) : (
                      <span className="text-[#8B0000] font-bold flex items-center gap-1.5 text-[10px] animate-pulse">
                        Missing <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000]" />
                      </span>
                    )}
                  </li>

                  <li className="flex items-center justify-between py-1 text-slate-600">
                    <span className="font-semibold text-slate-500">Emission Inspection Check</span>
                    <span className="text-slate-400 font-bold flex items-center gap-1.5 text-[10px]">
                      Pending <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    </span>
                  </li>
                </ul>
              </div>

              {/* Shipping Logistics configurations */}
              <div className="space-y-2 pt-1">
                <span className="text-[9px] font-black tracking-wider font-sans text-slate-400 block uppercase">
                  Choose Shipping Mode
                </span>

                <div className="grid grid-cols-3 gap-2.5 uppercase text-[9px] font-sans">
                  <button
                    onClick={() => setFreightMode('RORO')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer duration-150 ${
                      freightMode === 'RORO' 
                        ? 'border-[#8B0000] bg-red-50/15 text-[#8B0000] font-bold' 
                        : 'border-slate-200 bg-white text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <RefreshCw className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                    Roro (Ship)
                  </button>

                  <button
                    onClick={() => setFreightMode('CONTAINER')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer duration-150 ${
                      freightMode === 'CONTAINER' 
                        ? 'border-[#8B0000] bg-red-50/15 text-[#8B0000] font-bold' 
                        : 'border-slate-200 bg-white text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Ship className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                    Dry Box (Container)
                  </button>

                  <button
                    onClick={() => setFreightMode('AIR')}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer duration-150 ${
                      freightMode === 'AIR' 
                        ? 'border-[#8B0000] bg-red-50/15 text-[#8B0000] font-bold' 
                        : 'border-slate-200 bg-white text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Globe className="w-4 h-4 mx-auto text-slate-400 mb-1" />
                    Air Freight (Plane)
                  </button>
                </div>
              </div>

              {/* Dynamic Costs breakdown */}
              <div className="bg-[#8B0000]/[0.02] border border-red-100 p-4 rounded-xl space-y-2 text-left text-xs font-sans">
                <div className="flex justify-between text-slate-600 text-xs">
                  <span>Car Price:</span>
                  <span className="text-slate-800 font-extrabold font-mono">${activeVehicle.price.toLocaleString()}</span>
                </div>
                {activeVehicle.vatEligible && (
                  <div className="flex justify-between text-emerald-600 text-xs font-bold">
                    <span>Estimated VAT Refund:</span>
                    <span className="font-mono">-${calculatedShippingRates.vatReclaimEst.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#8B0000] font-black text-sm pt-2 border-t border-red-100">
                  <span>Total Safe Payment:</span>
                  <span className="font-mono">${calculatedShippingRates.totalEstPay.toLocaleString()} USD</span>
                </div>
              </div>

              {/* ESCROW BANK INTERACTION TOOL OR TIMELINE MODULE - FLAT 2D LOOK */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <h4 className="text-[10px] font-black uppercase tracking-wider font-sans text-slate-800 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#8B0000]" /> Secure Escrow Payment
                  </h4>
                </div>

                {/* Timeline sequence dots */}
                <div className="grid grid-cols-4 gap-1.5 text-[9px] font-sans text-center pb-1">
                  <div className={`pb-1.5 border-b-2 ${escrowStep >= 1 ? 'border-[#8B0000] text-[#8B0000] font-black' : 'border-slate-200 text-slate-400'}`}>1. LOCK PAYMENT</div>
                  <div className={`pb-1.5 border-b-2 ${escrowStep >= 2 ? 'border-[#8B0000] text-[#8B0000] font-black' : 'border-slate-200 text-slate-400'}`}>2. CUSTOMS</div>
                  <div className={`pb-1.5 border-b-2 ${escrowStep >= 3 ? 'border-[#8B0000] text-[#8B0000] font-black' : 'border-slate-200 text-slate-400'}`}>3. IN TRANSIT</div>
                  <div className={`pb-1.5 border-b-2 ${escrowStep >= 4 ? 'border-[#8B0000] text-[#8B0000] font-black' : 'border-slate-200 text-slate-400'}`}>4. DELIVERED</div>
                </div>

                {/* Escrow workflow description & button */}
                <div className="text-xs text-slate-500 leading-relaxed font-sans">
                  {escrowStep === 1 && (
                     <div className="space-y-3">
                      <p>We hold your payment safely. The money is only sent to the seller after your car is checked and cleared by customs.</p>
                      <button
                        onClick={() => {
                          setEscrowStep(2);
                          setEscrowDepositLocked(true);
                          alert(`Your payment of $${calculatedShippingRates.totalEstPay.toLocaleString()} USD is now locked safely.`);
                        }}
                        className="w-full py-2.5 bg-[#8B0000] hover:bg-red-700 text-white rounded-xl text-center text-xs font-black uppercase tracking-wider cursor-pointer transition-all shadow-xs"
                      >
                        Secure Payment (${calculatedShippingRates.totalEstPay.toLocaleString()})
                      </button>
                    </div>
                  )}

                  {escrowStep === 2 && (
                    <div className="space-y-3">
                      <p className="text-[#8B0000] font-sans text-[10px] uppercase font-black">
                        ● STEP 2: Checking Customs
                      </p>
                      <p>The exporter is preparing the car paperwork to clear customs.</p>
                      <button
                        onClick={() => {
                          setEscrowStep(3);
                        }}
                        className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-center text-xs font-black uppercase tracking-wider cursor-pointer transition-all shadow-xs"
                      >
                        Review Customs Papers
                      </button>
                    </div>
                  )}

                  {escrowStep === 3 && (
                    <div className="space-y-3">
                      <p className="text-[#8B0000] font-sans text-[10px] uppercase font-black">
                        ● STEP 3: Car is on its Way
                      </p>
                      <p>The ship has left. Your car is now on its way.</p>
                      <button
                        onClick={() => {
                          setEscrowStep(4);
                        }}
                        className="w-full py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-center text-xs font-black uppercase tracking-wider cursor-pointer transition-all shadow-xs"
                      >
                        Update Shipping Status
                      </button>
                    </div>
                  )}

                  {escrowStep === 4 && (
                    <div className="space-y-3">
                      <p className="text-emerald-600 font-sans text-[10px] uppercase font-black">
                        ✓ STEP 4: Car Arrived
                      </p>
                      <p>The car has arrived safely. Please check your car before releasing the payment to the seller.</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEscrowStep(1);
                            setEscrowDepositLocked(false);
                            alert("Payment sent successfully to the seller! Keys and ownership documents are released.");
                          }}
                          className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer transition-all shadow-xs"
                        >
                          Release Payment
                        </button>
                        <button
                          onClick={() => {
                            setEscrowStep(1);
                            setEscrowDepositLocked(false);
                            alert("Issue reported. Your funds will remain locked in secure escrow.");
                          }}
                          className="px-4 py-2.5 bg-red-50 text-[#8B0000] border border-red-200 hover:bg-red-100 transition-all rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Report an Issue
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* DYNAMIC COMPLIANCE DOCUMENT MANAGER - FLAT 2D LOOK */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <h4 className="text-sm font-black text-slate-900 uppercase">Document Upload Center</h4>
                <p className="text-xs text-slate-500">Upload your documents here to verify them with customs.</p>
              </div>
              <FileText className="w-5 h-5 text-slate-400 animate-pulse" />
            </div>

            {/* Selector for file type upload */}
            <div className="flex gap-2 items-center">
              <span className="text-[9px] font-sans font-bold text-slate-400 uppercase shrink-0">Select Document Type:</span>
              <select
                value={newFileType}
                onChange={(e) => setNewFileType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-sans cursor-pointer outline-none hover:border-slate-300 focus:border-[#8B0000] transition-all"
              >
                <option value="Customs Declaration Form 104">Customs Declaration Form</option>
                <option value="Emissions Conformity Certification">Emission Certificate</option>
                <option value="VAT Refund Declaration (Stamp 140)">VAT Refund Form</option>
                <option value="Commercial Invoice Certificate">Commercial Invoice</option>
              </select>
            </div>

            <UniversalSmartUpload
              photoKey="import_export_docs"
              uploadedImageSrc={latestExportDocSrc}
              onUploadSuccess={handleSmartExportUpload}
              onClear={() => setLatestExportDocSrc(null)}
              label="Intelligent Document Scanner"
              description={`Deploy mobile camera to digitalize ${newFileType} credentials securely.`}
            />

            {/* Uploaded Files index lists */}
            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {uploadedFiles.map(file => (
                <div key={file.id} className="p-3 bg-white border border-slate-200 rounded-2xl flex justify-between items-center text-xs shadow-xs transition-all">
                  <div className="flex items-center gap-2 text-left truncate max-w-[220px]">
                    <FileText className="w-4 h-4 text-[#8B0000] shrink-0" />
                    <div className="truncate">
                      <span className="font-extrabold text-slate-800 truncate block text-xs">{file.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {file.status === 'Analyzing' ? (
                      <span className="text-[9px] font-sans text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg animate-pulse">
                        Analyzing...
                      </span>
                    ) : (
                      <span className="text-[9px] font-sans text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg flex items-center gap-0.5 font-bold">
                        <Check className="w-3 h-3" /> VERIFIED
                      </span>
                    )}

                    <button
                      onClick={() => deleteUploadedFile(file.id)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI EXPORT CHAT ASSISTANT WIDGET - MOVED TO UNIFIED DOCKED FAB */}
          <div className="bg-zinc-50 border border-slate-200 rounded-2xl p-6 text-left text-slate-800 space-y-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-lg bg-red-50 text-[#8B0000] border border-red-100 flex items-center justify-center font-black text-sm">
                🚢
              </span>
              <div>
                <h4 className="text-xs font-black uppercase tracking-tight text-slate-900 leading-tight">AI Shipping Assistant</h4>
                <span className="text-[9.5px] text-slate-400 font-sans block font-semibold">Active in Docked Assistant</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Our specialized Customs &amp; Port Logistics AI is now docked as a persistent helper in the bottom-right corner. Open the red circle chat button to consult on Forms 104, customs declarations, electric vehicle excise refunds, or transit logistics.
            </p>
            <button
              type="button"
              onClick={() => {
                const btn = document.getElementById('global-floating-chat-fab');
                if (btn) btn.click();
              }}
              className="w-full bg-[#8B0000] hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-wider py-2.5 rounded-xl transition-all cursor-pointer shadow-3xs"
            >
              Open Customs Chat
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

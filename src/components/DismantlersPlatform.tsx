/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Building2, Search, MapPin, Calendar, Clock, AlertTriangle, AlertCircle, 
  CheckCircle2, Plus, ArrowRight, ShieldCheck, HelpCircle, Activity, 
  Send, Bot, BookOpen, ChevronRight, FileText, Share2, ClipboardList, 
  Info, Eye, Download, Wifi, RefreshCw, Star, Languages, X, Check,
  Sliders, PenTool, Sparkles, Filter, ChevronDown, CheckSquare, Package,
  Trash2, Layers, Truck, DollarSign, ListFilter, Cpu, Leaf, Hammer, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Vehicle, Part } from '../types';

export interface DamagedVehicle {
  id: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  condition: string;
  damageSeverity: 'Minor' | 'Moderate' | 'Severe' | 'Critical' | 'Salvage';
  damageDetails: string;
  estimatedSalvageValue: number;
  fluidStatus: 'Drained' | 'Pending' | 'Recycled';
  arrivalDate: string;
  warehouseZone: string;
  partsHarvested: Array<{
    id: string;
    name: string;
    sku: string;
    category: string;
    condition: string;
    shelfLocation: string;
    price: number;
    weightKg: number;
  }>;
}

export interface DismantlerYard {
  id: string;
  name: string;
  location: string;
  phone: string;
  email: string;
  rating: number;
  certified: boolean;
  totalVehicles: number;
  recoveredPartsCount: number;
  greenScore: number; // Out of 100
  ecoStats: {
    co2SavedTons: number;
    steelRecoveredKg: number;
    fluidsReclaimedLitres: number;
  };
  damagedVehicles: DamagedVehicle[];
}

const INITIAL_YARDS: DismantlerYard[] = [
  {
    id: 'dismantler-1',
    name: 'Bavarian Core Recyclers Ltd.',
    location: 'Munich Nord Industrial Park, Germany',
    phone: '+49 89 2345 678',
    email: 'b2b@bavarianrecycled.de',
    rating: 4.8,
    certified: true,
    totalVehicles: 48,
    recoveredPartsCount: 612,
    greenScore: 96,
    ecoStats: {
      co2SavedTons: 142.5,
      steelRecoveredKg: 34200,
      fluidsReclaimedLitres: 1850
    },
    damagedVehicles: [
      {
        id: 'dv-1',
        vin: 'WP0AB2992MGS89012',
        year: 2021,
        make: 'Porsche',
        model: '911',
        trim: 'Carrera GTS (992)',
        condition: 'Severe front-end collision, rear and cabin structurally untouched.',
        damageSeverity: 'Severe',
        damageDetails: 'Radiator support completely crashed; engine block intact, transmission pristine, rear light bar fully reusable.',
        estimatedSalvageValue: 34500,
        fluidStatus: 'Drained',
        arrivalDate: '2026-04-12',
        warehouseZone: 'Aisle B - Rack 14',
        partsHarvested: [
          {
            id: 'ph-1',
            name: '992 Original Cluster Display Unit',
            sku: 'P992-CLU-102',
            category: 'Electronics',
            condition: 'Grade A - Inspected',
            shelfLocation: 'A14-S3-B2',
            price: 1490,
            weightKg: 2.1
          },
          {
            id: 'ph-2',
            name: 'PDK 8-Speed Double Clutch Gearbox',
            sku: 'P992-PDK-GPX',
            category: 'Transmission & Gearbox',
            condition: 'Grade A+ - Bench Tested',
            shelfLocation: 'A14-FLOOR-01',
            price: 8900,
            weightKg: 120
          },
          {
            id: 'ph-3',
            name: 'Aero Active Rear Spoiler Assembly',
            sku: 'P992-RSP-AER',
            category: 'Body Parts',
            condition: 'Grade B - Small scratch',
            shelfLocation: 'A14-S5-B1',
            price: 1800,
            weightKg: 14
          }
        ]
      },
      {
        id: 'dv-2',
        vin: 'WBA5R3C01LNS51224',
        year: 2022,
        make: 'BMW',
        model: 'M5',
        trim: 'Competition (F90)',
        condition: 'Flood damage, perfect body panel assembly, engine hydraulic locked.',
        damageSeverity: 'Salvage',
        damageDetails: 'Electronic system bricked. Exterior paint is Isle of Man Green in immaculate status. Standard M carbon ceramic rotors completely unblemished.',
        estimatedSalvageValue: 22000,
        fluidStatus: 'Drained',
        arrivalDate: '2026-05-01',
        warehouseZone: 'Aisle D - Rack 3',
        partsHarvested: [
          {
            id: 'ph-4',
            name: 'M Carbon Ceramic Braking Rotors (Front Pair)',
            sku: 'BMW-F90-CCB-FR',
            category: 'Braking Systems',
            condition: 'Grade A+ - Near Zero Wear',
            shelfLocation: 'D03-S1-B2',
            price: 4500,
            weightKg: 16.5
          },
          {
            id: 'ph-5',
            name: 'Carbon Fiber Lightweight Hood Panel',
            sku: 'BMW-F90-LWH-PAN',
            category: 'Body Parts',
            condition: 'Grade A - Clean Ceramic Coat',
            shelfLocation: 'D03-WALL-04',
            price: 3200,
            weightKg: 11
          }
        ]
      }
    ]
  },
  {
    id: 'dismantler-2',
    name: 'Nordic Auto Dismantling & Parts AB',
    location: 'Gothenburg Logistics Hub, Sweden',
    phone: '+46 31 987 654',
    email: 'logistics@nordicdismantling.se',
    rating: 4.7,
    certified: true,
    totalVehicles: 32,
    recoveredPartsCount: 480,
    greenScore: 98,
    ecoStats: {
      co2SavedTons: 96.2,
      steelRecoveredKg: 21800,
      fluidsReclaimedLitres: 1240
    },
    damagedVehicles: [
      {
        id: 'dv-3',
        vin: 'YV1LF0009M1134015',
        year: 2021,
        make: 'Volvo',
        model: 'XC90',
        trim: 'Recharge T8',
        condition: 'Rear-end collision, hybrid battery pack unit fully intact & certified.',
        damageSeverity: 'Moderate',
        damageDetails: 'Hybrid batteries cleared discharge cycle testing. Front bumper, front radar assembly, and complete high-voltage cooling grid are in prime shape.',
        estimatedSalvageValue: 19500,
        fluidStatus: 'Drained',
        arrivalDate: '2026-05-18',
        warehouseZone: 'Aisle H - Battery Safe Room 1',
        partsHarvested: [
          {
            id: 'ph-6',
            name: 'XC90 11.6kWh Lithium T8 Hybrid Pack',
            sku: 'VOLV-XC90-T8-BAT',
            category: 'Batteries & Electric Drives',
            condition: 'Grade A+ - State of Health: 97%',
            shelfLocation: 'H-SAFE-ZONE-01',
            price: 6100,
            weightKg: 115
          },
          {
            id: 'ph-7',
            name: 'Active Air Suspension Struts (Front Left)',
            sku: 'VOLV-XC90-AAS-FL',
            category: 'Suspension',
            condition: 'Grade A - Sealed',
            shelfLocation: 'H02-S3-B4',
            price: 750,
            weightKg: 8.5
          }
        ]
      }
    ]
  },
  {
    id: 'dismantler-3',
    name: 'Apex Precision Parts Salvage',
    location: 'Birmingham Ringway Interchange, UK',
    phone: '+44 121 445 9934',
    email: 'info@apexsalvageparts.co.uk',
    rating: 4.9,
    certified: true,
    totalVehicles: 64,
    recoveredPartsCount: 924,
    greenScore: 95,
    ecoStats: {
      co2SavedTons: 204.8,
      steelRecoveredKg: 49100,
      fluidsReclaimedLitres: 2900
    },
    damagedVehicles: [
      {
        id: 'dv-4',
        vin: 'WBA3R3C02LNS41200',
        year: 2020,
        make: 'BMW',
        model: 'M4',
        trim: 'Competition Coupe',
        condition: 'Side-impact damage on left side. Right side assemblies and S58 engine completely unharmed.',
        damageSeverity: 'Severe',
        damageDetails: 'Passenger side pillars collapsed. Complete steering rack assembly, rear differential, and twin Turbo-chargers recovered.',
        estimatedSalvageValue: 28000,
        fluidStatus: 'Recycled',
        arrivalDate: '2026-03-30',
        warehouseZone: 'Aisle R - Precision Rack 2',
        partsHarvested: [
          {
            id: 'ph-8',
            name: 'S58 Twin-Turbo Inline 6 Cylinder Engine',
            sku: 'BMW-S58-TTE-ENG',
            category: 'Engine & Exhaust',
            condition: 'Grade A - Dyno Tested 510HP',
            shelfLocation: 'R02-FLOOR-02',
            price: 11200,
            weightKg: 198
          },
          {
            id: 'ph-9',
            name: 'Carbon Fiber Compound Strut Tower Brace',
            sku: 'BMW-M4-CFS-BRC',
            category: 'Body Styling',
            condition: 'Grade A+ - No micro-cracks',
            shelfLocation: 'R02-S1-B1',
            price: 900,
            weightKg: 3.2
          }
        ]
      }
    ]
  }
];

export default function DismantlersPlatform() {
  const [yards, setYards] = useState<DismantlerYard[]>(INITIAL_YARDS);
  const [selectedYardId, setSelectedYardId] = useState<string>('dismantler-1');
  const [activeTab, setActiveTab] = useState<'directory' | 'registry' | 'search' | 'warehouse' | 'ai_assistant' | 'sustainability'>('directory');
  
  // Multi-Employee Account switching simulation
  const [currentEmployeeRole, setCurrentEmployeeRole] = useState<'inventory' | 'sales' | 'logistics'>('inventory');

  // Directory filter & Search state
  const [yardSearch, setYardSearch] = useState('');
  const [ecoFilterOnly, setEcoFilterOnly] = useState(false);

  // Global search tool query
  const [partsQuery, setPartsQuery] = useState('');
  const [partCategoryFilter, setPartCategoryFilter] = useState('All');

  // New Damage vehicle registration form fields
  const [newVin, setNewVin] = useState('');
  const [newYear, setNewYear] = useState<number>(2022);
  const [newMake, setNewMake] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newTrim, setNewTrim] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newSeverity, setNewSeverity] = useState<'Minor' | 'Moderate' | 'Severe' | 'Critical' | 'Salvage'>('Severe');
  const [newDetails, setNewDetails] = useState('');
  const [newSalvageVal, setNewSalvageVal] = useState<number>(15000);
  const [newZone, setNewZone] = useState('Aisle A - Rack 1');
  const [addPartLog, setAddPartLog] = useState('');

  // AI Identifier Interface
  const [aiAnalysisDescription, setAiAnalysisDescription] = useState('Front left steering knuckle for BMW F90 M5 Competition 2022');
  const [aiIsAnalyzing, setAiIsAnalyzing] = useState(false);
  const [aiReportResult, setAiReportResult] = useState<any | null>(null);

  // Add parts manually to a selected registered damaged vehicle
  const [tempPartName, setTempPartName] = useState('');
  const [tempPartCategory, setTempPartCategory] = useState('Engine & Exhaust');
  const [tempPartCondition, setTempPartCondition] = useState('Grade A+ - Inspected');
  const [tempPartShelf, setTempPartShelf] = useState('');
  const [tempPartPrice, setTempPartPrice] = useState<number>(350);
  const [tempPartWeight, setTempPartWeight] = useState<number>(5);
  const [selectedVehicleForHarvest, setSelectedVehicleForHarvest] = useState<string>('dv-1');

  // Log of operations
  const [operationLogs, setOperationLogs] = useState<Array<{time: string; text: string; role: string; type: 'success' | 'info' | 'warn'}>>([
    { time: '08:15', text: 'Volvo Lithium T8 battery safety test completed successfully. Pack isolated.', role: 'inventory', type: 'success' },
    { time: '09:00', text: 'Warehouse Zone D reorganized: Forklift clearance verified.', role: 'logistics', type: 'info' },
    { time: '09:42', text: 'Grade A Transmission S58 tagged; listed on global network databases.', role: 'sales', type: 'success' },
    { time: '10:15', text: 'Recycling fluid extraction unit routine inspection completed.', role: 'logistics', type: 'info' }
  ]);

  const addLog = (text: string, role: string, type: 'success' | 'info' | 'warn' = 'info') => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    setOperationLogs(prev => [{ time, text, role, type }, ...prev]);
  };

  const selectedYard = useMemo(() => {
    return yards.find(y => y.id === selectedYardId) || yards[0];
  }, [yards, selectedYardId]);

  // Filtered yards list
  const filteredYards = useMemo(() => {
    return yards.filter(y => {
      const matchSearch = y.name.toLowerCase().includes(yardSearch.toLowerCase()) || 
                          y.location.toLowerCase().includes(yardSearch.toLowerCase());
      const matchEco = !ecoFilterOnly || y.greenScore >= 96;
      return matchSearch && matchEco;
    });
  }, [yards, yardSearch, ecoFilterOnly]);

  // Flattened all parts harvested for the global engine search
  const allGlobalParts = useMemo(() => {
    const list: Array<{part: any; yardName: string; location: string; vehicleInfo: string; vehicleId: string; yardId: string}> = [];
    yards.forEach(y => {
      y.damagedVehicles.forEach(dv => {
        dv.partsHarvested.forEach(part => {
          list.push({
            part,
            yardName: y.name,
            location: y.location,
            vehicleInfo: `${dv.year} ${dv.make} ${dv.model} (${dv.trim})`,
            vehicleId: dv.id,
            yardId: y.id
          });
        });
      });
    });
    return list;
  }, [yards]);

  // Filter global parts
  const filteredGlobalParts = useMemo(() => {
    return allGlobalParts.filter(item => {
      const matchText = item.part.name.toLowerCase().includes(partsQuery.toLowerCase()) || 
                        item.part.sku.toLowerCase().includes(partsQuery.toLowerCase()) ||
                        item.vehicleInfo.toLowerCase().includes(partsQuery.toLowerCase()) ||
                        item.part.category.toLowerCase().includes(partsQuery.toLowerCase());
      const matchCat = partCategoryFilter === 'All' || item.part.category === partCategoryFilter;
      return matchText && matchCat;
    });
  }, [allGlobalParts, partsQuery, partCategoryFilter]);

  // Handle register new vehicle
  const handleRegisterDamagedVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMake || !newModel || !newVin) {
      alert('Please fill out the Engine/Make, Model and VIN parameters.');
      return;
    }

    const newContainer: DamagedVehicle = {
      id: `dv-${Date.now()}`,
      vin: newVin.toUpperCase(),
      year: newYear,
      make: newMake,
      model: newModel,
      trim: newTrim || 'Standard Package',
      condition: newCondition || 'Salvaged structural collision',
      damageSeverity: newSeverity,
      damageDetails: newDetails || 'To be triaged & parts cataloged.',
      estimatedSalvageValue: newSalvageVal,
      fluidStatus: 'Pending',
      arrivalDate: new Date().toISOString().split('T')[0],
      warehouseZone: newZone,
      partsHarvested: []
    };

    // Add to the currently active yard
    setYards(prev => prev.map(y => {
      if (y.id === selectedYardId) {
        return {
          ...y,
          totalVehicles: y.totalVehicles + 1,
          damagedVehicles: [newContainer, ...y.damagedVehicles]
        };
      }
      return y;
    }));

    addLog(`Registered salvaged vehicle container: ${newYear} ${newMake} ${newModel} (VIN: ${newVin})`, 'inventory', 'success');

    // Reset inputs
    setNewVin('');
    setNewMake('');
    setNewModel('');
    setNewTrim('');
    setNewCondition('');
    setNewDetails('');
    setTempPartShelf(newZone + ' - Bin 1');
    setActiveTab('directory');
  };

  // Add harvested part dynamically to the selected vehicle container
  const handleHarvestPart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempPartName || !tempPartShelf) {
      alert('Please provide part name and shelf tag location.');
      return;
    }

    const uniqueSku = 'MP-' + Math.random().toString(36).substring(2, 7).toUpperCase() + '-' + Math.floor(Math.random() * 9000 + 1000);

    const generatedPart = {
      id: `ph-gen-${Date.now()}`,
      name: tempPartName,
      sku: uniqueSku,
      category: tempPartCategory,
      condition: tempPartCondition,
      shelfLocation: tempPartShelf,
      price: tempPartPrice,
      weightKg: tempPartWeight
    };

    setYards(prev => prev.map(y => {
      return {
        ...y,
        damagedVehicles: y.damagedVehicles.map(dv => {
          if (dv.id === selectedVehicleForHarvest) {
            return {
              ...dv,
              partsHarvested: [generatedPart, ...dv.partsHarvested]
            };
          }
          return dv;
        })
      };
    }));

    addLog(`Harvested & categorized: "${tempPartName}" listed on shelf ${tempPartShelf}`, 'inventory', 'success');
    setTempPartName('');
    setAddPartLog(`Successfully harvesting and listed standard part SKU ${uniqueSku}!`);
    setTimeout(() => setAddPartLog(''), 4000);
  };

  // AI-powered identification analyzer
  const handleAIIdentify = () => {
    if (!aiAnalysisDescription.trim()) return;
    setAiIsAnalyzing(true);
    setAiReportResult(null);

    setTimeout(() => {
      const lowercaseDesc = aiAnalysisDescription.toLowerCase();
      let make = 'BMW';
      let model = 'M5 Competition';
      let category = 'Steering & Suspension';
      let cleanTitle = 'Precision Steering Knuckle Bearing Joint';
      let price = 720;
      let compatibilityScore = 98;
      let weight = 4.8;
      let suggestedOemNumber = 'BMW-3121-7852-X';
      let interchangeId = 'ICH-BMW-SUSP-785';

      if (lowercaseDesc.includes('porsche') || lowercaseDesc.includes('911') || lowercaseDesc.includes('992')) {
        make = 'Porsche';
        model = '911 (992 Carrera GTS)';
        category = 'Braking Systems';
        cleanTitle = 'High-Performance Ventilated Brembo Brake Rotor';
        price = 1250;
        compatibilityScore = 100;
        weight = 8.2;
        suggestedOemNumber = 'POR-992-04-350S';
        interchangeId = 'ICH-POR-BRAKE-350';
      } else if (lowercaseDesc.includes('volvo') || lowercaseDesc.includes('xc90')) {
        make = 'Volvo';
        model = 'XC90 Recharge (T8)';
        category = 'Batteries & Electric Drives';
        cleanTitle = 'Genuine High-Voltage Hybrid Inverter Control Unit';
        price = 2490;
        compatibilityScore = 95;
        weight = 12.0;
        suggestedOemNumber = 'VOLV-31422-992';
        interchangeId = 'ICH-VOLV-HYB-992';
      }

      setAiReportResult({
        title: cleanTitle,
        category,
        estimatedPriceRange: `$${Math.round(price * 0.9)} - $${Math.round(price * 1.1)}`,
        recommendedB2BPrice: price,
        oemNumber: suggestedOemNumber,
        interchangeId,
        weightKg: weight,
        compatibilityRate: compatibilityScore,
        targetFits: [model, `${make} M-Series Equivalent`, 'Performance Package upgrades'],
        recycledSteelRecoveryPercentage: 86,
        confidenceRate: '99%'
      });

      setAiIsAnalyzing(false);
      addLog(`AI analyzed component "${aiAnalysisDescription.substring(0, 30)}..." -> Identified: ${cleanTitle}`, 'inventory', 'success');
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 font-sans" id="dismantler-platform-root">
      
      {/* Top Hero Indicator Panel */}
      <div className="bg-white text-slate-800 py-12 px-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border-b border-slate-200/80 relative overflow-hidden" id="dismantlers-hero-panel">
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 mt-1 font-sans" id="dismantlers-header-title">
              Dismantlers &amp; Recyclers Network
            </h1>
          </div>

          {/* Quick Stats Panel */}
          <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4 flex gap-6 shadow-2xs" id="dismantlers-mini-stats">
            <div className="text-center px-2">
              <p className="text-slate-400 text-[10px] uppercase tracking-wider font-extrabold">Active Yards</p>
              <h2 className="text-2xl font-black text-[#8B0000] font-sans">{yards.length}</h2>
            </div>
            <div className="border-r border-slate-200/80" />
            <div className="text-center px-4">
              <p className="text-slate-400 text-[10px] uppercase tracking-wider font-extrabold">Harvested Stock</p>
              <h2 className="text-2xl font-black text-slate-800 font-sans">
                {yards.reduce((cur, y) => cur + y.recoveredPartsCount, 0)}
              </h2>
            </div>
            <div className="border-r border-slate-200/80" />
            <div className="text-[#3c3d3e] text-center px-2">
              <p className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">CO₂ Replaced</p>
              <h2 className="text-2xl font-bold text-emerald-600 font-sans">
                {yards.reduce((cur, y) => cur + y.ecoStats.co2SavedTons, 0).toFixed(1)}t
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Internal Ribbon: Sub Menu Controls & Simulation Mode */}
      <div className="bg-white border-b border-slate-200 py-3.5 px-6 sticky top-0 z-40 shadow-sm" id="dismantlers-ribbon">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Main Module Tabs */}
          <div className="flex flex-wrap items-center gap-1.5" id="dismantler-tabs-row">
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'directory' 
                  ? 'bg-[#8B0000] text-white shadow' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              id="tab-directory"
            >
              <Building2 className="w-3.5 h-3.5" /> Yard Directory
            </button>
            <button
              onClick={() => setActiveTab('registry')}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'registry' 
                  ? 'bg-[#8B0000] text-white shadow' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              id="tab-registry"
            >
              <Plus className="w-3.5 h-3.5 text-rose-500" /> Register Damage Vehicle
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'search' 
                  ? 'bg-[#8B0000] text-white shadow' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              id="tab-search"
            >
              <Search className="w-3.5 h-3.5" /> Global Parts Engine
            </button>
            <button
              onClick={() => setActiveTab('warehouse')}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'warehouse' 
                  ? 'bg-[#8B0000] text-white shadow' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              id="tab-warehouse"
            >
              <Package className="w-3.5 h-3.5" /> Stock & Locations
            </button>
            <button
              onClick={() => setActiveTab('ai_assistant')}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'ai_assistant' 
                  ? 'bg-[#8B0000] text-white shadow' 
                  : 'text-slate-700 bg-red-50 hover:bg-red-100'
              }`}
              id="tab-ai"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" /> AI Part Identification
            </button>
            <button
              onClick={() => setActiveTab('sustainability')}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'sustainability' 
                  ? 'bg-emerald-600 text-white shadow' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              id="tab-eco"
            >
              <Leaf className="w-3.5 h-3.5" /> Green Recycling
            </button>
          </div>

          {/* SIMULATOR: Multi-Employee Switcher */}
          <div className="bg-slate-100/90 border border-slate-200 p-1 rounded-xl flex items-center gap-1" id="employee-simulator">
            <span className="text-[10px] text-slate-500 uppercase font-mono font-bold px-2 tracking-wider">Role Mock:</span>
            <button
              onClick={() => {
                setCurrentEmployeeRole('inventory');
                addLog('Switched interface workspace to Inventory Controller.', 'inventory', 'info');
              }}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                currentEmployeeRole === 'inventory' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Manages incoming salvage cars and records spare component SKUs"
            >
              Inventory
            </button>
            <button
              onClick={() => {
                setCurrentEmployeeRole('sales');
                addLog('Switched workspace view to Parts Sales Associate.', 'sales', 'info');
              }}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                currentEmployeeRole === 'sales' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Monages global buyer connections, logistics, and parts pricing catalog"
            >
              Sales
            </button>
            <button
              onClick={() => {
                setCurrentEmployeeRole('logistics');
                addLog('Switched workspace to Warehouse logistics supervisor.', 'logistics', 'info');
              }}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${
                currentEmployeeRole === 'logistics' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Manages warehouse racks, shelves, fluid drain cycles & safe hybrid storage"
            >
              Logistics
            </button>
          </div>

        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto py-8 px-6 grid grid-cols-1 lg:grid-cols-4 gap-8" id="dismantlers-grid-layout">
        
        {/* LEFT COLUMN: ACTIVE WORKSPACE LOGS & SWITCHING CRADLES */}
        <div className="space-y-6 lg:col-span-1" id="dismantlers-sidebar">
          
          {/* Quick Yard Selector in Directory tab */}
          {activeTab === 'directory' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4" id="dismantler-filter-widget">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#8B0000]">Select Yard</h3>
              
              {/* Search Facility */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter yards by city..."
                  value={yardSearch}
                  onChange={(e) => setYardSearch(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl py-2 pl-8 pr-3 focus:outline-none focus:ring-1 focus:ring-rose-500 text-slate-800"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* Eco filter */}
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={ecoFilterOnly}
                  onChange={(e) => setEcoFilterOnly(e.target.checked)}
                  className="rounded text-rose-500 focus:ring-rose-400 border-slate-300 w-3.5 h-3.5"
                />
                <span>High-Eco Score Only (96+)</span>
              </label>

              <hr className="border-slate-100" />

              <div className="space-y-2 flex flex-col" id="yard-list-stack">
                {filteredYards.map(y => (
                  <button
                    key={y.id}
                    onClick={() => {
                      setSelectedYardId(y.id);
                      addLog(`Switched focus yard to: ${y.name}`, currentEmployeeRole, 'info');
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex flex-col gap-1 ${
                      selectedYard.id === y.id
                        ? 'border-rose-500 bg-rose-50/50 text-slate-950 font-medium'
                        : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-sans font-bold truncate">{y.name}</span>
                      {y.certified && <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded font-bold">certified</span>}
                    </div>
                    <span className="text-slate-400 text-[10px] font-mono truncate">{y.location}</span>
                    <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500 font-mono">
                      <span>🚗 Vehicles: {y.damagedVehicles.length}</span>
                      <span className="text-emerald-600 font-bold">☘️ Eco {y.greenScore}/100</span>
                    </div>
                  </button>
                ))}
                {filteredYards.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4">No dismantling yards found.</p>
                )}
              </div>
            </div>
          )}

          {/* Quick Yard Info Panel always available */}
          <div className="bg-white text-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200/85 space-y-4" id="dismantler-active-widget">
            <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#8B0000] font-bold">Current Focused Yard</h3>
            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase">{selectedYard.name}</h4>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                <MapPin className="w-3 h-3 text-[#8B0000] shrink-0" /> {selectedYard.location}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs py-1">
              <div className="bg-red-50 border border-red-100/50 p-2 rounded-lg text-center font-mono">
                <p className="text-[9px] text-slate-500 uppercase font-semibold">Recycled CO2</p>
                <p className="text-[13px] font-extrabold text-[#8B0000]">{selectedYard.ecoStats.co2SavedTons} t</p>
              </div>
              <div className="bg-red-50 border border-red-100/50 p-2 rounded-lg text-center font-mono">
                <p className="text-[9px] text-slate-500 uppercase font-semibold">Fluids Reclaimed</p>
                <p className="text-[13px] font-extrabold text-slate-800">{selectedYard.ecoStats.fluidsReclaimedLitres} L</p>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex flex-col gap-1.5 border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span>Certification Code:</span>
                <span className="font-mono text-slate-750 font-bold">EU-ECC-77412</span>
              </div>
              <div className="flex justify-between">
                <span>Hazard Compliance:</span>
                <span className="text-emerald-600 font-extrabold">PASS-STABLE</span>
              </div>
            </div>
          </div>

          {/* Clean Operations Summary Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3" id="live-log-container">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#8B0000]">Operations Summary</h3>
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            
            <div className="space-y-3 pt-1 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Total Dismantled Cars</span>
                <span className="font-bold text-slate-800">1,420 units</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Eco-Reclaimed Rate</span>
                <span className="font-bold text-emerald-600">89.4%</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span className="text-slate-500">Cataloged Spare Parts</span>
                <span className="font-bold text-slate-800">18,240 SKUs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CO₂ Offsets Registered</span>
                <span className="font-bold text-slate-800">12.8 tCO₂</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT AREA: DETAILED WORKING GRID (3-COLS SPAN) */}
        <div className="lg:col-span-3 space-y-6" id="dismantlers-working-pane">
          
          <AnimatePresence mode="wait">
            
            {/* TAB 1: YARD DIRECTORY, DAMAGED CAR CONTAINERS & HARVESTED SPARES */}
            {activeTab === 'directory' && (
              <motion.div
                key="directory"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-8"
              >
                {/* Active yard banner */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-900">{selectedYard.name}</h2>
                        {selectedYard.certified && (
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Certified Green Recycler
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{selectedYard.location} • Contact: {selectedYard.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('registry');
                        addLog('Guided to vehicle entry form.', currentEmployeeRole, 'info');
                      }}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> Add Vehicle to Yard
                    </button>
                  </div>
                </div>

                {/* Damaged Vehicles Container Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      Active Damaged Vehicles
                      <span className="text-xs font-mono font-normal text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {selectedYard.damagedVehicles.length} vehicles
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">Click a vehicle below to view or harvest individual components</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="damaged-vehicles-grid">
                    {selectedYard.damagedVehicles.map(dv => {
                      const isTargetForHarvest = selectedVehicleForHarvest === dv.id;
                      return (
                        <div 
                          key={dv.id}
                          className={`bg-white border rounded-2xl p-5 shadow-sm transition-all duration-200 flex flex-col justify-between ${
                            isTargetForHarvest 
                              ? 'border-rose-505 border-2 ring-1 ring-rose-300 bg-gradient-to-b from-white to-rose-50/10' 
                              : 'border-slate-205 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            {/* Card Top */}
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <span className="bg-slate-100 text-slate-800 text-[9px] font-mono font-bold px-2 py-0.5 rounded whitespace-nowrap">
                                  VIN {dv.vin}
                                </span>
                                <h4 className="text-base font-bold text-slate-900 mt-1">
                                  {dv.year} {dv.make} {dv.model} <span className="text-xs text-slate-500 font-normal">{dv.trim}</span>
                                </h4>
                              </div>
                              <span className={`text-[10.5px] font-bold px-2.5 py-0.5 rounded-md ${
                                dv.damageSeverity === 'Salvage' ? 'bg-red-50 text-red-700' :
                                dv.damageSeverity === 'Severe' ? 'bg-amber-50 text-amber-700' :
                                'bg-slate-100 text-slate-700'
                              }`}>
                                {dv.damageSeverity} Collision
                              </span>
                            </div>

                            {/* Damage description details */}
                            <p className="text-xs text-slate-650 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4 leading-relaxed font-sans">
                              <strong>Spec State:</strong> {dv.condition}
                              <br />
                              <strong className="text-rose-600">Damage Profile:</strong> {dv.damageDetails}
                            </p>

                            {/* Technical Details List */}
                            <div className="grid grid-cols-2 gap-2 text-[11px] mb-4 text-slate-600 font-mono">
                              <div className="flex justify-between border-b border-dashed border-slate-100 pb-1">
                                <span>Estimated Value:</span>
                                <span className="text-slate-900 font-bold">${dv.estimatedSalvageValue.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between border-b border-dashed border-slate-100 pb-1">
                                <span>Arrival Date:</span>
                                <span className="text-slate-800">{dv.arrivalDate}</span>
                              </div>
                              <div className="flex justify-between border-b border-dashed border-slate-100 pb-1">
                                <span>Storage Area:</span>
                                <span className="text-slate-800 font-bold">{dv.warehouseZone}</span>
                              </div>
                              <div className="flex justify-between border-b border-dashed border-slate-100 pb-1">
                                <span>Fluid Standard:</span>
                                <span className={`font-bold ${dv.fluidStatus === 'Drained' || dv.fluidStatus === 'Recycled' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                  {dv.fluidStatus}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Footer action */}
                          <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-2">
                            <span className="text-xs text-slate-500 font-bold font-mono">
                              📦 {dv.partsHarvested.length} harvested parts listed
                            </span>

                            <button
                              onClick={() => {
                                setSelectedVehicleForHarvest(dv.id);
                                addLog(`Selected ${dv.make} ${dv.model} container space for harvesting!`, 'inventory', 'info');
                              }}
                              className={`text-xs py-1.5 px-3 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                                isTargetForHarvest 
                                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm' 
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" /> {isTargetForHarvest ? 'Selected for Harvest' : 'Select Container'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* PARTS LISTED UNDER THE SELECTED VEHICLE CONTAINER */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6" id="harvested-parts-container">
                  {(() => {
                    const focusedVehicle = selectedYard.damagedVehicles.find(v => v.id === selectedVehicleForHarvest);
                    if (!focusedVehicle) return (
                      <p className="text-xs text-slate-400 text-center py-6">Please select a damaged vehicle container above to check harvested components.</p>
                    );

                    return (
                      <>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                          <div>
                            <div className="flex items-center gap-x-2">
                              <h3 className="text-base font-bold text-slate-900">
                                Harvested Parts Catalogue
                              </h3>
                              <span className="text-xs text-slate-500 font-normal">
                                ({focusedVehicle.year} {focusedVehicle.make} {focusedVehicle.model})
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">Live stock listings catalogued under storage aisle {focusedVehicle.warehouseZone}</p>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                            <span>Catalog Synchronized</span>
                          </div>
                        </div>

                        {/* Inventory harvest form inside */}
                        {currentEmployeeRole === 'inventory' && (
                          <form onSubmit={handleHarvestPart} className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-4">
                            <div className="flex items-center gap-2">
                              <span className="bg-amber-100 p-1 rounded">
                                <Plus className="w-3.5 h-3.5 text-amber-850" />
                              </span>
                              <h4 className="text-xs font-bold uppercase tracking-wide text-slate-700">Add Extracted Part Container Listing</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                              {/* Part name */}
                              <div className="md:col-span-2">
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Part Name</label>
                                <input
                                  type="text"
                                  placeholder="e.g. Rear Diffuser Exhaust Shield"
                                  value={tempPartName}
                                  onChange={(e) => setTempPartName(e.target.value)}
                                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-rose-500 text-slate-850"
                                />
                              </div>

                              {/* Target category */}
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Category</label>
                                <select
                                  value={tempPartCategory}
                                  onChange={(e) => setTempPartCategory(e.target.value)}
                                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-rose-500 text-slate-800"
                                >
                                  <option value="Engine & Exhaust">Engine & Exhaust</option>
                                  <option value="Transmission & Gearbox">Transmission & Gearbox</option>
                                  <option value="Electronics">Electronics</option>
                                  <option value="Body Parts">Body Parts</option>
                                  <option value="Braking Systems">Braking Systems</option>
                                  <option value="Suspension">Suspension</option>
                                  <option value="Batteries & Electric Drives">Batteries & Electric Drives</option>
                                </select>
                              </div>

                              {/* Price */}
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Price ($ B2B)</label>
                                <input
                                  type="number"
                                  value={tempPartPrice}
                                  onChange={(e) => setTempPartPrice(Number(e.target.value))}
                                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-rose-500 text-slate-850"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {/* Stock condition */}
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Extract Condition Grade</label>
                                <select
                                  value={tempPartCondition}
                                  onChange={(e) => setTempPartCondition(e.target.value)}
                                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-rose-500 text-slate-800"
                                >
                                  <option value="Grade A+ - Brand New Remanufactured">Grade A+ - Flawless</option>
                                  <option value="Grade A - Clean Inspected">Grade A - Minimal Wear</option>
                                  <option value="Grade B - Medium Wear Scratch">Grade B - Scratched/Tested</option>
                                  <option value="Grade C - Operational Rebuild Core">Grade C - Repair Core</option>
                                </select>
                              </div>

                              {/* Shelf Location */}
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Warehouse Shelf Tag</label>
                                <input
                                  type="text"
                                  placeholder="e.g. A14-S3-B2"
                                  value={tempPartShelf}
                                  onChange={(e) => setTempPartShelf(e.target.value)}
                                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-rose-500 text-slate-850"
                                />
                              </div>

                              {/* Part weight */}
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Weight (kg)</label>
                                <input
                                  type="number"
                                  value={tempPartWeight}
                                  onChange={(e) => setTempPartWeight(Number(e.target.value))}
                                  className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-rose-500 text-slate-850"
                                />
                              </div>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                              <span className="text-[10px] text-zinc-500 italic">This part is cross-linked with global parts interchange networks automatically on save.</span>
                              <button
                                type="submit"
                                className="bg-[#8B0000] hover:bg-red-700 text-white text-xs font-bold py-2 px-4 rounded-lg flex items-center gap-1 shadow-md shadow-red-900/10 cursor-pointer transition-colors duration-150"
                              >
                                Add Part & Print Tag Label
                              </button>
                            </div>

                            {addPartLog && (
                              <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs p-2.5 rounded-lg flex items-center gap-1.5 font-sans">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> {addPartLog}
                              </div>
                            )}
                          </form>
                        )}

                        <div className="overflow-x-auto rounded-xl border border-slate-150">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-100 text-slate-700 font-mono font-bold uppercase text-[10px] border-b border-slate-150">
                                <th className="p-3.5">SKU Tag</th>
                                <th className="p-3.5">Part Component Name</th>
                                <th className="p-3.5">Category</th>
                                <th className="p-3.5">Condition Class</th>
                                <th className="p-3.5">Bin Shelf Location</th>
                                <th className="p-3.5">Weight</th>
                                <th className="p-3.5 text-right">B2B Base Cost</th>
                              </tr>
                            </thead>
                            <tbody>
                              {focusedVehicle.partsHarvested.map(part => (
                                <tr key={part.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                  <td className="p-3.5 font-mono text-indigo-700 font-bold whitespace-nowrap">{part.sku}</td>
                                  <td className="p-3.5 font-medium text-slate-900">{part.name}</td>
                                  <td className="p-3.5 text-slate-550 whitespace-nowrap">{part.category}</td>
                                  <td className="p-3.5 whitespace-nowrap">
                                    <span className="bg-slate-100 text-slate-800 text-[10px] font-medium py-0.5 px-2 rounded-full">
                                      {part.condition}
                                    </span>
                                  </td>
                                  <td className="p-3.5 font-mono text-rose-600 whitespace-nowrap">{part.shelfLocation}</td>
                                  <td className="p-3.5 font-mono text-slate-500 whitespace-nowrap">{part.weightKg} kg</td>
                                  <td className="p-3.5 text-right font-sans font-bold text-slate-900 whitespace-nowrap">${part.price.toLocaleString()}</td>
                                </tr>
                              ))}
                              {focusedVehicle.partsHarvested.length === 0 && (
                                <tr>
                                  <td colSpan={7} className="text-center text-slate-400 p-8">
                                    No components harvested yet from this container. Switch roles to "Inventory" to label the components.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            )}

            {/* TAB 2: REGISTER NEW SALVAGED VEHICLE CONTAINER FOR PARTS */}
            {activeTab === 'registry' && (
              <motion.div
                key="registry"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6"
              >
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-rose-500" /> Triage Register: Damaged Vehicles Container
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Registering a new vehicle automatically lists it inside your local yard as a "parts container" ready for disassembly.
                  </p>
                </div>

                <form onSubmit={handleRegisterDamagedVehicle} className="space-y-6 max-w-4xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* VIN tag */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 label-required mb-1">Structural VIN</label>
                      <input
                        type="text"
                        placeholder="WP0AB299..."
                        value={newVin}
                        onChange={(e) => setNewVin(e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-rose-500 text-slate-850"
                        maxLength={17}
                        required
                      />
                    </div>

                    {/* Year */}
                    <div>
                      <label className="block text-xs font-bold text-slate-705 mb-1">Production Year</label>
                      <input
                        type="number"
                        value={newYear}
                        onChange={(e) => setNewYear(Number(e.target.value))}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-rose-500 text-slate-850"
                        required
                      />
                    </div>

                    {/* Make */}
                    <div>
                      <label className="block text-xs font-bold text-slate-705 mb-1">Vehicle Make / Brand</label>
                      <input
                        type="text"
                        placeholder="e.g. Porsche, Audi"
                        value={newMake}
                        onChange={(e) => setNewMake(e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-rose-500 text-slate-850"
                        required
                      />
                    </div>

                    {/* Model */}
                    <div>
                      <label className="block text-xs font-bold text-slate-705 mb-1">Model Series</label>
                      <input
                        type="text"
                        placeholder="e.g. 911, M5, RS6"
                        value={newModel}
                        onChange={(e) => setNewModel(e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-rose-500 text-slate-850"
                        required
                      />
                    </div>

                    {/* Trim */}
                    <div>
                      <label className="block text-xs font-bold text-slate-705 mb-1">Spec Package / Trim</label>
                      <input
                        type="text"
                        placeholder="e.g. Carrera GTS"
                        value={newTrim}
                        onChange={(e) => setNewTrim(e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-rose-500 text-slate-850"
                      />
                    </div>

                    {/* Value */}
                    <div>
                      <label className="block text-xs font-bold text-slate-705 mb-1">Estimated Salvage Book Value ($)</label>
                      <input
                        type="number"
                        value={newSalvageVal}
                        onChange={(e) => setNewSalvageVal(Number(e.target.value))}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-rose-500 text-slate-850"
                      />
                    </div>
                  </div>

                  {/* Condition input block */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-705 mb-1">Physical Spec Condition</label>
                      <textarea
                        placeholder="e.g. Front-end crash damage, side structures completely unbent, clean high quality engine components."
                        value={newCondition}
                        onChange={(e) => setNewCondition(e.target.value)}
                        rows={3}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-rose-500 text-slate-850"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-705 mb-1">Exact Parts Damage Profile Details</label>
                      <textarea
                        placeholder="Identify completely un salvageable panels or fluid leaks, state of radiator or headlights."
                        value={newDetails}
                        onChange={(e) => setNewDetails(e.target.value)}
                        rows={3}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-rose-500 text-slate-850"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Severity */}
                    <div>
                      <label className="block text-xs font-bold text-slate-705 mb-1">Total Severity Category</label>
                      <select
                        value={newSeverity}
                        onChange={(e) => setNewSeverity(e.target.value as any)}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-rose-500 text-slate-800"
                      >
                        <option value="Minor">Minor Detonation Issues (Cosmetic Only)</option>
                        <option value="Moderate">Moderate Chassis Damage (Part Reuse 80%)</option>
                        <option value="Severe">Severe Collision (High harvest payout)</option>
                        <option value="Critical">Critical Frame Collapse (Cabin core harvest)</option>
                        <option value="Salvage">Salvage Total Loss (Scrap Metal focus)</option>
                      </select>
                    </div>

                    {/* Stock Zone Tag */}
                    <div>
                      <label className="block text-xs font-bold text-slate-705 mb-1">Allocated Layout Warehouse Zone</label>
                      <select
                        value={newZone}
                        onChange={(e) => setNewZone(e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-rose-500 text-slate-800"
                      >
                        <option value="Aisle A - Performance Section">Aisle A - Performance Section</option>
                        <option value="Aisle B - Heavy Core Chassis">Aisle B - Heavy Core Chassis</option>
                        <option value="Aisle D - Suspension & Rotors">Aisle D - Suspension & Rotors</option>
                        <option value="Aisle H - Hazardous Battery Vault">Aisle H - Hazardous Battery Vault</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-[11px] text-zinc-500 font-sans max-w-xl">
                      Once submitted, this vehicle becomes available as a live <strong>container</strong> in your directory under yard workspace <strong>{selectedYard.name}</strong>. Dismantling mechanics can then log individual harvested components.
                    </p>
                    <button
                      type="submit"
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow cursor-pointer transition-all shrink-0"
                    >
                      Save & Open Container
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* TAB 3: GLOBAL PARTS ENGINE SEARCH INTEGRATION */}
            {activeTab === 'search' && (
              <motion.div
                key="search"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Search className="w-5 h-5 text-rose-500" /> B2B Global Parts Cross-Market Search Engine
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Search and acquire original harvested automotive parts across our certified EU/global dismantler network database in real-time.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-2 relative">
                      <input
                        type="text"
                        placeholder="Search parts by name, OEM code, target vehicle (e.g., S58 engine, 992 spoiler)..."
                        value={partsQuery}
                        onChange={(e) => setPartsQuery(e.target.value)}
                        className="w-full text-xs border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-rose-500 text-slate-800"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>

                    <div>
                      <select
                        value={partCategoryFilter}
                        onChange={(e) => setPartCategoryFilter(e.target.value)}
                        className="w-full text-xs h-full border border-slate-200 rounded-xl px-3 focus:outline-none focus:ring-1 focus:ring-rose-500 bg-white text-slate-850"
                      >
                        <option value="All">All Categories</option>
                        <option value="Engine & Exhaust">Engine & Exhaust</option>
                        <option value="Transmission & Gearbox">Transmission & Gearbox</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Body Parts">Body Parts</option>
                        <option value="Braking Systems">Braking Systems</option>
                        <option value="Suspension">Suspension</option>
                        <option value="Batteries & Electric Drives">Batteries & Electric Drives</option>
                      </select>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 font-mono text-[11px] flex items-center justify-between">
                      <span className="text-slate-400 font-bold">MATCHES</span>
                      <span className="text-rose-600 font-bold text-sm">{filteredGlobalParts.length}</span>
                    </div>
                  </div>
                </div>

                {/* Search Results */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredGlobalParts.map(item => (
                    <div key={item.part.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between hover:shadow transition-shadow">
                      <div>
                        {/* Title area */}
                        <div className="flex justify-between items-start mb-2.1">
                          <span className="bg-indigo-100 text-indigo-800 text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                            {item.part.sku}
                          </span>
                          <span className="text-rose-600 font-sans font-extrabold text-sm">${item.part.price.toLocaleString()}</span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.part.name}</h4>
                        <p className="text-[11px] text-slate-550 mt-1">
                          Category: <span className="text-slate-800 font-medium">{item.part.category}</span>
                        </p>

                        <div className="bg-slate-50 rounded-lg p-2.5 my-3 border border-slate-100 text-[10px] space-y-1 text-slate-600">
                          <p>
                            <strong>Harvest Container:</strong> <span className="text-rose-600 font-bold">{item.vehicleInfo}</span>
                          </p>
                          <p>
                            <strong>Original Yard:</strong> <span className="text-slate-800 font-medium">{item.yardName}</span>
                          </p>
                          <p className="truncate">
                            <strong>Physical Pin:</strong> <span className="text-emerald-700 font-mono">{item.part.shelfLocation}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                        <span className="text-[10px] bg-slate-100 text-slate-700 py-0.5 px-2 rounded-full font-bold">
                          {item.part.condition}
                        </span>

                        <button
                          onClick={() => {
                            setSelectedYardId(item.yardId);
                            setSelectedVehicleForHarvest(item.vehicleId);
                            setActiveTab('directory');
                            addLog(`Found ${item.part.name} -> Routing to ${item.yardName} container.`, 'sales', 'success');
                          }}
                          className="text-[#8B0000] text-xs font-bold hover:underline flex items-center gap-0.5"
                        >
                          Locate Part <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {filteredGlobalParts.length === 0 && (
                    <div className="col-span-3 text-center bg-white border border-slate-200 rounded-2xl p-12">
                      <p className="text-slate-400 text-sm">No matched spare parts found in our B2B network directory.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB 4: WAREHOUSE & STOCK LOCATION MANAGEMENT */}
            {activeTab === 'warehouse' && (
              <motion.div
                key="warehouse"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6"
              >
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-rose-500" /> Professional B2B Stock & Warehouse coordinate mapping
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Systematic rack location coding prevents inventory misplacements. Track detailed coordinates for all harvested salvage assets.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Visual Yard Map Block */}
                  <div className="md:col-span-1 bg-white text-slate-850 rounded-2xl p-4 border border-slate-200/80 flex flex-col justify-between shadow-2xs">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#8B0000] mb-3">Zone Coordinates Map</h4>
                      
                      <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-mono">
                        <div className="bg-red-50 border border-red-200/60 text-[#8B0000] p-3 rounded-lg">
                          <p className="font-extrabold text-[11px]">Zone A</p>
                          <p className="mt-1 font-medium">Performance Engines</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 text-slate-655 p-3 rounded-lg">
                          <p className="font-extrabold text-[11px]">Zone B</p>
                          <p className="mt-1 font-medium">Rigid Chassis</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 text-slate-655 p-3 rounded-lg">
                          <p className="font-extrabold text-[11px]">Zone D</p>
                          <p className="mt-1 font-medium">Rotors &amp; Brakes</p>
                        </div>
                        <div className="bg-red-50/50 border border-red-100 text-slate-800 p-3 rounded-lg">
                          <p className="font-extrabold text-[11px] text-emerald-800">Zone H</p>
                          <p className="mt-1 font-medium text-slate-600">Lithium Batteries</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3 mt-4 text-[10px] text-slate-500 space-y-2">
                      <p className="flex items-center gap-1.5 font-semibold"><InboxIcon className="w-3.5 h-3.5 text-[#8B0000]" /> High-Voltage isolation area armed</p>
                      <p className="flex items-center gap-1.5 font-semibold"><ShieldAlert className="w-3.5 h-3.5 text-[#8B0000]" /> Fluid drains tested 0.0% leaks</p>
                    </div>
                  </div>

                  {/* Stock List with location editing action */}
                  <div className="md:col-span-3 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-550">Active Warehouse Stock Coordinates</h4>
                    
                    <div className="space-y-3">
                      {allGlobalParts.map(item => (
                        <div key={item.part.id} className="bg-slate-50 border border-slate-150 p-4 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-indigo-700 font-bold">{item.part.sku}</span>
                              <span className="text-xs font-semibold text-slate-850 truncate max-w-sm">{item.part.name}</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 mt-1">
                              Origin: <strong className="text-zinc-700">{item.vehicleInfo}</strong> container
                            </p>
                          </div>

                          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                            <div>
                              <p className="text-[10px] text-slate-450 uppercase tracking-wide text-right">Coordinate Code</p>
                              <p className="text-xs text-rose-600 font-mono font-extrabold text-right">{item.part.shelfLocation}</p>
                            </div>

                            <button
                              onClick={() => {
                                const newLoc = prompt('Enter new storage shelf coordinates:', item.part.shelfLocation);
                                if (newLoc) {
                                  setYards(prev => prev.map(y => {
                                    return {
                                      ...y,
                                      damagedVehicles: y.damagedVehicles.map(v => {
                                        return {
                                          ...v,
                                          partsHarvested: v.partsHarvested.map(p => {
                                            if (p.id === item.part.id) {
                                              return { ...p, shelfLocation: newLoc };
                                            }
                                            return p;
                                          })
                                        };
                                      })
                                    };
                                  }));
                                  addLog(`Relocated SKU ${item.part.sku} to new coordinate: ${newLoc}`, 'logistics', 'success');
                                }
                              }}
                              className="bg-white hover:bg-slate-100 border border-slate-205 text-slate-700 py-1 px-2.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all shrink-0"
                            >
                              Relocate Code
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 5: AI PART IDENTIFICATION & COMPATIBILITY SEARCH ASSISTANT */}
            {activeTab === 'ai_assistant' && (
              <motion.div
                key="ai_assistant"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6"
              >
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-rose-500 fill-current" /> AI Part Compatibility & pricing Analyzer
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Describe a retrieved physical part (along with visual markers) to calculate cross-brand model compatibility, approximate OEM catalog numbers and fair market salvage values in real-time.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* AI input pane */}
                  <div className="space-y-4">
                    <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-xl text-xs text-rose-900">
                      <p className="font-semibold">Interactive Suggestions:</p>
                      <ul className="list-disc list-inside mt-1.5 space-y-1">
                        <li>Porsche Carrera 992 Gen brake rotors</li>
                        <li>BMW F90 S58 engine dual turbo-charger bearing</li>
                        <li>Volvo XC90 Recharge high-power inverter block</li>
                      </ul>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">Identify Description or Visual Tag Prompts</label>
                      <textarea
                        value={aiAnalysisDescription}
                        onChange={(e) => setAiAnalysisDescription(e.target.value)}
                        placeholder="e.g. Porsche 2021 T8 high pressure hydraulic fluid steering knuckle pump..."
                        rows={4}
                        className="w-full text-xs border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-rose-500 text-slate-800"
                      />
                    </div>

                    <button
                      onClick={handleAIIdentify}
                      disabled={aiIsAnalyzing}
                      className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-slate-400 text-white font-bold text-xs py-3 px-4 rounded-xl shadow cursor-pointer transition-all flex items-center justify-center gap-2"
                    >
                      {aiIsAnalyzing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Running Ultrasonic Matrix Match...
                        </>
                      ) : (
                        <>
                          <Cpu className="w-4 h-4 fill-white" /> Run AI compatibility check
                        </>
                      )}
                    </button>
                  </div>

                  {/* AI Analysis results output */}
                  <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 min-h-[300px] flex flex-col justify-between" id="ai-results-module">
                    {aiReportResult ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-rose-100 pb-3">
                          <span className="text-[10px] bg-rose-100 text-rose-800 font-bold font-mono px-2 py-0.5 rounded">
                            COMPATIBILITY: {aiReportResult.compatibilityRate}%
                          </span>
                          <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold">Confidence: {aiReportResult.confidenceRate}</span>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Identified Catalog Name</p>
                          <h4 className="text-base font-bold text-slate-900 mt-0.5">{aiReportResult.title}</h4>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-xl border border-slate-100">
                          <div>
                            <p className="text-[10px] text-slate-400">Suggested B2B Fair Price</p>
                            <p className="text-[13px] font-extrabold text-slate-900">${aiReportResult.recommendedB2BPrice.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400">Estimated Market Range</p>
                            <p className="text-[13px] font-sans font-bold text-[#8B0000]">{aiReportResult.estimatedPriceRange}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400">Interchange ID</p>
                            <p className="text-[11px] font-mono text-zinc-700 truncate">{aiReportResult.interchangeId}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400">OEM Cross-number</p>
                            <p className="text-[11px] font-mono text-zinc-700 truncate">{aiReportResult.oemNumber}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Direct Structural Fits (Tested)</p>
                          <div className="flex flex-wrap gap-1">
                            {aiReportResult.targetFits.map((fit: string, idx: number) => (
                              <span key={idx} className="bg-slate-200 text-slate-800 text-[9px] font-bold px-2 py-0.5 rounded">
                                {fit}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg text-[11px] text-emerald-800 flex items-center justify-between font-medium">
                          <span>Recycled Metal Recovery Estimate:</span>
                          <span className="font-bold">{aiReportResult.recycledSteelRecoveryPercentage}% weight ratio</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 py-12">
                        <Bot className="w-10 h-10 text-rose-300 mb-3" />
                        <p className="text-xs">Enter a text description above and tap the AI Analyzer to inspect parts.</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 6: ECO RECYCLING & MATERIAL RECOVERY DATA */}
            {activeTab === 'sustainability' && (
              <motion.div
                key="sustainability"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6"
              >
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-emerald-600" /> B2B Recycling Integrity & CO₂ Offset Ledger
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Verified recycling practices reduce primary extraction efforts. Check structural metal reclamation and hazardous fluid compliance data of our group below.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Stat Card 1 */}
                  <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-emerald-800">
                      <span className="text-[10px] uppercase font-bold tracking-wider font-mono">CO₂ Carbon Offset</span>
                      <Leaf className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl font-bold text-emerald-950">
                      {yards.reduce((sum, item) => sum + item.ecoStats.co2SavedTons, 0).toFixed(1)} Metric Tons
                    </h3>
                    <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                      Calculated on primary manufacturing offset by recycling automotive grade aluminum, steel, and high-purity premium copper circuits.
                    </p>
                  </div>

                  {/* Stat Card 2 */}
                  <div className="bg-slate-50 border border-slate-150 p-5 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-[10px] uppercase font-bold tracking-wider font-mono">Steel Triage</span>
                      <Hammer className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">
                      {(yards.reduce((sum, item) => sum + item.ecoStats.steelRecoveredKg, 0) / 1000).toFixed(1)} Tons Recycled
                    </h3>
                    <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                      Engine steel blocks and body structures crushed, melted down, and processed back into premium logistics casting lines.
                    </p>
                  </div>

                  {/* Stat Card 3 */}
                  <div className="bg-sky-50/50 border border-sky-100 p-5 rounded-2xl space-y-2">
                    <div className="flex justify-between items-center text-sky-800">
                      <span className="text-[10px] uppercase font-bold tracking-wider font-mono">Fluid Reclaimed</span>
                      <Activity className="w-5 h-5" />
                    </div>
                    <h3 className="text-2xl font-bold text-sky-950">
                      {yards.reduce((sum, item) => sum + item.ecoStats.fluidsReclaimedLitres, 0).toLocaleString()} Litres Saved
                    </h3>
                    <p className="text-[11px] text-slate-500 font-sans leading-relaxed">
                      Brake fluids, petroleum lines, and cooling solutions safely isolated without contamination indices.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-250 text-xs rounded-xl text-amber-900 font-sans leading-relaxed">
                  <strong>Regulatory Advisory Notice (B2B):</strong> All hazardous material process cycles conform fully to regional EU ELV Directive (End-of-Life Vehicles directives). Fluid processing facilities are monitored for local eco-reclamation safety thresholds.
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}

// Simple fallback InboxIcon since Inbox or similar might be missing, or standard SVG path
function InboxIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      {...props}
    >
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

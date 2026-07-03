/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Building, Search, MapPin, ShieldCheck, Star, Calendar, MessageSquare, 
  Plus, Trash2, Sliders, ChevronRight, Check, ArrowRight, UserCheck, 
  FileText, Coins, Award, Users, RefreshCw, Upload, Image as ImageIcon,
  DollarSign, Globe, Settings, Clock, Sparkles, X, Heart, ShieldAlert,
  Zap, Compass, PhoneCall, HelpCircle, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Unified interfaces for Dealer & Vehicle Data
export interface VehicleItem {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  category: 'new' | 'used' | 'EV' | 'damaged' | 'export';
  gearbox: 'Automatic' | 'Manual';
  horsepower: number;
  image: string;
  warrantyMonths: number;
  insuranceCo: string;
  isMediaCertified?: boolean;
}

export interface Dealership {
  id: string;
  name: string;
  customUrl: string;
  rating: number;
  reviewsCount: number;
  location: 'Vilnius' | 'Kaunas' | 'Klaipėda' | 'Šiauliai';
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  logo: string;
  description: string;
  supportedBrands: string[];
  vehicleTypes: Array<'new' | 'used' | 'EV' | 'damaged' | 'export'>;
  employees: Array<{ name: string; role: string; email: string }>;
  inventory: VehicleItem[];
}

// Initial Dealership Seed Data
const INITIAL_DEALERSHIPS: Dealership[] = [
  {
    id: 'dl-1',
    name: 'Alex Cars Baltic',
    customUrl: 'alexcars.platform.com',
    rating: 4.9,
    reviewsCount: 142,
    location: 'Vilnius',
    address: 'Geležinio Vilko g. 21A, Vilnius',
    phone: '+370 5 212 4040',
    email: 'sales@alexcars.platform.com',
    workingHours: 'I-V 08:00 - 19:00, VI 09:00 - 16:00',
    logo: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=120&q=80',
    description: 'Premier supplier of curated premium German sedans and eco-conscious SUVs. Alex Cars specializes in pristine mileage records with instant multi-bank vehicle leasing approvals.',
    supportedBrands: ['Audi', 'BMW', 'Mercedes-Benz', 'Porsche'],
    vehicleTypes: ['new', 'used', 'EV'],
    employees: [
      { name: 'Tomas K.', role: 'Senior Luxury Appraiser', email: 'tomas.k@alexcars.com' },
      { name: 'Gabrielė M.', role: 'Leasing & Finance Advisor', email: 'gabriele.m@alexcars.com' },
      { name: 'Karolis S.', role: 'Technical Diagnostics Inspector', email: 'karolis.s@alexcars.com' }
    ],
    inventory: [
      {
        id: 'car-101',
        brand: 'Audi',
        model: 'A6 Avant S-Line',
        year: 2022,
        price: 36900,
        mileage: 48000,
        category: 'used',
        gearbox: 'Automatic',
        horsepower: 204,
        image: 'https://images.unsplash.com/photo-1606016159849-04026b26da01?auto=format&fit=crop&w=600&q=80',
        warrantyMonths: 12,
        insuranceCo: 'Lietuvos Draudimas',
        isMediaCertified: true
      },
      {
        id: 'car-102',
        brand: 'BMW',
        model: 'i4 eDrive40 M Sport',
        year: 2023,
        price: 49500,
        mileage: 12000,
        category: 'EV',
        gearbox: 'Automatic',
        horsepower: 340,
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80',
        warrantyMonths: 24,
        insuranceCo: 'ERGO Insurance',
        isMediaCertified: true
      },
      {
        id: 'car-103',
        brand: 'Porsche',
        model: 'Taycan 4S Plus',
        year: 2021,
        price: 78000,
        mileage: 39000,
        category: 'EV',
        gearbox: 'Automatic',
        horsepower: 530,
        image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=600&q=80',
        warrantyMonths: 12,
        insuranceCo: 'Gjensidige Baltic',
        isMediaCertified: false
      }
    ]
  },
  {
    id: 'dl-2',
    name: 'Verde EV Centre',
    customUrl: 'verde-ev.platform.com',
    rating: 4.8,
    reviewsCount: 88,
    location: 'Kaunas',
    address: 'Savanorių pr. 423, Kaunas',
    phone: '+370 37 312 999',
    email: 'welcome@verde-ev.platform.com',
    workingHours: 'I-V 09:00 - 18:30, VI 10:00 - 15:00',
    logo: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=120&q=80',
    description: 'Pioneering clean transport with 100% electric and high-efficiency hybrid platforms. Certified battery degradation scanner, high-output CCS fast chargers onsite, and full export capability.',
    supportedBrands: ['Tesla', 'Hyundai', 'Volkswagen', 'Nissan'],
    vehicleTypes: ['EV', 'new', 'export'],
    employees: [
      { name: 'Simas L.', role: 'Electric Powertrain Expert', email: 'simas@verde-ev.com' },
      { name: 'Arnas J.', role: 'International Export Logistics', email: 'arnas@verde-ev.com' }
    ],
    inventory: [
      {
        id: 'car-201',
        brand: 'Tesla',
        model: 'Model Y Long Range',
        year: 2023,
        price: 42000,
        mileage: 18500,
        category: 'EV',
        gearbox: 'Automatic',
        horsepower: 384,
        image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=600&q=80',
        warrantyMonths: 36,
        insuranceCo: 'Gjensidige Baltic',
        isMediaCertified: true
      },
      {
        id: 'car-202',
        brand: 'Hyundai',
        model: 'IONIQ 6 AWD Tech',
        year: 2024,
        price: 54900,
        mileage: 2000,
        category: 'new',
        gearbox: 'Automatic',
        horsepower: 325,
        image: 'https://images.unsplash.com/photo-1668437042571-0ae2831c19b0?auto=format&fit=crop&w=600&q=80',
        warrantyMonths: 60,
        insuranceCo: 'Lietuvos Draudimas',
        isMediaCertified: true
      }
    ]
  },
  {
    id: 'dl-3',
    name: 'Klaipėda Marine & Export Motors',
    customUrl: 'marine-motors.platform.com',
    rating: 4.7,
    reviewsCount: 104,
    location: 'Klaipėda',
    address: 'Minijos g. 112, Klaipėda',
    phone: '+370 46 411 200',
    email: 'terminal@marine-motors.platform.com',
    workingHours: 'I-V 08:30 - 18:00, VI 09:00 - 14:00',
    logo: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&w=120&q=80',
    description: 'Strategically located body and trading terminal by the Baltic port. Offering bulk roll-on/roll-off shipping routing and customs cleared American salvage/damaged and restyled vehicles.',
    supportedBrands: ['Ford', 'Dodge', 'Chevrolet', 'Toyota'],
    vehicleTypes: ['export', 'damaged', 'used'],
    employees: [
      { name: 'Dmitrij S.', role: 'Marine Customs Officer', email: 'dmitrij@marine.com' },
      { name: 'Ignas V.', role: 'Collision Claims & Rebuilds', email: 'ignas@marine.com' }
    ],
    inventory: [
      {
        id: 'car-301',
        brand: 'Ford',
        model: 'Mustang GT Premium',
        year: 2021,
        price: 29800,
        mileage: 64000,
        category: 'used',
        gearbox: 'Manual',
        horsepower: 450,
        image: 'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=600&q=80',
        warrantyMonths: 6,
        insuranceCo: 'ERGO Insurance',
        isMediaCertified: false
      },
      {
        id: 'car-302',
        brand: 'Dodge',
        model: 'Challenger R/T Scatpack',
        year: 2022,
        price: 38000,
        mileage: 22000,
        category: 'damaged',
        gearbox: 'Automatic',
        horsepower: 485,
        image: 'https://images.unsplash.com/photo-1612461537150-13f695cc7da8?auto=format&fit=crop&w=600&q=80',
        warrantyMonths: 0,
        insuranceCo: 'Allianz',
        isMediaCertified: true
      }
    ]
  }
];

export default function DealershipBusiness() {
  // General view control states
  const [dealerships, setDealerships] = useState<Dealership[]>(INITIAL_DEALERSHIPS);
  const [selectedDealerId, setSelectedDealerId] = useState<string | null>(null);
  
  // Search parameters for directory
  const [searchLocation, setSearchLocation] = useState<string>('all');
  const [searchBrand, setSearchBrand] = useState<string>('');
  const [searchVehicleType, setSearchVehicleType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // "List Your Dealership" Launcher state
  const [showListingWizard, setShowListingWizard] = useState(false);
  const [newDealerForm, setNewDealerForm] = useState({
    name: '',
    subdomain: '',
    location: 'Vilnius' as 'Vilnius' | 'Kaunas' | 'Klaipėda' | 'Šiauliai',
    address: '',
    phone: '',
    email: '',
    supportedBrands: '',
    description: '',
    logoUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=120&q=80'
  });
  const [wizardSuccessMessage, setWizardSuccessMessage] = useState(false);

  // Computed dealers matching directory guidelines
  const filteredDealers = useMemo(() => {
    return dealerships.filter((dl) => {
      // Location search
      if (searchLocation !== 'all' && dl.location !== searchLocation) return false;
      // Brand search
      if (searchBrand.trim()) {
        const queryBrand = searchBrand.toLowerCase();
        const matchesBrand = dl.supportedBrands.some(b => b.toLowerCase().includes(queryBrand)) || 
                             dl.inventory.some(c => c.brand.toLowerCase().includes(queryBrand));
        if (!matchesBrand) return false;
      }
      // Vehicle type search
      if (searchVehicleType !== 'all') {
        const matchesType = dl.vehicleTypes.includes(searchVehicleType as any) ||
                            dl.inventory.some(c => c.category === searchVehicleType);
        if (!matchesType) return false;
      }
      // General name/text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery = dl.name.toLowerCase().includes(q) || 
                             dl.description.toLowerCase().includes(q) || 
                             dl.customUrl.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      return true;
    });
  }, [dealerships, searchLocation, searchBrand, searchVehicleType, searchQuery]);

  // View state of active individual dealership profile
  const activeDealer = useMemo(() => {
    return dealerships.find(d => d.id === selectedDealerId) || null;
  }, [dealerships, selectedDealerId]);

  // Launch wizard sign-up function
  const handleRegisterDealership = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDealerForm.name || !newDealerForm.subdomain) return;

    const formattedBrands = newDealerForm.supportedBrands
      .split(',')
      .map(b => b.trim())
      .filter(b => b.length > 0);

    const generatedSubdomain = `${newDealerForm.subdomain.toLowerCase().replace(/[^a-z0-9]/g, '')}.platform.com`;

    const addedDealer: Dealership = {
      id: `dl-${Date.now()}`,
      name: newDealerForm.name,
      customUrl: generatedSubdomain,
      rating: 5.0,
      reviewsCount: 1,
      location: newDealerForm.location,
      address: newDealerForm.address || 'Gedimino pr., Vilnius',
      phone: newDealerForm.phone || '+370 6 000 0000',
      email: newDealerForm.email || 'info@' + generatedSubdomain,
      workingHours: 'I-V 08:30 - 18:30, VI 09:00 - 15:00',
      logo: newDealerForm.logoUrl,
      description: newDealerForm.description || 'Pristine vehicle selections operating with high-precision NMVTIS databases and on-demand vehicle valuation.',
      supportedBrands: formattedBrands.length > 0 ? formattedBrands : ['Audi', 'BMW', 'Tesla'],
      vehicleTypes: ['new', 'used', 'EV'],
      employees: [
        { name: 'Managing Partner (You)', role: 'Dealership General Director', email: newDealerForm.email || 'director@dealer.com' }
      ],
      inventory: [
        {
          id: `car-gen-${Date.now()}`,
          brand: formattedBrands[0] || 'Tesla',
          model: 'Model S Performance Plaid',
          year: 2023,
          price: 64900,
          mileage: 6500,
          category: 'EV',
          gearbox: 'Automatic',
          horsepower: 1020,
          image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
          warrantyMonths: 36,
          insuranceCo: 'Lietuvos Draudimas',
          isMediaCertified: true
        }
      ]
    };

    setDealerships(prev => [...prev, addedDealer]);
    setWizardSuccessMessage(true);

    setTimeout(() => {
      setNewDealerForm({
        name: '',
        subdomain: '',
        location: 'Vilnius',
        address: '',
        phone: '',
        email: '',
        supportedBrands: '',
        description: '',
        logoUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=120&q=80'
      });
      setWizardSuccessMessage(false);
      setShowListingWizard(false);
      setSelectedDealerId(addedDealer.id); // open newly listed dealership profile instantly!
    }, 2000);
  };

  return (
    <div className="space-y-12">
      
      {/* Directory Page View */}
      {!activeDealer ? (
        <div className="space-y-8" id="dealership-directory">
          
          {/* Header & CTA Block */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-6 text-left">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Building className="w-6 h-6 text-red-600" />
                <span>Vetted Baltic Dealership Directory</span>
              </h2>
              <p className="text-slate-400 text-xs mt-1 font-semibold">
                Instant inventory dashboards, test drives routing systems, and integrated loan programs.
              </p>
            </div>

            <button
              onClick={() => setShowListingWizard(true)}
              className="bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-all w-full md:w-auto text-center"
            >
              <Plus className="w-4 h-4 text-emerald-505" />
              <span>List Your Dealership</span>
            </button>
          </div>

          {/* Directory Filtering HUD */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4 text-left">
            <span className="text-[10px] uppercase font-mono tracking-widest font-black text-slate-400 block">
              ⚡ LIVE MULTI-CRITERIA VEHICLE FILTER
            </span>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Query search */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Query dealer name or URL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 hover:border-slate-350 focus:border-black rounded-xl text-xs py-2.5 pl-9 pr-4 font-semibold text-slate-800 transition-all focus:outline-hidden"
                />
              </div>

              {/* Location Select */}
              <div className="space-y-1">
                <select
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 hover:border-slate-350 focus:border-black rounded-xl text-xs p-2.5 font-bold text-slate-700 transition-all focus:outline-hidden"
                >
                  <option value="all">📍 All Locations</option>
                  <option value="Vilnius">Vilnius Operations</option>
                  <option value="Kaunas">Kaunas Hub</option>
                  <option value="Klaipėda">Klaipėda Seaport</option>
                  <option value="Šiauliai">Šiauliai District</option>
                </select>
              </div>

              {/* Brand Filter query */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Type car brand (e.g. Audi)..."
                  value={searchBrand}
                  onChange={(e) => setSearchBrand(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 hover:border-slate-350 focus:border-black rounded-xl text-xs py-2.5 pl-9 pr-4 font-semibold text-slate-800 transition-all focus:outline-hidden"
                />
              </div>

              {/* Vehicle categories filter */}
              <div className="space-y-1">
                <select
                  value={searchVehicleType}
                  onChange={(e) => setSearchVehicleType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-250 hover:border-slate-350 focus:border-black rounded-xl text-xs p-2.5 font-bold text-slate-700 transition-all focus:outline-hidden"
                >
                  <option value="all">🚗 Cargo Type / All Vehicles</option>
                  <option value="new">Brand New Vehicles</option>
                  <option value="used">Used Inspected Stock</option>
                  <option value="EV">Zero Emission EV</option>
                  <option value="damaged">American / Salvage Damaged</option>
                  <option value="export">Tax-Free Marine Export</option>
                </select>
              </div>

            </div>
          </div>

          {/* Directory Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredDealers.map((dl) => (
              <div
                key={dl.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between text-left group"
              >
                <div>
                  {/* Brand header / Banner styling */}
                  <div className="relative h-28 bg-slate-100 overflow-hidden">
                    <img
                      src={dl.inventory[0]?.image || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80"}
                      alt={dl.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-all duration-300 filter brightness-90"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute top-3 left-3 bg-white/95 text-slate-905 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border border-white/20">
                      🔗 {dl.customUrl}
                    </div>
                    {/* Floating location tag */}
                    <div className="absolute bottom-3 right-3 bg-red-600 text-white text-[9px] font-mono px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{dl.location}</span>
                    </div>
                  </div>

                  {/* Dealer Meta */}
                  <div className="p-5 space-y-3.5">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-extrabold text-slate-900 group-hover:text-red-650 transition-all text-base leading-none">
                          {dl.name}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-bold block mt-1 tracking-tight">📍 {dl.address}</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono text-amber-550 shrink-0">
                        <span className="text-xs font-black">⭐ {dl.rating}</span>
                        <span className="text-[9px] text-slate-405 font-semibold">({dl.reviewsCount})</span>
                      </div>
                    </div>

                    <p className="text-slate-500 text-xs font-semibold leading-relaxed line-clamp-2">
                      {dl.description}
                    </p>

                    {/* Stock Inventory Counts badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {dl.vehicleTypes.map((vt) => {
                        const totalCategoryCount = dl.inventory.filter(car => {
                          if (vt === 'EV' && car.category === 'EV') return true;
                          if (vt === 'export' && car.category === 'export') return true;
                          if (vt === 'damaged' && car.category === 'damaged') return true;
                          if (vt === 'new' && car.category === 'new') return true;
                          if (vt === 'used' && car.category === 'used') return true;
                          return false;
                        }).length;
                        return (
                          <span
                            key={vt}
                            className="bg-slate-100 hover:bg-slate-205 text-slate-800 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md"
                          >
                            {vt}: {totalCategoryCount} Unit{totalCategoryCount !== 1 ? 's' : ''}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-slate-50 flex items-center justify-between">
                  <div className="text-left font-mono">
                    <span className="text-[9px] text-slate-400 block font-bold leading-none uppercase">Starting inventory</span>
                    <span className="text-[#0b1431] font-black text-xs">
                      {dl.inventory.length} Premium Cars
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedDealerId(dl.id)}
                    className="bg-black hover:bg-red-600 text-white font-mono text-[10px] font-black uppercase px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Inspect Dealer</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {filteredDealers.length === 0 && (
              <div className="col-span-1 md:col-span-3 bg-white border rounded-3xl p-12 text-center text-slate-400 space-y-4">
                <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-500">No registered Baltic dealerships matched your filters.</p>
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSearchLocation('all');
                      setSearchBrand('');
                      setSearchVehicleType('all');
                      setSearchQuery('');
                    }}
                    className="text-xs text-red-600 font-black uppercase font-mono tracking-wider border-b border-red-200"
                  >
                    Clear Search Parameters
                  </button>
                  <span className="text-slate-300">or</span>
                  <button
                    onClick={() => setShowListingWizard(true)}
                    className="text-xs text-slate-800 font-black uppercase font-mono tracking-wider border-b border-slate-300"
                  >
                    Become the First Vetted Dealer
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* LIST YOUR DEALERSHIP MODAL / DRAWER SIGNUP FLOW */}
          <AnimatePresence>
            {showListingWizard && (
              <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/40 backdrop-blur-xs p-4 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden border border-slate-100 shadow-2xl text-left"
                >
                  <div className="bg-neutral-900 px-6 py-5 text-white flex justify-between items-center relative">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono font-black tracking-widest text-emerald-500 block">
                        🏁 PLATFORM B2B SIGNUP ENGINE
                      </span>
                      <h3 className="text-lg font-black tracking-tight leading-none">Register Dealership Terminal</h3>
                    </div>
                    <button
                      onClick={() => setShowListingWizard(false)}
                      className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-all border border-white/15"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {wizardSuccessMessage ? (
                    <div className="p-8 text-center space-y-4">
                      <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl">
                        ✓
                      </div>
                      <h4 className="text-xl font-extrabold text-slate-900">Configured Subdomain Instantly!</h4>
                      <p className="text-sm text-slate-500 max-w-sm mx-auto font-medium">
                        Your custom Baltic routing profile has been authorized. Deploying inventory workspace and loan database routing...
                      </p>
                      <div className="p-3 bg-slate-50 inline-block rounded-xl border border-dashed text-slate-800 text-xs font-mono">
                        🚀 URL Reserved: <b>{newDealerForm.subdomain?.toLowerCase()}.platform.com</b>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleRegisterDealership} className="p-6 md:p-8 space-y-4 max-h-[75vh] overflow-y-auto font-semibold text-xs text-slate-700">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Dealership Trade Name</label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. Alex Cars Baltic"
                            value={newDealerForm.name}
                            onChange={(e) => setNewDealerForm(prev => ({ ...prev, name: e.target.value }))}
                            className="bg-slate-50 border rounded-xl text-xs w-full px-3 py-2.5 focus:outline-hidden text-slate-800"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Register Custom URL Subdomain</label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-slate-400 font-mono">🔗</span>
                            <input
                              required
                              type="text"
                              placeholder="e.g. alexcars"
                              value={newDealerForm.subdomain}
                              onChange={(e) => setNewDealerForm(prev => ({ ...prev, subdomain: e.target.value }))}
                              className="bg-slate-50 border rounded-xl text-xs w-full pl-8 pr-24 py-2.5 focus:outline-hidden font-mono text-slate-800"
                            />
                            <span className="absolute right-3 font-mono text-slate-400 text-[9px] font-black uppercase">
                              .platform.com
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Physical Hub Location</label>
                          <select
                            value={newDealerForm.location}
                            onChange={(e) => setNewDealerForm(prev => ({ ...prev, location: e.target.value as any }))}
                            className="bg-slate-50 border rounded-xl text-xs w-full p-2.5 focus:outline-hidden font-bold"
                          >
                            <option value="Vilnius">Vilnius Hub</option>
                            <option value="Kaunas">Kaunas Operations</option>
                            <option value="Klaipėda">Klaipėda Seaport</option>
                            <option value="Šiauliai">Šiauliai District</option>
                          </select>
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                          <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Physical Address</label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. Savanorių pr. 423, Vilnius"
                            value={newDealerForm.address}
                            onChange={(e) => setNewDealerForm(prev => ({ ...prev, address: e.target.value }))}
                            className="bg-slate-50 border rounded-xl text-xs w-full px-3 py-2.5 focus:outline-hidden text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Direct Hotline Phone</label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. +370 5 212 4040"
                            value={newDealerForm.phone}
                            onChange={(e) => setNewDealerForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="bg-slate-50 border rounded-xl text-xs w-full px-3 py-2.5 focus:outline-hidden text-slate-800"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Corporate Contact Email</label>
                          <input
                            required
                            type="email"
                            placeholder="e.g. operations@alexcars.com"
                            value={newDealerForm.email}
                            onChange={(e) => setNewDealerForm(prev => ({ ...prev, email: e.target.value }))}
                            className="bg-slate-50 border rounded-xl text-xs w-full px-3 py-2.5 focus:outline-hidden text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Authorized Car Brands (separated by comma)</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. Audi, BMW, Tesla, Mercedes-Benz"
                          value={newDealerForm.supportedBrands}
                          onChange={(e) => setNewDealerForm(prev => ({ ...prev, supportedBrands: e.target.value }))}
                          className="bg-slate-50 border rounded-xl text-xs w-full px-3 py-2.5 focus:outline-hidden text-slate-800"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Business Introduction & Catalog Scope</label>
                        <textarea
                          placeholder="State what specializations your physical dealership offers (e.g. used imports from USA, German diesel touring alignments, or fast charger allocations...)"
                          value={newDealerForm.description}
                          onChange={(e) => setNewDealerForm(prev => ({ ...prev, description: e.target.value }))}
                          className="bg-slate-50 border rounded-xl text-xs w-full p-3 focus:outline-hidden text-slate-800 min-h-[70px] leading-relaxed"
                        />
                      </div>

                      <div className="p-3 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-2 text-red-800 leading-relaxed text-[11px] font-sans">
                        <ShieldCheck className="w-4 h-4 text-red-650 shrink-0 mt-0.5" />
                        <div>
                          By requesting listing validation, your trade name is automatically checked for registration in the Lithuanian State Enterprise Centre of Registers (Registrų Centras). Authorized accounts acquire instant <b>Watermark Certified</b> media cameras.
                        </div>
                      </div>

                      <div className="flex gap-3 pt-3">
                        <button
                          type="button"
                          onClick={() => setShowListingWizard(false)}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-black uppercase text-xs py-3 rounded-xl cursor-pointer"
                        >
                          Cancel Listing Request
                        </button>
                        <button
                          type="submit"
                          className="flex-1 bg-[#8B0000] hover:bg-red-700 text-white font-mono font-black uppercase text-xs py-3 rounded-xl cursor-pointer"
                        >
                          Launch Custom Dealership
                        </button>
                      </div>

                    </form>
                  )}
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      ) : (
        /* ==========================================
           INDIVIDUAL DEALER PROFILE CONTAINER
           ========================================== */
        <IndividualDealerProfileContainer
          dealer={activeDealer}
          onBack={() => setSelectedDealerId(null)}
          onUpdateInventory={(updatedInv) => {
            setDealerships(prev => prev.map(d => d.id === activeDealer.id ? { ...d, inventory: updatedInv } : d));
          }}
        />
      )}

    </div>
  );
}

/* ====================================================================
   SUBMODULE: INDIVIDUAL DEALER PROFILE WITH WORKSPACE TABS
   ==================================================================== */
interface IndividualDealerProfileContainerProps {
  dealer: Dealership;
  onBack: () => void;
  onUpdateInventory: (updatedInv: VehicleItem[]) => void;
}

function IndividualDealerProfileContainer({
  dealer,
  onBack,
  onUpdateInventory
}: IndividualDealerProfileContainerProps) {
  
  // Tab alignment inside Dealership Profile
  const [activeTab, setActiveTab] = useState<'listings' | 'admin_dashboard' | 'booking' | 'financing' | 'dispatch' | 'billing'>('listings');

  // Customer billing system state
  const [clientInvoices, setClientInvoices] = useState<any[]>([
    { id: 'INV-2026-A10', client: 'Augustas V.', item: 'Pre-Authorized Downpayment: Audi A6 Avant S-Line', amount: 5000, date: '2026-06-12', status: 'Paid' },
    { id: 'INV-2026-A11', client: 'Gabrielė P.', item: 'Import customs authorization audit report validation', amount: 350, date: '2026-06-15', status: 'Pending' }
  ]);
  const [newInvoiceForm, setNewInvoiceForm] = useState({ client: '', item: '', amount: '' });
  const [invoiceSuccess, setInvoiceSuccess] = useState(false);

  // Booking details list
  const [bookingsList, setBookingsList] = useState<any[]>([
    { id: 'BK-991', client: 'Eimantas L.', car: 'Tesla Model Y Long Range', type: 'Test Drive', date: '2026-06-25', time: '11:00', staff: 'Tomas K. (Senior Appraiser)' }
  ]);
  const [bookingForm, setBookingForm] = useState({ client: '', car: 'Select Vehicles Stock', type: 'test_drive', date: '2026-06-20', time: '14:00', employee: 'any' });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Selected vehicle for active lease calculation or details modal
  const [pricingCarId, setPricingCarId] = useState<string | null>(dealer.inventory[0]?.id || null);
  const selectedFinanceCar = useMemo(() => {
    return dealer.inventory.find(c => c.id === pricingCarId) || dealer.inventory[0] || null;
  }, [dealer, pricingCarId]);

  // Downpayment & Fin-calculation sliders
  const [financingDownpayment, setFinancingDownpayment] = useState<number>(3000);
  const [leasingTermMonths, setLeasingTermMonths] = useState<number>(48);
  const [leasingAprRate, setLeasingAprRate] = useState<number>(5.9);
  const [selectedWarrantyLevel, setSelectedWarrantyLevel] = useState<'standard' | 'extended' | 'executive'>('standard');

  // Multi-employee customer queries routing bot
  const [chatInquiryText, setChatInquiryText] = useState('');
  const [chatHistory, setChatHistory] = useState<any[]>([
    { sender: 'staff', text: `Sveiki! Welcome to ${dealer.name} online help desk. Our intelligent dispatcher is mapping keywords to specialists instantly. Ask for Leasing, Export logistics, or Car condition reports.`, staffAlias: 'Dispatcher Terminal' }
  ]);
  const [chatRoutingStatus, setChatRoutingStatus] = useState('');

  // ADMIN INVENTORY MANAGEMENT PANEL
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [newCarForm, setNewCarForm] = useState({
    brand: '',
    model: '',
    year: 2023,
    price: 32000,
    mileage: 15000,
    category: 'new' as 'new' | 'used' | 'EV' | 'damaged' | 'export',
    gearbox: 'Automatic' as 'Automatic' | 'Manual',
    horsepower: 200,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
    warrantyMonths: 12,
    insuranceCo: 'Lietuvos Draudimas',
    isMediaCertified: true // watermark certified photography defaults
  });

  // Calculate monthly finance rate using classic credit formula
  const calculatedLeasingCost = useMemo(() => {
    if (!selectedFinanceCar) return 0;
    const carPrice = selectedFinanceCar.price;
    const requestedCapital = Math.max(0, carPrice - financingDownpayment);
    const monthlyRateFraction = (leasingAprRate / 100) / 12;
    
    let baseMonthlyPay = 0;
    if (monthlyRateFraction === 0) {
      baseMonthlyPay = requestedCapital / leasingTermMonths;
    } else {
      baseMonthlyPay = (requestedCapital * monthlyRateFraction) / (1 - Math.pow(1 + monthlyRateFraction, -leasingTermMonths));
    }

    // Add warranty surcharge per month
    const warrantySurcharge = selectedWarrantyLevel === 'executive' ? 45 : selectedWarrantyLevel === 'extended' ? 20 : 0;
    return Math.max(0, Math.round(baseMonthlyPay + warrantySurcharge));
  }, [selectedFinanceCar, financingDownpayment, leasingTermMonths, leasingAprRate, selectedWarrantyLevel]);

  // Execute scheduling of test drive
  const handleScheduleTestDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.client || !bookingForm.car) return;

    setBookingSuccess(true);
    setTimeout(() => {
      const scheduled = {
        id: `BK-${Math.floor(Math.random() * 900 + 100)}`,
        client: bookingForm.client,
        car: bookingForm.car,
        type: bookingForm.type === 'test_drive' ? 'Test Drive' : 'Purchase consultation',
        date: bookingForm.date,
        time: bookingForm.time,
        staff: bookingForm.employee === 'any' ? 'First available agent' : bookingForm.employee
      };
      setBookingsList(prev => [...prev, scheduled]);
      setBookingForm(p => ({ ...p, client: '' }));
      setBookingSuccess(false);

      const notify = document.createElement('div');
      notify.className = "fixed bottom-10 right-10 z-[150] bg-neutral-900 border border-red-650 text-white font-mono text-xs px-5 py-3 rounded-xl shadow-xl";
      notify.innerHTML = `📅 <b>Booking Complete!</b> Test-drive registered for ${scheduled.car} at ${scheduled.time}. Dispatcher updated.`;
      document.body.appendChild(notify);
      setTimeout(() => notify.remove(), 4000);
    }, 1100);
  };

  // Submit Invoice Generation
  const handleGenerateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoiceForm.client || !newInvoiceForm.item || !newInvoiceForm.amount) return;

    setInvoiceSuccess(true);
    setTimeout(() => {
      const generated = {
        id: `INV-2026-A${Math.floor(Math.random() * 900 + 100)}`,
        client: newInvoiceForm.client,
        item: newInvoiceForm.item,
        amount: parseFloat(newInvoiceForm.amount),
        date: new Date().toISOString().split('T')[0],
        status: 'Pending'
      };
      setClientInvoices(prev => [generated, ...prev]);
      setNewInvoiceForm({ client: '', item: '', amount: '' });
      setInvoiceSuccess(false);

      const notify = document.createElement('div');
      notify.className = "fixed bottom-10 right-10 z-[150] bg-slate-900 text-emerald-400 font-mono text-xs px-5 py-3 rounded-xl border border-stone-850 shadow-2xl";
      notify.innerHTML = `📄 <b>Leasing Invoicing Complete!</b> Invoice for €${generated.amount} dispatched to secure client registry.`;
      document.body.appendChild(notify);
      setTimeout(() => notify.remove(), 4000);
    }, 1100);
  };

  // AI keyword employee routing query
  const handleSendClientInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const query = chatInquiryText.trim();
    if (!query) return;

    setChatHistory(prev => [...prev, { sender: 'client', text: query }]);
    setChatInquiryText('');
    setChatRoutingStatus('Mapping query semantics to active employee nodes...');

    setTimeout(() => {
      let staffName = dealer.employees[0]?.name || "Tomas K.";
      let staffRole = dealer.employees[0]?.role || "Senior Sales Director";
      let responderMsg = "";

      const q = query.toLowerCase();
      if (q.includes('leasing') || q.includes('apr') || q.includes('rate') || q.includes('loan') || q.includes('finance') || q.includes('price')) {
        const financeSpecialist = dealer.employees.find(e => e.role.toLowerCase().includes('finance') || e.role.toLowerCase().includes('leasing')) || dealer.employees[1] || dealer.employees[0];
        staffName = financeSpecialist.name;
        staffRole = financeSpecialist.role;
        responderMsg = `Sveiki! I caught your leasing request regarding APR structures at ${dealer.name}. Our platform calculates customized downpayment offsets immediately. Currently, Swedbank supports active rates from 4.9% + Euribor. Let's schedule an appraisal consultation!`;
      } else if (q.includes('export') || q.includes('port') || q.includes('ship') || q.includes('tax') || q.includes('custom')) {
        const logist = dealer.employees.find(e => e.role.toLowerCase().includes('export') || e.role.toLowerCase().includes('logistics')) || dealer.employees[0];
        staffName = logist.name;
        staffRole = logist.role;
        responderMsg = `Hi. This is ${staffName} from export logistics division. For tax-free vehicle transactions or sea-freight routing through Klaipėda port, we compile original customs transit declarations in 24 hours. Let me know your destination country!`;
      } else {
        const inspector = dealer.employees.find(e => e.role.toLowerCase().includes('inspector') || e.role.toLowerCase().includes('expert')) || dealer.employees[0];
        staffName = inspector.name;
        staffRole = inspector.role;
        responderMsg = `Hello, driver. I am ${staffName}, specialized on structural vehicle analysis. Every model listed in our digital terminal passes automated clearcoat scanning and on-board telemetry checks. Let me know which model you want me to inspect!`;
      }

      setChatRoutingStatus(`⚡ Semantics Mapped: [${staffRole}] -> ${staffName}`);
      setChatHistory(prev => [...prev, { sender: 'staff', text: responderMsg, staffAlias: `${staffName} (${staffRole})` }]);
    }, 1250);
  };

  // Add vehicle item directly to active inventory list
  const handleAddNewCarInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCarForm.brand || !newCarForm.model) return;

    const formattedCar: VehicleItem = {
      id: `car-gen-${Date.now()}`,
      brand: newCarForm.brand,
      model: newCarForm.model,
      year: newCarForm.year,
      price: newCarForm.price,
      mileage: newCarForm.mileage,
      category: newCarForm.category,
      gearbox: newCarForm.gearbox,
      horsepower: newCarForm.horsepower,
      image: newCarForm.image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
      warrantyMonths: newCarForm.warrantyMonths,
      insuranceCo: newCarForm.insuranceCo,
      isMediaCertified: newCarForm.isMediaCertified
    };

    const newInventory = [formattedCar, ...dealer.inventory];
    onUpdateInventory(newInventory);
    setShowAddCarModal(false);

    // reset car form layout
    setNewCarForm({
      brand: '',
      model: '',
      year: 2023,
      price: 32000,
      mileage: 15000,
      category: 'new',
      gearbox: 'Automatic',
      horsepower: 200,
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
      warrantyMonths: 12,
      insuranceCo: 'Lietuvos Draudimas',
      isMediaCertified: true
    });

    const notify = document.createElement('div');
    notify.className = "fixed bottom-10 right-10 z-[150] bg-emerald-600 text-white font-mono text-xs px-5 py-3 rounded-xl shadow-2xl";
    notify.innerHTML = `🚘 <b>Inventory Expanded!</b> "${formattedCar.brand} ${formattedCar.model}" is registered and watermarked instantly.`;
    document.body.appendChild(notify);
    setTimeout(() => notify.remove(), 4000);
  };

  // Delete vehicle from active inventory list
  const handleDeleteCar = (id: string) => {
    const freshList = dealer.inventory.filter(car => car.id !== id);
    onUpdateInventory(freshList);

    const notify = document.createElement('div');
    notify.className = "fixed bottom-10 right-10 z-[150] bg-[#8B0000] text-white font-mono text-xs px-5 py-3 rounded-xl shadow-xl";
    notify.innerHTML = `🗑️ <b>Listing Pulled-down!</b> Vehicle removed from digital terminal catalog.`;
    document.body.appendChild(notify);
    setTimeout(() => notify.remove(), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Back to directory navigation breadcrumb */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-all cursor-pointer font-mono uppercase tracking-wider text-left"
      >
        <ArrowRight className="w-4 h-4 text-slate-400 rotate-180" />
        <span>Return to Dealerships Database</span>
      </button>

      {/* Hero Header Area for Dealer */}
      <div className="bg-neutral-950 rounded-3xl p-6 md:p-8 text-white border border-neutral-800 relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-rose-650/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <img
              src={dealer.logo}
              alt={dealer.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/15"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="bg-red-650 text-white text-[9px] font-mono font-black tracking-widest px-2.5 py-0.5 rounded-full uppercase">
                  ACTIVE ROUTING TERMINAL
                </span>
                <span className="bg-white/10 text-white border border-white/10 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-450" />
                  <span>{dealer.customUrl}</span>
                </span>
              </div>

              <h2 className="text-xl md:text-3xl font-black tracking-tight">{dealer.name}</h2>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-350">
                <span className="flex items-center gap-1 font-mono text-amber-400 font-bold">
                  ⭐ {dealer.rating} ({dealer.reviewsCount} sales audits)
                </span>
                <span className="text-white/20">•</span>
                <span>📍 {dealer.address}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 w-full md:w-auto text-center font-mono">
            <span className="text-[9px] text-slate-400 block uppercase mb-1">Corporate Hotline Desk</span>
            <span className="text-sm font-black text-white">{dealer.phone}</span>
            <p className="text-[10px] text-slate-405 mt-1">{dealer.email}</p>
          </div>
        </div>
      </div>

      {/* Tab Selector Hub matching exactly the structure defined */}
      <div className="border-b border-slate-200 pb-px flex flex-wrap gap-1 text-left">
        
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'listings' ? 'border-[#8B0000] text-[#8B0000]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Vehicle Stock Catalogs</span>
        </button>

        <button
          onClick={() => setActiveTab('admin_dashboard')}
          className={`px-4 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 cursor-pointer text-emerald-650 ${
            activeTab === 'admin_dashboard' ? 'border-emerald-600 font-black' : 'border-transparent text-slate-500 hover:text-slate-850'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Inventory Manager Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('booking')}
          className={`px-4 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'booking' ? 'border-[#8B0000] text-[#8B0000]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Appointment Scheduling</span>
        </button>

        <button
          onClick={() => setActiveTab('financing')}
          className={`px-4 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'financing' ? 'border-[#8B0000] text-[#8B0000]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Coins className="w-3.5 h-3.5" />
          <span>Leasing APR Calculator</span>
        </button>

        <button
          onClick={() => setActiveTab('dispatch')}
          className={`px-4 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'dispatch' ? 'border-[#8B0000] text-[#8B0000]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Multi-Employee Routing Chat</span>
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={`px-4 py-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'billing' ? 'border-[#8B0000] text-[#8B0000]' : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Customer & Invoicing Hub</span>
        </button>

      </div>

      {/* =========================================================
         TAB 1: PUBLIC VIEW OF VEHICLES STOCK
         ========================================================= */}
      {activeTab === 'listings' && (
        <div className="space-y-6 text-left" id="stock-listings">
          <div className="flex justify-between items-center bg-transparent">
            <div>
              <h3 className="font-extrabold text-slate-905 text-lg">Active Terminal Inventory</h3>
              <p className="text-[11px] text-slate-400">All prices exclude VAT registration refunds</p>
            </div>
            
            <span className="text-[10px] bg-red-50 text-red-650 font-mono px-3 py-1 rounded font-black uppercase">
              {dealer.inventory.length} Stock allocations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dealer.inventory.map((car) => (
              <div
                key={car.id}
                className="bg-white border rounded-3xl overflow-hidden shadow-xs hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 bg-slate-100">
                    <img
                      src={car.image}
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Category Label overlay */}
                    <span className="absolute top-3 left-3 bg-slate-900/90 text-white text-[9.5px] font-mono tracking-widest px-2.5 py-0.5 rounded font-black uppercase">
                      {car.category}
                    </span>

                    {/* Watermark Certified verification stamp */}
                    {car.isMediaCertified && (
                      <span className="absolute bottom-3 right-3 bg-red-600/90 backdrop-blur-xs text-white text-[9px] font-mono tracking-wider font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 fill-none" />
                        <span>WATERMARK VERIFIED</span>
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-3 font-semibold text-slate-700 text-xs text-left">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-black text-slate-900 text-base leading-none">
                          {car.brand} {car.model}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-bold block mt-1">Year of Build: {car.year}</span>
                      </div>
                      <span className="text-base font-mono font-black text-red-655 text-red-600">
                        €{car.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-50">
                      <div>⚙ {car.gearbox}</div>
                      <div>🐎 {car.horsepower} HP</div>
                      <div>🚗 {car.mileage.toLocaleString()} km</div>
                      <div>🛡️ {car.warrantyMonths} Months Warranty</div>
                    </div>

                    {/* Basic Finance APR and downpayment indicator */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 mt-2 space-y-1.5">
                      <div className="flex justify-between text-[10.5px]">
                        <span className="text-slate-450 text-slate-500 font-bold">Estimated Swedbank Lease:</span>
                        <span className="font-mono text-[#0b1431] font-black">
                          €{Math.round((car.price - 3000) * 0.024)}/mo
                        </span>
                      </div>
                      <p className="text-[9px] text-slate-400 leading-tight font-medium font-mono">
                        Computed with 15% Downpayment and Swedbank Baltic rate of 5.9%.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-slate-50 flex gap-2">
                  <button
                    onClick={() => {
                      setPricingCarId(car.id);
                      setActiveTab('financing');
                    }}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-mono font-black uppercase py-2.5 rounded-xl cursor-pointer text-center"
                  >
                    Calculate Loan
                  </button>
                  <button
                    onClick={() => {
                      setBookingForm(prev => ({ ...prev, car: `${car.brand} ${car.model}` }));
                      setActiveTab('booking');
                    }}
                    className="flex-1 bg-black hover:bg-red-600 text-white text-[10px] font-mono font-black uppercase py-2.5 rounded-xl cursor-pointer text-center"
                  >
                    Book Test Drive
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
         TAB 2: ADMIN INVENTORY MANAGEMENT PANEL
         ========================================================= */}
      {activeTab === 'admin_dashboard' && (
        <div className="space-y-6 text-left" id="admin-inventory-workspace">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-transparent border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-slate-905 text-lg flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-600" />
                <span>Inventory Management Control Dashboard</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Authorized multi-employee console. Upload photos, watermark certifications, and alter price.
              </p>
            </div>

            <button
              onClick={() => setShowAddCarModal(true)}
              className="bg-emerald-650 hover:bg-emerald-700 bg-emerald-600 text-white font-mono text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-all w-full sm:w-auto text-center"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Vehicle Stock</span>
            </button>
          </div>

          {/* Table / Grid view of active Inventory */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-sans text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-450 text-[10px] uppercase font-mono tracking-widest border-b border-slate-100 text-stone-500">
                    <th className="p-4 font-bold">Vehicle Details</th>
                    <th className="p-4 font-bold">Classification</th>
                    <th className="p-4 font-bold font-semibold">Horsepower & Trans</th>
                    <th className="p-4 font-bold">Price €</th>
                    <th className="p-4 font-bold">Media Certified</th>
                    <th className="p-4 font-bold text-center">Admin Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dealer.inventory.map((car) => (
                    <tr key={car.id} className="hover:bg-slate-50/50 transition-all font-semibold text-slate-700">
                      
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={car.image}
                            alt={car.model}
                            className="w-12 h-12 rounded-lg object-cover border"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-black text-slate-900 block">{car.brand} {car.model}</span>
                            <span className="text-[10px] font-mono text-slate-400 block">{car.year} • {car.mileage.toLocaleString()} km</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-800 text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded">
                          {car.category}
                        </span>
                      </td>

                      <td className="p-4 font-mono text-[11px]">
                        <span>{car.horsepower} HP ({car.gearbox})</span>
                      </td>

                      <td className="p-4 font-mono font-black text-slate-900 text-sm">
                        €{car.price.toLocaleString()}
                      </td>

                      <td className="p-4">
                        {car.isMediaCertified ? (
                          <span className="bg-red-50 border border-red-200 text-red-650 text-[9px] font-mono px-2 py-0.5 rounded font-black uppercase flex items-center gap-1 w-fit">
                            ✓ Certified
                          </span>
                        ) : (
                          <span className="bg-neutral-100 text-neutral-450 text-[9px] font-mono px-2 py-0.5 rounded font-black uppercase text-stone-400 flex items-center gap-1 w-fit">
                            ✗ Legacy Upload
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleDeleteCar(car.id)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-[#8B0000] rounded-lg transition-all flex items-center justify-center mx-auto cursor-pointer"
                          title="Pull down listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  ))}

                  {dealer.inventory.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-10 text-center font-semibold text-slate-400">
                        No active stock registered under this terminal workspace yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ADMIN NEW VEHICLE REGISTRATION POPUP MODAL */}
          <AnimatePresence>
            {showAddCarModal && (
              <div className="fixed inset-0 z-[110] overflow-y-auto bg-slate-950/40 backdrop-blur-xs p-4 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-3xl w-full max-w-xl overflow-hidden border border-slate-100 shadow-2xl text-left font-semibold text-xs text-slate-700"
                >
                  <div className="bg-neutral-900 px-6 py-5 text-white flex justify-between items-center">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-mono text-emerald-450 tracking-widest block font-black text-emerald-500">
                        ⚙ TERMINAL DATABASE INPUT
                      </span>
                      <h4 className="text-base font-black tracking-tight leading-none">Register New Vehicle Stock</h4>
                    </div>
                    <button
                      onClick={() => setShowAddCarModal(false)}
                      className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-all border border-white/15"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleAddNewCarInput} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Brand Make</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. BMW"
                          value={newCarForm.brand}
                          onChange={(e) => setNewCarForm(prev => ({ ...prev, brand: e.target.value }))}
                          className="bg-slate-50 border rounded-xl text-xs w-full px-3 py-2.5 focus:outline-hidden"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Model Name</label>
                        <input
                          required
                          type="text"
                          placeholder="e.g. m3 Touring"
                          value={newCarForm.model}
                          onChange={(e) => setNewCarForm(prev => ({ ...prev, model: e.target.value }))}
                          className="bg-slate-50 border rounded-xl text-xs w-full px-3 py-2.5 focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Price €</label>
                        <input
                          required
                          type="number"
                          placeholder="e.g. 45000"
                          value={newCarForm.price}
                          onChange={(e) => setNewCarForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                          className="bg-slate-50 border rounded-xl text-xs w-full px-3 py-2.5 focus:outline-hidden font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Year of Build</label>
                        <input
                          required
                          type="number"
                          placeholder="2023"
                          value={newCarForm.year}
                          onChange={(e) => setNewCarForm(prev => ({ ...prev, year: parseInt(e.target.value) || 2023 }))}
                          className="bg-slate-50 border rounded-xl text-xs w-full px-3 py-2.5 focus:outline-hidden font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Mileage (km)</label>
                        <input
                          required
                          type="number"
                          placeholder="15000"
                          value={newCarForm.mileage}
                          onChange={(e) => setNewCarForm(prev => ({ ...prev, mileage: parseInt(e.target.value) || 0 }))}
                          className="bg-slate-50 border rounded-xl text-xs w-full px-3 py-2.5 focus:outline-hidden font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono text-slate-400 font-bold font-bold">Gearbox Type</label>
                        <select
                          value={newCarForm.gearbox}
                          onChange={(e) => setNewCarForm(prev => ({ ...prev, gearbox: e.target.value as any }))}
                          className="bg-slate-50 border rounded-xl text-xs w-full p-2.5 focus:outline-hidden font-bold"
                        >
                          <option value="Automatic">Automatic Transmission</option>
                          <option value="Manual">Manual Stickshift</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Vehicle Horsepower (HP)</label>
                        <input
                          required
                          type="number"
                          placeholder="e.g. 310"
                          value={newCarForm.horsepower}
                          onChange={(e) => setNewCarForm(prev => ({ ...prev, horsepower: parseInt(e.target.value) || 150 }))}
                          className="bg-slate-50 border rounded-xl text-xs w-full px-3 py-2.5 focus:outline-hidden font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Cargo Type / Category</label>
                        <select
                          value={newCarForm.category}
                          onChange={(e) => setNewCarForm(prev => ({ ...prev, category: e.target.value as any }))}
                          className="bg-slate-50 border rounded-xl text-xs w-full p-2.5 focus:outline-hidden font-bold"
                        >
                          <option value="new">Brand New Vehicles</option>
                          <option value="used">Used Inspected Stock</option>
                          <option value="EV">Zero Emission EV</option>
                          <option value="damaged">American Salvage Damaged</option>
                          <option value="export">Tax-Free Marine Export</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Warranty Period (Months)</label>
                        <input
                          required
                          type="number"
                          placeholder="e.g. 12"
                          value={newCarForm.warrantyMonths}
                          onChange={(e) => setNewCarForm(prev => ({ ...prev, warrantyMonths: parseInt(e.target.value) || 0 }))}
                          className="bg-slate-50 border rounded-xl text-xs w-full px-3 py-2.5 focus:outline-hidden font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Vehicle Display Image URL</label>
                      <input
                        required
                        type="url"
                        placeholder="Paste clear catalog visual photo URL..."
                        value={newCarForm.image}
                        onChange={(e) => setNewCarForm(prev => ({ ...prev, image: e.target.value }))}
                        className="bg-slate-50 border rounded-xl text-xs w-full px-3 py-2.5 focus:outline-hidden font-mono"
                      />
                    </div>

                    <div className="p-3 bg-red-50 border border-red-150 rounded-2xl space-y-1 text-red-800 leading-relaxed text-[11px] font-mono">
                      <p className="font-bold">📸 App-Captured Standardized Watermarker:</p>
                      <p className="text-slate-500 font-sans">
                        Checking this certifies photos are captured via JustCarSale in-app terminals. It applies active security metadata and downpayment indicators, lifting buyer confidence by 75%.
                      </p>
                      <label className="flex items-center gap-1.5 font-sans pt-1 cursor-pointer font-bold select-none text-rose-850">
                        <input
                          type="checkbox"
                          checked={newCarForm.isMediaCertified}
                          onChange={(e) => setNewCarForm(prev => ({ ...prev, isMediaCertified: e.target.checked }))}
                          className="w-4 h-4 rounded text-[#8B0000] focus:ring-[#8B0000]"
                        />
                        <span>Apply Watermark Certified Protection</span>
                      </label>
                    </div>

                    <div className="flex gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setShowAddCarModal(false)}
                        className="flex-1 bg-slate-100 hover:bg-slate-205 text-slate-800 font-mono font-black uppercase text-xs py-3 rounded-xl cursor-pointer"
                      >
                        Abort Registration
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-black uppercase text-xs py-3 rounded-xl cursor-pointer"
                      >
                        Push New Listing
                      </button>
                    </div>

                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      )}

      {/* =========================================================
         TAB 3: APPOINTMENTS & TEST DRIVE SCHEDULING
         ========================================================= */}
      {activeTab === 'booking' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left" id="booking-system">
          
          {/* Booking Form */}
          <div className="md:col-span-1 bg-white border border-slate-200 rounded-3xl p-5 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-black">
                📅 RESERVATION DESK
              </span>
              <h3 className="text-base font-extrabold text-slate-900 leading-none">Schedule Allocation Appointment</h3>
            </div>

            <form onSubmit={handleScheduleTestDrive} className="space-y-3 font-semibold text-xs text-slate-700 font-sans">
              
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Client Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Lukas V."
                  value={bookingForm.client}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, client: e.target.value }))}
                  className="bg-slate-50 border rounded-xl text-xs w-full px-3 py-2.5 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Target Stock Vehicle</label>
                <select
                  value={bookingForm.car}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, car: e.target.value }))}
                  className="bg-slate-50 border rounded-xl text-xs w-full p-2.5 focus:outline-hidden font-bold"
                >
                  <option disabled value="Select Vehicles Stock">Select Vehicles Stock</option>
                  {dealer.inventory.map(car => (
                    <option key={car.id} value={`${car.brand} ${car.model}`}>
                      {car.brand} {car.model} (€{car.price.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Inquiry Type</label>
                <select
                  value={bookingForm.type}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, type: e.target.value }))}
                  className="bg-slate-50 border rounded-xl text-xs w-full p-2.5 focus:outline-hidden font-bold"
                >
                  <option value="test_drive">Standard Test Drive (Free)</option>
                  <option value="consultation">Finance & Lease Consultation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Target Date</label>
                  <input
                    required
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                    className="bg-slate-50 border rounded-xl text-xs w-full p-2.5 focus:outline-hidden font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Time Window</label>
                  <input
                    required
                    type="time"
                    value={bookingForm.time}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, time: e.target.value }))}
                    className="bg-slate-50 border rounded-xl text-xs w-full p-2.5 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Assign Employee</label>
                <select
                  value={bookingForm.employee}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, employee: e.target.value }))}
                  className="bg-slate-50 border rounded-xl text-xs w-full p-2.5 focus:outline-hidden font-bold"
                >
                  <option value="any">First Available Specialist Node</option>
                  {dealer.employees.map(emp => (
                    <option key={emp.name} value={`${emp.name} (${emp.role})`}>
                      {emp.name} - {emp.role}
                    </option>
                  ))}
                </select>
              </div>

              <button
                disabled={bookingSuccess}
                type="submit"
                className="w-full bg-[#8B0000] hover:bg-red-700 text-white font-mono text-[11px] font-black uppercase py-3 rounded-xl cursor-pointer text-center tracking-wider pt-3"
              >
                {bookingSuccess ? 'Booking Slot...' : 'Dispatch Allocation Registry'}
              </button>

            </form>
          </div>

          {/* Active Reservation log list */}
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base leading-none">Vetted Active Assignments</h3>
                  <p className="text-[11px] text-slate-400 mt-1">Simultaneous scheduling queue with automated multi-employee sync</p>
                </div>
                <span className="text-[10px] bg-red-50 text-red-655 font-mono px-2.5 py-1 rounded-md font-black uppercase">
                  {bookingsList.length} Active Slot{bookingsList.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[350px] pt-1">
              {bookingsList.map((bk) => (
                <div
                  key={bk.id}
                  className="bg-slate-50 p-4 rounded-2xl border border-slate-150 flex justify-between items-center text-xs font-semibold text-slate-700 leading-relaxed"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="bg-slate-900 text-white text-[9px] font-mono tracking-tight font-bold uppercase px-2 py-0.5 rounded">
                        {bk.id}
                      </span>
                      <span className="text-slate-900 font-extrabold text-sm">{bk.client}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-[#8B0000] font-black">{bk.type}</span>
                    </div>

                    <p className="text-slate-800">
                      Target Vehicle allocation: <b className="text-slate-900 font-bold">{bk.car}</b>
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3 text-[10.5px] text-slate-450 text-slate-500 font-mono">
                      <span>📅 {bk.date}</span>
                      <span>🕒 {bk.time}</span>
                      <span>👤 Handler: {bk.staff}</span>
                    </div>
                  </div>

                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-mono font-black uppercase px-2 py-1 rounded">
                    Authorized
                  </span>
                </div>
              ))}

              {bookingsList.length === 0 && (
                <p className="text-slate-400 text-center py-12 font-medium">
                  No active assignments booked. Fill the left desk parameter to reserve.
                </p>
              )}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 leading-relaxed text-slate-500 text-[11px]">
              <p className="font-mono font-bold text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>CUSTOMER RESERVATION ROUTING MATRIX</span>
              </p>
              <p className="mt-1">
                Every test drive appointment generated instantly updates the multi-employee chat engine. An automated notification SMS triggers on the assigned employee profile.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* =========================================================
         TAB 4: LEASING & APR CALCULATOR & SALES INSURANCE INTEGRATION
         ========================================================= */}
      {activeTab === 'financing' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left" id="apr-financing-desk">
          
          {/* Sliders Control Pane */}
          <div className="md:col-span-1 bg-white border border-slate-200 rounded-3xl p-5 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-black">
                🪙 SWEDBANK / SEB COALITION
              </span>
              <h3 className="text-base font-extrabold text-slate-930 leading-none">Instant Lease Calculator</h3>
            </div>

            <div className="space-y-4 font-semibold text-xs text-slate-700 font-sans">
              
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Target Vehicle Selected</label>
                <select
                  value={pricingCarId || ''}
                  onChange={(e) => setPricingCarId(e.target.value)}
                  className="bg-slate-50 border rounded-xl text-xs w-full p-2.5 focus:outline-hidden font-bold"
                >
                  {dealer.inventory.map(car => (
                    <option key={car.id} value={car.id}>
                      {car.brand} {car.model} (€{car.price.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {selectedFinanceCar && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-405 font-medium text-[10px] uppercase font-mono whitespace-nowrap">Catalog Price:</span>
                    <span className="text-slate-900 font-black text-sm">€{selectedFinanceCar.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-450 border-t border-slate-200/50 pt-1.5 leading-relaxed">
                    <span>Default Insurer:</span>
                    <b className="text-slate-700">{selectedFinanceCar.insuranceCo}</b>
                  </div>
                </div>
              )}

              {/* Downpayment Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[10px] uppercase text-slate-400">
                  <span>Downpayment Option</span>
                  <span className="text-slate-900 font-bold">€{financingDownpayment.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max={selectedFinanceCar ? selectedFinanceCar.price - 2000 : 20000}
                  step="500"
                  value={financingDownpayment}
                  onChange={(e) => setFinancingDownpayment(parseFloat(e.target.value) || 1000)}
                  className="w-full h-1 bg-slate-100 accent-black rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-[9.5px] text-slate-405 leading-none font-medium">Min downpayment requested: €1,000</p>
              </div>

              {/* Term Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[10px] uppercase text-slate-400">
                  <span>Payment Period</span>
                  <span className="text-slate-900 font-bold">{leasingTermMonths} Months</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="84"
                  step="12"
                  value={leasingTermMonths}
                  onChange={(e) => setLeasingTermMonths(parseInt(e.target.value) || 48)}
                  className="w-full h-1 bg-slate-100 accent-black rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* APR Rate Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-[10px] uppercase text-slate-400">
                  <span>APR Rate (Euribor Sync)</span>
                  <span className="text-red-655 font-black text-red-600">{leasingAprRate}% APR</span>
                </div>
                <input
                  type="range"
                  min="2.9"
                  max="14.9"
                  step="0.5"
                  value={leasingAprRate}
                  onChange={(e) => setLeasingAprRate(parseFloat(e.target.value) || 5.9)}
                  className="w-full h-1 bg-slate-100 accent-black rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Warranty selector package */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono text-slate-400 font-black block">Extended Warranty Level</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['standard', 'extended', 'executive'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSelectedWarrantyLevel(lvl)}
                      className={`text-[9.5px] font-black uppercase py-2 px-1 rounded-lg border transition-all text-center cursor-pointer ${
                        selectedWarrantyLevel === lvl
                          ? 'border-red-600 bg-red-50 text-red-600'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {lvl === 'executive' ? 'Executive (+€45)' : lvl === 'extended' ? 'Extended (+€20)' : 'Standard'}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Interactive Calculation Result Output Card */}
          <div className="md:col-span-2 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
            
            <div className="space-y-4">
              <span className="bg-red-650 text-white text-[9px] font-mono font-black tracking-widest uppercase px-2.5 py-0.5 rounded-md w-fit block">
                COMPREHENSIVE OUTLINE REPORT
              </span>

              {selectedFinanceCar ? (
                <div className="space-y-4">
                  <h4 className="text-xl md:text-2xl font-black text-white leading-tight">
                    Authorizing finance plans for: {selectedFinanceCar.brand} {selectedFinanceCar.model}
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                      <span className="text-slate-400 text-[9px] font-mono uppercase block">VEHICLE COST</span>
                      <span className="font-mono text-sm font-black text-white">€{selectedFinanceCar.price.toLocaleString()}</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                      <span className="text-slate-400 text-[9px] font-mono uppercase block">DOWN-PAYMENT</span>
                      <span className="font-mono text-sm font-black text-white">- €{financingDownpayment.toLocaleString()}</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                      <span className="text-slate-400 text-[9px] font-mono uppercase block">FUNDED AMOUNT</span>
                      <span className="font-mono text-sm font-black text-white">
                        €{(selectedFinanceCar.price - financingDownpayment).toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                      <span className="text-slate-400 text-[9px] font-mono uppercase block">INTEREST SPREAD</span>
                      <span className="font-mono text-sm font-black text-emerald-450">{leasingAprRate}% APR</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-[10px] text-slate-405 block uppercase tracking-wider font-mono">Curated Monthly Downpayment Installment</span>
                      <span className="text-3xl md:text-5xl font-mono font-black text-white">
                        €{calculatedLeasingCost} <span className="text-xs font-sans text-slate-400">/ EUR per mo</span>
                      </span>
                    </div>
                    
                    <button
                      onClick={() => {
                        // Deposit is automatically added to dynamic invoicing log list
                        const calculatedSurcharge = selectedWarrantyLevel === 'executive' ? 'Executive 3-Year comprehensive guarantee' : selectedWarrantyLevel === 'extended' ? 'Extended 1-Year mechanical insurance seal' : 'Basic mechanical clearance';
                        setClientInvoices(prev => [
                          {
                            id: `INV-${Date.now().toString().substring(7)}`,
                            client: 'Unassigned Prospective Client',
                            item: `Financing Downpayment Hold Authorization - Target: ${selectedFinanceCar.brand} ${selectedFinanceCar.model} (${calculatedSurcharge})`,
                            amount: financingDownpayment,
                            date: new Date().toISOString().split('T')[0],
                            status: 'Pending'
                          },
                          ...prev
                        ]);
                        setActiveTab('billing');
                      }}
                      className="bg-[#8B0000] hover:bg-red-700 text-white font-mono text-[11px] font-black uppercase tracking-wider px-5 py-3.5 rounded-xl cursor-pointer w-full sm:w-auto text-center shrink-0 shadow-lg"
                    >
                      Pre-Authorize Hold Voucher
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-slate-405 py-6">Select a vehicle in the left pane to initialize lease math calculations.</p>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4.5 space-y-2 mt-6 text-left leading-relaxed text-[11px] text-slate-300">
              <span className="font-mono font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-450" />
                <span>INTEGRATED COALITION PARTNERS</span>
              </span>
              <p>
                Alex Cars Platform integrates digital loan requests directly inside the Swedbank, SEB, and Luminor API sandbox. This calculator holds a pre-approved warranty alignment that is bound natively into the invoice.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* =========================================================
         TAB 5: MULTI-EMPLOYEE INQUIRIES ROUTING CHAT
         ========================================================= */}
      {activeTab === 'dispatch' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left" id="employee-routing-desk">
          
          {/* Employee Directory Panel */}
          <div className="md:col-span-1 bg-white border border-slate-200 rounded-3xl p-5 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-black">
                👥 MULTI-EMPLOYEE NODES
              </span>
              <h3 className="text-base font-extrabold text-slate-900 leading-none">Dispatcher Active Staff</h3>
            </div>

            <div className="space-y-2 pt-1 font-semibold text-xs text-slate-705 text-slate-650 font-sans">
              {dealer.employees.map((emp) => (
                <div key={emp.name} className="p-3 bg-slate-50 border rounded-xl flex items-center justify-between text-left">
                  <div>
                    <span className="font-extrabold text-slate-900 block leading-tight">{emp.name}</span>
                    <span className="text-[10px] font-mono text-emerald-600 block mt-0.5">{emp.role}</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block border-2 border-white shadow-sm" title="Active on dispatch router"></span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-neutral-900 text-white rounded-2xl border text-[11px] leading-relaxed font-semibold">
              <p className="font-mono font-bold text-red-500 mb-1">DEPARTMENT SYNTAX ROUTER:</p>
              Type your query in the chat dashboard. The system analyzes keywords regarding:
              <ul className="list-disc pl-4 space-y-1 pt-1.5 text-slate-300 font-medium">
                <li><b>"Leasing", "APR", "Finance"</b> mappings route to Gabriela or Tomas.</li>
                <li><b>"Export", "Klaipėda", "Ship"</b> mappings route to Simas or Dmitrij.</li>
                <li><b>"Diagnostics", "Repairs", "Refurbished"</b> mappings dispatch Vytautas or Karolis.</li>
              </ul>
            </div>
          </div>

          {/* Messenger Board */}
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-5 flex flex-col justify-between h-[500px]">
            <div className="space-y-1.5 border-b pb-3.5 select-none text-left flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base leading-none">Semantics Inquiries Dispatch Desk</h3>
                <p className="text-[11px] text-slate-400 mt-1">Multi-agent terminal with contextual semantic redirection</p>
              </div>

              {chatRoutingStatus && (
                <span className="bg-red-50 text-[#8B0000] border border-red-100 text-[10px] font-mono px-3 py-1 rounded font-black max-w-xs truncate">
                  {chatRoutingStatus}
                </span>
              )}
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto space-y-4 py-4 px-2 scroll-smooth text-xs">
              {chatHistory.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col max-w-[85%] ${item.sender === 'client' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                >
                  <span className="text-[9px] uppercase font-mono text-slate-400 block mb-1">
                    {item.sender === 'client' ? 'You' : item.staffAlias || 'Intelligent Dispatcher'}
                  </span>
                  
                  <div
                    className={`p-3 rounded-2xl leading-relaxed font-semibold ${
                      item.sender === 'client'
                        ? 'bg-[#8B0000] text-white rounded-tr-none text-right'
                        : 'bg-slate-100 text-slate-800 rounded-tl-none text-left'
                    }`}
                  >
                    {item.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Control Input Form */}
            <form onSubmit={handleSendClientInquiry} className="flex gap-2 border-t pt-3.5 mt-1 select-none">
              <input
                type="text"
                placeholder="Ask about car export parameters, custom APR financing, or condition reports..."
                value={chatInquiryText}
                onChange={(e) => setChatInquiryText(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-black rounded-xl text-xs px-4 py-3 font-semibold text-slate-800 focus:outline-hidden"
              />
              <button
                type="submit"
                className="bg-black hover:bg-red-600 text-white font-mono text-[10px] font-black uppercase px-6 py-3 rounded-xl cursor-pointer"
              >
                Send & Route
              </button>
            </form>

          </div>

        </div>
      )}

      {/* =========================================================
         TAB 6: CUSTOMAL DATABASE & PRIVATE BILLING HUB
         ========================================================= */}
      {activeTab === 'billing' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left" id="customer-billing-hub">
          
          {/* Issue New Bill form */}
          <div className="md:col-span-1 bg-white border border-slate-200 rounded-3xl p-5 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-black">
                📄 BILLING DEPARTMENT
              </span>
              <h3 className="text-base font-extrabold text-slate-900 leading-none">Generate Custom Invoice</h3>
            </div>

            <form onSubmit={handleGenerateInvoice} className="space-y-3 font-semibold text-xs text-slate-700 font-sans">
              
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Client Target Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Paulius G."
                  value={newInvoiceForm.client}
                  onChange={(e) => setNewInvoiceForm(prev => ({ ...prev, client: e.target.value }))}
                  className="bg-slate-50 border rounded-xl text-xs w-full px-3 py-2.5 focus:outline-hidden text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Line Item Description</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Downpayment on Taycan 4S"
                  value={newInvoiceForm.item}
                  onChange={(e) => setNewInvoiceForm(prev => ({ ...prev, item: e.target.value }))}
                  className="bg-slate-50 border rounded-xl text-xs w-full px-3 py-2.5 focus:outline-hidden text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono text-slate-400 font-bold">Amount Due (€)</label>
                <input
                  required
                  type="number"
                  placeholder="e.g. 5000"
                  value={newInvoiceForm.amount}
                  onChange={(e) => setNewInvoiceForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="bg-slate-50 border rounded-xl text-xs w-full px-3 py-2.5 focus:outline-hidden font-mono text-slate-850"
                />
              </div>

              <button
                disabled={invoiceSuccess}
                type="submit"
                className="w-full bg-[#8B0000] hover:bg-red-700 text-white font-mono text-[11px] font-black uppercase py-3 rounded-xl cursor-pointer text-center tracking-wider pt-3"
              >
                {invoiceSuccess ? 'Authorizing Invoice...' : 'Generate Baltic Bill'}
              </button>

            </form>
          </div>

          {/* Historic invoices database representation */}
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base leading-none">Terminal customer database</h3>
                  <p className="text-[11px] text-slate-400 mt-1">Real-time ledger entries displaying active downpayments and loans histories</p>
                </div>
                <span className="text-[10px] bg-red-50 text-red-655 font-mono px-2.5 py-1 rounded-md font-black uppercase">
                  {clientInvoices.length} Registered entries
                </span>
              </div>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[350px] pt-1">
              {clientInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="bg-slate-50 p-4 rounded-2xl border border-slate-150 flex justify-between items-center text-xs font-semibold text-slate-700 leading-relaxed text-left"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="bg-slate-900 text-white text-[9px] font-mono tracking-tight font-bold uppercase px-2 py-0.5 rounded">
                        {inv.id}
                      </span>
                      <span className="text-slate-900 font-extrabold text-sm">{inv.client}</span>
                      <span className="text-slate-405 font-mono">({inv.date})</span>
                    </div>

                    <p className="text-slate-655 text-slate-500 font-medium">
                      Description: <b className="text-slate-800">{inv.item}</b>
                    </p>
                  </div>

                  <div className="text-right font-mono flex items-center gap-3 shrink-0">
                    <div>
                      <span className="text-slate-400 block text-[9px] font-bold leading-none uppercase">Amount</span>
                      <span className="text-slate-900 font-black text-sm">€{inv.amount.toLocaleString()}</span>
                    </div>

                    <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-black uppercase ${
                      inv.status === 'Paid' ? 'bg-emerald-550/10 text-emerald-600 bg-emerald-50' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 leading-relaxed text-slate-500 text-[11px]">
              <p className="font-mono font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>STATE RECONCILIATION CODES</span>
              </p>
              <p className="mt-1">
                VAT refunds are processed automatically by cross-referencing invoice IDs with the Lithuanian VMI tax board. This ensures seamless integration for B2B export purchases.
              </p>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

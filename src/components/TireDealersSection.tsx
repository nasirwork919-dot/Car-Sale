import React, { useState, useMemo } from 'react';
import { 
  Sliders, MapPin, Sparkles, Star, ShieldCheck, Award, Wrench, Search,
  Compass, Grid, Map as MapIcon, RotateCcw, AlertTriangle, ChevronRight,
  Database, Calendar, HelpCircle, MessageSquare, Send, CheckCircle, Package, Info, Check, Shield, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Seed data for Tire Shops
interface TireShop {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  services: string[]; // "tire change", "balancing", "alignment", "seasonal swap", "puncture repair", "storage"
  brands: string[];
  vehicleTypes: string[]; // "Electric", "SUV/4x4", "Passenger", "Commercial"
  availability: 'open_now' | 'today' | 'this_week';
  distance: number; // km
  image: string;
  address: string;
  phone: string;
  workingHours: string;
  description: string;
  hasStorage: boolean;
  hasSameDayFitting: boolean;
}

const TIRE_SHOPS_DATA: TireShop[] = [
  {
    id: 'tire-shop-1',
    name: 'Vilnius Wheel & Laser Alignment Hub',
    rating: 4.9,
    reviewsCount: 312,
    services: ['tire change', 'balancing', 'alignment', 'seasonal swap', 'storage'],
    brands: ['Michelin', 'Continental', 'Pirelli', 'Nokian'],
    vehicleTypes: ['Passenger', 'Electric', 'SUV/4x4'],
    availability: 'open_now',
    distance: 1.2,
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=600',
    address: 'Savanorių pr. 124, Vilnius 03150',
    phone: '+370 5 215 1111',
    workingHours: '08:00 - 20:00 (Open Now)',
    description: 'Precision Hunter HawkEye Elite 3D wheel alignment, automatic laser treading checks, and humidity-vibration controlled seasonal tyre hotel vaults.',
    hasStorage: true,
    hasSameDayFitting: true
  },
  {
    id: 'tire-shop-2',
    name: 'Baltic Grip tyre & Rubber Depot',
    rating: 4.8,
    reviewsCount: 184,
    services: ['tire change', 'puncture repair', 'balancing', 'seasonal swap'],
    brands: ['Continental', 'Goodyear', 'Hankook', 'Bridgestone'],
    vehicleTypes: ['Passenger', 'SUV/4x4', 'Commercial'],
    availability: 'today',
    distance: 2.7,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=600',
    address: 'Verkių g. 36, Vilnius 08221',
    phone: '+370 5 233 4455',
    workingHours: '08:00 - 18:30 (Open Now)',
    description: 'Highly competitive factory direct tire distributions. Same-day fitting bay with active puncture warranty guard plans on Michelin and Continental inventory.',
    hasStorage: false,
    hasSameDayFitting: true
  },
  {
    id: 'tire-shop-3',
    name: 'Klaipėda Sea-Port Tire & Storage Pro',
    rating: 4.7,
    reviewsCount: 145,
    services: ['tire change', 'storage', 'balancing', 'seasonal swap', 'alignment'],
    brands: ['Michelin', 'Pirelli', 'Nokian', 'Goodyear'],
    vehicleTypes: ['Passenger', 'Electric', 'Commercial'],
    availability: 'this_week',
    distance: 5.4,
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=600',
    address: 'Minijos g. 140, Klaipėda 93234',
    phone: '+370 46 411 999',
    workingHours: '09:00 - 18:00',
    description: 'Fully insured tyre hotel storage supporting up to 4,000 wheels. Quick seasonal swapping pits with certified electric vehicle battery tray safety lifts.',
    hasStorage: true,
    hasSameDayFitting: false
  },
  {
    id: 'tire-shop-4',
    name: 'Gediminas Custom Wheel Studio',
    rating: 4.9,
    reviewsCount: 95,
    services: ['alignment', 'balancing', 'tire change', 'seasonal swap'],
    brands: ['Pirelli', 'Michelin', 'Yokohama', 'Toyo'],
    vehicleTypes: ['Passenger', 'Electric'],
    availability: 'open_now',
    distance: 3.1,
    image: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&q=80&w=600',
    address: 'Geležinio Vilko g. 12, Vilnius 03150',
    phone: '+370 5 288 1234',
    workingHours: '09:00 - 19:30 (Open Now)',
    description: 'Specialists in premium offset fitting, low profile ultra-high-performance tire stretching, and track motorsport dynamics configuration.',
    hasStorage: false,
    hasSameDayFitting: true
  },
  {
    id: 'tire-shop-5',
    name: 'E-Grip Electromobility Tyre Lab',
    rating: 4.9,
    reviewsCount: 120,
    services: ['tire change', 'balancing', 'alignment', 'storage'],
    brands: ['Michelin', 'Continental', 'Bridgestone'],
    vehicleTypes: ['Electric', 'Passenger'],
    availability: 'today',
    distance: 4.5,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=600',
    address: 'Ukmergės g. 250, Vilnius 06120',
    phone: '+370 5 244 5566',
    workingHours: '08:00 - 19:00 (Open Now)',
    description: 'Specific testing calibration of sound foam-damped EV tire compounds. Expert alignment targeting specific heavy battery camber demands.',
    hasStorage: true,
    hasSameDayFitting: false
  }
];

// Seed databases for Price Comparison Tool
interface TireProduct {
  id: string;
  brand: string;
  model: string;
  size: string; // e.g. "225/45 R17"
  season: 'Summer' | 'Winter (Friction)' | 'Winter (Studded)' | 'All-Season';
  price: number;
  shopId: string;
  shopName: string;
  rating: number;
  stock: number;
}

const TIRE_PRODUCTS_DATA: TireProduct[] = [
  // 225/45 R17
  { id: 'tp-1', brand: 'Michelin', model: 'Pilot Sport 5 UHP', size: '225/45 R17', season: 'Summer', price: 112, shopId: 'tire-shop-1', shopName: 'Vilnius Wheel & Laser Alignment Hub', rating: 4.9, stock: 12 },
  { id: 'tp-2', brand: 'Michelin', model: 'Pilot Sport 5 UHP', size: '225/45 R17', season: 'Summer', price: 110, shopId: 'tire-shop-2', shopName: 'Baltic Grip tyre & Rubber Depot', rating: 4.8, stock: 8 },
  { id: 'tp-3', brand: 'Continental', model: 'PremiumContact 7', size: '225/45 R17', season: 'Summer', price: 95, shopId: 'tire-shop-1', shopName: 'Vilnius Wheel & Laser Alignment Hub', rating: 4.9, stock: 16 },
  { id: 'tp-4', brand: 'Continental', model: 'WinterContact TS 870', size: '225/45 R17', season: 'Winter (Friction)', price: 104, shopId: 'tire-shop-2', shopName: 'Baltic Grip tyre & Rubber Depot', rating: 4.8, stock: 24 },
  { id: 'tp-5', brand: 'Pirelli', model: 'Cinturato All Season SF2', size: '225/45 R17', season: 'All-Season', price: 89, shopId: 'tire-shop-4', shopName: 'Gediminas Custom Wheel Studio', rating: 4.9, stock: 4 },
  
  // 205/55 R16
  { id: 'tp-6', brand: 'Continental', model: 'EcoContact 6', size: '205/55 R16', season: 'Summer', price: 78, shopId: 'tire-shop-2', shopName: 'Baltic Grip tyre & Rubber Depot', rating: 4.8, stock: 20 },
  { id: 'tp-7', brand: 'Goodyear', model: 'UltraGrip Performance 3', size: '205/55 R16', season: 'Winter (Friction)', price: 83, shopId: 'tire-shop-1', shopName: 'Vilnius Wheel & Laser Alignment Hub', rating: 4.9, stock: 18 },
  { id: 'tp-8', brand: 'Nokian', model: 'Hakkapeliitta 10 (Studded)', size: '205/55 R16', season: 'Winter (Studded)', price: 95, shopId: 'tire-shop-3', shopName: 'Klaipėda Sea-Port Tire & Storage Pro', rating: 4.7, stock: 32 },
  
  // 245/40 R18
  { id: 'tp-9', brand: 'Pirelli', model: 'P Zero Sport', size: '245/40 R18', season: 'Summer', price: 145, shopId: 'tire-shop-4', shopName: 'Gediminas Custom Wheel Studio', rating: 4.9, stock: 8 },
  { id: 'tp-10', brand: 'Michelin', model: 'X-Ice Snow', size: '245/40 R18', season: 'Winter (Friction)', price: 155, shopId: 'tire-shop-1', shopName: 'Vilnius Wheel & Laser Alignment Hub', rating: 4.9, stock: 12 },
  { id: 'tp-11', brand: 'Continental', model: 'IceContact 3 (Studded)', size: '245/40 R18', season: 'Winter (Studded)', price: 148, shopId: 'tire-shop-5', shopName: 'E-Grip Electromobility Tyre Lab', rating: 4.9, stock: 16 }
];

export default function TireDealersSection() {
  // Navigation & Primary Layout State
  const [mapMode, setMapMode] = useState<boolean>(false);
  const [searchCity, setSearchCity] = useState<string>('Vilnius, Lithuania');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sizing search secondary fields
  const [sizeWidth, setSizeWidth] = useState<string>('225');
  const [sizeAspect, setSizeAspect] = useState<string>('45');
  const [sizeRim, setSizeRim] = useState<string>('R17');
  const [sizeSeason, setSizeSeason] = useState<string>('All');
  const [sizeBrand, setSizeBrand] = useState<string>('All');

  // Filters Sidebar State
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Sorting
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'reviews'>('distance');

  // Dynamic bookings state
  const [activeBookingShop, setActiveBookingShop] = useState<TireShop | null>(null);
  const [bookingFormData, setBookingFormData] = useState({
    date: '2026-06-19',
    time: '10:00',
    service: 'tire change',
    tireSize: '225/45 R17',
    bringOwnTires: 'yes',
    notes: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Tire comparison tool local size search state
  const [compWidth, setCompWidth] = useState<string>('225');
  const [compAspect, setCompAspect] = useState<string>('45');
  const [compRim, setCompRim] = useState<string>('R17');
  const [compSeason, setCompSeason] = useState<string>('Summer');
  const [reservedTireId, setReservedTireId] = useState<string | null>(null);

  // Storage quote modal state
  const [showStorageModal, setShowStorageModal] = useState<boolean>(false);
  const [storageForm, setStorageForm] = useState({
    numTires: '4',
    rimsIncluded: 'yes',
    sizeType: '17 Inch',
    months: '6',
    clientName: '',
    clientPhone: ''
  });
  const [storageSuccess, setStorageSuccess] = useState<boolean>(false);

  // Bottom AI Assistant state
  const [aiInputMessage, setAiInputMessage] = useState<string>('');
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { 
      sender: 'ai', 
      text: "Hello! I'm your AI Tire Assistant. Not sure which exact sizing or load rating your vehicle requires? Let me help you out. Tell me your car model structure (e.g. 'Audi A6 2018' or 'Tesla Model Y 2021') and I'll find standard size requirements." 
    }
  ]);
  const [aiIsTyping, setAiIsTyping] = useState<boolean>(false);

  const resetAllFilters = () => {
    setSelectedBrands([]);
    setSelectedServices([]);
    setSelectedVehicles([]);
    setSelectedAvailability('all');
    setMinRating(0);
    setSearchQuery('');
  };

  // Geo locator behavior triggers
  const handleGPSLocationTrigger = () => {
    setSearchCity('Vilnius Left-Bank Zone (Detected)');
    const notification = document.createElement('div');
    notification.className = "fixed bottom-24 left-1/2 -translate-x-1/2 z-[150] bg-zinc-900 text-white text-xs font-mono px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-zinc-800 animate-bounce";
    notification.innerHTML = "🎯 GPS Verified: Correcting coordinates to Baltic Tire Center";
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2500);
  };

  // Main list filters
  const filteredShops = useMemo(() => {
    let result = [...TIRE_SHOPS_DATA];

    // Filter by text search (or size-query from header)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(shop => 
        shop.name.toLowerCase().includes(q) || 
        shop.description.toLowerCase().includes(q) ||
        shop.brands.some(b => b.toLowerCase().includes(q))
      );
    }

    // Brands Available filter
    if (selectedBrands.length > 0) {
      result = result.filter(shop =>
        selectedBrands.some(brand => shop.brands.includes(brand))
      );
    }

    // Services filter
    if (selectedServices.length > 0) {
      result = result.filter(shop =>
        selectedServices.some(svc => shop.services.includes(svc))
      );
    }

    // Vehicle types supported
    if (selectedVehicles.length > 0) {
      result = result.filter(shop => 
        selectedVehicles.some(vt => shop.vehicleTypes.includes(vt))
      );
    }

    // Availability
    if (selectedAvailability !== 'all') {
      result = result.filter(shop => shop.availability === selectedAvailability);
    }

    // Rating
    if (minRating > 0) {
      result = result.filter(shop => shop.rating >= minRating);
    }

    // Direct secondary tire search configurations match (if header parameters selected)
    if (sizeBrand !== 'All') {
      result = result.filter(shop => shop.brands.includes(sizeBrand));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewsCount - a.reviewsCount;
      return 0;
    });

    return result;
  }, [searchQuery, selectedBrands, selectedServices, selectedVehicles, selectedAvailability, minRating, sizeBrand, sortBy]);

  // Sized price comparison products matching
  const matchingProducts = useMemo(() => {
    const targetSize = `${compWidth}/${compAspect} ${compRim}`;
    return TIRE_PRODUCTS_DATA.filter(prod => {
      const matchesSize = prod.size === targetSize;
      const matchesSeason = prod.season.toLowerCase().includes(compSeason.toLowerCase());
      return matchesSize && matchesSeason;
    });
  }, [compWidth, compAspect, compRim, compSeason]);

  // AI chat triggers
  const handleSendAiMessage = (messageText: string) => {
    const textToSend = messageText.trim();
    if (!textToSend) return;

    // Append user message
    setAiChatHistory(prev => [...prev, { sender: 'user', text: textToSend }]);
    setAiInputMessage('');
    setAiIsTyping(true);

    setTimeout(() => {
      setAiIsTyping(false);
      const query = textToSend.toLowerCase();
      let replyText = '';

      if (query.includes('tesla') || query.includes('model 3') || query.includes('model y')) {
        replyText = "The standard sizing specification for a **Tesla Model 3 (2019-2024)** with factory 18\" Aero alloy wheels is **235/45 R18** (standard load index 98Y). For larger Sport wheels, the correct sizing is **235/40 R19** or **235/35 R20**.\n\nWe recommend selecting low-noise **foam-damped tires** (like Michelin Pilot Sport EV or Continental ProContact RX with ContiSilent) to preserve cabin serenity.";
      } else if (query.includes('bmw') || query.includes('3 series') || query.includes('g20') || query.includes('f30')) {
        replyText = "For standard **BMW 3 Series (G20 Chassis)**, the factory fits **225/45 R18** on all four corners for square setups, or staggered **225/45 R18 in front** with **255/40 R18 on the rears**.\n\nBe sure to match standard star-rated (★) BMW homologated compounds to prevent differential load errors on xDrive models!";
      } else if (query.includes('audi') || query.includes('a6') || query.includes('a4')) {
        replyText = "For an **Audi A6 (C8 Generation, 2018-present)**, standard comfort wheels utilize **225/55 R17** or **244/45 R18**. S-Line packages usually scale up to **245/40 R19**.\n\nIf you have Quattro AWD, we strictly advice running identical tread depth across both axles! You can find multi-tire sets with precise alignment calipers at *Vilnius Wheel & Laser Alignment Hub*.";
      } else if (query.includes('toyota') || query.includes('rav4') || query.includes('prius')) {
        replyText = "For a popular **Toyota RAV4 (2020-present)**, the factory standard sits on **225/65 R17** or executive **225/60 R18**.\n\nIf hauling gear or light offroading, check out all-weather models like Nokian Outpost or Michelin CrossClimate 2 SUV.";
      } else {
        replyText = `Based on our global automotive database records, vehicles matching "${textToSend}" typically utilize radial sizes between **205/55 R16** (compact standard) up to **245/40 R18** (premium sport package).\n\nYou can easily verify by looking at the placard stickered on your driver-side door jamb. Try choosing one of those sizes in our comparison tool tracker above to check instant pricing!`;
      }

      setAiChatHistory(prev => [...prev, { sender: 'ai', text: replyText }]);
    }, 1500);
  };

  const handleBookingConfirmSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setActiveBookingShop(null);
      setBookingSuccess(false);
      
      // Temporary screen notification
      const alertDiv = document.createElement('div');
      alertDiv.className = "fixed bottom-10 right-10 z-[200] bg-zinc-900 border border-zinc-800 text-white text-xs font-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in duration-300";
      alertDiv.innerHTML = `🛡️ <b>Tire Fitting Reservation Locked successfully. We have put aside your selected compound and booked the bay.</b>`;
      document.body.appendChild(alertDiv);
      setTimeout(() => alertDiv.remove(), 4500);
    }, 2000);
  };

  const handleStorageQuoteSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    setStorageSuccess(true);
    setTimeout(() => {
      setShowStorageModal(false);
      setStorageSuccess(false);

      const alertDiv = document.createElement('div');
      alertDiv.className = "fixed bottom-10 right-10 z-[200] bg-emerald-600 text-white text-xs font-black px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in duration-300";
      alertDiv.innerHTML = `📦 <b>Tyre Hotel request dispatched to 3 nearest climate-controlled storage vaults. Offers will arrive directly.</b>`;
      document.body.appendChild(alertDiv);
      setTimeout(() => alertDiv.remove(), 5000);
    }, 1800);
  };

  return (
    <div className="bg-[#F5F5F7] min-h-screen text-slate-800 text-left font-sans leading-relaxed relative pb-20">
      
      {/* 1. HEADER SECTION CONTAINER */}
      <div className="bg-white border-b border-slate-200 py-8 md:py-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            
            {/* Title block */}
            <div className="space-y-2">
              <h1 id="tire-dealers-heading" className="text-3xl font-bold tracking-tight text-slate-900 mt-1 font-sans">
                Find Tire Shops Near You
              </h1>
            </div>

            {/* Map toggle on the right */}
            <div className="flex items-center shrink-0">
              <div className="bg-white p-1 rounded-xl shadow-xs border border-slate-200/50 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setMapMode(false)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold tracking-tight transition-all duration-300 flex items-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5 ${
                    !mapMode ? 'bg-[#8B0000] text-white shadow-sm hover:bg-[#4A4A4A]' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Grid Listing</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMapMode(true)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold tracking-tight transition-all duration-300 flex items-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5 ${
                    mapMode ? 'bg-[#8B0000] text-white shadow-sm hover:bg-[#4A4A4A]' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>Interactive Map</span>
                </button>
              </div>
            </div>

          </div>

          {/* Quick Location Bar with Search keyword */}
          <div className="mt-8 bg-slate-100 border border-slate-205 rounded-2xl p-3 max-w-full flex flex-col lg:flex-row items-center gap-3">
            
            <div className="relative w-full lg:w-80 shrink-0">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" />
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Enter city or district..."
                className="w-full bg-white text-slate-900 text-xs font-bold rounded-xl pl-10 pr-4 py-3 placeholder-slate-400 border border-slate-205 focus:outline-hidden focus:ring-1 focus:ring-red-600"
              />
            </div>
            
            <button
              type="button"
              onClick={handleGPSLocationTrigger}
              className="w-full lg:w-auto bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-[11px] tracking-tight uppercase px-4 py-3 border border-slate-205 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Compass className="w-4 h-4 text-red-600 animate-spin-slow" />
              <span>Use My Location</span>
            </button>

            <div className="h-5 w-[1px] bg-slate-250 hidden lg:block"></div>

            {/* Keyword Search field */}
            <div className="relative w-full flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-450" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by shop name, description (e.g. alignment)..."
                className="w-full bg-white text-slate-900 text-xs font-bold rounded-xl pl-9 pr-3 py-3 placeholder-slate-400 border border-slate-205 focus:outline-hidden"
              />
            </div>

          </div>

          {/* SECONDARY SEARCH BAR: FOR TIRE SIZING SPECIFICS */}
          <div className="mt-4 bg-red-50/50 border border-red-100 rounded-2xl p-4">
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              
              <div>
                <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Width</label>
                <select
                  value={sizeWidth}
                  onChange={(e) => setSizeWidth(e.target.value)}
                  className="w-full bg-white border border-slate-205 rounded-lg px-2 py-2 text-xs font-bold cursor-pointer text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                >
                  {['195', '205', '215', '225', '235', '245', '255', '275'].map(w => (
                    <option key={w} value={w}>{w} mm</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Aspect Ratio</label>
                <select
                  value={sizeAspect}
                  onChange={(e) => setSizeAspect(e.target.value)}
                  className="w-full bg-white border border-slate-205 rounded-lg px-2 py-2 text-xs font-bold cursor-pointer text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                >
                  {['35', '40', '45', '50', '55', '60', '65'].map(ar => (
                    <option key={ar} value={ar}>{ar}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Rim Diameter</label>
                <select
                  value={sizeRim}
                  onChange={(e) => setSizeRim(e.target.value)}
                  className="w-full bg-white border border-slate-205 rounded-lg px-2 py-2 text-xs font-bold cursor-pointer text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                >
                  {['R15', 'R16', 'R17', 'R18', 'R19', 'R20', 'R21'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Season</label>
                <select
                  value={sizeSeason}
                  onChange={(e) => setSizeSeason(e.target.value)}
                  className="w-full bg-white border border-slate-205 rounded-lg px-2 py-2 text-xs font-bold cursor-pointer text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                >
                  <option value="All">All Seasons</option>
                  <option value="Summer">Summer only</option>
                  <option value="Winter">Winter only</option>
                </select>
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Authorized Brand</label>
                <select
                  value={sizeBrand}
                  onChange={(e) => setSizeBrand(e.target.value)}
                  className="w-full bg-white border border-slate-205 rounded-lg px-2 py-2 text-xs font-bold cursor-pointer text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-red-600"
                >
                  <option value="All">All Brands</option>
                  <option value="Michelin">Michelin</option>
                  <option value="Continental">Continental</option>
                  <option value="Pirelli">Pirelli</option>
                  <option value="Goodyear">Goodyear</option>
                </select>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* PRIMARY GRID SPLIT ELEMENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        
        {/* MOBILE COLLAPSIBILITY ROW */}
        <div className="flex md:hidden items-center justify-between mb-4 bg-white p-3 rounded-xl border border-slate-205">
          <span className="text-xs font-extrabold text-slate-800 uppercase tracking-widest font-mono">Tire Shop Filtering</span>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Refine</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* 2. FILTERS SIDEBAR */}
          <div className={`
            fixed inset-0 z-50 bg-black/60 md:static md:bg-transparent md:z-10 md:block transition-all duration-300
            ${sidebarOpen ? 'block' : 'hidden'}
          `}>
            
            <div className="bg-white md:bg-transparent w-80 md:w-auto h-full md:h-auto overflow-y-auto md:overflow-visible p-6 md:p-0 border-r border-slate-200 md:border-r-0 float-left md:float-none space-y-6">
              
              <div className="flex items-center justify-between md:hidden pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-xs uppercase font-mono">
                  <Sliders className="w-4 h-4 text-red-655" />
                  <span>Filter Options</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sidebar filter options panel wrapper */}
              <div className="bg-white rounded-2xl border border-slate-205 p-5 space-y-6 shadow-xs text-left">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-extrabold text-[#8B0000] text-[12px] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Sliders className="w-3.5 h-3.5 text-red-600" /> Filters Selection
                  </span>
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-[10px] text-red-600 hover:underline font-extrabold uppercase"
                  >
                    Clear All
                  </button>
                </div>

                {/* Tire Brands */}
                <div className="space-y-2.5">
                  <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider font-mono">Authorized Brands</h4>
                  <div className="space-y-2">
                    {['Michelin', 'Continental', 'Pirelli', 'Nokian', 'Goodyear', 'Hankook'].map((brand) => {
                      const active = selectedBrands.includes(brand);
                      return (
                        <label key={brand} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900 select-none">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => {
                              setSelectedBrands(prev => 
                                active ? prev.filter(item => item !== brand) : [...prev, brand]
                              );
                            }}
                            className="w-4 h-4 rounded-sm accent-red-650"
                          />
                          <span>{brand}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Services available */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider font-mono">Services Offered</h4>
                  <div className="space-y-2">
                    {[
                      { id: 'tire change', label: 'Tire Fitting & Change' },
                      { id: 'balancing', label: 'Wheel Balancing' },
                      { id: 'alignment', label: '3D Laser Alignment' },
                      { id: 'seasonal swap', label: 'Seasonal Swap pit' },
                      { id: 'puncture repair', label: 'Puncture Seal Repair' },
                      { id: 'storage', label: 'Tyre Hotel Storage' }
                    ].map((svc) => {
                      const active = selectedServices.includes(svc.id);
                      return (
                        <label key={svc.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900 select-none">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => {
                              setSelectedServices(prev => 
                                active ? prev.filter(item => item !== svc.id) : [...prev, svc.id]
                              );
                            }}
                            className="w-4 h-4 rounded-sm accent-red-650"
                          />
                          <span>{svc.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Supported Vehicle Types */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider font-mono">Vehicle Capabilities</h4>
                  <div className="space-y-2">
                    {[
                      { id: 'Passenger', label: 'Standard Passenger Cars' },
                      { id: 'Electric', label: 'EV Specific Safe Lifts' },
                      { id: 'SUV/4x4', label: 'SUV & Heavy 4x4 Offroad' },
                      { id: 'Commercial', label: 'Commercial Vans / Cargo' }
                    ].map((vt) => {
                      const active = selectedVehicles.includes(vt.id);
                      return (
                        <label key={vt.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900 select-none">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => {
                              setSelectedVehicles(prev => 
                                active ? prev.filter(item => item !== vt.id) : [...prev, vt.id]
                              );
                            }}
                            className="w-4 h-4 rounded-sm accent-red-650"
                          />
                          <span>{vt.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Availability */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider font-mono">Bay Availability</h4>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { id: 'all', name: 'Show All Bays' },
                      { id: 'open_now', name: 'Open Now' },
                      { id: 'today', name: 'Fitting Slots Today' },
                      { id: 'this_week', name: 'Booking Slots This Week' }
                    ].map((avail) => (
                      <label key={avail.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="avail_tires"
                          checked={selectedAvailability === avail.id}
                          onChange={() => setSelectedAvailability(avail.id)}
                          className="w-4 h-4 accent-red-650"
                        />
                        <span>{avail.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider font-mono">Minimum Rating</h4>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { id: 0, label: 'All service ratings' },
                      { id: 4.8, label: '4.8+ Master Hubs ⭐' },
                      { id: 4.9, label: '4.9+ Flawless Finish ⭐' }
                    ].map((item) => (
                      <label key={item.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="tire_rating"
                          checked={minRating === item.id}
                          onChange={() => setMinRating(item.id)}
                          className="w-4 h-4 accent-red-650"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
              
            </div>

          </div>

          {/* MAIN COLUMN CONTENT CONTAINER */}
          <div className="lg:col-span-3 space-y-8 text-left">
            
            {/* 3. CORE SPECIAL FEATURE BLOCK: TIRE SEARCH & PRICE COMPARISON */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-50 rounded-2xl text-red-650 shrink-0">
                  <Database className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-slate-900 leading-tight">
                    Tire Search & Live Price Comparison
                  </h3>
                  <p className="text-slate-500 text-xs max-w-xl">
                    Query real-time parts inventory arrays from verified nearby warehouses. Configure your tires size and lock-in bulk discount pricing immediately.
                  </p>
                </div>
              </div>

              {/* Sizing Comparison input matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-200/60">
                
                <div>
                  <label className="text-[10px] text-slate-400 font-black block mb-1 uppercase">Width</label>
                  <select
                    value={compWidth}
                    onChange={(e) => { setCompWidth(e.target.value); setReservedTireId(null); }}
                    className="w-full bg-white border border-slate-205 text-slate-900 text-xs font-bold rounded-lg px-2 py-1.5 cursor-pointer focus:ring-1 focus:ring-red-600"
                  >
                    {['195', '205', '215', '225', '235', '245', '255', '275'].map(w => (
                      <option key={w} value={w}>{w} mm</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-black block mb-1 uppercase">Aspect</label>
                  <select
                    value={compAspect}
                    onChange={(e) => { setCompAspect(e.target.value); setReservedTireId(null); }}
                    className="w-full bg-white border border-slate-205 text-slate-900 text-xs font-bold rounded-lg px-2 py-1.5 cursor-pointer focus:ring-1 focus:ring-red-600"
                  >
                    {['40', '45', '50', '55', '60', '65'].map(ar => (
                      <option key={ar} value={ar}>{ar}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-black block mb-1 uppercase">Rim Size</label>
                  <select
                    value={compRim}
                    onChange={(e) => { setCompRim(e.target.value); setReservedTireId(null); }}
                    className="w-full bg-white border border-slate-205 text-slate-900 text-xs font-bold rounded-lg px-2 py-1.5 cursor-pointer"
                  >
                    {['R15', 'R16', 'R17', 'R18', 'R19', 'R20', 'R21'].map(rim => (
                      <option key={rim} value={rim}>{rim}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-black block mb-1 uppercase">Season Climate</label>
                  <select
                    value={compSeason}
                    onChange={(e) => { setCompSeason(e.target.value); setReservedTireId(null); }}
                    className="w-full bg-white border border-slate-205 text-slate-900 text-xs font-bold rounded-lg px-2 py-1.5 cursor-pointer"
                  >
                    <option value="Summer">Summer</option>
                    <option value="Winter">Winter (Friction & Stud)</option>
                    <option value="All-Season">All-Season</option>
                  </select>
                </div>

              </div>

              {/* Dynamic stock results table based on selected size */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Found live dealer reserves for: {compWidth}/{compAspect} {compRim}</span>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Direct Price Lock</span>
                  </div>
                </div>

                {matchingProducts.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {matchingProducts.map((prod) => {
                      const isReserved = reservedTireId === prod.id;
                      return (
                        <div key={prod.id} className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-slate-50 transition-colors">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900 text-xs leading-none">{prod.brand} {prod.model}</span>
                              <span className="bg-slate-100 text-slate-500 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md">{prod.season}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-red-650" />
                              <span>In Stock at <b className="text-slate-800">{prod.shopName}</b></span>
                            </p>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-6">
                            <div className="text-right sm:text-right">
                              <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none">Price Per Tire</span>
                              <span className="text-base font-black text-slate-900">€{prod.price} <span className="text-[10px] text-slate-400 font-bold">VAT inc.</span></span>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setReservedTireId(prod.id);
                                const mockNotification = document.createElement('div');
                                mockNotification.className = "fixed bottom-24 left-1/2 -translate-x-1/2 z-[150] bg-zinc-900 text-white text-xs font-mono px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-zinc-800 animate-fade";
                                mockNotification.innerHTML = `⭐ <b>Price locked at €${prod.price}/tire. We have earmarked ${prod.brand} sets at ${prod.shopName}!</b>`;
                                document.body.appendChild(mockNotification);
                                setTimeout(() => mockNotification.remove(), 3500);
                              }}
                              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all active:scale-[0.98] cursor-pointer whitespace-nowrap uppercase tracking-wider font-mono ${
                                isReserved 
                                  ? 'bg-slate-200 text-slate-600 cursor-not-allowed flex items-center gap-1' 
                                  : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                              }`}
                              disabled={isReserved}
                            >
                              {isReserved ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Earmarked</span>
                                </>
                              ) : (
                                <span>Lock In Price</span>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center space-y-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mx-auto" />
                    <p className="text-xs text-slate-500 font-semibold">No products in seed database currently matched {compWidth}/{compAspect} {compRim} ({compSeason})</p>
                    <p className="text-[10px] text-slate-400">Try choosing <b>225/45 R17 (Summer / Winter)</b> or <b>245/40 R18</b> for an active price grid layout simulation.</p>
                  </div>
                )}
              </div>

            </div>

            {/* DYNAMIC SHORTEST DISTANCE LABELS */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono tracking-wider text-slate-400 block uppercase font-bold">Refitting Workshop listings</span>
                <span className="font-extrabold text-slate-900 text-xs">Showing {filteredShops.length} verified tire shops near {searchCity}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-extrabold uppercase font-mono tracking-wider">Distance metrics</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-205 text-slate-800 text-xs font-bold rounded-lg px-2.5 py-1.5 cursor-pointer focus:outline-hidden"
                >
                  <option value="distance">Distance (Closest First)</option>
                  <option value="rating">Rating (4.5+ first)</option>
                  <option value="reviews">Reviews Volume</option>
                </select>
              </div>
            </div>

            {/* MAP LAYOUT MODE OR CARDS LIST */}
            {mapMode ? (
              
              /* SIMULATED MAP CANVAS WITH MARKERS */
              <div className="bg-zinc-900 rounded-3xl h-[480px] relative overflow-hidden border border-zinc-800 shadow-xl">
                
                {/* Simulated Street grid background */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_2px,transparent_1px)] [background-size:24px_24px] bg-zinc-950">
                  <div className="absolute inset-x-0 top-1/3 h-[1px] bg-red-600/20"></div>
                  <div className="absolute inset-x-0 top-2/3 h-[1px] bg-red-600/20"></div>
                  <div className="absolute inset-y-0 left-1/2 w-[1px] bg-red-600/20"></div>

                  {filteredShops.map((shop, i) => (
                    <motion.div
                      key={shop.id}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3.5, repeat: Infinity, delay: i * 0.4 }}
                      style={{
                        position: 'absolute',
                        top: `${25 + (i * 14) % 60}%`,
                        left: `${30 + (i * 12) % 55}%`
                      }}
                      className="cursor-pointer group"
                      onClick={() => {
                        setActiveBookingShop(shop);
                      }}
                    >
                      <div className="relative">
                        <div className="absolute -inset-1.5 bg-red-650/40 rounded-full blur-xs animate-ping"></div>
                        <div className="bg-red-600 border-2 border-white text-white rounded-full p-2 shadow-lg relative flex items-center justify-center">
                          <Sliders className="w-3.5 h-3.5" />
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 bg-zinc-950 text-white text-[9.5px] font-mono whitespace-nowrap px-2 py-0.5 rounded border border-zinc-800 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                          {shop.name} ({shop.distance} km)
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-4 max-w-xs text-left hidden sm:block">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-widest font-mono mb-1">
                    <Compass className="w-3 text-red-650 animate-spin-slow" />
                    <span>Active Calibration GPS</span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
                    Connecting live to pneumatic torque and laser alignment slots in the designated boundary region. Click any indicator to launch reservation schedule.
                  </p>
                </div>

              </div>

            ) : (

              /* BUSINESS CARDS LISTING */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredShops.map((shop) => (
                  <motion.div
                    key={shop.id}
                    layoutId={`tire-shop-card-${shop.id}`}
                    className="bg-[#FFFFFF] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between border border-slate-100"
                  >
                    <div className="cursor-pointer" onClick={() => setActiveBookingShop(shop)}>
                      {/* Polished flat rectangular showcase image block on top — completely clean */}
                      <div className="w-full h-40 overflow-hidden relative">
                        <img
                          src={shop.image}
                          alt={shop.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Typography Block */}
                      <div className="p-4 space-y-2">
                        <div className="flex justify-between items-start gap-1">
                          <h3 className="font-sans font-bold text-slate-900 text-sm tracking-tight leading-tight line-clamp-2">
                            {shop.name}
                          </h3>
                          <div className="text-amber-500 font-bold text-xs shrink-0 flex items-center gap-0.5">
                            ★ <span className="text-slate-800 font-medium text-[10px]">{shop.rating}</span>
                          </div>
                        </div>

                        {/* Core Sub-text Details - Only simple clean text metadata lines below header */}
                        <div className="space-y-1 text-[11px] text-slate-500 font-normal">
                          <div className="line-clamp-1">{shop.address}</div>
                          <div>Hours: {shop.workingHours || "08:00 - 18:00"}</div>
                        </div>
                      </div>
                    </div>

                    {/* Footer: Base Cost + Unified CTA Button */}
                    <div className="p-4 pt-0 mt-auto flex items-center justify-between">
                      <div className="text-sm font-extrabold text-[#8B0000] font-mono">
                        €{shop.hasStorage ? 90 : 60}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveBookingShop(shop);
                          setBookingFormData(prev => ({
                            ...prev,
                            service: shop.services[0] || 'tire change'
                          }));
                        }}
                        className="bg-[#8B0000] text-white font-bold text-[10px] px-3.5 py-2 rounded-[6px] shadow-[0_4px_6px_-1px_rgba(153,0,0,0.3),inset_0_-1px_0_rgba(0,0,0,0.15)] hover:bg-[#4A4A4A] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider"
                      >
                        Book Now
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

            )}

            {/* 4. MID-PAGE CTA: seasonal tire hotel vault */}
            <div className="bg-gradient-to-br from-slate-900 to-[#8B0000] text-white rounded-3xl p-6 sm:p-8 shadow-xl text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
              <div className="absolute bottom-[-20%] right-[-5%] opacity-10 pointer-events-none text-9xl font-black italic tracking-widest text-white select-none">
                HOTEL
              </div>
              <div className="space-y-2 relative z-10">
                <span className="bg-red-650 text-white font-mono font-bold text-[9.5px] px-2.5 py-0.5 rounded-md uppercase tracking-wider">Tyre Hotel Seasonal Special</span>
                <h3 className="text-xl font-black text-white tracking-tight leading-snug">
                  Store your seasonal tires with a local shop
                </h3>
                <p className="text-slate-400 text-xs max-w-xl font-medium">
                  Find tire storage providers offering climate-regulated security vaults. Keeps rubber compounds from aging, crack-free dry rot protection, fully insured.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowStorageModal(true);
                  setStorageSuccess(false);
                }}
                className="bg-[#B30000] hover:bg-[#4A4A4A] text-white px-6 py-3 rounded-lg text-xs font-bold transition-all duration-200 uppercase tracking-wider cursor-pointer shadow-sm shrink-0"
              >
                Find Tire Storage Providers
              </button>
            </div>

            {/* 5. BOTTOM: AI TIRE ASSISTANT COMPONENT */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs text-left space-y-6">
              
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-red-600 font-extrabold uppercase text-[10px] tracking-widest font-mono">
                  <Sparkles className="w-4 h-4 text-red-650 animate-spin-slow" />
                  <span>Cognitive Auto Specifications</span>
                </div>
                <h3 className="text-lg font-black text-slate-900 leading-tight">
                  AI Tire Assistant: Sizing & Load Resolver
                </h3>
                <p className="text-slate-500 text-xs max-w-xl font-semibold">
                  Not sure what tire size you need? Enter your exact vehicle model, brand configuration or trim index below, and our assistant will verify the manufacturer-certified dimensions.
                </p>
              </div>

              {/* Real Chat interaction boxes */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 h-72 overflow-y-auto space-y-3.5">
                {aiChatHistory.map((chat, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-3 max-w-[85%] ${
                      chat.sender === 'user' ? 'ml-auto justify-end flex-row-reverse' : 'mr-auto justify-start'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      chat.sender === 'user' ? 'bg-[#8B0000] text-white' : 'bg-red-50 text-red-650'
                    }`}>
                      {chat.sender === 'user' ? (
                        <span className="text-[10px] font-bold">ME</span>
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <div className={`p-3 rounded-2xl text-xs space-y-1 block ${
                      chat.sender === 'user'
                        ? 'bg-[#8B0000] text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200/50 rounded-tl-none shadow-xs'
                    }`}>
                      <p className="leading-relaxed font-medium whitespace-pre-line">{chat.text}</p>
                    </div>
                  </div>
                ))}

                {aiIsTyping && (
                  <div className="flex gap-3 max-w-[80%] items-center mr-auto">
                    <div className="w-7 h-7 rounded-full bg-red-50 text-red-655 flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    </div>
                    <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none text-xs flex gap-1 items-center font-bold text-slate-400">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Preset recommendations helper & prompt input */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase font-mono mr-1">Tap Quick Queries:</span>
                  {[
                    'Tesla Model 3 2022 Sizing',
                    'BMW 3 Series (G20) AWD specs',
                    'Audi A6 Sedan 2020 sizing',
                    'Toyota RAV4 SUV Offroad sizing'
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleSendAiMessage(preset)}
                      className="bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-700 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiInputMessage}
                    onChange={(e) => setAiInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendAiMessage(aiInputMessage);
                    }}
                    placeholder="Ask about tyre load indices, runflats or sizing recommendations standard..."
                    className="flex-1 bg-white border border-slate-205 text-slate-900 text-xs font-bold rounded-xl px-4 py-3 focus:outline-hidden focus:ring-1 focus:ring-red-600 placeholder-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendAiMessage(aiInputMessage)}
                    className="bg-[#8B0000] hover:bg-neutral-900 hover:text-white text-white px-5 rounded-xl text-xs font-black transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
                  >
                    Send
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* MODAL DIALOGS AND RESERVATION SHEETS */}
      <AnimatePresence>
        
        {/* A. TIRE FITTING SLOT SCHEDULER */}
        {activeBookingShop && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs" onClick={() => setActiveBookingShop(null)}></div>
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[28px] border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden relative z-10 text-left"
            >
              <div className="bg-[#8B0000] text-white p-6 relative">
                <button
                  type="button"
                  onClick={() => setActiveBookingShop(null)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 mb-1.5">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <span className="text-[10px] font-mono font-black text-red-400 uppercase tracking-wider">Pneumatic Bay Reservation</span>
                </div>
                <h3 className="text-lg font-black tracking-tight">{activeBookingShop.name}</h3>
                <p className="text-white/70 text-xs mt-1">Guarantees high-speed dynamic balance check in under 30 minutes.</p>
              </div>

              {bookingSuccess ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto border border-emerald-100">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Pneumatic Fitting Slot Locked!</h4>
                    <p className="text-slate-500 text-xs mt-1">We have allocated standard storage codes. Direct notifications sent via your footwearsandcares@gmail.com account.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveBookingShop(null)}
                    className="w-full bg-[#8B0000] text-white hover:bg-neutral-800 py-3 rounded-xl text-xs font-bold uppercase transition-all"
                  >
                    Dismiss Sheet
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingConfirmSubmission} className="p-6 space-y-4">
                  
                  <div>
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Target Service</label>
                    <select
                      value={bookingFormData.service}
                      onChange={(e) => setBookingFormData({...bookingFormData, service: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-205 text-slate-800 text-xs font-bold rounded-lg px-2.5 py-2.5 cursor-pointer"
                    >
                      {activeBookingShop.services.map(s => (
                        <option key={s} value={s}>{s.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Reservation Date</label>
                      <input
                        type="date"
                        value={bookingFormData.date}
                        onChange={(e) => setBookingFormData({...bookingFormData, date: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-205 text-slate-800 text-xs font-bold rounded-lg px-2.5 py-2"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Preferred Hour</label>
                      <input
                        type="time"
                        value={bookingFormData.time}
                        onChange={(e) => setBookingFormData({...bookingFormData, time: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-205 text-slate-800 text-xs font-bold rounded-lg px-2.5 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Tire Size Specification</label>
                    <input
                      type="text"
                      value={bookingFormData.tireSize}
                      onChange={(e) => setBookingFormData({...bookingFormData, tireSize: e.target.value})}
                      placeholder="e.g. 225/45 R17"
                      className="w-full bg-slate-50 border border-slate-205 text-slate-800 text-xs font-bold rounded-lg px-2.5 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Will you bring own tires?</label>
                    <div className="grid grid-cols-2 gap-3 mt-1 text-xs">
                      <label className="flex items-center gap-2 bg-slate-50 border border-slate-205 rounded-lg p-2 cursor-pointer hover:bg-slate-100 font-bold">
                        <input
                          type="radio"
                          name="bring_tires"
                          checked={bookingFormData.bringOwnTires === 'yes'}
                          onChange={() => setBookingFormData({...bookingFormData, bringOwnTires: 'yes'})}
                          className="accent-red-650"
                        />
                        <span>Yes, in boot</span>
                      </label>
                      <label className="flex items-center gap-2 bg-slate-50 border border-slate-205 rounded-lg p-2 cursor-pointer hover:bg-slate-100 font-bold">
                        <input
                          type="radio"
                          name="bring_tires"
                          checked={bookingFormData.bringOwnTires === 'no'}
                          onChange={() => setBookingFormData({...bookingFormData, bringOwnTires: 'no'})}
                          className="accent-red-650"
                        />
                        <span>Buy from Shop</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Calibrations / Extra notes</label>
                    <textarea
                      value={bookingFormData.notes}
                      onChange={(e) => setBookingFormData({...bookingFormData, notes: e.target.value})}
                      placeholder="Specify runflat requests, center rings alignment or EV load specifications..."
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-205 text-slate-850 text-xs font-semibold rounded-lg px-2.5 py-2"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-3.5 rounded-xl uppercase tracking-wider font-mono shadow-md mt-2 transition-all active:scale-[0.98]"
                  >
                    Lock-in Fitting Slot
                  </button>

                </form>
              )}

            </motion.div>
          </div>
        )}

        {/* B. SEASONAL TYRE HOTEL VAULT QUOTE GENERATOR */}
        {showStorageModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xs" onClick={() => setShowStorageModal(false)}></div>

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[28px] border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden relative z-10 text-left"
            >
              <div className="bg-[#8B0000] text-[#ffffff] p-6 relative">
                <button
                  type="button"
                  onClick={() => setShowStorageModal(false)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 mb-1.5">
                  <Package className="w-4 h-4 text-red-500 animate-bounce" />
                  <span className="text-[10px] font-mono font-black text-red-400 uppercase tracking-widest text-[9.5px]">Climate Control Protection</span>
                </div>
                <h3 className="text-lg font-black tracking-tight">Request Seasonal Tyre Hotel Storage</h3>
                <p className="text-white/70 text-xs mt-1">Direct request dispatch to certified insured vaults in Vilnius.</p>
              </div>

              {storageSuccess ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto border border-emerald-100">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Hotel Quote Broadcast Out!</h4>
                    <p className="text-slate-500 text-xs mt-1">Nearest climate controlled storages are preparing standard quote packages for review.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowStorageModal(false)}
                    className="w-full bg-slate-900 text-white hover:bg-slate-800 py-3 rounded-xl text-xs font-bold uppercase transition-all"
                  >
                    Dismiss
                  </button>
                </div>
              ) : (
                <form onSubmit={handleStorageQuoteSubmission} className="p-6 space-y-4">
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Number of Tires</label>
                      <select
                        value={storageForm.numTires}
                        onChange={(e) => setStorageForm({...storageForm, numTires: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-205 text-slate-850 text-xs font-semibold rounded-lg px-2.5 py-2 cursor-pointer"
                      >
                        <option value="2">2 Tires (Motorbike / Axle)</option>
                        <option value="4">4 Tires (Fullset)</option>
                        <option value="8">8 Tires (Dual set)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Wheel Rims Included?</label>
                      <select
                        value={storageForm.rimsIncluded}
                        onChange={(e) => setStorageForm({...storageForm, rimsIncluded: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-205 text-slate-850 text-xs font-semibold rounded-lg px-2.5 py-2 cursor-pointer"
                      >
                        <option value="yes">Yes (With Alloy Rims)</option>
                        <option value="no">No (Rubber Only)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Approx Rim Size</label>
                      <select
                        value={storageForm.sizeType}
                        onChange={(e) => setStorageForm({...storageForm, sizeType: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-205 text-slate-850 text-xs font-semibold rounded-lg px-2.5 py-2 cursor-pointer"
                      >
                        <option value="15-16 Inch">15 - 16 Inch</option>
                        <option value="17-18 Inch">17 - 18 Inch</option>
                        <option value="19-21 Inch">19 - 21 Inch</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Duration Expected</label>
                      <select
                        value={storageForm.months}
                        onChange={(e) => setStorageForm({...storageForm, months: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-205 text-slate-850 text-xs font-semibold rounded-lg px-2.5 py-2 cursor-pointer"
                      >
                        <option value="6">6 Months (Seasonal swap)</option>
                        <option value="12">12 Months (Long term)</option>
                      </select>
                    </div>
                  </div>

                  <div className="h-[1px] bg-slate-100 my-2"></div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Your Name</label>
                      <input
                        type="text"
                        value={storageForm.clientName}
                        onChange={(e) => setStorageForm({...storageForm, clientName: e.target.value})}
                        placeholder="John"
                        className="w-full bg-slate-50 border border-slate-205 text-slate-850 text-xs font-semibold rounded-lg px-2.5 py-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase block mb-1">Cell Phone</label>
                      <input
                        type="text"
                        value={storageForm.clientPhone}
                        onChange={(e) => setStorageForm({...storageForm, clientPhone: e.target.value})}
                        placeholder="+370 ..."
                        className="w-full bg-slate-50 border border-slate-205 text-slate-850 text-xs font-semibold rounded-lg px-2.5 py-2"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-650 hover:bg-neutral-900 text-white font-extrabold text-xs py-3.5 rounded-xl uppercase tracking-wider font-mono shadow-md mt-3 cursor-pointer"
                  >
                    Broadcast Storage Request
                  </button>

                </form>
              )}

            </motion.div>
          </div>
        )}

      </AnimatePresence>

    </div>
  );
}

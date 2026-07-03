import React, { useState, useMemo, useRef } from 'react';
import { 
  ShieldCheck, MapPin, Grid, Map as MapIcon, Sliders, X, Star, Calendar, 
  Phone, Clock, Search, HelpCircle, ArrowRight, Check, Compass,
  MessageSquare, Send, Zap, Trash2, Info, ChevronRight, DollarSign,
  Droplets, Shield, AlertTriangle, CheckCircle, Truck, Car, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Interfaces for Rust Protection Specialists
interface RustSpecialist {
  id: string;
  name: string;
  logo: string;
  image: string;
  rating: number;
  reviewsCount: number;
  distance: number; // km
  treatmentTypes: string[]; // rust prevention, underbody coating, corrosion treatment, rustproofing renewal
  vehicleTypes: string[]; // cars, trucks, commercial
  services: string[]; // Display tag services: e.g. "Underbody Coating", "Annual Treatment Plans"
  availability: 'open_now' | 'today' | 'this_week';
  address: string;
  phone: string;
  hours: string;
  featuredTag?: string;
  minPrice: number;
}

const RUST_SPECIALISTS: RustSpecialist[] = [
  {
    id: 'rust-1',
    name: 'Baltic RustShield Pro Labs',
    logo: '🛡️',
    image: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    reviewsCount: 184,
    distance: 1.2,
    treatmentTypes: ['rust prevention', 'underbody coating', 'corrosion treatment'],
    vehicleTypes: ['cars', 'trucks', 'commercial'],
    services: ['Underbody Coating', 'Annual Treatment Plans', 'Cavity Waxing', 'Chassis Sandblasting'],
    availability: 'open_now',
    address: 'Savanorių pr. 178F, Vilnius 03154',
    phone: '+370 5 219 9922',
    hours: '08:00 - 18:00',
    featuredTag: 'Certified Dinitrol® Center',
    minPrice: 150
  },
  {
    id: 'rust-2',
    name: 'Undercoat Wizards & Cavity Wax',
    logo: '⚡',
    image: 'https://images.unsplash.com/photo-1520116468816-95b69f847357?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    reviewsCount: 142,
    distance: 2.5,
    treatmentTypes: ['underbody coating', 'rustproofing renewal', 'rust prevention'],
    vehicleTypes: ['cars', 'trucks'],
    services: ['Underbody Coating', 'Annual Treatment Plans', 'Wheel Arch Protection'],
    availability: 'today',
    address: 'Verkių g. 34B, Vilnius 08221',
    phone: '+370 6 921 5566',
    hours: '08:30 - 19:00',
    featuredTag: 'Krown® System Approved',
    minPrice: 120
  },
  {
    id: 'rust-3',
    name: 'Vytis Heavy Corrosion Labs',
    logo: '⚙️',
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=600',
    rating: 5.0,
    reviewsCount: 96,
    distance: 3.8,
    treatmentTypes: ['corrosion treatment', 'underbody coating', 'rustproofing renewal'],
    vehicleTypes: ['trucks', 'commercial'],
    services: ['Underbody Coating', 'Rust Descaling', 'Heavy Frame Armor', 'Chemical Protection'],
    availability: 'this_week',
    address: 'Gariūnų g. 49, Vilnius 02244',
    phone: '+370 5 233 8811',
    hours: '09:00 - 17:30',
    featuredTag: 'Heavy-Duty Specialists',
    minPrice: 280
  },
  {
    id: 'rust-4',
    name: 'Nordic Zinc & Protective Coatings',
    logo: '🧪',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    reviewsCount: 68,
    distance: 4.9,
    treatmentTypes: ['rust prevention', 'corrosion treatment', 'rustproofing renewal'],
    vehicleTypes: ['cars', 'commercial'],
    services: ['Annual Treatment Plans', 'Polyurethane Eco Coating', 'Sills Spraying'],
    availability: 'open_now',
    address: 'Liepkalnio g. 112, Vilnius 02120',
    phone: '+370 6 112 3344',
    hours: '08:00 - 17:00',
    featuredTag: 'Solvent-Free Eco Seals',
    minPrice: 160
  },
  {
    id: 'rust-5',
    name: 'Gediminas Retro Restoration & Wax',
    logo: '👑',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    reviewsCount: 53,
    distance: 5.3,
    treatmentTypes: ['rust prevention', 'corrosion treatment'],
    vehicleTypes: ['cars'],
    services: ['Waxoyl Custom Coats', 'Cavity Precision Wax', 'Chassis Restoration'],
    availability: 'this_week',
    address: 'Nemenčinės pl. 14, Vilnius 10103',
    phone: '+370 5 244 5533',
    hours: '10:00 - 18:00',
    featuredTag: 'Classic Car Specialists',
    minPrice: 200
  }
];

export default function RustProtectionSection() {
  // Navigation & Location
  const [mapMode, setMapMode] = useState<boolean>(false);
  const [searchCity, setSearchCity] = useState<string>('Vilnius, Lithuania');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtering System
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Sorting Option
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'reviews' | 'price'>('distance');

  // Booking Modal States
  const [selectedShopForBooking, setSelectedShopForBooking] = useState<RustSpecialist | null>(null);
  const [bookingFormData, setBookingFormData] = useState({
    name: '',
    phone: '',
    carMake: '',
    carModel: '',
    vehicleType: 'cars',
    treatmentType: 'underbody coating',
    preferredDate: '2026-06-25',
    preferredTime: '09:00',
    notes: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Quick Instant RFQ Dialogue State
  const [showRfqModal, setShowRfqModal] = useState<boolean>(false);
  const [rfqFormData, setRfqFormData] = useState({
    carPlate: '',
    carMake: '',
    carModel: '',
    vehicleType: 'cars',
    currentRustStatus: 'minor_surface', // minor_surface, deep_corrosion, clean_preventative
    clientContact: '',
    clientPhone: '',
    additionalDetails: ''
  });
  const [rfqSuccess, setRfqSuccess] = useState<boolean>(false);

  // AI Climate & Usage Calculator States
  const [cacClimate, setCacClimate] = useState<string>('baltic_winters'); // baltic_winters, salt_coastal, humid_rainy, dry_arid
  const [cacUsage, setCacUsage] = useState<string>('daily_commute'); // daily_commute, off_roading, garaged_classic, heavy_commercial
  const [cacResult, setCacResult] = useState<{
    intervalMonths: number;
    recommendedType: string;
    corrosionRisk: 'Critical' | 'High' | 'Medium' | 'Low';
    advice: string;
  } | null>({
    intervalMonths: 12,
    recommendedType: 'Complete Underbody Coating + Annual Cavity Wax Renewal',
    corrosionRisk: 'High',
    advice: 'Road salt used in cold Baltic winters forms an aggressive electrolyte on cold steel subframes. We strongly recommend a permanent polyurethane, bitumen, or thick wax coating annually or every 12 to 18 months.'
  });

  // Custom AI Interactive Chatbot
  const [customQuery, setCustomQuery] = useState<string>('');
  const [aiIsTyping, setAiIsTyping] = useState<boolean>(false);
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: "Hello! I am your Auto Rust & Corrosion Consultant. Ask me anything about rustproofing. For example: 'What is the difference between Krown and Dinitrol?', 'Do new cars need underbody treatments?', or 'How is sandblasting performed?'"
    }
  ]);

  // Handler for custom location override
  const handleGetCurrentLocation = () => {
    setSearchCity('Vilnius Antakalnis (Detected)');
    const notification = document.createElement('div');
    notification.className = "fixed bottom-24 left-1/2 -translate-x-1/2 z-[150] bg-red-650 text-white text-xs font-mono px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-red-500 animate-bounce";
    notification.innerHTML = "🎯 GPS Verified: Calibrated to nearest Baltic corrosion-shield centers";
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2500);
  };

  const resetAllFilters = () => {
    setSelectedTreatments([]);
    setSelectedVehicles([]);
    setSelectedAvailability('all');
    setMinRating(0);
    setSearchQuery('');
  };

  // Processing listing filters
  const filteredSpecialists = useMemo(() => {
    let list = [...RUST_SPECIALISTS];

    // Search query constraint
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(sp => 
        sp.name.toLowerCase().includes(q) || 
        sp.address.toLowerCase().includes(q) ||
        sp.services.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // Treatment type category constraint
    if (selectedTreatments.length > 0) {
      list = list.filter(sp => 
        selectedTreatments.some(treat => sp.treatmentTypes.includes(treat))
      );
    }

    // Vehicle type constraint
    if (selectedVehicles.length > 0) {
      list = list.filter(sp => 
        selectedVehicles.some(vt => sp.vehicleTypes.includes(vt))
      );
    }

    // Availability constraint
    if (selectedAvailability !== 'all') {
      list = list.filter(sp => sp.availability === selectedAvailability);
    }

    // Rating filter
    if (minRating > 0) {
      list = list.filter(sp => sp.rating >= minRating);
    }

    // Sorting block
    if (sortBy === 'distance') {
      list.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews') {
      list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else if (sortBy === 'price') {
      list.sort((a, b) => a.minPrice - b.minPrice);
    }

    return list;
  }, [searchQuery, selectedTreatments, selectedVehicles, selectedAvailability, minRating, sortBy]);

  // Handle Climate and Usage selection calculator
  const handleCalculateCorrosionInterval = () => {
    let interval = 24;
    let type = "Standard Protective Cavity Spray";
    let risk: 'Critical' | 'High' | 'Medium' | 'Low' = 'Medium';
    let advice = "";

    if (cacClimate === 'baltic_winters') {
      if (cacUsage === 'daily_commute') {
        interval = 12;
        type = "Heavy Duty Underbody Wax Coating + Annual Sills Renewal";
        risk = "High";
        advice = "With highly aggressive Baltic chemical salts and constant freezing moisture, daily drives will oxidize subframes exceptionally fast. We recommend annual checkups.";
      } else if (cacUsage === 'off_roading') {
        interval = 6;
        type = "Premium Bitumen Sealant / Polyurethane Underseal";
        risk = "Critical";
        advice = "Physical abrasion from gravel, mud, and river crossings scrapes away zinc layers instantly. Combined with salt, the metal experiences extreme fatigue. Treat or recoat before and after the winter season!";
      } else if (cacUsage === 'heavy_commercial') {
        interval = 12;
        type = "Full Galvanic Corrosion Protection + Frame Shield Coating";
        risk = "Critical";
        advice = "High payload trucks undergo continuous exposure. Direct structural damage can cause frame cracking or load failure. Regular undercarriage high-pressure flushing is critical.";
      } else {
        interval = 24;
        type = "Clear Paraffin-based Cavity Protector (Preserves Original Aesthetics)";
        risk = "Medium";
        advice = "Since the vehicle is garaged, simple touch-ups of structural welds and suspension arms with elastic fluid-film spray every 2 years is perfect.";
      }
    } else if (cacClimate === 'salt_coastal') {
      interval = cacUsage === 'off_roading' ? 12 : 18;
      type = "Krown® Electrostatic Active Moisture Repelling Oils";
      risk = cacUsage === 'daily_commute' ? 'High' : 'Medium';
      advice = "Airbound maritime salt fog penetrates unsealed subframe boxes, pillars, and door insides continuously. You need a self-healing oil barrier that is electrostatic and resists seawater wash-away.";
    } else if (cacClimate === 'humid_rainy') {
      interval = 24;
      type = "Multi-layer Epoxy Rust Primer & Polymer Shield";
      risk = "Medium";
      advice = "Constant water layer allows oxidation. While less aggressive than salted routes, stagnant ponding accelerates rust inside hollow panels unless drainage ports are kept clear of debris.";
    } else {
      // dry_arid
      interval = 36;
      type = "Dust-Resistant Paraffin Coat or Dry Chassis Shellac";
      risk = "Low";
      advice = "Dry heat significantly limits chemical oxidation. Main concern here is keeping fine dust sand particles from absorbing moisture during any cold overnight condensation. Renewal every 3 years works well.";
    }

    setCacResult({
      intervalMonths: interval,
      recommendedType: type,
      corrosionRisk: risk,
      advice
    });
  };

  // Submit AI message to system
  const handleCustomAiChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = customQuery.trim();
    if (!query) return;

    // Append to scrollable discussion logs
    setAiChatHistory(prev => [...prev, { sender: 'user', text: query }]);
    setCustomQuery('');
    setAiIsTyping(true);

    setTimeout(() => {
      setAiIsTyping(false);
      let reply = "";
      const q = query.toLowerCase();

      if (q.includes('krown') || q.includes('dinitrol') || q.includes('waxoyl') || q.includes('brand')) {
        reply = "Great question! **Krown** uses an active oil-based compound that is highly fluid and penetrates deeply into narrow pinholes, seams, and micro-cracks. It actually repels existing water molecules but does not block dirt completely and requires a repeat protocol **yearly** as it washes down over time. **Dinitrol®** and **Waxoyl**, conversely, form a robust, semi-hard elastic waxy/rubbery membrane that acts as an impermeable physical barrier. Dinitrol is ideal for structural sandblasting followed by a multi-year treatment shield, whereas Krown is excellent for newer vehicles that already have uncompromised factory welds.";
      } else if (q.includes('new car') || q.includes('factory') || q.includes('warranty')) {
        reply = "Many manufacturers apply simple electroplated zinc baths (galvanization) or lightweight chassis paint during production. However, to pass environmental weight metrics, they often omit heavy sub-protection on subframes, control arms, and rear cradles. Adding an eco-friendly clear paraffin or fluid-film protection on a brand new car ensures it stays clean for 5-7 years and protects your manufacture warranty parameters because it prevents surface pitting from gravel.";
      } else if (q.includes('sandblast') || q.includes('rust removal') || q.includes('existing') || q.includes('convert')) {
        reply = "Applying undercoats directly on top of loose, bubbling rust is a critical mistake—it traps humidity and causes deep metal decay out of sight. Pre-treatment is mandatory! First, loose scales must be physically chipped off, followed by **sandblasting (garnet/soda)** or intensive brushing. Then, a **tannic acid rust converter** is applied to convert the remaining iron oxide into a stable black organometallic protective layer before the thick polyurethane protective shield is vulcanized.";
      } else if (q.includes('price') || q.includes('cost') || q.includes('how much') || q.includes('euro')) {
        reply = "Chassis rustproofing ranges dynamically. A basic oil-drip protection (like Krown) for small hatchbacks starts at **€120 to €160** annually. A heavy-duty, commercial multi-day restoration—including exhaust disassembly, wheel-well liner removal, deep steam degreasing, sandblasting, dual-shield rust converting epoxy, and high-solid Waxoyl coating—ranges between **€350 to €850** depending on subframe size. But this can save you thousands in structural scrap failures when selling.";
      } else if (q.includes('time') || q.includes('how long')) {
        reply = "Deep rubber/bitumen applications require **24 to 48 hours** as they need steam washing, a 12-hour dry period, masking, and polymer cross-linking. On the other hand, active oil treatments require about **2 hours** inside the bay, followed by a slight 48-hour gravity drip window where we suggest parking on open streets rather than closed garages.";
      } else {
        reply = "To prevent chassis corrosion, our certified Baltic rustproofing laboratories recommend annual inspections of your sills and subframe welds. Be sure to flush undercarriages thoroughly with pure water after winter snowfalls to wash away road-salts before summer heat accelerates chemical reactions.";
      }

      setAiChatHistory(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 1100);
  };

  // Confirm booking
  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedShopForBooking(null);

      const notify = document.createElement('div');
      notify.className = "fixed bottom-10 right-10 z-[200] bg-red-650 text-white text-xs font-black px-6 py-4 rounded-2xl shadow-2xl border border-red-500 animate-slide-in";
      notify.innerHTML = `🛡️ <b>Treatment Reserved!</b> Your slot at ${selectedShopForBooking?.name} is locked in. We will prep diagnostic lifts for vehicle type: ${bookingFormData.vehicleType}.`;
      document.body.appendChild(notify);
      setTimeout(() => notify.remove(), 4500);
    }, 1200);
  };

  // Broadcast RFQ from mid CTA
  const handleConfirmRfqRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setRfqSuccess(true);
    setTimeout(() => {
      setRfqSuccess(false);
      setShowRfqModal(false);
      setRfqFormData({
        carPlate: '',
        carMake: '',
        carModel: '',
        vehicleType: 'cars',
        currentRustStatus: 'minor_surface',
        clientContact: '',
        clientPhone: '',
        additionalDetails: ''
      });

      const notify = document.createElement('div');
      notify.className = "fixed bottom-10 right-10 z-[200] bg-neutral-900 border border-neutral-800 text-white text-xs font-black px-6 py-4 rounded-2xl shadow-xl animate-bounce";
      notify.innerHTML = "✅ <b>Corrosion RFQ Broadcasted!</b> All 5 local rust specialists have received your coordinates and vehicle details. Expect customized quotes in your inbox.";
      document.body.appendChild(notify);
      setTimeout(() => notify.remove(), 5000);
    }, 1500);
  };

  // Map click handler simulation
  const handleMapMarkerClick = (shopName: string, minPrice: number) => {
    const alertDiv = document.createElement('div');
    alertDiv.className = "fixed bottom-10 right-10 z-[200] bg-white border-2 border-red-600 text-slate-800 text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in";
    alertDiv.innerHTML = `🛡️ <b>${shopName} Pin Intersected:</b> Premium chassis treatments starting at €${minPrice}. Open booking window verified!`;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3500);
  };

  return (
    <div id="rust-protection-section-container" className="bg-[#F5F5F7] min-h-screen text-slate-800 text-left font-sans leading-relaxed relative pb-28">

      {/* 1. HEADER SECTION */}
      <header id="rust-protection-header" className="bg-white border-b border-slate-200 py-8 md:py-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            
            {/* Title & Badge block */}
            <div className="space-y-2">
              <h1 id="landing-main-title" className="text-3xl font-bold tracking-tight text-slate-900 mt-1 font-sans">
                Find Rust Protection &amp; Underbody Treatment Specialists
              </h1>
            </div>

            {/* List vs Interactive Map Toggle buttons */}
            <div className="flex items-center shrink-0">
              <div id="map-mode-toggler-group" className="bg-white p-1 rounded-xl shadow-xs border border-slate-200/50 flex items-center gap-1">
                <button
                  id="btn-grid-mode"
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
                  id="btn-map-mode"
                  type="button"
                  onClick={() => setMapMode(true)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold tracking-tight transition-all duration-300 flex items-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5 ${
                    mapMode ? 'bg-[#8B0000] text-white shadow-sm hover:bg-[#4A4A4A]' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>Chassis Radar Map</span>
                </button>
              </div>
            </div>

          </div>

          {/* Location details input with GPS simulated lookup */}
          <div id="search-console-wrapper" className="mt-8 bg-slate-100 border border-slate-200 rounded-2xl p-3 max-w-full flex flex-col lg:flex-row items-center gap-3">
            
            <div className="relative w-full lg:w-80 shrink-0">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" />
              <input
                id="search-city-input"
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Enter city or district..."
                className="w-full bg-white text-slate-900 text-xs font-bold rounded-xl pl-10 pr-4 py-3 border border-slate-250 focus:outline-hidden focus:ring-1 focus:ring-red-600"
              />
            </div>
            
            <button
              id="btn-trigger-gps"
              type="button"
              onClick={handleGetCurrentLocation}
              className="w-full lg:w-auto bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-[11px] tracking-tight uppercase px-4 py-3 border border-slate-200 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Compass className="w-4 h-4 text-red-600" />
              <span>Verify Location GPS</span>
            </button>

            <div className="h-5 w-[1px] bg-slate-300 hidden lg:block"></div>

            {/* Keyword Search Field */}
            <div className="relative w-full flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                id="search-query-field"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keywords (e.g. Dinitrol, sandblast, wax, subframe, annual, sills)..."
                className="w-full bg-white text-slate-900 text-xs font-bold rounded-xl pl-9 pr-3 py-3 border border-slate-250 focus:outline-hidden focus:ring-1 focus:ring-red-600"
              />
            </div>

          </div>

        </div>
      </header>

      {/* CORE SPLIT SCREEN GRID AND SIDEBAR */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        
        {/* Mobile Sidebar filter overlay trigger */}
        <div className="flex md:hidden items-center justify-between mb-4 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-widest font-mono">Specialist Filter Parameters</span>
          <button
            id="mobile-filter-open-btn"
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
            
            <div className="bg-white md:bg-transparent w-80 md:w-auto h-full md:h-auto overflow-y-auto md:overflow-visible p-6 md:p-0 border-r border-slate-205 float-left md:float-none space-y-6">
              
              <div className="flex items-center justify-between md:hidden pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-950 font-extrabold text-xs uppercase font-mono">
                  <Sliders className="w-4 h-4 text-red-600" />
                  <span>Rustproofing Parameters</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-650 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filtering Cards wrapper */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6 shadow-xs text-left">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Sliders className="w-3.5 h-3.5 text-red-600" /> Filters
                  </span>
                  <button
                    id="btn-reset-filters"
                    type="button"
                    onClick={resetAllFilters}
                    className="text-[10px] text-red-600 hover:underline font-extrabold uppercase font-mono"
                  >
                    Clear All
                  </button>
                </div>

                {/* Treatment types checkboxes */}
                <div className="space-y-2.5 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <h4 className="font-extrabold text-slate-900 text-[10.5px] uppercase tracking-wider font-mono flex items-center gap-1 select-none">
                    <Shield className="w-3.5 h-3.5 text-red-600" />
                    <span>Treatment Type</span>
                  </h4>
                  <div className="space-y-2">
                    {[
                      { id: 'rust prevention', label: 'Rust Prevention' },
                      { id: 'underbody coating', label: 'Underbody Coating' },
                      { id: 'corrosion treatment', label: 'Corrosion Treatment' },
                      { id: 'rustproofing renewal', label: 'Rustproofing Renewal' }
                    ].map((treat) => {
                      const active = selectedTreatments.includes(treat.id);
                      return (
                        <label key={treat.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-950 select-none">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => {
                              setSelectedTreatments(prev => 
                                active ? prev.filter(item => item !== treat.id) : [...prev, treat.id]
                              );
                            }}
                            className="w-4 h-4 rounded-sm accent-red-600 cursor-pointer"
                          />
                          <span>{treat.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Vehicle types checkboxes */}
                <div className="space-y-2.5">
                  <h4 className="font-extrabold text-slate-900 text-[10.5px] uppercase tracking-wider font-mono flex items-center gap-1 select-none">
                    <Car className="w-3.5 h-3.5 text-red-600" />
                    <span>Vehicle Class</span>
                  </h4>
                  <div className="space-y-2">
                    {[
                      { id: 'cars', label: 'Standard Cars' },
                      { id: 'trucks', label: 'SUVs & Pickup Trucks' },
                      { id: 'commercial', label: 'Heavy Commercial Vans' }
                    ].map((vt) => {
                      const active = selectedVehicles.includes(vt.id);
                      return (
                        <label key={vt.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-950 select-none">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => {
                              setSelectedVehicles(prev => 
                                active ? prev.filter(item => item !== vt.id) : [...prev, vt.id]
                              );
                            }}
                            className="w-4 h-4 rounded-sm accent-red-600 cursor-pointer"
                          />
                          <span>{vt.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Bay Booking Availability slots */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-900 text-[10.5px] uppercase tracking-wider font-mono">Service Availability</h4>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: 'all', name: 'Show All Facilities' },
                      { id: 'open_now', name: 'Open Now' },
                      { id: 'today', name: 'Slots Open Today' },
                      { id: 'this_week', name: 'Slots Open This Week' }
                    ].map((avail) => (
                      <label key={avail.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="avail_rust"
                          checked={selectedAvailability === avail.id}
                          onChange={() => setSelectedAvailability(avail.id)}
                          className="w-4 h-4 accent-red-600 cursor-pointer"
                        />
                        <span>{avail.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating selection criteria */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-900 text-[10.5px] uppercase tracking-wider font-mono">Performance Rating</h4>
                  <div className="flex flex-col gap-2">
                    {[
                      { val: 0, label: 'All Ratings' },
                      { val: 4.9, label: '★ 4.9+ Outstanding' },
                      { val: 4.8, label: '★ 4.8+ Verified Pro' },
                      { val: 4.5, label: '★ 4.5+ Highly Approved' }
                    ].map((el) => (
                      <label key={el.val} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="rating_rust"
                          checked={minRating === el.val}
                          onChange={() => setMinRating(el.val)}
                          className="w-4 h-4 accent-red-600 cursor-pointer"
                        />
                        <span>{el.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* MAIN COLUMN CONTAINER */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Sorber dashboard and counter bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-2xs">
              <div>
                <span className="text-[10px] font-mono tracking-wider text-slate-400 block uppercase font-bold">Chassis Life Insurance</span>
                <span id="treatment-specialist-count" className="font-extrabold text-slate-950 text-xs">Showing {filteredSpecialists.length} protective treatment installations around {searchCity}</span>
              </div>

              <div className="flex items-center gap-2 font-sans">
                <span className="text-xs text-slate-400 font-bold uppercase font-mono tracking-wider shrink-0">Sort</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-lg px-2.5 py-1.5 cursor-pointer focus:outline-hidden"
                >
                  <option value="distance">Distance (Nearest First)</option>
                  <option value="rating">Rating (Highest First)</option>
                  <option value="reviews">Reviews Volume</option>
                  <option value="price">Starting Cost (Lowest First)</option>
                </select>
              </div>
            </div>

            {/* IF GRID MODE OR MAP MODE IS SELECTED */}
            {!mapMode ? (
              
              /* RENDER HIGH FREQUENCY DETAILED GRID OF OPERATORS */
              <div id="rust-specialists-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence mode="popLayout">
                  {filteredSpecialists.map((sp) => (
                    <motion.div
                      layout
                      key={sp.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="bg-[#FFFFFF] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between border border-slate-100"
                    >
                      <div className="cursor-pointer" onClick={() => {
                        setSelectedShopForBooking(sp);
                      }}>
                        {/* Polished flat rectangular showcase image block on top — completely clean */}
                        <div className="w-full h-40 overflow-hidden relative">
                          <img
                            src={sp.image}
                            alt={sp.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Typography Block */}
                        <div className="p-4 space-y-2">
                          <div className="flex justify-between items-start gap-1">
                            <h3 className="font-sans font-bold text-slate-900 text-sm tracking-tight leading-tight line-clamp-2">
                              {sp.name}
                            </h3>
                            <div className="text-amber-500 font-bold text-xs shrink-0 flex items-center gap-0.5">
                              ★ <span className="text-slate-800 font-medium text-[10px]">{sp.rating}</span>
                            </div>
                          </div>

                          {/* Core Sub-text Details - Only simple clean text metadata lines below header */}
                          <div className="space-y-1 text-[11px] text-slate-500 font-normal">
                            <div className="line-clamp-1">{sp.address}</div>
                            <div>Hours: {sp.hours || "08:00 - 18:00"}</div>
                          </div>
                        </div>
                      </div>

                      {/* Footer: Base Cost + Unified CTA Button */}
                      <div className="p-4 pt-0 mt-auto flex items-center justify-between">
                        <div className="text-sm font-extrabold text-[#8B0000] font-mono">
                          €{sp.minPrice}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedShopForBooking(sp);
                            setBookingFormData(prev => ({
                              ...prev,
                              carMake: '',
                              carModel: '',
                              notes: ''
                            }));
                          }}
                          className="bg-[#8B0000] text-white font-bold text-[10px] px-3.5 py-2 rounded-[6px] shadow-[0_4px_6px_-1px_rgba(153,0,0,0.3),inset_0_-1px_0_rgba(0,0,0,0.15)] hover:bg-[#4A4A4A] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider"
                        >
                          Book Now
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredSpecialists.length === 0 && (
                  <div className="col-span-1 md:col-span-2 py-16 text-center space-y-3 bg-white border border-slate-250 rounded-3xl">
                    <AlertCircle className="w-8 h-8 text-slate-300 mx-auto animate-bounce" />
                    <h4 className="font-extrabold text-slate-900 text-sm">No specialists match your corrosion filters</h4>
                    <p className="text-slate-400 text-xs max-w-sm mx-auto">Try checking 'All Ratings' or disabling specific vehicle metrics to find further centers.</p>
                    <button onClick={resetAllFilters} className="text-xs text-red-650 font-bold underline cursor-pointer">Reset All Filters</button>
                  </div>
                )}
              </div>

            ) : (

              /* INTERACTIVE RADAR MAP SIMULATED GRAPHICS */
              <div id="radar-chassis-map" className="bg-zinc-900 rounded-3xl h-[490px] relative overflow-hidden border border-zinc-800 shadow-xl">
                
                {/* Grid matrix overlay */}
                <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#ffffff_2px,transparent_1px)] [background-size:20px_20px] bg-zinc-950">
                  <div className="absolute inset-x-0 top-1/3 h-[1px] bg-zinc-805"></div>
                  <div className="absolute inset-y-0 left-1/2 w-[1px] bg-zinc-805"></div>
                  <div className="absolute inset-x-0 top-3/4 h-[1px] bg-zinc-805"></div>
                </div>

                {/* Salt hazard caution zone overlay */}
                <div className="absolute bottom-10 left-10 w-44 h-44 rounded-full bg-red-900/10 blur-2xl"></div>

                {/* Map legends pane */}
                <div className="absolute top-5 left-5 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-zinc-850 text-left text-white z-20 space-y-1.5 max-w-xs">
                  <div className="flex items-center gap-1 text-red-500 font-extrabold text-[9px] uppercase tracking-widest font-mono">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Zinc Deposition Active Radar</span>
                  </div>
                  <h4 className="text-xs font-black">Underbody Service Zones</h4>
                  <p className="text-[10px] text-zinc-400">Click individual red pin coordinates to inspect subframe steam lifts status & reserve immediate slots.</p>
                </div>

                {/* Dynamically mapped pins from structured state */}
                {filteredSpecialists.map((sp, idx) => {
                  const locations = [
                    { top: '30%', left: '25%' },
                    { top: '55%', left: '60%' },
                    { top: '80%', left: '42%' },
                    { top: '25%', left: '78%' },
                    { top: '65%', left: '15%' }
                  ];
                  const pos = locations[idx % locations.length];

                  return (
                    <button
                      type="button"
                      key={sp.id}
                      onClick={() => handleMapMarkerClick(sp.name, sp.minPrice)}
                      style={{ top: pos.top, left: pos.left }}
                      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                    >
                      <div className="relative flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-red-650 opacity-70"></span>
                        
                        <div className="relative bg-white hover:bg-neutral-50 border-2 border-red-650 text-slate-900 px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 transition-transform group-hover:scale-105 text-left">
                          <span className="text-sm">{sp.logo}</span>
                          <div>
                            <p className="text-[9.5px] font-black text-[#8B0000] leading-none uppercase">{sp.name.split(' ')[0]}</p>
                            <p className="text-[8.5px] text-red-600 font-black font-mono mt-0.5">Starting €{sp.minPrice} • ★ {sp.rating}</p>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}

                {/* Map projection standards info tag */}
                <span className="absolute bottom-4 right-4 bg-black/65 backdrop-blur-xs border border-zinc-800 text-[9px] font-bold text-zinc-500 uppercase tracking-widest px-2 py-1 rounded-sm font-mono">
                  Dinitrol Shield Projection • 12.000 Scale WGS84
                </span>

              </div>

            )}

            {/* 3. MID-PAGE CTA WIDGET: "Protect your vehicle from corrosion — book a treatment near you." */}
            <div id="rust-middle-cta" className="relative bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm text-left overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-red-500/5 rounded-full blur-xl pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200/60 px-2.5 py-1 rounded-md text-[10px] font-bold text-red-700 tracking-wider uppercase font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                    <span>Corrosion Risk Prevention Clause</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-[#8B0000] tracking-tight leading-snug">
                    Protect your vehicle from corrosion — book a treatment near you.
                  </h2>
                  <p className="text-xs text-slate-500 max-w-xl font-medium">
                    Do not wait for structural fail tags on safety inspections. Transmit vehicle details once to receive instant competitive options from all authorized Dinitrol & Krown hubs in your district.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    id="btn-trigger-rfq-wizard"
                    type="button"
                    onClick={() => setShowRfqModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-widest font-mono px-6 py-3.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                  >
                    <span>Get Free Proposals</span>
                    <ArrowRight className="w-4 h-4 ml-0.5 whitespace-nowrap" />
                  </button>
                </div>
              </div>
            </div>

            {/* 4. AI CLIMATE & VEHICLE USAGE CALCULATOR CARD */}
            <div id="ai-usage-calculator" className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs text-left">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-6 bg-red-600 rounded-lg"></div>
                <h3 className="text-lg font-black tracking-tight text-slate-900 uppercase font-mono text-[13.5px] tracking-wider text-red-600">
                  ⚡ Static Corrosion Risk Estimator
                </h3>
              </div>

              <p className="text-xs text-slate-400 font-bold mb-6">
                Map your climate ecosystem & drive frequency to determine when to schedule a renewal.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Input selection box */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-black text-slate-800 uppercase tracking-wider font-mono">Climate Zone / Environment</label>
                    <select
                      value={cacClimate}
                      onChange={(e) => setCacClimate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-950 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-hidden"
                    >
                      <option value="baltic_winters">Baltic Winters (Aggressive Road Chemical Salts & Slush)</option>
                      <option value="salt_coastal">Coastal/Oceanic (Salty Maritime Air & Mist)</option>
                      <option value="humid_rainy">Sub-humid / Frequent Rain (Mud & Puddle Ponding)</option>
                      <option value="dry_arid">Warm/Arid/Dust (Dry dusty desert & dust storms)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-black text-slate-800 uppercase tracking-wider font-mono">Vehicle Use & Activity Profiler</label>
                    <select
                      value={cacUsage}
                      onChange={(e) => setCacUsage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-950 text-xs font-bold px-3 py-2.5 rounded-xl focus:outline-hidden"
                    >
                      <option value="daily_commute">Daily Commuter (Parks outdoors, drives on treated expressways)</option>
                      <option value="off_roading">Off-Road Activist (Frequent gravel pitting, mud terrain, forest routes)</option>
                      <option value="heavy_commercial">Heavy Commercial / Contractor (Constant heavy hauling, salt zones exposure)</option>
                      <option value="garaged_classic">Collector / Garaged Classic (Rare wet drives, dry-preserved inside box)</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleCalculateCorrosionInterval}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-[11px] tracking-wider uppercase font-mono py-3 rounded-xl transition-all cursor-pointer shadow-2xs"
                  >
                    Compute Corrosion Lifespan Log
                  </button>
                </div>

                {/* Results Screen */}
                <div className="bg-red-50/50 rounded-2xl border border-red-100 p-5 flex flex-col justify-between">
                  {cacResult ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-red-600 tracking-widest uppercase font-mono">Corrosion Risk Score</span>
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          cacResult.corrosionRisk === 'Critical' ? 'bg-red-100 text-red-800 border border-red-200' :
                          cacResult.corrosionRisk === 'High' ? 'bg-orange-100 text-orange-850 border border-orange-200' :
                          cacResult.corrosionRisk === 'Medium' ? 'bg-yellow-104 text-yellow-850 border border-yellow-205' :
                          'bg-emerald-50 text-emerald-800 border border-emerald-100'
                        }`}>
                          🚨 {cacResult.corrosionRisk} Risk
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10.5px] font-bold text-slate-500 block">Recommended Recoating Frequency:</span>
                        <h4 className="text-xl font-extrabold text-slate-900">
                          Every <span className="text-red-600 font-black">{cacResult.intervalMonths} Months</span>
                        </h4>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10.5px] font-bold text-slate-500 block">Advised Treatment Target:</span>
                        <p className="text-xs font-extrabold text-slate-800 bg-white/80 p-2 rounded-lg border border-slate-100">{cacResult.recommendedType}</p>
                      </div>

                      <div className="pt-2 border-t border-red-105 text-[11.5px] text-slate-600 leading-relaxed italic">
                        {cacResult.advice}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 font-bold m-auto">Click computational trigger to inspect diagnostic risk profiles.</p>
                  )}
                </div>

              </div>
            </div>

            {/* 5. BOTTOM ASYNC AI ASSISTANT: "Ask AI: Learn how often your vehicle needs rust protection based on climate and usage." */}
            <div id="rust-ai-assistant-terminal" className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 border border-neutral-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-44 h-44 bg-zinc-700/10 rounded-full blur-2xl pointer-events-none"></div>

              {/* Header Title with Custom AI identifier labels */}
              <div className="flex items-center gap-3 border-b border-neutral-800 pb-4 mb-6">
                <div className="bg-red-600 p-2 rounded-xl text-white">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-left font-sans">
                  <h3 id="ai-assistant-label" className="text-sm font-black tracking-tight uppercase tracking-wider text-red-500 font-mono">
                    Ask AI: Auto Rust Protection Advisor
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">
                    Learn how often your vehicle needs rust protection based on climate and usage
                  </p>
                </div>
              </div>

              {/* Chat log displays */}
              <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-4 md:p-5 h-[280px] overflow-y-auto space-y-4 scrollbar-thin text-xs text-left font-mono">
                {aiChatHistory.map((item, idx) => (
                  <div key={idx} className={`flex ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3.5 rounded-2xl max-w-lg leading-relaxed ${
                      item.sender === 'user' 
                        ? 'bg-red-600 text-white rounded-tr-none' 
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none'
                    }`}>
                      <p className="font-extrabold uppercase text-[9px] text-[#ffffff55] mb-1 font-mono tracking-widest">
                        {item.sender === 'user' ? 'Client Request' : 'RustExpert_AI'}
                      </p>
                      <p className="font-sans text-xs">{item.text}</p>
                    </div>
                  </div>
                ))}

                {aiIsTyping && (
                  <div className="flex justify-start">
                    <div className="bg-zinc-900 border border-zinc-805 p-3.5 rounded-2xl rounded-tl-none flex items-center gap-1.5 font-bold">
                      <span className="w-1.5 h-1.5 bg-red-650 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-red-650 rounded-full animate-bounce delay-150"></span>
                      <span className="w-1.5 h-1.5 bg-red-650 rounded-full animate-bounce delay-300"></span>
                      <span className="text-[9.5px] text-zinc-550 lowercase tracking-widest font-mono">Simulating mechanical fatigue calculations...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Form trigger submission action */}
              <form onSubmit={handleCustomAiChatSubmit} className="mt-4 flex gap-2">
                <input
                  id="ai-custom-query-field"
                  type="text"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="Ask regarding: Waxoyl vs Krown, galvanic chassis paint, sandblasting depth, new car warranties..."
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-bold text-white px-4 py-3 focus:outline-hidden focus:ring-1 focus:ring-red-600 font-sans"
                />
                
                <button
                  id="btn-ai-submit"
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-widest font-mono px-5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask AI</span>
                </button>
              </form>

              {/* Sample Quick Questions badges */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider font-mono">Try common queries:</span>
                {[
                  "Waxoyl vs Krown?",
                  "Undercoating new cars?",
                  "Price for subframe sandblast?",
                  "How long does it take?"
                ].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => {
                      setCustomQuery(q);
                    }}
                    className="bg-zinc-950 hover:bg-zinc-800 text-zinc-350 text-[10.5px] font-bold px-3 py-1.5 rounded-lg border border-zinc-850 cursor-pointer text-xs"
                  >
                    {q}
                  </button>
                ))}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ==================================== MODAL 1: APPOINTMENT BAY BOOKING ==================================== */}
      <AnimatePresence>
        {selectedShopForBooking && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedShopForBooking(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            ></motion.div>

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative z-10 text-left overflow-hidden"
            >
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedShopForBooking.logo}</span>
                  <div className="text-left font-sans">
                    <h4 className="font-extrabold text-slate-900 text-sm leading-tight">{selectedShopForBooking.name}</h4>
                    <span className="text-[9.5px] text-red-600 font-bold font-mono uppercase tracking-wider">Reserve Treatment Lift</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedShopForBooking(null)}
                  className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Elements */}
              <form onSubmit={handleConfirmReservation} className="mt-4 space-y-4 font-sans text-xs">
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-500">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={bookingFormData.name}
                      onChange={(e) => setBookingFormData(p => ({ ...p, name: e.target.value }))}
                      placeholder="Gediminas P."
                      className="w-full bg-slate-55 border border-slate-200 text-slate-900 rounded-lg p-2 focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-500">Your Phone Contact</label>
                    <input
                      type="tel"
                      required
                      value={bookingFormData.phone}
                      onChange={(e) => setBookingFormData(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+370 612 34567"
                      className="w-full bg-slate-55 border border-slate-200 text-slate-900 rounded-lg p-2 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-500">Vehicle Maker & Model</label>
                    <input
                      type="text"
                      required
                      value={bookingFormData.carMake}
                      onChange={(e) => setBookingFormData(p => ({ ...p, carMake: e.target.value }))}
                      placeholder="e.g. Audi A6 C7"
                      className="w-full bg-slate-55 border border-slate-200 text-slate-900 rounded-lg p-2 focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-500">Vehicle Type Group</label>
                    <select
                      value={bookingFormData.vehicleType}
                      onChange={(e) => setBookingFormData(p => ({ ...p, vehicleType: e.target.value }))}
                      className="w-full bg-slate-55 border border-slate-200 text-slate-900 rounded-lg p-2 focus:outline-hidden font-bold"
                    >
                      <option value="cars">Standard Passenger Sedan / Hatchback</option>
                      <option value="trucks">SUV, Crossover or Pickup SUV</option>
                      <option value="commercial">Light/Heavy Cargo Commercial Van</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-500">Requested Treatment Scope</label>
                  <select
                    value={bookingFormData.treatmentType}
                    onChange={(e) => setBookingFormData(p => ({ ...p, treatmentType: e.target.value }))}
                    className="w-full bg-slate-55 border border-slate-200 text-slate-900 rounded-lg p-2 focus:outline-hidden font-bold"
                  >
                    <option value="underbody coating">Bitumen / Polyurethane Underbody Coating</option>
                    <option value="rust prevention">Antistatic Wax Barrier & Sills Cavities Coat</option>
                    <option value="corrosion treatment">Full Sandblast De-scaling + Converters + Wax Protection</option>
                    <option value="rustproofing renewal">Annual Inspection & Cavity Fluid Touch-ups</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-500">Preferred Date</label>
                    <input
                      type="date"
                      required
                      value={bookingFormData.preferredDate}
                      onChange={(e) => setBookingFormData(p => ({ ...p, preferredDate: e.target.value }))}
                      className="w-full bg-slate-55 border border-slate-200 text-slate-900 rounded-lg p-2 focus:outline-hidden font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-500">Preferred Lift Time</label>
                    <select
                      value={bookingFormData.preferredTime}
                      onChange={(e) => setBookingFormData(p => ({ ...p, preferredTime: e.target.value }))}
                      className="w-full bg-slate-55 border border-slate-200 text-slate-900 rounded-lg p-2 focus:outline-hidden font-bold"
                    >
                      <option value="08:00">08:00 AM (Early Dropoff)</option>
                      <option value="10:00">10:00 AM </option>
                      <option value="13:00">01:00 PM </option>
                      <option value="15:30">03:30 PM </option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-500">Additional Instructions / Rust Status</label>
                  <textarea
                    rows={2}
                    value={bookingFormData.notes}
                    onChange={(e) => setBookingFormData(p => ({ ...p, notes: e.target.value }))}
                    placeholder="E.g. Noticeable rust bubbles on rear subframe welds or driver door bottom edge..."
                    className="w-full bg-slate-55 border border-slate-200 text-slate-900 rounded-lg p-2 focus:outline-hidden"
                  ></textarea>
                </div>

                {/* Submitting guarantees */}
                <div className="bg-slate-50 border border-slate-105 p-2.5 rounded-xl flex items-center gap-1.5 leading-snug">
                  <Info className="w-4 h-4 text-slate-400 shrink-0" />
                  <p className="text-[10px] text-slate-400 font-bold">
                    Vehicle needs to sit dry for at least 12 hours post-waxing polymer application. Standard treatment frames range around €{selectedShopForBooking.minPrice}+ VAT.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-650 hover:bg-red-700 text-white font-extrabold py-3 rounded-xl uppercase tracking-wider font-mono shadow-md text-xs cursor-pointer"
                >
                  Confirm Bay Booking Slots
                </button>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================== MODAL 2: GET COMPETING INBOX QUOTES ==================================== */}
      <AnimatePresence>
        {showRfqModal && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRfqModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            ></motion.div>

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 shadow-2xl relative z-10 text-left overflow-hidden"
            >
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-105">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-red-600" />
                  <div className="text-left font-sans">
                    <h4 className="font-extrabold text-[#8B0000] text-sm">Chassis Protection RFP Broadcaster</h4>
                    <span className="text-[9px] text-red-600 font-black font-mono uppercase tracking-widest block">Compacting pricing quotes instantly</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowRfqModal(false)}
                  className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Data */}
              <form onSubmit={handleConfirmRfqRequest} className="mt-4 space-y-4 font-sans text-xs">
                
                <div className="space-y-1">
                  <label className="block font-bold text-slate-500">Your Vehicle License Plate (For safety logs lookup)</label>
                  <input
                    type="text"
                    required
                    value={rfqFormData.carPlate}
                    onChange={(e) => setRfqFormData(p => ({ ...p, carPlate: e.target.value.toUpperCase() }))}
                    placeholder="LHV 999"
                    className="w-full bg-slate-55 border border-slate-200 text-slate-900 rounded-lg p-2.5 font-extrabold font-mono text-[13px] tracking-widest text-center focus:outline-hidden uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-500">Car Maker & Model</label>
                    <input
                      type="text"
                      required
                      value={rfqFormData.carMake}
                      onChange={(e) => setRfqFormData(p => ({ ...p, carMake: e.target.value }))}
                      placeholder="Volkswagen Passat B8"
                      className="w-full bg-slate-55 border border-slate-200 text-slate-905 rounded-lg p-2 focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-500">Vehicle Class</label>
                    <select
                      value={rfqFormData.vehicleType}
                      onChange={(e) => setRfqFormData(p => ({ ...p, vehicleType: e.target.value }))}
                      className="w-full bg-slate-55 border border-slate-200 text-slate-905 rounded-lg p-2 focus:outline-hidden font-bold"
                    >
                      <option value="cars">Sedan / Avant Coupe</option>
                      <option value="trucks">SUV / Pickup 4x4 Jeep</option>
                      <option value="commercial">Transit Hauling Van</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-500">Current Undercarriage Oxidation Status</label>
                  <select
                    value={rfqFormData.currentRustStatus}
                    onChange={(e) => setRfqFormData(p => ({ ...p, currentRustStatus: e.target.value }))}
                    className="w-full bg-slate-55 border border-slate-200 text-slate-905 rounded-lg p-2 focus:outline-hidden font-bold"
                  >
                    <option value="clean_preventative">Clean metal (Preventative Waxproofing needed)</option>
                    <option value="minor_surface">Light surface rust spotting on rear axles & welds</option>
                    <option value="deep_corrosion">Severe flaking, subframe scaling or holes visible</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-500">Your Email / Contact Address</label>
                    <input
                      type="email"
                      required
                      value={rfqFormData.clientContact}
                      onChange={(e) => setRfqFormData(p => ({ ...p, clientContact: e.target.value }))}
                      placeholder="customer@inbox.lt"
                      className="w-full bg-slate-55 border border-slate-200 text-slate-905 rounded-lg p-2 focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-500">Mobile Phone</label>
                    <input
                      type="tel"
                      required
                      value={rfqFormData.clientPhone}
                      onChange={(e) => setRfqFormData(p => ({ ...p, clientPhone: e.target.value }))}
                      placeholder="+370 6000 1111"
                      className="w-full bg-slate-55 border border-slate-200 text-slate-905 rounded-lg p-2 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-500">Special Instructions / Sandblast Requests</label>
                  <textarea
                    rows={2}
                    value={rfqFormData.additionalDetails}
                    onChange={(e) => setRfqFormData(p => ({ ...p, additionalDetails: e.target.value }))}
                    placeholder="Let our technicians know if you require bumper off masking, specific resin shields, or sandblasting quote margins..."
                    className="w-full bg-slate-55 border border-slate-200 text-slate-905 rounded-lg p-2 focus:outline-hidden font-medium"
                  ></textarea>
                </div>

                <div className="bg-red-50 text-red-800 p-2.5 rounded-xl flex items-center gap-1.5 leading-snug border border-red-101 select-none">
                  <CheckCircle className="w-4 h-4 text-red-650 shrink-0" />
                  <p className="text-[10px] font-bold">
                    By broadcasting, you directly consent to partner specialists querying standard Baltic motor log indicators to identify original subframe assemblies.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 rounded-xl uppercase tracking-wider font-mono shadow-lg text-xs cursor-pointer"
                >
                  Broadcast Corrosion RFP
                </button>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

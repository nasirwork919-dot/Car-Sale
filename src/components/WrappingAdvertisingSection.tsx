import React, { useState, useMemo, useRef } from 'react';
import { 
  Layers, MapPin, Grid, Map as MapIcon, Sliders, X, Star, Calendar, 
  Phone, Clock, Search, HelpCircle, ShieldCheck, ArrowRight, Check,
  MessageSquare, Send, Zap, Trash2, Info, ChevronRight, DollarSign,
  Upload, Camera, Image as ImageIcon, AlertTriangle, FileText, CheckCircle,
  Paintbrush, Palette, Compass, Sparkles, Tag, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import UniversalSmartUpload from './UniversalSmartUpload';

// Structured Interface for Wrapping Specialists
interface WrappingSpecialist {
  id: string;
  name: string;
  logo: string;
  image: string; // Shop image
  portfolioImage: string; // Wrap Portfolio Preview
  rating: number;
  reviewsCount: number;
  distance: number; // km
  serviceTypes: string[]; // full wrap, partial wrap, advertising wraps, color change, paint protection film
  materials: string[]; // 3M, Avery Dennison, Oracal, Hexis, KPMF
  services: string[]; // Service tags, e.g. "Full Vehicle Wraps", "Fleet Branding"
  availability: 'open_now' | 'today' | 'this_week';
  address: string;
  phone: string;
  hours: string;
  featuredTag?: string;
  minPrice: number;
}

const WRAPPING_SPECIALISTS: WrappingSpecialist[] = [
  {
    id: 'wrap-1',
    name: 'DecalCraft Premium Wraps',
    logo: '🎨',
    image: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&q=80&w=600',
    portfolioImage: 'https://images.unsplash.com/photo-1611245329358-13d0143a5646?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    reviewsCount: 148,
    distance: 1.4,
    serviceTypes: ['full wrap', 'color change', 'paint protection film'],
    materials: ['3M', 'Avery Dennison'],
    services: ['Full Vehicle Wraps', 'Color Change', 'Self-Healing PPF'],
    availability: 'open_now',
    address: 'Švitrigailos g. 11A, Vilnius 03223',
    phone: '+370 5 214 4455',
    hours: '08:30 - 18:30',
    featuredTag: '3M Certified Endorsed',
    minPrice: 1200
  },
  {
    id: 'wrap-2',
    name: 'NeonFleet Advertising Decals',
    logo: '🚐',
    image: 'https://images.unsplash.com/photo-1520116468816-95b69f847357?auto=format&fit=crop&q=80&w=600',
    portfolioImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    reviewsCount: 92,
    distance: 2.7,
    serviceTypes: ['partial wrap', 'advertising wraps'],
    materials: ['Oracal', '3M'],
    services: ['Fleet Branding', 'Partial Business Wrap', 'Decal Placement'],
    availability: 'today',
    address: 'Savanorių pr. 124, Vilnius 03150',
    phone: '+370 6 550 1122',
    hours: '09:00 - 18:00',
    featuredTag: 'High-Volume Fleet King',
    minPrice: 450
  },
  {
    id: 'wrap-3',
    name: 'Chameleon Vinyl Studio',
    logo: '🦎',
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=600',
    portfolioImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=600',
    rating: 5.0,
    reviewsCount: 76,
    distance: 3.1,
    serviceTypes: ['full wrap', 'color change'],
    materials: ['KPMF', 'Avery Dennison', 'Hexis'],
    services: ['Satin & Matte Colors', 'Chrome Delete Accents', 'Custom Design Services'],
    availability: 'this_week',
    address: 'Verkių g. 29, Vilnius 09108',
    phone: '+370 6 777 8899',
    hours: '10:00 - 19:00',
    featuredTag: 'Championship Winning Wraps',
    minPrice: 1400
  },
  {
    id: 'wrap-4',
    name: 'ArmorShield Clear PPF Labs',
    logo: '🛡️',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600',
    portfolioImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    reviewsCount: 54,
    distance: 4.8,
    serviceTypes: ['paint protection film'],
    materials: ['3M', 'Hexis'],
    services: ['Self-Healing Clear PPF', 'High-Impact Rock Guard', 'Matte Paint Conversion'],
    availability: 'today',
    address: 'Gariūnų g. 71, Vilnius 02244',
    phone: '+370 5 233 9900',
    hours: '08:00 - 17:00',
    featuredTag: '10-Year Armor Warranty',
    minPrice: 900
  },
  {
    id: 'wrap-5',
    name: 'UrbanSign Decal Wizards',
    logo: '🖨️',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=600',
    portfolioImage: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=600',
    rating: 4.6,
    reviewsCount: 38,
    distance: 5.6,
    serviceTypes: ['partial wrap', 'advertising wraps'],
    materials: ['Oracal'],
    services: ['Promotional Lettering', 'Rear Window Decals', 'Temporary Event Branding'],
    availability: 'open_now',
    address: 'Liepkalnio g. 82, Vilnius 02120',
    phone: '+370 6 111 2233',
    hours: '08:30 - 17:30',
    minPrice: 200
  }
];

export default function WrappingAdvertisingSection() {
  // Navigation & Map mode toggles
  const [mapMode, setMapMode] = useState<boolean>(false);
  const [searchCity, setSearchCity] = useState<string>('Vilnius, Lithuania');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Siderbar filter states
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Sorting logic
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'reviews' | 'price'>('distance');

  // Booking states
  const [selectedShopForBooking, setSelectedShopForBooking] = useState<WrappingSpecialist | null>(null);
  const [bookingFormData, setBookingFormData] = useState({
    name: '',
    phone: '',
    carMake: '',
    carModel: '',
    wrapType: 'full wrap',
    materialBrand: '3M',
    preferredDate: '2026-06-22',
    preferredTime: '10:00',
    notes: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Quote Request (Create Repair Request repurposed as Custom Design/Wrap Request)
  const [showQuoteModal, setShowQuoteModal] = useState<boolean>(false);
  const [quoteFormData, setQuoteFormData] = useState({
    carPlate: '',
    carMake: '',
    carModel: '',
    wrapCoverage: 'full wrap', // full wrap, partial wrap, color change, ppf
    preferredFinish: 'satin_metallic', // satin_metallic, gloss_finish, matte_military, custom_graphics, clear_protective
    uploadedPhotoName: '',
    uploadedPhotoObj: null as string | null,
    clientContact: '',
    clientPhone: '',
    additionalDetails: ''
  });
  const [quoteSuccess, setQuoteSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Assistant states
  const [customQuery, setCustomQuery] = useState<string>('');
  const [aiIsTyping, setAiIsTyping] = useState<boolean>(false);
  const [selectedIdeaVehicle, setSelectedIdeaVehicle] = useState<string>('sedan');
  const [selectedIdeaType, setSelectedIdeaType] = useState<string>('satin_metallic');

  // AI Calculator Result
  const [aiResult, setAiResult] = useState<any | null>({
    ideas: [
      "Satin Liquid Copper (Avery Supreme) with metallic deep-bronze highlights.",
      "Stealth Matte Dark Gray (3M 2080) coupled with a full gloss black chrome-delete profile."
    ],
    estimatedPriceRange: "€1,200 - €1,700",
    timeRequired: "3 to 4 working days",
    durabilityExpectancy: "5 to 7 years (with UV-resistant ceramic aftercare coating)"
  });

  const [aiChatHistory, setAiChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: "Hi there! I am your AI Wrap & Vehicle Branding Consultant. Let me help you find the absolute best options for your project. Ask me about custom matte, satin metallic finishes, paint protection films (PPF), business fleet advertising costs, or durability in Baltic climates!"
    }
  ]);

  // Handler for custom GPS override
  const handleGetCurrentLocation = () => {
    setSearchCity('Vilnius Center (Detected)');
    const notification = document.createElement('div');
    notification.className = "fixed bottom-24 left-1/2 -translate-x-1/2 z-[150] bg-red-650 text-white text-xs font-mono px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-red-500 animate-bounce";
    notification.innerHTML = "🎯 GPS Synchronized: Corrected coordinates to nearest vinyl wrap application facilities";
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2500);
  };

  const resetAllFilters = () => {
    setSelectedServiceTypes([]);
    setSelectedMaterials([]);
    setSelectedAvailability('all');
    setMinRating(0);
    setSearchQuery('');
  };

  // Processing listing filters
  const filteredSpecialists = useMemo(() => {
    let list = [...WRAPPING_SPECIALISTS];

    // Search query constraint
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(sp => 
        sp.name.toLowerCase().includes(q) || 
        sp.address.toLowerCase().includes(q) ||
        sp.services.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // Service type filter
    if (selectedServiceTypes.length > 0) {
      list = list.filter(sp => 
        selectedServiceTypes.some(st => sp.serviceTypes.includes(st))
      );
    }

    // Material brand filter
    if (selectedMaterials.length > 0) {
      list = list.filter(sp => 
        selectedMaterials.some(mat => sp.materials.includes(mat))
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
  }, [searchQuery, selectedServiceTypes, selectedMaterials, selectedAvailability, minRating, sortBy]);

  // Photo handlers for custom quote wizard
  const handleQuotePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setQuoteFormData(prev => ({
        ...prev,
        uploadedPhotoName: file.name,
        uploadedPhotoObj: URL.createObjectURL(file)
      }));
    }
  };

  const handleSmartQuotePhotoUpload = (dataUrl: string, fileName: string) => {
    setQuoteFormData(prev => ({
      ...prev,
      uploadedPhotoName: fileName,
      uploadedPhotoObj: dataUrl
    }));
  };

  // Calculates custom ideas & prices based on input selectors
  const handleCalculateWrapIdea = () => {
    let ideas: string[] = [];
    let price = "€1,200 - €1,600";
    let days = "3 days";
    let durable = "5-7 years";

    if (selectedIdeaType === 'satin_metallic') {
      if (selectedIdeaVehicle === 'suv' || selectedIdeaVehicle === 'commercial') {
        ideas = [
          "Satin Black Metallic film coupled with a dual-coat ceramic defense barrier.",
          "Satin Liquid Copper complete with high-gloss metallic gray sports stripe overlays."
        ];
        price = selectedIdeaVehicle === 'commercial' ? "€1,900 - €2,600" : "€1,600 - €2,100";
        days = "4-5 working days";
      } else {
        ideas = [
          "Satin Imperial Red wrap matching gunmetal satin chrome wheel trim accents.",
          "Satin Ocean Turquoise with a sleek stealth black roof vinyl overlay."
        ];
        price = "€1,350 - €1,750";
        days = "3 working days";
      }
    } else if (selectedIdeaType === 'custom_graphics') {
      ideas = [
        "Full-coverage vector fleet advertising decals with non-fade UV laminate coating.",
        "Precision matte brand-message lettering featuring localized window-perf vinyl wraps."
      ];
      price = selectedIdeaVehicle === 'commercial' ? "€1,800 - €2,900" : "€800 - €1,500";
      days = "4 working days";
    } else if (selectedIdeaType === 'clear_protective') {
      ideas = [
        "Supa-Gloss Paint Protection Film (PPF) covering the front impact bumper, hood, and door edges.",
        "Entire exterior PPF wrap yielding active sun-heat thermal minor-scratch self-healing."
      ];
      price = selectedIdeaVehicle === 'suv' ? "€2,200 - €3,400" : "€1,800 - €2,600";
      days = "3 to 4 days";
      durable = "10 years premium warranty";
    } else {
      // gloss or colors
      ideas = [
        "High-gloss Porsche Chalk Gray film paired with pristine gloss black structural mirror caps.",
        "Deep British Racing Green gloss film featuring hand-wrapped interior door jamb seams."
      ];
      price = selectedIdeaVehicle === 'sedan' ? "€1,200 - €1,500" : "€1,500 - €1,850";
      days = "3 days";
    }

    setAiResult({
      ideas,
      estimatedPriceRange: price,
      timeRequired: days,
      durabilityExpectancy: durable
    });
  };

  // Submit AI message to conversational state simulation
  const handleCustomAiChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = customQuery.trim();
    if (!query) return;

    setAiChatHistory(prev => [...prev, { sender: 'user', text: query }]);
    setCustomQuery('');
    setAiIsTyping(true);

    setTimeout(() => {
      setAiIsTyping(false);
      let reply = "";
      const q = query.toLowerCase();

      if (q.includes('price') || q.includes('cost') || q.includes('how much') || q.includes('euro')) {
        reply = "Vinyl wrap pricing depends key-wise on vehicle surface size and the material compound used. A full wrap for standard sedans using prime grades like **3M Series 2080** or **Avery Dennison Supreme** usually starts at **€1,200 - €1,600**. For SUVs, expect **€1,500 - €2,100**. Partial advertising wraps, commercial van typography, or door lettering are much cheaper, starting between **€250 and €650**.";
      } else if (q.includes('ppf') || q.includes('protect') || q.includes('armor') || q.includes('stone')) {
        reply = "Paint Protection Film (PPF) is constructed of heavy, optically-clear **Thermoplastic Polyurethane (TPU)**. Unlike styling vinyl which is only 3 to 4 mils thick, PPF is up to 8 mils thick and features a self-healing top-coat that absorbs highway gravel impacts, tree sap, and key scratches! Standard practice is to protect either the front end (bumper, hood, mirrors) or wrap the complete car to shield factory paint completely.";
      } else if (q.includes('brand') || q.includes('3m') || q.includes('avery') || q.includes('oracal') || q.includes('material')) {
        reply = "We strongly advise sticking to tier-1 cast wrapping vinyls like **3M Series 2080**, **Avery Dennison Supreme Wrapping Film**, or **Oracal 970RA**. Cheap, unbranded monomeric calendered materials from web marketplaces look decent initially but will shrink, bubble around concave recess channels within 6 months, and can destroy your original clear coat when peeled off! Premium cast vinyl guarantees a clean 7-year failure-free warranty and leaves zero glue residue during removal.";
      } else if (q.includes('fleet') || q.includes('commercial') || q.includes('advertis') || q.includes('logo')) {
        reply = "Fleet branding using printable cast media (such as Avery MPI 1105) with non-fading protective laminates is our partner specialty! You can send us your corporate vector files (.AI, .PDF). Partial wraps combined with flat-cut vinyl lettering give amazing ROI, ensuring your service company has thousands of eyes inside Vilnius highways daily. We provide specialized multi-car discount programs!";
      } else if (q.includes('time') || q.includes('how long') || q.includes('cure')) {
        reply = "A flawless full wrap takes **3 to 4 working days**. Day 1 is dedicated to extreme decontamination washing, trim removal, and panel alcohol drying. Days 2 and 3 involve precision manual wrapping and heating. Day 4 is the post-heating phase where vinyl edges are locked at 90°C to lock memory. We recommend a 24-hour indoor rest period before high-speed drives!";
      } else {
        reply = "To maximize your vinyl wrap lifetime, always hand-wash your car using pH-neutral car wash soap. Avoid high-pressure steam blasters closer than 30cm to wrapped seams, and treat the vehicle with specialized vinyl-safe ceramic sealant sprays to block heavy UV sun oxidation.";
      }

      setAiChatHistory(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 1100);
  };

  // Booking submit response
  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedShopForBooking(null);

      const notify = document.createElement('div');
      notify.className = "fixed bottom-10 right-10 z-[200] bg-[#c10000] text-white text-xs font-black px-6 py-4 rounded-2xl shadow-2xl border border-red-500 animate-slide-in";
      notify.innerHTML = `🛡️ <b>Wrap Slot Secured!</b> Your booking at ${selectedShopForBooking?.name} of vinyl type: ${bookingFormData.wrapType} is confirmed.`;
      document.body.appendChild(notify);
      setTimeout(() => notify.remove(), 4500);
    }, 1200);
  };

  // RFQ submit response
  const handleConfirmRfqRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSuccess(true);
    setTimeout(() => {
      setQuoteSuccess(false);
      setShowQuoteModal(false);
      setQuoteFormData({
        carPlate: '',
        carMake: '',
        carModel: '',
        wrapCoverage: 'full wrap',
        preferredFinish: 'satin_metallic',
        uploadedPhotoName: '',
        uploadedPhotoObj: null,
        clientContact: '',
        clientPhone: '',
        additionalDetails: ''
      });

      const notify = document.createElement('div');
      notify.className = "fixed bottom-10 right-10 z-[200] bg-neutral-900 border border-neutral-850 text-white text-xs font-black px-6 py-4 rounded-2xl shadow-xl animate-bounce";
      notify.innerHTML = "✅ <b>Custom Quote Broadcasted!</b> Wrap parameters and uploaded reference ideas dispatched to local studios. Check your dashboard inbox shortly.";
      document.body.appendChild(notify);
      setTimeout(() => notify.remove(), 5000);
    }, 1500);
  };

  // Map pin intercept trigger simulation
  const handleMapMarkerClick = (shopName: string, minPrice: number) => {
    const alertDiv = document.createElement('div');
    alertDiv.className = "fixed bottom-10 right-10 z-[200] bg-white border-2 border-red-600 text-slate-800 text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in";
    alertDiv.innerHTML = `🛡️ <b>${shopName} Pin Selected:</b> High-quality graphics and solid wraps starting from €${minPrice}.`;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3550);
  };

  return (
    <div id="wrapping-section-container" className="bg-[#F5F5F7] min-h-screen text-slate-800 text-left font-sans leading-relaxed relative pb-28">

      {/* 1. HEADER SECTION */}
      <header id="wrapping-header" className="bg-white border-b-4 border-[#8B0000] py-8 md:py-10 shadow-3d-premium">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            
            {/* Title Block */}
            <div className="space-y-2">
              <h1 id="wrapping-main-title" className="text-3xl font-extrabold tracking-tight text-slate-900 mt-1 font-sans">
                Car Wrapping &amp; Design Shops
              </h1>
              <p className="text-sm text-zinc-500 font-medium">
                Find the best local shops for car wraps, paint protection, and business graphics.
              </p>
            </div>

            {/* List vs Radar Map toggles */}
            <div className="flex items-center shrink-0">
              <div id="map-mode-toggler-group" className="bg-zinc-100 p-1.5 rounded-xl border border-slate-200 flex items-center gap-1 shadow-inner">
                <button
                  id="btn-grid-mode"
                  type="button"
                  onClick={() => setMapMode(false)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold tracking-tight transition-all duration-300 flex items-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5 ${
                    !mapMode ? 'bg-[#8B0000] text-white shadow-md' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Grid List</span>
                </button>
                <button
                  id="btn-map-mode"
                  type="button"
                  onClick={() => setMapMode(true)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold tracking-tight transition-all duration-300 flex items-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5 ${
                    mapMode ? 'bg-[#8B0000] text-white shadow-md' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>Map View</span>
                </button>
              </div>
            </div>

          </div>

          {/* Quick Location & Keyword search bar */}
          <div id="search-console-wrapper" className="mt-8 bg-white border border-slate-200 rounded-2xl p-4 max-w-full flex flex-col lg:flex-row items-center gap-3 shadow-3d-premium">
            
            <div className="relative w-full lg:w-80 shrink-0">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B0000]" />
              <input
                id="search-city-input"
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Enter your city..."
                className="w-full bg-zinc-50 text-slate-900 text-xs font-bold rounded-xl pl-10 pr-4 py-3 border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-[#8B0000] transition-all"
              />
            </div>
            
            <button
              id="btn-trigger-gps"
              type="button"
              onClick={handleGetCurrentLocation}
              className="w-full lg:w-auto bg-[#8B0000] hover:bg-[#4A4A4A] text-white font-bold text-xs tracking-tight px-5 py-3 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-md"
            >
              <Compass className="w-4 h-4 text-white" />
              <span>Use Current GPS</span>
            </button>

            <div className="h-5 w-[1px] bg-slate-300 hidden lg:block"></div>

            {/* Keyword seek input */}
            <div className="relative w-full flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                id="search-query-field"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search wrap brands or types (e.g. 3M, Avery, Oracal, fleet, PPF, matte, custom)..."
                className="w-full bg-zinc-50 text-slate-900 text-xs font-bold rounded-xl pl-9 pr-3 py-3 border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-[#8B0000] transition-all"
              />
            </div>

          </div>

        </div>
      </header>

      {/* SPLIT COLUMN INTERFACES */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        
        {/* Mobile Filter Button */}
        <div className="flex md:hidden items-center justify-between mb-4 card-3d-tactile-neutral p-4">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Search Filters</span>
          <button
            id="mobile-filter-open-btn"
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="bg-[#8B0000] hover:bg-[#4A4A4A] text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Change Filters</span>
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
                <div className="flex items-center gap-2 text-slate-950 font-bold text-sm uppercase">
                  <Sliders className="w-4 h-4 text-[#8B0000]" />
                  <span>Search Filters</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filtering Cards Wrapper */}
              <div className="card-3d-tactile p-5 space-y-6 text-left">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-extrabold text-slate-850 text-xs uppercase tracking-wider flex items-center gap-1.5 font-sans">
                    <Sliders className="w-3.5 h-3.5 text-[#8B0000]" /> Filter Options
                  </span>
                  <button
                    id="btn-reset-filters"
                    type="button"
                    onClick={resetAllFilters}
                    className="text-[11px] text-[#8B0000] hover:underline font-bold uppercase"
                  >
                    Reset All
                  </button>
                </div>

                {/* Service type filter */}
                <div className="space-y-3 bg-zinc-50 p-3 rounded-xl border border-slate-200 shadow-inner">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 select-none">
                    <Palette className="w-3.5 h-3.5 text-[#8B0000]" />
                    <span>Wrap Service</span>
                  </h4>
                  <div className="space-y-2">
                    {[
                      { id: 'full wrap', label: 'Full Car Wrap' },
                      { id: 'partial wrap', label: 'Partial Wrap' },
                      { id: 'advertising wraps', label: 'Business Signs' },
                      { id: 'color change', label: 'Color Change' },
                      { id: 'paint protection film', label: 'Paint Protection (PPF)' }
                    ].map((st) => {
                      const active = selectedServiceTypes.includes(st.id);
                      return (
                        <label key={st.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-950 select-none">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => {
                              setSelectedServiceTypes(prev => 
                                active ? prev.filter(item => item !== st.id) : [...prev, st.id]
                              );
                            }}
                            className="w-4 h-4 rounded-sm accent-[#8B0000] cursor-pointer"
                          />
                          <span>{st.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Material Option Filter */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5 select-none">
                    <Tag className="w-3.5 h-3.5 text-[#8B0000]" />
                    <span>Vinyl Brands</span>
                  </h4>
                  <div className="space-y-2">
                    {[
                      { id: '3M', label: '3M Premium Film' },
                      { id: 'Avery Dennison', label: 'Avery Supreme' },
                      { id: 'Oracal', label: 'Oracal High-Grade' },
                      { id: 'Hexis', label: 'Hexis Cast Vinyl' },
                      { id: 'KPMF', label: 'KPMF Specialty Film' }
                    ].map((brand) => {
                      const active = selectedMaterials.includes(brand.id);
                      return (
                        <label key={brand.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-950 select-none">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => {
                              setSelectedMaterials(prev => 
                                active ? prev.filter(item => item !== brand.id) : [...prev, brand.id]
                              );
                            }}
                            className="w-4 h-4 rounded-sm accent-[#8B0000] cursor-pointer"
                          />
                          <span>{brand.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Availability filter */}
                <div className="space-y-3 pt-4 border-t border-slate-150">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">When are they free?</h4>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: 'all', name: 'Show All Shops' },
                      { id: 'open_now', name: 'Open Now' },
                      { id: 'today', name: 'Available Today' },
                      { id: 'this_week', name: 'Free This Week' }
                    ].map((avail) => (
                      <label key={avail.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="avail_wrap"
                          checked={selectedAvailability === avail.id}
                          onChange={() => setSelectedAvailability(avail.id)}
                          className="w-4 h-4 accent-[#8B0000] cursor-pointer"
                        />
                        <span>{avail.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating filter */}
                <div className="space-y-3 pt-4 border-t border-slate-150">
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Shop Rating</h4>
                  <div className="flex flex-col gap-2">
                    {[
                      { val: 0, label: 'All Ratings' },
                      { val: 4.9, label: '★ 4.9+ Top Rated' },
                      { val: 4.8, label: '★ 4.8+ Great Reviews' },
                      { val: 4.5, label: '★ 4.5+ Good Shops' }
                    ].map((el) => (
                      <label key={el.val} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="rating_wrap"
                          checked={minRating === el.val}
                          onChange={() => setMinRating(el.val)}
                          className="w-4 h-4 accent-[#8B0000] cursor-pointer"
                        />
                        <span>{el.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* MAIN GRID DISPLAY COLUMN */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Sorting control deck bar */}
            <div className="card-3d-tactile-neutral p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-slate-400 block uppercase">Premium Shops</span>
                <span id="wrapping-specialist-count" className="font-extrabold text-slate-900 text-sm">Found {filteredSpecialists.length} shops in {searchCity}</span>
              </div>

              <div className="flex items-center gap-2 font-sans">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider shrink-0">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-zinc-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-lg px-2.5 py-1.5 cursor-pointer focus:outline-hidden shadow-inner"
                >
                  <option value="distance">Nearest First</option>
                  <option value="rating">Best Rating</option>
                  <option value="reviews">Most Reviews</option>
                  <option value="price">Price (Low to High)</option>
                </select>
              </div>
            </div>

            {/* Grid listing vs Simulated interactive radar map of vinyl studios */}
            {!mapMode ? (
              
              /* RENDER HIGH FIDELITY PROFESSIONAL LIST CONSTELLATION */
              <div id="wrapping-specialists-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence mode="popLayout">
                  {filteredSpecialists.map((sp) => (
                    <motion.div
                      layout
                      key={sp.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="card-3d-tactile-neutral overflow-hidden flex flex-col justify-between"
                    >
                      <div className="cursor-pointer" onClick={() => {
                        setSelectedShopForBooking(sp);
                      }}>
                        {/* Polished flat rectangular showcase image block on top */}
                        <div className="w-full h-40 overflow-hidden relative border-b border-slate-100">
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
                              ★ <span className="text-slate-800 font-semibold text-[10px]">{sp.rating}</span>
                            </div>
                          </div>

                          {/* Core Sub-text Details */}
                          <div className="space-y-1 text-[11px] text-slate-500 font-normal">
                            <div className="line-clamp-1">{sp.address}</div>
                            <div>Open: {sp.hours || "08:00 - 18:00"}</div>
                          </div>
                        </div>
                      </div>

                      {/* Footer: Base Cost + Unified CTA Button */}
                      <div className="p-4 pt-0 mt-auto flex items-center justify-between">
                        <div className="text-sm font-extrabold text-[#8B0000] font-mono">
                          from €{sp.minPrice}
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
                          className="btn-3d-red text-[10px] px-3.5 py-2 uppercase tracking-wider"
                        >
                          Book Now
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredSpecialists.length === 0 && (
                  <div className="col-span-1 md:col-span-2 py-16 text-center space-y-3 bg-white border border-slate-200 rounded-2xl card-3d-tactile">
                    <AlertTriangle className="w-8 h-8 text-slate-350 mx-auto animate-bounce" />
                    <h4 className="font-bold text-slate-900 text-sm">No shops found</h4>
                    <p className="text-slate-450 text-xs max-w-sm mx-auto">Try resetting your filters to find more shops.</p>
                    <button onClick={resetAllFilters} className="text-xs text-[#8B0000] font-bold underline cursor-pointer">Reset All Filters</button>
                  </div>
                )}
              </div>

            ) : (

              /* INTERACTIVE RADAR COORDINATES VISUALIZER MAP */
              <div id="radar-vinyl-map" className="bg-zinc-50 rounded-3xl h-[490px] relative overflow-hidden border border-zinc-200 shadow-3d-premium">
                
                {/* Visual grid overlay layout */}
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#8B0000_1.5px,transparent_1px)] [background-size:20px_20px] bg-white">
                  <div className="absolute inset-x-0 top-1/4 h-[1px] bg-zinc-200"></div>
                  <div className="absolute inset-y-0 left-1/3 w-[1px] bg-zinc-200"></div>
                  <div className="absolute inset-x-0 top-2/3 h-[1px] bg-zinc-200"></div>
                </div>

                <div className="absolute top-1/4 right-1/4 w-36 h-36 rounded-full bg-red-100 blur-2xl"></div>

                {/* Map projection details */}
                <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md p-4 rounded-xl border border-zinc-200 text-left z-20 space-y-1.5 max-w-xs shadow-md">
                  <div className="flex items-center gap-1 text-[#8B0000] font-extrabold text-[9px] uppercase tracking-wider font-mono">
                    <Zap className="w-3.5 h-3.5 animate-pulse" />
                    <span>Shop Locator Map</span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900">Vilnius Custom Graphics Studios</h4>
                  <p className="text-[10px] text-zinc-500 font-medium">Click on any map point to check shop starting prices and ratings.</p>
                </div>

                {/* Simulated mapped nodes from active specialists array */}
                {filteredSpecialists.map((sp, idx) => {
                  const coordinates = [
                    { top: '38%', left: '22%' },
                    { top: '65%', left: '48%' },
                    { top: '75%', left: '76%' },
                    { top: '28%', left: '60%' },
                    { top: '70%', left: '18%' }
                  ];
                  const pos = coordinates[idx % coordinates.length];

                  return (
                    <button
                      type="button"
                      key={sp.id}
                      onClick={() => handleMapMarkerClick(sp.name, sp.minPrice)}
                      style={{ top: pos.top, left: pos.left }}
                      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                    >
                      <div className="relative flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-11 w-11 rounded-full bg-[#8B0000] opacity-40"></span>
                        
                        <div className="relative bg-white hover:bg-zinc-50 border-2 border-[#8B0000] text-slate-900 px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 transition-transform group-hover:scale-105 text-left">
                          <span className="text-base">{sp.logo}</span>
                          <div>
                            <p className="text-[9px] font-black text-[#8B0000] leading-none uppercase">{sp.name.split(' ')[0]}</p>
                            <p className="text-[8px] text-[#8B0000] font-bold mt-0.5">from €{sp.minPrice} • ★ {sp.rating}</p>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}

                {/* Scale parameters label */}
                <span className="absolute bottom-4 right-4 bg-white/90 border border-zinc-200 text-[9px] font-bold text-zinc-500 uppercase tracking-wider px-2.5 py-1 rounded shadow-xs">
                  Mercator Grid Plan
                </span>

              </div>

            )}

            {/* 3. MID-PAGE CTA WIDGET: "Looking for a custom wrap? Get quotes from local specialists" */}
            <div id="wrapping-middle-cta" className="relative card-3d-tactile p-6 md:p-8 overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-red-500/5 rounded-full blur-xl pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-100 px-2.5 py-1 rounded-md text-[10px] font-bold text-[#8B0000] tracking-wider uppercase">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Free Price Quote</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-[#8B0000] tracking-tight leading-snug">
                    Want a custom wrap design? Get free quotes.
                  </h2>
                  <p className="text-xs text-slate-500 max-w-xl font-medium">
                    Tell us what you want for your car or business. We will send your request to local shops to get you the best price.
                  </p>
                </div>

                <button
                  id="btn-broadcast-rfq"
                  type="button"
                  onClick={() => {
                    setShowQuoteModal(true);
                    setQuoteSuccess(false);
                  }}
                  className="btn-3d-red uppercase text-xs font-bold tracking-wider px-6 py-4 rounded-xl shrink-0 cursor-pointer flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Get Free Quotes</span>
                </button>
              </div>

              {/* Security validation footnotes */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>We only use top brands like 3M &amp; Avery</span>
                </div>
                <span>Free consultation • No obligation</span>
              </div>
            </div>

            {/* 4. BOTTOM INTERACTIVE SECTION: AI WRAPPING ARTIST CONSULTANT */}
            <div id="ai-wrapping-consultant" className="card-3d-tactile p-6 md:p-8 bg-white text-slate-800 text-left">
              
              <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                <div className="bg-red-50 p-2.5 rounded-2xl border border-red-100">
                  <Sparkles className="w-6 h-6 text-[#8B0000] animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] bg-[#8B0000] text-white font-black uppercase px-2 py-0.5 rounded-md">Smart Assistant</span>
                    <span className="text-[10px] text-slate-500">Fast answers</span>
                  </div>
                  <h3 className="text-lg font-extrabold tracking-tight text-slate-900 mt-1">Ask AI: Get Design Ideas &amp; Price Estimates</h3>
                </div>
              </div>

              {/* Sub-Layout: Left-side Configurator & Right-side Dynamic Dialogue Stream */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-6">
                
                {/* Left Side: Idea parameter generators (Full width) */}
                <div className="lg:col-span-5 space-y-4 bg-zinc-50 p-6 md:p-8 rounded-2xl border border-slate-200 text-left shadow-inner max-w-3xl mx-auto w-full">
                  <span className="text-[10px] font-bold tracking-wider text-slate-500 block uppercase flex items-center gap-1 mb-2">
                    <Sliders className="w-3.5 h-3.5 text-[#8B0000]" />
                    <span>Design Idea Estimator</span>
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Body Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Select Car Type</label>
                      <select
                        value={selectedIdeaVehicle}
                        onChange={(e) => setSelectedIdeaVehicle(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-lg px-3 py-2 focus:outline-hidden cursor-pointer h-10"
                      >
                        <option value="compact">Small Hatchback (Golf, Yaris)</option>
                        <option value="sedan">Medium Sedan (Tesla Model 3, Audi A4)</option>
                        <option value="suv">Large SUV (BMW X5, RAV4)</option>
                        <option value="commercial">Cargo Van (Transit, Crafter)</option>
                      </select>
                    </div>

                    {/* Look Finish Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Select Finish Style</label>
                      <select
                        value={selectedIdeaType}
                        onChange={(e) => setSelectedIdeaType(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-lg px-3 py-2 focus:outline-hidden cursor-pointer h-10"
                      >
                        <option value="satin_metallic">Satin Metallic Finish</option>
                        <option value="gloss_finish">High-Gloss Solid Color</option>
                        <option value="custom_graphics">Business Graphics &amp; Logos</option>
                        <option value="clear_protective">Paint Protection Film (PPF)</option>
                      </select>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <button
                    type="button"
                    onClick={handleCalculateWrapIdea}
                    className="w-full btn-3d-red py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider mt-2 cursor-pointer"
                  >
                    <Palette className="w-4 h-4 mr-1.5 inline" />
                    <span>Get Design Ideas</span>
                  </button>

                  {/* Computed result readout block */}
                  <AnimatePresence mode="wait">
                    {aiResult && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-5 bg-white border border-slate-200 rounded-xl space-y-4 mt-4 overflow-hidden text-left shadow-xs"
                      >
                        <div>
                          <span className="text-[9px] font-bold text-[#8B0000] block uppercase tracking-wide leading-none mb-2">AI Design Ideas</span>
                          {aiResult.ideas.map((id: string, i: number) => (
                            <p key={i} className="text-xs font-semibold text-slate-700 mt-1.5 flex items-start gap-2">
                              <span className="text-[#8B0000] mt-0.5">•</span>
                              <span>{id}</span>
                            </p>
                          ))}
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-100 text-left">
                          <div>
                            <span className="text-[8px] text-slate-400 block uppercase font-bold">Est. Price</span>
                            <span className="text-sm font-black text-slate-900">{aiResult.estimatedPriceRange}</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-400 block uppercase font-bold">Time Needed</span>
                            <span className="text-xs font-bold text-slate-700 block pt-0.5">{aiResult.timeRequired}</span>
                          </div>
                          <div>
                            <span className="text-[8px] text-slate-400 block uppercase font-bold">How long it lasts</span>
                            <span className="text-xs font-bold text-emerald-700 block pt-0.5">{aiResult.durabilityExpectancy}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* 5. POPS MODALS WINDOWS: CHASSIS BOOKING CONFIRMATION FORM */}
      <AnimatePresence>
        {selectedShopForBooking && (
          <div className="fixed inset-0 z-[200] overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-3d-premium relative text-left"
            >
              {/* Header banner */}
              <div className="bg-[#8B0000] text-white p-6 relative">
                <button
                  type="button"
                  onClick={() => setSelectedShopForBooking(null)}
                  className="absolute top-5 right-5 text-red-200 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 text-white/90 font-bold text-[10px] tracking-wider uppercase">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Design Slot</span>
                </div>
                <h3 className="text-xl font-extrabold mt-1 leading-none">{selectedShopForBooking.name}</h3>
                <p className="text-[11px] text-red-100 mt-1 font-medium">Address: {selectedShopForBooking.address}</p>
              </div>

              {bookingSuccess ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-3xl">
                    ✓
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 leading-tight">Booking Saved!</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    We have received your car details. The shop will contact you shortly to review your design options and confirm your time.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedShopForBooking(null)}
                    className="btn-3d-red uppercase text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConfirmReservation} className="p-6 space-y-4">
                  
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-bold block">Your Name</label>
                      <input
                        type="text"
                        required
                        value={bookingFormData.name}
                        onChange={(e) => setBookingFormData({...bookingFormData, name: e.target.value})}
                        placeholder="Emilis V."
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-bold block">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={bookingFormData.phone}
                        onChange={(e) => setBookingFormData({...bookingFormData, phone: e.target.value})}
                        placeholder="+370 60000000"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-bold block">Car Make</label>
                      <input
                        type="text"
                        required
                        value={bookingFormData.carMake}
                        onChange={(e) => setBookingFormData({...bookingFormData, carMake: e.target.value})}
                        placeholder="e.g. Audi, Tesla"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-bold block">Car Model &amp; Year</label>
                      <input
                        type="text"
                        required
                        value={bookingFormData.carModel}
                        onChange={(e) => setBookingFormData({...bookingFormData, carModel: e.target.value})}
                        placeholder="e.g. Model Y 2024"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-bold block">Wrap Type</label>
                      <select
                        value={bookingFormData.wrapType}
                        onChange={(e) => setBookingFormData({...bookingFormData, wrapType: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-hidden cursor-pointer"
                      >
                        <option value="full wrap">Full Film Wrap</option>
                        <option value="partial wrap">Partial / Accent Wrap</option>
                        <option value="color change">Complete Color Change</option>
                        <option value="paint protection film">Paint Protection Film (PPF)</option>
                        <option value="fleet advertising">Company Vehicle Ads</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-bold block">Material Brand</label>
                      <select
                        value={bookingFormData.materialBrand}
                        onChange={(e) => setBookingFormData({...bookingFormData, materialBrand: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-hidden cursor-pointer"
                      >
                        <option value="3M">3M Series 2080 (Best Quality)</option>
                        <option value="Avery Dennison">Avery Dennison Supreme</option>
                        <option value="Oracal">Oracal 970RA Pro-Cast</option>
                        <option value="Hexis">Hexis BodyFence TPU</option>
                        <option value="KPMF">KPMF Premium Films</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-bold block">Preferred Date</label>
                      <input
                        type="date"
                        required
                        value={bookingFormData.preferredDate}
                        onChange={(e) => setBookingFormData({...bookingFormData, preferredDate: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-bold block">Preferred Time</label>
                      <input
                        type="time"
                        required
                        value={bookingFormData.preferredTime}
                        onChange={(e) => setBookingFormData({...bookingFormData, preferredTime: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase font-bold block">Your Requests / Notes (Optional)</label>
                    <textarea
                      value={bookingFormData.notes}
                      onChange={(e) => setBookingFormData({...bookingFormData, notes: e.target.value})}
                      placeholder="e.g. Chrome delete package, custom colors, or logo design ready..."
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl p-3 focus:outline-hidden resize-none"
                    />
                  </div>

                  <div className="p-3 bg-red-50 text-red-850 rounded-xl border border-red-100 flex items-start gap-2 text-[10.5px]">
                    <Clock className="w-4 h-4 shrink-0 text-[#8B0000] mt-0.5" />
                    <span><b>Important Notice:</b> Design consultations are free. Full installs require a clean car on arrival. It takes 2-3 days for the film to cure properly.</span>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedShopForBooking(null)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 btn-3d-red py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* REPURPOSED CREATE REPAIR REQUEST / CUSTOM DESIGN ESTIMATES MODAL */}
      <AnimatePresence>
        {showQuoteModal && (
          <div className="fixed inset-0 z-[200] overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full overflow-hidden shadow-3d-premium relative text-left"
            >
              
              <div className="bg-[#8B0000] text-white p-6 relative">
                <button
                  type="button"
                  onClick={() => setShowQuoteModal(false)}
                  className="absolute top-5 right-5 text-red-200 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-1.5 text-white/90 font-bold text-[10px] tracking-wider uppercase">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Get Custom Quotes</span>
                </div>
                <h3 className="text-xl font-extrabold mt-1">Get Free Wrap Quotes</h3>
                <p className="text-[11.5px] text-red-100 mt-1">Get direct price offers from verified local wrapping shops</p>
              </div>

              {quoteSuccess ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-3xl">
                    ✓
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 leading-tight">Request Sent!</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Your request was successfully broadcast. Local wrapping shops will review your details and send you prices directly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowQuoteModal(false)}
                    className="btn-3d-red uppercase text-xs font-bold px-6 py-2.5 rounded-xl cursor-pointer"
                  >
                    Back to Listings
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConfirmRfqRequest} className="p-6 space-y-4">
                  
                  <div className="grid grid-cols-3 gap-2 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-bold block">License Plate</label>
                      <input
                        type="text"
                        required
                        value={quoteFormData.carPlate}
                        onChange={(e) => setQuoteFormData({...quoteFormData, carPlate: e.target.value.toUpperCase()})}
                        placeholder="LHV402"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-bold block">Car Make</label>
                      <input
                        type="text"
                        required
                        value={quoteFormData.carMake}
                        onChange={(e) => setQuoteFormData({...quoteFormData, carMake: e.target.value})}
                        placeholder="Tesla"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-bold block">Car Model</label>
                      <input
                        type="text"
                        required
                        value={quoteFormData.carModel}
                        onChange={(e) => setQuoteFormData({...quoteFormData, carModel: e.target.value})}
                        placeholder="Model 3"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-bold block">Coverage Type</label>
                      <select
                        value={quoteFormData.wrapCoverage}
                        onChange={(e) => setQuoteFormData({...quoteFormData, wrapCoverage: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-hidden cursor-pointer"
                      >
                        <option value="full wrap">Full Wrap Coverage</option>
                        <option value="partial wrap">Partial Panel Wrap</option>
                        <option value="color change">Solid Color Change</option>
                        <option value="paint protection film">Paint Protection (PPF)</option>
                        <option value="advertising wraps">Advertising &amp; Decals</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-bold block">Finish Style</label>
                      <select
                        value={quoteFormData.preferredFinish}
                        onChange={(e) => setQuoteFormData({...quoteFormData, preferredFinish: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-hidden cursor-pointer"
                      >
                        <option value="satin_metallic">Satin Metallic Finish</option>
                        <option value="gloss_finish">High-Gloss Finish</option>
                        <option value="matte_military">Matte Finish</option>
                        <option value="custom_graphics">Printed Business Graphics</option>
                        <option value="clear_protective">Optically Clear Film</option>
                      </select>
                    </div>
                  </div>

                  {/* Image and Design Upload Zone */}
                  <div className="space-y-2">
                    <label className="text-[10px] text-slate-500 uppercase font-bold block">Upload Car Photo or Design File</label>
                    <UniversalSmartUpload
                      photoKey="wrapping_advertising_design"
                      uploadedImageSrc={quoteFormData.uploadedPhotoObj}
                      onUploadSuccess={handleSmartQuotePhotoUpload}
                      onClear={() => setQuoteFormData({...quoteFormData, uploadedPhotoName: '', uploadedPhotoObj: null})}
                      label="Car Design / Camera Capture"
                      description="Position your phone camera showing the vehicle side panel or upload reference designs."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-bold block">Your Email</label>
                      <input
                        type="email"
                        required
                        value={quoteFormData.clientContact}
                        onChange={(e) => setQuoteFormData({...quoteFormData, clientContact: e.target.value})}
                        placeholder="emilis@domain.lt"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-500 uppercase font-bold block">Your Phone</label>
                      <input
                        type="tel"
                        required
                        value={quoteFormData.clientPhone}
                        onChange={(e) => setQuoteFormData({...quoteFormData, clientPhone: e.target.value})}
                        placeholder="+370 612 34567"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl px-3 py-2.5 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 uppercase font-bold block">Details or Special Requests</label>
                    <textarea
                      value={quoteFormData.additionalDetails}
                      onChange={(e) => setQuoteFormData({...quoteFormData, additionalDetails: e.target.value})}
                      placeholder="e.g. Chrome delete package, specific satin colors, fleet size..."
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-xl p-3 focus:outline-hidden resize-none"
                    />
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowQuoteModal(false)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 btn-3d-red py-3 rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer"
                    >
                      Get Quotes
                    </button>
                  </div>

                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

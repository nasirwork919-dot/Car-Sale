import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Paintbrush, MapPin, SlidersHorizontal, Sparkles, Star, ArrowRight, Lock, 
  MessageSquare, Send, Calendar, X, ChevronDown, CheckCircle, 
  Clock, Compass, Filter, ShieldCheck, Award, Languages, Wrench, Map as MapIcon, 
  Grid, ChevronRight, Play, AlertTriangle, ShieldAlert, Upload, Image, Eye, DollarSign,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ServiceProfileDetails from './ServiceProfileDetails';
import UniversalSmartUpload from './UniversalSmartUpload';

// Seed data for Auto Painters & Body Shops
interface PainterShop {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  services: string[]; // "Full Repaint" | "Color Matching" | "Insurance Repair" | "Custom Paintwork"
  insuranceCertified: boolean;
  brands: string[];
  languages: string[];
  availability: 'open_now' | 'today' | 'this_week';
  distance: number; // in km
  priceLevel: number; // 1 to 3
  image: string;
  address: string;
  phone: string;
  workingHours: string;
  description: string;
  coords: { lat: number; lng: number };
}

const SH_DATA: PainterShop[] = [
  {
    id: 'painter-1',
    name: 'Vilnius Premium Paint & Ceramic Lab',
    rating: 4.9,
    reviewsCount: 184,
    services: ['Color Matching', 'Full Repaint', 'Custom Paintwork'],
    insuranceCertified: true,
    brands: ['BMW', 'Tesla', 'Audi', 'Mercedes'],
    languages: ['English', 'Lithuanian', 'Russian'],
    availability: 'open_now',
    distance: 1.4,
    priceLevel: 3,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=600',
    address: 'Savanorių pr. 178F, Vilnius 03154',
    phone: '+370 5 210 9999',
    workingHours: '08:00 - 19:00 (Open Now)',
    description: 'Ultra-precision Dupont paint ovens, computerized laser tone matching, and multi-layer ceramic clearcoats. Certified for factory-matching finishes on luxury brands with lifelong oxidation warranties.',
    coords: { lat: 54.6580, lng: 25.2120 }
  },
  {
    id: 'painter-2',
    name: 'Baltic Accident Repair Specialists',
    rating: 4.8,
    reviewsCount: 230,
    services: ['Insurance Repair', 'Color Matching', 'Full Repaint'],
    insuranceCertified: true,
    brands: ['Toyota', 'Honda', 'Ford', 'Audi'],
    languages: ['Lithuanian', 'Russian', 'English'],
    availability: 'today',
    distance: 2.3,
    priceLevel: 2,
    image: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=600',
    address: 'Žalgirio g. 112, Vilnius 09300',
    phone: '+370 5 255 1212',
    workingHours: '08:00 - 18:00 (Open Now)',
    description: 'Official claims authorized body repair center. We negotiate direct billing with and supply courtesy cars of all partners. Equipped with active state-of-the-art frame straightening bench jigs.',
    coords: { lat: 54.7042, lng: 25.2754 }
  },
  {
    id: 'painter-3',
    name: 'Vytis Custom Paint & Wrap',
    rating: 4.7,
    reviewsCount: 95,
    services: ['Custom Paintwork', 'Full Repaint'],
    insuranceCertified: false,
    brands: ['BMW', 'Tesla', 'Porsche'],
    languages: ['English', 'Spanish', 'Lithuanian'],
    availability: 'this_week',
    distance: 4.8,
    priceLevel: 3,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600',
    address: 'Pramonės g. 34, Vilnius 11116',
    phone: '+370 5 288 7777',
    workingHours: 'Currently closed (Opens 09:00 Tuesday)',
    description: 'Chameleon shifts, candy coats, high-end matte finishes, and hand-finished pinstriping. Known throughout the Baltic states for high-end track car and stance project aesthetic builds.',
    coords: { lat: 54.6850, lng: 25.3880 }
  },
  {
    id: 'painter-4',
    name: 'AutoColor Express Vilnius',
    rating: 4.6,
    reviewsCount: 78,
    services: ['Color Matching', 'Insurance Repair'],
    insuranceCertified: true,
    brands: ['Toyota', 'Honda', 'BMW', 'Ford'],
    languages: ['Lithuanian', 'Russian'],
    availability: 'open_now',
    distance: 5.1,
    priceLevel: 1,
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=600',
    address: 'Laisvės pr. 60, Vilnius 05120',
    phone: '+370 5 212 5555',
    workingHours: '09:00 - 18:30 (Open Now)',
    description: 'Expert spot repairs, bumper scuffs color-blended in under four hours using PPG rapid cure tech. Ideal for lease returns, minor dings, and budget-friendly insurance touch-ups.',
    coords: { lat: 54.7110, lng: 25.2190 }
  },
  {
    id: 'painter-5',
    name: 'Kaunas Body shop & Overhaul Center',
    rating: 4.9,
    reviewsCount: 142,
    services: ['Insurance Repair', 'Full Repaint', 'Color Matching'],
    insuranceCertified: true,
    brands: ['Mercedes', 'Audi', 'Tesla', 'Toyota'],
    languages: ['Lithuanian', 'English', 'Russian'],
    availability: 'this_week',
    distance: 12.5,
    priceLevel: 2,
    image: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&q=80&w=600',
    address: 'Taikos pr. 102, Kaunas 50284',
    phone: '+370 37 325 325',
    workingHours: '08:00 - 17:00 (By Appointment)',
    description: 'Specialist aluminum body welding, modern EV platform frame alignment, high-pressure paint ovens. Direct insurance claim resolution with Ergo, Gjensidige, and Lietuvos Draudimas.',
    coords: { lat: 54.9080, lng: 23.9580 }
  }
];

export default function AutoPaintersSection() {
  // Navigation & Primary Layout State
  const [mapMode, setMapMode] = useState<boolean>(false);
  const [searchCity, setSearchCity] = useState<string>('Vilnius, Lithuania');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Sorting
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'price_low' | 'price_high'>('distance');

  // Filters State
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [onlyInsuranceCertified, setOnlyInsuranceCertified] = useState<boolean>(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);

  // Mobile Filter SideBar Close Toggle
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Applet Action modals state
  const [activeBookingShop, setActiveBookingShop] = useState<PainterShop | null>(null);
  const [bookingFormData, setBookingFormData] = useState({
    date: '2026-06-18',
    time: '09:00',
    vehicleBrand: 'BMW',
    colorCode: '',
    serviceType: 'Color Matching',
    notes: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Prevent background scrolling when activeBookingShop modal is active
  useEffect(() => {
    if (activeBookingShop) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [activeBookingShop]);

  // Viewing Detail modal profile state
  const [viewingProfile, setViewingProfile] = useState<PainterShop | null>(null);

  // Collision Request Form State (Centralized body panel quote helper)
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [requestSubmitted, setRequestSubmitted] = useState<boolean>(false);
  const [requestForm, setRequestForm] = useState({
    carModel: '',
    damageArea: 'Front Bumper Scuff',
    isWithInsurance: 'yes',
    notes: '',
    phone: '+370 600 12345',
    customColorCode: ''
  });

  // AI Diagnostic Cost Calculator upload state
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [isAiEstimating, setIsAiEstimating] = useState<boolean>(false);
  const [aiReport, setAiReport] = useState<{
    damageClass: string;
    paintVariance: string;
    recommendedServices: string[];
    hoursNeeded: string;
    priceEstimateRange: string;
  } | null>(null);

  // Reset helper
  const resetFilters = () => {
    setSelectedServices([]);
    setOnlyInsuranceCertified(false);
    setSelectedBrands([]);
    setSelectedLanguages([]);
    setSelectedAvailability('all');
    setMinRating(0);
  };

  // Geo Locator Simulation
  const handleUseMyLocation = () => {
    setSearchCity('Vilnius Left-Bank Zone (Detected)');
    const notification = document.createElement('div');
    notification.className = "fixed bottom-24 left-1/2 -translate-x-1/2 z-[150] bg-zinc-900 text-white text-xs font-mono px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-zinc-800 animate-bounce";
    notification.innerHTML = "🎯 GPS Verified: Correcting coordinates to Vilnius Old Town center";
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2500);
  };

  // Filter & Sort core logic
  const filteredShops = useMemo(() => {
    let result = [...SH_DATA];

    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      result = result.filter(shop => 
        shop.name.toLowerCase().includes(q) || 
        shop.description.toLowerCase().includes(q) ||
        shop.services.some(s => s.toLowerCase().includes(q))
      );
    }

    if (selectedServices.length > 0) {
      result = result.filter(shop => 
        selectedServices.some(svc => shop.services.some(shSvc => shSvc.toLowerCase() === svc.toLowerCase()))
      );
    }

    if (onlyInsuranceCertified) {
      result = result.filter(shop => shop.insuranceCertified);
    }

    if (selectedBrands.length > 0) {
      result = result.filter(shop => 
        selectedBrands.some(brand => shop.brands.includes(brand))
      );
    }

    if (selectedLanguages.length > 0) {
      result = result.filter(shop => 
        selectedLanguages.some(lang => shop.languages.includes(lang))
      );
    }

    if (selectedAvailability !== 'all') {
      result = result.filter(shop => shop.availability === selectedAvailability);
    }

    if (minRating > 0) {
      result = result.filter(shop => shop.rating >= minRating);
    }

    // Sort mechanics
    result.sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price_low') return a.priceLevel - b.priceLevel;
      if (sortBy === 'price_high') return b.priceLevel - a.priceLevel;
      return 0;
    });

    return result;
  }, [searchKeyword, selectedServices, onlyInsuranceCertified, selectedBrands, selectedLanguages, selectedAvailability, minRating, sortBy]);

  // Simulated AI Analyzer behavior triggered by file upload
  const handlePhotoUploadSimulated = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      setIsAiEstimating(true);
      setAiReport(null);

      setTimeout(() => {
        setIsAiEstimating(false);
        // Select an dynamic response based on potential input keywords inside filename
        const fn = file.name.toLowerCase();
        if (fn.includes('scratch') || fn.includes('dent') || fn.includes('scrape')) {
          setAiReport({
            damageClass: "Deep Clearcoat Scrape with mild steel deformation",
            paintVariance: "Paint depth variance: 45µm - structural layer visible",
            recommendedServices: ["Dent Pulling", "Surface Sanding", "Computerized Color Matching", "Spot Clearcoat Baking"],
            hoursNeeded: "4 - 5.5 hours shop work",
            priceEstimateRange: "€225 - €310"
          });
        } else if (fn.includes('crash') || fn.includes('bumper') || fn.includes('accident')) {
          setAiReport({
            damageClass: "Moderate bumper bracket fractured & plastic scuff",
            paintVariance: "Factory OEM color matching code required",
            recommendedServices: ["Bumper Realignment", "Plastic Primer Filling", "Dupont Hydro-Base Painting", "Infrared Clear Bake"],
            hoursNeeded: "6 - 8 hours expert bodywork",
            priceEstimateRange: "€380 - €490 (Claims pre-authorized and covered by insurance)"
          });
        } else {
          setAiReport({
            damageClass: "Minor surface clearcoat micro-abrasion (No base steel exposed)",
            paintVariance: "Paint thickness: 110µm - standard original depth",
            recommendedServices: ["Wet Sanding (2500 grit)", "Rotary Buff polishing", "Polymer Paint sealant application"],
            hoursNeeded: "1.5 hours fast-express repair",
            priceEstimateRange: "€75 - €110"
          });
        }
      }, 1800);
    }
  };

  const handleSmartPaintUpload = (dataUrl: string, fileName: string) => {
    setUploadedFileName(fileName);
    setUploadedImageSrc(dataUrl);
    setIsAiEstimating(true);
    setAiReport(null);

    setTimeout(() => {
      setIsAiEstimating(false);
      const fn = fileName.toLowerCase();
      if (fn.includes('scratch') || fn.includes('dent') || fn.includes('scrape')) {
        setAiReport({
          damageClass: "Deep Clearcoat Scrape with mild steel deformation",
          paintVariance: "Paint depth variance: 45µm - structural layer visible",
          recommendedServices: ["Dent Pulling", "Surface Sanding", "Computerized Color Matching", "Spot Clearcoat Baking"],
          hoursNeeded: "4 - 5.5 hours shop work",
          priceEstimateRange: "€225 - €310"
        });
      } else if (fn.includes('crash') || fn.includes('bumper') || fn.includes('accident')) {
        setAiReport({
          damageClass: "Moderate bumper bracket fractured & plastic scuff",
          paintVariance: "Factory OEM color matching code required",
          recommendedServices: ["Bumper Realignment", "Plastic Primer Filling", "Dupont Hydro-Base Painting", "Infrared Clear Bake"],
          hoursNeeded: "6 - 8 hours expert bodywork",
          priceEstimateRange: "€380 - €490 (Claims pre-authorized and covered by insurance)"
        });
      } else {
        setAiReport({
          damageClass: "Minor surface clearcoat micro-abrasion (No base steel exposed)",
          paintVariance: "Paint thickness: 110µm - standard original depth",
          recommendedServices: ["Wet Sanding (2500 grit)", "Rotary Buff polishing", "Polymer Paint sealant application"],
          hoursNeeded: "1.5 hours fast-express repair",
          priceEstimateRange: "€75 - €110"
        });
      }
    }, 1800);
  };

  const handleRequestFormSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitted(true);
    setTimeout(() => {
      setShowRequestModal(false);
      setRequestSubmitted(false);
      // Popup success alert
      const alertDiv = document.createElement('div');
      alertDiv.className = "fixed bottom-10 right-10 z-[200] bg-emerald-600 text-white text-xs font-black px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in duration-300";
      alertDiv.innerHTML = `🛡️ <b>Accident claim ticket dispatch complete! Shops are drafting customized offers now.</b>`;
      document.body.appendChild(alertDiv);
      setTimeout(() => alertDiv.remove(), 4000);
    }, 2000);
  };

  const handleBookingCompleted = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setActiveBookingShop(null);
      setBookingSuccess(false);
      // Toast notification
      const alertDiv = document.createElement('div');
      alertDiv.className = "fixed bottom-10 right-10 z-[200] bg-[#8B0000] text-white text-xs font-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in duration-300";
      alertDiv.innerHTML = `🎉 <b>Booking Scheduled! We have reserved your oven slot. Coordination email dispatched.</b>`;
      document.body.appendChild(alertDiv);
      setTimeout(() => alertDiv.remove(), 4000);
    }, 2200);
  };

  return (
    <div className="bg-[#F5F5F7] min-h-screen text-slate-800 text-left font-sans leading-relaxed relative pb-20">
      
      {/* 1. HEADER SECTION CONTAINER */}
      <div className="bg-white border-b border-slate-200 py-8 md:py-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            
            {/* Title & subtitle about color matching, insurance repairs, custom paintwork */}
            <div className="space-y-2">
              <h1 id="auto-painters-heading" className="text-3xl font-bold tracking-tight text-slate-900 mt-1 font-sans">
                Find Auto Painters &amp; Body Shops
              </h1>
            </div>

            {/* Map toggle on the right */}
            <div className="flex items-center shrink-0">
              <div className="bg-white p-1 rounded-xl shadow-xs border border-slate-200/50 flex items-center gap-1">
                <button
                  type="button"
                  id="tab-grid-painters"
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
                  id="tab-map-painters"
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

          {/* Location search bar & quick search block */}
          <div className="mt-8 bg-slate-100 border border-slate-205 rounded-2xl p-3 max-w-3xl flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full flex-1">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-650" />
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Enter city, region or district..."
                className="w-full bg-white text-slate-900 text-xs font-bold rounded-xl pl-10 pr-4 py-3 placeholder-slate-400 border border-slate-205 focus:outline-hidden focus:ring-1 focus:ring-red-600"
              />
            </div>
            
            <button
              type="button"
              id="btn-gps-painters"
              onClick={handleUseMyLocation}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-[11px] tracking-tight uppercase px-4 py-3 border border-slate-205 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Compass className="w-4 h-4 text-red-600 animate-spin-slow" />
              <span>Use My Location</span>
            </button>

            <div className="h-4 w-[1px] bg-slate-250 hidden sm:block"></div>

            <div className="relative w-full sm:w-60 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search clearcoat, dent..."
                className="w-full bg-white text-slate-900 text-xs font-bold rounded-xl pl-9 pr-3 py-3 placeholder-slate-400 border border-slate-205 focus:outline-hidden focus:ring-1 focus:ring-red-600"
              />
            </div>
          </div>

        </div>
      </div>

      {/* PRIMARY STRUCTURE LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        
        {/* MOBILE COLLAPSIVE FILTERS TRIGGERS */}
        <div className="flex md:hidden items-center justify-between mb-4 bg-white p-3 rounded-xl border border-slate-205">
          <span className="text-xs font-extrabold text-slate-800 uppercase tracking-widest font-mono">Filter Repair Shops</span>
          <button
            type="button"
            id="btn-mobile-filters"
            onClick={() => setSidebarOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* 2. FILTERS SIDEBAR (left, collapsible on mobile) */}
          <div className={`
            fixed inset-0 z-50 bg-black/60 md:static md:bg-transparent md:z-10 md:block transition-all duration-300
            ${sidebarOpen ? 'block' : 'hidden'}
          `}>
            <div className="bg-white md:bg-transparent w-80 md:w-auto h-full md:h-auto overflow-y-auto md:overflow-visible p-6 md:p-0 border-r border-slate-200 md:border-r-0 float-left md:float-none space-y-6">
              
              {/* Header for mobile navigation */}
              <div className="flex items-center justify-between md:hidden pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm uppercase">
                  <Filter className="w-4 h-4 text-red-650" />
                  <span>Refine Shops</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-full bg-slate-100 text-slate-600 cursor-pointer animate-pulse"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filtering Controls wrapper panel */}
              <div className="bg-white rounded-2xl border border-slate-205 p-5 space-y-6 shadow-xs text-left">
                
                {/* Title and Reset link */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-extrabold text-[#8B0000] text-[12px] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <SlidersHorizontal className="w-4 h-4 text-red-600" /> Filter Shops
                  </span>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-[10px] text-red-650 hover:underline font-extrabold uppercase"
                  >
                    Clear Filters
                  </button>
                </div>

                {/* Service Type Filter Options */}
                <div className="space-y-2.5">
                  <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider font-mono">Service Type</h4>
                  <div className="space-y-2">
                    {['Full Repaint', 'Color Matching', 'Insurance Repair', 'Custom Paintwork'].map((svc) => {
                      const active = selectedServices.includes(svc);
                      return (
                        <label key={svc} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900 select-none">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => {
                              setSelectedServices(prev => 
                                active ? prev.filter(item => item !== svc) : [...prev, svc]
                              );
                            }}
                            className="w-4 h-4 rounded-sm accent-red-650"
                          />
                          <span>{svc}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Insurance Certification option */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider font-mono">Accreditation</h4>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900 select-none">
                    <input
                      type="checkbox"
                      checked={onlyInsuranceCertified}
                      onChange={() => setOnlyInsuranceCertified(!onlyInsuranceCertified)}
                      className="w-4 h-4 rounded-sm accent-red-650"
                    />
                    <span className="text-red-750 font-bold">Claim Approved Centers only</span>
                  </label>
                  <p className="text-[10px] text-slate-400 font-medium">Shows only shops with accredited "Accident Repair Approved / Claims Authorized" stamp protocols.</p>
                </div>

                {/* Brands specialization */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider font-mono font-bold">Supported Brands</h4>
                  <div className="space-y-2">
                    {['BMW', 'Tesla', 'Audi', 'Mercedes', 'Toyota', 'Ford'].map((brand) => {
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

                {/* Languages Option */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider font-mono font-bold">Languages Spoken</h4>
                  <div className="space-y-2">
                    {['English', 'Lithuanian', 'Russian', 'Spanish'].map((lang) => {
                      const active = selectedLanguages.includes(lang);
                      return (
                        <label key={lang} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900 select-none">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => {
                              setSelectedLanguages(prev => 
                                active ? prev.filter(item => item !== lang) : [...prev, lang]
                              );
                            }}
                            className="w-4 h-4 rounded-sm accent-red-650"
                          />
                          <span>{lang}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Availability */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider font-mono">Oven Availability</h4>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { id: 'all', name: 'Any Availability' },
                      { id: 'open_now', name: 'Open Now' },
                      { id: 'today', name: 'Available Today' },
                      { id: 'this_week', name: 'Baking Slots This Week' }
                    ].map((avail) => (
                      <label key={avail.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="avail_painters"
                          checked={selectedAvailability === avail.id}
                          onChange={() => setSelectedAvailability(avail.id)}
                          className="w-4 h-4 accent-red-650"
                        />
                        <span>{avail.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating selection */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider font-mono font-bold">Minimum Rating</h4>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { id: 0, label: 'All workshops' },
                      { id: 4.7, label: '4.7+ Superb ⭐' },
                      { id: 4.9, label: '4.9+ Flawless ⭐' }
                    ].map((item) => (
                      <label key={item.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="rating_painters"
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

          {/* MAIN DYNAMIC CONTENT BOX */}
          <div className="lg:col-span-3 space-y-6 text-left">
            
            {/* GRID TOP BAR SORT DROPDOWN AND MATCH FEEDBACK */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className="font-black text-slate-900 text-sm">{filteredShops.length} specialized autobody venues match</span>
              </div>

              {/* Top of grid: sort dropdown */}
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-slate-400 font-extrabold uppercase tracking-wider font-mono">Sort By</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-205 text-slate-800 text-xs font-bold rounded-lg px-2.5 py-1.5 cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-red-600"
                >
                  <option value="distance">Distance (Nearest First)</option>
                  <option value="rating">Reviews Rating (Highest First)</option>
                  <option value="price_low">Service Pricing (Low to High)</option>
                  <option value="price_high">Service Pricing (High to Low)</option>
                </select>
              </div>
            </div>

            {/* Zero matching case */}
            {filteredShops.length === 0 && (
              <div className="py-20 text-center bg-white border border-slate-205 rounded-3xl p-6 space-y-4">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto border border-amber-100">
                  <ShieldAlert className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <p className="text-slate-950 font-bold text-sm">No painters found matching active filters</p>
                  <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">Try clearing active tags or expanding brand preferences to view more auto painters in Vilnius.</p>
                </div>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl uppercase font-mono transition-all duration-200"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* INTERACTIVE APPMAP VIEW OR RESPONSIVE GRID BOXES */}
            {mapMode ? (
              
              /* SIMULATED MAP INTERACTIVE ACCELERATOR overlay */
              <div className="bg-zinc-900 rounded-3xl h-[520px] relative overflow-hidden border border-zinc-800 shadow-xl">
                
                {/* Simulated Dark Vilnius Map Grid */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] bg-zinc-950">
                  
                  {/* Street map lines */}
                  <div className="absolute inset-x-0 top-1/2 h-[1px] bg-red-600/30"></div>
                  <div className="absolute inset-y-0 left-1/3 w-[1px] bg-red-600/30"></div>
                  <div className="absolute inset-y-0 left-2/3 w-[1px] bg-red-600/30 font-mono text-[9px] text-zinc-600 p-2">Laisvės pr.</div>

                  {filteredShops.map((shop, idx) => (
                    <motion.div
                      key={shop.id}
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 4, repeat: Infinity, delay: idx * 0.5 }}
                      style={{
                        position: 'absolute',
                        top: `${40 + (idx * 11) % 50}%`,
                        left: `${25 + (idx * 14) % 60}%`
                      }}
                      className="group cursor-pointer"
                      onClick={() => setViewingProfile(shop)}
                    >
                      <div className="relative">
                        <div className="absolute -inset-2 bg-red-600/40 rounded-full blur-xs animate-ping"></div>
                        <div className="bg-red-600 border-2 border-white text-white rounded-full p-2 shadow-lg font-bold text-xs flex items-center justify-center relative">
                          <Paintbrush className="w-3.5 h-3.5" />
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 -bottom-8 bg-black/90 text-white text-[9px] font-mono whitespace-nowrap px-2 py-0.5 rounded-md border border-zinc-800 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                          {shop.name} ({shop.distance} km)
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Left Floating Info card */}
                <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-4 max-w-xs shadow-2xl text-left hidden sm:block">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-widest font-mono mb-1">
                    <Compass className="w-3.5 h-3.5 animate-spin-slow" />
                    <span>Painting Zone GPS</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    Pinpointing nearest computer tone matching ovens in Vilnius area. Select a map node to schedule priority consultation.
                  </p>
                </div>

                {/* Bottom Horizontal Quick Carousel */}
                <div className="absolute bottom-4 inset-x-4 z-10 flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {filteredShops.map((shop) => (
                    <div
                      key={shop.id}
                      onClick={() => setViewingProfile(shop)}
                      className="bg-white/95 backdrop-blur-md hover:bg-white rounded-2xl border border-slate-200 p-3 min-w-[260px] max-w-[285px] shadow-2xl flex gap-3 items-center cursor-pointer transition-all active:scale-[0.98]"
                    >
                      <img
                        src={shop.image}
                        alt={shop.name}
                        className="w-12 h-12 rounded-xl object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1 text-left">
                        <span className="font-extrabold text-slate-900 text-xs truncate block">{shop.name}</span>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                          <Star className="w-3 h-3 fill-amber-500" />
                          <span>{shop.rating}</span>
                          <span className="text-slate-400">({shop.reviewsCount})</span>
                        </div>
                        <span className="text-[10px] text-red-600 font-bold block">{shop.distance} km away</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>

              </div>

            ) : (

              /* MAIN GRID: BUSINESS CARDS SHOWING DETAILS */
              <div id="painters-grid-layout" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredShops.map((shop) => (
                  <motion.div
                    key={shop.id}
                    layoutId={`painter-card-${shop.id}`}
                    className="bg-[#FFFFFF] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between border border-slate-100"
                  >
                    <div className="cursor-pointer" onClick={() => setViewingProfile(shop)}>
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
                          <div className="pt-2 text-xs font-bold text-[#8B0000] hover:text-[#4A4A4A] transition-colors flex items-center gap-1">
                            <span>View Profile</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer: Base Cost + Unified CTA Button */}
                    <div className="p-4 pt-0 mt-auto flex items-center justify-between">
                      <div className="text-sm font-extrabold text-[#8B0000] font-mono">
                        €{shop.minPrice || (shop.priceLevel ? shop.priceLevel * 60 : 180)}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveBookingShop(shop);
                          setBookingFormData(prev => ({
                            ...prev,
                            serviceType: shop.services[0] || 'Color Matching'
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

            {/* 3. MID-PAGE CTA BANNER */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl text-left flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-15 font-mono text-8xl pointer-events-none select-none font-bold">
                REFIT
              </div>
              <div className="space-y-2 relative z-10">
                <div className="bg-white/10 text-white border border-white/20 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider block w-fit mb-1">
                  Collision Quote Engine
                </div>
                <h3 className="font-extrabold text-white text-lg md:text-xl tracking-tight leading-snug">
                  Need bodywork done?
                </h3>
                <p className="text-white/80 text-xs max-w-xl font-medium">
                  Request comprehensive quotes from multiple expert auto painters near you. Save up to 35% with direct-to-claim computerized authorization support.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowRequestModal(true);
                  setRequestSubmitted(false);
                }}
                className="bg-white text-red-600 hover:bg-neutral-50 px-6 py-3 rounded-xl text-xs font-black transition-all active:scale-[0.98] uppercase tracking-wider font-mono shadow-md shrink-0 cursor-pointer"
              >
                Create Repair Request
              </button>
            </div>

            {/* 4. AI ASSISTANT DIAGNOSTIC COST CALCULATOR AT BOTTOM */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs text-left space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-2 border-b border-zinc-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-red-600 font-extrabold uppercase text-[10px] tracking-widest font-mono">
                    <Sparkles className="w-4 h-4 text-red-650" />
                    <span>Neural Damage Computer Vision</span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-lg leading-tight">
                    Ask AI: Instant Bodywork & Paint Estimator
                  </h3>
                  <p className="text-slate-500 text-xs max-w-xl">
                    Describe your vehicle's scratch depth, or stream inside a photo of your cosmetic bumper dent for an automated repair cost range.
                  </p>
                </div>
              </div>

              <UniversalSmartUpload
                photoKey="painter_damage"
                uploadedImageSrc={uploadedImageSrc}
                onUploadSuccess={handleSmartPaintUpload}
                onClear={() => {
                  setUploadedFileName('');
                  setUploadedImageSrc(null);
                  setAiReport(null);
                }}
                label="Bodywork Damage Scanner"
                description="Take a direct photo parallel to the dent/scratch on the vehicle body panel."
              />

              {/* Upload state/loading/results indicators */}
              <AnimatePresence mode="wait">
                {isAiEstimating && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center flex flex-col items-center justify-center py-10 space-y-3"
                  >
                    <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    <div className="space-y-1">
                      <p className="text-xs font-mono font-bold text-slate-900">Configuring computer tone scan for "{uploadedFileName}"...</p>
                      <p className="text-[11px] text-slate-400">Verifying paint coat thickness variance against factory OEM base records...</p>
                    </div>
                  </motion.div>
                )}

                {aiReport && !isAiEstimating && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-red-50/50 border border-red-100 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
                  >
                    <div className="md:col-span-8 space-y-4 text-left">
                      <div className="flex items-center gap-2 font-mono text-xs font-extrabold text-red-700">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>COMPUTER VISION INSPECTION REPORT GENERATED</span>
                      </div>

                      <div className="space-y-1">
                        <p className="text-slate-900 font-extrabold text-sm">{aiReport.damageClass}</p>
                        <p className="text-slate-500 text-xs font-medium">{aiReport.paintVariance}</p>
                      </div>

                      <div className="space-y-1 pt-2">
                        <p className="text-xs font-bold text-slate-700">Recommended repair sequence steps:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {aiReport.recommendedServices.map((r, i) => (
                            <span key={i} className="bg-white border border-red-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-600 pt-2 font-bold font-mono">
                        <Clock className="w-4 h-4 text-red-600" />
                        <span>Estimated Labor: {aiReport.hoursNeeded}</span>
                      </div>
                    </div>

                    <div className="md:col-span-4 bg-white border border-red-100 p-5 rounded-2xl shadow-xs text-center space-y-3">
                      <span className="text-[9px] font-mono tracking-widest text-[#8B0000] font-black uppercase">Automated AI Quote</span>
                      <div className="space-y-1">
                        <p className="text-3xl font-black text-slate-900 font-display">{aiReport.priceEstimateRange}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">Calculated based on standard repair parameters in Vilnius region</p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setShowRequestModal(true);
                          setRequestForm(prev => ({
                            ...prev,
                            damageArea: aiReport.damageClass,
                            notes: `Drafting request matching AI report recommending: ${aiReport.recommendedServices.join(', ')}. Est: ${aiReport.priceEstimateRange}`
                          }));
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white w-full py-2 rounded-xl text-xs font-bold uppercase font-mono tracking-wider transition-all duration-200"
                      >
                        Send to Local Shops
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Text Query helper fallback for Custom Paint/Details */}
              <div className="bg-slate-50 border border-slate-205 rounded-2xl p-4 flex items-center gap-3">
                <Image className="w-5 h-5 text-red-650 shrink-0" />
                <p className="text-slate-500 font-medium text-xs">
                  Tip: Uploading clear pictures of scratch damages under direct Vilnius afternoon sunlight guarantees 94% price accuracy compared to physical garage quotes.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* 5. DYNAMIC INTERACTIVE BOOK MODAL PANEL */}
      {typeof document !== 'undefined' && activeBookingShop && createPortal(
        <AnimatePresence>
          <div className="fixed inset-0 flex items-center justify-center p-3 z-[1001] pointer-events-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveBookingShop(null)}
              className="absolute inset-0 bg-slate-950/45 backdrop-blur-md cursor-pointer"
            />

            {/* Minimalist Centered Modal Card */}
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 12 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="bg-white rounded-xl border-t-4 border-[#8B0000] border-x border-b border-rose-100 max-w-md w-full p-4 text-left shadow-2xl space-y-3 relative overflow-hidden z-[1002]"
            >
              <div className="flex justify-between items-start pb-2.5 border-b border-slate-100">
                <div className="text-left">
                  <span className="text-[8px] font-black uppercase text-[#8B0000] font-mono tracking-widest">Priority Oven Reservation</span>
                  <h3 className="font-extrabold text-slate-900 text-sm leading-tight mt-0.5">Book Service: {activeBookingShop.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveBookingShop(null)}
                  className="p-1 rounded bg-slate-50 text-slate-400 hover:text-[#8B0000] transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {bookingSuccess ? (
                <div className="py-8 text-center space-y-3.5 font-mono">
                  <div className="w-12 h-12 bg-rose-50 border border-red-100/50 rounded-full flex items-center justify-center text-[#8B0000] mx-auto">
                    <CheckCircle className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-tight">Booking successfully received!</h4>
                    <p className="text-slate-500 text-[10px] max-w-xs mx-auto mt-1 normal-case font-sans leading-relaxed">
                      We locked in your slot on <b>{bookingFormData.date}</b> at <b>{bookingFormData.time}</b>. Direct authorization coordinates sent to <b>footwearsandcares@gmail.com</b>.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveBookingShop(null)}
                    className="bg-[#8B0000] hover:bg-red-700 text-white text-[10px] font-bold py-1.5 px-5 rounded cursor-pointer uppercase transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingCompleted} className="space-y-3 text-left">
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-0.5">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono">Preferred Date</label>
                      <input
                        type="date"
                        value={bookingFormData.date}
                        onChange={(e) => setBookingFormData({...bookingFormData, date: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-855 text-[10.5px] font-mono font-bold rounded px-2 py-1.5 focus:outline-hidden"
                        required
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono">Oven Slot Time</label>
                      <select
                        value={bookingFormData.time}
                        onChange={(e) => setBookingFormData({...bookingFormData, time: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-855 text-[10.5px] font-mono font-bold rounded px-2 py-1.5 outline-none focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000]"
                      >
                        <option value="08:00">08:00 (Early Intake)</option>
                        <option value="10:00">10:00 (Pre-bake slot)</option>
                        <option value="13:30">13:30 (Afternoon oven)</option>
                        <option value="16:00">16:00 (Night shift bake)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-0.5">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono">Vehicle Brand</label>
                      <input
                        type="text"
                        value={bookingFormData.vehicleBrand}
                        onChange={(e) => setBookingFormData({...bookingFormData, vehicleBrand: e.target.value})}
                        placeholder="e.g. BMW 530d"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-855 text-[10.5px] font-mono font-bold rounded px-2 py-1.5 focus:outline-hidden"
                        required
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono">Aesthetic Service</label>
                      <select
                        value={bookingFormData.serviceType}
                        onChange={(e) => setBookingFormData({...bookingFormData, serviceType: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-855 text-[10.5px] font-mono font-bold rounded px-2 py-1.5 outline-none focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000]"
                      >
                        {activeBookingShop.services.map((svc) => (
                          <option key={svc} value={svc}>{svc}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono">Custom Color Code (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. BMW Alpinweiss 300 or PPG-908"
                      value={bookingFormData.colorCode}
                      onChange={(e) => setBookingFormData({...bookingFormData, colorCode: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-855 text-[10.5px] font-mono font-bold rounded px-2 py-1.5 focus:outline-hidden focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000]"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono">Special Damage notes</label>
                    <textarea
                      placeholder="Describe deep surface scrapes, dent parameters..."
                      value={bookingFormData.notes}
                      onChange={(e) => setBookingFormData({...bookingFormData, notes: e.target.value})}
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-855 text-[10.5px] font-semibold rounded p-2 placeholder-slate-400 focus:outline-hidden focus:border-[#8B0000] focus:ring-1 focus:ring-[#8B0000]"
                    ></textarea>
                  </div>

                  <div className="bg-red-50/40 p-2.5 rounded border border-red-100/50 flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#8B0000] shrink-0 mt-0.5" />
                    <span className="text-[9px] text-slate-500 font-medium leading-relaxed font-sans">
                      Important: For insurance/claims repairs, please present your claim adjuster docket during slot intake for direct-to-carrier payment setup.
                    </span>
                  </div>

                  <div className="pt-1 flex gap-2 font-mono text-[10px]">
                    <button
                      type="button"
                      onClick={() => setActiveBookingShop(null)}
                      className="w-1/2 bg-slate-100 hover:bg-slate-150 text-slate-600 rounded py-1.5 font-bold cursor-pointer transition-colors border border-slate-200/50 text-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 bg-[#8B0000] hover:bg-red-700 text-white rounded py-2 font-bold cursor-pointer tracking-wider transition-all hover:shadow-md hover:shadow-red-500/10 active:scale-[98%] text-center"
                    >
                      Book Free Slot
                    </button>
                  </div>

                </form>
              )}

            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}

      {/* 6. CREATE REPAIR REQUEST COLLISION FORM MODAL */}
      <AnimatePresence>
        {showRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden border border-slate-100 shadow-2xl p-6"
            >
              <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                <div className="text-left">
                  <span className="text-[9px] font-bold uppercase text-red-600 font-mono tracking-wider">Multi-Shop Quote Engine</span>
                  <h3 className="font-extrabold text-slate-900 text-lg">Create Paint Repair Request</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="p-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {requestSubmitted ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
                    <CheckCircle className="w-8 h-8 stroke-[2]" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">Request broadcasted successfully!</h4>
                    <p className="text-slate-500 text-xs mt-1">
                      Painters in the Savanorių pr. and Vilnius zones are verifying claims criteria. We will submit their custom bid proposals securely.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="bg-red-600 hover:bg-red-700 font-extrabold text-white text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider"
                  >
                    Return to Listing
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRequestFormSubmission} className="space-y-4 pt-4 text-left">
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-[#8B0000] uppercase tracking-widest font-mono">Vehicle Brand & Year</label>
                      <input
                        type="text"
                        placeholder="e.g. Audi A6 2021"
                        value={requestForm.carModel}
                        onChange={(e) => setRequestForm({...requestForm, carModel: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold p-3 rounded-xl"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-[#8B0000] uppercase tracking-widest font-mono">Custom Paint Code</label>
                      <input
                        type="text"
                        placeholder="e.g. LY9B Brilliant Black"
                        value={requestForm.customColorCode}
                        onChange={(e) => setRequestForm({...requestForm, customColorCode: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold p-3 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-[#8B0000] uppercase tracking-widest font-mono">Atypical Damage Region</label>
                      <select
                        value={requestForm.damageArea}
                        onChange={(e) => setRequestForm({...requestForm, damageArea: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold p-3 rounded-xl cursor-pointer"
                      >
                        <option value="Front Bumper Scuff">Front Bumper Scuff</option>
                        <option value="Deep Rear Fender Scratch">Deep Rear Fender Scratch</option>
                        <option value="Full Hood Color Spray">Full Hood Color Spray</option>
                        <option value="Roof Oxidation Repair">Roof Oxidation Repair</option>
                        <option value="Custom Body kit repaint">Custom Body kit repaint</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-[#8B0000] uppercase tracking-widest font-mono">Is Accident Claim / Insurance?</label>
                      <select
                        value={requestForm.isWithInsurance}
                        onChange={(e) => setRequestForm({...requestForm, isWithInsurance: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold p-3 rounded-xl cursor-pointer"
                      >
                        <option value="yes">Yes (Authorized carrier direct pay)</option>
                        <option value="no">No (Private custom repaint)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">Notes/Specialized requirements</label>
                    <textarea
                      value={requestForm.notes}
                      onChange={(e) => setRequestForm({...requestForm, notes: e.target.value})}
                      placeholder="Add parameters like clearcoat thickness desires, metalwork straightening, direct phone contact details..."
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold p-3 rounded-xl"
                    ></textarea>
                  </div>

                  <div className="pt-2 flex justify-end gap-3 text-xs font-extrabold uppercase">
                    <button
                      type="button"
                      onClick={() => setShowRequestModal(false)}
                      className="px-4 py-3 bg-slate-104 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-mono shadow-xs"
                    >
                      Broadcast Custom Request
                    </button>
                  </div>

                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. DETAILED PROFILE STANDALONE VIEW SYSTEM */}
      <AnimatePresence>
        {viewingProfile && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-[#F5F5F7] flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.25 }}
              className="w-full min-h-screen bg-[#F5F5F7] relative flex flex-col"
            >
              <ServiceProfileDetails info={viewingProfile} onClose={() => setViewingProfile(null)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

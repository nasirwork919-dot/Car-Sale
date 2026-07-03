import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, MapPin, SlidersHorizontal, Sparkles, Star, ArrowRight, Lock, 
  MessageSquare, Send, Calendar, X, ChevronDown, ChevronUp, CheckCircle, 
  Clock, Compass, Filter, ShieldCheck, Award, Languages, Wrench, Map, 
  Grid, ChevronRight, Play, AlertTriangle, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ServiceProfileDetails from './ServiceProfileDetails';

// Static seed data for Mechanics
interface Mechanic {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  specialties: string[];
  certifications: string[];
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

const MECHANICS_DATA: Mechanic[] = [
  {
    id: 'mech-1',
    name: 'Gediminas Performance Autoworks',
    rating: 4.9,
    reviewsCount: 142,
    specialties: ['engine repair', 'diagnostics', 'ev repair'],
    certifications: ['ASE Certified', 'Master Mechanic', 'EV Certified'],
    brands: ['BMW', 'Tesla', 'Audi'],
    languages: ['English', 'Lithuanian', 'Russian'],
    availability: 'open_now',
    distance: 1.2,
    priceLevel: 3,
    image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=600',
    address: 'Gedimino pr. 45, Vilnius 01109',
    phone: '+370 5 212 3456',
    workingHours: '08:00 - 20:00 (Open Now)',
    description: 'Premier high-performance tuning, electrical trouble diagnostics, and comprehensive electric vehicle drivetrain repairs for modern European and US imports.',
    coords: { lat: 54.6896, lng: 25.2699 }
  },
  {
    id: 'mech-2',
    name: 'Vilnius Brake & General Service',
    rating: 4.7,
    reviewsCount: 89,
    specialties: ['brakes', 'general service'],
    certifications: ['ASE Certified'],
    brands: ['Toyota', 'Honda', 'Ford', 'Audi'],
    languages: ['English', 'Lithuanian'],
    availability: 'today',
    distance: 2.8,
    priceLevel: 1,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=600',
    address: 'Savanorių pr. 124, Vilnius 03150',
    phone: '+370 5 234 5678',
    workingHours: '09:00 - 18:00 (Closes in 3 hours)',
    description: 'Your trustworthy neighborhood mechanic specializing in affordable disc rotor machining, brake fluid flushes, mechanical inspections, and routine oil changes.',
    coords: { lat: 54.6654, lng: 25.2289 }
  },
  {
    id: 'mech-3',
    name: 'Kaunas Precision Motors',
    rating: 4.8,
    reviewsCount: 115,
    specialties: ['engine repair', 'diagnostics'],
    certifications: ['Master Mechanic', 'OEM Certified'],
    brands: ['BMW', 'Audi'],
    languages: ['English', 'Lithuanian', 'Spanish'],
    availability: 'this_week',
    distance: 5.4,
    priceLevel: 2,
    image: 'https://images.unsplash.com/photo-1505250469615-ac1ae4774676?auto=format&fit=crop&q=80&w=600',
    address: 'Karaliaus Mindaugo pr. 50, Kaunas 44333',
    phone: '+370 37 444 555',
    workingHours: 'Currently Closed (Starts 09:00 Tomorrow)',
    description: 'Specialists in intensive multi-point motor re-boring, cylinder head repairs, cooling system pressure tests, and digital dashboard re-calibrations.',
    coords: { lat: 54.8943, lng: 23.9184 }
  },
  {
    id: 'mech-4',
    name: 'Klaipėda GreenVolt EV Hub',
    rating: 4.9,
    reviewsCount: 42,
    specialties: ['ev repair', 'diagnostics', 'general service'],
    certifications: ['EV Certified', 'OEM Certified'],
    brands: ['Tesla', 'BMW'],
    languages: ['English', 'Lithuanian', 'Russian'],
    availability: 'open_now',
    distance: 3.5,
    priceLevel: 2,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600',
    address: 'Taikos pr. 88, Klaipėda 93155',
    phone: '+370 46 999 888',
    workingHours: '08:00 - 19:00 (Open Now)',
    description: 'Advanced low-voltage cells diagnostics, battery management controller tuning, and electric AC unit maintenance. Dedicated 100% to sustainable EV and hybrid platforms.',
    coords: { lat: 55.6989, lng: 21.1611 }
  },
  {
    id: 'mech-5',
    name: 'Baltic Diesel & Transmission Experts',
    rating: 4.5,
    reviewsCount: 76,
    specialties: ['engine repair', 'brakes', 'general service'],
    certifications: ['ASE Certified'],
    brands: ['Ford', 'Toyota'],
    languages: ['Lithuanian', 'Russian'],
    availability: 'open_now',
    distance: 8.1,
    priceLevel: 2,
    image: 'https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?auto=format&fit=crop&q=80&w=600',
    address: 'Zarasų g. 12, Vilnius 01205',
    phone: '+370 5 999 1111',
    workingHours: '08:00 - 17:00 (Open Now)',
    description: 'Expert diagnostics for light commercial vans, heavy duty transmissions, mechanical transfers, heavy common-rail direct injectors, and turbos structural overhauls.',
    coords: { lat: 54.6780, lng: 25.3110 }
  },
  {
    id: 'mech-6',
    name: 'Vytis Auto Care & Tuning',
    rating: 4.6,
    reviewsCount: 63,
    specialties: ['general service', 'brakes', 'diagnostics'],
    certifications: ['ASE Certified', 'Master Mechanic'],
    brands: ['Honda', 'Toyota', 'Ford', 'BMW'],
    languages: ['English', 'Lithuanian'],
    availability: 'this_week',
    distance: 12.0,
    priceLevel: 1,
    image: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&q=80&w=600',
    address: 'Pramonės pr. 16, Kaunas 51327',
    phone: '+370 37 222 333',
    workingHours: 'Closed Today (By Appointment only)',
    description: 'Professional vehicle restoration, suspension alignment setups, general maintenance service logs, wheel alignment audits, and brake rotor maintenance programs.',
    coords: { lat: 54.9120, lng: 24.0040 }
  }
];

export default function FindMechanicSection() {
  // Navigation & Primary Layout State
  const [mapMode, setMapMode] = useState<boolean>(false);
  const [searchCity, setSearchCity] = useState<string>('Vilnius, Lithuania');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Sorting
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'price_low' | 'price_high'>('distance');

  // Filters State
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);

  // Responsive Collision Sidebar
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Interactive Bookings Modal State
  const [bookingMechanic, setBookingMechanic] = useState<Mechanic | null>(null);
  const [bookingFormData, setBookingFormData] = useState({
    date: '2026-06-16',
    time: '10:00',
    vehicleBrand: 'BMW',
    issueType: 'general service',
    notes: ''
  });
  const [bookingCompleted, setBookingCompleted] = useState<boolean>(false);

  // Prevent background scrolling when booking modal is active
  useEffect(() => {
    if (bookingMechanic) {
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
  }, [bookingMechanic]);

  // Profile Drawer / Modal State
  const [viewingProfile, setViewingProfile] = useState<Mechanic | null>(null);

  // Sticky CTA Repair Request form states
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [requestStep, setRequestStep] = useState<number>(1);
  const [requestForm, setRequestForm] = useState({
    brand: '',
    year: '2019',
    category: 'engine repair',
    description: '',
    urgency: 'routine',
    email: 'footwearsandcares@gmail.com'
  });
  const [requestSubmitted, setRequestSubmitted] = useState<boolean>(false);

  // AI Assistant Chat Drawer states
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; timestamp: Date }>>([
    {
      sender: 'ai',
      text: "Hello! I am your AI Automotive Service Assistant. Describe your vehicle's noise, leak, or dashboard warnings, and I will recommend the absolute best mechanics for your specific model and issue.",
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Quick helper reset filters
  const resetFilters = () => {
    setSelectedSpecialties([]);
    setSelectedCertifications([]);
    setSelectedBrands([]);
    setSelectedLanguages([]);
    setSelectedAvailability('all');
    setMinRating(0);
  };

  // Geo Location trigger
  const handleUseMyLocation = () => {
    setSearchCity('Vilnius (Detected Location)');
    // Display sweet interactive feedback
    const toastMessage = document.createElement('div');
    toastMessage.className = "fixed bottom-20 left-1/2 -translate-x-1/2 z-[200] bg-zinc-900 text-white text-xs font-mono px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-zinc-800 animate-bounce";
    toastMessage.innerHTML = "🎯 Accuracy calibrating... set center to Savanorių pr., Vilnius";
    document.body.appendChild(toastMessage);
    setTimeout(() => toastMessage.remove(), 2500);
  };

  // Filter & Sort Logic
  const filteredAndSortedMechanics = useMemo(() => {
    let result = [...MECHANICS_DATA];

    // Filter by Keyword
    if (searchKeyword.trim()) {
      const kw = searchKeyword.toLowerCase();
      result = result.filter(m => 
        m.name.toLowerCase().includes(kw) || 
        m.specialties.some(s => s.toLowerCase().includes(kw)) ||
        m.description.toLowerCase().includes(kw) ||
        m.certifications.some(c => c.toLowerCase().includes(kw))
      );
    }

    // Filter by Specialty
    if (selectedSpecialties.length > 0) {
      result = result.filter(m => 
        selectedSpecialties.some(spec => m.specialties.includes(spec.toLowerCase()))
      );
    }

    // Filter by Certifications
    if (selectedCertifications.length > 0) {
      result = result.filter(m => 
        selectedCertifications.some(cert => m.certifications.includes(cert))
      );
    }

    // Filter by Brands
    if (selectedBrands.length > 0) {
      result = result.filter(m => 
        selectedBrands.some(brand => m.brands.includes(brand))
      );
    }

    // Filter by Languages
    if (selectedLanguages.length > 0) {
      result = result.filter(m => 
        selectedLanguages.some(lang => m.languages.includes(lang))
      );
    }

    // Filter by Availability
    if (selectedAvailability !== 'all') {
      result = result.filter(m => m.availability === selectedAvailability);
    }

    // Filter by Min Rating
    if (minRating > 0) {
      result = result.filter(m => m.rating >= minRating);
    }

    // Apply Sorting
    result.sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price_low') return a.priceLevel - b.priceLevel;
      if (sortBy === 'price_high') return b.priceLevel - a.priceLevel;
      return 0;
    });

    return result;
  }, [
    searchKeyword, selectedSpecialties, selectedCertifications, 
    selectedBrands, selectedLanguages, selectedAvailability, minRating, sortBy
  ]);

  // AI chat answering script
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg, timestamp: new Date() }]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let responseText = "Based on your description, I suggest having a complete diagnostic scan to prevent mechanical failure. Let's look at who can assist:";
      const inputLower = userMsg.toLowerCase();

      if (inputLower.includes('ev') || inputLower.includes('tesla') || inputLower.includes('battery') || inputLower.includes('electrical')) {
        responseText = "Sounds like an electric drivetrain or battery management concern. I highly recommend **Gediminas Performance Autoworks** (Master EV certified, 1.2 km away) or **Klaipėda GreenVolt EV Hub**. They possess specialized high-voltage insulation test rigs and factory OEM diagnostic tools.";
      } else if (inputLower.includes('brake') || inputLower.includes('squeak') || inputLower.includes('wheel') || inputLower.includes('suspension')) {
        responseText = "A squeaking noise or soft pedal feel points to worn brake friction liners or hydraulic fluid oxidation. **Vilnius Brake & General Service** has express booking slots today for rotor machining and caliper re-greasing starting at highly competitive rates.";
      } else if (inputLower.includes('engine') || inputLower.includes('smoke') || inputLower.includes('oil') || inputLower.includes('leak') || inputLower.includes('cylinder')) {
        responseText = "Fluid leakages or colored tailpipe emissions could mean dynamic cylinder head gasket wear or a blocked PCV valve. **Kaunas Precision Motors** (OEM certified motor machining) represents your safest option to carry out a pressurized thermal compression check.";
      } else {
        responseText = "That sounds like a mechanical anomaly that requires professional diagnosis. I have filtered our list to show mechanics like **Gediminas Performance Autoworks** who support comprehensive digital system scans and hold ASE Master credentials.";
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: responseText, timestamp: new Date() }]);
      setIsTyping(false);
    }, 1500);
  };

  // Submit repair request
  const handleCreateRepairRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitted(true);
    setTimeout(() => {
      setShowRequestModal(false);
      setRequestSubmitted(false);
      setRequestStep(1);
      // Popup success notification
      const okToast = document.createElement('div');
      okToast.className = "fixed bottom-10 right-10 z-[100] bg-emerald-600 text-white text-xs font-bold px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300";
      okToast.innerHTML = `🛡️ <b>Repair request generated! Ready to receive offers from mechanics near you</b>`;
      document.body.appendChild(okToast);
      setTimeout(() => okToast.remove(), 4000);
    }, 2000);
  };

  // Handle finalize Book Now
  const handleFinalizeBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingCompleted(true);
    setTimeout(() => {
      setBookingMechanic(null);
      setBookingCompleted(false);
      // Popup alert
      const successToast = document.createElement('div');
      successToast.className = "fixed bottom-10 right-10 z-[100] bg-zinc-900 border border-zinc-800 text-white text-xs font-bold px-6 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-3 animate-in fade-in duration-300";
      successToast.innerHTML = `🎉 <b>Booking Confirmed! You are scheduled. We emailed details to footwearsandcares@gmail.com</b>`;
      document.body.appendChild(successToast);
      setTimeout(() => successToast.remove(), 5000);
    }, 2500);
  };

  return (
    <div className="bg-[#F5F5F7] min-h-screen text-slate-800 text-left font-sans leading-relaxed relative">
      
      {/* 1. HEADER SECTION CONTAINER */}
      <div className="bg-white border-b border-slate-250 py-8 md:py-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            
            {/* Title & Subtitle block */}
            <div className="space-y-2">
              <h1 id="find-mechanics-heading" className="text-3xl font-bold tracking-tight text-slate-900 mt-1 font-sans">
                Find Trusted Mechanics Near You
              </h1>
            </div>

            {/* Map View / Grid Toggle on the right */}
            <div className="flex items-center shrink-0">
              <div className="bg-white p-1 rounded-xl shadow-xs border border-slate-200/50 flex items-center gap-1">
                <button
                  onClick={() => setMapMode(false)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold tracking-tight transition-all duration-300 flex items-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5 ${
                    !mapMode ? 'bg-[#8B0000] text-white shadow-sm hover:bg-[#4A4A4A]' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Grid Listing</span>
                </button>
                <button
                  onClick={() => setMapMode(true)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold tracking-tight transition-all duration-300 flex items-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5 ${
                    mapMode ? 'bg-[#8B0000] text-white shadow-sm hover:bg-[#4A4A4A]' : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>Interactive Map</span>
                </button>
              </div>
            </div>

          </div>

          {/* Location search bar - city/region input + Use My Location button */}
          <div className="mt-8 bg-slate-100/90 border border-slate-200/80 rounded-2xl p-3 max-w-3xl flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full flex-1">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-650" />
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Enter city, region, or zip..."
                className="w-full bg-white text-slate-900 text-xs font-bold rounded-xl pl-10 pr-4 py-3 placeholder-slate-400 border border-slate-205 focus:outline-hidden focus:ring-1 focus:ring-red-600 focus:border-red-600"
              />
            </div>
            
            <button
              onClick={handleUseMyLocation}
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-[11px] tracking-tight uppercase px-4 py-3 border border-slate-205 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Compass className="w-4 h-4 text-red-600 animate-spin-slow" />
              <span>Use My Location</span>
            </button>

            <div className="h-4 w-[1px] bg-slate-250 hidden sm:block"></div>

            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search specialty, brand..."
                className="w-full bg-white text-slate-900 text-xs font-bold rounded-xl pl-9 pr-3 py-3 placeholder-slate-400 border border-slate-205 focus:outline-hidden focus:ring-1 focus:ring-red-600"
              />
            </div>
          </div>

        </div>
      </div>

      {/* PRIMARY PAGE STRUCTURE LAYER */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        
        {/* COLLAPSIBLE MOBILE FILTER PILL TRIGGER */}
        <div className="flex md:hidden items-center justify-between mb-4 bg-white p-3 rounded-xl border border-slate-205">
          <span className="text-xs font-extrabold text-slate-800 uppercase tracking-widest font-mono">Filter Mechanic Profiles</span>
          <button
            onClick={() => setSidebarOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters ({selectedSpecialties.length + selectedCertifications.length + selectedBrands.length + selectedLanguages.length})</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* 2. FILTERS SIDEBAR (collapsible on mobile, left) */}
          <div className={`
            fixed inset-0 z-50 bg-black/60 md:static md:bg-transparent md:z-10 md:block transition-all duration-300
            ${sidebarOpen ? 'block' : 'hidden'}
          `}>
            <div className="bg-white md:bg-transparent w-80 md:w-auto h-full md:h-auto overflow-y-auto md:overflow-visible p-6 md:p-0 border-r border-slate-200 md:border-r-0 float-left md:float-none space-y-6">
              
              {/* Sidebar Header for Mobile Only */}
              <div className="flex items-center justify-between md:hidden pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm uppercase">
                  <Filter className="w-4 h-4 text-red-650" />
                  <span>Refine Mechanics</span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-full bg-slate-100 text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Sidebar filter components */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6 shadow-xs text-left">
                
                {/* Title & Reset filters link */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-extrabold text-[#8B0000] text-[13px] uppercase tracking-wider flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4 text-red-600" /> Filtering Panel
                  </span>
                  <button
                    onClick={resetFilters}
                    className="text-[10px] text-red-650 hover:underline font-extrabold tracking-tight uppercase"
                  >
                    Clear All
                  </button>
                </div>

                {/* Filter 1: Specialization */}
                <div className="space-y-2.5">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Specialization</h4>
                  <div className="space-y-2">
                    {['Engine Repair', 'Brakes', 'Diagnostics', 'EV Repair', 'General Service'].map((spec) => {
                      const lower = spec.toLowerCase();
                      const active = selectedSpecialties.includes(lower);
                      return (
                        <label key={spec} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900 select-none">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => {
                              setSelectedSpecialties(prev => 
                                active ? prev.filter(s => s !== lower) : [...prev, lower]
                              );
                            }}
                            className="w-4 h-4 rounded-sm accent-red-650"
                          />
                          <span>{spec}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Filter 2: Certifications */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Certifications</h4>
                  <div className="space-y-2">
                    {['ASE Certified', 'Master Mechanic', 'OEM Certified', 'EV Certified'].map((cert) => {
                      const active = selectedCertifications.includes(cert);
                      return (
                        <label key={cert} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900 select-none">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => {
                              setSelectedCertifications(prev => 
                                active ? prev.filter(c => c !== cert) : [...prev, cert]
                              );
                            }}
                            className="w-4 h-4 rounded-sm accent-red-650"
                          />
                          <span>{cert}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Filter 3: Supported Brands */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Supported Brands</h4>
                  <div className="space-y-2">
                    {['Toyota', 'BMW', 'Audi', 'Ford', 'Tesla', 'Honda'].map((brand) => {
                      const active = selectedBrands.includes(brand);
                      return (
                        <label key={brand} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900 select-none">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => {
                              setSelectedBrands(prev => 
                                active ? prev.filter(b => b !== brand) : [...prev, brand]
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

                {/* Filter 4: Languages Spoken */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Languages</h4>
                  <div className="space-y-2">
                    {['English', 'Spanish', 'Lithuanian', 'Russian'].map((lang) => {
                      const active = selectedLanguages.includes(lang);
                      return (
                        <label key={lang} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900 select-none">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => {
                              setSelectedLanguages(prev => 
                                active ? prev.filter(l => l !== lang) : [...prev, lang]
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

                {/* Filter 5: Availability */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Availability</h4>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { id: 'all', name: 'Any Availability' },
                      { id: 'open_now', name: 'Open Now' },
                      { id: 'today', name: 'Today' },
                      { id: 'this_week', name: 'This Week' }
                    ].map((avail) => (
                      <label key={avail.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none'>">
                        <input
                          type="radio"
                          name="availability"
                          checked={selectedAvailability === avail.id}
                          onChange={() => setSelectedAvailability(avail.id)}
                          className="w-4 h-4 accent-red-650"
                        />
                        <span>{avail.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filter 6: Rating Limit */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Minimum Rating</h4>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { id: 0, label: 'All Ratings' },
                      { id: 4.5, label: '4.5+ Stars ⭐' },
                      { id: 4.8, label: '4.8+ Stars ⭐' }
                    ].map((item) => (
                      <label key={item.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="rating_val"
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

          {/* MAIN COLUMN CONTAINER */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* GRID FILTER SORT BLOCK */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="text-left">
                <span className="text-[10px] font-extrabold uppercase font-mono tracking-wider text-slate-400 block">Filtered Outcomes</span>
                <span className="font-black text-slate-900 text-sm">{filteredAndSortedMechanics.length} trusted mechanics found</span>
              </div>

              {/* Sorting triggers */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider shrink-0">Sort By</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-55 bg-slate-50 border border-slate-205 text-slate-800 text-xs font-bold rounded-lg px-3 py-2 cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-red-600"
                >
                  <option value="distance">Distance (Nearest First)</option>
                  <option value="rating">Reviews Rating (Highest First)</option>
                  <option value="price_low">Service Pricing (Low to High)</option>
                  <option value="price_high">Service Pricing (High to Low)</option>
                </select>
              </div>
            </div>

            {/* ERROR SCRATCH IF ZERO ALIGNED */}
            {filteredAndSortedMechanics.length === 0 && (
              <div className="py-20 text-center space-y-4 bg-white border border-slate-200 rounded-3xl p-6">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto border border-amber-100">
                  <ShieldAlert className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <p className="text-slate-900 font-bold text-sm">No specialized mechanic match found</p>
                  <p className="text-slate-400 text-xs max-w-sm mx-auto">Try lowering your minimum rating or clearing filters to discover Vilnius best mechanics.</p>
                </div>
                <button
                  onClick={resetFilters}
                  className="bg-red-650 hover:bg-red-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider"
                >
                  Reset Active Filters
                </button>
              </div>
            )}

            {/* MAP LAYOUT OR GRID LAYOUT */}
            {mapMode ? (
              
              /* SIMULATED MAP INTERACTION SECTION */
              <div className="bg-zinc-900 rounded-3xl h-[550px] relative overflow-hidden border border-zinc-800 shadow-xl">
                
                {/* Simulated Map Canvas Background */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] bg-zinc-950">
                  
                  {/* Vilnius Castle Hill Sim Grid lines */}
                  <div className="absolute inset-x-0 top-1/2 h-[1px] bg-red-600/30"></div>
                  <div className="absolute inset-y-0 left-1/3 w-[1px] bg-red-600/30 font-mono text-[9px] text-zinc-650 p-2">Savanorių pr.</div>
                  <div className="absolute inset-y-0 left-2/3 w-[1px] bg-red-600/30 font-mono text-[9px] text-zinc-650 p-2">Gedimino pr.</div>

                  {/* Draw simulated pins */}
                  {filteredAndSortedMechanics.map((mech, index) => (
                    <motion.div
                      key={mech.id}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity, delay: index * 0.4 }}
                      style={{
                        position: 'absolute',
                        top: `${30 + (index * 12) % 60}%`,
                        left: `${20 + (index * 15) % 70}%`
                      }}
                      className="group cursor-pointer"
                      onClick={() => setViewingProfile(mech)}
                    >
                      <div className="relative">
                        <div className="absolute -inset-2 bg-red-650/40 rounded-full blur-xs animate-ping"></div>
                        <div className="bg-red-600 border-2 border-white text-white rounded-full p-2.5 shadow-xl font-bold text-xs flex items-center justify-center relative">
                          <MapPin className="w-4 h-4" />
                          <span className="hidden group-hover:block ml-1 text-[10px] uppercase font-mono max-w-[120px] truncate">{mech.name}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Left Floating Info Overlay */}
                <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 p-4 max-w-xs shadow-2xl text-left hidden sm:block">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-widest font-mono mb-1">
                    <Compass className="w-3.5 h-3.5" />
                    <span>Active Map Radar</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    Pinpointing nearest certified garages in Vilnius. Select a localized pin to inspect certifications and book immediately.
                  </p>
                  <div className="mt-3 text-[10px] bg-slate-100 text-slate-700 p-2 rounded-lg font-mono">
                    Center: 54.6896° N, 25.2799° E
                  </div>
                </div>

                {/* Bottom Horizontal Quick Mechanics scroller */}
                <div className="absolute bottom-4 inset-x-4 z-10 flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {filteredAndSortedMechanics.map((mech) => (
                    <div
                      key={mech.id}
                      onClick={() => setViewingProfile(mech)}
                      className="bg-white/95 backdrop-blur-md hover:bg-white rounded-2xl border border-slate-200 p-3 min-w-[260px] max-w-[280px] shadow-2xl flex gap-3 items-center cursor-pointer transition-all active:scale-[0.98]"
                    >
                      <img
                        src={mech.image}
                        alt={mech.name}
                        className="w-12 h-12 rounded-xl object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0 flex-1 text-left">
                        <div className="flex items-center gap-1">
                          <span className="font-extrabold text-slate-900 text-xs truncate">{mech.name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                          <Star className="w-3 h-3 fill-amber-500" />
                          <span>{mech.rating}</span>
                          <span className="text-slate-400">({mech.reviewsCount})</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold block">{mech.distance} km from you</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  ))}
                </div>

              </div>

            ) : (

              /* GRID OF MECHANIC BUSINESS CARDS */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredAndSortedMechanics.map((mech) => (
                  <motion.div
                    key={mech.id}
                    layoutId={`mech-card-${mech.id}`}
                    className="bg-[#FFFFFF] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between border border-slate-100"
                  >
                    <div className="cursor-pointer" onClick={() => setViewingProfile(mech)}>
                      {/* Polished flat rectangular showcase image block on top — completely clean */}
                      <div className="w-full h-40 overflow-hidden relative">
                        <img
                          src={mech.image}
                          alt={mech.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Typography Block */}
                      <div className="p-4 space-y-2">
                        <div className="flex justify-between items-start gap-1">
                          <h3 className="font-sans font-bold text-slate-900 text-sm tracking-tight leading-tight line-clamp-2">
                            {mech.name}
                          </h3>
                          <div className="text-amber-500 font-bold text-xs shrink-0 flex items-center gap-0.5">
                            ★ <span className="text-slate-800 font-medium text-[10px]">{mech.rating}</span>
                          </div>
                        </div>

                        {/* Core Sub-text Details - Only simple clean text metadata lines below header */}
                        <div className="space-y-1 text-[11px] text-slate-500 font-normal">
                          <div className="line-clamp-1">{mech.address}</div>
                          <div>Hours: {mech.workingHours || "08:00 - 18:00"}</div>
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
                        €{mech.minPrice || (mech.priceLevel ? mech.priceLevel * 45 : 120)}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setBookingMechanic(mech);
                          setBookingFormData(prev => ({
                            ...prev, 
                            issueType: mech.specialties[0] || 'general service'
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

            {/* 3. STICKY CTA BANNER MID-PAGE */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl text-left flex flex-col md:flex-row gap-6 justify-between items-start md:items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10 font-black text-8xl pointer-events-none select-none font-mono">
                OFFERS
              </div>
              <div className="space-y-2 relative z-10">
                <div className="bg-white/10 text-white border border-white/20 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider block w-fit mb-1">
                  Save on repairs
                </div>
                <h3 className="font-extrabold text-white text-lg md:text-xl tracking-tight leading-snug">
                  Have a repair issue?
                </h3>
                <p className="text-white/80 text-xs max-w-xl font-medium">
                  Create a Repair Request and get competitive customized offers from certified mechanics near you with upfront transparent price metrics.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowRequestModal(true);
                  setRequestStep(1);
                }}
                className="bg-white text-red-750 hover:bg-neutral-50 px-6 py-3 rounded-xl text-xs font-black transition-all active:scale-[0.98] uppercase tracking-wider font-mono shadow-md shrink-0 cursor-pointer text-red-600"
              >
                Create Repair Request
              </button>
            </div>

          </div>

        </div>

      </div>



      {/* 5. INTERACTIVE BOOK NOW DIALOG MODAL */}
      {typeof document !== 'undefined' && bookingMechanic && createPortal(
        <AnimatePresence>
          <div className="fixed inset-0 flex items-center justify-center p-3 z-[1001] pointer-events-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setBookingMechanic(null)}
              className="absolute inset-0 bg-slate-950/45 backdrop-blur-md cursor-pointer"
            />

            {/* Minimalist Centered Modal Card */}
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 12 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="bg-white rounded-xl border border-slate-200 max-w-md w-full p-4 text-left shadow-2xl space-y-3 relative overflow-hidden z-[1002]"
            >
              
              {/* Header card details */}
              <div className="flex justify-between items-start pb-2.5 border-b border-slate-100">
                <div className="text-left">
                  <h3 className="font-extrabold text-slate-900 text-sm leading-tight mt-0.5">Book Service: {bookingMechanic.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setBookingMechanic(null)}
                  className="p-1 rounded bg-slate-50 text-slate-400 hover:text-[#B30000] transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Booking success screen */}
              {bookingCompleted ? (
                <div className="py-8 text-center space-y-3.5 font-mono">
                  <div className="w-12 h-12 bg-red-50 border border-[#B30000]/10 rounded-full flex items-center justify-center text-[#B30000] mx-auto">
                    <CheckCircle className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-tight">Booking request dispatched!</h4>
                    <p className="text-slate-500 text-[10px] max-w-xs mx-auto normal-case font-sans">
                      We aligned your slot on <b>{bookingFormData.date}</b> at <b>{bookingFormData.time}</b>. You will receive an SMS confirmation within an hour.
                    </p>
                  </div>
                  <div className="text-slate-400 text-[9px]">
                    Reference ID: RSVR-{Math.floor(Math.random() * 900000 + 100000)}
                  </div>
                </div>
              ) : (

                /* Interactive Booking Form structure */
                <form onSubmit={handleFinalizeBooking} className="space-y-3 text-left">
                  
                  {/* Vehicle details input */}
                  <div>
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1 font-mono">Select Brand</label>
                    <select
                      value={bookingFormData.vehicleBrand}
                      onChange={(e) => setBookingFormData(prev => ({ ...prev, vehicleBrand: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-850 text-[10.5px] font-mono font-bold rounded px-2.5 py-1.5 outline-none focus:border-[#B30000] focus:ring-1 focus:ring-[#B30000]"
                    >
                      <option value="BMW">BMW</option>
                      <option value="Audi">Audi</option>
                      <option value="Tesla">Tesla</option>
                      <option value="Toyota">Toyota</option>
                      <option value="Honda">Honda</option>
                      <option value="Ford">Ford</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Choose Date */}
                    <div>
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1 font-mono">Appointment Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="date"
                          value={bookingFormData.date}
                          onChange={(e) => setBookingFormData(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-855 text-[10.5px] font-mono font-bold rounded pl-8 pr-2 py-1.5 focus:outline-hidden focus:border-[#B30000] focus:ring-1 focus:ring-[#B30000]"
                          required
                        />
                      </div>
                    </div>

                    {/* Choose Time slot */}
                    <div>
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1 font-mono">Preferred Time</label>
                      <select
                        value={bookingFormData.time}
                        onChange={(e) => setBookingFormData(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-855 text-[10.5px] font-mono font-bold rounded px-2.5 py-1.5 outline-none focus:border-[#B30000] focus:ring-1 focus:ring-[#B30000]"
                      >
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:30">11:30 AM</option>
                        <option value="13:30">01:30 PM</option>
                        <option value="15:00">03:00 PM</option>
                        <option value="16:30">04:30 PM</option>
                      </select>
                    </div>
                  </div>

                  {/* Mechanical Issue dropdown */}
                  <div>
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1 font-mono">Mechanical Category</label>
                    <select
                      value={bookingFormData.issueType}
                      onChange={(e) => setBookingFormData(prev => ({ ...prev, issueType: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-855 text-[10.5px] font-mono font-bold rounded px-2.5 py-1.5 outline-none focus:border-[#B30000] focus:ring-1 focus:ring-[#B30000]"
                    >
                      <option value="engine repair">Engine Repair / Overhaul</option>
                      <option value="brakes">Brakes Installation</option>
                      <option value="diagnostics">Electrical Diagnostics</option>
                      <option value="ev repair">EV Battery Restoration</option>
                      <option value="general service">General Service inspection</option>
                    </select>
                  </div>

                  {/* Notes text input */}
                  <div>
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1 font-mono">Describe issues / warning signs</label>
                    <textarea
                      rows={2}
                      value={bookingFormData.notes}
                      onChange={(e) => setBookingFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="e.g. Squeaking noise under deceleration, Check Engine lamp..."
                      className="w-full bg-slate-50 border border-slate-200 text-slate-855 text-[10.5px] font-semibold rounded p-2 placeholder-slate-400 focus:outline-hidden focus:border-[#B30000] focus:ring-1 focus:ring-[#B30000]"
                    ></textarea>
                  </div>

                  {/* Pricing alert notice */}
                  <div className="bg-red-50/20 p-2.5 rounded-lg border border-[#B30000]/10 flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#B30000] shrink-0 mt-0.5" />
                    <span className="text-[9px] text-slate-500 font-medium leading-relaxed font-sans">
                      Booking through this Platform is strictly fee-free. Our certified technician will diagnose first and confirm all price points before repair.
                    </span>
                  </div>

                  {/* Actions submit buttons */}
                  <div className="flex gap-2 pt-1 font-mono text-[10px]">
                    <button
                      type="button"
                      onClick={() => setBookingMechanic(null)}
                      className="w-1/2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg py-1.5 font-bold border border-slate-200/50 cursor-pointer text-center"
                    >
                      Close Form
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 bg-[#B30000] hover:bg-[#4A4A4A] text-white rounded-lg py-2 font-bold cursor-pointer text-center tracking-wider transition-all duration-200 shadow-sm"
                    >
                      Confirm Booking
                    </button>
                  </div>

                </form>
              )}

            </motion.div>
          </div>
        </AnimatePresence>,
        document.body
      )}

      {/* 6. PROFILE MODAL VIEW SECTION */}
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

      {/* 7. REPAIR REQUEST GENERATOR DIALOG MODAL */}
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
                  <span className="text-[10px] font-black uppercase text-red-650 font-mono tracking-widest">Fast-Track Engine/Body Repair</span>
                  <h3 className="font-extrabold text-slate-900 text-lg">Create a Repair Request</h3>
                </div>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="p-1 rounded-full bg-slate-100 text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {requestSubmitted ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
                    <CheckCircle className="w-8 h-8 stroke-[2]" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-900 text-base">Request Dispatched!</h4>
                    <p className="text-slate-500 text-xs max-w-sm mx-auto">
                      All certified mechanics in Vilnius matching your car parameters will receive your request and offer competitive quotes directly to <b>{requestForm.email}</b>.
                    </p>
                  </div>
                </div>
              ) : (

                <form onSubmit={handleCreateRepairRequest} className="mt-4 space-y-4 text-left">
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Make & Brand</label>
                      <input
                        type="text"
                        placeholder="e.g. Audi A4"
                        value={requestForm.brand}
                        onChange={(e) => setRequestForm(p => ({ ...p, brand: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-205 text-slate-900 text-xs font-bold rounded-xl px-3.5 py-2.5 focus:outline-hidden"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Model Year</label>
                      <input
                        type="number"
                        min="1990"
                        max="2027"
                        value={requestForm.year}
                        onChange={(e) => setRequestForm(p => ({ ...p, year: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-205 text-slate-900 text-xs font-bold rounded-xl px-3.5 py-2.5 focus:outline-hidden"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Repair Category</label>
                    <select
                      value={requestForm.category}
                      onChange={(e) => setRequestForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-205 text-slate-900 text-xs font-bold rounded-xl px-3.5 py-2.5 focus:outline-hidden"
                    >
                      <option value="engine repair">Engine repair & fluids alignment</option>
                      <option value="brakes">Brakes rotor replace / pad installation</option>
                      <option value="diagnostics">Computer ECU scan & diagnostics</option>
                      <option value="ev repair">EV batteries alignment modules</option>
                      <option value="general service">Periodic diagnostics service log</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Explain the problem</label>
                    <textarea
                      rows={3}
                      placeholder="Give details about vehicle lights, sound frequency, fluid color or specific instructions..."
                      value={requestForm.description}
                      onChange={(e) => setRequestForm(p => ({ ...p, description: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-205 text-slate-900 text-xs font-semibold rounded-xl p-3"
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Urgency</label>
                    <div className="flex gap-2">
                      {['routine', 'urgent', 'critical'].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setRequestForm(p => ({ ...p, urgency: item }))}
                          className={`flex-1 border text-[11px] font-bold py-1.5 rounded-lg uppercase tracking-wider transition-all ${
                            requestForm.urgency === item 
                              ? 'bg-red-50 border-red-500 text-red-650' 
                              : 'bg-white border-slate-200 text-slate-505 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">Recipient Alert Email</label>
                    <input
                      type="email"
                      value={requestForm.email}
                      onChange={(e) => setRequestForm(p => ({ ...p, email: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-205 text-slate-900 text-xs font-bold rounded-xl px-3.5 py-2.5 focus:outline-hidden"
                      required
                    />
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowRequestModal(false)}
                      className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-extrabold text-xs py-3 rounded-xl uppercase tracking-wider"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-3 rounded-xl uppercase tracking-wider font-mono cursor-pointer"
                    >
                      Publish Repair Request
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

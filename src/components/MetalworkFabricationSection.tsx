import React, { useState, useMemo, useRef } from 'react';
import { 
  Hammer, MapPin, Grid, Map as MapIcon, Sliders, X, Star, Calendar, 
  Phone, Clock, Search, HelpCircle, ShieldCheck, ArrowRight, Check,
  MessageSquare, Send, Zap, Trash2, Info, ChevronRight, DollarSign,
  Upload, Camera, Image as ImageIcon, AlertTriangle, FileText, CheckCircle,
  Wrench, Scissors, HardHat, Shield, Compass, Sparkles, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import UniversalSmartUpload from './UniversalSmartUpload';

// Structured Interface for Fabrication Workshops
interface FabricationWorkshop {
  id: string;
  name: string;
  logo: string;
  image: string; // Workshop exterior/interior
  rating: number;
  reviewsCount: number;
  distance: number; // km
  serviceTypes: string[]; // welding, chassis repair, structural restoration, custom fabrication, exhaust fabrication
  vehicleTypes: string[]; // classic, commercial, performance
  certifications: string[]; // TUV Certified, ISO 9001, AWS D1.1, CE Structural
  services: string[]; // Display tags, e.g. "Chassis Repair", "Custom Fabrication", "TIG Precision Welding"
  availability: 'open_now' | 'today' | 'this_week';
  address: string;
  phone: string;
  hours: string;
  featuredTag?: string;
  minPrice: number;
}

const FABRICATION_WORKSHOPS: FabricationWorkshop[] = [
  {
    id: 'fab-1',
    name: 'Vytis Precision Welding & Rollcages',
    logo: '⚡',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    reviewsCount: 167,
    distance: 1.1,
    serviceTypes: ['welding', 'custom fabrication', 'chassis repair'],
    vehicleTypes: ['performance', 'classic'],
    certifications: ['AWS Certified', 'TUV Approved'],
    services: ['Custom Fabrication', 'TIG Precision Welding', 'Rollcage Engineering'],
    availability: 'open_now',
    address: 'Savanorių pr. 219B, Vilnius 03154',
    phone: '+370 5 215 9933',
    hours: '08:00 - 18:00',
    featuredTag: 'TUV / FIA Spec Approved',
    minPrice: 180
  },
  {
    id: 'fab-2',
    name: 'Gediminas Custom Metals & Exhausts',
    logo: '🔥',
    image: 'https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    reviewsCount: 104,
    distance: 2.3,
    serviceTypes: ['custom fabrication', 'exhaust fabrication', 'welding'],
    vehicleTypes: ['performance', 'classic'],
    certifications: ['ISO 9001', 'AWS Certified'],
    services: ['Exhaust Fabrication', 'Stainless Custom Manifolds', 'Weight-Reduction Brackets'],
    availability: 'today',
    address: 'Naujoji Vilnia g. 14, Vilnius 11103',
    phone: '+370 6 772 3344',
    hours: '09:00 - 19:00',
    featuredTag: 'Inconel & Titanium Specialist',
    minPrice: 250
  },
  {
    id: 'fab-3',
    name: 'EuroChassis Structural Recovery',
    logo: '📐',
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    reviewsCount: 122,
    distance: 3.4,
    serviceTypes: ['chassis repair', 'structural restoration', 'welding'],
    vehicleTypes: ['commercial', 'classic'],
    certifications: ['CE Structural', 'ISO 9001'],
    services: ['Chassis Repair', 'Frame Jig Alignment', 'Heavy-Load Corroded Sills'],
    availability: 'this_week',
    address: 'Gariūnų g. 83, Vilnius 02244',
    phone: '+370 5 238 8855',
    hours: '08:30 - 17:30',
    featuredTag: 'Advanced Alignment Jigs',
    minPrice: 320
  },
  {
    id: 'fab-4',
    name: 'Baltic Vintage Sheetmetal Restorations',
    logo: '🛠️',
    image: 'https://images.unsplash.com/photo-1617469767053-d3b508a0d825?auto=format&fit=crop&q=80&w=600',
    rating: 5.0,
    reviewsCount: 53,
    distance: 4.9,
    serviceTypes: ['structural restoration', 'custom fabrication'],
    vehicleTypes: ['classic'],
    certifications: ['Traditional English Wheel Master'],
    services: ['Panel Beating', 'Corrosion Restorers', 'Bespoke Fender Fabrication'],
    availability: 'this_week',
    address: 'Nemenčinės pl. 42, Vilnius 10103',
    phone: '+370 6 123 9988',
    hours: '09:00 - 17:00',
    featuredTag: 'Classic Car Gurus',
    minPrice: 400
  },
  {
    id: 'fab-5',
    name: 'Gariūnai Heavy Industrial Fab',
    logo: '⚙️',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600',
    rating: 4.6,
    reviewsCount: 45,
    distance: 6.1,
    serviceTypes: ['welding', 'chassis repair', 'custom fabrication'],
    vehicleTypes: ['commercial'],
    certifications: ['CE Structural'],
    services: ['Heavy Transport Repair', 'Hydraulic Lift Reinforcement', 'Subgrade Box Fabricating'],
    availability: 'open_now',
    address: 'Panerių g. 64, Vilnius 03160',
    phone: '+370 5 244 1122',
    hours: '08:00 - 17:00',
    minPrice: 150
  }
];

export default function MetalworkFabricationSection() {
  // Navigation & Location Toggle
  const [mapMode, setMapMode] = useState<boolean>(false);
  const [searchCity, setSearchCity] = useState<string>('Vilnius, Lithuania');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sidebar Filtering states
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Sorting Control
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'reviews' | 'price'>('distance');

  // Booking Modal
  const [selectedShopForBooking, setSelectedShopForBooking] = useState<FabricationWorkshop | null>(null);
  const [bookingFormData, setBookingFormData] = useState({
    name: '',
    phone: '',
    carMake: '',
    carModel: '',
    serviceRequested: 'welding',
    vehicleCategory: 'performance',
    preferredDate: '2026-06-25',
    preferredTime: '11:00',
    notes: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Quote / Repair Request States (Mid-page CTA: Submit a repair request with photos for accurate quotes)
  const [showQuoteModal, setShowQuoteModal] = useState<boolean>(false);
  const [quoteFormData, setQuoteFormData] = useState({
    carPlate: '',
    carMake: '',
    carModel: '',
    serviceCategory: 'custom fabrication', // welding, chassis, structural, custom, exhaust
    vehicleClassType: 'performance',
    damageUrgency: 'standard', // high (structural fail), standard, custom_project
    uploadedPhotoName: '',
    uploadedPhotoObj: null as string | null,
    clientContactName: '',
    clientPhone: '',
    additionalDetails: ''
  });
  const [quoteSuccess, setQuoteSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom Conversational AI Assistant
  const [customQuery, setCustomQuery] = useState<string>('');
  const [aiIsTyping, setAiIsTyping] = useState<boolean>(false);
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: "Hello! I am your AI Metallurgy & Vehicle Structural Advisor. Ask me any welding or custom fabrication questions. For example: 'What is the difference between TIG and MIG welding?', 'How much does rollcage fabrication cost?', or 'How can a rusted frame sill be safely restored?'"
    }
  ]);

  // Handler for custom GPS simulator override
  const handleGetCurrentLocation = () => {
    setSearchCity('Vilnius Industrial Zone (Detected)');
    const notification = document.createElement('div');
    notification.className = "fixed bottom-24 left-1/2 -translate-x-1/2 z-[150] bg-red-650 text-white text-xs font-mono px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-red-500 animate-bounce";
    notification.innerHTML = "🎯 GPS Synchronized: Centered alignment to the nearest hydraulic-lift welding labs";
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2500);
  };

  const resetAllFilters = () => {
    setSelectedServiceTypes([]);
    setSelectedVehicleTypes([]);
    setSelectedCertifications([]);
    setSelectedAvailability('all');
    setMinRating(0);
    setSearchQuery('');
  };

  // Processing listing filters
  const filteredWorkshops = useMemo(() => {
    let list = [...FABRICATION_WORKSHOPS];

    // Search query constraint
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(workshop => 
        workshop.name.toLowerCase().includes(q) || 
        workshop.address.toLowerCase().includes(q) ||
        workshop.services.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // Service type filter
    if (selectedServiceTypes.length > 0) {
      list = list.filter(workshop => 
        selectedServiceTypes.some(st => workshop.serviceTypes.includes(st))
      );
    }

    // Vehicle type filter
    if (selectedVehicleTypes.length > 0) {
      list = list.filter(workshop => 
        selectedVehicleTypes.some(vt => workshop.vehicleTypes.includes(vt))
      );
    }

    // Certifications filter
    if (selectedCertifications.length > 0) {
      list = list.filter(workshop => 
        selectedCertifications.some(cert => workshop.certifications.some(c => c.toLowerCase().includes(cert.toLowerCase())))
      );
    }

    // Availability constraint
    if (selectedAvailability !== 'all') {
      list = list.filter(workshop => workshop.availability === selectedAvailability);
    }

    // Rating filter
    if (minRating > 0) {
      list = list.filter(workshop => workshop.rating >= minRating);
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
  }, [searchQuery, selectedServiceTypes, selectedVehicleTypes, selectedCertifications, selectedAvailability, minRating, sortBy]);

  // Photo uploads for custom quote wizard
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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
        reply = "Fabrication and structural welding pricing is heavily dependent on hourly rates and dynamic material costs. Standard MIG welding for minor plate repairs starts at **€60 to €110**. Complete custom exhaust systems made of premium **Stainless Steel 304** or titanium usually start at **€350 to €850**. Highly technical racing rollcages built strictly to FIA/TUV specs range from **€1,200 up to €3,500** depending on the specific multi-point reinforcement configurations.";
      } else if (q.includes('mig') || q.includes('tig') || q.includes('welding') || q.includes('welder')) {
        reply = "Great question! **MIG (Metal Inert Gas)** welding is fast and highly efficient for thick structural frame repair, floor panel reinforcement, or general chassis plating. **TIG (Tungsten Inert Gas)** welding, on the other hand, is slower but delivers exceptionally clean, precise welds with maximum tensile strength. Our certified specialists always prefer TIG for thin-wall chromoly steel racing rollcages, aluminum components, and stainless steel custom exhaust headers.";
      } else if (q.includes('classic') || q.includes('rust') || q.includes('vintage') || q.includes('restor')) {
        reply = "Classic car sheet metal restoration requires handcrafting custom panels from high-grade carbon steel using traditional wooden dollies and a master English Wheel. To prevent early degradation, custom panel-welding is strictly butt-welded (not overlapped) and then post-weld planished to ensure zero tension wrinkles. We have state-approved classic car historians who specialize in original factory spot-welding mimicry!";
      } else if (q.includes('exhaust') || q.includes('pipe') || q.includes('muffler') || q.includes('manifold')) {
        reply = "Exhaust fabrication is all about backpressure tuning and thermal control. Our premium workshops use back-purging methods (filling the inside of the tube with pure argon during TIG welding) to prevent 'sugar accumulation' (oxidation) on the weld root. This guarantees that internal soot never creates drag and prevents early crack fractures inside extreme performance turbo systems.";
      } else if (q.includes('rollcage') || q.includes('safety') || q.includes('fia') || q.includes('tuv')) {
        reply = "Safety-certified roll cages must always utilize seamless cold-drawn carbon steel (CDS) or aerospace grade **Chromoly 4130** tubing. Any heating of Chromoly requires strict subsequent heat treatment parameters to prevent crystallization and brittleness around heat-affected zones. Always request AWS or FIA-certified welder credentials before track-day racing verification!";
      } else {
        reply = "To guarantee the structural integrity of your vehicle, all high-load chassis repairs on our platform are performed on dedicated frame alignment software and heavy-duty frame jigs. This prevents minor geometry offsets that could otherwise lead to early tire wear or steering offsets.";
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
      notify.innerHTML = `⚙️ <b>Fabrication Booking Secured!</b> Diagnostic lift allocated for you at ${selectedShopForBooking?.name}. Please bring valid specification sketches or pictures!`;
      document.body.appendChild(notify);
      setTimeout(() => notify.remove(), 4500);
    }, 1200);
  };

  // Repair Request submit
  const handleConfirmQuoteRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSuccess(true);
    setTimeout(() => {
      setQuoteSuccess(false);
      setShowQuoteModal(false);
      setQuoteFormData({
        carPlate: '',
        carMake: '',
        carModel: '',
        serviceCategory: 'custom fabrication',
        vehicleClassType: 'performance',
        damageUrgency: 'standard',
        uploadedPhotoName: '',
        uploadedPhotoObj: null,
        clientContactName: '',
        clientPhone: '',
        additionalDetails: ''
      });

      const notify = document.createElement('div');
      notify.className = "fixed bottom-10 right-10 z-[200] bg-neutral-900 border border-neutral-800 text-white text-xs font-black px-6 py-4 rounded-xl shadow-xl animate-bounce";
      notify.innerHTML = "🛠️ <b>Repair Request Broadcasted!</b> All 5 local metalwork and fabrication specialists have received your photos. Custom offers will appear inside your chat log.";
      document.body.appendChild(notify);
      setTimeout(() => notify.remove(), 5000);
    }, 1500);
  };

  // Map pin intercept trigger simulation
  const handleMapMarkerClick = (shopName: string, minPrice: number) => {
    const alertDiv = document.createElement('div');
    alertDiv.className = "fixed bottom-10 right-10 z-[200] bg-white border-2 border-red-600 text-slate-800 text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in";
    alertDiv.innerHTML = `🛡️ <b>${shopName} Coordinate Selected:</b> Structural services and repairs starting at €${minPrice}. Certified welders active!`;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 3500);
  };

  return (
    <div id="fabrication-section-container" className="bg-[#F5F5F7] min-h-screen text-slate-800 text-left font-sans leading-relaxed relative pb-28">

      {/* 1. HEADER SECTION */}
      <header id="fabrication-header" className="bg-white border-b border-slate-200 py-8 md:py-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            
            {/* Title & Badge */}
            <div className="space-y-2">
              <h1 id="fabrication-main-title" className="text-3xl font-bold tracking-tight text-slate-900 mt-1 font-sans">
                Find Metalwork &amp; Fabrication Specialists
              </h1>
            </div>

            {/* List vs Radar Map Toggles */}
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
                  <span>Interactive Map</span>
                </button>
              </div>
            </div>

          </div>

          {/* Location & Term Search console */}
          <div id="search-console-wrapper" className="mt-8 bg-slate-100 border border-slate-200 rounded-2xl p-3 max-w-full flex flex-col lg:flex-row items-center gap-3">
            
            <div className="relative w-full lg:w-80 shrink-0">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" />
              <input
                id="search-city-input"
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Enter city or industrial zone..."
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

            {/* Keyword Search field */}
            <div className="relative w-full flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                id="search-query-field"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search metalwork keywords (e.g. welding, TIG, exhaust, sills, panel, rollcage, TUV)..."
                className="w-full bg-white text-slate-900 text-xs font-bold rounded-xl pl-9 pr-3 py-3 border border-slate-250 focus:outline-hidden focus:ring-1 focus:ring-red-600"
              />
            </div>

          </div>

        </div>
      </header>

      {/* TWO COLUMN CONTENT ARRAY */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        
        {/* Mobile Filter sidebar button */}
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
                  <span>Workshop Match Criteria</span>
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
                  <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5 font-mono font-bold">
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

                {/* Service Type Checkboxes */}
                <div className="space-y-2.5 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <h4 className="font-extrabold text-slate-900 text-[10.5px] uppercase tracking-wider font-mono flex items-center gap-1 select-none">
                    <Wrench className="w-3.5 h-3.5 text-red-600" />
                    <span>Fabrication Service</span>
                  </h4>
                  <div className="space-y-2">
                    {[
                      { id: 'welding', label: 'Welding (MIG/TIG)' },
                      { id: 'chassis repair', label: 'Chassis & Frame Repair' },
                      { id: 'structural restoration', label: 'Structural Restoration' },
                      { id: 'custom fabrication', label: 'Custom Fabrication' },
                      { id: 'exhaust fabrication', label: 'Exhaust & Manifold' }
                    ].map((el) => {
                      const active = selectedServiceTypes.includes(el.id);
                      return (
                        <label key={el.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-950 select-none">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => {
                              setSelectedServiceTypes(prev => 
                                active ? prev.filter(item => item !== el.id) : [...prev, el.id]
                              );
                            }}
                            className="w-4 h-4 rounded-sm accent-red-600 cursor-pointer"
                          />
                          <span>{el.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Vehicle Types supported */}
                <div className="space-y-2.5">
                  <h4 className="font-extrabold text-slate-900 text-[10.5px] uppercase tracking-wider font-mono flex items-center gap-1 select-none">
                    <HardHat className="w-3.5 h-3.5 text-red-600" />
                    <span>Vehicle Specialization</span>
                  </h4>
                  <div className="space-y-2">
                    {[
                      { id: 'classic', label: 'Vintage / Classic Cars' },
                      { id: 'commercial', label: 'Heavy Commercial / Vans' },
                      { id: 'performance', label: 'Racing & Performance Cars' }
                    ].map((vt) => {
                      const active = selectedVehicleTypes.includes(vt.id);
                      return (
                        <label key={vt.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-950 select-none">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => {
                              setSelectedVehicleTypes(prev => 
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

                {/* Certifications filter checklist */}
                <div className="space-y-2.5">
                  <h4 className="font-extrabold text-slate-900 text-[10.5px] uppercase tracking-wider font-mono flex items-center gap-1 select-none">
                    <Award className="w-3.5 h-3.5 text-red-600" />
                    <span>Certifications / Welder License</span>
                  </h4>
                  <div className="space-y-2">
                    {[
                      { id: 'TUV Approved', label: 'TUV FIA Certified' },
                      { id: 'AWS', label: 'American Welding Spec (AWS)' },
                      { id: 'CE Structural', label: 'CE Structural Approved' },
                      { id: 'ISO 9001', label: 'ISO 9001 Facility' }
                    ].map((cert) => {
                      const active = selectedCertifications.includes(cert.id);
                      return (
                        <label key={cert.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-950 select-none">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => {
                              setSelectedCertifications(prev => 
                                active ? prev.filter(item => item !== cert.id) : [...prev, cert.id]
                              );
                            }}
                            className="w-4 h-4 rounded-sm accent-red-600 cursor-pointer"
                          />
                          <span>{cert.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Custom active availability list */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-900 text-[10.5px] uppercase tracking-wider font-mono">Bay Availability</h4>
                  <div className="flex flex-col gap-2">
                    {[
                      { id: 'all', name: 'Show All Workshops' },
                      { id: 'open_now', name: 'Open Now' },
                      { id: 'today', name: 'Slots Open Today' },
                      { id: 'this_week', name: 'Open This Week' }
                    ].map((avail) => (
                      <label key={avail.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="avail_fab"
                          checked={selectedAvailability === avail.id}
                          onChange={() => setSelectedAvailability(avail.id)}
                          className="w-4 h-4 accent-red-600 cursor-pointer"
                        />
                        <span>{avail.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating selection filter */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-900 text-[10.5px] uppercase tracking-wider font-mono">Weld Quality Score</h4>
                  <div className="flex flex-col gap-2">
                    {[
                      { val: 0, label: 'All Ratings' },
                      { val: 4.9, label: '★ 4.9+ Master-Grade' },
                      { val: 4.8, label: '★ 4.8+ Pro Welder' },
                      { val: 4.5, label: '★ 4.5+ Verified Quality' }
                    ].map((el) => (
                      <label key={el.val} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="rating_fab"
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

          {/* MAIN GRID DISPLAY CLUSTER */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Sorber & sorting options layout */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-2xs">
              <div>
                <span className="text-[10px] font-mono tracking-wider text-slate-450 block uppercase font-bold">Structural Security</span>
                <span id="metalwork-specialist-count" className="font-extrabold text-slate-950 text-xs">Showing {filteredWorkshops.length} certified metal fabrication providers inside {searchCity}</span>
              </div>

              <div className="flex items-center gap-2 font-sans">
                <span className="text-xs text-slate-450 font-bold uppercase font-mono tracking-wider shrink-0">Sort</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold rounded-lg px-2.5 py-1.5 cursor-pointer focus:outline-hidden"
                >
                  <option value="distance">Distance (Nearest First)</option>
                  <option value="rating">Rating (Highest First)</option>
                  <option value="reviews">Reviews Volume</option>
                  <option value="price">Starting Rate (Lowest First)</option>
                </select>
              </div>
            </div>

            {/* Grid listing vs Simulated interactive radar map */}
            {!mapMode ? (
              
              /* RENDER HIGH FREQUENCY DETAILED GRID OF WORKSHOPS */
              <div id="metalwork-specialists-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence mode="popLayout font-bold">
                  {filteredWorkshops.map((sp) => (
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

                {filteredWorkshops.length === 0 && (
                  <div className="col-span-1 md:col-span-2 py-16 text-center space-y-3 bg-white border border-slate-250 rounded-3xl">
                    <AlertTriangle className="w-8 h-8 text-slate-300 mx-auto animate-bounce" />
                    <h4 className="font-extrabold text-slate-900 text-sm">No metalwork workshops match your criteria</h4>
                    <p className="text-slate-400 text-xs max-w-sm mx-auto">Try resetting active filters or look up the entire region to check certified alloy welders.</p>
                    <button onClick={resetAllFilters} className="text-xs text-red-650 font-bold underline cursor-pointer">Reset All Filters</button>
                  </div>
                )}
              </div>

            ) : (

              /* INTERACTIVE RADAR ACTIVE COORDINATES MAP */
              <div id="radar-metalwork-map" className="bg-zinc-900 rounded-3xl h-[490px] relative overflow-hidden border border-zinc-800 shadow-xl">
                
                {/* Visual grid line matrix overlay */}
                <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#ffffff_2px,transparent_1px)] [background-size:20px_20px] bg-zinc-950">
                  <div className="absolute inset-x-0 top-1/4 h-[1px] bg-zinc-850"></div>
                  <div className="absolute inset-y-0 left-1/3 w-[1px] bg-zinc-850"></div>
                  <div className="absolute inset-x-0 top-2/3 h-[1px] bg-zinc-850"></div>
                </div>

                <div className="absolute bottom-10 left-1/3 w-36 h-36 rounded-full bg-red-900/10 blur-2xl"></div>

                {/* Map projection labels */}
                <div className="absolute top-5 left-5 bg-black/85 backdrop-blur-md p-4 rounded-xl border border-zinc-850 text-left text-white z-20 space-y-1.5 max-w-xs">
                  <div className="flex items-center gap-1 text-red-500 font-extrabold text-[9px] uppercase tracking-widest font-mono">
                    <Zap className="w-4 h-4 text-red-500 animate-pulse" />
                    <span>MIG TIG Align Active Radar</span>
                  </div>
                  <h4 className="text-xs font-black">Vilnius Metalwork Service Zones</h4>
                  <p className="text-[10px] text-zinc-400 font-medium">Click individual weld pins on the tactical grid beneath to examine current diagnostic lift availabilities.</p>
                </div>

                {/* Mapped coordinates from active specialists array */}
                {filteredWorkshops.map((sp, idx) => {
                  const coordinates = [
                    { top: '35%', left: '25%' },
                    { top: '65%', left: '55%' },
                    { top: '75%', left: '38%' },
                    { top: '25%', left: '72%' },
                    { top: '72%', left: '16%' }
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
                        <span className="animate-ping absolute inline-flex h-11 w-11 rounded-full bg-red-650 opacity-60"></span>
                        
                        <div className="relative bg-white hover:bg-neutral-50 border-2 border-red-650 text-slate-900 px-3 py-1.5 rounded-xl shadow-md flex items-center gap-1.5 transition-transform group-hover:scale-105 text-left">
                          <span className="text-base">{sp.logo}</span>
                          <div>
                            <p className="text-[9px] font-black text-[#8B0000] leading-none uppercase">{sp.name.split(' ')[0]}</p>
                            <p className="text-[8px] text-red-600 font-black font-mono mt-0.5">Start €{sp.minPrice} • ★ {sp.rating}</p>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}

                {/* Scale parameters label */}
                <span className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-xs border border-zinc-800 text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest px-2.5 py-1 rounded">
                  Argon Deposition Grid Plan • 1 : 12,500 Mercator
                </span>

              </div>

            )}

            {/* 3. MID-PAGE CTA WIDGET: "Need structural work done? Submit a repair request with photos for accurate quotes" */}
            <div id="fabrication-middle-cta" className="relative bg-white border border-slate-205 rounded-3xl p-6 md:p-8 shadow-sm text-left overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-red-500/5 rounded-full blur-xl pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200/60 px-2.5 py-1 rounded-md text-[10px] font-bold text-red-700 tracking-wider uppercase font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                    <span>Structural Quality Safeguard Guarantee</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-[#8B0000] tracking-tight leading-snug">
                    Need structural work done? Submit a repair request with photos for accurate quotes
                  </h2>
                  <p className="text-xs text-slate-500 max-w-xl font-medium">
                    Skip driving around to industrial estates. Transmit your rust diagrams, weld request blueprints, or system exhaust photos to all certified local fabrication labs at once.
                  </p>
                </div>

                <div className="shrink-0">
                  <button
                    id="btn-trigger-rfq-modal"
                    type="button"
                    onClick={() => {
                      setQuoteFormData(prev => ({
                        ...prev,
                        carMake: '',
                        carModel: '',
                        uploadedPhotoName: '',
                        uploadedPhotoObj: null
                      }));
                      setShowQuoteModal(true);
                    }}
                    className="bg-red-650 hover:bg-red-700 text-white font-extrabold text-[11px] tracking-widest uppercase px-6 py-4 rounded-xl border border-red-500 transition-all active:scale-[0.98] shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-white" />
                    <span>Create Repair Request</span>
                  </button>
                </div>
              </div>
            </div>



          </div>

        </div>

      </div>

      {/* 5. BOOKING MODAL */}
      <AnimatePresence>
        {selectedShopForBooking && (
          <div id="booking-modal-overlay" className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center z-[110] p-4 text-left">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-slate-100 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="bg-red-650 text-white p-6 relative">
                <button
                  type="button"
                  onClick={() => setSelectedShopForBooking(null)}
                  className="absolute top-6 right-6 text-white/80 hover:text-white transition-opacity cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-black/20 text-white/90 px-2.5 py-1 rounded-sm">
                  Service Request Booking System
                </span>
                <h3 className="text-xl font-black mt-2 leading-tight">
                  Reserve Welding Slot at {selectedShopForBooking.name}
                </h3>
                <p className="text-xs text-white/80 mt-1">Starting plans start around €{selectedShopForBooking.minPrice}+</p>
              </div>

              {/* Form container */}
              <form onSubmit={handleConfirmReservation} className="p-6 overflow-y-auto space-y-4 text-slate-800">
                
                {bookingSuccess ? (
                  <div className="py-8 text-center space-y-3">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto animate-bounce" />
                    <h4 className="font-extrabold text-[#8B0000] text-base">Structural Slot reserved successfully!</h4>
                    <p className="text-slate-500 text-xs">A designated welder is preparing your bay checklist. We will correspond via call to lock down blue prints.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-450 mb-1 leading-none">Your Full Name</label>
                        <input
                          required
                          type="text"
                          value={bookingFormData.name}
                          onChange={(e) => setBookingFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Tomas K."
                          className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-hidden focus:ring-1 focus:ring-red-650"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-450 mb-1 leading-none">Callback Telephone</label>
                        <input
                          required
                          type="tel"
                          value={bookingFormData.phone}
                          onChange={(e) => setBookingFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="+370 600 12345"
                          className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-hidden focus:ring-1 focus:ring-red-650"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-450 mb-1 leading-none">Make</label>
                        <input
                          required
                          type="text"
                          value={bookingFormData.carMake}
                          onChange={(e) => setBookingFormData(prev => ({ ...prev, carMake: e.target.value }))}
                          placeholder="Audi"
                          className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-hidden focus:ring-1 focus:ring-red-650"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-450 mb-1 leading-none">Model & Year</label>
                        <input
                          required
                          type="text"
                          value={bookingFormData.carModel}
                          onChange={(e) => setBookingFormData(prev => ({ ...prev, carModel: e.target.value }))}
                          placeholder="S4 (2018)"
                          className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-hidden focus:ring-1 focus:ring-red-650"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-450 mb-1 leading-none">Exhaust/Weld Class</label>
                        <select
                          value={bookingFormData.serviceRequested}
                          onChange={(e) => setBookingFormData(prev => ({ ...prev, serviceRequested: e.target.value }))}
                          className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-hidden"
                        >
                          <option value="welding">Precision Welding (MIG/TIG)</option>
                          <option value="chassis repair">Chassis / Sills Repair</option>
                          <option value="structural restoration">Classic Panel Restoration</option>
                          <option value="custom fabrication">Custom Structural Works</option>
                          <option value="exhaust fabrication">Tuned Exhaust Fabrication</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-450 mb-1 leading-none font-bold">Vehicle Class Focus</label>
                        <select
                          value={bookingFormData.vehicleCategory}
                          onChange={(e) => setBookingFormData(prev => ({ ...prev, vehicleCategory: e.target.value }))}
                          className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold"
                        >
                          <option value="performance">Track Day / Performance</option>
                          <option value="classic">Classic / Restomod</option>
                          <option value="commercial">Transport / Commercial Van</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-450 mb-1 leading-none">Preferred Date</label>
                        <input
                          type="date"
                          value={bookingFormData.preferredDate}
                          onChange={(e) => setBookingFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
                          className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-450 mb-1 leading-none">Best Time</label>
                        <input
                          type="time"
                          value={bookingFormData.preferredTime}
                          onChange={(e) => setBookingFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                          className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-450 mb-1 leading-none">Metalwork Details/Blueprints</label>
                      <textarea
                        rows={2}
                        value={bookingFormData.notes}
                        onChange={(e) => setBookingFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Detail any structural fatigue points, piping diameter requirements, or frame stiffness goals..."
                        className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-red-650"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-red-650 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl cursor-pointer shadow-md transition-all active:scale-[0.98]"
                      >
                        Reserve Booking Slot
                      </button>
                    </div>
                  </>
                )}

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. CREATE REPAIR REQUEST MODAL (With Photo upload for accurate quotes) */}
      <AnimatePresence>
        {showQuoteModal && (
          <div id="quote-modal-overlay" className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center z-[110] p-4 text-left">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-slate-100 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="bg-neutral-900 text-white p-6 relative border-b border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowQuoteModal(false)}
                  className="absolute top-6 right-6 text-neutral-400 hover:text-white transition-opacity cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-1.5 text-red-500 font-extrabold uppercase text-[10px] tracking-wider font-mono">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Interactive Repair Request system</span>
                </div>
                <h3 className="text-xl font-black mt-2 leading-tight">
                  Submit a Repair Request with Photos for Accurate Quotes
                </h3>
                <p className="text-xs text-neutral-400 mt-1">Dispatches vehicle specs and corrosion blueprints to all local fabrication hubs.</p>
              </div>

              {/* Form */}
              <form onSubmit={handleConfirmQuoteRequest} className="p-6 overflow-y-auto space-y-4 text-slate-800">
                
                {quoteSuccess ? (
                  <div className="py-8 text-center space-y-3">
                    <CheckCircle className="w-12 h-12 text-red-600 mx-auto animate-bounce" />
                    <h4 className="font-extrabold text-[#8B0000] text-base">Repair Request Dispatched!</h4>
                    <p className="text-slate-500 text-xs">All local metal workshops have been notified. Keep an eye on your phone for custom material and service estimates.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <label className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-450 mb-1 leading-none">Reg Plate</label>
                        <input
                          required
                          type="text"
                          value={quoteFormData.carPlate}
                          onChange={(e) => setQuoteFormData(prev => ({ ...prev, carPlate: e.target.value }))}
                          placeholder="ABC 123"
                          className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-center uppercase focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-450 mb-1 leading-none">Vehicle Make</label>
                        <input
                          required
                          type="text"
                          value={quoteFormData.carMake}
                          onChange={(e) => setQuoteFormData(prev => ({ ...prev, carMake: e.target.value }))}
                          placeholder="Porsche"
                          className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-450 mb-1 leading-none">Model & Year</label>
                        <input
                          required
                          type="text"
                          value={quoteFormData.carModel}
                          onChange={(e) => setQuoteFormData(prev => ({ ...prev, carModel: e.target.value }))}
                          placeholder="911 (1995)"
                          className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-450 mb-1 leading-none">Service Sector</label>
                        <select
                          value={quoteFormData.serviceCategory}
                          onChange={(e) => setQuoteFormData(prev => ({ ...prev, serviceCategory: e.target.value }))}
                          className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold"
                        >
                          <option value="custom fabrication">Custom Fabrication</option>
                          <option value="welding">Welding (MIG/TIG)</option>
                          <option value="chassis repair">Chassis Frame Alignment</option>
                          <option value="structural restoration">Classic Panel Beating</option>
                          <option value="exhaust fabrication"> stainless Exhaust System</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-455 mb-1 leading-none font-bold">Structural Urgency</label>
                        <select
                          value={quoteFormData.damageUrgency}
                          onChange={(e) => setQuoteFormData(prev => ({ ...prev, damageUrgency: e.target.value }))}
                          className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold"
                        >
                          <option value="standard">Standard Custom Project</option>
                          <option value="high">Critical Structural / MOT Fail</option>
                        </select>
                      </div>
                    </div>

                    {/* Integrated Photo Drag and Drop / Selector */}
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-450 mb-1.5 leading-none">Upload Damage / Project Blueprint photos</label>
                      <UniversalSmartUpload
                        photoKey="metalwork_quote_damage"
                        uploadedImageSrc={quoteFormData.uploadedPhotoObj}
                        onUploadSuccess={handleSmartQuotePhotoUpload}
                        onClear={() => setQuoteFormData(prev => ({ ...prev, uploadedPhotoName: '', uploadedPhotoObj: null }))}
                        label="Project Camera / Blueprints"
                        description="Stream snapshots of the damaged chassis, rusted sills, or customized blueprints."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-450 mb-1 leading-none">Your Contact Name</label>
                        <input
                          required
                          type="text"
                          value={quoteFormData.clientContactName}
                          onChange={(e) => setQuoteFormData(prev => ({ ...prev, clientContactName: e.target.value }))}
                          placeholder="Lukas V."
                          className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-450 mb-1 leading-none">Phone Contact</label>
                        <input
                          required
                          type="tel"
                          value={quoteFormData.clientPhone}
                          onChange={(e) => setQuoteFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                          placeholder="+370 699 99000"
                          className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-450 mb-1 leading-none">Fabrication Details / Requirements</label>
                      <textarea
                        rows={3}
                        value={quoteFormData.additionalDetails}
                        onChange={(e) => setQuoteFormData(prev => ({ ...prev, additionalDetails: e.target.value }))}
                        placeholder="Please describe what needs to be made or repaired. E.g. 'Restore rear sills due to rust fail', 'Fabricate a 3-inch downpipe for a GT28 turbo'..."
                        className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-red-650"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full bg-red-650 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl cursor-pointer shadow-md transition-all active:scale-[0.98]"
                      >
                        Submit Repair Request
                      </button>
                    </div>
                  </>
                )}

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

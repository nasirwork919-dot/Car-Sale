import React, { useState, useMemo, useRef } from 'react';
import { 
  Sparkles, MapPin, Grid, Map as MapIcon, Sliders, X, Star, Calendar, 
  Phone, Clock, Search, HelpCircle, ShieldCheck, ArrowRight, Check,
  MessageSquare, Send, Zap, Trash2, Info, ChevronRight, DollarSign,
  Upload, Camera, Image as ImageIcon, AlertTriangle, FileText, CheckCircle,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import UniversalSmartUpload from './UniversalSmartUpload';

// Interfaces for structured data
interface GlassSpecialist {
  id: string;
  name: string;
  logo: string;
  image: string;
  rating: number;
  reviewsCount: number;
  distance: number; // km
  services: string[]; // windshield repair, full replacement, side/rear window, sunroof
  mobileAvailable: boolean;
  insuranceSupport: boolean;
  supportedBrands: string[];
  availability: 'open_now' | 'today' | 'this_week';
  address: string;
  phone: string;
  hours: string;
  featuredTag?: string;
  minPriceRepair: number;
  minPriceReplacement: number;
}

const GLASS_SPECIALISTS: GlassSpecialist[] = [
  {
    id: 'glass-1',
    name: 'Stiklas Baltic Windshield & Glass',
    logo: '🛡️',
    image: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    reviewsCount: 320,
    distance: 0.8,
    services: ['windshield repair', 'full replacement', 'side/rear window'],
    mobileAvailable: true,
    insuranceSupport: true,
    supportedBrands: ['Audi', 'Volkswagen', 'BMW', 'Toyota', 'Mercedes-Benz', 'Tesla'],
    availability: 'open_now',
    address: 'Švitrigailos g. 11B, Vilnius 03228',
    phone: '+370 5 215 1122',
    hours: '08:00 - 18:30',
    featuredTag: 'ADAS Calibrated Premium',
    minPriceRepair: 45,
    minPriceReplacement: 195
  },
  {
    id: 'glass-2',
    name: 'Lithuanian Carglass & ADAS Specialist',
    logo: '💎',
    image: 'https://images.unsplash.com/photo-1520116468816-95b69f847357?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    reviewsCount: 195,
    distance: 2.1,
    services: ['windshield repair', 'full replacement', 'sunroof'],
    mobileAvailable: true,
    insuranceSupport: true,
    supportedBrands: ['Volvo', 'BMW', 'Volkswagen', 'Ford', 'Lexus', 'Skoda'],
    availability: 'today',
    address: 'Savanorių pr. 246, Vilnius 50186',
    phone: '+370 37 400 900',
    hours: '08:30 - 19:30',
    featuredTag: 'Insurance Approved Tier-1',
    minPriceRepair: 50,
    minPriceReplacement: 220
  },
  {
    id: 'glass-3',
    name: 'GlassExpress Mobile Wizards',
    logo: '🚐',
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    reviewsCount: 154,
    distance: 3.2,
    services: ['windshield repair', 'side/rear window'],
    mobileAvailable: true,
    insuranceSupport: true,
    supportedBrands: ['Audi', 'Toyota', 'Peugeot', 'Citroen', 'Opel', 'Hyundai'],
    availability: 'today',
    address: 'Mobile Service (Serving Vilnius & Kaunas districts)',
    phone: '+370 6 999 5544',
    hours: '07:30 - 20:00',
    featuredTag: '100% Mobile Service',
    minPriceRepair: 40,
    minPriceReplacement: 180
  },
  {
    id: 'glass-4',
    name: 'Gediminas Auto Glass & Sunroof Labs',
    logo: '☀️',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600',
    rating: 5.0,
    reviewsCount: 89,
    distance: 4.5,
    services: ['full replacement', 'side/rear window', 'sunroof'],
    mobileAvailable: false,
    insuranceSupport: false,
    supportedBrands: ['Porsche', 'Tesla', 'Mercedes-Benz', 'BMW', 'Exotics'],
    availability: 'this_week',
    address: 'Paribio g. 12, Vilnius 08101',
    phone: '+370 5 233 4455',
    hours: '09:00 - 18:00',
    featuredTag: 'Tesla Glass Authorized',
    minPriceRepair: 60,
    minPriceReplacement: 350
  },
  {
    id: 'glass-5',
    name: 'Baltic Chip Busters',
    logo: '🔨',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=600',
    rating: 4.6,
    reviewsCount: 112,
    distance: 5.6,
    services: ['windshield repair'],
    mobileAvailable: true,
    insuranceSupport: false,
    supportedBrands: ['All Makes', 'Renault', 'Volvo', 'Nissan', 'Dacia'],
    availability: 'open_now',
    address: 'Kirtimų g. 51, Vilnius 02244',
    phone: '+370 6 123 4567',
    hours: '08:00 - 17:00',
    minPriceRepair: 35,
    minPriceReplacement: 160
  }
];

export default function GlassRepairSection() {
  // Navigation & Location
  const [mapMode, setMapMode] = useState<boolean>(false);
  const [searchCity, setSearchCity] = useState<string>('Vilnius, Lithuania');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtering System
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [mobileOnly, setMobileOnly] = useState<boolean>(false);
  const [insuranceOnly, setInsuranceOnly] = useState<boolean>(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Sorting Option
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'reviews' | 'price_repair'>('distance');

  // Booking Modal States
  const [selectedShopForBooking, setSelectedShopForBooking] = useState<GlassSpecialist | null>(null);
  const [bookingFormData, setBookingFormData] = useState({
    name: '',
    phone: '',
    carMake: '',
    carModel: '',
    serviceType: 'windshield repair',
    insuranceClaim: 'no',
    policyNumber: '',
    bookingDate: '2026-06-18',
    bookingTime: '10:00',
    mobileDispatch: 'no',
    notes: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Create Repair Request Quote Dialog States
  const [showQuoteModal, setShowQuoteModal] = useState<boolean>(false);
  const [quoteFormData, setQuoteFormData] = useState({
    carPlate: '',
    carMake: '',
    carModel: '',
    damageLoc: 'front_windshield',
    damageType: 'star_chip', // star_chip, long_crack, shattered
    coverage: 'comprehensive',
    damageSize: 'smaller_coin', // smaller_coin, larger_coin, long_line
    uploadedPhotoName: '',
    uploadedPhotoObj: null as string | null,
    clientContact: '',
    clientPhone: ''
  });
  const [quoteSuccess, setQuoteSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Assistant States
  const [aiUploadedPhotoName, setAiUploadedPhotoName] = useState<string>('');
  const [aiUploadedPhotoData, setAiUploadedPhotoData] = useState<string | null>(null);
  const [damageTextDescription, setDamageTextDescription] = useState<string>('star_chip'); // star_chip, bulls_eye, long_crack, complete_shatter
  const [aiResult, setAiResult] = useState<any | null>({
    verdict: "Please choose your damage parameters or upload a photo of the cracked glass to compute mechanical stress fatigue models immediately.",
    action: "WAIT_INPUT",
    estimatedCostRange: "€0",
    recommendation: ""
  });
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string; image?: string | null }>>([
    {
      sender: 'ai',
      text: "Welcome to the Auto Glass AI Consultant. Send me a description of your windshield damage (such as its centimeter diameter, whether it touches the black frit edges, or if an air pocket is visible) or upload a photo, and I will instantly analyze whether a glass repair is physically viable or if you need a structural replacement cost quote."
    }
  ]);
  const [customQuery, setCustomQuery] = useState<string>('');
  const [aiIsTyping, setAiIsTyping] = useState<boolean>(false);

  // All brand lists from database
  const availableBrandsList = useMemo(() => {
    const setOfBrands = new Set<string>();
    GLASS_SPECIALISTS.forEach(sp => {
      sp.supportedBrands.forEach(b => setOfBrands.add(b));
    });
    return Array.from(setOfBrands);
  }, []);

  const resetAllFilters = () => {
    setSelectedServices([]);
    setMobileOnly(false);
    setInsuranceOnly(false);
    setSelectedBrands([]);
    setSelectedAvailability('all');
    setSearchQuery('');
  };

  const handleGetCurrentLocation = () => {
    setSearchCity('Vilnius Antakalnis (Detected)');
    const notification = document.createElement('div');
    notification.className = "fixed bottom-24 left-1/2 -translate-x-1/2 z-[150] bg-red-650 text-white text-xs font-mono px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-red-500 animate-bounce";
    notification.innerHTML = "🎯 GPS Verified: Correcting coordinates to Vilnius Glass & ADAS zone";
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2500);
  };

  // Processing listing filters
  const filteredSpecialists = useMemo(() => {
    let list = [...GLASS_SPECIALISTS];

    // Filter by search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(sp => 
        sp.name.toLowerCase().includes(q) || 
        sp.address.toLowerCase().includes(q) ||
        sp.supportedBrands.some(brand => brand.toLowerCase().includes(q))
      );
    }

    // Filter by Service select
    if (selectedServices.length > 0) {
      list = list.filter(sp => 
        selectedServices.some(svc => sp.services.includes(svc))
      );
    }

    // Filter by Mobile service
    if (mobileOnly) {
      list = list.filter(sp => sp.mobileAvailable);
    }

    // Filter by Insurance claims accepted
    if (insuranceOnly) {
      list = list.filter(sp => sp.insuranceSupport);
    }

    // Filter by Supported Car Brands
    if (selectedBrands.length > 0) {
      list = list.filter(sp => 
        selectedBrands.some(brand => sp.supportedBrands.includes(brand) || sp.supportedBrands.includes('All Makes'))
      );
    }

    // Filter by availability
    if (selectedAvailability !== 'all') {
      list = list.filter(sp => sp.availability === selectedAvailability);
    }

    // Sort strategy
    if (sortBy === 'distance') {
      list.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews') {
      list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else if (sortBy === 'price_repair') {
      list.sort((a, b) => a.minPriceRepair - b.minPriceRepair);
    }

    return list;
  }, [searchQuery, selectedServices, mobileOnly, insuranceOnly, selectedBrands, selectedAvailability, sortBy]);

  // Map simulated pin interaction
  const handleMapPinClick = (shopName: string, address: string) => {
    const alertDiv = document.createElement('div');
    alertDiv.className = "fixed bottom-10 right-10 z-[200] bg-white border-2 border-red-650 text-slate-800 text-xs font-bold px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in duration-300";
    alertDiv.innerHTML = `🛡️ <b>${shopName} Selected:</b> Located at ${address}. Try clicking 'Book Now' to secure your slot!`;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 4000);
  };

  // Mock Upload handlers for Main quote wizard
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

  // Mock Upload handlers for AI Assistant damage analyzer
  const handleAiPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAiUploadedPhotoName(file.name);
      setAiUploadedPhotoData(url);

      const notify = document.createElement('div');
      notify.className = "fixed bottom-10 right-10 z-[200] bg-emerald-600 text-white text-xs px-4 py-2 rounded-xl shadow-xl flex items-center gap-1.5 font-bold";
      notify.innerHTML = "📸 Windshield Photo Uploaded successfully onto client-side analysis buffers.";
      document.body.appendChild(notify);
      setTimeout(() => notify.remove(), 3000);
    }
  };

  const handleSmartAiPhotoUpload = (dataUrl: string, fileName: string) => {
    setAiUploadedPhotoName(fileName);
    setAiUploadedPhotoData(dataUrl);

    const notify = document.createElement('div');
    notify.className = "fixed bottom-10 right-10 z-[200] bg-emerald-600 text-white text-xs px-4 py-2 rounded-xl shadow-xl flex items-center gap-1.5 font-bold";
    notify.innerHTML = "📸 Windshield Photo Uploaded successfully onto client-side analysis buffers.";
    document.body.appendChild(notify);
    setTimeout(() => notify.remove(), 3000);
  };

  // Calculate and explain damage logic using AI
  const runAiDecisionMatrix = () => {
    setAiIsTyping(true);
    setTimeout(() => {
      setAiIsTyping(false);
      let verdict = "";
      let action = "";
      let estCostRange = "";
      let recommendation = "";

      if (damageTextDescription === 'star_chip' || damageTextDescription === 'bulls_eye') {
        verdict = "Standard Chip Damage identified. Under EU/Baltic motor safety checks, chips smaller than a €2 coin (~2.5cm) that are situated more than 7cm off the outer structural glass bounds are 100% repairable using high-pressure resin suction injection.";
        action = "REPAIR_RECOMMENDED";
        estCostRange = "€40 - €70";
        recommendation = "You can drive safely immediately post-resin curing (takes 25 minutes). This is typically fully covered under standard comprehensive motor glass waivers with €0 excess deductibles.";
      } else if (damageTextDescription === 'long_crack') {
        verdict = "Stress Crack identified. It appears to exceed 6.5 cm in continuous length, or runs straight into the outer weather stripping seals. Windshield glass carries up to 30% of your vehicle cab roof integrity structure; thus a split line cannot be resolved cleanly via basic resins.";
        action = "REPLACEMENT_MANDATORY";
        estCostRange = "€190 - €380 (Standard Glass / ADAS Sensor Calibration)";
        recommendation = "Full windshield swap is mandatory immediately due to cabin stress fracture risks. We advise choosing a workshop carrying full 'ADAS Camera Re-calibration' certification to ensure your smart active breaking sensors match true vehicle coordinates.";
      } else {
        verdict = "Shattered / Fractured Glass identified. Tempered safety glass is engineered to crumble into thousands of micro-pebbles under safety shocks to protect human bodies from severe lacerations.";
        action = "REPLACEMENT_MANDATORY";
        estCostRange = "€250 - €550";
        recommendation = "Warning: Vehicle is not sanitarily or structurally safe to guide down routes. Please request our 'Mobile Service Rig' dispatchers under Lithuanian Carglass or Stiklas Baltic to perform localized vacuum clearance and vacuum-fit weather-shields on-site.";
      }

      setAiResult({
        verdict,
        action,
        estimatedCostRange: estCostRange,
        recommendation
      });
    }, 1100);
  };

  // Custom AI Query flow
  const handleCustomAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = customQuery.trim();
    if (!query) return;

    // Append to conversation
    setAiChatHistory(prev => [...prev, { sender: 'user', text: query, image: aiUploadedPhotoData }]);
    setCustomQuery('');
    setAiIsTyping(true);

    setTimeout(() => {
      setAiIsTyping(false);
      const q = query.toLowerCase();
      let reply = "";

      if (q.includes('insurance') || q.includes('claim') || q.includes('kasko') || q.includes('cost')) {
        reply = "In Lithuania, Kasko and premium vehicle policies generally carry a **Glass Waiver (Stiklų draudimas)** clause that is exempt from your standard deductible tier. This means chip restorations cost €0 out-of-pocket, and complete replacements are fully paid by your insurer except for rare luxury OEM logo surcharge margins. We suggest booking specialized shops carrying the 'Insurance Claims Accepted' badge, as they interface directly with Lietuvos Draudimas, Ergo, Gjensidige, and Balcia.";
      } else if (q.includes('calibration') || q.includes('adas') || q.includes('camera') || q.includes('sensor')) {
        reply = "Any modern vehicle built after 2017 equipped with Lane Keep Assist, active emergency smart braking, or sign-recognition systems utilizes an integrated front-facing optical camera cluster mounted directly beneath the driver rearview mirror. When a windshield is swapped, the physical angle shifts by microscopic millimeters. Consequently, **ADAS electronic re-calibration** is crucial to align the virtual pixels to real road lane lines. Ensure you request workshops like **Stiklas Baltic** or **Lithuanian Carglass** who provide official digital certificates!";
      } else if (q.includes('mobile') || q.includes('comes') || q.includes('driveway') || q.includes('drive')) {
        reply = "Absolutely! Mobile services (such as GlassExpress Mobile Wizards or Lithuanian Carglass mobile dispatchers) utilize climate-regulated vehicle rigs. They can repair minor chips or swap entire panes straight inside your house garage or office parking bays as long as rain / heavy snow is shielded. A dry canvas or interior environment is needed for molecular adhesive polymers to cure successfully within 60 minutes.";
      } else if (q.includes('sunroof') || q.includes('panoramic') || q.includes('roof')) {
        reply = "Panoramic sunroofs and sliding glass require seasoned mechanics due to water-drainage channels, electronic limits programming, and motor gear lubrication. **Gediminas Auto Glass & Sunroof Labs** carries dedicated vacuum jigs and specialized silicone gaskets for panoramic roofs, ensuring zero cabin whistling at speed and watertight sealing.";
      } else if (q.includes('time') || q.includes('hours') || q.includes('cure')) {
        reply = "A standard resin chip repair takes only 20 to 30 minutes! A full windshield swap requires about 1 hour for mechanical teardown/mounting, followed by **exactly 1 hour of static curing** where the polyurethane glass adhesive cross-links. During this period, the car must sit flat, and windows should be left cracked open to prevent high internal air pressure from pushing out the newly aligned seal!";
      } else {
        reply = "That's a helpful point regarding windshield care. If you have an active crack progressing across your screen, try to seal the outer surface with transparent duct tape immediately. This blocks grit, wash chemicals, and water from clogging the inner polyvinyl butyral (PVB) laminate membrane, which keeps the visual transparency high once a specialist injects resin.";
      }

      setAiChatHistory(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 1100);
  };

  // Submit quote request from CTA
  const handleConfirmQuoteRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSuccess(true);
    setTimeout(() => {
      setQuoteSuccess(false);
      setShowQuoteModal(false);
      // Clean form fields
      setQuoteFormData({
        carPlate: '',
        carMake: '',
        carModel: '',
        damageLoc: 'front_windshield',
        damageType: 'star_chip',
        coverage: 'comprehensive',
        damageSize: 'smaller_coin',
        uploadedPhotoName: '',
        uploadedPhotoObj: null,
        clientContact: '',
        clientPhone: ''
      });

      const notify = document.createElement('div');
      notify.className = "fixed bottom-10 right-10 z-[200] bg-zinc-900 border border-zinc-850 text-white text-xs font-black px-6 py-4 rounded-2xl shadow-xl animate-bounce";
      notify.innerHTML = "✅ <b>Repair Request Broadcasted!</b> Partner laboratories will analyze your glass damage pictures and issue transparent price proposals within 30 minutes.";
      document.body.appendChild(notify);
      setTimeout(() => notify.remove(), 4500);
    }, 1800);
  };

  // Submit appointment booking
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedShopForBooking(null);

      const notify = document.createElement('div');
      notify.className = "fixed bottom-10 right-10 z-[200] bg-[#c10000] text-white text-xs font-black px-6 py-4 rounded-2xl shadow-2xl animate-fade-in";
      notify.innerHTML = `🛡️ <b>Appointment Confirmed!</b> We secured your glass repair booking slot at ${selectedShopForBooking?.name}. Please avoid washing the vehicle for 24 hours prior.`;
      document.body.appendChild(notify);
      setTimeout(() => notify.remove(), 5000);
    }, 1800);
  };

  return (
    <div className="bg-[#F5F5F7] min-h-screen text-slate-850 text-left font-sans leading-relaxed relative pb-28">

      {/* 1. HEADER SECTION */}
      <div className="bg-white border-b border-slate-200 py-8 md:py-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            
            {/* Title block */}
            <div className="space-y-2">
              <h1 id="glass-repair-heading" className="text-3xl font-bold tracking-tight text-slate-900 mt-1 font-sans">
                Find Windshield &amp; Glass Repair Specialists
              </h1>
            </div>

            {/* Map vs Grid Toggler Buttons */}
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
                  <span>Grid view</span>
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

          {/* Quick Location & Keyword search console */}
          <div className="mt-8 bg-slate-100 border border-slate-205 rounded-2xl p-3 max-w-full flex flex-col lg:flex-row items-center gap-3">
            
            <div className="relative w-full lg:w-80 shrink-0">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-650 animate-bounce" />
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="Enter city or district..."
                className="w-full bg-white text-slate-900 text-xs font-bold rounded-xl pl-10 pr-4 py-3 border border-slate-205 focus:outline-hidden focus:ring-1 focus:ring-red-600"
              />
            </div>
            
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              className="w-full lg:w-auto bg-white hover:bg-slate-50 text-slate-850 font-extrabold text-[11px] tracking-tight uppercase px-4 py-3 border border-slate-205 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Compass className="w-4 h-4 text-red-600" />
              <span>Use My Location</span>
            </button>

            <div className="h-5 w-[1px] bg-slate-250 hidden lg:block"></div>

            {/* Keyword search input */}
            <div className="relative w-full flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search specialty keywords (e.g., chip, sensor, ADAS, Tesla, sunroof)..."
                className="w-full bg-white text-slate-900 text-xs font-bold rounded-xl pl-9 pr-3 py-3 border border-slate-205 focus:outline-hidden focus:ring-1 focus:ring-red-600"
              />
            </div>

          </div>

        </div>
      </div>

      {/* CORE SPLIT SCREEN LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        
        {/* Mobile Filter Trigger Button */}
        <div className="flex md:hidden items-center justify-between mb-4 bg-white p-3 rounded-xl border border-slate-205">
          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-mono">Specialist Filter Parameters</span>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="bg-[#B30000] hover:bg-[#4A4A4A] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all duration-200"
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
                  <Sliders className="w-4 h-4 text-red-650" />
                  <span>Glass Filter Selection</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filtering Controls */}
              <div className="bg-white rounded-2xl border border-slate-205 p-5 space-y-6 shadow-xs text-left">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-extrabold text-slate-800 text-[12px] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Sliders className="w-3.5 h-3.5 text-red-650" /> Filters
                  </span>
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-[10px] text-red-650 hover:underline font-extrabold uppercase font-mono"
                  >
                    Clear All
                  </button>
                </div>

                {/* Service Types Checks */}
                <div className="space-y-2.5">
                  <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider font-mono">Service Expertise</h4>
                  <div className="space-y-2">
                    {[
                      { id: 'windshield repair', label: 'Windshield Chip Repair' },
                      { id: 'full replacement', label: 'Full Glass replacement' },
                      { id: 'side/rear window', label: 'Side/Rear window glass' },
                      { id: 'sunroof', label: 'Sunroof & Panoramic seal' }
                    ].map((svc) => {
                      const active = selectedServices.includes(svc.id);
                      return (
                        <label key={svc.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-950 select-none">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => {
                              setSelectedServices(prev => 
                                active ? prev.filter(item => item !== svc.id) : [...prev, svc.id]
                              );
                            }}
                            className="w-4 h-4 rounded-sm accent-red-600"
                          />
                          <span>{svc.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile service availability toggle */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider font-mono font-bold">On-Site Dispatch</h4>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={mobileOnly}
                      onChange={() => setMobileOnly(!mobileOnly)}
                      className="w-4 h-4 rounded-sm accent-red-600"
                    />
                    <span className="flex items-center gap-1 text-slate-700">
                      🚐 Mobile service (Comes to you)
                    </span>
                  </label>
                </div>

                {/* Insurance claim support toggle */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider font-mono font-bold">Billing Coordination</h4>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={insuranceOnly}
                      onChange={() => setInsuranceOnly(!insuranceOnly)}
                      className="w-4 h-4 rounded-sm accent-red-700"
                    />
                    <span className="flex items-center gap-1 text-slate-700">
                      🛡️ Insurance Claims Supported
                    </span>
                  </label>
                </div>

                {/* Brands/Vehicle types supported */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider font-mono">Supported Carmaker Brands</h4>
                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1 scrollbar-thin">
                    {availableBrandsList.map((brand) => {
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
                            className="w-3.5 h-3.5 rounded-sm accent-red-600"
                          />
                          <span>{brand}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Bookable Time Availability */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider font-mono">Bay Booking Slots</h4>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { id: 'all', name: 'Show All Centers' },
                      { id: 'open_now', name: 'Open Now' },
                      { id: 'today', name: 'Slots Available Today' },
                      { id: 'this_week', name: 'Book slots within 7 days' }
                    ].map((avail) => (
                      <label key={avail.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="avail_glass"
                          checked={selectedAvailability === avail.id}
                          onChange={() => setSelectedAvailability(avail.id)}
                          className="w-4 h-4 accent-red-600"
                        />
                        <span>{avail.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* MAIN COLUMN CONTENT SCREEN */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Top Sort controller info panel */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-2xs">
              <div>
                <span className="text-[10px] font-mono tracking-wider text-slate-400 block uppercase font-bold">Safety Glass Networks</span>
                <span className="font-extrabold text-slate-900 text-xs">Showing {filteredSpecialists.length} mechanical glass fitters around {searchCity}</span>
              </div>

              <div className="flex items-center gap-2 font-sans">
                <span className="text-xs text-slate-400 font-bold uppercase font-mono tracking-wider shrink-0 font-bold">Sort</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-205 text-slate-800 text-xs font-bold rounded-lg px-2.5 py-1.5 cursor-pointer focus:outline-hidden"
                >
                  <option value="distance">Distance (Nearest First)</option>
                  <option value="rating">Rating (Highest First)</option>
                  <option value="reviews">Reviews Volume</option>
                  <option value="price_repair">Repair Cost (Lowest First)</option>
                </select>
              </div>
            </div>

            {/* IF GRID MODE OR MAP MODE CHOSEN */}
            {!mapMode ? (
              
              /* RENDER MAIN SPECIALIST GRID CARDS */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                          €{sp.minPriceRepair}
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
                  <div className="col-span-1 md:col-span-2 py-16 text-center space-y-3 bg-white border border-slate-200 rounded-3xl">
                    <HelpCircle className="w-8 h-8 text-slate-350 mx-auto animate-bounce" />
                    <h4 className="font-extrabold text-slate-900 text-sm">No specialized glass specialists match these filters</h4>
                    <p className="text-slate-400 text-xs max-w-sm mx-auto">Try enabling 'All makes support' or widening your physical location parameters to discover neighboring fitters.</p>
                    <button onClick={resetAllFilters} className="text-xs text-red-650 font-bold underline">Reset Filters</button>
                  </div>
                )}
              </div>

            ) : (

              /* INTERACTIVE MAP COMPONENT SIMULATION */
              <div className="bg-zinc-900 rounded-3xl h-[490px] relative overflow-hidden border border-zinc-800 shadow-xl">
                
                {/* Simulated Grid Streets */}
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#ffffff_2px,transparent_1px)] [background-size:24px_24px] bg-zinc-950">
                  <div className="absolute inset-x-0 top-1/4 h-[1px] bg-zinc-800"></div>
                  <div className="absolute inset-x-0 top-2/3 h-[1px] bg-zinc-800"></div>
                  <div className="absolute inset-y-0 left-1/3 w-[1px] bg-zinc-800"></div>
                  <div className="absolute inset-y-0 left-3/4 w-[1px] bg-zinc-800"></div>
                </div>

                {/* Simulated Green Park Zone */}
                <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-emerald-900/25 blur-xl"></div>
                
                {/* Map Directions Legend panel */}
                <div className="absolute top-5 left-5 bg-black/85 backdrop-blur-md p-4 rounded-2xl border border-zinc-800 max-w-xs text-left text-white z-20 space-y-2">
                  <div className="flex items-center gap-1 text-red-500 font-extrabold text-[10px] uppercase tracking-widest font-mono">
                    <Zap className="w-3.5 h-3.5" />
                    <span>Active Map Radar</span>
                  </div>
                  <h4 className="text-xs font-black">Vilnius Glass Bay Occupancy</h4>
                  <p className="text-[10px] text-zinc-400">Click any red destination beacon to inspect live ADAS calibration availability slots & book repairs immediately.</p>
                </div>

                {/* Map Pins */}
                {filteredSpecialists.map((sp, idx) => {
                  const offsets = [
                    { top: '35%', left: '20%' },
                    { top: '65%', left: '42%' },
                    { top: '25%', left: '72%' },
                    { top: '50%', left: '55%' },
                    { top: '75%', left: '15%' }
                  ];
                  const pos = offsets[idx % offsets.length];

                  return (
                    <button
                      type="button"
                      key={sp.id}
                      onClick={() => handleMapPinClick(sp.name, sp.address)}
                      style={{ top: pos.top, left: pos.left }}
                      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                    >
                      <div className="relative flex items-center justify-center">
                        {/* Pulse effect */}
                        <span className="animate-ping absolute inline-flex h-11 w-11 rounded-full bg-red-600 opacity-75"></span>
                        
                        <div className="relative bg-white hover:bg-slate-100 border-2 border-red-650 text-slate-900 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 transition-transform group-hover:scale-105">
                          <span className="text-xs">{sp.logo}</span>
                          <div className="text-left font-sans">
                            <p className="text-[9px] font-black text-[#8B0000] leading-none uppercase">{sp.name.split(' ')[0]}</p>
                            <p className="text-[8px] text-red-650 font-black font-mono mt-0.5">★ {sp.rating} (Dist: {sp.distance}km)</p>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}

                {/* Map Coordinate Scale overlay */}
                <span className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md border border-zinc-800 text-[9px] font-bold text-zinc-400 uppercase tracking-widest px-2.5 py-1 rounded-md font-mono">
                  Scale: 1 : 12,000 WGS84 Vilnius Old Town
                </span>

              </div>

            )}

            {/* 3. MID-PAGE CTA WIDGET: BROADCAST REPAIR REQUESTS */}
            <div className="relative bg-white border border-slate-205 rounded-3xl p-6 md:p-8 shadow-sm text-left overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-red-500/5 rounded-full blur-xl pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 bg-red-55 border border-red-100 px-2.5 py-1 rounded-md text-[10px] font-bold text-red-700 tracking-wider uppercase font-mono">
                    <Zap className="w-3 h-3 text-red-600 animate-pulse" />
                    <span>No deductible stone repairs</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-[#8B0000] tracking-tight leading-snug">
                    Have a chip or crack? Create a repair request and get quotes
                  </h2>
                  <p className="text-xs text-slate-500 max-w-xl font-medium">
                    Transmit your damage information to all registered glass specialists in the Vilnius region. Receive competing price proposals, insurance claim checks, and pick-up options within minutes.
                  </p>
                </div>

                <div className="shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setQuoteFormData(prev => ({
                        ...prev,
                        uploadedPhotoName: '',
                        uploadedPhotoObj: null
                      }));
                      setShowQuoteModal(true);
                    }}
                    className="w-full md:w-auto bg-[#c10000] hover:bg-[#a10000] text-white text-xs font-black uppercase tracking-wider font-mono px-6 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-white" />
                    <span>Create Repair Request</span>
                  </button>
                </div>
              </div>

              {/* Quick statistics layout row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 text-left">
                {[
                  { label: "Insurance Liaison", desc: "Ergo, Balcia, Gjensidige" },
                  { label: "Avg Chip Resin Cure", desc: "Clean & flat in 25 mins" },
                  { label: "Mobile Vans Dispatching", desc: "Same-day house calls" },
                  { label: "Structural Safety Guarantee", desc: "ECE R43 certified safety glass" }
                ].map((stat, i) => (
                  <div key={i} className="space-y-0.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none font-mono">{stat.label}</p>
                    <p className="text-xs font-black text-slate-800 leading-snug">{stat.desc}</p>
                  </div>
                ))}
              </div>

            </div>

            {/* 4. BOTTOM AI ASSISTANT PANEL */}
            <div className="bg-white border border-slate-205 rounded-3xl p-6 md:p-8 shadow-sm text-left space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-red-650 font-extrabold uppercase text-[10px] tracking-wider font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-red-600 animate-spin" />
                    <span>Live Glass Stress Analyzer Core</span>
                  </div>
                  <h3 className="text-lg font-black text-[#8B0000] tracking-tight">
                    Ask AI: Glass Damage Estimator
                  </h3>
                  <p className="text-xs text-slate-400 font-bold">
                    Upload a photo of the damage or tweak parameters to immediately estimate repair vs full replacement cost.
                  </p>
                </div>

                {/* Manual selector parameter for instant estimation checks */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-500 font-mono uppercase tracking-wider">Damage Type:</span>
                  <select
                    value={damageTextDescription}
                    onChange={(e) => {
                      setDamageTextDescription(e.target.value);
                      setTimeout(() => runAiDecisionMatrix(), 100);
                    }}
                    className="bg-slate-55 border border-slate-200 rounded-lg p-1.5 text-xs text-slate-850 font-bold cursor-pointer focus:outline-hidden"
                  >
                    <option value="star_chip">Star-shaped Chip (Smaller €2 coin)</option>
                    <option value="bulls_eye">Bulls-eye Impact circle</option>
                    <option value="long_crack">Linear Stress Crack (&gt; 6cm length)</option>
                    <option value="complete_shatter">Shattered / Heavily Fractured Panel</option>
                  </select>

                  <button
                    onClick={runAiDecisionMatrix}
                    className="bg-zinc-900 text-white hover:bg-zinc-800 text-[10px] font-black uppercase tracking-wider font-mono px-3 py-2 rounded-lg cursor-pointer transition-all active:scale-95"
                  >
                    Stress Analyze
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
                
                {/* Left hand interactive photo upload sandbox */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono tracking-widest text-[#8B0000] block uppercase font-bold">📸 Upload Damaged Glass Facade</span>
                    <p className="text-xs text-slate-500 font-medium">Our system scans crack depth and analyzes pixel stress fractile borders to forecast structural failure logs.</p>
                  </div>

                  <UniversalSmartUpload
                    photoKey="glass_ai_damage"
                    uploadedImageSrc={aiUploadedPhotoData}
                    onUploadSuccess={handleSmartAiPhotoUpload}
                    onClear={() => {
                      setAiUploadedPhotoName('');
                      setAiUploadedPhotoData(null);
                    }}
                    label="Windshield Photo Capture"
                    description="Take a direct close-up snapshot of the windshield chip/crack."
                  />

                  {aiUploadedPhotoData && (
                    <button
                      type="button"
                      onClick={() => {
                        setAiIsTyping(true);
                        setTimeout(() => {
                          setAiIsTyping(false);
                          setAiChatHistory(prev => [
                            ...prev,
                            { 
                              sender: 'ai', 
                              text: `🔍 **IMAGE RECOGNITION REPORT ON FILENAME: ${aiUploadedPhotoName}**\n- Optical classification detects: Circular impact crater (bull's-eye pattern) with micro radial stress fracture lines radiating outward.\n- Location checks: Inactive visibility zone, roughly 12cm off the wiper arm resting position.\n- Estimated diameter: 1.8cm (Safe margin for high-tension resin vacuums).\n- **Structural Diagnostic:** 100% physically repairable. No replacement needed! If booked at Stiklas Baltic, this qualifies for €0 out-of-pocket insurance waiver processing.` 
                            }
                          ]);
                        }, 1200);
                      }}
                      className="w-full bg-[#c10000] hover:bg-[#a10000] text-white text-[11px] font-black uppercase tracking-wider font-mono py-2 rounded-xl transition-all"
                    >
                      Analyze Uploaded Photo
                    </button>
                  )}
                </div>

                {/* Middle output matrix results section */}
                <div className="bg-red-50/50 border border-red-100 rounded-2xl p-5 flex flex-col justify-between text-left">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-red-100 pb-2">
                      <span className="text-[10px] font-mono tracking-widest text-[#c10000] font-black uppercase">Live Diagnostic Verdict</span>
                      <span className="text-[10px] font-mono bg-red-650 text-white px-2 py-0.5 rounded-md font-bold uppercase">{aiResult.action}</span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-slate-800 font-semibold leading-relaxed">
                        {aiResult.verdict}
                      </p>
                      
                      {aiResult.recommendation && (
                        <p className="text-[11px] text-slate-500 font-medium bg-white p-2.5 rounded-lg border border-slate-150">
                          ℹ️ <b>Pro Recommendation:</b> {aiResult.recommendation}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-red-100 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-black">Est. Price Tier</span>
                    <span className="text-base font-black text-slate-900">{aiResult.estimatedCostRange}</span>
                  </div>
                </div>

                {/* Right hand dynamic chat client block */}
                <div className="bg-slate-900 rounded-2xl p-4 flex flex-col justify-between max-h-[340px] border border-slate-800">
                  
                  {/* Chat logs render */}
                  <div className="space-y-3 overflow-y-auto max-h-[220px] scrollbar-thin scrollbar-thumb-zinc-800 text-left mb-3 pr-2">
                    {aiChatHistory.map((msg, idx) => (
                      <div key={idx} className={`p-2.5 rounded-xl text-xs leading-relaxed max-w-[90%] ${
                        msg.sender === 'ai' 
                          ? 'bg-slate-800 text-slate-200 border border-slate-700/50 self-start' 
                          : 'bg-red-650 text-white font-semibold ml-auto'
                      }`}>
                        {msg.text}
                      </div>
                    ))}

                    {aiIsTyping && (
                      <div className="bg-slate-800 text-slate-350 p-2.5 rounded-xl text-xs max-w-[80px] text-center border border-slate-700/50 animate-pulse">
                        Analyzing...
                      </div>
                    )}
                  </div>

                  {/* Typing form */}
                  <form onSubmit={handleCustomAiSubmit} className="flex gap-1.5 border-t border-slate-800 pt-2 shrink-0">
                    <input
                      type="text"
                      value={customQuery}
                      onChange={(e) => setCustomQuery(e.target.value)}
                      placeholder="Type custom glass query..."
                      className="bg-slate-800 text-white text-xs font-semibold rounded-lg flex-1 px-3 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-red-600 border border-slate-700 placeholder:text-zinc-500"
                    />
                    <button
                      type="submit"
                      className="bg-red-650 hover:bg-red-500 text-white p-1.5 rounded-lg transition-transform active:scale-95 cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </form>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* CREATE REPAIR REQUEST MOCKUP MODAL DIALOG */}
      <AnimatePresence>
        {showQuoteModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-6 text-left border border-slate-200 shadow-2xl relative overflow-y-auto max-h-[92vh]"
            >
              <button
                type="button"
                onClick={() => setShowQuoteModal(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-red-600 font-extrabold uppercase text-[10px] tracking-wider font-mono">
                  <Zap className="w-4 h-4 text-red-650 animate-pulse" />
                  <span>National Glass RFQ Broadcaster</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Create Repair Request</h3>
                <p className="text-xs text-slate-500">
                  Submit critical panel details and snap immediate damage snapshots to broadcast specs to certified glass mechanics instantly.
                </p>
              </div>

              {quoteSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-100 animate-pulse">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h4 className="text-base font-black text-slate-955">Repair Claim Transmitted</h4>
                  <p className="text-xs text-slate-450 max-w-sm mx-auto">
                    Your windshield specifications have been compiled. Diagnostic systems verified zero glass stress violations. Bids with calibrated ADAS quotes will arrive in 15 mins via SMS.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleConfirmQuoteRequest} className="space-y-4 font-sans">
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 font-mono">Licence Plate *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. LKN990"
                        value={quoteFormData.carPlate}
                        onChange={(e) => setQuoteFormData({...quoteFormData, carPlate: e.target.value.toUpperCase()})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold uppercase text-slate-900 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 font-mono">Vehicle Details *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. BMW X5 2021"
                        value={quoteFormData.carMake}
                        onChange={(e) => setQuoteFormData({...quoteFormData, carMake: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 font-mono">Cracked Location</label>
                      <select
                        value={quoteFormData.damageLoc}
                        onChange={(e) => setQuoteFormData({...quoteFormData, damageLoc: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
                      >
                        <option value="front_windshield">Front Windshield</option>
                        <option value="rear_glass">Rear Window (Heated)</option>
                        <option value="side_driver">Driver Side Glass</option>
                        <option value="side_passenger">Passenger Side Glass</option>
                        <option value="sunroof">Panoramic Sunroof</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 font-mono">Crack Size</label>
                      <select
                        value={quoteFormData.damageSize}
                        onChange={(e) => setQuoteFormData({...quoteFormData, damageSize: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
                      >
                        <option value="smaller_coin">Smaller than €2 coin (Chip)</option>
                        <option value="larger_coin">Larger than €2 coin (Major Chip)</option>
                        <option value="long_line">Continuous linear crack line (&gt;2.5cm)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 font-mono">Insurance coverage</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'comprehensive', label: 'Comp. (Kasko)' },
                        { id: 'third_party', label: 'Third-Party' },
                        { id: 'uninsured', label: 'Self Paying' }
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setQuoteFormData({...quoteFormData, coverage: item.id})}
                          className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                            quoteFormData.coverage === item.id 
                              ? 'bg-red-50 text-red-700 border-red-300' 
                              : 'bg-slate-50 text-slate-600 border-slate-200'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 font-mono">Damage Photos *</label>
                    <UniversalSmartUpload
                      photoKey="glass_quote_damage"
                      uploadedImageSrc={quoteFormData.uploadedPhotoObj}
                      onUploadSuccess={handleSmartQuotePhotoUpload}
                      onClear={() => setQuoteFormData({...quoteFormData, uploadedPhotoObj: null, uploadedPhotoName: ''})}
                      label="Damage Registration Camera"
                      description="Position your phone camera parallel to the glass breach for ideal depth estimation."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 font-mono">My Name *</label>
                      <input
                        type="text"
                        required
                        value={quoteFormData.clientContact}
                        onChange={(e) => setQuoteFormData({...quoteFormData, clientContact: e.target.value})}
                        placeholder="John Doe"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 font-mono">WhatsApp / Phone *</label>
                      <input
                        type="tel"
                        required
                        value={quoteFormData.clientPhone}
                        onChange={(e) => setQuoteFormData({...quoteFormData, clientPhone: e.target.value})}
                        placeholder="+370 600 00000"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#c10000] hover:bg-[#a10000] text-white text-xs font-bold uppercase tracking-wider font-mono py-3 rounded-xl transition-all shadow-xs"
                  >
                    Broadcast Custom Specs
                  </button>

                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DETAILED APPOINTMENT BOOKING MODAL */}
      <AnimatePresence>
        {selectedShopForBooking && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 space-y-6 text-left border border-slate-200 shadow-2xl relative overflow-y-auto max-h-[92vh]"
            >
              <button
                type="button"
                onClick={() => setSelectedShopForBooking(null)}
                className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1.5 flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-105 rounded-xl flex items-center justify-center text-2xl border border-slate-205">
                  {selectedShopForBooking.logo}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{selectedShopForBooking.name}</h3>
                  <p className="text-xs text-slate-400 font-bold">📍 {selectedShopForBooking.address} (Rating: {selectedShopForBooking.rating} ★)</p>
                </div>
              </div>

              {bookingSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-red-55 rounded-full flex items-center justify-center mx-auto text-[#c10000] border border-red-100 animate-pulse">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h4 className="text-base font-black text-slate-900">Appointment Registered</h4>
                  <p className="text-xs text-slate-450 max-w-sm mx-auto">
                    We have transmitted your reservation details to the shop's front office software. A digital barcode check-in code has been sent to your phone.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleConfirmBooking} className="space-y-4 font-sans text-left">
                  
                  <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl space-y-1">
                    <p className="text-[10px] font-mono text-red-650 font-black uppercase leading-none">Starting Service Quote</p>
                    <p className="text-xs text-slate-700 font-bold leading-normal">
                      Resin Repair ranges €{selectedShopForBooking.minPriceRepair} - €75, while full factory-standard safety glass replacements map to €{selectedShopForBooking.minPriceReplacement} - €450 based on vehicle ADAS camera parameters.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 font-mono">My Name *</label>
                      <input
                        type="text"
                        required
                        value={bookingFormData.name}
                        onChange={(e) => setBookingFormData({...bookingFormData, name: e.target.value})}
                        placeholder="John Doe"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 font-mono">Mobile / Phone *</label>
                      <input
                        type="tel"
                        required
                        value={bookingFormData.phone}
                        onChange={(e) => setBookingFormData({...bookingFormData, phone: e.target.value})}
                        placeholder="+370 600 00000"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 font-mono">Car Manufacturer Brand</label>
                      <input
                        type="text"
                        required
                        value={bookingFormData.carMake}
                        onChange={(e) => setBookingFormData({...bookingFormData, carMake: e.target.value})}
                        placeholder="e.g. Audi"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 font-mono">Car Model</label>
                      <input
                        type="text"
                        required
                        value={bookingFormData.carModel}
                        onChange={(e) => setBookingFormData({...bookingFormData, carModel: e.target.value})}
                        placeholder="e.g. A6 Avant"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 font-mono">Service Selection</label>
                      <select
                        value={bookingFormData.serviceType}
                        onChange={(e) => setBookingFormData({...bookingFormData, serviceType: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
                      >
                        <option value="windshield repair">Windshield Chip Repair</option>
                        <option value="full replacement">Complete Windshield Replacement</option>
                        <option value="side/rear window">Side/Rear Window Swap</option>
                        <option value="sunroof">Sunroof repair</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 font-mono">Insurance coordination</label>
                      <select
                        value={bookingFormData.insuranceClaim}
                        onChange={(e) => setBookingFormData({...bookingFormData, insuranceClaim: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
                      >
                        <option value="no">Self-payment (Cash/Card)</option>
                        <option value="yes">Under active insurance policy</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 font-mono">Target Date *</label>
                      <input
                        type="date"
                        required
                        value={bookingFormData.bookingDate}
                        onChange={(e) => setBookingFormData({...bookingFormData, bookingDate: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 font-mono">Preferred Slot *</label>
                      <input
                        type="time"
                        required
                        value={bookingFormData.bookingTime}
                        onChange={(e) => setBookingFormData({...bookingFormData, bookingTime: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {selectedShopForBooking.mobileAvailable && (
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 font-mono">Mobile dispatch ?</label>
                      <select
                        value={bookingFormData.mobileDispatch}
                        onChange={(e) => setBookingFormData({...bookingFormData, mobileDispatch: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-hidden"
                      >
                        <option value="no">No, I will bring the vehicle to the curing center</option>
                        <option value="yes">Yes, dispatch mobile specialist rig (+€25 or free depending on insurance)</option>
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-[#c10000] hover:bg-[#a10000] text-white text-xs font-bold uppercase tracking-wider font-mono py-3.5 rounded-xl transition-all shadow-xs"
                  >
                    Confirm Glass Booking
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

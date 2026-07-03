/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import { 
  Search, Droplets, Zap, Wind, Sparkles, Hammer, 
  Wrench, Car, Scissors, Stethoscope, GraduationCap,
  MapPin, HelpCircle, ShieldCheck, ChevronLeft, ChevronRight, CheckCircle,
  Truck, Bug, Sprout, Shield, FileText, Utensils, Heart, Camera, HardHat, Paintbrush,
  Palette, Disc, Megaphone, Grid, Crown, Gem, Award, Sliders, Layers, Scale,
  User, ShieldX, Map as MapIcon, RefreshCw, Upload, AlertTriangle, Eye, Send, Star, Phone, Clock, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import UniversalSmartUpload from './UniversalSmartUpload';
import FindMechanicSection from './FindMechanicSection';
import AutoPaintersSection from './AutoPaintersSection';
import TireDealersSection from './TireDealersSection';
import DetailingCompaniesSection from './DetailingCompaniesSection';
import GlassRepairSection from './GlassRepairSection';
import RustProtectionSection from './RustProtectionSection';
import WrappingAdvertisingSection from './WrappingAdvertisingSection';
import MetalworkFabricationSection from './MetalworkFabricationSection';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 120, 
      damping: 18 
    } 
  }
};

interface ServiceCategoryItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  features: string[];
}

interface ServiceProviderItem {
  id: string;
  name: string;
  category: string;
  specialty: string;
  location: string;
  address: string;
  jobs: number;
  rating: number;
  rate: number;
  image: string;
  supportedBrands: string[];
  certifications: string[];
  languages: string[];
  availability: 'open_now' | 'today' | 'this_week';
  distance: number;
}

// Exactly 14 service categories as requested
const SERVICE_CATEGORIES: ServiceCategoryItem[] = [
  { 
    id: 'mechanics', 
    name: 'Mechanics', 
    icon: Wrench, 
    description: 'Certified general repair, engine tune-ups, advanced OBD diagnostics, and suspension alignment.',
    features: ['Engine Diagnosis', 'Brake Systems', 'Oil & Filters']
  },
  { 
    id: 'auto-painters', 
    name: 'Auto Painters', 
    icon: Paintbrush, 
    description: 'Premium oven body paint, cosmetic scratch remediation, and exact factor color-matching.',
    features: ['Dupont Enamel Paint', 'Scratch Fixes', 'Full Overhauls']
  },
  { 
    id: 'tire-dealers', 
    name: 'Tire Dealers', 
    icon: Disc, 
    description: 'High-performance summer & winter tires, computerized wheel balance, and alignment jigs.',
    features: ['Seasonal Mounting', 'Laser Aligning', 'Pressure Tuning']
  },
  { 
    id: 'detailing', 
    name: 'Detailing', 
    icon: Sparkles, 
    description: 'Multi-stage paint correction, Nanotechnology ceramic sealing, and intensive leather shampooing.',
    features: ['9H Glass Coating', 'Steam Polish', 'Interior Detailing']
  },
  { 
    id: 'glass-repair', 
    name: 'Glass Repair/Replacement', 
    icon: Grid, 
    description: 'ADAS-calibrated windshield fits, immediate chip resin injections, and rear window heating fixing.',
    features: ['ADAS Calibration', 'Chip Solidification', 'Tempered Fits']
  },
  { 
    id: 'rust-protection', 
    name: 'Rust & Underbody', 
    icon: ShieldCheck, 
    description: 'Chassis salt washing, frame polyurethane protection coatings, and corrosion preventative sealing.',
    features: ['Cavity Wax Sealing', 'Corrosion Inhibitor', 'Frame Protection']
  },
  { 
    id: 'wrapping', 
    name: 'Wrapping & Advertising', 
    icon: Layers, 
    description: 'Satin & matte color changes, self-healing paint protection film (PPF), and corporate fleet layouts.',
    features: ['PPF Shield Wrap', 'Chrome Delete', 'Commercial Decals']
  },
  { 
    id: 'metalwork', 
    name: 'Metalwork & Fabrication', 
    icon: Hammer, 
    description: 'State-certified argon MIG/TIG welding, FIA rollcage designs, panel beating, and chassis jig repair.',
    features: ['TIG Alloy Welds', 'FIA Rollcages', 'Frame Jig Repairs']
  },
  { 
    id: 'ev-specialists', 
    name: 'EV Specialists', 
    icon: Zap, 
    description: 'High-voltage safety diagnostics, lithium battery cell diagnostics, state-of-health reports, and hybrid motors.',
    features: ['HV Insulated Plugs', 'Li-Ion Cell Balance', 'SOH Certification']
  },
  { 
    id: 'gas-repair', 
    name: 'Gas Repair Specialists', 
    icon: Wind, 
    description: 'LPG/CNG alternative fuel system safety inspections, regulator calibrations, and line pressure debugging.',
    features: ['LPG Certification', 'Pressure Leak Tests', 'Gas Injector Clean']
  },
  { 
    id: 'upholstery', 
    name: 'Upholstery Specialists', 
    icon: Scissors, 
    description: 'Original Alcantara stitching, custom steering wheel re-wraps, headliner restorations, and seat foam support repair.',
    features: ['Alcantara Stitching', 'Sagging Headliners', 'Premium Leather']
  },
  { 
    id: 'tax-registration', 
    name: 'Tax & Registration Advisors', 
    icon: FileText, 
    description: 'EU automotive custom imports duty calculations, vintage registration certificates, and technical pass advisory.',
    features: ['Technical Passport', 'Tax Duty Refunds', 'Vintage Car Plates']
  },
  { 
    id: 'tuning-styling', 
    name: 'Tuning & Styling', 
    icon: Sliders, 
    description: 'Stage 1/2 ECU remapping, performance dynamic exhaust, lowered air suspension, and aero body kit fitting.',
    features: ['Dyno Tuning', 'Coilover Setup', 'Carbon Aero Fits']
  },
  { 
    id: 'automotive-consultants', 
    name: 'Automotive Consultants', 
    icon: HelpCircle, 
    description: 'Professional mechanical pre-buy screening, heavy machinery evaluations, and insurance value appraisals.',
    features: ['Pre-Buy Inspector', 'Valuation Reports', 'Arbitration Advice']
  }
];

// Rich, filterable dataset of service providers covering everything
const SERVICE_PROVIDERS: ServiceProviderItem[] = [
  {
    id: 'p-1',
    name: 'Vilnius Elite Auto Paint & Body',
    category: 'auto-painters',
    specialty: 'Dupont Oven Paint & body styling repairs',
    location: 'Vilnius',
    address: 'Savanorių pr. 178C, Vilnius',
    jobs: 940,
    rating: 4.9,
    rate: 55,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=600',
    supportedBrands: ['BMW', 'Audi', 'Mercedes', 'Volkswagen'],
    certifications: ['ISO 9001', 'Dupont Certified'],
    languages: ['Lithuanian', 'English', 'Russian'],
    availability: 'open_now',
    distance: 1.8
  },
  {
    id: 'p-2',
    name: 'Gediminas Performance ECU Tuners',
    category: 'tuning-styling',
    specialty: 'Laser-jig Dyno tuning & air intake upgrades',
    location: 'Vilnius',
    address: 'Naujoji Vilnia g. 42, Vilnius',
    jobs: 1450,
    rating: 5.0,
    rate: 85,
    image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=600',
    supportedBrands: ['BMW', 'Audi', 'Porsche', 'Tesla'],
    certifications: ['TUV Approved', 'ASE Certified'],
    languages: ['English', 'German', 'Lithuanian'],
    availability: 'today',
    distance: 3.2
  },
  {
    id: 'p-3',
    name: 'Baltic Premium Custom PPF & Wraps',
    category: 'wrapping',
    specialty: '3M Self-healing paint protection film',
    location: 'Vilnius',
    address: 'Laisvės pr. 91, Vilnius',
    jobs: 620,
    rating: 4.8,
    rate: 70,
    image: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&q=80&w=600',
    supportedBrands: ['Tesla', 'Porsche', 'Audi', 'BMW'],
    certifications: ['3M Certified Wrap Master'],
    languages: ['English', 'Lithuanian', 'Polish'],
    availability: 'this_week',
    distance: 2.1
  },
  {
    id: 'p-4',
    name: 'Nordic High-Voltage EV Masters',
    category: 'ev-specialists',
    specialty: 'Lithium battery scanning & drive unit repairs',
    location: 'Vilnius',
    address: 'Gariūnų g. 110, Vilnius',
    jobs: 310,
    rating: 4.9,
    rate: 90,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600',
    supportedBrands: ['Tesla', 'Audi', 'Nissan', 'Hyundai'],
    certifications: ['High-Voltage Level 4 Safety', 'ISO 9001'],
    languages: ['English', 'Lithuanian'],
    availability: 'open_now',
    distance: 4.5
  },
  {
    id: 'p-5',
    name: 'Savanoriai LPG & CNG Gas Safety Lab',
    category: 'gas-repair',
    specialty: 'LPG system certification, filters, & valve safety',
    location: 'Vilnius',
    address: 'Savanorių pr. 240, Vilnius',
    jobs: 780,
    rating: 4.7,
    rate: 45,
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
    supportedBrands: ['Toyota', 'Opel', 'Volkswagen', 'Subaru'],
    certifications: ['State Gas Safety Authority Approved'],
    languages: ['Lithuanian', 'Russian', 'Polish'],
    availability: 'today',
    distance: 5.1
  },
  {
    id: 'p-6',
    name: 'Vilnius Custom Alcantara Cabin Restorers',
    category: 'upholstery',
    specialty: 'Custom steering re-wraps & micro-fiber stitchings',
    location: 'Vilnius',
    address: 'Nemenčinės pl. 14, Vilnius',
    jobs: 240,
    rating: 5.0,
    rate: 60,
    image: 'https://images.unsplash.com/photo-1617469767053-d3b508a0d825?auto=format&fit=crop&q=80&w=600',
    supportedBrands: ['Porsche', 'BMW', 'Mercedes', 'Classic'],
    certifications: ['Master Craftsman Guild'],
    languages: ['Lithuanian', 'English', 'German'],
    availability: 'this_week',
    distance: 6.3
  },
  {
    id: 'p-7',
    name: 'Euro-Customs Tax & Import Advisors',
    category: 'tax-registration',
    specialty: 'Interstate vehicle registration & import duty relief',
    location: 'Vilnius',
    address: 'Ukmergės g. 315, Vilnius',
    jobs: 910,
    rating: 4.8,
    rate: 80,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600',
    supportedBrands: ['All Brands', 'American imports'],
    certifications: ['Certified customs clearance officer'],
    languages: ['Lithuanian', 'English', 'Russian', 'Polish'],
    availability: 'today',
    distance: 2.7
  },
  {
    id: 'p-8',
    name: 'Baltic Premium Pre-Buy Appraisals',
    category: 'automotive-consultants',
    specialty: 'Diagnostic paint-depth scans & drivetrain audits',
    location: 'Vilnius',
    address: 'Paupio g. 18, Vilnius',
    jobs: 380,
    rating: 4.9,
    rate: 75,
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=600',
    supportedBrands: ['All Brands', 'Porsche', 'Audi', 'Tesla'],
    certifications: ['Automobile Appraiser Syndicate Approved'],
    languages: ['Lithuanian', 'English', 'German'],
    availability: 'open_now',
    distance: 1.2
  },
  {
    id: 'p-9',
    name: 'Vilnius RustShield Undercoatings',
    category: 'rust-protection',
    specialty: 'Dinitrol certified cavity wax & high-pressure steam cleaning',
    location: 'Vilnius',
    address: 'Verkių g. 29, Vilnius',
    jobs: 1120,
    rating: 4.9,
    rate: 50,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600',
    supportedBrands: ['BMW', 'Toyota', 'Subaru', 'Audi'],
    certifications: ['Dinitrol Certified Lab'],
    languages: ['Lithuanian', 'Russian'],
    availability: 'open_now',
    distance: 3.9
  }
];

interface ServicesPageProps {
  onSelectService: (serviceId: string) => void;
  initialCategory?: string | null;
  initialSearchQuery?: string;
  onCategoryChange?: (category: string | null) => void;
}

export default function ServicesPage({ 
  onSelectService, 
  initialCategory = null, 
  initialSearchQuery = '',
  onCategoryChange
}: ServicesPageProps) {
  // Global search parameters
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [searchCity, setSearchCity] = useState<string>('Vilnius, Lithuania');
  const [mapMode, setMapMode] = useState<boolean>(false);
  
  // Selected category trigger state
  const [selectedCat, setSelectedCat] = useState<string | null>(initialCategory);

  // Global filters
  const [selectedCertification, setSelectedCertification] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');

  // Booking Modal
  const [bookingWorkshop, setBookingWorkshop] = useState<ServiceProviderItem | null>(null);
  const [bookingFormData, setBookingFormData] = useState({
    name: '',
    phone: '',
    carMake: '',
    carModel: '',
    preferredDate: '2026-06-25',
    preferredTime: '11:00',
    notes: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Repair Request / RFQ Dialog
  const [showQuoteModal, setShowQuoteModal] = useState<boolean>(false);
  const [quoteFormData, setQuoteFormData] = useState({
    carPlate: '',
    carMake: '',
    carModel: '',
    serviceCategory: 'mechanics',
    damageUrgency: 'standard',
    uploadedPhotoName: '',
    uploadedPhotoObj: null as string | null,
    clientContactName: '',
    clientPhone: '',
    additionalDetails: ''
  });
  const [quoteSuccess, setQuoteSuccess] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Assistant Widget states
  const [aiQuery, setAiQuery] = useState<string>('');
  const [aiIsTyping, setAiIsTyping] = useState<boolean>(false);
  const [aiActiveMatchCategory, setAiActiveMatchCategory] = useState<string | null>(null);
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string; matchedCat?: string }>>([
    {
      sender: 'ai',
      text: "Welcome back! I am your Redline AI Service Advisor. Describe your vehicle symptoms or desired upgrades (e.g., 'rust near wheel arches', 'electric range diagnostics', 'Alcantara replacement', 'ECU map to improve fuel efficiency'). I will isolate the perfect category and list matches instantly!"
    }
  ]);

  const carouselRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setSelectedCat(initialCategory);
  }, [initialCategory]);

  React.useEffect(() => {
    onCategoryChange?.(selectedCat);
  }, [selectedCat, onCategoryChange]);

  React.useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  // Reset active search variables
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCertification('all');
    setSelectedBrand('all');
    setSelectedLanguage('all');
    setSelectedAvailability('all');
    setAiActiveMatchCategory(null);
  };

  // Sync GPS Coordinates
  const triggerGpsSync = () => {
    setSearchCity('Vilnius Industrial Parks (Detected)');
    const notification = document.createElement('div');
    notification.className = "fixed bottom-24 left-1/2 -translate-x-1/2 z-[150] bg-[#8B0000] text-white text-xs font-mono px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-red-500 animate-bounce";
    notification.innerHTML = "🎯 GPS Verified: Displaying 14 core automotive categories based on local proximity";
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2500);
  };

  // Trigger search filters applying across ALL categories
  const filteredPopularProviders = useMemo(() => {
    let list = [...SERVICE_PROVIDERS];

    // Search query keyword filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.specialty.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Global filters application
    if (selectedCertification !== 'all') {
      list = list.filter(p => p.certifications.some(c => c.toLowerCase().includes(selectedCertification.toLowerCase())));
    }

    if (selectedBrand !== 'all') {
      list = list.filter(p => p.supportedBrands.some(b => b.toLowerCase().includes(selectedBrand.toLowerCase())) || p.supportedBrands.includes('All Brands'));
    }

    if (selectedLanguage !== 'all') {
      list = list.filter(p => p.languages.includes(selectedLanguage));
    }

    if (selectedAvailability !== 'all') {
      list = list.filter(p => p.availability === selectedAvailability);
    }

    return list.sort((a, b) => b.rating - a.rating);
  }, [searchQuery, selectedCertification, selectedBrand, selectedLanguage, selectedAvailability]);

  // Handle Carousel Scrolling
  const handleCarouselScroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const amount = direction === 'left' ? -340 : 340;
      carouselRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Quick Book Action
  const handleConfirmQuickReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingWorkshop(null);
      
      const notify = document.createElement('div');
      notify.className = "fixed bottom-10 right-10 z-[200] bg-neutral-900 border border-neutral-800 text-white text-xs font-bold px-6 py-4 rounded-xl shadow-2xl animate-bounce";
      notify.innerHTML = `🏁 <b>Automotive Booking Secured!</b> A bay diagnostic slot has been reserved. Check your dispatch communications.`;
      document.body.appendChild(notify);
      setTimeout(() => notify.remove(), 4000);
    }, 1200);
  };

  // Submit Global Repair Request with Photos
  const handleConfirmGlobalQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSuccess(true);
    setTimeout(() => {
      setQuoteSuccess(false);
      setShowQuoteModal(false);
      setQuoteFormData({
        carPlate: '',
        carMake: '',
        carModel: '',
        serviceCategory: 'mechanics',
        damageUrgency: 'standard',
        uploadedPhotoName: '',
        uploadedPhotoObj: null,
        clientContactName: '',
        clientPhone: '',
        additionalDetails: ''
      });

      const notify = document.createElement('div');
      notify.className = "fixed bottom-10 right-10 z-[200] bg-[#8B0000] text-white text-xs font-black px-6 py-4 rounded-xl shadow-xl animate-fade-in";
      notify.innerHTML = "🛠️ <b>Broadcast Complete!</b> Your repair request with pictures has been sent. Certified operators will submit live estimates shortly.";
      document.body.appendChild(notify);
      setTimeout(() => notify.remove(), 4500);
    }, 1500);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        setQuoteFormData(prev => ({
          ...prev,
          uploadedPhotoName: file.name,
          uploadedPhotoObj: URL.createObjectURL(file)
        }));
      }, 1000);
    }
  };

  const handleSmartServicesUpload = (dataUrl: string, fileName: string) => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setQuoteFormData(prev => ({
        ...prev,
        uploadedPhotoName: fileName,
        uploadedPhotoObj: dataUrl
      }));
    }, 1000);
  };

  // Submit AI Query
  const handleAiChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = aiQuery.trim();
    if (!query) return;

    setAiChatHistory(prev => [...prev, { sender: 'user', text: query }]);
    setAiQuery('');
    setAiIsTyping(true);
    setAiActiveMatchCategory(null);

    setTimeout(() => {
      setAiIsTyping(false);
      let reply = "";
      let matchedId = "";

      const q = query.toLowerCase();

      if (q.includes('rust') || q.includes('underbody') || q.includes('corrosion') || q.includes('sill') || q.includes('wax')) {
        reply = "I've detected corrosion/chassis rust warnings. You need a **Rust Protection & Underbody Treatment** specialist right away. Sealing and polyurethane coatings will reinforce your metal structures to pass technical approvals safely.";
        matchedId = "rust-protection";
      } else if (q.includes('ev') || q.includes('battery') || q.includes('tesla') || q.includes('hybrid') || q.includes('range') || q.includes('charge')) {
        reply = "Understood. High-voltage EV systems require specialised isolated diagnostics. I matching you with **EV Specialists** certified to read lithium state-of-health and handle HV cells.";
        matchedId = "ev-specialists";
      } else if (q.includes('alcantara') || q.includes('leather') || q.includes('seat') || q.includes('stitch') || q.includes('door card') || q.includes('headliner')) {
        reply = "Interior wear or sagging roof linings are beautifully managed by **Upholstery Specialists**. I've marked Alcantara and premium leather experts with direct booking active.";
        matchedId = "upholstery";
      } else if (q.includes('tune') || q.includes('ecu') || q.includes('stage') || q.includes('exhaust') || q.includes('performance') || q.includes('remap')) {
        reply = "For power adjustments or aesthetic aerodynamic body kit fittings, **Tuning & Styling** workshops can carry out safe stage 1/2 dyno calibrations.";
        matchedId = "tuning-styling";
      } else if (q.includes('import') || q.includes('tax') || q.includes('customs') || q.includes('registration') || q.includes('paper')) {
        reply = "Interstate custom clearances and technical vehicle passports require legal compliance. **Tax & Registration Advisors** can help refund excise taxes or register vintage plates.";
        matchedId = "tax-registration";
      } else if (q.includes('gas') || q.includes('lpg') || q.includes('cng') || q.includes('propane') || q.includes('methane') || q.includes('leak')) {
        reply = "Fuel system leaks or cylinder certifications are highly regulated. You need certified **Gas Repair Specialists** to recalibrate LPG line pressures.";
        matchedId = "gas-repair";
      } else if (q.includes('paint') || q.includes('spray') || q.includes('scratch') || q.includes('dent') || q.includes('body')) {
        reply = "Cosmetic flaws require precise paint matching inside heated overs. Your best matches are inside **Auto Painters**.";
        matchedId = "auto-painters";
      } else if (q.includes('noise') || q.includes('engine') || q.includes('brake') || q.includes('clutch') || q.includes('oil') || q.includes('mechanic')) {
        reply = "Drivetrain noises or physical defects require an inspection lift. I recommend booking an diagnostic appointment with our premier **Mechanics**.";
        matchedId = "mechanics";
      } else {
        reply = "I've analyzed your vehicle description and isolated the perfect matched operators directory underneath. You can use our GPS location search to narrow the results to within 5km!";
        matchedId = "automotive-consultants";
      }

      setAiActiveMatchCategory(matchedId);
      setAiChatHistory(prev => [...prev, { sender: 'ai', text: reply, matchedCat: matchedId }]);

      // Automatically focus or scroll to categories grid if matched
      if (matchedId) {
        const tile = document.getElementById(`cat-tile-${matchedId}`);
        if (tile) {
          tile.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }, 1100);
  };

  // Active Category Interceptor Logic (returns sub-panels if set)
  if (selectedCat && (selectedCat.toLowerCase() === 'specialist mechanics' || selectedCat.toLowerCase() === 'mechanics')) {
    return <FindMechanicSection />;
  }

  if (selectedCat && (selectedCat.toLowerCase() === 'auto-painters' || selectedCat.toLowerCase() === 'auto painters' || selectedCat.toLowerCase() === 'painters')) {
    return <AutoPaintersSection />;
  }

  if (selectedCat && (selectedCat.toLowerCase() === 'tire-dealers' || selectedCat.toLowerCase() === 'tire dealers' || selectedCat.toLowerCase() === 'tires' || selectedCat.toLowerCase() === 'tire')) {
    return <TireDealersSection />;
  }

  if (selectedCat && (selectedCat.toLowerCase() === 'detailing' || selectedCat.toLowerCase() === 'detailing companies' || selectedCat.toLowerCase() === 'detailing-companies')) {
    return <DetailingCompaniesSection />;
  }

  if (selectedCat && (selectedCat.toLowerCase() === 'glass-repair' || selectedCat.toLowerCase() === 'glass repair' || selectedCat.toLowerCase() === 'glass repair & replacement' || selectedCat.toLowerCase() === 'glass')) {
    return <GlassRepairSection />;
  }

  if (selectedCat && (selectedCat.toLowerCase() === 'rust-protection' || selectedCat.toLowerCase() === 'rust protection' || selectedCat.toLowerCase() === 'rust protection & underbody' || selectedCat.toLowerCase() === 'rust')) {
    return <RustProtectionSection />;
  }

  if (selectedCat && (selectedCat.toLowerCase() === 'wrapping' || selectedCat.toLowerCase() === 'wrapping-advertising' || selectedCat.toLowerCase() === 'wrapping & advertising' || selectedCat.toLowerCase() === 'wrapping and advertising companies' || selectedCat.toLowerCase() === 'advertising')) {
    return <WrappingAdvertisingSection />;
  }

  if (selectedCat && (selectedCat.toLowerCase() === 'metalwork' || selectedCat.toLowerCase() === 'metalwork-fabrication' || selectedCat.toLowerCase() === 'metalwork & fabrication' || selectedCat.toLowerCase() === 'metalwork and fabrication workshops' || selectedCat.toLowerCase() === 'fabrication')) {
    return <MetalworkFabricationSection />;
  }

  // FALLBACK VIEW FOR THE REMAINING 6 NEW CATEGORIES SO USER NEVER SEES EMPTY SCREEN!
  const hasDedicatedFallbackSection = selectedCat && [
    'ev-specialists', 'gas-repair', 'upholstery', 'tax-registration', 'tuning-styling', 'automotive-consultants'
  ].includes(selectedCat);

  if (hasDedicatedFallbackSection) {
    const infoCat = SERVICE_CATEGORIES.find(c => c.id === selectedCat);
    const mockOperators = SERVICE_PROVIDERS.filter(p => p.category === selectedCat);

    return (
      <div className="py-8 space-y-10 max-w-[1240px] mx-auto px-4 text-left font-sans bg-slate-50 min-h-screen">
        
        {/* Breadcrumb back */}
        <button
          type="button"
          onClick={() => setSelectedCat(null)}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#8B0000] font-mono uppercase tracking-wider font-extrabold cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 stroke-[3]" />
          <span>Return to All Services Hub</span>
        </button>

        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-red-50 text-[#8B0000] font-black text-[10px] tracking-widest uppercase font-mono px-3 py-1 rounded-full">
              <span>SPECIALIST AUTOMOTIVE CATEGORY</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">
              {infoCat?.name} Directory
            </h1>
            <p className="text-sm text-slate-500 max-w-2xl font-medium">
              {infoCat?.description} Find certified experts near {searchCity} matching your technical needs.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowQuoteModal(true)}
            className="bg-[#8B0000] hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider px-5 py-3 rounded-xl cursor-pointer"
          >
            Create Match Request
          </button>
        </div>

        {/* Listings for specialized category */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockOperators.length > 0 ? (
            mockOperators.map((operator) => (
              <div key={operator.id} className="bg-white rounded-[26px] border border-slate-200 overflow-hidden flex flex-col justify-between p-6 hover:shadow-lg transition-all text-left">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <img src={operator.image} alt={operator.name} className="w-14 h-14 rounded-full object-cover border border-slate-200" referrerPolicy="no-referrer" />
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm font-black text-amber-500 justify-end">
                        <Star className="w-4 h-4 fill-amber-500" />
                        <span>{operator.rating}</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 font-mono">{operator.jobs} Jobs Finished</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-900 text-base">{operator.name}</h3>
                    <p className="text-xs text-[#8B0000] font-bold font-mono uppercase tracking-wider">{operator.specialty}</p>
                    <p className="text-[11px] text-slate-500 font-medium">📍 {operator.address} ({operator.distance} km away)</p>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {operator.certifications.map(c => (
                      <span key={c} className="text-[9px] font-bold bg-neutral-900 text-white px-2 py-0.5 rounded uppercase">{c}</span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-5 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase font-bold leading-none">Starting Rate</span>
                    <span className="text-base font-black text-slate-900">€{operator.rate}<span className="text-xs text-slate-400 font-bold">/hr</span></span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setBookingWorkshop(operator);
                      setBookingFormData(prev => ({ ...prev, carMake: '', carModel: '', notes: '' }));
                    }}
                    className="bg-[#8B0000] hover:bg-rose-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all font-mono"
                  >
                    SELECT OPERATOR
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center space-y-4 bg-white border rounded-3xl p-8">
              <AlertTriangle className="w-8 h-8 text-[#8B0000] mx-auto animate-bounce" />
              <h3 className="font-bold text-slate-800 text-sm">No specialized local operators are currently listed for {infoCat?.name}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Please broadcast a general Repair Request and all nearby shops (even multi-brand general repairers) will receive your request instantly.</p>
              <button
                type="button"
                onClick={() => setShowQuoteModal(true)}
                className="bg-[#8B0000] text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Launch Repair Request Wizard
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Booking Details Modal inside Fallback */}
        <AnimatePresence>
          {bookingWorkshop && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative text-left font-sans"
              >
                <button
                  type="button"
                  onClick={() => setBookingWorkshop(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-550 shrink-0 cursor-pointer"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-[#8B0000] flex items-center justify-center text-lg font-black shrink-0">
                      🛠️
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">Schedule Verification Session</h3>
                      <p className="text-[10px] text-slate-500">{bookingWorkshop.name}</p>
                    </div>
                  </div>

                  <form onSubmit={handleConfirmQuickReservation} className="space-y-3.5 pt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-slate-500 mb-1 block">Full Name</label>
                        <input
                          required
                          type="text"
                          value={bookingFormData.name}
                          onChange={(e) => setBookingFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="bg-slate-50 text-slate-900 font-bold border border-slate-200 rounded-xl text-xs sm:text-xs w-full px-3 py-2 focus:ring-1 focus:ring-red-600 focus:outline-hidden"
                          placeholder="Tomas K."
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-slate-500 mb-1 block">Contact Phone</label>
                        <input
                          required
                          type="tel"
                          value={bookingFormData.phone}
                          onChange={(e) => setBookingFormData(prev => ({ ...prev, phone: e.target.value }))}
                          className="bg-slate-50 text-slate-900 font-bold border border-slate-200 rounded-xl text-xs sm:text-xs w-full px-3 py-2 focus:ring-1 focus:ring-red-600 focus:outline-hidden"
                          placeholder="+370 ..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-slate-500 mb-1 block">Vehicle Make</label>
                        <input
                          required
                          type="text"
                          value={bookingFormData.carMake}
                          onChange={(e) => setBookingFormData(prev => ({ ...prev, carMake: e.target.value }))}
                          className="bg-slate-50 text-slate-900 font-bold border border-slate-200 rounded-xl text-xs sm:text-xs w-full px-3 py-2"
                          placeholder="e.g. Tesla"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-slate-500 mb-1 block">Vehicle Model</label>
                        <input
                          required
                          type="text"
                          value={bookingFormData.carModel}
                          onChange={(e) => setBookingFormData(prev => ({ ...prev, carModel: e.target.value }))}
                          className="bg-slate-50 text-slate-900 font-bold border border-slate-200 rounded-xl text-xs sm:text-xs w-full px-3 py-2"
                          placeholder="e.g. Model Y"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-slate-500 mb-1 block">Specify Requirements / Notes</label>
                      <textarea
                        value={bookingFormData.notes}
                        onChange={(e) => setBookingFormData(prev => ({ ...prev, notes: e.target.value }))}
                        className="bg-slate-50 text-slate-950 text-xs rounded-xl w-full p-2.5 min-h-[60px]"
                        placeholder="State any dynamic details..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-[#8B0000] hover:bg-red-700 text-white font-extrabold text-xs tracking-wider uppercase w-full py-3 rounded-xl transition-all font-mono"
                    >
                      CONFIRM ALLOCATION & SECURE DISPATCH
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    );
  }

  return (
    <div className="py-8 space-y-12 max-w-[1240px] mx-auto px-4 text-left font-sans bg-slate-50 min-h-screen">
      
      {/* 1. STATE-OF-THE-ART ALL SERVICES HEADER */}
      <div id="all-services-header" className="space-y-4 pt-4 border-b border-slate-200 pb-8 text-left relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-6 w-36 h-36 bg-[#8B0000]/5 rounded-full blur-2xl"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
          <div className="space-y-2">
            <span className="text-[10px] bg-red-50 text-[#8B0000] border border-red-200/40 font-mono font-black px-3 py-1 rounded-full uppercase tracking-widest block w-fit">
              REDLINE PLATFORM HUBS
            </span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 font-display">
              Automotive Services — Everything Your Vehicle Needs
            </h1>
            <p className="text-slate-550 text-sm max-w-2xl font-medium leading-relaxed">
              Discover certified garages, body painters, specialized EV technicians, upholstery stitchers, and and custom tuning builders. Search, compare hourly rates, and hire vetted Lithuanian experts.
            </p>
          </div>

          {/* Grid vs Map Toggle */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 select-none shrink-0 font-sans">
            <button
              id="list-view-btn"
              type="button"
              onClick={() => setMapMode(false)}
              className={`px-4 py-2 rounded-lg text-xs font-bold tracking-tight transition-all flex items-center gap-1.5 cursor-pointer ${
                !mapMode ? 'bg-[#8B0000] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Menu Grid</span>
            </button>
            <button
              id="map-view-btn"
              type="button"
              onClick={() => setMapMode(true)}
              className={`px-4 py-2 rounded-lg text-xs font-bold tracking-tight transition-all flex items-center gap-1.5 cursor-pointer ${
                mapMode ? 'bg-[#8B0000] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Interactive Radar</span>
            </button>
          </div>
        </div>

        {/* Global location search bar + map toggle at top */}
        <div id="global-search-terminal" className="bg-white border border-slate-205 p-3 rounded-2xl flex flex-col md:flex-row items-center gap-3 shadow-xs mt-6">
          <div className="relative w-full md:w-72 shrink-0">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B0000]" />
            <input
              id="global-city-input"
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="City (e.g. Vilnius, Lithuania)"
              className="w-full bg-slate-50 text-slate-900 text-xs font-bold rounded-xl pl-10 pr-4 py-3 border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-[#8B0000]"
            />
          </div>

          <button
            id="gps-lock-trigger"
            type="button"
            onClick={triggerGpsSync}
            className="w-full md:w-auto bg-slate-50 hover:bg-slate-100 text-slate-800 text-[11px] font-extrabold uppercase px-4 py-3 border border-slate-200 rounded-xl transition-all cursor-pointer font-mono shrink-0 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#8B0000] animate-spin" />
            <span>Proximity Radar</span>
          </button>

          <div className="h-6 w-[1.5px] bg-slate-200 hidden md:block"></div>

          <div className="relative w-full flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="global-keyword-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services globally (e.g., Alcantara, battery cell, Dyno mapping, Dinitrol shield)..."
              className="w-full bg-slate-50 text-slate-900 text-xs font-bold rounded-xl pl-10 pr-4 py-3 border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-[#8B0000]"
            />
          </div>

          {/* Quick Clear */}
          {searchQuery && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#8B0000] hover:underline font-extrabold px-2 font-mono shrink-0 cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        {/* Global Filter checklist available globally: certification, supported brands, languages, availability */}
        <div className="bg-white/75 rounded-2xl border border-slate-200/90 p-4 mt-3">
          <div className="flex flex-wrap items-center gap-6 justify-between">
            <div className="flex items-center gap-1.5 text-xs text-slate-900 font-extrabold uppercase font-mono tracking-wider">
              <Sliders className="w-3.5 h-3.5 text-[#8B0000]" />
              <span>Multi-Layer Filters:</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 lg:max-w-4xl text-left">
              {/* Certification Selection */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-black uppercase font-mono">Certification</span>
                <select
                  value={selectedCertification}
                  onChange={(e) => setSelectedCertification(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs font-bold rounded-lg border border-slate-200 px-2 py-1 focus:outline-hidden"
                >
                  <option value="all">All Certifications</option>
                  <option value="ISO 9001">ISO 9001 Facility</option>
                  <option value="TUV Approved">TUV Approved</option>
                  <option value="Dupont Certified">Dupont Bodypaint</option>
                  <option value="High-Voltage">HV Level 4 Safety</option>
                </select>
              </div>

              {/* Supported Brands */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-black uppercase font-mono">Supported Brands</span>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs font-bold rounded-lg border border-slate-200 px-2 py-1 focus:outline-hidden"
                >
                  <option value="all">All Car Brands</option>
                  <option value="Tesla">Tesla Motors</option>
                  <option value="BMW">BMW Group</option>
                  <option value="Audi">Audi Sport</option>
                  <option value="Porsche">Porsche</option>
                </select>
              </div>

              {/* Languages Supported */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-black uppercase font-mono">Languages</span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs font-bold rounded-lg border border-slate-200 px-2 py-1 focus:outline-hidden"
                >
                  <option value="all">All Languages</option>
                  <option value="Lithuanian">Lithuanian</option>
                  <option value="English">English</option>
                  <option value="Russian">Russian</option>
                  <option value="German">German</option>
                </select>
              </div>

              {/* Availability */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-black uppercase font-mono">Bay Availability</span>
                <select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 text-xs font-bold rounded-lg border border-slate-200 px-2 py-1 focus:outline-hidden"
                >
                  <option value="all">Any Availability</option>
                  <option value="open_now">Open Now</option>
                  <option value="today">Today Slots</option>
                  <option value="this_week">This Week</option>
                </select>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* RENDER IN MAP MODE OR GRID MODE */}
      {!mapMode ? (
        
        /* 2. DYNAMIC 14 SERVICE CATEGORY GRID */
        <div id="service-categories-matrix" className="space-y-6">
          <div className="flex justify-between items-center text-left">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-bold block">Automobile Segments</span>
              <h2 className="text-xl font-black text-slate-900 font-display">Select a Dedicated Specialty Directory</h2>
            </div>
            <span className="text-xs text-slate-400 font-bold font-mono">14 Vetted Clusters Online</span>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {SERVICE_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const hasPulse = aiActiveMatchCategory === cat.id;

              return (
                <motion.div
                  key={cat.id}
                  id={`cat-tile-${cat.id}`}
                  variants={cardVariants}
                  whileHover={{ y: -4, scale: 1.015, boxShadow: "0 12px 25px -8px rgba(212,0,0,0.12)" }}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`bg-white rounded-2xl border transition-all p-5 text-left cursor-pointer group active:scale-[0.99] flex flex-col justify-between h-[185px] relative ${
                    hasPulse ? 'border-2 border-[#8B0000] ring-4 ring-rose-500/10 animate-pulse' : 'border-slate-200 hover:border-red-200'
                  }`}
                >
                  {hasPulse && (
                    <span className="absolute -top-2.5 -right-1 bg-[#8B0000] text-white text-[8px] font-mono tracking-widest font-black uppercase px-2 py-0.5 rounded-full shadow-lg z-10 animate-bounce">
                      AI Matched
                    </span>
                  )}

                  <div className="space-y-3">
                    {/* Consistent icon style: filled shapes with red accent */}
                    <div className="w-11 h-11 rounded-xl bg-red-50 text-[#8B0000] group-hover:bg-[#8B0000] group-hover:text-white transition-colors duration-300 flex items-center justify-center shrink-0 shadow-3xs">
                      <Icon className="w-5 h-5 fill-none stroke-[2.5]" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-extrabold text-slate-900 text-[13.5px] tracking-tight group-hover:text-[#8B0000] transition-colors leading-tight">
                        {cat.name}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed line-clamp-2">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  {/* Bullet Tags */}
                  <div className="flex flex-wrap gap-1 mt-2 overflow-hidden max-h-5 select-none">
                    {cat.features.slice(0, 2).map((item, idx) => (
                      <span key={idx} className="text-[7.5px] bg-slate-50 text-slate-500 font-bold border border-slate-150 px-1.5 py-0.5 rounded-md uppercase tracking-wider block leading-none">
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

      ) : (

        /* INTERACTIVE VILNIUS LATITUDE GPS PLOT */
        <div id="radar-live-map-hub font-bold" className="bg-zinc-950 rounded-3xl h-[520px] relative overflow-hidden border border-zinc-800 shadow-xl p-6 text-left">
          
          {/* Background layout matrix */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_2px,transparent_1px)] [background-size:22px_22px] bg-zinc-900">
            <div className="absolute inset-y-0 left-1/4 w-[1px] bg-zinc-850"></div>
            <div className="absolute inset-y-0 left-2/4 w-[1px] bg-zinc-850"></div>
            <div className="absolute inset-y-0 left-3/4 w-[1px] bg-zinc-850 animate-pulse"></div>
            <div className="absolute inset-x-0 top-1/3 h-[1px] bg-zinc-850"></div>
            <div className="absolute inset-x-0 top-2/3 h-[1px] bg-zinc-850"></div>
          </div>

          <div className="absolute top-6 left-6 bg-black/85 backdrop-blur-md p-4 rounded-xl border border-zinc-800 z-10 max-w-sm">
            <div className="flex items-center gap-1 text-[#8B0000] font-mono tracking-widest text-[9.5px] uppercase font-bold">
              <Zap className="w-4 h-4 text-[#8B0000] animate-pulse" />
              <span>Diagnostic Proximity Cluster</span>
            </div>
            <h3 className="text-white text-xs font-black mt-1">Live Coordinates near {searchCity}</h3>
            <p className="text-[10px] text-zinc-400 mt-1">Click colored pins on the Vilnius microgrid blueprint to show active technical clearances and pricing models.</p>
          </div>

          {/* Map Pins from top-rate providers */}
          {filteredPopularProviders.map((operator, idx) => {
            const positions = [
              { top: '32%', left: '26%' },
              { top: '68%', left: '48%' },
              { top: '48%', left: '72%' },
              { top: '78%', left: '21%' },
              { top: '24%', left: '60%' },
              { top: '56%', left: '18%' },
              { top: '41%', left: '44%' },
              { top: '72%', left: '79%' },
              { top: '18%', left: '38%' }
            ];
            const coordinates = positions[idx % positions.length];

            return (
              <button
                type="button"
                key={operator.id}
                onClick={() => {
                  setBookingWorkshop(operator);
                  setBookingFormData(prev => ({ ...prev, carMake: '', carModel: '', notes: '' }));
                }}
                style={{ top: coordinates.top, left: coordinates.left }}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              >
                <div className="relative">
                  <span className="absolute inline-flex h-9 w-9 bg-[#8B0000]/40 rounded-full animate-ping"></span>
                  <div className="relative bg-white border border-[#8B0000] shadow-md px-2.5 py-1 rounded-lg text-left">
                    <p className="text-[8px] font-black text-slate-900 leading-none truncate uppercase">{operator.name.split(' ')[0]}</p>
                    <p className="text-[7.5px] text-[#8B0000] font-bold font-mono mt-0.5">★ {operator.rating} • €{operator.rate}/h</p>
                  </div>
                </div>
              </button>
            );
          })}

          <span className="absolute bottom-5 right-5 bg-black/60 backdrop-blur-xs text-[8.5px] font-mono font-bold text-zinc-500 uppercase tracking-widest px-2 py-0.5 rounded border border-zinc-800">
            Mercator Vilnius Calibration Mode
          </span>
        </div>

      )}

      {/* 3. POPULAR NEAR YOU COMPONENT (HORIZONTAL SCROLL) */}
      <div id="popular-near-you-carousel" className="space-y-4 pt-4 text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider font-bold uppercase block">Proximity Matches</span>
            <h2 className="text-xl font-black text-slate-900 font-display">Popular Near You</h2>
            <p className="text-xs text-slate-500 font-medium">Top-rated certified operators close to {searchCity} across all active classes.</p>
          </div>

          <div className="flex items-center gap-2 select-none shrink-0 font-sans">
            <button
              onClick={() => handleCarouselScroll('left')}
              className="p-2 sm:p-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#8B0000] hover:border-red-100 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={() => handleCarouselScroll('right')}
              className="p-2 sm:p-2.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#8B0000] hover:border-red-100 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Swipe Carousel Layout */}
        <div 
          ref={carouselRef}
          className="flex items-stretch gap-5 overflow-x-auto pb-4 pt-1 snap-x scrollbar-hidden"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
        >
          {filteredPopularProviders.map((provider) => {
            const relativeCat = SERVICE_CATEGORIES.find(c => c.id === provider.category);

            return (
              <div
                key={provider.id}
                className="w-[280px] sm:w-[310px] snap-center shrink-0 bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all text-left"
              >
                <div>
                  <div className="h-36 w-full bg-slate-100 relative">
                    <img src={provider.image} alt={provider.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    
                    <span className="absolute top-3 left-3 bg-[#8B0000] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
                      {relativeCat ? relativeCat.name : provider.category}
                    </span>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1">
                      <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-lg font-mono">
                        📍 {provider.distance} km away
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="font-extrabold text-slate-900 text-[14px] tracking-tight leading-tight line-clamp-1">
                        {provider.name}
                      </h3>
                      <div className="flex items-center gap-0.5 text-amber-500 font-bold shrink-0 text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{provider.rating}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 font-medium line-clamp-2">
                      {provider.specialty}
                    </p>

                    <div className="flex flex-wrap gap-1 text-[8.5px] font-bold">
                      {provider.certifications.slice(0, 1).map(c => (
                        <span key={c} className="bg-neutral-900 text-white px-2 py-0.5 rounded uppercase tracking-wider">
                          {c}
                        </span>
                      ))}
                      {provider.language = provider.languages.slice(0, 1).map(l => (
                        <span key={l} className="bg-slate-150 text-slate-500 px-2 py-0.5 rounded uppercase tracking-wider block">
                          🗣️ {l}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="font-sans text-left">
                    <span className="text-[8.5px] text-slate-400 uppercase font-bold block leading-none">Hourly rate</span>
                    <span className="text-sm font-black text-slate-900">€{provider.rate}<span className="text-xs text-slate-400 font-semibold">/hr</span></span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setBookingWorkshop(provider);
                      setBookingFormData(prev => ({ ...prev, carMake: '', carModel: '', notes: '' }));
                    }}
                    className="bg-[#8B0000] hover:bg-rose-700 text-white text-[11px] font-mono uppercase font-black tracking-wider px-3.5 py-2 rounded-lg cursor-pointer"
                  >
                    Hire Specialist
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. MID-PAGE INTERMEDIATE BANNER: "Don't know what service you need? Create a Repair Request and let the right specialists come to you" */}
      <div id="service-hub-cta-banner" className="relative bg-white border border-slate-205 rounded-3xl p-6 md:p-8 shadow-xs text-left overflow-hidden">
        <div className="absolute right-0 top-0 w-36 h-36 bg-[#8B0000]/5 rounded-full blur-xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 bg-red-50 text-[#8B0000] font-black text-[9.5px] tracking-widest uppercase font-mono px-2.5 py-0.5 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8B0000]" />
              <span>Multi-Quote Reverse-Auction Engine</span>
            </span>
            <h2 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight leading-tight">
              Don't know what service you need? Create a Repair Request and let the right specialists come to you
            </h2>
            <p className="text-xs text-slate-500 max-w-xl font-medium leading-normal">
              Skip researching dozens of individual sub-specialists. Broadcast your dynamic plate specs and upload simple phone pictures. Active garages will study the files and submit direct custom estimations.
            </p>
          </div>

          <div className="shrink-0">
            <button
              id="global-repair-wizard-btn"
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
              className="bg-[#8B0000] hover:bg-red-700 text-white font-extrabold text-[11px] tracking-widest uppercase px-6 py-4 rounded-xl border border-rose-650 shadow-md transition-all active:scale-[0.98] cursor-pointer inline-flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-white" />
              <span>Create Repair Request</span>
            </button>
          </div>
        </div>
      </div>



      {/* DYNAMIC BOOKING MODAL */}
      <AnimatePresence>
        {bookingWorkshop && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl relative text-left font-sans"
            >
              <button
                type="button"
                onClick={() => setBookingWorkshop(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-550 cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#8B0000] flex items-center justify-center text-lg font-black shrink-0">
                    ⚙️
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-sm">Automotive Diagnostic Appointment</h3>
                    <p className="text-[10px] text-slate-400 font-bold">{bookingWorkshop.name}</p>
                  </div>
                </div>

                <form onSubmit={handleConfirmQuickReservation} className="space-y-3.5 pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-slate-500 mb-1 block">Your Name</label>
                      <input
                        required
                        type="text"
                        value={bookingFormData.name}
                        onChange={(e) => setBookingFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-slate-50 text-slate-900 font-bold border border-slate-200 rounded-xl text-xs sm:text-xs w-full px-3 py-2"
                        placeholder="Vaidotas S."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-slate-500 mb-1 block">Phone Number</label>
                      <input
                        required
                        type="tel"
                        value={bookingFormData.phone}
                        onChange={(e) => setBookingFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="bg-slate-50 text-slate-900 font-bold border border-slate-200 rounded-xl text-xs sm:text-xs w-full px-3 py-2"
                        placeholder="+370 6..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-slate-500 mb-1 block">Make</label>
                      <input
                        required
                        type="text"
                        value={bookingFormData.carMake}
                        onChange={(e) => setBookingFormData(prev => ({ ...prev, carMake: e.target.value }))}
                        className="bg-slate-50 text-slate-900 font-bold border border-slate-200 rounded-xl text-xs sm:text-xs w-full px-3 py-2"
                        placeholder="e.g. BMW"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-slate-500 mb-1 block">Model</label>
                      <input
                        required
                        type="text"
                        value={bookingFormData.carModel}
                        onChange={(e) => setBookingFormData(prev => ({ ...prev, carModel: e.target.value }))}
                        className="bg-slate-50 text-slate-900 font-bold border border-slate-200 rounded-xl text-xs sm:text-xs w-full px-3 py-2"
                        placeholder="e.g. M3 Competiton"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-slate-500 mb-1 block">Preferred Date</label>
                      <input
                        type="date"
                        value={bookingFormData.preferredDate}
                        onChange={(e) => setBookingFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
                        className="bg-slate-50 text-slate-900 font-bold border border-slate-200 rounded-xl text-xs sm:text-xs w-full px-3 py-2 focus:ring-1 focus:ring-[#8B0000] focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-slate-500 mb-1 block">Time Slot</label>
                      <input
                        type="time"
                        value={bookingFormData.preferredTime}
                        onChange={(e) => setBookingFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                        className="bg-slate-50 text-slate-900 font-bold border border-slate-200 rounded-xl text-xs sm:text-xs w-full px-3 py-2 focus:ring-1 focus:ring-[#8B0000] focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-slate-500 mb-1 block">Technical details / Symptoms</label>
                    <textarea
                      value={bookingFormData.notes}
                      onChange={(e) => setBookingFormData(prev => ({ ...prev, notes: e.target.value }))}
                      className="bg-slate-50 text-slate-950 text-xs rounded-xl w-full p-2.5 min-h-[60px]"
                      placeholder="e.g. steering pulls left, rust spotted underneath..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#8B0000] hover:bg-neutral-900 text-white font-extrabold text-xs tracking-wider uppercase w-full py-3 rounded-xl transition-all font-mono"
                  >
                    SECURE APPOINTMENT SLOT
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GLOBAL REPAIR REQUEST WIZARD MODAL WITH FILE/PHOTO UPLAOD */}
      <AnimatePresence>
        {showQuoteModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 border border-slate-200 shadow-2xl relative text-left font-sans"
            >
              <button
                type="button"
                onClick={() => setShowQuoteModal(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-550 cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>

              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                  <div className="w-11 h-11 bg-red-50 text-[#8B0000] rounded-xl flex items-center justify-center text-xl shrink-0">
                    🛠️
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base leading-none">Broadcast a Repair Request</h3>
                    <p className="text-[10.5px] text-slate-400 font-bold uppercase font-mono tracking-wider mt-1">Estimations from 14 Categories</p>
                  </div>
                </div>

                <form onSubmit={handleConfirmGlobalQuote} className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-slate-500 mb-1 block">Plate Number</label>
                      <input
                        required
                        type="text"
                        value={quoteFormData.carPlate}
                        onChange={(e) => setQuoteFormData(prev => ({ ...prev, carPlate: e.target.value.toUpperCase() }))}
                        className="bg-slate-50 text-slate-900 font-black tracking-widest uppercase border border-slate-200 rounded-xl text-xs w-full px-3 py-2.5"
                        placeholder="LTU 999"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-slate-500 mb-1 block">Intended Category</label>
                      <select
                        value={quoteFormData.serviceCategory}
                        onChange={(e) => setQuoteFormData(prev => ({ ...prev, serviceCategory: e.target.value }))}
                        className="bg-slate-50 text-slate-900 font-bold border border-slate-200 rounded-xl text-xs w-full px-3 py-2.5"
                      >
                        {SERVICE_CATEGORIES.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-slate-500 mb-1 block">Car Make</label>
                      <input
                        required
                        type="text"
                        value={quoteFormData.carMake}
                        onChange={(e) => setQuoteFormData(prev => ({ ...prev, carMake: e.target.value }))}
                        className="bg-slate-50 text-slate-950 text-xs rounded-xl w-full px-3 py-2.5"
                        placeholder="e.g. Audi"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-slate-500 mb-1 block">Car Model / Year</label>
                      <input
                        required
                        type="text"
                        value={quoteFormData.carModel}
                        onChange={(e) => setQuoteFormData(prev => ({ ...prev, carModel: e.target.value }))}
                        className="bg-slate-50 text-slate-950 text-xs rounded-xl w-full px-3 py-2.5"
                        placeholder="e.g. 50 TDI Quattro"
                      />
                    </div>
                  </div>

                  {/* Drag-and-drop / manual photo selection via click as required by guidelines */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-slate-500 mb-1 block">Damage Pictures / Specifications</label>
                    <UniversalSmartUpload
                      photoKey="services_damage_specs"
                      uploadedImageSrc={quoteFormData.uploadedPhotoObj}
                      onUploadSuccess={handleSmartServicesUpload}
                      onClear={() => setQuoteFormData(prev => ({ ...prev, uploadedPhotoName: '', uploadedPhotoObj: null }))}
                      label="Damage / Spec Camera Capture"
                      description="Position your mobile parallel to the issue area to estimate repair hours instantly."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-slate-500 mb-1 block">Problem description / Specifications</label>
                    <textarea
                      required
                      value={quoteFormData.additionalDetails}
                      onChange={(e) => setQuoteFormData(prev => ({ ...prev, additionalDetails: e.target.value }))}
                      className="bg-slate-50 text-slate-950 text-xs rounded-xl w-full p-2.5 min-h-[70px] focus:outline-hidden"
                      placeholder="Describe exactly what needs fixing, restoring, or custom tuning..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-slate-500 mb-1 block">Intake Owner Name</label>
                      <input
                        required
                        type="text"
                        value={quoteFormData.clientContactName}
                        onChange={(e) => setQuoteFormData(prev => ({ ...prev, clientContactName: e.target.value }))}
                        className="bg-slate-50 text-slate-950 text-xs rounded-xl w-full px-3 py-2.5 focus:outline-hidden"
                        placeholder="Simonas D."
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9.5px] uppercase tracking-wider font-mono font-bold text-slate-500 mb-1 block">Intake Contact Phone</label>
                      <input
                        required
                        type="tel"
                        value={quoteFormData.clientPhone}
                        onChange={(e) => setQuoteFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                        className="bg-slate-50 text-slate-950 text-xs rounded-xl w-full px-3 py-2.5 focus:outline-hidden"
                        placeholder="+370 6..."
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-[#8B0000] hover:bg-neutral-900 text-white font-extrabold text-xs tracking-widest uppercase w-full py-3.5 rounded-xl transition-all font-mono"
                  >
                    BROADCAST TO ALL MATCHING LABS
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

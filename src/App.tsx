/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Car, Shield, Search, UserCheck, MessageSquare, Briefcase, Menu, X, Landmark, Globe, Activity, ChevronDown,
  Linkedin, Instagram, Twitter, Youtube, Facebook, Tag, Wrench, Gavel, Paintbrush, Disc, Sparkles, Layers,
  ShieldCheck, Palette, Hammer, Grid, Truck, FileText, BarChart2, Cpu, Eye, User, HelpCircle, Megaphone, Info, Sliders, ChevronRight,
  History, Calculator, Scale, ClipboardCheck, Fingerprint, Compass, Newspaper, Users, Play, Clock,
  Building2, FileCheck, KeyRound, GraduationCap, Trash2
} from 'lucide-react';
import { VEHICLES } from './data';
import { Vehicle, Role } from './types';
import { useAuth, backendRoleToFrontend } from './lib/AuthContext';

// Importing sub-modules
import LandingPage from './components/LandingPage';
import Marketplace from './components/Marketplace';
import VehicleDetails from './components/VehicleDetails';
import AuthJourney from './components/AuthJourney';
import AITools from './components/AITools';
import PlatformCenter from './components/PlatformCenter';
import Dashboards from './components/Dashboards';
import SignIn from './components/SignIn';
import GovPortal from './components/government/GovPortal';
import PolicePortal from './components/government/PolicePortal';
import LiveAction from './components/LiveAction';
import ServiceDetails from './components/ServiceDetails';
import ServicesPage from './components/ServicesPage';
import InsurancePlatform from './components/InsurancePlatform';
import FinancePlatform from './components/FinancePlatform';
import DrivingSchoolsPlatform from './components/DrivingSchoolsPlatform';
import InspectionCentersPlatform from './components/InspectionCentersPlatform';
import DismantlersPlatform from './components/DismantlersPlatform';
import VinHistoryPlatform from './components/VinHistoryPlatform';
import PriceEvaluatorPlatform from './components/PriceEvaluatorPlatform';
import TaxDutyCalculatorPlatform from './components/TaxDutyCalculatorPlatform';
import VehicleInspectionPlatform from './components/VehicleInspectionPlatform';
import IdentityCheckPlatform from './components/IdentityCheckPlatform';
import AutomotiveLawyersPlatform from './components/AutomotiveLawyersPlatform';
import AdvisoryGuidancePlatform from './components/AdvisoryGuidancePlatform';
import SplashLoader from './components/SplashLoader';
import ForBusiness from './components/ForBusiness';
import About from './components/About';
import Community from './components/Community';
import Pricing from './components/Pricing';
import Features from './components/Features';
import DownloadApp from './components/DownloadApp';
import ContactUs from './components/ContactUs';
import PartnerWithUs from './components/PartnerWithUs';
import BlogPage from './components/BlogPage';
import { motion, AnimatePresence } from 'motion/react';
import MobileCameraCapture from './components/MobileCameraCapture';
import FloatingChatAssistant from './components/FloatingChatAssistant';
import SovereignClientChat from './components/SovereignClientChat';
import { api } from './lib/api';

export default function App() {
  // Real-time mobile sync camera proxy
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const isMobileUpload = searchParams.get('mobile-upload') === 'true';
  const syncSessionId = searchParams.get('sessionId') || '';

  if (isMobileUpload && syncSessionId) {
    return <MobileCameraCapture sessionId={syncSessionId} />;
  }

  const [isSplashLoading, setIsSplashLoading] = useState(true);
  const [isVinDropdownOpen, setIsVinDropdownOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role>('guest');
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [vehicleDetailsInitialSubPage, setVehicleDetailsInitialSubPage] = useState<'details' | 'chat' | 'booking'>('details');
  const [aboutActiveTab, setAboutActiveTab] = useState<'about-us' | 'how-it-works' | 'careers' | 'press'>('about-us');
  const [selectedVehicleVin, setSelectedVehicleVin] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [serviceSourcePage, setServiceSourcePage] = useState<string>('home');
  const [activeServiceCategory, setActiveServiceCategory] = useState<string | null>(null);

  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: 8, 
      scale: 0.95, 
      filter: "blur(6px)",
      transition: {
        duration: 0.25,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      filter: "blur(0px)",
      transition: {
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const pageTransitionVariants = {
    hidden: { 
      opacity: 0, 
      y: 12, 
      filter: "blur(4px)" 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { 
        duration: 0.95, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    },
    exit: { 
      opacity: 0, 
      y: -12, 
      filter: "blur(4px)",
      transition: { 
        duration: 0.75, 
        ease: [0.19, 1, 0.22, 1] 
      } 
    }
  };

  const [unreadMessages, setUnreadMessages] = useState(0);

  // Authentication persistence across roles
  const [authenticatedRoles, setAuthenticatedRoles] = useState<Record<Role, boolean>>({
    guest: true,
    personal: false,
    business: false,
    insurance: false,
    workshop: false,
    logistics: false,
    government: false,
    police: false
  });

  const [targetSignInRole, setTargetSignInRole] = useState<'personal' | 'business' | 'insurance' | 'government' | 'police'>('personal');
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [headerServicesCategory, setHeaderServicesCategory] = useState<string | null>(null);
  const [headerServicesSearchQuery, setHeaderServicesSearchQuery] = useState('');

  const auth = useAuth();

  // Restore role/session UI state from a persisted backend session (e.g. page reload)
  useEffect(() => {
    if (auth.user) {
      const mappedRole = backendRoleToFrontend(auth.user.role) as Role;
      setAuthenticatedRoles(prev => ({ ...prev, [mappedRole]: true }));
      setCurrentRole(prev => (prev === 'guest' ? mappedRole : prev));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user]);

  const performLogout = () => {
    auth.logout();
  };

  // Redirect to sign in if accessing a secure dashboard without credentials
  useEffect(() => {
    if (currentPage === 'dashboards') {
      if (currentRole === 'guest') {
        setTargetSignInRole('personal');
        setCurrentPage('signin');
      } else if (!authenticatedRoles[currentRole]) {
        setTargetSignInRole(currentRole as any);
        setCurrentPage('signin');
      }
    }
  }, [currentPage, currentRole, authenticatedRoles]);

  // Listen to deep-link events from tools to category advisors
  useEffect(() => {
    const handleNavigateServices = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      const category = customEvent.detail || 'Advisory & Guidance';
      if (category === 'Advisory & Guidance') {
        setCurrentPage('advisory_guidance');
      } else {
        setCurrentPage('services');
        setHeaderServicesCategory(category);
        setHeaderServicesSearchQuery('');
      }
      setSelectedVehicleVin(null);
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('navigate-services', handleNavigateServices);
    return () => {
      window.removeEventListener('navigate-services', handleNavigateServices);
    };
  }, []);

  // Listen to deep-link page navigation events
  useEffect(() => {
    const handleNavigatePage = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setCurrentPage(customEvent.detail);
        setSelectedVehicleVin(null);
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    };
    window.addEventListener('navigate-page', handleNavigatePage);
    return () => {
      window.removeEventListener('navigate-page', handleNavigatePage);
    };
  }, []);

  // Global search and state transitions
  const [globalVinSearch, setGlobalVinSearch] = useState('');
  const [isVinAnalyzing, setIsVinAnalyzing] = useState(false);
  const [nhtsaAnalysisStep, setNhtsaAnalysisStep] = useState(1);

  // Mobile menu selector
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [drawerMarketplaceOpen, setDrawerMarketplaceOpen] = useState(false);
  const [drawerServicesOpen, setDrawerServicesOpen] = useState(false);
  const [drawerToolsOpen, setDrawerToolsOpen] = useState(false);
  const [drawerB2bOpen, setDrawerB2bOpen] = useState(false);

  const selectedVehicle = useMemo(() => {
    return VEHICLES.find(v => v.vin === selectedVehicleVin) || VEHICLES[0];
  }, [selectedVehicleVin]);

  // Trigger automated sequence when a VIN search is submitted
  const triggerVinCheckSequence = (vin: string) => {
    setIsVinAnalyzing(true);
    setNhtsaAnalysisStep(1);
    
    // Simulate step-by-step NHTSA, brand verification checklist increments
    const timer1 = setTimeout(() => setNhtsaAnalysisStep(2), 600);
    const timer2 = setTimeout(() => setNhtsaAnalysisStep(3), 1200);
    const timer3 = setTimeout(() => {
      setIsVinAnalyzing(false);
      const vehicleFound = VEHICLES.find(v => v.vin.toUpperCase() === vin.toUpperCase() || v.vin.includes(vin));
      if (vehicleFound) {
        setSelectedVehicleVin(vehicleFound.vin);
        setCurrentPage('details');
      } else {
        // Fallback default details mockup
        setSelectedVehicleVin(VEHICLES[0].vin);
        setCurrentPage('details');
        alert(`VIN format verified. Displaying closest matching structural dossier.`);
      }
    }, 1800);
  };

  const handleGlobalLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalVinSearch.trim()) {
      triggerVinCheckSequence(globalVinSearch.trim().toUpperCase());
      setGlobalVinSearch('');
    }
  };

  const handleHeaderSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearchQuery.trim()) {
      try {
        // Wire to GET /api/search?q=
        const results = await api.get(`/search?q=${encodeURIComponent(headerSearchQuery.trim())}`);
        console.log('Global search results:', results);
        
        // Navigation logic stays same, let Marketplace display results
        setSelectedVehicleVin(null);
        setCurrentPage('marketplace');
      } catch (err) {
        console.error('Search failed:', err);
      }
    }
  };

  const handleRegistrationSuccess = (role: 'personal' | 'business' | 'insurance' | 'government' | 'police') => {
    setAuthenticatedRoles(prev => ({ ...prev, [role]: true }));
    setCurrentRole(role as Role);
    if (role === 'government') {
      setCurrentPage('govPortal');
    } else if (role === 'police') {
      setCurrentPage('policePortal');
    } else if (role === 'insurance') {
      setCurrentPage('insurance_platform');
    } else {
      setCurrentPage('dashboards');
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isSplashLoading && (
          <SplashLoader key="loader" onFinish={() => setIsSplashLoading(false)} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-white text-slate-900 flex flex-col font-sans select-none antialiased"
      >
      
      {/* Top Navigation Hub Bar (Consistently Premium Dark and Transparent on Home Page) */}
      <header className={`z-50 h-16 flex items-center justify-center text-white px-4 transition-all duration-300 ${
        currentPage === 'home' 
          ? "absolute top-4 left-0 right-0" 
          : "sticky top-4 left-0 right-0 bg-transparent"
      }`}>
        <div className="max-w-[1240px] w-full mx-auto px-6 h-full flex justify-between items-center rounded-2xl bg-zinc-100/95 backdrop-blur-md border border-black/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.8)] text-zinc-800">
          
          <div className="flex items-center gap-6 h-full relative z-40">
            <button 
              onClick={() => { setCurrentPage('home'); setSelectedVehicleVin(null); }}
              className="hover:opacity-85 transition-all text-left flex items-center cursor-pointer"
              id="brand-logo-btn"
            >
              <img 
                src="https://files.catbox.moe/jhta7v.png" 
                alt="Logo" 
                className="h-11 sm:h-12 md:h-13 w-auto object-contain transition-all duration-200 brightness-95 hover:brightness-105"
                referrerPolicy="no-referrer" 
              />
            </button>
 
              {/* Desktop Center Page Links */}
            <nav className="hidden lg:flex items-stretch gap-1.5 text-sm font-semibold tracking-wide text-zinc-650 h-full">
              {/* Marketplace Dropdown */}
              <div className="relative group flex items-center h-full">
                <button 
                  onClick={() => { setCurrentPage('marketplace'); setSelectedVehicleVin(null); setHeaderSearchQuery(''); }}
                  className={`transition-all duration-200 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer text-[13px] font-bold tracking-wide relative group-hover:text-zinc-950 group-hover:bg-black/5 ${currentPage === 'marketplace' ? 'bg-black/10 text-zinc-950 font-extrabold' : 'text-zinc-600 hover:text-zinc-950 hover:bg-black/5'}`}
                >
                  <span className="creamy-underline">Marketplace</span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180 opacity-70 group-hover:opacity-100" />
                </button>
                <div className="absolute top-full left-0 pt-2.5 w-[240px] invisible opacity-0 -translate-y-2 pointer-events-none group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out z-50 text-zinc-800">
                  <div className="w-full bg-zinc-100/95 backdrop-blur-md border border-black/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.18)] rounded-2xl p-2 flex flex-col gap-0.5">
                    <button 
                      onClick={() => { setCurrentPage('marketplace'); setSelectedVehicleVin(null); setHeaderSearchQuery(''); }}
                      className="w-full text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/dropdown text-zinc-500 hover:text-zinc-950"
                    >
                      <span className="text-[13.5px] font-semibold tracking-wide">Buy a Vehicle</span>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('marketplace'); setSelectedVehicleVin(null); setHeaderSearchQuery('Sell'); }}
                      className="w-full text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/dropdown text-zinc-500 hover:text-zinc-950"
                    >
                      <span className="text-[13.5px] font-semibold tracking-wide">Sell a Vehicle</span>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('marketplace'); setSelectedVehicleVin(null); setHeaderSearchQuery('Spare Parts'); }}
                      className="w-full text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/dropdown text-zinc-500 hover:text-zinc-950"
                    >
                      <span className="text-[13.5px] font-semibold tracking-wide">Spare Parts</span>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('marketplace'); setSelectedVehicleVin(null); setHeaderSearchQuery('Auction'); }}
                      className="w-full text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/dropdown text-zinc-500 hover:text-zinc-950"
                    >
                      <span className="text-[13.5px] font-semibold tracking-wide">Auctions</span>
                    </button>
                  </div>
                </div>
              </div>
              {/* Services Dropdown */}
              <div className="relative group flex items-center h-full">
                <button 
                  onClick={() => { setCurrentPage('services'); setSelectedVehicleVin(null); setHeaderServicesCategory(null); setHeaderServicesSearchQuery(''); }}
                  className={`transition-all duration-200 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer text-[13px] font-bold tracking-wide relative group-hover:text-zinc-950 group-hover:bg-black/5 ${currentPage === 'services' ? 'bg-black/10 text-zinc-950 font-extrabold' : 'text-zinc-650 hover:text-zinc-950 hover:bg-black/5'}`}
                >
                  <span className="creamy-underline">Services</span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180 opacity-70 group-hover:opacity-100" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-[680px] invisible opacity-0 -translate-y-2 pointer-events-none group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out z-50 text-zinc-800">
                  <div className="w-full bg-zinc-100/95 backdrop-blur-md border border-black/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.18)] rounded-2xl p-3 grid grid-cols-2 gap-1">
                    <button 
                      onClick={() => { setCurrentPage('services'); setSelectedVehicleVin(null); setHeaderServicesCategory('Specialist Mechanics'); setHeaderServicesSearchQuery(''); }}
                      className="text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/item"
                    >
                      <div className="flex flex-col">
                        <span className="text-[12.5px] font-bold text-zinc-500 tracking-tight group-hover/item:text-zinc-950 transition-colors">Find a Mechanic</span>
                        <span className="text-[10px] text-zinc-500 font-medium group-hover/item:text-zinc-700 mt-0.5 leading-normal">Repairs & diagnostic tuning</span>
                      </div>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('services'); setSelectedVehicleVin(null); setHeaderServicesCategory('Auto Painters'); setHeaderServicesSearchQuery(''); }}
                      className="text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/item"
                    >
                      <div className="flex flex-col">
                        <span className="text-[12.5px] font-bold text-zinc-500 tracking-tight group-hover/item:text-zinc-950 transition-colors">Auto Painters</span>
                        <span className="text-[10px] text-zinc-500 font-medium group-hover/item:text-zinc-700 mt-0.5 leading-normal font-normal">Advanced baking & body paint</span>
                      </div>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('services'); setSelectedVehicleVin(null); setHeaderServicesCategory('Tire Dealers'); setHeaderServicesSearchQuery(''); }}
                      className="text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/item"
                    >
                      <div className="flex flex-col">
                        <span className="text-[12.5px] font-bold text-zinc-500 tracking-tight group-hover/item:text-zinc-950 transition-colors">Tire Dealers</span>
                        <span className="text-[10px] text-zinc-500 font-medium group-hover/item:text-zinc-700 mt-0.5 leading-normal">Laser alignments & mounts</span>
                      </div>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('services'); setSelectedVehicleVin(null); setHeaderServicesCategory('Detailing Companies'); setHeaderServicesSearchQuery(''); }}
                      className="text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/item"
                    >
                      <div className="flex flex-col">
                        <span className="text-[12.5px] font-bold text-zinc-500 tracking-tight group-hover/item:text-zinc-950 transition-colors">Detailing</span>
                        <span className="text-[10px] text-zinc-500 font-medium group-hover/item:text-zinc-700 mt-0.5 leading-normal">9H ceramic paint coatings</span>
                      </div>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('services'); setSelectedVehicleVin(null); setHeaderServicesCategory('Glass Repair & Replacement'); setHeaderServicesSearchQuery(''); }}
                      className="text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/item"
                    >
                      <div className="flex flex-col">
                        <span className="text-[12.5px] font-bold text-zinc-500 tracking-tight group-hover/item:text-zinc-950 transition-colors">Glass Repair</span>
                        <span className="text-[10px] text-zinc-500 font-medium group-hover/item:text-zinc-700 mt-0.5 leading-normal font-normal">Windshield crack & chip fixes</span>
                      </div>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('services'); setSelectedVehicleVin(null); setHeaderServicesCategory('Rust Protection & Underbody'); setHeaderServicesSearchQuery(''); }}
                      className="text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/item"
                    >
                      <div className="flex flex-col">
                        <span className="text-[12.5px] font-bold text-zinc-500 tracking-tight group-hover/item:text-zinc-950 transition-colors">Rust Protection</span>
                        <span className="text-[10px] text-zinc-500 font-medium group-hover/item:text-zinc-700 mt-0.5 leading-normal">Undercutting & heavy sealing</span>
                      </div>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('services'); setSelectedVehicleVin(null); setHeaderServicesCategory('Wrapping & Advertising'); setHeaderServicesSearchQuery(''); }}
                      className="text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/item"
                    >
                      <div className="flex flex-col">
                        <span className="text-[12.5px] font-bold text-zinc-500 tracking-tight group-hover/item:text-zinc-950 transition-colors">Wrapping</span>
                        <span className="text-[10px] text-zinc-500 font-medium group-hover/item:text-zinc-700 mt-0.5 leading-normal font-normal">Custom vinyl advertising wraps</span>
                      </div>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('services'); setSelectedVehicleVin(null); setHeaderServicesCategory('Metalwork & Fabrication'); setHeaderServicesSearchQuery(''); }}
                      className="text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/item"
                    >
                      <div className="flex flex-col">
                        <span className="text-[12.5px] font-bold text-zinc-500 tracking-tight group-hover/item:text-zinc-950 transition-colors">Fabrication</span>
                        <span className="text-[10px] text-zinc-500 font-medium group-hover/item:text-zinc-700 mt-0.5 leading-normal">Performance welds & frames</span>
                      </div>
                    </button>
                    <div className="col-span-2 border-t border-black/10 my-1 pt-1.5 flex justify-end">
                      <button 
                        onClick={() => { setCurrentPage('services'); setSelectedVehicleVin(null); setHeaderServicesCategory(null); setHeaderServicesSearchQuery(''); }}
                        className="w-full text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center justify-between text-zinc-850 group/last cursor-pointer"
                      >
                        <span className="text-[11.5px] font-extrabold text-zinc-500 uppercase tracking-wider group-hover/last:text-zinc-850">All Services</span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover/last:text-zinc-850 transition-all transform group-hover/last:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* B2B Dropdown */}
              <div className="relative group flex items-center h-full">
                <button 
                  onClick={() => { setCurrentPage('for-business'); setSelectedVehicleVin(null); }}
                  className={`transition-all duration-200 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer text-[13px] font-bold tracking-wide relative group-hover:text-zinc-950 group-hover:bg-black/5 ${currentPage === 'for-business' ? 'bg-black/10 text-zinc-950 font-extrabold' : 'text-zinc-650 hover:text-zinc-950 hover:bg-black/5'}`}
                >
                  <span className="creamy-underline">B2B</span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180 opacity-70 group-hover:opacity-100" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-[520px] invisible opacity-0 -translate-y-2 pointer-events-none group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out z-50 text-zinc-800">
                  <div className="w-full bg-zinc-100/95 backdrop-blur-md border border-black/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.18)] rounded-2xl p-3 grid grid-cols-2 gap-x-4 gap-y-1">
                    <button 
                      onClick={() => { setCurrentPage('for-business'); setSelectedVehicleVin(null); }}
                      className="text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/item text-zinc-500 hover:text-zinc-950"
                    >
                      <span className="text-[13px] font-semibold tracking-wide">Dealerships</span>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('for-business'); setSelectedVehicleVin(null); }}
                      className="text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/item text-zinc-500 hover:text-zinc-950"
                    >
                      <span className="text-[13px] font-semibold tracking-wide">Logistics</span>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('insurance_platform'); setSelectedVehicleVin(null); }}
                      className="text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/item text-zinc-500 hover:text-zinc-950"
                    >
                      <span className="text-[13px] font-semibold tracking-wide">Insurance</span>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('finance_platform'); setSelectedVehicleVin(null); }}
                      className="text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/item text-zinc-500 hover:text-zinc-950"
                    >
                      <span className="text-[13px] font-semibold tracking-wide">Finance & Banking</span>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('finance_platform'); setSelectedVehicleVin(null); }}
                      className="text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/item text-zinc-500 hover:text-zinc-950"
                    >
                      <span className="text-[13px] font-semibold tracking-wide">Leasing</span>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('driving_schools_platform'); setSelectedVehicleVin(null); }}
                      className="text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/item text-zinc-500 hover:text-zinc-950"
                    >
                      <span className="text-[13px] font-semibold tracking-wide">Driving Schools</span>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('inspection_centers_platform'); setSelectedVehicleVin(null); }}
                      className="text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/item text-zinc-500 hover:text-zinc-950"
                    >
                      <span className="text-[13px] font-semibold tracking-wide">Inspection</span>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('dismantlers_platform'); setSelectedVehicleVin(null); }}
                      className="text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/item text-zinc-500 hover:text-zinc-950"
                    >
                      <span className="text-[13px] font-semibold tracking-wide">Dismantlers & Recyclers</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Tools Dropdown */}
              <div className="relative group flex items-center h-full">
                <button 
                  onClick={() => { setCurrentPage('ai_tools'); setSelectedVehicleVin(null); }}
                  className={`transition-all duration-200 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer text-[13px] font-bold tracking-wide relative group-hover:text-zinc-950 group-hover:bg-black/5 ${currentPage === 'ai_tools' ? 'bg-black/10 text-zinc-950 font-extrabold' : 'text-zinc-650 hover:text-zinc-950 hover:bg-black/5'}`}
                >
                  <span className="creamy-underline">Tools</span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180 opacity-70 group-hover:opacity-100" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-[320px] invisible opacity-0 -translate-y-2 pointer-events-none group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out z-50 text-zinc-800">
                  <div className="w-full bg-zinc-100/95 backdrop-blur-md border border-black/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.18)] rounded-2xl p-2.5 flex flex-col gap-0.5">
                    <button 
                      onClick={() => { setCurrentPage('vin_history'); setSelectedVehicleVin(null); }}
                      className="w-full text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/item text-zinc-500 hover:text-zinc-950"
                    >
                      <span className="text-[13px] font-semibold tracking-wide">VIN & History</span>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('price_evaluator'); setSelectedVehicleVin(null); }}
                      className="w-full text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/item text-zinc-500 hover:text-zinc-950"
                    >
                      <span className="text-[13px] font-semibold tracking-wide">Price Evaluator</span>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('tax_duty_calculator'); setSelectedVehicleVin(null); }}
                      className="w-full text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/item text-zinc-500 hover:text-zinc-950"
                    >
                      <span className="text-[13px] font-semibold tracking-wide">Tax & Duty</span>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('vehicle_inspection'); setSelectedVehicleVin(null); }}
                      className="w-full text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/item text-zinc-500 hover:text-zinc-950"
                    >
                      <span className="text-[13px] font-semibold tracking-wide">Vehicle Inspection</span>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('identity_check'); setSelectedVehicleVin(null); }}
                      className="w-full text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/item text-zinc-500 hover:text-zinc-950"
                    >
                      <span className="text-[13px] font-semibold tracking-wide">Identity Check</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* About Dropdown */}
              <div className="relative group flex items-center h-full">
                <button 
                  onClick={() => { setCurrentPage('about'); setSelectedVehicleVin(null); }}
                  className={`transition-all duration-200 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer text-[13px] font-bold tracking-wide relative hover:text-zinc-950 group-hover:bg-black/5 ${currentPage === 'about' ? 'bg-black/10 text-zinc-950 font-extrabold' : 'text-zinc-650 hover:text-zinc-950 hover:bg-black/5'}`}
                >
                  <span className="creamy-underline">About</span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180 opacity-70 group-hover:opacity-100" />
                </button>
                <div className="absolute top-full right-0 pt-2.5 w-[320px] invisible opacity-0 -translate-y-2 pointer-events-none group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out z-50 text-zinc-800">
                  <div className="w-full bg-zinc-100/95 backdrop-blur-md border border-black/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.18)] rounded-2xl p-2.5 flex flex-col gap-0.5">
                    <button 
                      onClick={() => { setCurrentPage('about'); setAboutActiveTab('about-us'); setSelectedVehicleVin(null); }}
                      className="w-full text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/item text-zinc-500 hover:text-zinc-950"
                    >
                      <span className="text-[13px] font-semibold tracking-wide">About Us</span>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('about'); setAboutActiveTab('how-it-works'); setSelectedVehicleVin(null); }}
                      className="w-full text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/item text-zinc-500 hover:text-zinc-950"
                    >
                      <span className="text-[13px] font-semibold tracking-wide">How It Works</span>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('about'); setAboutActiveTab('careers'); setSelectedVehicleVin(null); }}
                      className="w-full text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/item text-zinc-500 hover:text-zinc-950"
                    >
                      <span className="text-[13px] font-semibold tracking-wide">Careers</span>
                    </button>
                    <button 
                      onClick={() => { setCurrentPage('about'); setAboutActiveTab('press'); setSelectedVehicleVin(null); }}
                      className="w-full text-left px-5 py-2.5 hover:bg-black/5 rounded-xl transition-all duration-200 flex items-center cursor-pointer group/item text-zinc-500 hover:text-zinc-950"
                    >
                      <span className="text-[13px] font-semibold tracking-wide">Press</span>
                    </button>
                  </div>
                </div>
              </div>
              {currentRole === 'government' && authenticatedRoles.government && (
                <button 
                  onClick={() => { setCurrentPage('govPortal'); setSelectedVehicleVin(null); }}
                  className={`transition-all duration-200 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer text-[13px] font-bold tracking-wide relative group-hover:bg-black/5 ${currentPage === 'govPortal' ? 'bg-black/10 text-zinc-950 font-extrabold' : 'text-zinc-650 hover:text-zinc-950 hover:bg-black/5'}`}
                >
                  <Landmark className="w-3.5 h-3.5 text-red-500" />
                  <span className="creamy-underline">Gov Portal</span>
                </button>
              )}
              {currentRole === 'police' && authenticatedRoles.police && (
                <button 
                  onClick={() => { setCurrentPage('policePortal'); setSelectedVehicleVin(null); }}
                  className={`transition-all duration-200 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer text-[13px] font-bold tracking-wide relative group-hover:bg-black/5 ${currentPage === 'policePortal' ? 'bg-black/10 text-zinc-950 font-extrabold' : 'text-zinc-650 hover:text-zinc-950 hover:bg-black/5'}`}
                >
                  <Shield className="w-3.5 h-3.5 text-red-500" />
                  <span className="creamy-underline">Police Portal</span>
                </button>
              )}
            </nav>
          </div>
 
          {/* Right Action Widgets */}
          <div className="flex items-center gap-3">
            {/* Desktop Search Bar */}
            <form 
              onSubmit={handleHeaderSearchSubmit}
              className="hidden lg:flex items-center relative"
            >
              <Search className="absolute left-3 w-3.5 h-3.5 text-zinc-400" />
              <input 
                type="text"
                placeholder="Search..."
                value={headerSearchQuery}
                onChange={(e) => setHeaderSearchQuery(e.target.value)}
                className="bg-black/5 border border-transparent focus:border-black/10 focus:bg-white rounded-lg pl-8 pr-3 py-1.5 text-xs font-semibold outline-none transition-all w-40 focus:w-60"
              />
            </form>
            

 
            {/* Desktop Messages Icon */}
            {auth.isAuthenticated && (
              <button 
                onClick={() => { setCurrentPage('messages'); setSelectedVehicleVin(null); }}
                className="relative p-2 rounded-full hover:bg-black/5 transition-all text-zinc-650 hover:text-zinc-950 cursor-pointer"
              >
                <MessageSquare className="w-5 h-5" />
                {unreadMessages > 0 && (
                  <span className="absolute top-1 right-1 bg-[#B30000] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {unreadMessages}
                  </span>
                )}
              </button>
            )}

            {/* General Log-in / Sign-up button actions */}
            {currentRole !== 'guest' && authenticatedRoles[currentRole] ? (
              <button 
                onClick={() => {
                  performLogout();
                  setAuthenticatedRoles(prev => ({ ...prev, [currentRole]: false }));
                  setCurrentRole('guest');
                  setCurrentPage('home');
                  alert(`Logged out of authorized ${currentRole.toUpperCase()} session.`);
                }}
                className="hidden lg:block bg-[#B30000] hover:bg-[#4A4A4A] text-white px-4.5 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all duration-200 active:scale-[0.98] uppercase shrink-0 cursor-pointer"
                id="header-onboarding-btn"
              >
                Sign Out
              </button>
            ) : (
              <div className="hidden lg:flex items-center gap-2.5 shrink-0">
                <button 
                  onClick={() => {
                    setTargetSignInRole(currentRole !== 'guest' ? (currentRole as any) : 'personal');
                    setCurrentPage('signin');
                  }}
                  className="px-4.5 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all uppercase bg-transparent text-zinc-700 hover:text-zinc-950 border border-zinc-300 hover:border-zinc-400 hover:bg-black/5 cursor-pointer"
                  id="header-signin-btn"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setCurrentPage('register')}
                  className="px-4.5 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all duration-200 uppercase bg-[#B30000] text-white hover:bg-[#4A4A4A] border border-[#B30000] hover:border-[#4A4A4A] shadow-sm cursor-pointer"
                  id="header-onboarding-btn"
                >
                  Sign Up
                </button>
              </div>
            )}
 
            {/* Mobile Nav Menu Toggler */}
            <button 
               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
               className="lg:hidden p-1.5 rounded-full transition-all text-zinc-800 hover:bg-black/5"
            >
              {mobileMenuOpen 
                ? <X className="w-4 h-4 text-current" /> 
                : <Menu className="w-4 h-4 text-current" />
              }
            </button>
          </div>
        </div>
      </header>
 
      {/* Mobile navigation drawer with modern slide-out animations and touch-friendly layouts */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 cursor-pointer"
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed top-0 right-0 bottom-0 w-[300px] sm:w-[350px] bg-white z-[60] shadow-2xl flex flex-col h-full overflow-hidden text-left"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-zinc-150 flex items-center justify-between bg-zinc-50 shrink-0">
                <div className="flex items-center gap-2">
                  <img 
                    src="https://files.catbox.moe/jhta7v.png" 
                    alt="Logo" 
                    className="h-10 w-auto object-contain brightness-95"
                    referrerPolicy="no-referrer" 
                  />
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-zinc-200 transition-all text-zinc-650 cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-current" />
                </button>
              </div>

              {/* Drawer Content Area (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-none">
                {/* Marketplace Group */}
                <div className="border-b border-zinc-100 pb-3">
                  <button 
                    onClick={() => setDrawerMarketplaceOpen(!drawerMarketplaceOpen)}
                    className="w-full flex items-center justify-between py-2 px-1 text-[11px] font-black uppercase tracking-widest text-[#8B0000] text-left hover:bg-zinc-50 rounded-lg transition-all"
                  >
                    <span>Marketplace</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${drawerMarketplaceOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {drawerMarketplaceOpen && (
                    <div className="mt-1.5 bg-zinc-50 rounded-2xl p-1.5 border border-zinc-200/60 space-y-0.5 animate-in fade-in duration-200">
                      <button 
                        onClick={() => { setCurrentPage('marketplace'); setMobileMenuOpen(false); setHeaderSearchQuery(''); }}
                        className="w-full text-left py-2 px-3 text-xs font-bold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/50 rounded-xl transition-all flex items-center justify-between min-h-[40px]"
                      >
                        <span>Buy a Vehicle</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                      </button>
                      <button 
                        onClick={() => { setCurrentPage('marketplace'); setMobileMenuOpen(false); setHeaderSearchQuery('Sell'); }}
                        className="w-full text-left py-2 px-3 text-xs font-bold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/50 rounded-xl transition-all flex items-center justify-between min-h-[40px]"
                      >
                        <span>Sell a Vehicle</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                      </button>
                      <button 
                        onClick={() => { setCurrentPage('marketplace'); setMobileMenuOpen(false); setHeaderSearchQuery('Spare Parts'); }}
                        className="w-full text-left py-2 px-3 text-xs font-bold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/50 rounded-xl transition-all flex items-center justify-between min-h-[40px]"
                      >
                        <span>Spare Parts</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                      </button>
                      <button 
                        onClick={() => { setCurrentPage('marketplace'); setMobileMenuOpen(false); setHeaderSearchQuery('Auction'); }}
                        className="w-full text-left py-2 px-3 text-xs font-bold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/50 rounded-xl transition-all flex items-center justify-between min-h-[40px]"
                      >
                        <span>Auctions</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Services Group */}
                <div className="border-b border-zinc-100 pb-3">
                  <button 
                    onClick={() => setDrawerServicesOpen(!drawerServicesOpen)}
                    className="w-full flex items-center justify-between py-2 px-1 text-[11px] font-black uppercase tracking-widest text-[#8B0000] text-left hover:bg-zinc-50 rounded-lg transition-all"
                  >
                    <span>Specialist Services</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${drawerServicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {drawerServicesOpen && (
                    <div className="mt-1.5 bg-zinc-50 rounded-2xl p-1.5 border border-zinc-200/60 space-y-0.5 animate-in fade-in duration-200">
                      <button 
                        onClick={() => { setCurrentPage('services'); setMobileMenuOpen(false); setHeaderServicesCategory('Specialist Mechanics'); setHeaderServicesSearchQuery(''); }}
                        className="w-full text-left py-2 px-3 text-xs font-bold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/50 rounded-xl transition-all flex items-center justify-between min-h-[40px]"
                      >
                        <span>Find a Mechanic</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                      </button>
                      <button 
                        onClick={() => { setCurrentPage('services'); setMobileMenuOpen(false); setHeaderServicesCategory('Auto Painters'); setHeaderServicesSearchQuery(''); }}
                        className="w-full text-left py-2 px-3 text-xs font-bold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/50 rounded-xl transition-all flex items-center justify-between min-h-[40px]"
                      >
                        <span>Auto Painters</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                      </button>
                      <button 
                        onClick={() => { setCurrentPage('services'); setMobileMenuOpen(false); setHeaderServicesCategory('Wrapping & Advertising'); setHeaderServicesSearchQuery(''); }}
                        className="w-full text-left py-2 px-3 text-xs font-bold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/50 rounded-xl transition-all flex items-center justify-between min-h-[40px]"
                      >
                        <span>Wrapping &amp; Advertising</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                      </button>
                      <button 
                        onClick={() => { setCurrentPage('services'); setMobileMenuOpen(false); setHeaderServicesCategory('Metalwork & Fabrication'); setHeaderServicesSearchQuery(''); }}
                        className="w-full text-left py-2 px-3 text-xs font-bold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/50 rounded-xl transition-all flex items-center justify-between min-h-[40px]"
                      >
                        <span>Metalwork &amp; Fabrication</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                      </button>
                      <button 
                        onClick={() => { setCurrentPage('services'); setMobileMenuOpen(false); setHeaderServicesCategory(null); setHeaderServicesSearchQuery(''); }}
                        className="w-full text-left py-2 px-3 text-xs font-bold text-red-600 hover:text-red-750 hover:bg-red-50 rounded-xl transition-all flex items-center justify-between min-h-[40px]"
                      >
                        <span>All Services</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                      </button>
                    </div>
                  )}
                </div>

                {/* AI Tools Group */}
                <div className="border-b border-zinc-100 pb-3">
                  <button 
                    onClick={() => setDrawerToolsOpen(!drawerToolsOpen)}
                    className="w-full flex items-center justify-between py-2 px-1 text-[11px] font-black uppercase tracking-widest text-[#8B0000] text-left hover:bg-zinc-50 rounded-lg transition-all"
                  >
                    <span>AI Tools &amp; Estimators</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${drawerToolsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {drawerToolsOpen && (
                    <div className="mt-1.5 bg-zinc-50 rounded-2xl p-1.5 border border-[#8B0000]/20 space-y-0.5 animate-in fade-in duration-200">
                      <button 
                        onClick={() => { setCurrentPage('vin_history'); setMobileMenuOpen(false); }}
                        className="w-full text-left py-2 px-3 text-xs font-bold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/50 rounded-xl transition-all flex items-center justify-between min-h-[40px]"
                      >
                        <span>VIN &amp; Vehicle History</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                      </button>
                      <button 
                        onClick={() => { setCurrentPage('price_evaluator'); setMobileMenuOpen(false); }}
                        className="w-full text-left py-2 px-3 text-xs font-bold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/50 rounded-xl transition-all flex items-center justify-between min-h-[40px]"
                      >
                        <span>Price Evaluator</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                      </button>
                      <button 
                        onClick={() => { setCurrentPage('tax_duty_calculator'); setMobileMenuOpen(false); }}
                        className="w-full text-left py-2 px-3 text-xs font-bold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/50 rounded-xl transition-all flex items-center justify-between min-h-[40px]"
                      >
                        <span>Tax &amp; Duty Calculator</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                      </button>
                    </div>
                  )}
                </div>

                {/* B2B / General Info Group */}
                <div className="border-b border-zinc-100 pb-3">
                  <button 
                    onClick={() => setDrawerB2bOpen(!drawerB2bOpen)}
                    className="w-full flex items-center justify-between py-2 px-1 text-[11px] font-black uppercase tracking-widest text-[#8B0000] text-left hover:bg-zinc-50 rounded-lg transition-all"
                  >
                    <span>Enterprise &amp; About</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${drawerB2bOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {drawerB2bOpen && (
                    <div className="mt-1.5 bg-zinc-50 rounded-2xl p-1.5 border border-zinc-200/60 space-y-0.5 animate-in fade-in duration-200">
                      <button 
                        onClick={() => { setCurrentPage('for-business'); setMobileMenuOpen(false); }}
                        className="w-full text-left py-2 px-3 text-xs font-bold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/50 rounded-xl transition-all flex items-center justify-between min-h-[40px]"
                      >
                        <span>B2B Dealer Solutions</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                      </button>
                      <button 
                        onClick={() => { setCurrentPage('about'); setAboutActiveTab('about-us'); setMobileMenuOpen(false); }}
                        className="w-full text-left py-2 px-3 text-xs font-bold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/50 rounded-xl transition-all flex items-center justify-between min-h-[40px]"
                      >
                        <span>About Our Platform</span>
                        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Portals (Government / Police if Authorized) */}
                {(authenticatedRoles.government || authenticatedRoles.police) && (
                  <div className="pb-3">
                    <span className="text-[10px] font-mono font-black uppercase tracking-widest text-emerald-600 block pl-1 mb-1.5">Authorized Portals</span>
                    <div className="bg-zinc-50 rounded-2xl p-1.5 border border-zinc-200/60 space-y-0.5">
                      {currentRole === 'government' && authenticatedRoles.government && (
                        <button 
                          onClick={() => { setCurrentPage('govPortal'); setMobileMenuOpen(false); }}
                          className="w-full text-left py-2.5 px-3.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all flex items-center gap-2 min-h-[44px]"
                        >
                          <Landmark className="w-4 h-4 text-emerald-600" />
                          <span>Government Hub</span>
                        </button>
                      )}
                      {currentRole === 'police' && authenticatedRoles.police && (
                        <button 
                          onClick={() => { setCurrentPage('policePortal'); setMobileMenuOpen(false); }}
                          className="w-full text-left py-2.5 px-3.5 text-xs font-bold text-blue-700 hover:bg-blue-50 rounded-xl transition-all flex items-center gap-2 min-h-[44px]"
                        >
                          <Shield className="w-4 h-4 text-blue-600" />
                          <span>Police Patrol Desk</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer Actions (Sticky bottom) */}
              <div className="p-5 border-t border-zinc-150 bg-zinc-50 shrink-0 space-y-3 text-center">
                {currentRole !== 'guest' && authenticatedRoles[currentRole] ? (
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider text-center">
                      Logged in as: <span className="text-zinc-700 font-extrabold">{currentRole.toUpperCase()}</span>
                    </div>
                    <button 
                      onClick={() => {
                        performLogout();
                        setAuthenticatedRoles(prev => ({ ...prev, [currentRole]: false }));
                        setCurrentRole('guest');
                        setCurrentPage('home');
                        setMobileMenuOpen(false);
                        alert(`Logged out of authorized ${currentRole.toUpperCase()} session.`);
                      }}
                      className="w-full py-3 bg-zinc-800 hover:bg-zinc-900 text-white rounded-xl text-center text-xs font-bold tracking-wider transition-all uppercase cursor-pointer min-h-[44px] flex items-center justify-center"
                    >
                      Sign Out Session
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5">
                    <button 
                      onClick={() => {
                        setTargetSignInRole(currentRole !== 'guest' ? (currentRole as any) : 'personal');
                        setCurrentPage('signin');
                        setMobileMenuOpen(false);
                      }}
                      className="py-3 bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100 rounded-xl text-center text-xs font-bold tracking-wider transition-all uppercase cursor-pointer min-h-[44px] flex items-center justify-center"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentPage('register');
                        setMobileMenuOpen(false);
                      }}
                      className="py-3 bg-[#8B0000] hover:bg-red-700 text-white rounded-xl text-center text-xs font-bold tracking-wider transition-all uppercase cursor-pointer min-h-[44px] flex items-center justify-center"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
                <div className="text-[9px] text-zinc-400 font-medium text-center">
                  Sovereign Car Network &copy; 2026. All rights reserved.
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
  
      {/* Real-time Global Live VIN Check Progress overlay (Apple Style Sheet) */}
      {isVinAnalyzing && (
        <div className="fixed inset-0 bg-[#020617]/40 backdrop-blur-md z-[100] flex justify-center items-center p-4">
          <div className="bg-white p-8 rounded-3xl max-w-sm w-full border border-[#8B0000]/15 text-center space-y-6 shadow-2xl animate-in zoom-in duration-300 text-[#8B0000]">
            <div className="relative w-14 h-14 mx-auto">
              <div className="absolute inset-0 border-[3px] border-[#8B0000]/15 border-t-[#8B0000] rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Car className="w-5 h-5 text-red-650 animate-pulse" />
              </div>
            </div>
  
            <div className="space-y-1.5">
              <h3 className="text-lg font-semibold tracking-tight text-[#8B0000]">Vehicle Database Analysis</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">Cross-matching registered state records, vehicle build lists, and title history...</p>
            </div>
  
            {/* Check progress indicators */}
            <div className="space-y-2 text-left text-xs bg-slate-50 p-4 rounded-2xl border border-[#8B0000]/15">
              <div className="flex items-center justify-between py-0.5">
                <span className="text-slate-600 font-medium">Build Specifications check</span>
                <span className={`text-[10px] font-bold tracking-wider ${nhtsaAnalysisStep >= 1 ? 'text-red-650' : 'text-slate-400'}`}>
                  {nhtsaAnalysisStep >= 1 ? 'READY' : 'PENDING'}
                </span>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="text-slate-600 font-medium">Verify Title Insurance Brand</span>
                <span className={`text-[10px] font-bold tracking-wider ${nhtsaAnalysisStep >= 2 ? 'text-red-650' : 'text-slate-400'}`}>
                  {nhtsaAnalysisStep >= 2 ? 'READY' : 'PENDING'}
                </span>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="text-slate-600 font-medium">Duplicate Clone Audit</span>
                <span className={`text-[10px] font-bold tracking-wider ${nhtsaAnalysisStep >= 3 ? 'text-red-650' : 'text-slate-400'}`}>
                  {nhtsaAnalysisStep >= 3 ? 'READY' : 'PENDING'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
 
      {/* Main Layout Area */}
      <div className={(currentPage === 'service-details' || currentPage === 'services' || currentPage === 'for-business' || currentPage === 'about' || currentPage === 'community' || currentPage === 'advisory_guidance' || currentPage === 'pricing' || currentPage === 'features' || currentPage === 'download_app' || currentPage === 'contact_us' || currentPage === 'partner_with_us' || currentPage === 'blog') ? "flex-1 w-full pb-12 pt-16" : (currentPage === 'home' ? "flex-1 w-full pb-12" : "flex-1 max-w-[1240px] mx-auto px-4 w-full py-8")}>
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <LandingPage
                isSplashLoading={isSplashLoading}
                onSearchVin={triggerVinCheckSequence}
                onNavigateToMarketplace={() => setCurrentPage('marketplace')}
                onNavigateToAdvisory={() => { setCurrentPage('advisory_guidance'); }}
                onNavigateToAuctions={() => { setCurrentPage('dashboards'); }}
                onNavigateToLiveAction={() => setCurrentPage('live_action')}
                sampleVehicles={VEHICLES}
                onSelectService={(serviceId) => {
                  setServiceSourcePage('home');
                  setSelectedServiceId(serviceId);
                  setCurrentPage('service-details');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
              />
            </motion.div>
          )}

          {currentPage === 'services' && (
            <motion.div
              key="services"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <ServicesPage
                onSelectService={(serviceId) => {
                  setServiceSourcePage('services');
                  setSelectedServiceId(serviceId);
                  setCurrentPage('service-details');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
                initialCategory={headerServicesCategory}
                initialSearchQuery={headerServicesSearchQuery}
                onCategoryChange={(cat) => {
                  setActiveServiceCategory(cat);
                  setHeaderServicesCategory(cat);
                }}
              />
            </motion.div>
          )}

          {currentPage === 'service-details' && selectedServiceId && (
            <motion.div
              key="service-details"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <ServiceDetails
                serviceId={selectedServiceId}
                onBack={() => {
                  setCurrentPage(serviceSourcePage);
                  setSelectedServiceId(null);
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
                onConfirmAcquisition={(details) => {
                  console.log('Successfully acquired service', details);
                }}
              />
            </motion.div>
          )}

          {currentPage === 'messages' && (
            <motion.div
              key="messages"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <SovereignClientChat standalone />
            </motion.div>
          )}

          {currentPage === 'marketplace' && (
            <motion.div
              key="marketplace"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <Marketplace
                onSelectVehicle={(vin) => {
                  setSelectedVehicleVin(vin);
                  setVehicleDetailsInitialSubPage('details');
                  setCurrentPage('details');
                }}
                onOpenVehicleChat={(vin) => {
                  setSelectedVehicleVin(vin || VEHICLES[0]?.vin || '');
                  setVehicleDetailsInitialSubPage('chat');
                  setCurrentPage('details');
                  window.scrollTo({ top: 0, behavior: 'instant' });
                }}
                searchQuery={headerSearchQuery}
                onSearchQueryChange={setHeaderSearchQuery}
              />
            </motion.div>
          )}

          {currentPage === 'signin' && (
            <motion.div
              key="signin"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <SignIn
                targetRole={targetSignInRole}
                onSuccess={(role) => {
                  setAuthenticatedRoles(prev => ({ ...prev, [role]: true }));
                  setCurrentRole(role as Role);
                  if (role === 'government') {
                    setCurrentPage('govPortal');
                  } else if (role === 'police') {
                    setCurrentPage('policePortal');
                  } else {
                    setCurrentPage('dashboards');
                  }
                }}
                onCancel={() => {
                  setCurrentPage('home');
                }}
              />
            </motion.div>
          )}

          {currentPage === 'details' && (
            <motion.div
              key="details"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <VehicleDetails
                vehicle={selectedVehicle}
                initialSubPage={vehicleDetailsInitialSubPage}
                onBack={() => setCurrentPage('marketplace')}
                onNavigateToFinance={() => { setCurrentRole('personal'); setCurrentPage('dashboards'); }}
                onNavigateToInsurance={() => { setCurrentRole('insurance'); setCurrentPage('dashboards'); }}
              />
            </motion.div>
          )}

          {currentPage === 'register' && (
            <motion.div
              key="register"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <AuthJourney
                onSuccess={handleRegistrationSuccess}
              />
            </motion.div>
          )}

          {currentPage === 'ai_tools' && (
            <motion.div
              key="ai_tools"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <AITools />
            </motion.div>
          )}

          {currentPage === 'vin_history' && (
            <motion.div
              key="vin_history"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <VinHistoryPlatform />
            </motion.div>
          )}

          {currentPage === 'price_evaluator' && (
            <motion.div
              key="price_evaluator"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <PriceEvaluatorPlatform />
            </motion.div>
          )}

          {currentPage === 'tax_duty_calculator' && (
            <motion.div
              key="tax_duty_calculator"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <TaxDutyCalculatorPlatform />
            </motion.div>
          )}

          {currentPage === 'vehicle_inspection' && (
            <motion.div
              key="vehicle_inspection"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <VehicleInspectionPlatform />
            </motion.div>
          )}

          {currentPage === 'identity_check' && (
            <motion.div
              key="identity_check"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <IdentityCheckPlatform />
            </motion.div>
          )}

          {currentPage === 'live_action' && (
            <motion.div
              key="live_action"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <LiveAction onSearchVin={triggerVinCheckSequence} />
            </motion.div>
          )}

          {currentPage === 'cyber_sec' && (
            <motion.div
              key="cyber_sec"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <PlatformCenter />
            </motion.div>
          )}

          {currentPage === 'insurance_platform' && (
            <motion.div
              key="insurance_platform"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <InsurancePlatform />
            </motion.div>
          )}

          {currentPage === 'finance_platform' && (
            <motion.div
              key="finance_platform"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <FinancePlatform />
            </motion.div>
          )}

          {currentPage === 'driving_schools_platform' && (
            <motion.div
              key="driving_schools_platform"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <DrivingSchoolsPlatform />
            </motion.div>
          )}

          {currentPage === 'inspection_centers_platform' && (
            <motion.div
              key="inspection_centers_platform"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <InspectionCentersPlatform />
            </motion.div>
          )}

          {currentPage === 'dismantlers_platform' && (
            <motion.div
              key="dismantlers_platform"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <DismantlersPlatform />
            </motion.div>
          )}

          {currentPage === 'automotive_lawyers' && (
            <motion.div
              key="automotive_lawyers"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <AutomotiveLawyersPlatform />
            </motion.div>
          )}

          {currentPage === 'advisory_guidance' && (
            <motion.div
              key="advisory_guidance"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <AdvisoryGuidancePlatform />
            </motion.div>
          )}

          {currentPage === 'govPortal' && (
            <motion.div
              key="govPortal"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <GovPortal />
            </motion.div>
          )}

          {currentPage === 'policePortal' && (
            <motion.div
              key="policePortal"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <PolicePortal onLogout={() => {
                setAuthenticatedRoles(prev => ({ ...prev, police: false }));
                setCurrentRole('guest');
                setCurrentPage('home');
                alert("Logged out of authorized LEO session.");
              }} />
            </motion.div>
          )}

          {currentPage === 'dashboards' && (
            <motion.div
              key="dashboards"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <Dashboards currentRole={currentRole} />
            </motion.div>
          )}

          {currentPage === 'for-business' && (
            <motion.div
              key="for-business"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full px-4 max-w-[1240px] mx-auto mt-6"
            >
              <ForBusiness />
            </motion.div>
          )}

          {currentPage === 'community' && (
            <motion.div
              key="community"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full px-4 max-w-[1240px] mx-auto mt-6"
            >
              <Community />
            </motion.div>
          )}

          {currentPage === 'pricing' && (
            <motion.div
              key="pricing"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full px-4 max-w-[1240px] mx-auto mt-6"
            >
              <Pricing />
            </motion.div>
          )}

          {currentPage === 'features' && (
            <motion.div
              key="features"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full"
            >
              <Features 
                onNavigateToSignup={() => { setCurrentPage('register'); window.scrollTo({ top: 0, behavior: 'instant' }); }}
                onNavigateToServices={() => { setCurrentPage('services'); window.scrollTo({ top: 0, behavior: 'instant' }); }}
                onNavigateToBusiness={() => { setCurrentPage('for-business'); window.scrollTo({ top: 0, behavior: 'instant' }); }}
              />
            </motion.div>
          )}

          {currentPage === 'about' && (
            <motion.div
              key="about"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full px-4 max-w-[1240px] mx-auto mt-6"
            >
              <About activeTab={aboutActiveTab} setActiveTab={setAboutActiveTab} />
            </motion.div>
          )}

          {currentPage === 'download_app' && (
            <motion.div
              key="download_app"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full px-4 max-w-[1240px] mx-auto mt-6"
            >
              <DownloadApp />
            </motion.div>
          )}

          {currentPage === 'contact_us' && (
            <motion.div
              key="contact_us"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full px-4 max-w-[1240px] mx-auto mt-6"
            >
              <ContactUs />
            </motion.div>
          )}

          {currentPage === 'partner_with_us' && (
            <motion.div
              key="partner_with_us"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full px-4 max-w-[1240px] mx-auto mt-6"
            >
              <PartnerWithUs />
            </motion.div>
          )}

          {currentPage === 'blog' && (
            <motion.div
              key="blog"
              variants={pageTransitionVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full px-4 max-w-[1240px] mx-auto mt-6"
            >
              <BlogPage />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
 
      {/* Global Regulatory Footer */}
      <footer className="bg-slate-50 border-t border-[#8B0000]/15 pt-16 pb-12 text-slate-600">
        <div className="max-w-[1240px] mx-auto px-4 mb-12">
          {/* Logo brand and subtitle */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-10 border-b border-[#8B0000]/15 mb-10">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-[#8B0000] tracking-tight flex items-center cursor-pointer" onClick={() => { setCurrentPage('home'); setSelectedVehicleVin(null); }}>
                <img 
                  src="https://files.catbox.moe/jhta7v.png" 
                  alt="Logo" 
                  className="h-8 w-auto object-contain" 
                  referrerPolicy="no-referrer" 
                />
              </span>
              <p className="text-slate-500 text-xs max-w-md leading-relaxed font-normal">
                High-integrity automated automotive registry evaluations, ISO verified compliance metrics, and federal NMVTIS database integration.
              </p>
            </div>
            <div className="flex gap-3">
              <a href="#" className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-red-650 transition-colors duration-200" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-red-650 transition-colors duration-200" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-red-650 transition-colors duration-200" aria-label="X (formerly Twitter)">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-red-650 transition-colors duration-200" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-red-650 transition-colors duration-200" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* 6 Grid columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {/* Column 1 — Platform */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-[#8B0000] uppercase tracking-widest">Platform</h4>
              <ul className="space-y-2.5 text-[11px] font-medium">
                <li><button onClick={() => { setCurrentPage('about'); setAboutActiveTab('how-it-works'); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-bold text-left transition-colors duration-200 hover:text-zinc-800">How It Works</button></li>
                <li><button onClick={() => { setCurrentPage('features'); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-semibold text-left transition-colors duration-200 hover:text-zinc-800">Features</button></li>
                <li><button onClick={() => { setCurrentPage('ai_tools'); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-semibold text-left transition-colors duration-200 hover:text-zinc-800">API & Integrations</button></li>
                <li><button onClick={() => { setCurrentPage('for-business'); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-semibold text-left transition-colors duration-200 hover:text-zinc-800">Enterprise Solutions</button></li>
                <li><button onClick={() => { setCurrentPage('download_app'); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="text-left creamy-underline text-zinc-500 font-semibold transition-colors duration-200 block hover:text-zinc-800">Download the App</button></li>
              </ul>
            </div>

            {/* Column 2 — Marketplace */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-[#8B0000] uppercase tracking-widest">Marketplace</h4>
              <ul className="space-y-2.5 text-[11px] font-medium">
                <li><button onClick={() => { setCurrentPage('marketplace'); setSelectedVehicleVin(null); setHeaderSearchQuery(''); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-bold text-left transition-colors duration-200 hover:text-zinc-800">Buy a Vehicle</button></li>
                <li><button onClick={() => { setCurrentPage('marketplace'); setSelectedVehicleVin(null); setHeaderSearchQuery('Sell'); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-bold text-left transition-colors duration-200 hover:text-zinc-800">Sell a Vehicle</button></li>
                <li><button onClick={() => { setCurrentPage('marketplace'); setSelectedVehicleVin(null); setHeaderSearchQuery('Spare Parts'); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-bold text-left transition-colors duration-200 hover:text-zinc-800">Spare Parts</button></li>
                <li><button onClick={() => { setCurrentPage('marketplace'); setSelectedVehicleVin(null); setHeaderSearchQuery('Auction'); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-bold text-left transition-colors duration-200 hover:text-zinc-800">Auctions</button></li>
                <li><button onClick={() => { setCurrentPage('marketplace'); setSelectedVehicleVin(null); setHeaderSearchQuery('Import'); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-semibold text-left transition-colors duration-200 hover:text-zinc-800">Import / Export</button></li>
                <li><button onClick={() => { setCurrentPage('marketplace'); setSelectedVehicleVin(null); setHeaderSearchQuery('Damaged'); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-semibold text-left transition-colors duration-200 hover:text-zinc-800">Damaged Vehicles</button></li>
                <li><button onClick={() => { setCurrentPage('marketplace'); setSelectedVehicleVin(null); setHeaderSearchQuery('Rental'); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-semibold text-left transition-colors duration-200 hover:text-zinc-800">Car Rental</button></li>
              </ul>
            </div>

            {/* Column 3 — Services */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-[#8B0000] uppercase tracking-widest">Services</h4>
              <ul className="space-y-2.5 text-[11px] font-medium">
                <li><button onClick={() => { setCurrentPage('services'); setSelectedVehicleVin(null); setHeaderServicesCategory('Specialist Mechanics'); setHeaderServicesSearchQuery(''); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-bold text-left transition-colors duration-200 hover:text-zinc-800">Find a Mechanic</button></li>
                <li><button onClick={() => { setCurrentPage('services'); setSelectedVehicleVin(null); setHeaderServicesCategory('Auto Painters'); setHeaderServicesSearchQuery(''); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-bold text-left transition-colors duration-200 hover:text-zinc-800">Auto Painters</button></li>
                <li><button onClick={() => { setCurrentPage('services'); setSelectedVehicleVin(null); setHeaderServicesCategory('Tire Dealers'); setHeaderServicesSearchQuery(''); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-bold text-left transition-colors duration-200 hover:text-zinc-800">Tire Dealers</button></li>
                <li><button onClick={() => { setCurrentPage('services'); setSelectedVehicleVin(null); setHeaderServicesCategory('Detailing Companies'); setHeaderServicesSearchQuery(''); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-bold text-left transition-colors duration-200 hover:text-zinc-800">Detailing</button></li>
                <li><button onClick={() => { setCurrentPage('services'); setSelectedVehicleVin(null); setHeaderServicesCategory('Glass Repair & Replacement'); setHeaderServicesSearchQuery(''); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-bold text-left transition-colors duration-200 hover:text-zinc-800">Glass Repair / Replacement</button></li>
                <li><button onClick={() => { setCurrentPage('services'); setSelectedVehicleVin(null); setHeaderServicesCategory('Rust Protection & Underbody'); setHeaderServicesSearchQuery(''); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-bold text-left transition-colors duration-200 hover:text-zinc-800">Rust & Underbody Treatment</button></li>
                <li><button onClick={() => { setCurrentPage('services'); setSelectedVehicleVin(null); setHeaderServicesCategory('Wrapping & Advertising'); setHeaderServicesSearchQuery(''); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-bold text-left transition-colors duration-200 hover:text-zinc-800">Wrapping & Advertising</button></li>
                <li><button onClick={() => { setCurrentPage('services'); setSelectedVehicleVin(null); setHeaderServicesCategory('Metalwork & Fabrication'); setHeaderServicesSearchQuery(''); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-bold text-left transition-colors duration-200 hover:text-zinc-800">Metalwork & Fabrication</button></li>
                <li><button onClick={() => { setCurrentPage('automotive_lawyers'); setSelectedVehicleVin(null); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-semibold text-left transition-colors duration-200 hover:text-zinc-800">Automotive Lawyers</button></li>
              </ul>
            </div>

            {/* Column 4 — B2B */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-[#8B0000] uppercase tracking-widest">B2B</h4>
              <ul className="space-y-2.5 text-[11px] font-medium">
                <li><button onClick={() => { setCurrentPage('for-business'); setSelectedVehicleVin(null); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-bold text-left transition-colors duration-200 hover:text-zinc-800">Dealerships</button></li>
                <li><button onClick={() => { setCurrentPage('for-business'); setSelectedVehicleVin(null); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-bold text-left transition-colors duration-200 hover:text-zinc-800">Logistics & Transport</button></li>
                <li><button onClick={() => { setCurrentPage('insurance_platform'); setSelectedVehicleVin(null); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-bold text-left transition-colors duration-200 hover:text-zinc-800">Insurance Companies</button></li>
                <li><button onClick={() => { setCurrentPage('finance_platform'); setSelectedVehicleVin(null); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-bold text-left transition-colors duration-200 hover:text-zinc-800">Finance &amp; Leasing</button></li>
                <li><button onClick={() => { setCurrentPage('driving_schools_platform'); setSelectedVehicleVin(null); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-bold text-left transition-colors duration-200 hover:text-zinc-800">Driving Schools</button></li>
                <li><button onClick={() => { setCurrentPage('inspection_centers_platform'); setSelectedVehicleVin(null); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-bold text-left transition-colors duration-200 hover:text-zinc-800">Inspection Centers</button></li>
                <li><button onClick={() => { setCurrentPage('dismantlers_platform'); setSelectedVehicleVin(null); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-bold text-left transition-colors duration-200 hover:text-zinc-800">Dismantlers & Recyclers</button></li>
                <li><button onClick={() => { setCurrentPage('advisory_guidance'); setSelectedVehicleVin(null); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-semibold text-left transition-colors duration-200 hover:text-zinc-800">Advisory & Guidance</button></li>
              </ul>
            </div>

            {/* Column 5 — Tools & Resources */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-[#8B0000] uppercase tracking-widest">Tools & Resources</h4>
              <ul className="space-y-2.5 text-[11px] font-medium">
                <li><button onClick={() => { setCurrentPage('vin_history'); setSelectedVehicleVin(null); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-bold text-left transition-colors duration-200 hover:text-zinc-800">VIN Search & Vehicle History</button></li>
                <li><button onClick={() => { setCurrentPage('price_evaluator'); setSelectedVehicleVin(null); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-bold text-left transition-colors duration-200 hover:text-zinc-800">Price Evaluator</button></li>
                <li><button onClick={() => { setCurrentPage('tax_duty_calculator'); setSelectedVehicleVin(null); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-bold text-left transition-colors duration-200 hover:text-zinc-800">Tax & Duty Calculator</button></li>
                <li><button onClick={() => { setCurrentPage('pricing'); setSelectedVehicleVin(null); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-semibold text-left transition-colors duration-200 hover:text-zinc-800">Platform Pricing</button></li>
                <li><button onClick={() => { setCurrentPage('community'); setSelectedVehicleVin(null); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-semibold text-left transition-colors duration-200 hover:text-zinc-800">News & Insights</button></li>
                <li><button onClick={() => { setCurrentPage('community'); setSelectedVehicleVin(null); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-semibold text-left transition-colors duration-200 hover:text-zinc-800">Automotive Forums</button></li>
              </ul>
            </div>

            {/* Column 6 — Company */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-[#8B0000] uppercase tracking-widest">Company</h4>
              <ul className="space-y-2.5 text-[11px] font-medium">
                <li><button onClick={() => { setCurrentPage('about'); setAboutActiveTab('about-us'); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-bold text-left transition-colors duration-200 hover:text-zinc-800">About Us</button></li>
                <li><button onClick={() => { setCurrentPage('about'); setAboutActiveTab('careers'); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-bold text-left transition-colors duration-200 hover:text-zinc-800">Careers</button></li>
                <li><button onClick={() => { setCurrentPage('about'); setAboutActiveTab('press'); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-bold text-left transition-colors duration-200 hover:text-zinc-800">Press & Media</button></li>
                <li><button onClick={() => { setCurrentPage('blog'); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-semibold text-left transition-colors duration-200 hover:text-zinc-800">Blog</button></li>
                <li><button onClick={() => { setCurrentPage('contact_us'); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-semibold text-left transition-colors duration-200 hover:text-zinc-800">Contact Us</button></li>
                <li><button onClick={() => { setCurrentPage('partner_with_us'); window.scrollTo({ top: 0, behavior: 'instant' }); }} className="creamy-underline text-zinc-500 font-semibold text-left transition-colors duration-200 hover:text-zinc-800">Partner With Us</button></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar with legal & copyright */}
        <div className="max-w-[1240px] mx-auto px-4 pt-6 border-t border-[#8B0000]/15 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center md:justify-start font-medium text-[11px]">
            <a href="#" className="hover:text-red-650 transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-red-650 transition-colors">Terms of Service</a>
            <span>·</span>
            <a href="#" className="hover:text-red-650 transition-colors">Cookie Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-red-650 transition-colors">Security</a>
            <span>·</span>
            <a href="#" className="hover:text-red-650 transition-colors">Sitemap</a>
          </div>
          <p className="text-slate-400 text-center md:text-right text-[11px] font-medium">
            © 2025 JustCarSale. All Rights Reserved.
          </p>
        </div>
      </footer>
      </motion.div>

      {!mobileMenuOpen && (
        <FloatingChatAssistant 
          currentPage={currentPage}
          activeCategory={activeServiceCategory}
          onNavigate={(page, category) => {
            setCurrentPage(page);
            if (page === 'services') {
              setHeaderServicesCategory(category || null);
              setActiveServiceCategory(category || null);
            }
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
        />
      )}
    </>
  );
}

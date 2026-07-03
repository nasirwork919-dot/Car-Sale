/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { mapBackendVehicles, BackendVehicle } from '../lib/vehicleAdapter';
import { 
  Search, Shield, Gavel, FileText, CheckCircle, ArrowRight, Activity, 
  Globe, Check, Sparkles, Cpu, RefreshCw, BarChart2, Eye, Gauge, Zap,
  User, Briefcase, Landmark, Menu, X, ShoppingCart, Tag, Sliders, MapPin, Grid, Info, ShoppingBag,
  Wrench, Hammer, Paintbrush, Layers, ShieldCheck, HelpCircle, PhoneCall,
  Droplets, Wind, Scissors, Stethoscope, GraduationCap, ChevronLeft, ChevronRight, Car,
  Truck, Bug, Sprout, Camera, HardHat, Utensils, Heart, Palette, Disc, Megaphone, Crown, Gem, Award, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Vehicle } from '../types';
import { NumericTransition } from './AnimatedCounter';

interface AutomotiveService {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  badge: string;
  facilities: string;
  avgTurnaround: string;
}

const AUTOMOTIVE_SERVICES: AutomotiveService[] = [
  {
    id: 'auto-painters',
    title: 'Auto Painters',
    description: 'Bespoke multi-stage painting, clear-coat finishing, and computer-matched factory color restoration in controlled dust-free downdraft booths.',
    image: 'https://images.unsplash.com/photo-1599256872237-5dcc0fbe966a?auto=format&fit=crop&q=80&w=800',
    tags: ['Factory Refinishing', 'Color Match', 'Ceramic Seal'],
    badge: 'Premium Finish',
    facilities: '6 State-of-the-art downdraft dustless cabins',
    avgTurnaround: '3 - 5 business days'
  },
  {
    id: 'mechanics',
    title: 'Mechanics',
    description: 'Master diagnostics, powertrain reconstruction, and mechanical calibrations conducted by ASE-certified master mechanics utilizing modern telemetry.',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=800',
    tags: ['Diagnostics', 'Engine Labs', 'Calibrations'],
    badge: 'ASE Master Cert',
    facilities: '12 Hydraulic lift bays & diagnostic modules',
    avgTurnaround: '1 - 3 business days'
  },
  {
    id: 'tire-dealers',
    title: 'Tire Dealers',
    description: 'Authorized distribution of high-performance tires, elite track slicks, and precise computer and laser wheel-balancing for performance setups.',
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=800',
    tags: ['Ultra High Performance', 'Track Slicks', 'Laser Balancing'],
    badge: 'Authorized Dealer',
    facilities: 'Laser road-force wheel diagnostic hubs',
    avgTurnaround: 'Same day installation'
  },
  {
    id: 'detailing-companies',
    title: 'Detailing Companies',
    description: 'High-end cosmetic detailing, multi-stage paint correction, wet-sanding, and long-term certified ceramic coating applications for concours presentation.',
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=800',
    tags: ['Paint Correction', 'Ceramic Coatings', 'Concours Prep'],
    badge: 'Elite Detail',
    facilities: 'Climate-controlled curing and light tunnels',
    avgTurnaround: '1 - 2 business days'
  },
  {
    id: 'wrapping-advertising',
    title: 'Wrapping and Advertising Companies',
    description: 'Precision full-color change color shift vinyl wraps, commercial advertising wraps, paint protection film (PPF), and bespoke livery designs.',
    image: 'https://images.unsplash.com/photo-1626847037657-fd3622613ce3?auto=format&fit=crop&q=80&w=800',
    tags: ['XPEL PPF', 'Color Wrap', 'Commercial Fleet'],
    badge: 'Wrap Specialists',
    facilities: 'De-humidified dust-free wrap workstations',
    avgTurnaround: '2 - 4 business days'
  },
  {
    id: 'rust-protection',
    title: 'Rust Protection and Underbody Treatment Specialists',
    description: 'Salt-resistant undercarriage coating, advanced cavitation preservation, and heavy-duty wax barrier treatment built for extreme-weather longevity.',
    image: 'https://images.unsplash.com/photo-1518384401463-d387dd16ef9b?auto=format&fit=crop&q=80&w=800',
    tags: ['Undercarriage Seal', 'Cavitation Wax', 'Corrosion Tech'],
    badge: 'Rust Tech',
    facilities: 'Dedicated chassis-spray jet wash elevators',
    avgTurnaround: '1 - 2 business days'
  },
  {
    id: 'metalwork-fabrication',
    title: 'Metalwork and Fabrication Workshops',
    description: 'Precision custom welding, handcrafted rollcage fabrications, weight-reduction bracket construction, and metal panel custom restorations.',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
    tags: ['TIG/MIG Welding', 'Rollcages', 'Chassis Stitching'],
    badge: 'Bespoke Fab',
    facilities: 'Heavy-duty CNC mills & laser-cutting rigs',
    avgTurnaround: '3 - 7 business days'
  },
  {
    id: 'glass-repair',
    title: 'Glass Repair/Replacement Companies',
    description: 'Factory-certified ADAS-calibrated windshield replacements, rapid chip repairs, and premium tempered side glass installations.',
    image: 'https://images.unsplash.com/photo-1558441719-ff34b0524a24?auto=format&fit=crop&q=80&w=800',
    tags: ['ADAS Calibration', 'Windshield Repair', 'OEM Glass'],
    badge: 'Safety First',
    facilities: 'Optical sensor test rigs & ADAS aligners',
    avgTurnaround: '2 - 4 hours'
  },
  {
    id: 'specialized-workshops',
    title: 'Specialized Automotive Workshops',
    description: 'Tuning houses, track day preparations, bespoke engine builds, transmission rebuilding, and high-performance ECU mapping.',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800',
    tags: ['ECU Tuning', 'Engine Blueprinting', 'Track Setup'],
    badge: 'Performance Hub',
    facilities: 'All-wheel Mustang dyno testing system',
    avgTurnaround: 'Custom per specification'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      damping: 24, 
      stiffness: 110 
    } 
  }
};

export interface ServiceCategoryItem {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  imageUrl?: string;
}

export interface ServiceProviderItem {
  id: string;
  name: string;
  category: string;
  specialty: string;
  location: string;
  jobs: number;
  rating: number;
  rate: number;
  image: string;
}

export const SERVICE_CATEGORIES: ServiceCategoryItem[] = [
  { id: 'auto-painters', name: 'Auto Painters', icon: Paintbrush, imageUrl: 'https://files.catbox.moe/4zcurn.png' },
  { id: 'mechanics', name: 'Specialist Mechanics', icon: Award, imageUrl: 'https://files.catbox.moe/9bce4d.png' },
  { id: 'tire-dealers', name: 'Tire Dealers', icon: Sliders, imageUrl: 'https://files.catbox.moe/zds00d.png' },
  { id: 'detailing', name: 'Detailing Companies', icon: Gem, imageUrl: 'https://files.catbox.moe/kardpr.png' },
  { id: 'wrapping', name: 'Wrapping & Advertising', icon: Layers, imageUrl: 'https://files.catbox.moe/j9udoc.png' },
  { id: 'rust-protection', name: 'Rust Protection & Underbody', icon: ShieldCheck, imageUrl: 'https://files.catbox.moe/zasjvy.png' },
  { id: 'metalwork', name: 'Metalwork & Fabrication', icon: Hammer, imageUrl: 'https://files.catbox.moe/i9r7i6.png' },
  { id: 'glass-repair', name: 'Glass Repair & Replacement', icon: Grid, imageUrl: 'https://files.catbox.moe/4yda7h.png' },
  { id: 'specialized-workshops', name: 'Specialized Auto Workshops', icon: Crown, imageUrl: 'https://files.catbox.moe/4xcmnd.png' }
];

export const SERVICE_PROVIDERS: ServiceProviderItem[] = [
  {
    id: 'p-21',
    name: 'Vilnius Elite Auto Paint & Body',
    category: 'Auto Painters',
    specialty: 'Dupont Oven Paint & Scratch Removal specialist',
    location: 'Vilnius',
    jobs: 920,
    rating: 5,
    rate: 4500,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p-22',
    name: 'Kaunas Precision Motors & Tuning',
    category: 'Specialist Mechanics',
    specialty: 'German ECU Diagnostics & Engine Overhaul engineer',
    location: 'Kaunas',
    jobs: 1400,
    rating: 4.9,
    rate: 5000,
    image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p-23',
    name: 'Klaipėda Baltic Tire Service Hub',
    category: 'Tire Dealers',
    specialty: 'Laser Wheel Alignment & Alloy Mountings depot',
    location: 'Klaipėda',
    jobs: 2300,
    rating: 5,
    rate: 3000,
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p-24',
    name: 'Nordic Ceramic Pro Vilnius',
    category: 'Detailing Companies',
    specialty: '9H Ceramic Coating & Premium Paint Correction salon',
    location: 'Vilnius',
    jobs: 620,
    rating: 5,
    rate: 8000,
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p-25',
    name: 'Baltic Premium Custom Wraps',
    category: 'Wrapping & Advertising',
    specialty: 'Matte/Satin Vehicle Wrapping & Brand Fleet Decals studio',
    location: 'Kaunas',
    jobs: 480,
    rating: 4.8,
    rate: 6500,
    image: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p-26',
    name: 'Vilnius RustShield Undercoatings',
    category: 'Rust Protection & Underbody',
    specialty: 'Heavy Duty Polyurethane Chassis Sealing expert',
    location: 'Vilnius',
    jobs: 1150,
    rating: 4.9,
    rate: 3500,
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p-27',
    name: 'Vytis Exhaust Forge & Metalwork',
    category: 'Metalwork & Fabrication',
    specialty: 'Custom Roll Cages & Performance Exhaust Welders',
    location: 'Kaunas',
    jobs: 840,
    rating: 4.9,
    rate: 4000,
    image: 'https://images.unsplash.com/photo-1504222490345-c075b6008014?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p-28',
    name: 'Stiklas Baltic Windshield & Glass',
    category: 'Glass Repair & Replacement',
    specialty: 'Double-glazed Glass Fits & Chip Fix service hub',
    location: 'Klaipėda',
    jobs: 1040,
    rating: 5,
    rate: 2800,
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'p-29',
    name: 'Gediminas Performance Autoworks',
    category: 'Specialized Auto Workshops',
    specialty: 'Supercharged Retrofits & JDM Dyno Tuning facility',
    location: 'Vilnius',
    jobs: 720,
    rating: 5,
    rate: 12000,
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=600'
  }
];

interface LandingPageProps {
  isSplashLoading?: boolean;
  onSearchVin: (vin: string) => void;
  onNavigateToMarketplace: () => void;
  onNavigateToAdvisory: () => void;
  onNavigateToAuctions: () => void;
  onNavigateToLiveAction: () => void;
  sampleVehicles: Vehicle[];
  onSelectService?: (serviceId: string) => void;
}

export default function LandingPage({
  isSplashLoading = false,
  onSearchVin,
  onNavigateToMarketplace,
  onNavigateToAdvisory,
  onNavigateToAuctions,
  onNavigateToLiveAction,
  sampleVehicles,
  onSelectService
}: LandingPageProps) {
  const [vinInput, setVinInput] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const servicesContainerRef = React.useRef<HTMLDivElement>(null);
  const [isServicesHovered, setIsServicesHovered] = useState(false);

  const handleScrollLeft = () => {
    if (servicesContainerRef.current) {
      servicesContainerRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (servicesContainerRef.current) {
      servicesContainerRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const container = servicesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      if (scrollWidth <= clientWidth) return;

      const oneThird = scrollWidth / 3;
      if (scrollLeft <= 10) {
        container.scrollLeft += oneThird;
      } else if (scrollLeft >= (scrollWidth * 1.9) / 3) {
        container.scrollLeft -= oneThird;
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    
    // Auto-align to center third initially
    const timer = setTimeout(() => {
      if (container.scrollLeft <= 20) {
        container.scrollLeft = container.scrollWidth / 3;
      }
    }, 150);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (isServicesHovered) return;

    const container = servicesContainerRef.current;
    if (!container) return;

    let animationFrameId: number;

    const scroll = () => {
      if (!servicesContainerRef.current) return;
      // Scroll speed set to an agile, flawless 1.35px per frame (prev was 0.65)
      servicesContainerRef.current.scrollLeft -= 1.35;
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isServicesHovered]);

  // Elegant Search Console state parameters
  const [activeCategory, setActiveCategory] = useState('Cars');
  const [selectedMake, setSelectedMake] = useState('All makes');
  const [selectedModel, setSelectedModel] = useState('All models');
  const [postalCode, setPostalCode] = useState('');
  const [hasSearchExecuted, setHasSearchExecuted] = useState(false);





  const categoriesList = [
    'Cars',
    'Commercial & heavy trucks',
    'Trailers',
    'RVs',
    'Boats',
    'Watercraft',
    'Bikes & ATVs',
    'Snowmobiles',
    'Heavy equipment',
    'Farm equipment'
  ];

  const makesList = [
    'All makes', 
    'Porsche', 
    'BMW', 
    'Tesla', 
    'Land Rover',
    'Hyundai',
    'Mitsubishi',
    'Polestar',
    'Honda',
    'Cadillac',
    'Ford',
    'Jeep',
    'Toyota'
  ];

  const modelsByMake: Record<string, string[]> = {
    'All makes': ['All models'],
    'Porsche': ['911 Carrera S', 'Taycan Turbo', 'Cayenne Coupe'],
    'BMW': ['M5 Competition', 'X5 M', 'i4 M50'],
    'Tesla': ['Model S Plaid', 'Model Y Performance'],
    'Land Rover': ['Range Rover Sport', 'Defender 110'],
    'Hyundai': ['Elantra N', 'IONIQ 5 N', 'Palisade Calligraphy'],
    'Mitsubishi': ['Outlander PHEV', 'Lancer Evolution X'],
    'Polestar': ['Polestar 2 BST', 'Polestar 3 Performance'],
    'Honda': ['Civic Type R', 'Accord Hybrid', 'NSX Type S'],
    'Cadillac': ['Escalade-V', 'CT5-V Blackwing'],
    'Ford': ['Mustang Dark Horse', 'F-150 Raptor R', 'Bronco Raptor'],
    'Jeep': ['Grand Wagoneer L', 'Wrangler Rubicon 392'],
    'Toyota': ['GR Corolla', 'Supra 3.0 Premium', 'Land Cruiser']
  };

  // Get active models list based on selected make
  const activeModels = modelsByMake[selectedMake] || ['All models'];

  // Dynamically update selected model when make changes
  useEffect(() => {
    setSelectedModel('All models');
  }, [selectedMake]);

  // Dynamic result count matching current choice scale
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [stats, setStats] = useState({
    totalActiveVehicles: 0,
    totalDealers: 0,
    totalCountries: 0,
    vehiclesAddedThisWeek: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, featuredData] = await Promise.all([
          api.get('/marketplace/stats'),
          api.get<BackendVehicle[]>('/marketplace/featured')
        ]);
        setStats(statsData);
        setFeaturedVehicles(mapBackendVehicles(featuredData));
      } catch (err) {
        console.error("Failed to load landing page data", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const getResultCount = () => {
    if (selectedMake === 'All makes') {
      return `${stats.totalActiveVehicles.toLocaleString()} results`;
    }
    // ... keep rest of hardcoded logic as fallback or just return stats.totalActiveVehicles if specific counts aren't available from stats endpoint
    // For now, let's keep it as is, but maybe use the real total for 'All makes'
    if (selectedModel === 'All models') {
      if (selectedMake === 'Porsche') return '12,450 results';
      if (selectedMake === 'BMW') return '48,210 results';
      if (selectedMake === 'Tesla') return '28,150 results';
      if (selectedMake === 'Land Rover') return '15,480 results';
      if (selectedMake === 'Hyundai') return '14,620 results';
      if (selectedMake === 'Mitsubishi') return '3,840 results';
      if (selectedMake === 'Polestar') return '1,150 results';
      if (selectedMake === 'Honda') return '25,120 results';
      if (selectedMake === 'Cadillac') return '5,430 results';
      if (selectedMake === 'Ford') return '38,910 results';
      if (selectedMake === 'Jeep') return '19,250 results';
      if (selectedMake === 'Toyota') return '42,100 results';
      return '1,204 results';
    }
    // Specific model counts
    if (selectedModel === '911 Carrera S') return '248 results';
    if (selectedModel === 'M5 Competition') return '412 results';
    if (selectedModel === 'Model S Plaid') return '920 results';
    if (selectedModel === 'Range Rover Sport') return '350 results';
    if (selectedModel === 'Elantra N') return '84 results';
    if (selectedModel === 'IONIQ 5 N') return '112 results';
    if (selectedModel === 'Outlander PHEV') return '210 results';
    if (selectedModel === 'Lancer Evolution X') return '65 results';
    if (selectedModel === 'Polestar 2 BST') return '45 results';
    if (selectedModel === 'Civic Type R') return '142 results';
    if (selectedModel === 'NSX Type S') return '18 results';
    if (selectedModel === 'Escalade-V') return '96 results';
    if (selectedModel === 'CT5-V Blackwing') return '54 results';
    if (selectedModel === 'Mustang Dark Horse') return '124 results';
    if (selectedModel === 'F-150 Raptor R') return '110 results';
    if (selectedModel === 'Grand Wagoneer L') return '180 results';
    if (selectedModel === 'Wrangler Rubicon 392') return '215 results';
    if (selectedModel === 'GR Corolla') return '135 results';
    if (selectedModel === 'Supra 3.0 Premium') return '98 results';
    if (selectedModel === 'Land Cruiser') return '160 results';
    return '14 results';
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vinInput.trim().length > 0) {
      onSearchVin(vinInput.trim().toUpperCase());
    }
  };

  const handleElegantSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearchExecuted(true);
    // Search for a matching model specimen inside local list of sample vehicles
    const matchedSpecimen = sampleVehicles.find(v => {
      const makeMatching = selectedMake === 'All makes' || v.make.toLowerCase() === selectedMake.toLowerCase();
      const modelMatching = selectedModel === 'All models' || v.model.toLowerCase() === selectedModel.toLowerCase();
      return makeMatching && modelMatching;
    });

    if (matchedSpecimen) {
      onSearchVin(matchedSpecimen.vin);
    } else {
      onNavigateToMarketplace();
    }
  };

  // Preset selected make & model state when clicking body silhouettes
  const handleBodyTypeClick = (type: string) => {
    if (type === 'SUVs') {
      setSelectedMake('Land Rover');
      setTimeout(() => setSelectedModel('Range Rover Sport'), 10);
    } else if (type === 'Coupes') {
      setSelectedMake('Porsche');
      setTimeout(() => setSelectedModel('911 Carrera S'), 10);
    } else if (type === 'Sedans') {
      setSelectedMake('BMW');
      setTimeout(() => setSelectedModel('M5 Competition'), 10);
    } else if (type === 'Trucks') {
      setSelectedMake('Land Rover');
      setTimeout(() => setSelectedModel('Defender 110'), 10);
    } else if (type === 'Hatchbacks') {
      setSelectedMake('Tesla');
      setTimeout(() => setSelectedModel('Model Y Performance'), 10);
    } else {
      setSelectedMake('All makes');
      setSelectedModel('All models');
    }
  };

  // Handle clicking on popular brands
  const handleBrandClick = (make: string) => {
    setSelectedMake(make);
    const consoleElem = document.getElementById('elegant-search-console');
    if (consoleElem) {
      consoleElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Categories definition
  const carCategories = [
    {
      title: 'Luxury Sports & Coupes',
      count: '12 Units',
      image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800',
      description: 'Precision engineered track weapons and grand tourers from Stuttgart and Munich.',
      tag: 'Porsche'
    },
    {
      title: 'Premium All-Terrain SUVs',
      count: '8 Units',
      image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&q=80&w=800',
      description: 'Full-cabin command vehicles incorporating permanent 4WD and luxury wood veneers.',
      tag: 'Land'
    },
    {
      title: 'Next-Generation EVs',
      count: '6 Units',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800',
      description: 'Instant torque performance platforms with direct-drive architecture and battery logs.',
      tag: 'Tesla'
    },
    {
      title: 'Exclusive Collectibles',
      count: '4 Units',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800',
      description: 'Low-chassis classic highlights and performance investments curated for compliance.',
      tag: 'Porsche'
    }
  ];

  const popularBrandsList = [
    {
      name: 'Hyundai',
      makeKey: 'Hyundai',
      logo: (
        <svg className="w-16 h-8 text-slate-800 transition-colors group-hover:text-blue-600 fill-current" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="25" rx="42" ry="21" fill="none" stroke="currentColor" strokeWidth="4" />
          <path d="M36 14.5c.3 1.5 3 16 3.5 19.5h6.5c-1-4.5-3-15-3.5-19.5h-6.5z M54.5 14.5c.3 1.5 3 16 3.5 19.5H64.5c-1-4.5-3-15-3.5-19.5H54.5z" />
          <path d="M40 24h18.5l.8 3.5H41z" />
        </svg>
      )
    },
    {
      name: 'Mitsubishi',
      makeKey: 'Mitsubishi',
      logo: (
        <svg className="w-16 h-8 text-[#E51A1A] fill-current" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,4 59,19.5 50,35 41,19.5" />
          <polygon points="50,35 32,45.5 23,30 41,19.5" />
          <polygon points="50,35 59,19.5 77,30 68,45.5" />
        </svg>
      )
    },
    {
      name: 'Polestar',
      makeKey: 'Polestar',
      logo: (
        <svg className="w-14 h-8 text-slate-950 fill-current" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
          <path d="M48,23 L32,23 L45,10 Z" />
          <path d="M52,27 L68,27 L55,40 Z" />
        </svg>
      )
    },
    {
      name: 'Honda',
      makeKey: 'Honda',
      logo: (
        <svg className="w-15 h-8 text-slate-800 transition-colors group-hover:text-red-650 fill-current" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
          <rect x="28" y="6" width="44" height="38" rx="8" fill="none" stroke="currentColor" strokeWidth="3.5" />
          <path d="M37 13.5 L42.5 13.5 L44.5 23.5 L55.5 23.5 L57.5 13.5 L63 13.5 L60.8 36.5 L55.8 36.5 L54.7 27.5 L45.3 27.5 L44.2 36.5 L39.2 36.5 Z" />
        </svg>
      )
    },
    {
      name: 'Cadillac',
      makeKey: 'Cadillac',
      logo: (
        <svg className="w-16 h-8 text-slate-900 fill-current animate-pulse-subtle" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
          <path d="M15,16 L85,16 L72,36 L50,45 L28,36 Z" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M20,21 L80,21 M23,27 L77,27 M27,33 L73,33" stroke="currentColor" strokeWidth="2.5" />
          <path d="M50,16 L50,44" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      name: 'Ford',
      makeKey: 'Ford',
      logo: (
        <svg className="w-20 h-8" viewBox="0 0 105 50" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="52.5" cy="25" rx="42" ry="21" fill="#003399" />
          <ellipse cx="52.5" cy="25" rx="39" ry="18" fill="none" stroke="#ffffff" strokeWidth="1.5" />
          <text x="52.5" y="32" fontFamily="Georgia, serif" fontSize="20" fontWeight="bold" fontStyle="italic" fill="#ffffff" textAnchor="middle" letterSpacing="-1">Ford</text>
        </svg>
      )
    },
    {
      name: 'Jeep',
      makeKey: 'Jeep',
      logo: (
        <svg className="w-16 h-8 text-slate-900 fill-current" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
          <text x="50" y="35" fontFamily="'Impact', 'Arial Black', sans-serif" fontSize="28" fontWeight="900" textAnchor="middle" letterSpacing="-0.5">Jeep</text>
        </svg>
      )
    },
    {
      name: 'Toyota',
      makeKey: 'Toyota',
      logo: (
        <svg className="w-16 h-8 text-slate-800 transition-colors group-hover:text-red-700 fill-none" viewBox="0 0 100 50" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="50" cy="25" rx="40" ry="22" stroke="currentColor" strokeWidth="4" />
          <ellipse cx="50" cy="14" rx="27" ry="8.5" stroke="currentColor" strokeWidth="3" />
          <ellipse cx="50" cy="25" rx="13" ry="21" stroke="currentColor" strokeWidth="3" />
        </svg>
      )
    }
  ];

  return (
    <div className="relative pt-0" id="landing-page-wrapper">

      {/* Main Container */}
      <div className="space-y-0 py-0 animate-in fade-in duration-500 text-black" id="landing-page-container">
        
        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/55 z-50 md:hidden"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-full w-[280px] bg-white z-50 p-8 pt-10 flex flex-col gap-8 md:hidden shadow-2xl"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-black text-lg">AUTO_VERIFY</span>
                  <button onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="w-6 h-6 text-black" />
                  </button>
                </div>
                <nav className="flex flex-col gap-5 text-sm font-bold text-black">
                  <button onClick={() => { onNavigateToMarketplace(); setIsMobileMenuOpen(false); }} className="text-left w-full hover:text-red-650">Marketplace</button>
                  <button onClick={() => { onNavigateToAdvisory(); setIsMobileMenuOpen(false); }} className="text-left w-full hover:text-red-650">Advisory</button>
                  <button onClick={() => { onNavigateToAuctions(); setIsMobileMenuOpen(false); }} className="text-left w-full hover:text-red-650">Auctions</button>
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>
 
        {/* Premium flat Hero Section styled with White, Light Slate, and Navy Blue */}
      <section className="relative min-h-[620px] w-full flex flex-col items-center justify-center rounded-none pt-28 pb-14 md:pt-36 md:pb-16 px-4 md:px-12 border-b border-slate-200/50 shadow-none overflow-visible" id="hero-section">
        
        {/* video in background of hero section with pristine low opacity */}
        <div className="absolute inset-0 z-0">
          <video
            className="w-full h-full object-cover select-none opacity-90 brightness-[0.85]"
            src="https://files.catbox.moe/grh3sr.mp4"
            autoPlay
            loop
            muted
            playsInline
            style={{ pointerEvents: 'none' }}
          />
          <div className="absolute inset-0 bg-black/50 mix-blend-normal"></div>
        </div>
        
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#8B0000_1px,transparent_1px)] [background-size:24px_24px] z-1"></div>
 
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isSplashLoading ? { opacity: 0, y: 18 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="max-w-5xl mx-auto w-full flex flex-col items-center relative z-10 space-y-8 text-center"
        >
          
          <div className="space-y-3 translate-y-16 md:translate-y-28">
            <h1 className="text-3xl sm:text-5xl md:text-[52px] md:leading-[1.1] font-black md:font-extrabold tracking-tight !text-white font-display">
              The standard of <br className="hidden md:block" />
              <span className="text-red-600">vehicle inspection.</span>
            </h1>
            
            <p className="text-white/85 text-sm md:text-base max-w-xl leading-relaxed font-semibold">
              Verify registrations, previous transfer sheets, salvage indicators, and correct OEM build configurations with high-fidelity, military-grade registry lookups.
            </p>
          </div>

          {/* Elegant Tabbed Category Row + Interactive Filter Console */}
          <div className="w-full max-w-5xl translate-y-48 md:translate-y-80 relative z-20">
            <motion.div 
              whileHover={{ 
                y: -4, 
                scale: 1.005,
              }}
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
              className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/80 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.12)] text-left transition-all duration-305"
              id="elegant-search-console"
            >
              
              {/* Scrollable Categories List */}
              <div className="flex items-center gap-5 md:gap-7 overflow-x-auto pb-3 mb-6 border-b border-slate-100 scrollbar-none">
                {categoriesList.map((cat) => {
                  const isActive = cat.toLowerCase() === activeCategory.toLowerCase();
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`relative pb-3 text-xs md:text-sm font-black tracking-wider uppercase transition-all whitespace-nowrap focus:outline-none cursor-pointer ${
                        isActive 
                          ? 'text-slate-950 font-black border-b-[3px] border-slate-950 pb-[13px] -mb-[16px] z-10' 
                          : 'text-slate-400 hover:text-slate-900 font-bold'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Selector Fields Column Row */}
              <form onSubmit={handleElegantSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                
                {/* Dropdown 1: All makes */}
                <div className="flex flex-col w-full text-left">
                  <label className="text-[10px] font-black text-slate-400/90 uppercase tracking-widest mb-1.5 ml-1 leading-none">MAKE</label>
                  <div 
                    className="relative bg-white border border-slate-200 hover:border-slate-300 rounded-xl h-11 px-4 flex items-center justify-between transition-all duration-200 shadow-xs focus-within:border-slate-400"
                  >
                    <select
                      value={selectedMake}
                      onChange={(e) => setSelectedMake(e.target.value)}
                      className="w-full bg-transparent border-none text-[12.5px] font-bold text-slate-900 appearance-none outline-none cursor-pointer pr-5"
                    >
                      {makesList.map((m) => (
                        <option className="bg-white text-slate-800" key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3.5 flex items-center text-slate-400">
                      <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Dropdown 2: All models */}
                <div className="flex flex-col w-full text-left">
                  <label className="text-[10px] font-black text-slate-400/90 uppercase tracking-widest mb-1.5 ml-1 leading-none">MODEL</label>
                  <div 
                    className="relative bg-white border border-slate-200 hover:border-slate-300 rounded-xl h-11 px-4 flex items-center justify-between transition-all duration-200 shadow-xs focus-within:border-slate-400"
                  >
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full bg-transparent border-none text-[12.5px] font-bold text-slate-900 appearance-none outline-none cursor-pointer pr-5"
                    >
                      <option className="bg-white text-slate-800" value="All models">All models</option>
                      {activeModels.filter(opt => opt !== 'All models').map((opt) => (
                        <option className="bg-white text-slate-800" key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-3.5 flex items-center text-slate-400">
                      <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Text Input 3: Postal Code */}
                <div className="flex flex-col w-full text-left">
                  <label className="text-[10px] font-black text-slate-400/90 uppercase tracking-widest mb-1.5 ml-1 leading-none">ZIP / POSTAL CODE</label>
                  <div 
                    className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl h-11 px-4 flex items-center transition-all duration-200 shadow-xs focus-within:border-slate-400"
                  >
                    <input
                      type="text"
                      placeholder="Postal code*"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value.slice(0, 10))}
                      className="w-full bg-transparent border-none text-[12.5px] font-bold text-slate-950 placeholder:text-slate-450 outline-none"
                    />
                  </div>
                </div>

                {/* Results / SEARCH Button */}
                <div className="flex items-stretch h-11">
                  <button
                    type="submit"
                    className="w-full h-11 bg-[#B30000] hover:bg-[#4A4A4A] active:scale-[0.98] text-white rounded-lg text-[12.5px] font-bold tracking-widest uppercase flex items-center justify-center cursor-pointer transition-all duration-200 shadow-sm"
                  >
                    SEARCH
                  </button>
                </div>

              </form>

            </motion.div>
          </div>

        </motion.div>
      </section>

      {/* Discover Popular Brands Section */}
      <motion.section 
        className="w-full bg-white border-b border-slate-200/60 pt-64 pb-12 md:pt-[380px] md:pb-14 overflow-hidden" 
        id="popular-brands-section"
        initial={{ opacity: 0, y: 15 }}
        whileInView={isSplashLoading ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="max-w-[1240px] mx-auto px-4 md:px-8 mb-6 text-center">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 font-display">Discover popular brands</h2>
        </div>
        
        <div className="relative w-full overflow-hidden py-4">
          {/* Edge gradient masks for seamless fade effect */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          <motion.div 
            className="flex gap-6 w-max"
            animate={{ x: [0, "-50%"] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              },
            }}
          >
            {/* Render popular brands twice for infinite seamless loop */}
            {[...popularBrandsList, ...popularBrandsList].map((brand, idx) => (
              <motion.button
                type="button"
                key={`${brand.name}-${idx}`}
                onClick={() => handleBrandClick(brand.makeKey)}
                whileHover={{ 
                  y: -12, 
                  scale: 1.06,
                  rotateY: 8,
                  rotateX: -4,
                  boxShadow: "0 22px 40px -10px rgba(0,0,0,0.12)",
                  borderColor: "rgba(220, 38, 38, 0.45)"
                }}
                transition={{ type: "spring", stiffness: 350, damping: 20 }}
                style={{ perspective: 1000, transformStyle: "preserve-3d" }}
                className="group bg-slate-50 hover:bg-white border border-slate-200/80 p-5 rounded-2xl flex flex-col items-center justify-center gap-3.5 transition-colors duration-300 cursor-pointer text-center w-[160px] shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.015)]"
              >
                <div className="h-10 flex items-center justify-center transition-transform group-hover:scale-110 duration-300 text-slate-900 group-hover:text-red-600">
                  {brand.logo}
                </div>
                <span className="text-[10px] font-extrabold text-slate-500 group-hover:text-red-650 uppercase tracking-widest mt-0.5 transition-colors">
                  {brand.name}
                </span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Vehicles Grid Section (Middle Section - In Place of Service Providers) */}
      <motion.section 
        className="w-full bg-[#f8f9fa] border-t border-b border-slate-200/60 pt-10 pb-12 md:pb-16" 
        id="featured-vehicles-section-middle"
        initial={{ opacity: 0, y: 15 }}
        whileInView={isSplashLoading ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="max-w-[1240px] mx-auto px-4 md:px-8 space-y-6">
          <div className="text-center pb-2">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={isSplashLoading ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 font-display"
            >
              Featured Inspected Vehicles
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(featuredVehicles.length > 0 ? featuredVehicles : sampleVehicles).slice(0, 6).map((car, idx) => (
              <motion.div 
                key={car.vin}
                initial={{ opacity: 0, y: 15 }}
                whileInView={isSplashLoading ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.35,
                  ease: "easeOut",
                  delay: Math.min(idx * 0.05, 0.2)
                }}
                whileHover={{ 
                  y: -14, 
                  scale: 1.025,
                  rotateX: 3,
                  rotateY: -3,
                  boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.16)",
                  borderColor: "rgba(220, 38, 38, 0.25)"
                }}
                style={{ perspective: 1200, transformStyle: "preserve-3d" }}
                className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 text-left cursor-pointer"
              >
                {/* Image Showcase Frame */}
                <div className="relative h-44 w-full bg-slate-50 shrink-0 overflow-hidden">
                  <img 
                    src={car.images[0]} 
                    alt={`${car.make} ${car.model}`} 
                    className="w-full h-full object-cover select-none transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Body Info block details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1 mb-3">
                    <h3 className="font-extrabold text-black text-[15px] tracking-tight group-hover:text-red-600 transition-colors duration-200">{car.year} {car.make} {car.model}</h3>
                    <p className="text-slate-500 text-[11px] font-medium">{car.mileage.toLocaleString()} miles • {car.location.split(',')[0]}</p>
                  </div>

                  {/* Pricing and inspection CTA trigger */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                    <span className="text-[16px] font-black text-slate-900 group-hover:text-red-750 transition-colors duration-200">
                      ${car.price.toLocaleString()}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.04, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => onSearchVin(car.vin)}
                      className="bg-[#B30000] hover:bg-[#4A4A4A] text-white px-5 py-2.5 rounded-lg text-[11.5px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-sm"
                    >
                      Inspect Report
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </motion.section>

      {/* Prime Specialist Services - Minimal Round Buttons Section */}
      <motion.section 
        className="w-full bg-slate-50 border-t border-b border-slate-200/50 py-14"
        id="home-specialist-services"
        initial={{ opacity: 0, y: 15 }}
        whileInView={isSplashLoading ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="max-w-[1240px] mx-auto px-4 md:px-8 space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={isSplashLoading ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-xl md:text-2xl font-black tracking-tight text-slate-950 font-display"
            >
              Specialist Automotive Services
            </motion.h2>
          </div>

          {/* Slider Row with Chevron navigation */}
          <div 
            className="relative w-full flex items-center group/slider pt-4"
            onMouseEnter={() => setIsServicesHovered(true)}
            onMouseLeave={() => setIsServicesHovered(false)}
          >
            
            {/* Left Scroll Button */}
            <button
              type="button"
              onClick={handleScrollLeft}
              onMouseEnter={() => setIsServicesHovered(true)}
              className="absolute left-0 z-20 w-10 h-10 -ml-2 sm:-ml-5 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 shadow-md transition-all duration-200 cursor-pointer text-slate-500 hover:text-red-650 opacity-0 group-hover/slider:opacity-100 focus:opacity-100"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Scrolling Container */}
            <div 
              ref={servicesContainerRef}
              className="w-full flex items-center gap-6 overflow-x-auto py-4 px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              onMouseEnter={() => setIsServicesHovered(true)}
              onMouseLeave={() => setIsServicesHovered(false)}
            >
              {/* Tripled list of categories to support infinite endless carousel scrolling */}
              {[...SERVICE_CATEGORIES, ...SERVICE_CATEGORIES, ...SERVICE_CATEGORIES].map((category, idx) => {
                const IconComponent = category.icon;
                return (
                  <motion.button
                    type="button"
                    key={`${category.id}-${idx}`}
                    onClick={() => onSelectService && onSelectService(category.id)}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={isSplashLoading ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10px" }}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={() => setIsServicesHovered(true)}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                      delay: Math.min((idx % 9) * 0.02, 0.15)
                    }}
                    className="group/btn flex flex-col items-center justify-start focus:outline-none w-[100px] sm:w-[120px] shrink-0 cursor-pointer"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white border border-slate-300 rounded-full flex items-center justify-center shadow-xs transition-all duration-300 group-hover/btn:bg-white group-hover/btn:border-red-650 group-hover/btn:shadow-md overflow-hidden relative">
                      {category.imageUrl ? (
                        <img 
                          src={category.imageUrl} 
                          alt={category.name} 
                          className="w-11 h-11 sm:w-14 sm:h-14 object-contain transition-transform duration-300 group-hover/btn:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-slate-600 transition-colors duration-300 group-hover/btn:text-red-600" />
                      )}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 tracking-tight text-center mt-3 leading-snug px-1 transition-colors duration-300 group-hover/btn:text-red-600 break-words w-full h-8 flex items-center justify-center">
                      {category.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Right Scroll Button */}
            <button
              type="button"
              onClick={handleScrollRight}
              onMouseEnter={() => setIsServicesHovered(true)}
              className="absolute right-0 z-20 w-10 h-10 -mr-2 sm:-mr-5 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 shadow-md transition-all duration-200 cursor-pointer text-slate-500 hover:text-red-600 opacity-0 group-hover/slider:opacity-100 focus:opacity-100"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>
        </div>
      </motion.section>

      {/* Featured Service Providers Section */}
      <motion.section 
        className="w-full bg-white border-b border-slate-200/50 py-16"
        id="home-service-providers"
        initial={{ opacity: 0, y: 15 }}
        whileInView={isSplashLoading ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="max-w-[1240px] mx-auto px-4 md:px-8 space-y-10">
          <div className="text-center pb-2">
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={isSplashLoading ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-2xl md:text-3xl font-black tracking-tight text-slate-950 font-display"
            >
              Featured Service Providers
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1100px] mx-auto">
            {SERVICE_PROVIDERS.slice(0, 3).map((provider, idx) => {
              // Map Category Name to ID so click navigates appropriately
              const getCategoryId = (categoryName: string) => {
                const matched = SERVICE_CATEGORIES.find(c => c.name === categoryName);
                return matched ? matched.id : 'detailing';
              };

              return (
                <motion.div
                  key={provider.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={isSplashLoading ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  whileHover={{ y: -4 }}
                  transition={{
                    duration: 0.35,
                    ease: "easeOut",
                    delay: idx * 0.08
                  }}
                  className="group bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow duration-200 text-left"
                >
                  {/* Image and status block */}
                  <div className="relative w-full h-44 bg-slate-200 shrink-0 overflow-hidden">
                    <img
                      src={provider.image}
                      alt={provider.name}
                      className="w-full h-full object-cover opacity-100 transition-all duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Meta info details */}
                      <div className="space-y-1.5">
                        <h3 className="font-extrabold text-slate-950 text-[16px] tracking-tight leading-snug line-clamp-1 group-hover:text-red-600 transition-colors duration-200">{provider.name}</h3>
                        <p className="text-slate-500 font-medium text-[11px] leading-relaxed block">{provider.category}</p>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold pt-1">
                          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span>{provider.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Booking action trigger */}
                    <div className="pt-4 mt-4 border-t border-slate-200/70">
                      <button
                        type="button"
                        onClick={() => onSelectService && onSelectService(getCategoryId(provider.category))}
                        className="w-full bg-[#B30000] hover:bg-[#4A4A4A] text-white py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all duration-200 active:scale-[0.98] cursor-pointer text-center"
                      >
                        Book Team
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Animated Hub Service Coverage Map Section */}
      <motion.section 
        className="w-full bg-[#f8fafc] text-slate-900 border-t border-slate-200/80 py-16 md:py-20 overflow-hidden relative" 
        id="service-coverage-map-section"
        initial={{ opacity: 0, y: 15 }}
        whileInView={isSplashLoading ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        {/* Ambient abstract background glowing light */}
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-red-100/30 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-red-200/20 rounded-full blur-[120px] pointer-events-none" />
 
        <div className="max-w-[1240px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Product Map Image (7 Columns wide) */}
            <motion.div 
              initial={{ opacity: 0, x: -15 }}
              whileInView={isSplashLoading ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden flex items-center justify-center self-start"
            >
              <img 
                src="https://files.catbox.moe/6qpwpq.jpeg" 
                alt="Global service network map" 
                referrerPolicy="no-referrer"
                className="w-full h-auto block rounded-3xl"
              />
            </motion.div>
 
            {/* Right Column: World Wide Details (5 Columns wide) */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-6 text-slate-800 text-left lg:pl-4">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={isSplashLoading ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-3"
              >
                <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 font-display leading-[1.1]">
                  Providing Services <span className="text-red-650">Worldwide</span>
                </h2>
                <p className="text-slate-600 text-sm font-medium leading-relaxed">
                  Our comprehensive, border-free automotive logistics and inspection network ensures direct transit, absolute mechanical validation, and secure title processing across multiple major trade zones.
                </p>
              </motion.div>
 
              {/* Highlighting details/features */}
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, x: 15 }}
                  whileInView={isSplashLoading ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="flex items-start gap-4 group"
                >
                  <Globe className="w-5 h-5 text-red-650 mt-0.5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">Intercontinental Shipping</h3>
                    <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                      Customs-cleared maritime sea transit and domestic car transportation connecting Europe, the Middle East, and the United States seamlessly.
                    </p>
                  </div>
                </motion.div>
 
                <motion.div 
                  initial={{ opacity: 0, x: 15 }}
                  whileInView={isSplashLoading ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
                  className="flex items-start gap-4 group"
                >
                  <ShieldCheck className="w-5 h-5 text-red-650 mt-0.5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">Universal Compliance Audits</h3>
                    <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                      Automated high-speed digital handshakes with state DMVs, NMVTIS database logs, and regional transport registries for certified title checks.
                    </p>
                  </div>
                </motion.div>
 
                <motion.div 
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={isSplashLoading ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 60, damping: 14, delay: 0.3 }}
                  className="flex items-start gap-4 group"
                >
                  <MapPin className="w-5 h-5 text-red-650 mt-0.5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">Active Border Terminals</h3>
                    <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">
                      Physical evaluation hubs operational daily in Vilnius, Rotterdam, Frankfurt, Miami, Los Angeles, and Dubai.
                    </p>
                  </div>
                </motion.div>
              </div>
 
              <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={isSplashLoading ? undefined : { opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 50, damping: 12, delay: 0.4 }}
                className="pt-2"
              >
                <div className="inline-flex flex-wrap items-center gap-5 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="text-center">
                    <span className="block text-lg font-black text-slate-900 font-display min-w-[2.5rem]">
                      <NumericTransition text={isLoading ? "15+" : `${stats.totalCountries}+`} duration={1600} />
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Countries</span>
                  </div>
                  <div className="hidden sm:block w-px h-6 bg-slate-200" />
                  <div className="text-center">
                    <span className="block text-lg font-black text-slate-900 font-display min-w-[3.2rem]">
                      <NumericTransition text={isLoading ? "250k+" : `${(stats.totalActiveVehicles / 1000).toFixed(1)}k+`} duration={1600} />
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Inspected Lots</span>
                  </div>
                  <div className="hidden sm:block w-px h-6 bg-slate-200" />
                  <div className="text-center">
                    <span className="block text-lg font-black text-slate-900 font-display min-w-[3rem]">
                      <NumericTransition text={isLoading ? "100%" : "100%"} duration={1600} />
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Clean Titles</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* How It Works (3-Step Flow) */}
      <section className="w-full bg-white text-slate-900 border-t border-slate-200 py-16 md:py-24 relative overflow-hidden" id="how-it-works-section">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-50/40 rounded-full blur-[130px] pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-4 md:px-8 relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={isSplashLoading ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 font-display"
            >
              Simple, clean steps
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={isSplashLoading ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="text-sm text-slate-500 font-medium"
            >
              Start trading, inspecting, and growing across our highly connected digital automotive network.
            </motion.p>
          </div>

          {/* 3 Step Flow Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
            
            {/* Step lines connecting them on desktop */}
            <div className="hidden md:block absolute top-[32px] left-[15%] right-[15%] h-0.5 border-dashed border-t border-red-600/40 pointer-events-none" />

            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={isSplashLoading ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
              className="flex flex-col items-center text-center space-y-4 group relative"
            >
              {/* Step indicator circle */}
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-650 flex items-center justify-center font-black shadow-sm ring-4 ring-red-100/50 transition-all duration-300 relative z-10 group-hover:scale-110 group-hover:ring-red-200/60">
                <User className="w-7 h-7" />
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-slate-950 text-white rounded-full text-[10px] font-black flex items-center justify-center border-2 border-white">
                  01
                </span>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-950 tracking-tight group-hover:text-red-650 transition-colors duration-200">
                  Create Your Profile
                </h3>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-xs mx-auto">
                  Set up your secure credentials, choose your member class, and access customized transaction modules instantly.
                </p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={isSplashLoading ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="flex flex-col items-center text-center space-y-4 group relative"
            >
              {/* Step indicator circle */}
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-650 flex items-center justify-center font-black shadow-sm ring-4 ring-red-100/50 transition-all duration-300 relative z-10 group-hover:scale-110 group-hover:ring-red-200/60">
                <Layers className="w-7 h-7" />
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-slate-950 text-white rounded-full text-[10px] font-black flex items-center justify-center border-2 border-white">
                  02
                </span>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-950 tracking-tight group-hover:text-red-650 transition-colors duration-200">
                  Connect to the Ecosystem
                </h3>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-xs mx-auto">
                  Seamlessly search verified automotive inventories, book master service and inspection teams, or check title clearances on-demand.
                </p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={isSplashLoading ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
              className="flex flex-col items-center text-center space-y-4 group relative"
            >
              {/* Step indicator circle */}
              <div className="w-16 h-16 rounded-full bg-red-50 text-red-650 flex items-center justify-center font-black shadow-sm ring-4 ring-red-100/50 transition-all duration-300 relative z-10 group-hover:scale-110 group-hover:ring-red-200/60">
                <BarChart2 className="w-7 h-7" />
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-slate-950 text-white rounded-full text-[10px] font-black flex items-center justify-center border-2 border-white">
                  03
                </span>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-950 tracking-tight group-hover:text-red-650 transition-colors duration-200">
                  Grow With the Platform
                </h3>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-xs mx-auto">
                  Unlock detailed analytics dashboards, sync wholesale lead pipelines, integrate external regulatory APIs, and expand your trading territory globally.
                </p>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      </div>

    </div>
  );
}

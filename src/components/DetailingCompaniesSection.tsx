import React, { useState, useMemo } from 'react';
import { 
  Sparkles, MapPin, Grid, Map as MapIcon, Sliders, X, Star, Calendar, 
  Phone, Clock, Search, HelpCircle, ShieldCheck, ArrowRight, Check,
  MessageSquare, Send, Zap, Trash2, Info, ChevronRight, DollarSign,
  Droplets, Award, Compass, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Data boundaries
interface DetailingPackage {
  name: string;
  price: number;
  duration: string;
  features: string[];
}

interface DetailingBusiness {
  id: string;
  name: string;
  logo: string;
  image: string;
  rating: number;
  reviewsCount: number;
  distance: number; // km
  services: string[]; // interior cleaning, ceramic coating, polishing, showroom prep, full detail packages
  vehicleSizes: string[]; // Coupe, Sedan, SUV/Crossover, Exotic/Supercar, Van/Truck
  minPrice: number;
  availability: 'open_now' | 'today' | 'this_week';
  address: string;
  phone: string;
  hours: string;
  isMobile: boolean;
  featuredTag?: string;
  packages: DetailingPackage[];
  description: string;
}

const DETAILING_BUSINESSES: DetailingBusiness[] = [
  {
    id: 'detailing-1',
    name: 'Gediminas Auto Spa & Ceramic Studio',
    logo: '💎',
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    reviewsCount: 248,
    distance: 1.4,
    services: ['ceramic coating', 'polishing', 'showroom prep', 'full detail packages'],
    vehicleSizes: ['Coupe', 'Sedan', 'SUV/Crossover', 'Exotic/Supercar'],
    minPrice: 180,
    availability: 'open_now',
    address: 'Savanorių pr. 178C, Vilnius 03150',
    phone: '+370 5 288 3333',
    hours: '08:00 - 20:00',
    isMobile: false,
    featuredTag: 'Ceramic Coating Elite',
    description: 'Vanguard paint preservation specialists. Authorized premium installers of 9H hydrophobic multi-layer ceramic armor products with active infrared curing ovens.',
    packages: [
      {
        name: 'Silver Paint Correction & Seal',
        price: 180,
        duration: '1 Day',
        features: ['Decontamination clay bar wash', 'Single-stage orbital polish', '6-month polymer seal sealant', 'Basic interior vacuum']
      },
      {
        name: 'Vanguard Ceramic Shield 9H',
        price: 490,
        duration: '2 Days',
        features: ['Full exterior paint decontamination', 'Multi-stage swirl correction', '2 Layers of premium 9H Ceramic Seal (3yrs warranty)', 'Engine bay deep steam cleanse']
      },
      {
        name: 'Showroom Concours Prep',
        price: 750,
        duration: '3 Days',
        features: ['Wet-sanding paint correction', 'Ultra-slick glass & wheel ceramic coating', 'Leather nourishment deep extract', 'Underbody anti-corrosive sealant']
      }
    ]
  },
  {
    id: 'detailing-2',
    name: 'Lithuanian Glow Lab (Mobile Detailing)',
    logo: '🚐',
    image: 'https://images.unsplash.com/photo-1520116468816-95b69f847357?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    reviewsCount: 115,
    distance: 2.3,
    services: ['interior cleaning', 'polishing', 'full detail packages'],
    vehicleSizes: ['Coupe', 'Sedan', 'SUV/Crossover', 'Van/Truck'],
    minPrice: 75,
    availability: 'today',
    address: 'Mobile Service (Serving Vilnius & suburbs)',
    phone: '+370 6 789 2211',
    hours: '07:30 - 18:30',
    isMobile: true,
    featuredTag: 'Mobile Detailing Available',
    description: 'We bring the premium auto spa straight to your driveway or commercial office garage! Fully self-contained customized rigs equipped with clean water storage & silent generators.',
    packages: [
      {
        name: 'Interior Deep Vapor Purge',
        price: 75,
        duration: '3 Hours',
        features: ['140°C pressurized antibacterial steam extract', 'Upholstery & fabric deep shampooing', 'Ozone air odor elimination treatment', 'Dust-repelling interior guard coat']
      },
      {
        name: 'Flawless Stage 1 Polish & Wax',
        price: 140,
        duration: '5 Hours',
        features: ['Foam-cannon hand wash', 'Alloy wheel iron chemical dissolve', 'Stage-1 glaze lacquer enhancement', 'Premium Brazilian Carnauba Wax coat']
      },
      {
        name: 'Full Mobile Refresh package',
        price: 220,
        duration: '7 Hours',
        features: ['Combining Deep Vapor Purge & Stage 1 Polish', 'Leather deep matte conditioner', 'Windshield rain repellent coating']
      }
    ]
  },
  {
    id: 'detailing-3',
    name: 'Senamiestis Elite Detailing Center',
    logo: '👑',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    reviewsCount: 182,
    distance: 3.5,
    services: ['interior cleaning', 'ceramic coating', 'polishing', 'showroom prep', 'full detail packages'],
    vehicleSizes: ['Coupe', 'Sedan', 'SUV/Crossover', 'Exotic/Supercar', 'Van/Truck'],
    minPrice: 120,
    availability: 'this_week',
    address: 'Užupio g. 42, Vilnius 01203',
    phone: '+370 5 244 8899',
    hours: '09:00 - 19:00',
    isMobile: false,
    featuredTag: 'Interior Obsession Specialist',
    description: 'Located in the creative heart of Vilnius. Clean, high-tech paint detailing studios combined with obsessive leather restorative carpentry specialists.',
    packages: [
      {
        name: 'Signature Interior Detailing',
        price: 120,
        duration: '4 Hours',
        features: ['Steam scrub of all plastic & wood trims', 'Hot-water extraction of floor carpets', 'Satin matte dressing (non-greasy finish)', 'HEPA allergen cabin filtration swap']
      },
      {
        name: 'Executive Polish & Glass Coat',
        price: 280,
        duration: '8 Hours',
        features: ['Two-stage mechanical wax scratch removal', 'Windshield long-term hydrophobic coating', 'Chassis high-grade polymer wipe-down', 'Alloy barrel wheel cleaning']
      },
      {
        name: 'The Collector Full Renewal',
        price: 600,
        duration: '2 Days',
        features: ['Comprehensive interior/exterior dismantle prep', '95% swirl removal paint restoration', 'Full luxury cabin leather treatment', '2-Year Ceramic Paint Lock-in defense']
      }
    ]
  },
  {
    id: 'detailing-4',
    name: 'HyperGlow Hypercar Detailing Lab',
    logo: '🏎️',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=600',
    rating: 5.0,
    reviewsCount: 54,
    distance: 4.8,
    services: ['ceramic coating', 'polishing', 'showroom prep', 'full detail packages'],
    vehicleSizes: ['Coupe', 'Sedan', 'Exotic/Supercar'],
    minPrice: 350,
    availability: 'this_week',
    address: 'Geležinio Vilko g. 101, Vilnius 08200',
    phone: '+370 5 211 4400',
    hours: '09:00 - 18:00',
    isMobile: false,
    featuredTag: 'Exotics & Supercar Specialist',
    description: 'Prestige climate-controlled restoration labs protecting low-clearance hypercars, modern supercars, and heritage collector vehicles with custom paint film shields (PPF).',
    packages: [
      {
        name: 'Track Paint Protection Film Prep',
        price: 350,
        duration: '1 Day',
        features: ['Intensive solvent-bath wax stripping', 'Precision panel edge claying', 'Isolating optical measurement wrap check', 'Infrared prep lacquer cleanse']
      },
      {
        name: 'Signature Infinite Gloss Correction',
        price: 890,
        duration: '3 Days',
        features: ['3 to 4 stages of optical paint recovery', '99% swirl, haze & hologram eradication', 'Signature Glass coat paint wrap layers', 'Wheels-off calipers deep detail & seal']
      }
    ]
  },
  {
    id: 'detailing-5',
    name: 'Baltic Steam Wash & Clean Pro',
    logo: '💨',
    image: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&q=80&w=600',
    rating: 4.6,
    reviewsCount: 98,
    distance: 5.1,
    services: ['interior cleaning', 'polishing'],
    vehicleSizes: ['Sedan', 'SUV/Crossover', 'Van/Truck'],
    minPrice: 50,
    availability: 'open_now',
    address: 'Kirtimų g. 47, Vilnius 02244',
    phone: '+370 6 111 8899',
    hours: '08:00 - 19:30',
    isMobile: true,
    featuredTag: 'Eco Steaming Specialist',
    description: 'High-power biological cleaning services utilizing state-of-the-art superheated steam tech to safely sanitise interiors without relying on heavy chemical residues.',
    packages: [
      {
        name: 'Express Anti-Allergen Interior Clean',
        price: 50,
        duration: '1.5 Hours',
        features: ['Dry vapor steam of ventilation ducts', 'Upholstery quick fiber extraction', 'Window streak-free degrease polish']
      },
      {
        name: 'Complete Interior & Exterior Steam Clean',
        price: 95,
        duration: '3 Hours',
        features: ['Eco high-pressure exterior steam wash', 'Full cabin fabric steam extract & sanitizer', 'Tire shine & composite trim protection']
      }
    ]
  }
];

export default function DetailingCompaniesSection() {
  // Navigation & Primary Layout State
  const [mapMode, setMapMode] = useState<boolean>(false);
  const [searchCity, setSearchCity] = useState<string>('Vilnius, Lithuania');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filters State
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedVehicleSizes, setSelectedVehicleSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(1000); // Max minPrice limit
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Sorting
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'reviews' | 'price_low'>('distance');

  // Interactive Package comparison webshop variables
  const [showCompareSession, setShowCompareSession] = useState<boolean>(false);
  const [compareVehicleSize, setCompareVehicleSize] = useState<string>('Sedan'); // Sedan (base), Coupe (-5%), SUV (+20%), Exotic (+45%), Van (+30%)
  const [compareServiceFilter, setCompareServiceFilter] = useState<string>('all');

  // Booking Modal State
  const [selectedShopForBooking, setSelectedShopForBooking] = useState<DetailingBusiness | null>(null);
  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState<DetailingPackage | null>(null);
  const [bookingFormData, setBookingFormData] = useState({
    name: '',
    phone: '',
    carMake: '',
    carModel: '',
    carSize: 'Sedan',
    bookingDate: '2026-06-19',
    bookingTime: '09:00',
    wantsPickUp: 'no',
    notes: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // AI Assistant state
  const [vehicleCondition, setVehicleCondition] = useState<string>('swirled');
  const [estimatedBudget, setEstimatedBudget] = useState<number>(300);
  const [aiResponse, setAiResponse] = useState<any | null>({
    explanation: "Select your vehicle's current paint / interior condition and your target budget above, or ask me any custom typing query, to calculate the perfect matched package recommendation!",
    recommendedPackages: []
  });
  const [aiChatHistory, setAiChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: "Hello! I am your AI Detailing Consultant. Tell me your vehicle's paint condition (e.g., 'swirled, dull metallic, water stains') or detail goals with budget, and I'll find the exact package matches for you."
    }
  ]);
  const [customAiInput, setCustomAiInput] = useState<string>('');
  const [aiIsTyping, setAiIsTyping] = useState<boolean>(false);

  const resetAllFilters = () => {
    setSelectedServices([]);
    setSelectedVehicleSizes([]);
    setPriceRange(1000);
    setSelectedAvailability('all');
    setMinRating(0);
    setSearchQuery('');
  };

  const handleGetCurrentLocation = () => {
    setSearchCity('Vilnius Antakalnis (Detected)');
    const notification = document.createElement('div');
    notification.className = "fixed bottom-24 left-1/2 -translate-x-1/2 z-[150] bg-red-650 text-white text-xs font-mono px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 border border-red-500 animate-bounce";
    notification.innerHTML = "🎯 GPS Verified: Correcting coordinates to Vilnius Old Town Detailing zone";
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2500);
  };

  // Filter & Logic execution
  const filteredBusinesses = useMemo(() => {
    let list = [...DETAILING_BUSINESSES];

    // Search input (Name / description)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(biz => 
        biz.name.toLowerCase().includes(q) || 
        biz.description.toLowerCase().includes(q) ||
        biz.address.toLowerCase().includes(q)
      );
    }

    // Filter by Service Types
    if (selectedServices.length > 0) {
      list = list.filter(biz => 
        selectedServices.some(svc => biz.services.includes(svc))
      );
    }

    // Filter by Vehicle size support
    if (selectedVehicleSizes.length > 0) {
      list = list.filter(biz => 
        selectedVehicleSizes.some(sz => biz.vehicleSizes.includes(sz))
      );
    }

    // Max minPrice filter
    list = list.filter(biz => biz.minPrice <= priceRange);

    // Availability
    if (selectedAvailability !== 'all') {
      list = list.filter(biz => biz.availability === selectedAvailability);
    }

    // Rating
    if (minRating > 0) {
      list = list.filter(biz => biz.rating >= minRating);
    }

    // Sort options
    if (sortBy === 'distance') {
      list.sort((a, b) => a.distance - b.distance);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews') {
      list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else if (sortBy === 'price_low') {
      list.sort((a, b) => a.minPrice - b.minPrice);
    }

    return list;
  }, [searchQuery, selectedServices, selectedVehicleSizes, priceRange, selectedAvailability, minRating, sortBy]);

  // Dynamic calculations for compare mode surcharges
  const getSurchargeRateByVehicleSize = (size: string) => {
    switch(size) {
      case 'Coupe': return 0.95; // 5% discount
      case 'SUV/Crossover': return 1.20; // 20% surcharge
      case 'Exotic/Supercar': return 1.45; // 45% surcharge
      case 'Van/Truck': return 1.30; // 30% surcharge
      default: return 1.0; // Sedan base
    }
  };

  // Get all packages flattened across all filtered shops
  const allFlattenedPackages = useMemo(() => {
    const arr: Array<{ shop: DetailingBusiness; pkg: DetailingPackage }> = [];
    DETAILING_BUSINESSES.forEach(shop => {
      shop.packages.forEach(pkg => {
        arr.push({ shop, pkg });
      });
    });

    if (compareServiceFilter !== 'all') {
      return arr.filter(item => {
        const title = item.pkg.name.toLowerCase();
        if (compareServiceFilter === 'ceramic') {
          return title.includes('ceramic') || title.includes('shield') || title.includes('coat');
        }
        if (compareServiceFilter === 'interior') {
          return title.includes('interior') || title.includes('clean') || title.includes('purge') || title.includes('shampoo');
        }
        if (compareServiceFilter === 'polish') {
          return title.includes('polish') || title.includes('correction') || title.includes('scrub');
        }
        return true;
      });
    }

    return arr;
  }, [compareServiceFilter]);

  // AI consultant recommendations generator logic
  const handleGenerateAiRecommendation = () => {
    setAiIsTyping(true);
    setTimeout(() => {
      setAiIsTyping(false);
      let explanation = "";
      let recommendations: Array<{ shopName: string; packageName: string; originalPrice: number; estPrice: number; reason: string }> = [];

      if (vehicleCondition === 'swirled') {
        explanation = `For a vehicle presenting circular micro-scratches, wash swirls, or cobweb reflection haze, we highly advise undergoing at least a single-stage machine orbital paint correction. Basic waxes only temporarily fill these imperfections; proper mechanical polishing levels the clear coat for genuine optical depth.`;
        
        // Find packages with correction / polishing within or near budget range
        DETAILING_BUSINESSES.forEach(biz => {
          biz.packages.forEach(pkg => {
            const lowerLabel = pkg.name.toLowerCase();
            if (lowerLabel.includes('polish') || lowerLabel.includes('correction')) {
              const matchedPrice = pkg.price;
              if (matchedPrice <= estimatedBudget + 100) {
                recommendations.push({
                  shopName: biz.name,
                  packageName: pkg.name,
                  originalPrice: pkg.price,
                  estPrice: Math.round(pkg.price * getSurchargeRateByVehicleSize(bookingFormData.carSize || 'Sedan')),
                  reason: `Uses precision micro-abrasives to safely shave off swirl peaks, restoring authentic gloss reflections and sealing with protective polymers.`
                });
              }
            }
          });
        });

      } else if (vehicleCondition === 'dull') {
        explanation = `Dull, oxidised paintwork requires a multi-stage clay bath to pull organic atmospheric pollutants, fallout, and tree sap before implementing a sealant. To lock in state-of-the-art hydrophobic gloss under Baltic weather, we recommend opting for modern 9H ceramic glass coatings rather than conventional carnauba waxes.`;
        
        DETAILING_BUSINESSES.forEach(biz => {
          biz.packages.forEach(pkg => {
            const lowerLabel = pkg.name.toLowerCase();
            if (lowerLabel.includes('ceramic') || lowerLabel.includes('concours') || lowerLabel.includes('shield')) {
              recommendations.push({
                shopName: biz.name,
                packageName: pkg.name,
                originalPrice: pkg.price,
                estPrice: Math.round(pkg.price * getSurchargeRateByVehicleSize(bookingFormData.carSize || 'Sedan')),
                reason: `Cures into an ultra-tough, semi-permanent glass defense guarding your paint from UV UV-exposure, road salts, and chemical bug etching.`
              });
            }
          });
        });

      } else if (vehicleCondition === 'dirty') {
        explanation = `If the cabin has gathered deep dust, sticky spills, biological pollutants, or odors, standard vacuuming isn't sufficient. Non-contact dry pressurized steam extract is highly recommended as it sanitises surfaces up to 140°C, stripping stubborn oils and killing allergen microbes in the ventilation ducts without relying on strong chemical odors.`;
        
        DETAILING_BUSINESSES.forEach(biz => {
          biz.packages.forEach(pkg => {
            const lowerLabel = pkg.name.toLowerCase();
            if (lowerLabel.includes('interior') || lowerLabel.includes('purge') || lowerLabel.includes('clean')) {
              if (pkg.price <= estimatedBudget + 50) {
                recommendations.push({
                  shopName: biz.name,
                  packageName: pkg.name,
                  originalPrice: pkg.price,
                  estPrice: Math.round(pkg.price * getSurchargeRateByVehicleSize(bookingFormData.carSize || 'Sedan')),
                  reason: `Utilizes pressurized dry vapor extraction inside seats and floor carpet piles, safely floating deep ground-in dirt and extracting musty air odors.`
                });
              }
            }
          });
        });
      } else {
        explanation = `For cars prepped for private sale or returning a leasing contract, we suggest implementing showroom preparation packages. This restores high visual 'curb appeal' across the engine bay, visual exhaust tip metal prep, wheel arches, and interior crevices, returning up to 10x the detail packages' cost back during vehicle appraisal transactions.`;
        
        DETAILING_BUSINESSES.forEach(biz => {
          biz.packages.forEach(pkg => {
            const lowerLabel = pkg.name.toLowerCase();
            if (lowerLabel.includes('concours') || lowerLabel.includes('showroom') || lowerLabel.includes('full')) {
              recommendations.push({
                shopName: biz.name,
                packageName: pkg.name,
                originalPrice: pkg.price,
                estPrice: Math.round(pkg.price * getSurchargeRateByVehicleSize(bookingFormData.carSize || 'Sedan')),
                reason: `Provides highly systematic panel cleaning, plastic composite dye hydration, metal component polishing, and structural glass coatings to pass strict lease inspections.`
              });
            }
          });
        });
      }

      setAiResponse({
        explanation,
        recommendedPackages: recommendations.slice(0, 3)
      });
    }, 1200);
  };

  // Custom AI input conversation flow
  const handleCustomAiQuery = (e: React.FormEvent) => {
    e.preventDefault();
    const query = customAiInput.trim();
    if (!query) return;

    setAiChatHistory(prev => [...prev, { sender: 'user', text: query }]);
    setCustomAiInput('');
    setAiIsTyping(true);

    setTimeout(() => {
      setAiIsTyping(false);
      const q = query.toLowerCase();
      let replyText = "";

      if (q.includes('ceramic') || q.includes('coating') || q.includes('glass')) {
        replyText = "Excellent inquiry! **Ceramic coating (9H glass technology)** is a liquid nanostructure that chemically binds to your clear coat. convencionally, a wax protects for 2 months. A certified ceramic coat like Gediminas' **Vanguard Ceramic Shield 9H** seals paint for **2 to 5 years**, creating a super-slippery surface where rain, road dirt, and bug juices wash off effortlessly. For maximum lifespan, always assure the vehicle is washed with pH-neutral shampoo and never run through automated stiff-bristle nylon car washes!";
      } else if (q.includes('interior') || q.includes('shampoo') || q.includes('steam')) {
        replyText = "For deep cabin restorations, dry pressurized steam cleansing is state-of-the-art. It operates at high heat to lift oils from steering wheels, dissolve organic spills, and fully sterilise active allergen spores in ventilation ducts. To get this, I highly recommend checking out the **Deep Vapor Purge** at Lithuanian Glow Lab (mobile rig setup) for €75, or the specialized **Signature Interior Detailing** at Senamiestis Elite Center for €120.";
      } else if (q.includes('correction') || q.includes('scratch') || q.includes('swirl')) {
        replyText = "Swirls and micro-scratches are corrected by carefully leveling the microscopic top layer of the clear coat. A **Stage 1 polish** removes about 50-70% of light surface haze. A **Stage 2 paint correction** (e.g. at Gediminas Auto Spa) aims for 85%+ removal. Deep key-scrawls or scratches that have breached the primer coat cannot be corrected and will require localized spray paint repair (which we can arrange with partner Auto Painters like Vilnius Elite Paint).";
      } else if (q.includes('budget') || q.includes('cheap') || q.includes('price')) {
        replyText = "To maintain beautiful aesthetics on a conservative budget, I suggest opting for **Baltic Steam Wash's Express Anti-Allergen Interior Clean** at €50, or booking **Lithuanian Glow Lab's mobile deep extraction** at €75. Doing localized hand-waxing on your own driveway after their visit can help you save on paint-correction labor surcharges!";
      } else {
        replyText = `Fascinating automotive goals! To accurately assist, most detailing procedures depend heavily on the vehicle's footprint size and paint material type. For instance, European soft paint (like Porsche/BMW) corrects quickly under moderate compounds, whereas Japanese coats (Toyota/Honda) are ultra-soft and susceptible to scratching, and German hard cleared coats (Audi/Mercedes) require intensive high-density pads. Tell me what car you drive and I can give specific recommendations!`;
      }

      setAiChatHistory(prev => [...prev, { sender: 'ai', text: replyText }]);
    }, 1200);
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedShopForBooking(null);
      setSelectedPackageForBooking(null);

      const alertDiv = document.createElement('div');
      alertDiv.className = "fixed bottom-10 right-10 z-[200] bg-zinc-900 border border-zinc-800 text-white text-xs font-black px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in duration-300";
      alertDiv.innerHTML = `💎 <b>Detailing Bay Booking Registered! We have allocated slot times at ${selectedShopForBooking?.name}.</b>`;
      document.body.appendChild(alertDiv);
      setTimeout(() => alertDiv.remove(), 4500);
    }, 1800);
  };

  return (
    <div className="bg-[#F5F5F7] min-h-screen text-slate-800 text-left font-sans leading-relaxed relative pb-24">
      
      {/* 1. HEADER SECTION CONTAINER */}
      <div className="bg-white border-b border-slate-200 py-8 md:py-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            
            {/* Title Block */}
            <div className="space-y-2">
              <h1 id="detailing-heading" className="text-3xl font-bold tracking-tight text-slate-900 mt-1 font-sans">
                Find Professional Car Detailing Services
              </h1>
            </div>

            {/* Map Toggle buttons */}
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

          {/* Quick Location + Keyword Search Row */}
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
              className="w-full lg:w-auto bg-white hover:bg-slate-55 text-slate-800 font-extrabold text-[11px] tracking-tight uppercase px-4 py-3 border border-slate-205 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Compass className="w-4 h-4 text-red-600" />
              <span>Use My Location</span>
            </button>

            <div className="h-5 w-[1px] bg-slate-250 hidden lg:block"></div>

            {/* Keyword Search Input */}
            <div className="relative w-full flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by center name, specialty keywords (e.g., clay, steam)..."
                className="w-full bg-white text-slate-900 text-xs font-bold rounded-xl pl-9 pr-3 py-3 border border-slate-205 focus:outline-hidden"
              />
            </div>

          </div>

        </div>
      </div>

      {/* PRIMARY COLUMN LAYOUT SPLIT */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        
        {/* Mobile Refine button */}
        <div className="flex md:hidden items-center justify-between mb-4 bg-white p-3 rounded-xl border border-slate-205">
          <span className="text-xs font-extrabold text-[#8B0000] uppercase tracking-wider font-mono">Detailing Studio Filters</span>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="bg-[#c10000] hover:bg-[#a10000] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
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

              {/* Sidebar Filter Panel Card */}
              <div className="bg-white rounded-2xl border border-slate-205 p-5 space-y-6 shadow-xs text-left">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-extrabold text-[#8B0000] text-[12px] uppercase tracking-wider flex items-center gap-1.5 font-mono">
                    <Sliders className="w-3.5 h-3.5 text-red-600" /> Filters Selection
                  </span>
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-[10px] text-red-650 hover:underline font-extrabold uppercase"
                  >
                    Clear All
                  </button>
                </div>

                {/* Service type checks */}
                <div className="space-y-2.5">
                  <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider font-mono">Specialized Services</h4>
                  <div className="space-y-2">
                    {[
                      { id: 'interior cleaning', label: 'Interior Deep Cleaning' },
                      { id: 'ceramic coating', label: 'Ceramic Coating (9H)' },
                      { id: 'polishing', label: 'Paint Correction & Polish' },
                      { id: 'showroom prep', label: 'Lease Showroom Prep' },
                      { id: 'full detail packages', label: 'Full Detail Packages' }
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
                            className="w-4 h-4 rounded-sm accent-red-600"
                          />
                          <span>{svc.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Vehicle sizes supported checks */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider font-mono">Vehicle Support</h4>
                  <div className="space-y-2">
                    {[
                      { id: 'Coupe', label: '2-Door Coupe' },
                      { id: 'Sedan', label: '4-Door Sedan / Saloon' },
                      { id: 'SUV/Crossover', label: 'SUV & Mid-size Crossover' },
                      { id: 'Exotic/Supercar', label: 'Exotic & Low-Camber Supercar' },
                      { id: 'Van/Truck', label: 'Cargo Van & Heavy Truck' }
                    ].map((sz) => {
                      const active = selectedVehicleSizes.includes(sz.id);
                      return (
                        <label key={sz.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900 select-none">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() => {
                              setSelectedVehicleSizes(prev => 
                                active ? prev.filter(item => item !== sz.id) : [...prev, sz.id]
                              );
                            }}
                            className="w-4 h-4 rounded-sm accent-red-600"
                          />
                          <span>{sz.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Price range bounds Slider */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider font-mono">Price Tier Maximum</h4>
                    <span className="text-xs font-black text-red-650">€{priceRange} max</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1000"
                    step="25"
                    value={priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className="w-full accent-red-600 cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                    <span>€50 Entry</span>
                    <span>€1,000 High-End</span>
                  </div>
                </div>

                {/* Availability checks */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider font-mono">Bay Availability</h4>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { id: 'all', name: 'Show All Centers' },
                      { id: 'open_now', name: 'Open Now' },
                      { id: 'today', name: 'Fitting Slots Today' },
                      { id: 'this_week', name: 'Booking Slots This Week' }
                    ].map((avail) => (
                      <label key={avail.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="avail_detailing"
                          checked={selectedAvailability === avail.id}
                          onChange={() => setSelectedAvailability(avail.id)}
                          className="w-4 h-4 accent-red-600"
                        />
                        <span>{avail.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating filter options */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100">
                  <h4 className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider font-mono">Minimum rating</h4>
                  <div className="flex flex-col gap-1.5">
                    {[
                      { id: 0, label: 'All service ratings' },
                      { id: 4.7, label: '4.7+ Elite Studios ⭐' },
                      { id: 4.9, label: '4.9+ Master Craft Studios ⭐' }
                    ].map((item) => (
                      <label key={item.id} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="detailing_rating"
                          checked={minRating === item.id}
                          onChange={() => setMinRating(item.id)}
                          className="w-4 h-4 accent-red-600"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* MAIN COLUMN GRID */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Top Sort controller row with indicators */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-2xs">
              <div>
                <span className="font-extrabold text-slate-900 text-xs">Showing {filteredBusinesses.length} verified detailing garages near {searchCity}</span>
              </div>

              <div className="flex items-center gap-2 font-sans">
                <span className="text-xs text-slate-400 font-bold uppercase font-mono tracking-wider shrink-0">Sort listings</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-205 text-slate-800 text-xs font-bold rounded-lg px-2.5 py-1.5 cursor-pointer focus:outline-hidden"
                >
                  <option value="distance">Distance (Nearest First)</option>
                  <option value="rating">Rating (Perfect First)</option>
                  <option value="reviews">Reviews Volume</option>
                  <option value="price_low">Base Price (Lowest First)</option>
                </select>
              </div>
            </div>

            {!mapMode ? (
              
              /* GRID OF CARS LISTINGS */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence mode="popLayout">
                  {filteredBusinesses.map((biz) => (
                    <motion.div
                      layout
                      key={biz.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="bg-[#FFFFFF] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col justify-between border border-slate-100"
                    >
                      <div className="cursor-pointer" onClick={() => {
                        setSelectedShopForBooking(biz);
                        setSelectedPackageForBooking(biz.packages[0]);
                      }}>
                        {/* Polished flat rectangular showcase image block on top — completely clean */}
                        <div className="w-full h-40 overflow-hidden relative">
                          <img
                            src={biz.image}
                            alt={biz.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        {/* Typography Block */}
                        <div className="p-4 space-y-2">
                          <div className="flex justify-between items-start gap-1">
                            <h3 className="font-sans font-bold text-slate-900 text-sm tracking-tight leading-tight line-clamp-2">
                              {biz.name}
                            </h3>
                            <div className="text-amber-500 font-bold text-xs shrink-0 flex items-center gap-0.5">
                              ★ <span className="text-slate-800 font-medium text-[10px]">{biz.rating}</span>
                            </div>
                          </div>

                          {/* Core Sub-text Details - Only simple clean text metadata lines below header */}
                          <div className="space-y-1 text-[11px] text-slate-500 font-normal">
                            <div className="line-clamp-1">{biz.address}</div>
                            <div>Hours: {biz.hours || "08:00 - 18:00"}</div>
                          </div>
                        </div>
                      </div>

                      {/* Footer: Base Cost + Unified CTA Button */}
                      <div className="p-4 pt-0 mt-auto flex items-center justify-between">
                        <div className="text-sm font-extrabold text-[#8B0000] font-mono">
                          €{biz.minPrice}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedShopForBooking(biz);
                            setSelectedPackageForBooking(biz.packages[0]);
                          }}
                          className="bg-[#8B0000] text-white font-bold text-[10px] px-3.5 py-2 rounded-[6px] shadow-[0_4px_6px_-1px_rgba(153,0,0,0.3),inset_0_-1px_0_rgba(0,0,0,0.15)] hover:bg-[#4A4A4A] transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer uppercase tracking-wider"
                        >
                          Book Now
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {filteredBusinesses.length === 0 && (
                  <div className="col-span-1 md:col-span-2 py-16 text-center space-y-3 bg-white border border-slate-200 rounded-3xl">
                    <HelpCircle className="w-8 h-8 text-slate-350 mx-auto" />
                    <h4 className="font-extrabold text-slate-900 text-sm">No specialized detailing businesses match these filters</h4>
                    <p className="text-slate-400 text-xs max-w-sm mx-auto">Try widening your price range threshold or clearing selective service tags to discover neighboring studios.</p>
                    <button onClick={resetAllFilters} className="text-xs text-red-650 font-bold underline">Reset Search Console</button>
                  </div>
                )}
              </div>

            ) : (

              /* INTERACTIVE MAP COMPONENT SIMULATION */
              <div className="bg-zinc-900 rounded-3xl h-[480px] relative overflow-hidden border border-zinc-800 shadow-xl">
                
                {/* Streets visualization grid details */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff_2px,transparent_1px)] [background-size:24px_24px] bg-zinc-950">
                  <div className="absolute inset-x-0 top-1/4 h-[1px] bg-slate-800"></div>
                  <div className="absolute inset-x-0 top-3/4 h-[1px] bg-slate-800"></div>
                  <div className="absolute inset-y-0 left-1/3 w-[1px] bg-slate-800"></div>
                  <div className="absolute inset-y-0 left-2/3 w-[1px] bg-slate-800"></div>
                </div>

                {/* Simulated markers with hover cards */}
                {filteredBusinesses.map((biz, i) => (
                  <div
                    key={biz.id}
                    style={{
                      position: 'absolute',
                      top: `${30 + (i * 15) % 55}%`,
                      left: `${20 + (i * 18) % 65}%`
                    }}
                    className="relative group cursor-pointer z-35"
                  >
                    
                    {/* Pulsing Beacon pin */}
                    <div className="w-10 h-10 bg-white rounded-full border-2 border-red-600 shadow-lg flex items-center justify-center relative active:scale-95 transition-transform">
                      <span className="text-base leading-none">{biz.logo}</span>
                      <span className="absolute -inset-0.5 rounded-full bg-red-600 animate-ping opacity-25"></span>
                    </div>

                    {/* Popover display of shop */}
                    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-52 bg-white rounded-2xl p-3 border border-slate-205 shadow-xl scale-0 group-hover:scale-100 origin-bottom transition-all pointer-events-none z-50">
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] font-mono font-bold text-red-650 uppercase">
                        <Sparkles className="w-3 h-3" />
                        <span>Detailing Center</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs leading-tight truncate">{biz.name}</h4>
                      <p className="text-[10px] text-slate-500 font-semibold mb-1.5">📍 {biz.distance} km | Starting €{biz.minPrice}</p>
                      <div className="flex items-center gap-0.5 text-xs font-bold text-amber-700">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{biz.rating} ({biz.reviewsCount} votes)</span>
                      </div>
                    </div>

                  </div>
                ))}

                {/* Map interface overlay controls */}
                <div className="absolute top-4 left-4 bg-zinc-950/80 border border-zinc-800 backdrop-blur-md text-white rounded-2xl px-3.5 py-2 text-[10px] font-mono tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                  <span>{filteredBusinesses.length} DETAILING HOTSPOTS ACTIVE</span>
                </div>

                <div className="absolute bottom-4 right-4 bg-zinc-950/80 border border-zinc-800 backdrop-blur-md rounded-2xl p-3 flex flex-col gap-1.5">
                  <div className="text-white text-[10px] font-mono uppercase tracking-wider block text-left">Map Scale</div>
                  <div className="h-1.5 w-24 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 w-1/2"></div>
                  </div>
                  <span className="text-[9px] text-zinc-400 text-left">1 unit : 500 Meters</span>
                </div>

              </div>

            )}

            {/* 3. DYNAMIC COMPARISON CONSOLE (MID PAGE WEB-SHOP CTA) */}
            <div className="bg-red-50/50 border border-red-150 rounded-3xl p-6 md:p-8 space-y-6">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1 text-left">
                  <span className="bg-red-100 text-red-850 font-mono font-extrabold text-[9px] tracking-wider px-2.5 py-0.5 rounded-full uppercase">Interactive Mini-Webshop</span>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Compare Detailing Packages Near You</h3>
                  <p className="text-xs text-slate-500 max-w-xl">
                    View precise, transparent side-by-side pricing matrices. Select your specific chassis category dynamically to factor accurate paint surface weight surcharges immediately.
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowCompareSession(prev => !prev)}
                  className="bg-[#c10000] hover:bg-[#a10000] text-white px-5 py-3 rounded-xl text-xs font-black tracking-wider transition-all active:scale-[0.98] uppercase font-mono shadow-xs cursor-pointer flex items-center gap-2"
                >
                  <span>{showCompareSession ? "Close Comparison Sheet" : "Launch Compare Console"}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Expandable Comparison grid web shop */}
              {showCompareSession && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-4 border-t border-red-100 space-y-6 overflow-hidden"
                >
                  
                  {/* Controls matrix */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Vehicle select modifier */}
                    <div className="text-left space-y-1.5">
                      <label className="text-[10px] text-slate-450 uppercase font-black tracking-wider">Your Vehicle Size / Category (Adjusts Price)</label>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                        {[
                          { id: 'Coupe', label: 'Coupe (-5%)' },
                          { id: 'Sedan', label: 'Sedan (Base)' },
                          { id: 'SUV/Crossover', label: 'SUV (+20%)' },
                          { id: 'Exotic/Supercar', label: 'Exotic (+45%)' },
                          { id: 'Van/Truck', label: 'Van (+30%)' }
                        ].map((v) => (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setCompareVehicleSize(v.id)}
                            className={`px-1.5 py-2 border rounded-lg text-[9px] font-mono uppercase font-extrabold transition-all text-center cursor-pointer ${
                              compareVehicleSize === v.id
                                ? 'bg-red-650 text-white border-red-600 shadow-3xs'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {v.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Service Category filters */}
                    <div className="text-left space-y-1.5">
                      <label className="text-[10px] text-slate-450 uppercase font-black tracking-wider">Focus Technique</label>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { id: 'all', label: 'All Packages' },
                          { id: 'interior', label: 'Interior Only' },
                          { id: 'polish', label: 'Paint Polish' },
                          { id: 'ceramic', label: 'Ceramic Shield' }
                        ].map((svc) => (
                          <button
                            key={svc.id}
                            type="button"
                            onClick={() => setCompareServiceFilter(svc.id)}
                            className={`px-3 py-2 border rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                              compareServiceFilter === svc.id
                                ? 'bg-[#c10000] text-white border-red-600 shadow-3xs'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {svc.label}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Pricing Matrix dynamic tables */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {allFlattenedPackages.slice(0, 6).map((item, idx) => {
                      const basePrice = item.pkg.price;
                      const sizeRate = getSurchargeRateByVehicleSize(compareVehicleSize);
                      const finalPrice = Math.round(basePrice * sizeRate);
                      return (
                        <div 
                          key={`${item.shop.id}-pkg-${idx}`}
                          className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between text-left space-y-4 hover:border-red-200 hover:shadow-xs transition-all relative"
                        >
                          {/* Top row */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                                {item.shop.logo} {item.shop.name.split(' ')[0]}
                              </span>
                              <span className="text-[9px] font-mono text-slate-400 font-bold uppercase flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{item.pkg.duration}</span>
                              </span>
                            </div>

                            <h4 className="font-extrabold text-[#8B0000] text-sm leading-tight tracking-tight min-h-10">
                              {item.pkg.name}
                            </h4>

                            <ul className="space-y-1.5 pt-2">
                              {item.pkg.features.slice(0, 3).map((f, fIdx) => (
                                <li key={fIdx} className="text-[10px] text-slate-500 font-semibold flex items-start gap-1">
                                  <Check className="w-3 h-3 text-red-650 shrink-0 mt-0.5" />
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Price details bottom */}
                          <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                            <div>
                              {compareVehicleSize !== 'Sedan' && (
                                <span className="text-[8px] font-mono text-slate-400 font-bold block line-through leading-none">
                                  €{item.pkg.price} Base rate
                                </span>
                              )}
                              <span className="text-base font-black text-red-650">€{finalPrice}</span>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedShopForBooking(item.shop);
                                setSelectedPackageForBooking(item.pkg);
                                setBookingFormData(prev => ({
                                  ...prev,
                                  carSize: compareVehicleSize
                                }));
                              }}
                              className="bg-[#c10000] hover:bg-[#a10000] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all active:scale-95 uppercase tracking-wider font-mono cursor-pointer"
                            >
                              Select Package
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {allFlattenedPackages.length === 0 && (
                      <div className="col-span-3 py-10 text-center bg-white border border-slate-200 rounded-2xl text-slate-400 text-xs font-semibold">
                        No individual packages matching focus technique filter criteria. Try showing All Packages.
                      </div>
                    )}
                  </div>

                </motion.div>
              )}

            </div>

            {/* 4. AI CONSULTANT ASSISTANT PANEL */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-100 text-red-750 rounded-2xl shrink-0">
                  <Sparkles className="w-6 h-6 animate-spin-slow" />
                </div>
                <div className="space-y-1 text-left">
                  <span className="text-[9px] bg-[#c10000] text-white font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">Expert Recommendation Engine</span>
                  <h3 className="text-lg font-black text-[#8B0000]">Ask AI Detailing Assistant</h3>
                  <p className="text-slate-500 text-xs max-w-xl">
                    Get precise recommendation packages based on your automobile paint condition and target budget parameters inside our live Lithuanian automotive services network.
                  </p>
                </div>
              </div>

              {/* Double pane layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                
                {/* Form parameters */}
                <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                  
                  <div className="text-left space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-extrabold uppercase block font-mono">1. Vehicle Paint / Seat Condition</label>
                    <select
                      value={vehicleCondition}
                      onChange={(e) => setVehicleCondition(e.target.value)}
                      className="w-full bg-white border border-slate-205 text-slate-800 text-xs font-bold rounded-lg px-2.5 py-2 cursor-pointer focus:outline-hidden"
                    >
                      <option value="swirled">Hazy Reflection (Micro-scratches & Swirls)</option>
                      <option value="dull">Dull & Rough Paint (Dull oxidized layer)</option>
                      <option value="dirty">Foul odor & Dirty seats (Need deep extraction)</option>
                      <option value="selling">Curb appeal prep (Preparing to sell the vehicle)</option>
                    </select>
                  </div>

                  <div className="text-left space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] text-slate-400 font-extrabold uppercase font-mono">2. Max Comfort Budget</label>
                      <span className="text-xs font-bold text-slate-800">€{estimatedBudget} EUR</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="1000"
                      step="50"
                      value={estimatedBudget}
                      onChange={(e) => setEstimatedBudget(parseInt(e.target.value))}
                      className="w-full accent-[#c10000] cursor-pointer"
                    />
                    <div className="flex justify-between text-[8px] text-slate-400 font-mono">
                      <span>MIN: €50</span>
                      <span>MAX: €1000</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateAiRecommendation}
                    className="w-full bg-[#c10000] hover:bg-[#a10000] text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider font-mono shadow-3xs active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Compile AI Diagnostics</span>
                  </button>

                  {/* AI Quick Query tips */}
                  <div className="pt-2">
                    <div className="text-[9px] text-slate-405 font-black uppercase tracking-wider mb-1.5 font-mono text-left">Quick topics</div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "How long does 9H ceramic last?",
                        "Best mobile cleaning on a budget",
                        "How to correct automatic wash swirls"
                      ].map((txt) => (
                        <button
                          key={txt}
                          type="button"
                          onClick={() => {
                            setCustomAiInput(txt);
                            handleSendAiMessageFromButton(txt);
                          }}
                          className="bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-1 rounded-md transition-all cursor-pointer"
                        >
                          {txt}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* AI Interactive Dialogue log & result pane */}
                <div className="lg:col-span-7 border border-slate-205 rounded-2xl flex flex-col justify-between overflow-hidden relative min-h-[300px]">
                  
                  {/* Top dialog state flag */}
                  <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between text-left">
                    <span className="text-[9px] font-mono tracking-wider font-extrabold text-slate-400 uppercase">Consulting Desk</span>
                    <div className="flex items-center gap-1.5 text-[9px] text-red-600 font-bold bg-red-50 border border-red-100/55 px-2 py-0.5 rounded-full">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                      <span>Live expert bot</span>
                    </div>
                  </div>

                  {/* Chat logs / Output display */}
                  <div className="p-4 flex-1 overflow-y-auto space-y-4 max-h-72">
                    {/* If we have direct compile recommendation trigger display */}
                    {aiResponse ? (
                      <div className="space-y-4">
                        <div className="bg-red-50/70 border border-red-100 text-red-950 p-4 rounded-xl text-xs space-y-2 text-left leading-relaxed">
                          <p className="font-extrabold text-red-800 uppercase text-[10px] tracking-wider font-mono flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" /> Diagnostic explanation
                          </p>
                          <p className="font-semibold">{aiResponse.explanation}</p>
                        </div>

                        {/* Recommendation listing */}
                        {aiResponse.recommendedPackages.length > 0 && (
                          <div className="space-y-2.5">
                            <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider font-mono text-left">Matched Packages:</div>
                            {aiResponse.recommendedPackages.map((rec: any, idx: number) => (
                              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-3 flex  items-center justify-between gap-3 text-xs text-left">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-extrabold text-slate-900">{rec.shopName}</span>
                                    <span className="bg-red-50 text-red-700 text-[8px] px-1.5 py-0.5 rounded font-black font-mono leading-none tracking-wider uppercase">9H Shield</span>
                                  </div>
                                  <p className="font-bold text-[#8B0000] text-[11px]">{rec.packageName}</p>
                                  <p className="text-[10px] text-slate-405 leading-normal font-medium">{rec.reason}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase leading-none">Est</span>
                                  <span className="text-sm font-black text-red-650">€{rec.estPrice}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : null}

                    {/* Chat logs */}
                    {aiChatHistory.map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-2xl max-w-sm text-xs text-left leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-red-600 text-white rounded-tr-none font-bold'
                            : 'bg-slate-100 text-slate-800 rounded-tl-none font-semibold'
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}

                    {aiIsTyping && (
                      <div className="flex justify-start">
                        <div className="bg-slate-105 px-3 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-150"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce delay-300"></span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleCustomAiQuery} className="border-t border-slate-200 bg-white p-2.5 flex items-center gap-2">
                    <input
                      type="text"
                      value={customAiInput}
                      onChange={(e) => setCustomAiInput(e.target.value)}
                      placeholder="Type custom detailing query (e.g. ceramic vs wax)..."
                      className="flex-1 bg-slate-50 border border-slate-205 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-hidden"
                    />
                    <button
                      type="submit"
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>

                </div>

              </div>

            </div>

          </div>

        </div>
      </div>

      {/* 5. BOOKING & RESERVATION SLIDE-OVER / DYNAMIC MODAL */}
      {selectedShopForBooking && (
        <div className="fixed inset-0 z-105 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-md border border-slate-200 shadow-2xl overflow-hidden relative text-left"
          >
            {/* Modal Ribbon header */}
            <div className="bg-[#c10000] px-6 py-4 flex items-center justify-between text-white">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider block opacity-85">Reserve Detailing Bay</span>
                <h3 className="font-extrabold text-sm">{selectedShopForBooking.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedShopForBooking(null);
                  setSelectedPackageForBooking(null);
                }}
                className="text-white hover:text-red-100 cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            {bookingSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-600 text-2xl">
                  ✓
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-base">Booking Request Submitted!</h4>
                  <p className="text-slate-500 text-xs max-w-xs mx-auto leading-relaxed">
                    The detailing workshop has earmark-reserved the selected compounds and booked a bay slot on your chosen calendar dates.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 text-[11px] font-mono font-bold text-slate-500 max-w-xs mx-auto">
                  TICKET ID: DET-{Math.floor(1000 + Math.random() * 9000)}-LT
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmReservation} className="p-6 space-y-4">
                
                {/* Select Package custom tier */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] text-slate-450 uppercase font-black tracking-wider block font-mono">Select Active Package</label>
                  <select
                    value={selectedPackageForBooking?.name || selectedShopForBooking.packages[0].name}
                    onChange={(e) => {
                      const matched = selectedShopForBooking.packages.find(p => p.name === e.target.value);
                      if (matched) setSelectedPackageForBooking(matched);
                    }}
                    className="w-full bg-slate-50 border border-slate-205 text-slate-900 text-xs font-bold rounded-lg px-2 py-2 cursor-pointer focus:outline-hidden"
                  >
                    {selectedShopForBooking.packages.map((p) => (
                      <option key={p.name} value={p.name}>{p.name} - €{p.price}</option>
                    ))}
                  </select>
                </div>

                {/* Grid Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Your Name*</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tomas G."
                      value={bookingFormData.name}
                      onChange={(e) => setBookingFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-205 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Phone Number*</label>
                    <input
                      type="tel"
                      required
                      placeholder="+370 ..."
                      value={bookingFormData.phone}
                      onChange={(e) => setBookingFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-205 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Car Make*</label>
                    <input
                      type="text"
                      required
                      placeholder="Audi, Tesla, BMW..."
                      value={bookingFormData.carMake}
                      onChange={(e) => setBookingFormData(prev => ({ ...prev, carMake: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-205 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Car Model*</label>
                    <input
                      type="text"
                      required
                      placeholder="Model 3, A6, 330i..."
                      value={bookingFormData.carModel}
                      onChange={(e) => setBookingFormData(prev => ({ ...prev, carModel: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-205 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Desired Date</label>
                    <input
                      type="date"
                      value={bookingFormData.bookingDate}
                      onChange={(e) => setBookingFormData(prev => ({ ...prev, bookingDate: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-205 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 cursor-pointer"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Desired Time</label>
                    <input
                      type="time"
                      value={bookingFormData.bookingTime}
                      onChange={(e) => setBookingFormData(prev => ({ ...prev, bookingTime: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-205 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Pick up logic */}
                <div className="space-y-1 text-left">
                  <label className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Include Concierge Vehicle Valet Pickup?</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                      <input
                        type="radio"
                        name="valet_cleanup"
                        value="yes"
                        checked={bookingFormData.wantsPickUp === 'yes'}
                        onChange={() => setBookingFormData(prev => ({ ...prev, wantsPickUp: 'yes' }))}
                        className="accent-red-650"
                      />
                      <span>Yes (+€35 service)</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                      <input
                        type="radio"
                        name="valet_cleanup"
                        value="no"
                        checked={bookingFormData.wantsPickUp === 'no'}
                        onChange={() => setBookingFormData(prev => ({ ...prev, wantsPickUp: 'no' }))}
                        className="accent-red-650"
                      />
                      <span>No (Client dropoff)</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Special instructions</label>
                  <textarea
                    placeholder="Describe custom spot cleaning or leather concerns..."
                    value={bookingFormData.notes}
                    onChange={(e) => setBookingFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-205 rounded-lg p-2 text-xs text-slate-800 h-16 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-mono uppercase tracking-wider text-xs font-black py-3 rounded-xl transition-all active:scale-[0.98] shadow-3xs cursor-pointer text-center"
                >
                  Confirm Reservation &amp; LOCK €{selectedPackageForBooking ? Math.round(selectedPackageForBooking.price * getSurchargeRateByVehicleSize(bookingFormData.carSize)) : selectedShopForBooking.minPrice}
                </button>

              </form>
            )}

          </motion.div>
        </div>
      )}

    </div>
  );

  // Helper trigger action
  function handleSendAiMessageFromButton(txt: string) {
    setAiChatHistory(prev => [...prev, { sender: 'user', text: txt }]);
    setAiIsTyping(true);
    setTimeout(() => {
      setAiIsTyping(false);
      let reply = "";
      if (txt.includes('ceramic')) {
        reply = "A **9H Quartz hydrophobic ceramic coat** creates a hard semi-permanent layer of silicone dioxide that rejects acids, road chemical grime, and water. Unlike organic plant waxes which decompose in high summer heat or winter salt washes, a professional ceramic coat can last **up to 5 years** if regularly wash-maintained. We recommend Gediminas Auto Spa's expert premium packages!";
      } else if (txt.includes('budget')) {
        reply = "For quick, budget-friendly mobile results, **Baltic Steam Wash's Express Anti-Allergen Interior Clean** is excellent at €50. You can also view **Lithuanian Glow Lab's Mobile Purge** which shampoo-cleanses floor carpet beds for €75 directly in your driveway.";
      } else {
        reply = "Automatic spinning-brush washes act like high-speed grit paper, physically scouring micro-swirls directly into the clear coat's top surface. To correct this, a **Stage 1 or Stage 2 paint correction** (utilizing dual-action random orbital foam pad polishers) is required. This safely removes top-layer imperfections to recover outstanding depth of gloss.";
      }
      setAiChatHistory(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 1200);
  }
}

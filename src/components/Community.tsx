import React, { useState, useMemo } from 'react';
import { 
  Newspaper, Users, MessageSquare, ThumbsUp, Send, CheckCircle, 
  Flame, Award, ShieldAlert, Sparkles, AlertTriangle, Eye, HelpCircle, 
  Search, Bookmark, TrendingUp, Filter, Bell, Plus, Star, Check, Globe, 
  ChevronRight, ArrowUpRight, Scale, Info, RefreshCw, Layers, ShieldCheck, 
  BookmarkCheck, PlusCircle, Trash2, Heart, Car
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VEHICLES } from '../data';
import { Vehicle } from '../types';

// Structured types for News & Insights Platform
interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'market-trends' | 'recalls' | 'regulations' | 'brand-news';
  brand?: string; // e.g. "Porsche", "Tesla", "BMW", "Toyota", "Audi"
  author: string;
  role: string;
  avatar: string;
  date: string;
  readTime: string;
  upvotes: number;
  commentsCount: number;
  featured?: boolean;
}

interface RecallCampaign {
  id: string;
  brand: string;
  modelPattern: string; // e.g. "911", "Model 3", "3-Series", "RAV4", "RS6"
  campaignNumber: string;
  releaseDate: string;
  severity: 'Critical' | 'Moderate' | 'General';
  defectSummary: string;
  remedyAction: string;
}

// Initial Mock Recall Campaigns tied to the vehicles of the platform
const PRESET_RECALL_CAMPAIGNS: RecallCampaign[] = [
  {
    id: 'rec-1',
    brand: 'Porsche',
    modelPattern: '911',
    campaignNumber: 'NHTSA-26V-104',
    releaseDate: 'May 12, 2026',
    severity: 'Critical',
    defectSummary: 'Chassis suspension front stabilizer joint failure during high vertical loads. Under extreme driving conditions, the joint can crack, resulting in sudden vehicle instability.',
    remedyAction: 'Dealers will inspect the front suspension assembly and replace both left/right stabilizer joint connections with hardened steel variants free of charge.'
  },
  {
    id: 'rec-2',
    brand: 'Tesla',
    modelPattern: 'Model 3',
    campaignNumber: 'NHTSA-26V-312',
    releaseDate: 'April 02, 2026',
    severity: 'Moderate',
    defectSummary: 'Rear backup supplementary camera optical stream lags on the main display when shifting into Reverse. Frame latency exceeds European Safety Directive ISO-26262 limits.',
    remedyAction: 'Tesla has released an over-the-air (OTA) software update (v2026.14.2 or higher) resolving central processor camera priority allocations.'
  },
  {
    id: 'rec-3',
    brand: 'Audi',
    modelPattern: 'RS6',
    campaignNumber: 'EU-REC-9014',
    releaseDate: 'March 18, 2026',
    severity: 'Critical',
    defectSummary: 'Auxiliary electric coolant pump motor circuit board moisture leakage. Water entry can trigger an electrical short circuit with minor localized combustion hazard.',
    remedyAction: 'Audi retailers will bypass the auxiliary pump circuit, measure wire insulation, and install a pressure-vented waterproof replacement valve.'
  },
  {
    id: 'rec-4',
    brand: 'Toyota',
    modelPattern: 'RAV4',
    campaignNumber: 'NHTSA-26V-089',
    releaseDate: 'June 10, 2026',
    severity: 'Critical',
    defectSummary: 'High-voltage auxiliary power battery cable connector seal rubber degradation beneath the rear chassis frame (Cablegate). Exposure to road salt during winter breeds severe oxidation.',
    remedyAction: 'Authorized Toyota Hubs will inspect the electrical resistance of the orange cable shroud and mount a redesigned composite waterproof shield structure.'
  },
  {
    id: 'rec-5',
    brand: 'BMW',
    modelPattern: '3-Series',
    campaignNumber: 'NHTSA-25V-789',
    releaseDate: 'October 24, 2025',
    severity: 'General',
    defectSummary: 'Exhaust gas recirculation (EGR) valve cooling bypass carbon buildup. Intake system might experience power loss accompanied by engine warning lights.',
    remedyAction: 'BMW will perform a dynamic flow test on the intake manifold and clean the core valve blocks. Warranty coverage is extended to 10 years.'
  },
  {
    id: 'rec-6',
    brand: 'Volkswagen',
    modelPattern: 'Golf',
    campaignNumber: 'EU-REC-8711',
    releaseDate: 'February 15, 2026',
    severity: 'Moderate',
    defectSummary: 'Digital virtual cockpit software screen flickering or temporary power state reset during active driving, blocking speedometer displays.',
    remedyAction: 'Update regional control node software using professional dealership computer linkage terminal.'
  }
];

// Rich Database of Industry News, Market Reports & Manufacturer Announcements
const INITIAL_ARTICLES: NewsArticle[] = [
  {
    id: 'art-1',
    title: 'Porsche Unveils Facelifted 992.2 Carrera Specifications & Hybrid Systems',
    excerpt: 'Deep dive into the Stuttgart design lab as motorsport engineering merges with modern low-voltage hybrid kinetic setups.',
    content: 'The legendary 911 undergoes its most controversial update yet: introducing the T-Hybrid powertrain. Combining an integrated electric motor inside the 8-speed PDK transmission with an electrically powered turbocharger, the 3.6L flat-six engine delivers a combined 541 horsepower. Engineers have successfully limited the weight penalty to barely 50 kilograms, ensuring the hallmark chassis agility remains completely uncompromised. Deliveries are slated for early autumn with pricing parameters starting on the high end of premium budgets.',
    category: 'brand-news',
    brand: 'Porsche',
    author: 'Elena Rostova',
    role: 'Premium Brand Analyst',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    date: 'June 15, 2026',
    readTime: '4 min read',
    upvotes: 114,
    commentsCount: 38,
    featured: true
  },
  {
    id: 'art-2',
    title: 'Used EV Residual Pricing Reaches Key Stability Threshold Across Europe',
    excerpt: 'Market report indicates the dramatic second-hand premium electric vehicle price depreciation spiral has finally flattened.',
    content: 'A comprehensive study of second-hand listings in German, Lithuanian, and Polish registry portals highlights that pure EV valuations have stabilized. Following two years of severe residual decay, average pricing for models like the Model 3, ID.4, and e-Tron has found an equilibrium point. Improved state-backed diagnostic test confidence regarding battery health metrics (SOH) has emboldened retail buyers who previously hesitated due to battery degradation anxieties. Average time-on-market metrics have plummeted by 18 days.',
    category: 'market-trends',
    brand: 'Tesla',
    author: 'Marcus Vance',
    role: 'Chief Automotive Economist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    date: 'June 12, 2026',
    readTime: '6 min read',
    upvotes: 94,
    commentsCount: 19
  },
  {
    id: 'art-3',
    title: 'Toyota Investigates RAV4 High-Voltage Harness Connectors Under Winter Exposure',
    excerpt: 'The technical group addresses moisture and salt oxidation inside the orange direct current traction cable joints.',
    content: 'Sovereign consumer safety authorities have registered investigations regarding high-voltage chassis connections inside modern All-Wheel Drive hybrid hatchbacks. In colder target environments where de-icing chemical salts are distributed liberally, the composite rubber seal blocks can degrade. Under-body road spray directly contacts wire strands, precipitating insulation drops that trigger warning lights or safety power curtailment. In response, special diagnostic guidelines have been issued to state testing authorities.',
    category: 'recalls',
    brand: 'Toyota',
    author: 'Aiden Cooper',
    role: 'Safety & Compliance Counsel',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    date: 'May 28, 2026',
    readTime: '5 min read',
    upvotes: 132,
    commentsCount: 42
  },
  {
    id: 'art-4',
    title: 'EU Considers Euro-7 Tailpipe Regulatory Amendments For 2028 Timelines',
    excerpt: 'Legislative adjustments accommodate industrial vehicle battery durability rules while loosening gas emissions limits.',
    content: 'The European Council has finalized initial drafts revising upcoming Euro-7 vehicular pollution frameworks. Recognizing the capital intensity of the wholesale manufacture transition toward battery platforms, legislators have left internal combustion tailpipe limits for light passenger cars virtually identical to Euro-6 standards. However, highly strict testing models have been enacted governing tire brake-pad microplastic dispersion limits, alongside binding minimum battery capacity milestones for hybrid and fully electric platforms.',
    category: 'regulations',
    author: 'Sven Lindqvist',
    role: 'EU Policy Specialist',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    date: 'April 19, 2026',
    readTime: '8 min read',
    upvotes: 78,
    commentsCount: 22
  },
  {
    id: 'art-5',
    title: 'BMW Launches High-Efficiency Euro6 Diesel Particulate Filter (DPF) Good-Will Campaign',
    excerpt: 'Munich technical controllers authorize free DPF diagnostic evaluations and deep carbon remediation cycles.',
    content: 'To reinforce engine reliability indexes, BMW has launched a proactive goodwill campaigns covering selected 2.0L and 3.0L diesel models built between 2018 and 2023. Owners representing high short-trip driving ratios can schedule computerized testing of exhaust backpressure values. If terminal carbon blockages represent early failure risks, dealers are instructed to execute thermal soot reclamation or install complete factory particulate filters under sub-franchised warranty frameworks.',
    category: 'brand-news',
    brand: 'BMW',
    author: 'Charlotte Weber',
    role: 'German Tech Lead',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    date: 'June 05, 2026',
    readTime: '4 min read',
    upvotes: 165,
    commentsCount: 51
  },
  {
    id: 'art-6',
    title: 'Poland Levies Strict Review of Excises for Hybrid Engine Capacity Disputes',
    excerpt: 'Tax officials verify paint layers, model modifications, and specific fuel metrics to prevent under-declaration tactics.',
    content: 'The Polish Customs and Treasury service (KAS) has reported a major rise in targeted audits involving imported vehicles with engines marginally exceeding the 2000cc limit. By applying local margin classifications or claiming false engine swaps, importers attempt to trigger the lower 3.1% excise tax instead of the severe 18.6% tariff. Inspectors have integrated with regional databases to verify true original chassis coding certificates.',
    category: 'regulations',
    author: 'Stanislaw Glowack',
    role: 'Border Regulatory Expert',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
    date: 'May 10, 2026',
    readTime: '6 min read',
    upvotes: 62,
    commentsCount: 14
  }
];

// Brands List metadata with followers statistics
interface BrandDetail {
  name: string;
  count: number;
  country: string;
  logo: string;
  color: string;
}

const BRANDS_LIST: BrandDetail[] = [
  { name: 'Porsche', count: 1845, country: 'Germany', logo: ' Stuttgart', color: 'bg-red-650' },
  { name: 'Tesla', count: 2450, country: 'USA', logo: ' Austin', color: 'bg-red-500' },
  { name: 'BMW', count: 3200, country: 'Germany', logo: ' Munich', color: 'bg-blue-600' },
  { name: 'Audi', count: 1950, country: 'Germany', logo: ' Ingolstadt', color: 'bg-zinc-800' },
  { name: 'Toyota', count: 2890, country: 'Japan', logo: ' Toyota City', color: 'bg-red-700' },
  { name: 'Volkswagen', count: 2150, country: 'Germany', logo: ' Wolfsburg', color: 'bg-blue-800' }
];

export default function Community() {
  // Primary States
  const [articles, setArticles] = useState<NewsArticle[]>(INITIAL_ARTICLES);
  const [followedBrands, setFollowedBrands] = useState<string[]>(['Porsche', 'BMW']); // Pre-follow Porsche and BMW
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'market-trends' | 'recalls' | 'regulations' | 'brand-news'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [followingOnly, setFollowingOnly] = useState(false);
  const [currentArticleDetailId, setCurrentArticleDetailId] = useState<string | null>(null);

  // Owned vehicle recall checker states
  const [ownedVehicles, setOwnedVehicles] = useState<Vehicle[]>([
    VEHICLES[0] // Pre-load the premium Porsche 911 Carrera S as owned vehicle
  ]);
  const [isRegistringNewVehicle, setIsRegistringNewVehicle] = useState(false);
  const [selectedMarketplaceVin, setSelectedMarketplaceVin] = useState(VEHICLES[1]?.vin || '');
  const [customVinText, setCustomVinText] = useState('');
  const [customMakeText, setCustomMakeText] = useState('Tesla');
  const [customModelText, setCustomModelText] = useState('Model 3');
  const [customYearText, setCustomYearText] = useState('2022');

  // New Article Authoring Dialog/Form
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCat, setNewCat] = useState<'market-trends' | 'recalls' | 'regulations' | 'brand-news'>('brand-news');
  const [newBrand, setNewBrand] = useState('Porsche');

  // Handle article upvoting
  const handleUpvote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setArticles(prev => prev.map(a => a.id === id ? { ...a, upvotes: a.upvotes + 1 } : a));
  };

  // Toggle Following Manufacturer
  const toggleFollowBrand = (brandName: string) => {
    if (followedBrands.includes(brandName)) {
      setFollowedBrands(prev => prev.filter(b => b !== brandName));
    } else {
      setFollowedBrands(prev => [...prev, brandName]);
    }
  };

  // Select vehicle from global catalog to own
  const registerOwnedVehicleFromMarketplace = () => {
    const matched = VEHICLES.find(v => v.vin === selectedMarketplaceVin);
    if (matched) {
      // Avoid duplicate registrations
      if (ownedVehicles.some(v => v.vin === matched.vin)) {
        alert("This vehicle is already in your garage database!");
        return;
      }
      setOwnedVehicles(prev => [...prev, matched]);
      setIsRegistringNewVehicle(false);
    }
  };

  // Add a fully custom owned vehicle using typed inputs
  const registerCustomOwnedVehicle = () => {
    if (!customVinText.trim()) return;
    const fakeVehicle: Vehicle = {
      vin: customVinText.toUpperCase().trim(),
      make: customMakeText,
      model: customModelText,
      year: parseInt(customYearText) || 2022,
      trim: 'Standard Edition',
      price: 32000,
      mileage: 24000,
      engine: 'Standard Electric Motor Drive',
      transmission: 'Single-Speed Automatic',
      driveType: 'AWD',
      location: 'Local Hub',
      extColor: 'Liquid White',
      intColor: 'Sleek Charcoal',
      images: ['https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=400'],
      certified: true,
      status: 'Available',
      riskScore: 'Low',
      valuation: 28500,
      marketPrice: 29500
    };
    setOwnedVehicles(prev => [...prev, fakeVehicle]);
    setCustomVinText('');
    setIsRegistringNewVehicle(false);
  };

  // Remove owned vehicle
  const removeOwnedVehicle = (vin: string) => {
    setOwnedVehicles(prev => prev.filter(v => v.vin !== vin));
  };

  // Identify matching safety recalls tied to owned vehicles
  const matchedRecallsForOwnedVehicles = useMemo(() => {
    const alerts: { vehicle: Vehicle; campaign: RecallCampaign }[] = [];
    ownedVehicles.forEach(vehicle => {
      PRESET_RECALL_CAMPAIGNS.forEach(campaign => {
        const makeMatches = campaign.brand.toLowerCase() === vehicle.make.toLowerCase();
        // check model similarity (e.g. 911 Carrera S contains 911)
        const modelMatches = vehicle.model.toLowerCase().includes(campaign.modelPattern.toLowerCase());
        
        if (makeMatches && modelMatches) {
          alerts.push({ vehicle, campaign });
        }
      });
    });
    return alerts;
  }, [ownedVehicles]);

  // Handle publishing user written news/insights
  const publishUserArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const userArt: NewsArticle = {
      id: `usr-${Date.now()}`,
      title: newTitle,
      excerpt: newExcerpt || newContent.substring(0, 110) + '...',
      content: newContent,
      category: newCat,
      brand: newBrand !== 'None' ? newBrand : undefined,
      author: 'You (Auto Expert)',
      role: 'Local Automotive Consultant',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      date: 'Just now',
      readTime: '3 min read',
      upvotes: 1,
      commentsCount: 0
    };

    setArticles(prev => [userArt, ...prev]);
    // reset form fields
    setNewTitle('');
    setNewExcerpt('');
    setNewContent('');
    setShowAuthorForm(false);
  };

  // Computed and filtered articles based on filters states
  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      // Category filter match
      const matchesCat = selectedCategory === 'all' || art.category === selectedCategory;

      // Followed brands check
      const matchesBrandFollow = !followingOnly || (art.brand && followedBrands.includes(art.brand));

      // Query text search matching title, excerpt, content, or brand
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery = query === '' || 
        art.title.toLowerCase().includes(query) ||
        art.excerpt.toLowerCase().includes(query) ||
        art.content.toLowerCase().includes(query) ||
        (art.brand && art.brand.toLowerCase().includes(query));

      return matchesCat && matchesBrandFollow && matchesQuery;
    });
  }, [articles, selectedCategory, followedBrands, followingOnly, searchQuery]);

  return (
    <div id="news-insights-hub-parent" className="min-h-screen bg-white font-sans text-zinc-900 pb-16 w-full">
      
      {/* 1. MINIMAL HERO HEADER AREA */}
      <div className="bg-zinc-50 border-b border-zinc-200 text-zinc-900 pt-16 pb-12 px-6 relative">
        <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 leading-none">
              News & Brand Insights
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => {
                const targetEl = document.getElementById("vehicle-recall-garage-card");
                targetEl?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 bg-white text-zinc-800 border border-zinc-200 hover:bg-zinc-50 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer rounded-lg shadow-xs"
            >
              Check My Recalls
            </button>
            <button
              onClick={() => setShowAuthorForm(!showAuthorForm)}
              className="px-4 py-2 bg-[#8B0000] text-white hover:bg-[#700000] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer rounded-lg border border-transparent shadow-xs"
            >
              Share Post
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 mt-12 space-y-12">

        {/* 2. RECALL GARAGE SYSTEM (notifications tied to owned vehicles) */}
        <section id="vehicle-recall-garage-card" className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-black uppercase tracking-tight text-[#8B0000] border-l-4 border-[#8B0000] pl-3">
                Safety Recalls for Your Cars
              </h2>
            </div>
            
            <button
              id="add-vehicle-recall-trigger"
              onClick={() => setIsRegistringNewVehicle(!isRegistringNewVehicle)}
              className="bg-[#8B0000] hover:bg-[#700000] text-white text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-lg border border-transparent shadow-xs transition-all cursor-pointer"
            >
              {isRegistringNewVehicle ? 'Close Form' : 'Add Your Car'}
            </button>
          </div>

          <AnimatePresence>
            {isRegistringNewVehicle && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-zinc-50 border border-zinc-200 p-5 space-y-4 text-xs overflow-hidden rounded-xl"
              >
                <h3 className="font-bold text-[#8B0000] uppercase tracking-wider text-xs">
                  Add a Vehicle to Check Recalls
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                  
                  {/* Method A: Select from global marketplace catalog */}
                  <div className="bg-white border border-zinc-200 p-4 space-y-3 flex flex-col justify-between rounded-lg">
                    <div className="space-y-1">
                      <span className="text-[9.5px] font-bold text-zinc-600 uppercase tracking-wider block">Option A: Choose from our list</span>
                      <p className="text-[10px] text-zinc-500 leading-normal">Select a car from our store to check its safety records quickly.</p>
                    </div>

                    <div className="space-y-2">
                      <select
                        value={selectedMarketplaceVin}
                        onChange={(e) => setSelectedMarketplaceVin(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border-2 border-zinc-200 bg-white font-bold outline-none text-zinc-700 focus:border-[#8B0000]"
                      >
                        {VEHICLES.map((v) => (
                          <option key={v.vin} value={v.vin}>
                            {v.year} - {v.make} {v.model} ({v.vin.substring(0, 10)}...)
                          </option>
                        ))}
                      </select>
                      
                      <button
                        id="btn-register-from-market"
                        onClick={registerOwnedVehicleFromMarketplace}
                        className="w-full py-2 bg-[#8B0000] hover:bg-[#700000] text-white font-bold text-[10px] tracking-wider uppercase rounded-lg border border-transparent shadow-xs transition-all cursor-pointer"
                      >
                        Add to My Cars
                      </button>
                    </div>
                  </div>

                  {/* Method B: Input custom vehicle */}
                  <div className="bg-white border border-zinc-200 p-4 space-y-3 rounded-lg">
                    <span className="text-[9.5px] font-bold text-zinc-650 uppercase tracking-wider block">Option B: Enter details manually</span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[8px] font-bold uppercase text-zinc-400">Make</label>
                        <input 
                          type="text" 
                          className="w-full text-[10.5px] p-2 rounded-lg border border-zinc-200 outline-none focus:border-[#8B0000]" 
                          value={customMakeText}
                          onChange={(e) => setCustomMakeText(e.target.value)}
                          placeholder="e.g. Tesla"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] font-bold uppercase text-zinc-400">Model</label>
                        <input 
                          type="text" 
                          className="w-full text-[10.5px] p-2 rounded-lg border border-zinc-200 outline-none focus:border-[#8B0000]" 
                          value={customModelText}
                          onChange={(e) => setCustomModelText(e.target.value)}
                          placeholder="e.g. Model 3"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] font-bold uppercase text-zinc-400">Year</label>
                        <input 
                          type="text" 
                          className="w-full text-[10.5px] p-2 rounded-lg border border-zinc-200 outline-none focus:border-[#8B0000]" 
                          value={customYearText}
                          onChange={(e) => setCustomYearText(e.target.value)}
                          placeholder="2022"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-[8px] font-bold uppercase text-zinc-400 block mb-0.5">VIN Code</label>
                      <input 
                        type="text" 
                        className="w-full text-[10.5px] p-2 rounded-lg border border-zinc-200 outline-none font-mono focus:border-[#8B0000]" 
                        placeholder="WP0AB29..." 
                        value={customVinText}
                        onChange={(e) => setCustomVinText(e.target.value)}
                      />
                    </div>

                    <button
                      id="btn-register-custom-vin"
                      onClick={registerCustomOwnedVehicle}
                      disabled={!customVinText.trim()}
                      className="w-full py-2 bg-[#8B0000] hover:bg-[#700000] text-white font-bold text-[10px] tracking-wider uppercase rounded-lg border border-transparent shadow-xs transition-all cursor-pointer disabled:opacity-40"
                    >
                      Add Custom Car
                    </button>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Garage Status and Active Owned List */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
            
            {/* Left Garage inventory: 4 Cols */}
            <div className="lg:col-span-4 space-y-3 lg:border-r lg:border-zinc-200 lg:pr-6">
              <span className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                Your Vehicles ({ownedVehicles.length})
              </span>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {ownedVehicles.map((car) => {
                  const numRecalls = PRESET_RECALL_CAMPAIGNS.filter(
                    c => c.brand.toLowerCase() === car.make.toLowerCase() &&
                         car.model.toLowerCase().includes(c.modelPattern.toLowerCase())
                  ).length;

                  return (
                    <div 
                      key={car.vin} 
                      className={`p-3 border rounded-xl transition-all relative ${
                        numRecalls > 0 
                          ? 'border-[#8B0000] bg-red-50/10 shadow-xs' 
                          : 'border-zinc-200 bg-white shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1.5 text-xs">
                        <div className="space-y-1">
                          <h4 className="font-bold text-[#8B0000] text-[11px] leading-tight uppercase">
                            {car.year} {car.make} {car.model}
                          </h4>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {numRecalls > 0 ? (
                            <span className="text-[9px] font-bold text-[#8B0000] border border-[#8B0000]/20 px-2 py-0.5 rounded-md flex items-center gap-1 bg-red-50">
                              {numRecalls} Recall{numRecalls > 1 ? 's' : ''}
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold text-green-700 border border-green-200 px-2 py-0.5 rounded-md flex items-center gap-1 bg-green-50">
                              Clean
                            </span>
                          )}

                          <button 
                            onClick={() => removeOwnedVehicle(car.vin)}
                            className="text-zinc-400 hover:text-[#8B0000] p-1 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {ownedVehicles.length === 0 && (
                  <div className="p-6 text-center border-dashed border-2 border-zinc-200 rounded-xl text-zinc-400 space-y-1.5">
                    <Car className="w-8 h-8 text-zinc-300 mx-auto" />
                    <p className="text-[10px] font-bold">Your list is empty.</p>
                    <button
                      onClick={() => setIsRegistringNewVehicle(true)}
                      className="text-[10px] text-[#8B0000] hover:text-[#8B0000]/80 font-bold underline"
                    >
                      Add your first car
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Live Recall matching alerts: 8 Cols */}
            <div className="lg:col-span-8 space-y-4">
              <span className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
                Safety Alerts Found for Your Cars ({matchedRecallsForOwnedVehicles.length})
              </span>

              <div className="space-y-3">
                {matchedRecallsForOwnedVehicles.map(({ vehicle, campaign }) => (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={campaign.id + '-' + vehicle.vin}
                    className="p-4 border border-zinc-200 bg-white flex flex-col sm:flex-row items-start gap-4 transition-all rounded-xl shadow-sm"
                  >
                    <div className="space-y-2 flex-1 text-xs">
                      <div className="space-y-1">
                        <h4 className="font-bold text-[#8B0000] text-[13px] leading-snug uppercase">
                          Recall campaign matches: {vehicle.year} {vehicle.make} {vehicle.model}
                        </h4>
                        <p className="text-[11px] text-zinc-600 leading-relaxed font-normal">
                          <span className="font-bold text-zinc-900 border-b border-zinc-200 pb-0.5 mr-1">Problem Details:</span> {campaign.defectSummary}
                        </p>
                        <p className="text-[11px] text-zinc-600 leading-relaxed font-normal bg-zinc-50 p-2.5 border border-dashed border-zinc-200 rounded-lg">
                          <span className="font-bold text-zinc-900">How to Fix:</span> {campaign.remedyAction}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          onClick={() => alert(`We have requested a free service appointment for your ${vehicle.make} regarding campaign ${campaign.campaignNumber}.`)}
                          className="px-3 py-1.5 bg-[#8B0000] hover:bg-[#700000] text-white font-bold text-[9.5px] uppercase tracking-wider cursor-pointer border border-transparent shadow-xs transition-all rounded-lg"
                        >
                          Book Free Repair
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {matchedRecallsForOwnedVehicles.length === 0 && (
                  <div className="p-10 text-center bg-zinc-50 border-2 border-[#8B0000]/20 rounded-xl space-y-2">
                    <ShieldCheck className="w-9 h-9 text-[#8B0000] mx-auto" />
                    <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">Zero Active Campaigns Detected</h4>
                    <p className="text-[10px] text-zinc-500 max-w-md mx-auto leading-normal">
                      No safety recalls were found for your vehicles.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* 3. BRAND CENTERS SYSTEM (brand profile news integration & brand following) */}
        <section className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm space-y-4">
          <div className="space-y-0.5 border-b border-zinc-100 pb-3 flex flex-col sm:flex-row justify-between sm:items-end">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-[#8B0000] border-l-4 border-[#8B0000] pl-3">
                Follow Brands
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 pt-1.5">
            {BRANDS_LIST.map((brand) => {
              const isFollowed = followedBrands.includes(brand.name);
              const filterPostsCount = articles.filter(a => a.brand === brand.name).length;
              return (
                <div 
                  key={brand.name}
                  className={`p-4 border rounded-xl text-xs text-center flex flex-col justify-between items-center transition-all ${
                    isFollowed 
                      ? 'border-[#8B0000] bg-white shadow-sm' 
                      : 'border-zinc-200 bg-white hover:border-[#8B0000]/40 shadow-xs hover:shadow-sm'
                  }`}
                >
                  <div className="space-y-1.5 w-full">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[8px] text-zinc-400 font-mono font-medium">{brand.country}</span>
                      {isFollowed && (
                        <span className="p-0.5 bg-[#8B0000] text-white" title="Following Brand">
                          <Star className="w-2.5 h-2.5 fill-current" />
                        </span>
                      )}
                    </div>

                    <div className="py-2">
                      <h4 className="font-extrabold text-[#8B0000] text-sm tracking-tight uppercase">{brand.name}</h4>
                      <p className="text-[9.5px] text-zinc-400 font-medium font-sans mt-0.5">{brand.logo}</p>
                    </div>
                  </div>

                  <div className="w-full space-y-2 mt-2">
                    <div className="bg-zinc-50 border border-zinc-200 py-1 px-1.5 text-[8.5px] font-mono text-zinc-500 flex justify-between rounded">
                      <span>Posts:</span>
                      <strong className="text-[#8B0000] font-extrabold">{filterPostsCount}</strong>
                    </div>

                    <button
                      id={`follow-btn-${brand.name}`}
                      onClick={() => toggleFollowBrand(brand.name)}
                      className={`w-full py-1.5 text-[9.5px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1 rounded-lg ${
                        isFollowed 
                          ? 'bg-[#8B0000] text-white hover:bg-[#700000] border border-transparent shadow-sm' 
                          : 'bg-white text-zinc-800 border border-zinc-200 hover:border-[#8B0000]'
                      }`}
                    >
                      {isFollowed ? 'Followed' : 'Follow'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Dynamic Publish Post Dialog / Form Overlay */}
        <AnimatePresence>
          {showAuthorForm && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-zinc-200 p-6 shadow-sm space-y-4 rounded-xl"
              id="user-insight-form"
            >
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-[#8B0000]">
                  Write a New Post
                </h3>
                <button 
                  onClick={() => setShowAuthorForm(false)} 
                  className="text-zinc-500 hover:text-black font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={publishUserArticle} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="col-span-1 sm:col-span-2">
                    <label className="text-[9px] font-bold uppercase text-zinc-400">Title</label>
                    <input 
                      type="text" 
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. New Electric Vehicle Updates"
                      className="w-full text-xs p-3 rounded-lg border border-zinc-200 bg-white font-bold outline-none focus:border-[#8B0000]"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-bold uppercase text-zinc-400">Category</label>
                    <select
                      value={newCat}
                      onChange={(e: any) => setNewCat(e.target.value)}
                      className="w-full text-xs p-3 rounded-lg border border-zinc-200 bg-white font-bold outline-none focus:border-[#8B0000]"
                    >
                      <option value="market-trends">Market Trends</option>
                      <option value="recalls">Safety & Recalls</option>
                      <option value="regulations">Regulations</option>
                      <option value="brand-news">Brand Announcements</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold uppercase text-zinc-400">Brand (Optional)</label>
                    <select
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      className="w-full text-xs p-3 rounded-lg border border-zinc-200 bg-white font-bold outline-none focus:border-[#8B0000]"
                    >
                      <option value="None">None (General Post)</option>
                      <option value="Porsche">Porsche</option>
                      <option value="Tesla">Tesla</option>
                      <option value="BMW">BMW</option>
                      <option value="Audi">Audi</option>
                      <option value="Toyota">Toyota</option>
                      <option value="Volkswagen">Volkswagen</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-bold uppercase text-zinc-400">Short Summary</label>
                    <input 
                      type="text" 
                      value={newExcerpt}
                      onChange={(e) => setNewExcerpt(e.target.value)}
                      placeholder="e.g. A quick update about car performance tests..."
                      className="w-full text-xs p-3 rounded-lg border border-zinc-200 bg-white outline-none focus:border-[#8B0000]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-bold uppercase text-zinc-400">Full Content</label>
                  <textarea 
                    required
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Write your article details here. Keep it clear, simple, and easy to read..."
                    className="w-full text-xs p-3 rounded-lg border border-zinc-200 bg-white outline-none focus:border-[#8B0000] leading-relaxed"
                  />
                </div>

                <div className="flex justify-end pt-2 border-t border-zinc-100">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#8B0000] hover:bg-[#700000] text-white font-bold uppercase text-xs tracking-wider cursor-pointer rounded-lg border border-transparent shadow-sm transition-all"
                  >
                    Publish Post
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. MAIN ARTICLE FEED WRAPPER (Category filters, Article Feed, Search Input) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: Filtering Toolbar & Article Grid Feed - 8 Cols */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Horizontal Filter Pill Navigation & Search Input Bar */}
            <div className="bg-white border border-zinc-200 p-5 space-y-4 rounded-xl shadow-sm">
              
              <div className="flex flex-col sm:flex-row items-center gap-3.5">
                {/* Search Text input */}
                <div className="relative flex-1 w-full font-sans">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-4.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search posts..."
                    className="w-full bg-white border border-zinc-200 pl-11 pr-4 py-3 rounded-lg text-xs font-semibold outline-none text-zinc-700 placeholder:text-zinc-400 focus:border-[#8B0000] transition-colors"
                  />
                </div>

                {/* Brand following filter switch toggle */}
                <button
                  id="following-only-toggle"
                  onClick={() => setFollowingOnly(!followingOnly)}
                  className={`px-4 py-3 rounded-lg border text-xs font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 select-none cursor-pointer ${
                    followingOnly 
                      ? 'bg-[#8B0000] text-white border-transparent shadow-sm' 
                      : 'bg-white text-zinc-700 border-zinc-200 hover:border-[#8B0000]'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${followingOnly ? 'fill-current' : 'text-zinc-400'}`} />
                  <span>Followed Brands Only</span>
                </button>
              </div>

              {/* Horizontal Category Pill buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-3.5 border-t border-zinc-100">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mr-2">Filter:</span>
                {[
                  { id: 'all', label: 'All Posts' },
                  { id: 'market-trends', label: 'Market Trends' },
                  { id: 'recalls', label: 'Safety & Recalls' },
                  { id: 'regulations', label: 'Regulations' },
                  { id: 'brand-news', label: 'Brand News' }
                ].map((catOpt) => (
                  <button
                    key={catOpt.id}
                    id={`filter-pill-${catOpt.id}`}
                    onClick={() => setSelectedCategory(catOpt.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold tracking-wide cursor-pointer transition-all border ${
                      selectedCategory === catOpt.id 
                        ? 'bg-[#8B0000] text-white border-transparent shadow-xs' 
                        : 'bg-white hover:bg-zinc-50 text-zinc-500 hover:text-zinc-900 border-zinc-200 hover:border-[#8B0000]'
                    }`}
                  >
                    {catOpt.label}
                  </button>
                ))}
              </div>

            </div>

            {/* Articles List / Grid */}
            <div className="space-y-4">
              {filteredArticles.map((article) => {
                const isDetailOpen = currentArticleDetailId === article.id;
                const isBrandFollowed = article.brand && followedBrands.includes(article.brand);

                return (
                  <div 
                    key={article.id}
                    id={`article-card-${article.id}`}
                    className={`bg-white border rounded-xl transition-all ${
                      article.featured 
                        ? 'border-[#8B0000] shadow-sm' 
                        : 'border-zinc-200 hover:border-[#8B0000] shadow-xs hover:shadow-sm'
                    }`}
                  >
                    {/* Header: Writer details & Tags */}
                    <div className="p-5 flex items-start justify-between gap-4">
                      
                      <div className="space-y-2 flex-grow">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Main category tag */}
                          <span className="text-[8.5px] font-bold uppercase px-2 py-0.5 bg-zinc-100 text-zinc-800 border border-zinc-200 rounded">
                            {article.category.replace('-', ' ')}
                          </span>

                          {/* Brand specific tag if any */}
                          {article.brand && (
                            <span className={`text-[8.5px] font-mono font-bold px-1.5 py-0.5 border rounded flex items-center gap-1 ${
                              isBrandFollowed ? 'bg-red-50 text-[#8B0000] border-[#8B0000]/20' : 'bg-white text-zinc-500 border-zinc-200'
                            }`}>
                              Brand: {article.brand}
                            </span>
                          )}

                          <span className="text-zinc-400 text-[10px]">&bull; {article.readTime}</span>
                        </div>

                        <h3 
                          className="text-base font-extrabold text-[#8B0000] tracking-tight leading-snug cursor-pointer uppercase hover:underline" 
                          onClick={() => setCurrentArticleDetailId(isDetailOpen ? null : article.id)}
                        >
                          {article.title}
                        </h3>

                        <p className="text-xs text-zinc-600 leading-relaxed font-normal">
                          {article.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isBrandFollowed && (
                          <div className="text-[9px] font-bold text-[#8B0000] border border-[#8B0000]/20 py-1 px-2 flex items-center gap-1 rounded-lg bg-red-50">
                            <BookmarkCheck className="w-3" />
                            <span className="hidden sm:inline">Followed</span>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Expandable Inner Article content section */}
                    <AnimatePresence>
                      {isDetailOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-zinc-200 bg-zinc-50/50 p-6 space-y-4 text-xs select-text block whitespace-normal rounded-b-xl"
                        >
                          <div className="flex items-center gap-3.5 pb-4 border-b border-zinc-200">
                            <img 
                              src={article.avatar} 
                              alt={article.author} 
                              className="w-10 h-10 object-cover border border-zinc-200 rounded-full"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <h5 className="font-bold text-zinc-900 uppercase">{article.author}</h5>
                              <p className="text-[10px] text-zinc-400 font-mono font-medium tracking-wider">{article.role}</p>
                            </div>
                            <span className="text-zinc-400 font-medium font-mono text-[10px] ml-auto">{article.date}</span>
                          </div>

                          <div className="text-[12.5px] leading-relaxed text-zinc-700 font-normal space-y-3 pt-2">
                            <p>{article.content}</p>
                          </div>

                          <div className="bg-white p-3 border border-zinc-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3.5 text-xs text-zinc-500 font-medium font-sans mt-4 rounded-lg">
                            <div className="flex items-center gap-2">
                              {article.brand ? (
                                <p>
                                  Official bulletin posted under <strong className="text-[#8B0000]">{article.brand}</strong> manufacturer guidelines.
                                </p>
                              ) : (
                                <p>Published independently under global compliance transparency frameworks.</p>
                              )}
                            </div>

                            <button
                              onClick={() => alert(`Direct link copied: ${article.title}`)}
                              className="text-[#8B0000] hover:text-black font-bold uppercase tracking-wider underline text-[10.5px] cursor-pointer"
                            >
                              Copy Link
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Footer segment: Upvotes & Details expand toggle */}
                    <div className="bg-zinc-50 border-t border-zinc-200 px-5 py-3 flex items-center justify-between text-xs font-bold text-zinc-500 select-none rounded-b-xl">
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleUpvote(article.id, e)}
                          className="flex items-center gap-1.5 text-[11px] font-bold font-sans hover:text-[#8B0000] hover:bg-zinc-50 bg-white border border-zinc-200 py-1.5 px-3 transition-all cursor-pointer rounded-lg shadow-xs"
                        >
                          <Heart className="w-3.5 h-3.5 text-[#8B0000]" />
                          <span>Like ({article.upvotes})</span>
                        </button>

                        <div className="flex items-center gap-1.5 text-zinc-500 bg-white border border-zinc-200 py-1.5 px-3 text-[11px] font-bold rounded-lg">
                          <MessageSquare className="w-3.5 h-3.5 text-zinc-400" />
                          <span> {article.commentsCount} comments</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setCurrentArticleDetailId(isDetailOpen ? null : article.id)}
                        className="text-[#8B0000] hover:text-black flex items-center gap-0.5 text-[11px] uppercase tracking-wider font-bold cursor-pointer"
                      >
                        <span>{isDetailOpen ? 'Close Article' : 'Read Article'}</span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${isDetailOpen ? 'rotate-90' : ''}`} />
                      </button>

                    </div>
                  </div>
                );
              })}

              {filteredArticles.length === 0 && (
                <div className="p-12 text-center bg-white border-2 border-dashed border-zinc-200 text-zinc-400 space-y-3 rounded-xl">
                  <HelpCircle className="w-10 h-10 text-zinc-300 mx-auto" />
                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#8B0000]">No Match Found</h4>
                  <p className="text-[11px] text-zinc-400 max-w-sm mx-auto">
                    Try searching for something else or turn off "Followed Brands Only".
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT SIDE: Safety, Legal Advisory Bulletins, & Trends stats - 4 Cols */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Regulatory Bulletins */}
            <div className="bg-white border border-zinc-200 p-5 space-y-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                <Scale className="w-4.5 h-4.5 text-[#8B0000]" />
                <div>
                  <h4 className="font-extrabold text-[#8B0000] text-xs uppercase tracking-wider">Useful Bulletins</h4>
                </div>
              </div>

              <div className="space-y-4 text-xs font-normal text-zinc-650">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-[#8B0000] uppercase font-mono tracking-wider">EU Regulation</span>
                  <h5 className="font-extrabold text-zinc-900 leading-snug uppercase">Battery Status Disclosures</h5>
                  <p className="text-[11px] leading-relaxed">
                    Requires all second-hand battery electric vehicles to supply an official state certified health report for trade.
                  </p>
                  <a onClick={() => alert("Directing to EU document index. Secure connection pending.")} className="text-[#8B0000] text-[10px] font-bold uppercase tracking-wider underline cursor-pointer hover:text-black">
                    Read Details &raquo;
                  </a>
                </div>

                <div className="border-t border-zinc-100 pt-3 space-y-1">
                  <span className="text-[9px] font-bold text-[#8B0000] uppercase font-mono tracking-wider">US Safety Rules</span>
                  <h5 className="font-extrabold text-zinc-900 leading-snug uppercase">Odometer Verification Sweeps</h5>
                  <p className="text-[11px] leading-relaxed">
                    Introduces centralized verification tools comparing service record dates with digital dashboard timers.
                  </p>
                  <a onClick={() => alert("Directing to safety portal.")} className="text-[#8B0000] text-[10px] font-bold uppercase tracking-wider underline cursor-pointer hover:text-black">
                    Check Rules &raquo;
                  </a>
                </div>
              </div>
            </div>

            {/* Campaign Categories definitions - Minimal Red Card */}
            <div className="bg-white border border-zinc-200 p-5 space-y-4 relative rounded-xl shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#8B0000] flex items-center gap-1.5 border-b border-[#8B0000]/20 pb-2">
                <Info className="w-4 h-4 text-[#8B0000]" /> Categories Info
              </h4>
              <p className="text-[11px] text-zinc-650 leading-relaxed font-normal">
                Stay updated with diverse bulletins. Filter any category in the top selector:
              </p>
              
              <div className="space-y-3.5 text-[11px] text-zinc-600">
                <div className="flex gap-2 items-start">
                  <span className="w-2 h-2 bg-[#8B0000] mt-1 shrink-0"></span>
                  <p>
                    <strong className="text-zinc-900">Market Trends:</strong> Track pricing changes, supply limits, and value records.
                  </p>
                </div>

                <div className="flex gap-2 items-start">
                  <span className="w-2 h-2 bg-[#8B0000] mt-1 shrink-0"></span>
                  <p>
                    <strong className="text-zinc-900">Safety & Recalls:</strong> Keep track of safety issues and active manufacturer recall notices.
                  </p>
                </div>

                <div className="flex gap-2 items-start">
                  <span className="w-2 h-2 bg-[#8B0000] mt-1 shrink-0"></span>
                  <p>
                    <strong className="text-zinc-900">Regulations:</strong> Understand direct guidelines, taxes, and inspection policies.
                  </p>
                </div>

                <div className="flex gap-2 items-start">
                  <span className="w-2 h-2 bg-[#8B0000] mt-1 shrink-0"></span>
                  <p>
                    <strong className="text-zinc-900">Brand News:</strong> Official manufacturer updates and brand reports.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

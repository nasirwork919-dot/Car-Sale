import React, { useState } from 'react';
import { 
  User, Briefcase, Landmark, Shield, ShieldCheck, Mail, Phone, Calendar, 
  ChevronRight, ArrowRight, Activity, Zap, Compass, Sparkles, Code, 
  Search, ShieldAlert, Check, HelpCircle, Server, BarChart3, Clock, 
  Database, RefreshCw, Layers, Cpu, ExternalLink, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FeaturesProps {
  onNavigateToSignup?: () => void;
  onNavigateToServices?: () => void;
  onNavigateToBusiness?: () => void;
}

export default function Features({ onNavigateToSignup, onNavigateToServices, onNavigateToBusiness }: FeaturesProps) {
  // Navigation & interaction states
  const [activeRoleTab, setActiveRoleTab] = useState<'private' | 'dealer' | 'workshop' | 'insurer'>('private');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Interactive Simulator States
  const [simVolume, setSimVolume] = useState<number>(25); // Monthly vehicle listings / transactions
  const [simType, setSimType] = useState<'private' | 'dealer' | 'workshop'>('dealer');
  
  // Interactive Grid Expand state
  const [expandedFeatureId, setExpandedFeatureId] = useState<string | null>(null);

  const featureGroups = {
    private: {
      title: 'Private Buyers & Sellers',
      subtitle: 'Premium Safety Controls',
      description: 'We bring professional car checking tools to everyday buyers and sellers. Trade safely, stop scam artists, and buy with complete trust.',
      badgeColor: 'bg-red-50 text-red-650 border-red-200/30',
      actionText: 'Start Buyer Verification',
      features: [
        {
          id: 'p1',
          title: 'Simple Odometer Mileage Checker',
          shortcut: 'Mileage-Check',
          icon: Clock,
          desc: 'We check official records to make sure the car mileage has not been rolled back. This keeps you safe from common odometer scams.',
          benefits: ['Find mileage mismatch instantly', 'Verify accurate car age', 'Check historical registration records'],
          impact: 'Stops mileage scams completely before you pay any money.'
        },
        {
          id: 'p2',
          title: 'Mobile Paint & Collision Scanner',
          shortcut: 'Paint-Scanner',
          icon: Zap,
          desc: 'Scan the car paint depth with your phone to find hidden paint jobs or crash repairs that the seller did not tell you about.',
          benefits: ['Find hidden accident repairs', 'Negotiate a lower purchase price', 'Easy-to-follow guides on your mobile phone'],
          impact: 'Check physical panels in seconds using your mobile phone.'
        },
        {
          id: 'p3',
          title: 'Secure Money Escrow Lock',
          shortcut: 'Secure-Pay',
          icon: ShieldCheck,
          desc: 'Keep your money safe. We hold the payment securely and release it to the seller only after the official car title is transferred.',
          benefits: ['No payment risks for buyers', 'Avoid fake bank checks and scams', 'Automatic release after official title transfer'],
          impact: 'Completely removes payment fraud for car buyers.'
        },
        {
          id: 'p4',
          title: 'On-Demand Local Car Inspector',
          shortcut: 'Book-Inspector',
          icon: Compass,
          desc: 'Hire a verified local mechanic to check the car on-site. They will run a full computer scan and send you the results.',
          benefits: ['Book a mechanic near the car', 'Get a simple diagnostic report', 'Clear check-list of car condition'],
          impact: 'Buy cars safely from other cities or states without traveling.'
        }
      ]
    },
    dealer: {
      title: 'Dealerships & Fleets',
      subtitle: 'Fast Listing & Management',
      description: 'Simplify car sourcing, automatically generate official documents, post cars quickly, and manage your vehicle inventory with full security.',
      badgeColor: 'bg-red-50 text-red-650 border-red-200/30',
      actionText: 'Connect Dealership Account',
      features: [
        {
          id: 'd1',
          title: 'Multi-Site Car Listing Sync',
          shortcut: 'Inventory-Sync',
          icon: Server,
          desc: 'Post your verified cars to multiple listing sites with a single click. Keep everything synchronized easily.',
          benefits: ['No double-entry work', 'Real-time price updates', 'Keep trust badges across sites'],
          impact: 'Saves hours of manual posting for dealerships.'
        },
        {
          id: 'd2',
          title: 'Direct DMV Registration Link',
          shortcut: 'DMV-Link',
          icon: Landmark,
          desc: 'Pay registration taxes and transfer car titles directly online with state transportation offices.',
          benefits: ['Skip long lines at the DMV', 'Instantly check tax rates', 'Get official registration certificates'],
          impact: 'Completes paper registration in minutes instead of weeks.'
        },
        {
          id: 'd3',
          title: 'Certified Vehicle Trust Badges',
          shortcut: 'Trust-Badge',
          icon: Layers,
          desc: 'Show paint and mechanical checks directly on your dealership website to win customer trust.',
          benefits: ['Build instant buyer confidence', 'Justify fair prices with certification', 'Interactive reports on your site'],
          impact: 'Increases web leads and showroom visits.'
        },
        {
          id: 'd4',
          title: 'Bulk Fleet Odometer Checker',
          shortcut: 'Bulk-Check',
          icon: Database,
          desc: 'Scan hundreds of trade-in or fleet vehicles at once to find mileage issues or title problems.',
          benefits: ['Quickly flag suspicious vehicles', 'Generate clean PDF reports', 'Secure accurate prices during auctions'],
          impact: 'Allows dealership teams to inspect huge cargo lots instantly.'
        }
      ]
    },
    workshop: {
      title: 'Workshops & Inspectors',
      subtitle: 'Service Booking & Optimization',
      description: 'Connect your workshop or inspection bay to car buyers. Offer professional diagnostics, build customer trust, and win local jobs.',
      badgeColor: 'bg-red-50 text-red-650 border-red-200/30',
      actionText: 'Register as Inspector',
      features: [
        {
          id: 'w1',
          title: 'Simple Digital Diagnostics',
          shortcut: 'Diag-Report',
          icon: Cpu,
          desc: 'Upload mechanical scanner logs and paint data to create a clear, easy-to-read report for your clients.',
          benefits: ['Converts complex error codes into easy English', 'Interactive color paint thickness map', 'Official digital stamp from your shop'],
          impact: 'Helps clients easily understand and approve required repairs.'
        },
        {
          id: 'w2',
          title: 'Local Repair Request Radar',
          shortcut: 'Local-Jobs',
          icon: Activity,
          desc: 'Receive repair and inspection requests from nearby platform users who need professional help.',
          benefits: ['Fill empty booking times', 'Get guaranteed payments', 'See car history before it arrives'],
          impact: 'Boosts your workshop customer traffic and revenue.'
        },
        {
          id: 'w3',
          title: 'Automated Invoice & Parts Finder',
          shortcut: 'Parts-Finder',
          icon: RefreshCw,
          desc: 'Connect vehicle check logs to find cheap matching parts and create instant customer repair quotes.',
          benefits: ['Find correct parts instantly', 'Compare original vs aftermarket parts', 'Generate quick billing invoices'],
          impact: 'Reduces the time spent on creating repair quotes by more than half.'
        },
        {
          id: 'w4',
          title: 'Verified Technician Credentials',
          shortcut: 'Cert-Finder',
          icon: BarChart3,
          desc: 'Display your mechanics specialized training and equipment certifications online to gain client trust.',
          benefits: ['Show off specialized electric car skills', 'Prove your alignment machines are calibrated', 'Rank higher in local map searches'],
          impact: 'Attracts high-value car owners looking for expert mechanics.'
        }
      ]
    },
    insurer: {
      title: 'Insurers & Finance Partners',
      subtitle: 'Fraud Prevention & Pricing',
      description: 'Stop car insurance fraud, verify real vehicle history logs, prevent clone plates, and calculate highly accurate car valuations.',
      badgeColor: 'bg-red-50 text-red-650 border-red-200/30',
      actionText: 'Talk to Partnerships',
      features: [
        {
          id: 'i1',
          title: 'Stolen & Cloned Plate Checker',
          shortcut: 'Fraud-Alert',
          icon: ShieldAlert,
          desc: 'Scan registrations to identify cloned license plates, stolen vehicles, or salvaged write-offs instantly.',
          benefits: ['Detect cloned plates easily', 'Stop title washing tricks', 'Instant alerts for high-risk cars'],
          impact: 'Prevents insuring stolen or illegal vehicles.'
        },
        {
          id: 'i2',
          title: 'Collision Repair & Damage Checker',
          shortcut: 'Damage-Check',
          icon: Layers,
          desc: 'Compare post-collision repair claims with baseline factory measurements to find fake repair billing.',
          benefits: ['Expose double or fake claim bills', 'Check real panel dimensions', 'Automatic salvage triggers'],
          impact: 'Saves insurance audit time and stops fake claims.'
        },
        {
          id: 'i3',
          title: 'Real-Time Car Valuation Estimator',
          shortcut: 'Price-Check',
          icon: Database,
          desc: 'Calculate the true market value of a car based on actual diagnostic records and current demand.',
          benefits: ['Get highly accurate car values', 'See real transaction curves', 'Assess risk on vehicle leases'],
          impact: 'Replaces old static books with live real-time values.'
        },
        {
          id: 'i4',
          title: 'Active Bank Loan & Lien Checker',
          shortcut: 'Lien-Check',
          icon: Shield,
          desc: 'Verify if a vehicle has active bank loans or unpaid liens before purchase to prevent losses.',
          benefits: ['Check financial loans in milliseconds', 'Protect credit union interests', 'One-click loan status update'],
          impact: 'Completely eliminates financial risks for buyers.'
        }
      ]
    }
  };

  // ROI Simulator Calculation logic
  // Returns: { timeSavedHours, moneySavedEuro, listingSpeedMultiplier }
  const calculateROI = () => {
    let timeMultiplier = 2.5; // hours saved per listing
    let costMultiplier = 45; // Euros saved per listing (fraud + prep time + paperwork)
    let speedMultiplier = "2.4x";

    if (simType === 'private') {
      timeMultiplier = 6;
      costMultiplier = 150;
      speedMultiplier = "3.2x";
    } else if (simType === 'workshop') {
      timeMultiplier = 4.5;
      costMultiplier = 85;
      speedMultiplier = "1.8x";
    }

    return {
      hoursSaved: Math.round(simVolume * timeMultiplier),
      moneySaved: Math.round(simVolume * costMultiplier),
      speed: speedMultiplier
    };
  };

  const roi = calculateROI();

  // All features flat array for search capability
  const allFeatures = Object.entries(featureGroups).flatMap(([groupKey, group]) => 
    group.features.map(f => ({
      ...f,
      userType: group.title,
      groupKey: groupKey as 'private' | 'dealer' | 'workshop' | 'insurer'
    }))
  );

  const filteredFeatures = searchQuery.trim() === ''
    ? []
    : allFeatures.filter(f => 
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.shortcut.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.userType.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="w-full space-y-16 py-8" id="features-page-root">
      
      {/* ================= HERO SECTION ================= */}
      <section className="text-center space-y-6 max-w-4xl mx-auto px-4" id="features-hero">
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">
          Ecosystem Capabilities <span className="text-red-650">Engine</span>
        </h1>

        {/* Global Feature Keywords Finder */}
        <div className="max-w-lg mx-auto relative pt-4">
          <div className="absolute inset-y-0 left-3 top-4 flex items-center pl-1 pointer-events-none text-slate-450">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
          <input
            type="text"
            id="global-feature-lookup-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type what you want to check (e.g., Mileage, Paint, Title, Loan)..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-xs outline-none transition-all focus:border-red-650 focus:bg-white focus:ring-2 focus:ring-red-100 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase pr-1 font-mono cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {/* ================= SEARCH RESULTS ACCORDION PANEL ================= */}
      <AnimatePresence>
        {searchQuery.trim() !== '' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="max-w-[1240px] mx-auto px-4 overflow-hidden"
            id="features-search-results-section"
          >
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h3 className="text-xs font-black uppercase text-slate-900 font-mono tracking-wider flex items-center gap-2">
                  <span>🔍 Feature Registry Matches ({filteredFeatures.length})</span>
                </h3>
                <span className="text-[10px] font-medium text-slate-400 font-mono">Real-time Directory query</span>
              </div>

              {filteredFeatures.length === 0 ? (
                <div className="text-center py-6 text-slate-400 space-y-2">
                  <ShieldAlert className="w-6 h-6 mx-auto text-slate-350" />
                  <p className="text-xs font-bold font-mono">NO COMPATIBLE CAPABILITIES FOUND</p>
                  <p className="text-[10.5px] font-light">Try using a broader term like "paint", "VIN", "escrow", or "registry".</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredFeatures.map((feat) => {
                    const IconComponent = feat.icon;
                    return (
                      <div 
                        key={feat.id}
                        onClick={() => {
                          setActiveRoleTab(feat.groupKey);
                          setSearchQuery('');
                          const targetElem = document.getElementById(`feature-card-${feat.id}`);
                          if (targetElem) {
                            targetElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }
                        }}
                        className="bg-white border border-slate-150 p-4.5 rounded-2xl hover:border-red-650 cursor-pointer transition-all duration-200 flex gap-4 text-left group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-red-50 text-red-650 flex items-center justify-center font-bold shrink-0">
                          <IconComponent className="w-5 h-5 shrink-0" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] bg-slate-100 text-slate-500 rounded px-1.5 py-0.2 font-mono uppercase font-black">
                              {feat.userType}
                            </span>
                            <span className="text-[8px] text-red-600 font-mono font-bold tracking-tight">#{feat.shortcut}</span>
                          </div>
                          <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-[#8B0000] transition-colors">{feat.title}</h4>
                          <p className="text-[11px] text-slate-450 leading-relaxed font-light line-clamp-2">{feat.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= TABBED USER TYPE SHOWCASE ================= */}
      <section className="max-w-[1240px] mx-auto px-4 space-y-10" id="role-features-section">
        
        {/* Unified Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60 shadow-xs max-w-3xl mx-auto">
          {(Object.keys(featureGroups) as Array<keyof typeof featureGroups>).map((key) => {
            const role = featureGroups[key];
            const isActive = activeRoleTab === key;
            return (
              <button
                key={key}
                type="button"
                id={`role-tab-btn-${key}`}
                onClick={() => {
                  setActiveRoleTab(key);
                  setExpandedFeatureId(null);
                }}
                className={`px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  isActive 
                    ? 'bg-red-650 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-950 hover:bg-slate-50'
                }`}
              >
                {key === 'private' && <User className="w-3.5 h-3.5 shrink-0" />}
                {key === 'dealer' && <Briefcase className="w-3.5 h-3.5 shrink-0" />}
                {key === 'workshop' && <Activity className="w-3.5 h-3.5 shrink-0" />}
                {key === 'insurer' && <Landmark className="w-3.5 h-3.5 shrink-0" />}
                {role.title.split(' ')[0]}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRoleTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Description Column: 4/12 width */}
            <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-6 text-left self-start lg:sticky lg:top-20 shadow-[0_15px_40px_rgba(139,0,0,0.08)] hover:shadow-[0_25px_60px_rgba(139,0,0,0.15)] hover:-translate-y-1 transition-all duration-300">
              <div className="space-y-3">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">
                  {featureGroups[activeRoleTab].title}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed">
                  {featureGroups[activeRoleTab].description}
                </p>
              </div>

              {/* Unique illustrative statistics mini-box */}
              <div className="bg-slate-50/70 border border-slate-100 p-4.5 rounded-2xl font-mono text-[11px] space-y-2 text-slate-600 shadow-inner">
                <div className="text-[#8B0000] font-extrabold uppercase text-[9.5px] tracking-widest pb-1 border-b border-slate-100/50">
                  OUR VERIFIED STANDARDS
                </div>
                <div className="flex justify-between">
                  <span>Fast Checker Dispatch:</span>
                  <strong className="text-slate-900 font-black">Under 3 Mins</strong>
                </div>
                <div className="flex justify-between">
                  <span>Information Accuracy:</span>
                  <strong className="text-[#8B0000] font-black">99.98% SLA</strong>
                </div>
                <div className="flex justify-between">
                  <span>Total Records Checked:</span>
                  <strong className="text-slate-900 font-black">1.48M Records</strong>
                </div>
              </div>

              {/* Core trigger button with tactile 3D style */}
              <button
                type="button"
                onClick={() => {
                  if (activeRoleTab === 'dealer' && onNavigateToBusiness) {
                    onNavigateToBusiness();
                  } else if (onNavigateToSignup) {
                    onNavigateToSignup();
                  }
                }}
                className="w-full bg-gradient-to-r from-[#8B0000] to-[#b30000] hover:brightness-110 text-white font-extrabold uppercase py-3.5 rounded-xl text-xs tracking-widest transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_4px_18px_rgba(139,0,0,0.35)] hover:shadow-[0_6px_22px_rgba(139,0,0,0.45)] active:translate-y-[1px] active:shadow-[0_2px_10px_rgba(139,0,0,0.2)]"
              >
                {featureGroups[activeRoleTab].actionText} <ArrowRight className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Right Interactive Feature Cards Column: 8/12 width */}
            <div className="lg:col-span-8 space-y-4">
              {featureGroups[activeRoleTab].features.map((feat) => {
                const isExpanded = expandedFeatureId === feat.id;

                return (
                  <div 
                    key={feat.id}
                    id={`feature-card-${feat.id}`}
                    onClick={() => setExpandedFeatureId(isExpanded ? null : feat.id)}
                    className={`bg-white border rounded-2xl transition-all duration-300 overflow-hidden text-left cursor-pointer select-none ${
                      isExpanded 
                        ? 'border-red-650/30 shadow-[0_12px_30px_rgba(139,0,0,0.12)] scale-[1.01] -translate-y-0.5' 
                        : 'border-slate-100 shadow-[0_4px_18px_rgba(0,0,0,0.03)] hover:border-red-650/20 hover:shadow-[0_12px_30px_rgba(139,0,0,0.08)] hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      {/* Left Header info */}
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm sm:text-base font-black text-slate-900 hover:text-red-650 transition-colors">
                          {feat.title}
                        </h4>
                      </div>

                      {/* Expand action handle */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="text-[9.5px] font-mono font-bold text-[#8B0000] uppercase tracking-wider opacity-80 decoration-dotted underline underline-offset-3">
                          {isExpanded ? 'Close Detail' : 'Inspect Feature'}
                        </span>
                        <div className={`w-6 h-6 rounded-full border border-slate-150 flex items-center justify-center transition-transform ${isExpanded ? 'rotate-90 text-red-600 bg-red-50/20' : 'text-slate-400 bg-slate-50'}`}>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>

                    </div>

                    {/* Explored Content details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-slate-100 bg-slate-50/50 overflow-hidden"
                        >
                          <div className="p-6 space-y-5">
                            
                            {/* Literal Description */}
                            <div className="space-y-1.5">
                              <h5 className="text-[10px] uppercase font-black tracking-widest text-slate-400">How it works:</h5>
                              <p className="text-xs text-slate-650 leading-relaxed font-normal">{feat.desc}</p>
                            </div>

                            {/* Core sub-benefits list */}
                            <div className="space-y-2">
                              <h5 className="text-[10px] uppercase font-black tracking-widest text-slate-400">What is included:</h5>
                              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {feat.benefits.map((b, bIdx) => (
                                  <li key={bIdx} className="flex items-start gap-2 text-xs text-slate-600 font-normal">
                                    <div className="w-4.5 h-4.5 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                                      <Check className="w-3 h-3 text-red-600" />
                                    </div>
                                    <span>{b}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Estimated business impact */}
                            <div className="bg-red-50 border border-red-200/50 rounded-xl p-3.5 flex items-start gap-3.5 font-mono text-[11px] text-slate-650">
                              <ShieldCheck className="w-5 h-5 text-[#8B0000] mt-0.5 shrink-0" />
                              <div className="space-y-0.5">
                                <strong className="text-slate-900 uppercase font-black">The Benefit:</strong>
                                <p className="font-normal leading-relaxed text-slate-650">{feat.impact}</p>
                              </div>
                            </div>

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                );
              })}
            </div>

          </motion.div>
        </AnimatePresence>

      </section>

      {/* ================= BENTO MATRIX: HIGH-EFFICIENCY GRID ================= */}
      <section className="bg-white py-16 md:py-20 border-t-2 border-b-2 border-slate-200" id="overall-capabilities-bento">
        <div className="max-w-[1240px] mx-auto px-4 space-y-12">
          
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-[#8B0000] tracking-tight uppercase">Platform Verification Pillar Grid</h2>
          </div>

          {/* Bento layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Item 1: Wide Odometer verification box */}
            <div className="md:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgba(139,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/5 rounded-full filter blur-2xl group-hover:bg-red-600/10 transition-all"></div>
              <div className="space-y-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-650 flex items-center justify-center font-bold">
                  <Clock className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-lg font-black uppercase text-slate-900 tracking-tight">Odometer Mileage History Check</h3>
                <p className="text-slate-600 text-xs font-normal leading-relaxed max-w-xl">
                  We connect directly to national vehicle databases. This allows us to instantly flag mileage scams by comparing the current mileage with old registry entries.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4 items-center text-[11px] font-mono z-10">
                <span className="bg-red-50 text-[#8B0000] px-2.5 py-0.5 rounded border border-red-200/50 font-bold">Real-time scanning</span>
                <span className="bg-red-50 text-[#8B0000] px-2.5 py-0.5 rounded border border-red-200/50 font-bold">Updated records</span>
              </div>
            </div>

            {/* Item 2: Small Paint depth box */}
            <div className="md:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between text-left space-y-6 group shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgba(139,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-650 flex items-center justify-center font-bold">
                  <Layers className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-lg font-black uppercase text-slate-900 tracking-tight">Digital Paint &amp; Collision Scan</h3>
                <p className="text-slate-600 text-xs font-normal leading-relaxed">
                  Identify hidden body damage or crash repairs using paint thickness scanners. Spot non-disclosed panel repairs instantly down to the millimeter.
                </p>
              </div>

              <div className="font-mono text-[10.5px] text-[#8B0000] font-black uppercase tracking-wider pt-2">
                100% mechanical paint accuracy •
              </div>
            </div>

            {/* Item 3: Small Cloud SQL backend telemetry box */}
            <div className="md:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 flex flex-col justify-between text-left space-y-6 group shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgba(139,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-650 flex items-center justify-center font-bold">
                  <Database className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-lg font-black uppercase text-slate-900 tracking-tight">Simple Vehicle VIN Search</h3>
                <p className="text-slate-600 text-xs font-normal leading-relaxed">
                  Get a clean history report that lists all past diagnostic codes, registration details, tax records, and safety stamps under the car's unique VIN.
                </p>
              </div>

              <div className="font-mono text-[10.5px] text-[#8B0000] font-black uppercase tracking-wider pt-2">
                Unified vehicle database •
              </div>
            </div>

            {/* Item 4: Wide Escrow DMV Gateway box */}
            <div className="md:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgba(139,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-600/5 rounded-full filter blur-2xl group-hover:bg-red-600/10 transition-all"></div>
              <div className="space-y-3 text-left">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-650 flex items-center justify-center font-bold">
                  <Landmark className="w-5.5 h-5.5" />
                </div>
                <h3 className="text-lg font-black uppercase text-slate-900 tracking-tight">Direct Online DMV Registration</h3>
                <p className="text-slate-600 text-xs font-normal leading-relaxed max-w-xl">
                  Transfer vehicle titles and register your car quickly online. Submit transfer documents and pay required registration fees in just a few minutes.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4 items-center text-[11px] font-mono z-10">
                <span className="bg-red-50 text-[#8B0000] px-2.5 py-0.5 rounded border border-red-200/50 font-bold">Secure connection</span>
                <span className="bg-red-50 text-[#8B0000] px-2.5 py-0.5 rounded border border-red-200/50 font-bold">Fully compliant</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= ROI SIMULATOR SECTION ================= */}
      <section className="max-w-[1240px] mx-auto px-4" id="roi-simulator-calculator">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-9 space-y-8 shadow-[0_15px_40px_rgba(139,0,0,0.06)]">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase leading-none">
              Calculate Your Savings &amp; Benefits
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pt-2">
            
            {/* Input params column: 6/12 */}
            <div className="md:col-span-6 space-y-6 text-left border-r border-slate-100 md:pr-8">
              
              {/* Parameter 1: User type (without SELECT USER MODE PROFILE label) */}
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'private', label: 'Private peer' },
                    { id: 'dealer', label: 'Dealerships' },
                    { id: 'workshop', label: 'Workshops' }
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSimType(p.id as any)}
                      className={`py-2 rounded-xl text-[10px] font-bold uppercase border transition-all cursor-pointer ${
                        simType === p.id 
                          ? 'bg-red-650 hover:bg-[#8B0000] border-transparent text-white shadow-xs' 
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parameter 2: Transaction Volume Range Slider */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-450 uppercase tracking-widest pb-1">
                  <span>Cars bought or sold per month:</span>
                  <span className="bg-red-55 text-red-650 font-mono text-xs px-2.5 py-0.5 rounded-md font-black">
                    {simVolume} {simVolume === 100 ? '100+' : ''} units
                  </span>
                </div>
                
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={simVolume}
                  onChange={(e) => setSimVolume(Number(e.target.value))}
                  className="w-full accent-[#8B0000] h-1.5 bg-slate-100 rounded-lg cursor-pointer transition-all"
                />

                <div className="flex justify-between text-[9px] font-mono text-slate-400 font-bold">
                  <span>1 CAR</span>
                  <span>50 CARS</span>
                  <span>100+ CARS</span>
                </div>
              </div>

              <p className="text-[10.5px] text-slate-400 leading-normal italic font-light">
                * Note: Estimates are based on average processing times, registration approvals, and escrow transactions.
              </p>

            </div>

            {/* Forecast Output column: 6/12 */}
            <div className="md:col-span-6 bg-gradient-to-br from-[#8B0000] to-[#660000] text-white rounded-2xl p-6 sm:p-8 space-y-6 text-left shadow-[0_12px_35px_rgba(139,0,0,0.25)] border border-[#8B0000]/20">
              
              <h4 className="text-[10px] font-bold text-amber-400 font-mono uppercase tracking-widest leading-none border-b border-white/5 pb-2">
                YOUR MONTHLY SAVINGS ESTIMATE
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* Metric 1: Hours Saved */}
                <div className="space-y-1">
                  <span className="text-[9.5px] font-mono text-red-200 uppercase tracking-wider block">Hours Saved</span>
                  <strong className="text-2xl sm:text-3xl font-black text-white font-mono block">
                    {roi.hoursSaved} hrs
                  </strong>
                  <span className="text-[9px] text-red-100 italic leading-none font-light block">Estimated monthly savings</span>
                </div>

                {/* Metric 2: Money Saved */}
                <div className="space-y-1">
                  <span className="text-[9.5px] font-mono text-red-200 uppercase tracking-wider block">Money Saved</span>
                  <strong className="text-2xl sm:text-3xl font-black text-amber-300 font-mono block">
                    €{roi.moneySaved.toLocaleString()}
                  </strong>
                  <span className="text-[9px] text-red-100 italic leading-none font-light block">Reduced transaction friction</span>
                </div>

                {/* Metric 3: Speed index multiplier */}
                <div className="space-y-1">
                  <span className="text-[9.5px] font-mono text-red-200 uppercase tracking-wider block">Trading Speed</span>
                  <strong className="text-2xl sm:text-3xl font-black text-white font-mono block">
                    {roi.speed}
                  </strong>
                  <span className="text-[9px] text-red-100 italic leading-none font-light block">Faster turnaround timeline</span>
                </div>

              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onNavigateToSignup}
                  className="w-full bg-white text-[#8B0000] hover:bg-red-50 font-extrabold text-[11px] uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-[0_4px_15px_rgba(255,255,255,0.15)] flex items-center justify-center gap-1.5 cursor-pointer border border-transparent"
                >
                  Start Saving For Free <ArrowRight className="w-4 h-4 text-[#8B0000]" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================= DETAILED CAPABILITIES TIER COMPARE ================= */}
      <section className="max-w-[1240px] mx-auto px-4" id="capabilities-comparison-table">
        <div className="space-y-6">
          <div className="text-left space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight uppercase">Capabilities Tier Breakdown</h3>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(139,0,0,0.06)]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-150 font-mono">
                    <th className="p-4.5 text-[10.5px] font-black uppercase tracking-wider text-slate-900">Platform Integration Suite</th>
                    <th className="p-4.5 text-[10.5px] font-black uppercase tracking-wider text-slate-600 text-center">Basic Tier</th>
                    <th className="p-4.5 text-[10.5px] font-black uppercase tracking-wider text-red-650 text-center">Verification Pro</th>
                    <th className="p-4.5 text-[10.5px] font-black uppercase tracking-wider text-slate-900 text-center">High Volume Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 text-xs text-slate-700">
                  
                  {/* Row 1 */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-800">
                      <div>Simple Odometer Mileage Checks</div>
                      <div className="text-[10px] text-slate-400 font-light font-sans pt-0.5">Check car mileage against official DMV records</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-slate-400 font-bold font-mono">15 scans per month</span>
                    </td>
                    <td className="p-4 text-center bg-red-50/10">
                      <span className="text-[#8B0000] font-black uppercase text-[10px] bg-red-50 px-2.5 py-0.5 rounded-full inline-block border border-red-200">UNLIMITED SCANS</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-slate-900 font-black uppercase text-[10px] bg-slate-100 px-2.5 py-0.5 rounded-full inline-block border border-slate-200">UNLIMITED SCANS</span>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-800">
                      <div>Secure Escrow Payments</div>
                      <div className="text-[10px] text-slate-400 font-light font-sans pt-0.5">Hold buyer money safely until registration is done</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-red-650 font-black shrink-0 font-mono text-sm leading-none">✕</span>
                    </td>
                    <td className="p-4 text-center bg-red-50/10">
                      <span className="text-slate-900 font-bold font-sans text-xs">Included (2% fee)</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-[#8B0000] font-black uppercase text-[10px] bg-red-50 px-2.5 py-0.5 rounded-full inline-block border border-red-200">0.5% fee limit</span>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-800">
                      <div>Multi-Site Listing Sync</div>
                      <div className="text-[10px] text-slate-400 font-light font-sans pt-0.5">Post verified listings to other vehicle sites easily</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-red-650 font-black shrink-0 font-mono text-sm leading-none">✕</span>
                    </td>
                    <td className="p-4 text-center bg-red-50/10">
                      <span className="text-slate-650 font-medium">3 sites enabled</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-slate-900 font-black uppercase text-[10px] bg-slate-100 px-2.5 py-0.5 rounded-full inline-block border border-slate-200">FULL DIRECT SYNC</span>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-800">
                      <div>Paint Damage Heatmaps</div>
                      <div className="text-[10px] text-slate-400 font-light font-sans pt-0.5">Check paint thickness measurements on-screen</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-slate-500 font-mono">Simple numbers only</span>
                    </td>
                    <td className="p-4 text-center bg-red-50/10">
                      <span className="text-slate-900 font-mono font-bold">Full color heatmaps</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-[#8B0000] font-black uppercase text-[10px] bg-red-50 px-2.5 py-0.5 rounded-full inline-block border border-red-200">Detailed 3D scanners</span>
                    </td>
                  </tr>

                  {/* Row 5 */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-800">
                      <div>Priority Support Line</div>
                      <div className="text-[10px] text-slate-400 font-light font-sans pt-0.5">Direct help from our vehicle support team</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-slate-400 font-sans">Help articles only</span>
                    </td>
                    <td className="p-4 text-center bg-red-50/10">
                      <span className="text-slate-700 font-mono text-xs font-bold">Under 24 hours reply</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className="text-[#8B0000] font-black uppercase text-[10px] bg-red-50 px-2.5 py-0.5 rounded-full inline-block border border-red-200">Immediate support</span>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

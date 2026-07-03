/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Building, Warehouse, Code, Sparkles, Globe, ChevronRight, Check, 
  ArrowRight, Layers, Cpu, TrendingUp, Send, Briefcase, Clock, 
  Mail, Phone, Users, Database, ShieldCheck, HelpCircle, Activity,
  FileCheck, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Interfaces for our B2B sections
interface CaseStudy {
  id: string;
  clientName: string;
  location: string;
  logoText: string;
  title: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    label: string;
  }[];
  heroImage: string;
}

export default function ForBusiness() {
  // Navigation & Interactive Tabs for Enterprise Features Section
  const [activeFeatureTab, setActiveFeatureTab] = useState<'warehouse' | 'supplier' | 'advertising'>('warehouse');

  // --- TAB 1: Multi-Branch & Multi-Warehouse Interactive Simulator State ---
  const [sourceWarehouse, setSourceWarehouse] = useState<string>('Vilnius Hub');
  const [destWarehouse, setDestWarehouse] = useState<string>('Warsaw Depot');
  const [simulateUnits, setSimulateUnits] = useState<number>(45);
  const [isSimulatingLogistics, setIsSimulatingLogistics] = useState<boolean>(false);
  const [logisticsLogs, setLogisticsLogs] = useState<string[]>([]);
  const [transitComplete, setTransitComplete] = useState<boolean>(false);

  // --- TAB 2: Large Supplier API Playground State ---
  const [partsSku, setPartsSku] = useState<string>('SKU-BREM-CERAMIC-992');
  const [partsPrice, setPartsPrice] = useState<number>(345.50);
  const [targetVinPrefix, setTargetVinPrefix] = useState<string>('WP0AB2A92M');
  const [isTestingApi, setIsTestingApi] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<any | null>(null);

  // --- TAB 3: Advertising at Scale Simulator State ---
  const [inventoryCount, setInventoryCount] = useState<number>(180);
  const [campaignFocus, setCampaignFocus] = useState<'performance' | 'suv' | 'luxury'>('luxury');
  const [estBudget, setEstBudget] = useState<number>(2500);

  // --- CASE STUDIES DATA ---
  const caseStudies: CaseStudy[] = [
    {
      id: 'cs-1',
      clientName: 'Baltics Motor Group',
      location: 'Vilnius, Tallinn & Riga',
      logoText: 'BMG',
      title: 'Synchronizing Multi-Branch Logistics Across Sovereign Frontiers',
      challenge: 'Managing fragmented independent ERP inventory tables across 3 separate Baltic branches, leading to stale car listings and double-booking customer consultations.',
      solution: 'Deployed the JustCarSale Multi-Warehouse core router, linking their central Vilnius storage database to Klaipėda Seaport custom routes and external Riga listings instantly.',
      results: [
        { metric: '1.2s', label: 'Average Sync Latency' },
        { metric: '+34%', label: 'Listing Conversion Rate' },
        { metric: '0%', label: 'Double-Booking Incidents' }
      ],
      heroImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'cs-2',
      clientName: 'Nordic Parts Syndicate',
      location: 'Gdynia & Klaipėda Seaports',
      logoText: 'NPS',
      title: 'API Pipelines to Route 180,000+ Spare Parts Directly to Buyers',
      challenge: 'Pris-setting and delivery delays for high-margin performance brake pads and custom ceramic rotors due to matching errors with local customer VIN prefixes.',
      solution: 'Streamlined synchronization with our Large Supplier REST API checkup pipeline, matching compatible chassis numbers automatically before export.',
      results: [
        { metric: '185,000', label: 'Synchronized SKUs' },
        { metric: '€1.4M', label: 'Quarterly Spare Revenue' },
        { metric: '+48%', label: 'Logistics Desk Efficiency' }
      ],
      heroImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'cs-3',
      clientName: 'Apex Premium Fleet Inc',
      location: 'Continental European Network',
      logoText: 'APEX',
      title: 'Scaling Campaign Outreach and Search Placement Automated Ads',
      challenge: 'Inefficient manual advertising processes for dynamic inventory lines under performing across regional search boards.',
      solution: 'Authorized automatic programmatic scale campaigns, pushing certified premium visual banners and localized placement boosts to qualified commercial leads.',
      results: [
        { metric: '20M+', label: 'Monthly Search Impressions' },
        { metric: '-42%', label: 'Overall CPC Overhead' },
        { metric: '6.8x', label: 'Advertising ROAS Lift' }
      ],
      heroImage: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const [activeCaseStudyIndex, setActiveCaseStudyIndex] = useState<number>(0);

  // --- DEMO REQUEST FORM STATE ---
  const [demoForm, setDemoForm] = useState({
    companyName: '',
    techEmail: '',
    contactName: '',
    phone: '',
    primaryInterest: 'warehouse-sync',
    estVolume: '100-500',
    notes: ''
  });
  const [isSubmittingDemo, setIsSubmittingDemo] = useState<boolean>(false);
  const [demoSubmitted, setDemoSubmitted] = useState<boolean>(false);
  const [generatedMeetingId, setGeneratedMeetingId] = useState<string>('');

  // --- REACTION ACTIONS INTERACTIVE SIMULATORS ---

  // 1. Warehouse Transfer Simulation
  const handleStartWarehouseSimulation = () => {
    if (sourceWarehouse === destWarehouse) {
      alert("Please choose matching differences for origin and target destinations!");
      return;
    }
    setIsSimulatingLogistics(true);
    setTransitComplete(false);
    setLogisticsLogs([
      `[INFO] Initializing route check from ${sourceWarehouse} and ${destWarehouse}...`,
    ]);

    setTimeout(() => {
      setLogisticsLogs(prev => [
        ...prev,
        `[AUDIT] Validating ${simulateUnits} premium units at safety threshold...`,
        `[ROUTING] Connected to secure Baltic Transit border customs tunnel.`
      ]);
    }, 700);

    setTimeout(() => {
      setLogisticsLogs(prev => [
        ...prev,
        `[SYNC] Synchronizing central ledger database at Lithuania and regional hubs...`,
        `[SUCCESS] Multi-branch inventory updated instantly across Baltic platforms!`
      ]);
      setTransitComplete(true);
      setIsSimulatingLogistics(false);
    }, 1600);
  };

  // 2. REST API Test Output Simulator
  const handleTestApiCall = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTestingApi(true);
    setApiResponse(null);

    setTimeout(() => {
      setIsTestingApi(false);
      setApiResponse({
        status: "success",
        code: 201,
        message: "Enterprise supplier catalog synchronized efficiently in 3 regional zones.",
        transactionId: `tx_b2b_sync_${Math.random().toString(36).substring(2, 10)}`,
        timestamp: new Date().toISOString(),
        validationContext: {
          processedPartSku: partsSku,
          resolvedFitmentPrefix: targetVinPrefix.toUpperCase(),
          registeredInvoicePrice: `€${partsPrice.toFixed(2)}`,
          customsAuthorizationStatus: "CLEARED"
        },
        indexingLogs: [
          "[REST-GATEWAY] Token verified scope 'parts_supplier:write'",
          `[FITMENT-CHECK] Successfully mapped prefix '${targetVinPrefix.toUpperCase()}' to 24 matching active dealer units`,
          "[INDEX-ENGINE] Dispatched webhook broadcast to Baltic marketplaces"
        ]
      });
    }, 1200);
  };

  // 3. Scale Advertising Estimator Calculations
  const calculatedTrafficScale = Math.round(inventoryCount * 140);
  const calculatedAdClicks = Math.round(calculatedTrafficScale * 0.082);
  const campaignBudgetSugg = Math.round(inventoryCount * 12.5);

  // 4. Demo Submit Handler
  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoForm.companyName || !demoForm.techEmail || !demoForm.contactName) {
      alert("Please fill out all required fields to register your demo scheduling.");
      return;
    }
    setIsSubmittingDemo(true);

    setTimeout(() => {
      const generatedId = `MEET-B2B-${Math.floor(100000 + Math.random() * 900000)}`;
      setGeneratedMeetingId(generatedId);
      setIsSubmittingDemo(false);
      setDemoSubmitted(true);
    }, 1500);
  };

  const handleResetDemo = () => {
    setDemoForm({
      companyName: '',
      techEmail: '',
      contactName: '',
      phone: '',
      primaryInterest: 'warehouse-sync',
      estVolume: '100-500',
      notes: ''
    });
    setDemoSubmitted(false);
  };

  return (
    <div className="space-y-10 py-4" id="enterprise-solutions-root">
      
      {/* ============================================================== */}
      {/* 1. HERO HEADER BANNER GROUP */}
      {/* ============================================================== */}
      <section className="text-center space-y-4 max-w-4xl mx-auto px-4" id="enterprise-hero-section">
        
        <h1 className="text-2xl sm:text-3.5xl font-extrabold text-[#8B0000] tracking-tight leading-none uppercase font-display">
          Global Automotive Enterprise Scaling
        </h1>
        
        <p className="text-slate-500 text-xs sm:text-xs font-light max-w-xl mx-auto leading-relaxed">
          Robust programmatic databases, multi-branch supply routing infrastructure, and automated advertising solutions built to optimize your margin and reach across global borders.
        </p>

        <div className="flex justify-center gap-3 pt-1.5">
          <a
            href="#demo-request-section"
            className="bg-[#8B0000] hover:bg-red-700 text-white text-[9.5px] font-bold uppercase tracking-wider px-6 py-3 rounded-lg transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <span>Request Demo Consultation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          <a
            href="#features-overview-section"
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[9.5px] font-bold uppercase tracking-wider px-6 py-3 rounded-lg transition-all"
          >
            Explore Feature Capabilities
          </a>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. SECTION: ENTERPRISE FEATURE OVERVIEW PLUGINS (INTERACTIVE) */}
      {/* ============================================================== */}
      <section className="max-w-[1140px] mx-auto px-4 space-y-6 text-left" id="features-overview-section">
        
        <div className="text-center md:text-left space-y-1 border-b border-slate-100 pb-4 max-w-4xl">
          <h2 className="text-lg font-extrabold text-slate-900 tracking-tight uppercase flex items-center justify-center md:justify-start gap-1.5">
            <Cpu className="w-5 h-5 text-[#8B0000]" />
            <span>1. Enterprise Feature Overview Suite</span>
          </h2>
          <p className="text-slate-500 text-[11.5px] font-light leading-relaxed">
            Choose an enterprise capability below to load its dedicated sandbox, permitting you to test real-time ledger synchronizations and program logistics models instantly.
          </p>
        </div>

        {/* Feature Switches */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 bg-slate-50 border border-slate-200 p-1.5 rounded-xl max-w-3xl mx-auto md:mx-0">
          
          <button
            onClick={() => setActiveFeatureTab('warehouse')}
            className={`py-3 px-4 rounded-lg text-[10.5px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeFeatureTab === 'warehouse'
                ? 'bg-[#8B0000] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Warehouse className="w-4 h-4 shrink-0" />
            <div className="text-left font-mono">
              <span>Multi-Warehouse Support</span>
            </div>
          </button>

          <button
            onClick={() => setActiveFeatureTab('supplier')}
            className={`py-3 px-4 rounded-lg text-[10.5px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeFeatureTab === 'supplier'
                ? 'bg-[#8B0000] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code className="w-4 h-4 shrink-0" />
            <div className="text-left font-mono">
              <span>Large Supplier Tools</span>
            </div>
          </button>

          <button
            onClick={() => setActiveFeatureTab('advertising')}
            className={`py-3 px-4 rounded-lg text-[10.5px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeFeatureTab === 'advertising'
                ? 'bg-[#8B0000] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4 shrink-0" />
            <div className="text-left font-mono">
              <span>Advertising At Scale</span>
            </div>
          </button>

        </div>

        {/* Dynamic Display Area of selected feature tab */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
          
          {/* LEFT EXPLANATORY FRAME: 5 columns */}
          <div className="lg:col-span-5 space-y-4 text-left">
            {activeFeatureTab === 'warehouse' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <h3 className="text-lg font-extrabold text-slate-900 uppercase">Seamless Multi-Warehouse Synchronization</h3>
                <p className="text-slate-500 text-xs font-light leading-relaxed">
                  Avoid inventory bottlenecks across sovereign Baltic hubs. Programmatically coordinate physical car stocks, tire slots, and heavy machinery parts catalogs between separate branches simultaneously.
                </p>
                
                <ul className="space-y-3.5 pt-2">
                  <li className="flex items-start gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-slate-900 block">Sovereign Freight Clearance</strong>
                      Track customs validation stamps (e.g. Lithuania/Poland) from a unified parent terminal block dashboard.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-slate-900 block">Automatic Re-Routing Logic</strong>
                      Re-allocate units automatically if delivery weight or regional vehicle tax limits undergo shifts.
                    </div>
                  </li>
                </ul>
              </motion.div>
            )}

            {activeFeatureTab === 'supplier' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <h3 className="text-lg font-extrabold text-slate-900 uppercase">Robust Developer Tools for Large Suppliers</h3>
                <p className="text-slate-500 text-xs font-light leading-relaxed">
                  Bulk synchronize hundreds of thousands of active stock values via automated JSON schemas. Match high-fidelity parts with target vehicle chassis codes using programmatic VIN-check prefixes.
                </p>

                <ul className="space-y-2.5 pt-1">
                  <li className="flex items-start gap-2 text-xs text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-slate-900 block">EUM Customs Alignment</strong>
                      Configure tax profiles and duty parameters instantly for Warsaw, Riga, and Klaipėda distribution circles.
                    </div>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-slate-900 block">99.9% REST Gateway SLA</strong>
                      Process rapid batch listings securely, guaranteed by server-isolated execution logs.
                    </div>
                  </li>
                </ul>
              </motion.div>
            )}

            {activeFeatureTab === 'advertising' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <h3 className="text-lg font-extrabold text-slate-900 uppercase">Localized & High-Scale Target Advertising</h3>
                <p className="text-slate-500 text-xs font-light leading-relaxed">
                  Unlock dynamic listing syndication engines. Promote thousands of active vehicles instantly to top European portals, managing multi-tier marketing spend dynamically using automated triggers.
                </p>

                <ul className="space-y-2.5 pt-1">
                  <li className="flex items-start gap-2 text-xs text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-slate-900 block">AI Placement Allocation</strong>
                      Direct placement budget automatically to high-margin models or localized performance categories.
                    </div>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-slate-900 block">High ROAS Syndication</strong>
                      Track localized lead click frequencies across Google ecosystems, Baltic databases, and social banners.
                    </div>
                  </li>
                </ul>
              </motion.div>
            )}
          </div>

          {/* RIGHT PLAYGROUND PANEL */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm text-left">
            
            {/* PILLAR 1 PLAYGROUND: Warehouse Logistics routing */}
            {activeFeatureTab === 'warehouse' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-150 pb-2">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Logistics Route Planner</span>
                  <Activity className="w-3.5 h-3.5 text-[#8B0000] animate-pulse" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase font-bold text-slate-450 block tracking-wider font-mono">Source Branch Hub</label>
                    <select
                      value={sourceWarehouse}
                      onChange={(e) => setSourceWarehouse(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-[10.5px] text-slate-800 font-semibold focus:outline-none"
                    >
                      <option value="Vilnius Hub">Vilnius Central Hub (LT)</option>
                      <option value="Klaipėda Maritime Terminal">Klaipėda Maritime (LT)</option>
                      <option value="Warsaw Depot">Warsaw regional depot (PL)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] uppercase font-bold text-slate-450 block tracking-wider font-mono">Target Logistics Depot</label>
                    <select
                      value={destWarehouse}
                      onChange={(e) => setDestWarehouse(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-[10.5px] text-slate-800 font-semibold focus:outline-none"
                    >
                      <option value="Vilnius Hub">Vilnius Central Hub (LT)</option>
                      <option value="Klaipėda Maritime Terminal">Klaipėda Maritime (LT)</option>
                      <option value="Warsaw Depot">Warsaw regional depot (PL)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex justify-between text-[8px] uppercase font-mono tracking-wider font-bold text-slate-450 mb-1.5">
                    <span>Batch Volume to Despatch</span>
                    <span className="text-[#8B0000] font-bold font-mono">{simulateUnits} Cargo Units</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="500"
                    step="5"
                    value={simulateUnits}
                    onChange={(e) => setSimulateUnits(Number(e.target.value))}
                    className="w-full h-1 bg-slate-100 rounded appearance-none cursor-pointer accent-[#8B0000]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleStartWarehouseSimulation}
                  disabled={isSimulatingLogistics}
                  className="w-full bg-[#8B0000] hover:bg-neutral-900 text-white text-[9px] font-bold uppercase tracking-wider py-3 rounded-lg transition-all cursor-pointer text-center"
                >
                  {isSimulatingLogistics ? "Scheduling Transit Ledger Routing..." : "Trigger Multi-Warehouse Transfer"}
                </button>

                {/* Clean Status Summary Card */}
                {logisticsLogs.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                      <span className={`h-2 w-2 rounded-full ${transitComplete ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                      <span>{transitComplete ? "Transfer Completed" : "Transfer in Progress..."}</span>
                    </div>
                    <p className="text-slate-550 text-[11px] leading-relaxed">
                      {transitComplete 
                        ? `All ${simulateUnits} premium units have been successfully transferred from ${sourceWarehouse} to ${destWarehouse}. Inventory tables and border custom logs have been updated.`
                        : `Establishing secure route check between ${sourceWarehouse} and ${destWarehouse}. Checking volume limits for ${simulateUnits} cargo units.`}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* PILLAR 2 PLAYGROUND: REST API JSON payload builder */}
            {activeFeatureTab === 'supplier' && (
              <form onSubmit={handleTestApiCall} className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-150 pb-2">
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Supplier API Integrator</span>
                  <span className="bg-red-50 text-[#8B0000] text-[8px] font-bold px-1.5 py-0.5 rounded">Active Handshake</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider font-mono">Catalog Parts SKU</label>
                    <input
                      type="text"
                      required
                      value={partsSku}
                      onChange={(e) => setPartsSku(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg font-mono text-[10.5px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider font-mono">Trade Price (EUR)</label>
                    <input
                      type="number"
                      required
                      value={partsPrice}
                      onChange={(e) => setPartsPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg font-mono text-[10.5px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider font-mono">Fitment VIN Prefix</label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      value={targetVinPrefix}
                      onChange={(e) => setTargetVinPrefix(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-lg font-mono text-[10.5px]"
                    />
                  </div>
                </div>

                <div className="flex justify-start gap-2 pt-0.5">
                  <button
                    type="submit"
                    disabled={isTestingApi}
                    className="bg-[#8B0000] hover:bg-neutral-900 text-white text-[9.5px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg transition-all cursor-pointer"
                  >
                    {isTestingApi ? "Validating Bearer Schema..." : "Test REST Endpoint"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPartsSku('SKU-BREM-CERAMIC-992'); setPartsPrice(345.50); setTargetVinPrefix('WP0AB2A92M'); setApiResponse(null); }}
                    className="border border-slate-200 hover:bg-slate-50 px-4 py-2.5 rounded-lg text-[9.5px] font-bold text-slate-500 transition-all uppercase"
                  >
                    Reset Schema
                  </button>
                </div>

                <AnimatePresence>
                  {isTestingApi && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-slate-500 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                      <span>Validating credentials and dispatching request...</span>
                    </motion.div>
                  )}

                  {apiResponse && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2 text-left"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>API Call Completed (Status 201)</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        Supplier catalog has been synchronized for SKU <span className="font-mono font-bold text-slate-800">{partsSku}</span>. Chassis compatibility for prefix <span className="font-mono font-bold text-slate-800">{targetVinPrefix.toUpperCase()}</span> has been verified and registered.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            )}

            {/* PILLAR 3 PLAYGROUND: Ads at scale estimator */}
            {activeFeatureTab === 'advertising' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-150 pb-2">
                  <span className="text-[9px] font-bold uppercase text-slate-400 font-mono">Scaled Syndication Calculator</span>
                  <TrendingUp className="w-3.5 h-3.5 text-[#8B0000]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase font-bold text-slate-450 block tracking-wider font-mono">Dynamic Campaign Focus</label>
                    <div className="flex gap-1.5 pt-0.5">
                      {(['luxury', 'suv', 'performance'] as const).map((focus) => (
                        <button
                          key={focus}
                          type="button"
                          onClick={() => setCampaignFocus(focus)}
                          className={`flex-1 py-1.5 px-2 text-[8.5px] uppercase font-bold tracking-tight rounded-lg border transition-all cursor-pointer ${
                            campaignFocus === focus
                              ? 'bg-[#8B0000] text-white border-transparent shadow-sm'
                              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {focus}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Est. Search Spot CPC</label>
                    <div className="bg-slate-50 border border-slate-200 px-3.5 h-[34px] flex items-center rounded-lg font-mono text-[10.5px] font-semibold text-slate-700">
                      €0.42 / click fixed
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex justify-between text-[8px] uppercase font-mono font-bold tracking-wider text-slate-450 mb-1.5">
                    <span>Active Dealer Listings to Syndicate</span>
                    <span className="text-[#8B0000] font-bold font-mono">{inventoryCount} Active Vehicles</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={inventoryCount}
                    onChange={(e) => setInventoryCount(Number(e.target.value))}
                    className="w-full h-1 bg-slate-100 rounded appearance-none cursor-pointer accent-[#8B0000]"
                  />
                </div>

                <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-[10px] space-y-2">
                  <div className="flex justify-between text-slate-500">
                    <span>Predicted Monthly Search Impressions:</span>
                    <span className="font-mono text-slate-800 font-semibold">~{calculatedTrafficScale.toLocaleString()} spots</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Estimated Conversion Clicks (8.2% CTR):</span>
                    <span className="font-mono text-slate-800 font-semibold">{calculatedAdClicks} clicks</span>
                  </div>
                  <hr className="border-slate-200/50" />
                  <div className="flex justify-between items-center font-bold text-slate-900">
                    <span>Suggested Monthly Scaling Budget:</span>
                    <span className="font-mono text-[#8B0000] text-[11px]">€{campaignBudgetSugg.toLocaleString()} / month</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </section>

      {/* ============================================================== */}
      {/* 3. SECTION: CASE STUDIES PORTFOLIO (NEW & POLISHED) */}
      {/* ============================================================== */}
      <section className="bg-slate-50 border-y border-slate-200 py-12 text-left" id="case-studies-section">
        <div className="max-w-[1140px] mx-auto px-4 space-y-8">
          
          <div className="text-center space-y-1.5 max-w-2xl mx-auto mb-4">
            <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight uppercase">
              2. Real Automotive Case Studies
            </h2>
            <p className="text-slate-500 text-xs font-light leading-relaxed">
              Discover how leading cross-border dealerships, maritime freight coordinators, and spare suppliers transformed their operations using our APIs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch pt-1">
            
            {/* Quick selectors for Case Studies: 4 columns */}
            <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
              {caseStudies.map((cs, idx) => (
                <button
                  key={cs.id}
                  type="button"
                  onClick={() => setActiveCaseStudyIndex(idx)}
                  className={`w-full p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                    activeCaseStudyIndex === idx
                      ? 'bg-[#8B0000] border-transparent text-white shadow-lg'
                      : 'bg-white border-slate-200 hover:border-slate-350 text-slate-800'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5 group">
                    <span className={`text-[8.5px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                      activeCaseStudyIndex === idx ? 'bg-white text-[#8B0000]' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {cs.clientName}
                    </span>
                    <span className={`text-[8.5px] font-mono ${activeCaseStudyIndex === idx ? 'text-white/80' : 'text-slate-400'}`}>{cs.location}</span>
                  </div>
                  <h4 className="text-[11px] font-bold uppercase tracking-tight leading-snug line-clamp-2">
                    {cs.title}
                  </h4>
                </button>
              ))}
            </div>

            {/* Showcase details viewer: 8 columns */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2">
              
              {/* Image Frame */}
              <div className="relative h-44 md:h-full bg-slate-100">
                <img
                  src={caseStudies[activeCaseStudyIndex].heroImage}
                  alt={caseStudies[activeCaseStudyIndex].clientName}
                  className="w-full h-full object-cover filter brightness-90 animate-fadeIn"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white space-y-0.5">
                  <span className="text-[7.5px] tracking-widest font-mono uppercase bg-neutral-900 border border-white/10 px-1.5 py-0.5 rounded text-red-500 font-bold block w-fit">
                    CASE STUDY SUMMARY
                  </span>
                  <h3 className="font-extrabold text-[11px] uppercase font-display leading-tight">
                    {caseStudies[activeCaseStudyIndex].clientName}
                  </h3>
                </div>
              </div>

              {/* Text Context Frame */}
              <div className="p-6 sm:p-7 flex flex-col justify-between space-y-4">
                
                <div className="space-y-3.5">
                  <div>
                    <h3 className="text-[8.5px] tracking-widest text-[#8B0000] uppercase font-mono font-bold block">THE CHALLENGE</h3>
                    <p className="text-slate-500 text-[11px] font-light leading-relaxed mt-1">
                      {caseStudies[activeCaseStudyIndex].challenge}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-[8.5px] tracking-widest text-[#8B0000] uppercase font-mono font-bold block">SOLUTION BY JUSTCARSALE</h3>
                    <p className="text-slate-700 text-[11px] font-semibold leading-relaxed mt-1">
                      {caseStudies[activeCaseStudyIndex].solution}
                    </p>
                  </div>
                </div>

                {/* Key results tags */}
                <div className="border-t border-slate-100 pt-3 space-y-2.5">
                  <span className="text-[8px] uppercase font-bold text-slate-400 font-mono block">VERIFIED EFFICIENCY METRICS</span>
                  <div className="grid grid-cols-3 gap-2">
                    {caseStudies[activeCaseStudyIndex].results.map((res, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-center">
                        <span className="text-[11px] md:text-xs block font-bold text-[#8B0000] font-mono leading-tight">
                          {res.metric}
                        </span>
                        <span className="text-[7px] text-slate-405 block leading-tight tracking-tight mt-0.5 uppercase">
                          {res.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. SECTION: B2B DIRECT CONTACT & DEMO REQUEST FORM */}
      {/* ============================================================== */}
      <section className="max-w-2xl mx-auto px-4 text-left" id="demo-request-section">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
          
          <div className="text-center space-y-1">
            <h2 className="text-xl font-extrabold text-slate-950 uppercase">
              3. Custom Demo & Contact Registry
            </h2>
            <p className="text-slate-500 text-[11px] font-light max-w-md mx-auto leading-normal">
              Authorize deep programmatic connections. Let our core engineering team build a matching diagnostic integration plan for your team.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!demoSubmitted ? (
              <motion.form
                key="demo-form"
                onSubmit={handleDemoSubmit}
                className="space-y-3.5 pt-4 border-t border-slate-100 font-semibold text-xs text-slate-700"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[8.5px] uppercase font-mono tracking-wider text-slate-400 font-bold">Contact Representative Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Tomas Kuliešius"
                      value={demoForm.contactName}
                      onChange={(e) => setDemoForm({ ...demoForm, contactName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#8B0000] px-3.5 py-2.5 rounded-xl font-medium outline-none text-slate-850 transition-all text-[11px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8.5px] uppercase font-mono tracking-wider text-slate-400 font-bold">Company Legal Trade Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Baltics Logistics Baltic UAB"
                      value={demoForm.companyName}
                      onChange={(e) => setDemoForm({ ...demoForm, companyName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#8B0000] px-3.5 py-2.5 rounded-xl font-medium outline-none text-slate-850 transition-all text-[11px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[8.5px] uppercase font-mono tracking-wider text-slate-400 font-bold">Corporate Representative Email *</label>
                    <input
                      required
                      type="email"
                      placeholder="e.g. t.kuliesius@balticsgroup.com"
                      value={demoForm.techEmail}
                      onChange={(e) => setDemoForm({ ...demoForm, techEmail: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#8B0000] px-3.5 py-2.5 rounded-xl font-medium outline-none text-slate-850 transition-all text-[11px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8.5px] uppercase font-mono tracking-wider text-slate-400 font-bold">Hotline Telephone (Optional)</label>
                    <input
                      type="tel"
                      placeholder="e.g. +370 6 789 1234"
                      value={demoForm.phone}
                      onChange={(e) => setDemoForm({ ...demoForm, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#8B0000] px-3.5 py-2.5 rounded-xl font-medium outline-none text-slate-850 transition-all text-[11px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[8.5px] uppercase font-mono tracking-wider text-slate-400 font-bold">Primary Integration Interest</label>
                    <select
                      value={demoForm.primaryInterest}
                      onChange={(e) => setDemoForm({ ...demoForm, primaryInterest: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[10.5px] text-slate-800 font-bold focus:outline-none"
                    >
                      <option value="warehouse-sync">Multi-Branch Sync (Pillar 1)</option>
                      <option value="supplier-api">Supplier REST pipelines (Pillar 2)</option>
                      <option value="advertising-scale">Advertising Syndication tools (Pillar 3)</option>
                      <option value="rest-full-suite">Universal API Enterprise Suite</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8.5px] uppercase font-mono tracking-wider text-slate-400 font-bold">Estimated Listings Volume</label>
                    <select
                      value={demoForm.estVolume}
                      onChange={(e) => setDemoForm({ ...demoForm, estVolume: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-[10.5px] text-slate-800 font-bold focus:outline-none"
                    >
                      <option value="10-99">10 - 99 vehicles / parts catalog</option>
                      <option value="100-500">100 - 500 vehicles / parts catalog</option>
                      <option value="500-2000">500 - 2,000 vehicles / parts catalog</option>
                      <option value="over-2000">2,000+ High Scale Volume</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[8.5px] uppercase font-mono tracking-wider text-slate-400 font-bold">Custom Scope Context Requirements / Notes</label>
                  <textarea
                    placeholder="Provide details about your current ERP systems, specific branch distribution hubs, or general programmatic milestones..."
                    value={demoForm.notes}
                    onChange={(e) => setDemoForm({ ...demoForm, notes: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#8B0000] p-3.5 rounded-xl font-medium outline-none text-slate-800 min-h-[85px] leading-relaxed text-[11px]"
                  />
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-2.5 text-slate-500 leading-relaxed text-[9.5px] font-sans">
                  <ShieldCheck className="w-4.5 h-4.5 text-[#8B0000] shrink-0 mt-0.5" />
                  <div>
                    By submitting this secure proposal, you consent to automatic email dispatch mapping. Selected representatives are verified in real time under international trade registries.
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingDemo}
                  className="w-full bg-[#8B0000] hover:bg-neutral-900 text-white font-bold uppercase py-3.5 rounded-xl text-[10.5px] tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmittingDemo ? (
                    <>
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 text-white" />
                      <span>Submit Demo Request</span>
                    </>
                  )}
                </button>

              </motion.form>
            ) : (
              <motion.div
                key="submitted-card"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4 py-6 animate-fadeIn"
              >
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <FileCheck className="w-6 h-6" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-extrabold text-slate-900 uppercase">
                    Inquiry Verified &amp; Scheduled!
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">
                    Thank you <b>{demoForm.contactName}</b>. Our enterprise solutions lead representing the Baltic circle will join you shortly.
                  </p>
                </div>

                <div className="bg-slate-950 border text-slate-400 p-4 rounded-xl max-w-sm mx-auto font-mono text-[9px] text-left space-y-1">
                  <div className="text-[#8B0000] font-bold uppercase text-[8px] mb-1">AUTOMATED DEMO DISPATCH RECEIPT</div>
                  <div>- PROPOSAL ID: <span className="text-white font-semibold">{generatedMeetingId}</span></div>
                  <div>- INTEREST: <span className="text-white">
                    {demoForm.primaryInterest === 'warehouse-sync' ? 'Multi-Branch Support' : 
                     demoForm.primaryInterest === 'supplier-api' ? 'Supplier REST API' : 
                     demoForm.primaryInterest === 'advertising-scale' ? 'Ad Scale Syndication' : 'Universal Suite'}
                  </span></div>
                  <div>- ORG SCALE: <span className="text-white uppercase">{demoForm.estVolume} units</span></div>
                  <div>- EST RESPONSE: <span className="text-blue-400 font-bold">€0.00 Free Consultation / Under 2 hrs</span></div>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleResetDemo}
                    className="text-[9.5px] font-bold uppercase tracking-wider text-[#8B0000] hover:underline cursor-pointer"
                  >
                    Submit Another Dispatch Proposal
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, Key, Code, HelpCircle, FileText, CheckCircle, Shield, 
  AlertTriangle, UploadCloud, Copy, Eye, EyeOff, Plus, Trash2, 
  Send, Database, RefreshCw, Server, Landmark, Layers, ArrowRight, Check,
  ChevronRight, Laptop, PlayCircle, Terminal, HelpCircle as HelpIcon, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 115, 
      damping: 18 
    } 
  }
};

// Types & Interfaces
interface ApiKey {
  id: string;
  name: string;
  key: string;
  role: string;
  created: string;
  status: 'Active' | 'Revoked';
  visible: boolean;
  queries: number;
}

export default function AITools() {
  // Navigation: Platform tabs
  const [activeTab, setActiveTab] = useState<'capabilities' | 'docs' | 'keys' | 'partners' | 'ai-assists'>('capabilities');

  // Interactive Capabilities states
  const [selectedPayloadId, setSelectedPayloadId] = useState<string | null>(null);

  // API Keys state (Starts with a pre-configured Sandbox Key to feel "live")
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: 'key-1',
      name: 'Default Development Env',
      key: 'jcs_test_92kd84b0f92j47a9e88d1d3',
      role: 'Parts Supplier (Core)',
      created: '2026-05-10',
      status: 'Active',
      visible: false,
      queries: 12480
    }
  ]);

  // Key creation state
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyRole, setNewKeyRole] = useState('Parts Supplier');
  const [showKeyGenerator, setShowKeyGenerator] = useState(false);

  // Documentation Interactive Test State
  const [selectedLang, setSelectedLang] = useState<'curl' | 'nodejs' | 'python'>('curl');
  const [isSyncingLive, setIsSyncingLive] = useState(false);
  const [syncResponse, setSyncResponse] = useState<any | null>(null);

  // Parts Supplier live sync payload editor
  const [partsPayload, setPartsPayload] = useState({
    sku: "PRT-992-FLTR",
    brand: "Brembo Premium",
    partName: "Ceramic Track Discs",
    price: 345.50,
    qty: 45,
    compatibilityVinPattern: "WP0AB2A92M"
  });

  // Partner proposal request state
  const [partnerForm, setPartnerForm] = useState({
    companyName: '',
    techEmail: '',
    apiInterest: 'inventory-sync',
    estVolume: '1000-5000',
    notes: ''
  });
  const [isSubmittingPartner, setIsSubmittingPartner] = useState(false);
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);

  // ================= LEGACY/AI ACTIONS (Retained for high completeness) =================
  const [activeAiTool, setActiveAiTool] = useState<'listing' | 'repair' | 'policy' | 'claim'>('listing');
  const [vinListingInput, setVinListingInput] = useState('WP0AB2A92MS299212');
  const [listingLanguage, setListingLanguage] = useState<'en' | 'es' | 'de'>('en');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationOutput, setGenerationOutput] = useState<string>('');
  const [isAnalyzingPolicy, setIsAnalyzingPolicy] = useState(false);
  const [policyData, setPolicyData] = useState<any | null>(null);
  const [airbagDeployed, setAirbagDeployed] = useState(true);
  const [leaksNoted, setLeaksNoted] = useState(true);
  const [policeFlipped, setPoliceFlipped] = useState(true);
  const [claimGenerated, setClaimGenerated] = useState(false);

  // Clipboard copies
  const notifyCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Payload copied to clipboard.");
  };

  // Create API Key
  const handleGenerateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const randomHex = Array.from({ length: 24 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const token = `jcs_${newKeyRole === 'Parts Supplier' ? 'parts' : 'live'}_${randomHex}`;
    
    const newEntry: ApiKey = {
      id: `key-${Date.now()}`,
      name: newKeyName,
      key: token,
      role: newKeyRole,
      created: new Date().toISOString().split('T')[0],
      status: 'Active',
      visible: false,
      queries: 0
    };

    setApiKeys([...apiKeys, newEntry]);
    setNewKeyName('');
    setShowKeyGenerator(false);
  };

  // Toggle key visibility
  const toggleKeyVisibility = (id: string) => {
    setApiKeys(apiKeys.map(k => k.id === id ? { ...k, visible: !k.visible } : k));
  };

  // Revoke Key
  const handleRevokeKey = (id: string) => {
    if (confirm("Are you sure you want to revoke this API token? All future requests will fail instantly.")) {
      setApiKeys(apiKeys.map(k => k.id === id ? { ...k, status: 'Revoked' } : k));
    }
  };

  // Doc - Live API request test execution
  const executeLiveDocTest = () => {
    setIsSyncingLive(true);
    setSyncResponse(null);

    setTimeout(() => {
      setIsSyncingLive(false);
      setSyncResponse({
        status: "success",
        code: 201,
        message: "Inventory parameters synchronized successfully across 3 regional marketplaces.",
        transactionId: `tx_sync_${Math.random().toString(36).substring(2, 11)}`,
        timestamp: new Date().toISOString(),
        entityProcessed: {
          supplierPartSku: partsPayload.sku,
          resolvedFitmentPrefix: partsPayload.compatibilityVinPattern,
          currentInventoryCount: partsPayload.qty,
          listingEvaluationPrice: `€${partsPayload.price.toFixed(2)}`
        },
        indexLogs: [
          "[INFO] Verifying parts schema alignment",
          "[INFO] Found 14 compatible performance trim listings matching WP0AB2A92M",
          "[INFO] Dispatched updates to Riga, Klaipėda and Warsaw hubs"
        ]
      });
    }, 1300);
  };

  // Partner submit
  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerForm.companyName || !partnerForm.techEmail) {
      alert("Please enter company name and technical contact details.");
      return;
    }
    setIsSubmittingPartner(true);

    setTimeout(() => {
      setIsSubmittingPartner(false);
      setPartnerSubmitted(true);
    }, 1500);
  };

  // Legacy listings generate
  const handleGenerateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vinListingInput) return;
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      setGenerationOutput(
        listingLanguage === 'en'
          ? `Experience pure precision and dynamic performance with this verified 2023 Porsche 911 Carrera S. Finished in Chalk Grey over black interior seating, this specimen features PDK response logic and certified single-owner records checked and approved via global standard registries.`
          : listingLanguage === 'es'
          ? `Experimente el pináculo absoluto del rendimiento con este Porsche 911 Carrera S 2023 verificado. Acabado en Chalk Grey sobre cuero negro de primera calidad, este diseño deportivo ofrece un embrague doble PDK. Registros certificados de un solo propietario verificado.`
          : `Erleben Sie absolute Präzision mit diesem verifizierten Porsche 911 Carrera S von 2023. In Kreidegrau mit schwarzem Leder-Interieur bietet dieses sportliche Layout ein PDK-Getriebe und zertifizierte Erstbesitzer-Protokolle, die vom globalen Register verifiziert sind.`
      );
    }, 1200);
  };

  // Legacy policy parse
  const handleAnalyzePolicy = () => {
    setIsAnalyzingPolicy(true);
    setTimeout(() => {
      setIsAnalyzingPolicy(false);
      setPolicyData({
        number: 'AUT-4922-X901',
        carrier: 'Prudential National Auto',
        start: '01/01/2026',
        end: '01/01/2027',
        status: 'Active',
        limits: '$1,500,000 / $3,000,000 Combined Single Limit',
        collision: '$500 (Comprehensive)',
        comp: '$250 (Friction)'
      });
    }, 1400);
  };

  return (
    <div className="w-full space-y-12" id="developer-api-portal-root">
      
      {/* ================= HEADER BRANDING BANNER ================= */}
      <section className="text-center space-y-4 max-w-4xl mx-auto px-4 pt-8 animate-in fade-in duration-300" id="api-portal-header">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
          Developer APIs &amp; Integrations
        </h1>
      </section>

      {/* ================= SWITCHER NAVIGATION RAIL ================= */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-white p-2 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.05)] border border-slate-100 max-w-4xl mx-auto" id="portal-navigation-rail">
        <button
          onClick={() => { setActiveTab('capabilities'); setSelectedPayloadId(null); }}
          className={`px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'capabilities' ? 'bg-[#8B0000] text-white shadow-[0_10px_25px_rgba(139,0,0,0.25)]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-55'
          }`}
        >
          <Server className="w-3.5 h-3.5 shrink-0" /> Capabilities Suite
        </button>

        <button
          onClick={() => setActiveTab('docs')}
          className={`px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'docs' ? 'bg-[#8B0000] text-white shadow-[0_10px_25px_rgba(139,0,0,0.25)]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-55'
          }`}
        >
          <Code className="w-3.5 h-3.5 shrink-0" /> Parts Sync &amp; Docs
        </button>

        <button
          onClick={() => setActiveTab('keys')}
          className={`px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'keys' ? 'bg-[#8B0000] text-white shadow-[0_10px_25px_rgba(139,0,0,0.25)]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-55'
          }`}
        >
          <Key className="w-3.5 h-3.5 shrink-0" /> API Key Hub
        </button>

        <button
          onClick={() => setActiveTab('partners')}
          className={`px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'partners' ? 'bg-[#8B0000] text-white shadow-[0_10px_25px_rgba(139,0,0,0.25)]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-55'
          }`}
        >
          <Send className="w-3.5 h-3.5 shrink-0" /> Partner Desk
        </button>

        <button
          onClick={() => setActiveTab('ai-assists')}
          className={`px-5 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'ai-assists' ? 'bg-[#8B0000] text-white shadow-[0_10px_25px_rgba(139,0,0,0.25)]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-55'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" /> AI Helpers Demos
        </button>
      </div>

      {/* ================= MAIN INTERACTIVE BODY PANELS ================= */}
      <div className="max-w-[1240px] mx-auto px-4" id="portal-inner-layout">
        
        {/* ================= TAB 1: CAPABILITIES SHOWCASE ================= */}
        {activeTab === 'capabilities' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-10"
            id="capabilities-panel"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Cap 1: Inventory Sync */}
              <motion.div variants={cardVariants} className="bg-white border border-slate-100 rounded-3xl p-6 text-left space-y-4 flex flex-col justify-between shadow-[0_15px_45px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(139,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#8B0000] flex items-center justify-center font-bold shadow-inner">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Supplier Inventory Sync</h3>
                  <p className="text-slate-500 text-xs font-light leading-relaxed">
                    Automatically update your car parts stock and keep your catalog fresh for buyers.
                  </p>
                </div>
                
                <button
                  onClick={() => setSelectedPayloadId('inventory')}
                  className="pt-4 text-[10.5px] font-black tracking-wider uppercase text-[#8B0000] hover:text-[#700000] flex items-center gap-1 cursor-pointer hover:underline self-start transition-colors"
                >
                  View JSON Schema <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>

              {/* Cap 2: Insurance API */}
              <motion.div variants={cardVariants} className="bg-white border border-slate-100 rounded-3xl p-6 text-left space-y-4 flex flex-col justify-between shadow-[0_15px_45px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(139,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#8B0000] flex items-center justify-center font-bold shadow-inner">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Insurance Platform API</h3>
                  <p className="text-slate-500 text-xs font-light leading-relaxed">
                    Quickly find past damage reports, paint details, and full vehicle history.
                  </p>
                </div>

                <button
                  onClick={() => setSelectedPayloadId('insurance')}
                  className="pt-4 text-[10.5px] font-black tracking-wider uppercase text-[#8B0000] hover:text-[#700000] flex items-center gap-1 cursor-pointer hover:underline self-start transition-colors"
                >
                  View JSON Schema <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>

              {/* Cap 3: Financing API */}
              <motion.div variants={cardVariants} className="bg-white border border-slate-100 rounded-3xl p-6 text-left space-y-4 flex flex-col justify-between shadow-[0_15px_45px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(139,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#8B0000] flex items-center justify-center font-bold shadow-inner">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Financing Core API</h3>
                  <p className="text-slate-500 text-xs font-light leading-relaxed">
                    Easily check loan statuses, calculate regional taxes, and confirm car values.
                  </p>
                </div>

                <button
                  onClick={() => setSelectedPayloadId('finance')}
                  className="pt-4 text-[10.5px] font-black tracking-wider uppercase text-[#8B0000] hover:text-[#700000] flex items-center gap-1 cursor-pointer hover:underline self-start transition-colors"
                >
                  View JSON Schema <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>

              {/* Cap 4: Gov & DMV Data */}
              <motion.div variants={cardVariants} className="bg-white border border-slate-100 rounded-3xl p-6 text-left space-y-4 flex flex-col justify-between shadow-[0_15px_45px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(139,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-[#8B0000] flex items-center justify-center font-bold shadow-inner">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Government Registry Link</h3>
                  <p className="text-slate-500 text-xs font-light leading-relaxed">
                    Get instant access to national car registries to check vehicle owners and safety flags.
                  </p>
                </div>

                <button
                  onClick={() => setSelectedPayloadId('government')}
                  className="pt-4 text-[10.5px] font-black tracking-wider uppercase text-[#8B0000] hover:text-[#700000] flex items-center gap-1 cursor-pointer hover:underline self-start transition-colors"
                >
                  View JSON Schema <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>

            </div>

            {/* Simulated Live JSON Inspector Box */}
            <AnimatePresence>
              {selectedPayloadId && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-slate-900 rounded-3xl p-6 text-left font-mono text-xs text-slate-300 relative border border-slate-800 shadow-[0_20px_50px_rgba(139,0,0,0.15)] max-w-4xl mx-auto"
                  id={`json-inspector-box-${selectedPayloadId}`}
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-[#8B0000] rounded-full shadow-[0_0_8px_rgba(139,0,0,0.8)]"></div>
                      <span className="text-[11px] font-black text-white uppercase tracking-wider">
                        {selectedPayloadId} Schema Structure
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const codeText = document.getElementById('raw-payload-copy-block')?.innerText;
                          if (codeText) notifyCopy(codeText);
                        }}
                        className="bg-white/10 hover:bg-white/15 px-3 py-1 rounded text-[10.5px] text-white flex items-center gap-1 cursor-pointer transition-all uppercase font-bold"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                      <button 
                        onClick={() => setSelectedPayloadId(null)}
                        className="text-slate-500 hover:text-white uppercase font-bold text-[10px] pl-2 block tracking-wider"
                      >
                        Close
                      </button>
                    </div>
                  </div>

                  <pre className="overflow-x-auto text-slate-400 select-all p-3 bg-black/40 rounded-xl leading-relaxed" id="raw-payload-copy-block">
                    {selectedPayloadId === 'inventory' && JSON.stringify({
                      "supplier_sku": "SKU-BREM-CERAMIC-992",
                      "catalog_brand": "Brembo Racing Professional",
                      "part_name": "Premium Ceramic High Friction Disc Pads",
                      "parts_pricing_usd": 395.00,
                      "warehouse_stock_count": 86,
                      "fitment_compatibility_patterns": [
                        "WP0AB2A92MS",
                        "WP0AB2A92M",
                        "WP0ZZZ99Z"
                      ],
                      "origin_manufacture_code": "PL-101",
                      "sync_marketplace_routes": ["Warsaw", "Klaipeda", "Vilnius"]
                    }, null, 2)}

                    {selectedPayloadId === 'insurance' && JSON.stringify({
                      "vin_chassis_number": "WP0AB2A92MS299212",
                      "paint_thickness_checks": {
                        "front_bonnet_microns": 110,
                        "left_door_microns": 240, 
                        "pnt_symmetry_compromised": true,
                        "prior_respray_detected": "Left wing & driver side panel"
                      },
                      "airbag_telemetry_status": {
                        "airbag_deployment_flag": false,
                        "sensor_override_detected": false
                      },
                      "underwritten_validity_period_end": "2027-04-18"
                    }, null, 2)}

                    {selectedPayloadId === 'finance' && JSON.stringify({
                      "vin_identity": "WP0AB2A92MS299212",
                      "lender_lien_status": {
                        "has_lender_encumbrance": false,
                        "registered_lienholder": null,
                        "direct_clearance_stamp": "CLEARED_STAMP_F49X"
                      },
                      "residual_safety_score": 0.94,
                      "market_valuation_prediction": 114500.00
                    }, null, 2)}

                    {selectedPayloadId === 'government' && JSON.stringify({
                      "$schema": "dmv-v3.registration.json",
                      "registration_country": "Lithuania",
                      "license_plate_assigned": "LHV:401",
                      "stolen_flag_police_alert": false,
                      "title_clean_certified": true,
                      "dmv_tax_coefficient": 1.25,
                      "border_customs_clearance_id": "CUS-EUM-48221990x"
                    }, null, 2)}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
              {/* ================= TAB 2: DEVELOPER REFERENCE & DOCS ================= */}
        {activeTab === 'docs' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left" id="developer-docs-panel">
            
            {/* Left Nav menu: 3/12 */}
            <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-5 space-y-4 h-fit shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono">Documentation Index</h4>
              
              <ul className="space-y-1.5 text-xs text-slate-650">
                <li>
                  <a href="#doc-overview" className="block p-2 hover:bg-slate-50 hover:text-slate-900 font-bold rounded-lg transition-all">
                    1. Overview
                  </a>
                </li>
                <li>
                  <a href="#doc-auth" className="block p-2 hover:bg-slate-50 hover:text-slate-900 font-bold rounded-lg transition-all">
                    2. Authentication
                  </a>
                </li>
                <li>
                  <a href="#doc-inventory-spec" className="block p-2 bg-red-50 text-[#8B0000] font-extrabold rounded-lg transition-all">
                    3. Supplier Inventory Sync
                  </a>
                </li>
                <li>
                  <a href="#doc-errors" className="block p-2 hover:bg-slate-50 hover:text-slate-900 font-bold rounded-lg transition-all">
                    4. Error Handling
                  </a>
                </li>
              </ul>

              <div className="bg-slate-900 p-4 rounded-xl text-[11px] font-mono text-slate-400 space-y-1 shadow-inner">
                <span className="text-[9px] uppercase font-bold text-[#8B0000] block">BASE URL</span>
                <span className="text-white">https://api.justcarsale.com/v1</span>
              </div>
            </div>

            {/* Right content layout: 9/12 */}
            <div className="lg:col-span-9 space-y-10 bg-white border border-slate-100 p-6 sm:p-9 rounded-3xl shadow-[0_15px_45px_rgba(0,0,0,0.03)]">
              
              {/* Document Block 1: Overview */}
              <div className="space-y-3" id="doc-overview">
                <h3 className="text-xl font-black text-slate-900 uppercase">1. REST API Overview</h3>
                <p className="text-slate-500 text-xs font-light leading-relaxed">
                  Welcome to our API documentation. Use this to easily connect your systems, sync catalogs, and query car details.
                </p>
              </div>

              {/* Document Block 2: Authentication */}
              <div className="space-y-3 border-t border-slate-100 pt-8" id="doc-auth">
                <h3 className="text-base font-black text-slate-900 uppercase">2. Authentication Protocols</h3>
                <p className="text-slate-500 text-xs font-light leading-relaxed">
                  To keep your data safe, use our secure key system. You can generate a key in the Key Hub tab and add it to your request headers.
                </p>

                <div className="bg-slate-900 p-4 rounded-2xl text-[11.5px] font-mono text-white/80 leading-relaxed overflow-x-auto shadow-inner">
                  <div>Authorization: Bearer <span className="text-emerald-400">jcs_live_94fk28b01a...</span></div>
                </div>
              </div>

              {/* Document Block 3: PARTS SUPPLIER SPECIFICATION */}
              <div className="space-y-6 border-t border-slate-100 pt-8" id="doc-inventory-spec">
                <div className="space-y-3">
                  <h3 className="text-lg font-black text-slate-900 uppercase">3. Spare Parts &amp; Stock Synchronization Spec</h3>
                  <p className="text-slate-500 text-xs font-light leading-relaxed">
                    Suppliers should update their parts list daily. By linking parts to specific car VIN numbers, our system helps buyers find exactly what fits.
                  </p>
                </div>

                {/* Live Sandbox Payload test console */}
                <div className="border border-slate-100 rounded-2xl p-5 space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h4 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-900">Interactive Sync editor</h4>
                    <span className="bg-slate-100 text-slate-500 rounded px-2 py-0.5 text-[9px] font-mono leading-none">Payload values editable</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    {/* SKU Input */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-extrabold text-slate-400 block uppercase font-mono">Part SKU ID</label>
                      <input
                        type="text"
                        value={partsPayload.sku}
                        onChange={(e) => setPartsPayload({ ...partsPayload, sku: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 text-xs px-2.5 py-2 rounded-lg font-mono"
                      />
                    </div>

                    {/* Price Input */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-extrabold text-slate-400 block uppercase font-mono">Price (Euros)</label>
                      <input
                        type="number"
                        value={partsPayload.price}
                        onChange={(e) => setPartsPayload({ ...partsPayload, price: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-slate-50 border border-slate-200 text-xs px-2.5 py-2 rounded-lg font-mono"
                      />
                    </div>

                    {/* Quantity Input */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-extrabold text-slate-400 block uppercase font-mono">Quantity</label>
                      <input
                        type="number"
                        value={partsPayload.qty}
                        onChange={(e) => setPartsPayload({ ...partsPayload, qty: parseInt(e.target.value) || 0 })}
                        className="w-full bg-slate-50 border border-slate-200 text-xs px-2.5 py-2 rounded-lg font-mono"
                      />
                    </div>

                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Brand Name */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-extrabold text-slate-400 block uppercase font-mono">Brand SPECIALIST</label>
                      <input
                        type="text"
                        value={partsPayload.brand}
                        onChange={(e) => setPartsPayload({ ...partsPayload, brand: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 text-xs px-2.5 py-2 rounded-lg"
                      />
                    </div>

                    {/* VIN pattern */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-extrabold text-slate-400 block uppercase font-mono">Fitment VIN Check prefix (10 digits)</label>
                      <input
                        type="text"
                        maxLength={10}
                        value={partsPayload.compatibilityVinPattern}
                        onChange={(e) => setPartsPayload({ ...partsPayload, compatibilityVinPattern: e.target.value.toUpperCase() })}
                        className="w-full bg-slate-50 border border-slate-200 text-xs px-2.5 py-2 rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button
                      onClick={executeLiveDocTest}
                      disabled={isSyncingLive}
                      className="bg-[#8B0000] hover:bg-[#700000] text-white text-[11px] font-extrabold uppercase px-4.5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      {isSyncingLive ? 'Syncing...' : 'Simulate API Call'} <PlayCircle className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => setPartsPayload({
                        sku: "PRT-992-FLTR",
                        brand: "Brembo Premium",
                        partName: "Ceramic Track Discs",
                        price: 345.50,
                        qty: 45,
                        compatibilityVinPattern: "WP0AB2A92M"
                      })}
                      className="border border-slate-200 hover:bg-slate-50 text-[11px] font-bold text-slate-600 uppercase px-4 py-2.5 rounded-xl transition-all"
                    >
                      Reset Payload
                    </button>
                  </div>

                  {/* Sandbox execution console logging */}
                  <AnimatePresence>
                    {isSyncingLive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-slate-900 text-emerald-400 p-4 rounded-xl font-mono text-[10.5px] text-left space-y-1 shadow-inner"
                      >
                        <div>[POST] Initializing client handshake with sync schema...</div>
                        <div>[POST] Token payload validated successfully.</div>
                        <div className="animate-pulse">[POST] Synchronizing parts Fitment list matching: {partsPayload.compatibilityVinPattern}...</div>
                      </motion.div>
                    )}

                    {syncResponse && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-inner text-left font-mono"
                      >
                        <div className="bg-[#8B0000] px-4.5 py-2 flex items-center justify-between border-b border-white/5">
                          <span className="text-white text-[10px] font-bold uppercase tracking-wider">RESPONSE CONSOLE</span>
                          <span className="text-emerald-500 font-bold uppercase text-[9px] bg-emerald-500/10 px-2 rounded-full leading-relaxed">
                            201 CREATED
                          </span>
                        </div>
                        <pre className="p-4.5 text-[10.5px] text-slate-300 overflow-x-auto leading-relaxed">
                          {JSON.stringify(syncResponse, null, 2)}
                        </pre>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </div>

              {/* Document Block 4: Error handling */}
              <div className="space-y-3 border-t border-slate-100 pt-8" id="doc-errors">
                <h3 className="text-base font-black text-slate-900 uppercase">4. API Error Manifest</h3>
                <p className="text-slate-500 text-xs font-light leading-relaxed">
                  If something goes wrong, our API will return a simple error code to help you fix it.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-650 divide-y divide-slate-150">
                    <thead className="bg-slate-50 text-slate-900 font-semibold font-mono">
                      <tr>
                        <th className="p-3 text-[10px] uppercase">STATUS</th>
                        <th className="p-3 text-[10px] uppercase">EXCEPTION STRING</th>
                        <th className="p-3 text-[10px] uppercase">ROOT DIAGNOSTIC CAUSE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-sans font-light">
                      <tr>
                        <td className="p-3 font-mono font-bold text-[#8B0000]">401</td>
                        <td className="p-3 font-mono font-bold">UNAUTHORIZED_SIGNATURE</td>
                        <td className="p-3">Bearer token is expired, formatted incorrectly or lacks required workspace scope properties.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-[#8B0000]">422</td>
                        <td className="p-3 font-mono font-bold">COMPATIBILITY_PREFIX_INVALID</td>
                        <td className="p-3">The compatible VIN pattern does not conform to the 10-digit ISO standard (e.g. WP0ZZZ99Z).</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono font-bold text-[#8B0000]">429</td>
                        <td className="p-3 font-mono font-bold">CLIENT_THROTTLE_REACHED</td>
                        <td className="p-3">The call quota for this development credential has been exceeded. Submit a tier upgrade request.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= TAB 3: API KEY GENERATOR ================= */}
        {activeTab === 'keys' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left" id="api-keys-hub-panel">
            
            {/* Form to submit API request key: 4/12 */}
            <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 space-y-6 h-fit shadow-[0_15px_45px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(139,0,0,0.05)] transition-all duration-300">
              <div className="space-y-1.5">
                <span className="text-[9px] font-black uppercase tracking-wider text-[#8B0000] font-mono">Key Generator</span>
                <h3 className="text-base font-black text-slate-900 uppercase">Generate API Key</h3>
                <p className="text-slate-500 text-xs font-light leading-relaxed">
                  Create a secure key to connect to our sync and car detail systems.
                </p>
              </div>

              <form onSubmit={handleGenerateKey} className="space-y-4 pt-1">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 font-mono block">
                    Key Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. My Warsaw Sync Key"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 font-mono block">
                    Your Role
                  </label>
                  <select
                    value={newKeyRole}
                    onChange={(e) => setNewKeyRole(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none"
                  >
                    <option value="Parts Supplier">Parts Supplier (uploads parts list)</option>
                    <option value="Dealership">Dealership Network (listings)</option>
                    <option value="Workshop Appraiser">Workshop Appraiser</option>
                    <option value="Insurance Provider">Insurance Underwriter</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#8B0000] hover:bg-[#700000] text-white font-extrabold uppercase py-3 rounded-xl text-xs tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md"
                >
                  <Plus className="w-4 h-4" /> Create Key
                </button>
              </form>
            </div>

            {/* List of generated keys grid: 8/12 */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex justify-between items-center bg-white rounded-3xl p-4.5 border border-slate-100 shadow-[0_15px_45px_rgba(0,0,0,0.03)]">
                <div className="text-left">
                  <h4 className="text-xs font-black text-slate-900 uppercase">Your Keys</h4>
                  <p className="text-[10px] text-slate-400">View, copy, or delete your API keys below.</p>
                </div>
                <span className="text-[10px] font-mono text-white bg-[#8B0000] px-3 py-1 rounded-full font-bold shadow-[0_5px_15px_rgba(139,0,0,0.2)]">
                  {apiKeys.length} ACTIVE {apiKeys.length === 1 ? 'KEY' : 'KEYS'}
                </span>
              </div>

              <div className="space-y-4">
                {apiKeys.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-150 rounded-3xl text-slate-400 space-y-3 bg-white shadow-[0_15px_45px_rgba(0,0,0,0.02)]">
                    <Laptop className="w-8 h-8 text-slate-200 mx-auto" />
                    <p className="text-xs font-bold font-mono uppercase">No Keys Yet</p>
                    <p className="text-[10.5px] font-light max-w-sm mx-auto text-slate-400">Use the form on the left to generate your first API key.</p>
                  </div>
                ) : (
                  apiKeys.map((k) => (
                    <div 
                      key={k.id} 
                      className={`bg-white border rounded-3xl p-5 space-y-4 relative transition-all shadow-[0_15px_45px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(139,0,0,0.05)] ${
                        k.status === 'Revoked' ? 'opacity-55 border-slate-100 bg-slate-50 shadow-none' : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="space-y-0.5 text-left">
                          <span className="text-[8px] bg-red-50 text-[#8B0000] border border-red-100/50 rounded-md font-mono font-bold uppercase tracking-wide px-1.5 py-0.5">
                            {k.role}
                          </span>
                          <h4 className="text-xs font-black text-slate-950 uppercase">{k.name}</h4>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`text-[9.5px] font-mono font-extrabold uppercase px-2 py-0.5 rounded ${
                            k.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-650'
                          }`}>
                            {k.status}
                          </span>
                          <span className="text-[9.5px] text-slate-400 font-mono">Issued {k.created}</span>
                        </div>
                      </div>

                      {/* Display Key Wrapper */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between bg-slate-50 border border-slate-150 rounded-2xl p-4">
                        <div className="font-mono text-xs text-slate-800 break-all select-all flex-1 pr-4 text-left">
                          {k.status === 'Revoked' ? (
                            <span className="text-slate-400 line-through font-light font-sans text-xs">This key was revoked and cannot be restored</span>
                          ) : k.visible ? (
                            k.key
                          ) : (
                            '••••••••••••••••••••••••••••••••••••••••••'
                          )}
                        </div>

                        {k.status === 'Active' && (
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => toggleKeyVisibility(k.id)}
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-600 transition-all cursor-pointer"
                              title={k.visible ? "Hide Token" : "Show Token"}
                            >
                              {k.visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => notifyCopy(k.key)}
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-600 transition-all cursor-pointer"
                              title="Copy Token"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleRevokeKey(k.id)}
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-red-700 hover:border-red-100 text-slate-400 transition-all cursor-pointer"
                              title="Revoke Token"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {k.status === 'Active' && (
                        <div className="flex justify-between text-[11px] font-mono text-slate-400 font-bold px-1.5 pb-1">
                          <span>Used This Month:</span>
                          <span className="text-slate-900">{k.queries.toLocaleString()} / 100,000 queries</span>
                        </div>
                      )}

                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 4: PARTNER REQUEST PANEL ================= */}
        {activeTab === 'partners' && (
          <div className="max-w-2xl mx-auto" id="partners-request-panel">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-9 text-left space-y-6 shadow-[0_15px_45px_rgba(0,0,0,0.03)]">
              
              <div className="text-center space-y-2">
                <span className="bg-red-50 text-[#8B0000] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-red-100/50 block w-fit mx-auto font-mono">
                  Partner Form
                </span>
                
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 uppercase leading-none">
                  Connect With Our Team
                </h3>
                
                <p className="text-slate-500 text-xs font-light max-w-md mx-auto leading-normal">
                  Let us know how we can help you build your custom integrations.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {!partnerSubmitted ? (
                  <motion.form
                    key="partner-form"
                    onSubmit={handlePartnerSubmit}
                    className="space-y-4 pt-4 border-t border-slate-100"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Name input */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 block font-mono">
                          Company Name
                        </label>
                        <input
                          type="text"
                          required
                          value={partnerForm.companyName}
                          onChange={(e) => setPartnerForm({ ...partnerForm, companyName: e.target.value })}
                          placeholder="e.g. My Logistics Company"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:bg-white"
                        />
                      </div>

                      {/* Tech Contact Email */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 block font-mono">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={partnerForm.techEmail}
                          onChange={(e) => setPartnerForm({ ...partnerForm, techEmail: e.target.value })}
                          placeholder="you@company.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:bg-white"
                        />
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Selection of focus */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 block font-mono">
                          What are you building?
                        </label>
                        <select
                          value={partnerForm.apiInterest}
                          onChange={(e) => setPartnerForm({ ...partnerForm, apiInterest: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:bg-white"
                        >
                          <option value="inventory-sync">Parts Supplier Inventory Sync</option>
                          <option value="insurance">Insurance API Integration</option>
                          <option value="financing">Financing &amp; Collateral API</option>
                          <option value="dmv-government">Government &amp; DMV Registry APIs</option>
                          <option value="all-enterprise">All Capabilities</option>
                        </select>
                      </div>

                      {/* Est transaction metrics */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 block font-mono">
                          Expected Monthly Queries
                        </label>
                        <select
                          value={partnerForm.estVolume}
                          onChange={(e) => setPartnerForm({ ...partnerForm, estVolume: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:bg-white"
                        >
                          <option value="under-1000">Under 1,000 queries</option>
                          <option value="1000-5000">1,000 - 5,000 queries</option>
                          <option value="5000-50000">5,000 - 50,000 queries</option>
                          <option value="over-50000">Over 50,000 queries</option>
                        </select>
                      </div>

                    </div>

                    {/* Technical integration request note */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 block font-mono">
                        How can we help?
                      </label>
                      <textarea
                        rows={4}
                        value={partnerForm.notes}
                        onChange={(e) => setPartnerForm({ ...partnerForm, notes: e.target.value })}
                        placeholder="Tell us about your project and custom needs..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-900 outline-none focus:bg-white resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingPartner}
                      className="w-full bg-[#8B0000] hover:bg-[#700000] text-white font-extrabold uppercase py-3.5 rounded-xl text-xs tracking-widest transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                    >
                      {isSubmittingPartner ? 'Sending Request...' : 'Send Request'} <ArrowRight className="w-4 h-4 text-white" />
                    </button>

                  </motion.form>
                ) : (
                  <motion.div
                    key="partner-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 space-y-4"
                  >
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200 shadow-sm">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-slate-950 uppercase">Request Sent Successfully</h4>
                      <p className="text-slate-500 text-xs font-light max-w-md mx-auto">
                        We have logged your request. Our integration team will contact your email address within 12 business hours.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setPartnerSubmitted(false);
                        setPartnerForm({
                          companyName: '',
                          techEmail: '',
                          apiInterest: 'inventory-sync',
                          estVolume: '1000-5000',
                          notes: ''
                        });
                      }}
                      className="border border-slate-200 hover:bg-slate-50 text-[11px] font-black uppercase text-slate-600 px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      Submit Another Briefing
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        )}

        {/* ================= TAB 5: AI UTILITIES LIVE DEMOS ================= */}
        {activeTab === 'ai-assists' && (
          <div className="space-y-8" id="ai-utilities-panel">
            
            {/* Tool Selector Headers (Segmented Switcher with red high-fidelity state) */}
            <div className="flex bg-white p-2 rounded-2xl border border-slate-100 overflow-x-auto shrink-0 select-none hide-scrollbar shadow-[0_10px_30px_rgba(0,0,0,0.03)] max-w-2xl mx-auto">
              <button
                onClick={() => setActiveAiTool('listing')}
                type="button"
                className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                  activeAiTool === 'listing' ? 'bg-[#8B0000] shadow-[0_5px_15px_rgba(139,0,0,0.2)] text-white' : 'text-slate-500 hover:text-black hover:bg-slate-50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Copywriter
              </button>
              <button
                onClick={() => setActiveAiTool('repair')}
                type="button"
                className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                  activeAiTool === 'repair' ? 'bg-[#8B0000] shadow-[0_5px_15px_rgba(139,0,0,0.2)] text-white' : 'text-slate-500 hover:text-black hover:bg-slate-50'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Decoder
              </button>
              <button
                onClick={() => setActiveAiTool('policy')}
                type="button"
                className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                  activeAiTool === 'policy' ? 'bg-[#8B0000] shadow-[0_5px_15px_rgba(139,0,0,0.2)] text-white' : 'text-slate-500 hover:text-black hover:bg-slate-50'
                }`}
              >
                <Shield className="w-3.5 h-3.5" /> Scraper
              </button>
              <button
                onClick={() => setActiveAiTool('claim')}
                type="button"
                className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                  activeAiTool === 'claim' ? 'bg-[#8B0000] shadow-[0_5px_15px_rgba(139,0,0,0.2)] text-white' : 'text-slate-500 hover:text-black hover:bg-slate-50'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Claims Program
              </button>
            </div>

            {/* Tool 1: AI Listing Author */}
            {activeAiTool === 'listing' && (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left"
              >
                <motion.div variants={cardVariants} className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_15px_45px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(139,0,0,0.05)] transition-all duration-300 space-y-5">
                  <h4 className="font-black text-slate-900 text-sm tracking-tight uppercase">AI Writer</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    Create clean car descriptions for buyers instantly.
                  </p>

                  <form onSubmit={handleGenerateListing} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 block uppercase tracking-wider font-mono">Car VIN Number</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter 17-digit VIN..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-mono text-xs uppercase tracking-widest text-[#8B0000] outline-none focus:bg-white focus:border-[#8B0000]"
                        value={vinListingInput}
                        onChange={e => setVinListingInput(e.target.value.toUpperCase())}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 block uppercase tracking-wider font-mono">Language</label>
                      <div className="flex gap-1.5">
                        {(['en', 'es', 'de'] as const).map(lang => (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => setListingLanguage(lang)}
                            className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase transition-all cursor-pointer ${
                              listingLanguage === lang ? 'bg-[#8B0000] text-white' : 'bg-slate-55 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {lang === 'en' ? 'EN' : lang === 'es' ? 'ES' : 'DE'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isGenerating}
                      className="w-full h-11 bg-[#8B0000] font-extrabold hover:bg-[#700000] text-white rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer uppercase tracking-wider"
                    >
                      {isGenerating ? 'Loading Specs...' : 'Write Description'}
                    </button>
                  </form>
                </motion.div>

                <motion.div variants={cardVariants} className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_15px_45px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(139,0,0,0.05)] transition-all duration-300 flex flex-col justify-between min-h-[350px]">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider font-mono">Result</h4>
                      {generationOutput && (
                        <button
                          onClick={() => notifyCopy(generationOutput)}
                          className="text-[#8B0000] hover:opacity-75 transition-all flex items-center gap-1 text-xs font-semibold cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" /> Copy Text
                        </button>
                      )}
                    </div>

                    {generationOutput ? (
                      <div className="space-y-3">
                        <span className="inline-block bg-emerald-50 text-emerald-700 text-[9px] border border-emerald-100 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                          Approved
                        </span>
                        <p className="text-xs text-slate-750 leading-relaxed font-light">"{generationOutput}"</p>
                      </div>
                    ) : (
                      <div className="text-center py-20 text-slate-400 space-y-2">
                        <HelpIcon className="w-8 h-8 text-slate-200 mx-auto" />
                        <p className="text-xs font-mono font-bold uppercase">READY FOR INPUT</p>
                        <p className="text-[10.5px] font-light">Apply an active chassis number and select generate to output marketing drafts.</p>
                      </div>
                    )}
                  </div>

                  <span className="text-[9px] text-slate-400 font-mono tracking-widest block border-t border-slate-100 pt-3 uppercase">Done in 1.2 seconds</span>
                </motion.div>
              </motion.div>
            )}

            {/* Tool 2: AI Repair Explainer */}
            {activeAiTool === 'repair' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left animate-in fade-in duration-300">
                <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-[0_15px_45px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(139,0,0,0.05)] transition-all duration-300 space-y-6">
                  <h4 className="font-extrabold text-slate-900 text-base tracking-tight uppercase font-mono">Repair Decoder</h4>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-xl font-light">
                    Easily read mechanic invoices and understand what needs fixing.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-[0_5px_20px_rgba(0,0,0,0.01)] space-y-2">
                      <span className="bg-red-50 text-[#8B0000] border border-red-100 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">BRAKING SYSTEM</span>
                      <h5 className="font-extrabold text-slate-900 text-xs uppercase font-sans">Caliper Piston Seizure Detected</h5>
                      <p className="text-slate-500 text-[11px] leading-relaxed font-light">
                        Piston oxidization jammed the safety calipers, keeping pads in contact. Excess friction heat compromised braking integrity.
                      </p>
                    </div>

                    <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-[0_5px_20px_rgba(0,0,0,0.01)] space-y-2">
                      <span className="bg-red-50 text-[#8B0000] border border-red-100 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">CHASSIS CORE</span>
                      <h5 className="font-extrabold text-slate-900 text-xs uppercase font-sans">A-Arm Bushing Fracture</h5>
                      <p className="text-slate-500 text-[11px] leading-relaxed font-light">
                        Seat insulation has split away. Structural elements are vibrating over uneven roadways, compromising alignment limits.
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 block pb-2 uppercase tracking-widest font-mono">Cost Breakdown</span>
                    <table className="w-full text-left text-xs text-slate-600 font-sans border-collapse">
                      <thead className="bg-slate-50 text-slate-900 font-bold border-b border-slate-150">
                        <tr>
                          <th className="p-3 font-mono text-[10px] uppercase">Component Identifier</th>
                          <th className="p-3 font-mono text-[10px] uppercase">Classification</th>
                          <th className="p-3 text-right font-mono text-[10px] uppercase">Cost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-light text-slate-650">
                        <tr>
                          <td className="p-3 text-slate-900 font-semibold font-sans">Dual OEM Front Calipers</td>
                          <td className="p-3">Parts Replacement</td>
                          <td className="p-3 text-right font-mono text-xs">€442.00</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-slate-900 font-semibold font-sans">Urethane Seat Bushing Set</td>
                          <td className="p-3">Parts Replacement</td>
                          <td className="p-3 text-right font-mono text-xs">€88.50</td>
                        </tr>
                        <tr>
                          <td className="p-3 text-slate-900 font-semibold font-sans">Piston recalibration + Alignment</td>
                          <td className="p-3">Labor (4.5h)</td>
                          <td className="p-3 text-right font-mono text-xs">€540.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_15px_45px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(139,0,0,0.05)] transition-all duration-300 flex flex-col justify-between min-h-[350px]">
                  <div className="space-y-4 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Safety Score</span>
                    
                    <div className="w-18 h-18 bg-red-50 rounded-full flex items-center justify-center mx-auto border-2 border-[#8B0000] shadow-[0_10px_20px_rgba(139,0,0,0.15)] font-mono">
                      <span className="text-xl font-black text-[#8B0000]">9.4</span>
                    </div>
                    
                    <h5 className="font-extrabold text-slate-900 text-sm uppercase">Safe to Drive</h5>
                    <p className="text-slate-500 text-[11px] leading-relaxed font-light">
                      Replacing these parts completely fixes overheating and safety issues.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-2 text-xs font-sans text-slate-600">
                    <div className="flex justify-between">
                      <span>Parts Total:</span>
                      <span className="font-mono font-semibold text-slate-800">€530.50</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Labor Hours:</span>
                      <span className="font-mono font-semibold text-slate-800">€540.00</span>
                    </div>
                    <div className="flex justify-between font-extrabold text-sm border-t border-slate-150 pt-2 text-[#8B0000]">
                      <span>Calculated Balance:</span>
                      <span className="font-mono text-slate-950">€1,070.50</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tool 3: AI Policy Summarizer */}
            {activeAiTool === 'policy' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left animate-in fade-in duration-300">
                <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_15px_45px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(139,0,0,0.05)] transition-all duration-300 flex flex-col justify-between min-h-[350px]">
                  <div className="space-y-2">
                    <h4 className="font-black text-slate-900 text-sm tracking-tight uppercase">Policy Scraper</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-light">
                      Read car insurance documents and instantly find your coverage limits.
                    </p>
                  </div>

                  <div
                    className={`border border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                      isAnalyzingPolicy ? 'border-[#8B0000] bg-red-50/10' : 'border-slate-300 hover:bg-slate-50'
                    }`}
                    onClick={handleAnalyzePolicy}
                  >
                    <UploadCloud className="w-7 h-7 text-[#8B0000] mx-auto mb-2" />
                    <p className="text-xs font-extrabold text-slate-850 uppercase">Upload Policy File</p>
                    <p className="text-[9.5px] text-slate-400 mt-1 uppercase font-mono">PDF only</p>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_15px_45px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(139,0,0,0.05)] transition-all duration-300">
                  <h4 className="text-xs font-black text-slate-800 border-b border-slate-100 pb-3 mb-4 uppercase tracking-wider font-mono">Coverage Details</h4>

                  {isAnalyzingPolicy ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-3">
                      <div className="w-5 h-5 border-2 border-[#8B0000] border-t-white rounded-full animate-spin"></div>
                      <p className="text-[10.5px] text-slate-450 font-bold uppercase tracking-wider font-mono">Running parsing pipeline...</p>
                    </div>
                  ) : policyData ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider font-mono">Policy Identifier</span>
                          <span className="font-black text-slate-900 font-mono text-sm">{policyData.number}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-bold uppercase text-[9px] tracking-wider font-mono">Insuring carrier</span>
                          <span className="font-bold text-slate-800 uppercase text-xs">{policyData.carrier}</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-150">
                        <span className="text-[9.5px] text-slate-400 font-bold block uppercase tracking-wider font-mono">Limits</span>
                        
                        <div className="flex justify-between items-center text-xs py-1 border-b border-slate-200/50">
                          <span className="text-slate-500 font-light">Combined Liability Threshold</span>
                          <span className="font-semibold text-slate-800 font-mono">{policyData.limits}</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-xs py-1">
                          <span className="text-slate-500 font-light">Collision Deductible</span>
                          <span className="font-semibold text-slate-800 font-mono">{policyData.collision}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-400 space-y-2">
                      <HelpIcon className="w-8 h-8 text-slate-200 mx-auto" />
                      <p className="text-xs font-mono font-bold uppercase">NO PARSING DATA LOADED</p>
                      <p className="text-[10.5px] font-light">Configure and submit an active contract to trigger semantic scraper routines.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tool 4: AI Claim Builder */}
            {activeAiTool === 'claim' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left animate-in fade-in duration-300">
                <div className="lg:col-span-12 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 space-y-6 shadow-[0_15px_45px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(139,0,0,0.05)] transition-all duration-300 text-slate-900">
                  <div className="space-y-1.5 border-b border-slate-100 pb-4">
                    <span className="text-[9px] bg-red-50 text-[#8B0000] font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold">Claims System</span>
                    <h4 className="font-black text-slate-950 text-lg tracking-tight uppercase">Create Accident Report</h4>
                    <p className="text-slate-500 text-xs font-light max-w-xl">
                      Check the boxes below to build your official claim report.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all select-none">
                      <span className="font-semibold text-xs text-slate-700">Airbags opened</span>
                      <input
                        type="checkbox"
                        checked={airbagDeployed}
                        onChange={(e) => setAirbagDeployed(e.target.checked)}
                        className="rounded border-slate-350 text-[#8B0000] focus:ring-[#8B0000] w-4.5 h-4.5"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all select-none">
                      <span className="font-semibold text-xs text-slate-700">Fluid leak</span>
                      <input
                        type="checkbox"
                        checked={leaksNoted}
                        onChange={(e) => setLeaksNoted(e.target.checked)}
                        className="rounded border-slate-350 text-[#8B0000] focus:ring-[#8B0000] w-4.5 h-4.5"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all select-none">
                      <span className="font-semibold text-xs text-slate-700">Police report included</span>
                      <input
                        type="checkbox"
                        checked={policeFlipped}
                        onChange={(e) => setPoliceFlipped(e.target.checked)}
                        className="rounded border-slate-350 text-[#8B0000] focus:ring-[#8B0000] w-4.5 h-4.5"
                      />
                    </label>

                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setClaimGenerated(true)}
                      className="bg-[#8B0000] hover:bg-[#700000] text-white text-xs font-black uppercase px-6 py-3 rounded-xl transition-all cursor-pointer shadow-md"
                    >
                      Create Claim
                    </button>
                    {claimGenerated && (
                      <button
                        onClick={() => {
                          setClaimGenerated(false);
                        }}
                        className="border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold uppercase px-4 py-3 rounded-xl transition-all cursor-pointer"
                      >
                        Reset Envelope
                      </button>
                    )}
                  </div>

                  <AnimatePresence>
                    {claimGenerated && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-4 text-left shadow-inner"
                      >
                        <div className="flex items-center gap-2">
                          <Check className="text-emerald-600 w-4 h-4" />
                          <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase tracking-wider">Your claim report is ready</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-light">
                          "Auto-generated claim envelope for insurer adjudication. Airbag deploy state: {airbagDeployed ? 'YES' : 'NO'}. Mechanical fluid leak: {leaksNoted ? 'YES' : 'NO'}. Legal police certification file included. Valuation checks completed."
                        </p>

                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 text-xs font-mono text-slate-400">
                          <div>
                            <span className="text-[9px] uppercase tracking-wider block font-bold text-slate-500">Incident Serial ID</span>
                            <span className="font-semibold text-slate-800">#CLM-99A-40</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase tracking-wider block font-bold text-slate-500">Validation Signature</span>
                            <span className="font-semibold text-emerald-600">100% PROGRAMMATIC SHAKE</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}

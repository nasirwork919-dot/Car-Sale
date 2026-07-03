import React, { useState } from 'react';
import { 
  Handshake, Code, TrendingUp, Sparkles, Send, CheckCircle2, 
  MapPin, Clock, Globe, Briefcase, ChevronRight, Check, ArrowRight,
  ShieldCheck, HelpCircle, Star, ShieldAlert, Cpu, Heart, Layers,
  Phone, Users, Mail, Database, BellRing
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PartnerType {
  id: 'api' | 'ad' | 'listing' | 'brand';
  title: string;
  badge: string;
  icon: React.ComponentType<any>;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  shortDesc: string;
  deliverables: string[];
  metric: string;
  metricLabel: string;
}

export default function PartnerWithUs() {
  // 1. Partnerships Data using very friendly and simple English
  const partnershipTypes: PartnerType[] = [
    {
      id: 'api',
      title: 'Automatic System Sync (API)',
      badge: 'AUTOMATIC CONNECTION',
      icon: Code,
      colorClass: 'text-[#8B0000]',
      bgClass: 'bg-white',
      borderClass: 'border-zinc-200',
      shortDesc: 'Connect your inventory system directly with our platform. Your cars will automatically appear on our website instantly with no extra effort.',
      deliverables: [
        'Secure system connections',
        'Automatic vehicle matching',
        'Real-time stock updates',
        'Fast and reliable sync'
      ],
      metric: '185k+',
      metricLabel: 'Cars synced automatically'
    },
    {
      id: 'ad',
      title: 'Smart Car Advertisements',
      badge: 'BOOST SALES',
      icon: TrendingUp,
      colorClass: 'text-[#8B0000]',
      bgClass: 'bg-white',
      borderClass: 'border-zinc-200',
      shortDesc: 'Show your premium cars to more local buyers. Get more views and sell your cars much faster with our targeted ads.',
      deliverables: [
        'Banner ads in premium positions',
        'Higher search listing positions',
        'Smart local targeting',
        'Simple visitor performance reports'
      ],
      metric: '6.8x',
      metricLabel: 'More buyer clicks on average'
    },
    {
      id: 'listing',
      title: 'Local Business Profiles',
      badge: 'GET CUSTOMERS',
      icon: Layers,
      colorClass: 'text-[#8B0000]',
      bgClass: 'bg-white',
      borderClass: 'border-zinc-200',
      shortDesc: 'Get more customers for your workshop, inspection center, detailing studio, or tire shop through our directory.',
      deliverables: [
        'Clean public business profile page',
        'Easy online customer booking tools',
        'Showcase your services & prices',
        'More local customer leads'
      ],
      metric: '4.9/5',
      metricLabel: 'Average partner rating'
    },
    {
      id: 'brand',
      title: 'Verified Seller Badge',
      badge: 'BUILD BUYER TRUST',
      icon: ShieldCheck,
      colorClass: 'text-[#8B0000]',
      bgClass: 'bg-white',
      borderClass: 'border-zinc-200',
      shortDesc: 'Verify your business license to show buyers you are trustworthy. Verified partners enjoy a much higher sales rate.',
      deliverables: [
        'Verified seller badge on listings',
        'Special digital trust certificate',
        'Access to secure transaction tools',
        'Help from a dedicated manager'
      ],
      metric: '34%',
      metricLabel: 'Higher sales conversion'
    }
  ];

  const [activePartnerType, setActivePartnerType] = useState<'api' | 'ad' | 'listing' | 'brand'>('api');

  // 2. Form states
  const [partnershipForm, setPartnershipForm] = useState({
    partnerTypeSelection: 'api',
    firmName: '',
    techEmail: '',
    representativeName: '',
    contactPhone: '',
    operationalRegion: 'Baltics (LT / LV / EE)',
    estAssetCount: '10-99 units',
    projectScope: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [partnerHandshakeId, setPartnerHandshakeId] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnershipForm.firmName || !partnershipForm.techEmail || !partnershipForm.representativeName) {
      alert("Please fill out all required fields to register your request.");
      return;
    }
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = `JCS-PARTNER-${Math.floor(100000 + Math.random() * 900000)}`;
      setPartnerHandshakeId(generatedId);
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleResetForm = () => {
    setPartnershipForm({
      partnerTypeSelection: 'api',
      firmName: '',
      techEmail: '',
      representativeName: '',
      contactPhone: '',
      operationalRegion: 'Baltics (LT / LV / EE)',
      estAssetCount: '10-99 units',
      projectScope: ''
    });
    setIsSuccess(false);
  };

  return (
    <div className="space-y-16 py-8 text-left bg-white" id="partner-with-us-page-root">
      
      {/* ============================================================== */}
      {/* 1. HERO BANNER HEADER - SMOOTH 2D LOOK */}
      {/* ============================================================== */}
      <section className="text-center space-y-6 max-w-4xl mx-auto px-4 pt-8" id="partner-hero-section">
        
        <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 tracking-tight leading-tight uppercase font-sans" id="partner-main-title">
          Partner with <span className="text-[#8B0000] underline decoration-4 decoration-[#8B0000]/10 underline-offset-8">JustCarSale</span>
        </h1>
        
        <p className="text-zinc-500 text-xs sm:text-sm font-medium max-w-xl mx-auto leading-relaxed uppercase tracking-wider">
          Grow your car business with us. Easily share your car listings, find more customers, and boost your sales.
        </p>

        <div className="flex justify-center gap-3 pt-2">
          <a
            href="#partnership-application-form"
            className="bg-[#8B0000] hover:bg-[#700000] text-white text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Partner Inquiry Form</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#partnership-types-overview"
            className="bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all shadow-xs hover:shadow-md"
          >
            Explore Options
          </a>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. PARTNERSHIP TYPES INTERACTIVE OVERVIEW SECTION */}
      {/* ============================================================== */}
      <section className="max-w-[1240px] mx-auto px-4 space-y-10 text-left" id="partnership-types-overview">
        
        <div className="text-center md:text-left space-y-2 border-b border-zinc-150 pb-4 max-w-4xl">
          <h2 className="text-sm font-mono font-bold text-zinc-900 uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
            <Cpu className="w-5 h-5 text-[#8B0000]" />
            <span>1. Partnership Pathways</span>
          </h2>
        </div>

        {/* Dynamic Pillar Tab Grid - Smooth Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white max-w-5xl mx-auto md:mx-0">
          {partnershipTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = activePartnerType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => {
                  setActivePartnerType(type.id);
                  setPartnershipForm(p => ({ ...p, partnerTypeSelection: type.id }));
                }}
                className={`py-3.5 px-4 rounded-xl border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#8B0000] border-transparent text-white shadow-xs'
                    : 'bg-white border-zinc-200 hover:border-[#8B0000] text-zinc-700 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  <div className="text-left">
                    <span className="text-xs font-bold uppercase tracking-wider block">{type.title}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Content Display - Flat 2D Rounded Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
          
          {/* Detailed Deliverables View: 7 Columns */}
          <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            {partnershipTypes.filter(t => t.id === activePartnerType).map((type) => {
              const Icon = type.icon;
              return (
                <div key={type.id} className="space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-5">
                    <div className="flex justify-between items-center pb-2 border-b border-zinc-150">
                      <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">
                        {type.badge}
                      </span>
                      <Icon className="w-5 h-5 text-[#8B0000]" />
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-zinc-900 uppercase tracking-wide border-l-4 border-[#8B0000] pl-3">
                      {type.title}
                    </h3>

                    <p className="text-zinc-500 text-xs font-normal leading-relaxed">
                      {type.shortDesc}
                    </p>

                    <div className="space-y-3 pt-2">
                      <span className="text-[9px] uppercase font-bold text-zinc-400 font-mono tracking-widest block">
                        What you get
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {type.deliverables.map((deliv, index) => (
                          <div key={index} className="flex items-start gap-2.5 text-xs text-zinc-700">
                            <Check className="w-4.5 h-4.5 text-[#8B0000] shrink-0 mt-0.5" />
                            <span className="font-sans font-medium uppercase tracking-wide text-[10px] text-zinc-650">{deliv}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Operational stats badge */}
                  <div className="mt-6 pt-5 border-t border-zinc-150 flex items-center justify-between gap-4">
                    <p className="text-[10px] text-zinc-400 leading-normal uppercase tracking-wider font-mono">
                      Proven results with our active partners.
                    </p>
                    
                    <div className="bg-zinc-50 border border-zinc-200 px-4 py-2.5 rounded-xl text-center shrink-0 min-w-[120px]">
                      <span className="text-lg sm:text-xl block font-bold font-mono leading-none text-[#8B0000]">
                        {type.metric}
                      </span>
                      <span className="text-[8px] text-zinc-450 block uppercase tracking-widest font-bold font-mono mt-1 leading-tight">
                        {type.metricLabel}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick FAQ / Action Box: 5 Columns */}
          <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-[#8B0000]">
                <BellRing className="w-4.5 h-4.5 text-[#8B0000]" />
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#8B0000] block">
                  EASY STEPS TO START
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-zinc-50 border border-zinc-200 text-[#8B0000] flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                    01
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 uppercase text-[10px] tracking-widest font-mono">Fill out the Form</h4>
                    <p className="text-zinc-500 uppercase tracking-wider text-[9px] font-mono mt-0.5 leading-relaxed">
                      Complete the short inquiry form below with your basic business details.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-zinc-50 border border-zinc-200 text-[#8B0000] flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                    02
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 uppercase text-[10px] tracking-widest font-mono">Quick Verification</h4>
                    <p className="text-zinc-500 uppercase tracking-wider text-[9px] font-mono mt-0.5 leading-relaxed">
                      Our friendly support team will review your business details and get back to you fast.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-zinc-50 border border-zinc-200 text-[#8B0000] flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                    03
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 uppercase text-[10px] tracking-widest font-mono">Start Selling</h4>
                    <p className="text-zinc-500 uppercase tracking-wider text-[9px] font-mono mt-0.5 leading-relaxed">
                      Activate your selected features, gain trust, and connect with thousands of active buyers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-150 mt-6 md:mt-0">
              <a
                href="#partnership-application-form"
                className="w-full bg-[#8B0000] hover:bg-[#700000] text-white text-[10px] font-bold font-mono uppercase tracking-widest py-3 rounded-xl transition-all block text-center cursor-pointer shadow-xs"
              >
                PROCEED TO REGISTRATION
              </a>
            </div>
          </div>

        </div>

      </section>

      {/* ============================================================== */}
      {/* 3. PARTNERSHIP REGISTRATION APPLICATION FORM SECTION */}
      {/* ============================================================== */}
      <section className="max-w-3xl mx-auto px-4" id="partnership-application-form">
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-9 space-y-6 shadow-sm">
          
          <div className="text-center space-y-1">
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 uppercase tracking-wide">
              Partner Registration
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form
                key="partner-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleFormSubmit}
                className="space-y-4 pt-4 border-t border-zinc-150 font-semibold text-xs text-zinc-700"
              >
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-[9px] uppercase font-mono text-zinc-500 font-bold tracking-widest">Partnership Type *</label>
                    <select
                      value={partnershipForm.partnerTypeSelection}
                      onChange={(e) => {
                        setPartnershipForm({ ...partnershipForm, partnerTypeSelection: e.target.value });
                        setActivePartnerType(e.target.value as any);
                      }}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-3 text-xs text-zinc-800 font-bold uppercase tracking-wider focus:outline-none focus:border-[#8B0000] transition-colors focus:ring-2 focus:ring-[#8B0000]/10"
                    >
                      <option value="api">System Sync (API)</option>
                      <option value="ad">Smart Advertisements</option>
                      <option value="listing">Local Business Profiles</option>
                      <option value="brand">Verified Seller Badge</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-[9px] uppercase font-mono text-zinc-500 font-bold tracking-widest">Company / Business Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Baltic Motors Ltd"
                      value={partnershipForm.firmName}
                      onChange={(e) => setPartnershipForm({ ...partnershipForm, firmName: e.target.value })}
                      className="w-full bg-white border border-zinc-200 focus:border-[#8B0000] px-3.5 py-3 rounded-xl font-bold uppercase tracking-wider outline-none text-zinc-900 transition-colors text-xs placeholder:text-zinc-400 focus:ring-2 focus:ring-[#8B0000]/10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-[9px] uppercase font-mono text-zinc-500 font-bold tracking-widest">Representative Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. John Smith"
                      value={partnershipForm.representativeName}
                      onChange={(e) => setPartnershipForm({ ...partnershipForm, representativeName: e.target.value })}
                      className="w-full bg-white border border-zinc-200 focus:border-[#8B0000] px-3.5 py-3 rounded-xl font-bold uppercase tracking-wider outline-none text-zinc-900 transition-colors text-xs placeholder:text-zinc-400 focus:ring-2 focus:ring-[#8B0000]/10"
                    />
                  </div>

                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-[9px] uppercase font-mono text-zinc-500 font-bold tracking-widest">Business Email *</label>
                    <input
                      required
                      type="email"
                      placeholder="e.g. partner@example.com"
                      value={partnershipForm.techEmail}
                      onChange={(e) => setPartnershipForm({ ...partnershipForm, techEmail: e.target.value })}
                      className="w-full bg-white border border-zinc-200 focus:border-[#8B0000] px-3.5 py-3 rounded-xl font-bold uppercase tracking-wider outline-none text-zinc-900 transition-colors text-xs placeholder:text-zinc-400 focus:ring-2 focus:ring-[#8B0000]/10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-[9px] uppercase font-mono text-zinc-500 font-bold tracking-widest">Region</label>
                    <select
                      value={partnershipForm.operationalRegion}
                      onChange={(e) => setPartnershipForm({ ...partnershipForm, operationalRegion: e.target.value })}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-3 text-xs text-zinc-800 font-bold uppercase tracking-wider focus:outline-none focus:border-[#8B0000] transition-colors focus:ring-2 focus:ring-[#8B0000]/10"
                    >
                      <option value="Baltics (LT / LV / EE)">Baltics (Lithuania / Latvia / Estonia)</option>
                      <option value="Poland & Central EU">Poland &amp; Central Europe</option>
                      <option value="Nordics (SE / NO)">Nordics</option>
                      <option value="Other Region">Other European Region</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 flex flex-col">
                    <label className="text-[9px] uppercase font-mono text-zinc-500 font-bold tracking-widest">Est. Cars / Parts listings</label>
                    <select
                      value={partnershipForm.estAssetCount}
                      onChange={(e) => setPartnershipForm({ ...partnershipForm, estAssetCount: e.target.value })}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-3 text-xs text-zinc-800 font-bold uppercase tracking-wider focus:outline-none focus:border-[#8B0000] transition-colors focus:ring-2 focus:ring-[#8B0000]/10"
                    >
                      <option value="1-9 units">Under 10 lots</option>
                      <option value="10-99 units">10 - 99 lots</option>
                      <option value="100-499 units">100 - 499 lots</option>
                      <option value="500+ units">Over 500 lots</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 flex flex-col">
                  <label className="text-[9px] uppercase font-mono text-zinc-500 font-bold tracking-widest">Briefly describe your request</label>
                  <textarea
                    placeholder="Tell us what you would like to achieve or any questions you have..."
                    value={partnershipForm.projectScope}
                    onChange={(e) => setPartnershipForm({ ...partnershipForm, projectScope: e.target.value })}
                    className="w-full bg-white border border-zinc-200 focus:border-[#8B0000] p-3.5 rounded-xl font-normal outline-none text-zinc-900 min-h-[95px] leading-relaxed text-xs focus:ring-2 focus:ring-[#8B0000]/10"
                  />
                </div>

                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl flex items-start gap-2.5 text-zinc-500 leading-relaxed text-[10px] uppercase font-mono tracking-wider">
                  <ShieldCheck className="w-4.5 h-4.5 text-[#8B0000] shrink-0 mt-0.5" />
                  <div>
                    Your data is safe with us. We will only use your details to contact you regarding your partnership request.
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#8B0000] hover:bg-[#700000] text-white font-mono font-bold uppercase py-3.5 rounded-xl text-xs tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="w-4 h-4 animate-spin mt-0.5" />
                      <span>SENDING REQUEST...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-white" />
                      <span>Submit Request</span>
                    </>
                  )}
                </button>

              </motion.form>
            ) : (
              <motion.div
                key="submitted-card"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-10"
                id="partner-success-invoice"
              >
                <div className="w-16 h-16 bg-white border border-zinc-200 text-[#8B0000] rounded-xl flex items-center justify-center mx-auto shadow-xs">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-zinc-900 uppercase tracking-widest">
                    Request Received!
                  </h3>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto font-mono uppercase tracking-wider leading-relaxed">
                    Thank you <b>{partnershipForm.representativeName}</b>. Our support representative representing <b>{partnershipForm.firmName}</b> will get in touch with you shortly.
                  </p>
                </div>

                <div className="bg-zinc-50 text-zinc-800 border border-zinc-200 p-4 rounded-xl max-w-xs mx-auto font-mono text-center space-y-1 shadow-xs">
                  <span className="text-[8px] uppercase tracking-widest text-[#8B0000] block">PARTNER CODE</span>
                  <strong className="text-[#8B0000] tracking-widest text-base">{partnerHandshakeId}</strong>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="bg-[#8B0000] hover:bg-[#700000] text-white font-mono font-bold uppercase text-[10px] tracking-widest px-6 py-3 rounded-xl transition-all cursor-pointer inline-flex items-center gap-2 shadow-xs"
                  >
                    <span>Send Another Request</span>
                    <ArrowRight className="w-4 h-4" />
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


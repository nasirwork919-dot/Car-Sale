/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, Star, MapPin, Check, Wrench, Clock, 
  Calendar, Phone, ChevronDown, ChevronUp, X,
  ShieldCheck, FileText, Layers, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ServiceProfileInfo {
  id: string;
  name: string;
  rating: number;
  reviewsCount?: number;
  jobs?: number;
  specialties?: string[];
  services?: string[];
  certifications?: string[];
  brands?: string[];
  supportedBrands?: string[];
  languages?: string[];
  availability?: 'open_now' | 'today' | 'this_week';
  distance?: number;
  priceLevel?: number;
  rate?: number;
  image: string;
  address: string;
  phone?: string;
  workingHours?: string;
  description: string;
  insuranceCertified?: boolean;
  minPrice?: number;
}

interface ServiceProfileDetailsProps {
  info: ServiceProfileInfo;
  onClose: () => void;
}

export default function ServiceProfileDetails({ info, onClose }: ServiceProfileDetailsProps) {
  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<'form' | 'success'>('form');
  const [bookingData, setBookingData] = useState({
    serviceType: info.specialties?.[0] || info.services?.[0] || 'General Maintenance',
    date: '2026-06-26',
    time: '10:00',
    clientName: '',
    clientPhone: '',
    notes: ''
  });

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // General fallback data
  const rating = info.rating || 4.9;
  const address = info.address || 'Vilnius, Lithuania';
  const phone = info.phone || '+370 (5) 212-9991';
  const description = info.description || `${info.name} stands as a premier automotive service provider, executing state-of-the-art diagnostics and structural repairs with master-level calibration standards.`;
  const specialties = info.specialties || info.services || ['System Diagnostics', 'Chassis Calibration', 'Prestige Refinishing'];

  const faqData = [
    {
      q: 'Do you provide a formal warranty on your work?',
      a: 'Yes, all structural alignment, mechanical repairs, and detailing treatments executed at our facility carry a comprehensive 12-month parts and labor warranty.'
    },
    {
      q: 'How do you coordinate with insurance companies?',
      a: 'We are certified direct-billing partners with major Baltic and international insurance firms. We submit direct digital estimates and handle the approval workflow on your behalf.'
    },
    {
      q: 'Can I wait at the facility during my appointment?',
      a: 'Absolutely. We offer a modern, high-comfort client lounge with high-speed Wi-Fi, refreshments, and a live visual monitor of our active service bays.'
    }
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStep('success');
  };

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setBookingStep('form');
    setBookingData({
      serviceType: info.specialties?.[0] || info.services?.[0] || 'General Maintenance',
      date: '2026-06-26',
      time: '10:00',
      clientName: '',
      clientPhone: '',
      notes: ''
    });
  };

  return (
    <div id="vendor-profile-canvas" className="bg-[#F5F5F7] min-h-screen font-sans text-slate-800 relative flex flex-col w-full">
      
      {/* 2. HERO HEADER SECTION */}
      <div id="vendor-profile-hero" className="bg-[#0f111a] text-white pt-6 pb-16 px-6 md:px-12 lg:px-24 relative overflow-hidden shrink-0">
        {/* Subtle Background Mesh Accent */}
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-[0.03] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        {/* Decorative Red Ambient Glow matching website brand */}
        <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#8B0000]/10 blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col gap-6 relative z-10 w-full">
          {/* Back Button integrated inside Hero Section */}
          <button
            id="profile-back-to-directory-btn"
            onClick={onClose}
            className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-all duration-200 cursor-pointer group self-start"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Directory</span>
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 w-full">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left w-full">
              {/* Avatar block with rounded square and thick sleek white borders matching screenshot */}
              <div id="vendor-avatar-container" className="w-[140px] h-[140px] rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-[#8B0000] flex items-center justify-center shrink-0">
              {info.image ? (
                <img 
                  src={info.image} 
                  alt={info.name} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-white text-3xl font-extrabold font-mono tracking-tight text-center">
                  {info.name ? info.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'W'}
                </span>
              )}
            </div>

            {/* Title & Action Buttons Hierarchy */}
            <div className="space-y-3 flex-1 text-left">
              {/* Speciality and Verified Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="text-[10px] uppercase font-mono font-black px-2.5 py-1 rounded bg-[#8B0000]/25 text-red-200 border border-[#8B0000]/40 tracking-wider">
                  {specialties[0] || 'Automotive Service'}
                </span>
                <span className="text-[10px] uppercase font-mono font-black px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 tracking-wider flex items-center gap-1">
                  <Check className="w-3 h-3" /> Verified
                </span>
              </div>

              <h1 id="vendor-profile-title" className="text-3xl md:text-5xl font-sans font-extrabold text-white tracking-tight leading-tight" style={{ color: '#ffffff' }}>
                {info.name}
              </h1>
              
              {/* Location & Rating Subtitle */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs md:text-sm text-slate-300 font-medium">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="w-4 h-4 text-[#8B0000]" /> {address}
                </span>
                <span className="text-slate-600 hidden md:inline">•</span>
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> <span>{rating.toFixed(1)}</span> <span className="text-slate-400 font-normal">({info.reviewsCount || 2} reviews)</span>
                </span>
              </div>

              {/* Primary Action Buttons placed inside Title container to match screenshot layout */}
              <div className="flex flex-wrap gap-3 pt-3 w-full justify-center md:justify-start">
                <button
                  id="hero-book-now-btn"
                  type="button"
                  onClick={() => setIsBookingModalOpen(true)}
                  className="bg-[#8B0000] text-white font-bold text-xs px-6 py-3.5 rounded-[8px] hover:bg-[#800000] hover:-translate-y-[1px] transition-all duration-200 uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg shadow-[#8B0000]/20"
                >
                  <span>Get a Quote &amp; Book</span>
                </button>
                <button
                  id="hero-visit-website-btn"
                  type="button"
                  onClick={() => {
                    const notify = document.createElement('div');
                    notify.className = "fixed bottom-10 right-10 z-50 bg-slate-900 text-white font-mono text-xs px-5 py-3 rounded-xl border border-slate-800 shadow-2xl animate-fade-in";
                    notify.innerHTML = `🛡️ Connecting to <b>${info.name}</b> external secure site...`;
                    document.body.appendChild(notify);
                    setTimeout(() => notify.remove(), 2500);
                  }}
                  className="bg-transparent text-white border border-white/30 font-bold text-xs px-6 py-3.5 rounded-[8px] hover:bg-white/10 hover:border-white/50 hover:-translate-y-[1px] transition-all duration-200 uppercase tracking-wider cursor-pointer flex items-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>Visit Website</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

      {/* 3. FLOATING METADATA STRIP MATCHING SCREENSHOT */}
      <div id="vendor-metadata-strip-wrapper" className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 -mt-10 relative z-20 w-full shrink-0">
        <div id="vendor-metadata-strip" className="bg-white rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.06)] border border-slate-200/60 p-5 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 md:gap-6">
          
          {/* Status block */}
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-mono tracking-widest block uppercase font-bold">STATUS</span>
              <span className="text-sm font-extrabold text-slate-900 leading-tight block">
                Verified Partner
              </span>
            </div>
          </div>

          {/* License block */}
          <div className="flex items-center gap-3.5 text-left lg:border-l lg:border-slate-150 lg:pl-6">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-mono tracking-widest block uppercase font-bold">LICENSE</span>
              <span className="text-sm font-extrabold text-slate-900 leading-tight block uppercase font-mono">
                LT-{info.id ? info.id.substring(0, 6).toUpperCase() : 'W908X'}
              </span>
            </div>
          </div>

          {/* Specialties block */}
          <div className="flex items-center gap-3.5 text-left lg:border-l lg:border-slate-150 lg:pl-6">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-mono tracking-widest block uppercase font-bold">PRODUCTS</span>
              <span className="text-sm font-extrabold text-slate-900 leading-tight block">
                {specialties.length} Available
              </span>
            </div>
          </div>

          {/* Coverage block */}
          <div className="flex items-center gap-3.5 text-left lg:border-l lg:border-slate-150 lg:pl-6">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-mono tracking-widest block uppercase font-bold">COVERAGE</span>
              <span className="text-sm font-extrabold text-slate-900 leading-tight block">
                {address.split(',')[0]}
              </span>
            </div>
          </div>

          {/* Rating block */}
          <div className="flex items-center gap-3.5 text-left lg:border-l lg:border-slate-150 lg:pl-6">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 font-mono tracking-widest block uppercase font-bold">RATING</span>
              <span className="text-sm font-extrabold text-slate-900 leading-tight block font-mono">
                {rating.toFixed(1)} / 5.0
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 4. BODY CONTENT BLOCKS */}
      <div id="vendor-body-blocks" className="flex flex-col w-full">
        
        {/* ROW 1: Why Work With Us Section */}
        <div id="why-work-with-us-section" className="py-16 bg-white border-b border-slate-100 w-full">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-4">
            <h2 className="text-2xl font-bold font-sans text-slate-900 tracking-tight">
              Why Work With Us
            </h2>
            <p className="text-slate-600 text-base leading-relaxed font-normal max-w-4xl">
              {description} We have fine-tuned our diagnostic models and chassis tooling suites to offer seamless reliability. We provide full diagnostics readouts, detailed digital estimates, and post-repair quality assurance checklists. Our master mechanics undergo continuous certification processes to match the evolving technical complexities of modern propulsion, suspension, and body-forming architectures.
            </p>
          </div>
        </div>

        {/* ROW 2: Areas of Expertise Grid */}
        <div id="areas-of-expertise-section" className="py-16 bg-[#F5F5F7] border-b border-slate-100 w-full">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-8">
            <h2 className="text-2xl font-bold font-sans text-slate-900 tracking-tight">
              Areas of Expertise
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {specialties.map((spec, idx) => {
                // Descriptive fallback text matching common categories
                let desc = "Highly calibrated technical treatment ensuring exact tolerance fitment and factory specification matching.";
                if (spec.toLowerCase().includes('paint') || spec.toLowerCase().includes('coating')) {
                  desc = "Multi-layer high-gloss coatings and computerized paint spectroscopy match alignment.";
                } else if (spec.toLowerCase().includes('weld') || spec.toLowerCase().includes('metal') || spec.toLowerCase().includes('fabrication')) {
                  desc = "Heavy metallurgy structural welding, chassis realignment, and high-tensile structural safe reinforcing.";
                } else if (spec.toLowerCase().includes('glass') || spec.toLowerCase().includes('windshield')) {
                  desc = "Flawless glass curing, minor resin injection, and ADAS camera calibration synchronization.";
                } else if (spec.toLowerCase().includes('rust') || spec.toLowerCase().includes('protection')) {
                  desc = "Complete underbody de-scaling, rust neutralization, and protective wax protective membranes.";
                } else if (spec.toLowerCase().includes('diagnostic') || spec.toLowerCase().includes('engine') || spec.toLowerCase().includes('mechanic')) {
                  desc = "Full electronic systems readout, sensor optimization, and control module firmware analysis.";
                }

                return (
                  <div 
                    key={idx} 
                    className="bg-white rounded-xl border border-slate-100 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-[#8B0000]">
                        <Wrench className="w-5 h-5" />
                      </div>
                      <h3 className="font-sans font-bold text-slate-900 text-lg">
                        {spec}
                      </h3>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ROW 3: How We Work / Process Timeline */}
        <div id="process-timeline-section" className="py-16 bg-white border-b border-slate-100 w-full">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-12">
            <h2 className="text-2xl font-bold font-sans text-slate-900 tracking-tight text-center md:text-left">
              How We Work
            </h2>
            
            <div className="relative p-2">
              {/* Connecting Horizontal Line */}
              <div className="absolute left-[15%] right-[15%] top-6 h-[2px] bg-slate-100 hidden md:block z-0"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                
                {/* Step 1 */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#1A1A1E] text-white flex items-center justify-center font-bold font-mono text-sm shadow-md">
                    01
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-sans font-bold text-slate-900 text-base">
                      Diagnostic Inspection
                    </h4>
                    <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto md:mx-0">
                      We run deep digital scans, sensor sweeps, and laser structural checks to isolate physical flaws.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#8B0000] text-white flex items-center justify-center font-bold font-mono text-sm shadow-md">
                    02
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-sans font-bold text-slate-900 text-base">
                      Master Execution
                    </h4>
                    <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto md:mx-0">
                      Our certified mechanics work in precision bays utilizing OEM specification tolerances.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#1A1A1E] text-white flex items-center justify-center font-bold font-mono text-sm shadow-md">
                    03
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-sans font-bold text-slate-900 text-base">
                      Validation Handover
                    </h4>
                    <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto md:mx-0">
                      We conduct a post-repair diagnostic verification checklist and safety test before returning keys.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ROW 4: Coverage & Location Matrix */}
        <div id="coverage-matrix-section" className="py-16 bg-[#F5F5F7] border-b border-slate-100 w-full">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-6">
            <h2 className="text-2xl font-bold font-sans text-slate-900 tracking-tight">
              Coverage & Specifications
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Regions Served Panel */}
              <div className="bg-white rounded-xl border border-slate-100 p-8 shadow-xs space-y-4">
                <h3 className="font-sans font-bold text-slate-900 text-lg">
                  Regions Served
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Vilnius Central', 'Vilnius Suburbs', 'Kaunas Metro', 'Klaipėda District', 'Šiauliai Highway Axis'].map((region, rIdx) => (
                    <span 
                      key={rIdx} 
                      className="bg-slate-50 hover:bg-slate-100 transition-colors duration-150 text-slate-600 text-xs font-semibold px-3.5 py-2 rounded-full font-sans cursor-default border border-slate-200/50"
                    >
                      📍 {region}
                    </span>
                  ))}
                </div>
              </div>

              {/* Specialized Car Brands Panel */}
              <div className="bg-white rounded-xl border border-slate-100 p-8 shadow-xs space-y-4">
                <h3 className="font-sans font-bold text-slate-900 text-lg">
                  Specialized Car Brands
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(info.brands || info.supportedBrands || ['BMW', 'Audi', 'Mercedes-Benz', 'Volkswagen', 'Porsche', 'Tesla', 'Volvo', 'Lexus']).map((brand, bIdx) => (
                    <span 
                      key={bIdx} 
                      className="bg-slate-50 hover:bg-slate-100 transition-colors duration-150 text-slate-700 text-xs font-mono font-bold px-3.5 py-2 rounded-full cursor-default border border-slate-200/50"
                    >
                      🚗 {brand}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ROW 5: Client Reviews & FAQs */}
        <div id="reviews-faq-section-row" className="py-16 bg-white w-full">
          <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-16">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Reviews & FAQs */}
              <div className="lg:col-span-2 space-y-12">
                
                {/* Client Reviews */}
                <div className="space-y-6">
                  <h3 className="font-sans font-bold text-slate-900 text-xl border-b border-slate-100 pb-3">
                    Verified Customer Reviews
                  </h3>
                  
                  <div className="space-y-6 divide-y divide-slate-100">
                    
                    {/* Review 1 */}
                    <div className="space-y-2 pt-4 first:pt-0">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900 text-sm">Jonas K.</span>
                        <span className="text-amber-500 font-bold text-xs">★★★★★ 5.0</span>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed italic">
                        "Exemplary service. Diagnosed a complex suspension rattle on my Audi Q7 in less than an hour and resolved it flawlessly. Extremely clean garage floor."
                      </p>
                    </div>

                    {/* Review 2 */}
                    <div className="space-y-2 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900 text-sm">Marija L.</span>
                        <span className="text-amber-500 font-bold text-xs">★★★★★ 5.0</span>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed italic">
                        "Very transparent direct pricing. Received a digital diagnostic breakdown and the clearcoat spray booth match on my bumper was absolutely flawless."
                      </p>
                    </div>

                    {/* Review 3 */}
                    <div className="space-y-2 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900 text-sm">Tomas G.</span>
                        <span className="text-amber-500 font-bold text-xs">★★★★★ 4.9</span>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed italic">
                        "Excellent underbody rust coating. They even sent diagnostic walkthrough photos of my chassis rails over email. Vetted professionals."
                      </p>
                    </div>

                  </div>
                </div>

                {/* FAQs Accordion */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-sans font-bold text-slate-900 text-xl">
                    Frequently Asked Questions
                  </h3>
                  
                  <div className="space-y-3">
                    {faqData.map((faq, fIdx) => {
                      const isOpen = expandedFaq === fIdx;
                      return (
                        <div 
                          key={fIdx} 
                          className="border border-slate-100 rounded-lg overflow-hidden transition-colors"
                        >
                          <button
                            type="button"
                            onClick={() => setExpandedFaq(isOpen ? null : fIdx)}
                            className="w-full flex justify-between items-center p-4 text-left font-sans font-bold text-slate-800 text-sm bg-slate-50 hover:bg-slate-100/60 transition-colors"
                          >
                            <span>{faq.q}</span>
                            {isOpen ? <ChevronUp className="w-4 h-4 text-[#8B0000]" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                          </button>
                          
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div className="p-4 text-xs text-slate-500 leading-relaxed bg-white border-t border-slate-100">
                                  {faq.a}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Right Side: Flat Booking Card CTA Panel */}
              <div className="space-y-6 lg:sticky lg:top-24">
                <div className="bg-white rounded-xl border border-slate-200/60 p-8 shadow-sm space-y-4 text-center md:text-left">
                  <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-[#8B0000] mx-auto md:mx-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-sans font-bold text-slate-900 text-lg leading-tight">
                      Ready to Book Your Service?
                    </h4>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Reserve your alignment bay, diagnostics hook, or body repair inspection slot instantly at our modern facility.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      id="side-booking-card-btn"
                      type="button"
                      onClick={() => setIsBookingModalOpen(true)}
                      className="w-full bg-[#8B0000] text-white font-bold text-xs py-4 rounded-[8px] shadow-[0_4px_10px_rgba(153,0,0,0.3),inset_0_-2px_0_rgba(0,0,0,0.15)] hover:bg-[#4A4A4A] hover:shadow-[0_6px_15px_rgba(0,0,0,0.15)] transition-all duration-200 transform hover:-translate-y-[1px] cursor-pointer uppercase tracking-wider text-center"
                    >
                      Book Service Lift
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Book Service Lift Modal Overlay */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-[999]">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
            >
              
              {/* Modal Header */}
              <div className="bg-[#1A1A1E] text-white p-5 flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="font-sans font-bold text-base">Schedule Appointment</h3>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{info.name}</p>
                </div>
                <button 
                  onClick={handleCloseBookingModal}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {bookingStep === 'form' ? (
                <form onSubmit={handleBookingSubmit} className="p-6 space-y-4 text-left">
                  
                  {/* Service selection */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Select Service Category</label>
                    <select
                      value={bookingData.serviceType}
                      onChange={(e) => setBookingData({ ...bookingData, serviceType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs p-2.5 font-sans font-bold text-slate-800 focus:outline-hidden focus:border-[#8B0000]"
                    >
                      {specialties.map((s, sIdx) => (
                        <option key={sIdx} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date & Time Picker */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Date</label>
                      <input
                        required
                        type="date"
                        value={bookingData.date}
                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs p-2.5 font-sans font-bold text-slate-855 focus:outline-hidden focus:border-[#8B0000]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Time</label>
                      <input
                        required
                        type="time"
                        value={bookingData.time}
                        onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs p-2.5 font-sans font-bold text-slate-855 focus:outline-hidden focus:border-[#8B0000]"
                      />
                    </div>
                  </div>

                  {/* Driver Name & Contact */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Driver Full Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Lukas Karolis"
                      value={bookingData.clientName}
                      onChange={(e) => setBookingData({ ...bookingData, clientName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs p-2.5 font-sans font-bold text-slate-855 focus:outline-hidden focus:border-[#8B0000]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Contact Phone Number</label>
                    <input
                      required
                      type="tel"
                      placeholder="e.g. +370 600 00000"
                      value={bookingData.clientPhone}
                      onChange={(e) => setBookingData({ ...bookingData, clientPhone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs p-2.5 font-sans font-bold text-slate-855 focus:outline-hidden focus:border-[#8B0000]"
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Troubleshooting Notes (Optional)</label>
                    <textarea
                      rows={2}
                      placeholder="Mention any specific chassis sounds, warning lights, or material specifications..."
                      value={bookingData.notes}
                      onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs p-2.5 font-sans font-semibold text-slate-855 focus:outline-hidden focus:border-[#8B0000] resize-none"
                    />
                  </div>

                  {/* Confirm CTA */}
                  <div className="pt-2">
                    <button
                      id="modal-confirm-booking-btn"
                      type="submit"
                      className="w-full bg-[#8B0000] text-white font-bold text-xs py-4 rounded-[8px] shadow-[0_4px_6px_-1px_rgba(153,0,0,0.3),inset_0_-2px_0_rgba(0,0,0,0.2)] hover:bg-[#4A4A4A] transition-all duration-200 uppercase tracking-wider text-center cursor-pointer"
                    >
                      Confirm Appointment
                    </button>
                  </div>

                </form>
              ) : (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto border-2 border-emerald-350 shadow-xs">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-sans font-bold text-slate-900 text-lg">Appointment Securely Logged</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      Your diagnostics check is scheduled on <span className="font-bold text-slate-800">{bookingData.date}</span> at <span className="font-bold text-slate-800">{bookingData.time}</span>. A master tech has been dispatched for preparation.
                    </p>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleCloseBookingModal}
                      className="w-full bg-[#1A1A1E] hover:bg-[#4A4A4A] text-white font-bold text-xs py-3 rounded-[8px] transition-colors uppercase tracking-wider cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

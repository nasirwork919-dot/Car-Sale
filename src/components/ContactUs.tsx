/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, Phone, MapPin, Clock, Send, Check, RefreshCw, HelpCircle,
  Briefcase, Newspaper, Scale, Building, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DepartmentDetails {
  id: 'support' | 'business' | 'press' | 'legal';
  name: string;
  icon: React.ComponentType<any>;
  avgResponseTime: string;
  fields: {
    label: string;
    type: 'text' | 'email' | 'textarea' | 'select';
    placeholder: string;
    required: boolean;
    name: string;
    options?: string[];
  }[];
}

export default function ContactUs() {
  // Department structure with simplified English and no technical clutter
  const departments: DepartmentDetails[] = [
    {
      id: 'support',
      name: 'Customer Support & Helpdesk',
      icon: HelpCircle,
      avgResponseTime: 'Average reply: Under 15 minutes',
      fields: [
        { label: 'Your Full Name', type: 'text', placeholder: 'e.g. Lukas Petrauskas', required: true, name: 'userName' },
        { label: 'Email Address', type: 'email', placeholder: 'e.g. lukas@example.com', required: true, name: 'userEmail' },
        { label: 'Topic Category', type: 'select', placeholder: 'Select support topic', required: true, name: 'supportTopic', options: ['Listing & Car Upload Issues', 'Escrow & Payments', 'Customs & Delivery Tracking', 'Account & Billing', 'General Inquiry'] },
        { label: 'Vehicle plate or VIN (Optional)', type: 'text', placeholder: 'e.g. WP0AB2A92M...', required: false, name: 'vin' },
        { label: 'Your Message', type: 'textarea', placeholder: 'Describe how we can help you today...', required: true, name: 'message' }
      ]
    },
    {
      id: 'business',
      name: 'Business Development',
      icon: Briefcase,
      avgResponseTime: 'Average reply: Under 4 hours',
      fields: [
        { label: 'Company Name', type: 'text', placeholder: 'e.g. Baltic Cars UAB', required: true, name: 'companyName' },
        { label: 'Your Name', type: 'text', placeholder: 'e.g. Agnė Noreikaitė', required: true, name: 'userName' },
        { label: 'Work Email Address', type: 'email', placeholder: 'e.g. agne@balticcars.lt', required: true, name: 'userEmail' },
        { label: 'Monthly Cars Volume', type: 'select', placeholder: 'Select volume tier', required: true, name: 'businessVolume', options: ['10-99 cars/month', '100-499 cars/month', '500+ cars/month'] },
        { label: 'Your Partnership Message', type: 'textarea', placeholder: 'Describe your business plans, API needs, or fleet shipping requirements...', required: true, name: 'message' }
      ]
    },
    {
      id: 'press',
      name: 'Press & Media Relations',
      icon: Newspaper,
      avgResponseTime: 'Average reply: Under 12 hours',
      fields: [
        { label: 'Media Company Name', type: 'text', placeholder: 'e.g. Baltic Business Daily', required: true, name: 'mediaName' },
        { label: 'Your Name', type: 'text', placeholder: 'e.g. Paulius Žemaitis', required: true, name: 'userName' },
        { label: 'Press Email Address', type: 'email', placeholder: 'e.g. paulius@bbdaily.com', required: true, name: 'userEmail' },
        { label: 'Inquiry Topic', type: 'select', placeholder: 'Select topic', required: true, name: 'pressTopic', options: ['Market Data Query', 'Interview Request', 'Co-Marketing Proposals', 'Brand Logos & Assets', 'Other'] },
        { label: 'Your Press Message & Deadline', type: 'textarea', placeholder: 'Describe your article, query, and your publishing deadline...', required: true, name: 'message' }
      ]
    },
    {
      id: 'legal',
      name: 'Legal & Compliance Desk',
      icon: Scale,
      avgResponseTime: 'Average reply: Under 24 hours',
      fields: [
        { label: 'Legal Firm or Agency Name', type: 'text', placeholder: 'e.g. Vilnius District Court', required: true, name: 'legalAgency' },
        { label: 'Your Name / Title', type: 'text', placeholder: 'e.g. Dr. Tomas Kazlauskas', required: true, name: 'userName' },
        { label: 'Official Email Address', type: 'email', placeholder: 'e.g. tomas@vpt.gov.lt', required: true, name: 'userEmail' },
        { label: 'Urgency Level', type: 'select', placeholder: 'Select urgency', required: true, name: 'legalSeverity', options: ['High Urgency', 'Medium Urgency', 'Standard Verification'] },
        { label: 'Legal Statement / Request Details', type: 'textarea', placeholder: 'Please state specific law codes, case details, or active car transaction IDs...', required: true, name: 'message' }
      ]
    }
  ];

  const [activeDept, setActiveDept] = useState<'support' | 'business' | 'press' | 'legal'>('support');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; ticketId?: string } | null>(null);

  // Office location data with simplified descriptions
  const officeLocations = [
    {
      city: 'Vilnius HQ (Lithuania)',
      address: 'Konstitucijos pr. 21A, Quadrum East, LT-08105 Vilnius',
      phone: '+370 612 34567',
      email: 'vilnius.hub@justcarsale.com',
      hours: 'Mon - Fri (08:30 - 18:00)',
      purpose: 'Our main office handling systems engineering, core operations, and support.',
      imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&h=380&q=80'
    },
    {
      city: 'Warsaw Depot (Poland)',
      address: 'Aleje Jerozolimskie 123A, Millennium Plaza, 02-017 Warsaw',
      phone: '+48 22 789 1234',
      email: 'warsaw.depot@justcarsale.com',
      hours: 'Mon - Sat (09:00 - 19:00)',
      purpose: 'Our central European logistics hub, handling deliveries and customs checks.',
      imageUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&h=380&q=80'
    },
    {
      city: 'Riga Operations Hub (Latvia)',
      address: 'Kr. Valdemāra iela 21, Centra rajons, LV-1010 Rīga',
      phone: '+371 67 123 456',
      email: 'riga.hub@justcarsale.com',
      hours: 'Mon - Fri (09:00 - 18:00)',
      purpose: 'Our maritime transit station, organizing seaport clearance and local checks.',
      imageUrl: 'https://images.unsplash.com/photo-1608955047879-df3f707f433c?auto=format&fit=crop&w=600&h=380&q=80'
    }
  ];

  const [activeOfficeIndex, setActiveOfficeIndex] = useState(0);

  // --- LIVE CHAT WIDGET STATE AND SIMULATOR ---
  const [chatInput, setChatInput] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  
  // Initialize with greeting messages in simple English
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; sender: 'user' | 'agent' | 'system'; text: string; time: string }>>([
    {
      id: 'greeting-1',
      sender: 'agent',
      text: "Hello! I'm Justas, your virtual assistant.",
      time: 'Just now'
    },
    {
      id: 'greeting-2',
      sender: 'agent',
      text: "How can I help you? Ask me about car delivery tracking, escrow safety, or syncing your dealer shop listings.",
      time: 'Just now'
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat to bottom when messages list changes
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isAgentTyping]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = `TICKET-${activeDept.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      setIsSubmitting(false);
      setSubmitResult({
        success: true,
        ticketId: generatedId
      });
      setFormData({});
    }, 1200);
  };

  const handleResetForm = () => {
    setSubmitResult(null);
  };

  // Pre-configured questions for live chat
  const chatQuickQueries = [
    "Track my car delivery",
    "How does escrow work?",
    "Sync my dealer listings",
    "Where is my customs tax receipt?"
  ];

  // Automated chatbot response map (Simplified English)
  const getChatbotResponse = (userMsg: string): string => {
    const msg = userMsg.toLowerCase();
    if (msg.includes('track') || msg.includes('transit') || msg.includes('delivery')) {
      return "I can help you check your car delivery. Please type your 17-character VIN number here so I can check the exact location of the delivery truck.";
    }
    if (msg.includes('escrow') || msg.includes('safety') || msg.includes('protect')) {
      return "Our secure escrow service holds your money safely. The seller only receives the payment after our certified inspectors check the car and stamp the files.";
    }
    if (msg.includes('sync') || msg.includes('dealership') || msg.includes('inventory') || msg.includes('api')) {
      return "To sync your dealership cars with our platform, please send a message to our Business Development department using the form above.";
    }
    if (msg.includes('tax') || msg.includes('duty') || msg.includes('receipt') || msg.includes('vat')) {
      return "Your customs tax receipts are saved in your personal dashboard. You can download them as simple PDF files anytime.";
    }
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return "Hi there! Let me know what you want to know about buying, selling, or transporting cars with us.";
    }
    return "Thank you for the message. I have logged these details. If you need immediate help, feel free to use the support contact form above.";
  };

  const handleSendChatMessage = (textToSubmit: string) => {
    if (!textToSubmit.trim()) return;

    // 1. Add user message
    const userMsgId = `usr-${Date.now()}`;
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setChatMessages(prev => [
      ...prev,
      { id: userMsgId, sender: 'user', text: textToSubmit, time: timeString }
    ]);
    setChatInput('');

    // 2. Trigger typing delay and reply
    setIsAgentTyping(true);
    setTimeout(() => {
      setIsAgentTyping(false);
      const botResponse = getChatbotResponse(textToSubmit);
      setChatMessages(prev => [
        ...prev,
        { id: `bot-${Date.now()}`, sender: 'agent', text: botResponse, time: timeString }
      ]);
    }, 1000);
  };

  return (
    <div className="w-full space-y-16 bg-white py-8" id="contact-us-page-root">
      
      {/* ============================================================== */}
      {/* 1. SECTION: HERO HEADER BANNER (NO tag / NO long tech jargon) */}
      {/* ============================================================== */}
      <section className="text-center space-y-4 max-w-4xl mx-auto px-4 pt-4" id="contact-hero">
        <h1 className="text-4xl sm:text-6xl font-black text-zinc-900 tracking-tight leading-none uppercase font-sans" id="contact-main-title">
          Contact Our <span className="text-[#8B0000] underline decoration-4 decoration-[#8B0000]/20 underline-offset-8">Global Team</span>
        </h1>
      </section>

      {/* ============================================================== */}
      {/* 2. SECTION: CONTACT FORM BY DEPARTMENT (White + Blood Red 3D Styling) */}
      {/* ============================================================== */}
      <section className="max-w-[1240px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left" id="contact-split-stage">
        
        {/* Left Side: Department Selectors & Instructions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border-b-2 border-zinc-900 pb-3">
            <h2 className="text-sm font-mono font-black text-zinc-900 uppercase tracking-widest">
              1. Select Department
            </h2>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1 font-mono leading-relaxed">
              Choose the right department to send your message to.
            </p>
          </div>

          <div className="flex flex-col gap-3" id="department-selector-buttons-group">
            {departments.map((dept) => {
              const IconComp = dept.icon;
              const isSelected = activeDept === dept.id;
              return (
                <button
                  key={dept.id}
                  type="button"
                  onClick={() => {
                    setActiveDept(dept.id);
                    setSubmitResult(null);
                  }}
                  className={`w-full p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#8B0000] border-transparent text-white shadow-xs'
                      : 'bg-white border-zinc-200 hover:border-[#8B0000] text-zinc-800 shadow-xs'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border-2 ${
                      isSelected ? 'bg-white/10 text-white border-white/20' : 'bg-zinc-50 text-[#8B0000] border-[#8B0000]/20'
                    }`}>
                      <IconComp className="w-5 h-5 shrink-0" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wide">
                        {dept.name}
                      </h4>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* SLA Notification indicator card */}
          <div className="bg-white p-5 rounded-xl text-xs space-y-3 border border-zinc-200 shadow-xs">
            <div className="flex items-center gap-2 text-zinc-900 font-bold">
              <Clock className="w-4 h-4 text-[#8B0000]" />
              <span className="uppercase text-[9px] tracking-widest font-mono font-black">FAST RESPONSE TIMES</span>
            </div>
            <p className="text-zinc-500 text-[10px] uppercase tracking-wider font-mono leading-normal">
              We reply fast! Private sellers get help first.
            </p>
            <div className="text-[10px] font-black font-mono uppercase bg-zinc-50 px-3 py-2 border border-zinc-200 text-center text-[#8B0000]">
              {departments.find(d => d.id === activeDept)?.avgResponseTime}
            </div>
          </div>
        </div>
 
        {/* Right Side: Dynamically Loaded Form Workspace (White + Blood Red 3D Styling) */}
        <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-xl p-6 md:p-8 shadow-sm">
          
          <div className="space-y-2 pb-5 border-b-2 border-dashed border-zinc-100">
            <h3 className="text-lg sm:text-xl font-black text-zinc-900 uppercase tracking-wide border-l-4 border-[#8B0000] pl-3">
              {departments.find(d => d.id === activeDept)?.name}
            </h3>
          </div>

          <AnimatePresence mode="wait">
            {!submitResult ? (
              <motion.form
                key={`${activeDept}-form`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleFormSubmit}
                className="space-y-5 pt-6 text-zinc-700 font-bold text-xs"
                id="contact-departmental-form"
              >
                
                {/* Dynamically build custom fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {departments.find(d => d.id === activeDept)?.fields.filter(f => f.type !== 'textarea').map((field, idx) => (
                    <div key={idx} className="space-y-1.5 flex flex-col">
                      <label className="text-[9px] uppercase font-mono text-zinc-500 font-black tracking-widest">
                        {field.label} {field.required && <span className="text-[#8B0000]">*</span>}
                      </label>
 
                      {field.type === 'select' ? (
                        <select
                          required={field.required}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          className="w-full bg-white border border-zinc-200 focus:border-[#8B0000] rounded-lg px-3.5 py-3 text-xs text-zinc-800 font-bold uppercase tracking-wider focus:outline-none transition-all focus:ring-2 focus:ring-[#8B0000]/10"
                        >
                          <option value="">{field.placeholder}</option>
                          {field.options?.map((opt, oIdx) => (
                            <option key={oIdx} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          required={field.required}
                          type={field.type}
                          placeholder={field.placeholder}
                          value={formData[field.name] || ''}
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          className="w-full bg-white border border-zinc-200 focus:border-[#8B0000] px-3.5 py-3 rounded-lg font-bold uppercase tracking-wider outline-none text-zinc-900 transition-all text-xs placeholder:text-zinc-400 focus:ring-2 focus:ring-[#8B0000]/10"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Textarea fields */}
                {departments.find(d => d.id === activeDept)?.fields.filter(f => f.type === 'textarea').map((field, idx) => (
                  <div key={idx} className="space-y-1.5 flex flex-col pt-1">
                    <label className="text-[9px] uppercase font-mono text-zinc-500 font-black tracking-widest">
                      {field.label} {field.required && <span className="text-[#8B0000]">*</span>}
                    </label>
                    <textarea
                      required={field.required}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      className="w-full bg-white border border-zinc-200 focus:border-[#8B0000] p-3.5 rounded-lg font-normal outline-none text-zinc-900 min-h-[140px] leading-relaxed text-xs transition-all focus:ring-2 focus:ring-[#8B0000]/10"
                    />
                  </div>
                ))}

                {/* Form Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t-2 border-dashed border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setFormData({})}
                    className="border-2 border-zinc-200 hover:border-zinc-900 px-5 py-3 rounded-lg text-xs font-mono font-black text-zinc-600 hover:text-zinc-900 transition-all uppercase tracking-widest cursor-pointer"
                  >
                    Clear Form
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#8B0000] hover:bg-[#700000] text-white font-mono font-black uppercase py-3 px-6 rounded-lg text-xs tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 border border-transparent shadow-xs"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>SENDING...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-white" />
                        <span>SEND MESSAGE</span>
                      </>
                    )}
                  </button>
                </div>

              </motion.form>
            ) : (
              <motion.div
                key="submitted-card"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-12 animate-fade-in"
                id="form-success-receipt"
              >
                <div className="w-16 h-16 bg-white border border-zinc-200 text-[#8B0000] rounded-lg flex items-center justify-center mx-auto shadow-xs">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-black text-zinc-900 uppercase tracking-widest">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-xs text-zinc-550 max-w-sm mx-auto font-mono uppercase tracking-wider leading-relaxed">
                    We received your inquiry. Our team will get back to you soon.
                  </p>
                </div>

                <div className="bg-zinc-50 text-zinc-900 border border-zinc-200 p-4 rounded-lg max-w-xs mx-auto font-mono text-center space-y-1 shadow-xs">
                  <span className="text-[8px] uppercase tracking-widest text-zinc-400 block font-bold">REFERENCE ID</span>
                  <strong className="text-[#8B0000] tracking-widest text-sm block font-black">{submitResult.ticketId}</strong>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="bg-[#8B0000] hover:bg-[#700000] text-white font-mono font-black uppercase text-[10px] tracking-widest px-6 py-3 rounded-lg transition-all cursor-pointer inline-flex items-center gap-2 border border-transparent shadow-xs"
                  >
                    <span>Send another Message</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. SECTION: INTERACTIVE OFFICE LOCATIONS & TRANSIT REGION */}
      {/* ============================================================== */}
      <section className="bg-zinc-50 border-y-2 border-[#8B0000]/25 py-16 text-left" id="office-locations-section">
        <div className="max-w-[1240px] mx-auto px-4 space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight uppercase" id="locations-title">
              Our Offices
            </h2>
            <p className="text-zinc-500 text-xs sm:text-sm font-normal uppercase tracking-wider leading-relaxed max-w-xl mx-auto">
              Visit any of our offices for direct help, car inspections, or registry checks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">
            
            {/* Office selectors: 4 columns */}
            <div className="lg:col-span-4 flex flex-col gap-3 justify-center" id="locations-selectors-group">
              {officeLocations.map((office, idx) => {
                const isSelected = activeOfficeIndex === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveOfficeIndex(idx)}
                    className={`w-full p-5 rounded-xl border-2 text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#8B0000] border-[#8B0000] text-white shadow-xs scale-[1.01]'
                        : 'bg-white border-zinc-200 hover:border-[#8B0000] text-zinc-800 hover:shadow-xs'
                    }`}
                  >
                    <h4 className="text-sm font-black uppercase tracking-tight leading-snug">
                      {office.city}
                    </h4>
                    <p className={`text-[10px] font-mono uppercase tracking-wider truncate mt-1 ${
                      isSelected ? 'text-red-200' : 'text-zinc-400'
                    }`}>
                      {office.address}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Selected Office Details: 8 columns (White + Blood Red 3D Styling) */}
            <div className="lg:col-span-8 bg-white border border-zinc-200 rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-sm" id="selected-office-card">
              
              {/* Image Frame */}
              <div className="relative h-48 md:h-full bg-zinc-50 border-r-2 border-dashed border-[#8B0000]/20">
                <img
                  src={officeLocations[activeOfficeIndex].imageUrl}
                  alt={officeLocations[activeOfficeIndex].city}
                  className="w-full h-full object-cover filter grayscale contrast-110 brightness-90"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-zinc-950/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-5 left-5 text-white space-y-1">
                  <h3 className="font-black text-lg uppercase leading-tight font-sans">
                    {officeLocations[activeOfficeIndex].city}
                  </h3>
                </div>
              </div>

              {/* Text Context Frame */}
              <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
                
                <div className="space-y-4">
                  <div>
                    <p className="text-zinc-900 text-xs font-black uppercase tracking-wide leading-relaxed">
                      {officeLocations[activeOfficeIndex].purpose}
                    </p>
                  </div>

                  <div className="space-y-2.5 pt-1 text-xs text-zinc-500">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-[#8B0000] shrink-0 mt-0.5" />
                      <span className="font-bold uppercase tracking-wider text-[10px] text-zinc-600">{officeLocations[activeOfficeIndex].address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#8B0000] shrink-0" />
                      <span className="font-mono text-[10px] text-zinc-600 font-bold">{officeLocations[activeOfficeIndex].phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#8B0000] shrink-0" />
                      <span className="font-mono text-[10px] text-zinc-600 font-bold">{officeLocations[activeOfficeIndex].email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#8B0000] shrink-0" />
                      <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest font-bold">{officeLocations[activeOfficeIndex].hours}</span>
                    </div>
                  </div>
                </div>

                {/* Key operations actions */}
                <div className="border-t-2 border-dashed border-zinc-100 pt-4">
                  <button
                    type="button"
                    onClick={() => alert(`Opening map to show office coordinates...`)}
                    className="w-full bg-[#8B0000] hover:bg-[#700000] text-white text-[10px] font-black uppercase font-mono tracking-widest py-3 rounded-lg border border-transparent shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>View Map Coordinates</span>
                    <Globe className="w-4 h-4 text-white" />
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. UNIFIED DOCKED LIVE CHAT SYSTEM ASSISTANT */}
      {/* ============================================================== */}
      <section className="bg-white py-20 text-left" id="live-chat-panel-section">
        <div className="max-w-[1240px] mx-auto px-4">
          <div className="bg-zinc-50 border border-zinc-200/80 rounded-[32px] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
            
            <div className="space-y-4 max-w-2xl text-left">
              <span className="text-[10px] uppercase font-mono tracking-widest font-black text-[#8B0000] bg-[#8B0000]/10 px-3 py-1 rounded-full">
                Sovereign Live Assist
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 tracking-tight uppercase leading-tight">
                Our AI Broker Assistant <br className="hidden md:inline" />
                is now <span className="text-[#8B0000]">Docked &amp; Ready</span>
              </h2>
              
              <p className="text-zinc-500 text-xs sm:text-sm font-normal leading-relaxed">
                Broker Assistant Justas has been integrated directly into our platform as a persistent floating assistant in the bottom-right corner. Get help with classic exotics sourcing, delivery tracking, escrow safety, or syncing your dealer shop listings in real time from any page.
              </p>

              <div className="flex flex-wrap gap-2.5 pt-2 text-[11px] font-bold text-zinc-400">
                <div className="flex items-center gap-1.5 bg-white border border-zinc-250/70 px-3 py-1.5 rounded-xl shadow-3xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>System Active (Justas)</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white border border-zinc-250/70 px-3 py-1.5 rounded-xl shadow-3xs">
                  <span>✓ Standard SLA: &lt; 2 Secs</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center p-6 bg-white border border-zinc-200 rounded-2xl w-full lg:max-w-xs shadow-xs shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-red-50 text-[#8B0000] flex items-center justify-center font-black text-3xl animate-bounce mb-4 border border-red-100">
                🤵
              </div>
              <h4 className="text-xs font-black uppercase text-zinc-800 tracking-wide mb-1">Talk to Broker Justas</h4>
              <p className="text-[10px] text-zinc-500 font-semibold leading-relaxed mb-4 max-w-[200px]">
                Click the circular red button at the bottom-right corner to open live support.
              </p>
              <button
                type="button"
                onClick={() => {
                  const btn = document.getElementById('global-floating-chat-fab');
                  if (btn) btn.click();
                }}
                className="w-full bg-[#8B0000] hover:bg-red-700 text-white text-[10.5px] font-black uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer shadow-md shadow-red-900/10 active:scale-95"
              >
                Open Live Chat
              </button>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

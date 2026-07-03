import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Sparkles, X, Send, User, ChevronRight, ChevronLeft, HelpCircle, 
  Wrench, ShieldAlert, Tag, Compass, FileText, Globe, Scale, Bot
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Type declarations
export type AssistantType = 
  | 'global' 
  | 'mechanics' 
  | 'wrapping' 
  | 'metalwork' 
  | 'services' 
  | 'lawyers' 
  | 'contact' 
  | 'shipping';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  matchedCat?: string;
}

interface AssistantConfig {
  name: string;
  title: string;
  subtitle: string;
  avatar: string;
  themeColor: string; // Tailwind hex or class name
  accentBg: string;
  icon: React.ReactNode;
  initialMessage: string;
  suggestions: string[];
}

interface FloatingChatAssistantProps {
  currentPage: string;
  activeCategory: string | null;
  onNavigate: (page: string, category?: string | null) => void;
}

export default function FloatingChatAssistant({ 
  currentPage, 
  activeCategory,
  onNavigate 
}: FloatingChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [activeBot, setActiveBot] = useState<AssistantType>('global');
  const [isTyping, setIsTyping] = useState(false);

  // Maintain persistent chat histories per bot type
  const [histories, setHistories] = useState<Record<AssistantType, Message[]>>({
    global: [],
    mechanics: [],
    wrapping: [],
    metalwork: [],
    services: [],
    lawyers: [],
    contact: [],
    shipping: []
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Bot configurations map
  const configs: Record<AssistantType, AssistantConfig> = {
    global: {
      name: 'Global AI Assistant',
      title: 'Global Trade Copilot',
      subtitle: 'Online • Global Support',
      avatar: '🌐',
      themeColor: '#8B0000',
      accentBg: 'bg-[#8B0000]',
      icon: <Globe className="w-4 h-4 text-white" />,
      initialMessage: 'Welcome to our global automotive and trade ecosystem! I can help you find vehicle listings, verify VINs, estimate taxes, locate legal guides, or match you with local workshops. What are you looking to accomplish today?',
      suggestions: [
        '🔍 Search for a vehicle',
        '📋 Estimate import/export taxes',
        '🛠️ Match with a local mechanic',
        '📄 Get legal consulting'
      ]
    },
    mechanics: {
      name: 'Diagnostic Smart Assistant',
      title: 'Automotive Intake Diagnostic AI',
      subtitle: 'Online • Ask our AI',
      avatar: '🛠️',
      themeColor: '#DC2626',
      accentBg: 'bg-red-600',
      icon: <Wrench className="w-4 h-4 text-white" />,
      initialMessage: "Hi there! I am your AI Diagnostics Assistant. Before we broadcast your repair request to local mechanics, let's refine the symptoms. What warning lights or performance issues are you experiencing?",
      suggestions: [
        'Drivetrain rattle at 2000 RPM',
        'Blinking check engine light',
        'Squeaking front brake pads'
      ]
    },
    wrapping: {
      name: 'Wrapping & Design AI',
      title: 'Branding & Vinyl Consultant',
      subtitle: 'Online • Design Lab',
      avatar: '🎨',
      themeColor: '#8B0000',
      accentBg: 'bg-[#8B0000]',
      icon: <Tag className="w-4 h-4 text-white" />,
      initialMessage: 'Welcome to the Wrapping & Branding Studio. I can assist with matte/satin vinyl choices, fleet signage layouts, durability ratings, and estimating material coverages. How can I bring your project design to life?',
      suggestions: [
        'Matte stealth grey full wrap cost',
        'Business fleet advertising vinyl',
        'Chameleon color shift durability'
      ]
    },
    metalwork: {
      name: 'Metals Consultant AI',
      title: 'Metalwork & Fabrication AI',
      subtitle: 'Online • Structural Expert',
      avatar: '🔧',
      themeColor: '#8B0000',
      accentBg: 'bg-[#8B0000]',
      icon: <Wrench className="w-4 h-4 text-white" />,
      initialMessage: 'Metals Consultant AI online. I specialize in custom metalwork, chassis fabrication, rollcage blueprints, and rust sills reconstruction. What custom metal fabrication or structural welding project can I consult you on?',
      suggestions: [
        'Chassis frame straightening quote',
        'TIG weld custom exhaust mount',
        'Pass structural MOT welding'
      ]
    },
    services: {
      name: 'AI Service Assistant',
      title: 'Diagnostics & Service Matcher',
      subtitle: 'Online • Smart Match',
      avatar: '🤖',
      themeColor: '#8B0000',
      accentBg: 'bg-[#8B0000]',
      icon: <Sparkles className="w-4 h-4 text-white" />,
      initialMessage: 'Welcome to the Intelligent Diagnostics intake. Describe your vehicle\'s physical warning signs, mechanical faults, or cosmetic damages, and I will instantly isolate the perfect matched specialists below!',
      suggestions: [
        '🛡️ Underbody Rust',
        '🔋 EV Charging',
        '🏎️ ECU Remapping'
      ]
    },
    lawyers: {
      name: 'Secure Legal Assistant',
      title: 'Sovereign Legal Advisor',
      subtitle: 'Privileged Consultation',
      avatar: '⚖️',
      themeColor: '#27272A',
      accentBg: 'bg-zinc-800',
      icon: <Scale className="w-4 h-4 text-white" />,
      initialMessage: 'Secure Legal Portal connected. Your consultations are fully privileged. Let me know about your traffic dispute, insurance liability, custom claims, or warranty disputes.',
      suggestions: [
        'Appeal a speeding fine with GPS telemetry',
        'Insurance denied structural damage coverage',
        'Warranty breach on imported classic'
      ]
    },
    contact: {
      name: 'Broker Assistant Justas',
      title: 'Sovereign Concierge & Broker',
      subtitle: 'Online • Dedicated Support',
      avatar: '🤵',
      themeColor: '#8B0000',
      accentBg: 'bg-[#8B0000]',
      icon: <Compass className="w-4 h-4 text-white" />,
      initialMessage: 'Hello! I am Justas, your Dedicated Broker. Whether you are looking to source high-end exotics, coordinate bulk import clearances, or verify seller escrow bonds, I am here to manage your trade path. How can I serve you today?',
      suggestions: [
        'Source a 2024 Porsche 911 GT3 RS',
        'How does escrow safety work?',
        'Broker clearance for European logistics'
      ]
    },
    shipping: {
      name: 'AI Shipping Assistant',
      title: 'Customs & Port Logistics AI',
      subtitle: 'Online • Global Transit',
      avatar: '🚢',
      themeColor: '#8B0000',
      accentBg: 'bg-[#8B0000]',
      icon: <Globe className="w-4 h-4 text-white" />,
      initialMessage: 'Welcome to the Sovereign Import/Export Desk. I am your guide for customs declaration forms, duty calculations, port transit rules, and legal compliance. How can I help you clear your cargo?',
      suggestions: [
        'What is Customs Declaration Form 104?',
        'Calculate duties for electric vehicles',
        'How long does port customs transit take?'
      ]
    }
  };

  // Determine active chatbot context based on current route/page and active category
  useEffect(() => {
    let newBot: AssistantType = 'global';

    if (currentPage === 'services') {
      if (!activeCategory) {
        newBot = 'services';
      } else {
        const cat = activeCategory.toLowerCase();
        if (cat === 'mechanics' || cat === 'specialist mechanics') {
          newBot = 'mechanics';
        } else if (cat === 'wrapping' || cat.includes('wrapping')) {
          newBot = 'wrapping';
        } else if (cat === 'metalwork' || cat.includes('metalwork') || cat.includes('fabrication')) {
          newBot = 'metalwork';
        } else {
          newBot = 'services';
        }
      }
    } else if (currentPage === 'automotive_lawyers') {
      newBot = 'lawyers';
    } else if (currentPage === 'contact_us') {
      newBot = 'contact';
    } else if (currentPage === 'tax_duty_calculator' || currentPage === 'vin_history' || currentPage === 'import_export') {
      newBot = 'shipping';
    } else {
      newBot = 'global';
    }

    setActiveBot(newBot);

    // Auto-open assistant briefly when page changes to a specific assistant to capture user interest
    if (newBot !== 'global' && !isOpen) {
      // Don't auto open immediately, but let it adapt behind the scenes
    }
  }, [currentPage, activeCategory]);

  // Initial greeting for each channel if empty
  useEffect(() => {
    const activeConfig = configs[activeBot];
    if (histories[activeBot].length === 0) {
      setHistories(prev => ({
        ...prev,
        [activeBot]: [
          {
            id: 'init',
            sender: 'assistant',
            text: activeConfig.initialMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      }));
    }
  }, [activeBot]);

  // Auto scroll to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [histories, activeBot, isTyping, isOpen]);

  // AI Response Simulator Logic
  const getSimulatedResponse = (text: string, bot: AssistantType): { responseText: string, matchedCat?: string } => {
    const q = text.toLowerCase();
    
    switch (bot) {
      case 'global':
        if (q.includes('tax') || q.includes('customs') || q.includes('import') || q.includes('export')) {
          return { responseText: "I can help guide your logistics path! I highly recommend checking out our dedicated Tax & Duty Calculator platform under our main services navigation bar." };
        }
        if (q.includes('lawyer') || q.includes('legal') || q.includes('court') || q.includes('dispute')) {
          return { responseText: "Understood. For legal and warranty issues, please proceed to our secure, end-to-end Automotive Lawyers Platform where custom documentation analytical tools are available." };
        }
        if (q.includes('mechanic') || q.includes('repair') || q.includes('oil') || q.includes('brake')) {
          return { responseText: "I can instantly match you with highly qualified specialists. Please browse our integrated Services Page to view active booking calendars!" };
        }
        if (q.includes('vin') || q.includes('history') || q.includes('report')) {
          return { responseText: "You can query any vehicle's 17-character VIN history instantly! Try inputting the VIN in our homepage analyzer or visit the Vin History Platform." };
        }
        return { responseText: "I've logged your query. I am the global coordinator of this sovereign automotive trade desk. Ask me anything about listings, legal structures, or customs!" };

      case 'services':
        let matchedId = '';
        let reply = '';
        if (q.includes('rust') || q.includes('underbody') || q.includes('corrosion') || q.includes('sill') || q.includes('wax')) {
          reply = "I've detected corrosion/chassis rust warnings. You need a Rust Protection & Underbody Treatment specialist right away. Sealing and polyurethane coatings will reinforce your metal structures.";
          matchedId = "rust-protection";
        } else if (q.includes('ev') || q.includes('battery') || q.includes('tesla') || q.includes('hybrid') || q.includes('range') || q.includes('charge')) {
          reply = "High-voltage EV systems require specialised isolated diagnostics. I matching you with EV Specialists certified to read lithium state-of-health.";
          matchedId = "ev-specialists";
        } else if (q.includes('alcantara') || q.includes('leather') || q.includes('seat') || q.includes('stitch') || q.includes('door card') || q.includes('headliner')) {
          reply = "Interior wear or sagging roof linings are beautifully managed by Upholstery Specialists. I've marked Alcantara and premium leather experts.";
          matchedId = "upholstery";
        } else if (q.includes('tune') || q.includes('ecu') || q.includes('stage') || q.includes('exhaust') || q.includes('performance') || q.includes('remap')) {
          reply = "For power adjustments or aerodynamic fittings, Tuning & Styling workshops can carry out safe stage 1/2 dyno calibrations.";
          matchedId = "tuning-styling";
        } else {
          reply = "I've analyzed your vehicle description and mapped the ideal local operators below. You can narrow listings to within 5km using our GPS search filter.";
          matchedId = "mechanics";
        }
        return { responseText: reply, matchedCat: matchedId };

      case 'mechanics':
        if (q.includes('rattle') || q.includes('noise') || q.includes('knock')) {
          return { responseText: "Engine rattles or knocking require a mechanical stethoscopic examination. I advise booking an inspection appointment immediately to avoid critical crankshaft damage." };
        }
        if (q.includes('light') || q.includes('engine') || q.includes('obd')) {
          return { responseText: "A blinking engine light means active cylinder misfires. We will hook up our high-end OBD diagnostics tool to read the precise error registry logs once your vehicle is in the bay." };
        }
        return { responseText: "Understood. The diagnostic details have been integrated. Click 'Publish Repair Request' on the page to instantly broadcast this information to 5 matching local mechanics." };

      case 'wrapping':
        if (q.includes('cost') || q.includes('price')) {
          return { responseText: "A full satin or matte exterior vinyl wrapping generally ranges from $2,200 to $4,500 depending on panels curvature complexity. Premium materials like Avery Dennison or 3M guarantee up to 5 years durability." };
        }
        if (q.includes('fleet') || q.includes('advertising') || q.includes('business')) {
          return { responseText: "We recommend cast vinyl printing with custom UV-protective laminates to protect corporate fleet logos against environmental fading. Direct templates design can be loaded instantly." };
        }
        return { responseText: "Excellent project concept! Our wrapping specialists can render complete 3D digital layouts before physical vinyl cutting commences." };

      case 'metalwork':
        if (q.includes('mot') || q.includes('rust') || q.includes('sills') || q.includes('pass')) {
          return { responseText: "Passing structural inspections requires completely cutting out corroded metal. We weld fully certified 1.5mm cold-rolled steel plates and finish with high-zinc anti-corrosion primers." };
        }
        if (q.includes('tig') || q.includes('weld') || q.includes('exhaust')) {
          return { responseText: "For custom stainless steel or titanium exhaust manifolds, our fabrication technicians employ advanced dual-shield TIG welding with full back-purge gas chambers." };
        }
        return { responseText: "Consultation logged. Custom structural steel frameworks can be manufactured straight from your uploaded CAD vector blueprints." };

      case 'lawyers':
        if (q.includes('speed') || q.includes('fine') || q.includes('appeal')) {
          return { responseText: "To appeal speed sensor fines, we query local municipal telemetry files and verify the calibration certificate date of the specific device under Article 308 code." };
        }
        if (q.includes('insurance') || q.includes('denied') || q.includes('claim')) {
          return { responseText: "Insurance entities routinely use default depreciation clauses. We file legal structural dispute claims to enforce complete physical workshop restoration rates." };
        }
        return { responseText: "Secure consultation captured. We will analyze all submitted files to draft an official legal case review." };

      case 'contact':
        if (q.includes('porsche') || q.includes('gt3') || q.includes('source')) {
          return { responseText: "I have direct access to restricted European wholesale networks. I can secure pristine build allocations for the 911 GT3 RS with full customs escort service." };
        }
        if (q.includes('escrow') || q.includes('safety') || q.includes('pay')) {
          return { responseText: "Our secure escrow protocol keeps buyer funds locked until certified independent inspectors stamp the physical inspection documents." };
        }
        return { responseText: "Perfect. I am on standby to broker this trade. Let's arrange a direct call once you specify your target budget parameters." };

      case 'shipping':
        if (q.includes('104') || q.includes('form') || q.includes('customs')) {
          return { responseText: "Form 104 is mandatory for non-EU originating vehicles. You must supply your original invoice, Bill of Lading, and certified emissions compliance logs to avoid port holdups." };
        }
        if (q.includes('duty') || q.includes('tax') || q.includes('electric')) {
          return { responseText: "Electric vehicles currently qualify for significant excise tax refunds up to 12.5% across Baltic transit zones. Let me outline the necessary legal form templates." };
        }
        return { responseText: "Logistics parameters registered. We monitor customs clearing wait times in real-time to coordinate expedited port dispatch routes." };

      default:
        return { responseText: "Thank you for reaching out. Let me know how I can assist with your automotive operations!" };
    }
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Update history instantly with user message
    setHistories(prev => ({
      ...prev,
      [activeBot]: [...prev[activeBot], userMsg]
    }));

    setInputVal('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const result = getSimulatedResponse(text, activeBot);
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: result.responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        matchedCat: result.matchedCat
      };

      setHistories(prev => ({
        ...prev,
        [activeBot]: [...prev[activeBot], assistantMsg]
      }));
      setIsTyping(false);
    }, 1200);
  };

  const activeConfig = configs[activeBot];
  const activeMessages = histories[activeBot];

  return (
    <>
      {/* 1. PERSISTENT FIXED BOTTOM-RIGHT FAB BUTTON */}
      <div 
        style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}
        className="select-none pointer-events-auto"
      >
        <motion.div
          animate={isOpen ? "open" : "closed"}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          {/* Status glow border */}
          <div className="absolute inset-0 rounded-full bg-[#8B0000]/10 blur-md animate-pulse"></div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 relative border-2 border-white shadow-[0_10px_25px_rgba(139,0,0,0.35)] text-white ${activeConfig.accentBg}`}
            id="global-floating-chat-fab"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close-icon"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="chat-icon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center"
                >
                  <div className="relative">
                    <Bot className="w-7 h-7 text-white" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      </div>

      {/* 2. CHAT DRAWER PANEL OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 30, scale: 0.92, filter: 'blur(8px)' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ 
              position: 'fixed', 
              bottom: '84px', 
              right: '20px', 
              zIndex: 1000,
              width: '380px',
              height: '520px'
            }}
            className="bg-white rounded-[24px] border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden max-w-[calc(100vw-32px)] max-h-[calc(100vh-120px)]"
            id="global-floating-chat-drawer"
          >
            {/* Drawer Header */}
            <div className={`text-white p-4.5 flex items-center justify-between shadow-sm shrink-0 ${activeConfig.accentBg}`}>
              <div className="flex items-center">
                <div className="text-left">
                  <h4 className="font-black text-sm uppercase tracking-wider text-white leading-none">AI Assistant</h4>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-white/80 p-1.5 rounded-full cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Body Scroll Streams */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scrollbar-none text-xs">
              {activeMessages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 max-w-[85%] ${
                      isUser ? 'ml-auto flex-row-reverse' : 'mr-auto text-left'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className={`p-3 rounded-2xl leading-relaxed text-xs font-semibold shadow-2xs ${
                        isUser 
                          ? 'bg-[#8B0000] text-white rounded-tr-none text-left' 
                          : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                      }`}>
                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>

                      {/* Specialized Interactive Quick Filter Button for Service Matcher */}
                      {msg.matchedCat && (
                        <div className="mt-1.5 p-2.5 bg-red-50 border border-red-200/50 rounded-xl space-y-1.5 text-left">
                          <p className="text-[8.5px] font-black text-[#8B0000] font-mono uppercase tracking-wider leading-none">Matched Category Filter:</p>
                          <button
                            type="button"
                            onClick={() => {
                              onNavigate('services', msg.matchedCat);
                              setIsOpen(false);
                            }}
                            className="bg-[#8B0000] hover:bg-red-700 text-white font-extrabold text-[9px] tracking-wide uppercase px-2.5 py-1.5 rounded-lg block font-mono transition-all duration-150 active:scale-95 cursor-pointer shadow-3xs"
                          >
                            Show listings for {msg.matchedCat.replace('-', ' ')}
                          </button>
                        </div>
                      )}
                      
                      <span className="text-[8px] text-slate-400 block px-1 font-mono">
                        {msg.time}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Typing simulation block */}
              {isTyping && (
                <div className="flex items-start gap-2.5 mr-auto max-w-[85%] text-left">
                  <div className="bg-white border border-slate-200 text-slate-500 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-3xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#8B0000] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-[#8B0000] rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-[#8B0000] rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Suggestions Tray with Left/Right Scroll Arrows */}
            <div className="relative border-t border-slate-100 bg-white shrink-0 flex items-center group">
              {/* Left Arrow */}
              <button
                type="button"
                onClick={() => {
                  if (suggestionsRef.current) {
                    suggestionsRef.current.scrollBy({ left: -150, behavior: 'smooth' });
                  }
                }}
                className="absolute left-1.5 z-10 w-6 h-6 bg-white/95 hover:bg-slate-50 border border-slate-200 rounded-full shadow-2xs flex items-center justify-center cursor-pointer text-slate-500 hover:text-[#8B0000] hover:scale-105 active:scale-95 transition-all"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-3.5 h-3.5 text-current" />
              </button>

              {/* Suggestions Container */}
              <div 
                ref={suggestionsRef}
                className="w-full p-2.5 px-8.5 overflow-x-auto flex gap-1.5 scrollbar-none select-none scroll-smooth"
              >
                {activeConfig.suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      // Extract emojis/prefixes if we just want clean text
                      const cleanText = sug.replace(/^[^a-zA-Z0-9]+/, '').trim();
                      handleSendMessage(cleanText);
                    }}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-350 text-slate-700 text-[10px] font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer shrink-0"
                  >
                    {sug.replace(/^[^a-zA-Z0-9\s]+/, '').trim()}
                  </button>
                ))}
              </div>

              {/* Right Arrow */}
              <button
                type="button"
                onClick={() => {
                  if (suggestionsRef.current) {
                    suggestionsRef.current.scrollBy({ left: 150, behavior: 'smooth' });
                  }
                }}
                className="absolute right-1.5 z-10 w-6 h-6 bg-white/95 hover:bg-slate-50 border border-slate-200 rounded-full shadow-2xs flex items-center justify-center cursor-pointer text-slate-500 hover:text-[#8B0000] hover:scale-105 active:scale-95 transition-all"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-3.5 h-3.5 text-current" />
              </button>
            </div>

            {/* Message input typing tray */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputVal); }}
              className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0 items-center"
            >
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Type your query here..."
                className="flex-1 bg-slate-50 text-slate-800 text-xs font-semibold rounded-xl px-3.5 py-3 border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-[#8B0000] focus:bg-white"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isTyping}
                className="bg-[#8B0000] hover:bg-[#5E0000] disabled:opacity-40 text-white p-3 rounded-xl transition-all active:scale-95 cursor-pointer shrink-0 shadow-md"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

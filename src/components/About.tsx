import React, { useState, useEffect } from 'react';
import { 
  Building, Users, Landmark, MapPin, Target, Shield, Award, 
  ArrowRight, Globe, Zap, CheckCircle, ShieldCheck, Play, 
  Pause, RotateCcw, Volume2, Video, Eye, Server, Compass,
  Coins, Smartphone, Activity, Check, ChevronRight, HelpCircle,
  Briefcase, FileText, Upload, Send, Sparkles, Heart, Filter, 
  ShieldAlert, Code, CheckSquare, Newspaper, Download, Mail, Calendar, Share2, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import UniversalSmartUpload from './UniversalSmartUpload';

interface AboutProps {
  activeTab?: 'about-us' | 'how-it-works' | 'careers' | 'press';
  setActiveTab?: (tab: 'about-us' | 'how-it-works' | 'careers' | 'press') => void;
}

export default function About({ activeTab: externalTab, setActiveTab: setExternalTab }: AboutProps) {
  // Local state as fallback in case props are not passed
  const [localTab, setLocalTab] = useState<'about-us' | 'how-it-works' | 'careers' | 'press'>('about-us');
  const currentTab = externalTab || localTab;
  const changeTab = (tab: 'about-us' | 'how-it-works' | 'careers' | 'press') => {
    if (setExternalTab) {
      setExternalTab(tab);
    } else {
      setLocalTab(tab);
    }
  };

  // Platform statistics state with micro-interactions
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  const platformStats = [
    {
      label: 'Supported Countries',
      value: '28+',
      detail: 'We connect drivers and car networks across major regions.',
      icon: Globe,
      color: 'text-[#8B0000]',
      bgColor: 'bg-red-50'
    },
    {
      label: 'Happy Users',
      value: '624,000+',
      detail: 'Thousands of buyers, sellers, and local mechanics use our hub every day.',
      icon: Users,
      color: 'text-[#8B0000]',
      bgColor: 'bg-red-50'
    },
    {
      label: 'Verified Vehicles',
      value: '1.48M+',
      detail: 'We have helped check and verify vehicle records and histories.',
      icon: Activity,
      color: 'text-[#8B0000]',
      bgColor: 'bg-red-50'
    }
  ];

  // Exec team info
  const executives = [
    {
      name: 'Elena Rostova',
      role: 'Lead Inspector & Co-Founder',
      bio: 'Over 20 years of experience in car inspections and safety standards. Always making sure your car checks are accurate and safe.',
      quote: 'Making sure buyers and sellers have honest, accurate information is our main goal.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'
    },
    {
      name: 'Nicholas Kovac',
      role: 'Lead Developer & Co-Founder',
      bio: 'An expert in building secure systems. Designed our fast and secure database to keep all vehicle records safe.',
      quote: 'We want car history to be simple, clear, and impossible for anyone to fake.',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300'
    },
    {
      name: 'Officer Jane Vance',
      role: 'Safety Advisor',
      bio: 'A retired police detective who specialized in tracking stolen cars. Helps us prevent fraud, car cloning, and online scams.',
      quote: 'Working together with safety teams helps us stop scammers and protect honest drivers.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300'
    }
  ];

  // Visual Breakdown per User Type configuration
  const [activeUserType, setActiveUserType] = useState<'individual' | 'dealer' | 'workshop' | 'authority'>('individual');

  const userTypeDetails = {
    individual: {
      title: 'Car Buyers & Sellers',
      subtitle: 'Buy and Sell Safely',
      description: 'Perfect for everyday drivers. Get clear security steps, instant price checks, and verified inspection reports without any hidden fees.',
      benefits: [
        'Easy 3-click digital title transfers',
        'Direct chat with trusted local mechanics for quick pre-purchase checks',
        'Simple shipping calculators for importing/exporting cars safely'
      ],
      color: 'border-[#8B0000] bg-red-50 text-slate-900',
      accentColor: 'bg-[#8B0000]',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400'
    },
    dealer: {
      title: 'Automotive Dealerships',
      subtitle: 'Trusted Dealer Solutions',
      description: 'Showcase your dealership inventory, reach thousands of buyers, and manage your showroom listings automatically in one place.',
      benefits: [
        'Set up your own custom dealer storefront in less than 65 seconds',
        'Verify trade-in values instantly with automatic checks',
        'Earn a Verified Dealer badge to increase buyer trust'
      ],
      color: 'border-zinc-300 bg-zinc-50 text-slate-900',
      accentColor: 'bg-[#8B0000]',
      image: 'https://images.unsplash.com/photo-1562618456-131813c8ece2?auto=format&fit=crop&q=80&w=400'
    },
    workshop: {
      title: 'Local Service Workshops & Techs',
      subtitle: 'Grow Your Repair Business',
      description: 'Promote your workshop specialties (detailing, tires, repair, painting, or rust checks) to local drivers who need quick service bookings.',
      benefits: [
        'Receive direct service requests from local drivers in your neighborhood',
        'Save car repair histories securely under the car\'s record',
        'Use simple pricing tools to build trust with new clients'
      ],
      color: 'border-zinc-300 bg-zinc-50 text-slate-900',
      accentColor: 'bg-[#8B0000]',
      image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=400'
    },
    authority: {
      title: 'Safety, Insurance & Legal Teams',
      subtitle: 'Prevent Car Scams',
      description: 'We cooperate with authorities to cross-check vehicle lease states, registration files, and insurance records, preventing car theft and listing cloning.',
      benefits: [
        'Secure dashboard connections for government records',
        'Daily automated checks against stolen car registries',
        'Accurate statistics to track fair local market pricing'
      ],
      color: 'border-zinc-300 bg-zinc-50 text-slate-900',
      accentColor: 'bg-[#8B0000]',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400'
    }
  };

  // Stateful Mock Explainer Video Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(24); // percent
  const [videoVolume, setVideoVolume] = useState(80);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 1.5 | 2>(1);
  const [activeChapter, setActiveChapter] = useState(0);

  // Careers & Culture States
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedLoc, setSelectedLoc] = useState<string>('all');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<{name: string, size: string} | null>(null);
  const [uploadedResumeSrc, setUploadedResumeSrc] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    portfolio: '',
    message: '',
    position: ''
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Press & Media States
  const [searchPressQuery, setSearchPressQuery] = useState<string>('');
  const [selectedPressCat, setSelectedPressCat] = useState<string>('all');
  const [mediaKitDownloaded, setMediaKitDownloaded] = useState<string | null>(null);
  const [selectedPressReleaseId, setSelectedPressReleaseId] = useState<string | null>(null);

  const pressReleases = [
    {
      id: 'pr-1',
      date: 'June 10, 2026',
      category: 'Product',
      title: 'JustCarSale Unveils Cross-Border Regulatory API Suite',
      badge: 'New Release',
      summary: 'Standardizing cross-border vehicle metadata checking for European automotive exporters. The new API reduces import clearing and VIN audit times by up to 72%.',
      content: 'JustCarSale, the pioneer of the unified automotive integrity ecosystem, today announced the launch of its regulatory cross-border API suite. Deployed across Northern and Central European auto ports, the application aggregates real-time import/export taxes, customs declarations, and mechanical diagnostic certifications directly into standard shipping ledgers. This eliminates extensive paperwork and physical quarantine delays for registered fleet dealerships and logistics coordinators.',
      author: 'PR Distribution Desk',
      fileSize: '1.2 MB'
    },
    {
      id: 'pr-2',
      date: 'May 14, 2026',
      category: 'Partnership',
      title: 'JustCarSale and European Workshop Union Form Strategic Alliance',
      badge: 'Strategic Co-Op',
      summary: 'Bridging the gap between secondary pre-purchase inspection logs and independent service garages. Users will receive automated repair dispatch suggestions instantly.',
      content: 'In an unprecedented consolidation effort, JustCarSale has entered into a strategic integration partnership with the European Workshop Alliance, representing over 4,500 certified independent garages. Buyers checking a vehicle\'s physical paint depth or diagnostic status on the JustCarSale platform can now instantly route work orders and receive certified service estimate tokens directly back into their client dashboard. Independent mechanics can claim geo-targeted client radius leads on demand.',
      author: 'Ecosystem Communications Team',
      fileSize: '840 KB'
    },
    {
      id: 'pr-3',
      date: 'April 22, 2026',
      category: 'Security',
      title: 'Auto Crime Sweeper: Integrating LEO Alert Systems with VIN Records',
      badge: 'Security Update',
      summary: 'An immutable intercept engine built to prevent transcontinental vehicle cloning, title washing, and manipulative odometer rollbacks.',
      content: 'Building on new telemetry protocols, JustCarSale has released the Intercept Engine, designed specifically in collaboration with regional Law Enforcement Officers (LEOs). This engine performs daily automated delta sweeps matching active transshipment plates against active stolen vehicle reports and lease write-offs. This prevents clone cars from being listed, successfully isolating fraudulent VIN records of transcontinental trading networks before listings reach buyers.',
      author: 'Security & Trust Division',
      fileSize: '1.5 MB'
    },
    {
      id: 'pr-4',
      date: 'March 05, 2026',
      category: 'Corporate',
      title: 'JustCarSale Crosses 1.4 Mil Listings Milestone, Outlining Future Plans',
      badge: 'Corporate',
      summary: 'Expanding operations to North American logistics terminals and scaling developer APIs to support third-party automotive web builders.',
      content: 'After completing a high-velocity Q1 growth loop, JustCarSale has officially logged over 1.48 million audited vehicle records on its unified infrastructure ledger. Co-founder Elena Rostova noted, "Our focus remains on building the ultimate directory glue for this multi-sided network. We are now recruiting engineering specialists to lead the scaling of our developer-first API hubs for customized dealer webshops."',
      author: 'Corporate Relations Office',
      fileSize: '950 KB'
    }
  ];

  const mediaKits = [
    {
      id: 'logo-pack',
      title: 'Brand Vector Graphics & Logos',
      desc: 'Raw Adobe Illustrator, SVG, and high-contrast PNG assets of the JustCarSale logo, badges, and verified inspection seals.',
      fileType: 'ZIP Archive',
      size: '14.8 MB'
    },
    {
      id: 'photo-pack',
      title: 'Executive Portraiture & Hub Photos',
      desc: 'High-definition 4K portraiture of executive team members alongside premium photography from our European diagnostic test hubs.',
      fileType: 'ZIP Archive',
      size: '28.2 MB'
    },
    {
      id: 'guidelines',
      title: 'Brand Visual Standards Manual',
      desc: 'Detailed PDF documenting our styling design philosophy, spacing guides, typography pairing rules, and custom color hex codes.',
      fileType: 'PDF Document',
      size: '4.5 MB'
    }
  ];

  const openJobs = [
    {
      id: 'lead-be',
      title: 'Senior Backend Engineer (Ledger Core)',
      dept: 'Engineering',
      loc: 'Berlin',
      type: 'Full-Time',
      salary: '€95,000 - €120,000',
      description: 'Lead the next-phase development of our unified automotive telemetry database core. Improve real-time check query speeds and scale cross-government REST API sync portals.',
      requirements: [
        '5+ years experience with high-performance Node.js / TypeScript microservices',
        'Extensive database schema modeling experience (PostgreSQL, Redis)',
        'Understanding of vehicle state diagnostics, ISO registries, or transshipment protocols is a plus'
      ]
    },
    {
      id: 'inspector-ops',
      title: 'Lead Automotive Diagnostic Appraiser',
      dept: 'Operations',
      loc: 'Warsaw',
      type: 'Full-Time',
      salary: '€65,000 - €80,000',
      description: 'Ensure vehicle inspection protocols align with actual physical diagnostics. Audit independent partner mechanic workshops and train region-level appraisers.',
      requirements: [
        'Expert-level knowledge of OBD-II diagnostics systems and body paint scanners',
        'Prior role as Auditing Appraiser with Dekra, TÜV, or similar inspection agencies',
        'Willingness to travel locally to verify workshop nodes'
      ]
    },
    {
      id: 'partner-ae',
      title: 'Regional Dealership Account Specialist',
      dept: 'Sales',
      loc: 'Remote',
      type: 'Full-Time',
      salary: '€70,000 + Commission',
      description: 'Expand our dealer partner network across France, Italy, and Poland. Showroom managers gain massive listing speed optimizations; you show them how.',
      requirements: [
        'Proven track record selling SaaS/B2B portals to car dealerships or dealership groups',
        'Native-level fluency in French, German, or Polish alongside clear English',
        'Self-driven approach with clean CRM reporting habits'
      ]
    },
    {
      id: 'sec-analyst',
      title: 'Security Operations & Trust Engineer',
      dept: 'Security',
      loc: 'San Francisco',
      type: 'Full-Time',
      salary: '$140,000 - $175,000',
      description: 'Audit network integrations and implement automated clone/fraud plate alarm sweep matrices. Defend against vehicle cloning, title washing, and manipulated VIN logs.',
      requirements: [
        '3+ years in Cloud Infrastructure Security, auditing third-party endpoints',
        'Knowledge of SOC2 compliance requirements and decentralized data integrity patterns',
        'Familiarity with state-level DMV API specifications'
      ]
    }
  ];

  const cultureItems = [
    {
      title: 'Honesty First',
      desc: 'We value safety and truth above everything else. Every report, car listing, and record must be 100% accurate.',
      icon: ShieldCheck,
      color: 'bg-red-50 text-[#8B0000]'
    },
    {
      title: 'One Car Community',
      desc: 'We connect everyone together. We believe car owners, buyers, dealers, and local mechanics should have one safe place to interact.',
      icon: Compass,
      color: 'bg-red-50 text-[#8B0000]'
    },
    {
      title: 'Grow and Learn',
      desc: 'We avoid micromanagement. Every team member has the freedom to build great features and learn new things daily.',
      icon: Zap,
      color: 'bg-red-50 text-[#8B0000]'
    },
    {
      title: 'Healthy and Happy Team',
      desc: 'We provide great health benefits, training classes, and fun team get-togethers.',
      icon: Heart,
      color: 'bg-red-50 text-[#8B0000]'
    }
  ];

  // Form handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setResumeFile({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB'
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB'
      });
    }
  };

  const handleSmartResumeUpload = (dataUrl: string, fileName: string) => {
    setUploadedResumeSrc(dataUrl);
    const mockSize = Math.round(dataUrl.length * 0.75);
    setResumeFile({
      name: fileName,
      size: (mockSize / 1024).toFixed(1) + ' KB'
    });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formValues.name.trim()) errors.name = 'Full Name is required';
    if (!formValues.email.trim()) {
      errors.email = 'Email Address is required';
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = 'Please provide a valid email';
    }
    if (!formValues.phone.trim()) errors.phone = 'Phone number is required';
    if (!formValues.position) errors.position = 'Target Position is required';
    if (!formValues.message.trim()) errors.message = 'A short cover pitch is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormLoading(true);
    setLoadingStep('Initializing Secure Connection to Application Database...');
    
    setTimeout(() => {
      setLoadingStep('Parsing candidate credentials and checking target role availability...');
    }, 1200);

    setTimeout(() => {
      setLoadingStep('Uploading resume file hash to secure transient storage buffer...');
    }, 2400);

    setTimeout(() => {
      setFormLoading(false);
      setFormSubmitted(true);
    }, 3600);
  };

  const chapters = [
    { title: 'Information Deficit', duration: '0:00 - 1:15', desc: 'Understanding why classic background checks and isolated databases fail to represent real physical vehicle parameters.', start: 0, end: 25 },
    { title: 'The Multi-Side Ledger', duration: '1:15 - 3:10', desc: 'How dealers, buyers, mechanics, and public registers update a single vehicle dossier on our unified infrastructure.', start: 25, end: 65 },
    { title: 'Ecosystem Growth Loop', duration: '3:10 - 4:45', desc: 'Simulating instant buyer notifications, local workshop dispatches, and highly targeted geoadvertising setups.', start: 65, end: 100 }
  ];

  // Handle mock video animation effect when playing
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          const next = prev + 0.8 * playbackSpeed;
          // Determine active chapter based on new progress percent
          if (next < 25) setActiveChapter(0);
          else if (next >= 25 && next < 65) setActiveChapter(1);
          else setActiveChapter(2);

          return next;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const selectChapter = (idx: number) => {
    setActiveChapter(idx);
    setVideoProgress(chapters[idx].start + 1);
    setIsPlaying(true);
  };

  return (
    <div className="space-y-16 py-6 font-sans text-slate-800" id="about-brand-portal">
      
      {/* 1. PORTAL HERO OUTCOME & BRANDING */}
      <div className="text-center space-y-6 max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-950 leading-none">
          Everything for your car, <span className="text-[#8B0000]">all in one simple place</span>
        </h1>
      </div>

      <AnimatePresence mode="wait">
        
        {/* ======================= TAB 1: ABOUT US ======================= */}
        {currentTab === 'about-us' && (
          <motion.div
            key="about-us-tab-content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-16"
          >
            {/* Mission & Vision Bento Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1240px] mx-auto px-4">
              
              {/* Vision Highlight (7 cols) */}
              <div className="lg:col-span-7 bg-white border border-black/[0.04] rounded-3xl p-6 sm:p-9 space-y-6 flex flex-col justify-between shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300">
                <div className="space-y-4">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Our Vision</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-normal">
                    Finding the right car or workshop shouldn't be stressful or full of guesswork. We want to bring everyone together—car owners, buyers, dealerships, and local mechanics—so you can buy, sell, and repair your car with absolute peace of mind.
                  </p>
                  <p className="text-slate-500 text-sm leading-relaxed font-normal">
                    By keeping everyone connected in one clean system, we make sure that buying or fixing a vehicle is always safe, simple, and honest for everyone involved.
                  </p>
                </div>

                <div className="border-t border-slate-200/60 pt-4 flex items-center gap-3 text-xs text-slate-600 font-bold">
                  <ShieldCheck className="w-4.5 h-4.5 text-[#8B0000]" />
                  <span>Verified safety and trusted records for every user</span>
                </div>
              </div>

              {/* Mission Highlights (5 cols) */}
              <div className="lg:col-span-5 bg-white border border-black/[0.04] rounded-3xl p-6 sm:p-9 space-y-6 flex flex-col justify-between relative overflow-hidden shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300">
                {/* Abstract graphic accent */}
                <div className="absolute -bottom-16 -right-16 w-44 h-44 rounded-full bg-red-650/5 filter blur-2xl pointer-events-none"></div>

                <div className="space-y-4">
                  <h3 className="text-xl font-black tracking-tight text-slate-950 uppercase font-display">What we do for you</h3>
                  
                  <ul className="space-y-4 pt-2">
                    <li className="flex items-start gap-3 text-xs">
                      <span className="w-5 h-5 rounded-full bg-red-50 text-[#8B0000] border border-red-200/50 flex items-center justify-center text-[10px] font-black shrink-0">1</span>
                      <div className="space-y-1">
                        <strong className="text-slate-900 block font-extrabold uppercase text-[11px] tracking-wide">Verified Car Histories</strong>
                        <span className="text-slate-500 text-[11.5px] font-medium leading-relaxed block">We check car backgrounds, title records, and safety data to make sure every car is legitimate.</span>
                      </div>
                    </li>

                    <li className="flex items-start gap-3 text-xs">
                      <span className="w-5 h-5 rounded-full bg-red-50 text-[#8B0000] border border-red-200/50 flex items-center justify-center text-[10px] font-black shrink-0">2</span>
                      <div className="space-y-1">
                        <strong className="text-slate-900 block font-extrabold uppercase text-[11px] tracking-wide">Trusted Local Workshops</strong>
                        <span className="text-slate-500 text-[11.5px] font-medium leading-relaxed block">We partner with expert local mechanics, painters, and detailing shops so you can book trusted help instantly.</span>
                      </div>
                    </li>

                    <li className="flex items-start gap-3 text-xs">
                      <span className="w-5 h-5 rounded-full bg-red-50 text-[#8B0000] border border-red-200/50 flex items-center justify-center text-[10px] font-black shrink-0">3</span>
                      <div className="space-y-1">
                        <strong className="text-slate-900 block font-extrabold uppercase text-[11px] tracking-wide">Safe and Honest Trading</strong>
                        <span className="text-slate-500 text-[11.5px] font-medium leading-relaxed block">We help buyers and sellers connect directly and safely without any hidden fees or surprises.</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

            </div>

            {/* Platform Statistics Section with hover highlights */}
            <div className="max-w-[1240px] mx-auto px-4 space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Our Platform Statistics</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {platformStats.map((stat, i) => {
                  const StatIcon = stat.icon;
                  const isHovered = hoveredStat === i;

                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setHoveredStat(i)}
                      onMouseLeave={() => setHoveredStat(null)}
                      className={`bg-white border rounded-2xl p-6 transition-all duration-300 transform shadow-3d-premium ${
                        isHovered 
                          ? 'border-[#8B0000] shadow-3d-elevated -translate-y-1 bg-red-650/[0.01]' 
                          : 'border-black/[0.03]'
                      }`}
                    >
                      <div className="flex items-center justify-between pointer-events-none">
                        <span className="text-[10px] font-black text-slate-450 uppercase tracking-widest leading-none">
                          In numbers
                        </span>
                        <div className={`w-9 h-9 rounded-xl ${stat.bgColor} ${stat.color} flex items-center justify-center`}>
                          <StatIcon className="w-4.5 h-4.5 text-[#8B0000]" />
                        </div>
                      </div>

                      <div className="mt-4 space-y-1">
                        <strong className="text-3xl font-black text-slate-950 font-mono block leading-none">
                          {stat.value}
                        </strong>
                        <span className="text-xs font-bold text-slate-800 block">
                          {stat.label}
                        </span>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-light">
                          {stat.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Founders & Team Executive Cards */}
            <div className="max-w-[1240px] mx-auto px-4 space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Meet Our Team</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {executives.map((exec, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white border border-black/[0.04] rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300"
                  >
                    <div className="space-y-4">
                      {/* Avatar & Ident */}
                      <div className="flex items-center gap-4">
                        <img 
                          src={exec.avatar} 
                          alt={exec.name} 
                          className="w-14 h-14 rounded-full object-cover border border-slate-200" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-1">
                          <h4 className="text-sm font-black text-slate-900">{exec.name}</h4>
                          <span className="bg-red-50 text-[#8B0000] text-[10px] font-bold px-2 py-0.5 rounded-md inline-block">
                            {exec.role}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed font-normal">
                        {exec.bio}
                      </p>
                    </div>

                    {/* Operational Quote */}
                    <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl relative">
                      <span className="absolute top-2 left-3 text-slate-200 text-3xl font-serif">“</span>
                      <p className="text-[10.5px] italic text-slate-600 leading-relaxed pl-3 inline-block">
                        {exec.quote}
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* ======================= TAB 2: HOW IT WORKS ======================= */}
        {currentTab === 'how-it-works' && (
          <motion.div
            key="how-it-works-tab-content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-16"
          >
            {/* Step Step Explainer (3-Step Flow) */}
            <div className="max-w-[1240px] mx-auto px-4 space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">How JustCarSale Works</h2>
                <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed font-medium">
                  We make it incredibly simple to get started, connect with others, and grow your automotive experience.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {/* Visual connectors inside row on wide screens */}
                <div className="hidden md:block absolute top-12 left-[30%] right-[30%] h-0.5 border-t border-dashed border-slate-200/80 pointer-events-none"></div>

                {/* Step 1 */}
                <div className="bg-white border border-black/[0.04] p-6 sm:p-8 rounded-3xl space-y-4 relative shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300">
                  <span className="absolute -top-3.5 left-6 bg-[#8B0000] text-white font-mono font-black text-xs px-3 py-1 rounded-full shadow-inner leading-none">
                    STEP 01
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-red-50 text-[#8B0000] flex items-center justify-center">
                    <Smartphone className="w-5.5 h-5.5" />
                  </div>
                  <h3 className="text-lg font-black text-slate-950 tracking-tight">1. Create Your Profile</h3>
                  <p className="text-xs text-slate-550 leading-relaxed font-normal">
                    Sign up in seconds. Choose whether you are an everyday driver, a dealership, a local mechanic, or an inspector.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="bg-white border border-black/[0.04] p-6 sm:p-8 rounded-3xl space-y-4 relative shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300">
                  <span className="absolute -top-3.5 left-6 bg-[#8B0000] text-white font-mono font-black text-xs px-3 py-1 rounded-full shadow-inner leading-none">
                    STEP 02
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-red-50 text-[#8B0000] flex items-center justify-center">
                    <Server className="w-5.5 h-5.5" />
                  </div>
                  <h3 className="text-lg font-black text-slate-950 tracking-tight">2. Connect Your Details</h3>
                  <p className="text-xs text-slate-555 leading-relaxed font-normal">
                    Add your car details, your shop specialties, or your dealership catalog. We will automatically check and verify your listings.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="bg-white border border-black/[0.04] p-6 sm:p-8 rounded-3xl space-y-4 relative shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300">
                  <span className="absolute -top-3.5 left-6 bg-[#8B0000] text-white font-mono font-black text-xs px-3 py-1 rounded-full shadow-inner leading-none">
                    STEP 03
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-red-50 text-[#8B0000] flex items-center justify-center">
                    <Coins className="w-5.5 h-5.5" />
                  </div>
                  <h3 className="text-lg font-black text-slate-950 tracking-tight">3. Buy, Sell, and Repair</h3>
                  <p className="text-xs text-slate-550 leading-relaxed font-normal">
                    Browse verified listings, book trustworthy mechanics in your neighborhood, and manage everything with full transparency.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Breakdown per User Type */}
            <div className="max-w-[1240px] mx-auto px-4 space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">Our Community Roles</h3>
                <p className="text-slate-605 text-sm max-w-md mx-auto leading-relaxed">
                  Select any category below to see how our platform is customized for your needs.
                </p>
              </div>

              {/* Segment Toggle Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
                {(Object.keys(userTypeDetails) as Array<keyof typeof userTypeDetails>).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setActiveUserType(type)}
                    className={`px-4.5 py-2.5 rounded-xl text-xs font-extrabold uppercase transition-all duration-200 cursor-pointer ${
                      activeUserType === type 
                        ? 'bg-[#8B0000] text-white shadow-md shadow-[#8B0000]/20' 
                        : 'bg-slate-100 hover:bg-slate-150 text-slate-600 hover:text-slate-950'
                    }`}
                  >
                    {userTypeDetails[type].title}
                  </button>
                ))}
              </div>

              {/* User Breakdown Display Box */}
              <div className="bg-white border border-black/[0.04] rounded-3xl overflow-hidden shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  
                  {/* Left Specs Text (7 cols) */}
                  <div className="lg:col-span-7 p-6 sm:p-9 space-y-6 flex flex-col justify-between">
                    <div className="space-y-3.5">
                      <h4 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                        {userTypeDetails[activeUserType].title}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
                        {userTypeDetails[activeUserType].description}
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <h5 className="text-[10px] uppercase font-black tracking-wider text-slate-400">Features Included:</h5>
                      <ul className="space-y-2.5">
                        {userTypeDetails[activeUserType].benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-slate-705 font-medium leading-normal">
                            <div className="bg-emerald-50 text-emerald-600 w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-emerald-600" />
                            </div>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Right Image/Mock View (5 cols) */}
                  <div className="lg:col-span-5 relative min-h-[250px] lg:min-h-full">
                    <img 
                      src={userTypeDetails[activeUserType].image} 
                      alt={userTypeDetails[activeUserType].title} 
                      className="absolute inset-0 w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />
                  </div>

                </div>
              </div>
            </div>

            {/* Embedded Interactive Explainer Video Mock Player */}
            <div className="max-w-[1000px] mx-auto px-4 space-y-6">
              <div className="text-center space-y-2">
                <span className="text-[10px] font-black uppercase text-red-650 bg-red-100/70 px-3.5 py-1.5 rounded-full">Video Documentation</span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Ecosystem Explainer Video Portal</h3>
                <p className="text-slate-500 text-xs font-light max-w-md mx-auto">
                  Click play to inspect our system features, chapters, auto inspections, and state telemetry synchronization.
                </p>
                     {/* Interactive Video Player Console Box */}
              <div className="bg-white text-slate-900 rounded-3xl overflow-hidden border border-slate-200 shadow-xl relative">
                
                {/* 1. Header of the player terminal */}
                <div className="bg-slate-50 border-b border-slate-200 px-4.5 py-3 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#8B0000]" />
                    <span className="font-extrabold text-[10px] tracking-wider text-slate-600 uppercase">EXPL_PORTAL_CORE_NODE.MP4</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-emerald-600 font-black uppercase">4K RAW SOURCE</span>
                  </div>
                </div>

                {/* 2. Visual Screen (The active content screen matching playing status) */}
                <div className="bg-gradient-to-br from-red-50/30 via-white to-red-50/10 h-[260px] sm:h-[380px] relative flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
                  
                  {/* Backdrop network grid */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#8B000004_1px,transparent_1px),linear-gradient(to_bottom,#8B000004_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
                  
                  {/* Soundwaves overlay when playing */}
                  {isPlaying && (
                    <div className="absolute top-4 left-4 flex gap-1 items-end h-8">
                      <span className="w-1 bg-[#ca0000] rounded animate-pulse" style={{ height: '60%' }}></span>
                      <span className="w-1 bg-[#ca0000]/80 rounded animate-pulse" style={{ height: '40%' }}></span>
                      <span className="w-1 bg-[#ca0000]/60 rounded animate-pulse" style={{ height: '90%' }}></span>
                      <span className="w-1 bg-[#ca0000]/40 rounded animate-pulse" style={{ height: '50%' }}></span>
                    </div>
                  )}

                  {/* Active Chapter Label */}
                  <div className="absolute top-4 right-4 bg-white/90 border border-slate-200 px-3 py-1 rounded-xl text-[10px] font-mono tracking-widest text-[#8B0000] flex items-center gap-1.5 uppercase font-black shadow-sm">
                    <HelpCircle className="w-3 h-3 text-[#8B0000]" />
                    <span>Chapter: {chapters[activeChapter].title}</span>
                  </div>

                  <AnimatePresence mode="wait">
                    {!isPlaying ? (
                      <motion.div 
                        key="paused-screen"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-4 relative z-10"
                      >
                        {/* Play button halo effect */}
                        <button
                          type="button"
                          onClick={() => setIsPlaying(true)}
                          className="w-16 h-16 rounded-full bg-[#8B0000] hover:bg-neutral-950 text-white flex items-center justify-center shadow-lg hover:shadow-red-600/20 transition-all transform scale-100 hover:scale-105 active:scale-95 cursor-pointer mx-auto"
                        >
                          <Play className="w-7 h-7 fill-current ml-1 text-white" />
                        </button>
                        <div className="space-y-1 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-red-200/50 shadow-md inline-block">
                          <strong className="text-sm font-black text-slate-900 block uppercase tracking-tight">Ecosystem Explainer Portal (4m 45s)</strong>
                          <span className="text-[10px] text-[#8B0000] font-bold block uppercase tracking-wide">Click Play Node to begin interactive walk-through</span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="playing-screen"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4 relative z-10 w-full max-w-lg"
                      >
                        {/* Interactive Inspection Terminal mock layout */}
                        <div className="bg-white/95 border border-red-200/55 p-5 rounded-2xl space-y-3.5 text-left text-xs font-mono shadow-md relative">
                          <div className="absolute top-3 right-3 text-[9px] text-[#8B0000] font-black tracking-widest animate-pulse">● LIVE STREAMING</div>
                          
                          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#8B0000] inline-block shrink-0 animate-ping"></span>
                            <span className="text-slate-800 font-extrabold uppercase tracking-wider text-[9.5px]">Simulation Node: Port Warsaw Check</span>
                          </div>

                          <div className="space-y-1.5 text-[10.5px]">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Target Query:</span>
                              <span className="text-slate-900 font-extrabold">DE_9X4110A_CHECK</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500 font-mono">Registry Matches:</span>
                              <span className="text-red-650 font-extrabold bg-red-50 px-1.5 py-0.5 rounded">100% SECURED MATCH</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Police Intercept:</span>
                              <span className="text-slate-900 font-black uppercase">0% NO ALERT CLONES</span>
                            </div>
                          </div>

                          {/* Dynamic slider preview */}
                          <div className="w-full bg-slate-100 h-1 rounded overflow-hidden">
                            <div className="bg-[#8B0000] h-full" style={{ width: `${videoProgress}%`, transition: 'width 0.3s' }}></div>
                          </div>
                        </div>

                        {/* Interactive Chapter Subtitles scrolling live */}
                        <p className="text-[#8B0000] text-[11px] sm:text-xs tracking-wide bg-white border border-red-200/40 px-4 py-2 rounded-xl inline-block mx-auto max-w-md italic shadow-sm font-bold">
                          &quot;{chapters[activeChapter].desc}&quot;
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                {/* 3. Control Action Bar */}
                <div className="bg-slate-50 border-t border-slate-200 p-4.5 space-y-3.5">
                  
                  {/* Timeline progress line */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span className="font-bold">Interactive Duration Play Line</span>
                      <span className="text-[#8B0000] font-black">{Math.floor((videoProgress / 100) * 4)}m {Math.floor(((videoProgress / 100) * 270) % 60)}s / 4m 45s</span>
                    </div>
                    
                    <div 
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const pct = Math.min(Math.max((x / rect.width) * 100, 0), 100);
                        setVideoProgress(pct);
                        if (pct < 25) setActiveChapter(0);
                        else if (pct >= 25 && pct < 65) setActiveChapter(1);
                        else setActiveChapter(2);
                      }}
                      className="w-full bg-slate-200 h-1.5 rounded-full cursor-pointer relative group"
                    >
                      <div className="bg-[#8B0000] h-full rounded-full transition-all" style={{ width: `${videoProgress}%` }}></div>
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#8B0000] shadow-md group-hover:scale-110 transition-transform pointer-events-none"
                        style={{ left: `calc(${videoProgress}% - 7px)` }}
                      ></div>
                    </div>
                  </div>

                  {/* Playback buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between text-xs">
                    
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-[#8B0000] hover:text-white text-slate-705 transition-colors cursor-pointer"
                        title={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setVideoProgress(0);
                          setActiveChapter(0);
                          setIsPlaying(false);
                        }}
                        className="p-2 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-[#8B0000] transition-colors cursor-pointer"
                        title="Restart stream"
                      >
                        <RotateCcw className="w-4 h-4 text-slate-500" />
                      </button>

                      {/* Speed multiplier toggle */}
                      <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200 font-mono">
                        <span className="text-[9px] text-slate-500 font-bold uppercase px-1.5">Speed</span>
                        {([1, 1.5, 2] as Array<1 | 1.5 | 2>).map(spd => (
                          <button
                            key={spd}
                            type="button"
                            onClick={() => setPlaybackSpeed(spd)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${playbackSpeed === spd ? 'bg-[#8B0000] text-white' : 'text-slate-600 hover:text-neutral-900 hover:bg-slate-50'}`}
                          >
                            {spd}x
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Audio Volume Simulator */}
                    <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 w-full sm:w-auto shrink-0">
                      <Volume2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <input 
                        type="range" 
                        min={0} 
                        max={100} 
                        value={videoVolume}
                        onChange={(e) => setVideoVolume(parseInt(e.target.value))}
                        className="w-24 accent-[#8B0000] cursor-pointer h-1 bg-slate-200 rounded-lg shrink-0"
                      />
                      <span className="text-[10px] font-mono text-slate-600 w-8 text-right font-bold shrink-0">{videoVolume}%</span>
                    </div>

                  </div>

                </div>

                {/* 4. Interactive Chapters Index rail inside player */}
                <div className="bg-slate-50 border-t border-slate-200 p-4.5">
                  <h4 className="text-[9.5px] font-black font-mono text-slate-500 uppercase tracking-widest block mb-3 leading-none">
                    Select Explainer Chapter to Jump directly:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {chapters.map((ch, idx) => {
                      const active = activeChapter === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => selectChapter(idx)}
                          className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer text-xs flex flex-col justify-between ${
                            active 
                              ? 'bg-red-50 border-red-200 text-[#8B0000]' 
                              : 'bg-white border-slate-200 text-slate-800 hover:border-red-200 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex justify-between items-center gap-1.5 w-full">
                            <span className={`font-mono text-[9px] font-black uppercase ${active ? 'text-[#8B0000]' : 'text-slate-400'}`}>
                              CHAPTER 0{idx + 1}
                            </span>
                            <span className="text-slate-400 font-mono text-[10px]">{ch.duration}</span>
                          </div>
                          
                          <strong className={`block text-[11.5px] mt-1 ${active ? 'text-black font-black' : 'text-slate-600'}`}>
                            {ch.title}
                          </strong>
                        </button>
                      );
                    })}
                  </div>
                </div>           </div>

              </div>
            </div>

          </motion.div>
        )}

        {/* ======================= TAB 3: CAREERS & CULTURE ======================= */}
        {currentTab === 'careers' && (
          <motion.div
            key="careers-tab-content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-16"
          >
            {/* Culture overview */}
            <div className="max-w-[1240px] mx-auto px-4 space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Our Culture</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cultureItems.map((cult, i) => {
                  const IconComp = cult.icon;
                  return (
                    <div 
                      key={i}
                      className="bg-white border border-black/[0.04] rounded-3xl p-6 space-y-4 shadow-3d-premium hover:shadow-3d-elevated hover:border-[#8B0000]/30 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-xl bg-red-50 text-[#8B0000] flex items-center justify-center font-bold">
                        <IconComp className="w-5.5 h-5.5" />
                      </div>
                      <h3 className="text-sm font-black text-slate-950 uppercase tracking-tight">{cult.title}</h3>
                      <p className="text-[11.5px] text-slate-500 leading-normal font-normal">
                        {cult.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filterable Position List */}
            <div className="max-w-[1240px] mx-auto px-4 space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">Work with Us</h3>
                  <p className="text-slate-500 text-sm font-medium">We are always looking for friendly and motivated people to join our growing team.</p>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Dept Filter */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Department</label>
                    <select
                      value={selectedDept}
                      onChange={(e) => setSelectedDept(e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-[#8B0000] cursor-pointer"
                    >
                      <option value="all">All Departments</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Operations">Operations</option>
                      <option value="Sales">Sales</option>
                      <option value="Security">Security</option>
                    </select>
                  </div>

                  {/* Location Filter */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase">Location</label>
                    <select
                      value={selectedLoc}
                      onChange={(e) => setSelectedLoc(e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:border-[#8B0000] cursor-pointer"
                    >
                      <option value="all">All Locations</option>
                      <option value="Berlin">Berlin</option>
                      <option value="Warsaw">Warsaw</option>
                      <option value="Remote">Remote</option>
                      <option value="San Francisco">San Francisco</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Jobs Stream */}
              <div className="space-y-4">
                {openJobs
                  .filter(job => (selectedDept === 'all' || job.dept === selectedDept) && (selectedLoc === 'all' || job.loc === selectedLoc))
                  .length === 0 ? (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center text-slate-400 space-y-2">
                      <Briefcase className="w-8 h-8 mx-auto text-slate-300" />
                      <p className="text-xs font-bold font-mono">NO ACTIVE ROLES FOUND</p>
                      <p className="text-[11px] text-slate-400 font-light">Try relaxing your department or location search parameters.</p>
                    </div>
                  ) : (
                    openJobs
                      .filter(job => (selectedDept === 'all' || job.dept === selectedDept) && (selectedLoc === 'all' || job.loc === selectedLoc))
                      .map((job) => {
                        const isExpanded = selectedJobId === job.id;
                        return (
                          <div 
                            key={job.id}
                            className={`bg-white border rounded-3xl transition-all duration-300 overflow-hidden shadow-3d-premium hover:shadow-3d-elevated ${
                              isExpanded ? 'border-[#8B0000]' : 'border-black/[0.04]'
                            }`}
                          >
                            <div 
                              onClick={() => setSelectedJobId(isExpanded ? null : job.id)}
                              className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                            >
                              <div className="space-y-1.5">
                                <div className="flex flex-wrap gap-2 items-center">
                                  <span className="bg-red-50 text-[#8B0000] text-[10px] font-bold px-2.5 py-1 rounded-md">
                                    {job.dept}
                                  </span>
                                  <span className="bg-zinc-100 text-zinc-600 text-[10px] font-bold px-2.5 py-1 rounded-md">
                                    {job.loc}
                                  </span>
                                  <span className="text-slate-400 text-xs font-mono">{job.type}</span>
                                </div>
                                <h4 className="text-base font-black text-slate-900">{job.title}</h4>
                              </div>

                              <div className="flex items-center gap-4">
                                <span className="text-xs font-mono font-bold text-slate-550 sm:text-right block">
                                  {job.salary}
                                </span>
                                <div className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center transition-transform ${isExpanded ? 'rotate-90 text-[#8B0000] bg-red-50' : 'text-slate-400 bg-slate-50'}`}>
                                  <ChevronRight className="w-4 h-4" />
                                </div>
                              </div>
                            </div>

                            {/* Job Description details slide open */}
                            {isExpanded && (
                              <div className="border-t border-slate-150 bg-slate-50/60 p-6 space-y-5 animate-fadeIn">
                                <div className="space-y-2">
                                  <h5 className="text-[10px] uppercase font-black tracking-widest text-slate-400">Position Mission:</h5>
                                  <p className="text-xs text-slate-650 leading-relaxed font-light">{job.description}</p>
                                </div>

                                <div className="space-y-2">
                                  <h5 className="text-[10px] uppercase font-black tracking-widest text-slate-400">Prerequisite Competencies:</h5>
                                  <ul className="space-y-1.5">
                                    {job.requirements.map((req, rIdx) => (
                                      <li key={rIdx} className="flex items-start gap-2 text-xs text-slate-600 font-light">
                                        <div className="text-red-600 mt-1 uppercase font-mono font-black shrink-0 text-[9px]">✓</div>
                                        <span>{req}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Link button to apply form */}
                                <div className="pt-3 border-t border-slate-200">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setFormValues(prev => ({ ...prev, position: job.id }));
                                      const formElem = document.getElementById('careers-app-form-node');
                                      if (formElem) {
                                        formElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                      }
                                    }}
                                    className="bg-red-600 hover:bg-neutral-905 text-white font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer inline-flex items-center gap-1.5"
                                  >
                                    Apply for this Position <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            )}

                          </div>
                        );
                      })
                  )}
              </div>
            </div>            {/* Structured Job Application Form with micro-states */}
            <div className="max-w-[800px] mx-auto px-4" id="careers-app-form-node">
              <div className="bg-white border border-black/[0.04] rounded-3xl p-6 sm:p-9 space-y-6 shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300">
                
                <div className="text-center space-y-2 pb-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Submit Your Application</h3>
                  <p className="text-slate-500 text-xs font-light max-w-sm mx-auto">
                    Fill out the fields below and upload your resume to apply for a position.
                  </p>
                </div>

                {!formSubmitted ? (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    
                    {formLoading ? (
                      <div className="py-12 text-center space-y-4">
                        {/* Custom animated loader */}
                        <div className="w-12 h-12 rounded-full border-2 border-slate-200 border-t-[#8B0000] animate-spin mx-auto"></div>
                        <div className="space-y-1">
                          <strong className="text-xs font-black uppercase tracking-wider text-slate-950 font-mono block">Processing Application</strong>
                          <p className="text-[10.5px] text-slate-400 animate-pulse italic">{loadingStep}</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Name Input */}
                          <div className="space-y-1">
                            <label className="block text-[10.5px] font-bold text-slate-450 uppercase">Full Name *</label>
                            <input
                              type="text"
                              name="name"
                              value={formValues.name}
                              onChange={handleInputChange}
                              placeholder="Elena Rostova"
                              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs outline-none transition-all ${
                                formErrors.name ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200 focus:border-[#8B0000] focus:bg-white'
                              }`}
                            />
                            {formErrors.name && <span className="text-[9.5px] text-red-650 font-bold font-mono inline-block">{formErrors.name}</span>}
                          </div>

                          {/* Email Input */}
                          <div className="space-y-1">
                            <label className="block text-[10.5px] font-bold text-slate-450 uppercase">Email Address *</label>
                            <input
                              type="email"
                              name="email"
                              value={formValues.email}
                              onChange={handleInputChange}
                              placeholder="elena@example.com"
                              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs outline-none transition-all ${
                                formErrors.email ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200 focus:border-[#8B0000] focus:bg-white'
                              }`}
                            />
                            {formErrors.email && <span className="text-[9.5px] text-red-650 font-bold font-mono inline-block">{formErrors.email}</span>}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Phone Input */}
                          <div className="space-y-1">
                            <label className="block text-[10.5px] font-bold text-slate-450 uppercase">Phone Number *</label>
                            <input
                              type="tel"
                              name="phone"
                              value={formValues.phone}
                              onChange={handleInputChange}
                              placeholder="+49 (30) 1234-5678"
                              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs outline-none transition-all ${
                                formErrors.phone ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200 focus:border-[#8B0000] focus:bg-white'
                              }`}
                            />
                            {formErrors.phone && <span className="text-[9.5px] text-red-650 font-bold font-mono inline-block">{formErrors.phone}</span>}
                          </div>

                          {/* Destination Position Dropdown */}
                          <div className="space-y-1">
                            <label className="block text-[10.5px] font-bold text-slate-450 uppercase">Destination Role *</label>
                            <select
                              name="position"
                              value={formValues.position}
                              onChange={handleInputChange}
                              className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs outline-none transition-all cursor-pointer ${
                                formErrors.position ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200 focus:border-[#8B0000] focus:bg-white'
                              }`}
                            >
                              <option value="">-- Choose Target Role --</option>
                              {openJobs.map((job) => (
                                <option key={job.id} value={job.id}>
                                  {job.title} ({job.loc})
                                </option>
                              ))}
                              <option value="general-app">General Speculative Application</option>
                            </select>
                            {formErrors.position && <span className="text-[9.5px] text-red-650 font-bold font-mono inline-block">{formErrors.position}</span>}
                          </div>
                        </div>

                        {/* Portfolio URL */}
                        <div className="space-y-1">
                          <label className="block text-[10.5px] font-bold text-slate-455 uppercase">Portfolio / GitHub / LinkedIn URL</label>
                          <input
                            type="url"
                            name="portfolio"
                            value={formValues.portfolio}
                            onChange={handleInputChange}
                            placeholder="https://github.com/yourprofile"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none transition-all focus:border-[#8B0000] focus:bg-white"
                          />
                        </div>

                        {/* Message Cover letter */}
                        <div className="space-y-1">
                          <label className="block text-[10.5px] font-bold text-slate-455 uppercase">Short Cover Letter / Pitch *</label>
                          <textarea
                            name="message"
                            rows={4}
                            value={formValues.message}
                            onChange={handleInputChange}
                            placeholder="Tell us a little bit about yourself and why you would like to work with us."
                            className={`w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-xs outline-none transition-all ${
                              formErrors.message ? 'border-red-400 ring-2 ring-red-100' : 'border-slate-200 focus:border-[#8B0000] focus:bg-white'
                            }`}
                          />
                          {formErrors.message && <span className="text-[9.5px] text-red-650 font-bold font-mono inline-block">{formErrors.message}</span>}
                        </div>

                        {/* Drag and Drop File Uploader */}
                        <div className="space-y-1">
                          <label className="block text-[10.5px] font-bold text-slate-455 uppercase">CV &amp; Resume File Submission</label>
                          <UniversalSmartUpload
                            photoKey="about_resume_cv"
                            uploadedImageSrc={uploadedResumeSrc}
                            onUploadSuccess={handleSmartResumeUpload}
                            onClear={() => {
                              setUploadedResumeSrc(null);
                              setResumeFile(null);
                            }}
                            label="Resume / Profile Photo Capture"
                            description="Capture your physically printed CV, or stream your profile snapshot."
                          />
                        </div>

                        {/* Submit Actions */}
                        <div className="pt-2">
                          <button
                            type="submit"
                            className="w-full bg-[#8B0000] hover:bg-slate-900 text-white font-extrabold uppercase text-xs tracking-widest py-3.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Send className="w-4 h-4 text-white" /> Submit Application
                          </button>
                        </div>
                      </>
                    )}
                  </form>
                ) : (
                  <div className="bg-red-50/10 border border-red-250 rounded-3xl p-8 text-center space-y-4 animate-scaleIn">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                      <Check className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-lg font-black text-slate-950 font-mono uppercase">Application Submitted!</h4>
                      <p className="text-slate-500 text-xs font-light max-w-md mx-auto leading-relaxed">
                        Excellent, <strong>{formValues.name}</strong>. Your application has been successfully saved to our recruitment list. We will review it shortly.
                      </p>
                    </div>

                    <div className="p-4 bg-white border border-slate-100 rounded-xl max-w-sm mx-auto text-left text-[11px] font-mono space-y-1 text-slate-650">
                      <div><strong className="text-slate-400">Position:</strong> {formValues.position === 'general-app' ? 'General Application' : formValues.position}</div>
                      <div><strong className="text-slate-400">Response SLA:</strong> Within 2 business days</div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setFormSubmitted(false);
                        setResumeFile(null);
                        setFormValues({
                          name: '',
                          email: '',
                          phone: '',
                          portfolio: '',
                          message: '',
                          position: ''
                        });
                      }}
                      className="text-[10px] font-black uppercase tracking-widest text-[#8B0000] hover:underline"
                    >
                      Submit Another Application
                    </button>
                  </div>
                )}

              </div>
            </div>

          </motion.div>
        )}

        {/* ======================= TAB 4: PRESS & MEDIA ======================= */}
        {currentTab === 'press' && (
          <motion.div
            key="press-tab-content"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-16"
          >
            {/* Press Header and Category Search Bar */}
            <div className="max-w-[1240px] mx-auto px-4 space-y-6">
              
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 pb-4">
                <div className="space-y-1.5">
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
                    Press &amp; Media
                  </h2>
                  <p className="text-slate-500 text-sm font-medium max-w-xl">
                    Access our latest announcements, news, and official brand assets.
                  </p>
                </div>

                {/* Categories & Search Input bar */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/50">
                    {['all', 'Product', 'Partnership', 'Security', 'Corporate'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedPressCat(cat)}
                        className={`px-3 py-1.5 rounded-lg text-[10.5px] font-extrabold uppercase tracking-wide transition-all cursor-pointer ${
                          selectedPressCat === cat 
                            ? 'bg-[#8B0000] text-white shadow-md shadow-[#8B0000]/20' 
                            : 'text-slate-500 hover:text-[#8B0000] font-bold'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Search input bar */}
                  <div className="relative w-full sm:w-60">
                    <input
                      type="text"
                      placeholder="Search announcements..."
                      value={searchPressQuery}
                      onChange={(e) => setSearchPressQuery(e.target.value)}
                      className="bg-white border border-slate-200 outline-none rounded-xl px-4 py-2.5 pl-9 text-xs w-full focus:border-[#8B0000] placeholder:text-slate-400"
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 font-mono text-[10.5px]">🔍</div>
                  </div>
                </div>
              </div>

              {/* Press releases dynamic archive grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {pressReleases
                  .filter(pr => (selectedPressCat === 'all' || pr.category === selectedPressCat) && (pr.title.toLowerCase().includes(searchPressQuery.toLowerCase()) || pr.summary.toLowerCase().includes(searchPressQuery.toLowerCase()) || pr.content.toLowerCase().includes(searchPressQuery.toLowerCase())))
                  .length === 0 ? (
                    <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-3xl p-16 text-center text-slate-400 space-y-2">
                      <Newspaper className="w-10 h-10 mx-auto text-slate-300" />
                      <p className="text-xs font-bold font-mono">NO RELEASES FOUND</p>
                      <p className="text-[11px] text-slate-400 font-light">Try expanding your category selection or deleting the search terms.</p>
                    </div>
                  ) : (
                    pressReleases
                      .filter(pr => (selectedPressCat === 'all' || pr.category === selectedPressCat) && (pr.title.toLowerCase().includes(searchPressQuery.toLowerCase()) || pr.summary.toLowerCase().includes(searchPressQuery.toLowerCase()) || pr.content.toLowerCase().includes(searchPressQuery.toLowerCase())))
                      .map((pr) => (
                        <div 
                          key={pr.id}
                          className="bg-white border border-black/[0.04] rounded-3xl p-6 sm:p-8 space-y-4 shadow-3d-premium hover:shadow-3d-elevated hover:border-[#8B0000]/30 transition-all duration-300 flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-1 text-[11px] font-mono text-slate-400 border-b border-slate-100 pb-2">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-zinc-450" /> {pr.date}
                              </span>
                              <span className="bg-red-50 text-[#8B0000] text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block">
                                {pr.category}
                              </span>
                            </div>

                            <h3 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                              {pr.title}
                            </h3>

                            <p className="text-slate-500 text-xs font-light leading-relaxed">
                              {pr.summary}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
                            <span className="text-[10px] font-mono text-zinc-400">By: {pr.author}</span>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedPressReleaseId(pr.id)}
                                className="text-[10.5px] font-extrabold uppercase text-slate-900 hover:text-[#8B0000] cursor-pointer inline-flex items-center gap-1.5 transition-colors"
                              >
                                Read Full Article <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
              </div>
            </div>

            {/* Media kit asset downloads block */}
            <div className="max-w-[1240px] mx-auto px-4 space-y-8">
              <div className="text-center space-y-2">
                <span className="text-[9.5px] font-black uppercase text-red-650 tracking-widest">Digital Resources &amp; Guidelines</span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Official Media Brand Assets Kits</h2>
                <p className="text-slate-500 text-xs font-light max-w-xl mx-auto">
                  Acquire verified graphics, photos, typography vectors, and color hex standards to ensure flawless branding integration.
                </p>
              </div>

              {/* Media tools bento grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {mediaKits.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:bg-white hover:border-[#8B0000] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="space-y-3">
                      <div className="w-11 h-11 rounded-xl bg-red-50 text-red-650 flex items-center justify-center font-bold">
                        <Download className="w-5.5 h-5.5" />
                      </div>
                      <h3 className="text-base font-black text-slate-950 uppercase tracking-tight">{item.title}</h3>
                      <p className="text-[11.5px] text-slate-400 leading-relaxed font-light">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-400 uppercase font-black tracking-wider bg-zinc-200/50 px-2 py-0.5 rounded">
                        {item.fileType} • {item.size}
                      </span>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setMediaKitDownloaded(item.id);
                          setTimeout(() => setMediaKitDownloaded(null), 3000);
                        }}
                        className="bg-[#8B0000] border border-transparent hover:bg-neutral-950 text-white font-extrabold text-[10.5px] uppercase tracking-wider px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-red-650/20 cursor-pointer inline-flex items-center gap-1.5"
                      >
                        {mediaKitDownloaded === item.id ? (
                          <>Downloaded ✓</>
                        ) : (
                          <>Download Kit <Download className="w-3.5 h-3.5" /></>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Brand Colors Reference Chart inside bento-style box */}
              <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl p-6 sm:p-9 space-y-6 relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full filter blur-3xl"></div>
                
                <div className="space-y-2">
                  <span className="text-[#8B0000] text-[10px] font-mono font-black uppercase tracking-wider block">BRAND GUIDELINES PREVIEW</span>
                  <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Our Core Color System Configuration</h4>
                  <p className="text-slate-500 text-xs font-light max-w-lg">
                    When featuring JustCarSale platform metrics or listings, please configure these color ratios to align your graphics with our core premium layouts.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
                  {/* Color Crimson */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex gap-3 items-center">
                    <span className="w-8 h-8 rounded-lg bg-[#8B0000] border border-slate-200 inline-block"></span>
                    <div className="font-mono text-xs">
                      <strong className="text-slate-900 block font-extrabold uppercase text-[10px]">Blood Red Primary</strong>
                      <span className="text-slate-500 font-bold">Hex: #8B0000</span>
                    </div>
                  </div>
                  {/* Color Pure White */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex gap-3 items-center">
                    <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 inline-block"></span>
                    <div className="font-mono text-xs">
                      <strong className="text-slate-900 block font-extrabold uppercase text-[10px]">Crisp Milk White</strong>
                      <span className="text-slate-500 font-bold">Hex: #FFFFFF</span>
                    </div>
                  </div>
                  {/* Color Light Grey Accent */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex gap-3 items-center">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 inline-block"></span>
                    <div className="font-mono text-xs">
                      <strong className="text-slate-900 block font-extrabold uppercase text-[10px]">Ambient Slate</strong>
                      <span className="text-slate-500 font-bold">Hex: #F1F5F9</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Structured PR Media Contacts Box */}
            <div className="max-w-[750px] mx-auto px-4">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-9 space-y-6 shadow-xs relative overflow-hidden">
                
                {/* Visual red left border stripe */}
                <div className="absolute top-0 bottom-0 left-0 w-2 bg-red-650"></div>

                <div className="space-y-2 pl-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#8B0000] bg-orange-50 px-3.5 py-1 rounded-full">PR Contact Bureau</span>
                  <h3 className="text-xl font-black text-slate-950 tracking-tight">Do You Have a Media Request?</h3>
                  <p className="text-slate-500 text-xs font-light leading-relaxed max-w-sm">
                    Connect directly to our Operational Communications desk for transcontinental interviews, research queries, or quote approvals.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pl-2 pt-2">
                  
                  {/* General PR Desk */}
                  <div className="space-y-2 border border-slate-100 rounded-2xl p-4.5 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 inline-flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-red-600 font-bold" /> PR &amp; Communications Hub
                    </h4>
                    <p className="text-[11.5px] text-slate-400 font-light leading-snug">
                      For general platform volume statistics, brand reviews, and homologation quotes.
                    </p>
                    <div className="font-mono text-xs text-red-650 font-bold">
                      press@justcarsale.xyz
                    </div>
                  </div>

                  {/* Urgent Contact hotlines */}
                  <div className="space-y-2 border border-slate-100 rounded-2xl p-4.5 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 inline-flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-blue-600 font-bold" /> PR Urgent SLA Response Hotline
                    </h4>
                    <p className="text-[11.5px] text-slate-400 font-light leading-snug">
                      PR hotline for verified news agencies and regional editors needing sub-2 hour quotes.
                    </p>
                    <div className="font-mono text-xs text-slate-800 font-bold">
                      +49 (0) 40 4567 8910
                    </div>
                  </div>

                </div>

                <p className="text-[10.5px] italic text-slate-400 leading-normal pl-2 block text-center">
                  * Note: For general customer support, list queries, or mechanic work dispatches, please route requests via our main Dashboard Help Desk.
                </p>

              </div>
            </div>

            {/* Press Release Details overlay / disclosures */}
            {selectedPressReleaseId && (
              <div 
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-100 flex items-center justify-center p-4" 
                onClick={() => setSelectedPressReleaseId(null)}
              >
                <div 
                  className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-9 space-y-6 relative animate-scaleIn shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close btn */}
                  <button 
                    onClick={() => setSelectedPressReleaseId(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-950 font-mono text-xl font-bold p-1 cursor-pointer"
                  >
                    ✕
                  </button>

                  {/* Modal Header */}
                  {pressReleases.filter(pr => pr.id === selectedPressReleaseId).map(pr => (
                    <div key={pr.id} className="space-y-5">
                      <div className="flex items-center justify-between gap-1 border-b border-slate-100 pb-3 text-xs font-mono text-zinc-400">
                        <span>Calendar: {pr.date}</span>
                        <span className="bg-red-50 text-red-650 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full">{pr.category}</span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-slate-950 leading-tight tracking-tight">
                        {pr.title}
                      </h3>

                      <p className="text-xs text-slate-500 font-bold leading-relaxed bg-slate-50 p-4 border border-slate-100 rounded-xl">
                        {pr.summary}
                      </p>

                      <div className="text-xs sm:text-sm text-slate-650 leading-relaxed font-light space-y-4">
                        <p>{pr.content}</p>
                        <p>Our distributed team works daily with DMVs and municipal authorities, reducing fraud while making lists verifiable in seconds using decentralized metadata standards.</p> 
                        <p>For more detailed statistics, or download access to vector assets, logos, and high-contrast hub photography packages, please consult the media kit resources available under our Press section.</p>
                      </div>

                      <div className="pt-4 border-t border-slate-150 flex items-center justify-between text-[11px] text-slate-450">
                        <span>Issued by: {pr.author}</span>
                        <span>SLA check size: {pr.fileSize}</span>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            )}

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

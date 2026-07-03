import React, { useState } from 'react';
import { 
  ArrowLeft, Check, Calendar, Shield, Clock, MapPin, Sparkles, AlertCircle, 
  HelpCircle, ChevronRight, Phone, MessageSquare, Briefcase, FileText, Settings, Info, CreditCard,
  Star, ThumbsUp, ShieldCheck, User, Mail, CalendarDays, MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SERVICE_PROVIDERS } from './LandingPage';

export interface AutomotiveService {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  badge: string;
  facilities: string;
  avgTurnaround: string;
  longDescription: string;
  startingPrice: number;
  features: string[];
  requirements: string[];
}

export const AUTOMOTIVE_SERVICES: AutomotiveService[] = [
  {
    id: 'auto-painters',
    title: 'Auto Painters',
    description: 'Bespoke multi-stage painting, clear-coat finishing, and computer-matched factory color restoration in controlled dust-free downdraft booths.',
    image: 'https://images.unsplash.com/photo-1599256872237-5dcc0fbe966a?auto=format&fit=crop&q=80&w=800',
    tags: ['Factory Refinishing', 'Color Match', 'Ceramic Seal'],
    badge: 'Premium Finish',
    facilities: '6 State-of-the-art downdraft dustless cabins',
    avgTurnaround: '3 - 5 business days',
    startingPrice: 1250,
    longDescription: 'Our certified partner paint bays utilize advanced spectrophotometers for computer-aided color scanning, replicating original factory codes down to the micron. Each vehicle is prepared with hand-sanding, rust barrier primers, multi-coat base paint, and dual high-solid scratch-resistant clear coat. The baking process occurs in pressurized custom downdraft cabins, ensuring a mirror-like finish free of airborne contaminants. Ideal for custom restyling, collision matching, and premium restoration.',
    features: [
      'Multi-stage computer-guided paint matching scan',
      'Dual high-solids ceramic clear-coat finishing',
      'Baking and thermal treatment in isolated cabin bays',
      'Wet sanding, compounding, and final orbital polish stage',
      '5-Year written gloss and adhesion warranty'
    ],
    requirements: [
      'Vehicle must be clean of heavy grease and mud upon arrival',
      'Prior custom resprays must be disclosed for primer compatibility checks'
    ]
  },
  {
    id: 'mechanics',
    title: 'Mechanics',
    description: 'Master diagnostics, powertrain reconstruction, and mechanical calibrations conducted by ASE-certified master mechanics utilizing modern telemetry.',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=800',
    tags: ['Diagnostics', 'Engine Labs', 'Calibrations'],
    badge: 'ASE Master Cert',
    facilities: '12 Hydraulic lift bays & diagnostic modules',
    avgTurnaround: '1 - 3 business days',
    startingPrice: 180,
    longDescription: 'Connect with elite master mechanics authorized to execute factory maintenance protocols, drivetrain repairs, and high-tech electrical diagnostic analysis. Equipped with real-time OBD-III oscilloscopes and active live-data tracking equipment, this department resolves issues ranging from intricate timing chain adjustments to full transmission reconstructions. Every mechanical partner holds current ASE Master certifications, assuring factory-spec standards.',
    features: [
      'ASE Master Diagnostics with full sensor reports',
      'Genuine factory OEM parts with global warranty cover',
      'Computerized valvetrain & active suspension alignment',
      'Comprehensive fuel system flush and carbon clean extraction',
      'Precision torque inspection to exact OEM specifications'
    ],
    requirements: [
      'Ignition keys must remain at the center during maintenance',
      'Disclose any active aftermarket ECU remaps beforehand'
    ]
  },
  {
    id: 'tire-dealers',
    title: 'Tire Dealers',
    description: 'Authorized distribution of high-performance tires, elite track slicks, and precise computer and laser wheel-balancing for performance setups.',
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=800',
    tags: ['Ultra High Performance', 'Track Slicks', 'Laser Balancing'],
    badge: 'Authorized Dealer',
    facilities: 'Laser road-force wheel diagnostic hubs',
    avgTurnaround: 'Same day installation',
    startingPrice: 320,
    longDescription: 'Get premium wholesale access to tier-1 high-performance compounds, semi-slick track day rubber, and advanced winter traction configurations. Our approved network dealers provide live road-force testing, laser bead matching, and computerized 3D geometry alignments. Ensure outstanding steering response and wet-weather control with components matched exactly to your vehicle\'s load ratings and speed indexes.',
    features: [
      'Hunter Road Force® Elite high-precision system balancing',
      'Bespoke performance alignment matched to chassis setups',
      'Genuine manufacturer-authorized tires with DOT tracking',
      'Nitrogen gas inflation for stable tire pressures',
      'Complementary puncture repairs and rotation checks'
    ],
    requirements: [
      'Wheel lock key must be left in the central console cup holder',
      'Disclose if standard TPMS sensors are bypassed or modified'
    ]
  },
  {
    id: 'detailing-companies',
    title: 'Detailing Companies',
    description: 'High-end cosmetic detailing, multi-stage paint correction, wet-sanding, and long-term certified ceramic coating applications for concours presentation.',
    image: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&q=80&w=800',
    tags: ['Paint Correction', 'Ceramic Coatings', 'Concours Prep'],
    badge: 'Elite Detail',
    facilities: 'Climate-controlled curing and light tunnels',
    avgTurnaround: '1 - 2 business days',
    startingPrice: 450,
    longDescription: 'Indulge your high-end luxury vehicle or collection sports car in premium optical correction. Our detailing wizards carry out intensive three-stage paint correction to safely remove up to 95% of swirl marks, light scratching, and water etchings. Followed up by elite 9H multi-layered ceramic paint defense, the exterior achieves hydrophobic protection with an outstanding glass-like shine that lasts for up to five years.',
    features: [
      'Bespoke three-step compound + polish paint correction',
      'Carbon-nano 9H glass ceramic coating protection',
      'Intensive clay bar decontamination deep scrub',
      'Deep steam cabin therapy and interior leather conditioning',
      'Windshield rain-deflecting hydrophobic molecular coating'
    ],
    requirements: [
      'Requires standard indoor location or facility storage during paint cure',
      'Avoid high-pressure wash treatments for 7 days post-coating application'
    ]
  },
  {
    id: 'wrapping-advertising',
    title: 'Wrapping and Advertising Companies',
    description: 'Precision full-color change color shift vinyl wraps, commercial advertising wraps, paint protection film (PPF), and bespoke livery designs.',
    image: 'https://images.unsplash.com/photo-1626847037657-fd3622613ce3?auto=format&fit=crop&q=80&w=800',
    tags: ['XPEL PPF', 'Color Wrap', 'Commercial Fleet'],
    badge: 'Wrap Specialists',
    facilities: 'De-humidified dust-free wrap workstations',
    avgTurnaround: '2 - 4 business days',
    startingPrice: 1600,
    longDescription: 'Enhance your vehicle\'s aesthetics or protect its pristine factory gloss with premier vinyl wraps and Paint Protection Films (PPF). Utilizing only premium certified films from brand-authorized networks like Avery Dennison, 3M, and XPEL, our professionals ensure bubble-free custom corner wraps, seamless panel styling, and exact plotter templates to prevent paint damage. Available in matte, metallic, chrome-flip, and custom digital livery prints.',
    features: [
      'Custom pre-cut pattern styling preventing razor-to-paint contact',
      'High-grade self-healing thermoplastic polyurethane PPF',
      'Edge wrapping around headlights and body seals for stealth looks',
      'Premium cast vinyl backing structured with rapid air channels',
      'Full paint preparation check including detailed decontamination wash'
    ],
    requirements: [
      'Car must not have recently been repainted within past 25 days',
      'Must disclose any physical body damage or deep clear-coat peeling'
    ]
  },
  {
    id: 'rust-protection',
    title: 'Rust Protection and Underbody Treatment Specialists',
    description: 'Salt-resistant undercarriage coating, advanced cavitation preservation, and heavy-duty wax barrier treatment built for extreme-weather longevity.',
    image: 'https://images.unsplash.com/photo-1518384401463-d387dd16ef9b?auto=format&fit=crop&q=80&w=800',
    tags: ['Undercarriage Seal', 'Cavitation Wax', 'Corrosion Tech'],
    badge: 'Rust Tech',
    facilities: 'Dedicated chassis-spray jet wash elevators',
    avgTurnaround: '1 - 2 business days',
    startingPrice: 290,
    longDescription: 'Ensure extreme-weather body preservation against corrosive chemicals, winter salts, and ambient moisture. Specialists clean the entire undercarriage utilizing high-temperature steam wash, remove surface corrosion scaling, and apply self-healing bitumen-based coatings or high-viscosity cavity wax. This barrier isolates metal frame weld seams, rocker panels, and floorboards from structural rot.',
    features: [
      'Thermostatic steam underside frame deep-clean wash cycle',
      'Self-healing, anti-perforation cavity wax misting',
      'Subframe and crossmember internal rust conversion scaling',
      'Heavy-duty salt-resistant sound-dampening coat wrap',
      'Complementary annual structural inspection support'
    ],
    requirements: [
      'Undercarriage must dry completely before coat application starts',
      'Exhaust heat shields remain masked to prevent compound smoke'
    ]
  },
  {
    id: 'metalwork-fabrication',
    title: 'Metalwork and Fabrication Workshops',
    description: 'Precision custom welding, handcrafted rollcage fabrications, weight-reduction bracket construction, and metal panel custom restorations.',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
    tags: ['TIG/MIG Welding', 'Rollcages', 'Chassis Stitching'],
    badge: 'Bespoke Fab',
    facilities: 'Heavy-duty CNC mills & laser-cutting rigs',
    avgTurnaround: '3 - 7 business days',
    startingPrice: 500,
    longDescription: 'Transform structural limits with certified custom welding, frame strengthening, and bespoke metal fabrication. Specialists work with premium aerospace chromoly, structural aluminum, and robust stainless steel. From track-day roll cages and high-flow exhaust manifolds to custom chassis reinforcement stitching and classic car rust panel replacements, this is the destination for high-integrity custom engineering.',
    features: [
      'High-grade TIG and MIG precision gas welding',
      '4130 Chromoly roll cage tubes engineered to FIA/SCCA spec',
      'CNC plasma custom plate cutting and sheet metal bending',
      'Exotic exhaust downpipe and exhaust line manufacturing',
      'Structural weld testing and magnetic particle inspections'
    ],
    requirements: [
      'Detailed blueprint drafts or CAD metrics must be approved',
      'Batteries must be completely disconnected before arc welding is active'
    ]
  },
  {
    id: 'glass-repair',
    title: 'Glass Repair/Replacement Companies',
    description: 'Factory-certified ADAS-calibrated windshield replacements, rapid chip repairs, and premium tempered side glass installations.',
    image: 'https://images.unsplash.com/photo-1558441719-ff34b0524a24?auto=format&fit=crop&q=80&w=800',
    tags: ['ADAS Calibration', 'Windshield Repair', 'OEM Glass'],
    badge: 'Safety First',
    facilities: 'Optical sensor test rigs & ADAS aligners',
    avgTurnaround: '2 - 4 hours',
    startingPrice: 150,
    longDescription: 'Get swift, high-integrity windshield repair and certified glass replacements conforming to motor vehicle safety laws. Our verified network handles advanced driver logs, rain sensor alignments, and camera recalibrations (ADAS), ensuring blind spot monitors and emergency smart brakes function correctly post-installation of new premium laminate windshields.',
    features: [
      'OEM-spec high-index laminate impact-resistant windshields',
      'Precision optical camera ADAS target sensor calibration',
      'Rapid resin-injected vacuum chip repair preventing crack spreads',
      'Premium urethane sealing compound with short drive-away timers',
      'Full cleanup of interior glass fragments and debris'
    ],
    requirements: [
      'Vehicle must stay unwashed for 24 hours to cure urethane adhesive safely',
      'Insurance claim authorization codes must be ready for easy billing'
    ]
  },
  {
    id: 'specialized-workshops',
    title: 'Specialized Automotive Workshops',
    description: 'Tuning houses, track day preparations, bespoke engine builds, transmission rebuilding, and high-performance ECU mapping.',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800',
    tags: ['ECU Tuning', 'Engine Blueprinting', 'Track Setup'],
    badge: 'Performance Hub',
    facilities: 'All-wheel Mustang dyno testing system',
    avgTurnaround: 'Custom per specification',
    startingPrice: 400,
    longDescription: 'For specialized racing programs, extreme road upgrades, and customized projects. We connect you with top-tier tuning hubs equipped with state-of-the-art chassis dynos, customized blueprinting labs, and digital diagnostic calibration. Services include custom-engineered turbos, blueprinting race blocks, high-speed gear adjustments, and bespoke ecu tuning overlays.',
    features: [
      'Chassis dynamometer testing with full torque / boost log charts',
      'Race-spec engine blue-printing and tolerances profiling',
      'Suspension geometry setups with corner weight alignment',
      'Motorsport telemetry logging and brake fluid heat management',
      'Tailored power maps adjusted to certified custom octane index'
    ],
    requirements: [
      'Ensure fluid levels are at safe indexes before intensive power dyno tests',
      'Bespoke software maps are engineered purely for off-road closed circuits'
    ]
  }
];

interface ServiceDetailsProps {
  serviceId: string;
  onBack: () => void;
  onConfirmAcquisition: (details: any) => void;
}

export default function ServiceDetails({ serviceId, onBack, onConfirmAcquisition }: ServiceDetailsProps) {
  const localProvider = SERVICE_PROVIDERS.find(p => p.id === serviceId);
  
  if (localProvider) {
    return (
      <LocalProviderDetails 
        provider={localProvider} 
        onBack={onBack} 
        onConfirmAcquisition={onConfirmAcquisition} 
      />
    );
  }

  const service = AUTOMOTIVE_SERVICES.find(s => s.id === serviceId) || AUTOMOTIVE_SERVICES[0];
  
  // Custom interactive pricing simulator states
  const [carClass, setCarClass] = useState<'standard' | 'luxury' | 'exotic'>('standard');
  const [priorityPass, setPriorityPass] = useState(false);
  const [extraCoatState, setExtraCoatState] = useState(false);
  const [includeValetDrop, setIncludeValetDrop] = useState(false);

  // Calculate pricing based on options
  const calculateEstimatedPrice = () => {
    let base = service.startingPrice;
    
    // Car Class Premium
    if (carClass === 'luxury') base += service.startingPrice * 0.35;
    if (carClass === 'exotic') base += service.startingPrice * 0.75;
    
    // Priority Pass Option
    if (priorityPass) base += 120;
    
    // Add-on options
    if (extraCoatState) {
      base += service.id === 'detailing-companies' || service.id === 'auto-painters' ? 250 : 100;
    }
    if (includeValetDrop) base += 75;
    
    return Math.round(base);
  };

  // Booking states
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3 | 4>(1);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    carMakeModel: '',
    vin: '',
    preferredDate: '',
    preferredTime: '10:00 AM',
    notes: ''
  });

  const [dateSlots] = useState(() => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 6; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      dates.push(nextDate);
    }
    return dates;
  });

  const timeSlots = ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM'];

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStep(4);
    // Call external handler with customized receipt
    onConfirmAcquisition({
      serviceId: service.id,
      title: service.title,
      price: calculateEstimatedPrice(),
      date: userData.preferredDate || dateSlots[0].toLocaleDateString(),
      time: userData.preferredTime,
      carClass,
      valet: includeValetDrop,
      priority: priorityPass
    });
  };

  const handleDateSelect = (dateStr: string) => {
    setUserData(prev => ({ ...prev, preferredDate: dateStr }));
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800">
      {/* Top Banner & Header */}
      <div className="relative h-96 w-full bg-slate-900 overflow-hidden">
        <img 
          src={service.image} 
          alt={service.title} 
          className="w-full h-full object-cover opacity-75"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-900/40 to-black/60"></div>
        
        {/* Navigation Action */}
        <div className="absolute top-6 left-6 z-10">
          <button 
            onClick={onBack}
            className="bg-white/90 hover:bg-white text-[#8B0000] border border-slate-200/80 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-98"
          >
            <ArrowLeft className="w-4 h-4 text-[#8B0000] stroke-[2.5]" />
            <span>Back to Network</span>
          </button>
        </div>

        {/* Header context info */}
        <div className="absolute bottom-10 left-6 right-6 max-w-[1240px] mx-auto text-left">
          <span className="bg-[#8B0000] text-white text-[10px] font-black px-3.5 py-1.5 rounded-full uppercase tracking-widest inline-block mb-3 shadow-md">
            {service.badge}
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-[#8B0000] md:text-white tracking-tight drop-shadow-sm font-display">
            {service.title}
          </h1>
          <p className="text-slate-700 md:text-slate-200 text-sm md:text-base max-w-2xl mt-2 leading-relaxed font-normal">
            {service.description}
          </p>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-[1240px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Extensive Info & Specs */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-200/80 shadow-xs text-left space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-bold text-[#8B0000] uppercase tracking-wider font-mono">
                  Sourcing Specifications
                </h2>
                <div className="h-1 w-12 bg-[#8B0000] rounded"></div>
              </div>
              
              <p className="text-slate-650 text-sm leading-relaxed font-normal">
                {service.longDescription}
              </p>

              {/* Stats Block */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-b border-slate-100">
                <div className="space-y-1">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Service Rate</span>
                  <span className="text-xl font-extrabold text-slate-950 font-mono">From ${service.startingPrice}</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Active Terminals</span>
                  <span className="text-sm font-extrabold text-slate-900">{service.facilities}</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Standard Cycle</span>
                  <span className="text-sm font-extrabold text-slate-700">{service.avgTurnaround}</span>
                </div>
              </div>

              {/* Service Features checklist */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-450 uppercase tracking-wider font-mono">
                  Guaranteed Standards Included
                </h3>
                <div className="grid grid-cols-1 gap-3 text-xs text-slate-650">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="bg-emerald-50 text-emerald-600 p-1 rounded-full border border-emerald-100 shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="font-semibold leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* System safety warning instructions */}
              <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="text-[11px] font-black uppercase tracking-wider font-mono">Authorization Notice</span>
                </div>
                <ul className="list-disc list-inside text-[11px] text-amber-700 space-y-1 pl-1">
                  {service.requirements.map((req, idx) => (
                    <li key={idx} className="font-semibold leading-relaxed">{req}</li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Micro Interaction: Service FAQ accordion */}
            <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-200/80 shadow-xs text-left space-y-4">
              <h3 className="text-sm font-bold text-[#8B0000] uppercase tracking-wider pl-0.5 font-mono">
                Frequently Asked Sourcing Inquiries
              </h3>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-3">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-[#8B0000] shrink-0" />
                    How are provider terminals verified?
                  </h4>
                  <p className="text-slate-500 pl-5 leading-relaxed font-normal">
                    Each provider terminal undergoes routine dual ISO audits, credential inspections, and tools inspection to maintain platform alignment and full compliance protocols.
                  </p>
                </div>
                <div className="py-3">
                  <h4 className="font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-[#8B0000] shrink-0" />
                    Can I reschedule the acquisition slot?
                  </h4>
                  <p className="text-slate-500 pl-5 leading-relaxed font-normal">
                    Yes. Any booked services can be easily modified or rescheduled without fees up to 24 hours prior to the slot time.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Acquire & Booking Area */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Interactive Price Calculator Dashboard */}
            <div className="bg-gradient-to-br from-[#8B0000] to-slate-900 text-white rounded-[32px] p-6 shadow-xl text-left space-y-6 border border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#8B0000]/10 rounded-full blur-3xl"></div>
              
              <div className="space-y-1">
                <span className="text-[9px] bg-[#8B0000]/20 text-red-200 border border-[#8B0000]/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest font-mono">
                  LIVE INTERACTIVE APPRAISAL
                </span>
                <h3 className="text-lg font-bold tracking-tight">Acquisition Cost Estimator</h3>
              </div>

              {/* Interactive Controls */}
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block font-mono">
                    Select Vehicle Segment
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'standard', label: 'Standard' },
                      { key: 'luxury', label: 'Premium' },
                      { key: 'exotic', label: 'Exotic/Race' }
                    ].map((seg) => (
                      <button
                        key={seg.key}
                        type="button"
                        onClick={() => setCarClass(seg.key as any)}
                        className={`py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer text-center block ${
                          carClass === seg.key 
                            ? 'bg-[#8B0000] border-[#8B0000] text-white shadow-md' 
                            : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {seg.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Additional parameters toggles */}
                <div className="space-y-2.5 pt-2 border-t border-white/10">
                  <label className="text-[9px] font-bold text-slate-300 uppercase tracking-wider block font-mono">
                    Options &amp; Upgrades
                  </label>
                  
                  {/* Valet Pick-up */}
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="text-xs">
                      <span className="block font-bold">VIP Valet Pick-Up &amp; Delivery</span>
                      <span className="text-[10px] text-slate-450">Secure carrier transfer (+ $75)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIncludeValetDrop(!includeValetDrop)}
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-all cursor-pointer ${
                        includeValetDrop ? 'bg-[#8B0000] justify-end' : 'bg-white/20 justify-start'
                      }`}
                    >
                      <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    </button>
                  </div>

                  {/* Priority Terminal Queue SLOT */}
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="text-xs">
                      <span className="block font-bold">Express Queue Pass</span>
                      <span className="text-[10px] text-slate-450">Direct terminal dispatch entry (+ $120)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPriorityPass(!priorityPass)}
                      className={`w-10 h-6 flex items-center rounded-full p-1 transition-all cursor-pointer ${
                        priorityPass ? 'bg-[#8B0000] justify-end' : 'bg-white/20 justify-start'
                      }`}
                    >
                      <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Output Result Tag */}
              <div className="pt-4 border-t border-white/10 flex items-end justify-between">
                <div>
                  <span className="block text-[8px] font-bold text-slate-400 tracking-wider">TOTAL ESTIMATED PRICE</span>
                  <span className="text-2xl md:text-3xl font-black font-mono tracking-tight text-white">
                    ${calculateEstimatedPrice().toLocaleString()}
                  </span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono">Includes local taxes</span>
              </div>
            </div>

            {/* Step-by-Step Acquisition Form */}
            <div className="bg-white rounded-[32px] border border-slate-200/80 shadow-md overflow-hidden text-left">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#8B0000]" />
                  <span className="text-xs font-bold uppercase tracking-wider font-mono text-[#8B0000]">
                    Acquisition Dispatch Desk
                  </span>
                </div>
                
                {/* Step indicator */}
                <div className="flex items-center gap-1.5 text-[9px] font-bold font-mono">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center ${bookingStep >= 1 ? 'bg-[#8B0000] text-white' : 'bg-slate-200 text-slate-500'}`}>1</span>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center ${bookingStep >= 2 ? 'bg-[#8B0000] text-white' : 'bg-slate-200 text-slate-500'}`}>2</span>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center ${bookingStep >= 3 ? 'bg-[#8B0000] text-white' : 'bg-slate-200 text-slate-500'}`}>3</span>
                </div>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {bookingStep === 1 && (
                    <motion.div 
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 font-mono">
                        Step 1: Vehicle &amp; Requirements Profile
                      </h4>
                      
                      <div className="space-y-3.5">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase pl-0.5">Vehicle Make, Model &amp; Year</label>
                          <input 
                            required
                            type="text"
                            placeholder="e.g. 2021 Porsche 911"
                            className="w-full h-11 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white rounded-xl px-3.5 text-xs outline-none font-semibold text-slate-800 transition-colors"
                            value={userData.carMakeModel}
                            onChange={(e) => setUserData({...userData, carMakeModel: e.target.value})}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase pl-0.5">Vehicle VIN (Optional)</label>
                          <input 
                            type="text"
                            placeholder="17-Digit Vehicle Identification Number"
                            className="w-full h-11 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white rounded-xl px-3.5 text-xs font-mono outline-none text-slate-800 transition-colors"
                            value={userData.vin}
                            onChange={(e) => setUserData({...userData, vin: e.target.value.toUpperCase()})}
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase pl-0.5">Specific Instructions / Demands</label>
                          <textarea 
                            rows={3}
                            placeholder="Detail any specialized paint codes, mechanical symptoms, or wrapping desires..."
                            className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white rounded-xl p-3.5 text-xs outline-none text-slate-800 transition-colors resize-none"
                            value={userData.notes}
                            onChange={(e) => setUserData({...userData, notes: e.target.value})}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!userData.carMakeModel.trim()) {
                            alert('Please fill out your car model information to register the dispatch dossier.');
                            return;
                          }
                          setBookingStep(2);
                        }}
                        className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>Select Schedule Slot</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  )}

                  {bookingStep === 2 && (
                    <motion.div 
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 font-mono">
                        Step 2: Reserve Terminal Date &amp; Time
                      </h4>

                      {/* Six day select track */}
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-slate-400 uppercase block pl-0.5">
                          Available Dispatch Calendar
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {dateSlots.map((d, index) => {
                            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                            const value = d.toLocaleDateString();
                            const isSelected = userData.preferredDate === value;

                            return (
                              <button
                                key={index}
                                type="button"
                                onClick={() => handleDateSelect(value)}
                                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer block ${
                                  isSelected 
                                    ? 'bg-[#8B0000] border-[#8B0000] text-white shadow-sm' 
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-350'
                                }`}
                              >
                                <span className="block text-[8px] uppercase font-bold text-slate-400 group-hover:text-slate-200">{dayName}</span>
                                <span className="block text-xs font-bold mt-0.5">{dateStr}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Time slot select track */}
                      <div className="space-y-2 pt-2">
                        <label className="text-[9px] font-bold text-slate-400 uppercase block pl-0.5">
                          Available Time Interval
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {timeSlots.map((t) => {
                            const isSelected = userData.preferredTime === t;
                            return (
                              <button
                                key={t}
                                type="button"
                                onClick={() => setUserData({...userData, preferredTime: t})}
                                className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                                  isSelected 
                                    ? 'bg-[#8B0000] border-[#8B0000] text-white shadow-sm' 
                                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-350'
                                }`}
                              >
                                {t}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Back and Forward navigation controls */}
                      <div className="grid grid-cols-2 gap-3 pt-3">
                        <button
                          type="button"
                          onClick={() => setBookingStep(1)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl uppercase tracking-wider cursor-pointer transition-colors text-center"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (!userData.preferredDate) {
                              alert('Please select a preferred date for dispatching your vehicle.');
                              return;
                            }
                            setBookingStep(3);
                          }}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>Confirm Client Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {bookingStep === 3 && (
                    <motion.div 
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 font-mono">
                        Step 3: Secure Owner Authorization Details
                      </h4>

                      <form onSubmit={handleSubmitBooking} className="space-y-3.5">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase pl-0.5">Owner Full Name</label>
                          <input 
                            required
                            type="text"
                            placeholder="Your Name"
                            className="w-full h-11 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white rounded-xl px-3.5 text-xs outline-none text-slate-850 font-semibold"
                            value={userData.name}
                            onChange={(e) => setUserData({...userData, name: e.target.value})}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase pl-0.5">Email Address</label>
                            <input 
                              required
                              type="email"
                              placeholder="name@domain.com"
                              className="w-full h-11 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white rounded-xl px-3 text-xs outline-none text-slate-850 font-semibold"
                              value={userData.email}
                              onChange={(e) => setUserData({...userData, email: e.target.value})}
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-slate-400 uppercase pl-0.5">Telephone Number</label>
                            <input 
                              required
                              type="tel"
                              placeholder="+1 (555) 000-0000"
                              className="w-full h-11 bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white rounded-xl px-3 text-xs outline-none text-slate-850 font-semibold"
                              value={userData.phone}
                              onChange={(e) => setUserData({...userData, phone: e.target.value})}
                            />
                          </div>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                          <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>ISO 27001 Secure Registration Framework applied.</span>
                        </div>

                        {/* Back and Submit */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setBookingStep(2)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl uppercase tracking-wider cursor-pointer transition-colors text-center"
                          >
                            Back
                          </button>
                          <button
                            type="submit"
                            className="bg-[#8B0000] hover:bg-[#b00d0d] text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-md"
                          >
                            <span>Lock Service</span>
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {bookingStep === 4 && (
                    <motion.div 
                      key="step4"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-6 text-center space-y-4"
                    >
                      <div className="w-12 h-12 bg-emerald-50 rounded-full border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
                        <Check className="w-6 h-6 stroke-[3]" />
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-slate-900 font-bold text-base">Service Sourcing Confirmed!</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed max-w-sm mx-auto">
                          Excellent decision. Your service booking file has been registered. Our security dispatch is routing matching vehicle telemetry details to the closest local service terminal.
                        </p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left space-y-2 text-xs font-mono">
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-[10px]">Registry Code</span>
                          <span className="font-bold text-[#8B0000]">S-{Math.floor(100000 + Math.random() * 900000)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-[10px]">Service Segment</span>
                          <span className="font-bold capitalize text-slate-700">{carClass} Chassis</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 text-[10px]">Confirmed Date/Time</span>
                          <span className="font-bold text-slate-700">{userData.preferredDate || new Date().toLocaleDateString()} at {userData.preferredTime}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-slate-200">
                          <span className="text-slate-400 text-[10px]">Authorized Cost</span>
                          <span className="font-bold text-[#8B0000]">${calculateEstimatedPrice()}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={onBack}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl uppercase tracking-wider cursor-pointer"
                      >
                        Acknowledge and Exit
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* Direct Dial assistance */}
            <div className="bg-red-50/50 p-5 rounded-[24px] border border-red-100/50 flex items-center gap-3 text-left">
              <div className="bg-[#8B0000] text-white p-2.5 rounded-full shadow-sm shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className="block font-bold text-slate-800">Need Immediate Sourcing Help?</span>
                <span className="block text-slate-500 text-[10px] mt-0.5 leading-relaxed font-normal">
                  Give our logistics desk coordinates a quick call at <strong>1-800-555-CARS</strong> to speak with our compliance dispatch leads directly.
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

interface LocalProviderDetailsProps {
  provider: any;
  onBack: () => void;
  onConfirmAcquisition: (details: any) => void;
}

function LocalProviderDetails({ provider, onBack, onConfirmAcquisition }: LocalProviderDetailsProps) {
  const [hours, setHours] = useState<number>(2);
  const [bookingStep, setBookingStep] = useState<1 | 2>(1);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '10:00 AM',
    notes: ''
  });

  const getBioAndFeatures = (category: string, name: string) => {
    const defaultData = {
      bio: "A highly trusted certified partner of our ISO audit network, providing on-time specialized service delivery utilizing approved tools and high safety compliance ratios.",
      features: [
        "Approved network tooling and safety compliance check",
        "Licensed professional operator background checked",
        "Service tracking and support escalation layer",
        "Transparent fixed hourly pricing guidelines"
      ],
      requirements: [
        "Adult supervisor must be present on site during active contract",
        "Disclose existing physical structural defects or hazard sources beforehand"
      ]
    };

    const cat = category.toLowerCase();
    if (cat.includes('plumb')) {
      return {
        bio: `With over 12 years of hands-on diagnostics and sanitary expertise in high-rise residential properties, ${name} has resolved thousands of complex leakages, commercial plumbing architectures, and water-heater configurations.`,
        features: [
          "Full thermal leak detection scanner examination",
          "Copper & PPR-C high-pressure piping replacement",
          "Clogged-drain mechanical auger clearing",
          "24/7 Priority emergency dispatch",
          "1-Year non-leak warranty guarantee"
        ],
        requirements: [
          "Main inlet valve location must be accessible during repair",
          "Identify if work is on a joint municipal connection line"
        ]
      };
    } else if (cat.includes('electr')) {
      return {
        bio: `${name} is an expert structural engineering technician and master electrician. Specializing in central smart-control panel installations, complete structural rewiring, load-balancing diagnostics, and three-phase industrial safety alignments.`,
        features: [
          "Full digital thermal overload signature check",
          "Three-phase smart load balancer tuning",
          "Premium heavy-duty copper circuit breakers",
          "Dual-insulation safety testing compliance",
          "Clean certification safe-stamp report card"
        ],
        requirements: [
          "Main power breaker must be shut off for parts of diagnostics",
          "All prior DIY wiring amendments must be disclosed"
        ]
      };
    } else if (cat.includes('doct')) {
      return {
        bio: `A premier consultant physician with a distinguished clinical history, ${name} delivers tailored family treatment, specialized chronic diagnostic assessments, pediatric consultations, and personalized treatment plans in the comfort of your home.`,
        features: [
          "Full bedside diagnostic vital inspections",
          "Specialist cardiac pulse-rate and oxygen telemetry",
          "Electronic prescriptions routed instantly to network pharmacies",
          "Personalized lifestyle metabolic advising session",
          "Complete follow-up consultation support"
        ],
        requirements: [
          "Recent lab report sheets should be kept ready",
          "Disclose active medical regimens or prior allergic records"
        ]
      };
    } else if (cat.includes('teach')) {
      return {
        bio: `An esteemed academic with multiple research clearances and coaching awards, ${name} has prepared students for over a decade for advanced JEE, SAT, MCAT Math and physics boards with structured individual feedback loop exercises.`,
        features: [
          "Bespoke concept-clarification worksheets",
          "Interactive micro-testing simulator drills",
          "Real-time step-by-step digital board feedback",
          "Standard syllabus diagnostic performance evaluation",
          "Complementary question hot-line access"
        ],
        requirements: [
          "Copy of recent academic syllabus is recommended",
          "Quiet, distraction-free studying setup during the hour"
        ]
      };
    } else if (cat.includes('paint')) {
      return {
        bio: `${name} has served clean residential and premium structures for close to a decade, specializing in weather-resistant exterior coatings, designer internal paints, and advanced multi-membrane chemical waterproofing procedures.`,
        features: [
          "Industrial strength moisture scan diagnostic",
          "Triple-coat weather-protection membrane seal",
          "Sanding, wall-putty leveling & primer included",
          "Dustless orbital sanding tools utilized",
          "3-Year guarantee against moisture scaling"
        ],
        requirements: [
          "Furniture must be shifted 3 feet away from walls",
          "Proper ventilation during the initial coating curing stage"
        ]
      };
    } else if (cat.includes('mov') || cat.includes('logist')) {
      return {
        bio: `${name}'s logistics fleet is synonymous with reliability. Outfitted with heavy-duty box-trucks and a meticulously trained packing crew, he ensures heavy-furniture shifting, high-precision electronics boxing, and damage-free relocations.`,
        features: [
          "Premium bubble-wrap, wooden-crate & corrugated box packaging",
          "Padded furniture moving blankets & utility-straps",
          "Hydraulic tail-gate loader truck shipping",
          "Live GPS tracking during cargo shipping",
          "Complete transit-damage protection indemnity guarantee"
        ],
        requirements: [
          "Designate separate parking bay for heavy cargo vehicle",
          "Label fragile items prior to packing team's arrival"
        ]
      };
    } else if (cat.includes('pest')) {
      return {
        bio: `${name} leads with eco-sensitive science. Implementing state-of-the-art biological pest shielding, specialized thermal termite tracking, and organic vector eradication procedures that are safe for pets and children.`,
        features: [
          "Scentless non-toxic eco-pesticide vapor treatment",
          "Thermal-imaging termite nest scanner search",
          "Dual-barrier surface residual barrier coating",
          "Targeted cockpit injection spraying",
          "Complementary 6-month inspection checkup"
        ],
        requirements: [
          "Vacate home space for 2 hours post vapor application",
          "Wipe down open food surfaces prior to procedure commencement"
        ]
      };
    } else if (cat.includes('gard') || cat.includes('landsc')) {
      return {
        bio: `${name} turns outdoor spaces into picturesque masterpieces. Focused on premium turf cultivation, automated smart irrigation set-up, pruning of mature plants, and tailored organic nutrient programs.`,
        features: [
          "Surgical pruning of mature tree canopies",
          "Premium low-water automated drip irrigation setup",
          "Premium slow-release organic fertilizer soil dressing",
          "Rotary soil aeration and weed removal",
          "Custom structural soil pH test diagnostics"
        ],
        requirements: [
          "Active hose connection point must be available in premises",
          "Identify placement of underground sewer or electrical conduits"
        ]
      };
    } else if (cat.includes('security') || cat.includes('cctv')) {
      return {
        bio: `Led by ${name}, this specialists agency designs and rigs ultra-modern home safety defense networks, professional CCTV positioning, smart biometric locks, motion-sensor triggers, and private security systems.`,
        features: [
          "Ultra-HD night vision IP cameras and POE rigs",
          "Local RAID-mirror secure disk recording stack setup",
          "Smart remote phone live-view software installation",
          "Intruder radar-sensor configuration",
          "Comprehensive 12-month hardware warranty"
        ],
        requirements: [
          "High-speed active Wi-Fi connection with router password",
          "Provide clear ladder access to ceiling or wall heights"
        ]
      };
    } else if (cat.includes('legal') || cat.includes('doc')) {
      return {
        bio: `${name} is an exceptionally qualified advisory attorney and notary advisor, specializing in family deeds, land transfer audit documents, corporate incorporation filings, and certified agreement notarizations.`,
        features: [
          "Comprehensive drafting and clause reviews",
          "Instant certified stamp-duty notary seal validation",
          "Local registrar record search verification",
          "Advanced regulatory compliance risk checks",
          "Confidential digitized legal digital storage backup"
        ],
        requirements: [
          "Valid state government ID (CNIC) must be presented",
          "All co-signatories must be in physical attendance"
        ]
      };
    } else if (cat.includes('cater') || cat.includes('chef')) {
      return {
        bio: `Celebrate in taste with ${name}'s gourmet catering services. Renowned for rich traditional Mughlai specialty dishes, designer dessert tables, and luxury buffet layouts with custom portion-controls.`,
        features: [
          "Tailored culinary ingredient procurement from approved markets",
          "High-heat live wood charcoal grilling set",
          "Premium porcelain food display platters",
          "Professional uniform-clad servers",
          "Complete kitchen cleanup and trash extraction"
        ],
        requirements: [
          "Specify allergy details at least 48 hours prior",
          "Secure stable space with access to continuous tap water"
        ]
      };
    } else if (cat.includes('pet') || cat.includes('vet')) {
      return {
        bio: `${name} provides premier general family veterinary medicine and diagnostic examinations, specializing in vaccinations, behavioral advice, gentle de-worming treatments, and medical trimming for cats and dogs.`,
        features: [
          "Extensive general health diagnostic examination",
          "Surgical-grade nail trimming and ear sanitization",
          "Comprehensive vaccine certificate paperwork",
          "Clinical diet and metabolic health guidelines",
          "Instant prescription medication dispatch list"
        ],
        requirements: [
          "Comfortable isolated study table or counter for exam",
          "Aggressive pets must be muzzled for team health safety"
        ]
      };
    } else if (cat.includes('photograph') || cat.includes('media')) {
      return {
        bio: `${name} captures priceless life chapters with cinematic clarity, operating modern full-frame Mirrorless systems and high-stability stabilization rigs to catalog corporate seminars and celebratory family occasions.`,
        features: [
          "Cinematic high-bitrate video footage capture",
          "Precision aerial drone capture (FAA/local space permitting)",
          "Color-graded high-resolution photography",
          "Secure shared cloud storage download link",
          "Rapid 7-day post-production preview link"
        ],
        requirements: [
          "Provide complete agenda schedule at least 24 hours prior",
          "Provide standard crew meal allocation for shoots over 5 hours"
        ]
      };
    } else if (cat.includes('mason') || cat.includes('tile')) {
      return {
        bio: `${name} is an experienced second-generation master mason. Specializing in exquisite Italian marble layups, structural reinforcement, granite counter polishing, and complex brick interlocking architectures with outstanding durability.`,
        features: [
          "High-precision wet saw tile laser alignment",
          "Diamond-pad marble floor polisher and gloss wax",
          "High-density moisture-resistant grout seals",
          "Anti-crack mortar compound mix preparation",
          "Complete clean-up of rubble and scrap sand"
        ],
        requirements: [
          "Active raw water utility supply near masonry workstation",
          "Disclose any hidden sub-floor under-floor heating cables"
        ]
      };
    } else if (cat.includes('hvac')) {
      return {
        bio: `${name} is an elite HVAC certified expert, specialize in multi-stage heating setups, active climatic adjustments, central duct restorations, and smart thermostat syncs.`,
        features: [
          "Evaporator coil deep chemical sanitization",
          "Compressor dynamic pressure diagnostics check",
          "R410a ecological refrigerant top-off supply",
          "Smart home digital climate gateway recalibration",
          "Full 6-month system performance warrantee wrap"
        ],
        requirements: [
          "Clear workspace radius around external compressor unit",
          "Must provide power access next to diagnostic module"
        ]
      };
    } else if (cat.includes('barber')) {
      return {
        bio: `${name} is a highly accomplished hair designer and style artist, specializing in precision hair sculpting, structural beard alignments, organic facial therapies, and modern grooming packages.`,
        features: [
          "Precision scissor hair contouring consultation",
          "Hot-towel steam straight razor outline trim",
          "Hydrating charcoal facial treatment therapy",
          "Organic scalp tonic hydration massage",
          "Full custom styling product application advice"
        ],
        requirements: [
          "Access to running water is needed",
          "Prior dye allergy histories should be communicated"
        ]
      };
    } else if (cat.includes('painter') || cat.includes('auto-painters')) {
      return {
        bio: `${name} is an elite automotive refinishing artist, specializing in factory-spec baked oven baking, scratch fills, localized blending, and high-solids clear coats with premium luster.`,
        features: [
          "State-of-the-art climate-controlled baking oven booth treatment",
          "Computerized paint matching for perfect color compliance",
          "Premium German Dupont basecoat layers",
          "Localized spot repair with seamless blending lines",
          "Lifetime clearcoat peeling warranty certificate"
        ],
        requirements: [
          "Vehicle must be washed clean of surface dirt before arrival",
          "OEM factory color codes should be kept ready"
        ]
      };
    } else if (cat.includes('mechanic') || cat.includes('tuning')) {
      return {
        bio: `${name} is a master powertrain technician and diagnostic wizard, specializing in modern OBD2 telemetry analysis, direct-injection cleanings, and complete drivetrain restorations.`,
        features: [
          "Multi-point electrical sensor trace and cylinder health scan",
          "Direct-injection valve walnut-blasting setup",
          "OEM-spec synthetic lubricant replacements",
          "Advanced transmission control module recalibrations",
          "Detailed vehicle engine telemetry report checklist"
        ],
        requirements: [
          "Provide service manual files or historic repair invoices",
          "Disclose list of active fault lights or diagnostic error codes"
        ]
      };
    } else if (cat.includes('tire')) {
      return {
        bio: `${name} is a high-volume tire distributor and computerized service hub, providing digital alignment, tread depth safety checks, and high-speed dynamic balancing.`,
        features: [
          "Precision multi-link laser alignment tune-up",
          "Dual-plane computerized wheel load-force balance sweep",
          "Premium tubeless valves & nitrogen fills",
          "Sub-millimeter accurate tread wear assessment",
          "Comprehensive tire puncture security check"
        ],
        requirements: [
          "Disclose details of tyre pressure monitoring system (TPMS) setup",
          "Ensure secure locknuts socket keys are placed inside vehicle"
        ]
      };
    } else if (cat.includes('detail')) {
      return {
        bio: `${name} is a premier aesthetics center, delivering world-class nano-ceramic coatings, multi-stage paint restoration, deep steam-clean fabric treatments, and total leather nourishment.`,
        features: [
          "Three-stage rotary paint correction and scratch levelling",
          "9H Hardness hydrophobic dual-layer ceramic shield",
          "High-temp interior upholstery bacterial steam cleaning",
          "Acid-free deep engine bay detailed degreasing",
          "Ozone odor eradication treatment cycle"
        ],
        requirements: [
          "Entire interior belongings must be cleared out beforehand",
          "Ensure power source and water hookups are accessible on-site"
        ]
      };
    } else if (cat.includes('wrap')) {
      return {
        bio: `${name} is an expert vinyl design center, providing complete vehicle color-change wraps, clear paint protection film (PPF) applications, and custom fleet advertising decals.`,
        features: [
          "Premium cast wrapping materials (3M, Avery Dennison)",
          "Dustless squeegee prep and edge trimming",
          "Anti-microbial surface prep with isopropyl cleaning",
          "UV-resistant laminated commercial advertisement prints",
          "3-Year peel-free bubble-resistant warranty coverage"
        ],
        requirements: [
          "Advise if aftermarket paint or clear-bra is present",
          "A vector logo file must be provided for advertisement designs"
        ]
      };
    } else if (cat.includes('rust')) {
      return {
        bio: `${name} is a highly specialized underbody preservation mechanic, offering anti-corrosive treatments, frame sound-deadening, and salt-protective sealants.`,
        features: [
          "Pressure undercarriage degreasing and rust scraping",
          "High-temperature self-healing bitumen barrier coat",
          "Chassis cavity wax coating injection search",
          "Sub-frame safety rust diagnostic check",
          "5-Year underbody rot prevention warranty badge"
        ],
        requirements: [
          "Undercarriage must be reasonably dry for coat bonding",
          "Identify and mark custom lift points if necessary"
        ]
      };
    } else if (cat.includes('metal') || cat.includes('fabri')) {
      return {
        bio: `${name} is a state-licensed industrial metal fabricator and MIG/TIG welding specialist, offering roll cage fabrication, exhaust custom welds, and floor pan restorations.`,
        features: [
          "Precision TIG welded structural reinforcement lines",
          "Chassis panel alignment and patch-weld replacements",
          "Custom exhaust manifold and dump-pipe fittings",
          "Laser-measured structural mountings design",
          "High-tensile stress-testing certification report"
        ],
        requirements: [
          "Ensure all electrical accessories are disconnected before welding",
          "Provide physical schematic drawings for heavy custom projects"
        ]
      };
    } else if (cat.includes('glass')) {
      return {
        bio: `${name} is a rapid glass service provider, offering double-glazed windscreen replacements, front windshield repairs, and ADAS camera safety recalibrations.`,
        features: [
          "OEM-equivalent high-impact safety glass standard fitments",
          "Fast-cure polyurethane adhesive structural bond",
          "Front dynamic camera calibration suite verification",
          "Professional window tinting with custom ceramic layers",
          "Lifetime leakage/wind-noise guarantee pledge"
        ],
        requirements: [
          "Avoid washing the vehicle for 48 hours post-bond assembly",
          "Provide accurate VIN or trim level for camera configurations"
        ]
      };
    } else if (cat.includes('specialized') || cat.includes('workshop')) {
      return {
        bio: `${name} is a high-performance specialist garage, offering dynamic dyno testing, forced induction setups, custom track alignments, and electronic control unit (ECU) maps.`,
        features: [
          "All-wheel drive dynamic performance chassis dyno tune",
          "Motorsport-grade engine control unit mapping setups",
          "Suspension coilover corner-weighting balance sweep",
          "Track-day safety audit check sheet validation",
          "Real-time sensor trace profiling"
        ],
        requirements: [
          "Ensure fuel tank contains minimum half tank of correct octane",
          "Disclose full engine configuration blueprint spec list"
        ]
      };
    }
    return defaultData;
  };

  const details = getBioAndFeatures(provider.category, provider.name);
  const totalCost = provider.rate * hours;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingStep(2);
    onConfirmAcquisition({
      serviceId: provider.id,
      title: `${provider.name} (${provider.category})`,
      price: totalCost,
      date: userData.date || new Date(Date.now() + 86400000).toLocaleDateString(),
      time: userData.time,
      priority: true,
      valet: false,
      carClass: 'standard'
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans pb-16">
      {/* Dynamic Profile Header */}
      <div className="relative h-80 w-full bg-[#8B0000] overflow-hidden">
        <div className="absolute inset-x-0 inset-y-0 opacity-20 bg-gradient-to-r from-red-900 to-[#8B0000]"></div>
        
        {/* Navigation Action */}
        <div className="absolute top-6 left-6 z-10">
          <button 
            type="button"
            onClick={onBack}
            className="bg-white hover:bg-slate-100 text-[#8B0000] border border-slate-200 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 text-[#800000] stroke-[2.5]" />
            <span>Back to Directory</span>
          </button>
        </div>

        {/* Backdrop visual elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#800000]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute bottom-10 left-6 right-6 max-w-[1240px] mx-auto flex flex-col md:flex-row gap-6 items-start md:items-center text-left">
          <div className="relative shrink-0">
            <img 
              src={provider.image} 
              alt={provider.name} 
              className="w-24 h-24 rounded-full object-cover border-4 border-white/90 shadow-lg"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-0 right-0 bg-emerald-505 bg-emerald-500 border-2 border-white text-white p-1 rounded-full shadow-md">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#800000] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                {provider.category}
              </span>
              <div className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-500/20 text-amber-300 rounded-full text-[10px] font-bold">
                <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                <span>{provider.rating} Rating</span>
              </div>
              <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                {provider.jobs}+ Jobs Completed
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
              {provider.name}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm font-semibold max-w-xl">
              {provider.specialty} — Based in <span className="text-white font-bold">{provider.location}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Sourcing Panel Layout */}
      <div className="max-w-[1240px] mx-auto px-4 py-12 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main profile write-up */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-200/90 shadow-xs space-y-6">
              <div className="space-y-1.5 border-b border-slate-105 border-slate-100 pb-4">
                <h2 className="text-base font-black text-[#8B0000] uppercase tracking-wider font-mono">
                  Expert Sourcing Profile
                </h2>
                <p className="text-xs text-slate-400 font-semibold uppercase font-mono tracking-widest">Verifications Pass ID: VER-{(provider.id).toUpperCase()}</p>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed font-normal">
                {details.bio}
              </p>

              {/* Verified Features */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono">
                  Certified Standards & Specialties
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {details.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <div className="mt-0.5 bg-emerald-50 text-emerald-600 p-0.5 rounded-full border border-emerald-110 border-emerald-100">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <span className="font-semibold leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Service Constraints */}
              <div className="bg-rose-50/20 border border-slate-100 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-[#800000]">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-black uppercase tracking-wider font-mono">Customer Notice & Requirements</span>
                </div>
                <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1 pl-1">
                  {details.requirements.map((req, idx) => (
                    <li key={idx} className="font-semibold leading-relaxed">{req}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Quality Standards Audit */}
            <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-2 rounded-2xl">
                  <ShieldCheck className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h4 className="font-bold text-[#8B0000] text-sm tracking-tight">Active Platform Assurance Guard</h4>
                  <p className="text-[11px] text-slate-400 font-semibold leading-none mt-0.5 font-mono">ISO 9001:2015 AUDITED PROFESSIONAL</p>
                </div>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed font-normal">
                This operator matches premium national compliance audits. Hourly shifts are covered by active platform damage mitigation terms, guaranteed background checks, and state certification registries.
              </p>
            </div>
          </div>

          {/* Sourcing Action Panel */}
          <div className="lg:col-span-5 space-y-6">
            <AnimatePresence mode="wait">
              {bookingStep === 1 ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 shadow-md space-y-6"
                >
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-[#8B0000] font-mono uppercase tracking-wider">
                      Book Dispatch Session
                    </h3>
                    <p className="text-xs text-slate-400 font-semibold">Pre-set dynamic hourly rate for this expert.</p>
                  </div>

                  {/* Pricing Simulator */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-500 uppercase tracking-wider font-mono text-[10px]">Hourly Rate</span>
                      <span className="font-black text-slate-900 font-mono">Rs. {provider.rate.toLocaleString()}/hour</span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <label className="font-mono text-[10.5px] uppercase tracking-wider">Shift Duration (Hours)</label>
                        <span className="text-rose-750 text-rose-800 font-mono text-sm">{hours} Hours</span>
                      </div>
                      <input 
                        type="range"
                        min="1"
                        max="24"
                        value={hours}
                        onChange={(e) => setHours(Number(e.target.value))}
                        className="w-full accent-[#800000] cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase font-mono">
                        <span>1 Hr</span>
                        <span>8 Hr (Full Shift)</span>
                        <span>24 Hr (Max)</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-150 pt-3 flex justify-between items-center">
                      <span className="font-black text-slate-800 font-mono text-[11px] uppercase tracking-widest text-slate-400">Estimated Total</span>
                      <span className="text-xl font-black text-[#800000] font-mono">Rs. {totalCost.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Form fields */}
                  <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div className="space-y-1">
                      <label className="block text-slate-500 font-bold uppercase tracking-wider font-mono text-[9px]">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={userData.name}
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                        placeholder="e.g. Zain Ahmed"
                        className="w-full p-2.5 bg-slate-50 border border-slate-205 border-slate-200 rounded-xl focus:bg-white focus:border-[#800000] outline-none font-semibold text-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-slate-500 font-bold uppercase tracking-wider font-mono text-[9px]">Contact Email</label>
                        <input 
                          type="email" 
                          required
                          value={userData.email}
                          onChange={(e) => setUserData({...userData, email: e.target.value})}
                          placeholder="zain@example.com"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#800000] outline-none font-semibold text-slate-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-slate-500 font-bold uppercase tracking-wider font-mono text-[9px]">Phone Number</label>
                        <input 
                          type="tel" 
                          required
                          value={userData.phone}
                          onChange={(e) => setUserData({...userData, phone: e.target.value})}
                          placeholder="e.g. 0300-1234567"
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#800000] outline-none font-semibold text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-slate-500 font-bold uppercase tracking-wider font-mono text-[9px]">Preferred Date</label>
                        <input 
                          type="date" 
                          required
                          value={userData.date}
                          onChange={(e) => setUserData({...userData, date: e.target.value})}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#800000] outline-none font-semibold text-slate-800"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-slate-500 font-bold uppercase tracking-wider font-mono text-[9px]">Start Hour</label>
                        <select
                          value={userData.time}
                          onChange={(e) => setUserData({...userData, time: e.target.value})}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#800000] outline-none font-semibold text-slate-800"
                        >
                          <option>08:00 AM</option>
                          <option>10:00 AM</option>
                          <option>12:00 PM</option>
                          <option>02:00 PM</option>
                          <option>04:00 PM</option>
                          <option>06:00 PM</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-slate-500 font-bold uppercase tracking-wider font-mono text-[9px]">Task Brief & Instructions</label>
                      <textarea 
                        rows={2}
                        value={userData.notes}
                        onChange={(e) => setUserData({...userData, notes: e.target.value})}
                        placeholder="Describe the problem, task, or specifications..."
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#800000] outline-none font-semibold text-slate-800 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#800000] hover:bg-[#6c0000] text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs shadow-md transition-all active:scale-[0.98] mt-2 cursor-pointer"
                    >
                      Authorize & Book Dispatch
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 shadow-xl text-center space-y-6"
                >
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-500 border border-emerald-110 border-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Check className="w-7 h-7 stroke-[3]" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-slate-900 font-mono uppercase tracking-tight">Booking Requested</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      We've successfully dispatched your dispatch shift request to <span className="font-extrabold text-[#021431]">{provider.name}</span>. They will confirm the scheduled session with you via phone shortly.
                    </p>
                  </div>

                  <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 text-xs space-y-2 text-left">
                    <div className="flex justify-between">
                      <span className="text-slate-450 font-semibold font-mono text-[9px]">Sourcing Shift:</span>
                      <span className="font-bold text-[#021431]">{hours} Hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-450 font-semibold font-mono text-[9px]">Session Date:</span>
                      <span className="font-bold text-[#021431]">{userData.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-450 font-semibold font-mono text-[9px]">Service Rate:</span>
                      <span className="font-bold text-[#021431]">Rs. {provider.rate.toLocaleString()}/hr</span>
                    </div>
                    <div className="border-t border-slate-150 pt-2 flex justify-between">
                      <span className="font-black text-[#021431] font-mono text-[10px]">TOTAL VALUE:</span>
                      <span className="font-black text-[#800000] font-mono text-sm">Rs. {totalCost.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onBack}
                    className="w-full bg-[#8B0000] hover:bg-neutral-900 text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs cursor-pointer transition-colors"
                  >
                    Return to Directory
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Search, MapPin, Calendar, Clock, AlertTriangle, AlertCircle, 
  CheckCircle2, Plus, ArrowRight, ShieldCheck, HelpCircle, Activity, 
  Send, Bot, BookOpen, ChevronRight, FileText, Share2, ClipboardList, 
  Info, Eye, Download, Wifi, RefreshCw, Star, Languages, X, Check,
  Sliders, PenTool, Sparkles, Filter, ChevronDown, CheckSquare
} from 'lucide-react';
import { VEHICLES } from '../data';
import { Vehicle } from '../types';

// Interfaces
export interface InspectionCenter {
  id: string;
  name: string;
  logo: string;
  brandColor: string;
  rating: number;
  votes: number;
  country: string;
  city: string;
  address: string;
  phone: string;
  languages: string[];
  certifications: string[];
  supportedVehicleTypes: ('Passenger Car' | 'Commercial Van' | 'Heavy Duty' | 'Motorcycle' | 'Trailer')[];
  inspectionCategories: ('Standard' | 'Import Conformity' | 'Emissions Test' | 'Commercial Fleet' | 'Motorcycle Safety')[];
  description: string;
}

export interface InspectionAppointment {
  id: string;
  centerName: string;
  vehicleName: string;
  vehicleVin: string;
  inspectionType: string;
  dateTime: string;
  timeSlot: string;
  status: 'Confirmed' | 'Completed' | 'Pending Payment';
  reminderSet: boolean;
}

export interface FailureItem {
  id: string;
  category: 'Brakes' | 'Emissions' | 'Suspension' | 'Lighting' | 'Chassis';
  severity: 'Major' | 'Dangerous' | 'Minor';
  description: string;
}

export interface InspectionFailureCase {
  id: string;
  vehicleName: string;
  vehicleVin: string;
  inspectionCenterName: string;
  date: string;
  failureImage: string;
  notes: string;
  isForwarded: boolean;
  forwardedWorkshop: string | null;
  forwardedDate?: string;
  issues: FailureItem[];
  emissionsData: {
    co: number; // Measured CO % (limit is typically 0.2% - 0.3%)
    hc: number; // Measured HC ppm (limit is ~100 ppm)
    lambda: number; // Lambda value (typically 0.97 - 1.03)
  };
}

export interface HistoricalRecord {
  id: string;
  date: string;
  centerName: string;
  vehicleName: string;
  vehicleVin: string;
  type: string;
  status: 'Pass' | 'Fail';
  emissionsReport: {
    coValue: number;
    coLimit: number;
    lambdaValue: number;
    status: 'Excellent' | 'Failed' | 'Marginal';
  };
  brakingForce: {
    frontBalance: number; // % disparity (limit 30%)
    rearBalance: number; // % disparity (limit 30%)
    status: 'Pass' | 'Fail';
  };
}

export default function InspectionCentersPlatform() {
  // Navigation Tabs:
  // 'directory': Filter & inspect profiles, schedule bookings
  // 'issues': Inspection failure files creation & workshop forwarding gateway
  // 'records': Historical logs, telemetry, emissions parameters
  // 'assistant': AI Technical Decoder & advisory preparation guides
  const [activeTab, setActiveTab] = useState<'directory' | 'issues' | 'records' | 'assistant'>('directory');

  // Directory Filter Parameters
  const [filterCountry, setFilterCountry] = useState<string>('All');
  const [filterCity, setFilterCity] = useState<string>('All');
  const [filterVehicleType, setFilterVehicleType] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Center State for profile drawer view
  const [selectedCenterId, setSelectedCenterId] = useState<string>('center-1');

  // Alert/Banner feedback
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Core Dynamic State: Appointments list
  const [appointments, setAppointments] = useState<InspectionAppointment[]>([
    {
      id: "APT-8821",
      centerName: "Sovereign Baltic Decra Center",
      vehicleName: "Porsche 911 Carrera S",
      vehicleVin: "WP0AB2A92MS299212",
      inspectionType: "Standard Safety Technical",
      dateTime: "2026-06-25",
      timeSlot: "11:30 AM - 12:00 PM",
      status: "Confirmed",
      reminderSet: true
    },
    {
      id: "APT-0451",
      centerName: "Sovereign Baltic Decra Center",
      vehicleName: "Audi RS6 Avant",
      vehicleVin: "WAUB8AF21MN05XXXX",
      inspectionType: "Emissions Special Assessment",
      dateTime: "2026-06-22",
      timeSlot: "09:00 AM - 09:30 AM",
      status: "Confirmed",
      reminderSet: false
    }
  ]);

  // Dynamic State: Failure cases list (to show/create failed inspection, attach layout, and forward)
  const [failureCases, setFailureCases] = useState<InspectionFailureCase[]>([
    {
      id: "FAIL-4029",
      vehicleName: "BMW M5 Competition",
      vehicleVin: "WBA53BJ0XPX881270",
      inspectionCenterName: "Sovereign Baltic Decra Center",
      date: "2026-06-12",
      failureImage: "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=80&w=600&auto=format&fit=crop",
      notes: "Severe deceleration disparity detected during high-load roller testing. Carbon levels exceed Baltic climate regulatory thresholds by 40%.",
      isForwarded: false,
      forwardedWorkshop: null,
      issues: [
        { id: "iss-1", category: "Brakes", severity: "Major", description: "Rear axle braking force disparity calculated at 34.5% exceeding the maximum permitted 30% balance." },
        { id: "iss-2", category: "Emissions", severity: "Major", description: "CO volume measured at 0.52% (Permitted limit is 0.20%). High carbon oxidation suspected." },
        { id: "iss-3", category: "Lighting", severity: "Minor", description: "Left headlamp lower low-beam output deflection angle tilted out of baseline specs." }
      ],
      emissionsData: {
        co: 0.52,
        hc: 145,
        lambda: 1.04
      }
    },
    {
      id: "FAIL-1120",
      vehicleName: "Tesla Model S Plaid",
      vehicleVin: "5YJSA1E21LFXXXXXX",
      inspectionCenterName: "TÜV SÜD Vilnius West",
      date: "2026-05-30",
      failureImage: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=600&auto=format&fit=crop",
      notes: "Zero thermal emissions compliance verified, but severe structural linkage tolerance issues pose hazardous handling vectors.",
      isForwarded: true,
      forwardedWorkshop: "Sovereign Baltic Engineering Studio",
      forwardedDate: "2026-05-31",
      issues: [
        { id: "iss-4", category: "Suspension", severity: "Dangerous", description: "Front lower ball-joint socket clearance exceeded safety margins (play > 2.5mm)." }
      ],
      emissionsData: {
        co: 0.0,
        hc: 0,
        lambda: 1.0
      }
    }
  ]);

  // Interactive Create failure case temporary inputs
  const [newFailVin, setNewFailVin] = useState('');
  const [newFailVehicleName, setNewFailVehicleName] = useState('BMW M5 Competition');
  const [newFailCenter, setNewFailCenter] = useState('Sovereign Baltic Decra Center');
  const [newFailNotes, setNewFailNotes] = useState('');
  const [newFailCO, setNewFailCO] = useState<number>(0.4);
  const [newFailHC, setNewFailHC] = useState<number>(120);
  const [newFailLambda, setNewFailLambda] = useState<number>(1.05);
  const [newFailCategory, setNewFailCategory] = useState<'Brakes' | 'Emissions' | 'Suspension' | 'Lighting' | 'Chassis'>('Brakes');
  const [newFailDesc, setNewFailDesc] = useState('');
  const [newFailSeverity, setNewFailSeverity] = useState<'Major' | 'Dangerous' | 'Minor'>('Major');
  const [tempIssueList, setTempIssueList] = useState<FailureItem[]>([
    { id: "item-1", category: "Brakes", severity: "Major", description: "Friction pad wear limits breached; metallic rotor scoring visible." }
  ]);

  // Appointment creation states
  const [newBookingCenterId, setNewBookingCenterId] = useState('center-1');
  const [newBookingVin, setNewBookingVin] = useState('');
  const [newBookingCategory, setNewBookingCategory] = useState('Standard');
  const [newBookingDate, setNewBookingDate] = useState('2026-06-25');
  const [newBookingTime, setNewBookingTime] = useState('11:00 AM - 11:30 AM');

  // Listen to deep-link events from tools to category advisors
  React.useEffect(() => {
    const handleDeepLink = (e: Event) => {
      const customEvent = e as CustomEvent<{
        tab?: 'directory' | 'issues' | 'records' | 'assistant';
        centerId?: string;
        vin?: string;
        city?: string;
        search?: string;
      }>;
      
      if (customEvent.detail) {
        const { tab, centerId, vin, city, search } = customEvent.detail;
        if (tab) {
          setActiveTab(tab);
        }
        if (centerId) {
          setSelectedCenterId(centerId);
          setNewBookingCenterId(centerId);
        }
        if (vin) {
          setNewBookingVin(vin);
        }
        if (city && city !== 'All') {
          setFilterCity(city);
        }
        if (search) {
          setSearchQuery(search);
        }
      }
    };
    
    window.addEventListener('navigate-inspection-centers-deep', handleDeepLink);
    return () => {
      window.removeEventListener('navigate-inspection-centers-deep', handleDeepLink);
    };
  }, []);

  // Chat Log for AI Assistant (Traffic & technical inspection decoder)
  const [aiChatQuery, setAiChatQuery] = useState('');
  const [aiChatLog, setAiChatLog] = useState<Array<{ sender: 'user' | 'assistant'; text: string; time: string }>>([
    {
      sender: 'assistant',
      text: 'Greetings. I am your AI Inspection Diagnostic Assistant. Input any technical fault description, emissions values (CO, HC, Lambda), or braking imbalance parameters to receive immediate compliance feedback and troubleshooting tips.',
      time: '12:13 AM'
    }
  ]);

  // Preset SEEDED Inspection Centers
  const INSPECTION_CENTERS: InspectionCenter[] = [
    {
      id: "center-1",
      name: "Sovereign Baltic Decra Center",
      logo: "🛡️",
      brandColor: "border-l-[#8B0000]",
      rating: 4.9,
      votes: 412,
      country: "Lithuania",
      city: "Vilnius",
      address: "Savanorių pr. 124, Vilnius LT-03150",
      phone: "+370 5 241 8234",
      languages: ["Lithuanian", "English", "Polish", "Russian"],
      certifications: ["EU Decra Certified Network", "ISO 9001:2018 Safety Audit Elite", "Regitra Accredited Inspection Hub"],
      supportedVehicleTypes: ["Passenger Car", "Commercial Van", "Heavy Duty", "Motorcycle", "Trailer"],
      inspectionCategories: ["Standard", "Import Conformity", "Emissions Test", "Commercial Fleet"],
      description: "State-of-the-art heavy brake axle dynamic rollers and premium infrared optical emissions emission testers. Offers rapid digitised reports and seamless direct server links to the transportation registry (Regitra)."
    },
    {
      id: "center-2",
      name: "TÜV SÜD Vilnius West",
      logo: "🇩🇪",
      brandColor: "border-l-blue-600",
      rating: 4.8,
      votes: 289,
      country: "Lithuania",
      city: "Vilnius",
      address: "Laisvės pr. 91, Vilnius LT-06120",
      phone: "+370 5 289 4511",
      languages: ["Lithuanian", "German", "English"],
      certifications: ["TÜV SÜD Official Partner", "German-Baltic Chamber of Commerce Accredited"],
      supportedVehicleTypes: ["Passenger Car", "Commercial Van", "Motorcycle"],
      inspectionCategories: ["Standard", "Emissions Test", "Import Conformity"],
      description: "TÜV-standardized technical monitoring systems. Focuses on suspension link tolerances, frame integrity testing, and localized multi-point exhaust spectral scans."
    },
    {
      id: "center-3",
      name: "Hamburg-Nord Tech-Prüfung",
      logo: "⚓",
      brandColor: "border-l-amber-500",
      rating: 4.7,
      votes: 195,
      country: "Germany",
      city: "Hamburg",
      address: "Alsterkrugchaussee 450, 22335 Hamburg",
      phone: "+49 40 500 1204",
      languages: ["German", "English"],
      certifications: ["ADAC Safety Cooperative Rating A+", "Emissions Directive 2026 Compliant"],
      supportedVehicleTypes: ["Passenger Car", "Commercial Van", "Heavy Duty", "Trailer"],
      inspectionCategories: ["Standard", "Emissions Test", "Commercial Fleet"],
      description: "Vast testing lanes dedicated to commercial freight logistics, heavy coupling rigs, and emissions assessment using optical Lambda calculations."
    }
  ];

  // Pre-seeded Historical Inspection Logs
  const HISTORICAL_RECORDS: HistoricalRecord[] = [
    {
      id: "REC-491",
      date: "2026-04-10",
      centerName: "Sovereign Baltic Decra Center",
      vehicleName: "Porsche 911 Carrera S",
      vehicleVin: "WP0AB2A92MS299212",
      type: "Standard Safety Technical",
      status: "Pass",
      emissionsReport: {
        coValue: 0.12,
        coLimit: 0.20,
        lambdaValue: 1.002,
        status: "Excellent"
      },
      brakingForce: {
        frontBalance: 4.5,
        rearBalance: 6.2,
        status: "Pass"
      }
    },
    {
      id: "REC-338",
      date: "2026-03-24",
      centerName: "TÜV SÜD Vilnius West",
      vehicleName: "Audi RS6 Avant",
      vehicleVin: "WAUB8AF21MN05XXXX",
      type: "Emissions Special Assessment",
      status: "Pass",
      emissionsReport: {
        coValue: 0.18,
        coLimit: 0.20,
        lambdaValue: 0.995,
        status: "Excellent"
      },
      brakingForce: {
        frontBalance: 8.9,
        rearBalance: 11.2,
        status: "Pass"
      }
    },
    {
      id: "REC-1152",
      date: "2026-02-18",
      centerName: "Sovereign Baltic Decra Center",
      vehicleName: "BMW M5 Competition",
      vehicleVin: "WBA53BJ0XPX881270",
      type: "Standard Safety Technical",
      status: "Fail",
      emissionsReport: {
        coValue: 0.42,
        coLimit: 0.20,
        lambdaValue: 1.065,
        status: "Failed"
      },
      brakingForce: {
        frontBalance: 12.4,
        rearBalance: 32.8,
        status: "Fail"
      }
    }
  ];

  // Helper autocomplete: fills price & year by selected vehicle
  const handleBookingCarFill = (vin: string) => {
    setNewBookingVin(vin);
    const match = VEHICLES.find(v => v.vin.toUpperCase() === vin.toUpperCase() || v.vin.includes(vin));
    if (match) {
      setNewBookingCategory(match.year > 2024 ? 'Standard' : 'Import Conformity');
    }
  };

  const handleFailCarFill = (vin: string) => {
    setNewFailVin(vin);
    const match = VEHICLES.find(v => v.vin.toUpperCase() === vin.toUpperCase() || v.vin.includes(vin));
    if (match) {
      setNewFailVehicleName(`${match.make} ${match.model}`);
    }
  };

  // Directory Filter logical resolution
  const filteredCenters = useMemo(() => {
    return INSPECTION_CENTERS.filter(center => {
      if (filterCountry !== 'All' && center.country !== filterCountry) return false;
      if (filterCity !== 'All' && center.city !== filterCity) return false;
      if (filterVehicleType !== 'All' && !center.supportedVehicleTypes.includes(filterVehicleType as any)) return false;
      if (filterCategory !== 'All' && !center.inspectionCategories.includes(filterCategory as any)) return false;

      if (searchQuery.trim() !== '') {
        const term = searchQuery.toLowerCase();
        const matchName = center.name.toLowerCase().includes(term);
        const matchAddress = center.address.toLowerCase().includes(term);
        const matchDesc = center.description.toLowerCase().includes(term);
        return matchName || matchAddress || matchDesc;
      }
      return true;
    });
  }, [filterCountry, filterCity, filterVehicleType, filterCategory, searchQuery]);

  const activeCenter = useMemo(() => {
    return INSPECTION_CENTERS.find(c => c.id === selectedCenterId) || INSPECTION_CENTERS[0];
  }, [selectedCenterId]);

  // Interactive booking handler
  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const center = INSPECTION_CENTERS.find(c => c.id === newBookingCenterId) || INSPECTION_CENTERS[0];
    const matchCar = VEHICLES.find(v => v.vin.toUpperCase() === newBookingVin.toUpperCase()) || VEHICLES[0];

    const newApt: InspectionAppointment = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      centerName: center.name,
      vehicleName: `${matchCar.make} ${matchCar.model}`,
      vehicleVin: newBookingVin || 'WAUB8AF11MNXXXXXX',
      inspectionType: `${newBookingCategory} Technical Inspection`,
      dateTime: newBookingDate,
      timeSlot: newBookingTime,
      status: 'Confirmed',
      reminderSet: true
    };

    setAppointments(prev => [newApt, ...prev]);
    setFeedbackMessage(`SUCCESS! Dynamic Booking Scheduled at ${center.name}. Push indicators sent.`);
    
    // Clear inputs
    setNewBookingVin('');
    
    // Auto clear alert
    setTimeout(() => setFeedbackMessage(null), 6000);
  };

  // Toggle dynamic reminders
  const toggleReminder = (id: string) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === id) {
        return { ...apt, reminderSet: !apt.reminderSet };
      }
      return apt;
    }));
  };

  // Add temporary issue to form accumulator
  const handleAddTempIssue = () => {
    if (!newFailDesc.trim()) return;
    const item: FailureItem = {
      id: `tmp-${Date.now()}`,
      category: newFailCategory,
      severity: newFailSeverity,
      description: newFailDesc
    };
    setTempIssueList(prev => [...prev, item]);
    setNewFailDesc('');
  };

  // Remove temporary issue from accumulator
  const handleRemoveTempIssue = (id: string) => {
    setTempIssueList(prev => prev.filter(i => i.id !== id));
  };

  // Submit Failure report with custom structural telemetry
  const handleCreateFailureCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempIssueList.length === 0) {
      alert("Please specify at least one distinct structural or safety failure case violation before recording index files.");
      return;
    }

    const newFail: InspectionFailureCase = {
      id: `FAIL-${Math.floor(1000 + Math.random() * 9000)}`,
      vehicleName: newFailVehicleName,
      vehicleVin: newFailVin || "WBA53BJ0XPX808122",
      inspectionCenterName: newFailCenter,
      date: new Date().toISOString().split('T')[0],
      failureImage: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?q=80&w=600&auto=format&fit=crop",
      notes: newFailNotes || "Manual technical failure profile compiled by regional certified inspecting officer.",
      isForwarded: false,
      forwardedWorkshop: null,
      issues: tempIssueList,
      emissionsData: {
        co: newFailCO,
        hc: newFailHC,
        lambda: newFailLambda
      }
    };

    setFailureCases(prev => [newFail, ...prev]);
    setTempIssueList([]);
    setNewFailNotes('');
    setNewFailVin('');

    setFeedbackMessage(`SUCCESS! Failure File ${newFail.id} attached to vehicle ${newFail.vehicleName} profile.`);
    setTimeout(() => setFeedbackMessage(null), 8000);
  };

  // Forward failure logs to workshop mechanics for immediate bidding quotation
  const handleForwardToWorkshops = (id: string, workshopName: string) => {
    setFailureCases(prev => prev.map(cs => {
      if (cs.id === id) {
        return {
          ...cs,
          isForwarded: true,
          forwardedWorkshop: workshopName,
          forwardedDate: new Date().toISOString().split('T')[0]
        };
      }
      return cs;
    }));

    setFeedbackMessage(`SUCCESS! Forwarded ${id} diagnostic report packet containing brake & lambda variables to ${workshopName} for repair quotation.`);
    setTimeout(() => setFeedbackMessage(null), 8000);
  };

  // AI Assistant response mechanism
  const handleSendAiQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiChatQuery.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: aiChatQuery,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAiChatLog(prev => [...prev, userMsg]);
    const normalized = aiChatQuery.toLowerCase();
    setAiChatQuery('');

    setTimeout(() => {
      let responseText = '';

      if (normalized.includes('co') || normalized.includes('emissions') || normalized.includes('exhaust') || normalized.includes('smoke')) {
        responseText = '🏭 EXHAUST EMISSIONS DIAGNOSTIC: High carbon monoxide (CO > 0.20%) typically triggers failing results in EU. This indicates incomplete combustion. Likely culprits: clogged air filters, failing spark plugs, or an aged catalytic converter that has lost oxidation capability. Check exhaust Lambda sensors; if they read > 1.03, the fuel mixture is running dangerously lean, forcing high temperatures.';
      } else if (normalized.includes('brake') || normalized.includes('balance') || normalized.includes('disparity') || normalized.includes('roller')) {
        responseText = '🛑 BRAKING DISPARITY DECODER: Baltic standard test permits at most 30% braking imbalance on any axle. Disparity of 34% commonly reveals a sticky caliper piston, uneven pad wear, minor hydraulic air bubbles, or uneven guide pin lubrication. Advise workshop bleed, caliper piston polish, and new certified rotor swap.';
      } else if (normalized.includes('prep') || normalized.includes('guide') || normalized.includes('pass') || normalized.includes('check')) {
        responseText = '📋 HIGH-PASS PREP CHECKLIST: 1. Heat catalytic converter by driving at high revs for 15 minutes before driving into emission testing lanes. 2. Verify all rear lights, indicator color outputs, and license plate LEDs compile correctly. 3. Top off washer reservoir fluids and ensure wiper blades wipe clear with 0 streaking. 4. Audit your rear boot is stocked with EU medical kit and warning triangle.';
      } else if (normalized.includes('lambda') || normalized.includes('sensor')) {
        responseText = '🧪 LAMBDA MEASUREMENT ANALYSIS: Ideal lambda stoichiometric value is exactly 1.000. If reading sits above 1.03, redundant oxygen flows in the probe (exhaust gas leak in pipe or headers). If reading falls beneath 0.97, the fueling mixture is rich, potentially choking plug terminals.';
      } else {
        responseText = `🤖 TECHNICAL INSPECTION ADVISORY: Diagnostic registers indicate a standard inspection index query. Let me know if you would like me to dissect emission reports (CO, HC, Lambda), safety checklists, or help you draft workshop RFQs for failing parts.`;
      }

      const aiMsg = {
        sender: 'assistant' as const,
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setAiChatLog(prev => [...prev, aiMsg]);
    }, 1000);
  };

  const handlePromptClick = (txt: string) => {
    setAiChatQuery(txt);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 bg-white text-left font-sans" id="inspections-hub-root">
      
      {/* Dynamic Header Frame */}
      <div className="relative rounded-3xl overflow-hidden bg-white text-slate-900 p-8 md:p-12 shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 transition-all duration-300 border border-black/[0.03] animate-in fade-in duration-300">
        <div className="absolute inset-0 bg-radial-at-t from-red-50/15 via-white to-white pointer-events-none opacity-90"></div>

        <div className="relative space-y-2 max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 mt-1 font-sans">
            Inspection Centers Hub
          </h1>
        </div>

        {/* Modular Workspace Tabs */}
        <div className="relative pt-8 flex flex-wrap gap-2.5 max-w-[800px]">
          <button
            onClick={() => setActiveTab('directory')}
            className={`py-3 px-5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
              activeTab === 'directory'
                ? 'bg-[#8B0000] text-white border-transparent shadow-lg shadow-red-900/15 font-extrabold'
                : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search Centers &amp; Book</span>
          </button>

          <button
            onClick={() => setActiveTab('issues')}
            className={`py-3 px-5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
              activeTab === 'issues'
                ? 'bg-[#8B0000] text-white border-transparent shadow-lg shadow-red-900/15 font-extrabold'
                : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Failure Files &amp; RFQs</span>
            {failureCases.filter(c => !c.isForwarded).length > 0 && (
              <span className="bg-[#8B0000] text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center font-mono">
                {failureCases.filter(c => !c.isForwarded).length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`py-3 px-5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
              activeTab === 'records'
                ? 'bg-[#8B0000] text-white border-transparent shadow-lg shadow-red-900/15 font-extrabold'
                : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-500" />
            <span>Historical Telemetry logs</span>
          </button>

          <button
            onClick={() => setActiveTab('assistant')}
            className={`py-3 px-5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer border ${
              activeTab === 'assistant'
                ? 'bg-[#8B0000] text-white border-transparent shadow-lg shadow-red-900/15 font-extrabold'
                : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Bot className="w-4 h-4 text-cyan-500 animate-pulse" />
            <span>AI Technical Assistant</span>
          </button>
        </div>
      </div>

      {feedbackMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold p-4 rounded-xl flex items-center gap-2.5 shadow-sm animate-slideDown">
          <CheckSquare className="w-5 h-5 text-emerald-600" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* RENDER WORKSPACE PANELS */}
      <AnimatePresence mode="wait">

        {/* TAB 1: SEARCH DIRECTORY & DETAILED PROFILES & APPOINTMENTS BOOKING */}
        {activeTab === 'directory' && (
          <motion.div
            key="directory-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.15 }}
            className="space-y-8"
          >
            {/* Filter Hub Toolbar */}
            <div className="bg-white border border-black/[0.03] p-6 rounded-3xl grid grid-cols-1 md:grid-cols-5 gap-4 items-center shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 transition-all duration-300">
              
              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Search Centers</label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Sovereign Decra, TÜV..."
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200/80 rounded-xl font-semibold text-slate-800 outline-none focus:bg-white focus:ring-4 focus:ring-[#8B0000]/5 focus:border-[#8B0000] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Country Zone</label>
                <select
                  value={filterCountry}
                  onChange={(e) => {
                    setFilterCountry(e.target.value);
                    setFilterCity('All');
                  }}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 font-bold outline-none focus:bg-white focus:ring-4 focus:ring-[#8B0000]/5 focus:border-[#8B0000] transition-all"
                >
                  <option value="All">All Countries</option>
                  <option value="Lithuania">Lithuania 🇱🇹</option>
                  <option value="Germany">Germany 🇩🇪</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">City Location</label>
                <select
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 font-bold outline-none focus:bg-white focus:ring-4 focus:ring-[#8B0000]/5 focus:border-[#8B0000] transition-all"
                >
                  <option value="All">All Cities</option>
                  {filterCountry === 'Germany' ? (
                    <option value="Hamburg">Hamburg</option>
                  ) : (
                    <option value="Vilnius">Vilnius</option>
                  )}
                </select>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Vehicle Match Category</label>
                <select
                  value={filterVehicleType}
                  onChange={(e) => setFilterVehicleType(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 font-bold outline-none focus:bg-white focus:ring-4 focus:ring-[#8B0000]/5 focus:border-[#8B0000] transition-all"
                >
                  <option value="All">Any Vehicle Type</option>
                  <option value="Passenger Car">Passenger Car</option>
                  <option value="Commercial Van">Commercial Van</option>
                  <option value="Heavy Duty">Heavy Duty Truck</option>
                  <option value="Motorcycle">Motorcycle</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-black text-slate-500 uppercase block mb-1">Inspection Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200/80 rounded-xl text-slate-800 font-bold outline-none focus:bg-white focus:ring-4 focus:ring-[#8B0000]/5 focus:border-[#8B0000] transition-all"
                >
                  <option value="All">Any Category Option</option>
                  <option value="Standard">Standard Safety</option>
                  <option value="Emissions Test">Emissions Testing</option>
                  <option value="Import Conformity">Import Conformity</option>
                  <option value="Commercial Fleet">Commercial fleet audit</option>
                </select>
              </div>

            </div>

            {/* Core split: Selector list and dynamic booking/profile panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left selector */}
              <div className="col-span-1 lg:col-span-5 space-y-4">
                <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wider px-1">
                  Matched Testing Facilities ({filteredCenters.length})
                </h3>

                <div className="space-y-3">
                  {filteredCenters.map((center) => (
                    <div
                      key={center.id}
                      onClick={() => {
                        setSelectedCenterId(center.id);
                        setNewBookingCenterId(center.id);
                      }}
                      className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:-translate-y-0.5 ${
                        selectedCenterId === center.id
                          ? 'bg-slate-50/70 border-2 border-[#8B0000] shadow-3d-elevated'
                          : 'bg-white border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2.5">
                          <div>
                            <h4 className="font-extrabold text-[#8B0000] text-sm">{center.name}</h4>
                            <span className="text-[10px] text-slate-500 font-bold">{center.city}, {center.country}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 bg-amber-50 rounded px-1.5 py-0.5 border border-amber-100 text-amber-700 text-[10px] font-black shrink-0">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>{center.rating}</span>
                        </div>
                      </div>

                      <p className="text-slate-500 text-[10px] leading-relaxed mt-2.5 line-clamp-2">
                        {center.description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold">
                        <span className="text-slate-400">Slots: <strong className="text-emerald-600">Available Today</strong></span>
                        <span className="text-slate-[#8B0000] lowercase font-black inline-flex items-center gap-0.5">
                          Open Profile &amp; Book <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Profile & Appointment Booking form */}
              <div className="col-span-1 lg:col-span-7 space-y-8 bg-slate-50/50 border border-black/[0.03] rounded-3xl p-6 md:p-8 shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300">
                
                {/* Profile detail display top */}
                <div className="border-b border-slate-200 pb-6 space-y-4">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div>
                        <h2 className="text-lg md:text-xl font-extrabold text-slate-900 leading-tight">{activeCenter.name}</h2>
                        <p className="text-[11px] text-[#8B0000] font-mono font-bold mt-1">{activeCenter.address}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {activeCenter.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-[11px] font-bold">
                    <div className="bg-white p-4 rounded-2xl border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300 space-y-2">
                      <span className="text-[9px] text-slate-400 uppercase block tracking-wider font-extrabold">Accredited Certifications</span>
                      <ul className="space-y-1.5 text-slate-700">
                        {activeCenter.certifications.map((cert, idx) => (
                          <li key={idx} className="flex items-center gap-1.5 text-[10px]">
                            <ShieldCheck className="w-4 h-4 text-[#8B0000] inline shrink-0" />
                            <span>{cert}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300 space-y-2">
                      <span className="text-[9px] text-slate-400 uppercase block tracking-wider font-extrabold">Languages Offered</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {activeCenter.languages.map((lang, idx) => (
                          <span key={idx} className="bg-slate-100 text-slate-650 font-bold px-2 py-1 rounded-lg text-[10px] border border-slate-200/50">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Appointment Booking System */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                      Live Scheduling &amp; Reservation Desk
                    </h3>
                  </div>

                  <form onSubmit={handleCreateAppointment} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold bg-white p-5 rounded-2xl border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase">Pre-Fill from Inventory vehicles</label>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {VEHICLES.slice(0, 3).map(v => (
                          <button
                            key={v.vin}
                            type="button"
                            onClick={() => handleBookingCarFill(v.vin)}
                            className={`text-[9.5px] font-bold py-1.5 px-3 border rounded-lg transition-all duration-150 ${
                              newBookingVin === v.vin 
                                ? 'bg-[#8B0000] text-white border-transparent shadow-md shadow-red-900/10' 
                                : 'bg-slate-50 text-slate-650 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            {v.make} {v.model}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-450 uppercase">Mapped Car VIN ID</label>
                      <input
                        type="text"
                        value={newBookingVin}
                        onChange={(e) => setNewBookingVin(e.target.value)}
                        placeholder="Ex: WP0AB2A92MS299212"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 outline-none focus:bg-white focus:ring-4 focus:ring-[#8B0000]/5 focus:border-[#8B0000] transition-all text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-450 uppercase">Investigation Protocol</label>
                      <select
                        value={newBookingCategory}
                        onChange={(e) => setNewBookingCategory(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-750 font-bold outline-none focus:bg-white focus:ring-4 focus:ring-[#8B0000]/5 focus:border-[#8B0000] transition-all text-xs"
                      >
                        <option value="Standard">Standard Safety &amp; Chassis</option>
                        <option value="Emissions">Emissions &amp; Exhaust Lambda testing</option>
                        <option value="Import Conformity">Import Conformity registration testing</option>
                        <option value="Commercial">Commercial logistics fleet inspection</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-450 uppercase">Target Date</label>
                      <input
                        type="date"
                        value={newBookingDate}
                        onChange={(e) => setNewBookingDate(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-750 font-bold outline-none focus:bg-white focus:ring-4 focus:ring-[#8B0000]/5 focus:border-[#8B0000] transition-all text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-450 uppercase">Booking Period Slot</label>
                      <select
                        value={newBookingTime}
                        onChange={(e) => setNewBookingTime(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-750 font-bold outline-none focus:bg-white focus:ring-4 focus:ring-[#8B0000]/5 focus:border-[#8B0000] transition-all text-xs"
                      >
                        <option value="09:00 AM - 09:30 AM">09:00 AM - 09:30 AM (Available)</option>
                        <option value="11:00 AM - 11:30 AM">11:00 AM - 11:30 AM (Available)</option>
                        <option value="02:00 PM - 02:30 PM">02:00 PM - 02:30 PM (Available)</option>
                        <option value="04:30 PM - 05:00 PM">04:30 PM - 05:00 PM (Available)</option>
                      </select>
                    </div>

                    <div className="col-span-1 md:col-span-2 pt-2">
                      <button
                        type="submit"
                        className="w-full bg-[#8B0000] hover:bg-[#730000] text-white font-black uppercase text-[10.5px] py-4 rounded-xl transition-all duration-150 tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 active:scale-95"
                      >
                        <span>Schedule Appointment slot</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </button>
                    </div>

                  </form>
                </div>

                {/* Booked list */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10.5px] font-black text-slate-400 uppercase tracking-widest block">Active Appointments &amp; Reminders</span>
                  {appointments.map((apt) => (
                    <div key={apt.id} className="bg-white border border-black/[0.03] p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-bold text-slate-800 shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                          <h4 className="font-extrabold text-[#8B0000]">{apt.centerName}</h4>
                        </div>
                        <p className="text-[11px] text-slate-650">
                          {apt.vehicleName} • Vin: <strong className="font-mono uppercase text-slate-800">{apt.vehicleVin}</strong>
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {apt.inspectionType} | {apt.dateTime} @ {apt.timeSlot}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => toggleReminder(apt.id)}
                          className={`px-3.5 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                            apt.reminderSet 
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-sm' 
                              : 'bg-slate-50 text-slate-500 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          {apt.reminderSet ? "🔔 Reminder Active" : "🔕 Set Reminder"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 2: INSPECTION FAILURE CASES & FORWARD TO GARAGES (RFQ) */}
        {activeTab === 'issues' && (
          <motion.div
            key="issues-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.15 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Failure Report creation Left */}
              <form onSubmit={handleCreateFailureCase} className="col-span-1 lg:col-span-5 border border-black/[0.03] rounded-3xl p-6 bg-white space-y-4 shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 transition-all duration-300">
                <div className="mb-2">
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Create Failure Profile</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Log vehicle technical failures and safety defects.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase">Pre-fill Car details</label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {VEHICLES.map(v => (
                      <button
                        key={v.vin}
                        type="button"
                        onClick={() => handleFailCarFill(v.vin)}
                        className={`text-[9.5px] font-bold py-1.5 px-2.5 border rounded-lg transition-all duration-150 cursor-pointer ${
                          newFailVin === v.vin 
                            ? 'bg-[#8B0000] text-white border-transparent shadow' 
                            : 'bg-slate-50 text-slate-650 border-slate-200/80 hover:bg-slate-100'
                        }`}
                      >
                        {v.make} {v.model}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-450 uppercase font-black block mb-0.5">Vehicle reference name</label>
                    <input
                      type="text"
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:ring-4 focus:ring-[#8B0000]/5 focus:border-[#8B0000] transition-all"
                      value={newFailVehicleName}
                      onChange={(e) => setNewFailVehicleName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-450 uppercase font-black block mb-0.5">Vehicle VIN reference</label>
                    <input
                      type="text"
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800 outline-none focus:bg-white focus:ring-4 focus:ring-[#8B0000]/5 focus:border-[#8B0000] transition-all"
                      placeholder="Vin number ID"
                      value={newFailVin}
                      onChange={(e) => setNewFailVin(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-450 uppercase font-black block mb-0.5">Issuing Testing Center</label>
                  <select
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:bg-white focus:ring-4 focus:ring-[#8B0000]/5 focus:border-[#8B0000] transition-all"
                    value={newFailCenter}
                    onChange={(e) => setNewFailCenter(e.target.value)}
                  >
                    <option value="Sovereign Baltic Decra Center">Sovereign Baltic Decra Center</option>
                    <option value="TÜV SÜD Vilnius West">TÜV SÜD Vilnius West</option>
                    <option value="Hamburg-Nord Tech-Prüfung">Hamburg-Nord Tech-Prüfung</option>
                  </select>
                </div>

                {/* Core Emissions data section */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[9px] font-black text-[#8B0000] uppercase tracking-wider block">Exhaust Telemetry Logged values</span>
                  <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 block uppercase">CO value %</label>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-center font-mono focus:outline-none focus:ring-2 focus:ring-[#8B0000]/10"
                        value={newFailCO}
                        onChange={(e) => setNewFailCO(parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 block uppercase">HC value ppm</label>
                      <input
                        type="number"
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-center font-mono focus:outline-none focus:ring-2 focus:ring-[#8B0000]/10"
                        value={newFailHC}
                        onChange={(e) => setNewFailCO(parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-400 block uppercase">Lambda ratio value</label>
                      <input
                        type="number"
                        step="0.001"
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-center font-mono focus:outline-none focus:ring-2 focus:ring-[#8B0000]/10"
                        value={newFailLambda}
                        onChange={(e) => setNewFailLambda(parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                {/* Failure issues accumulator */}
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-[9px] font-extrabold text-slate-900 uppercase">Interactive failure items checklist</span>
                    <span className="text-[9px] font-mono text-slate-400 font-bold">{tempIssueList.length} defined</span>
                  </div>

                  {tempIssueList.length > 0 && (
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {tempIssueList.map((item) => (
                        <div key={item.id} className="flex justify-between items-start gap-1.5 p-2 bg-white border border-black/[0.03] rounded-xl text-[10.5px] shadow-2xs">
                          <div>
                            <span className="bg-[#8B0000] text-white font-mono text-[8px] tracking-wider px-1.5 py-0.5 rounded uppercase font-black">
                              {item.category} • {item.severity}
                            </span>
                            <p className="font-semibold text-slate-650 mt-1">{item.description}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveTempIssue(item.id)}
                            className="text-red-600 hover:text-red-800 font-bold border border-red-200 px-1.5 py-0.5 rounded-lg hover:bg-red-50 text-[9px] cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add inline issues interface */}
                  <div className="space-y-3 border-t border-slate-200 pt-3">
                    <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                      <div>
                        <span className="text-slate-400 block font-bold mb-0.5">System Category</span>
                        <select
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold"
                          value={newFailCategory}
                          onChange={(e: any) => setNewFailCategory(e.target.value)}
                        >
                          <option value="Brakes">Brakes</option>
                          <option value="Emissions">Emissions</option>
                          <option value="Suspension">Suspension</option>
                          <option value="Lighting">Lighting</option>
                          <option value="Chassis">Chassis</option>
                        </select>
                      </div>

                      <div>
                        <span className="text-slate-400 block font-bold mb-0.5">Failure Severity</span>
                        <select
                          className="w-full p-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold"
                          value={newFailSeverity}
                          onChange={(e: any) => setNewFailSeverity(e.target.value)}
                        >
                          <option value="Major">Major fault</option>
                          <option value="Dangerous">Dangerous structural risk</option>
                          <option value="Minor">Minor warning</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold">Specific defect description</span>
                      <input
                        type="text"
                        className="w-full p-2.5 bg-white border border-slate-200 text-xs rounded-lg font-medium"
                        placeholder="Ex: Axle caliper slider binding"
                        value={newFailDesc}
                        onChange={(e) => setNewFailDesc(e.target.value)}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAddTempIssue}
                      className="w-full bg-[#8B0000] hover:bg-[#730000] text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors duration-150 cursor-pointer shadow-sm"
                    >
                      + Register Issue parameters
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-black block">General officer comment note</label>
                  <textarea
                    rows={2}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 font-semibold rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-[#8B0000]/5 focus:border-[#8B0000] transition-all"
                    placeholder="Provide overarching review comments..."
                    value={newFailNotes}
                    onChange={(e) => setNewFailNotes(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#8B0000] hover:bg-[#730000] text-white font-black uppercase text-xs tracking-wider py-4 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 active:scale-95"
                >
                  <FileText className="w-4 h-4 text-white" />
                  <span>Attach Failure Report File</span>
                </button>
              </form>

              {/* Created defect cases Right */}
              <div className="col-span-1 lg:col-span-7 space-y-6">
                <span className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                  <ClipboardList className="w-5 h-5 text-zinc-500" />
                  Vehicular Defect Files &amp; RFQs Forwarding Lanes
                </span>

                <div className="grid grid-cols-1 gap-6">
                  {failureCases.map((cs) => (
                    <div key={cs.id} className="bg-white border border-black/[0.03] p-6 rounded-3xl hover:shadow-3d-elevated transition-all duration-300 space-y-5 relative overflow-hidden shadow-3d-premium">
                      
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <span className="text-slate-500 text-xs font-semibold">
                            Report #{cs.id}
                          </span>
                          <h3 className="font-extrabold text-slate-900 text-sm mt-2">{cs.vehicleName}</h3>
                          <p className="text-[10.5px] text-slate-500">VIN Ref: <strong className="uppercase font-mono">{cs.vehicleVin}</strong></p>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-bold font-mono">Issued Date: {cs.date}</span>
                          <p className="text-[10.5px] font-bold text-slate-600 font-sans mt-0.5">{cs.inspectionCenterName}</p>
                        </div>
                      </div>

                      {/* Display Issues listed */}
                      <div className="space-y-2">
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Identified Technical Violations:</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {cs.issues.map((iss) => (
                            <div key={iss.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-800 uppercase">
                                  {iss.category}
                                </span>

                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                  iss.severity === 'Dangerous' 
                                    ? 'bg-red-50 text-[#8B0000]' 
                                    : iss.severity === 'Major'
                                    ? 'bg-amber-50 text-amber-700'
                                    : 'bg-zinc-100 text-zinc-600'
                                }`}>
                                  {iss.severity} Risk
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-650 leading-relaxed font-bold font-sans mt-2">
                                {iss.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Exhaust parameters values summary box */}
                      <div className="bg-slate-50 border rounded-xl p-3 grid grid-cols-3 gap-4 text-center">
                        <div>
                          <span className="text-[8.5px] text-slate-400 font-bold block uppercase">Fuel Lambda Ratio</span>
                          <span className={`text-xs font-mono font-black ${(cs.emissionsData.lambda < 0.97 || cs.emissionsData.lambda > 1.03) ? "text-red-600" : "text-emerald-600"}`}>{cs.emissionsData.lambda}</span>
                        </div>
                        <div>
                          <span className="text-[8.5px] text-slate-400 font-bold block uppercase">Measured CO exhaust</span>
                          <span className={`text-xs font-mono font-black ${cs.emissionsData.co > 0.2 ? "text-red-600" : "text-emerald-600"}`}>{cs.emissionsData.co}%</span>
                        </div>
                        <div>
                          <span className="text-[8.5px] text-slate-400 font-bold block uppercase">HC output volume</span>
                          <span className={`text-xs font-mono font-black ${cs.emissionsData.hc > 100 ? "text-red-600" : "text-emerald-600"}`}>{cs.emissionsData.hc} ppm</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-3.5 rounded-xl text-[11px] font-medium leading-relaxed italic border border-dashed text-slate-550">
                        "<strong>Examiner Notes:</strong> {cs.notes}"
                      </div>

                      {/* RFQ Forwarding Lane integration */}
                      <div className="border-t border-slate-100 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="text-[11px]">
                          {cs.isForwarded ? (
                            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>Forwarded to <strong>{cs.forwardedWorkshop}</strong> on {cs.forwardedDate}</span>
                            </div>
                          ) : (
                            <span className="text-amber-600 font-extrabold flex items-center gap-1">
                              <AlertCircle className="w-4 h-4 text-amber-500" />
                              Pending defect repairs. Send to workshop partners to gather quotes.
                            </span>
                          )}
                        </div>

                        {!cs.isForwarded && (
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleForwardToWorkshops(cs.id, "Vilnius Sovereign Mechanics B2B Garage")}
                              className="bg-[#8B0000] hover:bg-[#730000] text-white text-[10.5px] font-black uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all duration-150 cursor-pointer shadow-sm active:scale-95"
                            >
                              Forward to Vilnius Tech Workshop
                            </button>
                            <button
                              type="button"
                              onClick={() => handleForwardToWorkshops(cs.id, "Klaipėda Marine Engine Hub LLC")}
                              className="bg-[#2E3033] hover:bg-zinc-900 text-white text-[10.5px] font-black uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all duration-150 cursor-pointer shadow-sm active:scale-95"
                            >
                              Forward to Klaipėda Hub
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 3: HISTORICAL RUN RECORDS & SAFETY LOGS (EMISSIONS & BRAKES TELEMETRY) */}
        {activeTab === 'records' && (
          <motion.div
            key="records-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.15 }}
            className="space-y-8"
          >
            <div className="bg-white border border-black/[0.03] rounded-3xl p-6 md:p-8 space-y-6 shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300">
              
              <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#8B0000]" />
                    Historic Emissions &amp; Brake Roller Safety Telemetry Logs
                  </h3>
                  <p className="text-xs text-slate-500 font-medium font-sans mt-1">Direct read-only records pulled from regional vehicle control registers (TÜV, Decra, Regitra api endpoints).</p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFeedbackMessage("Updating telemetry logs from municipal database servers... Complete.");
                    setTimeout(() => setFeedbackMessage(null), 5000);
                  }}
                  className="bg-[#8B0000] hover:bg-[#730000] text-white text-[10.5px] font-black uppercase py-2.5 px-4 rounded-xl transition-all duration-150 flex items-center gap-1.5 shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 cursor-pointer active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync Server Telemetry</span>
                </button>
              </div>

              {/* Data Table with safety parameters detailing */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200/60 shadow-sm">
                <table className="w-full text-xs font-bold text-left border-collapse bg-white">
                  <thead>
                    <tr className="bg-[#8B0000] text-red-50 uppercase tracking-wider text-[8.5px] border-b border-[#730000]">
                      <th className="p-4 border-b">Record ID</th>
                      <th className="p-4 border-b">Timestamp</th>
                      <th className="p-4 border-b">Vehicle details</th>
                      <th className="p-4 border-b">Exhaust CO Value</th>
                      <th className="p-4 border-b">Exhaust Lambda</th>
                      <th className="p-4 border-b">Brake Imbalance Ratio</th>
                      <th className="p-4 border-b">Underwriting Center</th>
                      <th className="p-4 border-b text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {HISTORICAL_RECORDS.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50 text-slate-800 text-[11px] font-sans">
                        
                        <td className="p-4 font-mono font-black text-rose-700">{rec.id}</td>
                        <td className="p-4 text-slate-500 font-mono">{rec.date}</td>
                        <td className="p-4">
                          <span className="font-extrabold font-sans text-slate-900 block">{rec.vehicleName}</span>
                          <span className="font-mono text-[9.5px] text-slate-405 font-medium uppercase">VIN: {rec.vehicleVin}</span>
                        </td>
                        
                        <td className="p-4">
                          <span className="font-mono">{rec.emissionsReport.coValue}%</span>
                          <span className="text-[9.5px] text-slate-400 block font-normal font-sans">Limit: {rec.emissionsReport.coLimit}%</span>
                        </td>

                        <td className="p-4">
                          <span className={`font-mono ${rec.emissionsReport.lambdaValue > 1.03 ? "text-red-600 block" : "text-emerald-700 font-extrabold block"}`}>
                            {rec.emissionsReport.lambdaValue}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="space-y-0.5">
                            <span className="font-mono block">Front: {rec.brakingForce.frontBalance}% Disparity</span>
                            <span className={`font-mono block ${rec.brakingForce.rearBalance > 30 ? "text-red-600 font-bold" : "text-slate-550"}`}>
                              Rear: {rec.brakingForce.rearBalance}% Disparity
                            </span>
                          </div>
                        </td>

                        <td className="p-4 text-zinc-650">{rec.centerName}</td>

                        <td className="p-4 text-center">
                          <span className={`px-2.5 py-1 rounded inline-block text-[9.5px] font-black uppercase tracking-wider ${
                            rec.status === 'Pass' 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                              : 'bg-red-50 text-red-800 border border-red-200'
                          }`}>
                            {rec.status}
                          </span>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 4: INTERACTIVE AI DIAGNOSTIC ASSISTANT & ADVISORY GUIDES */}
        {activeTab === 'assistant' && (
          <motion.div
            key="assistant-workspace"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.15 }}
            className="space-y-8"
          >
            {/* Split AI Assistant and Pre-Examination advice guides */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Chatbot Left */}
              <div className="col-span-1 lg:col-span-7 bg-white border border-black/[0.03] rounded-3xl p-6 flex flex-col h-[520px] justify-between shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 transition-all duration-300">
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 pb-3.5 border-b border-slate-150">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-[#8B0000] flex items-center justify-center shadow-sm">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest leading-none">AI Inspection Diagnostic System</h3>
                      <p className="text-[10px] text-slate-450 font-bold font-mono mt-1">Real-time troubleshooting of exhaust, safety calipers &amp; CO ratio faults.</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handlePromptClick("Explain failing CO values above 0.35% and how to correct them")}
                      className="text-[9.5px] font-bold py-1.5 px-3 bg-slate-50 text-slate-700 border border-slate-200/80 rounded-lg hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 transition-all truncate max-w-xs cursor-pointer"
                    >
                      CO limit exceeding 0.35% ?
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePromptClick("What causes rear-axle brake disparity of 32% during diagnostics?")}
                      className="text-[9.5px] font-bold py-1.5 px-3 bg-slate-50 text-slate-700 border border-slate-200/80 rounded-lg hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 transition-all truncate max-w-xs cursor-pointer"
                    >
                      32% brake imbalance ?
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePromptClick("Pre-inspection preparation guide checklist for Lithuanian standard testing")}
                      className="text-[9.5px] font-bold py-1.5 px-3 bg-slate-50 text-slate-700 border border-slate-200/80 rounded-lg hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 transition-all truncate max-w-xs cursor-pointer"
                    >
                      Pre-inspection prep guide
                    </button>
                  </div>
                </div>

                {/* Messages pane content */}
                <div className="flex-1 overflow-y-auto my-4 space-y-3.5 pr-2 scrollbar-none text-xs">
                  {aiChatLog.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                        msg.sender === 'user' 
                          ? 'bg-[#8B0000] text-white ml-auto' 
                          : 'bg-slate-50 text-slate-800 mr-auto border border-slate-200/60'
                      }`}
                    >
                      <p className="font-semibold font-sans leading-relaxed text-[11px] whitespace-pre-wrap">{msg.text}</p>
                      <span className={`text-[8.5px] block text-right font-mono mt-1.5 ${msg.sender === 'user' ? 'text-white/70' : 'text-slate-450'}`}>
                        {msg.time} • {msg.sender === 'user' ? 'Vehicle Owner' : 'Regional AI System'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Custom Query Text submit */}
                <form onSubmit={handleSendAiQuery} className="flex gap-2 text-xs font-bold border-t border-slate-150 pt-3">
                  <input
                    type="text"
                    value={aiChatQuery}
                    onChange={(e) => setAiChatQuery(e.target.value)}
                    placeholder="Input technical parameter (Ex: Explain high Lambda balance 1.05)..."
                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-4 focus:ring-[#8B0000]/5 focus:border-[#8B0000] transition-all"
                  />
                  <button
                    type="submit"
                    className="bg-[#8B0000] hover:bg-[#730000] text-white font-black uppercase text-[10.5px] tracking-wider px-5 rounded-xl transition-all duration-150 flex items-center gap-1 cursor-pointer active:scale-95"
                  >
                    <span>Analyze</span>
                    <Send className="w-3.5 h-3.5 text-white" />
                  </button>
                </form>

              </div>

              {/* Advisory guides Right */}
              <div className="col-span-1 lg:col-span-5 bg-white border border-black/[0.03] rounded-3xl p-6 md:p-8 space-y-6 shadow-3d-premium hover:shadow-3d-elevated transition-all duration-300">
                
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                    Pre-Inspection Preparedness Program
                  </h3>
                </div>

                <div className="space-y-4 font-bold text-xs">
                  
                  {/* Item 1 */}
                  <div className="border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 transition-all duration-300 p-4 rounded-xl space-y-2 bg-white">
                    <h4 className="font-extrabold text-slate-900 text-xs">Preheat Catalytic Converters</h4>
                    <p className="text-slate-650 text-[10.5px] font-sans font-medium leading-relaxed">
                      Lithuania examiners run exhaust telemetry while the vehicle stands idle. High CO emissions occur if the catalysts are cold. Drive on a local motorway at 3,000 RPM for 15 minutes immediately before diagnostic line queues to activate catalyst metals properly.
                    </p>
                  </div>

                  {/* Item 2 */}
                  <div className="border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 transition-all duration-300 p-4 rounded-xl space-y-2 bg-white">
                    <h4 className="font-extrabold text-[#8B0000] text-xs">Verify Mandatory Cabin Safety Assets</h4>
                    <p className="text-slate-650 text-[10.5px] font-sans font-medium leading-relaxed">
                      Losing points or failing instantly is common for missing physical equipment in the glovebox/boot. Always double-pack:
                    </p>
                    <ul className="list-disc pl-4 text-[10px] text-slate-600 font-sans space-y-1">
                      <li>EU Certified Medical Kit (Check expiry date stamp!)</li>
                      <li>Highly visible yellow safety vest</li>
                      <li>Intact red safety warning folding triangle</li>
                      <li>Handheld operational fire extinguisher with sound pressure seal</li>
                    </ul>
                  </div>

                  {/* Item 3 */}
                  <div className="border border-black/[0.03] shadow-3d-premium hover:shadow-3d-elevated hover:-translate-y-0.5 transition-all duration-300 p-4 rounded-xl space-y-2 bg-white">
                    <h4 className="font-extrabold text-slate-900 text-xs">Headlamp Optical Deflection Audit</h4>
                    <p className="text-slate-650 text-[10.5px] font-sans font-medium leading-relaxed">
                      Failed headlamp profiles often stem from simple high-intensity LED swap configurations lacking dynamic auto-leveling. Revert to standard halogen or verify proper deflection angles against a vertical garage wall before tests.
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>
      
    </div>
  );
}

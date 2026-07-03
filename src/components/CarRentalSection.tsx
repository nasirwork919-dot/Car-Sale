/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, MapPin, Shield, FileText, Check, CheckCircle2, Camera, 
  MessageSquare, Send, DollarSign, AlertTriangle, Sparkles, Lock, 
  ChevronRight, Fingerprint, RefreshCw, X, Info, HelpCircle, 
  Clock, Award, Scale, HelpCircle as HelpIcon, FileSpreadsheet,
  UploadCloud, Play, UserCheck, Bell, Eye, Compass, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types definition for our internal Rental system
export interface RentalVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  image: string;
  pricePerDay: number;
  rating: number;
  transmission: string;
  engine: string;
  horsepower: number;
  condition: string;
  location: string;
  bookedDates: string[]; // YYYY-MM-DD formats for double booking prevention
  rules: {
    minAge: number;
    mileageLimit: string;
    escrowDeposit: number;
    excessFee: string;
  };
}

const RENTAL_FLEET: RentalVehicle[] = [
  {
    id: 'RENT-PORSCHE-911',
    make: 'Porsche',
    model: '911 GT3 RS (992)',
    year: 2023,
    trim: 'Weissach Racing SPEC',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800',
    pricePerDay: 580,
    rating: 5.0,
    transmission: '7-speed PDK',
    engine: '4.0L Flat-6 (518 HP)',
    horsepower: 518,
    condition: '9.9/10 Factory Pristine',
    location: 'Munich Terminal Block C',
    bookedDates: ['2026-06-18', '2026-06-19', '2026-06-20', '2026-06-24', '2026-06-25'],
    rules: {
      minAge: 25,
      mileageLimit: '120 miles/day included (extra $2.50 per mile)',
      escrowDeposit: 3000,
      excessFee: 'Full insurance coverage leaves $1,000 maximum liability'
    }
  },
  {
    id: 'RENT-MERC-G63',
    make: 'Mercedes-AMG',
    model: 'G-Class G63',
    year: 2022,
    trim: 'Stronger Than Time Edition',
    image: 'https://images.unsplash.com/photo-1520050206274-a1ae446cb3cc?auto=format&fit=crop&q=80&w=800',
    pricePerDay: 480,
    rating: 4.9,
    transmission: '9-speed Speedshift Speed automatic',
    engine: '4.0L BiTurbo V8 (577 HP)',
    horsepower: 577,
    condition: '9.8/10 Showroom Grade',
    location: 'Munich Terminal Block C',
    bookedDates: ['2026-06-15', '2026-06-16', '2026-06-22', '2026-06-23'],
    rules: {
      minAge: 25,
      mileageLimit: '150 miles/day included (extra $1.80 per mile)',
      escrowDeposit: 2500,
      excessFee: 'Zero deductible options active'
    }
  },
  {
    id: 'RENT-TESLA-PLAID',
    make: 'Tesla',
    model: 'Model S Plaid',
    year: 2023,
    trim: 'Tri-Motor 1020 HP Carbon Specification',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800',
    pricePerDay: 350,
    rating: 4.8,
    transmission: 'Single Speed Direct Drive',
    engine: 'Tri-Motor AWD Electric',
    horsepower: 1020,
    condition: '9.7/10 Standard Fleet Grade',
    location: 'Berlin-Schönefeld Hub A',
    bookedDates: ['2026-06-19', '2026-06-20', '2026-06-21'],
    rules: {
      minAge: 21,
      mileageLimit: 'Unlimited daily mileage',
      escrowDeposit: 1500,
      excessFee: 'Full collision liability bypass active'
    }
  },
  {
    id: 'RENT-AUDI-ETRON',
    make: 'Audi',
    model: 'RS e-tron GT',
    year: 2022,
    trim: 'Year One Special Spec',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=800',
    pricePerDay: 390,
    rating: 4.9,
    transmission: '2-speed Automatic Transmission',
    engine: 'Dual AC Motors AWD (637 HP)',
    horsepower: 637,
    condition: '9.8/10 Showroom Grade',
    location: 'Stuttgart Airport West Port',
    bookedDates: ['2026-06-28', '2026-06-29', '2026-06-30'],
    rules: {
      minAge: 23,
      mileageLimit: '200 miles/day included (extra $1.50 per mile)',
      escrowDeposit: 2000,
      excessFee: 'Sovereign Insurance Partner Bond Held'
    }
  }
];

export default function CarRentalSection() {
  const [vehicles, setVehicles] = useState<RentalVehicle[]>(RENTAL_FLEET);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('RENT-PORSCHE-911');

  // Active Vehicle Selection
  const activeVehicle = useMemo(() => {
    return vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];
  }, [vehicles, selectedVehicleId]);

  // --- RENTAL FILTER ENGINE STATE ---
  const [searchLocation, setSearchLocation] = useState<string>('Munich Terminal Block C');
  const [startDateStr, setStartDateStr] = useState<string>('2026-06-18');
  const [endDateStr, setEndDateStr] = useState<string>('2026-06-21');
  const [filterVehicleType, setFilterVehicleType] = useState<'All' | 'Track' | 'SUV' | 'Electric'>('All');

  // Double Booking Prevention Check
  const isSelectedDatesDoubleBooked = useMemo(() => {
    if (!activeVehicle) return false;
    // Generate dates in range
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return true;

    const datesInRange: string[] = [];
    const current = new Date(start);
    while (current <= end) {
      const year = current.getFullYear();
      const month = String(current.getMonth() + 1).padStart(2, '0');
      const day = String(current.getDate()).padStart(2, '0');
      datesInRange.push(`${year}-${month}-${day}`);
      current.setDate(current.getDate() + 1);
    }

    // Return true if any date in range overlaps with activeVehicle.bookedDates
    return datesInRange.some(date => activeVehicle.bookedDates.includes(date));
  }, [activeVehicle, startDateStr, endDateStr]);

  // Calculate rental days
  const rentalDays = useMemo(() => {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return 1;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 0 ? 1 : diffDays;
  }, [startDateStr, endDateStr]);

  // --- ADD-ONS SELECTOR STATE ---
  const [addOnExtraInsurance, setAddOnExtraInsurance] = useState<boolean>(true); // $45/day
  const [addOnUnlimitedMileage, setAddOnUnlimitedMileage] = useState<boolean>(false); // $80/day
  const [addOnChildSeat, setAddOnChildSeat] = useState<boolean>(false); // $15/day
  const [addOnExtraDriver, setAddOnExtraDriver] = useState<boolean>(false); // $25/day
  const [addOnGoPro, setAddOnGoPro] = useState<boolean>(false); // $10/day

  // Add-ons total calculation
  const calculatedAddOnsCostPerDay = useMemo(() => {
    let sum = 0;
    if (addOnExtraInsurance) sum += 45;
    if (addOnUnlimitedMileage) sum += 80;
    if (addOnChildSeat) sum += 15;
    if (addOnExtraDriver) sum += 25;
    if (addOnGoPro) sum += 10;
    return sum;
  }, [addOnExtraInsurance, addOnUnlimitedMileage, addOnChildSeat, addOnExtraDriver, addOnGoPro]);

  // Combined Billing breakdown
  const billingBreakdown = useMemo(() => {
    const dailyBaseRate = activeVehicle?.pricePerDay || 0;
    const baseTotal = dailyBaseRate * rentalDays;
    const addOnsTotal = calculatedAddOnsCostPerDay * rentalDays;
    const airportTaxes = Math.round(baseTotal * 0.08); // 8% fee
    const protectionEscrow = activeVehicle?.rules.escrowDeposit || 2000;
    const totalDue = baseTotal + addOnsTotal + airportTaxes;
    const totalWithEscrow = totalDue + protectionEscrow;

    return {
      days: rentalDays,
      baseRate: dailyBaseRate,
      baseTotal,
      addOnsTotal,
      airportTaxes,
      protectionEscrow,
      totalDue,
      totalWithEscrow
    };
  }, [activeVehicle, rentalDays, calculatedAddOnsCostPerDay]);

  // --- IDENTITY VERIFICATION STATE ---
  const [idFileUploaded, setIdFileUploaded] = useState<boolean>(false);
  const [idVerifiedStatus, setIdVerifiedStatus] = useState<'Idle' | 'Scanning' | 'Approved' | 'Failed'>('Idle');
  const [licenseFileUploaded, setLicenseFileUploaded] = useState<boolean>(false);
  const [licenseVerifiedStatus, setLicenseVerifiedStatus] = useState<'Idle' | 'Scanning' | 'Approved'>('Idle');
  
  // Biometric Facial Scan state
  const [faceScanActive, setFaceScanActive] = useState<boolean>(false);
  const [faceScanProgress, setFaceScanProgress] = useState<number>(0);
  const [faceScanVerified, setFaceScanVerified] = useState<boolean>(false);

  // --- DIGITAL CONTRACT & E-SIGNATURE STATE ---
  const [renterNameInput, setRenterNameInput] = useState<string>('Sovereign Client');
  const [licenseNumberInput, setLicenseNumberInput] = useState<string>('DE-93821039841A');
  const [digitalSignatureInput, setDigitalSignatureInput] = useState<string>('');
  const [isContractSigned, setIsContractSigned] = useState<boolean>(false);
  
  // Custom interactive checkout step
  const [currentCheckoutStep, setCurrentCheckoutStep] = useState<1 | 2 | 3 | 4>(1); // 1: Search & Vehicle, 2: Identity Scan, 3: Sign Contract, 4: Booked Confirm

  // Condition Documentation (pre/post walkaround inspection logs)
  const [preInspectionImages, setPreInspectionImages] = useState<Array<{ label: string; uploaded: boolean; placeholder: string }>>([
    { label: 'Front Exterior Bumper', uploaded: true, placeholder: 'Factory pristine check' },
    { label: 'Passenger Quarter Panel', uploaded: true, placeholder: 'Factory pristine check' },
    { label: 'Rear Lower Diffuser', uploaded: false, placeholder: 'Camera snap required before exit' },
    { label: 'Internal Steering Gear', uploaded: false, placeholder: 'Standard safety diagnostic check' }
  ]);

  // Sovereign Smart Reminders / Chat with Agent
  const [smartNotifications, setSmartNotifications] = useState<Array<{ id: string; type: 'pickup' | 'return' | 'alert'; text: string; time: string; read: boolean }>>([
    { id: '1', type: 'alert', text: 'Identity security verification required before vehicle release block.', time: 'Just now', read: false },
    { id: '2', type: 'pickup', text: 'Scheduled departure from Munich Station Terminal C set for 18th June, 09:00 AM.', time: 'Next week', read: false }
  ]);

  // --- SECURE CHAT WITH VEHICLE DEALER ---
  const [chatInputValue, setChatInputValue] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'renter' | 'dealer'; text: string; time: string }>>([
    {
      sender: 'dealer',
      text: 'Good day from Munich High-End Fleet Services! Our technicians have finalized the high-pressure steam detailing and full mechanical pre-rental checklists on the Porsche 911 Weissach. Please assure your ID verification scan is uploaded inside this portal to release the GPS garage door codes.',
      time: '10:15 AM'
    }
  ]);

  // Active bookings state (Renter's Profile Agreements)
  const [myRentalAgreements, setMyRentalAgreements] = useState<Array<{
    bookingId: string;
    vehicle: RentalVehicle;
    startDate: string;
    endDate: string;
    totalPaid: number;
    escrowDepositAmount: number;
    status: 'Booked' | 'Active' | 'Returned';
    addonsUsed: string[];
    digitalContractName: string;
  }>>([]);

  // --- AI RENTAL CONTRACT ASSISTANT STATE ---
  const [assistantMessages, setAssistantMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string }>>([
    {
      sender: 'assistant',
      text: 'Greetings. I am the Sovereign AI Lease Analyst. Select any high-efficiency rental asset, dates, and terms, and I will summarize exact mileage thresholds, refund rules, and liability clauses instantly.'
    }
  ]);
  const [assistantInput, setAssistantInput] = useState<string>('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState<boolean>(false);

  // Handle document upload simulation
  const handleDocUpload = (docType: 'ID' | 'License') => {
    if (docType === 'ID') {
      setIdFileUploaded(true);
      setIdVerifiedStatus('Scanning');
      setTimeout(() => {
        setIdVerifiedStatus('Approved');
        setSmartNotifications(prev => [
          { id: Date.now().toString(), type: 'alert', text: '✓ Government issued Passport identity trace validated successfully.', time: 'Just now', read: false },
          ...prev
        ]);
      }, 2200);
    } else {
      setLicenseFileUploaded(true);
      setLicenseVerifiedStatus('Scanning');
      setTimeout(() => {
        setLicenseVerifiedStatus('Approved');
      }, 1800);
    }
  };

  // Simulated circular biometric scanner
  const handleTriggerFaceScan = () => {
    setFaceScanActive(true);
    setFaceScanProgress(10);
    const interval = setInterval(() => {
      setFaceScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setFaceScanVerified(true);
          setFaceScanActive(false);
          return 100;
        }
        return prev + 15;
      });
    }, 300);
  };

  // Sync AI Contract Summary when parameters change
  useEffect(() => {
    if (!activeVehicle) return;
    const summaryText = `AI LEASE POLICY MEMORANDUM (${activeVehicle.make} ${activeVehicle.model}):
• Daily base rate of $${activeVehicle.pricePerDay} is locked for ${rentalDays} days. 
• Mileage limit is strict: ${activeVehicle.rules.mileageLimit}. 
• Escrow Security Block of $${activeVehicle.rules.escrowDeposit} will be fully pre-authorized today and returned within 2 days of incident-free return.
• ${addOnExtraInsurance ? '✓ Zero-liability extra insurance is active. Driver holds $0 liability on glass/scratches.' : '⚠ You hold up to $1,000 deductibles charge if panels display scratches.'}`;

    setAssistantMessages(prev => [
      ...prev,
      { sender: 'assistant', text: summaryText }
    ]);
  }, [activeVehicle, rentalDays, addOnExtraInsurance, addOnUnlimitedMileage]);

  // Handle customer AI chat input
  const handleSendAssistantChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistantInput.trim()) return;

    const userPrompt = assistantInput;
    setAssistantMessages(prev => [...prev, { sender: 'user', text: userPrompt }]);
    setAssistantInput('');
    setIsAiAnalyzing(true);

    setTimeout(() => {
      let response = "Understood. The framework handles dynamic rental tariffs using local municipal liability rules outside Stuttgart/Munich. If you pick up this unit on the scheduled date, let security officers scan the dynamic barcode in your profile to trigger keyless engine launch.";
      if (userPrompt.toLowerCase().includes('insurance') || userPrompt.toLowerCase().includes('accident') || userPrompt.toLowerCase().includes('damage')) {
        response = `Under our Sovereign Protection tier, additional insurance coverage covers complete exterior, alloy wheels, and glass scruffs. No police ticket required for claims below $2,500.`;
      } else if (userPrompt.toLowerCase().includes('limit') || userPrompt.toLowerCase().includes('mile') || userPrompt.toLowerCase().includes('mileage')) {
        response = `This ${activeVehicle.make} rental agreement incorporates our standard limits: ${activeVehicle.rules.mileageLimit}. Exceeding this rate appends an international premium surcharge calculated inside the post-rental check spreadsheet.`;
      } else if (userPrompt.toLowerCase().includes('deposit') || userPrompt.toLowerCase().includes('money') || userPrompt.toLowerCase().includes('refund')) {
        response = `The security deposit is immediately returned as soon as our warehouse staff scans the vehicle returning back to the depot yard. No mechanical diagnostic latency applies for local cards.`;
      }
      setAssistantMessages(prev => [...prev, { sender: 'assistant', text: response }]);
      setIsAiAnalyzing(false);
    }, 1100);
  };

  // Handle secure dealer chat
  const handleSendDealerChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputValue.trim()) return;

    const renterMsg = chatInputValue;
    setChatMessages(prev => [...prev, { sender: 'renter', text: renterMsg, time: 'Just now' }]);
    setChatInputValue('');

    setTimeout(() => {
      let dealerReply = "Copy that. We have queued the technician to verify your tire compound pressure and calibrate high-performance suspension settings prior to your arrival. Have a wonderful drive!";
      if (renterMsg.toLowerCase().includes('time') || renterMsg.toLowerCase().includes('late') || renterMsg.toLowerCase().includes('hour')) {
        dealerReply = "No worries regarding late check-in! Our terminal incorporates standard 24/7 self-service automated key locker columns. Simply complete safety walkaround snaps on your mobile inside this terminal to unlock keys.";
      }
      setChatMessages(prev => [...prev, { sender: 'dealer', text: dealerReply, time: '1s ago' }]);
    }, 1300);
  };

  // Book rental checkout transition
  const handleFinalizeBooking = () => {
    const newAgreement = {
      bookingId: 'BK-' + Math.floor(Math.random() * 900000 + 100000),
      vehicle: activeVehicle,
      startDate: startDateStr,
      endDate: endDateStr,
      totalPaid: billingBreakdown.totalDue,
      escrowDepositAmount: billingBreakdown.protectionEscrow,
      status: 'Booked' as const,
      addonsUsed: [
        addOnExtraInsurance ? 'Sovereign Absolute Insurance' : 'Standard Protection',
        addOnUnlimitedMileage ? 'Unlimited Mileage' : 'Daily limit cap applied',
        addOnChildSeat ? 'Child Booster' : '',
        addOnExtraDriver ? 'Alternate Operator Cert' : ''
      ].filter(Boolean),
      digitalContractName: `Signed_Contract_${activeVehicle.make}_${Date.now()}.pdf`
    };

    setMyRentalAgreements(prev => [newAgreement, ...prev]);

    // Track booked dates inside vehicle
    setVehicles(prev => prev.map(v => {
      if (v.id === activeVehicle.id) {
        // compute and append booked dates
        const start = new Date(startDateStr);
        const end = new Date(endDateStr);
        const dates: string[] = [...v.bookedDates];
        const current = new Date(start);
        while (current <= end) {
          const year = current.getFullYear();
          const month = String(current.getMonth() + 1).padStart(2, '0');
          const day = String(current.getDate()).padStart(2, '0');
          const f = `${year}-${month}-${day}`;
          if (!dates.includes(f)) dates.push(f);
          current.setDate(current.getDate() + 1);
        }
        return { ...v, bookedDates: dates };
      }
      return v;
    }));

    setCurrentCheckoutStep(4);
    setSmartNotifications(prev => [
      { id: Date.now().toString(), type: 'pickup', text: `⚡ Rental Confirmed! Dynamic Key Locker barcode generated inside your Renter Profile.`, time: 'Just now', read: false },
      ...prev
    ]);
  };

  // Filter cars based on simple selector
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      if (filterVehicleType === 'Track' && !v.model.includes('911')) return false;
      if (filterVehicleType === 'SUV' && !v.make.includes('Mercedes')) return false;
      if (filterVehicleType === 'Electric' && v.id !== 'RENT-TESLA-PLAID' && v.id !== 'RENT-AUDI-ETRON') return false;
      return true;
    });
  }, [vehicles, filterVehicleType]);

  return (
    <div className="space-y-6 py-4 text-slate-800 font-sans" id="hyper-car-rental-complex-division">
      
      {/* 1. TOP HEADER - PREMIUM 3D LOOK */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B0000]/2 rounded-full blur-[80px] pointer-events-none" />
        <div className="space-y-1">
          <h2 className="text-xl font-black text-[#8B0000] tracking-tight uppercase">Premium Car Rentals</h2>
        </div>
      </div>

      {/* 2. DATE & LOCATION SELECTOR - 3D LOOK */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="text-left border-b border-slate-100 pb-3">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
            <Calendar className="w-5 h-5 text-[#8B0000]" /> Select Dates &amp; Location
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
          {/* Pickup location */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Where to Pick Up</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 pl-9 py-2 text-xs text-slate-700 cursor-pointer outline-none focus:border-[#8B0000] transition-all shadow-sm"
              >
                <option value="Munich Terminal Block C">Munich Terminal Block C (Germany)</option>
                <option value="Berlin-Schönefeld Hub A">Berlin-Schönefeld Hub A (Germany)</option>
                <option value="Stuttgart Airport West Port">Stuttgart Airport West Port (Germany)</option>
              </select>
            </div>
          </div>

          {/* Dates selectors */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Start Date</label>
            <input
              type="date"
              value={startDateStr}
              min="2026-06-15"
              max="2026-07-31"
              onChange={(e) => setStartDateStr(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 cursor-pointer outline-none focus:border-[#8B0000] transition-all shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">End Date</label>
            <input
              type="date"
              value={endDateStr}
              min={startDateStr}
              max="2026-07-31"
              onChange={(e) => setEndDateStr(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 cursor-pointer outline-none focus:border-[#8B0000] transition-all shadow-sm"
            />
          </div>

          {/* Type filters */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Filter Cars</label>
            <div className="grid grid-cols-4 gap-1.5 text-[10px] font-bold text-center">
              {(['All', 'Track', 'SUV', 'Electric'] as const).map(ty => (
                <button
                  key={ty}
                  type="button"
                  onClick={() => setFilterVehicleType(ty)}
                  className={`py-2 rounded-xl border font-black transition-all cursor-pointer ${
                    filterVehicleType === ty
                      ? 'bg-[#8B0000] text-white border-[#8B0000] shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  {ty}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time calendar visual grid block */}
        {activeVehicle && (
          <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-200/80 text-left space-y-2 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)]">
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>
                Availability Calendar
              </span>
              <span>June 2026</span>
            </div>
            
            {/* June 2026 Month strip */}
            <div className="grid grid-cols-5 sm:grid-cols-15 gap-1.5 text-center font-sans">
              {Array.from({ length: 15 }, (_, i) => {
                const dayNum = 15 + i; // June 15 to 29
                const dateString = `2026-06-${dayNum}`;
                const isBooked = activeVehicle.bookedDates.includes(dateString);
                
                // Check if this falls in currently selected range
                const start = new Date(startDateStr);
                const end = new Date(endDateStr);
                const curr = new Date(dateString);
                const isCurrentSelection = curr >= start && curr <= end;

                return (
                  <div 
                    key={dayNum} 
                    className={`p-1.5 rounded-xl border text-[11px] flex flex-col justify-between h-12 transition-all ${
                      isBooked 
                        ? 'bg-red-50/50 border-red-100 text-[#8B0000] opacity-50 font-bold' 
                        : isCurrentSelection
                          ? 'bg-[#8B0000] border-[#8B0000] text-white font-extrabold'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    <span className="text-[9px] block font-extrabold">Jun {dayNum}</span>
                    <span className="text-[8px] font-black uppercase leading-none">
                      {isBooked ? 'Taken' : isCurrentSelection ? 'Select' : 'Free'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. CORE INTERACTIVE CHECKOUT STEPS TIMELINE */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl p-3 max-w-md mx-auto shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center transition-all ${
            currentCheckoutStep >= 1 ? 'bg-[#8B0000] text-white' : 'bg-slate-100 text-slate-400'
          }`}>1</span>
          <span className="text-[10px] font-extrabold text-slate-600 uppercase">Select Car</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />

        <div className="flex items-center gap-1.5">
          <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center transition-all ${
            currentCheckoutStep >= 2 ? 'bg-[#8B0000] text-white' : 'bg-slate-100 text-slate-400'
          }`}>2</span>
          <span className="text-[10px] font-extrabold text-slate-600 uppercase">Your ID</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />

        <div className="flex items-center gap-1.5">
          <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center transition-all ${
            currentCheckoutStep >= 3 ? 'bg-[#8B0000] text-white' : 'bg-slate-100 text-slate-400'
          }`}>3</span>
          <span className="text-[10px] font-extrabold text-slate-600 uppercase">Sign Contract</span>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />

        <div className="flex items-center gap-1.5">
          <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center transition-all ${
            currentCheckoutStep >= 4 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'
          }`}>✓</span>
          <span className="text-[10px] font-extrabold text-slate-600 uppercase">Confirm</span>
        </div>
      </div>

      {/* 4. MAIN DOUBLE BLOCK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
        
        {/* LEFT COMPONENT COLUMN (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* STEP 1: CHOOSE VEHICLE STANDARD CAR LISTING */}
          {currentCheckoutStep === 1 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Available Rental Fleet</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredVehicles.map((car) => {
                  const isCurActive = car.id === selectedVehicleId;
                  return (
                    <div
                      key={car.id}
                      onClick={() => {
                        setSelectedVehicleId(car.id);
                      }}
                      className={`border rounded-2xl overflow-hidden transition-all text-left cursor-pointer group flex flex-col justify-between h-auto ${
                        isCurActive 
                          ? 'border-[#8B0000] bg-red-50/[0.01] shadow-xs' 
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-sm'
                      }`}
                    >
                      <div className="relative h-32 bg-slate-100 shrink-0 overflow-hidden">
                        <img 
                          src={car.image} 
                          alt={`${car.make} ${car.model}`}
                          className="w-full h-full object-cover transition-transform duration-350 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />

                        {/* Cost per day Overlay - Blood Red */}
                        <div className="absolute bottom-2.5 right-2.5 bg-[#8B0000] text-[#ffffff] px-2.5 py-1 rounded-xl text-[10px] font-black shadow-md uppercase tracking-wider">
                          ${car.pricePerDay} / day
                        </div>
                      </div>

                      <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between bg-white">
                        <div>
                          <h4 className="text-xs font-black text-slate-900 uppercase leading-snug tracking-tight">
                            {car.year} {car.make} {car.model}
                          </h4>
                        </div>

                        {/* Standardized condition tag in simple english */}
                        <div className="bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl text-[10px] text-slate-600 flex justify-between items-center">
                          <span className="font-extrabold text-slate-400 uppercase tracking-wider text-[8px]">Condition:</span>
                          <span className="font-black text-slate-700">{car.condition.split(' ')[0]} Excellent</span>
                        </div>

                        {/* Specs strip in simple english */}
                        <div className="text-[10px] text-slate-500 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 font-medium">
                          <div>
                            <span className="block text-slate-400 text-[8px] uppercase font-bold">Engine</span>
                            <span className="font-extrabold text-slate-800 block truncate">{car.engine.split(' ')[0]}</span>
                          </div>
                          <div>
                            <span className="block text-slate-400 text-[8px] uppercase font-bold">Gearbox</span>
                            <span className="font-extrabold text-slate-800 block truncate">{car.transmission.split(' ')[0]}</span>
                          </div>
                          <div>
                            <span className="block text-slate-400 text-[8px] uppercase font-bold">Power</span>
                            <span className="font-extrabold text-slate-800 block">{car.horsepower} HP</span>
                          </div>
                        </div>

                        <div className="flex justify-end items-center pt-1">
                          <span className={`text-[10px] font-extrabold py-2 px-4 rounded-full border uppercase transition-all shadow-sm ${
                            isCurActive 
                              ? 'bg-[#8B0000] text-white border-[#8B0000] font-black' 
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-855'
                          }`}>
                            {isCurActive ? 'Selected' : 'Choose This Car'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Warnings and Double Book warning info - Simplified English & Clean 3D white/blood red theme */}
              {isSelectedDatesDoubleBooked && (
                <div className="p-3 bg-white border border-[#8B0000] rounded-2xl text-slate-800 text-xs flex gap-2.5 items-start shadow-sm">
                  <AlertTriangle className="w-4 h-4 text-[#8B0000] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-black block uppercase text-[10px] text-[#8B0000] tracking-wide">Selected Dates Not Available</span>
                    These dates are already booked. Please choose other dates or select another car.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: IDENTITY VERIFICATION */}
          {currentCheckoutStep === 2 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-5 shadow-sm">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                  <Fingerprint className="w-5 h-5 text-[#8B0000]" /> Verify Your Identity
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                {/* Government check */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl text-left space-y-3 shadow-xs">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="font-extrabold text-slate-800 uppercase text-[10px]">1. Passport or Government ID</span>
                    <span className="text-[9px] font-bold text-slate-400">Required</span>
                  </div>
                  
                  {idVerifiedStatus === 'Approved' ? (
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center text-emerald-800 space-y-1.5 shadow-sm">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                      <span className="font-black block uppercase text-[10px]">Verified Successfully</span>
                      <p className="text-[10px] text-slate-500 font-mono">ID Number: DE-90382B104A</p>
                    </div>
                  ) : idVerifiedStatus === 'Scanning' ? (
                    <div className="p-6 text-center space-y-2">
                      <RefreshCw className="w-6 h-6 text-amber-500 animate-spin mx-auto" />
                      <span className="text-amber-600 font-bold text-[10px] uppercase block animate-pulse">Checking ID details...</span>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="bg-white border-2 border-dashed border-slate-200 hover:border-[#8B0000] p-4 rounded-xl text-center cursor-pointer hover:bg-red-50/10 transition-colors" onClick={() => handleDocUpload('ID')}>
                        <UploadCloud className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                        <span className="font-extrabold text-slate-700 text-xs block">Upload ID Photo</span>
                        <p className="text-[9px] text-slate-400">PDF or JPG formats up to 12MB</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Driver license check */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl text-left space-y-3 shadow-xs">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="font-extrabold text-slate-800 uppercase text-[10px]">2. Driver's License</span>
                    <span className="text-[9px] font-bold text-slate-400">Required</span>
                  </div>

                  {licenseVerifiedStatus === 'Approved' ? (
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center text-emerald-800 space-y-1.5 shadow-sm">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                      <span className="font-black block uppercase text-[10px]">License Verified</span>
                      <p className="text-[10px] text-slate-500 font-mono">Driving license verified</p>
                    </div>
                  ) : licenseVerifiedStatus === 'Scanning' ? (
                    <div className="p-6 text-center space-y-2">
                      <RefreshCw className="w-6 h-6 text-amber-500 animate-spin mx-auto" />
                      <span className="text-amber-600 font-bold text-[10px] uppercase block animate-pulse">Checking license...</span>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="bg-white border-2 border-dashed border-slate-200 hover:border-[#8B0000] p-4 rounded-xl text-center cursor-pointer hover:bg-red-50/10 transition-colors" onClick={() => handleDocUpload('License')}>
                        <UploadCloud className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                        <span className="font-extrabold text-slate-700 text-xs block">Upload License Photo</span>
                        <p className="text-[9px] text-slate-400">Must be active and valid</p>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Circular Biometric Scanner */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
                <span className="text-[10px] text-slate-500 block font-black uppercase tracking-wider mb-3">3. Face Verification</span>
                
                <div className="max-w-xs mx-auto space-y-4">
                  {faceScanVerified ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center text-xs space-y-1 text-emerald-800 shadow-sm">
                      <UserCheck className="w-8 h-8 text-emerald-600 mx-auto" />
                      <span className="font-black block uppercase text-[10px]">Face Match Successful</span>
                      <p className="text-[10px] text-slate-500">Your face matches your passport photo.</p>
                    </div>
                  ) : faceScanActive ? (
                    <div className="space-y-3">
                      <div className="relative w-24 h-24 rounded-full border-4 border-[#8B0000] overflow-hidden mx-auto flex items-center justify-center bg-slate-900">
                        <div className="absolute top-0 bottom-0 left-0 right-0 bg-[#8B0000]/20 animate-pulse" />
                        <span className="text-white font-mono text-sm font-black">{faceScanProgress}%</span>
                      </div>
                      <span className="text-slate-500 text-[10px] block animate-pulse">Please hold still and face the camera.</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleTriggerFaceScan}
                      className="w-full py-2.5 bg-[#8B0000] hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase cursor-pointer transition-colors shadow-sm"
                    >
                      Start Camera Scan
                    </button>
                  )}
                </div>
              </div>

              {/* Clear next lock button */}
              <div className="flex justify-end pt-2">
                <button
                  disabled={idVerifiedStatus !== 'Approved' || licenseVerifiedStatus !== 'Approved' || !faceScanVerified}
                  onClick={() => setCurrentCheckoutStep(3)}
                  className="px-6 py-2.5 bg-[#8B0000] hover:bg-red-700 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-black uppercase rounded-xl cursor-pointer transition-colors shadow-sm"
                >
                  Continue to Contract
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DIGITAL CONTRACT GENERATION + E-SIGNATURE */}
          {currentCheckoutStep === 3 && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight font-display flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-505" /> Digital Lease Agreement e-Signature
                </h3>
                <p className="text-xs text-slate-500">Legally binding vehicle rental agreement registered inside Swiss broker frameworks</p>
              </div>

              {/* Contract Preview Card */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-[11.5px] leading-relaxed text-slate-700 space-y-3 max-h-[300px] overflow-y-auto font-mono text-left scrollbar-thin">
                <h4 className="text-xs font-black text-slate-900 text-center uppercase tracking-wider border-b pb-2">
                  SOVEREIGN FLEET CHARTER CONTRACT #SF-{activeVehicle.id.split('-')[1]}-{Date.now().toString().slice(0,5)}
                </h4>
                
                <p>
                  This Charter Agreement enters into force on <strong className="text-slate-905">{startDateStr}</strong>, by and between Munich High-End Fleet Services ("Lessor") and <strong className="text-slate-905">{renterNameInput}</strong> ("Lessee"), holding registered Driver License <strong className="text-slate-905">{licenseNumberInput}</strong>.
                </p>

                <p className="font-bold text-slate-900 uppercase text-[10px]">ARTICLE I: VEHICLE SPECIFICATIONS</p>
                <p>
                  Lessor hereby releases a high-efficiency <strong className="text-slate-905">{activeVehicle.year} {activeVehicle.make} {activeVehicle.model}</strong>, with active VIN <strong className="text-slate-905">{activeVehicle.vin}</strong>. Standardized factory valuation condition score represents {activeVehicle.condition}.
                </p>

                <p className="font-bold text-slate-900 uppercase text-[10px]">ARTICLE II: MILEAGE &amp; LIABILITY RULES</p>
                <p>
                  This lease incorporates a maximum threshold representation of {activeVehicle.rules.mileageLimit}. Exceeding this rate appends surcharge limits calculated on return. {activeVehicle.rules.excessFee}. An escrow buffer amount of $ {activeVehicle.rules.escrowDeposit} must be frozen today.
                </p>

                <p className="font-bold text-slate-900 uppercase text-[10px]">ARTICLE III: SECURITY DISPUTES &amp; RETREAT</p>
                <p>
                  Any scratch or mechanical misalignment from track operations must be documented on walkaround checklist files within this console prior to ignition trigger release.
                </p>

                <div className="pt-3 border-t text-[10px] text-slate-500 uppercase flex justify-between">
                  <span>LESSEE CAP: {renterNameInput.toUpperCase()}</span>
                  <span>IP CODE: 192.168.1.1 (Biometric Face ID Bound)</span>
                </div>
              </div>

              {/* Renter information typing inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">FULL LEGAL NAME</label>
                  <input
                    type="text"
                    value={renterNameInput}
                    onChange={(e) => setRenterNameInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800 outline-none focus:border-slate-350"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">DRIVER LICENSE NUMBER</label>
                  <input
                    type="text"
                    value={licenseNumberInput}
                    onChange={(e) => setLicenseNumberInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-800 outline-none focus:border-slate-350"
                  />
                </div>
              </div>

              {/* E-Signature Input */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <label className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block text-left">
                  SIGN MANUALLY (TYPE YOUR LEGAL NAME TO SEAL E-SIGNATURE)
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                  <input
                    type="text"
                    value={digitalSignatureInput}
                    onChange={(e) => {
                      setDigitalSignatureInput(e.target.value);
                      setIsContractSigned(e.target.value.length > 3);
                    }}
                    placeholder="Type legal signature..."
                    className="md:col-span-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-slate-350"
                  />

                  {/* High quality cursive handwriting preview font style block */}
                  <div className="p-3 bg-white border border-slate-205 rounded-xl h-10 flex items-center justify-center relative overflow-hidden select-none">
                    <span className="italic font-serif text-sm font-semibold tracking-wider text-indigo-700">
                      {digitalSignatureInput || 'e-Signature Preview'}
                    </span>
                    <div className="absolute top-1 right-2 text-[6.5px] font-mono text-slate-400">Certified Secure</div>
                  </div>
                </div>
              </div>

              {/* Finish Booking trigger */}
              <div className="flex justify-between items-center pt-4">
                <button
                  onClick={() => setCurrentCheckoutStep(2)}
                  className="px-4 py-2.5 bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-800 transition-colors rounded-xl font-bold uppercase text-xs cursor-pointer shadow-xs"
                >
                  Back
                </button>

                <button
                  disabled={!isContractSigned}
                  onClick={handleFinalizeBooking}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-black uppercase rounded-xl cursor-pointer transition-colors shadow-sm"
                >
                  Seal Agreement
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS ACTIVE RENTAL PROFILE GENERATED */}
          {currentCheckoutStep === 4 && (
            <div className="bg-emerald-50/20 border border-emerald-200 rounded-2xl p-6 text-center space-y-5 relative overflow-hidden shadow-xs">
              <div className="space-y-1.5">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="text-base font-black text-slate-900 uppercase text-center tracking-tight">Lease Signed Successfully!</h3>
                <p className="text-xs text-slate-500 text-center max-w-sm mx-auto leading-relaxed">
                  Your lease agreement has been secured. Your digital entry code will activate on {startDateStr}.
                </p>
              </div>

              {/* Dynamic Key Locker Code card */}
              <div className="bg-white border border-slate-200 p-4 rounded-2xl max-w-xs mx-auto text-left space-y-3 shadow-xs">
                <div className="flex justify-between items-center border-b pb-1.5 border-slate-100">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">GPS Key Box</span>
                  <span className="text-[9px] text-emerald-600 font-extrabold uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-md">Active</span>
                </div>

                <div className="flex items-center gap-4">
                  {/* barcode graphic box */}
                  <div className="bg-white border border-slate-200 p-1.5 rounded-xl shrink-0 flex flex-col gap-1 justify-center items-center shadow-sm">
                    <div className="h-6 w-16 bg-slate-900 flex gap-0.5 items-stretch p-0.5">
                      {Array.from({ length: 10 }).map((_, bi) => (
                        <div key={bi} className={`bg-white`} style={{ width: bi % 2 === 0 ? '1px' : '2px' }} />
                      ))}
                    </div>
                    <span className="text-[6px] font-mono text-slate-500 font-bold">90382-GT3</span>
                  </div>

                  <div className="text-xs space-y-0.5">
                    <span className="font-black text-slate-800 block text-xs">
                      {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
                    </span>
                    <span className="text-slate-500 font-mono text-[10px] block font-extrabold">PIN CODE: *8309*</span>
                  </div>
                </div>
              </div>

              {/* Inspection logs walkaround snaps */}
              <div className="bg-white border border-slate-200 p-4 rounded-2xl text-left space-y-3 max-w-xs mx-auto text-xs shadow-xs">
                <div>
                  <h4 className="font-extrabold text-slate-900 uppercase text-[10px] flex items-center gap-1.5 tracking-wide">
                    <Camera className="w-4 h-4 text-[#8B0000]" /> Walkaround Snaps
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-normal">Take pre-rental photos of the car to protect your deposit.</p>
                </div>

                <div className="space-y-2">
                  {preInspectionImages.map((inspect, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                      <div>
                        <span className="text-[10px] font-bold text-slate-700 block">{inspect.label}</span>
                      </div>

                      {inspect.uploaded ? (
                        <span className="text-[8px] font-mono font-black text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-md">
                          Uploaded
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setPreInspectionImages(prev => prev.map((item, ii) => ii === idx ? { ...item, uploaded: true } : item));
                          }}
                          className="text-[9px] font-mono font-black text-white bg-[#8B0000] border border-[#8B0000] px-2.5 py-1 rounded-lg uppercase cursor-pointer transition-colors"
                        >
                          Snap
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentCheckoutStep(1);
                    setDigitalSignatureInput('');
                    setIsContractSigned(false);
                  }}
                  className="px-6 py-2.5 bg-[#8B0000] hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase cursor-pointer transition-colors shadow-sm"
                >
                  Book Another Car
                </button>
              </div>
            </div>
          )}

          {/* RENTER'S PROFILE RENTAL HISTORICAL LISTING */}
          {myRentalAgreements.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="border-b pb-3 text-left border-slate-100">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">My Active Bookings ({myRentalAgreements.length})</h4>
              </div>

              <div className="space-y-3">
                {myRentalAgreements.map(agree => (
                  <div key={agree.bookingId} className="p-3 bg-slate-50 border border-slate-250 rounded-2xl flex gap-3 justify-between items-center text-xs shadow-xs">
                    <div className="flex gap-3 items-center text-left">
                      <img src={agree.vehicle.image} alt="" className="w-12 h-10 object-cover rounded-xl" />
                      <div className="space-y-1">
                        <span className="font-extrabold text-slate-800 block uppercase leading-none text-xs">
                          {agree.vehicle.make} {agree.vehicle.model}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 block">
                          Booking ID: {agree.bookingId} • {agree.startDate} to {agree.endDate}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 text-right space-y-1">
                      <div className="flex gap-2 items-center justify-end">
                        <span className="text-[10px] bg-red-50 text-[#8B0000] border border-red-100 px-2 py-0.5 rounded-lg font-bold">
                          Deposit: ${agree.escrowDepositAmount}
                        </span>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-150 px-2 py-0.5 rounded-lg font-black uppercase">
                          {agree.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECURE CHAT INTERACTIVE WIDGET FOR RENTAL COMPANY */}
          {activeVehicle && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
              <div className="flex justify-between items-center border-b pb-3 border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span className="bg-red-50 p-1.5 rounded-xl block"><MessageSquare className="w-4 h-4 text-[#8B0000]" /></span>
                  <div className="text-left">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Customer Support</h4>
                  </div>
                </div>
              </div>

              {/* Chat strip list */}
              <div className="bg-slate-50 rounded-2xl p-3 h-[130px] overflow-y-auto space-y-2.5 scrollbar-thin">
                {chatMessages.map((cm, idx) => (
                  <div key={idx} className={`flex flex-col ${cm.sender === 'renter' ? 'items-end' : 'items-start'}`}>
                    <span className="text-[9px] font-bold text-slate-400 mb-0.5 px-1">
                      {cm.sender === 'renter' ? 'You' : 'Agent'} • {cm.time}
                    </span>
                    <div className={`text-xs px-3.5 py-2 rounded-2xl max-w-[85%] text-left shadow-sm ${
                      cm.sender === 'renter' 
                        ? 'bg-[#8B0000] text-[#ffffff] rounded-tr-none' 
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                    }`}>
                      {cm.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendDealerChat} className="flex gap-2">
                <input
                  type="text"
                  value={chatInputValue}
                  onChange={(e) => setChatInputValue(e.target.value)}
                  placeholder="Need extras or help?"
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#8B0000] text-slate-850"
                />
                <button
                  type="submit"
                  className="bg-[#8B0000] hover:bg-red-700 text-white rounded-xl px-4 py-2 text-xs font-black uppercase cursor-pointer transition-colors shadow-sm"
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </div>

        {/* RIGHT ASSISTANT / BILLINGS COLUMN (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* AI RENTAL ASSISTANT COMPLY MODULE */}
          {/* AI RENTAL ASSISTANT MODULE */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm text-left">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-1.5">
                <span className="bg-red-50 p-1.5 rounded-xl">
                  <Sparkles className="w-4 h-4 text-[#8B0000]" />
                </span>
                <div>
                  <h4 className="text-sm font-black uppercase text-slate-900 tracking-tight">AI Assistant</h4>
                </div>
              </div>
            </div>

            {/* Micro Chat area */}
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-3.5 space-y-2.5 max-h-[140px] overflow-y-auto font-sans scrollbar-thin text-xs">
              {assistantMessages.map((am, ai) => (
                <div key={ai} className="space-y-0.5 text-left border-b border-slate-200/40 pb-1.5 last:border-0 last:pb-0">
                  <span className={`text-[10px] font-black uppercase tracking-wider ${am.sender === 'user' ? 'text-slate-400' : 'text-[#8B0000]'}`}>
                    {am.sender === 'user' ? 'You' : 'AI Assistant'}
                  </span>
                  <p className="text-slate-700 leading-normal whitespace-pre-wrap font-medium">
                    {am.text}
                  </p>
                </div>
              ))}

              {isAiAnalyzing && (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8B0000] animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>AI is thinking...</span>
                </div>
              )}
            </div>

            {/* Prompt send input */}
            <form onSubmit={handleSendAssistantChat} className="flex gap-2">
              <input
                type="text"
                value={assistantInput}
                onChange={(e) => setAssistantInput(e.target.value)}
                placeholder="Ask about rental terms..."
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:border-[#8B0000] transition-all"
              />
              <button
                type="submit"
                className="bg-[#8B0000] hover:bg-red-700 text-white rounded-xl px-4 py-2 text-xs font-black uppercase cursor-pointer shrink-0 transition-colors shadow-sm"
              >
                Ask
              </button>
            </form>
          </div>

          {/* DYNAMIC AMENITIES / ADD-ONS SELECTOR */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm text-left">
            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[#8B0000]" /> Add-Ons &amp; Coverages
              </h4>
            </div>

            <div className="space-y-3.5 text-xs font-bold font-sans">
              
              {/* Addon 1: extra insurance */}
              <div 
                onClick={() => setAddOnExtraInsurance(!addOnExtraInsurance)}
                className={`px-4 py-2.5 rounded-full border cursor-pointer select-none transition-colors flex justify-between items-center ${
                  addOnExtraInsurance 
                    ? 'bg-red-50/10 text-[#8B0000] border-[#8B0000] font-black' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-850'
                }`}
              >
                <div>
                  <span className="uppercase text-[11px] tracking-tight">Full Damage Cover (No Excess)</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-extrabold text-[11px] font-mono">+$45/day</span>
                </div>
              </div>

              {/* Addon 2: mileage packages */}
              <div 
                onClick={() => setAddOnUnlimitedMileage(!addOnUnlimitedMileage)}
                className={`px-4 py-2.5 rounded-full border cursor-pointer select-none transition-colors flex justify-between items-center ${
                  addOnUnlimitedMileage
                    ? 'bg-red-50/10 text-[#8B0000] border-[#8B0000] font-black' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-850'
                }`}
              >
                <div>
                  <span className="uppercase text-[11px] tracking-tight">Unlimited Miles Package</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-extrabold text-[11px] font-mono">+$80/day</span>
                </div>
              </div>

              {/* Addon 3: Child seat */}
              <div 
                onClick={() => setAddOnChildSeat(!addOnChildSeat)}
                className={`px-4 py-2.5 rounded-full border cursor-pointer select-none transition-colors flex justify-between items-center ${
                  addOnChildSeat
                    ? 'bg-red-50/10 text-[#8B0000] border-[#8B0000] font-black' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-850'
                }`}
              >
                <div>
                  <span className="uppercase text-[11px] tracking-tight">Premium Child Seat</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-extrabold text-[11px] font-mono">+$15/day</span>
                </div>
              </div>

              {/* Addon 4: extra approved drivers */}
              <div 
                onClick={() => setAddOnExtraDriver(!addOnExtraDriver)}
                className={`px-4 py-2.5 rounded-full border cursor-pointer select-none transition-colors flex justify-between items-center ${
                  addOnExtraDriver
                    ? 'bg-red-50/10 text-[#8B0000] border-[#8B0000] font-black' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-850'
                }`}
              >
                <div>
                  <span className="uppercase text-[11px] tracking-tight">Add Second Driver</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-extrabold text-[11px] font-mono">+$25/day</span>
                </div>
              </div>

            </div>
          </div>

                    {/* BOOKING CHECKOUT COST MATRIX CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm text-left font-sans">
            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Price Breakdown</h4>
            </div>

            <div className="space-y-2 text-xs font-medium">
              <div className="flex justify-between text-slate-500">
                <span>Base Price ({activeVehicle.make}):</span>
                <span className="font-extrabold text-slate-800">${activeVehicle.pricePerDay} USD</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Total Days:</span>
                <span className="font-extrabold text-slate-800">{rentalDays} days</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span className="font-extrabold text-slate-800">${billingBreakdown.baseTotal.toLocaleString()} USD</span>
              </div>
              {billingBreakdown.addOnsTotal > 0 && (
                <div className="flex justify-between text-[#8B0000]">
                  <span className="font-extrabold">Add-ons:</span>
                  <span className="font-black">+${billingBreakdown.addOnsTotal.toLocaleString()} USD</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500 border-b border-slate-150 pb-2">
                <span>Taxes (8%):</span>
                <span className="font-extrabold text-slate-800">${billingBreakdown.airportTaxes} USD</span>
              </div>
              
              <div className="flex justify-between text-emerald-700 pt-1">
                <span className="font-extrabold">Security Deposit (Refundable):</span>
                <span className="font-black">${billingBreakdown.protectionEscrow.toLocaleString()} USD</span>
              </div>

              <div className="border-t border-slate-150 pt-3 space-y-1.5">
                <div className="flex justify-between text-slate-900 text-sm">
                  <span className="font-black">Pay Now:</span>
                  <span className="font-black text-[#8B0000]">${billingBreakdown.totalDue.toLocaleString()} USD</span>
                </div>
                <div className="flex justify-between text-slate-400 text-xs">
                  <span className="font-extrabold">Total with Deposit:</span>
                  <span className="font-extrabold">${billingBreakdown.totalWithEscrow.toLocaleString()} USD</span>
                </div>
              </div>
            </div>

            {currentCheckoutStep === 1 && (
              <button
                type="button"
                onClick={() => setCurrentCheckoutStep(2)}
                disabled={isSelectedDatesDoubleBooked}
                className="w-full py-2.5 bg-[#8B0000] hover:bg-red-700 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl text-center text-xs font-black uppercase cursor-pointer transition-colors shadow-sm block"
              >
                {isSelectedDatesDoubleBooked ? 'Dates Locked' : 'Book Car'}
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

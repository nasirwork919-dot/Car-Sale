/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Gavel, Clock, Sparkles, Shield, User, MapPin, Calendar, MessageSquare, 
  Send, Search, Filter, AlertTriangle, ArrowRight, CheckCircle2, ChevronRight, 
  Truck, HelpCircle, FileText, Lock, Plus, Database, DollarSign, ArrowLeft,
  X, Compass, Eye, ShieldCheck, History, Landmark, SlidersHorizontal, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Vehicle } from '../types';
import { api, ApiError } from '../lib/api';
import { useAuth } from '../lib/AuthContext';

export interface AuctionListing {
  id: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  image: string;
  currentBid: number;
  reservePrice: number;
  reserveStatus: 'No Reserve' | 'Reserve Met' | 'Reserve Pending';
  startingBid: number;
  timeLeft: number; // in seconds
  durationDays: number;
  bidsCount: number;
  location: string;
  sellerName: string;
  sellerRating: number;
  valuation: number; // platform valuation
  history: Array<{ bidder: string; amount: number; time: string; verified: boolean }>;
  inspectionReportUrl?: string;
  category: 'Sports' | 'Executive' | 'SUV' | 'Electric' | 'Classic';
  riskScore: 'Low' | 'Medium' | 'High';
  customsTaxDetails: string;
}

export default function AuctionsSection() {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState<AuctionListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAuctionId, setSelectedAuctionId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAuctions() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get('/auctions');
        // The backend returns an array of auction objects. We need to map them to AuctionListing.
        const mapped: AuctionListing[] = data.map((a: any) => ({
          id: a.id,
          vin: a.vehicle.vin,
          year: a.vehicle.year,
          make: a.vehicle.make,
          model: a.vehicle.model,
          trim: a.vehicle.bodyType || '',
          image: a.vehicle.photos?.find((p: any) => p.isPrimary)?.url || a.vehicle.photos?.[0]?.url || 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=800',
          currentBid: a.currentBid,
          reservePrice: a.reservePrice || 0,
          reserveStatus: a.reservePrice ? (a.currentBid >= a.reservePrice ? 'Reserve Met' : 'Reserve Pending') : 'No Reserve',
          startingBid: a.startingPrice,
          timeLeft: Math.max(0, Math.floor((new Date(a.endTime).getTime() - Date.now()) / 1000)),
          durationDays: Math.ceil((new Date(a.endTime).getTime() - new Date(a.startTime).getTime()) / (1000 * 3600 * 24)),
          bidsCount: a._count?.bids || 0, // Assuming _count.bids is included if we want real count, or we'll get it from auction detail
          location: `${a.vehicle.city}, ${a.vehicle.country}`,
          sellerName: `${a.seller.firstName} ${a.seller.lastName}`,
          sellerRating: 4.8, // Mock as backend doesn't have it yet
          valuation: a.vehicle.price, // Using vehicle price as valuation for now
          category: 'Executive', // Mock category
          riskScore: 'Low',
          customsTaxDetails: 'Local registration files verified.',
          history: [] // History is fetched per auction
        }));
        setAuctions(mapped);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Failed to load auctions');
      } finally {
        setLoading(false);
      }
    }
    fetchAuctions();
  }, []);

  // Sync selected auction details if one is selected
  useEffect(() => {
    if (!selectedAuctionId) return;

    async function fetchDetails() {
      try {
        const a = await api.get(`/auctions/${selectedAuctionId}`);
        const mappedHistory = (a.bids || []).map((b: any) => ({
          bidder: `${b.bidder.firstName} ${b.bidder.lastName.charAt(0)}.`,
          amount: b.amount,
          time: new Date(b.createdAt).toLocaleTimeString(),
          verified: true
        }));

        setAuctions(prev => prev.map(auc => {
          if (auc.id === selectedAuctionId) {
            return {
              ...auc,
              currentBid: a.currentBid,
              bidsCount: a.bids?.length || 0,
              history: mappedHistory,
              reserveStatus: a.reservePrice ? (a.currentBid >= a.reservePrice ? 'Reserve Met' : 'Reserve Pending') : 'No Reserve',
            };
          }
          return auc;
        }));
      } catch (err) {
        console.error('Failed to fetch auction details', err);
      }
    }

    fetchDetails();
    const interval = setInterval(fetchDetails, 10000); // Poll every 10s for bids
    return () => clearInterval(interval);
  }, [selectedAuctionId]);

  // Search, sorting & filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDuration, setSelectedDuration] = useState<string>('All'); // 24h, 48h, 72h, 7-day
  const [reserveFilter, setReserveFilter] = useState<string>('All'); // No Reserve, Reserve Met, Reserve Pending

  // User Bidding / Dashboard State
  const [bidderSecurityDeposit, setBidderSecurityDeposit] = useState<number>(1000); // starts registered with $1,000 baseline
  const [isDepositing, setIsDepositing] = useState(false);
  const [depositAmountInput, setDepositAmountInput] = useState('1500');

  // Interactive bidding input
  const [userBidValue, setUserBidValue] = useState<string>('');
  const [hasBookedInspectionForActive, setHasBookedInspectionForActive] = useState<Record<string, boolean>>({});

  // Scheduler modal
  const [showInspectionScheduler, setShowInspectionScheduler] = useState(false);
  const [schedulingDate, setSchedulingDate] = useState('2026-06-20');
  const [schedulingTimeSlot, setSchedulingTimeSlot] = useState('14:00 - 15:30');
  const [selectedInspectorFirm, setSelectedInspectorFirm] = useState('TUV SUD Automotive Germany');

  // Create auction wizard state
  const [showCreateAuctionForm, setShowCreateAuctionForm] = useState(false);
  const [newAuctionData, setNewAuctionData] = useState({
    make: 'Porsche',
    model: 'Taycan Turbo s',
    year: '2022',
    trim: 'Performance Plus',
    startingBid: '75000',
    reservePrice: '85000',
    durationDays: '3',
    location: 'Hamburg Port Zone (DE)',
    category: 'Electric' as 'Sports' | 'Executive' | 'SUV' | 'Electric' | 'Classic',
    vin: '',
  });
  const [createAuctionStep, setCreateAuctionStep] = useState<1 | 2 | 3>(1);
  const [isSellerDepositLocked, setIsSellerDepositLocked] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isSimulatingQrStream, setIsSimulatingQrStream] = useState(false);
  const [qrStreamStatus, setQrStreamStatus] = useState('');

  // Chat Board simulator
  const [chatLogs, setChatLogs] = useState<Record<string, Array<{ sender: string; text: string; time: string; verified: boolean }>>>({
    'AUC-992-GT3RS': [
      { sender: 'Black Forest Asset Holdings (Seller)', text: 'Welcome! This Weissach GT3 RS was scanned by direct Porsche dealers last month. Oil quality report uploaded under Documentation tab.', time: '10:04 AM', verified: true },
      { sender: 'Hermann_P', text: 'Does it include the standard lightweight magnesium wheel setup?', time: '10:12 AM', verified: false },
      { sender: 'Black Forest Asset Holdings (Seller)', text: 'Yes! Fully optioned forged magnesium wheels matching the chalk gray exterior paint limits.', time: '10:15 AM', verified: true }
    ],
  });
  const [userChatMessage, setUserChatMessage] = useState('');

  // Transport details calculator
  const [transportDestination, setTransportDestination] = useState('Dubai Port Jebel Ali');
  const [transportTariffMode, setTransportTariffMode] = useState<'container' | 'air' | 'roro'>('container');
  const [showShippingCalculator, setShowShippingCalculator] = useState(false);

  // Complete won auction simulation flow
  const [simulatedWonAuctionId, setSimulatedWonAuctionId] = useState<string | null>(null);
  const [hasPaidWonAuction, setHasPaidWonAuction] = useState(false);
  const [shippingDispatchedTrackNo, setShippingDispatchedTrackNo] = useState<string | null>(null);

  // Periodic Countdown updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAuctions(prev => prev.map(auc => {
        if (auc.timeLeft > 0) {
          return { ...auc, timeLeft: auc.timeLeft - 1 };
        }
        return auc;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Compute Active Auctions list based on filters
  const filteredAuctions = useMemo(() => {
    return auctions.filter(auc => {
      const q = searchQuery.trim().toLowerCase();
      if (q) {
        const matchesName = `${auc.make} ${auc.model} ${auc.trim}`.toLowerCase().includes(q);
        const matchesVin = auc.vin.toLowerCase().includes(q);
        const matchesLoc = auc.location.toLowerCase().includes(q);
        if (!matchesName && !matchesVin && !matchesLoc) return false;
      }

      if (selectedCategory !== 'All' && auc.category !== selectedCategory) {
        return false;
      }

      if (selectedDuration !== 'All') {
        const hoursLeft = auc.timeLeft / 3600;
        if (selectedDuration === '24h' && hoursLeft > 24) return false;
        if (selectedDuration === '48h' && (hoursLeft <= 24 || hoursLeft > 48)) return false;
        if (selectedDuration === '72h' && (hoursLeft <= 48 || hoursLeft > 72)) return false;
        if (selectedDuration === '7-day' && hoursLeft <= 72) return false;
      }

      if (reserveFilter !== 'All') {
        if (reserveFilter === 'No Reserve' && auc.reserveStatus !== 'No Reserve') return false;
        if (reserveFilter === 'Reserve Met' && auc.reserveStatus !== 'Reserve Met') return false;
        if (reserveFilter === 'Reserve Pending' && auc.reserveStatus !== 'Reserve Pending') return false;
      }

      return true;
    });
  }, [auctions, searchQuery, selectedCategory, selectedDuration, reserveFilter]);

  const selectedAuction = useMemo(() => {
    return auctions.find(auc => auc.id === selectedAuctionId) || null;
  }, [auctions, selectedAuctionId]);

  // Formatter for countdowns
  const formatTimeLeft = (sec: number) => {
    if (sec <= 0) return 'Ended';
    const d = Math.floor(sec / (3600 * 24));
    const h = Math.floor((sec % (3600 * 24)) / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;

    if (d > 0) return `${d}d ${h}h ${m}m`;
    return `${h}h ${m}m ${s}s`;
  };

  // Deposit funds handler (simulation)
  const depositSecurityFunds = () => {
    const val = parseFloat(depositAmountInput);
    if (!val || val <= 0) {
      alert("Please enter a valid deposit amount.");
      return;
    }
    setIsDepositing(true);
    setTimeout(() => {
      setBidderSecurityDeposit(prev => prev + val);
      setIsDepositing(false);
      setDepositAmountInput('1000');
    }, 1200);
  };

  // Dynamic Valuation formulas
  const calculatedSellerModelValuation = useMemo(() => {
    let base = 70000;
    if (newAuctionData.make === 'Porsche') base = 90000;
    if (newAuctionData.make === 'Tesla') base = 75000;
    return base;
  }, [newAuctionData.make]);

  // Reserve price error/warning message
  const sellerReservePriceWarning = useMemo(() => {
    const reserve = parseFloat(newAuctionData.reservePrice) || 0;
    if (!reserve) return null;
    const diff = ((reserve - calculatedSellerModelValuation) / calculatedSellerModelValuation) * 100;
    
    if (diff > 10) {
      return {
        severity: 'high' as const,
        text: `Extreme Reserve pricing! $${reserve.toLocaleString()} is ${Math.round(diff)}% higher than direct platform estimates ($${calculatedSellerModelValuation.toLocaleString()}). This listing will be flagged for manual review, potentially locking your security deposit.`
      };
    } else {
      return {
        severity: 'low' as const,
        text: `Approved Reserve bounds. Aligned nicely within direct market liquidities. Clear transaction velocity expected.`
      };
    }
  }, [newAuctionData.reservePrice, calculatedSellerModelValuation]);

  // Handle seller direct publish auction
  const handlePublishNewAuction = (e: React.FormEvent) => {
    e.preventDefault();
    const reserveVal = parseFloat(newAuctionData.reservePrice) || 0;
    const startVal = parseFloat(newAuctionData.startingBid) || 0;

    if (!newAuctionData.vin || newAuctionData.vin.length < 10) {
      alert("Please specify a valid 10+ character VIN for state database check routing.");
      return;
    }

    if (startVal >= reserveVal && reserveVal > 0) {
      alert("Starting bid must be strictly lower than your target reserve boundary price.");
      return;
    }

    if (!isSellerDepositLocked) {
      alert("You must lock your seller insurance deposit ($1,500) prior to publishing to prevent phantom bidding.");
      return;
    }

    const created: AuctionListing = {
      id: `AUC-${Date.now().toString().slice(-6)}`,
      vin: newAuctionData.vin.toUpperCase(),
      year: parseInt(newAuctionData.year) || 2022,
      make: newAuctionData.make,
      model: newAuctionData.model,
      trim: newAuctionData.trim || 'Standard Package',
      image: uploadedPhotos.length > 0 ? uploadedPhotos[0] : 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=800',
      currentBid: startVal,
      reservePrice: reserveVal,
      reserveStatus: reserveVal === 0 ? 'No Reserve' : 'Reserve Pending',
      startingBid: startVal,
      timeLeft: parseInt(newAuctionData.durationDays) * 3600 * 24,
      durationDays: parseInt(newAuctionData.durationDays),
      bidsCount: 0,
      location: newAuctionData.location,
      sellerName: 'Your Certified Merchant Profile',
      sellerRating: 5.0,
      valuation: calculatedSellerModelValuation,
      category: newAuctionData.category,
      riskScore: 'Low',
      customsTaxDetails: 'Draft legal registration files verified in local cache storage.',
      history: []
    };

    setAuctions(prev => [created, ...prev]);
    setShowCreateAuctionForm(false);
    setCreateAuctionStep(1);
    setIsSellerDepositLocked(false);
    setUploadedPhotos([]);
    setNewAuctionData({
      make: 'Porsche',
      model: '',
      year: '2022',
      trim: '',
      startingBid: '75000',
      reservePrice: '85000',
      durationDays: '3',
      location: 'Hamburg Port Zone (DE)',
      category: 'Electric',
      vin: '',
    });
  };

  // Place interactive bid
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAuction) return;

    const enteredAmount = parseFloat(userBidValue);
    if (!enteredAmount) {
      alert("Specify a valid bidding rate value amount.");
      return;
    }

    const minIncrement = selectedAuction.currentBid * 1.01; // minimum 1% step
    if (enteredAmount < minIncrement) {
      alert(`Insufficient high bidding increment parameter! Minimum bid must be at least $${Math.ceil(minIncrement).toLocaleString()}`);
      return;
    }

    // Checking Security Deposit parameters
    const depositLimit = enteredAmount * 0.05; // 5% bid deposit required
    if (bidderSecurityDeposit < depositLimit) {
      alert(`Security deposit insufficient to back this bid level! Your bid requires a locked deposit of 5% ($${Math.ceil(depositLimit).toLocaleString()} USD). Direct deposit more funds into your sovereign escrow wallet first.`);
      return;
    }

    // Inspection recommendation warning
    if (!hasBookedInspectionForActive[selectedAuctionId ?? '']) {
      const confirmProceed = window.confirm("WARNING: You have NOT scheduled or completed a physical inspection of this chassis yet. Live auction rules recommend pre-bidding inspections. Proceed with bidding regardless?");
      if (!confirmProceed) return;
    }

    setIsPlacingBid(true);
    try {
      const updatedAuction = await api.post(`/auctions/${selectedAuction.id}/bid`, { amount: enteredAmount });
      
      // Update local state with the result from backend
      setAuctions(prev => prev.map(auc => {
        if (auc.id === selectedAuction.id) {
          return {
            ...auc,
            currentBid: updatedAuction.currentBid,
            bidsCount: (auc.bidsCount || 0) + 1,
            reserveStatus: updatedAuction.reservePrice ? (updatedAuction.currentBid >= updatedAuction.reservePrice ? 'Reserve Met' : 'Reserve Pending') : 'No Reserve',
          };
        }
        return auc;
      }));

      setUserBidValue('');
      alert("Escrow Bidding Registered Successfully under direct ledger tracker!");
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to place bid');
    } finally {
      setIsPlacingBid(false);
    }
  };

  // Interactive scheduler booking
  const handleBookInspection = () => {
    if (!selectedAuction) return;
    setHasBookedInspectionForActive(prev => ({
      ...prev,
      [selectedAuction.id]: true
    }));
    setShowInspectionScheduler(false);
    alert(`Vehicle Inspection successfully booked for ${selectedAuction.make} ${selectedAuction.model} on ${schedulingDate} at ${schedulingTimeSlot}! Physical certification report will unlock upon inspector signoff.`);
  };

  // Dynamic transport calculator rates
  const calculatedShippingCost = useMemo(() => {
    let rate = 1200;
    if (transportTariffMode === 'air') rate = 6500;
    if (transportTariffMode === 'roro') rate = 2200;
    
    // extra distance modifier (simplistic)
    if (transportDestination.includes('Dubai') || transportDestination.includes('Japan')) rate += 800;
    return rate;
  }, [transportDestination, transportTariffMode]);

  // Handle active public board chat messaging
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatMessage.trim() || !selectedAuctionId) return;

    const text = userChatMessage;
    const current = chatLogs[selectedAuctionId] || [];
    setChatLogs(prev => ({
      ...prev,
      [selectedAuctionId]: [
        ...current,
        { sender: 'John Doe (You)', text, time: 'Just now', verified: false }
      ]
    }));
    setUserChatMessage('');

    // simulator random reaction
    setTimeout(() => {
      const reactionMessage = {
        sender: selectedAuction?.sellerName ?? 'Seller System Rep',
        text: 'Our Hamburg depot tracks all chassis frame safety inspections. You can request high resolution paint depth measurements during the inspection window.',
        time: 'Just now',
        verified: true
      };
      setChatLogs(prev => ({
        ...prev,
        [selectedAuctionId]: [
          ...(prev[selectedAuctionId] || []),
          reactionMessage
        ]
      }));
    }, 1200);
  };

  return (
    <div className="space-y-8 py-3 text-slate-800 font-sans" id="auctions-integrated-division">
      
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-10 h-10 text-[#8B0000] animate-spin" />
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Accessing Auction Floor...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-red-900">Connection Interrupted</h3>
          <p className="text-sm text-red-700 mt-1">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}

      {!loading && !error && auctions.length === 0 && !showCreateAuctionForm && !selectedAuctionId && (
        <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-300 rounded-3xl">
          <Database className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-black text-slate-900">No Active Auctions</h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            The sovereign floor is currently clear. Be the first to establish a listing under decentralized rules.
          </p>
          <button
            onClick={() => setShowCreateAuctionForm(true)}
            className="mt-6 flex items-center gap-2 bg-[#8B0000] text-white px-6 py-3 rounded-2xl font-black hover:bg-red-900 transition-all mx-auto"
          >
            <Plus className="w-5 h-5" /> Start First Listing
          </button>
        </div>
      )}

      {/* 1. TOP HEADER BRAND BLOCK */}
      {!showCreateAuctionForm && !selectedAuctionId && (
        <div className="text-left pb-1 pt-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight font-display uppercase">
            Sovereign Live Auction Floor
          </h2>
        </div>
      )}

      {/* 2. CORE LAYOUT CONTROL */}
      <AnimatePresence mode="wait">
        {showCreateAuctionForm ? (
          <motion.div
            key="create_auction_page"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8 max-w-4xl mx-auto py-2 text-left font-sans"
          >
            {/* 2.1 BACK HEADER BAR */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <button
                onClick={() => {
                  setShowCreateAuctionForm(false);
                  setCreateAuctionStep(1);
                  setIsSellerDepositLocked(false);
                }}
                className="flex items-center gap-1.5 text-xs font-bold font-sans uppercase text-slate-600 hover:text-slate-950 cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl transition-all"
              >
                <ArrowLeft className="w-4 h-4 text-[#8B0000]" /> Return to Auction Floor
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase text-white bg-[#8B0000] px-3 py-1 rounded-full">
                  Sovereign Seller Desk
                </span>
              </div>
            </div>

            {/* 2.2 PAGE HEADER AND STEP PROGRESS */}
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Post New Vehicle Live Listing</h1>
                <p className="text-sm text-slate-500 mt-1">
                  Establish model configurations, starting bids, and reserve parameters under decentralized clearing rules.
                </p>
              </div>

              {/* Progress Steps Indicators */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-slate-50 border border-slate-200/50 p-4 rounded-2xl w-full">
                <div className="flex-1 flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    createAuctionStep === 1 ? 'bg-[#8B0000] text-white' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {createAuctionStep > 1 ? '✓' : '1'}
                  </span>
                  <div className="text-left">
                    <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Step 1</span>
                    <span className="text-xs font-bold text-slate-800">Specifications &amp; Valuation</span>
                  </div>
                </div>
                <div className="hidden sm:block w-8 h-[1px] bg-slate-200 shrink-0" />
                <div className="flex-1 flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    createAuctionStep === 2 ? 'bg-[#8B0000] text-white' : createAuctionStep > 2 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {createAuctionStep > 2 ? '✓' : '2'}
                  </span>
                  <div className="text-left">
                    <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Step 2</span>
                    <span className="text-xs font-bold text-slate-800">Quality Inspection Images</span>
                  </div>
                </div>
                <div className="hidden sm:block w-8 h-[1px] bg-slate-200 shrink-0" />
                <div className="flex-1 flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    createAuctionStep === 3 ? 'bg-[#8B0000] text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    3
                  </span>
                  <div className="text-left">
                    <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Step 3</span>
                    <span className="text-xs font-bold text-slate-800">Insurance Security Escrow</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2.3 MAIN FORM DIVIDED IN PROGRESS STEPS */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs">
              
              {createAuctionStep === 1 && (
                /* STEP 1: Specs and Pricing */
                <div className="space-y-6">
                  
                  {/* Valuation output panel based on selection */}
                  <div className="p-4 bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] block font-bold uppercase text-[#8B0000] tracking-wider mb-0.5">Sovereign Direct Asset Valuation</span>
                      <p className="text-xs text-slate-500 max-w-md">
                        Our real-time decentralized clearing house provides a safe estimate for active {newAuctionData.make} models.
                      </p>
                    </div>
                    <div className="bg-white border border-slate-200 px-5 py-3 rounded-xl text-right">
                      <span className="text-[10px] block text-slate-400 uppercase font-mono text-left">baseline estimate</span>
                      <span className="text-xl font-extrabold text-slate-900">${calculatedSellerModelValuation.toLocaleString()} USD</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wide block">Vehicle Make</label>
                      <select 
                        value={newAuctionData.make}
                        onChange={(e) => setNewAuctionData(prev => ({ ...prev, make: e.target.value }))}
                        className="bg-slate-50 border border-slate-200 hover:border-slate-300 px-4 py-3 rounded-xl w-full text-sm outline-none focus:bg-white focus:border-[#8B0000] transition-colors cursor-pointer text-slate-800"
                      >
                        <option value="Porsche">Porsche</option>
                        <option value="BMW">BMW</option>
                        <option value="Tesla">Tesla</option>
                        <option value="Audi">Audi</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wide block">Vehicle Model</label>
                      <input 
                        type="text"
                        placeholder="e.g. Taycan Turbo S"
                        value={newAuctionData.model}
                        onChange={(e) => setNewAuctionData(prev => ({ ...prev, model: e.target.value }))}
                        className="bg-slate-50 border border-slate-200 hover:border-slate-300 px-4 py-3 rounded-xl w-full text-sm outline-none focus:bg-white focus:border-[#8B0000] transition-colors text-slate-800 font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wide block">Model Year</label>
                      <input 
                        type="number"
                        placeholder="2023"
                        value={newAuctionData.year}
                        onChange={(e) => setNewAuctionData(prev => ({ ...prev, year: e.target.value }))}
                        className="bg-slate-50 border border-slate-200 hover:border-slate-300 px-4 py-3 rounded-xl w-full text-sm outline-none focus:bg-white focus:border-[#8B0000] transition-colors text-slate-800"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wide block">Trim Level / Package</label>
                      <input 
                        type="text"
                        placeholder="e.g. Weissach Spec / Dynamic"
                        value={newAuctionData.trim}
                        onChange={(e) => setNewAuctionData(prev => ({ ...prev, trim: e.target.value }))}
                        className="bg-slate-50 border border-slate-200 hover:border-slate-300 px-4 py-3 rounded-xl w-full text-sm outline-none focus:bg-white focus:border-[#8B0000] transition-colors text-slate-800"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wide block">Category Class</label>
                      <select 
                        value={newAuctionData.category}
                        onChange={(e) => setNewAuctionData(prev => ({ ...prev, category: e.target.value as any }))}
                        className="bg-slate-50 border border-slate-200 hover:border-slate-300 px-4 py-3 rounded-xl w-full text-sm outline-none focus:bg-white focus:border-[#8B0000] transition-colors cursor-pointer text-slate-800"
                      >
                        <option value="Sports">Sports Track</option>
                        <option value="Executive">Executive Fleet</option>
                        <option value="Electric">Electric Vehicle BEV</option>
                        <option value="Classic">Classic Collection</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wide block">Duration of Auction</label>
                      <select 
                        value={newAuctionData.durationDays}
                        onChange={(e) => setNewAuctionData(prev => ({ ...prev, durationDays: e.target.value }))}
                        className="bg-slate-50 border border-slate-200 hover:border-slate-300 px-4 py-3 rounded-xl w-full text-sm outline-none focus:bg-white focus:border-[#8B0000] transition-colors cursor-pointer text-slate-800"
                      >
                        <option value="1">1 Day (Express Clearance)</option>
                        <option value="3">3 Days (Recommended)</option>
                        <option value="7">7 Days (Full exposure)</option>
                      </select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wide block">17-Digit Vehicle Identification (VIN)</label>
                      <input 
                        type="text"
                        maxLength={17}
                        placeholder="e.g. WP0AF2 Taycan..."
                        value={newAuctionData.vin}
                        onChange={(e) => setNewAuctionData(prev => ({ ...prev, vin: e.target.value }))}
                        className="bg-slate-50 border border-slate-200 hover:border-slate-300 px-4 py-3 rounded-xl w-full text-sm outline-none font-mono tracking-widest uppercase focus:bg-white focus:border-[#8B0000] transition-all text-slate-850"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wide block">Starting Bid ($ USD)</label>
                      <input 
                        type="number"
                        placeholder="75000"
                        value={newAuctionData.startingBid}
                        onChange={(e) => setNewAuctionData(prev => ({ ...prev, startingBid: e.target.value }))}
                        className="bg-slate-50 border border-slate-200 hover:border-slate-300 px-4 py-3 rounded-xl w-full text-sm outline-none focus:bg-white focus:border-[#8B0000] transition-colors text-slate-800"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wide block">Reserve Target Pricing ($ USD)</label>
                      <input 
                        type="number"
                        placeholder="85000"
                        value={newAuctionData.reservePrice}
                        onChange={(e) => setNewAuctionData(prev => ({ ...prev, reservePrice: e.target.value }))}
                        className="bg-slate-50 border border-slate-200 hover:border-slate-300 px-4 py-3 rounded-xl w-full text-sm outline-none focus:bg-white focus:border-[#8B0000] transition-colors text-slate-800"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wide block">Storage Depot Location</label>
                      <input 
                        type="text"
                        placeholder="e.g. Stuttgart Airport Depot (DE)"
                        value={newAuctionData.location}
                        onChange={(e) => setNewAuctionData(prev => ({ ...prev, location: e.target.value }))}
                        className="bg-slate-50 border border-slate-200 hover:border-slate-300 px-4 py-3 rounded-xl text-sm w-full outline-none focus:bg-white focus:border-[#8B0000] transition-colors text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Reserve warning box feedback */}
                  {sellerReservePriceWarning && (
                    <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                      sellerReservePriceWarning.severity === 'high' 
                        ? 'bg-amber-50 border-amber-200 text-amber-800' 
                        : 'bg-emerald-50 border-emerald-100 text-emerald-800'
                    }`}>
                      <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wide text-slate-950 mb-1">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-[#8B0000]" /> Aligned Valuation Index
                      </div>
                      <p className="text-slate-650">{sellerReservePriceWarning.text}</p>
                    </div>
                  )}

                  {/* Action row */}
                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setCreateAuctionStep(2)}
                      disabled={!newAuctionData.model || !newAuctionData.startingBid || !newAuctionData.vin}
                      className="px-6 py-3 bg-[#8B0000] hover:bg-[#b00d0d] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-40 select-none flex items-center gap-2 shadow-xs active:scale-97"
                    >
                      Continue To Photo Upload <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              )}

              {createAuctionStep === 2 && (
                /* STEP 2: QUALITY INSPECTION IMAGES THROUGH QR SYSTEM (NO DIRECT STORAGE ACCESS AT ALL!) */
                <div className="space-y-6">
                  
                  <div className="space-y-2 max-w-2xl text-left">
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight">Step 2: Premium Physical Asset Validation Photos</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      To preserve direct seller inspection authenticity and deter synthetic, fraudulent, or outdated inventory listings, **direct file system selection from desktop storage is disabled**. Capture must be validated via connected mobile stream.
                    </p>
                  </div>

                  {/* QR Core Integration area */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch pt-2">
                    
                    {/* Left: QR Display Block */}
                    <div className="md:col-span-5 bg-slate-50 border border-slate-200/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4">
                      
                      <div className="bg-white border border-slate-200 p-2.5 rounded-2xl shadow-xs">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                            window.location.origin + '/?mobile-upload=true&syncSession=' + Date.now()
                          )}`} 
                          alt="Mobile Photos Sync QR" 
                          className="w-40 h-40 object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-[#8B0000] tracking-widest font-mono">Mobile Synchronizer Code</span>
                        <p className="text-[10px] text-slate-500 max-w-[200px] mx-auto">
                          Scan with your iOS or Android camera to safely authorize vehicle direct photo upload.
                        </p>
                      </div>

                    </div>

                    {/* Right: Uploaded Status Deck */}
                    <div className="md:col-span-7 border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-6 text-left">
                      
                      {/* Active sync indicator */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Sync Status Channel</h4>
                          <span className="flex items-center gap-1 text-[10px] font-bold font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> Active Node
                          </span>
                        </div>

                        {isSimulatingQrStream ? (
                          <div className="p-4 bg-red-50/50 border border-[#8B0000]/10 rounded-xl space-y-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-[#8B0000] border-t-transparent rounded-full animate-spin shrink-0" />
                              <span className="text-xs font-bold text-slate-800">Synchronizing mobile camera payload...</span>
                            </div>
                            <p className="text-[11px] font-mono text-[#8B0000]/80">{qrStreamStatus}</p>
                          </div>
                        ) : uploadedPhotos.length > 0 ? (
                          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-bounce" />
                            Secure photo upload complete ({uploadedPhotos.length} images captured)
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 border border-slate-150 p-4 rounded-xl">
                            No external device connected yet. Scanning QR links will pipe camera uploads right here in high-definition lossless formats.
                          </p>
                        )}
                      </div>

                      {/* Photo Gallery Grid */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase text-slate-400">Attached Live Artifacts</span>
                        <div className="grid grid-cols-3 gap-3">
                          {uploadedPhotos.length === 0 ? (
                            Array.from({ length: 3 }).map((_, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => alert("File selection disabled on desktop. Please scan the QR code with your mobile, or tap the interactive demo sync simulation button below.")}
                                className="h-20 bg-slate-50 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl flex flex-col items-center justify-center gap-1 text-slate-400 font-sans transition-all cursor-pointer"
                              >
                                <Plus className="w-4 h-4" />
                                <span className="text-[8px] font-mono font-bold uppercase tracking-wider">Desktop Disabled</span>
                              </button>
                            ))
                          ) : (
                            uploadedPhotos.map((url, index) => (
                              <div key={index} className="relative group h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                                <img src={url} alt={`Vehicle upload ${index + 1}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <button
                                    type="button"
                                    onClick={() => setUploadedPhotos(prev => prev.filter((_, idx) => idx !== index))}
                                    className="p-1 px-2.5 bg-red-600 text-white rounded-lg text-[9px] font-bold uppercase hover:bg-red-700 font-sans cursor-pointer"
                                  >
                                    Remove
                                  </button>
                                </div>
                                <span className="absolute bottom-1 right-1 bg-black/75 text-[8px] font-mono text-white px-1.5 py-0.5 rounded">
                                  {index === 0 ? 'COVER' : `ANGLE ${index + 1}`}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Simulation Button */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (isSimulatingQrStream) return;
                            setIsSimulatingQrStream(true);
                            setUploadedPhotos([]);
                            
                            const steps = [
                              "Establishing encrypted SSL transaction tunnel with mobile terminal...",
                              "Tunnel linked. Camera shutter initialized. Snapping Front-Passenger Spec...",
                              "Receiving Front Profile high-res package (6.4 MB)...",
                              "Front captured successfully. Snapping cockpit interior cluster values...",
                              "Receiving Cabin Instrument Panel snapshot (4.8 MB)...",
                              "Shutter linked. Scanning VIN laser verification chassis stamps...",
                              "Uploading deep VIN physical chassis stamp (5.2 MB)...",
                              "Physical audit complete. Releasing session tokens."
                            ];

                            let current = 0;
                            setQrStreamStatus(steps[current]);

                            const interval = setInterval(() => {
                              current++;
                              if (current < steps.length) {
                                setQrStreamStatus(steps[current]);
                              } else {
                                clearInterval(interval);
                                setIsSimulatingQrStream(false);
                                setUploadedPhotos([
                                  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800', // Porsche 911 Exterior
                                  'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800', // Porsche cockpit
                                  'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=800'  // Porsche Side
                                ]);
                              }
                            }, 550);
                          }}
                          disabled={isSimulatingQrStream}
                          className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-97"
                        >
                          {isSimulatingQrStream ? "Scanning Live Mobile Stream..." : "Simulate mobile QR Photo transfer"}
                        </button>
                      </div>

                    </div>

                  </div>

                  {/* Navigation row */}
                  <div className="pt-4 border-t border-slate-100 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCreateAuctionStep(1)}
                      className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-sans font-bold uppercase transition-all cursor-pointer"
                    >
                      Back
                    </button>

                    <button
                      type="button"
                      onClick={() => setCreateAuctionStep(3)}
                      disabled={uploadedPhotos.length === 0 || isSimulatingQrStream}
                      className="px-6 py-3 bg-[#8B0000] hover:bg-[#b00d0d] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-40 select-none flex items-center gap-2 active:scale-97"
                    >
                      Continue to escrow check <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              )}

              {createAuctionStep === 3 && (
                /* STEP 3: SECURITY DEPOSIT LOCK & FINAL DEPLOYMENT */
                <div className="space-y-6 text-slate-700 font-sans text-left">
                  
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs leading-relaxed text-slate-650">
                    <h4 className="text-[11px] font-extrabold text-slate-900 uppercase flex items-center gap-2 text-left">
                      <Lock className="w-4 h-4 text-[#8B0000]" /> Sovereign Anti-Fraud Insurance Protection Guarantee
                    </h4>
                    <p className="text-left">
                      Our decentralized digital asset protocol guarantees real settlement. To register your {newAuctionData.make} on the direct Sovereign Live Floor bidding terminal, you must lock a temporary safety collateral pledge of **$1,500 USD** within the secure escrow lockbox.
                    </p>
                    <p className="text-left text-slate-500 italic text-[11px]">
                      This safety deposit will automatically clear and refund back to your registered merchant credit line as soon as the winning buyer submits the final purchase escrow tokens, or on immediate closure if no verified bids above reserve occur within the duration target.
                    </p>
                  </div>

                  {/* Deposit confirm badge */}
                  {isSellerDepositLocked ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-800 text-sm rounded-xl flex items-center gap-2 font-black justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 animate-pulse" /> SELLER ANTI-FRAUD INSURANCE LOCKED &amp; WIRED!
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsSellerDepositLocked(true);
                      }}
                      className="w-full py-4 bg-zinc-700 hover:bg-zinc-600 text-white border border-zinc-600 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer transition-all active:scale-97 text-center shadow-xs"
                    >
                      CLICK TO LOCK ANTI-FRAUD COLLATERAL INDEX ($1,500)
                    </button>
                  )}

                  {/* Navigation & publishing */}
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setCreateAuctionStep(2)}
                      className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-sans font-bold uppercase transition-all whitespace-nowrap cursor-pointer"
                    >
                      Back
                    </button>
                    
                    <button
                      type="button"
                      onClick={handlePublishNewAuction}
                      disabled={!isSellerDepositLocked}
                      className="px-6 py-3 bg-[#8B0000] hover:bg-[#b00d0d] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-xs active:scale-97"
                    >
                      Publish Live Auction <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              )}

            </div>

          </motion.div>
        ) : !selectedAuctionId ? (
          <motion.div
            key="grid_layout"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* SEARCH AND FILTERS TOOLBAR */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between text-left shadow-xs">
              {/* Search input */}
              <div className="relative w-full md:w-2/5">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter active auctions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 text-xs outline-none pl-10 pr-4 py-2.5 rounded-xl text-slate-800 placeholder-slate-400 transition-all font-sans"
                />
              </div>

              {/* Filters grid row */}
              <div className="flex flex-wrap gap-2.5 items-center justify-end w-full md:w-auto">
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-xl">
                  {/* Category Buttons */}
                  {['All', 'Sports', 'Executive', 'Electric'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight font-sans transition-all cursor-pointer ${
                        selectedCategory === cat 
                          ? 'bg-[#8B0000] text-white shadow-xs' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Duration Limit Select */}
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-sans text-slate-700 outline-none cursor-pointer hover:border-slate-355"
                >
                  <option value="All">All Durations</option>
                  <option value="24h">Clears &lt; 24h</option>
                  <option value="48h">Clears &lt; 48h</option>
                  <option value="72h">Clears &lt; 72h</option>
                  <option value="7-day">Clears &gt; 3 days</option>
                </select>

                {/* Reserve Status Selector */}
                <select
                  value={reserveFilter}
                  onChange={(e) => setReserveFilter(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-sans text-slate-700 outline-none cursor-pointer hover:border-slate-355"
                >
                  <option value="All">All Reserves</option>
                  <option value="No Reserve">No Reserve</option>
                  <option value="Reserve Met">Reserve Met</option>
                  <option value="Reserve Pending">Reserve Pending</option>
                </select>

                <button
                  onClick={() => setShowCreateAuctionForm(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#8B0000] hover:bg-[#b00d0d] text-white rounded-xl text-xs font-bold uppercase font-sans tracking-wide transition-all cursor-pointer shadow-xs active:scale-97"
                >
                  <Plus className="w-3.5 h-3.5" /> Post Auction
                </button>
              </div>
            </div>

            {/* LIVE AUCTIONS ACTIVE GRID DISPLAY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredAuctions.map(auc => (
                <div 
                  key={auc.id}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100/80 transition-all group flex flex-col justify-between"
                >
                  {/* Image card head with state overlays */}
                  <div className="relative h-48 overflow-hidden bg-slate-100 shrink-0">
                    <img 
                      src={auc.image} 
                      alt={`${auc.make} ${auc.model}`} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Modern thin black overlay to protect text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Live countdown timer top right */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/75 backdrop-blur-xs px-2.5 py-1 rounded-full text-[9px] font-bold font-mono text-white">
                      <Clock className="w-3 h-3 text-[#8B0000]" /> {formatTimeLeft(auc.timeLeft)}
                    </div>

                    {/* Bottom active bidding stats overlay */}
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                      <div className="text-left">
                        <span className="text-lg font-mono font-black text-white hover:text-[#8B0000] bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-xs inline-block transition-colors">${auc.currentBid.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body textual profiles */}
                  <div className="p-5 text-left space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase leading-snug">
                        {auc.make} {auc.model}
                      </h4>
                      
                      {/* Location pinpoint */}
                      <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {auc.location}
                      </p>
                    </div>

                    {/* Reserve constraints validation summary */}
                    <div className="pt-2 border-t border-slate-100/80 flex justify-between items-center text-[10px] font-sans">
                      <div>
                        <span className="text-slate-400 block uppercase font-bold text-[8px] tracking-wider">RESERVE STATUS</span>
                        <span className={`font-bold uppercase text-[9px] ${
                          auc.reserveStatus === 'Reserve Met' 
                            ? 'text-emerald-600' 
                            : auc.reserveStatus === 'No Reserve' 
                              ? 'text-indigo-600' 
                              : 'text-amber-550 border-none'
                        }`}>
                          {auc.reserveStatus}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-slate-400 block uppercase font-bold text-[8px] tracking-wider">PLATFORM ESTIMATE</span>
                        <span className="text-slate-700 block font-bold font-mono">${auc.valuation.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Interactive enter details button */}
                    <div className="pt-1.5">
                      <button
                        onClick={() => setSelectedAuctionId(auc.id)}
                        className="w-full py-2.5 bg-[#8B0000]/5 hover:bg-[#8B0000] text-[#8B0000] hover:text-white border border-[#8B0000]/20 hover:border-transparent transition-all rounded-xl text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-97"
                      >
                        Enter Auction Bidding Portal <ChevronRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredAuctions.length === 0 && (
                <div className="col-span-3 p-12 border border-dashed border-slate-200 text-center rounded-2xl bg-white text-slate-500">
                  <SlidersHorizontal className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <p className="font-sans text-sm uppercase font-bold text-slate-700">No Active Auctions Matching Filter Query</p>
                  <p className="text-xs text-slate-500">Modify your reserve price settings, category filters, or search limits above.</p>
                </div>
              )}
            </div>

          </motion.div>
        ) : (
          /* 3. DEDICATED AUCTION SPECIFIC PORTAL */
          <motion.div 
            key="details_layout" 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0 }}
            className="space-y-6 text-left"
          >
            {selectedAuction ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Back button Row Span */}
                <div className="lg:col-span-12 flex justify-between items-center border-b border-slate-100 pb-3">
                  <button
                    onClick={() => {
                      setSelectedAuctionId(null);
                      setUserBidValue('');
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold font-sans uppercase text-slate-600 hover:text-slate-900 cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-lg text-left transition-all"
                  >
                    <ArrowLeft className="w-4 h-4 shrink-0 text-[#8B0000]" /> Back to central Floor
                  </button>


                </div>

                {/* LEFT DETAIL PORTFOLIO PANEL: Photos & Docs (7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Major Photo block */}
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm relative">
                    <div className="absolute top-3 left-3 bg-[#8B0000] text-white text-[9px] font-bold uppercase tracking-widest font-sans px-3 py-1 rounded-full shadow-md">
                      {selectedAuction.category} Chassis Track
                    </div>

                    <img 
                      src={selectedAuction.image} 
                      alt={selectedAuction.model}
                      className="w-full h-80 object-cover"
                      referrerPolicy="no-referrer"
                    />

                    <div className="p-6 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight font-sans">
                            {selectedAuction.year} {selectedAuction.make} {selectedAuction.model}
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs text-slate-550 leading-relaxed font-sans mt-2">
                        This unit represents certified asset profiles. Directly sourced from executive port terminal coordinates. Settle payment inside the escrow terminal with zero credit vulnerabilities.
                      </p>
                    </div>
                  </div>

                  {/* DOCUMENTATION SUBSECTION TABS CONTAINER */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider font-sans text-slate-950 flex items-center gap-1.5 border-b border-slate-100 pb-3">
                      <FileText className="w-4 h-4 text-[#8B0000]" /> Platform Document Warehouse
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      
                      <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl space-y-1 text-left">
                        <span className="text-[9px] text-[#8B0000] font-bold font-sans uppercase block">Sovereign Inspection Audit</span>
                        <p className="text-[10.5px] text-slate-600 font-sans leading-snug">
                          All paint micro-measurements, engine cylinder block compression ratios, and computer codes cleared.
                        </p>
                        <span className="text-[8px] text-emerald-600 font-bold uppercase font-sans block pt-1">
                          ✓ audit matched perfectly
                        </span>
                      </div>

                      <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl space-y-1 text-left">
                        <span className="text-[9px] text-[#8B0000] font-bold font-sans uppercase block">Customs &amp; Export Duties</span>
                        <p className="text-[10.5px] text-slate-600 font-sans leading-snug">
                          {selectedAuction.customsTaxDetails} Settle import tariffs inside escrow checkout easily.
                        </p>
                        <span className="text-[8px] text-slate-500 font-bold uppercase font-sans block pt-1">
                          ⧲ customs clear index: 100%
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* 4. PUBLIC BID CHAT SYSTEM */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
                    <div className="flex justify-between items-center border-b border-slate-150 pb-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider font-sans text-slate-900 flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-[#8B0000]" /> Live Auction Floor Chat Box
                      </h4>
                    </div>

                    <div className="space-y-3.5 max-h-[160px] overflow-y-auto p-4 bg-slate-50 rounded-xl border border-slate-150 scrollbar-thin">
                      {(chatLogs[selectedAuction.id] || []).map((msg, index) => (
                        <div key={index} className="text-left text-xs space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className={`font-bold font-sans text-[10.5px] ${
                              msg.sender.includes('Seller') ? 'text-[#8B0000]' : 'text-slate-800'
                            }`}>
                              {msg.sender}
                            </span>
                            {msg.verified && (
                              <span className="bg-[#8B0000]/10 text-[#8B0000] text-[8px] font-bold font-sans scale-90 px-1 py-0.5 rounded">
                                VERIFIED
                              </span>
                            )}
                            <span className="text-[9px] text-slate-400 font-sans">{msg.time}</span>
                          </div>

                          <p className="text-slate-600 font-medium pl-1 leading-relaxed">
                            {msg.text}
                          </p>
                        </div>
                      ))}

                      {(!chatLogs[selectedAuction.id] || chatLogs[selectedAuction.id].length === 0) && (
                        <p className="text-xs text-slate-400 italic text-center py-2">No messages registered yet. Say hello or query the seller directly!</p>
                      )}
                    </div>

                    {/* Chat Input form */}
                    <form onSubmit={handleSendChatMessage} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Query physical constraints, cargo logistics..."
                        value={userChatMessage}
                        onChange={(e) => setUserChatMessage(e.target.value)}
                        className="flex-1 bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl text-slate-800 outline-none placeholder-slate-400 focus:border-[#8B0000]"
                      />
                      <button
                        type="submit"
                        className="px-4 bg-[#8B0000] hover:bg-[#b00d0d] text-white rounded-xl text-xs font-bold font-sans uppercase cursor-pointer"
                      >
                        Send
                      </button>
                    </form>
                  </div>

                </div>


                {/* RIGHT DETAIL ACTIVE BID BOARD PANEL: Bid Input, Scheduler, Post Escrow Shipping (5 Cols) */}
                <div className="lg:col-span-5 space-y-6 text-left">
                  
                  {/* Bidding Card */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-44 h-44 bg-[#8B0000]/5 rounded-full blur-[70px] pointer-events-none" />

                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <div className="w-full flex justify-between items-center">
                        <span className="text-[8.5px] text-slate-400 font-sans font-bold uppercase tracking-wider">TIME REMAINING</span>
                        <div className="flex items-center gap-1 text-[11px] font-mono font-extrabold text-slate-900 border-none">
                          <Clock className="w-3.5 h-3.5 text-[#8B0000]" /> {formatTimeLeft(selectedAuction.timeLeft)}
                        </div>
                      </div>
                    </div>

                    {/* AI Bidding Warnings panel based on pricing valuation comparisons */}
                    <div className="p-3.5 bg-[#8B0000]/2 border border-[#8B0000]/10 text-[10.5px] rounded-xl text-slate-700 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold uppercase text-[9px] tracking-wider font-sans text-[#8B0000]">
                        <Sparkles className="w-3.5 h-3.5 text-[#8B0000]" /> Sovereign AI Market Safety Warn
                      </div>
                      <p className="font-sans leading-relaxed text-slate-600">
                        {selectedAuction.currentBid > selectedAuction.valuation * 1.05 ? (
                          `High Premium Warning: Pricing level sits 5%+ higher than platform's guidelines. Recommended for corporate fleet targets prioritizing immediate spot-logistics.`
                        ) : (
                          `Aligned parameters: Active bidding parameters sit inside structural market liquidity guidelines. Healthy clearance velocity expected.`
                        )}
                      </p>
                    </div>

                    {/* Interactive BID Placing Form */}
                    <form onSubmit={handlePlaceBid} className="space-y-3 pt-2">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[10px] font-sans">
                          <span className="text-slate-505 font-bold">ENTER BID USD RATE</span>
                          <span className="text-slate-400">Min bid: $ {(Math.ceil(selectedAuction.currentBid * 1.01)).toLocaleString()}</span>
                        </div>

                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-405 font-mono text-xs font-bold">$</span>
                          <input 
                            type="number"
                            placeholder={Math.ceil(selectedAuction.currentBid * 1.01).toString()}
                            value={userBidValue}
                            onChange={(e) => setUserBidValue(e.target.value)}
                            className="bg-slate-50 border border-slate-200 hover:border-slate-300 text-sm pl-8 pr-4 py-3 rounded-xl text-slate-900 outline-none w-full font-mono focus:border-[#8B0000] transition-colors"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-[#8B0000] hover:bg-[#b00d0d] text-white rounded-xl text-xs font-black uppercase tracking-wider font-sans cursor-pointer shadow-sm transition-all shadow-[#8B0000]/20"
                      >
                        Submit Escrow backed Bid
                      </button>
                    </form>

                    {/* Pre Bid Physical Scheduler Tab */}
                    <div className="pt-4 border-t border-slate-100 space-y-2.5">
                      <h4 className="text-[10px] font-bold tracking-wider font-sans text-slate-500 uppercase">
                        Physical Pre-Bidding Inspection
                      </h4>
                      <p className="text-[10.5px] text-slate-500 leading-relaxed font-sans">
                        Sovereign rules allow physical audits on the warehouse depot prior to final wire handovers. Select an inspector firm to audit alignment variables.
                      </p>

                      {hasBookedInspectionForActive[selectedAuctionId ?? ''] ? (
                        <div className="p-3 bg-emerald-50 border border-emerald-100 text-[10.5px] rounded-xl text-emerald-700 flex items-start gap-2 text-left">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                          <div>
                            <span className="font-sans font-bold block uppercase text-[9.5px]">Audit Scheduled</span>
                            <span className="font-normal font-sans text-[10px] text-slate-600">Scheduled with {selectedInspectorFirm} on {schedulingDate} at {schedulingTimeSlot}. Report will update automatically.</span>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowInspectionScheduler(true)}
                          className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-705 hover:text-slate-900 border border-slate-200 rounded-xl text-xs font-sans font-bold uppercase transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Calendar className="w-3.5 h-3.5 text-slate-500" /> Schedule pre-bid physical audit
                        </button>
                      )}
                    </div>

                    {/* End Auction Simulator Trigger option */}
                    <div className="pt-3 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setSimulatedWonAuctionId(selectedAuction.id);
                          setHasPaidWonAuction(false);
                          setShippingDispatchedTrackNo(null);
                        }}
                        className="w-full py-1.5 active:bg-slate-100 px-2 bg-slate-50 border border-slate-250/60 hover:bg-slate-100 duration-200 text-center rounded text-[9px] font-mono text-slate-500 hover:text-slate-800 transition-all uppercase cursor-pointer"
                      >
                        [Simulate Winning this auction asset]
                      </button>
                    </div>

                  </div>

                  {/* ACTIVE BIDDING HISTORY STACK */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                    <h4 className="text-xs font-bold uppercase tracking-wider font-sans text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2.5">
                      <History className="w-4 h-4 text-[#8B0000]" /> Bid Log Ledger Tracker
                    </h4>

                    <div className="space-y-2 max-h-[160px] overflow-y-auto">
                      {selectedAuction.history.map((hist, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs font-mono bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-700 font-sans font-bold">{hist.bidder}</span>
                            {hist.verified && <span className="text-[7.5px] bg-[#8B0000]/10 text-[#8B0000] px-1.5 py-0.5 rounded uppercase font-black tracking-wide font-sans">SECURED</span>}
                          </div>
                          
                          <div className="text-right">
                            <span className="text-slate-900 block font-black font-sans">${hist.amount.toLocaleString()}</span>
                            <span className="text-[8.5px] text-slate-400 block font-sans">{hist.time}</span>
                          </div>
                        </div>
                      ))}

                      {selectedAuction.history.length === 0 && (
                        <p className="text-xs text-slate-400 italic text-center py-2">Starting position parameters. No bids submitted yet.</p>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              <p className="text-xs text-red-500">Error retrieving auction parameters.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {simulatedWonAuctionId && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="bg-white border border-slate-200 text-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl max-w-2xl w-full text-left relative">
              
              <button 
                onClick={() => setSimulatedWonAuctionId(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1.5">
                <span className="text-[9px] font-bold uppercase text-white bg-[#8B0000] px-2.5 py-1 rounded-full inline-block">
                  ESCROW Portal - Clearing Log Hold
                </span>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">🎉 Congratulations! You won this Auction listing!</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  Vehicle parameters verified and cleared. Fund escrow hold release and specify tracking destination cargo logistics coordinates below.
                </p>
              </div>

              {/* Summary detail block */}
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-xl font-mono text-xs flex justify-between items-center">
                <div>
                  <span className="text-slate-400 block uppercase font-sans font-bold text-[9px]">WON VEHICLE SPECIMEN</span>
                  <span className="text-slate-800 font-extrabold uppercase font-sans">Porsche 911 GT3 RS</span>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 block uppercase font-sans font-bold text-[9px]">FINAL CLEARING FEE</span>
                  <span className="text-base font-black text-slate-900 font-sans hover:text-[#8B0000] transition-colors">$ 285,500 USD</span>
                </div>
              </div>

              {/* Paid Status Tracker */}
              {hasPaidWonAuction ? (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs rounded-xl flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-sans font-bold uppercase text-[10px] tracking-wider text-emerald-800">Sovereign Payment Cleared</span>
                    <span className="font-normal font-sans text-slate-600 block mt-0.5 leading-relaxed">
                      Escrow holding funds successfully unlocked to seller system! Bill of lading generated and locked into Hamburg customs transport desk.
                    </span>
                    {shippingDispatchedTrackNo ? (
                      <div className="mt-2.5 p-2 bg-white rounded font-mono text-[10.5px] border border-slate-200 text-slate-700 inline-block font-bold">
                        TRACKING ID: <span className="text-[#8B0000] font-mono font-extrabold">{shippingDispatchedTrackNo}</span>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setShippingDispatchedTrackNo(`SOV-CARGO-${Math.floor(Math.random() * 900000 + 100000)}`)}
                        className="mt-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-[10px] font-sans cursor-pointer uppercase transition-all"
                      >
                        Request Transit Dispatch
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Shipping options container selector */}
                  <div className="space-y-2 text-left">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans">1. Choose Post-Auction Cargo Freight Transport</span>
                    
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <button
                        onClick={() => setTransportTariffMode('container')}
                        className={`p-3 border rounded-xl font-sans text-left transition-all cursor-pointer ${
                          transportTariffMode === 'container' 
                            ? 'bg-[#8B0000]/5 border-[#8B0000]/30 text-[#8B0000]' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span className="font-extrabold block">SEA CONTAINER</span>
                        <span className="text-[10px] text-slate-500 block font-normal">$ 1,200 (15-30 days)</span>
                      </button>

                      <button
                        onClick={() => setTransportTariffMode('roro')}
                        className={`p-3 border rounded-xl font-sans text-left transition-all cursor-pointer ${
                          transportTariffMode === 'roro' 
                            ? 'bg-[#8B0000]/5 border-[#8B0000]/30 text-[#8B0000]' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span className="font-extrabold block">RO-RO DECK VESSEL</span>
                        <span className="text-[10px] text-slate-500 block font-normal">$ 2,200 (12-20 days)</span>
                      </button>

                      <button
                        onClick={() => setTransportTariffMode('air')}
                        className={`p-3 border rounded-xl font-sans text-left transition-all cursor-pointer ${
                          transportTariffMode === 'air' 
                            ? 'bg-[#8B0000]/5 border-[#8B0000]/30 text-[#8B0000]' 
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <span className="font-extrabold block">AIR CHARTER JUMBO</span>
                        <span className="text-[10px] text-slate-500 block font-normal">$ 6,500 (3-5 days EX)</span>
                      </button>
                    </div>
                  </div>

                  {/* Destination Location */}
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-sans">2. Shipping Destination Coordinate</label>
                    <input 
                      type="text"
                      value={transportDestination}
                      onChange={(e) => setTransportDestination(e.target.value)}
                      placeholder="e.g. Dubai Jebel Ali Port Terminal 4"
                      className="bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl text-slate-800 outline-none w-full font-sans focus:border-[#8B0000]"
                    />
                  </div>

                  {/* Summary rate specs */}
                  <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-500 font-sans text-left border border-slate-150">
                    <div className="flex justify-between">
                      <span>CHASSIS BILL:</span>
                      <span className="text-slate-800 font-bold">$ 285,500 USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span>CARGO TRANSIT FEES:</span>
                      <span className="text-slate-800 font-bold">$ {calculatedShippingCost.toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-slate-200 pt-1.5 font-bold text-slate-900">
                      <span>GRAND BILL TOTAL:</span>
                      <span className="text-[#8B0000] text-sm font-black">$ {(285500 + calculatedShippingCost).toLocaleString()} USD</span>
                    </div>
                  </div>

                  {/* Execute Button */}
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setSimulatedWonAuctionId(null)}
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold font-sans uppercase cursor-pointer"
                    >
                      Hold Payment
                    </button>
                    <button
                      onClick={() => setHasPaidWonAuction(true)}
                      className="px-6 py-2.5 bg-[#8B0000] hover:bg-[#b00d0d] text-white rounded-xl text-xs font-black uppercase font-sans tracking-wide cursor-pointer transition-all active:scale-97"
                    >
                      Authorize Escrow Hold Release
                    </button>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. MODAL: PHYSICAL PRE-BID AUDIT APPOINTMENT SCHEDULER */}
      <AnimatePresence>
        {showInspectionScheduler && selectedAuction && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 text-left"
          >
            <div className="bg-white border border-slate-200 text-slate-800 rounded-2xl p-6 md:p-8 space-y-5 shadow-2xl max-w-md w-full relative">
              <button 
                onClick={() => setShowInspectionScheduler(false)}
                className="absolute top-4 right-4 text-slate-450 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-[9px] font-bold uppercase text-white bg-[#8B0000] px-2.5 py-1 rounded-full inline-block">
                  AUDIT CONTROLS
                </span>
                <h3 className="text-lg font-black text-slate-900 transition-colors uppercase">Book Physical Audit Slot</h3>
                <p className="text-[11px] text-slate-500">
                  Select date, time limits, and third party verified inspectors to perform alignment paint, chassis framework scans, and engine oil evaluations.
                </p>
              </div>

              {/* Target unit */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-0.5 text-xs font-sans border border-slate-150">
                <span className="text-slate-400 block text-[9px] uppercase font-bold text-slate-500">TARGET VEHICLE UNIT</span>
                <span className="text-slate-800 font-extrabold uppercase font-sans">{selectedAuction.make} {selectedAuction.model}</span>
              </div>

              <div className="space-y-3.5 text-xs text-left">
                {/* Date Input */}
                <div className="space-y-1">
                  <label className="text-[9px] font-sans font-bold text-slate-500 uppercase">Target Audit Date</label>
                  <input 
                    type="date"
                    value={schedulingDate}
                    onChange={(e) => setSchedulingDate(e.target.value)}
                    className="bg-white border border-slate-200 text-slate-800 px-3 py-2.5 rounded-xl text-xs w-full font-sans outline-none focus:border-[#B30000] focus:ring-1 focus:ring-[#B30000] transition-colors"
                  />
                </div>

                {/* Time slot dropdown */}
                <div className="space-y-1">
                  <label className="text-[9px] font-sans font-bold text-slate-500 uppercase">Active Time Slots</label>
                  <select 
                    value={schedulingTimeSlot}
                    onChange={(e) => setSchedulingTimeSlot(e.target.value)}
                    className="bg-white border border-slate-200 text-slate-800 px-3 py-2.5 rounded-xl text-xs w-full outline-none cursor-pointer focus:border-[#B30000] focus:ring-1 focus:ring-[#B30000]"
                  >
                    <option value="10:00 - 11:30">Morning: 10:00 AM - 11:30 AM</option>
                    <option value="14:00 - 15:30">Midday: 02:00 PM - 03:30 PM (Recommended)</option>
                    <option value="16:30 - 18:00">Evening: 04:30 PM - 06:00 PM</option>
                  </select>
                </div>

                {/* Inspector firm dropdown */}
                <div className="space-y-1">
                  <label className="text-[9px] font-sans font-bold text-slate-500 uppercase">Certified Inspection Firm</label>
                  <select
                    value={selectedInspectorFirm}
                    onChange={(e) => setSelectedInspectorFirm(e.target.value)}
                    className="bg-white border border-slate-200 text-slate-800 px-3 py-2.5 rounded-xl text-xs w-full outline-none cursor-pointer focus:border-[#B30000] focus:ring-1 focus:ring-[#B30000]"
                  >
                    <option value="TUV SUD Automotive Germany">TÜV SÜD Automotive Germany</option>
                    <option value="SGS Global Transportation Audit">SGS Global Transportation Audit</option>
                    <option value="Dekra Performance Audits Stuttgart">DEKRA Performance Audits Stuttgart</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowInspectionScheduler(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all text-xs font-sans font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBookInspection}
                  className="px-5 py-2 bg-[#B30000] hover:bg-[#4A4A4A] text-white rounded-lg text-xs font-bold uppercase font-sans tracking-wide cursor-pointer transition-all duration-200 active:scale-97 shadow-sm"
                >
                  Confirm booking
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

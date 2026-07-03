import React, { useState, useEffect } from 'react';
import { 
  Clock, Zap, ArrowLeft, Shield, AlertCircle, CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

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
      stiffness: 110, 
      damping: 18 
    } 
  }
};

interface LiveActionProps {
  onSearchVin: (vin: string) => void;
}

interface AuctionCar {
  vin: string;
  make: string;
  model: string;
  year: number;
  image: string;
  currentBid: number;
  reservePrice: number;
  timeLeft: number; // in seconds
  highBidder: string;
  bidsCount: number;
  status: 'active' | 'sold';
  location: string;
  startPrice: number;
}

export default function LiveAction({ onSearchVin }: LiveActionProps) {
  // Live Auction States
  const [auctions, setAuctions] = useState<AuctionCar[]>([
    {
      vin: 'WP0AB2A92MS299212',
      make: 'Porsche',
      model: '911 Carrera S',
      year: 2021,
      image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800',
      currentBid: 125500,
      reservePrice: 128000,
      timeLeft: 45,
      highBidder: 'Sandro_DE_77',
      bidsCount: 19,
      status: 'active',
      location: 'Frankfurt, DE',
      startPrice: 110000
    },
    {
      vin: 'WBA53BJ0XPX881270',
      make: 'BMW',
      model: 'M5 Competition',
      year: 2023,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800',
      currentBid: 104250,
      reservePrice: 106000,
      timeLeft: 88,
      highBidder: 'Chalon_FR_23',
      bidsCount: 14,
      status: 'active',
      location: 'Lyon, FR',
      startPrice: 95000
    },
    {
      vin: 'SAJGV2RE8MA124850',
      make: 'Land Rover',
      model: 'Range Rover Sport',
      year: 2022,
      image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&q=80&w=800',
      currentBid: 89900,
      reservePrice: 92000,
      timeLeft: 135,
      highBidder: 'Austin_TX_Auto',
      bidsCount: 11,
      status: 'active',
      location: 'Austin, TX',
      startPrice: 80000
    }
  ]);

  // Selected Car for Full Page Detail
  const [selectedVin, setSelectedVin] = useState<string | null>(null);
  
  // Custom Bidding States
  const [customBidAmount, setCustomBidAmount] = useState<string>('');
  const [bidError, setBidError] = useState<string | null>(null);
  const [bidSuccess, setBidSuccess] = useState<boolean>(false);

  // Get currently selected car
  const selectedCar = auctions.find(auc => auc.vin === selectedVin) || null;

  // Decrement Auction Timers every second
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setAuctions(prev => prev.map(auc => {
        if (auc.status === 'sold') return auc;
        if (auc.timeLeft <= 1) {
          return {
            ...auc,
            currentBid: auc.startPrice + Math.floor(Math.random() * 5 + 1) * 1200,
            timeLeft: 60 + Math.floor(Math.random() * 90),
            bidsCount: 3 + Math.floor(Math.random() * 10),
            highBidder: ['Kuro_JP_22', 'Alpha_Swiss', 'Riyadh_Wheels', 'Munich_Direct'][Math.floor(Math.random() * 4)]
          };
        }
        return { ...auc, timeLeft: auc.timeLeft - 1 };
      }));
    }, 1000);
    return () => clearInterval(clockTimer);
  }, []);

  // Simulate remote bot bidders placing live bids on the auction listings
  useEffect(() => {
    const bidSimulator = setInterval(() => {
      const targetIndex = Math.floor(Math.random() * auctions.length);
      const randomBidder = [
        'Hans_Stuttgart', 'Alpha_Motors', 'Sandro_DE_77', 'Geneva_Club_8', 
        'Riyadh_Sport', 'Tokyo_Export', 'Milan_Classic', 'Bimmer_West'
      ][Math.floor(Math.random() * 8)];
      
      const bidIncrement = [500, 1000, 1500, 2000][Math.floor(Math.random() * 4)];

      setAuctions(prev => {
        const next = [...prev];
        const item = next[targetIndex];
        if (item.status === 'active') {
          const nextBid = item.currentBid + bidIncrement;
          next[targetIndex] = {
            ...item,
            currentBid: nextBid,
            bidsCount: item.bidsCount + 1,
            highBidder: randomBidder,
            timeLeft: item.timeLeft < 15 ? item.timeLeft + 15 : item.timeLeft
          };
        }
        return next;
      });
    }, 3200);

    return () => clearInterval(bidSimulator);
  }, [auctions]);

  // Submit custom bid amount
  const handleCustomBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCar) return;

    const parsedBid = parseInt(customBidAmount.replace(/[^0-9]/g, ''), 10);
    const minRequired = selectedCar.currentBid + 100;

    if (isNaN(parsedBid)) {
      setBidError('Please enter a valid numeric amount.');
      setBidSuccess(false);
      return;
    }

    if (parsedBid < minRequired) {
      setBidError(`Your bid must be at least €${minRequired.toLocaleString()}. (Current bid: €${selectedCar.currentBid.toLocaleString()})`);
      setBidSuccess(false);
      return;
    }

    // Success - Apply bid
    setAuctions(prev => prev.map(auc => {
      if (auc.vin === selectedCar.vin) {
        return {
          ...auc,
          currentBid: parsedBid,
          bidsCount: auc.bidsCount + 1,
          highBidder: 'YOU (Private Buyer)',
          timeLeft: auc.timeLeft < 30 ? auc.timeLeft + 20 : auc.timeLeft
        };
      }
      return auc;
    }));

    setBidError(null);
    setBidSuccess(true);
    setCustomBidAmount('');
    
    // Clear success message after 4 seconds
    setTimeout(() => {
      setBidSuccess(false);
    }, 4000);
  };

  // Quick preset helper
  const applyPresetBid = (increment: number) => {
    if (!selectedCar) return;
    const computedBid = selectedCar.currentBid + increment;
    setCustomBidAmount(computedBid.toString());
    setBidError(null);
  };

  // Helper code to convert seconds to readable MM:SS
  const formatTimeStr = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-8 py-6 animate-in fade-in duration-500" id="live-action-page-root">
      
      {/* ==================== VIEW 1: ACTIVE LISTS (GRID VIEW) ==================== */}
      {!selectedCar ? (
        <React.Fragment>
          {/* Premium Minimalistic Header */}
          <div className="text-left pb-4 border-b border-zinc-100">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 font-sans">
              Active Lots
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-normal leading-relaxed">
              Direct secure wholesale channels with live multi-currency counter-party bidding. Click any lot to inspect details & place custom bids.
            </p>
          </div>

          {/* Grid of Cards with staggered spring entry animations */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto"
          >
            {auctions.map((auc) => {
              const isUserHighBidder = auc.highBidder.includes('YOU');
              return (
                <motion.div 
                  key={auc.vin} 
                  variants={cardVariants}
                  whileHover={{ y: -6, scale: 1.01, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.06)" }}
                  onClick={() => {
                    setSelectedVin(auc.vin);
                    setCustomBidAmount((auc.currentBid + 1000).toString());
                    setBidError(null);
                    setBidSuccess(false);
                  }}
                  className={`bg-white rounded-2xl border border-zinc-200/60 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.015)] transition-all duration-300 flex flex-col justify-between text-left group hover:shadow-[0_6px_20px_rgba(0,0,0,0.03)] hover:border-zinc-400 cursor-pointer ${
                    isUserHighBidder ? 'ring-1 ring-emerald-500' : ''
                  }`}
                >
                  {/* Compact image box with premium tags */}
                  <div className="h-36 overflow-hidden relative bg-zinc-50 border-b border-zinc-105">
                    <img 
                      src={auc.image} 
                      alt={`${auc.make} ${auc.model}`}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                      referrerPolicy="no-referrer"
                    />

                    {/* Floating micro live dot */}
                    <div className="absolute top-3 left-3 inline-flex items-center gap-1 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-[8px] font-bold text-zinc-800 tracking-wider uppercase shadow-sm">
                      <span className="w-1 h-1 bg-red-500 rounded-full animate-ping"></span>
                      <span>LIVE</span>
                    </div>

                    {/* Location badge */}
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-zinc-800 text-[9px] font-medium px-2 py-0.5 rounded-full shadow-sm">
                      {auc.location}
                    </div>
                  </div>

                  {/* Information & Action Content */}
                  <div className="p-4 flex-grow flex flex-col justify-between space-y-3.5">
                    
                    {/* Title & Metadata */}
                    <div>
                      <span className="text-[8px] font-bold tracking-wider text-zinc-400 font-mono uppercase block">
                        {auc.vin}
                      </span>
                      <h3 className="text-zinc-900 font-semibold text-sm font-sans tracking-tight leading-tight mt-0.5">
                        {auc.year} {auc.make} {auc.model}
                      </h3>
                    </div>

                    {/* Status metrics strip */}
                    <div className="grid grid-cols-2 gap-3 py-2 border-t border-b border-zinc-100/70">
                      <div>
                        <span className="block text-[8px] text-zinc-400 font-medium uppercase tracking-wider mb-0.5">
                          Current Bid
                        </span>
                        <span className={`text-sm font-semibold font-mono tracking-tight ${isUserHighBidder ? 'text-emerald-600' : 'text-zinc-950'}`}>
                          €{auc.currentBid.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-zinc-400 font-medium uppercase tracking-wider mb-0.5 text-right">
                          Time Left
                        </span>
                        <span className={`text-sm font-semibold font-mono tracking-tight flex items-center justify-end gap-1 ${
                          auc.timeLeft < 20 ? 'text-red-500 animate-pulse' : 'text-zinc-950'
                        }`}>
                          <Clock className="w-3 h-3 opacity-60" />
                          {formatTimeStr(auc.timeLeft)}
                        </span>
                      </div>
                    </div>



                    {/* View Details Prompt */}
                    <div className="space-y-1.5">
                      <button
                        type="button"
                        className="w-full py-1.5 rounded-full text-[10px] font-medium cursor-pointer transition-all duration-200 select-none bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <Zap className="w-2.5 h-2.5 text-amber-450" />
                        <span>Inspect & Choose Bid</span>
                      </button>
                      <div className="flex justify-between items-center px-1 text-[8px] text-zinc-400 font-medium">
                        <span>{auc.bidsCount} bids processed</span>
                        <span>Click to view more</span>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </React.Fragment>
      ) : (
        // ==================== VIEW 2: DETAILED FULL PAGE WORKSPACE ====================
        <div className="space-y-6 text-left animate-in slide-in-from-bottom-4 duration-305">
          
          {/* Back button and navigation locator */}
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
            <button
              onClick={() => setSelectedVin(null)}
              className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 hover:text-zinc-900 cursor-pointer transition-colors group py-1.5 px-3 rounded-lg hover:bg-zinc-100"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to Active Lots</span>
            </button>
            <span className="text-[10px] font-mono text-zinc-400 tracking-wider font-bold">
              LOT ID: {selectedCar.vin}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Aspect Column: Spectacular Image Gallery & Exhaustive Specifications */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="bg-zinc-50 rounded-3xl overflow-hidden border border-zinc-100 relative group shadow-[0_4px_30px_rgba(0,0,0,0.015)]">
                <img 
                  src={selectedCar.image} 
                  alt={`${selectedCar.make} ${selectedCar.model}`}
                  className="w-full h-[380px] md:h-[450px] object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual state pill */}
                <div className="absolute top-5 left-5 inline-flex items-center gap-2 bg-black/80 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-[10px] font-semibold tracking-wider uppercase">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                  <span>LIVE PHYSICAL RECORD STREAM</span>
                </div>

                <div className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-md text-zinc-900 font-mono text-xs px-3.5 py-1.5 rounded-full shadow-md font-bold">
                  📍 {selectedCar.location}
                </div>
              </div>

              {/* Comprehensive technical parameters */}
              <div className="bg-white rounded-3xl border border-zinc-200/60 p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-zinc-900 font-semibold text-lg tracking-tight font-sans">
                    Lot Specification & Metadata
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 font-normal">
                    Verified electronic system parameters queried from corresponding wholesale databases.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                  <div className="py-2.5 border-b border-zinc-100 flex justify-between text-xs">
                    <span className="text-zinc-400 font-medium font-sans">Manufacturer</span>
                    <span className="text-zinc-900 font-semibold">{selectedCar.make}</span>
                  </div>
                  <div className="py-2.5 border-b border-zinc-100 flex justify-between text-xs">
                    <span className="text-zinc-400 font-medium font-sans">Model Variant</span>
                    <span className="text-zinc-900 font-semibold">{selectedCar.model}</span>
                  </div>
                  <div className="py-2.5 border-b border-zinc-100 flex justify-between text-xs">
                    <span className="text-zinc-400 font-medium font-sans">Model Year</span>
                    <span className="text-zinc-900 font-semibold">{selectedCar.year}</span>
                  </div>
                  <div className="py-2.5 border-b border-zinc-100 flex justify-between text-xs">
                    <span className="text-zinc-400 font-medium font-sans">Registry VIN ID</span>
                    <span className="text-zinc-900 font-mono font-bold tracking-tight">{selectedCar.vin}</span>
                  </div>
                  <div className="py-2.5 border-b border-zinc-100/50 sm:border-0 flex justify-between text-xs">
                    <span className="text-zinc-400 font-medium font-sans">Original Start price</span>
                    <span className="text-zinc-900 font-semibold font-mono">€{selectedCar.startPrice.toLocaleString()}</span>
                  </div>
                  <div className="py-2.5 flex justify-between text-xs">
                    <span className="text-zinc-400 font-medium font-sans">Reserve target status</span>
                    <span className="text-[#a16207] font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full text-[10px]">RESERVE CLOSE</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 flex items-start gap-3 bg-zinc-50 rounded-2xl p-4 text-xs text-zinc-500 leading-relaxed">
                  <Shield className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-zinc-700 block mb-0.5">Physical Guarantee Agreement</span>
                    We guarantee physical vehicle parameter alignments of all dealer auction units in Frankfurt, Lyon, and Austin depots. All paint metrics, mechanical fluids, titles, and keys have been audited and hold a clean export bill.
                  </div>
                </div>
              </div>

            </div>

            {/* Right Interactive Column: Bid Desk Widget with Custom Choices */}
            <div className="lg:col-span-5 space-y-6 text-left">
              
              <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 md:p-8 space-y-6 shadow-[0_8px_40px_rgba(0,0,0,0.02)]">
                
                {/* Header state block */}
                <div className="pb-4 border-b border-zinc-150 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block font-mono">Current Premium Listing</span>
                    <h2 className="text-zinc-950 font-semibold text-lg tracking-tight">Active Bid Desk</h2>
                  </div>
                  <div className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200/55 px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest leading-none">
                    <span className="w-1.5 h-1.5 bg-red-605 rounded-full animate-ping"></span>
                    <span>LIVE LOT</span>
                  </div>
                </div>

                {/* Highly Scannable Bid telemetry */}
                <div className="grid grid-cols-2 gap-6 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                  <div>
                    <span className="block text-[9px] text-zinc-400 font-medium uppercase tracking-wider mb-1">
                      Highest Bid
                    </span>
                    <span className={`text-xl md:text-2xl font-semibold font-mono tracking-tight ${
                      selectedCar.highBidder.includes('YOU') ? 'text-emerald-600' : 'text-zinc-900'
                    }`}>
                      €{selectedCar.currentBid.toLocaleString()}
                    </span>
                    <span className="block text-[10px] text-zinc-400 mt-1 font-mono">
                      by {selectedCar.highBidder}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] text-zinc-400 font-medium uppercase tracking-wider mb-1 text-right font-sans">
                      Time Remaining
                    </span>
                    <div className="flex items-center justify-end gap-1.5 text-xl md:text-2xl font-semibold font-mono text-zinc-900">
                      <Clock className="w-4 h-4 text-zinc-400 animate-pulse" />
                      <span>{formatTimeStr(selectedCar.timeLeft)}</span>
                    </div>
                    <span className="block text-[10px] text-zinc-400 mt-1 text-right">
                      {selectedCar.bidsCount} physical bids logged
                    </span>
                  </div>
                </div>

                {/* CUSTOM BID AMOUNT FORM DESK */}
                <form onSubmit={handleCustomBidSubmit} className="space-y-4">
                  
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-zinc-600 uppercase tracking-wider text-left font-sans">
                      Your Custom Bid (EU €)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 font-medium font-sans">
                        €
                      </div>
                      <input 
                        type="text"
                        value={customBidAmount}
                        onChange={(e) => {
                          const filteredVal = e.target.value.replace(/[^0-9]/g, '');
                          setCustomBidAmount(filteredVal);
                          setBidError(null);
                        }}
                        placeholder={`Enter amount (e.g. ${(selectedCar.currentBid + 1500).toLocaleString()})`}
                        className="w-full h-12 pl-8 pr-4 bg-zinc-50 hover:bg-zinc-100/50 focus:bg-white border border-zinc-200 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-400 rounded-xl text-sm font-semibold font-mono text-zinc-900 outline-none transition-all placeholder:text-zinc-350"
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-zinc-400 mt-1">
                      <span>Minimum required bid: <strong className="font-semibold text-zinc-700">€{(selectedCar.currentBid + 100).toLocaleString()}</strong></span>
                      <span>No commission fees</span>
                    </div>
                  </div>

                  {/* Errors and Success indicator banners */}
                  {bidError && (
                    <div className="bg-red-50 border border-red-200/55 rounded-xl p-3 flex gap-2 text-xs text-red-800 tracking-wide font-normal">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <span>{bidError}</span>
                    </div>
                  )}

                  {bidSuccess && (
                    <div className="bg-emerald-50 border border-emerald-200/55 rounded-xl p-3.5 flex gap-2.5 text-xs text-emerald-800 tracking-wide font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Success! Your custom bid has been submitted. You are currently the leading bidder.</span>
                    </div>
                  )}

                  {/* Action Trigger Buttons */}
                  <div className="space-y-3 pt-2">
                    <button
                      type="submit"
                      className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full text-xs font-semibold tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5 text-yellow-400" />
                      <span>Place Custom Lead Bid</span>
                    </button>
                    
                    {/* Instant Preset Increments */}
                    <div className="grid grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => applyPresetBid(1000)}
                        className="py-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/65 text-zinc-805 font-mono text-[10px] font-bold rounded-xl transition-all cursor-pointer text-center"
                      >
                        +€1,000
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPresetBid(5000)}
                        className="py-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/65 text-zinc-805 font-mono text-[10px] font-bold rounded-xl transition-all cursor-pointer text-center"
                      >
                        +€5,000
                      </button>
                      <button
                        type="button"
                        onClick={() => applyPresetBid(10000)}
                        className="py-2.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/65 text-zinc-805 font-mono text-[10px] font-bold rounded-xl transition-all cursor-pointer text-center"
                      >
                        +€10,000
                      </button>
                    </div>
                    <div className="text-[10px] text-zinc-400 text-center font-normal">
                      Presets calculate and fill your bid amount relative to the current highest bid.
                    </div>
                  </div>

                </form>

              </div>

              {/* Secure transactional disclaimer badge */}
              <div className="bg-zinc-50 border border-zinc-155 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-zinc-700 shrink-0">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="text-zinc-850 text-xs font-semibold">Fully Encrypted Bank Escrow</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5 font-normal">Your physical funds are locked until export compliance and digital delivery is established.</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

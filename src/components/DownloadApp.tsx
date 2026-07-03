/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Smartphone, Camera, Shield, Compass, AlertTriangle, Play, CheckCircle, 
  Sparkles, RefreshCw, Smartphone as PhoneIcon, Heart, Star, Award, 
  ArrowRight, Download, Send, QrCode, Zap, Map, Check, ScanLine, 
  Fingerprint, ChevronRight, Bell, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Animation configs
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  }
};

export default function DownloadApp() {
  const [activeInteractiveSim, setActiveInteractiveSim] = useState<'camera' | 'face' | 'nav' | 'radar'>('camera');
  
  // Custom states for interactive features helper
  // 1. Camera scanner state
  const [isScanningVin, setIsScanningVin] = useState(false);
  const [vinScanResult, setVinScanResult] = useState<any | null>(null);

  // 2. Face ID state
  const [faceScanActive, setFaceScanActive] = useState(false);
  const [faceScanStep, setFaceScanStep] = useState<'idle' | 'scanning' | 'matched'>('idle');

  // 3. Navigation test state
  const [isDriving, setIsDriving] = useState(false);
  const [driveDistance, setDriveDistance] = useState(0);

  // 4. Radar alerts simulator state
  const [radarSoundTriggered, setRadarSoundTriggered] = useState(false);

  // QR Code SMS transmitter state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [isSendingSms, setIsSendingSms] = useState(false);

  // Simulator loop for map navigation
  useEffect(() => {
    let intervalId: any;
    if (isDriving) {
      intervalId = setInterval(() => {
        setDriveDistance(prev => {
          if (prev >= 3.8) {
            setIsDriving(false);
            return 3.8;
          }
          return parseFloat((prev + 0.2).toFixed(1));
        });
      }, 300);
    }
    return () => clearInterval(intervalId);
  }, [isDriving]);

  // Action: Scanner simulation
  const handleStartVinScanner = () => {
    setIsScanningVin(true);
    setVinScanResult(null);
    setTimeout(() => {
      setIsScanningVin(false);
      setVinScanResult({
        vin: "WP0AB2A92MS299212",
        make: "Porsche",
        model: "911 Carrera S",
        year: 2023,
        paintMicrons: "115μm (Factory Standard)",
        frameStatus: "No discrepancies detected",
        registryLogs: "3 services found in Stuttgart database"
      });
    }, 2000);
  };

  // Action: Face ID scan simulation
  const handleStartFaceScan = () => {
    setFaceScanActive(true);
    setFaceScanStep('scanning');
    setTimeout(() => {
      setFaceScanStep('matched');
    }, 2500);
  };

  const handleResetFaceScan = () => {
    setFaceScanActive(false);
    setFaceScanStep('idle');
  };

  // Action: Send SMS download link
  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;
    setIsSendingSms(true);
    setTimeout(() => {
      setIsSendingSms(false);
      setSmsSent(true);
    }, 1200);
  };

  return (
    <div className="w-full space-y-16" id="download-app-page-root">
      
      {/* ============================================================== */}
      {/* 1. HERO BRANDING & APP STORE DOWNLOAD BADGES */}
      {/* ============================================================== */}
      <section className="text-center space-y-8 max-w-4xl mx-auto px-4 pt-12" id="download-app-hero">
        
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none uppercase font-display" id="download-app-title">
          Take the platform <span className="text-[#8B0000] drop-shadow-[0_2px_4px_rgba(139,0,0,0.15)]">Anywhere</span>
        </h1>

        {/* Apple and Google Play badges - Custom designed with beautiful interactive 3D styling */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-2" id="app-download-badges-group">
          
          {/* Custom App Store Badge */}
          <a 
            href="#app-store-mock"
            onClick={(e) => { e.preventDefault(); alert("Opening App Store..."); }}
            className="flex items-center gap-3 bg-[#8B0000] text-white px-5 py-3.5 rounded-2xl hover:bg-red-700 transition-colors w-48 text-left group cursor-pointer"
            id="app-store-badge-btn"
          >
            <Play className="w-7 h-7 text-white fill-white shrink-0 group-hover:scale-105 transition-transform" />
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-slate-200 font-medium leading-none">Download on the</span>
              <span className="block text-sm font-black tracking-tight leading-tight mt-0.5">App Store</span>
            </div>
          </a>

          {/* Custom Google Play Badge */}
          <a 
            href="#google-play-mock"
            onClick={(e) => { e.preventDefault(); alert("Opening Google Play..."); }}
            className="flex items-center gap-3 bg-[#8B0000] text-white px-5 py-3.5 rounded-2xl hover:bg-red-700 transition-colors w-48 text-left group cursor-pointer"
            id="google-play-badge-btn"
          >
            <Zap className="w-7 h-7 text-white fill-white shrink-0 group-hover:scale-105 transition-transform" />
            <div>
              <span className="block text-[8px] uppercase tracking-wider text-slate-200 font-medium leading-none">Get it on</span>
              <span className="block text-sm font-black tracking-tight leading-tight mt-0.5">Google Play</span>
            </div>
          </a>

        </div>

      </section>

      {/* ============================================================== */}
      {/* 2. CORE TARGET MOBILE FEATURES SECTION */}
      {/* ============================================================== */}      <section className="max-w-[1240px] mx-auto px-4 space-y-12 text-left" id="mobile-features-section">
        
        <div className="text-center space-y-2 border-b border-slate-100 pb-5 max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase" id="features-header-title">
            Powerful Features Built For Your <span className="text-[#8B0000] drop-shadow-[0_2px_4px_rgba(139,0,0,0.15)]">Mobile</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm font-light leading-relaxed max-w-2xl mx-auto">
            Try out our simple interactive simulators below to see how our app works in real time.
          </p>
        </div>

        {/* Beautiful Features Grid with 3D Look */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          id="mobile-features-grid"
        >
          {/* Card 1: Live Inspection Capture */}
          <motion.div 
            variants={cardVariants}
            onClick={() => setActiveInteractiveSim('camera')}
            className={`bg-white border-2 rounded-3xl p-6 text-left space-y-4 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
              activeInteractiveSim === 'camera' 
                ? 'border-[#8B0000] shadow-[0_15px_30px_rgba(139,0,0,0.12)] bg-red-50/10' 
                : 'border-slate-100 hover:border-[#8B0000]/40 shadow-[0_10px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(139,0,0,0.06)]'
            }`}
            id="mobile-feat-card-1"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#8B0000] flex items-center justify-center font-bold shadow-inner">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900 uppercase">Live Camera Scan</h3>
              <p className="text-slate-500 text-xs font-light leading-relaxed">
                Scan car details or paint thickness with your phone's camera instantly.
              </p>
            </div>
            <div className="pt-2 text-[10px] font-black tracking-wider uppercase text-[#8B0000] flex items-center gap-1">
              <span>Try Simulator</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </motion.div>

          {/* Card 2: Biometric Face Verification */}
          <motion.div 
            variants={cardVariants}
            onClick={() => setActiveInteractiveSim('face')}
            className={`bg-white border-2 rounded-3xl p-6 text-left space-y-4 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
              activeInteractiveSim === 'face' 
                ? 'border-[#8B0000] shadow-[0_15px_30px_rgba(139,0,0,0.12)] bg-red-50/10' 
                : 'border-slate-100 hover:border-[#8B0000]/40 shadow-[0_10px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(139,0,0,0.06)]'
            }`}
            id="mobile-feat-card-2"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#8B0000] flex items-center justify-center font-bold shadow-inner">
                <Fingerprint className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900 uppercase">Face Verification</h3>
              <p className="text-slate-500 text-xs font-light leading-relaxed">
                Confirm user identity safely with a simple face ID check.
              </p>
            </div>
            <div className="pt-2 text-[10px] font-black tracking-wider uppercase text-[#8B0000] flex items-center gap-1">
              <span>Try Simulator</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </motion.div>

          {/* Card 3: Map Turn-by-Turn Navigation */}
          <motion.div 
            variants={cardVariants}
            onClick={() => setActiveInteractiveSim('nav')}
            className={`bg-white border-2 rounded-3xl p-6 text-left space-y-4 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
              activeInteractiveSim === 'nav' 
                ? 'border-[#8B0000] shadow-[0_15px_30px_rgba(139,0,0,0.12)] bg-red-50/10' 
                : 'border-slate-100 hover:border-[#8B0000]/40 shadow-[0_10px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(139,0,0,0.06)]'
            }`}
            id="mobile-feat-card-3"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#8B0000] flex items-center justify-center font-bold shadow-inner">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900 uppercase">Map Navigation</h3>
              <p className="text-slate-500 text-xs font-light leading-relaxed">
                Track active GPS locations and routes on the map.
              </p>
            </div>
            <div className="pt-2 text-[10px] font-black tracking-wider uppercase text-[#8B0000] flex items-center gap-1">
              <span>Try Simulator</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </motion.div>

          {/* Card 4: Smart Radar & Speed Camera Alerts */}
          <motion.div 
            variants={cardVariants}
            onClick={() => setActiveInteractiveSim('radar')}
            className={`bg-white border-2 rounded-3xl p-6 text-left space-y-4 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
              activeInteractiveSim === 'radar' 
                ? 'border-[#8B0000] shadow-[0_15px_30px_rgba(139,0,0,0.12)] bg-red-50/10' 
                : 'border-slate-100 hover:border-[#8B0000]/40 shadow-[0_10px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(139,0,0,0.06)]'
            }`}
            id="mobile-feat-card-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-[#8B0000] flex items-center justify-center font-bold shadow-inner">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-black text-slate-900 uppercase">Safety Alerts</h3>
              <p className="text-slate-500 text-xs font-light leading-relaxed">
                Get alerts for speed limits and highway safety cameras.
              </p>
            </div>
            <div className="pt-2 text-[10px] font-black tracking-wider uppercase text-[#8B0000] flex items-center gap-1">
              <span>Try Simulator</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </motion.div>
        </motion.div>

        {/* ============================================================== */}
        {/* 3. INTERACTIVE SIMULATOR STAGE */}
        {/* ============================================================== */}
        <div className="bg-white border border-slate-100 rounded-[32px] p-6 md:p-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_60px_rgba(139,0,0,0.05)] transition-all duration-300" id="mobile-simulator-sandbox">
          
          {/* Left panel: Info Description regarding selected sim (5 columns) */}
          <div className="md:col-span-5 space-y-4">

            <AnimatePresence mode="wait">
              {activeInteractiveSim === 'camera' && (
                <motion.div
                  key="info-camera"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-3"
                  id="sim-info-camera"
                >
                  <h3 className="text-2xl font-black text-slate-900 uppercase leading-tight">Live Camera Scan</h3>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">
                    Point your phone camera at a car's sticker or chassis number to instantly scan it with AI.
                  </p>
                </motion.div>
              )}

              {activeInteractiveSim === 'face' && (
                <motion.div
                  key="info-face"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-3"
                  id="sim-info-face"
                >
                  <h3 className="text-2xl font-black text-slate-900 uppercase leading-tight">Face Verification</h3>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">
                    Quickly verify buyer and seller identity with a fast secure scan.
                  </p>
                </motion.div>
              )}

              {activeInteractiveSim === 'nav' && (
                <motion.div
                  key="info-nav"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-3"
                  id="sim-info-nav"
                >
                  <h3 className="text-2xl font-black text-slate-900 uppercase leading-tight">GPS Delivery Tracker</h3>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">
                    Track courier delivery locations and routes in real time.
                  </p>
                </motion.div>
              )}

              {activeInteractiveSim === 'radar' && (
                <motion.div
                  key="info-radar"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-3"
                  id="sim-info-radar"
                >
                  <h3 className="text-2xl font-black text-slate-900 uppercase leading-tight">Speed Camera Alerts</h3>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">
                    Get instant alerts for speed limits and highway safety cameras.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right panel: Phone Mockup Stage (7 columns) */}
          <div className="md:col-span-7 flex justify-center">
            
            {/* Native Looking phone envelope */}
            <div className="w-[285px] h-[520px] bg-slate-950 rounded-[44px] p-3 border-[10px] border-slate-900 shadow-xl relative text-white flex flex-col justify-between overflow-hidden" id="native-phone-envelope">
              
              {/* Speaker & Camera notch */}
              <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-32 h-5 bg-slate-900 rounded-full z-10 flex items-center justify-center gap-1.5 px-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-705/80"></div>
                <div className="w-10 h-0.5 rounded bg-slate-805/80"></div>
              </div>

              {/* Status Header */}
              <div className="pt-2 px-4 flex justify-between items-center text-[10px] text-slate-400 select-none z-10">
                <span className="font-mono">09:41 AM</span>
                <div className="flex items-center gap-1">
                  <span>5G</span>
                  <Smartphone className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Screen Body View - Swapped according to selection */}
              <div className="flex-1 my-3 bg-slate-900 rounded-[30px] p-4 relative overflow-y-auto overflow-x-hidden flex flex-col justify-center text-center">
                
                {/* View 1: Inspection Camera */}
                {activeInteractiveSim === 'camera' && (
                  <div className="space-y-4 animate-fadeIn" id="phone-screen-camera">
                    <h4 className="text-[11px] font-black uppercase text-red-500 tracking-wider">AI VIN OCR VIEW</h4>
                    
                    <div className="relative border-2 border-dashed border-red-500/60 rounded-2xl p-4 bg-slate-950 flex flex-col items-center justify-center min-h-[160px]">
                      {isScanningVin ? (
                        <div className="space-y-2 text-center text-red-500">
                          <ScanLine className="w-10 h-10 animate-bounce mx-auto" />
                          <p className="text-[9px] font-mono animate-pulse">ALIGNED. READING LASER CHASSIS...</p>
                        </div>
                      ) : vinScanResult ? (
                        <div className="text-left space-y-1.5 w-full text-[9px] text-slate-300 font-mono">
                          <div className="text-emerald-400 font-bold border-b border-white/10 pb-1 uppercase text-center">SCAN VERIFIED</div>
                          <div><b>CHASSIS:</b> {vinScanResult.vin}</div>
                          <div><b>VEHICLE:</b> {vinScanResult.make} {vinScanResult.model} ({vinScanResult.year})</div>
                          <div><b>PAINT COAT:</b> {vinScanResult.paintMicrons}</div>
                          <div><b>METRICS:</b> {vinScanResult.frameStatus}</div>
                        </div>
                      ) : (
                        <div className="text-center space-y-1">
                          <Camera className="w-8 h-8 text-neutral-500 mx-auto" />
                          <p className="text-[9px] text-slate-400">Position the phone camera directly in front of the vehicle sticker</p>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleStartVinScanner}
                      disabled={isScanningVin}
                      className="w-full bg-[#8B0000] hover:bg-red-700 text-white text-[9.5px] uppercase font-black tracking-wider py-2 rounded-xl transition-all cursor-pointer"
                    >
                      {isScanningVin ? 'Processing Frame...' : 'Start AI Scanner'}
                    </button>
                    {vinScanResult && (
                      <button 
                        onClick={() => setVinScanResult(null)} 
                        className="text-[8px] text-slate-400 uppercase hover:underline"
                      >
                        Reset Simulator
                      </button>
                    )}
                  </div>
                )}

                {/* View 2: Biometric Face ID */}
                {activeInteractiveSim === 'face' && (
                  <div className="space-y-5 animate-fadeIn" id="phone-screen-face">
                    <h4 className="text-[11px] font-black uppercase text-red-500 tracking-wider">BIOMETRIC HANDSHAKE</h4>

                    <div className="relative overflow-hidden flex flex-col items-center justify-center min-h-[180px]">
                      
                      {faceScanStep === 'idle' && (
                        <div className="text-center space-y-3">
                          <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mx-auto text-slate-400 hover:text-white transition-colors cursor-pointer">
                            <Fingerprint className="w-8 h-8" />
                          </div>
                          <p className="text-[9.5px] text-slate-300 leading-tight">Match seller biometrics before transferring car custody registry stamps.</p>
                        </div>
                      )}

                      {faceScanStep === 'scanning' && (
                        <div className="text-center space-y-3">
                          <div className="relative w-24 h-24 rounded-full border-4 border-red-500/20 border-t-red-500 animate-spin mx-auto"></div>
                          <p className="text-[9.5px] text-red-500 font-mono animate-pulse">VERIFYING FACE GEOMETRY...</p>
                        </div>
                      )}

                      {faceScanStep === 'matched' && (
                        <div className="text-center space-y-3" id="faceid-matched-badge">
                          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
                            <ShieldCheck className="w-9 h-9" />
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[10px] text-emerald-400 font-bold font-mono uppercase">IDENTITY VERIFIED</p>
                            <p className="text-[8px] text-slate-400">Match found: Tomas K. (UAB Baltics Group)</p>
                          </div>
                        </div>
                      )}

                    </div>

                    {faceScanStep === 'idle' && (
                      <button
                        type="button"
                        onClick={handleStartFaceScan}
                        className="w-full bg-[#8B0000] hover:bg-red-700 text-white text-[9.5px] uppercase font-black tracking-wider py-2 rounded-xl transition-all cursor-pointer"
                      >
                        Scan Face Signature
                      </button>
                    )}

                    {faceScanStep === 'matched' && (
                      <button
                        type="button"
                        onClick={handleResetFaceScan}
                        className="w-full bg-slate-800 text-slate-300 text-[9.5px] uppercase font-bold py-2 rounded-xl transition-all cursor-pointer"
                      >
                        Reset Check
                      </button>
                    )}
                  </div>
                )}

                {/* View 3: Navigation */}
                {activeInteractiveSim === 'nav' && (
                  <div className="space-y-4 animate-fadeIn" id="phone-screen-nav">
                    <h4 className="text-[11px] font-black uppercase text-emerald-400 tracking-wider">ACTIVE DELIVERY ROADWAY</h4>

                    <div className="bg-slate-950 p-3 rounded-2xl border border-white/5 space-y-3 text-left">
                      <div className="flex justify-between items-center text-[8.5px] text-slate-400">
                        <span className="font-bold">ROUTE: Vilnius → Warsaw</span>
                        <span className="text-emerald-400 font-mono font-black animate-pulse">GPS ACTIVE</span>
                      </div>

                      {/* Fake stylized map graphics in CSS */}
                      <div className="relative h-28 bg-emerald-950/20 rounded-xl overflow-hidden border border-emerald-500/20 flex flex-col justify-between p-2 font-mono text-[8px] text-emerald-400">
                        <div className="flex justify-between">
                          <span>Hub Departure</span>
                          <span>Borders Custom Check</span>
                        </div>
                        
                        {/* Interactive dynamic progress line */}
                        <div className="w-full bg-slate-800 h-1 rounded-full relative">
                          <div 
                            className="bg-emerald-500 h-1 rounded-full transition-all duration-300" 
                            style={{ width: `${(driveDistance / 3.8) * 100}%` }}
                          />
                          <div 
                            className="absolute bg-white border border-emerald-500 w-2.5 h-2.5 rounded-full -top-1 shadow transition-all duration-300"
                            style={{ left: `calc(${(driveDistance / 3.8) * 100}% - 4px)` }}
                          />
                        </div>

                        <div className="flex justify-between text-slate-400">
                          <span>Transit status</span>
                          <span>{driveDistance}km / 3.8km test corridor</span>
                        </div>
                      </div>

                      <div className="text-[8.5px] space-y-0.5 text-slate-300 font-mono">
                        <div><b>Logistics Transporter:</b> Lithuania Logistics Corp</div>
                        <div><b>Active Geofence:</b> Cargo Secure Transit Gate</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => { setDriveDistance(0); setIsDriving(true); }}
                      disabled={isDriving}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[9.5px] uppercase font-black tracking-wider py-2 rounded-xl transition-all cursor-pointer"
                    >
                      {isDriving ? 'Moving along coordinates...' : 'Simulate Logistics Drive'}
                    </button>
                  </div>
                )}

                {/* View 4: Speed Alerts */}
                {activeInteractiveSim === 'radar' && (
                  <div className="space-y-4 animate-fadeIn" id="phone-screen-radar">
                    <h4 className="text-[11px] font-black uppercase text-red-500 tracking-wider">RADAR RISK CONTROLLER</h4>

                    <div className="bg-slate-950 rounded-2xl border border-white/5 p-4 flex flex-col items-center justify-center min-h-[160px] relative">
                      
                      {radarSoundTriggered ? (
                        <div className="space-y-3 text-center animate-bounce" id="active-radar-panel">
                          <div className="w-12 h-12 rounded-full bg-red-650 text-white flex items-center justify-center mx-auto animate-ping absolute top-12 left-[105px] opacity-75"></div>
                          <div className="w-14 h-14 rounded-full bg-red-600 border border-white text-white flex items-center justify-center mx-auto relative z-10">
                            <AlertTriangle className="w-7 h-7" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-[11px] text-red-500 font-black uppercase tracking-wider font-mono">CAMERA DETECTED</p>
                            <p className="text-[8.5px] text-slate-300">Section Speed Control: <b>80 km/h</b> limit</p>
                            <p className="text-[7.5px] text-slate-500 font-mono">A1 Highway (LT) Chainage KM 45.2</p>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center space-y-3">
                          <Bell className="w-10 h-10 text-slate-500 mx-auto" />
                          <p className="text-[9px] text-slate-400">Warnings flash automatically when within 1 km of speed cameras</p>
                        </div>
                      )}

                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setRadarSoundTriggered(true);
                        setTimeout(() => setRadarSoundTriggered(false), 3800);
                      }}
                      className="w-full bg-[#8B0000] hover:bg-red-700 text-white text-[9.5px] uppercase font-black tracking-wider py-2 rounded-xl transition-all cursor-pointer"
                    >
                      Trigger Simulated Alarm
                    </button>
                  </div>
                )}

              </div>

              {/* Home Indicator line */}
              <div className="pb-1.5 flex justify-center z-10">
                <div className="w-24 h-1 rounded bg-slate-700"></div>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ============================================================== */}
      {/* 4. REAL-TIME QR CODE DOWNLOAD SECTION */}
      {/* ============================================================== */}
      <section className="bg-neutral-50/50 text-slate-900 border-y border-slate-100 py-16 text-left" id="qr-code-download-section">
        <div className="max-w-[1240px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* QR info descriptive sidebar (7 columns) */}
          <div className="lg:col-span-7 space-y-8">
            
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase leading-none font-display">
              Scan the QR Code to <span className="text-[#8B0000] drop-shadow-[0_2px_4px_rgba(139,0,0,0.15)]">Get the App</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-2">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#8B0000] shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600">
                  <span className="font-bold text-slate-900 block text-sm mb-1">Works on All Devices</span>
                  Fully compatible with iOS and Android phones.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#8B0000] shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600">
                  <span className="font-bold text-slate-900 block text-sm mb-1">Offline Support</span>
                  Works even when your internet is slow or disconnected.
                </div>
              </div>
            </div>

            {/* Programmatic Direct SMS trigger form */}
            <form onSubmit={handleSendSms} className="bg-white border border-slate-100 p-6 rounded-[24px] space-y-4 max-w-lg shadow-[0_15px_30px_rgba(0,0,0,0.02)]">
              <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 block">
                Or get a link sent directly to your phone
              </label>
              
              <div className="flex gap-2.5">
                <input
                  required
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 focus:border-[#8B0000] text-xs px-4 py-3 rounded-xl font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all"
                />
                
                <button
                  type="submit"
                  disabled={isSendingSms || smsSent}
                  className="bg-[#8B0000] text-white font-extrabold uppercase text-[10px] px-6 py-3 rounded-xl border-b-2 border-[#5a0000] hover:translate-y-[1px] hover:border-b active:translate-y-[2px] active:border-b-0 transition-all cursor-pointer shadow-[0_4px_10px_rgba(139,0,0,0.15)] whitespace-nowrap"
                >
                  {isSendingSms ? 'Sending...' : smsSent ? 'Sent ✓' : 'Send Link'}
                </button>
              </div>

              {smsSent && (
                <p className="text-[10px] text-emerald-600 font-medium leading-relaxed">
                  Link sent! Check your phone messages at <b>{phoneNumber}</b>.
                </p>
              )}
            </form>
          </div>

          {/* QR visual stage with beautiful 3D Look (5 columns) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            
            <div className="bg-white p-6 rounded-[32px] shadow-[0_20px_50px_rgba(139,0,0,0.06)] hover:shadow-[0_25px_60px_rgba(139,0,0,0.1)] transition-all duration-300 relative border-2 border-slate-100 text-center space-y-4 max-w-[280px] hover:-translate-y-1">
              
              <div className="relative p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center">
                <QrCode className="w-44 h-44 text-slate-900 stroke-[1.25]" />
                
                {/* Visual scan overlay simulation */}
                <div className="absolute inset-x-4 top-1/2 h-0.5 bg-[#8B0000] shadow-[0_0_8px_rgba(139,0,0,0.8)] animate-pulse z-10"></div>
              </div>

              <div className="space-y-1 select-none">
                <p className="text-[11px] text-slate-500 leading-tight">
                  Point your phone camera here to scan
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

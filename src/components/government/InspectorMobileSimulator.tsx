/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Camera, CheckCircle, Shield, RefreshCw, Smartphone, MapPin, 
  Send, AlertTriangle, FileText, Landmark, ClipboardCheck, ChevronRight, Check, X, CheckCircle2, UserCheck, ShieldAlert, Zap, Layers, FileSignature, Sparkles
} from 'lucide-react';
import { VEHICLES } from '../../data';
import { motion, AnimatePresence } from 'motion/react';

interface InspectorMobileSimulatorProps {
  onScanCleared?: () => void;
}

export default function InspectorMobileSimulator({ onScanCleared }: InspectorMobileSimulatorProps) {
  // Mobile app navigation state
  const [currentStep, setCurrentStep] = useState<'login' | 'queue' | 'vin_scan' | 'camera_studio' | 'ocr_scan' | 'ai_verification' | 'submission' | 'complete'>('login');
  
  // Auth & Location State
  const [inspectorId, setInspectorId] = useState('INS-MASTER-8821');
  const [locationTag, setLocationTag] = useState('Port Everglades Sector 3');
  const [availableLocations] = useState([
    'Port Everglades Sector 3',
    'Miami Custom Border Hub 4',
    'Oakland Logistics Depot #2',
    'San Jose Station #12'
  ]);

  // Selected Target Vehicle from Queue
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  
  // Simulation Step states
  const [scanningVin, setScanningVin] = useState(false);
  const [scannedVinResult, setScannedVinResult] = useState('');
  
  // Multi angle capture state
  const [capturedPhotos, setCapturedPhotos] = useState<{
    exteriorFront: boolean;
    exteriorRear: boolean;
    interiorCluster: boolean;
    engineBay: boolean;
  }>({
    exteriorFront: false,
    exteriorRear: false,
    interiorCluster: false,
    engineBay: false
  });
  
  const [capturingPhotoKey, setCapturingPhotoKey] = useState<string | null>(null);
  const [capturedUrls, setCapturedUrls] = useState<Record<string, string>>({});
  const [livenessStatus, setLivenessStatus] = useState<'idle' | 'analyzing' | 'passed' | 'failed'>('idle');

  // OCR state
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrExtractedData, setOcrExtractedData] = useState<{
    registeredOwner: string;
    policyNumber: string;
    expiryDate: string;
    ocrConfidence: string;
  } | null>(null);

  // AI Verification states
  const [calculatingAI, setCalculatingAI] = useState(false);
  const [aiReport, setAiReport] = useState<{
    fraudScore: number;
    mileageAnomalies: boolean;
    manufacturerDbMatch: boolean;
    historyLog: { year: number; mileage: number; source: string }[];
  } | null>(null);

  // Inspector feedback states
  const [finalDecision, setFinalDecision] = useState<'Approved' | 'Rejected' | 'Flagged'>('Approved');
  const [inspectorNotes, setInspectorNotes] = useState('');
  const [generatedCertificateId, setGeneratedCertificateId] = useState('');

  // Active Center inspection queue seed (We read/write from localStorage so dashboard and app are in sync!)
  const [localQueue, setLocalQueue] = useState<any[]>([]);

  useEffect(() => {
    // Synchronize queue from localStorage or seed
    const storedQueue = localStorage.getItem('gov_inspection_queue');
    if (storedQueue) {
      setLocalQueue(JSON.parse(storedQueue));
    } else {
      const initialQueue = [
        { vin: 'WP0AB2A92MS299212', make: 'Porsche', model: '911 Carrera S', year: 2021, category: 'Customs VAT Check', waitTime: '12 min', status: 'Ready' },
        { vin: 'WBA53BJ0XPX881270', make: 'BMW', model: 'M5 Competition', year: 2023, category: 'Salvage Re-certification', waitTime: '24 min', status: 'Ready' },
        { vin: '5YJSA1E4XPF231495', make: 'Tesla', model: 'Model S Plaid', year: 2023, category: 'Emissions Audit', waitTime: '45 min', status: 'Ready' }
      ];
      localStorage.setItem('gov_inspection_queue', JSON.stringify(initialQueue));
      setLocalQueue(initialQueue);
    }
  }, [currentStep]);

  // Handle Log-in / Register Session
  const handleStartSession = () => {
    setCurrentStep('queue');
  };

  // Begin inspection sequence on specific vehicle from queue
  const handleSelectInvoiceAndBegin = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setCurrentStep('vin_scan');
    // Save live audit trail log
    saveAuditTrailLog(`Session initiated for vehicle ${vehicle.make} ${vehicle.model} (VIN: ${vehicle.vin}) by Inspector ${inspectorId} at ${locationTag}`);
  };

  // Helper to log state audits centralized
  const saveAuditTrailLog = (details: string) => {
    const historicalLogsStr = localStorage.getItem('gov_audit_trail') || '[]';
    const logs = JSON.parse(historicalLogsStr);
    logs.unshift({
      id: `LOG-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      operator: inspectorId,
      location: locationTag,
      details: details
    });
    localStorage.setItem('gov_audit_trail', JSON.stringify(logs));
  };

  // Step 1: Simulated VIN Laser Scanning
  const triggerLaserScanner = () => {
    setScanningVin(true);
    setTimeout(() => {
      setScannedVinResult(selectedVehicle?.vin || 'WP0AB2A92MS299212');
      setScanningVin(false);
      saveAuditTrailLog(`Live optical VIN laser scan successfully aligned. Authenticated value: ${selectedVehicle?.vin}`);
    }, 1800);
  };

  const proceedToCameraStudio = () => {
    setCurrentStep('camera_studio');
  };

  // Step 2: Live Camera Studio capture (no gallery file allowed)
  const capturePhotoStreamKey = (key: 'exteriorFront' | 'exteriorRear' | 'interiorCluster' | 'engineBay') => {
    setCapturingPhotoKey(key);
    setLivenessStatus('analyzing');
    
    // Simulate real camera frame capture
    setTimeout(() => {
      const mockImages: Record<string, string> = {
        exteriorFront: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=260',
        exteriorRear: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=260',
        interiorCluster: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=260',
        engineBay: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=260'
      };
      
      setCapturedUrls(prev => ({
        ...prev,
        [key]: mockImages[key]
      }));
      setCapturedPhotos(prev => ({
        ...prev,
        [key]: true
      }));
      setLivenessStatus('passed');
      setCapturingPhotoKey(null);
      saveAuditTrailLog(`Live high-liveness anti-spoof camera frame registered for angle: ${String(key)}`);
    }, 1500);
  };

  const isAllAnglesCaptured = () => {
    return capturedPhotos.exteriorFront && capturedPhotos.exteriorRear && capturedPhotos.interiorCluster && capturedPhotos.engineBay;
  };

  // Step 3: OCR scanner alignment and extraction
  const runOcrExtractor = () => {
    setOcrScanning(true);
    setOcrExtractedData(null);

    setTimeout(() => {
      const generatedOcr = {
        registeredOwner: selectedVehicle?.vin === 'WBA53BJ0XPX881270' ? 'Victor Gerasimov' : 'Alexander Vanguard',
        policyNumber: `POL-${Math.floor(100000 + Math.random() * 900000)}`,
        expiryDate: '12/28/2026',
        ocrConfidence: '99.2%'
      };
      setOcrExtractedData(generatedOcr);
      setOcrScanning(false);
      saveAuditTrailLog(`Real-time Optical Character Recognition (OCR) extracted registry paper data for VIN: ${selectedVehicle?.vin}`);
    }, 1800);
  };

  // Step 4: AI calculations for mileage and historical fraud scores
  const compileAICoPilotIntegrityAnalysis = () => {
    setCalculatingAI(true);
    setCurrentStep('ai_verification');

    setTimeout(() => {
      // Logic targets odometer inconsistencies if it's the BMW M5 (Gerasimov) indicating potential mileage rollbacks
      const isM5 = selectedVehicle?.vin === 'WBA53BJ0XPX881270';
      const fraudScore = isM5 ? 92 : 14; 
      const mileageAnomalies = isM5;

      const historyLog = isM5 ? [
        { year: 2024, mileage: 6200, source: 'German Factory Check-in' },
        { year: 2025, mileage: 32400, source: 'KBA German Registration' },
        { year: 2026, mileage: 12402, source: 'State Import Registry (Odometer Tamper Suspected)' }
      ] : [
        { year: 2024, mileage: 1200, source: 'Factory Inspection' },
        { year: 2025, mileage: 3100, source: 'California Service Hub' },
        { year: 2026, mileage: 4203, source: 'Digital Odometer Verification' }
      ];

      setAiReport({
        fraudScore,
        mileageAnomalies,
        manufacturerDbMatch: !isM5, // BMW M5 paint override flag
        historyLog
      });
      setCalculatingAI(false);
      saveAuditTrailLog(`AI Copilot risk validation pipeline processed. Results formulated (Fraud score: ${fraudScore}%)`);
    }, 1800);
  };

  // Step 5: Final review and certificate seals
  const dispatchDossierAndCommit = () => {
    const certId = `CERT-DMV-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedCertificateId(certId);

    // Build the finalized certificate document
    const certificateItem = {
      certificateId: certId,
      vin: selectedVehicle?.vin,
      model: `${selectedVehicle?.year} ${selectedVehicle?.make} ${selectedVehicle?.model}`,
      inspector: inspectorId,
      location: locationTag,
      approvalStatus: finalDecision,
      notes: inspectorNotes || "Standard logistics clearance approved under federal protocol guidelines.",
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      photos: capturedUrls,
      fraudScore: aiReport?.fraudScore || 10,
      extractedOwner: ocrExtractedData?.registeredOwner || 'N/A'
    };

    // Save certificate list to localStorage
    const storedCertsStr = localStorage.getItem('gov_certificates') || '[]';
    const certs = JSON.parse(storedCertsStr);
    certs.unshift(certificateItem);
    localStorage.setItem('gov_certificates', JSON.stringify(certs));

    // Remove or update the vehicle's status in local queue to match real-time
    const updatedQueue = localQueue.map(item => {
      if (item.vin === selectedVehicle?.vin) {
        return { ...item, status: finalDecision === 'Approved' ? 'Cleared' : 'Flagged' };
      }
      return item;
    });
    localStorage.setItem('gov_inspection_queue', JSON.stringify(updatedQueue));
    setLocalQueue(updatedQueue);

    // Sync outbound to justcarsale.com simulated profiles (writes to shared JSON context log inside browser)
    saveAuditTrailLog(`Sealed state DMV Inspection Certificate generated and issued: ${certId}`);
    
    // Update police link and external sync states if flagged
    if (finalDecision === 'Rejected' || finalDecision === 'Flagged') {
      const flaggedIncidentReportsStr = localStorage.getItem('gov_flagged_alerts') || '[]';
      const flags = JSON.parse(flaggedIncidentReportsStr);
      flags.unshift({
        id: `ALRT-${Math.floor(1000 + Math.random() * 9000)}`,
        vin: selectedVehicle?.vin,
        model: `${selectedVehicle?.year} ${selectedVehicle?.make} ${selectedVehicle?.model}`,
        crimeTag: finalDecision === 'Rejected' ? 'Odometer Forgery Block' : 'Suspicious Customs Value',
        urgency: 'HIGH_ANOMALY',
        source: 'AI Co-Pilot Live',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
      });
      localStorage.setItem('gov_flagged_alerts', JSON.stringify(flags));
    }

    setCurrentStep('complete');
    if (onScanCleared) {
      onScanCleared();
    }
  };

  const handleResetSimulator = () => {
    setSelectedVehicle(null);
    setScannedVinResult('');
    setCapturedPhotos({
      exteriorFront: false,
      exteriorRear: false,
      interiorCluster: false,
      engineBay: false
    });
    setCapturedUrls({});
    setOcrExtractedData(null);
    setAiReport(null);
    setInspectorNotes('');
    setFinalDecision('Approved');
    setCurrentStep('queue');
  };

  return (
    <div className="flex flex-col items-center select-none" id="inspector-phone-container">
      {/* Sleek tactile graphite mobile chassis */}
      <div className="w-[365px] h-[670px] bg-zinc-950 rounded-[50px] border-[11px] border-zinc-900 p-3.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col justify-between ring-1 ring-white/10">
        
        {/* Apple Dynamic Island */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-zinc-900 rounded-full z-50 flex items-center justify-center border border-zinc-800/80">
          <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full absolute right-4"></div>
          <div className="w-8 h-1 bg-zinc-850 rounded-full"></div>
        </div>

        {/* Minimal cellular top indicator status bar */}
        <div className="pt-1.5 px-4 flex justify-between items-center text-[9px] font-semibold text-zinc-400 z-40 select-none">
          <span>9:41 AM</span>
          <div className="flex items-center gap-1.5 text-zinc-400 font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[8px] uppercase tracking-wider font-bold">INS-ACTIVE</span>
          </div>
        </div>

        {/* Mobile Viewport Screen */}
        <div className="flex-grow bg-slate-50 rounded-[38px] overflow-hidden mt-3.5 p-3 flex flex-col justify-between text-zinc-900 border border-zinc-200/35 relative">
          
          {/* Header navigation bar */}
          <div className="pb-2 border-b border-zinc-100 flex items-center justify-between text-left shrink-0">
            <div className="flex items-center gap-1.5">
              <Landmark size={12} className="text-zinc-650" />
              <span className="text-[9px] font-extrabold tracking-wider uppercase text-zinc-500 font-sans">
                DMV Field Audits
              </span>
            </div>
            <div className="bg-zinc-900 text-white px-2 py-0.5 rounded-md text-[7.5px] font-mono font-bold uppercase shrink-0">
              {locationTag.split(' ')[0]}
            </div>
          </div>

          {/* Main workspace section utilizing Framer Motion */}
          <div className="flex-grow overflow-y-auto no-scrollbar py-2.5 flex flex-col justify-start">
            <AnimatePresence mode="wait">
              
              {/* SCREEN 1: LOGIN & INITIALIZER */}
              {currentStep === 'login' && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4 text-center my-auto"
                >
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl flex justify-center w-12 h-12 mx-auto items-center text-blue-600">
                    <UserCheck size={22} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-zinc-950 tracking-tight">DMV Inspector Terminal</h3>
                    <p className="text-[10px] text-zinc-500 max-w-[240px] mx-auto leading-relaxed">
                      Federal clearance hub. Authenticate inspector profile token to download current port queue.
                    </p>
                  </div>

                  <div className="space-y-2.5 px-2 text-left">
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-bold uppercase text-zinc-400">Inspector ID Pin</label>
                      <input 
                        type="text"
                        value={inspectorId}
                        onChange={e => setInspectorId(e.target.value)}
                        className="w-full bg-white border border-zinc-200 px-3 py-1.5 rounded-xl text-[11px] outline-none focus:border-zinc-400 font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-bold uppercase text-zinc-400">Gateway Location Tag</label>
                      <select
                        value={locationTag}
                        onChange={e => setLocationTag(e.target.value)}
                        className="w-full bg-white border border-zinc-200 px-2 py-1.5 rounded-xl text-[11.5px] outline-none"
                      >
                        {availableLocations.map(loc => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={handleStartSession}
                      className="w-full bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl h-10 mt-3 text-[11px] font-semibold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                    >
                      <span>ACTIVATE SCANNER PORT</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* SCREEN 2: ACTIVE FACILITY INSPECTION QUEUE */}
              {currentStep === 'queue' && (
                <motion.div
                  key="queue"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3.5 text-left"
                >
                  <div className="flex justify-between items-center bg-zinc-100 p-2 rounded-xl border border-zinc-200/50">
                    <div className="flex items-center gap-1">
                      <MapPin size={11} className="text-zinc-600" />
                      <span className="text-[9px] font-semibold text-zinc-700">{locationTag}</span>
                    </div>
                    <span className="text-[7.5px] font-mono text-zinc-400 uppercase font-black">Active Terminal</span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-zinc-950 tracking-tight">Arrival Clearance Queue</h4>
                    <p className="text-[9.5px] text-zinc-500 leading-tight">
                      Identify the lot below or verify newly scanned imports.
                    </p>
                  </div>

                  <div className="space-y-2 max-h-[320px] overflow-y-auto pr-0.5">
                    {localQueue.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectInvoiceAndBegin(item)}
                        className="bg-white border border-zinc-250/50 p-2.5 rounded-2xl hover:border-zinc-400 cursor-pointer transition-all flex justify-between items-center group shadow-xs active:scale-99"
                      >
                        <div className="space-y-0.5">
                          <span className={`text-[7.5px] font-mono px-1.5 py-0.5 rounded font-black uppercase text-white ${
                            item.category.includes('Customs') ? 'bg-[#0b1431]' : 'bg-zinc-800'
                          }`}>
                            {item.category}
                          </span>
                          <span className="text-[10px] font-black text-zinc-900 block pt-1 leading-none group-hover:text-blue-600">
                            {item.year} {item.make} {item.model}
                          </span>
                          <span className="text-[8.5px] font-mono text-zinc-400 block pt-0.5">VIN: {item.vin.substring(0,10)}...</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[8px] font-mono text-slate-400 block font-bold">WAIT TIME</span>
                          <span className="text-[9.5px] font-bold text-zinc-800 font-mono block">{item.waitTime}</span>
                          <span className={`text-[8px] font-semibold px-1 py-0.2 rounded font-mono ${
                            item.status === 'Ready' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentStep('login')}
                    className="w-full text-center py-1 text-zinc-400 text-[8.5px] font-bold tracking-widest hover:text-zinc-650 uppercase mt-2 font-mono"
                  >
                    ⬅️ DE-ACTIVATE SESSION BOARD
                  </button>
                </motion.div>
              )}

              {/* VIEW 1 - STEP 1: LIVE VIN SCANNER SCREEN */}
              {currentStep === 'vin_scan' && (
                <motion.div
                  key="vin"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 text-center"
                >
                  <div className="space-y-0.5 text-left">
                    <span className="text-[8px] font-mono font-bold uppercase text-zinc-400">Step 1 of 5</span>
                    <h4 className="text-xs font-black text-zinc-950 tracking-tight">Align Windshield VIN Barcode</h4>
                  </div>

                  {/* Camera scan area simulation */}
                  <div className="h-44 bg-zinc-90 w-full rounded-2xl relative border border-zinc-250 overflow-hidden flex flex-col items-center justify-center bg-zinc-900 group">
                    
                    {scanningVin ? (
                      <div className="space-y-2 text-center relative z-20">
                        <span className="text-[8px] font-mono font-black text-zinc-350 tracking-widest animate-pulse block uppercase">
                          OPTICAL ANALYSIS ACTIVE
                        </span>
                        <div className="w-2.5 h-2.5 bg-red-650 rounded-full mx-auto animate-ping"></div>
                        <span className="text-[9px] text-zinc-400 block font-mono">Decoding factory plaques...</span>
                      </div>
                    ) : scannedVinResult ? (
                      <div className="space-y-2 text-center p-4 relative z-20">
                        <CheckCircle size={24} className="text-emerald-500 mx-auto" />
                        <span className="text-[9.5px] font-mono text-zinc-200 block uppercase font-bold bg-zinc-800 px-3 py-1 rounded-full border border-zinc-700">
                          VIN DECODED: {scannedVinResult}
                        </span>
                      </div>
                    ) : (
                      <div className="space-y-2 text-center text-zinc-400 relative z-20 cursor-pointer" onClick={triggerLaserScanner}>
                        <Camera size={26} className="mx-auto" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-350">Comence scanner focus</span>
                      </div>
                    )}

                    {/* Laser scan horizontal moving red beam */}
                    {scanningVin && (
                      <div className="absolute left-0 right-0 h-0.5 bg-red-500 top-4 shadow-[0_0_8px_red] animate-[scan_2s_infinite]"></div>
                    )}

                    {/* Camera Aligning bracket box overlays */}
                    <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/50"></div>
                    <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/50"></div>
                    <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/50"></div>
                    <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/50"></div>
                  </div>

                  {scannedVinResult && (
                    <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-2xl text-left space-y-1 font-sans animate-in fade-in">
                      <span className="text-[8px] font-mono text-emerald-700 block font-bold">REGISTRY SPEC CHECK</span>
                      <p className="text-[10px] text-emerald-800 leading-tight font-medium">
                        ✅ Success: Checked out matches manufacturer {selectedVehicle?.make} factory chassis configuration.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentStep('queue')}
                      className="flex-1 border border-zinc-200 bg-white py-2 rounded-xl text-[10px] font-bold uppercase tracking-wide cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      disabled={!scannedVinResult}
                      onClick={proceedToCameraStudio}
                      className={`flex-1 text-white py-2 rounded-xl text-[10px] font-bold uppercase tracking-wide transition-colors ${
                        scannedVinResult ? 'bg-zinc-950 hover:bg-zinc-800' : 'bg-zinc-250 text-zinc-400 cursor-not-allowed'
                      }`}
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {/* VIEW 1 - STEP 2: LIVE CAMERA CAPTURE STUDIO */}
              {currentStep === 'camera_studio' && (
                <motion.div
                  key="studio"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-3 text-left"
                >
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-mono font-bold uppercase text-zinc-400">Step 2 of 5</span>
                    <h4 className="text-xs font-black text-zinc-950 tracking-tight">Live Camera Photo Studio</h4>
                  </div>

                  {/* Strict Guardrail warning */}
                  <div className="bg-amber-50 border border-amber-100 p-2.5 rounded-2xl flex items-start gap-2">
                    <ShieldAlert size={12} className="text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[8.5px] text-amber-800 leading-normal font-sans">
                      ⚠️ <strong>SECURITY ALERT:</strong> Gallery file pre-uploads blocked by endpoint authority systems. Only direct live camera lens inputs accepted.
                    </p>
                  </div>

                  {/* Multi angle click targets */}
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'exteriorFront' as const, label: '360° Exterior Front' },
                      { key: 'exteriorRear' as const, label: '360° Exterior Rear' },
                      { key: 'interiorCluster' as const, label: 'Interior Dashboard' },
                      { key: 'engineBay' as const, label: 'Firewall Engine Bay' }
                    ].map(photo => (
                      <div 
                        key={photo.key}
                        onClick={() => !capturedPhotos[photo.key] && capturePhotoStreamKey(photo.key)}
                        className={`h-20 border rounded-2xl relative overflow-hidden flex flex-col justify-between p-2 cursor-pointer transition-all ${
                          capturedPhotos[photo.key]
                            ? 'border-emerald-300 bg-emerald-50/20'
                            : 'border-zinc-200 bg-white hover:border-zinc-350'
                        }`}
                      >
                        {capturedUrls[photo.key] ? (
                          <>
                            <img 
                              src={capturedUrls[photo.key]} 
                              alt={photo.label} 
                              className="absolute inset-0 w-full h-full object-cover opacity-85" 
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="relative z-10 flex w-full justify-between items-center mt-auto">
                              <span className="text-[7.5px] text-white font-bold leading-none">{photo.label}</span>
                              <CheckCircle size={11} className="text-emerald-450 fill-emerald-50" />
                            </div>
                          </>
                        ) : capturingPhotoKey === photo.key ? (
                          <div className="m-auto flex flex-col items-center gap-1">
                            <RefreshCw size={12} className="animate-spin text-zinc-400" />
                            <span className="text-[7.5px] text-zinc-400 font-mono">Analyzing liveness...</span>
                          </div>
                        ) : (
                          <>
                            <Camera size={14} className="text-zinc-400" />
                            <span className="text-[8px] text-zinc-500 font-semibold leading-tight">{photo.label}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {livenessStatus === 'passed' && (
                    <div className="bg-emerald-50 border border-emerald-100 p-2 rounded-2xl flex items-center gap-2">
                      <Zap size={11} className="text-emerald-600 shrink-0" />
                      <span className="text-[8.5px] text-emerald-800 font-bold leading-none font-mono">
                        LIVENESS CONFIRMED: Live Optical metadata sealed.
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => setCurrentStep('vin_scan')}
                      className="flex-1 border border-zinc-205 bg-white py-2 rounded-xl text-[10px] font-bold uppercase tracking-wide cursor-pointer text-center"
                    >
                      Back
                    </button>
                    <button
                      disabled={!isAllAnglesCaptured()}
                      onClick={() => setCurrentStep('ocr_scan')}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wide transition-colors text-center ${
                        isAllAnglesCaptured() ? 'bg-zinc-950 text-white hover:bg-zinc-800' : 'bg-zinc-250 text-zinc-400 cursor-not-allowed'
                      }`}
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {/* VIEW 1 - STEP 3: DOCUMENT OCR LIVE SCANNER */}
              {currentStep === 'ocr_scan' && (
                <motion.div
                  key="ocr"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-3.5 text-left"
                >
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-mono font-bold uppercase text-zinc-400">Step 3 of 5</span>
                    <h4 className="text-xs font-black text-zinc-950 tracking-tight">State Registry &amp; InsurTech OCR Document Grab</h4>
                  </div>

                  <div className="h-32 bg-zinc-900 border border-zinc-250 rounded-2xl relative overflow-hidden flex flex-col justify-center items-center p-3 text-center">
                    {ocrScanning ? (
                      <div className="space-y-1 text-center relative z-20">
                        <RefreshCw size={18} className="animate-spin text-zinc-200 mx-auto" />
                        <span className="text-[8px] font-mono text-zinc-350 font-bold uppercase tracking-widest block pt-1.5">
                          Running Neural Extraction OCR...
                        </span>
                      </div>
                    ) : ocrExtractedData ? (
                      <div className="space-y-1 relative z-20">
                        <CheckCircle2 size={20} className="text-emerald-500 mx-auto" />
                        <span className="text-[9.5px] font-bold text-zinc-100 block">Paper Audit Form Registered</span>
                        <span className="text-[8px] text-zinc-400 font-mono block">Confidence rate: {ocrExtractedData.ocrConfidence}</span>
                      </div>
                    ) : (
                      <div 
                        onClick={runOcrExtractor}
                        className="space-y-2 cursor-pointer text-zinc-400"
                      >
                        <FileText size={22} className="mx-auto text-zinc-405" />
                        <span className="text-[8.5px] font-bold uppercase tracking-wider text-zinc-350 block">Align Registry Certification Paper</span>
                      </div>
                    )}
                    
                    {/* Floating camera target square */}
                    <div className="absolute inset-5 border border-dashed border-white/20 rounded-lg"></div>
                  </div>

                  {/* Extracted fields preview data */}
                  {ocrExtractedData && (
                    <div className="bg-white border border-zinc-200 p-2.5 rounded-2xl space-y-1.5 font-sans shadow-xs">
                      <span className="text-[8px] font-mono font-bold uppercase text-zinc-400">OCR Extracted Data Preview</span>
                      
                      <div className="grid grid-cols-2 gap-2 text-[9px] text-[#0b1431]">
                        <div>
                          <span className="text-zinc-400 block text-[7.5px] font-mono">REGISTERED OWNER</span>
                          <span className="font-bold select-all">{ocrExtractedData.registeredOwner}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400 block text-[7.5px] font-mono">INSURANCE POLICY NO</span>
                          <span className="font-mono font-bold select-all">{ocrExtractedData.policyNumber}</span>
                        </div>
                        <div className="col-span-2 border-t border-zinc-100 pt-1 mt-0.5">
                          <span className="text-zinc-455">Policy Expiration Status: </span>
                          <span className="font-bold text-green-700">ACTIVE ({ocrExtractedData.expiryDate})</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentStep('camera_studio')}
                      className="flex-1 border border-zinc-205 bg-white py-2 rounded-xl text-[10px] font-bold uppercase tracking-wide cursor-pointer text-center"
                    >
                      Back
                    </button>
                    <button
                      disabled={!ocrExtractedData}
                      onClick={compileAICoPilotIntegrityAnalysis}
                      className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wide transition-colors text-center ${
                        ocrExtractedData ? 'bg-zinc-950 text-white hover:bg-zinc-800' : 'bg-zinc-250 text-zinc-400 cursor-not-allowed'
                      }`}
                    >
                      Verify AI
                    </button>
                  </div>
                </motion.div>
              )}

              {/* VIEW 1 - STEP 4: AI VALIDATION & VERIFICATION SCREEN */}
              {currentStep === 'ai_verification' && (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-3.5 text-left"
                >
                  <div className="space-y-0.5 flex justify-between items-end">
                    <div>
                      <span className="text-[8px] font-mono font-bold uppercase text-zinc-400">Step 4 of 5</span>
                      <h4 className="text-xs font-black text-zinc-950 tracking-tight">AI Co-Pilot Integrity Analysis</h4>
                    </div>
                    <span className="text-[8px] font-mono font-black text-blue-600 uppercase flex items-center gap-1 animate-pulse"><Sparkles size={8} /> calculation ready</span>
                  </div>

                  {calculatingAI ? (
                    <div className="py-12 text-center space-y-2">
                      <RefreshCw size={24} className="animate-spin text-blue-600 mx-auto" />
                      <p className="text-[10px] text-zinc-500 font-mono">Cross-checking global manufacturer ledger blocks...</p>
                    </div>
                  ) : aiReport ? (
                    <div className="space-y-2.5">
                      
                      {/* Risk meter indicator */}
                      <div className="bg-white border border-zinc-200/80 p-3 rounded-2xl shadow-xs space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[8px] font-mono text-zinc-440 uppercase font-black">AI Fraud Risk Score</span>
                          <span className={`text-[10px] font-black font-mono ${
                            aiReport.fraudScore > 50 ? 'text-rose-600' : 'text-emerald-600'
                          }`}>
                            {aiReport.fraudScore}% {aiReport.fraudScore > 50 ? 'HIGH THREAT_ALERT' : 'CLEARED'}
                          </span>
                        </div>
                        
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${
                              aiReport.fraudScore > 50 ? 'bg-rose-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${aiReport.fraudScore}%` }}
                          />
                        </div>
                      </div>

                      {/* Mileage Consistency Checklist rollback verification */}
                      <div className="bg-white border border-zinc-200/80 p-3 rounded-2xl shadow-xs space-y-1.5">
                        <span className="text-[8px] font-mono text-zinc-440 uppercase font-black block">Odometer Log Sequence Check</span>
                        
                        <div className="space-y-1.5">
                          {aiReport.historyLog.map((log, idx) => (
                            <div key={idx} className="flex justify-between text-[9px] border-b border-zinc-100 last:border-b-0 pb-1">
                              <span className="text-zinc-500 font-semibold">{log.year} - {log.source}</span>
                              <span className="font-mono text-zinc-900 font-bold">{log.mileage.toLocaleString()} kms</span>
                            </div>
                          ))}
                        </div>

                        {aiReport.mileageAnomalies ? (
                          <div className="flex items-start gap-1 text-[8.5px] text-red-700 bg-red-50 p-2 rounded-xl mt-1.5 border border-red-100 font-semibold font-sans">
                            <AlertTriangle size={11} className="shrink-0 mt-0.5" />
                            <span>
                              Odometer inconsistency detected! Current import mileage reads less than 2025 German factory inspection. Warning of cluster tamper.
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-[8px] text-green-700 font-bold pt-1">
                            <Check size={11} /> Consistency sequence check passed.
                          </div>
                        )}
                      </div>

                      {/* DB Mismatch indicators */}
                      <div className="bg-zinc-90 w-full p-2.5 rounded-2xl border border-zinc-200/80 bg-white shadow-xs text-[9px] flex justify-between items-center">
                        <span className="text-zinc-500 font-semibold font-sans">Manufacturer Factory Color:</span>
                        <span className={`font-mono font-bold ${aiReport.manufacturerDbMatch ? 'text-green-700' : 'text-red-600 bg-red-50 px-1 rounded'}`}>
                          {aiReport.manufacturerDbMatch ? '✅ MATCHED (Marina Bay Blue)' : '⚠️ MISMATCH: Factory spec state Chalk Grey'}
                        </span>
                      </div>

                    </div>
                  ) : null}

                  <div className="flex gap-2 font-mono pt-1">
                    <button
                      onClick={() => setCurrentStep('ocr_scan')}
                      className="flex-1 border border-zinc-205 bg-white py-2 rounded-xl text-[10px] font-bold uppercase tracking-wide cursor-pointer text-center"
                    >
                      Back
                    </button>
                    <button
                      disabled={calculatingAI}
                      onClick={() => setCurrentStep('submission')}
                      className="flex-1 bg-zinc-950 hover:bg-zinc-800 text-white py-2 rounded-xl text-[10px] font-bold uppercase tracking-wide cursor-pointer text-center"
                    >
                      Audit Stamps
                    </button>
                  </div>
                </motion.div>
              )}

              {/* VIEW 1 - STEP 5: RESULT SUBMISSION SCREEN */}
              {currentStep === 'submission' && (
                <motion.div
                  key="submission"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 text-left"
                >
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-mono font-bold uppercase text-zinc-400">Step 5 of 5</span>
                    <h4 className="text-xs font-black text-zinc-950 tracking-tight">Manual Clearance Stamps</h4>
                  </div>

                  {/* Co-Pilot logic alert */}
                  <div className="bg-blue-50 border border-blue-100 p-2.5 rounded-2xl flex items-start gap-2 text-[8.5px] text-blue-800 leading-normal font-sans">
                    <Landmark size={12} className="text-blue-600 shrink-0 mt-0.5 animate-pulse" />
                    <span>
                      ℹ️ <strong>HUMAN INTEGRITY SIGNATURE REQUIRED:</strong> Central logistics protocol never allows AI to issue final verdicts. Select verdict and seal now.
                    </span>
                  </div>

                  {/* Manual selector radios */}
                  <div className="space-y-2">
                    {[
                      { id: 'Approved' as const, label: 'Approve & Release Certificate', color: 'border-emerald-200 bg-emerald-50/10 text-emerald-800' },
                      { id: 'Rejected' as const, label: 'Reject Dossier (De-Registration)', color: 'border-rose-200 bg-rose-50/10 text-rose-800' },
                      { id: 'Flagged' as const, label: 'Flag & Escalate for Triage Review', color: 'border-amber-200 bg-amber-50/10 text-amber-800 animate-pulse' }
                    ].map(choice => (
                      <label 
                        key={choice.id}
                        className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${choice.color} ${
                          finalDecision === choice.id ? 'ring-2 ring-zinc-900 border-zinc-900 font-bold' : ''
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="final_decision" 
                          checked={finalDecision === choice.id}
                          onChange={() => setFinalDecision(choice.id)}
                          className="accent-zinc-950 shrink-0"
                        />
                        <span className="text-[10.5px] tracking-tight">{choice.label}</span>
                      </label>
                    ))}
                  </div>

                  {/* Notes textarea text area */}
                  <div className="space-y-1">
                    <label className="text-[8px] font-mono font-bold uppercase text-zinc-400">Inspector Certification Statements</label>
                    <textarea
                      placeholder="Add manual notes, compliance inspection remarks, physical findings..."
                      rows={2}
                      value={inspectorNotes}
                      onChange={e => setInspectorNotes(e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-2.5 py-1.5 text-[10.5px] outline-none focus:border-zinc-400"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentStep('ai_verification')}
                      className="flex-1 border border-zinc-205 bg-white py-2 rounded-xl text-[10px] font-bold uppercase tracking-wide cursor-pointer text-center"
                    >
                      Back
                    </button>
                    <button
                      onClick={dispatchDossierAndCommit}
                      className="flex-1 bg-zinc-950 hover:bg-zinc-805 text-white py-2 rounded-xl text-[10px] font-bold uppercase tracking-wide flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-95 transition-all text-center"
                    >
                      <FileSignature size={11} />
                      <span>Seal Digital DMV</span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* VIEW 1 - COMPLETE & CERTIFICATE SHOWCASE */}
              {currentStep === 'complete' && (
                <motion.div
                  key="complete"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="space-y-4 text-center my-auto"
                >
                  <div className="w-12 h-12 bg-zinc-90 border border-zinc-250 text-zinc-850 flex items-center justify-center rounded-full mx-auto shadow-xs">
                    <CheckCircle2 size={24} className="text-zinc-800" />
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-zinc-950 tracking-tight">Security Certificate Generated</h4>
                    <p className="text-[9.5px] text-zinc-500 max-w-[245px] mx-auto leading-relaxed">
                      Chassis files finalized cryptographically. Data sync webhooks initiated to central DMV and justcarsale.com profiles.
                    </p>
                  </div>

                  <div className="bg-white border border-zinc-200 p-3 rounded-2xl text-left space-y-1.5 font-sans shadow-xs">
                    <span className="text-[7.5px] font-mono font-bold text-zinc-400 uppercase tracking-widest block border-b border-zinc-100 pb-1">
                      State DMV Audit Stamp
                    </span>
                    <div className="text-[9px] text-[#0b1431] space-y-1">
                      <div>
                        <span className="text-zinc-400 block text-[7px] font-mono">CERTIFICATE ID SERIAL</span>
                        <span className="font-mono font-bold select-all text-blue-600 block">{generatedCertificateId}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 border-t border-zinc-100 pt-1">
                        <div>
                          <span className="text-zinc-400 block text-[7px] font-mono">DECISION OUTCOME</span>
                          <span className={`font-bold uppercase ${
                            finalDecision === 'Approved' ? 'text-emerald-700' : 'text-rose-600'
                          }`}>{finalDecision}</span>
                        </div>
                        <div>
                          <span className="text-zinc-400 block text-[7px] font-mono">SEAL TIME</span>
                          <span className="font-mono text-zinc-700 font-bold">9:41 AM (UTC)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleResetSimulator}
                    className="w-full bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl py-2.5 text-[9.5px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Scan next chassis lot
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Physical bottom Apple home bar sweep */}
          <div className="pt-2 shrink-0">
            <button 
              onClick={handleResetSimulator}
              className="w-20 h-1 bg-zinc-300 hover:bg-zinc-405 mx-auto rounded-full transition-colors block cursor-pointer"
              aria-label="phone home key"
            ></button>
          </div>

        </div>

      </div>
    </div>
  );
}

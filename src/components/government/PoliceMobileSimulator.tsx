import React, { useState } from 'react';
import { 
  Camera, Shield, AlertTriangle, CheckCircle, RefreshCw, Smartphone, 
  MapPin, Plus, FileText, Send, Zap, CornerDownRight, X, User
} from 'lucide-react';
import { VEHICLES } from '../../data';

interface PoliceMobileSimulatorProps {
  onCaseCreated?: () => void;
}

export default function PoliceMobileSimulator({ onCaseCreated }: PoliceMobileSimulatorProps) {
  const [scannedVin, setScannedVin] = useState('');
  const [scanning, setScanning] = useState(false);
  const [lookupResult, setLookupResult] = useState<any | null>(null);
  
  // Field Incident reporting state
  const [incidentTitle, setIncidentTitle] = useState('');
  const [incidentNotes, setIncidentNotes] = useState('');
  const [reportedBy, setReportedBy] = useState('Officer J. Miller (Badge #992)');
  const [captureStage, setCaptureStage] = useState<'scan' | 'lookup' | 'incident' | 'done'>('scan');

  const simulateCameraScan = () => {
    setScanning(true);
    setLookupResult(null);

    // Pick a high-risk VIN from data or general catalog
    const testVins = [
      'WAUB8AF21MN05XXXX', // Audi RS6 (High Risk, cloned)
      'SAJGV2RE8MA124850', // Range Rover (Stolen)
      'WBA53BJ0XPX881270', // BMW M5 (Clean)
    ];

    const chosenVin = testVins[Math.floor(Math.random() * testVins.length)];

    setTimeout(() => {
      setScannedVin(chosenVin);
      setScanning(false);
      setCaptureStage('lookup');
      
      // Perform database matchup
      const matchInMarketplace = VEHICLES.find(v => v.vin.toUpperCase() === chosenVin.toUpperCase());
      
      let status: 'Alert' | 'Warning' | 'Clean' = 'Clean';
      let reason = 'Vehicle matches active registration files. No warrants pending.';
      let score = 'Low';

      if (chosenVin === 'WAUB8AF21MN05XXXX') {
        status = 'Alert';
        reason = 'FEDERAL SEARCH WARRANT: Cloned chassis / duplicate registration detected under Nevada ring.';
        score = 'High';
      } else if (chosenVin === 'SAJGV2RE8MA124850') {
        status = 'Alert';
        reason = 'GTA STOLEN BULLETIN: Reported stolen in Miami beach area. Owner insurance verified claims active.';
        score = 'High';
      }

      setLookupResult({
        vin: chosenVin,
        status,
        reason,
        score,
        vehicleModel: matchInMarketplace ? `${matchInMarketplace.year} ${matchInMarketplace.make} ${matchInMarketplace.model}` : 'Unidentified Model (Foreign Transshipment)',
        lastLocation: matchInMarketplace ? matchInMarketplace.location : 'Port of Jacksonville Terminal #3'
      });
    }, 2200);
  };

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentTitle.trim()) return;

    // Simulate incident broadcasting
    alert(`Success: Secure Incident Report established for LEO file ${scannedVin}. Evidentiary chains synchronized.`);
    
    setCaptureStage('done');
    if (onCaseCreated) onCaseCreated();
  };

  const resetScanner = () => {
    setScannedVin('');
    setLookupResult(null);
    setIncidentTitle('');
    setIncidentNotes('');
    setCaptureStage('scan');
  };

  return (
    <div className="flex justify-center items-center py-6 animate-in fade-in duration-300 select-none">
      
      {/* Smartphone Device Frame */}
      <div className="w-[360px] h-[720px] bg-slate-900 rounded-[48px] border-[10px] border-slate-950 p-4 shadow-2xl relative overflow-hidden flex flex-col justify-between ring-1 ring-white/10">
        
        {/* Dynamic Island Speaker Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-950 rounded-2xl z-50 flex items-center justify-center">
          <div className="w-10 h-1 bg-slate-900 rounded-full"></div>
        </div>

        {/* Device Top Status bar */}
        <div className="pt-2 px-4 flex justify-between items-center text-[10px] font-mono font-bold text-slate-400 z-40 select-none">
          <span>9:41 AM</span>
          <div className="flex items-center gap-1.5 text-red-500 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
            <span>LEO NET SECURE</span>
          </div>
        </div>

        {/* Content Body of App inside Phone */}
        <div className="flex-1 overflow-y-auto mt-4 px-3 py-4 bg-[#f7f9fb] rounded-[32px] text-slate-800 flex flex-col justify-between border border-slate-200/60 shadow-inner">
          
          {/* Header Title inside Phone app */}
          <div className="pb-3 text-center border-b border-slate-200/50">
            <div className="flex items-center justify-center gap-1.5 text-red-655">
              <Shield size={14} className="fill-red-50" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest">CADS field scanner</span>
            </div>
            <h3 className="text-xs font-black font-display text-[#0b1431] mt-1">INCIDENT SCENE REPORTER</h3>
          </div>

          {/* MAIN SIMULATOR SCREENS */}
          <div className="flex-grow py-4 flex flex-col justify-center">
            
            {/* STAGE 1: INACTIVE OR ACTIVE SCANNING VIEW */}
            {captureStage === 'scan' && (
              <div className="space-y-6 text-center">
                {!scanning ? (
                  <div className="space-y-6">
                    {/* Simulated view grid focus finder */}
                    <div className="w-44 h-44 mx-auto border-2 border-dashed border-slate-300 rounded-3xl flex items-center justify-center relative bg-white hover:border-red-400 transition-colors shadow-xs">
                      <Camera size={34} className="text-slate-400" />
                      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-slate-400"></div>
                      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-slate-400"></div>
                      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-slate-400"></div>
                      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-slate-400"></div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-700">Align VIN within Viewport</p>
                      <p className="text-[10px] text-slate-500 max-w-[200px] mx-auto">Scans windshield code or stamped metal firewall rivets.</p>
                    </div>

                    <div className="px-4">
                      <button
                        type="button"
                        onClick={simulateCameraScan}
                        className="w-full bg-red-50 hover:bg-red-100 text-red-655 border border-red-200 py-3 rounded-2xl text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
                      >
                        <Zap size={14} className="animate-pulse animate-duration-1000" /> INITIATE FIELD SCAN
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-pulse text-center">
                    {/* Active Scan Laser sweep finder */}
                    <div className="w-44 h-44 mx-auto border-2 border-red-200 rounded-3xl flex items-center justify-center relative bg-red-50/10 overflow-hidden">
                      <div className="absolute inset-x-0 h-1.5 bg-red-500 top-1 animate-scan shadow-md shadow-red-400/50"></div>
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-200/25 via-transparent to-transparent opacity-40"></div>
                      <span className="text-[9px] font-mono text-red-655 uppercase tracking-widest absolute bottom-4">scanning...</span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-mono font-bold text-red-655">Locking Laser Focus...</p>
                      <p className="text-[10px] text-slate-500">Querying DMV watchlists &amp; stolen registers.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STAGE 2: LOOKUP RESULT WITH POLICE EMERGENCY FLASHER */}
            {captureStage === 'lookup' && lookupResult && (
              <div className="space-y-5 animate-in slide-in-from-bottom-6 duration-300 text-xs text-slate-700">
                
                {/* Warning Flash banner */}
                <div className={`p-3 rounded-2xl text-center border font-mono uppercase text-[10px] font-extrabold select-none ${
                  lookupResult.status === 'Alert' 
                    ? 'bg-red-50 border-red-150 text-red-650 animate-pulse animate-duration-1000'
                    : 'bg-emerald-50 border-emerald-150 text-emerald-700'
                }`}>
                  <div className="flex items-center justify-center gap-1.5">
                    <AlertTriangle size={14} />
                    <span>{lookupResult.status === 'Alert' ? 'CRIMINAL WATCHLIST HIT' : 'PASSED SCAN CHECK'}</span>
                  </div>
                </div>

                {/* Scanned metadata sheet */}
                <div className="bg-white p-4 border border-slate-205 rounded-2xl space-y-3.5 font-sans font-normal leading-normal shadow-xs">
                  <div className="border-b border-slate-100 pb-2">
                    <label className="text-[8px] font-mono text-slate-400 block uppercase">Detected 17-digit barcode</label>
                    <span className="text-xs font-mono font-bold text-[#0b1431] select-all tracking-wider">{lookupResult.vin}</span>
                  </div>
                  <div>
                    <label className="text-[8px] font-mono text-slate-405 block uppercase">Chassis Resolved Spec</label>
                    <span className="font-bold text-[#0b1431] leading-snug block">{lookupResult.vehicleModel}</span>
                  </div>
                  <div>
                    <label className="text-[8px] font-mono text-slate-405 block uppercase">DMV Diagnostics &amp; Status</label>
                    <p className="text-slate-600 text-[11px] leading-relaxed mt-0.5">{lookupResult.reason}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-mono">
                    <MapPin size={11} className="text-red-500 shrink-0" />
                    <span>Last Scan: {lookupResult.lastLocation}</span>
                  </div>
                </div>

                {/* Mobile actions flow */}
                <div className="flex flex-col gap-2 pt-2">
                  {lookupResult.status === 'Alert' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIncidentTitle(`On-Site Apprehension Alert: Stolen ${lookupResult.vehicleModel}`);
                        setCaptureStage('incident');
                      }}
                      className="w-full bg-red-50 hover:bg-red-100 text-red-655 border border-red-200 py-3 rounded-2xl font-mono font-bold text-[11px] flex justify-center items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Plus size={14} /> APPREHEND &amp; FILE INCIDENT
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={resetScanner}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-205 py-3 rounded-2xl font-mono font-bold text-[11px] transition-colors"
                    >
                      Scan Next Vehicle
                    </button>
                  )}
                  
                  <button
                    onClick={resetScanner}
                    className="w-full py-2 text-center text-slate-500 hover:text-slate-400 text-[11px] font-mono font-semibold"
                  >
                    Dismiss Scan
                  </button>
                </div>

              </div>
            )}

            {/* STAGE 3: INCIDENT RECORDING FORM */}
            {captureStage === 'incident' && (
              <form onSubmit={handleCreateIncident} className="space-y-4 text-xs font-semibold animate-in slide-in-from-right duration-200">
                <span className="text-[9px] font-mono text-red-400 uppercase tracking-widest block">Submit Case docket from Field</span>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-500 uppercase">Incident Title</label>
                  <input
                    required
                    placeholder="Wrecker order or stolen vehicle seizure"
                    className="w-full bg-[#020409] border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-red-900"
                    value={incidentTitle}
                    onChange={e => setIncidentTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-500 uppercase">Field Observations</label>
                  <textarea
                    required
                    placeholder="Provide condition of vehicle, odometer reading, or driver compliance details..."
                    rows={4}
                    className="w-full bg-[#020409] border border-slate-850 rounded-xl px-3 py-2 text-slate-200 outline-none focus:border-red-900"
                    value={incidentNotes}
                    onChange={e => setIncidentNotes(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-slate-500 uppercase">Reporting Officer Badge</label>
                  <input
                    required
                    placeholder="Badge ID"
                    className="w-full bg-[#020409] border border-slate-850 text-slate-500 rounded-xl px-3 py-2 font-mono"
                    value={reportedBy}
                    onChange={e => setReportedBy(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCaptureStage('lookup')}
                    className="w-1/2 py-2.5 text-center text-slate-500 hover:text-slate-400 font-semibold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-red-950 hover:bg-red-900 text-red-200 border border-red-850 py-2.5 rounded-xl font-mono font-bold text-[11px] flex justify-center items-center gap-1"
                  >
                    <Send size={12} /> FILE INCIDENT
                  </button>
                </div>
              </form>
            )}

            {/* STAGE 4: DONE CHECKMARK */}
            {captureStage === 'done' && (
              <div className="text-center space-y-6 animate-in zoom-in-95 duration-200">
                <div className="mx-auto w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center justify-center">
                  <CheckCircle size={32} />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-slate-200">Dossier Synced Successfully</h4>
                  <p className="text-[10px] text-slate-500 max-w-[210px] mx-auto leading-relaxed">
                    Terminal ID logged. Evidence chain registered globally on JustCarSale LEO database.
                  </p>
                </div>
                <div className="px-8 pt-3">
                  <button
                    onClick={resetScanner}
                    className="w-full bg-slate-800 hover:bg-slate-750 text-slate-300 py-2.5 rounded-xl font-mono font-bold text-[11px]"
                  >
                    Return to scanner
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Device Home Key indicator */}
          <div className="pt-2 select-none">
            <button 
              onClick={resetScanner}
              className="w-24 h-1 bg-slate-800 hover:bg-slate-650 mx-auto rounded-full transition-colors block"
            ></button>
          </div>

        </div>

      </div>
    </div>
  );
}
